# ACCESSIBILITY_SPEC — The Bridal Atelier

Implements `website_skill_pack/skills/12-accessibility`. Target: **WCAG 2.2 Level AA**.

The skill's hard rule: **never claim compliance without testing.** So this document separates
*what is implemented* from *what has been verified and how* — see §8, and `docs/QA_REPORT.md` for
the executed results.

## 1. Perceivable

- **Contrast** — every text pairing is computed by hand with the WCAG relative-luminance formula
  and recorded with its ratio in `docs/BRAND_SYSTEM.md` §2. One candidate colour was rejected for
  failing 1.4.11. Body text is ≥ 9.7:1; the weakest text pairing in use is 4.78:1.
- **Non-text contrast (1.4.11)** — input borders (`sand-400` on ivory), focus rings, chip outlines
  and the before/after slider thumb all clear 3:1. Hairline dividers are decorative and exempt,
  but never carry meaning alone.
- **Text alternatives** — `EditorialImage` requires `alt`; `alt=""` is only reachable through an
  explicit `decorative` prop, so an empty alt is always a decision, never an omission.
  Generated art gets descriptive alt text written per asset in `content/images.ts`.
- **Reflow (1.4.10)** — no horizontal scroll at 320 px width / 400 % zoom. The only intentionally
  scrollable strips (filter chips, Instagram row) are horizontal by design and keyboard-reachable.
- **Text spacing (1.4.12)** — no fixed heights on text containers; line-height 1.65 on body.
- **Colour is never the only channel** — required fields say "Required" in text; errors carry an
  icon and text; the recommended package is labelled in words, not only by its filled ground.

## 2. Operable

- **Keyboard** — every interactive element is a native `button`, `a`, `input`, `select`,
  `textarea`, `details/summary`, or `input[type=range]`. There are no `div` click handlers, so tab
  order and activation semantics are correct by construction.
- **Focus visible (2.4.7)** — a 2 px `espresso-900` ring at 2 px offset on light grounds, 3 px
  `gold-500` on dark grounds. `:focus-visible` only, so mouse users do not see rings, and the
  outline is never set to `none` without a replacement.
- **Focus not obscured (2.4.11, new in 2.2)** — the sticky header uses `scroll-margin-top` on all
  anchor targets and headings; the mobile CTA bar reserves space with `padding-bottom` on `<main>`
  so it cannot cover a focused control.
- **Target size (2.5.8, new in 2.2)** — every control is ≥ 24 × 24 px and every primary tap target
  is ≥ 44 × 44 px with ≥ 8 px separation.
- **Dragging movements (2.5.7, new in 2.2)** — the before/after comparison is a
  `<input type="range">`, so it is fully operable without a drag gesture.
- **Consistent help (3.2.6, new in 2.2)** — the WhatsApp/phone contact block appears in the same
  place in the footer on every page, and the header CTA is in the same position throughout.
- **Redundant entry (3.3.7, new in 2.2)** — the multi-step consultation form retains all values
  across back/next; nothing is asked twice.
- **Accessible authentication (3.3.8)** — not applicable; there is no login.
- **Skip link** — first focusable element, visible on focus, targets `#main`.
- **No keyboard trap** — the mobile sheet traps focus *while open* (correct, it is a modal) and
  restores focus to the trigger on close; `Esc` closes it.
- **Motion** — every animation is gated behind `@media (prefers-reduced-motion: no-preference)` or
  disabled inside `reduce`. No parallax, no autoplay, nothing that moves for more than 5 seconds.

## 3. Understandable

- `<html lang="en-IN">`.
- Labels are visible and persistent. Placeholders only show format examples, never the label.
- Error messages say what is wrong and how to fix it: *"Enter a wedding date on or after today."*
  not *"Invalid input."*
- `ErrorSummary` is a linked list at the top of the form, focused on failed submit, with
  `aria-live="assertive"` for the count and per-field links that move focus to the control.
- `aria-invalid="true"` plus `aria-describedby` pointing at the error node, on the control itself.
- Success and failure states are announced through a `FormStatus` region with
  `role="status"` (polite) for success and `role="alert"` for failure.
- Navigation, headings and CTA wording are identical across pages for the same destination.

## 4. Robust

- Valid, nested, semantic HTML. One `h1`. Landmarks: `header`, `nav`, `main`, `footer`, plus
  `section aria-labelledby` for each page section so a screen-reader rotor lists them meaningfully.
- Lists are real `ul`/`ol`/`dl`. The comparison table is a real `<table>` with `<caption>` and
  `<th scope>`, replaced by definition lists below 1024 px rather than being made scrollable.
- ARIA is used only where a native element cannot express the state: `aria-pressed` on filter
  chips, `aria-current="page"` on nav links, `aria-modal`/`role="dialog"` on the mobile sheet,
  `aria-busy` on loading buttons, `aria-expanded` on the hamburger.
- No `aria-hidden` on anything focusable. Decorative SVGs carry `aria-hidden="true"` and
  `focusable="false"`.

## 5. Forms — the full a11y contract

```
<Field>
  <label for=id>            visible, persistent
  <span id=hintId>          hint / format example
  <input id=id
         aria-describedby="hintId errorId"
         aria-invalid={hasError}
         required={isRequired}
         autoComplete / inputMode / enterKeyHint>
  <p id=errorId role="alert"> icon + message, below the control
```

Field groups (services checkboxes, package radios) use `<fieldset>` with a **styled, visible**
`<legend>`; the group's error is wired via `aria-describedby` on the fieldset.

## 6. Screen-reader-only utility

A single `.sr-only` class (clip-rect technique, not `display:none`) with a `.sr-only-focusable`
variant for the skip link. Used for: spinner labels, "opens in a new tab" hints, the numeric
prefixes on journey stages, and table captions that are visually redundant.

## 7. Known limitations, stated honestly

- Generated abstract art cannot convey a photograph's information. Alt text describes the artwork
  and its role, not a bride — this is correct, but a real deployment with photography must rewrite
  the alt strings in `content/images.ts`.
- No automated screen-reader test exists in CI; verification is manual and recorded in
  `docs/QA_REPORT.md`.

## 8. Verification plan (results in `docs/QA_REPORT.md`)

1. Keyboard-only walk of every route and every form path.
2. Zero-JS render check (JS disabled) for nav, accordion, before/after, and form labels.
3. Reduced-motion check.
4. 320 px reflow and 400 % zoom check.
5. Contrast re-computation for every declared pairing, by formula, in a unit test.
6. Axe-style structural assertions in component tests: label association, `aria-invalid`
   wiring, one `h1`, landmark presence, focus restoration after closing the mobile sheet.
