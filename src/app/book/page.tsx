import {
  AvailabilitySection,
  ConsultationSection,
  FaqSection,
  PageHeader,
  WhatsAppBand,
} from '@/components/sections';
import { contact } from '@/config/site';
import {
  availabilityCopy,
  consultationCopy,
  disclosures,
  whatsappBand,
} from '@/content/site-copy';
import { artistChoices, packageChoices, packageChoicesCompact } from '@/lib/form-options';
import { getContentRepository } from '@/lib/repositories';
import { pageMetadata, trail } from '@/lib/seo';

import type { Metadata } from 'next';

/**
 * The booking page (brief §24, docs/UX_SPEC.md §5).
 *
 * Two forms in deliberate order. The date check comes first because it asks for
 * nothing identifying and answers in one step — a bride who finds out her date
 * is a peak-season Saturday learns it before she has typed her phone number, not
 * after. The consultation request follows, so the effort is spent on a date that
 * is worth spending it on.
 *
 * Both sections own their heading and their own status handling; this page only
 * supplies copy, options derived from content, and grounds. The booking FAQs sit
 * underneath because they are the objections that surface while a form is open,
 * and WhatsApp closes the page as the route for anything a form cannot take.
 *
 * There is no closing CTA band: the call to action is the page.
 */

export const metadata: Metadata = pageMetadata({
  title: 'Book a bridal consultation',
  description:
    'Check whether your wedding date is open, then request a consultation. Three short steps, no payment taken, and a coordinator replies with available slots and artists.',
  path: '/book',
});

const CRUMBS = trail({ label: 'Book a consultation', href: '/book' });

export default async function BookPage() {
  const repo = getContentRepository();
  const [packages, artists, faqs] = await Promise.all([
    repo.listPackages(),
    repo.listArtists(),
    repo.listFaqs('booking'),
  ]);

  return (
    <>
      <PageHeader
        crumbs={CRUMBS}
        eyebrow="Bookings"
        heading="Start with a consultation"
        lead="Forty-five minutes, in the studio or on a call. We go through your functions, your outfits and the jewellery you already own, then tell you which package fits. Nothing is booked in that meeting."
        meta={[
          'No payment is taken to enquire',
          'A coordinator replies with available slots',
          'Your named artist is confirmed before the trial',
        ]}
      />

      <AvailabilitySection
        copy={availabilityCopy}
        packageOptions={packageChoicesCompact(packages)}
        tone="inset"
      />

      <ConsultationSection
        copy={consultationCopy}
        packageOptions={packageChoices(packages)}
        artistOptions={artistChoices(artists)}
        note={disclosures.inMemoryData}
        tone="ivory"
      />

      <FaqSection
        copy={{
          eyebrow: 'While you are here',
          heading: 'Questions about booking',
          intro:
            'The three that come up most often before a first consultation. Anything else can go in the message field above.',
        }}
        faqs={faqs}
        tone="ivory-alt"
        id="booking-faqs"
      />

      <WhatsAppBand copy={whatsappBand} channel={contact.whatsapp} location="book_band" tone="ivory" />
    </>
  );
}
