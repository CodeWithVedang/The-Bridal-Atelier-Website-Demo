import type { BridalLook } from '@/types/content';

/**
 * Four signature looks (brief §12).
 *
 * These are starting points for a trial, not a catalogue to order from. Each
 * one states who it actually suits — including where it is the wrong choice —
 * because a look that photographs badly at your venue is the expensive mistake
 * this page exists to prevent.
 */

export const bridalLooks = [
  {
    slug: 'classic-red',
    name: 'Classic Red',
    summary: 'The traditional bridal palette, built to hold its depth under stage and evening light.',
    detail:
      'A warm base, a defined eye, and a red that is matched to your outfit rather than chosen from a shade name. This is the look that survives a long ceremony: the lip is blotted and rebuilt in layers, the base is set for heat, and the eye is strong enough to read from the back of a hall. It is the most photographed of the four and the least forgiving if it is not tested first.',
    bestFor: 'Evening ceremonies, red or deep-toned lehengas, heavy traditional jewellery.',
    elements: [
      'Warm full-coverage base, set for heat',
      'Defined liner with a graduated smoke',
      'Layered matte red lip, blotted between coats',
      'Pinned updo sized for a heavy dupatta',
      'Maang tikka placed to your natural parting',
    ],
    imageId: 'look-classic-red',
    order: 1,
  },
  {
    slug: 'ivory-pearl',
    name: 'Ivory Pearl',
    summary: 'A pale, luminous finish for daylight functions and lighter outfits.',
    detail:
      'Cooler and quieter than the classic palette: a satin base, a soft champagne eye, and a lip close to your own tone. It relies on skin looking well rather than heavily covered, which is why it is the look most dependent on preparation being done properly. In flat afternoon light it is the strongest of the four; under warm stage lighting it can read washed out, so we plan it around your function times.',
    bestFor: 'Morning ceremonies, ivory, pastel or pearl-worked outfits, church and temple venues.',
    elements: [
      'Satin base with minimal powder',
      'Champagne and taupe eye, no liner wing',
      'Soft-focus brow rather than a hard edge',
      'Open set waves or a low pinned twist',
      'Veil set high, pinned to hold without a comb',
    ],
    imageId: 'look-ivory-pearl',
    order: 2,
  },
  {
    slug: 'soft-glam',
    name: 'Soft Glam',
    summary: 'Neutral, warm and photographic — the most adaptable of the four.',
    detail:
      'A mid-coverage base, a bronzed eye and a rosewood lip. This is the look brides choose for the function they are least sure about, because it works in almost any lighting and beside almost any outfit. It reads as an evolved version of your own face rather than a departure from it, which also makes it the easiest to adjust on the morning if the weather changes.',
    bestFor: 'Sangeet, engagement and reception functions, mixed indoor and outdoor lighting.',
    elements: [
      'Mid-coverage base with cream contour',
      'Bronzed lid with a soft outer definition',
      'Cluster lashes rather than a full strip',
      'Rosewood or mauve lip, satin finish',
      'Half-up structure that survives dancing',
    ],
    imageId: 'look-soft-glam',
    order: 3,
  },
  {
    slug: 'modern-minimal',
    name: 'Modern Minimal',
    summary: 'Restrained makeup and clean hair, for brides who do not want to look made up.',
    detail:
      'Skin, brow and lip, and very little else. The work goes into preparation and into the base, not into layers on top — which means the assessment and prep schedule matter more here than in any other look. Hair is deliberately structural: a clean centre parting, or a low knot with no accessory. It suits contemporary outfits and close, documentary-style photography.',
    bestFor: 'Registry and intimate ceremonies, structured or contemporary outfits, close portrait work.',
    elements: [
      'Sheer base, corrected only where needed',
      'Groomed brow with no fill',
      'Lash tint instead of lashes',
      'Balm-textured lip in your own tone',
      'Sleek centre parting or a low knot, no accessory',
    ],
    imageId: 'look-modern-minimal',
    order: 4,
  },
] as const satisfies readonly BridalLook[];

export type BridalLookSlug = (typeof bridalLooks)[number]['slug'];
