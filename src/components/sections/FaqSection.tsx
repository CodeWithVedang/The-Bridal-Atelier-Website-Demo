import { Accordion } from '@/components/content';
import { Container, Section, SectionHeading, TextLink } from '@/components/primitives';

import type { SectionCopy, SectionGround } from './types';
import type { Faq } from '@/types/content';

/**
 * FAQs (brief §33 states, docs/UX_SPEC.md §3).
 *
 * A 4/7 split with the heading sticky on wide viewports: the questions are the
 * content here, and a heading that scrolls away leaves a long list of
 * disclosures with nothing naming them. Below `lg` it is a plain stack, because
 * a sticky block on a phone eats the screen the answers need.
 *
 * `grouped` splits the set by topic with an `<h3>` each — used where the whole
 * set is shown (`/packages#faqs`). The home page passes a short unsorted list
 * and gets one accordion.
 *
 * The disclosure itself is native `<details>`; see `Accordion` for why. Nothing
 * is open by default unless the caller says so: pre-opening the first answer
 * pushes the second question below the fold and makes the list look shorter than
 * it is.
 */

export interface FaqSectionProps {
  readonly copy: SectionCopy;
  readonly faqs: readonly Faq[];
  /** Splits the list into topic groups, each with its own heading. */
  readonly grouped?: boolean;
  /** Ids to render already open — usually none. */
  readonly openIds?: readonly string[];
  readonly tone?: SectionGround;
  readonly id?: string;
}

const HEADING_ID = 'faq-heading';

/** Render order for the grouped variant; also the group labels. */
const TOPICS: readonly { readonly topic: Faq['topic']; readonly label: string }[] = [
  { topic: 'booking', label: 'Booking and dates' },
  { topic: 'packages', label: 'Packages and investment' },
  { topic: 'trial', label: 'The trial' },
  { topic: 'day-of', label: 'On the wedding day' },
];

function toItems(faqs: readonly Faq[]) {
  return faqs.map((faq) => ({ id: faq.id, question: faq.question, answer: faq.answer }));
}

function byOrder(faqs: readonly Faq[]): readonly Faq[] {
  return [...faqs].sort((a, b) => a.order - b.order);
}

export function FaqSection({
  copy,
  faqs,
  grouped = false,
  openIds,
  tone = 'ivory',
  id,
}: FaqSectionProps) {
  return (
    <Section id={id} tone={tone} labelledBy={HEADING_ID}>
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col gap-5 lg:col-span-4 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
          <SectionHeading id={HEADING_ID} eyebrow={copy.eyebrow} lead={copy.intro} size="md">
            {copy.heading}
          </SectionHeading>
          {copy.ctaLabel && copy.ctaHref ? (
            <TextLink href={copy.ctaHref} withArrow className="self-start">
              {copy.ctaLabel}
            </TextLink>
          ) : null}
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          {grouped ? (
            <div className="flex flex-col gap-10">
              {TOPICS.map(({ topic, label }) => {
                const group = byOrder(faqs.filter((faq) => faq.topic === topic));
                if (group.length === 0) return null;

                return (
                  <div key={topic} className="flex flex-col gap-4">
                    <h3 className="text-label uppercase text-stone-500">{label}</h3>
                    <Accordion items={toItems(group)} openIds={openIds} />
                  </div>
                );
              })}
            </div>
          ) : (
            <Accordion items={toItems(faqs)} openIds={openIds} />
          )}
        </div>
      </Container>
    </Section>
  );
}
