# CONTENT_SPEC — The Bridal Atelier

Implements `website_skill_pack/skills/10-content-strategy`. Every string on the site is authored
here or in `src/content/*.ts`. No `Lorem ipsum`, no filler paragraphs, no AI-tell phrasing.

## 1. Voice rules enforced during writing

- Second person, present tense. "Your trial happens six weeks out", not "Trials are conducted".
- Concrete nouns over adjectives: *veil, timeline, trial, patch test, touch-up kit* — not
  *stunning, flawless, breathtaking*.
- No exclamation marks. No "elevate", "unleash", "transform your look", "journey of a lifetime".
- No sentence that begins "In today's world" or "Whether you're…".
- Sentences average under 18 words. Paragraphs are 2–4 sentences.
- Numbers appear only when they are structural facts of the offer (5 stages, 3 artists,
  6 weeks before the wedding, 4 hours of bridal-morning coverage). Never as social proof.
- British-neutral Indian English: *jewellery*, *colour*, *specialise*, ₹ for investment.

## 2. Content modules and ownership

| Module | Exports | Rows | Consumed by |
|---|---|---|---|
| `content/site-copy.ts` | hero, trust strip, CTA bands, WhatsApp band, disclosure lines | — | Home, layout |
| `content/journey.ts` | `journeyStages` | 5 | Home, About |
| `content/services.ts` | `serviceCategories`, `services` | 5 / 34 | Services hub + 5 category pages |
| `content/packages.ts` | `packages`, `investmentFactors`, `comparisonRows` | 3 / 6 / 9 | Packages, Home |
| `content/portfolio.ts` | `portfolioProjects`, `portfolioFilters` | 12 / 8 dimensions | Portfolio, detail pages |
| `content/looks.ts` | `bridalLooks` | 4 | Bridal Looks, category cross-links |
| `content/artists.ts` | `artists` | 3 | Artists, artist detail, portfolio credit |
| `content/testimonials.ts` | `testimonials` | 6, every row `sample: true` | Home, Packages |
| `content/faqs.ts` | `faqs` | 12 across 4 topics | Packages, Book, Contact |
| `content/before-after.ts` | `beforeAfterPairs` | 3 | Home |
| `content/instagram.ts` | `instagramTiles` | 8, `external: false` | Home |
| `content/images.ts` | `images` manifest | ~40 | `EditorialImage` only |
| `content/legal.ts` | privacy + terms sections | — | `/privacy`, `/terms` |

Each module exports `as const satisfies readonly T[]`, so a typo in a slug is a build error
rather than a runtime blank.

## 3. Canonical hero copy (brief §6)

```
Eyebrow      BRIDAL ATELIER · BY APPOINTMENT
Headline     For the bride you've always imagined.
Sub-headline Bridal hair, makeup and skin, planned across your whole wedding week —
             by a small team of named artists who stay with you from trial to send-off.
Primary CTA  Book Bridal Consultation
Secondary    Check Your Wedding Date
Support line No payment is taken to enquire. A coordinator replies with the next available slots.
```

The sub-headline is the "what is this" answer and names the service explicitly (see
`docs/PSYCHOLOGY_SPEC.md` §1). It is 26 words — the one place the 18-word average is exceeded,
deliberately, because the first viewport has to carry the whole offer.

## 4. Trust strip — four structural facts only

`Named artists, not a rotating team` · `A trial before every wedding booking` ·
`A written wedding-morning timeline` · `Starting investment published, per package`

Each is verifiable from elsewhere on the site. Nothing here is a claim about reputation.

## 5. The five journey stages (brief §7)

| # | Stage | Promise stated in copy |
|---|---|---|
| 01 | Consultation | A 45-minute conversation about the wedding, not a sales call |
| 02 | Bridal Trial | Full look tested six weeks out, photographed in daylight and evening light |
| 03 | The Plan | A written timeline for every function, with call times and travel |
| 04 | Wedding Week | Skin and hair prep sessions in the run-up, on a fixed schedule |
| 05 | The Day | Your named artist on site, with touch-ups through the ceremony |

## 6. Services taxonomy (brief §8)

Five categories, 34 services. Every service row carries `name`, `summary`, `durationMinutes`,
`category`, and optional `prepNote`. No prices on individual services — pricing lives at package
level so the page never reads like a discount menu (brief §9).

1. **Bridal Makeup** — 8 services (bridal day makeup, engagement, reception, mehendi, sangeet,
   airbrush, HD, bridesmaid).
2. **Bridal Hair** — 7 (bridal updo, open waves, braid work, veil and dupatta setting,
   accessory placement, reception restyle, bridesmaid hair).
3. **Skin & Prep** — 7 (consultation and patch test, hydration facial, brightening course,
   pre-wedding peel, body prep, under-eye care, day-before calm).
4. **Hair Care & Treatments** — 6 (scalp assessment, strengthening course, gloss, smoothing,
   trim and shape, pre-wedding conditioning).
5. **Grooming & Add-ons** — 6 (brow shaping, lash work, nails, draping, touch-up kit,
   second-artist add-on).

## 7. Packages (brief §9)

| Package | Positioning line | Starting investment |
|---|---|---|
| The Essential Bride | One day, one look, done properly | published in `content/packages.ts` |
| The Signature Bride | Most chosen for a two-day wedding | published |
| The Atelier Experience | The full wedding week, two artists on site | published |

The middle package is labelled **"Most chosen for a two-day wedding"** — a statement about fit,
not a popularity statistic (`docs/PSYCHOLOGY_SPEC.md` §3). The brief's "Most Popular" label is
implemented as this fit-based wording because the studio is fictional and has no booking history
to count. Recorded in `docs/DECISION_LOG.md`.

Each package lists: what is included, what is not, how many functions, artist count, trial
policy, travel policy.

## 8. Testimonials — provenance is part of the content

Six testimonials, each with `sample: true`, a first name + city, and the package referenced.
Rendered with a visible note: *"Sample content — this studio is a demonstration brand."*
No star ratings, no `Review` or `AggregateRating` JSON-LD (`docs/SEO_SPEC.md` §6).

## 9. Placeholder copy for unconfigured channels

When `NEXT_PUBLIC_WHATSAPP_NUMBER` / `NEXT_PUBLIC_PHONE` are unset, the CTA renders disabled with
the text *"WhatsApp not configured for this demo"* and a `title` explaining which env var sets it.
No fabricated number is ever printed (brief §17, §23).

## 10. Legal pages

`/privacy` states exactly what the two endpoints collect, that data is held in memory only for the
lifetime of the process, that nothing is shared with a third party, and that no analytics vendor
is connected. `/terms` covers consultation requests, trials, cancellation and rescheduling in
plain language. Both carry a "last reviewed" date sourced from a constant, not `Date.now()`.
