# ARCHITECTURE — The Bridal Atelier

Implements `website_skill_pack/skills/06-frontend-engineering`, `07-backend-engineering`,
`08-database-architecture`, `09-api-engineering`.

## 1. Stack decisions

| Decision | Choice | Reason |
|---|---|---|
| Framework | Next.js 16.3.3 App Router | Already scaffolded; SSG + route handlers in one deployable |
| Rendering | Static by default; two dynamic route handlers | Content is build-time known; only form endpoints need a request |
| Styling | Tailwind v4 `@theme` tokens + a small `globals.css` layer | Tokens are the single source of truth; no config file to drift |
| Validation | Zod, one schema module shared by client and server | Removes duplicate rules; server never trusts the client |
| Forms | Hand-rolled `useValidatedForm` hook | ~2 KB instead of a form library; full control of a11y wiring |
| Motion | CSS + IntersectionObserver | Zero JS dependency; degrades to visible content |
| Icons | Inline SVG components | No icon-package weight |
| Tests | Vitest + Testing Library (unit/component), Playwright (E2E) | Matches the version-matched Next.js testing guide |
| State | React local state only | No cross-page client state exists |

Total added runtime dependencies: **one** (`zod`). Everything else is dev-only.

## 2. Directory layout

```
src/
  app/                     routes, metadata files, route handlers
  components/
    primitives/ form/ feedback/ navigation/ content/ sections/ icons/
  content/                 typed content modules (the CMS seam)
  lib/
    schemas/               zod schemas shared client+server
    repositories/          persistence interfaces + in-memory adapters
    availability.ts        deterministic availability rules
    rate-limit.ts          sliding-window limiter
    seo.ts  jsonld.ts      metadata + structured-data builders
    analytics.ts           vendor-neutral event emitter
    utils.ts  cn.ts
  config/
    site.ts                brand + contact config, env-driven
    env.ts                 env parsing and validation
  hooks/                   useValidatedForm, useReveal, useMediaQuery, useFocusTrap
  types/
scripts/generate-placeholder-art.mjs
tests/                     vitest unit + component tests
e2e/                       playwright specs
```

## 3. Data flow

```
src/content/*.ts  →  src/lib/repositories/*  →  Server Component  →  props  →  section component
```

Components never import content modules directly; pages resolve data through a repository so a
future database or CMS is a one-file swap. Repositories are `async` today even though the
in-memory data is synchronous — so the call sites do not change when a real datastore lands.

## 4. Routes

| Route | Rendering | Notes |
|---|---|---|
| `/` | static | 15 sections |
| `/about`, `/packages`, `/bridal-looks`, `/artists`, `/contact`, `/book`, `/privacy`, `/terms` | static | |
| `/services` | static | hub |
| `/services/[slug]` | static, `generateStaticParams` | 5 categories, `notFound()` otherwise |
| `/portfolio` | static | client filtering, no server round-trip |
| `/portfolio/[slug]` | static, `generateStaticParams` | 12 projects |
| `/artists/[slug]` | static, `generateStaticParams` | 3 artists |
| `/api/consultation` | dynamic `POST` | `force-dynamic`, no cache |
| `/api/availability` | dynamic `POST` | `force-dynamic`, no cache |
| `sitemap.ts`, `robots.ts`, `manifest.ts`, `opengraph-image.tsx`, `icon.tsx` | build-time | |

`params` is always awaited (Next 16 async request APIs). Typed with the generated
`PageProps<'/route'>` helpers where a route has params.

## 5. API contracts

### `POST /api/availability`

Request `{ weddingDate, city?, serviceType?, guestCount?, contactPreference? }`
Response `200 { status: 'available' | 'limited' | 'unavailable', message, allowsBooking, checkedDate }`
Errors `400 { error: 'validation_error', fields: Record<string,string> }` ·
`429 { error: 'rate_limited', retryAfterSeconds }` · `500 { error: 'server_error', requestId }`

### `POST /api/consultation`

Request the 11 brief fields + `honeypot`, `renderedAt`, `idempotencyKey`
Response `201 { reference, receivedAt }`
Errors `400 validation_error` · `409 { error: 'duplicate_submission', reference }` ·
`422 { error: 'rejected' }` (bot heuristics) · `429 rate_limited` · `500 server_error`

Cross-cutting rules (from `09-api-engineering`):

- Content type must be `application/json`; anything else is `415`.
- Body size is capped at 32 KB before parsing.
- Unknown fields are stripped by Zod, not rejected, so a client version skew degrades gracefully.
- Responses never include a stack trace. A `requestId` is returned so a log line can be correlated.
- Every response sets `Cache-Control: no-store`.
- Only `POST` is exported, so Next.js answers other verbs with `405` + `Allow`.

## 6. Availability rules (deterministic, documented, honest)

There is no booking system. Rather than random output, `lib/availability.ts` applies stated rules:

1. Dates in the past → `unavailable` ("that date has passed").
2. More than 24 months out → `available` with a note that the calendar is not open yet.
3. Peak wedding months (Nov, Dec, Jan, Feb) **and** a Saturday/Sunday → `limited`.
4. Everything else → `available`.

The UI always labels the result as *indicative, confirmed by a coordinator* — so the site never
asserts a booking fact it cannot know. The rule set is exported and unit-tested.

## 7. Persistence and CMS-readiness (`08-database-architecture`)

Entities and their natural keys, ready for a relational schema:

| Entity | Key | Notable constraints |
|---|---|---|
| `Service` | `slug` | FK → `ServiceCategory.slug`; `durationMinutes > 0` |
| `ServiceCategory` | `slug` | unique `order` |
| `Package` | `slug` | `startingInvestment >= 0`; one row may set `recommended` |
| `Artist` | `slug` | unique; `specialisms` non-empty |
| `PortfolioProject` | `slug` | FK → `Artist.slug`; `filters` many-to-many |
| `Testimonial` | `id` | `sample` boolean **not null** — provenance is a first-class column |
| `Faq` | `id` | unique `order` within `topic` |
| `ConsultationRequest` | `id` | unique `idempotencyKey`; indexed on `weddingDate`, `createdAt` |
| `AvailabilityCheck` | `id` | indexed on `weddingDate` |

Adapters shipped: `InMemoryConsultationRepository` (process-local, documented as
non-durable). Interfaces live in `lib/repositories/types.ts`. A migration story is described in
`docs/DEVOPS_SPEC.md` §5.

## 8. Error boundaries

`app/error.tsx` (segment-level, uses the Next 16 `retry` prop) · `app/global-error.tsx`
(own `<html>`/`<body>`) · `app/not-found.tsx` (branded 404 with three recovery routes) ·
`app/loading.tsx` (skeleton in brand tone). Route handlers catch, log a `requestId`, and return
a generic body.

## 9. Performance architecture

- Client components exist only where interaction requires them: `MobileNavSheet`,
  `PortfolioBrowser`, `AvailabilityForm`, `ConsultationForm`, `BeforeAfterSlider`, `Reveal`,
  `FilterChips`, `Marquee`. Everything else is a Server Component.
- No `useEffect` data fetching anywhere.
- Fonts: two families, `display: swap`, self-hosted, preloaded from the root layout.
- Images: fixed aspect ratios everywhere; hero art eager with `fetchPriority="high"`, all else lazy.
- No animation, carousel, date-picker, or icon library.
