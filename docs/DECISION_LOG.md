# DECISION_LOG — The Bridal Atelier

Every decision where the brief, a skill, or a plausible alternative pulled a different way. Status
labels follow the skill pack's vocabulary: CONFIRMED · INFERRED · ASSUMPTION · PLACEHOLDER ·
APPROVED · REJECTED.

## D1 · Colour system overrides the brief's suggested palette — partially

The brief suggested "muted champagne/gold accents" and explicitly permitted overriding it:
*"Do NOT blindly follow these colors if the existing branding/design skills recommend a better
system."* The first champagne candidate, `#B08D57`, measures **2.89 : 1** on ivory — below the
3 : 1 non-text minimum of WCAG 2.2 SC 1.4.11. `02-brand-identity` states accessibility outranks
aesthetic novelty.

**Decision:** keep the warm ivory / espresso / champagne *direction*, replace the specific hue with
two tokens — `gold-500 #A9884E` (3.23 : 1, graphics and rules only) and `gold-600 #8A6D33`
(4.78 : 1, the only gold used for text). `#B08D57` → **REJECTED**.

## D2 · "Most Popular" becomes a fit statement

Brief §9 labels the middle package *Most Popular*. The studio is fictional and has no booking
history, so "most popular" would be fabricated evidence — forbidden by `04-human-psychology` and
`15-analytics-measurement`.

**Decision:** the label reads **"Most chosen for a two-day wedding"** — a statement about which
wedding shape the package fits, which is an offer fact. Visual emphasis (filled ground, centre
position, first-in-DOM on mobile) is unchanged, so the brief's intent — guide the visitor to the
middle option — is fully served. **APPROVED**, deviation documented.

## D3 · Testimonials ship as flagged sample content

No real client has used a fictional studio. Removing testimonials entirely would fail brief §14;
presenting invented ones as real would fabricate proof.

**Decision:** six testimonials with `sample: true` on every row, a visible note on the block, a
footer disclosure line, and **no `Review`/`AggregateRating` JSON-LD** so no search engine ingests
them as real reviews. **ASSUMPTION** — replace the rows and delete the flag when real quotes exist.

## D4 · Default to `noindex`

Indexing a fictional bridal studio with a fictional address would put misleading local-business
data into search results.

**Decision:** `NEXT_PUBLIC_SITE_INDEXABLE` defaults to `false`; all SEO machinery is nonetheless
implemented and correct. One env var flips the site to indexable. **ASSUMPTION**, reversible.

## D5 · Generated abstract art instead of stock photography

Brief §38 forbids unrelated generic stock imagery; no licensed bridal photography exists for a
fictional brand.

**Decision:** `scripts/generate-placeholder-art.mjs` produces deterministic, palette-locked SVG
editorial art in seven families. It is deliberately **abstract**, so it can never be mistaken for a
photograph of a real bride. All art is declared once in `src/content/images.ts`; swapping in real
photography is a change to that one file. **PLACEHOLDER**, swap path documented in
`docs/BRAND_SYSTEM.md` §7.

## D6 · Availability is rule-based, never random

A demo could return a random status. That would assert a booking fact the site cannot know.

**Decision:** four stated, unit-tested rules (`docs/ARCHITECTURE.md` §6), and the UI always labels
the result as indicative pending coordinator confirmation. **APPROVED.**

## D7 · Contact details stay non-dialable placeholders

Brief §17 and §23 forbid inventing contact information.

**Decision:** phone/WhatsApp/email/address come from env vars with **no defaults**. Unset →
the CTA renders **disabled** with a visible note naming the variable that enables it. A fake number
is never printed, and a disabled control with an explanation is a real UX state, not a dead end.
**PLACEHOLDER.**

## D8 · CSP allows `'unsafe-inline'` for scripts

A nonce CSP requires a per-request `proxy`, which forces every page out of static rendering.

**Decision:** ship the strict directives that cost nothing (`object-src 'none'`, `base-uri 'self'`,
`form-action 'self'`, `frame-ancestors 'none'`, HSTS, `nosniff`, Referrer-Policy,
Permissions-Policy) and accept `'unsafe-inline'` on `script-src`, with the residual-risk analysis in
`docs/SECURITY_SPEC.md` §6 and the upgrade path in `docs/DEVOPS_SPEC.md` §7. **APPROVED as an
accepted risk** — reconsider the moment a third-party script is introduced.

## D9 · One runtime dependency

react-hook-form + a resolver, framer-motion, an icon package, a date library and a carousel would
each be defensible in isolation and would together cost more than the entire page budget.

**Decision:** `zod` only. Forms use a hand-rolled `useValidatedForm`; motion is CSS +
IntersectionObserver; icons are inline SVG; dates use `Intl`; there is no carousel because the
brief's Instagram strip is better served by scroll-snap. **APPROVED.**

## D10 · In-memory persistence behind a repository interface

Brief §36 requires CMS-ready data structures but no database was provisioned, and provisioning one
unrequested would be scope the user did not ask for.

**Decision:** typed content modules + `async` repository interfaces + an in-memory adapter that is
documented as non-durable. Migration path in `docs/DEVOPS_SPEC.md` §5. **ASSUMPTION.**

## D11 · No admin surface

Brief §35 requires admin functionality to be protected.

**Decision:** ship no admin surface at all. An interface that does not exist cannot be left
unprotected, and an unauthenticated admin panel would be the single largest risk in the build.
Submitted requests are readable only from server logs and the in-memory repository. **APPROVED.**

## D12 · No Instagram API, no map iframe, no analytics vendor

Brief §18 says *"do not actually connect an external API unless required"*.

**Decision:** the Instagram strip is local art with outbound profile links; the contact page has a
static map placeholder with a link out rather than an embedded frame; analytics is a no-op sink
(`docs/ANALYTICS_SPEC.md`). Consequence: zero third-party requests, which is also why the
performance and privacy positions hold. **APPROVED.** Note: `/privacy` states that no analytics
vendor is connected — that sentence must be rewritten if a sink is ever registered.

## D13 · Skill-pack workflow followed in full before any code

`01-discovery-requirements` through `18-website-audit` were read first; this `docs/` set is the
required artifact trail. No component was written before `docs/BRAND_SYSTEM.md`, `docs/UX_SPEC.md`
and `docs/UI_SPEC.md` existed, in line with the brief's closing instruction not to rush into code.
The skill pack itself was **not** copied into this repository (brief §1.6). **CONFIRMED.**
