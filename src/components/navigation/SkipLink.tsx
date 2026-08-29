/**
 * The first focusable element on every page (docs/ACCESSIBILITY_SPEC.md §3).
 *
 * Visible on focus rather than permanently — but *genuinely* visible: it is
 * positioned, not merely un-clipped, so it lands over the header instead of
 * pushing the layout down as it appears. A skip link that shifts the page as it
 * receives focus is the reason people believe skip links are broken.
 *
 * `sr-only focus:not-sr-only` is the only mechanism here. There is no JavaScript,
 * so it works before hydration — which is exactly when a keyboard user pressing
 * Tab is most likely to be waiting.
 */

export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only rounded-sm bg-espresso-900 px-5 py-3 text-body-sm font-medium text-ivory-50 focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:shadow-md"
    >
      Skip to content
    </a>
  );
}
