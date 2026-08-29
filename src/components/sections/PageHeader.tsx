import { Breadcrumbs } from '@/components/navigation';
import { Container, Rule, Section, SectionHeading } from '@/components/primitives';

import type { SectionTone } from '@/components/primitives';
import type { Crumb } from '@/lib/seo';
import type { ReactNode } from 'react';

/**
 * The opening block of every inner page (docs/UI_SPEC.md §5).
 *
 * One component rather than a hand-rolled header per route, for the reasons that
 * usually go wrong when it is repeated twelve times:
 *
 *  - **Exactly one `<h1>`.** `level={1}` is fixed here, so no page can ship with
 *    two or none (docs/SEO_SPEC.md §3).
 *  - **The trail and its `BreadcrumbList` markup come from one array.** That is
 *    `Breadcrumbs`' guarantee; this component's job is simply to always pass it.
 *  - **The heading is the page's accessible name for the region**, via
 *    `aria-labelledby` on the `Section`.
 *
 * `spacing="tight"` because a page header sits directly under a fixed site
 * header: full section padding above an `<h1>` reads as an empty screen on a
 * phone. `meta` takes short factual lines — a count, a duration, a starting
 * figure — that would weigh down the lead paragraph.
 */

export interface PageHeaderProps {
  readonly crumbs: readonly Crumb[];
  readonly eyebrow: string;
  readonly heading: string;
  readonly lead?: ReactNode;
  /** Buttons or links belonging to the page as a whole. */
  readonly actions?: ReactNode;
  /** Short factual lines rendered under the lead, separated by a rule. */
  readonly meta?: readonly string[];
  readonly tone?: SectionTone;
}

const HEADING_ID = 'page-heading';

export function PageHeader({
  crumbs,
  eyebrow,
  heading,
  lead,
  actions,
  meta,
  tone = 'ivory',
}: PageHeaderProps) {
  return (
    <Section tone={tone} spacing="tight" labelledBy={HEADING_ID}>
      <Container className="flex flex-col gap-8">
        <Breadcrumbs crumbs={crumbs} />
        <SectionHeading
          id={HEADING_ID}
          level={1}
          size="xl"
          eyebrow={eyebrow}
          lead={lead}
          action={actions}
        >
          {heading}
        </SectionHeading>
        {meta && meta.length > 0 ? (
          <div className="flex flex-col gap-4">
            <Rule tone="sand" />
            <ul className="flex flex-col gap-2 text-body-sm text-espresso-700 sm:flex-row sm:flex-wrap sm:gap-x-8">
              {meta.map((line) => (
                <li key={line} className="flex items-baseline gap-2">
                  <span aria-hidden="true" className="text-gold-600">
                    ·
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
