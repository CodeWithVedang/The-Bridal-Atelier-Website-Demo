import { Container, Section } from '@/components/primitives';
import {
  BeforeAfterSection,
  CtaBand,
  PageHeader,
  PortfolioBrowser,
  TestimonialsSection,
} from '@/components/sections';
import { portfolioFilters } from '@/content/portfolio';
import { closingCta, disclosures, homeSections } from '@/content/site-copy';
import { nameMap } from '@/lib/form-options';
import { breadcrumbNode, graph } from '@/lib/jsonld';
import { getContentRepository } from '@/lib/repositories';
import { pageMetadata, trail } from '@/lib/seo';

import type { PortfolioFilterGroup } from '@/components/sections';
import type { Metadata } from 'next';

/**
 * The portfolio (brief §10, §22).
 *
 * The whole set is twelve projects and all of it is rendered on the server — the
 * filtering in `PortfolioBrowser` is client-side over data that is already in the
 * document. That is the right trade at this size: no request on a filter change,
 * no loading state to design, and every project is in the HTML a crawler sees.
 *
 * Filter state is deliberately not in the URL. It is a browsing aid rather than a
 * shareable view, and putting eight dimensions into query parameters would create
 * an effectively unbounded set of near-duplicate indexable URLs for twelve
 * projects (docs/SEO_SPEC.md §3, docs/DECISION_LOG.md).
 *
 * `Every bride, her own kind of beautiful` is the line the section carries. It is
 * a statement about range, which the twelve entries actually demonstrate — five
 * skin depths, five wedding types, seven functions — rather than a claim about
 * client numbers, which they cannot.
 */

export const metadata: Metadata = pageMetadata({
  title: 'Bridal portfolio',
  description:
    'Twelve bridal looks built for specific weddings, filterable by look, skin depth, wedding type, function, hairstyle, colour, coverage and artist. Every entry names what was done.',
  path: '/portfolio',
});

const CRUMBS = trail({ label: 'Portfolio', href: '/portfolio' });

/** `portfolioFilters` is authored `as const`; widen it to the browser's prop type. */
const FILTER_GROUPS: readonly PortfolioFilterGroup[] = portfolioFilters.map((group) => ({
  dimension: group.dimension,
  label: group.label,
  options: group.options,
}));

export default async function PortfolioPage() {
  const repo = getContentRepository();
  const [projects, artists, pairs, testimonials] = await Promise.all([
    repo.listPortfolioProjects(),
    repo.listArtists(),
    repo.listBeforeAfterPairs(),
    repo.listTestimonials(),
  ]);

  return (
    <>
      <PageHeader
        crumbs={CRUMBS}
        eyebrow="Portfolio"
        heading="Every bride, her own kind of beautiful"
        lead="Twelve weddings, each with the brief it was built for. Filter by the things that actually change a look — skin depth, function, hairstyle, coverage — and read what was done rather than guessing from a photograph."
        meta={[
          `${projects.length} projects`,
          `${artists.length} named artists`,
          'Eight filter dimensions',
        ]}
      />

      <PortfolioBrowser
        copy={{
          eyebrow: 'Recent work',
          heading: 'Filter the work',
          intro:
            'Filters combine: choosing two looks widens the set, choosing a look and a function narrows it. Counts update as you go, so nothing leads to an empty result you cannot explain.',
        }}
        projects={projects}
        filters={FILTER_GROUPS}
        artistNames={nameMap(artists)}
        tone="ivory"
        id="work"
      />

      <BeforeAfterSection
        copy={{
          eyebrow: 'From first brush',
          heading: 'Where a look starts, and where it arrives',
          intro:
            'Drag the handle, or use the arrow keys. Each pair is two licensed editorial photographs — one of a look being built and one of a finished look — not one bride photographed twice.',
        }}
        pairs={pairs}
        tone="ivory-alt"
        id="process"
      />

      <Section tone="blush" spacing="tight" id="how-to-read">
        <Container width="narrow" className="flex flex-col gap-4">
          <h2 className="text-display-sm">How to read these entries</h2>
          <p className="text-body-md text-espresso-800">
            Every project lists its base, eye, lip, hair and time on site. That breakdown is the
            useful part: two brides can want the same saved image and need opposite bases, and the
            only way to tell whether a studio can do yours is to see what it decided and why.
          </p>
          <p className="text-body-sm text-espresso-700">{disclosures.demonstrationSite}</p>
        </Container>
      </Section>

      <TestimonialsSection
        copy={{
          eyebrow: homeSections.testimonials.eyebrow,
          heading: 'Brides on the planning behind the photographs',
          intro: disclosures.sampleContent,
        }}
        testimonials={testimonials}
        tone="ivory"
      />

      <CtaBand
        copy={closingCta}
        location="closing_portfolio"
        note={disclosures.noPaymentTaken}
        tone="ivory-alt"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: graph(breadcrumbNode(CRUMBS)) }}
      />
    </>
  );
}
