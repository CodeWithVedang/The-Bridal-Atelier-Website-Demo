# SEO_SPEC — The Bridal Atelier

Implements `website_skill_pack/skills/11-seo-implementation`. The skill's hard rule applies:
**never fabricate search volume, rankings, or competitive data.** Nothing in this document
contains an invented metric — it specifies mechanics only.

## 1. Indexing posture (important)

This is a **fictional business**. Allowing search engines to index a fictional bridal studio with
a fictional address would put misleading local-business information into the index. So:

- `NEXT_PUBLIC_SITE_INDEXABLE` defaults to **`false`**.
- While false: `robots.ts` returns `disallow: '/'`, and every page's metadata sets
  `robots: { index: false, follow: false }`.
- All other SEO machinery (canonicals, sitemap, structured data, OG images) is fully implemented
  and correct, so flipping one env var makes the site production-indexable.
- The flag is documented in `.env.example` and `README.md`.

## 2. Metadata implementation

Root `layout.tsx` sets `metadataBase: new URL(env.siteUrl)`, a title template
`'%s · The Bridal Atelier'`, the default description, `openGraph`, `twitter: { card: 'summary_large_image' }`,
`applicationName`, `authors`, `creator`, `publisher`, `formatDetection`, and `alternates.canonical: '/'`.

Every route exports `metadata` or `generateMetadata` with, at minimum, a unique `title`,
a unique 140–160 character `description`, and `alternates.canonical` set to that route's path.
Dynamic routes build the canonical from the slug.

`themeColor` and `colorScheme` are set via `export const viewport` — they are **deprecated inside
`metadata`** in this Next version (`node_modules/next/dist/docs/.../generate-metadata.md`).

## 3. Title and description pattern

| Route | Title | Angle |
|---|---|---|
| `/` | `Bridal Hair, Makeup & Skin Studio` | primary service + category |
| `/services` | `Bridal Beauty Services` | hub |
| `/services/[slug]` | category name | one intent per page |
| `/packages` | `Bridal Packages & Starting Investment` | pricing intent |
| `/portfolio` | `Bridal Portfolio` | visual intent |
| `/portfolio/[slug]` | project title | long-tail |
| `/bridal-looks` | `Signature Bridal Looks` | look intent |
| `/artists`, `/artists/[slug]` | artist name | person intent |
| `/book` | `Book a Bridal Consultation` | conversion intent |
| `/contact` | `Contact & Studio Details` | navigational |
| `/about` | `About the Atelier` | brand |
| `/privacy`, `/terms` | policy titles | `noindex` even when the site is indexable |

One `<h1>` per page, matching the page's intent, never keyword-stuffed. Headings are a real
outline: `h1 → h2` per section → `h3` per item. No heading level is skipped, and no heading is
used for styling.

## 4. Structured data (`lib/jsonld.ts`)

| Schema | Where | Notes |
|---|---|---|
| `Organization` | root layout | name, url, logo, sameAs only if configured |
| `WebSite` | root layout | no `SearchAction` — there is no site search |
| `BeautySalon` (⊂ `LocalBusiness`) | `/`, `/contact` | `address` and `telephone` emitted **only** when the env values are configured; omitted entirely otherwise |
| `BreadcrumbList` | every nested route, via `Breadcrumbs` | mirrors the visible breadcrumb |
| `Service` | `/services/[slug]` | `provider` → the Organization node |
| `Offer` | `/packages` | `priceCurrency: 'INR'`, `price` = starting investment, `priceSpecification` marked as *starting from* |
| `FAQPage` | `/packages` | only the questions actually rendered on that page |
| `Person` | `/artists/[slug]` | name, jobTitle, worksFor |
| `ImageObject` | portfolio detail | generated art, `caption` states it is illustrative |

**Deliberately absent:** `Review`, `AggregateRating`, `award`, `openingHoursSpecification` with
invented hours. Emitting review markup for sample testimonials would be fabricated evidence — the
one thing `04-human-psychology` and `11-seo-implementation` both forbid outright.

JSON-LD is injected with `<script type="application/ld+json">` containing
`JSON.stringify(node)`; every string passes through a serialiser that escapes `<`, `>` and `&`.

## 5. Sitemap and robots

`app/sitemap.ts` returns a `MetadataRoute.Sitemap` built from the same content modules the pages
use — so a new portfolio project appears in the sitemap automatically. Entries carry
`lastModified` from a content constant (not build time, which would churn the file every deploy),
`changeFrequency`, and `priority` (`1.0` home, `0.9` book/packages, `0.8` services/portfolio hubs,
`0.6` detail pages, `0.3` legal). Policy pages are excluded.

`app/robots.ts` returns a `MetadataRoute.Robots`: when indexable, `allow: '/'` with
`disallow: ['/api/']` and the sitemap URL; when not, `disallow: '/'`.

## 6. Social and icons

`app/opengraph-image.tsx` and `app/twitter-image.tsx` render with `ImageResponse` from `next/og`
at 1200×630 — flexbox only, since `next/og` does not support CSS grid. The image shows the
wordmark, tagline, and a hairline rule in brand tokens. `app/icon.tsx` renders a 32×32 monogram.
`app/manifest.ts` returns name, short name, description, `start_url: '/'`, `display: 'standalone'`,
and the brand background/theme colours.

## 7. Technical SEO checklist

- Semantic landmarks: one `<header>`, one `<nav aria-label="Primary">`, one `<main id="main">`, one `<footer>`.
- Every image has meaningful `alt`, or `alt=""` with an explicit `decorative` prop.
- Internal links are real `next/link` anchors with descriptive text — no "click here", no
  `<div onClick>` navigation.
- No content is rendered only for crawlers, and no text is hidden to hold keywords.
- Trailing-slash behaviour is Next's default and canonicals match it exactly.
- 404s return a real 404 status via `not-found.tsx`, never a 200 soft-404.
- `/api/*` responses set `X-Robots-Tag: noindex` in addition to `Cache-Control: no-store`.
