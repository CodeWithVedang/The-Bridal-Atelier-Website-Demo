import { env } from './env';

/**
 * Brand and contact configuration.
 *
 * Contact channels resolve to a discriminated shape: either `configured`
 * with a real href, or unconfigured with the name of the variable that
 * enables it. No placeholder digits are ever rendered as if dialable
 * (brief §17, §23 — see docs/DECISION_LOG.md D7).
 */

export const site = {
  name: 'The Bridal Atelier',
  shortName: 'Bridal Atelier',
  wordmark: { first: 'The Bridal', second: 'Atelier' },
  tagline: "For the bride you've always imagined.",
  category: 'Bridal hair, makeup and skin studio',
  description:
    'A small bridal studio for hair, makeup and skin — planned across your whole wedding week by named artists who stay with you from trial to send-off.',
  locale: 'en-IN',
  currency: 'INR',
  url: env.siteUrl,
  isIndexable: env.isIndexable,
  /** Honest, non-fabricated availability statement. */
  openingStatement: 'By appointment only',
  /** A demonstration brand; surfaced in the footer. */
  isDemonstrationBrand: true,
} as const;

export type ContactChannel =
  | { configured: true; href: string; label: string }
  | { configured: false; envVar: string; note: string };

function unconfigured(envVar: string, note: string): ContactChannel {
  return { configured: false, envVar, note };
}

export const contact = {
  whatsapp: env.whatsappNumber
    ? ({
        configured: true,
        href: `https://wa.me/${env.whatsappNumber}`,
        label: 'WhatsApp the studio',
      } as const)
    : unconfigured(
        'NEXT_PUBLIC_WHATSAPP_NUMBER',
        'WhatsApp is not configured for this demonstration site.',
      ),

  phone: env.phone
    ? ({
        configured: true,
        href: `tel:${env.phone.replace(/[^\d+]/g, '')}`,
        label: env.phone,
      } as const)
    : unconfigured(
        'NEXT_PUBLIC_PHONE',
        'A phone number is not configured for this demonstration site.',
      ),

  email: env.email
    ? ({ configured: true, href: `mailto:${env.email}`, label: env.email } as const)
    : unconfigured(
        'NEXT_PUBLIC_EMAIL',
        'An email address is not configured for this demonstration site.',
      ),

  instagram: env.instagramUrl
    ? ({ configured: true, href: env.instagramUrl, label: 'Instagram' } as const)
    : unconfigured('NEXT_PUBLIC_INSTAGRAM_URL', 'Instagram is not linked yet.'),

  pinterest: env.pinterestUrl
    ? ({ configured: true, href: env.pinterestUrl, label: 'Pinterest' } as const)
    : unconfigured('NEXT_PUBLIC_PINTEREST_URL', 'Pinterest is not linked yet.'),
} satisfies Record<string, ContactChannel>;

export const studioAddress = env.studioAddress
  ? {
      configured: true as const,
      line: env.studioAddress,
      city: env.studioCity,
      region: env.studioRegion,
      postalCode: env.studioPostalCode,
    }
  : { configured: false as const, envVar: 'NEXT_PUBLIC_STUDIO_ADDRESS' };

/** Shown when no address is configured. Never a placeholder street. */
export const studioAddressNote = 'The studio address is set per deployment.';

/**
 * Consultation hours, as prose (docs/UI_SPEC.md §4 requires them in the footer).
 *
 * These are consultation windows, not opening hours: an appointment-only studio
 * has no walk-in hours, and a wedding-morning call time sits outside them by
 * definition. They are deliberately **not** emitted as
 * `openingHoursSpecification` — brand copy on a demonstration site is one thing,
 * a machine-readable claim about when a studio that does not exist is open is
 * another (docs/SEO_SPEC.md §4).
 */
export const studioHours = {
  statement: site.openingStatement,
  slots: [
    { days: 'Tuesday – Friday', time: '11:00 – 19:00' },
    { days: 'Saturday – Sunday', time: '09:00 – 17:00' },
    { days: 'Monday', time: 'Closed' },
  ],
  note: 'Wedding-morning call times start earlier and are set in your timeline.',
} as const;

/** True when at least one immediate channel exists, so the UI can adapt copy. */
export const hasImmediateChannel =
  contact.whatsapp.configured || contact.phone.configured;

export const primaryNav = [
  { href: '/services', label: 'Services' },
  { href: '/packages', label: 'Packages' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/bridal-looks', label: 'Bridal Looks' },
  { href: '/artists', label: 'Artists' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

export const footerNav = [
  {
    heading: 'Services',
    links: [
      { href: '/services/bridal-makeup', label: 'Bridal Makeup' },
      { href: '/services/bridal-hair', label: 'Bridal Hair' },
      { href: '/services/skin-and-prep', label: 'Skin & Prep' },
      { href: '/services/hair-care-and-treatments', label: 'Hair Care' },
      { href: '/services/grooming-and-add-ons', label: 'Grooming & Add-ons' },
    ],
  },
  {
    heading: 'Book',
    links: [
      { href: '/packages', label: 'Bridal Packages' },
      { href: '/book', label: 'Book a Consultation' },
      { href: '/book#availability', label: 'Check Your Date' },
      { href: '/contact', label: 'Contact the Studio' },
    ],
  },
  {
    heading: 'Studio',
    links: [
      { href: '/about', label: 'About the Atelier' },
      { href: '/artists', label: 'Our Artists' },
      { href: '/portfolio', label: 'Bridal Portfolio' },
      { href: '/bridal-looks', label: 'Signature Looks' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
    ],
  },
] as const;
