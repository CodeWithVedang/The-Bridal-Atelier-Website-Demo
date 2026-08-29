'use client';

import { useEffect, useRef } from 'react';

/**
 * One-shot reveal on first intersection.
 *
 * The critical property is the **direction of the default**. The element is
 * visible in the markup; this hook only ever *adds* the hidden state, and only
 * once it has confirmed that `IntersectionObserver` exists and that the user has
 * not asked for reduced motion. So with JavaScript disabled, before hydration, or
 * in an observer-less browser, every section is readable — the failure mode of a
 * reveal animation must never be invisible content (docs/ACCESSIBILITY_SPEC.md
 * §6, docs/PERFORMANCE_SPEC.md §4).
 *
 * The two visual states are written as a `data-reveal` attribute on the node
 * rather than held in React state:
 *
 *  - Nothing in the tree needs to *read* whether an element is mid-reveal, so
 *    state would exist only to be written straight back out as a class. That is
 *    DOM state, not application state, and setting it from an effect body is
 *    precisely what `react-hooks/set-state-in-effect` exists to catch.
 *  - An attribute set imperatively survives a re-render of the wrapper. A class
 *    would not: React owns `className`, and any parent re-render would drop a
 *    class it did not author, cancelling the animation mid-flight.
 *  - It costs one render pass per revealed element instead of two.
 *
 * Arming from a passive effect — after paint — is safe here precisely because an
 * element is only armed if it is *below the fold*. The un-hidden frame the
 * browser may paint first is off-screen by construction, so there is nothing to
 * flash.
 *
 * `rootMargin` has a negative bottom so a block reveals slightly before its top
 * edge clears the fold, rather than at the exact moment it is already readable.
 */

/** Offset and transparent, waiting for the observer to fire. */
const PENDING = 'pending';
/** Playing the one-shot `reveal` keyframes; cleared when they finish. */
const PLAYING = 'in';

/**
 * An element whose top is already inside this fraction of the viewport counts as
 * on screen at mount and is never armed. Fading in content the visitor is already
 * looking at is a flash, not a flourish.
 */
const FOLD = 0.9;

export interface RevealState {
  /** Callback ref for the element to observe. */
  readonly ref: (node: HTMLElement | null) => void;
}

export function useReveal(options: { readonly delayMs?: number } = {}): RevealState {
  const { delayMs = 0 } = options;
  const nodeRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (node.getBoundingClientRect().top < window.innerHeight * FOLD) return;

    node.dataset.reveal = PENDING;

    let timer = 0;

    /**
     * Swap the hidden state for the animation, then drop the attribute when the
     * keyframes finish. Leaving it in place would keep a completed `animation`
     * (and its `transform`) on the element forever, which makes every revealed
     * block a containing block for `position: fixed` descendants.
     */
    const play = (): void => {
      node.addEventListener(
        'animationend',
        (event) => {
          // `animationend` bubbles: a child's own animation must not clear ours.
          if (event.target === node) delete node.dataset.reveal;
        },
        { once: true },
      );
      node.dataset.reveal = PLAYING;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        if (delayMs > 0) {
          timer = window.setTimeout(play, delayMs);
        } else {
          play();
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      // Unmount, a changed delay or a fast-refresh edit must never leave the
      // node parked at opacity 0.
      delete node.dataset.reveal;
    };
  }, [delayMs]);

  const ref = (node: HTMLElement | null): void => {
    nodeRef.current = node;
  };

  return { ref };
}
