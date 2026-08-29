import { contact, site, studioAddress } from '@/config/site';
import { absoluteUrl } from './seo';

import type { Crumb } from './seo';
import type {
  Artist,
  BridalPackage,
  Faq,
  ImageAsset,
  PortfolioProject,
  ServiceCategory,
} from '@/types/content';

/**
 * Structured data (docs/SEO_SPEC.md §4).
 *
 * Two rules govern everything in this file.
 *
 * **Nothing is asserted that the page does not show.** No `Review`, no
 * `AggregateRating`, no `award`, no invented `openingHoursSpecification`. The
 * testimonials in this build are all marked `sample: true`; marking them up as
 * real reviews would be fabricated evidence and a search-spam violation, so the
 * schema types that would carry them are simply absent.
 *
 * **Unconfigured contact details are omitted, not stubbed.** `telephone` and
 * `address` appear only when the corresponding environment variables are set.
 * A `PostalAddress` containing "123 Placeholder Road" is worse than no address
 * at all: it is a machine-readable claim about a place that does not exist
 * (brief §23, docs/DECISION_LOG.md D7).
 */

/** Minimal structural type. Deliberately not `any` — `unknown` values force a cast at the leaf. */
export type JsonLdNode = Readonly<Record<string, unknown>>;

const ORGANISATION_ID = absoluteUrl('/#organization');
const WEBSITE_ID = absoluteUrl('/#website');
const SALON_ID = absoluteUrl('/#salon');

/** Drops keys whose value is null/undefined/empty so no empty properties are emitted. */
function compact(node: Record<string, unknown>): JsonLdNode {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(node)) {
    if (value === null || value === undefined) continue;
    if (typeof value === 'string' && value.trim().length === 0) continue;
    if (Array.isArray(value) && value.length === 0) continue;
    out[key] = value;
  }
  return out;
}

const sameAs = [contact.instagram, contact.pinterest]
  .filter((channel) => channel.configured)
  .map((channel) => (channel as { href: string }).href);

export function organizationNode(): JsonLdNode {
  return compact({
    '@type': 'Organization',
    '@id': ORGANISATION_ID,
    name: site.name,
    url: absoluteUrl('/'),
    description: site.description,
    slogan: site.tagline,
    logo: compact({
      '@type': 'ImageObject',
      url: absoluteUrl('/icon'),
      width: 32,
      height: 32,
    }),
    email: contact.email.configured ? contact.email.label : null,
    telephone: contact.phone.configured ? contact.phone.label : null,
    sameAs,
  });
}

export function webSiteNode(): JsonLdNode {
  // No `potentialAction`/`SearchAction`: there is no site search, and claiming
  // one produces a sitelinks searchbox that 404s.
  return compact({
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: site.name,
    url: absoluteUrl('/'),
    description: site.description,
    inLanguage: 'en-IN',
    publisher: { '@id': ORGANISATION_ID },
  });
}

export function beautySalonNode(): JsonLdNode {
  const address = studioAddress.configured
    ? compact({
        '@type': 'PostalAddress',
        streetAddress: studioAddress.line,
        addressLocality: studioAddress.city,
        addressRegion: studioAddress.region,
        postalCode: studioAddress.postalCode,
        addressCountry: 'IN',
      })
    : null;

  return compact({
    '@type': 'BeautySalon',
    '@id': SALON_ID,
    name: site.name,
    url: absoluteUrl('/'),
    description: site.description,
    parentOrganization: { '@id': ORGANISATION_ID },
    priceRange: '₹₹₹',
    currenciesAccepted: 'INR',
    availableLanguage: ['en', 'hi'],
    // "By appointment only" as prose, because inventing opening hours for a
    // studio that does not exist would be a fabricated fact.
    publicAccess: false,
    address,
    telephone: contact.phone.configured ? contact.phone.label : null,
    email: contact.email.configured ? contact.email.label : null,
    sameAs,
  });
}

export function breadcrumbNode(crumbs: readonly Crumb[]): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: absoluteUrl(crumb.href),
    })),
  };
}

export function serviceNode(category: ServiceCategory, offerCount: number): JsonLdNode {
  return compact({
    '@type': 'Service',
    name: `${category.name} — ${site.name}`,
    serviceType: category.name,
    description: category.summary,
    url: absoluteUrl(`/services/${category.slug}`),
    provider: { '@id': ORGANISATION_ID },
    areaServed: studioAddress.configured ? studioAddress.city : null,
    // A count, not invented prices: individual service pricing is quoted per
    // booking and the page says so.
    hasOfferCatalog: compact({
      '@type': 'OfferCatalog',
      name: `${category.name} treatments`,
      numberOfItems: offerCount,
    }),
  });
}

export function offerNode(pkg: BridalPackage): JsonLdNode {
  return {
    '@type': 'Offer',
    name: pkg.name,
    description: pkg.summary,
    url: absoluteUrl('/packages'),
    priceCurrency: 'INR',
    price: pkg.startingInvestment,
    // `minPrice` rather than a flat `price` claim: every figure on the packages
    // page is a starting investment, and the markup must say the same thing.
    priceSpecification: {
      '@type': 'PriceSpecification',
      priceCurrency: 'INR',
      minPrice: pkg.startingInvestment,
      valueAddedTaxIncluded: false,
      description: 'Starting investment. Final quote depends on functions, travel and party size.',
    },
    availability: 'https://schema.org/LimitedAvailability',
    seller: { '@id': ORGANISATION_ID },
  };
}

export function faqPageNode(faqs: readonly Faq[]): JsonLdNode {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

export function personNode(artist: Artist): JsonLdNode {
  return compact({
    '@type': 'Person',
    name: artist.name,
    jobTitle: artist.role,
    description: artist.signatureLine,
    url: absoluteUrl(`/artists/${artist.slug}`),
    knowsAbout: artist.specialisms,
    worksFor: { '@id': ORGANISATION_ID },
  });
}

export function imageObjectNode(project: PortfolioProject, image: ImageAsset): JsonLdNode {
  return {
    '@type': 'ImageObject',
    contentUrl: absoluteUrl(image.src),
    width: image.width,
    height: image.height,
    name: project.title,
    // The caption states what the asset actually is. Presenting a licensed
    // editorial photograph as this studio's own client work would be the
    // dishonest option, so `creditText` is the licence rather than the brand.
    caption: `${image.alt} Licensed editorial photography, not a photograph of a client of this studio.`,
    representativeOfPage: true,
    creditText: 'Licensed editorial photography (Pexels licence)',
    copyrightNotice: 'Credited per file in /photography/index.json',
  };
}

/**
 * Wraps nodes into one `@graph` document.
 *
 * One script tag per page rather than several: a single graph lets nodes
 * reference each other by `@id` instead of repeating the organisation on every
 * node, which is both smaller and what consumers expect.
 */
export function graph(...nodes: readonly JsonLdNode[]): string {
  return serialize({ '@context': 'https://schema.org', '@graph': nodes });
}

/**
 * Serialises for embedding in `<script type="application/ld+json">`.
 *
 * `</script>` inside a JSON string value would end the element early and let
 * the remainder be parsed as markup. So the three characters that can start a
 * markup construct are rewritten to their JSON unicode escapes — u003c, u003e
 * and u0026. A JSON parser turns those back into the original characters, so
 * consumers read exactly what was intended; the escaping exists only to stop
 * the HTML parser from ever seeing them (docs/SECURITY_SPEC.md §7).
 */
export function serialize(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}
