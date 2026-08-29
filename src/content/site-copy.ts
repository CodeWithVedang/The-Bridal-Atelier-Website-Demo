/**
 * Site-wide copy that is not a repeating entity.
 *
 * Everything here is authored against docs/CONTENT_SPEC.md §1 voice rules:
 * second person, present tense, no exclamation marks, concrete nouns, and
 * numbers only where they are structural facts of the offer.
 *
 * Section headings live here rather than inline in components so the whole
 * site's language can be reviewed in one file — and so a CMS could replace it
 * (docs/ARCHITECTURE.md §7).
 */

export const hero = {
  eyebrow: 'Bridal atelier · by appointment',
  headline: "For the bride you've always imagined.",
  subheadline:
    'Bridal hair, makeup and skin, planned across your whole wedding week — by a small team of named artists who stay with you from trial to send-off.',
  primaryCta: { label: 'Book Bridal Consultation', href: '/book' },
  secondaryCta: { label: 'Check Your Wedding Date', href: '/book#availability' },
  supportLine:
    'No payment is taken to enquire. A coordinator replies with the next available slots.',
  imageId: 'hero-veil',
} as const;

/**
 * Four structural facts, each verifiable elsewhere on this site. Deliberately
 * not a claim about reputation, ratings or client count — see
 * docs/PSYCHOLOGY_SPEC.md §2 for what was rejected and why.
 */
export const trustFacts = [
  {
    label: 'Named artists',
    detail: 'The artist who does your trial does your wedding. Not a rotating team.',
  },
  {
    label: 'A trial before every booking',
    detail: 'Every wedding booking includes a full trial, photographed in two lights.',
  },
  {
    label: 'A written timeline',
    detail: 'Call times, travel and touch-ups, in one document your family also gets.',
  },
  {
    label: 'Published investment',
    detail: 'Starting figures are on the packages page. You do not have to ask first.',
  },
] as const;

/** Reusable heading blocks for the home page, in render order. */
export const homeSections = {
  journey: {
    eyebrow: 'The process',
    heading: 'Five stages, from first conversation to send-off',
    intro:
      'Bridal beauty goes wrong when it is improvised on the morning. This is the sequence we work to, and you can see all of it before you enquire.',
    ctaLabel: 'Read the full process',
    ctaHref: '/about#process',
  },
  services: {
    eyebrow: 'What we do',
    heading: 'Hair, makeup and skin — planned as one brief',
    intro:
      'Five categories, thirty-four services. Pricing sits at package level, so nothing here reads like a menu of add-ons.',
    ctaLabel: 'Browse all services',
    ctaHref: '/services',
  },
  packages: {
    eyebrow: 'Investment',
    heading: 'Three packages, sized by how many functions you have',
    intro:
      'Each one lists what is included, what is not, and the starting investment. Choose by the shape of your wedding, not by tier.',
    ctaLabel: 'Compare packages in detail',
    ctaHref: '/packages',
  },
  portfolio: {
    eyebrow: 'Recent work',
    heading: 'Looks built for specific weddings',
    intro:
      'Filter by look, function, hairstyle or artist. Every entry names what was actually done.',
    ctaLabel: 'Open the portfolio',
    ctaHref: '/portfolio',
  },
  beforeAfter: {
    eyebrow: 'Before and after',
    heading: 'The same face, prepared and finished',
    intro:
      'Drag the handle, or use the arrow keys, to move between the two states.',
    ctaLabel: 'See more work',
    ctaHref: '/portfolio',
  },
  looks: {
    eyebrow: 'Signature looks',
    heading: 'Four starting points for your trial',
    intro:
      'Most brides arrive with a saved image and leave with something adjacent to it. These are the four directions we work from.',
    ctaLabel: 'Explore bridal looks',
    ctaHref: '/bridal-looks',
  },
  artists: {
    eyebrow: 'The team',
    heading: 'Three artists, each with a stated specialism',
    intro:
      'You are introduced to your artist at the consultation and they stay with you through the wedding.',
    ctaLabel: 'Meet the artists',
    ctaHref: '/artists',
  },
  testimonials: {
    eyebrow: 'In their words',
    heading: 'What brides say about the planning',
    intro:
      'Sample content. The Bridal Atelier is a demonstration brand with no real clients, so nothing here is presented as a verified review.',
  },
  instagram: {
    eyebrow: 'From the studio',
    heading: 'Work in progress',
    intro: 'A static gallery. No social feed is embedded and nothing is loaded from a third party.',
  },
  faqs: {
    eyebrow: 'Before you enquire',
    heading: 'The questions brides ask first',
    intro: 'If yours is not here, ask it in the consultation form and it gets answered directly.',
    ctaLabel: 'Read all questions',
    ctaHref: '/packages#faqs',
  },
} as const;

/**
 * The wedding-date check (brief §15).
 *
 * The heading promises an *indication*, not a diary lookup, because that is all
 * `evaluateAvailability` can honestly give: it applies four season-and-weekday
 * rules with no booking system behind them. Promising more here and disclaiming
 * it in the result would be the wrong order.
 */
export const availabilityCopy = {
  eyebrow: 'Wedding date',
  heading: 'Check whether your date is open',
  intro:
    'A season-and-day indication in one step, with no email address required. It tells you how the date sits in our calendar; a coordinator confirms the diary itself.',
} as const;

/**
 * The consultation request (brief §16, docs/UX_SPEC.md §5).
 *
 * Says what happens next before the first field, because the question a bride
 * actually has at this point is not "what do you need from me" but "what will
 * you do with it".
 */
export const consultationCopy = {
  eyebrow: 'Book a consultation',
  heading: 'Tell us about your wedding',
  intro:
    'Three short steps, about two minutes. A coordinator replies with available slots and the artists free on your dates. Nothing is booked and no payment is taken here.',
} as const;

/**
 * The centred closing statement that ends most pages (docs/UI_SPEC.md §7).
 *
 * No image id: `CtaBand` is type only. The band sits immediately above a dark
 * footer, and a third heavy element there would make every page end in a stack
 * of bands. The `cta-drape` artwork it once pointed at is used by the Open Graph
 * image instead, where a 1600×600 dark crop is exactly the right shape.
 */
export const closingCta = {
  eyebrow: 'Next step',
  heading: 'Start with a consultation, not a commitment',
  body: 'Forty-five minutes, in the studio or on a call. We look at your dates, your functions and your outfits, and tell you which package fits. You are not asked to book anything in that meeting.',
  primaryCta: { label: 'Book Bridal Consultation', href: '/book' },
  secondaryCta: { label: 'Check Your Wedding Date', href: '/book#availability' },
} as const;

export const whatsappBand = {
  eyebrow: 'Quick question',
  heading: 'Message the studio directly',
  body: 'For a date check, a travel question or anything short, WhatsApp is the fastest route. A coordinator answers during studio hours.',
  ctaLabel: 'Contact on WhatsApp',
  unconfiguredLabel: 'WhatsApp not configured for this demo',
} as const;

/**
 * Disclosure lines. These exist because the brand is fictional: a portfolio
 * build that quietly implies a real salon with real clients would be the one
 * genuinely dishonest thing in the project (docs/DECISION_LOG.md D3).
 */
export const disclosures = {
  sampleContent: 'Sample content — The Bridal Atelier is a demonstration brand.',
  demonstrationSite:
    'The Bridal Atelier is a demonstration brand built as a portfolio project. Contact details, availability and testimonials are placeholders, not a real business.',
  noPaymentTaken: 'No payment is taken through this site.',
  inMemoryData:
    'Enquiries submitted here are held in memory for the lifetime of the server process and are not stored, emailed or shared.',
  /**
   * The artist images are licensed editorial photographs of bridal craft, not
   * portraits of these three people. Naming a stranger in a photograph would be
   * a fabricated credential, so each card shows the work the artist is described
   * as doing and this line says so out loud.
   */
  artistPhotography:
    'These three artists are demonstration profiles. Each image shows the craft that artist specialises in — licensed editorial photography, not a portrait of a named person.',
} as const;
