'use client';

import { controlClasses } from './control';

import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

/**
 * Thin wrappers over the native controls.
 *
 * They are wrappers, not replacements. A custom-built text input has to
 * re-implement autofill, the software-keyboard type, spellcheck, the iOS "Done"
 * bar, dictation, password managers and translation — and gets at least one of
 * them wrong. So the native element stays, and only the paint changes
 * (docs/DECISION_LOG.md D9).
 *
 * The `invalid` prop drives the border colour. It is separate from
 * `aria-invalid`, which `Field` supplies, because a control can be styled as
 * invalid only when the message it points at is actually rendered.
 */

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & {
  readonly invalid?: boolean;
  readonly className?: string;
};

export function TextInput({ invalid = false, className, ...rest }: InputProps) {
  return <input {...rest} className={controlClasses(invalid, className)} />;
}

/**
 * Date input.
 *
 * Native `type="date"`, with `min`/`max` so the picker itself refuses a past
 * date rather than letting the bride discover the problem after submitting. The
 * pattern hint is in the label's hint text, since Safari and Firefox render the
 * field differently and a placeholder is ignored by the date UI in both.
 */
export function DateInput({
  invalid = false,
  className,
  ...rest
}: Omit<InputProps, 'type'>) {
  return <input {...rest} type="date" className={controlClasses(invalid, className)} />;
}

/**
 * Number input.
 *
 * `inputMode="numeric"` gives phones a numeric keypad, and the UA spinners are
 * suppressed in `globals.css` — a 20px-tall stepper next to a 44px target is a
 * mis-tap waiting to happen.
 */
export function NumberInput({
  invalid = false,
  className,
  ...rest
}: Omit<InputProps, 'type'>) {
  return (
    <input
      {...rest}
      type="number"
      inputMode="numeric"
      className={controlClasses(invalid, className)}
    />
  );
}

type TextAreaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> & {
  readonly invalid?: boolean;
  readonly className?: string;
  /**
   * Renders a live character count. Supplied by the form, which owns the value,
   * rather than read from a ref — a counter that lags the value by one keystroke
   * is worse than none.
   */
  readonly count?: { readonly value: number; readonly max: number };
};

export function TextArea({
  invalid = false,
  className,
  rows = 5,
  count,
  ...rest
}: TextAreaProps) {
  const textarea = (
    <textarea
      {...rest}
      rows={rows}
      maxLength={count?.max}
      className={controlClasses(invalid, `resize-y leading-relaxed ${className ?? ''}`)}
    />
  );

  if (!count) return textarea;

  const remaining = count.max - count.value;
  // Announced politely and only near the limit: a live region that fires on
  // every keystroke is unusable, and a count nobody is close to is not news.
  const near = remaining <= 40;

  return (
    <div className="flex flex-col gap-1.5">
      {textarea}
      <p
        aria-live={near ? 'polite' : 'off'}
        className={
          remaining < 0
            ? 'self-end text-body-xs text-danger-700'
            : near
              ? 'self-end text-body-xs text-espresso-700'
              : 'self-end text-body-xs text-stone-500'
        }
      >
        {remaining >= 0
          ? `${remaining} characters left`
          : `${Math.abs(remaining)} characters over`}
      </p>
    </div>
  );
}
