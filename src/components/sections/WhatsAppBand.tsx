import { IconWhatsApp } from '@/components/icons';
import { Container, Eyebrow, Section, TextLink } from '@/components/primitives';

import { TrackedCta } from './TrackedCta';

import type { SectionGround } from './types';
import type { ContactChannel } from '@/config/site';

/**
 * The WhatsApp band (brief §17).
 *
 * Two states, and the unconfigured one is the reason this component exists.
 *
 *  - **configured** — a labelled external link to `wa.me`, tracked as the
 *    `whatsapp` channel.
 *  - **unconfigured** — the band keeps its heading and body, states plainly that
 *    the channel is not set up on this deployment, names the environment
 *    variable that would enable it, and routes the visitor to the contact form
 *    instead. No invented digits, and no dead button: brief §17 asks for an
 *    obvious configuration placeholder, and a control that can never be pressed
 *    is a worse placeholder than a sentence (docs/DECISION_LOG.md D7).
 *
 * There is always a way onward. A block whose only route is broken is the
 * silent failure that brief §34 rules out, even though this one is not a form.
 */

export interface WhatsAppBandCopy {
  readonly eyebrow: string;
  readonly heading: string;
  readonly body: string;
  readonly ctaLabel: string;
  readonly unconfiguredLabel: string;
}

export interface WhatsAppBandProps {
  readonly copy: WhatsAppBandCopy;
  readonly channel: ContactChannel;
  /** Where the click is coming from, for `cta_clicked`. */
  readonly location?: string;
  readonly tone?: SectionGround;
  readonly id?: string;
}

const HEADING_ID = 'whatsapp-heading';

export function WhatsAppBand({
  copy,
  channel,
  location = 'whatsapp_band',
  tone = 'inset',
  id,
}: WhatsAppBandProps) {
  return (
    <Section id={id} tone={tone} spacing="tight" labelledBy={HEADING_ID}>
      <Container className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col gap-3 lg:col-span-7">
          <Eyebrow tone="stone">{copy.eyebrow}</Eyebrow>
          <h2 id={HEADING_ID} className="text-display-sm">
            {copy.heading}
          </h2>
          <p className="max-w-[58ch] text-body-md leading-relaxed text-espresso-700">{copy.body}</p>
        </div>

        <div className="flex flex-col gap-3 lg:col-span-5 lg:items-end">
          {channel.configured ? (
            <TrackedCta
              href={channel.href}
              external
              channel="whatsapp"
              location={location}
              variant="secondary"
              trailingIcon={<IconWhatsApp className="size-4" />}
            >
              {copy.ctaLabel}
            </TrackedCta>
          ) : (
            <>
              <p className="text-body-sm text-espresso-700 lg:text-end">
                {copy.unconfiguredLabel}. {channel.note}
              </p>
              <p className="text-body-xs text-stone-500 lg:text-end">
                Set <code className="font-mono text-espresso-900">{channel.envVar}</code> to enable
                it.
              </p>
              <TextLink href="/contact" withArrow className="mt-1">
                Use the contact form instead
              </TextLink>
            </>
          )}
        </div>
      </Container>
    </Section>
  );
}
