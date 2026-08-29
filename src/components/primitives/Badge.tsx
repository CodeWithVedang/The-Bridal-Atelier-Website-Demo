import { cn } from '@/lib/cn';

import type { ReactNode } from 'react';

/**
 * Hairline pill.
 *
 * Colour never carries the meaning on its own — the label always says what the
 * badge means ("Most chosen", "Sample content"), so the `tone` is decoration
 * (docs/ACCESSIBILITY_SPEC.md §3, SC 1.4.1).
 */

export type BadgeTone = 'neutral' | 'gold' | 'success' | 'inverse';

export interface BadgeProps {
  readonly children: ReactNode;
  readonly tone?: BadgeTone;
  readonly className?: string;
}

const TONES: Record<BadgeTone, string> = {
  neutral: 'border-sand-400 bg-ivory-50 text-stone-500',
  gold: 'border-gold-500/45 bg-gold-200/50 text-gold-600',
  success: 'border-success-700/35 bg-success-700/8 text-success-700',
  inverse: 'border-ivory-200/30 bg-ivory-50/8 text-ivory-100',
};

export function Badge({ children, tone = 'neutral', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-label uppercase',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
