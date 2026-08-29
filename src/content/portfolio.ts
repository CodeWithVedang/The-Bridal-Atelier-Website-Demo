import type { PortfolioFilterDimension, PortfolioProject } from '@/types/content';

/**
 * The portfolio — twelve projects, filterable on eight dimensions (brief §10).
 *
 * Two notes on the filter vocabulary:
 *
 *  - `skinTone` is a real search need in bridal beauty: base matching is the
 *    single most common failure, and a bride wants to see work on skin like
 *    hers. The option labels are deliberately neutral depth descriptions
 *    ("Medium–deep") rather than the colourism-loaded terms the Indian salon
 *    industry still uses ("fair", "wheatish"). Recorded in
 *    docs/DECISION_LOG.md.
 *  - Filters are `AND` across dimensions and `OR` within one, which is the only
 *    combination that behaves the way people expect. Every dimension is
 *    populated for every project, so a filter can never return a blank set for
 *    a reason the user cannot see (docs/UX_SPEC.md §4).
 */

interface FilterDefinition {
  readonly dimension: PortfolioFilterDimension;
  readonly label: string;
  readonly options: readonly string[];
}

export const portfolioFilters = [
  {
    dimension: 'lookType',
    label: 'Look',
    options: ['Classic Red', 'Ivory Pearl', 'Soft Glam', 'Modern Minimal'],
  },
  {
    dimension: 'skinTone',
    label: 'Skin depth',
    options: ['Light', 'Light–medium', 'Medium', 'Medium–deep', 'Deep'],
  },
  {
    dimension: 'weddingType',
    label: 'Wedding',
    options: ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Registry'],
  },
  {
    dimension: 'function',
    label: 'Function',
    options: ['Ceremony', 'Reception', 'Mehendi', 'Sangeet', 'Engagement', 'Haldi', 'Portrait'],
  },
  {
    dimension: 'hairstyle',
    label: 'Hair',
    options: ['Updo', 'Open waves', 'Braid', 'Low knot', 'Half-up'],
  },
  {
    dimension: 'colourStory',
    label: 'Colour',
    options: ['Red & gold', 'Ivory & pearl', 'Blush & rose', 'Champagne', 'Emerald', 'Espresso'],
  },
  {
    dimension: 'coverage',
    label: 'Coverage',
    options: ['Sheer', 'Medium', 'Full', 'Airbrush'],
  },
  {
    dimension: 'artist',
    label: 'Artist',
    options: ['Ananya Mehta', 'Rhea Kapoor', 'Meera Shah'],
  },
] as const satisfies readonly FilterDefinition[];

export const portfolioProjects = [
  {
    slug: 'jaipur-courtyard',
    title: 'Jaipur Courtyard',
    city: 'Jaipur',
    summary:
      'An afternoon ceremony in an open courtyard, where the base had to survive direct heat and still read warm in shade.',
    imageId: 'portfolio-jaipur-courtyard',
    artistSlug: 'ananya-mehta',
    feature: true,
    order: 1,
    breakdown: [
      { label: 'Base', value: 'Airbrush, set in two passes for heat' },
      { label: 'Eye', value: 'Graduated bronze with a soft liner' },
      { label: 'Lip', value: 'Layered matte red, blotted twice' },
      { label: 'Hair', value: 'Pinned updo carrying a worked dupatta' },
      { label: 'On site', value: 'Six hours, two touch-up rounds' },
    ],
    filters: {
      lookType: ['Classic Red'],
      skinTone: ['Medium'],
      weddingType: ['Hindu'],
      function: ['Ceremony'],
      hairstyle: ['Updo'],
      colourStory: ['Red & gold'],
      coverage: ['Airbrush'],
      artist: ['Ananya Mehta'],
    },
  },
  {
    slug: 'ivory-morning',
    title: 'Ivory Morning',
    city: 'Bengaluru',
    summary:
      'A ceremony at nine in the morning, in flat daylight. Preparation carried this one: the base is sheer because it could afford to be.',
    imageId: 'portfolio-ivory-morning',
    artistSlug: 'meera-shah',
    feature: true,
    order: 2,
    breakdown: [
      { label: 'Prep', value: 'Eight-week hydration course, no actives in the last fortnight' },
      { label: 'Base', value: 'Sheer, corrected only at the perimeter' },
      { label: 'Eye', value: 'Champagne wash, lash tint instead of lashes' },
      { label: 'Hair', value: 'Open set waves, veil pinned high' },
      { label: 'On site', value: 'Four hours from a 5:30 call time' },
    ],
    filters: {
      lookType: ['Ivory Pearl'],
      skinTone: ['Light–medium'],
      weddingType: ['Hindu'],
      function: ['Ceremony'],
      hairstyle: ['Open waves'],
      colourStory: ['Ivory & pearl'],
      coverage: ['Sheer'],
      artist: ['Meera Shah'],
    },
  },
  {
    slug: 'monsoon-mehendi',
    title: 'Monsoon Mehendi',
    city: 'Mumbai',
    summary:
      'A mehendi in humidity high enough to move a base. Everything here was chosen for transfer resistance rather than finish.',
    imageId: 'portfolio-monsoon-mehendi',
    artistSlug: 'ananya-mehta',
    feature: false,
    order: 3,
    breakdown: [
      { label: 'Base', value: 'Medium coverage, waterproof, powder-set at the hairline' },
      { label: 'Eye', value: 'Cream shadow only, no powder to crease' },
      { label: 'Lip', value: 'Stain under balm, rebuilt twice' },
      { label: 'Hair', value: 'Braid work, flowers placed along the length' },
      { label: 'On site', value: 'Five hours, seated the whole time' },
    ],
    filters: {
      lookType: ['Soft Glam'],
      skinTone: ['Medium–deep'],
      weddingType: ['Hindu'],
      function: ['Mehendi'],
      hairstyle: ['Braid'],
      colourStory: ['Emerald'],
      coverage: ['Medium'],
      artist: ['Ananya Mehta'],
    },
  },
  {
    slug: 'coastal-sangeet',
    title: 'Coastal Sangeet',
    city: 'Goa',
    summary:
      'An outdoor sangeet with a sea breeze. The brief was a look she could dance in for four hours without a single pin moving.',
    imageId: 'portfolio-coastal-sangeet',
    artistSlug: 'rhea-kapoor',
    feature: true,
    order: 4,
    breakdown: [
      { label: 'Base', value: 'Medium coverage, locked with a fine mist' },
      { label: 'Eye', value: 'Bronzed lid, cluster lashes rather than a strip' },
      { label: 'Lip', value: 'Rosewood satin, transfer-resistant' },
      { label: 'Hair', value: 'Half-up structure, pinned against wind' },
      { label: 'On site', value: 'Six hours, one restyle after dinner' },
    ],
    filters: {
      lookType: ['Soft Glam'],
      skinTone: ['Medium'],
      weddingType: ['Christian'],
      function: ['Sangeet'],
      hairstyle: ['Half-up'],
      colourStory: ['Blush & rose'],
      coverage: ['Medium'],
      artist: ['Rhea Kapoor'],
    },
  },
  {
    slug: 'heirloom-red',
    title: 'Heirloom Red',
    city: 'Delhi',
    summary:
      "The outfit was her grandmother's, and the red in it was the reference. The lip was mixed to the fabric, not chosen from a shade.",
    imageId: 'portfolio-heirloom-red',
    artistSlug: 'ananya-mehta',
    feature: true,
    order: 5,
    breakdown: [
      { label: 'Base', value: 'Full coverage, warm undertone to sit beside gold' },
      { label: 'Eye', value: 'Deep liner, smoked outward, no shimmer' },
      { label: 'Lip', value: 'Custom-mixed red, matched to the fabric at the trial' },
      { label: 'Hair', value: 'Low pinned updo, matha patti to the parting' },
      { label: 'On site', value: 'Unlimited hours, ceremony ran past midnight' },
    ],
    filters: {
      lookType: ['Classic Red'],
      skinTone: ['Deep'],
      weddingType: ['Hindu'],
      function: ['Ceremony'],
      hairstyle: ['Updo'],
      colourStory: ['Red & gold'],
      coverage: ['Full'],
      artist: ['Ananya Mehta'],
    },
  },
  {
    slug: 'terrace-reception',
    title: 'Terrace Reception',
    city: 'Mumbai',
    summary:
      'An evening reception under warm uplighting, which flattens a base and eats a soft eye. Everything was built a step stronger than it looked in the room.',
    imageId: 'portfolio-terrace-reception',
    artistSlug: 'rhea-kapoor',
    feature: false,
    order: 6,
    breakdown: [
      { label: 'Base', value: 'Full coverage, matte, no reflective powder' },
      { label: 'Eye', value: 'Espresso smoke with a defined outer corner' },
      { label: 'Lip', value: 'Deep berry, matte' },
      { label: 'Hair', value: 'Sleek low knot, restyled from the ceremony updo' },
      { label: 'On site', value: 'Restyle slot of 75 minutes between functions' },
    ],
    filters: {
      lookType: ['Soft Glam'],
      skinTone: ['Medium–deep'],
      weddingType: ['Hindu'],
      function: ['Reception'],
      hairstyle: ['Low knot'],
      colourStory: ['Espresso'],
      coverage: ['Full'],
      artist: ['Rhea Kapoor'],
    },
  },
  {
    slug: 'temple-vows',
    title: 'Temple Vows',
    city: 'Chennai',
    summary:
      'A temple ceremony with a strict no-photography window and a 4:40 call time. The whole look was finished before sunrise.',
    imageId: 'portfolio-temple-vows',
    artistSlug: 'meera-shah',
    feature: false,
    order: 7,
    breakdown: [
      { label: 'Base', value: 'Medium coverage, warm, minimal powder' },
      { label: 'Eye', value: 'Kajal and a single wash of gold' },
      { label: 'Lip', value: 'Brick red, satin' },
      { label: 'Hair', value: 'Traditional braid with jasmine along the length' },
      { label: 'On site', value: 'Four hours from a 4:40 call time' },
    ],
    filters: {
      lookType: ['Classic Red'],
      skinTone: ['Medium–deep'],
      weddingType: ['Hindu'],
      function: ['Ceremony'],
      hairstyle: ['Braid'],
      colourStory: ['Red & gold'],
      coverage: ['Medium'],
      artist: ['Meera Shah'],
    },
  },
  {
    slug: 'champagne-engagement',
    title: 'Champagne Engagement',
    city: 'Hyderabad',
    summary:
      'A short indoor engagement with close photography, so the base had to hold up at 50 centimetres rather than across a hall.',
    imageId: 'portfolio-champagne-engagement',
    artistSlug: 'rhea-kapoor',
    feature: false,
    order: 8,
    breakdown: [
      { label: 'Base', value: 'Airbrush, sheer build, no visible edge at the jaw' },
      { label: 'Eye', value: 'Champagne lid, taupe crease, fine liner' },
      { label: 'Lip', value: 'Warm nude, glossed at the centre only' },
      { label: 'Hair', value: 'Open waves with a deep side parting' },
      { label: 'On site', value: 'Three hours, one touch-up before the ring' },
    ],
    filters: {
      lookType: ['Ivory Pearl'],
      skinTone: ['Light'],
      weddingType: ['Hindu'],
      function: ['Engagement'],
      hairstyle: ['Open waves'],
      colourStory: ['Champagne'],
      coverage: ['Airbrush'],
      artist: ['Rhea Kapoor'],
    },
  },
  {
    slug: 'desert-haldi',
    title: 'Desert Haldi',
    city: 'Jodhpur',
    summary:
      'A haldi is the one function where the makeup is expected to be ruined. This was built to be minimal, cheap to redo, and photograph well while turmeric was being thrown.',
    imageId: 'portfolio-desert-haldi',
    artistSlug: 'meera-shah',
    feature: false,
    order: 9,
    breakdown: [
      { label: 'Base', value: 'Tinted sunscreen only, deliberately expendable' },
      { label: 'Eye', value: 'Waterproof mascara, nothing else' },
      { label: 'Lip', value: 'Balm' },
      { label: 'Hair', value: 'Braid, tied back and out of range' },
      { label: 'On site', value: 'Two hours, artist stayed to reset for the next function' },
    ],
    filters: {
      lookType: ['Modern Minimal'],
      skinTone: ['Medium'],
      weddingType: ['Hindu'],
      function: ['Haldi'],
      hairstyle: ['Braid'],
      colourStory: ['Ivory & pearl'],
      coverage: ['Sheer'],
      artist: ['Meera Shah'],
    },
  },
  {
    slug: 'winter-nikah',
    title: 'Winter Nikah',
    city: 'Lucknow',
    summary:
      'A nikah in December, with a heavy dupatta worn over the head for the whole ceremony. Hair was designed around what the drape would hide and what it would crush.',
    imageId: 'portfolio-winter-nikah',
    artistSlug: 'rhea-kapoor',
    feature: true,
    order: 10,
    breakdown: [
      { label: 'Base', value: 'Medium coverage, hydrating, no matte powder' },
      { label: 'Eye', value: 'Soft kohl, warm neutral lid' },
      { label: 'Lip', value: 'Muted rose, satin' },
      { label: 'Hair', value: 'Low knot set to sit under the dupatta without a ridge' },
      { label: 'On site', value: 'Six hours, drape reset three times' },
    ],
    filters: {
      lookType: ['Ivory Pearl'],
      skinTone: ['Light–medium'],
      weddingType: ['Muslim'],
      function: ['Ceremony'],
      hairstyle: ['Low knot'],
      colourStory: ['Ivory & pearl'],
      coverage: ['Medium'],
      artist: ['Rhea Kapoor'],
    },
  },
  {
    slug: 'garden-christian',
    title: 'Garden Ceremony',
    city: 'Kochi',
    summary:
      'A white gown, an outdoor aisle and a photographer working close. The reference images were all heavier than this; the trial was where we agreed to take it down.',
    imageId: 'portfolio-garden-christian',
    artistSlug: 'ananya-mehta',
    feature: false,
    order: 11,
    breakdown: [
      { label: 'Base', value: 'Sheer to medium, cool undertone against white fabric' },
      { label: 'Eye', value: 'Rose-taupe wash, individual lashes at the outer third' },
      { label: 'Lip', value: 'Soft berry stain under balm' },
      { label: 'Hair', value: 'Open waves, veil combed in at the crown' },
      { label: 'On site', value: 'Four hours, one touch-up before the aisle' },
    ],
    filters: {
      lookType: ['Soft Glam'],
      skinTone: ['Light–medium'],
      weddingType: ['Christian'],
      function: ['Ceremony'],
      hairstyle: ['Open waves'],
      colourStory: ['Blush & rose'],
      coverage: ['Sheer'],
      artist: ['Ananya Mehta'],
    },
  },
  {
    slug: 'studio-portrait',
    title: 'Studio Portrait',
    city: 'Bengaluru',
    summary:
      'A registry wedding with a portrait session afterwards and no reception. The brief was explicit: she did not want to look made up in the photographs she would keep.',
    imageId: 'portfolio-studio-portrait',
    artistSlug: 'meera-shah',
    feature: false,
    order: 12,
    breakdown: [
      { label: 'Prep', value: 'Twelve-week course, finished three weeks out' },
      { label: 'Base', value: 'Sheer, spot-corrected, no contour' },
      { label: 'Eye', value: 'Groomed brow, lash tint, nothing on the lid' },
      { label: 'Lip', value: 'Own tone in a balm texture' },
      { label: 'Hair', value: 'Sleek centre parting, no accessory' },
    ],
    filters: {
      lookType: ['Modern Minimal'],
      skinTone: ['Deep'],
      weddingType: ['Registry'],
      function: ['Portrait'],
      hairstyle: ['Low knot'],
      colourStory: ['Espresso'],
      coverage: ['Sheer'],
      artist: ['Meera Shah'],
    },
  },
] as const satisfies readonly PortfolioProject[];

export type PortfolioSlug = (typeof portfolioProjects)[number]['slug'];

export const featuredProjects = portfolioProjects.filter((project) => project.feature);

