'use client';

import Link from 'next/link';

import { contact } from '@/config/site';
import { track } from '@/lib/analytics';
import { IconCalendar, IconWhatsApp } from '@/components/icons';

/**
 * Sticky bottom action bar, below 1024px (docs/UX_SPEC.md §2).
 *
 * Two actions, no more. A phone screen has room for one primary and one
 * low-commitment alternative; a third would shrink both below the 44px target and
 * turn the bar into a toolbar the visitor has to read.
 *
 * The bar overlays the page, so the root layout adds matching bottom padding to
 * `<main>` (`pb-20 lg:pb-0`). Without it the last line of the footer sits
 * permanently under the bar — the single most common defect in this pattern.
 *
 * `env(safe-area-inset-bottom)` keeps the buttons clear of the iOS home
 * indicator. When WhatsApp is not configured the second slot is a plain note
 * rather than a dead button (brief §17, docs/DECISION_LOG.md D7).
 */

export function MobileCtaBar() {
  return (
    <div
      data-mobile-cta
      className="fixed inset-x-0 bottom-0 z-80 border-t border-sand-300 bg-ivory-50/95 backdrop-blur-sm lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch gap-2 px-4 py-2.5">
        <Link
          href="/book"
          onClick={() => track('cta_clicked', { channel: 'consultation', location: 'mobile-bar' })}
          className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-sm bg-espresso-900 px-4 text-body-sm font-medium text-ivory-50 transition-colors duration-(--dur-fast) active:bg-espresso-800"
        >
          <IconCalendar className="size-4" />
          Book Consultation
        </Link>

        {contact.whatsapp.configured ? (
          <a
            href={contact.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('cta_clicked', { channel: 'whatsapp', location: 'mobile-bar' })}
            className="flex min-h-11 items-center justify-center gap-2 rounded-sm border border-espresso-900/25 px-4 text-body-sm font-medium text-espresso-900 transition-colors duration-(--dur-fast) active:bg-espresso-900/[0.06]"
          >
            <IconWhatsApp className="size-4" />
            WhatsApp
          </a>
        ) : (
          <span className="flex max-w-[9rem] items-center px-2 text-body-xs leading-tight text-stone-500">
            WhatsApp not configured
          </span>
        )}
      </div>
    </div>
  );
}
