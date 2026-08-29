import { EditorialImage, Marquee } from '@/components/content';
import { IconInstagram } from '@/components/icons';
import { getImage } from '@/content/images';
import { Container, Section, SectionHeading, TextLink } from '@/components/primitives';

import type { SectionCopy, SectionGround } from './types';
import type { ContactChannel } from '@/config/site';
import type { InstagramTile } from '@/types/content';

/**
 * The studio gallery (brief §18).
 *
 * **Nothing is fetched.** No Instagram API, no embed script, no third-party
 * iframe — eight static tiles from the local image manifest. The brief allows an
 * external feed only if required, and requiring one here would mean a token, a
 * refresh job and a third-party script on the critical path in exchange for
 * artwork this project already ships (docs/DECISION_LOG.md D12).
 *
 * A horizontal strip rather than a grid, because a gallery is the one block on
 * the page that genuinely benefits from being longer than the viewport — and
 * `Marquee` scrolls only when scrolled, so nothing moves on its own.
 *
 * Tiles are figures, not links. There are no posts to link to, and eight
 * anchors pointing at one profile URL is eight identical entries in a
 * screen-reader's link list.
 *
 * The profile link is rendered only when `NEXT_PUBLIC_INSTAGRAM_URL` is set;
 * otherwise it is omitted rather than pointed at a guessed handle (brief §18).
 */

export interface InstagramSectionProps {
  readonly copy: SectionCopy;
  readonly tiles: readonly InstagramTile[];
  readonly channel?: ContactChannel;
  readonly tone?: SectionGround;
  readonly id?: string;
}

const HEADING_ID = 'instagram-heading';

export function InstagramSection({
  copy,
  tiles,
  channel,
  tone = 'ivory',
  id,
}: InstagramSectionProps) {
  return (
    <Section id={id} tone={tone} labelledBy={HEADING_ID}>
      <Container className="flex flex-col gap-8 lg:gap-10">
        <SectionHeading
          id={HEADING_ID}
          eyebrow={copy.eyebrow}
          lead={copy.intro}
          action={
            channel?.configured ? (
              <TextLink href={channel.href} external className="items-center">
                <span className="inline-flex items-center gap-2">
                  <IconInstagram className="size-4" />
                  Follow the studio
                </span>
              </TextLink>
            ) : undefined
          }
        >
          {copy.heading}
        </SectionHeading>
      </Container>

      {/*
        Outside the Container on purpose: the strip runs to the viewport edge so
        the next tile is visibly cut off, which is what tells a visitor it
        scrolls. The inline padding matches Container's padding at every
        breakpoint, so the first tile lines up with the heading above it and the
        last one still clears the right edge.
      */}
      <Marquee
        label="Studio gallery"
        className="mt-8 px-5 sm:px-8 lg:mt-10 lg:px-12 2xl:px-16"
      >
        {tiles.map((tile) => (
          <li key={tile.id} className="w-56 shrink-0 snap-start sm:w-64 lg:w-72">
            <figure className="image-zoom flex flex-col gap-3">
              <EditorialImage
                asset={getImage(tile.imageId)}
                ratio="1 / 1"
                sizes="(max-width: 639px) 224px, (max-width: 1023px) 256px, 288px"
                className="w-full"
              />
              <figcaption className="text-body-xs leading-relaxed text-stone-500">
                {tile.caption}
              </figcaption>
            </figure>
          </li>
        ))}
      </Marquee>
    </Section>
  );
}
