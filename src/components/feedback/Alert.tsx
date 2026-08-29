import { cn } from '@/lib/cn';
import { IconCheck, IconDanger, IconInfo, IconWarning } from '@/components/icons';

import type { ReactNode } from 'react';

/**
 * Inline message block.
 *
 * The `role` follows from the tone rather than being a prop, because that choice
 * is a correctness question, not a styling one. `danger` and `warning` are
 * `role="alert"` (assertive — interrupt, because the user cannot proceed);
 * `info` and `success` are `role="status"` (polite — wait for a pause, because
 * the news can afford to). Getting this backwards either talks over the user or
 * silently swallows a validation failure (docs/ACCESSIBILITY_SPEC.md §5).
 *
 * Every tone carries an icon *and* a text heading, so the message never depends
 * on colour alone (SC 1.4.1).
 */

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps {
  readonly tone?: AlertTone;
  /** Short, plain-language summary. Read first by assistive tech. */
  readonly title: string;
  readonly children?: ReactNode;
  /** Set on a region that is present before the message exists. */
  readonly live?: boolean;
  readonly className?: string;
  readonly action?: ReactNode;
}

const TONES: Record<AlertTone, { readonly box: string; readonly icon: string }> = {
  info: { box: 'border-sand-400 bg-ivory-100', icon: 'text-stone-500' },
  success: { box: 'border-success-700/30 bg-success-700/6', icon: 'text-success-700' },
  warning: { box: 'border-gold-500/45 bg-gold-200/40', icon: 'text-gold-600' },
  danger: { box: 'border-danger-700/30 bg-danger-700/6', icon: 'text-danger-700' },
};

const ICONS: Record<AlertTone, typeof IconInfo> = {
  info: IconInfo,
  success: IconCheck,
  warning: IconWarning,
  danger: IconDanger,
};

export function Alert({
  tone = 'info',
  title,
  children,
  live = false,
  className,
  action,
}: AlertProps) {
  const Icon = ICONS[tone];
  const assertive = tone === 'danger' || tone === 'warning';

  return (
    <div
      role={assertive ? 'alert' : 'status'}
      aria-live={live ? (assertive ? 'assertive' : 'polite') : undefined}
      className={cn(
        'flex flex-col gap-3 border p-4 sm:flex-row sm:items-start sm:gap-4 sm:p-5',
        TONES[tone].box,
        className,
      )}
    >
      <Icon className={cn('mt-0.5 size-5', TONES[tone].icon)} />
      <div className="flex-1 space-y-1.5">
        <p className="font-medium text-espresso-900">{title}</p>
        {children ? <div className="text-body-sm text-espresso-700">{children}</div> : null}
      </div>
      {action ? <div className="shrink-0 sm:self-center">{action}</div> : null}
    </div>
  );
}
