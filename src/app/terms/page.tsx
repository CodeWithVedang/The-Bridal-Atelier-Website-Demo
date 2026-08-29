import Link from 'next/link';

import { Container, Rule, Section } from '@/components/primitives';
import { PageHeader } from '@/components/sections';
import { LAST_REVIEWED, termsSections } from '@/content/legal';
import { disclosures } from '@/content/site-copy';
import { breadcrumbNode, graph } from '@/lib/jsonld';
import { pageMetadata, trail } from '@/lib/seo';

import type { Metadata } from 'next';

/**
 * Terms (docs/CONTENT_SPEC.md §10).
 *
 * The first section does the work the rest of the page depends on: this is a
 * fictional studio, so nothing here is an offer capable of acceptance. Saying
 * that plainly at the top is more honest than a page of enforceable-sounding
 * clauses for a business that does not trade.
 *
 * The cancellation terms are restated here rather than left only on the packages
 * page, because a policy that appears solely next to a price reads as a sales
 * detail instead of a term.
 */

export const metadata: Metadata = pageMetadata({
  title: 'Terms',
  description:
    'The terms this demonstration build describes: enquiries rather than bookings, rule-based availability, what a trial includes, and the intended cancellation policy stated in plain words.',
  path: '/terms',
});

const CRUMBS = trail({ label: 'Terms', href: '/terms' });

const REVIEWED = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
}).format(new Date(`${LAST_REVIEWED}T00:00:00Z`));

export default function TermsPage() {
  return (
    <>
      <PageHeader
        crumbs={CRUMBS}
        eyebrow="Terms"
        heading="What is promised, and what is not"
        lead="Short, and in the same voice as the rest of the site. This is a demonstration brand, so the first thing worth saying is that nothing here forms a contract — and the second is what the described service would actually commit to."
        meta={[`Last reviewed ${REVIEWED}`, 'No payment is taken', 'Enquiry, not a booking']}
      />

      <Section tone="ivory">
        <Container width="narrow" className="flex flex-col gap-12">
          {termsSections.map((section) => (
            <section key={section.heading} className="flex flex-col gap-4">
              <h2 className="text-display-sm">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="text-body-md leading-relaxed text-espresso-700"
                >
                  {paragraph}
                </p>
              ))}
              {section.bullets ? (
                <ul className="flex flex-col gap-2 pl-5">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="list-disc text-body-md text-espresso-700">
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </Container>
      </Section>

      <Section tone="ivory-alt" spacing="tight">
        <Container width="narrow" className="flex flex-col gap-4">
          <h2 className="text-display-sm">Related pages</h2>
          <p className="text-body-md text-espresso-700">
            What happens to what you type is on the privacy page, including the photography credits.
            What each package includes — and the same cancellation terms in the context of a price —
            is on the packages page.
          </p>
          <Rule tone="sand" />
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link
                href="/privacy"
                className="underline-draw inline-flex min-h-11 items-center text-body-sm font-medium text-espresso-900"
              >
                Privacy
              </Link>
            </li>
            <li>
              <Link
                href="/packages"
                className="underline-draw inline-flex min-h-11 items-center text-body-sm font-medium text-espresso-900"
              >
                Packages
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="underline-draw inline-flex min-h-11 items-center text-body-sm font-medium text-espresso-900"
              >
                Contact
              </Link>
            </li>
          </ul>
        </Container>
      </Section>

      <Section tone="inset" spacing="tight">
        <Container width="narrow" className="flex flex-col gap-2">
          <p className="text-body-sm text-espresso-700">{disclosures.demonstrationSite}</p>
          <p className="text-body-xs text-stone-500">{disclosures.inMemoryData}</p>
        </Container>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: graph(breadcrumbNode(CRUMBS)) }}
      />
    </>
  );
}
