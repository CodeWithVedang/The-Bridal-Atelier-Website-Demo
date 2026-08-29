import {
  ArtistsSection,
  AvailabilitySection,
  BeforeAfterSection,
  CtaBand,
  FaqSection,
  Hero,
  InstagramSection,
  JourneySection,
  LooksSection,
  PackagesSection,
  PortfolioPreview,
  ServicesOverview,
  TestimonialsSection,
  TrustStrip,
  WhatsAppBand,
} from '@/components/sections';
import { contact, site } from '@/config/site';
import { getImage } from '@/content/images';
import {
  availabilityCopy,
  closingCta,
  disclosures,
  hero,
  homeSections,
  trustFacts,
  whatsappBand,
} from '@/content/site-copy';
import { nameMap, packageChoicesCompact } from '@/lib/form-options';
import { faqPageNode, graph } from '@/lib/jsonld';
import { getContentRepository } from '@/lib/repositories';
import { pageMetadata } from '@/lib/seo';

import type { Metadata } from 'next';

/**
 * The home page (brief §5, docs/UI_SPEC.md §5).
 *
 * Fifteen sections, ordered as an argument rather than as a catalogue: what this
 * is → why it can be trusted → how it works → what it costs → proof → the two
 * ways to start. The two conversion paths are reachable from the hero, from the
 * date check two-thirds down, and from the closing band, which is as often as a
 * bride should be asked.
 *
 * Every ground colour is chosen here, not by the sections. Alternation is a
 * property of the page — a section cannot know what precedes it — and the
 * one-`blush`-per-page rule in docs/BRAND_SYSTEM.md §3 is only reviewable if the
 * whole sequence is visible in one file. `LooksSection` spends this page's blush.
 *
 * Data arrives through the repository, never by importing `src/content/*`
 * directly, which is what keeps the CMS swap in docs/ARCHITECTURE.md §7 a
 * data-layer change. The page is static: nothing here reads a request.
 */

export const metadata: Metadata = pageMetadata({
  title: `${site.name} — ${site.tagline}`,
  description:
    'Bridal hair, makeup and skin in one plan, by named artists who stay with you from trial to send-off. Published packages, a written timeline, no payment to enquire.',
  path: '/',
});

/** Six of the twelve: enough to be useful, short enough to scan (SEO_SPEC §4). */
const HOME_FAQ_COUNT = 6;

export default async function HomePage() {
  const repo = getContentRepository();

  const [stages, categories, services, packages, projects, pairs, looks, artists, testimonials, faqs, tiles] =
    await Promise.all([
      repo.listJourneyStages(),
      repo.listServiceCategories(),
      repo.listServices(),
      repo.listPackages(),
      repo.listFeaturedProjects(5),
      repo.listBeforeAfterPairs(),
      repo.listBridalLooks(),
      repo.listArtists(),
      repo.listTestimonials(),
      repo.listFaqs(),
      repo.listInstagramTiles(),
    ]);

  const serviceCounts: Record<string, number> = {};
  for (const service of services) {
    serviceCounts[service.categorySlug] = (serviceCounts[service.categorySlug] ?? 0) + 1;
  }

  const homeFaqs = faqs.slice(0, HOME_FAQ_COUNT);

  return (
    <>
      <Hero copy={hero} image={getImage(hero.imageId)} />
      <TrustStrip facts={trustFacts} tone="ivory-alt" />
      <JourneySection
        copy={homeSections.journey}
        stages={stages}
        image={getImage('journey-arch')}
        tone="ivory"
        id="process"
      />
      <ServicesOverview
        copy={homeSections.services}
        categories={categories}
        serviceCounts={serviceCounts}
        tone="ivory-alt"
        id="services"
      />
      <PackagesSection copy={homeSections.packages} packages={packages} tone="ivory" id="packages" />
      <PortfolioPreview
        copy={homeSections.portfolio}
        projects={projects}
        artistNames={nameMap(artists)}
        tone="inset"
        id="portfolio"
      />
      <BeforeAfterSection copy={homeSections.beforeAfter} pairs={pairs} tone="ivory" />
      <LooksSection copy={homeSections.looks} looks={looks} tone="blush" id="looks" />
      <ArtistsSection copy={homeSections.artists} artists={artists} tone="ivory" id="artists" />
      <TestimonialsSection
        copy={homeSections.testimonials}
        testimonials={testimonials}
        packageNames={nameMap(packages)}
        tone="ivory-alt"
      />
      <AvailabilitySection
        copy={availabilityCopy}
        packageOptions={packageChoicesCompact(packages)}
        tone="inset"
      />
      <WhatsAppBand
        copy={whatsappBand}
        channel={contact.whatsapp}
        location="home_band"
        tone="ivory"
      />
      <InstagramSection
        copy={homeSections.instagram}
        tiles={tiles}
        channel={contact.instagram}
        tone="ivory-alt"
      />
      <FaqSection copy={homeSections.faqs} faqs={homeFaqs} tone="ivory" id="faqs" />
      <CtaBand
        copy={closingCta}
        location="closing_home"
        note={disclosures.noPaymentTaken}
        tone="ivory-alt"
      />

      <script
        type="application/ld+json"
        // Only the six questions actually rendered here are marked up: FAQPage
        // markup for content a visitor cannot see is a structured-data violation.
        dangerouslySetInnerHTML={{ __html: graph(faqPageNode(homeFaqs)) }}
      />
    </>
  );
}
