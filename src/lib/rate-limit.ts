import 'server-only';

import { createHash, randomBytes } from 'node:crypto';

/**
 * Fixed-window rate limiting (docs/SECURITY_SPEC.md §3).
 *
 * Be clear about what this is and is not. It is a per-process, in-memory
 * counter. It stops a single client hammering an endpoint from one address, and
 * that is the abuse this build can actually experience. It does **not** survive
 * a restart and it does **not** coordinate across instances, so on a serverless
 * platform each instance limits independently. The upgrade path — a shared store
 * keyed the same way — is written up in docs/DEVOPS_SPEC.md §6, and the honest
 * statement of the limitation is in docs/SECURITY_SPEC.md §8.
 *
 * Identity is a salted hash of the caller's address, never the address itself:
 *
 *  - Only the **first** hop of `x-forwarded-for` is used. Later hops are
 *    attacker-controlled, so trusting them would let one client mint unlimited
 *    identities by prepending values.
 *  - The salt is `randomBytes(32)` generated once per process. The digest is
 *    therefore not reversible by brute-forcing the (small) IPv4 space, and it
 *    cannot be correlated across restarts or across instances.
 *  - The digest is truncated to 16 bytes, which is far more than enough to avoid
 *    collisions between buckets and less than enough to be useful as a fingerprint.
 */

const SALT = randomBytes(32);

export function identify(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  const first = forwarded?.split(',')[0]?.trim();
  const candidate = first && first.length > 0 ? first : headers.get('x-real-ip')?.trim();
  // No address at all (a direct local request) still gets a bucket, so a local
  // caller is limited too rather than being exempt by accident.
  const subject = candidate && candidate.length > 0 ? candidate : 'unknown';
  return createHash('sha256').update(SALT).update(subject).digest('hex').slice(0, 32);
}

interface Window {
  count: number;
  resetAt: number;
}

export interface RateLimitRule {
  /** Requests permitted per window. */
  readonly limit: number;
  /** Window length in milliseconds. */
  readonly windowMs: number;
}

export interface RateLimitResult {
  readonly ok: boolean;
  readonly limit: number;
  readonly remaining: number;
  /** Seconds until the window resets. Sent as `Retry-After` on a 429. */
  readonly retryAfterSeconds: number;
}

/** Per-endpoint budgets. Tight enough to matter, loose enough that a bride
 *  correcting a typo three times in a row never sees a 429. */
export const RATE_LIMITS = {
  availability: { limit: 10, windowMs: 60_000 },
  consultation: { limit: 5, windowMs: 600_000 },
} as const satisfies Record<string, RateLimitRule>;

export type RateLimitBucket = keyof typeof RATE_LIMITS;

const windows = new Map<string, Window>();

/**
 * Evict expired windows. Called on each check, bounded to a small slice so a
 * burst never turns into an O(n) sweep on the request path — and so the map
 * cannot grow without limit on a long-lived process.
 */
function sweep(now: number): void {
  if (windows.size < 512) return;
  let examined = 0;
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
    if ((examined += 1) >= 256) break;
  }
}

export function checkRateLimit(bucket: RateLimitBucket, subject: string): RateLimitResult {
  const rule = RATE_LIMITS[bucket];
  const now = Date.now();
  sweep(now);

  const key = `${bucket}:${subject}`;
  const existing = windows.get(key);

  if (!existing || existing.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + rule.windowMs });
    return {
      ok: true,
      limit: rule.limit,
      remaining: rule.limit - 1,
      retryAfterSeconds: Math.ceil(rule.windowMs / 1000),
    };
  }

  existing.count += 1;
  const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));

  if (existing.count > rule.limit) {
    return { ok: false, limit: rule.limit, remaining: 0, retryAfterSeconds };
  }

  return {
    ok: true,
    limit: rule.limit,
    remaining: rule.limit - existing.count,
    retryAfterSeconds,
  };
}

/** Test-only reset. Not exported through any barrel. */
export function __resetRateLimits(): void {
  windows.clear();
}
