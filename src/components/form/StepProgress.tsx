import { cn } from '@/lib/cn';
import { IconCheck } from '@/components/icons';

/**
 * Step indicator for the three-step consultation form.
 *
 * An ordered list, because the steps *are* ordered and a screen-reader user gets
 * "list, 3 items" for free. The current step carries `aria-current="step"`; the
 * completed ones say "completed" in text, not only by a tick, so the state does
 * not depend on an icon being perceived.
 *
 * The numerals are `aria-hidden` — the visible "1" is decoration next to a real
 * label like "Your wedding", and announcing both is noise. The progress sentence
 * below the list is what actually carries "Step 2 of 3" to assistive tech, and it
 * is `aria-live` so advancing a step is announced without stealing focus
 * (docs/ACCESSIBILITY_SPEC.md §5).
 */

export interface StepProgressProps {
  readonly steps: readonly string[];
  /** 1-based. */
  readonly current: number;
  readonly className?: string;
}

export function StepProgress({ steps, current, className }: StepProgressProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {steps.map((step, index) => {
          const position = index + 1;
          const isCurrent = position === current;
          const isDone = position < current;

          return (
            <li key={step} className="flex items-center gap-3">
              <span
                aria-current={isCurrent ? 'step' : undefined}
                className={cn(
                  'flex items-center gap-2 text-body-sm transition-colors duration-(--dur-fast)',
                  isCurrent
                    ? 'font-medium text-espresso-900'
                    : isDone
                      ? 'text-espresso-700'
                      : 'text-stone-500',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'grid size-6 shrink-0 place-items-center rounded-full border text-body-xs tabular-nums',
                    isCurrent
                      ? 'border-espresso-900 bg-espresso-900 text-ivory-50'
                      : isDone
                        ? 'border-success-700/50 bg-success-700/10 text-success-700'
                        : 'border-sand-400 text-stone-500',
                  )}
                >
                  {isDone ? <IconCheck className="size-3.5" /> : position}
                </span>
                {step}
                {isDone ? <span className="sr-only">(completed)</span> : null}
              </span>
              {position < steps.length ? (
                <span aria-hidden="true" className="hidden h-px w-8 bg-sand-300 sm:block" />
              ) : null}
            </li>
          );
        })}
      </ol>
      <p aria-live="polite" className="text-body-xs text-stone-500">
        Step {current} of {steps.length} — {steps[current - 1]}
      </p>
    </div>
  );
}
