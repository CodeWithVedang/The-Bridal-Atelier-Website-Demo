'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/cn';
import { primaryNav, site } from '@/config/site';
import { track } from '@/lib/analytics';
import { Button } from '@/components/primitives';
import { IconMenu } from '@/components/icons';
import { DesktopNav } from './DesktopNav';
import { MobileNavSheet } from './MobileNavSheet';

/**
 * The site header (docs/UX_SPEC.md §2).
 *
 * **Height is fixed** at `--header-h` / `--header-h-lg` and never changes with
 * scroll state. Only the ground and the hairline change. A header that shrinks on
 * scroll moves every anchor target on the page and fights `scroll-padding-top`,
 * which is set from the same token in `globals.css`.
 *
 * The scroll listener is `passive` and writes a boolean, so it cannot cause a
 * layout read per frame. It is compared against the current state before setting,
 * so scrolling from 200px to 800px produces no re-renders at all.
 *
 * The sheet is **keyed to the route it was opened on**, so a navigation closes it
 * without a second render to undo the first. The `onClick` on each link covers the
 * common case; keying covers the rest, including a browser back gesture, where no
 * handler of ours runs at all.
 *
 * The sheet is a **sibling** of `<header>`, not a child. Once scrolled, the header
 * carries `backdrop-blur`, and `backdrop-filter` makes an element a containing
 * block for `position: fixed` descendants — nested inside, the sheet's
 * `fixed inset-0` would resolve to the 72px header box instead of the viewport.
 */

const SCROLL_THRESHOLD = 24;

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // The route the sheet was opened on, not a bare boolean. `menuOpen` is then
  // derived, and a navigation closes the sheet by making the two disagree —
  // no effect watching `pathname`, and no render whose only job is to undo the
  // one before it.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const menuOpen = openedAt === pathname;

  useEffect(() => {
    function onScroll(): void {
      const next = window.scrollY > SCROLL_THRESHOLD;
      setScrolled((current) => (current === next ? current : next));
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        data-site-header
        className={cn(
          'sticky top-0 z-90 h-(--header-h) transition-[background-color,border-color,box-shadow] duration-(--dur-base) lg:h-(--header-h-lg)',
          scrolled
            ? 'border-b border-sand-300 bg-ivory-50/95 backdrop-blur-md'
            : 'border-b border-transparent bg-ivory-50',
        )}
      >
        <div className="mx-auto flex h-full w-full max-w-(--container-max) items-center justify-between gap-6 px-5 sm:px-8 lg:px-12 2xl:px-16">
          <Link
            href="/"
            aria-label={`${site.name} — home`}
            className="flex shrink-0 flex-col leading-none"
          >
            <span className="font-display text-body-lg tracking-tight text-espresso-900 sm:text-display-sm">
              {site.wordmark.first}
            </span>
            <span className="text-label text-gold-600">{site.wordmark.second}</span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <DesktopNav items={primaryNav} />
          </nav>

          <div className="flex items-center gap-2">
            <Button
              href="/book"
              size="sm"
              className="hidden lg:inline-flex"
              onClick={() => track('cta_clicked', { channel: 'consultation', location: 'header' })}
            >
              Book Consultation
            </Button>

            <button
              type="button"
              aria-expanded={menuOpen}
              aria-haspopup="dialog"
              onClick={() => {
                setOpenedAt(pathname);
                track('nav_opened');
              }}
              className="grid size-11 place-items-center rounded-sm text-espresso-900 transition-colors duration-(--dur-fast) hover:bg-ivory-100 lg:hidden"
            >
              <IconMenu className="size-6" />
              <span className="sr-only">Open menu</span>
            </button>
          </div>
        </div>
      </header>

      <MobileNavSheet
        open={menuOpen}
        onClose={() => setOpenedAt(null)}
        items={primaryNav}
        pathname={pathname}
      />
    </>
  );
}
