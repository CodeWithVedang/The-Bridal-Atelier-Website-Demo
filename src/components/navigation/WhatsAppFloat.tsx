'use client';

import { contact } from '@/config/site';
import { track } from '@/lib/analytics';
import { IconWhatsApp } from '@/components/icons';

/**
 * Floating WhatsApp action, 1024px and up (docs/UI_SPEC.md §4).
 *
 * Hidden below `lg`, where `MobileCtaBar` already carries WhatsApp — two floating
 * WhatsApp buttons on one phone screen is the hallmark of a template.
 *
 * Rendered only when a number is configured. There is no disabled version: a
 * permanently-visible floating button that cannot be used is worse than an absent
 * one, and the unconfigured case is already stated in the footer and on `/contact`
 * (brief §17).
 *
 * It is a labelled link, not an icon-only button. The visible label is short but
 * present, so the target is legible without hover and the accessible name is not
 * carried by a glyph alone.
 */

export function WhatsAppFloat() {
  if (!contact.whatsapp.configured) return null;

  return (
    <a
      data-whatsapp-float
      href={contact.whatsapp.href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('cta_clicked', { channel: 'whatsapp', location: 'float' })}
      className="fixed right-6 bottom-6 z-70 hidden min-h-12 items-center gap-2.5 rounded-full border border-espresso-900/15 bg-ivory-50 px-5 shadow-md transition-[background-color,box-shadow,transform] duration-(--dur-fast) hover:-translate-y-px hover:shadow-lg lg:inline-flex"
    >
      <IconWhatsApp className="size-5 text-success-700" />
      <span className="text-body-sm font-medium text-espresso-900">WhatsApp</span>
    </a>
  );
}
