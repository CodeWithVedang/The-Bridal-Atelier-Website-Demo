import { cn } from '@/lib/cn';

import type { ElementType, ReactNode } from 'react';

/**
 * Horizontal measure and gutters.
 *
 * Two widths only: the 1280px content measure and an 800px prose measure
 * (docs/UI_SPEC.md §1). Gutters step up across the six breakpoints rather than
 * staying fixed, because a 24px gutter that reads as generous on a phone reads
 * as a mistake at 1536px.
 *
 * `as` exists so a `Container` can be the semantic element itself — a `<header>`
 * or an `<ul>` — instead of adding a wrapper `<div>` around one.
 */

export interface ContainerProps {
  readonly children: ReactNode;
  readonly as?: ElementType;
  readonly width?: 'default' | 'narrow' | 'wide';
  readonly className?: string;
  readonly id?: string;
}

const WIDTHS = {
  default: 'max-w-(--container-max)',
  narrow: 'max-w-(--container-narrow)',
  /** Full-bleed rows that still need gutters — the portfolio grid at 2xl. */
  wide: 'max-w-none',
} as const;

export function Container({
  children,
  as: Tag = 'div',
  width = 'default',
  className,
  id,
}: ContainerProps) {
  return (
    <Tag
      id={id}
      className={cn('mx-auto w-full px-5 sm:px-8 lg:px-12 2xl:px-16', WIDTHS[width], className)}
    >
      {children}
    </Tag>
  );
}
