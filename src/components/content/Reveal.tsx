'use client';

import { useRef } from 'react';

import { cn } from '@/lib/cn';
import { useReveal } from '@/hooks/useReveal';

import type { ElementType, ReactNode } from 'react';

/**
 * Wraps a block in the one-shot scroll reveal (docs/MOTION_SPEC.md §3).
 *
 * All of the care lives in `useReveal`: the element is rendered visible and the
 * hidden state is only ever *added*, once the hook has confirmed an observer
 * exists and reduced motion is not requested. So no-JS, pre-hydration and
 * reduced-motion users get plain, readable content — which is why this component
 * is safe to wrap around anything, including copy that matters.
 *
 * The `reveal-in` class is applied only to elements that were actually hidden
 * first. Something already above the fold is never animated at all: fading in
 * content that the visitor is already looking at is a flash, not a flourish.
 *
 * `as` exists because a reveal must not change the document structure. A list of
 * journey stages still needs `<li>` children of a real `<ol>`, and a reveal that
 * always rendered a `<div>` would break that silently.
 */

export interface RevealProps {
  readonly children: ReactNode;
  /** Stagger within a group. Kept small — 60–120ms reads as considered, 400ms as broken. */
  readonly delayMs?: number;
  readonly as?: ElementType;
  readonly className?: string;
}

export function Reveal({ children, delayMs = 0, as: Tag = 'div', className }: RevealProps) {
  const { ref, shown, pending } = useReveal({ delayMs });
  const wasHidden = useRef(false);
  if (pending) wasHidden.current = true;

  return (
    <Tag
      ref={ref}
      className={cn(
        pending ? 'reveal-pending' : wasHidden.current && shown ? 'reveal-in' : undefined,
        className,
      )}
    >
      {children}
    </Tag>
  );
}
