import { EditorialImage, Reveal, Timeline } from '@/components/content';
import { Container, Section, SectionHeading, TextLink } from '@/components/primitives';

import type { SectionCopy, SectionGround } from './types';
import type { JourneyStage, ImageAsset } from '@/types/content';
import type { TimelineStep } from '@/components/content';

/**
 * The bridal journey, 01–05 (brief §7, docs/UI_SPEC.md §7 layout signature 1).
 *
 * Editorial 7/5 split for the header — heading and lead against a single piece
 * of artwork — then the sequence itself full width, because a five-step timeline
 * squeezed into seven columns stops being legible at exactly the width where the
 * five-across layout becomes possible.
 *
 * `withDetail` is what separates the home page from `/about#process`: the home
 * page shows the promise and the timing, which is the shape of the process; the
 * about page adds each stage's full paragraph. Same component, same order, no
 * duplicated copy.
 */

export interface JourneySectionProps {
  readonly copy: SectionCopy;
  readonly stages: readonly JourneyStage[];
  readonly image?: ImageAsset;
  /** Adds each stage's paragraph. Used on `/about`, not on the home page. */
  readonly withDetail?: boolean;
  readonly tone?: SectionGround;
  readonly id?: string;
}

const HEADING_ID = 'journey-heading';

export function JourneySection({
  copy,
  stages,
  image,
  withDetail = false,
  tone = 'ivory',
  id,
}: JourneySectionProps) {
  const steps: readonly TimelineStep[] = stages.map((stage) => ({
    id: stage.slug,
    index: stage.index,
    name: stage.name,
    promise: stage.promise,
    meta: stage.timing,
    detail: withDetail ? stage.detail : undefined,
  }));

  return (
    <Section id={id} tone={tone} labelledBy={HEADING_ID}>
      <Container className="flex flex-col gap-12 lg:gap-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <SectionHeading
              id={HEADING_ID}
              eyebrow={copy.eyebrow}
              lead={copy.intro}
              action={
                copy.ctaLabel && copy.ctaHref ? (
                  <TextLink href={copy.ctaHref} withArrow>
                    {copy.ctaLabel}
                  </TextLink>
                ) : undefined
              }
            >
              {copy.heading}
            </SectionHeading>
          </div>

          {image ? (
            <div className="lg:col-span-5">
              <EditorialImage
                asset={image}
                ratio="3 / 2"
                sizes="(max-width: 1023px) 100vw, 40vw"
                className="w-full"
              />
            </div>
          ) : null}
        </div>

        <Reveal>
          <Timeline steps={steps} />
        </Reveal>
      </Container>
    </Section>
  );
}
