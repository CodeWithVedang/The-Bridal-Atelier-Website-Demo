'use client';

import { useEffect, useRef } from 'react';

import { cn } from '@/lib/cn';
import { IconDanger } from '@/components/icons';
import { fieldId } from './control';

/**
 * The list of errors above a submitted form (docs/ACCESSIBILITY_SPEC.md §5).
 *
 * WCAG 3.3.1 is satisfied by the per-field messages alone, but a long form needs
 * this as well: after a failed submit the bride is looking at the button, and the
 * field that needs fixing may be four screens up. The summary puts every problem
 * in one place, each as a link that moves focus to the control.
 *
 * The focus behaviour is the part that has to be exactly right:
 *
 *  - The container is focused, not the first field. Jumping straight to a control
 *    hides the fact that there are five other problems.
 *  - It re-focuses on every failed attempt, keyed on `submitCount`, because a
 *    second submit that fails the same way produces no DOM change and would
 *    otherwise be announced as nothing at all.
 *  - `tabIndex={-1}` makes it programmatically focusable without inserting a stop
 *    in the tab order for everyone who never sees an error.
 */

export interface ErrorSummaryProps {
  /** Field name → message. Rendered in `order`, not in object key order. */
  readonly errors: Readonly<Record<string, string | undefined>>;
  /** Field names in the order they appear on screen. */
  readonly order: readonly string[];
  /** Human labels, so the link text is "Wedding date", not "weddingDate". */
  readonly labels: Readonly<Record<string, string>>;
  /** Increment on each failed attempt to re-trigger focus. */
  readonly submitCount: number;
  readonly className?: string;
}

export function ErrorSummary({
  errors,
  order,
  labels,
  submitCount,
  className,
}: ErrorSummaryProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const rows = order
    .filter((name) => errors[name])
    .map((name) => ({ name, message: errors[name]!, label: labels[name] ?? name }));

  // Any error not in `order` still has to be shown — a field added to the schema
  // and forgotten here must not produce a silent failure (brief §34).
  for (const [name, message] of Object.entries(errors)) {
    if (!message || order.includes(name)) continue;
    rows.push({ name, message, label: labels[name] ?? name });
  }

  const count = rows.length;

  useEffect(() => {
    if (count === 0) return;
    ref.current?.focus();
  }, [count, submitCount]);

  if (count === 0) return null;

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="alert"
      className={cn(
        'flex flex-col gap-3 border border-danger-700/40 bg-danger-700/6 p-5',
        className,
      )}
    >
      <p className="flex items-center gap-2 font-medium text-espresso-900">
        <IconDanger className="size-5 text-danger-700" />
        {count === 1
          ? 'One detail needs your attention before we can send this.'
          : `${count} details need your attention before we can send this.`}
      </p>
      <ul className="flex flex-col gap-2 text-body-sm">
        {rows.map((row) => (
          <li key={row.name}>
            <a
              href={`#${fieldId(row.name)}`}
              className="underline-retract text-danger-700"
              onClick={(event) => {
                // `href` alone would work, but focusing explicitly means the
                // control is *focused* rather than merely scrolled to, so typing
                // continues immediately.
                const target = document.getElementById(fieldId(row.name));
                if (!target) return;
                event.preventDefault();
                target.focus();
                target.scrollIntoView({ block: 'center', behavior: 'smooth' });
              }}
            >
              <span className="font-medium">{row.label}:</span> {row.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
