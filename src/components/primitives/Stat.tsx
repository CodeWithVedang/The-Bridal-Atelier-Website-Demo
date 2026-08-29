import { cn } from '@/lib/cn';

/**
 * A single structural fact.
 *
 * Used only for facts that are true by construction — "3 artists", "5 stages",
 * "1 trial included". Never for social proof: there is no "500 happy brides"
 * here, because The Bridal Atelier has had none, and an invented count is the
 * fabricated-evidence failure that docs/PSYCHOLOGY_SPEC.md §5 rules out.
 *
 * The value renders in display type but is not a heading — it is data, and
 * putting "3" into the document outline helps nobody.
 */

export interface StatProps {
  readonly value: string;
  readonly label: string;
  readonly tone?: 'default' | 'inverse';
  readonly className?: string;
}

export function Stat({ value, label, tone = 'default', className }: StatProps) {
  const inverse = tone === 'inverse';
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <span
        className={cn(
          'font-display text-display-sm leading-none',
          inverse ? 'text-ivory-50' : 'text-espresso-900',
        )}
      >
        {value}
      </span>
      <span
        className={cn(
          'text-body-sm',
          inverse ? 'text-ivory-200/80' : 'text-stone-500',
        )}
      >
        {label}
      </span>
    </div>
  );
}
