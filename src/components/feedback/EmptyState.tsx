import { cn } from '@/lib/cn';
import { Rule } from '@/components/primitives/Rule';

import type { ReactNode } from 'react';

/**
 * Empty state: what happened, why, and the way out.
 *
 * All three parts are required by the type. An empty state that says only "No
 * results" leaves the visitor to guess whether they broke something, whether the
 * studio has nothing, or whether the page is still loading — and the recovery
 * action is what turns a dead end into a next step (docs/UX_SPEC.md §8).
 *
 * `role="status"` so that a filter change which empties the grid is announced;
 * without it the visual change is silent for a screen-reader user.
 */

export interface EmptyStateProps {
  readonly title: string;
  /** Why there is nothing here — in terms of what the visitor did. */
  readonly reason: string;
  /** The recovery: a button, a link, or a short list of them. */
  readonly action: ReactNode;
  readonly className?: string;
}

export function EmptyState({ title, reason, action, className }: EmptyStateProps) {
  return (
    <div
      role="status"
      className={cn(
        'flex flex-col items-center gap-5 border border-sand-300 bg-ivory-100 px-6 py-14 text-center sm:px-10',
        className,
      )}
    >
      <Rule ornament className="max-w-24" />
      <div className="space-y-2">
        <p className="font-display text-display-sm text-espresso-900">{title}</p>
        <p className="mx-auto max-w-md text-body-sm text-stone-500">{reason}</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">{action}</div>
    </div>
  );
}
