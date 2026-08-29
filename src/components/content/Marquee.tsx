import { cn } from '@/lib/cn';

import type { ReactNode } from 'react';

/**
 * Horizontal strip for the Instagram row (brief §18).
 *
 * Named for the shape, not the behaviour: **nothing moves on its own.** An
 * auto-scrolling marquee is motion the visitor did not ask for, cannot pause, and
 * that carries content past them at its own pace — it fails SC 2.2.2 and it makes
 * a premium page feel like a banner ad. This scrolls only when scrolled.
 *
 * The scroller is focusable (`tabIndex={0}`) with a group label. A `overflow-x`
 * region that is not focusable cannot be scrolled by keyboard at all, which is a
 * plain 2.1.1 failure that is very easy to ship by accident.
 *
 * `snap-x` with `snap-start` on each child means a flick lands on a tile edge
 * rather than halfway through one.
 */

export interface MarqueeProps {
  /** `<li>` elements. The list semantics live here so the caller cannot forget them. */
  readonly children: ReactNode;
  readonly label: string;
  readonly className?: string;
}

export function Marquee({ children, label, className }: MarqueeProps) {
  return (
    <div
      role="group"
      aria-label={label}
      tabIndex={0}
      className={cn(
        'edge-fade snap-x snap-mandatory overflow-x-auto overscroll-x-contain pb-2',
        className,
      )}
    >
      <ul className="flex w-max gap-3 sm:gap-4">{children}</ul>
    </div>
  );
}
