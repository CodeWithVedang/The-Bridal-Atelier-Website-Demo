import { EditorialImage, Quote } from '@/components/content';
import { Container, Eyebrow, Prose, Rule, Section, Stat } from '@/components/primitives';
import {
  ArtistsSection,
  CtaBand,
  JourneySection,
  PageHeader,
  TestimonialsSection,
} from '@/components/sections';
import { studioHours } from '@/config/site';
import { getImage } from '@/content/images';
import { closingCta, disclosures } from '@/content/site-copy';
import { nameMap } from '@/lib/form-options';
import { getContentRepository } from '@/lib/repositories';
import { pageMetadata, trail } from '@/lib/seo';

import type { Metadata } from 'next';

/**
 * The about page (brief §19).
 *
 * Structured as the answer to "who am I trusting", in the order a bride asks it:
 * what this studio believes → how it works → who does the work → where it
 * happens. The journey stages carry `withDetail`, which is the difference between
 * this page and the home page's summary of the same five stages: here there is
 * room for the paragraph, and a bride reading this page has already decided she
 * wants the detail.
 *
 * The three figures in the philosophy block are structural facts of the offer —
 * artists on the team, functions the largest package covers, weeks before the
 * wedding a trial happens — read from content rather than typed, so none of them
 * can drift from the packages page.
 */

export const metadata: Metadata = pageMetadata({
  title: 'About the studio',
  description:
    'A small bridal studio built around one idea: nothing on a wedding morning should be improvised. How we work, who does the work, and what the studio is like.',
  path: '/about',
});

const CRUMBS = trail({ label: 'About', href: '/about' });

const PHILOSOPHY = [
  'The Bridal Atelier began with a complaint, not a concept. Brides kept describing the same morning: an artist they had never met, a look agreed in a rush, and a family asking them what happened next while they sat still with their eyes closed.',
  'So the studio is built the other way round. You meet your artist before you book. The full look is tested six weeks out and photographed in the two lights your photographer will actually work in. The plan is written down and your family gets the same copy. By the morning of the wedding, nothing is being decided — it is being carried out.',
  'That is also why the team stays small and the price is published. Three artists is the number that can hold a wedding week between them without a stranger appearing on the day, and a starting figure on the packages page means you never have to ask what something costs before you know whether you like us.',
];

export default async function AboutPage() {
  const repo = getContentRepository();
  const [stages, artists, packages, testimonials] = await Promise.all([
    repo.listJourneyStages(),
    repo.listArtists(),
    repo.listPackages(),
    repo.listTestimonials(),
  ]);

  const lead = artists[0];

  return (
    <>
      <PageHeader
        crumbs={CRUMBS}
        eyebrow="The studio"
        heading="Nothing on a wedding morning should be improvised"
        lead="A small bridal studio for hair, makeup and skin, planned across the whole wedding week. Three named artists, a trial before every booking, and a written timeline your family also gets."
      />

      <Section tone="ivory-alt" id="philosophy">
        <Container className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Eyebrow tone="gold">Why the studio exists</Eyebrow>
            <Prose className="mt-5">
              {PHILOSOPHY.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </Prose>
            <Rule tone="sand" className="my-8" />
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <Stat value={String(artists.length)} label="Artists on the team" />
              <Stat
                value={String(packages.length)}
                label="Packages, each with a published starting figure"
              />
              <Stat value="6 weeks" label="Before the wedding, your trial" />
            </div>
          </div>
          <div className="lg:col-span-5">
            <EditorialImage
              asset={getImage('about-philosophy')}
              sizes="(max-width: 1023px) 100vw, 40vw"
              className="w-full"
            />
          </div>
        </Container>
      </Section>

      <JourneySection
        copy={{
          eyebrow: 'The process',
          heading: 'Five stages, in detail',
          intro:
            'The same sequence every booking follows. Read it before you enquire — the point of publishing it is that you can hold us to it.',
        }}
        stages={stages}
        withDetail
        tone="ivory"
        id="process"
      />

      <ArtistsSection
        copy={{
          eyebrow: 'The team',
          heading: 'Three artists, each with a stated specialism',
          intro:
            'You meet your artist at the consultation, they run your trial, and they are the artist on site for your functions.',
          ctaLabel: 'See each artist in full',
          ctaHref: '/artists',
        }}
        artists={artists}
        withDetail
        tone="inset"
        id="team"
      />

      <Section tone="ivory" id="studio">
        <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <EditorialImage
              asset={getImage('about-studio')}
              sizes="(max-width: 1023px) 100vw, 48vw"
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-6 lg:col-span-6">
            <Eyebrow tone="gold">The room</Eyebrow>
            <h2 className="text-display-md">One chair at a time, by appointment</h2>
            <Prose>
              <p>
                The studio takes one bride at a time. There is no waiting area because there is no
                queue: your appointment is the only one in the room, which is what makes a
                three-hour trial a conversation rather than a slot.
              </p>
              <p>
                Consultation windows are below. Wedding-morning call times sit outside them by
                definition — those are set in your timeline, not in a diary of opening hours.
              </p>
            </Prose>
            <div className="hairline flex flex-col gap-3 bg-ivory-100 p-6">
              <p className="text-label text-espresso-900">{studioHours.statement}</p>
              <dl className="flex flex-col gap-2 text-body-sm">
                {studioHours.slots.map((slot) => (
                  <div key={slot.days} className="flex items-baseline justify-between gap-4">
                    <dt className="text-espresso-700">{slot.days}</dt>
                    <dd className="text-espresso-900">{slot.time}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-body-xs text-stone-500">{studioHours.note}</p>
            </div>
          </div>
        </Container>
      </Section>

      {lead ? (
        <Section tone="blush" spacing="tight">
          <Container width="narrow">
            <Quote
              quote={lead.signatureLine}
              attribution={lead.name}
              meta={lead.role}
              size="lg"
            />
          </Container>
        </Section>
      ) : null}

      <TestimonialsSection
        copy={{
          eyebrow: 'In their words',
          heading: 'What brides say about the planning',
          intro: disclosures.sampleContent,
        }}
        testimonials={testimonials}
        packageNames={nameMap(packages)}
        tone="ivory-alt"
      />

      <CtaBand
        copy={closingCta}
        location="closing_about"
        note={disclosures.noPaymentTaken}
        tone="ivory"
      />
    </>
  );
}
