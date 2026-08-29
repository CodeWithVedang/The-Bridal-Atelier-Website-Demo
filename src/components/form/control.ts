import { cn } from '@/lib/cn';

/**
 * Shared styling and id conventions for every form control.
 *
 * **Ids are derived from the field name, not from `useId()`.** That is a
 * deliberate constraint: it means `ErrorSummary` can link to `#field-city`
 * without the two components having to pass ids to each other, and it means the
 * server and client markup are identical without a hydration-stable id
 * generator. The cost is that a field name must be unique within a form, which
 * is already true of anything being posted as JSON.
 */

export function fieldId(name: string): string {
  return `field-${name}`;
}

export function hintId(name: string): string {
  return `field-${name}-hint`;
}

export function errorId(name: string): string {
  return `field-${name}-error`;
}

/**
 * `aria-describedby` for a control: hint first, then error.
 *
 * Order matters — a screen reader reads the description in sequence, and the
 * format hint ("as YYYY-MM-DD") is more useful before the complaint than after
 * it (docs/ACCESSIBILITY_SPEC.md §5).
 */
export function describedBy(name: string, options: { hint: boolean; error: boolean }): string | undefined {
  const ids = [options.hint ? hintId(name) : null, options.error ? errorId(name) : null].filter(
    Boolean,
  );
  return ids.length > 0 ? ids.join(' ') : undefined;
}

/**
 * The 44px minimum height is the tap-target floor from docs/UX_SPEC.md §7 —
 * WCAG 2.2 SC 2.5.8 asks 24px; a phone keyboard user needs more.
 *
 * `border` is 1px `sand-400` (3.06:1 against ivory, so the control's boundary
 * itself passes SC 1.4.11 non-text contrast). Focus is handled by the global
 * `:focus-visible` rule, so no control re-declares an outline and none can
 * accidentally remove it.
 */
const CONTROL_BASE =
  'block w-full min-h-11 rounded-sm border bg-ivory-50 px-3.5 py-2.5 text-body-md text-espresso-900 transition-colors duration-(--dur-fast) placeholder:text-stone-500/70 disabled:cursor-not-allowed disabled:bg-ivory-200 disabled:text-stone-500';

export function controlClasses(invalid: boolean, className?: string): string {
  return cn(
    CONTROL_BASE,
    invalid
      ? 'border-danger-700 hover:border-danger-700'
      : 'border-sand-400 hover:border-stone-500',
    className,
  );
}
