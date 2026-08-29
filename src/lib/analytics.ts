/**
 * Vendor-neutral analytics emitter (docs/ANALYTICS_SPEC.md §1).
 *
 * No analytics vendor is connected in this build (brief §18: do not connect an
 * external API unless required). What ships is the seam, so that adding a real
 * vendor later is one `registerSink` call in one client component and the event
 * taxonomy is designed now rather than retro-fitted around whatever the vendor
 * happens to make easy.
 *
 * With no sink registered `track()` does nothing at all: no network request, no
 * cookie, no `localStorage` write, no `window` access. That is what lets
 * `/privacy` state plainly that the site sets no cookies and runs no analytics,
 * and lets `track()` be called from a Server Component without a guard.
 *
 * Props are constrained to primitives on purpose. Handing an object to a sink
 * invites someone to pass a whole form payload into a vendor by accident; a
 * flat `Record<string, string | number | boolean>` makes every field an explicit
 * choice. Nothing in docs/ANALYTICS_SPEC.md §3 (names, phone, email, city,
 * venue, notes, the wedding date itself) may ever be passed here.
 */

export type EventName =
  | 'cta_clicked'
  | 'availability_checked'
  | 'consultation_started'
  | 'consultation_step_completed'
  | 'consultation_submitted'
  | 'consultation_failed'
  | 'package_viewed'
  | 'portfolio_filtered'
  | 'portfolio_project_opened'
  | 'faq_opened'
  | 'nav_opened';

export type EventProps = Readonly<Record<string, string | number | boolean>>;

export interface AnalyticsEvent {
  readonly name: EventName;
  readonly props?: EventProps;
}

export type AnalyticsSink = (event: AnalyticsEvent) => void;

let sink: AnalyticsSink | null = null;

/** Returns an unsubscribe function so a React effect can clean up after itself. */
export function registerSink(fn: AnalyticsSink): () => void {
  sink = fn;
  return () => {
    if (sink === fn) sink = null;
  };
}

export function track(name: EventName, props?: EventProps): void {
  if (!sink) return;
  try {
    sink({ name, props });
  } catch {
    // A broken analytics vendor must never break a booking. Swallowed silently
    // rather than logged, because a sink that throws on every event would
    // otherwise flood the console during a form submission.
  }
}

/** Test seam: drops any registered sink. */
export function __resetAnalytics(): void {
  sink = null;
}
