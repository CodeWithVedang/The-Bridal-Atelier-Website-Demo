import Link from 'next/link';

import { EditorialImage, Reveal } from '@/components/content';
import { getImage } from '@/content/images';
import { cn } from '@/lib/cn';
import { Container, Eyebrow, Rule, Section, SectionHeading, TextLink } from '@/components/primitives';

import type { SectionCopy, SectionGround } from './types';
import type { BridalLook } from '@/types/content';

/**
 * The four signature looks (brief §12).
 *
 * Two variants of one dataset, and the difference is the job each page is doing:
 *
 *  - **grid** — the home page. Four artworks, a name, a line. Enough to make a
 *    bride recognise her own direction and click through.
 *  - **editorial** — `/bridal-looks`. The 7/5 alternating split from
 *    docs/UI_SPEC.md §7 signature 1, with the full paragraph, the five elements
 *    of the look and who it suits. Each block carries `id={slug}`, so the grid on
 *    the home page can deep-link into it.
 *
 * No borders in either variant. These are photographs with captions, and a
 * bordered box around each one would turn four directions into four products
 * (docs/UI_SPEC.md §7).
 */

export interface LooksSectionProps {
  readonly copy: SectionCopy;
  readonly looks: readonly BridalLook[];
  readonly variant?: 'grid' | 'editorial';
  readonly tone?: SectionGround;
  readonly id?: string;
}

const HEADING_ID = 'looks-heading';

export function LooksSection({
  copy,
  looks,
  variant = 'grid',
  tone = 'ivory',
  id,
}: LooksSectionProps) {
  return (
    <Section id={id} tone={tone} labelledBy={HEADING_ID}>
      <Container className="flex flex-col gap-10 lg:gap-16">
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

        {variant === 'grid' ? (
          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {looks.map((look) => (
              <li key={look.slug} className="image-zoom group relative flex flex-col gap-4">
                <EditorialImage
                  asset={getImage(look.imageId)}
                  ratio="3 / 4"
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                  className="w-full"
                />
                <div className="flex flex-col gap-2">
                  <h3 className="text-display-sm">
                    <Link
                      href={`/bridal-looks#${look.slug}`}
                      className="underline-draw before:absolute before:inset-0 before:content-['']"
                    >
                      {look.name}
                    </Link>
                  </h3>
                  <p className="text-body-sm leading-relaxed text-espresso-700">{look.summary}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col gap-16 lg:gap-24">
            {looks.map((look, index) => (
              <Reveal key={look.slug}>
                <article
                  id={look.slug}
                  aria-labelledby={`${look.slug}-name`}
                  className="grid grid-cols-1 items-center gap-8 scroll-mt-(--header-h) lg:grid-cols-12 lg:gap-12"
                >
                  <div
                    className={cn(
                      'lg:col-span-5',
                      index % 2 === 1 ? 'lg:col-start-8 lg:row-start-1' : 'lg:col-start-1',
                    )}
                  >
                    <EditorialImage
                      asset={getImage(look.imageId)}
                      ratio="3 / 4"
                      sizes="(max-width: 1023px) 100vw, 40vw"
                      className="w-full"
                    />
                  </div>

                  <div
                    className={cn(
                      'flex flex-col gap-5 lg:col-span-7 lg:row-start-1',
                      index % 2 === 1 ? 'lg:col-start-1' : 'lg:col-start-6',
                    )}
                  >
                    <Eyebrow index={String(look.order).padStart(2, '0')} tone="stone">
                      Signature look
                    </Eyebrow>
                    <h3 id={`${look.slug}-name`} className="text-display-md">
                      {look.name}
                    </h3>
                    <p className="max-w-[62ch] text-body-lg text-espresso-700">{look.summary}</p>
                    <p className="max-w-[62ch] text-body-md leading-relaxed text-espresso-700">
                      {look.detail}
                    </p>

                    <Rule ornament className="my-1" />

                    <div className="flex flex-col gap-3">
                      <h4 className="text-label uppercase text-stone-500">What it is made of</h4>
                      <ul className="flex flex-col gap-1.5">
                        {look.elements.map((element) => (
                          <li
                            key={element}
                            className="flex gap-2.5 text-body-sm leading-relaxed text-espresso-700"
                          >
                            <span aria-hidden="true" className="text-gold-600">
                              ·
                            </span>
                            <span>{element}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <p className="max-w-[62ch] text-body-sm text-stone-500">
                      <span className="text-espresso-900">Best for: </span>
                      {look.bestFor}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
