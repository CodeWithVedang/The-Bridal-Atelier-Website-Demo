import { env } from '@/config/env';
import { site } from '@/config/site';

import type { Metadata } from 'next';

/**
 * Metadata builders (docs/SEO_SPEC.md §2, §3).
 *
 * Every route builds its metadata through `pageMetadata` rather than writing a
 * literal object, for three reasons:
 *
 *  1. **The canonical is derived from the path**, so it cannot drift from the
 *     route it sits on — the most common canonical bug is a copy-pasted one.
 *  2. **`robots` is centralised.** While `NEXT_PUBLIC_SITE_INDEXABLE` is false
 *     every page must be `noindex, nofollow`; a route that forgot would leak a
 *     fictional bridal studio into the index. One function, one place to be
 *     right (docs/SEO_SPEC.md §1).
 *  3. **Descriptions are length-checked in development.** A truncated or
 *     stub description is a defect you only notice in a SERP preview months
 *     later, so it is surfaced at the point of authoring instead.
 */

/** The window search engines actually display. Enforced in dev, not in prod. */
const DESCRIPTION_MIN = 110;
const DESCRIPTION_MAX = 165;

export interface PageMetadataInput {
  /** Without the brand suffix — the template in the root layout appends it. */
  readonly title: string;
  readonly description: string;
  /** Route path, always leading-slash, never trailing-slash. `/` for home. */
  readonly path: string;
  /** Policy pages stay out of the index even when the site is indexable. */
  readonly noindex?: boolean;
  /** Overrides the default social image for image-led routes. */
  readonly ogImagePath?: string;
  readonly type?: 'website' | 'article' | 'profile';
}

/** `/services` → `https://host/services`; `/` → `https://host`. */
export function absoluteUrl(path: string): string {
  if (path === '/') return env.siteUrl;
  const normalised = path.startsWith('/') ? path : `/${path}`;
  return `${env.siteUrl}${normalised.replace(/\/+$/, '')}`;
}

function assertDescription(description: string, path: string): void {
  if (process.env.NODE_ENV === 'production') return;
  const { length } = description;
  if (length < DESCRIPTION_MIN || length > DESCRIPTION_MAX) {
    // A warning rather than a throw: a length problem should not stop a
    // developer from previewing a page they are mid-way through writing.
    console.warn(
      `[seo] description for ${path} is ${length} characters; aim for ${DESCRIPTION_MIN}-${DESCRIPTION_MAX}.`,
    );
  }
}

export function pageMetadata(input: PageMetadataInput): Metadata {
  const { title, description, path, noindex = false, ogImagePath, type = 'website' } = input;
  assertDescription(description, path);

  const canonical = path === '/' ? '/' : path.replace(/\/+$/, '');
  const indexable = site.isIndexable && !noindex;

  return {
    title,
    description,
    alternates: { canonical },
    robots: indexable
      ? { index: true, follow: true, googleBot: { index: true, follow: true } }
      : { index: false, follow: false, nocache: true },
    openGraph: {
      type,
      url: canonical,
      title: `${title} · ${site.name}`,
      description,
      siteName: site.name,
      locale: 'en_IN',
      ...(ogImagePath ? { images: [{ url: ogImagePath }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} · ${site.name}`,
      description,
    },
  };
}

/**
 * Breadcrumb trails.
 *
 * The visible `Breadcrumbs` component and the `BreadcrumbList` JSON-LD are both
 * built from one of these arrays, because a structured-data trail that disagrees
 * with the rendered one is a markup violation rather than a cosmetic slip
 * (docs/SEO_SPEC.md §4).
 */
export interface Crumb {
  readonly label: string;
  readonly href: string;
}

export function trail(...crumbs: readonly Crumb[]): readonly Crumb[] {
  return [{ label: 'Home', href: '/' }, ...crumbs];
}
