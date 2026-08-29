# BRAND_SYSTEM — The Bridal Atelier

Implements `website_skill_pack/skills/02-brand-identity`. Rule inherited from that skill:
**accessibility and legibility outrank aesthetic novelty.** Every text pairing below was
computed by hand (WCAG 2.x relative-luminance formula) and is recorded with its ratio.

## 1. Brand personality → design consequence

| Trait | Consequence |
|---|---|
| Luxurious | Space, not ornament. Large empty margins. One accent metal, used sparingly. |
| Editorial | Asymmetric image/text pairs; oversized serif display; hairline rules instead of cards. |
| Warm | Ivory ground rather than white; brown-black text rather than pure black. |
| Feminine (not girlish) | Achieved through serif contrast, curve and drape — **not** through pink. |
| Trustworthy | Predictable layout rhythm, plain language, visible process, no urgency tricks. |
| Personal | Named artists, first-person copy in artist bios, "your" phrasing. |

### Anti-patterns actively avoided (brief §5 + `02-brand-identity`)

Excessive pink · generic multi-stop gradients · gold everywhere · a card for every idea ·
drop shadows as decoration · animation as personality · glassmorphism · emoji ·
faux-luxury script fonts · centre-aligned everything.

## 2. Colour tokens

Declared in `src/app/globals.css` under `@theme`. Tailwind utility names follow from the token name.

| Token | Hex | Role |
|---|---|---|
| `--color-ivory-50` | `#FDFBF7` | Page ground |
| `--color-ivory-100` | `#F8F4EC` | Alternating section ground |
| `--color-ivory-200` | `#F1EADE` | Inset panels, table zebra |
| `--color-sand-300` | `#E4D9C8` | Hairline borders, dividers |
| `--color-sand-400` | `#D2C3AC` | Input borders, stronger rules |
| `--color-espresso-900` | `#2A211C` | Primary text, primary button ground |
| `--color-espresso-800` | `#3A2E27` | Primary button hover ground |
| `--color-espresso-700` | `#4E4038` | Body copy on ivory |
| `--color-stone-500` | `#7A6A5F` | Muted / meta text |
| `--color-gold-600` | `#8A6D33` | Gold **text** and icons |
| `--color-gold-500` | `#A9884E` | Gold rules, focus accents, non-text graphics |
| `--color-gold-200` | `#E8D9BC` | Gold wash fills |
| `--color-blush-100` | `#F3E7E3` | One optional soft ground; used at most once per page |
| `--color-success-700` | `#3F6B4F` | Availability confirmed, form success |
| `--color-danger-700` | `#8E3A2E` | Validation and failure states |

### Verified contrast ratios (against `--color-ivory-50` unless stated)

| Pair | Ratio | Verdict |
|---|---|---|
| `espresso-900` on `ivory-50` | **15.08 : 1** | AAA — headings, body |
| `espresso-700` on `ivory-50` | **9.71 : 1** | AAA — body copy |
| `stone-500` on `ivory-50` | **5.09 : 1** | AA — meta text ≥ 14px |
| `gold-600` on `ivory-50` | **4.78 : 1** | AA — gold text allowed at body size |
| `gold-500` on `ivory-50` | **3.23 : 1** | AA large text / **non-text contrast only** |
| `ivory-50` on `espresso-900` | **15.08 : 1** | AAA — primary button |
| `danger-700` on `ivory-50` | **6.18 : 1** | AA — error text |
| `success-700` on `ivory-50` | **5.11 : 1** | AA — success text |

**REJECTED:** `#B08D57` (the "classic champagne" first considered) measures **2.89 : 1** on
ivory — below the 3:1 non-text minimum of WCAG 2.2 SC 1.4.11. Replaced by `gold-500`.

`gold-500` is never used for body text. Where the design wants gold lettering, `gold-600` is used.

## 3. Typography tokens

| Token | Family | Loaded by |
|---|---|---|
| `--font-display` | Cormorant Garamond (300/400/500/600 + italic) | `next/font/google`, `display: swap`, subset `latin` |
| `--font-body` | DM Sans (variable) | `next/font/google`, `display: swap`, subset `latin` |

Both are self-hosted by `next/font` — **no requests reach Google at runtime** (privacy, and
`13-performance` render-blocking budget). Fallback stacks are declared so a font-download
failure degrades rather than breaks.

### Type scale (fluid, `clamp()`)

| Token | Min → Max | Use |
|---|---|---|
| `--text-display-xl` | 2.75rem → 5.5rem | Hero headline only |
| `--text-display-lg` | 2.25rem → 3.75rem | Page titles |
| `--text-display-md` | 1.75rem → 2.5rem | Section headings |
| `--text-display-sm` | 1.375rem → 1.75rem | Card / block headings |
| `--text-body-lg` | 1.0625rem → 1.1875rem | Lead paragraphs |
| `--text-body-md` | 1rem | Default body |
| `--text-body-sm` | 0.9375rem | Secondary text |
| `--text-label` | 0.75rem | Uppercase eyebrow, `0.18em` tracking |

Rules: display uses `line-height: 1.05–1.15` and `letter-spacing: -0.01em`; body uses `1.65`.
Measure is capped at `68ch` for prose, `46ch` for lead-ins. Never more than two type sizes in
one visual block.

## 4. Spacing, radius, elevation

`--space-1: 4px` … `--space-32: 128px` on a 4px base; section rhythm uses
`--space-20` (80px) mobile → `--space-32` (128px) desktop.

Radius: `--radius-xs 1px`, `--radius-sm 2px`, `--radius-md 4px`, `--radius-lg 10px`, `--radius-full 999px`.
Buttons use `--radius-sm`; images use `0`; the only `--radius-full` uses are the WhatsApp
button and filter chips.

Elevation is used for *lifted* surfaces only (mobile sheet, sticky bar):
`--shadow-sm 0 1px 2px rgba(42,33,28,.05)`, `--shadow-md 0 10px 30px -18px rgba(42,33,28,.14)`,
`--shadow-lg 0 30px 70px -34px rgba(42,33,28,.22)`. Content blocks use hairlines, not shadows.

## 5. Motion tokens

| Token | Value |
|---|---|
| `--ease-editorial` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--dur-fast` | `180ms` |
| `--dur-base` | `320ms` |
| `--dur-slow` | `620ms` |

Permitted motion: opacity + ≤ 20px translate on first reveal; underline draw on link hover;
1.03 image scale over 620ms on hover; height transition on accordion.
Forbidden: parallax, entrance animation on every element, looping motion, scroll-jacking,
carousel autoplay, spring bounce.

All of it collapses to zero under `@media (prefers-reduced-motion: reduce)`.

## 6. Iconography

Inline SVG only, 1.25px stroke, `currentColor`, 20/24px box, rounded caps. No icon library
dependency. Icons never carry meaning alone — always paired with text or `aria-label`.

## 7. Imagery system (no photography available — ASSUMPTION, reversible)

There is no licensed bridal photography for a fictional brand, and brief §38 forbids
unrelated generic stock. So the site ships **abstract editorial art**, generated
deterministically by `scripts/generate-placeholder-art.mjs` into `public/atelier/`.

- Families: `veil`, `drape`, `arch`, `rosette`, `filigree`, `portrait`, `texture`.
- Palette-locked to the tokens above; duotone gradients plus an `feTurbulence` grain.
- Seeded from the asset id, so output is stable across runs and diffs stay clean.
- Every asset is declared once in `src/content/images.ts` with `width`, `height`, `alt`, `family`.
- `<EditorialImage>` renders `next/image` for raster sources and a plain `<img>` for SVG.

**To swap in real photography:** drop files into `public/atelier/`, change the `src` (and
`width`/`height`) in `src/content/images.ts`. No component changes are required. Art is
deliberately abstract so it can never be mistaken for a real photograph of a real bride.

## 8. Voice

Second person, present tense, short sentences. Concrete nouns (veil, timeline, trial) over
adjectives (stunning, flawless). No exclamation marks. No "elevate your look". Numbers only
where they are structural facts of the offer (hours, artists, stages), never as social proof.
