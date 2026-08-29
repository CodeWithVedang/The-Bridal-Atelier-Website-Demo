import type { LegalSection } from '@/types/content';

/**
 * Privacy and terms copy (docs/CONTENT_SPEC.md §10).
 *
 * Written to describe *this* build accurately rather than to look like a legal
 * page. Every claim here is checkable against the code: the two route handlers
 * in `src/app/api/`, the in-memory repositories in `src/lib/repositories/`, and
 * the absence of any outbound network call or third-party script.
 *
 * `LAST_REVIEWED` is a constant, not `Date.now()`, so the page does not claim to
 * have been reviewed on whatever day it happens to be rendered.
 */

export const LAST_REVIEWED = '2026-08-29';

export const privacySections = [
  {
    heading: 'What this page covers',
    paragraphs: [
      'The Bridal Atelier is a demonstration brand built as a portfolio project. It is not a trading business. This page describes what the website itself does with information you type into it, which is the only processing that actually happens.',
    ],
  },
  {
    heading: 'What the site collects',
    paragraphs: [
      'There are exactly two forms. The wedding-date check accepts a date, a city, a function count and a package preference. The consultation request accepts your name, email address, phone number, wedding date, city, venue, package preference, the functions you need covered, how you heard about the studio, and anything you write in the message field.',
      'Nothing else is collected. There is no account, no login, and no upload.',
    ],
    bullets: [
      'No cookies are set by this site.',
      'No analytics vendor is connected and no tracking script is loaded.',
      'No advertising or social pixel is present.',
      'No third-party font, map, chat widget or social embed is requested.',
    ],
  },
  {
    heading: 'Where it goes',
    paragraphs: [
      'Submissions are held in the memory of the running server process. They are not written to a database, not written to disk, not emailed, and not sent to any third party. When the process restarts, they are gone.',
      'A webhook destination can be configured through a server-side environment variable for a real deployment. In this build that variable is read and validated but never called, so no request leaves the server.',
    ],
  },
  {
    heading: 'What is logged',
    paragraphs: [
      'Each API request writes one structured line containing a request identifier, the route, the response status, the duration and the outcome. It does not contain your name, email address, phone number or message.',
      'Rate limiting needs to tell one caller from another. It does this with a salted SHA-256 hash of the first address in the forwarded-for header, truncated. The salt is generated per process, so the hash cannot be reversed to an address or matched across restarts.',
    ],
  },
  {
    heading: 'Your choices',
    paragraphs: [
      'Because nothing is stored durably, there is nothing to export or delete. If you would like a submission removed from the running process before it restarts, use the contact details on the contact page — bearing in mind those are placeholder values in this demonstration build.',
    ],
  },
] as const satisfies readonly LegalSection[];

export const termsSections = [
  {
    heading: 'Status of this site',
    paragraphs: [
      'The Bridal Atelier is a fictional studio, built to demonstrate design and engineering work. Nothing on this site is an offer capable of acceptance, and no contract can be formed through it. Prices, availability, artists and testimonials are illustrative.',
    ],
  },
  {
    heading: 'Consultation requests',
    paragraphs: [
      'Submitting the consultation form is an enquiry, not a booking. No payment is taken through this site and no card details are ever requested. In a real deployment, a coordinator would reply with available slots and a written quotation before anything was due.',
    ],
  },
  {
    heading: 'Availability results',
    paragraphs: [
      'The wedding-date check returns a rule-based indication, not a live diary lookup. Dates in the past are reported as unavailable; peak-season weekends are reported as limited; everything else is reported as available with a note. The result is guidance for planning and is never a held slot.',
    ],
  },
  {
    heading: 'Trials',
    paragraphs: [
      'In the described service, a trial is included with every wedding booking and takes place roughly six weeks before the first function. Adjustments made during the trial are part of the appointment. A second trial is an addition at any package level.',
    ],
  },
  {
    heading: 'Cancellation and rescheduling',
    paragraphs: [
      'The terms below describe the intended policy of the fictional studio, stated plainly so the packages page is not the only place they appear.',
    ],
    bullets: [
      'A consultation can be cancelled or moved at any time, at no cost.',
      'A confirmed wedding booking can be moved once to another available date, subject to artist availability.',
      'A trial cancelled with less than 48 hours notice is rebooked as a paid appointment.',
      'Outstation travel and accommodation, once booked on your behalf, are non-refundable.',
    ],
  },
  {
    heading: 'What we ask of you',
    paragraphs: [
      'Two things materially affect the result and both are yours to provide: tell us about any allergy, active prescription or recent treatment before a patch test, and bring your outfit and jewellery references to the trial. Work planned without them is work planned on a guess.',
    ],
  },
  {
    heading: 'Accessibility and errors',
    paragraphs: [
      'This site targets WCAG 2.2 AA. Known limitations are documented in the project repository rather than hidden. If something here is unusable with a keyboard or a screen reader, that is a defect and worth reporting.',
    ],
  },
] as const satisfies readonly LegalSection[];
