import Link from 'next/link';
import { notFound } from 'next/navigation';

import { EditorialImage } from '@/components/content';
import { Badge, Container, Eyebrow, Prose, Rule, Section } from '@/components/primitives';
import { CtaBand, PageHeader } from '@/components/sections';
import { getImage } from '@/content/images';
import { closingCta, disclosures } from '@/content/site-copy';
import { graph, serviceNode } from '@/lib/jsonld';
import { getContentRepository } from '@/lib/repositories';
import { pageMetadata, trail } from '@/lib/seo';
import { formatDuration } from '@/lib/utils';

import type { Metadata } from 'next';

/**
 * One service category (docs/ARCHITECTURE.md §4).
 *
 * Statically generated for all five categories: the set is content, it changes
 * when someone edits `src/content/services.ts`, and there is nothing per-request
 * on the page. An unknown slug is a genuine 404 via `notFound()` rather than an
 * empty page — a soft 404 is worse than a hard one for both visitors and crawlers.
 *
 * The preparation note is given its own block rather than folded into the prose.
 * It is the part that changes what a bride does *before* she arrives, which makes
 * it the most actionable sentence on the page.
 */

export async function generateStaticParams() {
  const categories = await getContentRepository().listServiceCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/services/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const category = await getContentRepository().getServiceCategory(slug);
  if (!category) return pageMetadata({ title: 'Service not found', description: 'This service category does not exist. Browse the five bridal service categories the studio offers instead.', path: `/services/${slug}`, noindex: true });

  return pageMetadata({
    title: category.name,
    description: category.summary,
    path: `/services/${category.slug}`,
    ogImagePath: getImage(category.imageId).src,
  });
}

export default async function ServiceCategoryPage({ params }: PageProps<'/services/[slug]'>) {
  const { slug } = await params;
  const repo = getContentRepository();
  const category = await repo.getServiceCategory(slug);
  if (!category) notFound();

  const [services, looks, categories] = await Promise.all([
    repo.listServices(category.slug),
    repo.listBridalLooks(),
    repo.listServiceCategories(),
  ]);

  const relatedLook = looks.find((look) => look.slug === category.relatedLookSlug);
  const others = categories.filter((row) => row.slug !== category.slug);
  const totalMinutes = services.reduce((sum, service) => sum + service.durationMinutes, 0);

  return (
    <>
      <PageHeader
        crumbs={trail(
          { label: 'Services', href: '/services' },
          { label: category.name, href: `/services/${category.slug}` },
        )}
        eyebrow={category.eyebrow}
        heading={category.name}
        lead={category.summary}
        meta={[
          `${services.length} services`,
          `Longest single appointment ${formatDuration(Math.max(...services.map((s) => s.durationMinutes)))}`,
          'Included in every package at the stated level',
        ]}
      />

      <Section tone="ivory-alt">
        <Container className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col gap-8 lg:col-span-7">
            <Prose>
              <p>{category.detail}</p>
            </Prose>
            <div className="hairline flex flex-col gap-2 bg-ivory-50 p-6">
              <Eyebrow tone="gold">How to prepare</Eyebrow>
              <p className="text-body-md text-espresso-800">{category.prepNote}</p>
            </div>
            {relatedLook ? (
              <p className="text-body-sm text-espresso-700">
                Most often part of{' '}
                <Link
                  href={`/bridal-looks#${relatedLook.slug}`}
                  className="underline-draw font-medium text-espresso-900"
                >
                  {relatedLook.name}
                </Link>
                . {relatedLook.bestFor}
              </p>
            ) : null}
          </div>
          <div className="lg:col-span-5">
            <EditorialImage
              asset={getImage(category.imageId)}
              sizes="(max-width: 1023px) 100vw, 40vw"
              priority
              className="w-full"
            />
          </div>
        </Container>
      </Section>

      <Section tone="ivory" id="services">
        <Container className="flex flex-col gap-8">
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
            <h2 className="text-display-md">What this covers</h2>
            <Badge tone="neutral">{`About ${formatDuration(totalMinutes)} of studio time in total`}</Badge>
          </div>
          <Rule tone="sand" />
          <dl className="grid grid-cols-1 gap-x-12 gap-y-7 md:grid-cols-2">
            {services.map((service) => (
              <div key={service.slug} className="flex flex-col gap-1.5">
                <dt className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <span className="text-body-md font-medium text-espresso-900">{service.name}</span>
                  <span className="text-body-xs text-stone-500">
                    {formatDuration(service.durationMinutes)}
                  </span>
                </dt>
                <dd className="text-body-sm text-espresso-700">{service.summary}</dd>
              </div>
            ))}
          </dl>
          <p className="text-body-xs text-stone-500">
            Durations are the studio allowance for one person, including consultation and
            adjustments. Nothing here is priced individually — see the{' '}
            <Link href="/packages" className="underline-draw font-medium text-espresso-900">
              packages
            </Link>
            .
          </p>
        </Container>
      </Section>

      <Section tone="inset" spacing="tight" id="other-categories">
        <Container className="flex flex-col gap-6">
          <h2 className="text-display-sm">The other categories</h2>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((row) => (
              <li key={row.slug}>
                <Link
                  href={`/services/${row.slug}`}
                  className="hairline group flex min-h-11 flex-col gap-1 bg-ivory-50 p-4 transition-colors duration-(--dur-fast) hover:bg-ivory-100"
                >
                  <span className="text-body-sm font-medium text-espresso-900">{row.name}</span>
                  <span className="text-body-xs text-stone-500">{row.eyebrow}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaBand
        copy={closingCta}
        location={`closing_service_${category.slug}`}
        note={disclosures.noPaymentTaken}
        tone="ivory-alt"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: graph(serviceNode(category, services.length)) }}
      />
    </>
  );
}
