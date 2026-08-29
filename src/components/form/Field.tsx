import { cn } from '@/lib/cn';
import { IconDanger } from '@/components/icons';
import { describedBy, errorId, fieldId, hintId } from './control';

import type { ReactNode } from 'react';

/**
 * Label, hint, control and error — wired together.
 *
 * The control is supplied as a render prop rather than as `children`, so the
 * `id`, `aria-describedby` and `aria-invalid` wiring cannot be forgotten: there
 * is no way to render a `Field` without receiving them. Every accessible-name
 * failure I have seen in a form comes from exactly that wiring being optional
 * (docs/ACCESSIBILITY_SPEC.md §5).
 *
 * Rules the markup enforces:
 *
 *  - The `<label>` is visible and persistent. Placeholders carry format examples
 *    only, never the field's name — a placeholder disappears the moment typing
 *    starts, and with it the only clue about what the field was.
 *  - "Required" is written as a word. A red asterisk is colour-plus-symbol with
 *    no text equivalent, and `aria-required` alone is silent for a sighted user.
 *    Optional fields are marked "Optional" for the same reason, so the bride
 *    never has to infer from absence.
 *  - The error sits below the control, in `danger-700` (6.18:1), with an icon —
 *    so it is not colour alone (SC 1.4.1).
 */

export interface FieldRenderProps {
  readonly id: string;
  readonly name: string;
  readonly 'aria-describedby': string | undefined;
  readonly 'aria-invalid': true | undefined;
  readonly 'aria-required': true | undefined;
}

export interface FieldProps {
  readonly name: string;
  readonly label: string;
  readonly hint?: ReactNode;
  readonly error?: string;
  readonly required?: boolean;
  /** Suppresses the "Optional" marker where it would be noise (a filter row). */
  readonly hideOptional?: boolean;
  readonly className?: string;
  readonly children: (props: FieldRenderProps) => ReactNode;
}

export function Field({
  name,
  label,
  hint,
  error,
  required = false,
  hideOptional = false,
  className,
  children,
}: FieldProps) {
  const id = fieldId(name);
  const hasHint = Boolean(hint);
  const hasError = Boolean(error);

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-body-sm font-medium text-espresso-900">{label}</span>
        {required ? (
          <span className="text-body-xs text-stone-500">Required</span>
        ) : hideOptional ? null : (
          <span className="text-body-xs text-stone-500">Optional</span>
        )}
      </label>

      {hasHint ? (
        <p id={hintId(name)} className="text-body-xs text-stone-500">
          {hint}
        </p>
      ) : null}

      {children({
        id,
        name,
        'aria-describedby': describedBy(name, { hint: hasHint, error: hasError }),
        'aria-invalid': hasError || undefined,
        'aria-required': required || undefined,
      })}

      {hasError ? (
        <p
          id={errorId(name)}
          className="flex items-start gap-2 text-body-sm text-danger-700"
        >
          <IconDanger className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}
