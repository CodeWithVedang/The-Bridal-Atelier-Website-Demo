import { IconArrowRight } from '@/components/icons';
import { Container, Eyebrow, Rule, Section } from '@/components/primitives';

import { TrackedCta } from './TrackedCta';

import type { CtaChannel } from './TrackedCta';
import type { SectionGround } from './types';

/**
 * The closing statement that ends most pages (docs/UI_SPEC.md §7 signature 5).
 *
 * Short, centred, wide margins, on ivory-100 — and deliberately **image-free**.
 * The page already carries large artwork in the hero, the portfolio and the
 * looks; a fourth image here, immediately above a dark footer, would leave the
 * page ending on three heavy bands in a row. The last thing a bride reads before
 * the footer should be one sentence and one button.
 *
 * Both CTAs are tracked, and the channels are props rather than inferred from
 * position: the copy module holds language, not analytics vocabulary
 * (docs/ANALYTICS_SPEC.md §2 allows exactly six channels).
 *
 * No urgency device of any kind — no countdown, no "only N dates left", no
 * discount. The reason to act is the next step being small, and the copy says so
 * (docs/PSYCHOLOGY_SPEC.md §5, §6).
 */

export interface CtaBandCopy {
  readonly eyebrow: string;
  readonly heading: string;
  readonly body: string;
  readonly primaryCta: { readonly label: string; readonly href: string };
  readonly secondaryCta?: { readonly label: string; readonly href: string };
}

export interface CtaBandProps {
  readonly copy: CtaBandCopy;
  /** Appears in `cta_clicked` as `location`, e.g. `closing_home`. */
  readonly location: string;
  readonly primaryChannel?: CtaChannel;
  readonly secondaryChannel?: CtaChannel;
  /** One quiet line under the buttons — usually the no-payment disclosure. */
  readonly note?: string;
  readonly tone?: SectionGround;
  readonly id?: string;
}

const HEADING_ID = 'closing-cta-heading';

export function CtaBand({
  copy,
  location,
  primaryChannel = 'consultation',
  secondaryChannel = 'availability',
  note,
  tone = 'ivory-alt',
  id,
}: CtaBandProps) {
  return (
    <Section id={id} tone={tone} labelledBy={HEADING_ID}>
      <Container width="narrow" className="flex flex-col items-center gap-6 text-center">
        <Rule ornament className="max-w-24" />
        <Eyebrow>{copy.eyebrow}</Eyebrow>
        <h2 id={HEADING_ID} className="max-w-[24ch] text-display-lg">
          {copy.heading}
        </h2>
        <p className="max-w-[58ch] text-body-md leading-relaxed text-espresso-700">{copy.body}</p>

        <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
          <TrackedCta
            href={copy.primaryCta.href}
            channel={primaryChannel}
            location={location}
            size="lg"
            trailingIcon={<IconArrowRight className="size-4" />}
          >
            {copy.primaryCta.label}
          </TrackedCta>
          {copy.secondaryCta ? (
            <TrackedCta
              href={copy.secondaryCta.href}
              channel={secondaryChannel}
              location={location}
              variant="secondary"
              size="lg"
            >
              {copy.secondaryCta.label}
            </TrackedCta>
          ) : null}
        </div>

        {note ? <p className="text-body-sm text-stone-500">{note}</p> : null}
      </Container>
    </Section>
  );
}
