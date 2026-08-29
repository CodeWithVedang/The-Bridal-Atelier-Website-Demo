# UX_SPEC — The Bridal Atelier

Implements `website_skill_pack/skills/03-ux-design`.

## 1. Information architecture

```
/                     Home — full narrative, every conversion present
/about                Studio story, philosophy, artists, studio facts
/services             Hub — 5 categories
  /services/bridal-makeup
  /services/bridal-hair
  /services/skin-and-prep
  /services/hair-care-and-treatments
  /services/grooming-and-add-ons
/packages             3 packages + what changes the price + FAQ
/portfolio            Filterable grid (8 filter dimensions)
  /portfolio/[slug]   Project detail — look breakdown, artist, related
/bridal-looks         4 signature looks
/artists              3 artists
/book                 Consultation request (3 steps) + availability check
/contact              Channels, studio info, availability check, map placeholder
/privacy  /terms      Policy pages
404 / error / loading  Global states
```

Depth is never more than 2 clicks from Home to any conversion.

## 2. Navigation model

| Breakpoint | Pattern |
|---|---|
| < 1024px | Logo left, hamburger right. Full-height sheet menu, focus-trapped, `Esc` to close, body scroll locked. Sticky bottom CTA bar: **Book Consultation** + **WhatsApp**. |
| ≥ 1024px | Horizontal nav, hairline underline on hover/current, single primary CTA button on the right. Header becomes opaque with a bottom hairline after 24px of scroll. |

- Current page carries `aria-current="page"`.
- A `Skip to content` link is the first focusable element.
- The mobile sticky bar reserves space with `padding-bottom` on `<main>` so it never covers content.
- Header height is fixed (72px mobile / 88px desktop) to avoid layout shift.

## 3. Page-by-page section order

**Home** — Hero → trust strip (4 structural facts) → Bridal Journey (01–05) → Services overview (5) → Packages (3) → Portfolio preview (6 + link) → Before/After → Bridal Looks (4) → Artists (3) → Testimonials → Availability check → Consultation form → WhatsApp band → Instagram strip → Footer.

Ordering rationale: the four first-viewport questions are answered before any ask; proof
(portfolio, before/after, artists) precedes the two forms; the low-commitment ask
(availability) precedes the high-commitment ask (consultation).

**Services hub** — intro → 5 category blocks with service counts → cross-link to Packages.
**Category page** — heading, what it covers, service list with duration, prep notes, related look, CTA.
**Packages** — intro → 3 packages (middle flagged *Most Popular*) → comparison table (desktop) / stacked lists (mobile) → what changes the investment → FAQ → CTA.
**Portfolio** — filter row (8 dimensions, chips) → responsive masonry-ish grid → empty state → detail pages.
**Book** — 3 steps: 1 About the wedding · 2 About you · 3 What you're looking for. Progress is shown, steps are reversible, nothing is lost on back-navigation.

## 4. Complete state matrix

Required by `03-ux-design`. Every interactive surface implements all applicable states.

| Surface | Initial / loading | Populated | Empty | Partial | Success | Validation error | Recoverable error | Fatal |
|---|---|---|---|---|---|---|---|---|
| Availability check | Idle form; button shows spinner + "Checking…" | Result card: available / limited / booked | — | — | Green result + "Continue to consultation" | Inline field errors, focus moves to first error | Retry button, form values preserved | Falls to `error.tsx` |
| Consultation form | Empty step 1, all labels visible | Filled steps retained across back/next | — | Step 1 done, step 2 pending → progress reflects it | Full-panel confirmation with a reference id + next steps | Per-field messages + summary list, `aria-live="assertive"` | Banner: what failed, what to do, "your details were not lost" | `error.tsx` |
| Portfolio grid | Static (build-time data) | Grid of projects | "No brides match these filters yet." + Clear filters | — | — | — | — | — |
| Portfolio detail | — | Project | — | — | — | — | — | `not-found.tsx` for unknown slug |
| Accordion (FAQ) | All collapsed | One or many open | — | — | — | — | — | — |
| Before/After | Slider at 50% | Dragged | — | — | — | — | — | — |
| WhatsApp / Call CTA | Disabled + explanatory note when unconfigured | Enabled link | — | — | — | — | — | — |
| Route transition | `loading.tsx` skeleton in brand tone | — | — | — | — | — | — | — |

Rules honoured: **no placeholder-only labels** — every input has a persistent visible
`<label>`; placeholders only show format examples. **Never silently fail** — every request has
a success and a failure surface, and failure states say what happened, what to do next, and
whether the data was kept.

## 5. Forms

**Consultation request (11 fields, brief §16)**

| Field | Type | Required | Validation |
|---|---|---|---|
| Full name | text | ✔ | 2–80 chars |
| Phone | tel | ✔ | 7–20 chars, digits/space/`+`/`-`/`()` |
| Email | email | ✔ | RFC-ish, ≤ 160 chars |
| Wedding date | date | ✔ | valid, today → +3 years |
| Wedding city / venue | text | ✔ | 2–120 chars |
| Bridal service needed | multi-select checkbox group | ✔ (≥1) | from 5 known categories |
| Package interested in | radio | — | one of 3 or "not sure yet" |
| Number of people | number | — | 1–40 |
| Preferred consultation slot | select | ✔ | weekday/weekend × morning/afternoon/evening |
| How did you hear about us | select | — | fixed list incl. "Prefer not to say" |
| Notes / vision | textarea | — | ≤ 1200 chars |

Plus: honeypot field (visually hidden, not `display:none`), a render-timestamp for
minimum-fill-time, and a client-generated idempotency key.

**Availability check (5 fields, brief §15):** wedding date (required), city, service type,
number of people, contact preference.

Validation strategy: the **same Zod schema** runs in the browser and on the server
(`07-backend-engineering`: *never trust client-side checks*). Client validation fires on blur
and on submit, never on first keystroke. Errors are announced, focus moves to the first
invalid control, and the submit button is disabled only while a request is in flight —
never as a way to hide validation.

## 6. Mobile-first specifics (brief §40 — *do not simply scale desktop down*)

- Hero is a portrait composition with the headline **under** the image on ≤ 640px, beside it from 1024px.
- Packages become a vertical stack with the "Most Popular" card first-in-DOM on mobile, centre on desktop.
- The comparison table is replaced by per-package lists on mobile — no horizontal scroll.
- Portfolio filters become a horizontally scrollable chip row with a visible edge fade.
- Journey stages are a vertical timeline on mobile and a 5-column band on desktop.
- All tap targets ≥ 44 × 44px with ≥ 8px separation.
- Forms use `inputMode`, `autoComplete`, and `enterKeyHint` so mobile keyboards behave.

## 7. Breakpoints

`360` (small phone) · `640` (large phone) · `768` (tablet portrait) · `1024` (tablet landscape / small laptop) · `1280` (desktop) · `1536` (large desktop). Content max-width `1280px`, gutters `20px → 40px → 64px`.
