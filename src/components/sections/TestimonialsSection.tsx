import { Quote, Reveal } from '@/components/content';
import { Container, Section, SectionHeading, TextLink } from '@/components/primitives';

import type { SectionCopy, SectionGround } from './types';
import type { Testimonial } from '@/types/content';

/**
 * Testimonials (brief §14).
 *
 * The centred-statement rhythm from docs/UI_SPEC.md §7 signature 5: the first
 * quote is set large and centred with wide margins, and the rest sit in a
 * hairline-topped grid underneath. No cards, no star ratings, no carousel — a
 * carousel hides five of six quotes behind a control nobody uses and takes the
 * page's reading order away from the reader.
 *
 * **One provenance note per block, not one per quote.** docs/DECISION_LOG.md D3
 * requires a visible note on the block plus the footer disclosure; `sample` is
 * therefore passed to the lead quote — the one large enough to be lifted out of
 * context — while the section's own intro copy states it for the group. Printing
 * the same sentence six times would read as boilerplate, which is its own kind of
 * dishonesty (brief §37).
 *
 * `packageNames` is optional: without it the meta line is just the city. The
 * section never imports the packages module itself, because a section that
 * reaches for a second content module stops being reusable
 * (docs/UI_SPEC.md §6).
 */

export interface TestimonialsSectionProps {
  readonly copy: SectionCopy;
  readonly testimonials: readonly Testimonial[];
  /** Slug → display name, so a quote can say which package it refers to. */
  readonly packageNames?: Readonly<Record<string, string>>;
  readonly tone?: SectionGround;
  readonly id?: string;
}

const HEADING_ID = 'testimonials-heading';

export function TestimonialsSection({
  copy,
  testimonials,
  packageNames,
  tone = 'ivory-alt',
  id,
}: TestimonialsSectionProps) {
  const [lead, ...rest] = testimonials;

  function meta(item: Testimonial): string {
    const packageName = packageNames?.[item.packageSlug];
    return packageName ? `${item.city} · ${packageName}` : item.city;
  }

  return (
    <Section id={id} tone={tone} labelledBy={HEADING_ID}>
      <Container className="flex flex-col gap-12 lg:gap-16">
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

        {lead ? (
          <Reveal>
            <Quote
              quote={lead.quote}
              attribution={lead.attribution}
              meta={meta(lead)}
              sample={lead.sample}
              size="lg"
              className="mx-auto max-w-3xl items-center text-center"
            />
          </Reveal>
        ) : null}

        {rest.length > 0 ? (
          <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-10 lg:grid-cols-3 lg:gap-x-8">
            {rest.map((item) => (
              <li key={item.id} className="border-t border-sand-300 pt-6">
                <Quote quote={item.quote} attribution={item.attribution} meta={meta(item)} />
              </li>
            ))}
          </ul>
        ) : null}
      </Container>
    </Section>
  );
}
