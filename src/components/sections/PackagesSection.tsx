import { IconCheck, IconMinus } from '@/components/icons';
import { cn } from '@/lib/cn';
import { Badge, Container, Section, SectionHeading } from '@/components/primitives';
import { formatRupees } from '@/lib/utils';

import { TrackInView } from './TrackInView';
import { TrackedCta } from './TrackedCta';

import type { SectionCopy, SectionGround } from './types';
import type { BridalPackage } from '@/types/content';

/**
 * The three bridal packages (brief §9, docs/UI_SPEC.md §7 signature 3).
 *
 * A three-column plinth in which **only the recommended package is filled**. The
 * usual pattern — three identical cards, the middle one scaled up and crowned
 * with "MOST POPULAR" — is a pricing table, and a pricing table makes a bride
 * choose a tier when the actual question is how many functions she has. So the
 * emphasis is a ground and a badge, nothing is enlarged, and the middle card's
 * own copy says what it *fits* rather than how many people bought it
 * (docs/DECISION_LOG.md D2).
 *
 * Order is the natural content order at every width except below `lg`, where the
 * recommended package is hoisted to the top: on a phone, three long cards in
 * sequence means the one most brides need is two screens down
 * (docs/UX_SPEC.md §6). DOM order is left alone so that keyboard order matches
 * the visual order on the wide layout, where a keyboard is actually likely.
 *
 * `withDetail` is the `/packages` variant: it adds every inclusion, every
 * exclusion and both policies. The home page shows the three facts that decide
 * the choice — functions, artists, trials — and the published starting figure.
 *
 * `package_viewed` is a viewport event, not a click (docs/ANALYTICS_SPEC.md §2),
 * so each card is wrapped in `TrackInView`; the section itself stays a Server
 * Component.
 */

export interface PackagesSectionProps {
  readonly copy: SectionCopy;
  readonly packages: readonly BridalPackage[];
  /** Adds inclusions, exclusions and the trial/travel policies. */
  readonly withDetail?: boolean;
  readonly tone?: SectionGround;
  readonly id?: string;
}

const HEADING_ID = 'packages-heading';

function artistLine(count: number): string {
  return count === 1 ? 'One artist' : `${count} artists`;
}

function Fact({ term, value }: { readonly term: string; readonly value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5">
      <dt className="shrink-0 text-body-sm text-stone-500">{term}</dt>
      <dd className="text-end text-body-sm text-espresso-900">{value}</dd>
    </div>
  );
}

export function PackagesSection({
  copy,
  packages,
  withDetail = false,
  tone = 'ivory',
  id,
}: PackagesSectionProps) {
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
                channel="packages"
                location="packages_section"
                variant="secondary"
              >
                {copy.ctaLabel}
              </TrackedCta>
            ) : undefined
          }
        >
          {copy.heading}
        </SectionHeading>

        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3">
          {packages.map((item) => (
            <TrackInView
              key={item.slug}
              event="package_viewed"
              props={{ package_slug: item.slug }}
              className={cn('flex', item.recommended && 'max-lg:order-first')}
            >
              <article
                id={`package-${item.slug}`}
                aria-labelledby={`package-${item.slug}-name`}
                className={cn(
                  'flex w-full flex-col gap-5 border p-6 scroll-mt-(--header-h) lg:p-8',
                  item.recommended
                    ? 'border-espresso-900/25 bg-ivory-100 shadow-sm'
                    : 'border-sand-300',
                )}
              >
                <div className="flex flex-col gap-3">
                  {item.recommended ? (
                    <Badge tone="gold" className="self-start">
                      Most chosen
                    </Badge>
                  ) : null}
                  <h3 id={`package-${item.slug}-name`} className="text-display-sm">
                    {item.name}
                  </h3>
                  <p className="text-body-sm text-gold-600">{item.fitStatement}</p>
                </div>

                <p className="text-body-sm leading-relaxed text-espresso-700">{item.summary}</p>

                <p className="flex flex-col gap-1">
                  <span className="text-label uppercase text-stone-500">Starting investment</span>
                  <span className="text-display-sm text-espresso-900">
                    {formatRupees(item.startingInvestment)}
                  </span>
                </p>

                <dl className="divide-y divide-sand-300 border-y border-sand-300">
                  <Fact term="Functions" value={item.functionsCovered} />
                  <Fact term="On site" value={artistLine(item.artistCount)} />
                </dl>

                {withDetail ? (
                  <PackageDetail item={item} />
                ) : (
                  <p className="text-body-xs text-stone-500">
                    {item.includes.length} inclusions listed in full on the packages page.
                  </p>
                )}
                <TrackedCta
                  href="/book"
                  channel="consultation"
                  location={`package_${item.slug}`}
                  variant={item.recommended ? 'primary' : 'secondary'}
                  className="mt-auto"
                  fullWidth
                >
                  Book a consultation
                </TrackedCta>
              </article>
            </TrackInView>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/**
 * The `/packages` detail block: every inclusion, every exclusion, both policies.
 *
 * Exclusions are stated as plainly as inclusions and in the same weight of type.
 * A package page that lists only what you get leaves the bride to discover the
 * boundary in the quote (docs/CONTENT_SPEC.md §7).
 */
function PackageDetail({ item }: { readonly item: BridalPackage }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h4 className="text-label uppercase text-stone-500">What is included</h4>
        <ul className="flex flex-col gap-2.5">
          {item.includes.map((inclusion) => (
            <li key={inclusion.label} className="flex gap-2.5">
              <IconCheck className="mt-0.5 size-4 shrink-0 text-gold-600" />
              <span className="text-body-sm leading-relaxed">
                <span className="text-espresso-900">{inclusion.label}</span>
                {inclusion.detail ? (
                  <span className="text-espresso-700"> — {inclusion.detail}</span>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="text-label uppercase text-stone-500">Not included</h4>
        <ul className="flex flex-col gap-2.5">
          {item.excludes.map((exclusion) => (
            <li key={exclusion} className="flex gap-2.5">
              <IconMinus className="mt-0.5 size-4 shrink-0 text-stone-500" />
              <span className="text-body-sm leading-relaxed text-espresso-700">{exclusion}</span>
            </li>
          ))}
        </ul>
      </div>

      <dl className="flex flex-col gap-4 border-t border-sand-300 pt-5">
        <div className="flex flex-col gap-1">
          <dt className="text-label uppercase text-stone-500">The trial</dt>
          <dd className="text-body-sm leading-relaxed text-espresso-700">{item.trialPolicy}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-label uppercase text-stone-500">Travel</dt>
          <dd className="text-body-sm leading-relaxed text-espresso-700">{item.travelPolicy}</dd>
        </div>
      </dl>
    </div>
  );
}

export interface InvestmentFactor {
  readonly label: string;
  readonly detail: string;
}

export interface InvestmentFactorsSectionProps {
  readonly copy: SectionCopy;
  readonly factors: readonly InvestmentFactor[];
  readonly tone?: SectionGround;
  readonly id?: string;
}

/**
 * "What changes the investment" (docs/UX_SPEC.md §3, `/packages`).
 *
 * The counterpart to publishing a starting figure: "from ₹85,000" is only honest
 * if the bride can also see what moves it. Six factors, stated plainly, and not
 * one of them is a discount, an offer or a deadline
 * (docs/PSYCHOLOGY_SPEC.md §5, §6).
 */
export function InvestmentFactorsSection({
  copy,
  factors,
  tone = 'inset',
  id,
}: InvestmentFactorsSectionProps) {
  const headingId = `${id ?? 'investment'}-heading`;

  return (
    <Section id={id} tone={tone} labelledBy={headingId}>
      <Container className="flex flex-col gap-10 lg:gap-12">
        <SectionHeading id={headingId} eyebrow={copy.eyebrow} lead={copy.intro} size="md">
          {copy.heading}
        </SectionHeading>

        <dl className="grid grid-cols-1 border-t border-sand-400 md:grid-cols-2 md:gap-x-12">
          {factors.map((factor) => (
            <div key={factor.label} className="flex flex-col gap-1.5 border-b border-sand-400 py-5">
              <dt className="text-body-md font-medium text-espresso-900">{factor.label}</dt>
              <dd className="max-w-[52ch] text-body-sm leading-relaxed text-espresso-700">
                {factor.detail}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
