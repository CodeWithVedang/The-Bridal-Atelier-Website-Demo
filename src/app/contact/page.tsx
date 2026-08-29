import { EditorialImage } from '@/components/content';
import {
  IconClock,
  IconInstagram,
  IconMail,
  IconMapPin,
  IconPhone,
  IconPinterest,
  IconWhatsApp,
} from '@/components/icons';
import { Container, Eyebrow, Rule, Section } from '@/components/primitives';
import { FaqSection, PageHeader, TrackedCta, WhatsAppBand } from '@/components/sections';
import {
  contact,
  site,
  studioAddress,
  studioAddressNote,
  studioHours,
} from '@/config/site';
import { getImage } from '@/content/images';
import { disclosures, whatsappBand } from '@/content/site-copy';
import { breadcrumbNode, graph } from '@/lib/jsonld';
import { getContentRepository } from '@/lib/repositories';
import { pageMetadata, trail } from '@/lib/seo';

import type { ContactChannel } from '@/config/site';
import type { IconProps } from '@/components/icons';
import type { Metadata } from 'next';
import type { ComponentType } from 'react';

/**
 * Contact (brief §23).
 *
 * The governing constraint is that this is a demonstration brand, so there is no
 * real number, address or inbox to publish. Every channel therefore renders from
 * configuration: a live link when the environment variable is set, and the
 * channel's own explanatory note when it is not. Nothing is ever painted to look
 * dialable — a placeholder that looks like a phone number is worse than an honest
 * absence, because a visitor only discovers the difference by trying it
 * (docs/DECISION_LOG.md D7).
 *
 * **No map embed.** A third-party map would contact another origin on load, add a
 * consent question this build has no answer for, and pin a studio that does not
 * exist. The panel in its place is generated artwork whose own alt text says a map
 * is deliberately absent (docs/SECURITY_SPEC.md §5).
 *
 * The page routes rather than collects. The consultation form lives at `/book`
 * and is the right place for a wedding enquiry; duplicating eleven fields here
 * would split the submissions across two forms with one inbox behind them.
 */

export const metadata: Metadata = pageMetadata({
  title: 'Contact the studio',
  description:
    'How to reach The Bridal Atelier: WhatsApp, phone and email as configured for this deployment, consultation hours, and where a wedding enquiry should go instead.',
  path: '/contact',
});

const CRUMBS = trail({ label: 'Contact', href: '/contact' });

interface ChannelCardProps {
  readonly channel: ContactChannel;
  readonly icon: ComponentType<IconProps>;
  readonly title: string;
  readonly detail: string;
  /** WhatsApp and social leave the site; `tel:` and `mailto:` hand off to the OS. */
  readonly external?: boolean;
}

function ChannelCard({
  channel,
  icon: Icon,
  title,
  detail,
  external = false,
}: ChannelCardProps) {
  return (
    <li className="hairline flex flex-col gap-2 bg-ivory-50 p-6">
      <span className="flex items-center gap-2.5">
        <Icon className="size-5 shrink-0 text-gold-600" />
        <span className="text-body-md font-medium text-espresso-900">{title}</span>
      </span>
      <p className="text-body-sm text-espresso-700">{detail}</p>
      {channel.configured ? (
        <a
          href={channel.href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="underline-draw mt-1 inline-flex min-h-11 items-center text-body-sm font-medium text-espresso-900"
        >
          {channel.label}
        </a>
      ) : (
        <p className="mt-1 text-body-xs text-stone-500">
          {channel.note} Set <code className="font-mono text-espresso-800">{channel.envVar}</code> to
          enable it.
        </p>
      )}
    </li>
  );
}

export default async function ContactPage() {
  const faqs = await getContentRepository().listFaqs('booking');
  const map = getImage('contact-map');

  return (
    <>
      <PageHeader
        crumbs={CRUMBS}
        eyebrow="Contact"
        heading="Talk to the studio"
        lead="For anything short — a date check, a travel question, whether we cover your city — the quickest route is a message. For a wedding, the consultation form asks the eleven things a coordinator needs, so you only have to say it once."
        actions={
          <>
            <TrackedCta href="/book" channel="consultation" location="contact_header">
              Book Bridal Consultation
            </TrackedCta>
            <TrackedCta
              href="/book#availability"
              channel="availability"
              location="contact_header"
              variant="secondary"
            >
              Check Your Wedding Date
            </TrackedCta>
          </>
        }
        meta={[site.openingStatement, 'A coordinator replies during consultation hours']}
      />

      <Section tone="ivory-alt" id="channels">
        <Container className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h2 className="text-display-md">Direct channels</h2>
            <p className="max-w-[64ch] text-body-md text-espresso-700">
              This is a demonstration build, so each channel is shown exactly as it is configured. A
              channel with no value set says so and names the variable that turns it on rather than
              showing an invented number.
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ChannelCard
              channel={contact.whatsapp}
              icon={IconWhatsApp}
              title="WhatsApp"
              detail="Fastest for a date check or a short question. Answered during consultation hours."
              external
            />
            <ChannelCard
              channel={contact.phone}
              icon={IconPhone}
              title="Phone"
              detail="For anything that is easier said than typed — travel, timings, a family question."
            />
            <ChannelCard
              channel={contact.email}
              icon={IconMail}
              title="Email"
              detail="For quotations, timelines and anything you want a written record of."
            />
            <ChannelCard
              channel={contact.instagram}
              icon={IconInstagram}
              title="Instagram"
              detail="Recent work. Nothing on this site is loaded from Instagram."
              external
            />
            <ChannelCard
              channel={contact.pinterest}
              icon={IconPinterest}
              title="Pinterest"
              detail="Reference boards, if you would rather send a link than a screenshot."
              external
            />
            <li className="hairline flex flex-col gap-2 bg-ivory-50 p-6">
              <span className="flex items-center gap-2.5">
                <IconClock className="size-5 shrink-0 text-gold-600" />
                <span className="text-body-md font-medium text-espresso-900">
                  Consultation hours
                </span>
              </span>
              <p className="text-body-sm text-espresso-700">{studioHours.statement}</p>
              <dl className="mt-1 flex flex-col gap-1 text-body-sm">
                {studioHours.slots.map((slot) => (
                  <div key={slot.days} className="flex justify-between gap-4">
                    <dt className="text-espresso-700">{slot.days}</dt>
                    <dd className="tabular-nums text-stone-500">{slot.time}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-1 text-body-xs text-stone-500">{studioHours.note}</p>
            </li>
          </ul>
        </Container>
      </Section>

      <Section tone="ivory" id="studio">
        <Container className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col gap-6 lg:col-span-5">
            <Eyebrow tone="gold">The studio</Eyebrow>
            <h2 className="text-display-md">Where the trials happen</h2>
            <p className="max-w-[56ch] text-body-md text-espresso-700">
              Consultations and trials are held at the studio; wedding mornings are worked at your
              venue or your home. Travel is quoted in the package, not added afterwards.
            </p>

            <Rule tone="sand" />

            {studioAddress.configured ? (
              <address className="flex gap-2.5 text-body-md not-italic text-espresso-800">
                <IconMapPin className="mt-1 size-4 shrink-0 text-gold-600" />
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
              <div className="flex gap-2.5 text-body-sm text-espresso-700">
                <IconMapPin className="mt-0.5 size-4 shrink-0 text-stone-500" />
                <p>
                  {studioAddressNote} No placeholder street is shown here, because a machine-readable
                  address for a studio that does not exist is worse than none. Set{' '}
                  <code className="font-mono text-espresso-800">
                    {studioAddress.envVar}
                  </code>{' '}
                  to publish one.
                </p>
              </div>
            )}

            <p className="text-body-xs text-stone-500">{disclosures.demonstrationSite}</p>
          </div>

          <div className="lg:col-span-7">
            <EditorialImage
              asset={map}
              sizes="(max-width: 1023px) 100vw, 55vw"
              className="w-full"
            />
            <p className="mt-3 text-body-xs text-stone-500">
              No map service is embedded on this site. Nothing on this page contacts a third-party
              origin, so there is no tracker to consent to.
            </p>
          </div>
        </Container>
      </Section>

      <WhatsAppBand
        copy={whatsappBand}
        channel={contact.whatsapp}
        location="contact_band"
        tone="inset"
        id="whatsapp"
      />

      <FaqSection
        copy={{
          eyebrow: 'Before you write',
          heading: 'Questions we answer most often',
          intro:
            'If yours is not here, ask it in the consultation form — it gets answered in writing rather than in a call you have to take.',
        }}
        faqs={faqs}
        tone="ivory"
        id="faqs"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: graph(breadcrumbNode(CRUMBS)) }}
      />
    </>
  );
}
