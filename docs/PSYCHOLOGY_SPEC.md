# PSYCHOLOGY_SPEC — The Bridal Atelier

Implements `website_skill_pack/skills/04-human-psychology`. Its hard boundary governs this
document: **never invent proof**, and never use pressure that would embarrass the brand if the
visitor understood it.

## 1. First viewport — the four questions

| Question | Answered by |
|---|---|
| Where am I? | Wordmark + "Bridal Atelier · Est. studio" and the tagline in display serif |
| What is this? | Sub-headline naming the service explicitly: bridal hair, makeup and skin for the wedding week |
| Is it for me? | "For the bride you've always imagined." + a wedding-date field, which frames the visitor as a bride with a date |
| What do I do next? | Two visible actions: **Book Bridal Consultation** (primary) and **Check Your Wedding Date** (low commitment) |

All four are readable without scrolling at 360 × 640.

## 2. Trust architecture

Trust is built from things that are true about the offer, not from claims about reputation.

| Signal | Why it is legitimate |
|---|---|
| Named artists with specialisms | Named individuals with defined roles — an offer fact |
| The five-stage journey | The process the studio commits to |
| A trial before the wedding day | A structural part of every package |
| Written wedding-morning timeline | A deliverable |
| Explicit starting investment | Price transparency |
| Clear cancellation/rescheduling language on `/terms` | Reduces perceived risk |
| Plain statement of what is *not* offered | Honesty signal |

**Not used:** review star ratings, "as seen in", client counts, years-in-business, awards,
follower counts, "trusted by X brides", countdown timers, "3 slots left", fake live-booking
notifications.

## 3. Cognitive load management

- One decision per section. The page never asks the visitor to compare more than three things at once.
- Packages: three options, middle recommended. The recommendation is labelled as the studio's
  recommendation ("Most chosen for a two-day wedding"), not as a popularity statistic.
- The services list is chunked into 5 named categories rather than one 34-item list.
- Portfolio filters are additive chips with a visible clear action, so the visitor can never get stuck in an empty result with no exit.
- The consultation form is split into three steps of 3–5 fields. Progress is visible and reversible.

## 4. Commitment ladder

```
Read  →  Check a date (0 fields of personal data required beyond date+city)
      →  Save/see a package
      →  WhatsApp or call (immediate, low formality)
      →  Consultation request (11 fields, 3 steps)
```

The low-commitment ask is placed *before* the high-commitment ask on every page that has both.

## 5. Anxiety reduction at the point of submission

Bridal booking anxiety is specific: *"what happens after I press this?"*

The submit step states, before the button:

- what will happen (a consultation call is scheduled),
- who will reply (a studio coordinator),
- and that no payment is taken at this stage.

On success the panel restates the same three facts plus the reference id, so the visitor has
something concrete to hold. No date or time is promised — the studio cannot honour a promise a
demo site invents.

## 6. Loss aversion — used honestly

Wedding dates are genuinely finite. The availability checker states real scarcity structurally
("peak season dates are limited") without inventing a specific remaining count for a specific
date. The result is derived from a deterministic, documented rule set — see
`docs/ARCHITECTURE.md` §6 — and the UI labels it as an indicative check that a coordinator
confirms.

## 7. Ethical boundaries applied

| Pattern | Decision |
|---|---|
| Fake urgency / countdowns | REJECTED |
| Confirmshaming ("No thanks, I'll look basic") | REJECTED |
| Pre-ticked marketing consent | REJECTED — consent is opt-in and unticked |
| Hidden pricing to force contact | REJECTED — starting investment is published |
| Fabricated testimonials presented as real | REJECTED — sample content is flagged and carries no review schema |
| Difficult-to-close modals | REJECTED — no interstitial modals at all |
| Exit-intent popups | REJECTED |
