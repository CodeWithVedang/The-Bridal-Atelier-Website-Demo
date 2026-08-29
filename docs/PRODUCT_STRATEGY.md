# PRODUCT_STRATEGY — The Bridal Atelier

## 1. Positioning

> An atelier, not a parlour. One bride at a time, one look designed for her face — planned months in advance and executed to a timetable.

The differentiator claimed on the site is **process**, not superlatives. Process claims are verifiable by the site's own content (a documented five-stage journey, a trial before the wedding, a written timeline). Superlative claims ("best", "award-winning", "1000+ brides") are **not** used, because there is no evidence to support them — `11-content-copy` forbids inventing proof.

## 2. Value proposition ladder

| Level | Statement |
|---|---|
| Functional | Bridal hair, makeup, skin and grooming for the wedding week, done on schedule. |
| Experiential | A private studio, a named artist, a trial, and a written minute-by-minute plan. |
| Identity | You look like the most considered version of yourself — not like a different person. |

## 3. Jobs to be done

1. *"I need to know my date is free before I fall in love with a salon."* → Wedding-date availability check, above the fold on Home.
2. *"I need to see brides who look like me."* → Portfolio filterable by 8 real dimensions (ceremony, look, skin tone, region, etc.).
3. *"I need to know what this costs before I enquire."* → Three packages with visible starting investment and inclusions.
4. *"I need to trust the person, not the brand."* → Named artists with specialisms and their own portfolio slices.
5. *"I need this to be easy at 11pm on my phone."* → Mobile sticky CTA bar, WhatsApp, tap-to-call, and a 3-step consultation form.

## 4. Objection map → on-site answer

| Objection | Where it is answered |
|---|---|
| "Will I look overdone?" | Bridal Looks section (4 named looks incl. "Minimal Luxe"), Journey stage 03 (trial) |
| "Is my date even available?" | Availability checker (Home + Contact + Book) |
| "What does it actually cost?" | Packages page, starting investment per package, "what changes the price" explainer |
| "Who will actually do my makeup?" | Artists section — named artist assignment is part of the package |
| "Will they be late?" | Journey stage 04 — written wedding-morning timeline |
| "Do they travel?" | Packages (Atelier Experience includes travel), Contact page |
| "Products on my skin?" | Services → Skin & Prep, product philosophy stated plainly |

## 5. Success criteria (product, not marketing)

| Metric | Definition | Instrumented as |
|---|---|---|
| Consultation completion rate | `consultation_submitted / consultation_started` | `analytics` events |
| Availability check rate | `availability_checked / page_view(home)` | `analytics` events |
| Package comparison depth | packages viewed before submit | `package_viewed` |
| Portfolio engagement | filter interactions per session | `portfolio_filtered` |
| Contact-channel split | WhatsApp vs call vs form | `cta_clicked` with `channel` |

No target numbers are asserted. There is no historical data for this fictional brand; inventing baselines is forbidden by `01-product-strategy` and `16-analytics`.

## 6. Scope

**In scope**

- 14 routes (Home, About, Services hub + 5 categories, Packages, Portfolio + detail, Bridal Looks, Artists, Contact, Book, Privacy, Terms, 404)
- 2 API endpoints (consultation request, availability check)
- Full metadata + structured data + sitemap + robots
- WCAG 2.2 AA implementation with documented manual verification
- Unit/component tests (Vitest) and E2E specs (Playwright)

**Explicitly out of scope**

- Payments, deposits, invoicing
- Real CMS/database wiring (interfaces are provided; adapters are not)
- Authentication / admin dashboard (no admin surface is shipped, so none can be left unprotected)
- Email/SMS delivery (submission handler is a documented seam)
- Instagram Graph API (brief §18 says do not connect an external API unless required)
- Multi-language (structure supports it; no translations exist)

## 7. Content inventory ownership

| Content type | Source | Editable at |
|---|---|---|
| Services (5 categories, 34 services) | Brief §8 | `src/content/services.ts` |
| Packages (3) | Brief §9 | `src/content/packages.ts` |
| Portfolio (12 projects, 8 filters) | Authored to brief §10 | `src/content/portfolio.ts` |
| Bridal looks (4) | Brief §12 | `src/content/looks.ts` |
| Artists (3) | Brief §13 | `src/content/artists.ts` |
| Testimonials | Brief §14 — flagged `sample: true` | `src/content/testimonials.ts` |
| FAQs | Authored from the objection map | `src/content/faqs.ts` |
| Journey (5 stages) | Brief §7 | `src/content/journey.ts` |

## 8. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Fictional testimonials read as real customer proof | High | `sample: true` flag, no `Review`/`AggregateRating` schema, visible disclosure line in the footer |
| A fictional local business gets indexed | High | `noindex` by default via `NEXT_PUBLIC_SITE_INDEXABLE` |
| Generated art mistaken for the real design intent | Medium | Documented image manifest + `EditorialImage` seam; art is abstract, never a fake photograph |
| Placeholder phone number dialled by a visitor | Medium | Placeholder is non-dialable text (`+00 00000 00000`) and CTAs are disabled until configured |
