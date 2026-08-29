import { cn } from '@/lib/cn';

import type { ReactNode } from 'react';

/**
 * The bridal journey stages (brief §7).
 *
 * A real `<ol>`, because the stages happen in that order and the order is the
 * whole point of the section. The "01"–"05" numerals are `aria-hidden`
 * decoration: the list already conveys position, and hearing "zero one,
 * Consultation" is worse than hearing "1, Consultation".
 *
 * Two shapes from one markup, switched at `lg`:
 *
 *  - **≤ 1023px** a vertical timeline with a hairline spine drawn on the `<li>`
 *    itself, so it cannot fall out of alignment with the items.
 *  - **1024px+** a five-across band with the spine turned horizontal.
 *
 * Not five cards. Cards are reserved for packages and portfolio tiles
 * (docs/UI_SPEC.md §7) — a row of bordered boxes here would flatten the sequence
 * into a menu of options, which is exactly the wrong reading.
 */

export interface TimelineStep {
  readonly id: string;
  readonly index: string;
  readonly name: string;
  readonly promise: string;
  readonly meta?: string;
  readonly detail?: ReactNode;
}

export interface TimelineProps {
  readonly steps: readonly TimelineStep[];
  readonly className?: string;
}

export function Timeline({ steps, className }: TimelineProps) {
  return (
    <ol
      className={cn(
        'grid gap-0 lg:grid-cols-5 lg:gap-x-6',
        className,
      )}
    >
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        return (
          <li
            key={step.id}
            className={cn(
              'relative flex gap-5 pb-9 lg:flex-col lg:gap-4 lg:pb-0',
              isLast && 'pb-0',
            )}
          >
            {/* Vertical spine (mobile) — drawn from the numeral downwards and
                omitted on the last item so the line stops where the list does. */}
            {isLast ? null : (
              <span
                aria-hidden="true"
                className="absolute top-11 bottom-0 left-[1.375rem] w-px bg-sand-300 lg:hidden"
              />
            )}

            <span className="flex shrink-0 items-start lg:w-full lg:items-center lg:gap-4">
              <span
                aria-hidden="true"
                className="grid size-11 shrink-0 place-items-center rounded-full border border-sand-300 bg-ivory-50 font-display text-body-md text-gold-600 tabular-nums"
              >
                {step.index}
              </span>
              {/* Horizontal spine (desktop). */}
              {isLast ? null : (
                <span aria-hidden="true" className="hidden h-px flex-1 bg-sand-300 lg:block" />
              )}
            </span>

            <div className="flex flex-col gap-2 pt-1.5 lg:pt-0">
              <h3 className="font-display text-display-sm leading-tight text-espresso-900">
                {step.name}
              </h3>
              {step.meta ? (
                <p className="text-body-xs tracking-wide text-stone-500 uppercase">{step.meta}</p>
              ) : null}
              <p className="max-w-[46ch] text-body-sm leading-relaxed text-espresso-700">
                {step.promise}
              </p>
              {step.detail ? (
                <div className="max-w-[46ch] text-body-sm leading-relaxed text-stone-500">
                  {step.detail}
                </div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
