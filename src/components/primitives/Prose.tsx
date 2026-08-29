import { cn } from '@/lib/cn';

import type { ReactNode } from 'react';

/**
 * Typographic defaults for long-form copy (the two policy pages, the about
 * narrative).
 *
 * The styling lives in the `prose-atelier` utility in `globals.css` rather than
 * as a wall of `[&_h2]:` variants here, because those descendant selectors are
 * unreadable at this volume and the utility can be reviewed as CSS. The measure
 * is capped at 68ch — WCAG 1.4.8 asks for 80 characters or fewer, and 68 is the
 * comfortable figure for this body face.
 */

export interface ProseProps {
  readonly children: ReactNode;
  readonly className?: string;
}

export function Prose({ children, className }: ProseProps) {
  return <div className={cn('prose-atelier text-body-md', className)}>{children}</div>;
}
