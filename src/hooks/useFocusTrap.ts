'use client';

import { useEffect, useRef } from 'react';

/**
 * Focus containment for the mobile navigation sheet.
 *
 * Written by hand rather than pulled from a dialog library: the project needs a
 * trap in exactly one place, and a dependency would ship a full dialog
 * implementation for it (docs/DECISION_LOG.md D9).
 *
 * What it does, in the order the WCAG criteria require:
 *
 *  - **2.4.3 Focus Order / 2.1.2 No Keyboard Trap.** Tab and Shift+Tab cycle
 *    within the container; `Esc` closes, so the trap is escapable.
 *  - **2.4.11 Focus Not Obscured.** Focus moves to the first focusable element
 *    inside the sheet on open, not to the container itself, so the browser
 *    scrolls something real into view.
 *  - **Focus restoration.** The element that had focus when the sheet opened is
 *    refocused on close. Without this, closing the nav drops focus to `<body>`
 *    and a keyboard user restarts from the top of the document.
 *
 * The tabbable set is queried on each key press rather than cached, because the
 * sheet's contents can change while it is open (an accordion inside it opening).
 */

const TABBABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'summary',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function tabbables(container: HTMLElement): readonly HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(TABBABLE)).filter((node) => {
    if (node.hasAttribute('inert')) return false;
    if (node.getAttribute('aria-hidden') === 'true') return false;
    // `offsetParent` is null for `display:none` subtrees; a zero-size element
    // (the honeypot) is skipped for the same reason a sighted user would.
    return node.offsetParent !== null || node.getClientRects().length > 0;
  });
}

export function useFocusTrap(
  active: boolean,
  onEscape: () => void,
): React.RefObject<HTMLDivElement | null> {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  // Held in a ref so changing the handler identity does not tear down the trap.
  const escapeRef = useRef(onEscape);
  escapeRef.current = onEscape;

  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    restoreRef.current = document.activeElement as HTMLElement | null;

    const initial = tabbables(container);
    (initial[0] ?? container).focus({ preventScroll: true });

    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        event.preventDefault();
        escapeRef.current();
        return;
      }
      if (event.key !== 'Tab') return;

      const nodes = tabbables(container!);
      if (nodes.length === 0) {
        event.preventDefault();
        return;
      }

      const first = nodes[0]!;
      const last = nodes[nodes.length - 1]!;
      const current = document.activeElement;

      if (event.shiftKey && (current === first || !container!.contains(current))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown, true);

    // Scroll lock. `overflow: hidden` on `<body>` alone lets iOS Safari scroll
    // the page behind the sheet, so the scroll position is pinned and restored.
    const { body } = document;
    const scrollY = window.scrollY;
    const previous = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';

    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      body.style.overflow = previous.overflow;
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      window.scrollTo({ top: scrollY, behavior: 'instant' });
      restoreRef.current?.focus({ preventScroll: true });
    };
  }, [active]);

  return containerRef;
}
