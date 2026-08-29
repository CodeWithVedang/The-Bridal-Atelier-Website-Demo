import Link from 'next/link';

import { EditorialImage, Reveal } from '@/components/content';
import { getImage } from '@/content/images';
import { Container, Rule, Section, SectionHeading, TextLink } from '@/components/primitives';

import type { SectionCopy, SectionGround } from './types';
import type { Artist } from '@/types/content';

/**
 * The artists (brief §13).
 *
 * Two densities of the same three people:
 *
 *  - **grid** (home) — portrait, name, role, and the one line that says what each
 *    artist is actually after. Enough to make "you get a named artist" concrete
 *    rather than a claim.
 *  - **withDetail** (`/artists`) — full-width hairline rows: the years phrase, the
 *    whole bio, the specialisms, and a link into the profile page.
 *
 * The detail variant is rows rather than a wider grid because a bio paragraph in a
 * third of a 768px viewport is four words a line. It is also deliberately *not*
 * the alternating 7/5 split used by the journey and the looks
 * (docs/UI_SPEC.md §7 signature 1) — three people in a row read as a team, three
 * people zig-zagging down a page read as three separate features.
 *
 * No borders around the portraits. A bordered box would make these staff cards,
 * and the design system spends its two card licences elsewhere
 * (docs/UI_SPEC.md §7).
 *
 * `note` exists for one specific disclosure. The images beside these three names
 * are licensed editorial photographs of bridal craft, not portraits of the named
 * artists — attaching a stranger's face to an invented name and an invented
 * career would be a fabricated credential, which is the one thing a page about
 * trust cannot do. The caller passes the sentence that says so
 * (docs/DECISION_LOG.md).
 */

export interface ArtistsSectionProps {
  readonly copy: SectionCopy;
  readonly artists: readonly Artist[];
  /** Adds the years phrase, the full bio and the specialisms. */
  readonly withDetail?: boolean;
  /** One quiet line under the list — the artist-photography disclosure. */
  readonly note?: string;
  readonly tone?: SectionGround;
  readonly id?: string;
}

const HEADING_ID = 'artists-heading';

/** "Read Ananya's profile" — a first name is what the copy uses everywhere else. */
function firstName(name: string): string {
  return name.split(' ')[0] ?? name;
}

export function ArtistsSection({
  copy,
  artists,
  withDetail = false,
  note,
  tone = 'ivory',
  id,
}: ArtistsSectionProps) {
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

        {withDetail ? (
          <div className="flex flex-col">
            {artists.map((artist) => (
              <Reveal key={artist.slug}>
                <article
                  id={artist.slug}
                  aria-labelledby={`${artist.slug}-name`}
                  className="grid grid-cols-1 gap-6 border-b border-sand-300 py-8 scroll-mt-(--header-h) first:border-t sm:grid-cols-12 sm:gap-8 lg:py-12"
                >
                  <div className="sm:col-span-5 lg:col-span-4">
                    <EditorialImage
                      asset={getImage(artist.imageId)}
                      ratio="4 / 5"
                      sizes="(max-width: 639px) 100vw, (max-width: 1023px) 40vw, 340px"
                      className="w-full"
                    />
                  </div>

                  <div className="flex flex-col gap-4 sm:col-span-7 lg:col-span-8">
                    <div className="flex flex-col gap-1.5">
                      <h3 id={`${artist.slug}-name`} className="text-display-md">
                        {artist.name}
                      </h3>
                      <p className="text-body-sm uppercase text-gold-600">{artist.role}</p>
                      <p className="text-body-sm text-stone-500">{artist.yearsPhrase}</p>
                    </div>

                    {artist.bio.map((paragraph) => (
                      <p
                        key={paragraph.slice(0, 32)}
                        className="max-w-[64ch] text-body-md leading-relaxed text-espresso-700"
                      >
                        {paragraph}
                      </p>
                    ))}

                    <Rule ornament className="my-1 max-w-40" />

                    <p className="max-w-[56ch] font-display text-body-lg leading-snug text-espresso-900">
                      {artist.signatureLine}
                    </p>

                    <dl className="flex flex-col gap-1.5">
                      <dt className="text-label uppercase text-stone-500">Specialisms</dt>
                      <dd className="text-body-sm leading-relaxed text-espresso-700">
                        {artist.specialisms.join(' · ')}
                      </dd>
                    </dl>

                    <TextLink href={`/artists/${artist.slug}`} withArrow className="mt-1 self-start">
                      Read {firstName(artist.name)}&rsquo;s profile
                    </TextLink>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-8">
            {artists.map((artist) => (
              <li key={artist.slug} className="image-zoom group relative flex flex-col gap-4">
                <EditorialImage
                  asset={getImage(artist.imageId)}
                  ratio="4 / 5"
                  sizes="(max-width: 639px) 100vw, (max-width: 1279px) 32vw, 400px"
                  className="w-full"
                />
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-display-sm">
                    <Link
                      href={`/artists/${artist.slug}`}
                      className="underline-draw before:absolute before:inset-0 before:content-['']"
                    >
                      {artist.name}
                    </Link>
                  </h3>
                  <p className="text-body-sm uppercase text-gold-600">{artist.role}</p>
                  <p className="mt-1 text-body-sm leading-relaxed text-espresso-700">
                    {artist.signatureLine}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {note ? <p className="max-w-[68ch] text-body-xs text-stone-500">{note}</p> : null}
      </Container>
    </Section>
  );
}
