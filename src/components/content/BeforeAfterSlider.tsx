'use client';

import { useState } from 'react';

import { cn } from '@/lib/cn';
import { getImage } from '@/content/images';
import { EditorialImage } from './EditorialImage';

import type { BeforeAfterPair } from '@/types/content';

/**
 * Before/after comparison (brief §11).
 *
 * The control is a real `<input type="range">`. Every hand-built drag handle I
 * have seen on a site like this is a `<div>` with a `mousedown` listener: no
 * keyboard, no `aria-valuenow`, nothing for a switch device. A range input is
 * operable with Arrows, Home/End and Page Up/Down for free, announces its value,
 * and is a 44px target on touch (docs/ACCESSIBILITY_SPEC.md §5).
 *
 * With JavaScript off, the slider cannot move, so it is removed entirely and both
 * panels are shown stacked and labelled instead — a `<noscript>` block hides the
 * interactive figure and renders the static pair. A dead control that looks alive
 * is worse than no control (docs/UI_SPEC.md §5).
 *
 * The reveal is a `clip-path`, not a width change: clipping does not re-lay-out
 * the image, so dragging stays on the compositor and the artwork never squashes.
 *
 * The figure takes its aspect ratio from the "after" asset rather than a constant.
 * Both panels of a matched pair are the same shape by construction, and deriving
 * it means replacing the pair with real studio frames at a different ratio needs
 * no component change — the manifest is already the one place a size is stated.
 */

export interface BeforeAfterSliderProps {
  readonly pair: BeforeAfterPair;
  readonly className?: string;
}

export function BeforeAfterSlider({ pair, className }: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const before = getImage(pair.beforeImageId);
  const after = getImage(pair.afterImageId);
  const sliderId = `reveal-${pair.id}`;
  const ratio = `${after.width} / ${after.height}`;

  return (
    <figure className={cn('flex flex-col gap-4', className)}>
      <noscript>
        <style
          // Only parsed when scripting is disabled, so it costs nothing otherwise.
          dangerouslySetInnerHTML={{ __html: `#ba-live-${pair.id}{display:none !important}` }}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <p className="text-label text-stone-500">Before</p>
            <EditorialImage asset={before} ratio={ratio} sizes="(max-width: 639px) 100vw, 50vw" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-label text-stone-500">After</p>
            <EditorialImage asset={after} ratio={ratio} sizes="(max-width: 639px) 100vw, 50vw" />
          </div>
        </div>
      </noscript>

      <div id={`ba-live-${pair.id}`} className="flex flex-col gap-4">
        <div className="relative isolate overflow-hidden" style={{ aspectRatio: ratio }}>
          <EditorialImage
            asset={after}
            ratio={ratio}
            sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 420px"
            className="absolute inset-0 size-full"
          />
          <span
            className="absolute inset-0 size-full"
            // Clipped from the right, so 0% shows only the finished look and
            // 100% shows only the starting point.
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <EditorialImage
              asset={before}
              ratio={ratio}
              sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 420px"
              className="absolute inset-0 size-full"
            />
          </span>

          {/* Seam and the two ground labels. All decorative — the range input
              below carries the semantics, and the panels carry their own alt. */}
          <span
            aria-hidden="true"
            className="absolute inset-y-0 w-px bg-ivory-50/90 mix-blend-difference"
            style={{ left: `${position}%` }}
          />
          <span
            aria-hidden="true"
            className="absolute top-3 left-3 bg-espresso-900/70 px-2 py-1 text-body-xs tracking-wide text-ivory-50 uppercase"
          >
            Before
          </span>
          <span
            aria-hidden="true"
            className="absolute top-3 right-3 bg-espresso-900/70 px-2 py-1 text-body-xs tracking-wide text-ivory-50 uppercase"
          >
            After
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={sliderId} className="text-body-xs text-stone-500">
            Drag to compare — {position}% before
          </label>
          <input
            id={sliderId}
            type="range"
            min={0}
            max={100}
            step={1}
            value={position}
            onChange={(event) => setPosition(Number(event.target.value))}
            aria-describedby={`${sliderId}-help`}
            className="h-11 w-full cursor-ew-resize accent-espresso-900"
          />
          <p id={`${sliderId}-help`} className="sr-only">
            0 percent shows the finished look, 100 percent shows the starting point.
          </p>
        </div>
      </div>

      <figcaption className="flex flex-col gap-1">
        <span className="text-body-sm font-medium text-espresso-900">{pair.title}</span>
        <span className="text-body-xs text-stone-500">{pair.note}</span>
      </figcaption>
    </figure>
  );
}
