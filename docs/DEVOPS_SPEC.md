# DEVOPS_SPEC — The Bridal Atelier

Implements `website_skill_pack/skills/17-devops-deployment`. No deployment has been performed, so
nothing here reports a live environment — it specifies one.

## 1. Runtime targets

| Item | Value |
|---|---|
| Node | 22 LTS or 24 LTS (`engines` documented in `README.md`) |
| Package manager | npm (lockfile committed) |
| Build | `next build` (Turbopack, the default in this version) |
| Output | static HTML for 22 route entries + 2 Node route handlers |
| Host assumption | any Node host or Vercel; **no Edge runtime is used anywhere** |

Nothing in the codebase is host-specific. There is no `vercel.json`/`vercel.ts`, no adapter, and no
platform SDK, so the same build runs behind a plain `next start`.

## 2. Commands

```bash
npm run dev          # next dev
npm run build        # next build
npm run start        # next start
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm run test         # vitest run
npm run test:watch   # vitest
npm run e2e          # playwright test
npm run art          # regenerate public/atelier/* deterministically
```

## 3. Environment variables

| Variable | Scope | Default | Effect if unset |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | client | `http://localhost:3000` | canonicals and OG URLs point at localhost |
| `NEXT_PUBLIC_SITE_INDEXABLE` | client | `false` | site emits `noindex` and `robots.txt` disallows all |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | client | unset | WhatsApp CTAs render disabled with an explanatory note |
| `NEXT_PUBLIC_PHONE` | client | unset | call CTAs render disabled with an explanatory note |
| `NEXT_PUBLIC_EMAIL` | client | unset | email link hidden, form remains the contact path |
| `NEXT_PUBLIC_STUDIO_ADDRESS` | client | unset | address block and `LocalBusiness.address` omitted |
| `NEXT_PUBLIC_INSTAGRAM_URL` | client | unset | Instagram strip renders without outbound links |
| `CONSULTATION_WEBHOOK_URL` | **server only** | unset | requests are stored in memory only; the value is read but never called in this build |

Parsed once by `src/config/env.ts` with Zod and exported frozen. An invalid value fails the build
rather than degrading silently. `.env.example` is committed; `.env*` is gitignored by the scaffold.

## 4. Pre-deploy gate

All five must pass, in order:

1. `npm run lint` — zero errors, zero warnings.
2. `npm run typecheck` — zero errors.
3. `npm run test` — all green.
4. `npm run build` — zero errors; per-route First Load JS reviewed against the budgets in
   `docs/PERFORMANCE_SPEC.md` §1.
5. `npm run e2e` against `next start` — all green.

Recorded results: `docs/QA_REPORT.md`.

## 5. Migration path to a real datastore

The repository interfaces in `src/lib/repositories/types.ts` are the seam. To move off memory:

1. Create the schema from the entity table in `docs/ARCHITECTURE.md` §7 — the natural keys,
   constraints and indexes are already specified there.
2. Add e.g. `PostgresConsultationRepository implements ConsultationRepository`.
3. Change the one factory function in `src/lib/repositories/index.ts`.
4. Nothing in `app/` or `components/` changes: call sites are already `async` and already resolve
   content through a repository rather than importing `src/content/*` directly.

The same applies to a headless CMS: implement the read-side repositories against its client and
delete nothing else. Content shapes in `src/content/` are the contract a CMS model must satisfy.

## 6. Rate-limit hardening

`src/lib/rate-limit.ts` is per-process. On more than one instance the effective limit multiplies by
the instance count. Before real traffic: back it with a shared store (Redis/Upstash) behind the
same `checkRateLimit(key, rule)` signature, or move the check to the platform's own firewall/WAF
rules. Listed as an accepted risk in `docs/AUDIT_REPORT.md`.

## 7. CSP nonce upgrade path

Current policy allows `'unsafe-inline'` for `script-src` (reasoning and residual-risk analysis in
`docs/SECURITY_SPEC.md` §6). To tighten it:

1. Add a `proxy.ts` (this version's rename of `middleware.ts`, Node runtime only) that generates a
   nonce per request and sets both the `Content-Security-Policy` header and an `x-nonce` header.
2. Read the nonce in the root layout via `await headers()` and pass it to the JSON-LD `<script>`.
3. Accept that every page becomes dynamically rendered — the reason this is not the default here.

Do this only if a third-party script is ever introduced, since removing `'unsafe-inline'` is what
makes a nonce worth the loss of static rendering.

## 8. Observability

Structured single-line logs from both route handlers (`{ requestId, route, status, durationMs,
outcome }`) — no bodies, no headers, no IPs. `requestId` is returned in every 5xx body so a user
report maps to a log line. No error-tracking vendor is wired; adding one is a single `catch`
callback in `src/lib/log.ts`.

## 9. Not implemented, deliberately

No CI workflow file (no repository was requested or initialised — see
`docs/PROJECT_CONTEXT.md`), no Dockerfile, no IaC, no preview-environment config, no cron. The
pre-deploy gate in §4 is written so it can be pasted into any CI runner unchanged.
