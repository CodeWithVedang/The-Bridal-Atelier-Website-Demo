import Link from 'next/link';
import { notFound } from 'next/navigation';

import { EditorialImage } from '@/components/content';
import { Container, Eyebrow, Prose, Rule, Section } from '@/components/primitives';
import { CtaBand, PageHeader, PortfolioTile } from '@/components/sections';
import { getImage } from '@/content/images';
import { closingCta, disclosures } from '@/content/site-copy';
import { breadcrumbNode, graph, personNode } from '@/lib/jsonld';
import { getContentRepository } from '@/lib/repositories';
import { pageMetadata, trail } from '@/lib/seo';

import type { Metadata } from 'next';

/**
 * One artist profile (docs/ARCHITECTURE.md §4).
 *
 * Statically generated for all three. The page answers the two questions a bride
 * has once she has a name: what is this person strongest at, and what have they
 * actually done. So it is the bio, the specialisms, and every portfolio project
 * credited to them — nothing else.
 *
 * The image is craft, not a portrait, and the page says so in prose immediately
 * beneath it. `personNode` deliberately omits `image` for the same reason: a
 * disclosure in the visible copy and a contradicting claim in the markup would be
 * worse than no markup at all (docs/DECISION_LOG.md).
 */

export async function generateStaticParams() {
  const artists = await getContentRepository().listArtists();
  return artists.map((artist) => ({ slug: artist.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/artists/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const artist = await getContentRepository().getArtist(slug);
  if (!artist) {
    return pageMetadata({
      title: 'Artist not found',
      description:
        'This artist profile does not exist. Meet the three bridal artists working at the studio, each with a stated specialism, on the artists page instead.',
      path: `/artists/${slug}`,
      noindex: true,
    });
  }

  return pageMetadata({
    title: `${artist.name} · ${artist.role}`,
    description: `${artist.signatureLine} ${artist.yearsPhrase}. Specialisms: ${artist.specialisms.join(', ')}.`,
    path: `/artists/${artist.slug}`,
  });
}

export default async function ArtistPage({ params }: PageProps<'/artists/[slug]'>) {
  const { slug } = await params;
  const repo = getContentRepository();
  const artist = await repo.getArtist(slug);
  if (!artist) notFound();

  const [artists, projects] = await Promise.all([
    repo.listArtists(),
    repo.listPortfolioProjects(),
  ]);
  const theirs = projects.filter((project) => project.artistSlug === artist.slug);
  const others = artists.filter((row) => row.slug !== artist.slug);
  const first = artist.name.split(' ')[0] ?? artist.name;
  const crumbs = trail(
    { label: 'Artists', href: '/artists' },
    { label: artist.name, href: `/artists/${artist.slug}` },
  );

  return (
    <>
      <PageHeader
        crumbs={crumbs}
        eyebrow={artist.role}
        heading={artist.name}
        lead={artist.signatureLine}
        meta={[
          artist.yearsPhrase,
          `${theirs.length} projects in the portfolio`,
          'Does your trial and your wedding',
        ]}
      />

      <Section tone="ivory-alt">
        <Container className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <EditorialImage
              asset={getImage(artist.imageId)}
              ratio="4 / 5"
              sizes="(max-width: 1023px) 100vw, 40vw"
              priority
              className="w-full"
            />
            <p className="mt-3 text-body-xs text-stone-500">{disclosures.artistPhotography}</p>
          </div>

          <div className="flex flex-col gap-8 lg:col-span-7">
            <Prose>
              {artist.bio.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </Prose>

            <Rule ornament className="max-w-40" />

            <dl className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <dt className="text-label uppercase text-stone-500">Specialisms</dt>
                <dd className="text-body-md text-espresso-800">
                  {artist.specialisms.join(' · ')}
                </dd>
              </div>
              <div className="flex flex-col gap-1.5">
                <dt className="text-label uppercase text-stone-500">Experience</dt>
                <dd className="text-body-md text-espresso-800">{artist.yearsPhrase}</dd>
              </div>
            </dl>

            <div className="hairline flex flex-col gap-2 bg-ivory-50 p-6">
              <Eyebrow tone="gold">Request {first}</Eyebrow>
              <p className="text-body-sm text-espresso-800">
                Name {first} in the consultation form and a coordinator confirms whether those dates
                are free before anything is agreed.
              </p>
              <Link
                href="/book"
                className="underline-draw text-body-sm font-medium text-espresso-900"
              >
                Book a consultation
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {theirs.length > 0 ? (
        <Section tone="ivory" id="work">
          <Container className="flex flex-col gap-8">
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
              <h2 className="text-display-md">{first}&rsquo;s work</h2>
              <Link href="/portfolio" className="underline-draw text-body-sm font-medium">
                All twelve projects
              </Link>
            </div>
            <Rule tone="sand" />
            <ul className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
              {theirs.map((project) => (
                <li key={project.slug} className="flex">
                  <PortfolioTile
                    project={project}
                    artistName={artist.name}
                    sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 360px"
                    className="w-full"
                  />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      <Section tone="inset" spacing="tight" id="other-artists">
        <Container className="flex flex-col gap-6">
          <h2 className="text-display-sm">The other artists</h2>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {others.map((row) => (
              <li key={row.slug}>
                <Link
                  href={`/artists/${row.slug}`}
                  className="hairline group flex min-h-11 flex-col gap-1 bg-ivory-50 p-4 transition-colors duration-(--dur-fast) hover:bg-ivory-100"
                >
                  <span className="text-body-md font-medium text-espresso-900">{row.name}</span>
                  <span className="text-body-xs text-stone-500">{row.role}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaBand
        copy={closingCta}
        location={`closing_artist_${artist.slug}`}
        note={disclosures.noPaymentTaken}
        tone="ivory-alt"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: graph(breadcrumbNode(crumbs), personNode(artist)),
        }}
      />
    </>
  );
}
