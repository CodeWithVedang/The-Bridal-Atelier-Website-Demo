import { EditorialImage } from '@/components/content';
import { Container, Eyebrow, Section } from '@/components/primitives';
import { IconArrowRight } from '@/components/icons';

import { TrackedCta } from './TrackedCta';

import type { ImageAsset } from '@/types/content';

/**
 * The hero (brief §6, docs/UI_SPEC.md §8).
 *
 * Three layouts, and the order of the two blocks in the DOM is what makes them
 * work without duplicating markup:
 *
 *  - **≤ 640** stacked, image first, headline underneath. Deliberate: a 4:5
 *    portrait plus a display headline above it pushes the primary CTA off a
 *    360px screen entirely, and the picture is the faster promise
 *    (docs/UX_SPEC.md §6).
 *  - **768** overlapped. The text block is pulled up over the foot of the image
 *    on an ivory panel, which is the editorial figure this brand is built on.
 *  - **1024+** split 6/7 across twelve columns with a one-column overlap, so the
 *    panel — and with it the headline — breaks out over the image's left edge.
 *
 * The panel's ivory ground is load-bearing at every width above 640: it is what
 * keeps the headline on a solid colour where it crosses the artwork, rather than
 * relying on a scrim over an image whose content will change when real
 * photography replaces the generated art (brief §38).
 */

export interface HeroCta {
  readonly label: string;
  readonly href: string;
}

export interface HeroProps {
  readonly copy: {
    readonly eyebrow: string;
    readonly headline: string;
    readonly subheadline: string;
    readonly primaryCta: HeroCta;
    readonly secondaryCta: HeroCta;
    readonly supportLine: string;
  };
  readonly image: ImageAsset;
}

export function Hero({ copy, image }: HeroProps) {
  return (
    <Section spacing="flush" className="pt-8 pb-16 sm:pt-12 lg:pt-16 lg:pb-24">
      <Container className="grid grid-cols-1 items-center gap-y-6 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1">
          {/* The ratio lives on this wrapper, not on EditorialImage: that
              component sets `aspect-ratio` as an inline style, which no
              responsive class can override. A 4:5 portrait is right stacked and
              right in the split, but at 768 the image is nearly full-bleed and
              4:5 would push the CTAs off the fold, so the crop widens there. */}
          <div className="relative aspect-[4/5] w-full overflow-hidden md:aspect-[16/11] lg:aspect-[4/5]">
            <EditorialImage
              asset={image}
              priority
              className="absolute inset-0 size-full"
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 92vw, 58vw"
              imageClassName="object-[50%_30%]"
            />
          </div>
        </div>

        <div className="lg:z-10 lg:col-span-6 lg:col-start-1 lg:row-start-1">
          <div className="flex flex-col gap-6 md:-mt-24 md:mr-12 md:bg-ivory-50 md:pt-10 md:pr-10 lg:mt-0 lg:mr-0 lg:bg-ivory-50 lg:py-12 lg:pr-14">
            <Eyebrow>{copy.eyebrow}</Eyebrow>

            <h1 className="max-w-[18ch] text-display-xl">{copy.headline}</h1>

            <p className="max-w-[46ch] text-body-lg text-espresso-700">{copy.subheadline}</p>

            <div className="mt-1 flex flex-col gap-3 xs:flex-row xs:flex-wrap xs:items-center">
              <TrackedCta
                href={copy.primaryCta.href}
                channel="consultation"
                location="hero"
                size="lg"
                trailingIcon={<IconArrowRight className="size-4" />}
              >
                {copy.primaryCta.label}
              </TrackedCta>
              <TrackedCta
                href={copy.secondaryCta.href}
                channel="availability"
                location="hero"
                variant="secondary"
                size="lg"
              >
                {copy.secondaryCta.label}
              </TrackedCta>
            </div>

            <p className="max-w-[44ch] text-body-sm text-stone-500">{copy.supportLine}</p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
