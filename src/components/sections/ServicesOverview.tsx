import Link from 'next/link';

import { IconArrowRight } from '@/components/icons';
import { Container, Eyebrow, Section, SectionHeading, TextLink } from '@/components/primitives';

import type { SectionCopy, SectionGround } from './types';
import type { ServiceCategory } from '@/types/content';

/**
 * The five service categories (brief §8, docs/UI_SPEC.md §7 signature 2).
 *
 * A hairline list, not a grid of cards. Five bordered boxes would read as five
 * products to choose between, and that is the wrong model: the studio sells a
 * planned wedding, and the categories are the parts of one brief. Rules between
 * rows, generous vertical space, and the count sitting quietly at the end.
 *
 * The whole row is the target. That is a `before:absolute before:inset-0`
 * stretched link on the heading anchor rather than a wrapping `<a>` — wrapping
 * would put the summary text inside the link name, so a screen-reader link list
 * would read the entire paragraph. `before` and not `after`, because
 * `underline-draw` already owns `::after` (see `globals.css`).
 */

export interface ServicesOverviewProps {
  readonly copy: SectionCopy;
  readonly categories: readonly ServiceCategory[];
  /** Keyed by category slug. Rendered as a fact, not as an inducement. */
  readonly serviceCounts: Readonly<Record<string, number>>;
  readonly tone?: SectionGround;
  readonly id?: string;
}

const HEADING_ID = 'services-heading';

export function ServicesOverview({
  copy,
  categories,
  serviceCounts,
  tone = 'ivory-alt',
  id,
}: ServicesOverviewProps) {
  return (
    <Section id={id} tone={tone} labelledBy={HEADING_ID}>
      <Container className="flex flex-col gap-10 lg:gap-14">
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

        <ul>
          {categories.map((category) => {
            const count = serviceCounts[category.slug];

            return (
              <li
                key={category.slug}
                className="group relative border-b border-sand-300 first:border-t"
              >
                <div className="flex flex-col gap-3 py-7 md:flex-row md:items-baseline md:gap-8 lg:gap-12 lg:py-9">
                  <div className="flex flex-col gap-2 md:w-[30%] md:shrink-0">
                    <Eyebrow tone="stone">{category.eyebrow}</Eyebrow>
                    <h3 className="text-display-sm">
                      <Link
                        href={`/services/${category.slug}`}
                        className="underline-draw before:absolute before:inset-0 before:content-['']"
                      >
                        {category.name}
                      </Link>
                    </h3>
                  </div>

                  <p className="max-w-[58ch] flex-1 text-body-md text-espresso-700">
                    {category.summary}
                  </p>

                  <p className="flex items-center gap-3 text-body-sm text-stone-500 md:w-36 md:shrink-0 md:justify-end">
                    {typeof count === 'number' ? (
                      <span>
                        {count} {count === 1 ? 'service' : 'services'}
                      </span>
                    ) : null}
                    <IconArrowRight
                      className="size-4 shrink-0 transition-transform duration-(--dur-fast) ease-(--ease-editorial) group-hover:translate-x-1"
                    />
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
