'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * One-shot reveal on first intersection.
 *
 * The critical property is the **direction of the default**. The element starts
 * visible in markup; this hook only ever *adds* the pending state, and only once
 * it has confirmed that `IntersectionObserver` exists and that the user has not
 * asked for reduced motion. So with JavaScript disabled, before hydration, or
 * with an observer-less browser, every section is readable — the failure mode of
 * a reveal animation must never be invisible content (docs/ACCESSIBILITY_SPEC.md
 * §6, docs/PERFORMANCE_SPEC.md §4).
 *
 * `rootMargin` has a negative bottom so a block reveals slightly before its top
 * edge clears the fold, and a positive top so an element scrolled *up* to is not
 * left mid-animation.
 */

export interface RevealState {
  readonly ref: (node: HTMLElement | null) => void;
  /** True once the element has entered the viewport, or immediately if unable to observe. */
  readonly shown: boolean;
  /** True only while the pending (offset, transparent) state should be applied. */
  readonly pending: boolean;
}

export function useReveal(options: { readonly delayMs?: number } = {}): RevealState {
  const { delayMs = 0 } = options;
  const [shown, setShown] = useState(false);
  const [armed, setArmed] = useState(false);
  const nodeRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }

    const node = nodeRef.current;
    if (!node) {
      setShown(true);
      return;
    }

    // Already on screen at mount (above the fold): reveal without arming the
    // hidden state, so the hero and first section never flash.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      setShown(true);
      return;
    }

    setArmed(true);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.disconnect();
          if (delayMs > 0) {
            window.setTimeout(() => setShown(true), delayMs);
          } else {
            setShown(true);
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [delayMs]);

  const ref = (node: HTMLElement | null): void => {
    nodeRef.current = node;
  };

  return { ref, shown, pending: armed && !shown };
}
