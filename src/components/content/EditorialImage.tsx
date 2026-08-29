import Image from 'next/image';

import { cn } from '@/lib/cn';

import type { ImageAsset } from '@/types/content';

/**
 * The only component that renders an image asset.
 *
 * Two paths, chosen by file extension:
 *
 *  - **SVG** — a plain `<img>`. Every asset shipped today is generated vector art
 *    (`scripts/generate-placeholder-art.mjs`), and running it through the Next
 *    optimiser would mean enabling `dangerouslyAllowSVG`, which turns the
 *    optimiser into a delivery route for hostile SVG. There is nothing to gain:
 *    the files are already a few kilobytes and compress further over the wire.
 *  - **Raster** — `next/image`, so real photography dropped in later gets
 *    AVIF/WebP, the six device widths from `next.config.ts`, and lazy loading
 *    with no change at the call site (docs/PERFORMANCE_SPEC.md §3).
 *
 * The wrapper is an aspect box with the ratio taken from the manifest's declared
 * dimensions, so the space is reserved before a byte of image arrives and the
 * layout never shifts. This is the CLS budget in docs/PERFORMANCE_SPEC.md §2 —
 * it is structural here rather than a thing each caller remembers.
 *
 * `alt` comes from the manifest, which describes *the artwork*, not a person
 * (docs/ACCESSIBILITY_SPEC.md §7). An empty alt is possible only by passing
 * `decorative`, which is deliberately more effort than getting it right.
 */

export interface EditorialImageProps {
  readonly asset: ImageAsset;
  /**
   * The `sizes` attribute. Required for raster assets — a wrong `sizes` is the
   * single most common cause of a mobile phone downloading a 1920px file.
   */
  readonly sizes?: string;
  /** Above the fold: eager, high priority, no lazy attribute. */
  readonly priority?: boolean;
  /**
   * Purely ornamental, and the surrounding text already says everything the
   * image says. Renders `alt=""` so assistive tech skips it entirely.
   */
  readonly decorative?: boolean;
  /**
   * Overrides the manifest alt when the same artwork plays a different role in
   * two places ("the before side of a pairing" vs. "an unworked ivory field").
   */
  readonly alt?: string;
  /**
   * CSS aspect ratio for the box, e.g. `'4 / 5'`. Defaults to the asset's own
   * dimensions. Pass one when the crop matters more than the source shape.
   */
  readonly ratio?: string;
  /** Classes for the aspect box. */
  readonly className?: string;
  /** Classes for the image itself — `object-position`, mostly. */
  readonly imageClassName?: string;
}

const DEFAULT_SIZES = '(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 600px';

export function EditorialImage({
  asset,
  sizes = DEFAULT_SIZES,
  priority = false,
  decorative = false,
  alt,
  ratio,
  className,
  imageClassName,
}: EditorialImageProps) {
  const isVector = asset.src.endsWith('.svg');
  const text = decorative ? '' : (alt ?? asset.alt);
  // `block` is load-bearing, not tidiness. The wrapper is a `<span>` so the
  // component is legal inside a `<p>` or a `<figcaption>`, and `aspect-ratio`,
  // `width` and `height` are all ignored on an inline non-replaced box — the
  // aspect box would collapse to zero height anywhere the image sits in normal
  // flow. Callers that position it absolutely (BeforeAfterSlider) still work:
  // `position: absolute` blockifies the box regardless.
  const box = cn('relative isolate block overflow-hidden bg-ivory-200', className);
  const inner = cn('size-full object-cover', imageClassName);

  return (
    <span
      className={box}
      style={{ aspectRatio: ratio ?? `${asset.width} / ${asset.height}` }}
    >
      {isVector ? (
        // SVG deliberately bypasses the Next optimiser rather than enabling
        // dangerouslyAllowSVG — see the note at the top of this file. Width and
        // height are still declared so the intrinsic ratio is known even when the
        // aspect box is overridden.
        // eslint-disable-next-line @next/next/no-img-element -- deliberate, see above
        <img
          src={asset.src}
          alt={text}
          width={asset.width}
          height={asset.height}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : undefined}
          draggable={false}
          className={inner}
        />
      ) : (
        <Image
          src={asset.src}
          alt={text}
          fill
          sizes={sizes}
          priority={priority}
          draggable={false}
          className={inner}
        />
      )}
    </span>
  );
}
