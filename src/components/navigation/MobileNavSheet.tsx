'use client';

import Link from 'next/link';

import { cn } from '@/lib/cn';
import { contact, site } from '@/config/site';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { Button } from '@/components/primitives';
import { IconClose, IconMail, IconPhone, IconWhatsApp } from '@/components/icons';
import { isCurrent } from './DesktopNav';

import type { NavItem } from './DesktopNav';

/**
 * Full-height navigation sheet, below 1024px (docs/UX_SPEC.md §2).
 *
 * `useFocusTrap` supplies everything the dialog pattern requires — Tab
 * containment, `Esc` to close, body scroll lock pinned for iOS Safari, and focus
 * restoration to the hamburger on close. The sheet only has to supply the
 * `role="dialog"` / `aria-modal` pairing and a real close button.
 *
 * The backdrop is not focusable. Clicking it closes the sheet, which is a pointer
 * affordance; a keyboard user has `Esc` and the close button, and making the
 * backdrop a `<button>` would put "Close menu" as the first Tab stop *before* the
 * navigation the sheet exists to present.
 *
 * The sheet is unmounted when closed rather than hidden. A `hidden` sheet full of
 * links is still in the accessibility tree for some combinations of assistive
 * technology, and `inert` is not yet safe to rely on alone.
 */

export interface MobileNavSheetProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly items: readonly NavItem[];
  readonly pathname: string;
}

export function MobileNavSheet({ open, onClose, items, pathname }: MobileNavSheetProps) {
  const panelRef = useFocusTrap(open, onClose);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-90 lg:hidden">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-espresso-900/45 backdrop-blur-[2px]"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-y-auto bg-ivory-50 shadow-lg animate-sheet-in"
      >
        <div className="flex items-center justify-between border-b border-sand-300 px-5 py-4">
          <span className="font-display text-body-lg text-espresso-900">{site.shortName}</span>
          <button
            type="button"
            onClick={onClose}
            className="grid size-11 place-items-center rounded-sm text-espresso-700 transition-colors duration-(--dur-fast) hover:bg-ivory-100 hover:text-espresso-900"
          >
            <IconClose className="size-5" />
            <span className="sr-only">Close menu</span>
          </button>
        </div>

        <nav aria-label="Site menu" className="px-5 py-2">
          <ul className="flex flex-col divide-y divide-sand-300">
            {items.map((item) => {
              const current = isCurrent(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={current ? 'page' : undefined}
                    className={cn(
                      'flex min-h-14 items-center font-display text-display-sm leading-none transition-colors duration-(--dur-fast)',
                      current ? 'text-espresso-900' : 'text-espresso-700 hover:text-espresso-900',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto flex flex-col gap-3 border-t border-sand-300 px-5 py-5">
          <Button href="/book" size="md" fullWidth onClick={onClose}>
            Book Bridal Consultation
          </Button>

          {contact.whatsapp.configured ? (
            <Button
              href={contact.whatsapp.href}
              external
              variant="secondary"
              size="md"
              fullWidth
              trailingIcon={<IconWhatsApp className="size-4" />}
            >
              WhatsApp the studio
            </Button>
          ) : (
            <p className="text-body-xs text-stone-500">{contact.whatsapp.note}</p>
          )}

          <ul className="flex flex-col gap-2 pt-1 text-body-sm">
            <li>
              {contact.phone.configured ? (
                <a
                  href={contact.phone.href}
                  className="inline-flex min-h-11 items-center gap-2 text-espresso-700"
                >
                  <IconPhone className="size-4 text-gold-600" />
                  {contact.phone.label}
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 text-stone-500">
                  <IconPhone className="size-4" />
                  {contact.phone.note}
                </span>
              )}
            </li>
            <li>
              {contact.email.configured ? (
                <a
                  href={contact.email.href}
                  className="inline-flex min-h-11 items-center gap-2 text-espresso-700"
                >
                  <IconMail className="size-4 text-gold-600" />
                  {contact.email.label}
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 text-stone-500">
                  <IconMail className="size-4" />
                  {contact.email.note}
                </span>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
