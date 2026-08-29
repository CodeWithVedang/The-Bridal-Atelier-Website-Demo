import Link from 'next/link';

import { cn } from '@/lib/cn';

import type { AnchorHTMLAttributes, ReactNode } from 'react';

/**
 * Inline link with a drawn underline.
 *
 * The underline is drawn on hover *and* on focus-visible (see `underline-draw`
 * in `globals.css`), so the affordance is identical for a pointer and a keyboard
 * — a hover-only effect silently downgrades the experience for anyone tabbing.
 *
 * Link text is always descriptive. There is no `arrow`-only mode: an arrow with
 * no accessible label is what produces a screen-reader list full of "link,
 * link, link" (docs/ACCESSIBILITY_SPEC.md §4).
 */

interface Props extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className'> {
  readonly href: string;
  readonly children: ReactNode;
  readonly external?: boolean;
  readonly tone?: 'default' | 'muted' | 'inverse';
  readonly withArrow?: boolean;
  readonly className?: string;
}

const TONES = {
  default: 'text-espresso-900',
  muted: 'text-stone-500 hover:text-espresso-900',
  inverse: 'text-ivory-100 hover:text-ivory-50',
} as const;

export function TextLink({
  href,
  children,
  external = false,
  tone = 'default',
  withArrow = false,
  className,
  ...rest
}: Props) {
  const classes = cn(
    'underline-draw inline-flex items-baseline gap-1.5 font-medium transition-colors duration-(--dur-fast)',
    TONES[tone],
    className,
  );

  const content = (
    <>
      <span>{children}</span>
      {withArrow ? (
        <span aria-hidden="true" className="translate-y-px text-[0.85em]">
          →
        </span>
      ) : null}
    </>
  );

  if (external) {
    return (
      <a {...rest} href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link {...rest} href={href} className={classes}>
      {content}
    </Link>
  );
}
