import { cn } from '@/lib/cn';

/**
 * Loading placeholder.
 *
 * The shimmer is an opacity pulse, not a moving gradient: a translating
 * highlight is the kind of continuous animation that triggers vestibular
 * discomfort, and the global `prefers-reduced-motion` block in `globals.css`
 * flattens it to a static tint (docs/ACCESSIBILITY_SPEC.md §6).
 *
 * A skeleton is `aria-hidden` and the *container* owns the announcement. A grid
 * of twelve skeleton tiles that each announce "loading" is twelve
 * interruptions for one event.
 */

export interface SkeletonProps {
  readonly className?: string;
  readonly rounded?: boolean;
}

export function Skeleton({ className, rounded = false }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'block animate-shimmer bg-ivory-200',
        rounded ? 'rounded-full' : 'rounded-xs',
        className,
      )}
    />
  );
}

/**
 * Text-shaped skeleton.
 *
 * The last line is short, because a block of equal-length bars does not read as
 * text and therefore does not communicate what is arriving.
 */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <span className={cn('flex flex-col gap-2.5', className)}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          className={cn('h-3.5', index === lines - 1 ? 'w-2/5' : 'w-full')}
        />
      ))}
    </span>
  );
}
