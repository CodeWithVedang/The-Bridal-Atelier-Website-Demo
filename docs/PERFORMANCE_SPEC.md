# PERFORMANCE_SPEC — The Bridal Atelier

Implements `website_skill_pack/skills/13-performance`. Hard rule inherited: **never fabricate
performance scores.** No Lighthouse number appears in this repository unless it was measured, and
measured numbers live only in `docs/QA_REPORT.md` with the command that produced them.

## 1. Budgets (targets, set before building)

| Metric | Budget | How it is defended |
|---|---|---|
| LCP | ≤ 2.0 s | Static HTML, hero art preloaded and `fetchPriority="high"`, no client-side data fetch |
| CLS | ≤ 0.02 | Every image has explicit `width`/`height` or a fixed aspect box; header height fixed; fonts have metric-adjusted fallbacks |
| INP | ≤ 150 ms | Almost no client JS; the heaviest interaction is an array filter over 12 items |
| First-load JS (shared) | ≤ 120 KB gzip | One runtime dependency; eight client components total |
| Per-route JS | ≤ 30 KB gzip beyond shared | Client boundaries are leaves, not layouts |
| Requests on `/` | ≤ 30 | Self-hosted fonts, inline SVG icons, no third-party origin |
| Fonts | 2 families | Cormorant Garamond + DM Sans, `latin` subset only |

## 2. Rendering strategy

Every page is statically rendered at build time. The only dynamic code paths are the two route
handlers (`force-dynamic`, `no-store`). There is **no request-time work on any page**, so TTFB is
the CDN's, not the framework's.

## 3. JavaScript discipline

Client components, and the reason each one must be:

| Component | Why client |
|---|---|
| `MobileNavSheet` | focus trap, `Esc`, scroll lock |
| `PortfolioBrowser` + `FilterChips` | filter state, roving tabindex |
| `AvailabilityForm`, `ConsultationForm` | validation + fetch |
| `BeforeAfterSlider` | range input state |
| `Reveal` | IntersectionObserver |
| `Marquee` | scroll-snap affordances |
| `Analytics` bridge | registers the no-op sink |

Everything else — all 17 sections, every primitive, every page shell — is a Server Component and
ships zero JS. `'use client'` is never placed on a layout or a page, only on leaves, so a client
boundary never drags a subtree into the bundle.

No animation library, no carousel, no date picker, no icon package, no form library, no state
library, no `lodash`, no `date-fns`. Date formatting uses `Intl.DateTimeFormat`.

## 4. CSS

Tailwind v4 with `@theme` tokens; the generated stylesheet contains only classes actually used.
One custom layer for: `.sr-only`, focus-ring utilities, the reveal keyframes, the accordion marker,
and the underline-draw. No CSS-in-JS, no runtime style computation.

## 5. Images

- All art is generated SVG in `public/atelier/`, palette-locked, typically 2–8 KB each.
- `EditorialImage` renders `next/image` for raster sources and a plain
  `<img loading="lazy" decoding="async">` for SVG — routing SVG through the optimiser would add a
  transform for no gain and is disabled in `next.config.ts` (`dangerouslyAllowSVG` stays off).
- Hero art: `priority`, `fetchPriority="high"`, `loading="eager"`. Everything else lazy.
- Every image sits in a fixed-aspect wrapper, so the layout is stable before bytes arrive.
- `next.config.ts` sets `images.formats: ['image/avif', 'image/webp']` and explicit
  `deviceSizes`/`imageSizes` matching the six breakpoints, so no oversized variant is generated.

## 6. Fonts

`next/font/google` self-hosts both families at build time — **no request reaches Google at
runtime**, which is both a privacy property (`docs/SECURITY_SPEC.md` §7) and a render-blocking
saving. `display: 'swap'`, `preload: true`, `subsets: ['latin']`, explicit `fallback` stacks with
`adjustFontFallback` left on so the fallback's metrics are matched and the swap does not shift text.
Cormorant Garamond is not a variable font, so weights are enumerated (300/400/500/600 + italic) —
only those actually used.

## 7. Third-party weight

Zero. No tag manager, no chat widget, no map iframe (the contact page ships a static map
*placeholder* with a link out, precisely so that no third-party frame is loaded), no Instagram
embed (the strip is local art with outbound links), no font CDN, no analytics beacon.

## 8. Caching and delivery

Static assets carry Next's default immutable hashed-filename caching. `public/atelier/*` is served
with a long `max-age` via a `headers()` rule. Both API routes set `Cache-Control: no-store`.
HTML is CDN-cacheable because nothing in it varies per request.

## 9. Measurement method (results in `docs/QA_REPORT.md`)

```bash
npm run build
```

The build output's per-route First Load JS table is the recorded bundle evidence. Anything not
produced by a command that was actually run is marked UNKNOWN rather than estimated.
