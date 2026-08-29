import { Container, Rule, Section } from '@/components/primitives';
import {
  ArtistsSection,
  CtaBand,
  PageHeader,
  PortfolioPreview,
  TestimonialsSection,
} from '@/components/sections';
import { closingCta, disclosures } from '@/content/site-copy';
import { nameMap } from '@/lib/form-options';
import { breadcrumbNode, graph, personNode } from '@/lib/jsonld';
import { getContentRepository } from '@/lib/repositories';
import { pageMetadata, trail } from '@/lib/seo';

import type { Metadata } from 'next';

/**
 * The artists (brief §13).
 *
 * The page exists because "you get a named artist" is only a promise until the
 * names are on a page with what each one is actually for. Three people, each with
 * a stated specialism, and the artist who does the trial does the wedding — that
 * is the entire trust argument, so it is made in full here rather than compressed
 * into a home-page row.
 *
 * `Person` structured data is emitted for all three. It carries name, role,
 * specialisms and `worksFor` — no `image`, because the photographs are licensed
 * editorial craft images rather than portraits of these people, and pointing
 * `Person.image` at one would make a machine-readable claim the page explicitly
 * denies (docs/SEO_SPEC.md §4).
 */

export const metadata: Metadata = pageMetadata({
  title: 'The artists',
  description:
    'Three bridal artists, each with a stated specialism: traditional bridal makeup, bridal hair and dressing, and skin preparation. The artist who does your trial does your wedding.',
  path: '/artists',
});

const CRUMBS = trail({ label: 'Artists', href: '/artists' });

export default async function ArtistsPage() {
  const repo = getContentRepository();
  const [artists, projects, testimonials, packages] = await Promise.all([
    repo.listArtists(),
    repo.listFeaturedProjects(6),
    repo.listTestimonials(),
    repo.listPackages(),
  ]);

  return (
    <>
      <PageHeader
        crumbs={CRUMBS}
        eyebrow="The team"
        heading="Three artists, each with a stated specialism"
        lead="A small team on purpose. You are introduced to your artist at the consultation, that artist does your trial, and that same artist is in the room on the wedding morning. No rotating roster and no substitution without a conversation."
        meta={[
          `${artists.length} named artists`,
          'The trial artist is the wedding artist',
          'Assigned at consultation, in writing',
        ]}
      />

      <ArtistsSection
        copy={{
          eyebrow: 'Who you work with',
          heading: 'The artists, in their own scope',
          intro:
            'Each profile states what that artist is strongest at and what they hand to a colleague. Knowing where someone stops is more useful than a list of everything they can technically do.',
        }}
        artists={artists}
        withDetail
        note={disclosures.artistPhotography}
        tone="ivory-alt"
        id="team"
      />

      <Section tone="blush" spacing="tight" id="how-assigned">
        <Container width="narrow" className="flex flex-col gap-5">
          <h2 className="text-display-sm">How an artist is assigned</h2>
          <p className="text-body-md text-espresso-800">
            You can request someone by name in the consultation form, and if they are free on your
            dates they are yours. If they are not, a coordinator says so at the consultation rather
            than at the trial — and tells you which artist is free and why they suit the brief. With
            three artists and one wedding season, honesty about the diary is the only version of this
            that works.
          </p>
          <Rule tone="gold" ornament />
          <p className="text-body-sm text-espresso-700">{disclosures.artistPhotography}</p>
        </Container>
      </Section>

      <PortfolioPreview
        copy={{
          eyebrow: 'Their work',
          heading: 'Recent briefs, credited by artist',
          intro:
            'Every portfolio entry names the artist who built the look and lists the decisions they made.',
          ctaLabel: 'Open the portfolio',
          ctaHref: '/portfolio',
        }}
        projects={projects}
        artistNames={nameMap(artists)}
        tone="ivory"
        id="work"
      />

      <TestimonialsSection
        copy={{
          eyebrow: 'In their words',
          heading: 'Brides on working with one artist',
          intro: disclosures.sampleContent,
        }}
        testimonials={testimonials}
        packageNames={nameMap(packages)}
        tone="ivory-alt"
      />

      <CtaBand
        copy={closingCta}
        location="closing_artists"
        note={disclosures.noPaymentTaken}
        tone="ivory"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: graph(breadcrumbNode(CRUMBS), ...artists.map((artist) => personNode(artist))),
        }}
      />
    </>
  );
}
