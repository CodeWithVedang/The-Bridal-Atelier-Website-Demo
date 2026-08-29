import { cn } from '@/lib/cn';
import { Badge } from '@/components/primitives/Badge';
import { IconCalendar, IconCheck, IconInfo, IconWarning } from '@/components/icons';

import type { ReactNode } from 'react';
import type { AvailabilitySuccess } from '@/lib/api';

/**
 * The availability outcome (docs/UX_SPEC.md §4).
 *
 * The most important element on this card is the last one: `result.basis`, which
 * says in plain words that this is an indication from season and day of week, not
 * a live diary. It is rendered at every status, not only the awkward ones,
 * because a confident "Available" that quietly implies a real booking system
 * would be the dishonest reading of the same data
 * (docs/DECISION_LOG.md D6).
 *
 * `role="status"` with `aria-live="polite"`: the card replaces the form's
 * submit region after a fetch, so a screen-reader user needs it announced
 * without being interrupted mid-sentence.
 */

export interface ResultCardProps {
  readonly result: AvailabilitySuccess;
  /** The next action — "Book a consultation", "Send an enquiry anyway". */
  readonly action?: ReactNode;
  readonly className?: string;
}

const PRESENTATION = {
  available: {
    tone: 'success' as const,
    label: 'Likely available',
    box: 'border-success-700/30 bg-success-700/5',
    icon: IconCheck,
    iconClass: 'text-success-700',
  },
  limited: {
    tone: 'gold' as const,
    label: 'Limited',
    box: 'border-gold-500/45 bg-gold-200/35',
    icon: IconWarning,
    iconClass: 'text-gold-600',
  },
  unavailable: {
    tone: 'neutral' as const,
    label: 'Needs a conversation',
    box: 'border-sand-400 bg-ivory-100',
    icon: IconInfo,
    iconClass: 'text-stone-500',
  },
} as const;

export function ResultCard({ result, action, className }: ResultCardProps) {
  const presentation = PRESENTATION[result.status];
  const Icon = presentation.icon;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('flex flex-col gap-5 border p-6 sm:p-8', presentation.box, className)}
    >
      <div className="flex flex-wrap items-center gap-3">
        <Badge tone={presentation.tone}>
          <Icon className={cn('size-3.5', presentation.iconClass)} />
          {presentation.label}
        </Badge>
        <span className="inline-flex items-center gap-2 text-body-sm text-stone-500">
          <IconCalendar className="size-4" />
          {result.formattedDate}
        </span>
      </div>

      <div className="space-y-3">
        <p className="font-display text-display-sm text-espresso-900">{result.headline}</p>
        <p className="max-w-prose text-body-md text-espresso-700">{result.detail}</p>
      </div>

      <p className="max-w-prose text-body-sm font-medium text-espresso-900">{result.nextStep}</p>

      {action ? <div className="flex flex-wrap gap-3 pt-1">{action}</div> : null}

      <p className="max-w-prose border-t border-sand-300 pt-4 text-body-xs text-stone-500">
        {result.basis}
      </p>
    </div>
  );
}
