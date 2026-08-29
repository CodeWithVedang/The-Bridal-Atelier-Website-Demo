import { ComparisonTable } from '@/components/content';
import { Container, Section } from '@/components/primitives';
import {
  CtaBand,
  FaqSection,
  InvestmentFactorsSection,
  PackagesSection,
  PageHeader,
  TestimonialsSection,
} from '@/components/sections';
import { comparisonRows, investmentFactors } from '@/content/packages';
import { closingCta, disclosures } from '@/content/site-copy';
import { nameMap } from '@/lib/form-options';
import { graph, offerNode } from '@/lib/jsonld';
import { getContentRepository } from '@/lib/repositories';
import { pageMetadata, trail } from '@/lib/seo';
import { formatRupees } from '@/lib/utils';

import type { Metadata } from 'next';

/**
 * The packages page (brief §21).
 *
 * Three decisions worth naming, all of them about not being a pricing page:
 *
 *  - **Starting figures are published.** Hidden pricing exists to force a
 *    conversation, and forcing a conversation is the opposite of what a bride
 *    doing research at eleven at night needs (docs/PSYCHOLOGY_SPEC.md §3).
 *  - **No discounts, no strike-throughs, no "save" language.** The middle package
 *    is marked by what it fits — "most chosen for a two-day wedding" — not by an
 *    invented popularity count (brief §9).
 *  - **Exclusions are listed as prominently as inclusions.** Every package says
 *    what it does *not* cover, because that is the list that causes an argument
 *    later if it only exists in a coordinator's head.
 *
 * The comparison table follows the cards rather than replacing them: cards are
 * how a package is chosen, a table is how a choice is checked.
 */

export const metadata: Metadata = pageMetadata({
  title: 'Bridal packages',
  description:
    'Three bridal packages sized by how many functions you have, each with published starting investment, what is included, what is not, and the trial and travel policy.',
  path: '/packages',
});

const CRUMBS = trail({ label: 'Packages', href: '/packages' });

export default async function PackagesPage() {
  const repo = getContentRepository();
  const [packages, faqs, testimonials] = await Promise.all([
    repo.listPackages(),
    repo.listFaqs('packages'),
    repo.listTestimonials(),
  ]);

  const cheapest = packages.reduce(
    (low, pkg) => (pkg.startingInvestment < low ? pkg.startingInvestment : low),
    Number.POSITIVE_INFINITY,
  );

  return (
    <>
      <PageHeader
        crumbs={CRUMBS}
        eyebrow="Investment"
        heading="Three packages, sized by your wedding"
        lead="Choose by the shape of the wedding rather than by tier. Each package lists what is included, what is not, and the figure it starts at — so you never have to ask before you know whether you like us."
        meta={[
          `Starting from ${formatRupees(cheapest)}`,
          'A trial is included with every wedding booking',
          'No payment is taken through this site',
        ]}
      />

      <PackagesSection
        copy={{
          eyebrow: 'The packages',
          heading: 'What each one covers',
          intro:
            'Figures are starting investments for the bride. Family and bridal-party looks are quoted per person, because they are parallel work rather than a bigger version of the same job.',
        }}
        packages={packages}
        withDetail
        tone="ivory-alt"
        id="packages"
      />

      <Section tone="ivory" id="compare">
        <Container className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h2 className="max-w-2xl text-display-md">Side by side</h2>
            <p className="max-w-[62ch] text-body-md text-espresso-700">
              The same ten questions answered for all three packages. Scroll the table sideways on a
              phone — the row labels stay in place.
            </p>
          </div>
          <ComparisonTable
            caption="What each bridal package includes, compared across ten dimensions"
            rowHeader="What you get"
            columns={packages.map((pkg) => ({
              id: pkg.slug,
              label: pkg.name,
              note: `From ${formatRupees(pkg.startingInvestment)}`,
              highlighted: pkg.recommended,
            }))}
            rows={comparisonRows}
          />
        </Container>
      </Section>

      <InvestmentFactorsSection
        copy={{
          eyebrow: 'What moves the figure',
          heading: 'Why a quotation differs from a starting price',
          intro:
            'Six things change what a wedding costs to staff. None of them is a surprise on the invoice — all six are settled in writing before you book.',
        }}
        factors={investmentFactors}
        tone="inset"
        id="factors"
      />

      <TestimonialsSection
        copy={{
          eyebrow: 'In their words',
          heading: 'Brides on what they actually chose',
          intro: disclosures.sampleContent,
        }}
        testimonials={testimonials}
        packageNames={nameMap(packages)}
        tone="ivory"
      />

      <FaqSection
        copy={{
          eyebrow: 'Before you enquire',
          heading: 'Questions about the packages',
          intro:
            'If a question about scope is not answered here, ask it in the consultation form and it gets answered in writing.',
        }}
        faqs={faqs}
        tone="ivory-alt"
        id="faqs"
      />

      <CtaBand
        copy={closingCta}
        location="closing_packages"
        note={disclosures.noPaymentTaken}
        tone="ivory"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: graph(...packages.map((pkg) => offerNode(pkg))) }}
      />
    </>
  );
}
