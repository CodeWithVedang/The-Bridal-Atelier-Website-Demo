import { cn } from '@/lib/cn';

/**
 * Busy indicator.
 *
 * `role="status"` with a visually hidden label, so a screen reader announces
 * that something is happening rather than leaving the user in silence after
 * pressing submit. The label is a prop because "Sending" and "Checking" are
 * different facts and both get said out loud.
 *
 * The ring is drawn with `border` rather than an SVG so it inherits
 * `currentColor` and needs no fill/stroke plumbing per variant. Under
 * `prefers-reduced-motion` the global override in `globals.css` reduces the
 * animation to 1ms; the ring stays visible, so the state is still legible
 * without spinning.
 */

export interface SpinnerProps {
  readonly label: string;
  readonly size?: 'sm' | 'md';
  readonly className?: string;
  /** Set when a parent already carries `role="status"` and the label. */
  readonly silent?: boolean;
}

const SIZES = {
  sm: 'size-4 border-[1.5px]',
  md: 'size-6 border-2',
} as const;

export function Spinner({ label, size = 'sm', className, silent = false }: SpinnerProps) {
  return (
    <span
      role={silent ? undefined : 'status'}
      className={cn('inline-flex items-center', className)}
    >
      <span
        aria-hidden="true"
        className={cn(
          'animate-spin-slow rounded-full border-current border-t-transparent opacity-70',
          SIZES[size],
        )}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
