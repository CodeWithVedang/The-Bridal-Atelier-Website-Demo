/**
 * Class-name join.
 *
 * Deliberately not `clsx` + `tailwind-merge`: that is two runtime dependencies
 * for something this project needs in one form only. There is no conflict
 * resolution here, so a component that takes a `className` override must not
 * also hard-code the property being overridden — the components in
 * `src/components/` follow that rule (docs/PERFORMANCE_SPEC.md §3).
 */

export type ClassValue = string | number | false | null | undefined;

export function cn(...values: readonly ClassValue[]): string {
  let out = '';
  for (const value of values) {
    if (!value && value !== 0) continue;
    out = out ? `${out} ${value}` : String(value);
  }
  return out;
}
