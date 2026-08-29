'use client';

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
 * Something already on screen at mount is never animated at all, and the hook
 * decides that by measuring the node, so this component holds no state and passes
 * `className` straight through. The reveal is expressed as a `data-reveal`
 * attribute the hook owns; React owns `className`, and the two do not collide.
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
  const { ref } = useReveal({ delayMs });

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
