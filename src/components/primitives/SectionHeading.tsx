import { cn } from '@/lib/cn';
import { Eyebrow } from './Eyebrow';

import type { ReactNode } from 'react';

/**
 * Section header: eyebrow, heading, lead paragraph, optional action.
 *
 * `level` sets the tag independently of the visual size, so a heading can be an
 * `<h3>` inside a subsection while still looking like the section titles around
 * it. That separation is the point: without it, the outline gets bent to match
 * the type scale, which is exactly the mistake docs/SEO_SPEC.md §3 forbids.
 *
 * The heading always gets an `id` when one is supplied, so `Section` can point
 * `aria-labelledby` at it rather than repeating the title in an `aria-label`.
 */

export interface SectionHeadingProps {
  readonly children: ReactNode;
  readonly level?: 1 | 2 | 3;
  readonly size?: 'xl' | 'lg' | 'md' | 'sm';
  readonly eyebrow?: string;
  readonly eyebrowIndex?: string;
  readonly lead?: ReactNode;
  /** A CTA that belongs to the section, right-aligned from `lg` up. */
  readonly action?: ReactNode;
  readonly align?: 'start' | 'center';
  readonly tone?: 'default' | 'inverse';
  readonly id?: string;
  readonly className?: string;
}

const SIZES = {
  xl: 'text-display-xl',
  lg: 'text-display-lg',
  md: 'text-display-md',
  sm: 'text-display-sm',
} as const;

export function SectionHeading({
  children,
  level = 2,
  size = 'lg',
  eyebrow,
  eyebrowIndex,
  lead,
  action,
  align = 'start',
  tone = 'default',
  id,
  className,
}: SectionHeadingProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3';
  const centred = align === 'center';
  const inverse = tone === 'inverse';

  return (
    <div
      className={cn(
        'flex flex-col gap-6',
        centred ? 'items-center text-center' : 'lg:flex-row lg:items-end lg:justify-between',
        className,
      )}
    >
      <div className={cn('flex flex-col gap-4', centred ? 'items-center' : 'max-w-2xl')}>
        {eyebrow ? (
          <Eyebrow index={eyebrowIndex} tone={inverse ? 'ivory' : 'gold'}>
            {eyebrow}
          </Eyebrow>
        ) : null}
        <Tag id={id} className={cn(SIZES[size], inverse && 'text-ivory-50')}>
          {children}
        </Tag>
        {lead ? (
          <p
            className={cn(
              'text-body-lg',
              inverse ? 'text-ivory-200/85' : 'text-espresso-700',
              centred && 'max-w-2xl',
            )}
          >
            {lead}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
