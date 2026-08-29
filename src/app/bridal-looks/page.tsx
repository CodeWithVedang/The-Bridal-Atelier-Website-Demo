import Link from 'next/link';

import { Container, Rule, Section } from '@/components/primitives';
import {
  CtaBand,
  FaqSection,
  LooksSection,
  PageHeader,
  PortfolioPreview,
} from '@/components/sections';
import { closingCta, disclosures } from '@/content/site-copy';
import { nameMap } from '@/lib/form-options';
import { breadcrumbNode, graph } from '@/lib/jsonld';
import { getContentRepository } from '@/lib/repositories';
import { pageMetadata, trail } from '@/lib/seo';

import type { Metadata } from 'next';

/**
 * The four signature looks (brief §12).
 *
 * Written as starting points rather than as products. A bride arrives with a
 * saved image; the useful thing a studio can offer is a small number of honest
 * directions and a sentence about who each one suits, so the trial begins from
 * a shared vocabulary instead of from a screenshot (docs/PSYCHOLOGY_SPEC.md §4).
 *
 * Four, not six. Brief B's list of moods is illustrative; the content layer
 * authors four looks and every service category points at one of them via
 * `relatedLookSlug`. Adding two empty moods to match a suggestion would break
 * that link and invent content the studio has nothing to say about.
 *
 * The editorial variant alternates the image side and gives each look an `id`,
 * because `/services/[slug]` and the home page both deep-link here as
 * `/bridal-looks#classic-red`.
 */

export const metadata: Metadata = pageMetadata({
  title: 'Bridal looks',
  description:
    'Four bridal directions — Classic Red, Ivory Pearl, Soft Glam and Modern Minimal — with what each one is built from, who it suits, and the trial that decides between them.',
  path: '/bridal-looks',
});

const CRUMBS = trail({ label: 'Bridal looks', href: '/bridal-looks' });

export default async function BridalLooksPage() {
  const repo = getContentRepository();
  const [looks, projects, artists, faqs] = await Promise.all([
    repo.listBridalLooks(),
    repo.listFeaturedProjects(6),
    repo.listArtists(),
    repo.listFaqs('trial'),
  ]);

  return (
    <>
      <PageHeader
        crumbs={CRUMBS}
        eyebrow="Bridal looks"
        heading="Find your bridal mood"
        lead="Four directions we work from, described by what they are actually made of rather than by adjectives. Most brides arrive with a saved image and leave the trial with something adjacent to it — this is the vocabulary that conversation starts in."
        meta={[
          `${looks.length} signature looks`,
          'Each one adapted to your skin, not applied to it',
          'The trial decides the final direction',
        ]}
      />

      <LooksSection
        copy={{
          eyebrow: 'The four',
          heading: 'What each direction is built from',
          intro:
            'Every look lists its elements — base, eye, lip, hair — and who it tends to suit. Nothing here is a fixed formula: the same direction is mixed differently for a morning ceremony and an evening reception.',
        }}
        looks={looks}
        variant="editorial"
        tone="ivory-alt"
        id="looks"
      />

      <Section tone="blush" spacing="tight" id="choosing">
        <Container width="narrow" className="flex flex-col gap-5">
          <h2 className="text-display-sm">You do not have to choose now</h2>
          <p className="text-body-md text-espresso-800">
            The trial exists precisely so this decision does not have to be made from photographs.
            You bring the images you have saved, your outfit if it has arrived, and the jewellery if
            you have it; the artist builds one direction fully, photographs it in daylight and in
            artificial light, and you decide with your own face in front of you.
          </p>
          <Rule tone="gold" ornament />
          <p className="text-body-sm text-espresso-700">
            Every wedding booking includes a full trial.{' '}
            <Link href="/packages" className="underline-draw font-medium text-espresso-900">
              See what each package covers
            </Link>
            .
          </p>
        </Container>
      </Section>

      <PortfolioPreview
        copy={{
          eyebrow: 'In practice',
          heading: 'The same four directions, on real briefs',
          intro:
            'Each project names the direction it started from and what changed for the light, the function and the outfit.',
          ctaLabel: 'Open the portfolio',
          ctaHref: '/portfolio',
        }}
        projects={projects}
        artistNames={nameMap(artists)}
        tone="ivory"
        id="in-practice"
      />

      <FaqSection
        copy={{
          eyebrow: 'The trial',
          heading: 'Questions about deciding',
          intro:
            'If yours is not here, ask it in the consultation form and it gets answered in writing before you book.',
        }}
        faqs={faqs}
        tone="ivory-alt"
        id="faqs"
      />

      <CtaBand
        copy={closingCta}
        location="closing_bridal_looks"
        note={disclosures.noPaymentTaken}
        tone="ivory"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: graph(breadcrumbNode(CRUMBS)) }}
      />
    </>
  );
}
