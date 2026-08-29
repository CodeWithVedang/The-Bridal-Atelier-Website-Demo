import Link from 'next/link';
import { notFound } from 'next/navigation';

import { EditorialImage } from '@/components/content';
import { Badge, Container, Eyebrow, Prose, Rule, Section } from '@/components/primitives';
import { CtaBand, PageHeader, PortfolioTile } from '@/components/sections';
import { getImage } from '@/content/images';
import { portfolioFilters } from '@/content/portfolio';
import { closingCta, disclosures } from '@/content/site-copy';
import { nameMap } from '@/lib/form-options';
import { breadcrumbNode, graph, imageObjectNode } from '@/lib/jsonld';
import { getContentRepository } from '@/lib/repositories';
import { pageMetadata, trail } from '@/lib/seo';

import type { Metadata } from 'next';

/**
 * One portfolio project (docs/ARCHITECTURE.md §4).
 *
 * Statically generated for all twelve. The page exists because a grid tile can
 * show what a look looked like but not what was decided: the breakdown, the
 * conditions it had to survive, and which artist made those calls. That is the
 * part a bride comparing studios actually needs.
 *
 * The image carries an explicit provenance line. These are licensed editorial
 * photographs, not this studio's client work, and the page says so in prose as
 * well as in the `ImageObject` markup — a disclosure that only exists in
 * structured data is a disclosure aimed at crawlers rather than at readers
 * (docs/DECISION_LOG.md D5).
 */

export async function generateStaticParams() {
  const projects = await getContentRepository().listPortfolioProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/portfolio/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const project = await getContentRepository().getPortfolioProject(slug);
  if (!project) {
    return pageMetadata({
      title: 'Project not found',
      description:
        'This portfolio project does not exist. Browse the twelve bridal looks in the portfolio instead, filterable by look, function, hairstyle and artist.',
      path: `/portfolio/${slug}`,
      noindex: true,
    });
  }

  return pageMetadata({
    title: `${project.title} · ${project.city}`,
    description: project.summary,
    path: `/portfolio/${project.slug}`,
    ogImagePath: getImage(project.imageId).src,
  });
}

/** Dimension → label, so the facet list reads as prose rather than as field names. */
const DIMENSION_LABELS: Readonly<Record<string, string>> = Object.fromEntries(
  portfolioFilters.map((group) => [group.dimension, group.label]),
);

export default async function PortfolioProjectPage({ params }: PageProps<'/portfolio/[slug]'>) {
  const { slug } = await params;
  const repo = getContentRepository();
  const project = await repo.getPortfolioProject(slug);
  if (!project) notFound();

  const [artists, projects] = await Promise.all([repo.listArtists(), repo.listPortfolioProjects()]);
  const artist = artists.find((row) => row.slug === project.artistSlug);
  const image = getImage(project.imageId);
  const related = projects
    .filter((row) => row.slug !== project.slug)
    .filter((row) => row.filters.lookType.some((look) => project.filters.lookType.includes(look)))
    .slice(0, 3);
  const crumbs = trail(
    { label: 'Portfolio', href: '/portfolio' },
    { label: project.title, href: `/portfolio/${project.slug}` },
  );

  return (
    <>
      <PageHeader
        crumbs={crumbs}
        eyebrow={project.city}
        heading={project.title}
        lead={project.summary}
        meta={[
          artist ? `Artist: ${artist.name}` : 'Artist assigned at booking',
          project.filters.function.join(' · '),
          project.filters.coverage.join(' · ') + ' coverage',
        ]}
      />

      <Section tone="ivory-alt">
        <Container className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <EditorialImage
              asset={image}
              sizes="(max-width: 1023px) 100vw, 55vw"
              priority
              className="w-full"
            />
            <p className="mt-3 text-body-xs text-stone-500">
              Licensed editorial photography, not a photograph of a client of this studio. Every file
              is credited to its photographer in{' '}
              <Link
                href="/privacy#photography"
                className="underline-draw font-medium text-espresso-800"
              >
                the photography credits
              </Link>
              .
            </p>
          </div>

          <div className="flex flex-col gap-8 lg:col-span-5">
            <div className="flex flex-col gap-4">
              <Eyebrow tone="gold">What was done</Eyebrow>
              <dl className="flex flex-col gap-4">
                {project.breakdown.map((row) => (
                  <div key={row.label} className="flex flex-col gap-1">
                    <dt className="text-body-xs tracking-wide text-stone-500 uppercase">
                      {row.label}
                    </dt>
                    <dd className="text-body-md text-espresso-800">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <Rule tone="sand" />

            <div className="flex flex-col gap-3">
              <Eyebrow tone="stone">How it is filed</Eyebrow>
              <ul className="flex flex-wrap gap-2">
                {Object.entries(project.filters).flatMap(([dimension, values]) =>
                  values.map((value) => (
                    <li key={`${dimension}-${value}`}>
                      <Badge tone="neutral">
                        <span className="text-stone-500">{DIMENSION_LABELS[dimension]}:</span>{' '}
                        {value}
                      </Badge>
                    </li>
                  )),
                )}
              </ul>
            </div>

            {artist ? (
              <div className="hairline flex flex-col gap-2 bg-ivory-50 p-6">
                <Eyebrow tone="gold">The artist</Eyebrow>
                <p className="text-body-md text-espresso-800">{artist.signatureLine}</p>
                <Link
                  href={`/artists/${artist.slug}`}
                  className="underline-draw text-body-sm font-medium text-espresso-900"
                >
                  Read {artist.name.split(' ')[0]}&rsquo;s profile
                </Link>
              </div>
            ) : null}
          </div>
        </Container>
      </Section>

      <Section tone="ivory" spacing="tight" id="context">
        <Container width="narrow" className="flex flex-col gap-4">
          <h2 className="text-display-sm">Why this brief, not another</h2>
          <Prose>
            <p>
              {project.summary} The decisions above follow from that: coverage is chosen for the
              light and the length of the day, hair is chosen for what has to be carried, and the
              lip is chosen for how many times it will be reapplied in front of a camera.
            </p>
          </Prose>
          <p className="text-body-xs text-stone-500">{disclosures.demonstrationSite}</p>
        </Container>
      </Section>

      {related.length > 0 ? (
        <Section tone="inset" id="related">
          <Container className="flex flex-col gap-8">
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
              <h2 className="text-display-sm">Similar looks</h2>
              <Link href="/portfolio" className="underline-draw text-body-sm font-medium">
                All twelve projects
              </Link>
            </div>
            <ul className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
              {related.map((row) => (
                <li key={row.slug} className="flex">
                  <PortfolioTile
                    project={row}
                    artistName={nameMap(artists)[row.artistSlug]}
                    sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 360px"
                    className="w-full"
                  />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      <CtaBand
        copy={closingCta}
        location={`closing_portfolio_${project.slug}`}
        note={disclosures.noPaymentTaken}
        tone="ivory"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: graph(breadcrumbNode(crumbs), imageObjectNode(project, image)),
        }}
      />
    </>
  );
}
