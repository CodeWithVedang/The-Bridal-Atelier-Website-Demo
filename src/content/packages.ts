import type { BridalPackage, ComparisonRow } from '@/types/content';

/**
 * The three bridal packages (brief §9, docs/CONTENT_SPEC.md §7).
 *
 * Two deliberate decisions are encoded here:
 *
 * 1. `startingInvestment` is published. Hiding pricing to force an enquiry is a
 *    dark pattern and is rejected in docs/PSYCHOLOGY_SPEC.md §6.
 * 2. The middle package's `fitStatement` describes *fit*, not popularity. The
 *    brief asked for a "Most Popular" badge; a fictional studio has no booking
 *    history to count, so claiming one would be fabricated social proof
 *    (docs/DECISION_LOG.md D2).
 *
 * Figures are in rupees and are indicative placeholders for a demonstration
 * brand — a real studio would replace them, and nothing else, in this file.
 */

export const packages = [
  {
    slug: 'essential-bride',
    name: 'The Essential Bride',
    fitStatement: 'One day, one look, done properly',
    summary:
      'For a single-function wedding, or a bride who wants the wedding morning covered and nothing else. The trial and the written timeline are included — they are not the part to economise on.',
    startingInvestment: 45000,
    functionsCovered: 'One function',
    artistCount: 1,
    trialPolicy: 'One full trial, about six weeks before the wedding, photographed in two lights.',
    travelPolicy: 'Within city limits included. Outstation quoted at cost, agreed in writing first.',
    includes: [
      { label: 'Bridal consultation', detail: '45 minutes, in studio or on a call.' },
      { label: 'One full bridal trial', detail: 'Base, eyes, hair and drape, with images you keep.' },
      { label: 'Wedding-morning makeup and hair', detail: 'Applied to the plan agreed at the trial.' },
      { label: 'Veil or dupatta setting', detail: 'Pinned and photographed for exact repetition.' },
      { label: 'Written wedding-morning timeline', detail: 'Call time, durations, photographer handover.' },
      { label: 'Four hours on site', detail: 'From your call time, including touch-ups.' },
      { label: 'Touch-up kit', detail: 'Mixed in your shades and handed over before the artist leaves.' },
    ],
    excludes: [
      'Additional functions such as mehendi, sangeet or reception',
      'Skin or hair preparation courses',
      'Bridesmaid or family makeup',
      'A second artist on site',
    ],
    recommended: false,
    order: 1,
  },
  {
    slug: 'signature-bride',
    name: 'The Signature Bride',
    fitStatement: 'Most chosen for a two-day wedding',
    summary:
      'For a wedding with a mehendi or sangeet as well as the ceremony. Two looks are planned as one brief, so the second function does not become an afterthought booked at the last minute.',
    startingInvestment: 85000,
    functionsCovered: 'Up to three functions',
    artistCount: 1,
    trialPolicy: 'Two trials: the ceremony look, and one function look. Both photographed in two lights.',
    travelPolicy: 'Within city limits included. Outstation quoted at cost, agreed in writing first.',
    includes: [
      { label: 'Everything in The Essential Bride' },
      { label: 'Up to three functions covered', detail: 'Ceremony plus two, in any combination.' },
      { label: 'A second trial', detail: 'So the function look is tested, not improvised.' },
      { label: 'Reception or between-function restyle', detail: 'Timed into the written plan.' },
      { label: 'Skin preparation plan', detail: 'A dated schedule, backwards from your first function.' },
      { label: 'Six hours on site per function', detail: 'From your call time, including touch-ups.' },
      { label: 'Draping for one function', detail: 'Saree or lehenga dupatta, pinned to hold.' },
      { label: 'Two bridesmaid or family looks', detail: 'Booked in parallel so the call time holds.' },
    ],
    excludes: [
      'Functions beyond the three covered',
      'Hair treatment courses',
      'A second artist on site',
      'Outstation travel and accommodation',
    ],
    recommended: true,
    order: 2,
  },
  {
    slug: 'atelier-experience',
    name: 'The Atelier Experience',
    fitStatement: 'The full wedding week, two artists on site',
    summary:
      'For a multi-day wedding where several functions run close together and the bridal party needs covering too. Two artists work in parallel, which is what keeps a five-function week on schedule.',
    startingInvestment: 165000,
    functionsCovered: 'Up to five functions',
    artistCount: 2,
    trialPolicy: 'Two trials plus a pre-week review, where the plan is walked through function by function.',
    travelPolicy:
      'Within city limits included. One outstation venue included within 250 km; travel and stay quoted at cost beyond that.',
    includes: [
      { label: 'Everything in The Signature Bride' },
      { label: 'Up to five functions covered', detail: 'Across the wedding week, in one plan.' },
      { label: 'Two artists on site', detail: 'Bride and party covered in parallel, not in sequence.' },
      { label: 'Full skin and hair preparation courses', detail: 'Assessed, scheduled and reviewed.' },
      { label: 'Pre-week review', detail: 'The whole plan walked through with you and your family.' },
      { label: 'Unlimited hours on wedding day', detail: 'The artist stays until the ceremony is done.' },
      { label: 'Draping for every function' },
      { label: 'Up to five bridesmaid or family looks per function' },
      { label: 'One outstation venue within 250 km', detail: 'Travel for both artists included.' },
    ],
    excludes: [
      'Functions beyond the five covered',
      'Outstation venues beyond 250 km, which are quoted at cost',
      'Accommodation, where the venue does not provide it',
      'Photography, mehendi artistry and decor, which are separate vendors',
    ],
    recommended: false,
    order: 3,
  },
] as const satisfies readonly BridalPackage[];

export type PackageSlug = (typeof packages)[number]['slug'];

/**
 * What actually moves a quote away from the published starting figure. Stated
 * plainly so "starting from" is not doing hidden work — a bride can predict
 * roughly where she lands before she enquires (docs/PSYCHOLOGY_SPEC.md §5).
 */
export const investmentFactors = [
  {
    label: 'Number of functions',
    detail: 'Each additional function adds artist time, a look, and usually a restyle.',
  },
  {
    label: 'How close together the functions fall',
    detail: 'Two functions in one day needs a second artist. Two on separate days does not.',
  },
  {
    label: 'Size of the bridal party',
    detail: 'Family and bridesmaid looks are quoted per person, because they are parallel work.',
  },
  {
    label: 'Travel and venue',
    detail: 'Outstation venues add travel time and, past a point, an overnight stay.',
  },
  {
    label: 'Preparation courses',
    detail: 'Skin and hair courses are priced by the number of sessions your assessment calls for.',
  },
  {
    label: 'Season',
    detail: 'November to February is peak. Dates fill earlier; the rate itself does not change.',
  },
] as const;

/** Rows for the three-column comparison table. Keys are package slugs. */
export const comparisonRows = [
  {
    label: 'Functions covered',
    values: { 'essential-bride': 'One', 'signature-bride': 'Up to three', 'atelier-experience': 'Up to five' },
  },
  {
    label: 'Artists on site',
    values: { 'essential-bride': 'One', 'signature-bride': 'One', 'atelier-experience': 'Two' },
  },
  {
    label: 'Trials included',
    values: { 'essential-bride': 'One', 'signature-bride': 'Two', 'atelier-experience': 'Two, plus a pre-week review' },
  },
  {
    label: 'Hours on site',
    values: {
      'essential-bride': 'Four',
      'signature-bride': 'Six per function',
      'atelier-experience': 'Unlimited on the wedding day',
    },
  },
  {
    label: 'Written timeline',
    values: { 'essential-bride': 'Included', 'signature-bride': 'Included', 'atelier-experience': 'Included' },
  },
  {
    label: 'Skin preparation',
    values: {
      'essential-bride': 'Not included',
      'signature-bride': 'Dated plan',
      'atelier-experience': 'Full course',
    },
  },
  {
    label: 'Hair treatments',
    values: {
      'essential-bride': 'Not included',
      'signature-bride': 'Not included',
      'atelier-experience': 'Full course',
    },
  },
  {
    label: 'Draping',
    values: { 'essential-bride': 'Not included', 'signature-bride': 'One function', 'atelier-experience': 'Every function' },
  },
  {
    label: 'Party looks per function',
    values: { 'essential-bride': 'Not included', 'signature-bride': 'Two', 'atelier-experience': 'Up to five' },
  },
  {
    label: 'Outstation travel',
    values: {
      'essential-bride': 'Quoted at cost',
      'signature-bride': 'Quoted at cost',
      'atelier-experience': 'One venue within 250 km included',
    },
  },
] as const satisfies readonly ComparisonRow[];
