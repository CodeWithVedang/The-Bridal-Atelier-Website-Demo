'use client';

import { useEffect, useRef } from 'react';

import { track } from '@/lib/analytics';

import type { EventName, EventProps } from '@/lib/analytics';
import type { ReactNode } from 'react';

/**
 * Fires one analytics event the first time its box enters the viewport.
 *
 * `package_viewed` is specified as a *view*, not a click
 * (docs/ANALYTICS_SPEC.md §2): the question it answers is "which package do
 * brides actually look at", and a click-only event would only ever record the
 * one they chose. So it needs an observer, which needs a client boundary — kept
 * to this wrapper so `PackagesSection` itself stays a Server Component.
 *
 * The event is one-shot and the observer disconnects on the first hit; scrolling
 * a package back past the fold is the same view, not a second one.
 *
 * With no analytics sink registered (the shipped state) `track()` is a no-op, so
 * this costs one IntersectionObserver and nothing else — no request, no cookie,
 * no `localStorage`. If `IntersectionObserver` is missing the event is simply
 * never sent; a metric is not worth a fallback that could affect layout.
 */

export interface TrackInViewProps {
  readonly event: EventName;
  readonly props?: EventProps;
  readonly children: ReactNode;
  readonly className?: string;
}

export function TrackInView({ event, props, children, className }: TrackInViewProps) {
  const node = useRef<HTMLDivElement | null>(null);
  const latest = useRef<{ event: EventName; props?: EventProps }>({ event, props });

  // Kept in a ref rather than in the observer's dependency list: the props
  // object is a fresh literal on every render, so depending on it would tear
  // the observer down and rebuild it on each pass.
  useEffect(() => {
    latest.current = { event, props };
  }, [event, props]);

  useEffect(() => {
    const element = node.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.disconnect();
          track(latest.current.event, latest.current.props);
          return;
        }
      },
      // A third of the block on screen. Threshold rather than a rootMargin,
      // because a tall package card can otherwise "enter" while only its border
      // is visible.
      { threshold: 0.34 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={node} className={className}>
      {children}
    </div>
  );
}
