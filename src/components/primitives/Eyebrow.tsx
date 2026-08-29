import { cn } from '@/lib/cn';

import type { ReactNode } from 'react';

/**
 * The small letter-spaced label above a heading.
 *
 * It is a `<p>`, never a heading element. An eyebrow is a caption for the
 * heading that follows it; promoting it to `<h3>` would put "OUR SERVICES" into
 * the document outline above the actual section title and break the heading
 * hierarchy a screen-reader user navigates by (docs/ACCESSIBILITY_SPEC.md §4).
 *
 * The optional index renders as a separate span with its own hairline, used by
 * the journey stages ("01 — CONSULTATION").
 */

export interface EyebrowProps {
  readonly children: ReactNode;
  /** Two-digit ordinal, e.g. `01`. Decorative — the label carries the meaning. */
  readonly index?: string;
  readonly tone?: 'gold' | 'stone' | 'ivory';
  readonly className?: string;
  readonly id?: string;
}

const TONES = {
  gold: 'text-gold-600',
  stone: 'text-stone-500',
  ivory: 'text-ivory-200/80',
} as const;

export function Eyebrow({ children, index, tone = 'gold', className, id }: EyebrowProps) {
  return (
    <p
      id={id}
      className={cn(
        'flex items-center gap-3 text-label uppercase',
        TONES[tone],
        className,
      )}
    >
      {index ? (
        <>
          <span className="tabular-nums">{index}</span>
          <span aria-hidden="true" className="h-px w-6 bg-current opacity-40" />
        </>
      ) : null}
      <span>{children}</span>
    </p>
  );
}
