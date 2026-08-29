'use client';

import { useRef, useState } from 'react';

import { cn } from '@/lib/cn';

/**
 * Single-select filter row (portfolio, looks).
 *
 * `role="toolbar"` with a **roving tabindex**: one Tab stop for the whole row,
 * then Arrow keys to move between chips. With nine portfolio filters, plain
 * buttons would put nine stops between the heading and the first project — the
 * toolbar pattern is what the row costs a keyboard user, and it should cost one.
 *
 * Moving focus does not filter. Arrow keys move, Enter/Space (the native button
 * activation) applies — so a keyboard user can read the options before committing
 * to one, which matches what a pointer user gets by hovering
 * (docs/ACCESSIBILITY_SPEC.md §5).
 *
 * `aria-pressed` rather than `aria-current`: these are toggle buttons that change
 * what is below them, not navigation. The pressed chip is filled *and* has a
 * heavier border, so the state is not carried by colour alone.
 *
 * On narrow screens the row scrolls horizontally with a mask fade at both edges,
 * so a half-visible chip reads as "there is more" rather than as a clipped
 * mistake. The fade is removed at `md`, where the row wraps instead.
 */

export interface FilterChip {
  readonly value: string;
  readonly label: string;
  /** Result count. Shown when supplied — an empty filter should be visibly empty. */
  readonly count?: number;
}

export interface FilterChipsProps {
  readonly label: string;
  readonly options: readonly FilterChip[];
  readonly value: string;
  readonly onChange: (next: string) => void;
  readonly className?: string;
}

export function FilterChips({ label, options, value, onChange, className }: FilterChipsProps) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const tabbable = focusIndex ?? selectedIndex;

  function moveTo(index: number): void {
    const count = options.length;
    const next = ((index % count) + count) % count;
    setFocusIndex(next);
    const node = refs.current[next];
    node?.focus();
    node?.scrollIntoView({ inline: 'nearest', block: 'nearest' });
  }

  return (
    <div
      role="toolbar"
      aria-label={label}
      aria-orientation="horizontal"
      className={cn(
        'flex gap-2 overflow-x-auto pb-1 max-md:edge-fade md:flex-wrap md:overflow-visible md:pb-0',
        className,
      )}
      onKeyDown={(event) => {
        switch (event.key) {
          case 'ArrowRight':
            event.preventDefault();
            moveTo(tabbable + 1);
            break;
          case 'ArrowLeft':
            event.preventDefault();
            moveTo(tabbable - 1);
            break;
          case 'Home':
            event.preventDefault();
            moveTo(0);
            break;
          case 'End':
            event.preventDefault();
            moveTo(options.length - 1);
            break;
          default:
            break;
        }
      }}
    >
      {options.map((option, index) => {
        const pressed = option.value === value;
        return (
          <button
            key={option.value}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="button"
            aria-pressed={pressed}
            tabIndex={index === tabbable ? 0 : -1}
            onFocus={() => setFocusIndex(index)}
            onClick={() => onChange(option.value)}
            className={cn(
              'inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-body-sm whitespace-nowrap transition-colors duration-(--dur-fast)',
              pressed
                ? 'border-espresso-900 bg-espresso-900 font-medium text-ivory-50'
                : 'border-sand-300 bg-transparent text-espresso-700 hover:border-sand-400 hover:bg-ivory-100',
            )}
          >
            {option.label}
            {option.count === undefined ? null : (
              <span
                className={cn(
                  'text-body-xs tabular-nums',
                  pressed ? 'text-ivory-200' : 'text-stone-500',
                )}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
