import { cn } from '@/lib/cn';

import type { ElementType, ReactNode } from 'react';

/**
 * Vertical rhythm and section ground.
 *
 * The four tones are the whole palette of section grounds; there is no fifth,
 * because a page that alternates between five backgrounds stops reading as one
 * document (docs/BRAND_SYSTEM.md §3). `blush` is capped at one use per page by
 * convention, enforced by review rather than by code.
 *
 * `espresso` adds the `on-dark` class, which is what flips the global
 * focus-ring colour to gold in `globals.css`. Any dark ground must carry it or
 * a focused control inside it becomes a near-invisible dark ring on dark paint.
 */

export type SectionTone = 'ivory' | 'ivory-alt' | 'inset' | 'espresso' | 'blush';

export interface SectionProps {
  readonly children: ReactNode;
  readonly id?: string;
  readonly tone?: SectionTone;
  readonly as?: ElementType;
  /** `tight` for stacked sub-sections; `flush` when the child owns its padding. */
  readonly spacing?: 'default' | 'tight' | 'flush';
  readonly className?: string;
  readonly labelledBy?: string;
}

const TONES: Record<SectionTone, string> = {
  ivory: 'bg-ivory-50 text-espresso-700',
  'ivory-alt': 'bg-ivory-100 text-espresso-700',
  inset: 'bg-ivory-200 text-espresso-700',
  espresso: 'on-dark bg-espresso-900 text-ivory-100',
  blush: 'bg-blush-100 text-espresso-700',
};

const SPACING = {
  default: 'py-(--section-y) lg:py-(--section-y-lg)',
  tight: 'py-12 lg:py-20',
  flush: '',
} as const;

export function Section({
  children,
  id,
  tone = 'ivory',
  as: Tag = 'section',
  spacing = 'default',
  className,
  labelledBy,
}: SectionProps) {
  return (
    <Tag
      id={id}
      aria-labelledby={labelledBy}
      className={cn('relative', TONES[tone], SPACING[spacing], className)}
    >
      {children}
    </Tag>
  );
}
