# ANALYTICS_SPEC — The Bridal Atelier

Implements `website_skill_pack/skills/15-analytics-measurement`. Hard rule inherited: **never
fabricate analytics data.** This document defines an event contract; it reports no numbers,
because no data has been collected.

## 1. Posture

No analytics vendor is connected (brief §18 — do not connect an external API unless required). What
ships is a **vendor-neutral emitter** so that adding a real vendor later is a single file change and
so the event taxonomy is designed now rather than retro-fitted.

`src/lib/analytics.ts`:

```ts
type AnalyticsEvent = { name: EventName; props?: Record<string, string | number | boolean> }
let sink: ((e: AnalyticsEvent) => void) | null = null
export function registerSink(fn) { sink = fn }
export function track(name, props?) { sink?.({ name, props }) }
```

With no sink registered, `track()` is a no-op: **no network request, no cookie, no localStorage
write, no `window` global.** Calling it from a Server Component is safe because it does nothing
environment-specific.

## 2. Event taxonomy

`snake_case` names, past-tense verbs, one event per meaningful outcome.

| Event | Fires when | Props |
|---|---|---|
| `cta_clicked` | any primary/secondary CTA activated | `channel` (`consultation` \| `availability` \| `whatsapp` \| `phone` \| `packages` \| `portfolio`), `location` (section id) |
| `availability_checked` | availability response received | `status`, `month`, `is_weekend` |
| `consultation_started` | first field of step 1 changed | `entry_route` |
| `consultation_step_completed` | step 1 or 2 validated and advanced | `step` |
| `consultation_submitted` | `201` received | `package_interest`, `service_count`, `lead_time_days` |
| `consultation_failed` | non-2xx received | `code` |
| `package_viewed` | a package block enters the viewport once | `package_slug` |
| `portfolio_filtered` | filter set changes | `dimensions_active`, `result_count` |
| `portfolio_project_opened` | detail route entered | `project_slug` |
| `faq_opened` | accordion opened | `question_id` |
| `nav_opened` | mobile sheet opened | — |

## 3. What is deliberately not captured

No PII. Names, phone numbers, email addresses, city text, venue text, and the free-text notes field
are **never** passed to `track()`. `lead_time_days` is a derived integer, not the wedding date, so
even the coarse date cannot be reconstructed from an event. There is no user id, no session id, no
cross-page identifier, and no `document.referrer` capture.

## 4. Success metrics the events would answer

Stated as questions, with no target numbers invented (`14-security`/`15-analytics` both forbid
presenting a made-up baseline as a goal):

1. What share of visitors who check a date go on to submit a consultation request?
2. Which entry route produces the highest consultation completion rate?
3. Where does the three-step form lose people — step 1→2 or 2→3?
4. Which package draws the most interest, and does it match the recommended one?
5. Which portfolio filter dimensions are actually used, and which are dead weight?
6. How often is a low-commitment CTA (availability, WhatsApp) used before the high-commitment one?

Baselines and targets must be set from the first 30 days of real traffic. Until then they are
recorded as UNKNOWN.

## 5. Wiring a real vendor later

Register a sink once, in a client component mounted from the root layout:

```tsx
'use client'
registerSink((e) => window.plausible?.(e.name, { props: e.props }))
```

Nothing else in the codebase changes. Before doing so, the consent posture must be revisited —
`/privacy` currently states plainly that no analytics vendor is connected, and that sentence would
become false. This is flagged in `docs/DECISION_LOG.md`.

## 6. Server-side observability

Both route handlers log one structured line per request:
`{ requestId, route, status, durationMs, outcome }` — no body, no headers, no IP, no env values.
That is sufficient to answer "are submissions failing" without becoming a shadow analytics store.
