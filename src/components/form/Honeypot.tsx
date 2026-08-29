'use client';

/**
 * Bot friction (docs/SECURITY_SPEC.md §4).
 *
 * Two signals, neither of which inconveniences a person:
 *
 *  - **This field.** Named `honeypot` and hidden from sight and from assistive
 *    technology. A human never sees it and a screen reader never reaches it, so
 *    anything in it came from something filling every input it found.
 *  - **`renderedAt`**, added by `useValidatedForm`: elapsed milliseconds between
 *    the form mounting and the submit. A submission a few hundred milliseconds
 *    after render was not typed by a person.
 *
 * Deliberately *not* a CAPTCHA. A CAPTCHA would mean a third-party script, a
 * cookie, an image or audio puzzle that fails WCAG for some users, and a
 * dependency on an external service — for a demonstration site whose form
 * creates nothing durable. The trade-off is recorded in
 * docs/DECISION_LOG.md.
 *
 * The field is hidden with `sr-only` *plus* `aria-hidden` and `tabIndex={-1}`,
 * not with `display: none`. Some crawlers skip `display:none` inputs, which
 * would defeat the trap; `sr-only` keeps it in the layout tree but out of both
 * the visual and the accessibility tree.
 */

export interface HoneypotProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export function Honeypot({ value, onChange }: HoneypotProps) {
  return (
    <div className="sr-only" aria-hidden="true">
      <label htmlFor="field-honeypot">
        Company (leave this field empty)
        <input
          id="field-honeypot"
          name="honeypot"
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          tabIndex={-1}
          autoComplete="off"
          // Password managers ignore `autoComplete="off"` often enough that the
          // vendor opt-outs are worth carrying: a manager that helpfully fills
          // this field would get a real bride's enquiry rejected as a bot.
          data-lpignore="true"
          data-1p-ignore="true"
          data-form-type="other"
        />
      </label>
    </div>
  );
}
