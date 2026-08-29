# UI_SPEC — The Bridal Atelier

Implements `website_skill_pack/skills/05-frontend-ui`. Component hierarchy follows the skill's
required order: **primitives → form controls → feedback → navigation → content patterns →
composite sections → page templates.**

Every component below implements the mandatory state set where applicable:
`default · hover · focus-visible · active · disabled · loading · error · selected · responsive`.

## 1. Primitives — `src/components/primitives/`

| Component | Notes |
|---|---|
| `Container` | max-width 1280, responsive gutters, `narrow` variant at 800 for prose |
| `Section` | vertical rhythm + optional `tone` (`ivory`, `ivory-alt`, `espresso`, `blush`) + `id` anchor |
| `Eyebrow` | uppercase label, `--text-label`, gold-600, optional index number ("01") |
| `SectionHeading` | display serif h2/h3 with optional lead paragraph and action slot |
| `Button` | variants `primary` (espresso ground) · `secondary` (hairline outline) · `ghost` · `gold`; sizes `sm/md/lg`; `loading` renders a spinner and sets `aria-busy`; renders as `<button>`, `next/link`, or `<a>` without losing styling |
| `TextLink` | animated underline draw, `--dur-fast` |
| `Badge` | hairline pill; `tone` = `neutral · gold · success` |
| `Rule` | hairline divider, optional centred ornament |
| `Stat` | number + label, used only for structural facts |
| `Prose` | typographic defaults for policy pages |

**Button states:** primary = `espresso-900` → hover `espresso-800` + 1px lift; focus-visible =
2px `espresso-900` ring at 2px offset (3px gold ring on dark grounds); active = translate-y 0
and no shadow; disabled = `sand-400` ground, `stone-500` text, `cursor: not-allowed`,
`aria-disabled`; loading = spinner + label unchanged (never a width jump).

## 2. Form controls — `src/components/form/`

`Field` (label + hint + error + required marker) · `TextInput` · `TextArea` (with live counter)
· `Select` (native, styled chevron) · `CheckboxGroup` · `RadioCardGroup` · `DateInput` (native
`type="date"` with min/max) · `NumberInput` · `Honeypot` · `FormStatus` (`aria-live`) ·
`ErrorSummary` (linked list, focus target) · `StepProgress`.

Rules:

- Visible persistent `<label htmlFor>`; placeholders carry format examples only.
- Required fields marked in text (`Required`), never by colour or `*` alone.
- `aria-invalid` + `aria-describedby` wire the error message to the control.
- Error text sits **below** the control, in `danger-700`, prefixed by a 16px icon.
- Inputs are `44px` minimum height, `sand-400` border, `2px` focus ring, no inner shadow.
- Field groups use `<fieldset>` + `<legend>`; the legend is styled, not hidden.

## 3. Feedback — `src/components/feedback/`

`Alert` (`info · success · warning · danger`, `role="status"` or `role="alert"`) ·
`Spinner` (`role="status"`, visually hidden label) · `Skeleton` (shimmer disabled under
reduced-motion) · `EmptyState` (icon + reason + recovery action) · `ResultCard`
(availability outcome).

## 4. Navigation — `src/components/navigation/`

`SkipLink` · `SiteHeader` · `DesktopNav` · `MobileNavSheet` (focus trap, `Esc`, scroll lock,
`aria-modal`) · `MobileCtaBar` · `WhatsAppFloat` (hidden on mobile where the CTA bar already
carries it) · `Breadcrumbs` (with `BreadcrumbList` JSON-LD) · `SiteFooter`.

Footer contains: brand block + tagline, four link columns (Services · Packages · Studio ·
Legal), contact block with configured or placeholder channels, studio hours, the sample-content
disclosure line, and a copyright line. No newsletter form — nothing would receive it.

## 5. Content patterns — `src/components/content/`

| Component | Behaviour |
|---|---|
| `EditorialImage` | Wraps the image manifest. `next/image` for raster, plain `<img loading="lazy" decoding="async">` for SVG. Requires `alt`; `alt=""` only with explicit `decorative` prop. Fixed aspect box prevents CLS. |
| `Reveal` | IntersectionObserver, one-shot, opacity + 16px rise. No-ops under reduced-motion and renders visible without JS. |
| `Accordion` | Native `<details>`/`<summary>` for zero-JS resilience, restyled, with an animated marker |
| `FilterChips` | Roving-tabindex chip row, `aria-pressed`, horizontal scroll + edge fade on mobile |
| `BeforeAfterSlider` | `<input type="range">` as the control — keyboard accessible by construction, labelled, with a text fallback showing both images stacked when JS is off |
| `Marquee` | Instagram strip; scroll-snap, no autoplay |
| `Quote` | Testimonial block; renders the sample-content note when `sample` is set |
| `Timeline` | Journey stages; ordered list, numbers as `<span aria-hidden>` with real text labels |
| `ComparisonTable` | Real `<table>` with `<caption>` and `<th scope>`; swapped for stacked lists < 1024px |

## 6. Composite sections — `src/components/sections/`

`Hero` · `TrustStrip` · `JourneySection` · `ServicesOverview` · `PackagesSection` ·
`PortfolioPreview` · `PortfolioBrowser` (client, filtering) · `BeforeAfterSection` ·
`LooksSection` · `ArtistsSection` · `TestimonialsSection` · `AvailabilitySection` (client) ·
`ConsultationSection` (client) · `WhatsAppBand` · `InstagramSection` · `FaqSection` · `CtaBand`.

Each section takes its data as props from a content module — no component fetches or hard-codes
copy. This is what makes the CMS swap in `docs/ARCHITECTURE.md` §7 a data-layer change only.

## 7. Layout signatures (so the page does not look like a card wall)

Five distinct block rhythms, rotated deliberately:

1. **Editorial split** — 7/5 image + text, alternating side (Journey, Looks, About)
2. **Hairline list** — full-width rows separated by 1px rules, no boxes (Services)
3. **Three-column plinth** — packages; only the recommended one gets a filled ground
4. **Asymmetric grid** — portfolio; 2 columns mobile, 3 desktop with one 2-row feature tile
5. **Centred statement** — short, wide-margin type on ivory-100 (quotes, CTA bands)

Cards (a bordered box with padding) appear in exactly two places: packages and portfolio tiles.

## 8. Responsive rules per component

- `Hero`: stacked ≤ 640 · overlapped 768 · split 1024+ with the headline breaking out over the image
- `PackagesSection`: 1 col ≤ 767 · 1 col (wider) 768–1023 · 3 col 1024+
- `PortfolioBrowser`: 2 col ≤ 767 (no feature tile) · 2 col + feature 768 · 3 col 1280+
- `JourneySection`: vertical timeline ≤ 1023 · 5-across band 1024+
- `SiteFooter`: 1 col ≤ 639 · 2 col 640 · 4 col + brand block 1024+
- `ComparisonTable`: stacked definition lists ≤ 1023 · table 1024+
