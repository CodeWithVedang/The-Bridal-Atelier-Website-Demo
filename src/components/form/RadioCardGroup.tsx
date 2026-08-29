'use client';

import { cn } from '@/lib/cn';
import { IconDanger } from '@/components/icons';
import { errorId, fieldId, hintId } from './control';

/**
 * Single-choice group rendered as selectable cards.
 *
 * Still radio inputs underneath. The card is the `<label>`, and the input is
 * `sr-only` rather than `display:none` — a hidden input is unfocusable, which
 * would silently remove arrow-key navigation, the one interaction pattern a
 * radio group is expected to have. Because the native inputs survive, roving
 * focus, `:checked` and form reset all keep working with no JavaScript of ours
 * (docs/ACCESSIBILITY_SPEC.md §5).
 *
 * The selected card is marked by a filled ground *and* a heavier border *and*
 * the radio dot — three signals, none of them colour alone (SC 1.4.1).
 */

export interface RadioCardOption {
  readonly value: string;
  readonly label: string;
  readonly description?: string;
  /** Small right-aligned note: a price, a duration, "Most chosen". */
  readonly meta?: string;
}

export interface RadioCardGroupProps {
  readonly name: string;
  readonly legend: string;
  readonly options: readonly RadioCardOption[];
  readonly value: string;
  readonly onChange: (next: string) => void;
  readonly hint?: string;
  readonly error?: string;
  readonly required?: boolean;
  readonly columns?: 1 | 2 | 3;
  readonly className?: string;
}

const COLUMNS = {
  1: '',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
} as const;

export function RadioCardGroup({
  name,
  legend,
  options,
  value,
  onChange,
  hint,
  error,
  required = false,
  columns = 1,
  className,
}: RadioCardGroupProps) {
  return (
    <fieldset
      // See `CheckboxGroup`: the group carries the id an `ErrorSummary` link
      // targets, and `tabIndex={-1}` makes that link actually move focus.
      id={fieldId(name)}
      tabIndex={-1}
      className={cn('flex flex-col gap-3', className)}
      aria-describedby={
        [hint ? hintId(name) : null, error ? errorId(name) : null].filter(Boolean).join(' ') ||
        undefined
      }
      aria-invalid={error ? true : undefined}
      aria-required={required || undefined}
    >
      <legend className="flex flex-wrap items-baseline gap-x-2 gap-y-1 pb-1">
        <span className="text-body-sm font-medium text-espresso-900">{legend}</span>
        <span className="text-body-xs text-stone-500">{required ? 'Required' : 'Optional'}</span>
      </legend>

      {hint ? (
        <p id={hintId(name)} className="-mt-1 text-body-xs text-stone-500">
          {hint}
        </p>
      ) : null}

      <div className={cn('grid gap-2', COLUMNS[columns])}>
        {options.map((option) => {
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                'group flex min-h-11 cursor-pointer items-start gap-3 border px-4 py-3.5 transition-colors duration-(--dur-fast)',
                checked
                  ? 'border-espresso-900 bg-ivory-100'
                  : 'border-sand-300 bg-ivory-50 hover:border-sand-400',
                // The label is the focus surface, since the input is sr-only.
                'has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-espresso-900',
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={cn(
                  'mt-1 grid size-4.5 shrink-0 place-items-center rounded-full border transition-colors duration-(--dur-fast)',
                  checked ? 'border-espresso-900' : 'border-sand-400',
                )}
              >
                <span
                  className={cn(
                    'size-2 rounded-full bg-espresso-900 transition-opacity duration-(--dur-fast)',
                    checked ? 'opacity-100' : 'opacity-0',
                  )}
                />
              </span>
              <span className="flex flex-1 flex-col gap-1">
                <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <span className="text-body-sm font-medium text-espresso-900">{option.label}</span>
                  {option.meta ? (
                    <span className="text-body-xs text-stone-500">{option.meta}</span>
                  ) : null}
                </span>
                {option.description ? (
                  <span className="text-body-xs text-stone-500">{option.description}</span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>

      {error ? (
        <p id={errorId(name)} className="flex items-start gap-2 text-body-sm text-danger-700">
          <IconDanger className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </p>
      ) : null}
    </fieldset>
  );
}
