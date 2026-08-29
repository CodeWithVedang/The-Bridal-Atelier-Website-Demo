import Link from 'next/link';

import {
  contact,
  footerNav,
  site,
  studioAddress,
  studioAddressNote,
  studioHours,
} from '@/config/site';
import { disclosures } from '@/content/site-copy';
import { Container } from '@/components/primitives';
import {
  IconInstagram,
  IconMail,
  IconMapPin,
  IconPhone,
  IconPinterest,
  IconWhatsApp,
} from '@/components/icons';

import type { ContactChannel } from '@/config/site';
import type { ComponentType } from 'react';
import type { IconProps } from '@/components/icons';

/**
 * Site footer (docs/UI_SPEC.md §4, §8).
 *
 * The one dark ground on the page. The closing CTA band above it is a centred
 * statement on `ivory-100` (docs/UI_SPEC.md §7 signature 5), so the espresso
 * footer is the page's terminal block rather than the second dark band in a row.
 * It carries `on-dark`, which is what flips the global focus ring to gold — a
 * dark ring on dark paint is the failure this class exists to prevent.
 *
 * Column headings are real `<h2>`s inside a single `Footer` navigation landmark.
 * Four separate landmarks would make a screen reader announce "navigation" four
 * times on every page; one landmark with four headings gives the same structure
 * without the repetition.
 *
 * **No newsletter form.** There is no list, no sender and no consent record, so a
 * field that accepts an email address here would be collecting data with nowhere
 * to go (docs/DECISION_LOG.md D7).
 *
 * Every contact channel renders from configuration: a real link when the
 * variable is set, the channel's own explanatory note when it is not. No
 * placeholder digits are ever painted to look dialable (brief §17, §23).
 *
 * Muted text uses `sand-400` (9.1:1 on `espresso-900`) and body text `sand-300`
 * (11.3:1) rather than an opacity on ivory, so the ratios are the ones recorded
 * in docs/BRAND_SYSTEM.md §2 instead of whatever the blend happens to produce.
 */

const HEADING = 'font-body text-label uppercase text-gold-200';

const NAV_LINK =
  'underline-draw inline-flex min-h-8 items-center text-body-sm text-sand-300 transition-colors duration-(--dur-fast) hover:text-ivory-50';

const HAIRLINE = 'border-t border-ivory-50/15';

interface ChannelRowProps {
  readonly channel: ContactChannel;
  readonly icon: ComponentType<IconProps>;
  /** WhatsApp leaves the site; `tel:` and `mailto:` hand off to the OS. */
  readonly external?: boolean;
}

function ChannelRow({ channel, icon: Icon, external = false }: ChannelRowProps) {
  if (!channel.configured) {
    return (
      <li className="flex gap-2.5 text-body-xs text-sand-400">
        <Icon className="mt-0.5 size-4 shrink-0" />
        <span>{channel.note}</span>
      </li>
    );
  }

  const target = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <li>
      <a
        href={channel.href}
        {...target}
        className="underline-draw inline-flex min-h-9 items-center gap-2.5 text-body-sm text-sand-300 transition-colors duration-(--dur-fast) hover:text-ivory-50"
      >
        <Icon className="size-4 shrink-0 text-gold-200" />
        <span>{channel.label}</span>
      </a>
    </li>
  );
}

export function SiteFooter() {
  // Evaluated when the page is rendered. Static pages therefore carry their
  // build year, which is the accepted trade for not shipping a client component
  // to print four characters.
  const year = new Date().getFullYear();
  const socials = [
    { channel: contact.instagram, icon: IconInstagram, name: 'Instagram' },
    { channel: contact.pinterest, icon: IconPinterest, name: 'Pinterest' },
  ];
  const hasSocial = socials.some((entry) => entry.channel.configured);

  return (
    <footer className="on-dark bg-espresso-900 text-sand-300">
      <Container className="py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
          <div className="max-w-sm">
            <Link
              href="/"
              aria-label={`${site.name} — home`}
              className="inline-flex flex-col leading-none"
            >
              <span className="font-display text-display-sm text-ivory-50">
                {site.wordmark.first}
              </span>
              <span className="text-label uppercase text-gold-200">{site.wordmark.second}</span>
            </Link>

            <p className="mt-6 font-display text-body-lg text-ivory-100">{site.tagline}</p>
            <p className="mt-3 text-body-sm text-sand-400">
              {site.category} · {site.openingStatement}
            </p>

            {hasSocial ? (
              <ul className="mt-7 flex items-center gap-2">
                {socials.map(({ channel, icon: Icon, name }) =>
                  channel.configured ? (
                    <li key={name}>
                      <a
                        href={channel.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="grid size-11 place-items-center rounded-sm border border-ivory-50/20 text-sand-300 transition-colors duration-(--dur-fast) hover:border-ivory-50/40 hover:text-ivory-50"
                      >
                        <Icon className="size-5" label={name} />
                      </a>
                    </li>
                  ) : null,
                )}
              </ul>
            ) : (
              <p className="mt-7 text-body-xs text-sand-400">
                Social profiles are not linked in this demonstration build.
              </p>
            )}
          </div>

          <nav aria-label="Footer" className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {footerNav.map((column) => (
              <div key={column.heading}>
                <h2 className={HEADING}>{column.heading}</h2>
                <ul className="mt-4 flex flex-col gap-1">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={NAV_LINK}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className={`mt-16 grid gap-10 pt-10 sm:grid-cols-2 lg:grid-cols-3 ${HAIRLINE}`}>
          <div>
            <h2 className={HEADING}>Contact</h2>
            <ul className="mt-4 flex flex-col gap-2">
              <ChannelRow channel={contact.whatsapp} icon={IconWhatsApp} external />
              <ChannelRow channel={contact.phone} icon={IconPhone} />
              <ChannelRow channel={contact.email} icon={IconMail} />
            </ul>
          </div>

          <div>
            <h2 className={HEADING}>Studio</h2>
            {studioAddress.configured ? (
              <address className="mt-4 flex gap-2.5 text-body-sm not-italic text-sand-300">
                <IconMapPin className="mt-1 size-4 shrink-0 text-gold-200" />
                <span>
                  {studioAddress.line}
                  {studioAddress.city ? (
                    <>
                      <br />
                      {[studioAddress.city, studioAddress.region].filter(Boolean).join(', ')}
                      {studioAddress.postalCode ? ` ${studioAddress.postalCode}` : ''}
                    </>
                  ) : null}
                </span>
              </address>
            ) : (
              <p className="mt-4 flex gap-2.5 text-body-xs text-sand-400">
                <IconMapPin className="mt-0.5 size-4 shrink-0" />
                <span>{studioAddressNote}</span>
              </p>
            )}
            <p className="mt-4 text-body-xs text-sand-400">{disclosures.inMemoryData}</p>
          </div>

          <div>
            <h2 className={HEADING}>Consultation hours</h2>
            <p className="mt-4 text-body-sm text-ivory-100">{studioHours.statement}</p>
            <dl className="mt-3 flex flex-col gap-1 text-body-sm">
              {studioHours.slots.map((slot) => (
                <div key={slot.days} className="flex justify-between gap-4">
                  <dt className="text-sand-300">{slot.days}</dt>
                  <dd className="text-sand-400 tabular-nums">{slot.time}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-body-xs text-sand-400">{studioHours.note}</p>
          </div>
        </div>

        <div className={`mt-14 pt-8 ${HAIRLINE}`}>
          <p className="max-w-[70ch] text-body-xs text-sand-400">
            {disclosures.demonstrationSite}
          </p>
          <div className="mt-4 flex flex-col gap-1.5 text-body-xs text-sand-400 sm:flex-row sm:items-baseline sm:justify-between">
            <p>
              © {year} {site.name}. {disclosures.noPaymentTaken}
            </p>
            <p>Designed and built as a portfolio project.</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
