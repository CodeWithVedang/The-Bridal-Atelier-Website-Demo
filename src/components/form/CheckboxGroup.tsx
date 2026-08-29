'use client';

import { cn } from '@/lib/cn';
import { IconCheck, IconDanger } from '@/components/icons';
import { errorId, fieldId, hintId } from './control';

/**
 * Multi-select group (`<fieldset>` + `<legend>`).
 *
 * A real `<fieldset>` with a visible `<legend>`, not a `<div>` with
 * `role="group"` and an `aria-label`: the legend is announced as the group's name
 * when focus enters any checkbox inside it, which is exactly what "Which
 * functions?" needs to be. Styling a legend is awkward, which is why the pattern
 * is so often skipped — that is not a reason to skip it
 * (docs/ACCESSIBILITY_SPEC.md §5).
 *
 * The checkbox itself is the native control, visually enlarged rather than
 * replaced, so indeterminate state, keyboard activation and Windows High
 * Contrast Mode all keep working. The whole row is the label, giving a target far
 * larger than the 44px floor.
 */

export interface CheckboxOption {
  readonly value: string;
  readonly label: string;
  readonly hint?: string;
}

export interface CheckboxGroupProps {
  readonly name: string;
  readonly legend: string;
  readonly options: readonly CheckboxOption[];
  readonly value: readonly string[];
  readonly onChange: (next: readonly string[]) => void;
  readonly hint?: string;
  readonly error?: string;
  readonly required?: boolean;
  readonly columns?: 1 | 2;
  readonly className?: string;
}

export function CheckboxGroup({
  name,
  legend,
  options,
  value,
  onChange,
  hint,
  error,
  required = false,
  columns = 2,
  className,
}: CheckboxGroupProps) {
  const selected = new Set(value);

  function toggle(optionValue: string): void {
    const next = new Set(selected);
    if (next.has(optionValue)) {
      next.delete(optionValue);
    } else {
      next.add(optionValue);
    }
    // Emitted in the options' own order, so the payload does not depend on the
    // order the bride happened to tick things in.
    onChange(options.filter((option) => next.has(option.value)).map((option) => option.value));
  }

  return (
    <fieldset
      // `fieldId(name)`, the same id a `Field`-wrapped control would carry, and
      // focusable — so an `ErrorSummary` link for a group lands on the group and
      // announces its legend. Without it the link would resolve to nothing, which
      // is exactly the silent failure brief §34 forbids.
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

      <div className={cn('grid gap-2', columns === 2 && 'sm:grid-cols-2')}>
        {options.map((option) => {
          const checked = selected.has(option.value);
          return (
            <label
              key={option.value}
              className={cn(
                'flex min-h-11 cursor-pointer items-start gap-3 border px-3.5 py-3 transition-colors duration-(--dur-fast)',
                checked
                  ? 'border-espresso-900 bg-ivory-100'
                  : 'border-sand-300 bg-ivory-50 hover:border-sand-400',
              )}
            >
              <span className="relative mt-0.5 flex size-5 shrink-0 items-center justify-center">
                <input
                  type="checkbox"
                  name={name}
                  value={option.value}
                  checked={checked}
                  onChange={() => toggle(option.value)}
                  className="peer size-5 appearance-none rounded-xs border border-sand-400 bg-ivory-50 checked:border-espresso-900 checked:bg-espresso-900"
                />
                <IconCheck className="pointer-events-none absolute size-3.5 text-ivory-50 opacity-0 peer-checked:opacity-100" />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-body-sm text-espresso-900">{option.label}</span>
                {option.hint ? (
                  <span className="text-body-xs text-stone-500">{option.hint}</span>
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
