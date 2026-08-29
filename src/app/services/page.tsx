import Link from 'next/link';

import { Container, Eyebrow, Rule, Section } from '@/components/primitives';
import { CtaBand, PageHeader, ServicesOverview } from '@/components/sections';
import { closingCta, disclosures } from '@/content/site-copy';
import { graph, serviceNode } from '@/lib/jsonld';
import { getContentRepository } from '@/lib/repositories';
import { pageMetadata, trail } from '@/lib/seo';
import { formatDuration } from '@/lib/utils';

import type { Metadata } from 'next';

/**
 * The services hub (brief §20).
 *
 * Every service on the site is listed here, in its category, with its duration —
 * and no prices. Pricing lives at package level, which is a stated position
 * rather than an omission: a per-service price list turns a wedding into a
 * shopping cart and makes the bride the one responsible for assembling a
 * complete brief (docs/CONTENT_SPEC.md §3). The link out to each category page
 * is where the detail and the preparation note live.
 *
 * `Service` JSON-LD is emitted per category with its offer count, and nothing
 * carries a price, because a `priceSpecification` on a fictional studio's
 * services would be a machine-readable claim we cannot stand behind.
 */

export const metadata: Metadata = pageMetadata({
  title: 'Bridal services',
  description:
    'Every bridal service in one place: makeup, hair, skin preparation, hair treatments and grooming. Grouped by category with durations, priced at package level.',
  path: '/services',
});

const CRUMBS = trail({ label: 'Services', href: '/services' });

export default async function ServicesPage() {
  const repo = getContentRepository();
  const [categories, services] = await Promise.all([
    repo.listServiceCategories(),
    repo.listServices(),
  ]);

  const counts: Record<string, number> = {};
  for (const service of services) {
    counts[service.categorySlug] = (counts[service.categorySlug] ?? 0) + 1;
  }

  return (
    <>
      <PageHeader
        crumbs={CRUMBS}
        eyebrow="Services"
        heading="Hair, makeup and skin — planned as one brief"
        lead="Five categories across the whole wedding week. Durations are listed so a timeline can be built from them; the investment sits at package level rather than per service."
        meta={[
          `${categories.length} categories`,
          `${services.length} services`,
          'Priced at package level',
        ]}
      />

      <ServicesOverview
        copy={{
          eyebrow: 'By category',
          heading: 'Where to start',
          intro:
            'Each category page carries what is involved, how it is prepared for, and the look it usually belongs to.',
        }}
        categories={categories}
        serviceCounts={counts}
        tone="ivory-alt"
      />

      <Section tone="ivory" id="all-services">
        <Container className="flex flex-col gap-14">
          <div className="flex flex-col gap-4">
            <Eyebrow tone="gold">The full list</Eyebrow>
            <h2 className="max-w-2xl text-display-md">Every service, with its duration</h2>
            <p className="max-w-[62ch] text-body-md text-espresso-700">
              Times are the studio allowance for one person, including consultation and
              adjustments. Trials and wedding-day work are scheduled from these figures.
            </p>
          </div>

          {categories.map((category) => {
            const rows = services.filter((service) => service.categorySlug === category.slug);
            const headingId = `services-${category.slug}`;
            return (
              <section key={category.slug} aria-labelledby={headingId} className="flex flex-col gap-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <h3 id={headingId} className="text-display-sm">
                    {category.name}
                  </h3>
                  <Link
                    href={`/services/${category.slug}`}
                    className="underline-draw text-body-sm font-medium text-espresso-900"
                  >
                    {category.name} in detail
                  </Link>
                </div>
                <Rule tone="sand" />
                <dl className="grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-2">
                  {rows.map((service) => (
                    <div key={service.slug} className="flex flex-col gap-1">
                      <dt className="flex flex-wrap items-baseline justify-between gap-x-4">
                        <span className="text-body-md font-medium text-espresso-900">
                          {service.name}
                        </span>
                        <span className="text-body-xs text-stone-500">
                          {formatDuration(service.durationMinutes)}
                        </span>
                      </dt>
                      <dd className="text-body-sm text-espresso-700">{service.summary}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            );
          })}
        </Container>
      </Section>

      <CtaBand
        copy={closingCta}
        location="closing_services"
        note={disclosures.noPaymentTaken}
        tone="ivory-alt"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: graph(
            ...categories.map((category) => serviceNode(category, counts[category.slug] ?? 0)),
          ),
        }}
      />
    </>
  );
}
