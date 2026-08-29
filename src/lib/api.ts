/**
 * The HTTP contract shared by the route handlers and the form hook.
 *
 * Both sides import these types, so a change to the envelope is a compile error
 * on whichever side has not been updated — the alternative is a client that
 * quietly reads `body.errors` from a server that sends `body.error.fieldErrors`
 * and shows a bride an empty error summary.
 *
 * Every response is one of exactly two shapes: `{ ok: true, data }` or
 * `{ ok: false, error }`. There is no third "partial" case, because a form must
 * always land in a definite state — brief §34, *never silently fail*.
 */

export type ApiErrorCode =
  | 'invalid'
  | 'rate_limited'
  | 'rejected'
  | 'server_error'
  | 'network';

export interface ApiErrorBody {
  readonly code: ApiErrorCode;
  /** Written for the bride, not for a log. Rendered verbatim in the UI. */
  readonly message: string;
  /** Keyed by field name; only present for `invalid`. */
  readonly fieldErrors?: Readonly<Record<string, string>>;
  readonly retryAfterSeconds?: number;
  /** Correlates the visible failure with one server log line. */
  readonly requestId?: string;
}

export type ApiResponse<T> =
  | { readonly ok: true; readonly data: T }
  | { readonly ok: false; readonly error: ApiErrorBody };

/**
 * Headers every API response carries.
 *
 * `no-store` because these responses are personal and must never be cached by a
 * CDN or a browser. `X-Robots-Tag` because an API path that somehow gets linked
 * must not be indexed even when the site is indexable (docs/SEO_SPEC.md §7).
 */
export const API_HEADERS: Readonly<Record<string, string>> = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  'X-Robots-Tag': 'noindex, nofollow',
  'X-Content-Type-Options': 'nosniff',
  Vary: 'Origin',
};

export function apiOk<T>(data: T, status = 200, extraHeaders?: Record<string, string>): Response {
  return new Response(JSON.stringify({ ok: true, data } satisfies ApiResponse<T>), {
    status,
    headers: { ...API_HEADERS, ...extraHeaders },
  });
}

export function apiError(
  status: number,
  error: ApiErrorBody,
  extraHeaders?: Record<string, string>,
): Response {
  return new Response(JSON.stringify({ ok: false, error } satisfies ApiResponse<never>), {
    status,
    headers: { ...API_HEADERS, ...extraHeaders },
  });
}

/* ── Payload types ───────────────────────────────────────────────────────── */

export interface ConsultationSuccess {
  readonly reference: string;
  readonly receivedAt: string;
  /** True when this key had already been accepted — a retry, not a new enquiry. */
  readonly duplicate: boolean;
  readonly nextStep: string;
}

/** The availability response mirrors `AvailabilityResult` minus internals. */
export interface AvailabilitySuccess {
  readonly status: 'available' | 'limited' | 'unavailable';
  readonly headline: string;
  readonly detail: string;
  readonly nextStep: string;
  readonly formattedDate: string;
  readonly leadTimeDays: number;
  readonly isPeakSeason: boolean;
  readonly isWeekend: boolean;
  readonly basis: string;
}
