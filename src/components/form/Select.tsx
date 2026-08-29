'use client';

import { cn } from '@/lib/cn';
import { IconChevronDown } from '@/components/icons';
import { controlClasses } from './control';

import type { SelectHTMLAttributes } from 'react';

/**
 * Native `<select>` with a styled chevron.
 *
 * Native, not a listbox widget. On a phone the native control opens the
 * platform's own wheel or sheet, which is faster, familiar, and already handles
 * long option lists with a scroll position that survives rotation. A custom
 * listbox would have to re-implement typeahead, `aria-activedescendant`, and the
 * mobile sheet — for no gain beyond matching the border radius
 * (docs/DECISION_LOG.md D9).
 *
 * `appearance-none` removes the UA arrow and the chevron is drawn over the
 * control, `pointer-events-none` so clicks still reach the select.
 */

export interface SelectOption {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
}

type Props = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className' | 'children'> & {
  readonly options: readonly SelectOption[];
  /**
   * First entry, rendered `disabled` and `value=""`. Present so the control has
   * no pre-selected answer — a defaulted dropdown gets submitted unread.
   */
  readonly placeholder?: string;
  readonly invalid?: boolean;
  readonly className?: string;
};

export function Select({
  options,
  placeholder,
  invalid = false,
  className,
  ...rest
}: Props) {
  return (
    <div className="relative">
      <select
        {...rest}
        className={controlClasses(invalid, cn('appearance-none pr-11', className))}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      <IconChevronDown
        className={cn(
          'pointer-events-none absolute inset-y-0 end-4 my-auto size-4',
          invalid ? 'text-danger-700' : 'text-stone-500',
        )}
      />
    </div>
  );
}
