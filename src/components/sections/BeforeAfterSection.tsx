import { BeforeAfterSlider } from '@/components/content';
import { Container, Section, SectionHeading } from '@/components/primitives';

import { TrackedCta } from './TrackedCta';

import type { SectionCopy, SectionGround } from './types';
import type { BeforeAfterPair } from '@/types/content';

/**
 * Before and after (brief §11).
 *
 * Three pairs, one column each from `lg`. Each slider owns its own caption and
 * its own note — the pairs are matched studio originals, one subject per pair,
 * and the note says what changed between the two frames — so this section is
 * layout and heading only (docs/DECISION_LOG.md D5).
 *
 * One column below 1024 rather than two: a comparison slider halves its own
 * usable width the moment it is placed in a narrow column, and a portrait figure
 * with a draggable handle needs the room.
 */

export interface BeforeAfterSectionProps {
  readonly copy: SectionCopy;
  readonly pairs: readonly BeforeAfterPair[];
  readonly tone?: SectionGround;
  readonly id?: string;
}

const HEADING_ID = 'before-after-heading';

export function BeforeAfterSection({
  copy,
  pairs,
  tone = 'ivory-alt',
  id,
}: BeforeAfterSectionProps) {
  return (
    <Section id={id} tone={tone} labelledBy={HEADING_ID}>
      <Container className="flex flex-col gap-10 lg:gap-14">
        <SectionHeading
          id={HEADING_ID}
          eyebrow={copy.eyebrow}
          lead={copy.intro}
          action={
            copy.ctaLabel && copy.ctaHref ? (
              <TrackedCta
                href={copy.ctaHref}
                channel="portfolio"
                location="before_after"
                variant="secondary"
              >
                {copy.ctaLabel}
              </TrackedCta>
            ) : undefined
          }
        >
          {copy.heading}
        </SectionHeading>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
          {pairs.map((pair) => (
            <BeforeAfterSlider key={pair.id} pair={pair} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
