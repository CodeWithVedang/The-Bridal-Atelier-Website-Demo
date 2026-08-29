import { Cormorant_Garamond, DM_Sans } from 'next/font/google';

import { MobileCtaBar, SiteFooter, SiteHeader, SkipLink, WhatsAppFloat } from '@/components/navigation';
import { site } from '@/config/site';
import { env } from '@/config/env';
import { beautySalonNode, graph, organizationNode, webSiteNode } from '@/lib/jsonld';

import './globals.css';

import type { Metadata, Viewport } from 'next';

/**
 * The application shell (docs/ARCHITECTURE.md §3, docs/UI_SPEC.md §2).
 *
 * Four things are settled here so no route has to think about them again:
 *
 *  1. **Fonts.** Both are self-hosted by `next/font`, which means no request to
 *     fonts.googleapis.com at runtime — required by the CSP in `next.config.ts`,
 *     and the reason the privacy page can say no third-party font is fetched. The
 *     CSS variable names are not arbitrary: `globals.css` reads
 *     `--font-cormorant` and `--font-dm-sans`, so a rename here silently drops
 *     the whole site to a system fallback.
 *  2. **`metadataBase`.** Every `alternates.canonical` produced by
 *     `pageMetadata` is a path; this is what makes it absolute. Set once, so a
 *     route cannot emit a canonical pointing at localhost in production.
 *  3. **The organisation graph.** `Organization`, `WebSite` and `BeautySalon`
 *     describe the brand, not the page, so they belong on every page exactly
 *     once. Page-specific nodes (breadcrumbs, offers, FAQs) are emitted by the
 *     routes that own them.
 *  4. **The persistent chrome.** Skip link, header, main landmark, mobile CTA
 *     bar, WhatsApp float, footer — in that DOM order, which is also the tab
 *     order.
 *
 * `<main>` carries bottom padding on small screens only: `MobileCtaBar` is fixed
 * to the viewport bottom below `lg`, and without the padding it would sit on top
 * of the last section's content rather than below it.
 */

const display = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const body = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: `${site.name} — ${site.tagline}`,
    // Routes pass a bare title; the brand is appended once, here.
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  referrer: 'strict-origin-when-cross-origin',
  formatDetection: { telephone: false, email: false, address: false },
  // Absent from the index while the brand is fictional (docs/SEO_SPEC.md §1).
  robots: site.isIndexable
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: 'en_IN',
    url: '/',
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  // `themeColor` and `colorScheme` are viewport fields in this version of Next;
  // in `metadata` they are ignored with a build warning.
  themeColor: '#faf7f2',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  const brandGraph = graph(organizationNode(), webSiteNode(), beautySalonNode());

  return (
    <html
      lang={site.locale}
      className={`${display.variable} ${body.variable} h-full antialiased`}
      // The site is light-ground by design; declaring it stops a UA from
      // inverting form controls under a dark OS preference.
      style={{ colorScheme: 'light' }}
    >
      {/* Ground, type family and size come from the base layer in globals.css. */}
      <body className="flex min-h-full flex-col">
        <SkipLink />
        <SiteHeader />
        <main id="main" className="flex-1 pb-20 lg:pb-0">
          {children}
        </main>
        <SiteFooter />
        <MobileCtaBar />
        <WhatsAppFloat />
        <script
          type="application/ld+json"
          // Serialised by `graph`, which escapes `<`, `>` and `&` so the string
          // cannot break out of the element (docs/SECURITY_SPEC.md §7).
          dangerouslySetInnerHTML={{ __html: brandGraph }}
        />
      </body>
    </html>
  );
}
