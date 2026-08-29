import { cn } from '@/lib/cn';

/**
 * Hairline divider, optionally with a centred ornament.
 *
 * `role="presentation"` rather than `<hr>` when ornamented: the diamond is
 * decoration and an `<hr>` announces a thematic break, which is not what a
 * decorative flourish between a heading and its body copy means. The plain
 * variant *is* an `<hr>`, because there it genuinely separates content.
 */

export interface RuleProps {
  readonly ornament?: boolean;
  readonly tone?: 'sand' | 'gold' | 'inverse';
  readonly className?: string;
}

const TONES = {
  sand: 'bg-sand-300',
  gold: 'bg-gold-500/50',
  inverse: 'bg-ivory-200/25',
} as const;

const DOT = {
  sand: 'bg-sand-400',
  gold: 'bg-gold-500',
  inverse: 'bg-ivory-200/60',
} as const;

export function Rule({ ornament = false, tone = 'sand', className }: RuleProps) {
  if (!ornament) {
    return <hr className={cn('h-px w-full border-0', TONES[tone], className)} />;
  }

  return (
    <div
      role="presentation"
      className={cn('flex w-full items-center gap-4', className)}
    >
      <span className={cn('h-px flex-1', TONES[tone])} />
      <span className={cn('size-1.5 rotate-45', DOT[tone])} />
      <span className={cn('h-px flex-1', TONES[tone])} />
    </div>
  );
}
