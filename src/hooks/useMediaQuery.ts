'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Reads a media query without causing a hydration mismatch.
 *
 * `useSyncExternalStore` is used rather than `useState` + `useEffect` because it
 * has a dedicated server snapshot: the server always renders the `false` branch,
 * and the client corrects on the first commit. The `useState`/`useEffect` form
 * renders the wrong branch on the client's *first* paint too, which is a visible
 * flash on exactly the components that use this — a nav switching between a
 * sheet and a bar.
 *
 * This hook is for behaviour that CSS genuinely cannot express (whether to mount
 * a focus trap, whether to attach an observer). Anything that is purely visual
 * stays in CSS, where it works before hydration.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  // Server and pre-hydration snapshot. Always the "no match" branch, so a
  // component must be written so that `false` is the safe, content-visible case.
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Convenience wrapper — used by `Reveal`, `Skeleton` and `BeforeAfterSlider`. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
