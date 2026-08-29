import type { Service, ServiceCategory } from '@/types/content';

/**
 * The services taxonomy — five categories, thirty-four services
 * (brief §8, docs/CONTENT_SPEC.md §6).
 *
 * No service carries a price. Pricing lives at package level in
 * `content/packages.ts` so the page never reads as a discount menu (brief §9).
 * `durationMinutes` is the studio-side fact a bride actually needs when she is
 * building a wedding-morning timeline.
 */

export const serviceCategories = [
  {
    slug: 'bridal-makeup',
    name: 'Bridal Makeup',
    eyebrow: 'Category 01',
    summary: 'Base, eyes and finish built for your outfit, your lighting and the length of the function.',
    detail:
      'Every look starts from the fabric and the jewellery, not from a trend. We match the base to your skin in the light you will actually be photographed in, then decide between airbrush and hand-applied depending on how long you are on your feet. Nothing is applied on the wedding morning that was not tested at the trial.',
    prepNote:
      'Bring your outfit photographs and, if possible, the jewellery to your trial. Skin products are patch-tested at least a week before.',
    order: 1,
    imageId: 'service-bridal-makeup',
    relatedLookSlug: 'classic-red',
  },
  {
    slug: 'bridal-hair',
    name: 'Bridal Hair',
    eyebrow: 'Category 02',
    summary: 'Structure that holds through a full day, with the veil and dupatta set before you leave.',
    detail:
      'Bridal hair fails on the pinning, not the styling. We build a base that carries the weight of a dupatta and any accessory you are wearing, then set the drape and photograph it, so the same placement can be repeated exactly on the day. Restyles between functions are timed into your written plan.',
    prepNote:
      'Wash your hair the evening before, not the morning of. Bring every clip, pin and accessory you intend to wear.',
    order: 2,
    imageId: 'service-bridal-hair',
    relatedLookSlug: 'ivory-pearl',
  },
  {
    slug: 'skin-and-prep',
    name: 'Skin & Prep',
    eyebrow: 'Category 03',
    summary: 'A dated schedule of treatments that finishes well before the first function.',
    detail:
      'Preparation is booked backwards from your wedding date. Anything that can cause a reaction happens early, and the final ten days hold nothing new — no first-time peel, no untested serum. If your skin is doing something unusual in the run-up, we adjust the plan rather than push through it.',
    prepNote:
      'Tell us about any active prescription, recent treatment or known allergy at the consultation. A patch test is booked before any course begins.',
    order: 3,
    imageId: 'service-skin-and-prep',
    relatedLookSlug: 'soft-glam',
  },
  {
    slug: 'hair-care-and-treatments',
    name: 'Hair Care & Treatments',
    eyebrow: 'Category 04',
    summary: 'Scalp and strand work in the months before, so styling has something to hold onto.',
    detail:
      'Treatments are assessed first and prescribed second. A scalp reading tells us whether the problem is condition, breakage or simply the wrong cut for the style you want. Courses are spaced so the last session lands two to three weeks out, which is when hair takes a set best.',
    prepNote:
      'Book the assessment at least three months before the wedding if you want a full course to be possible.',
    order: 4,
    imageId: 'service-hair-care-and-treatments',
    relatedLookSlug: 'modern-minimal',
  },
  {
    slug: 'grooming-and-add-ons',
    name: 'Grooming & Add-ons',
    eyebrow: 'Category 05',
    summary: 'The small decisions — brows, lashes, nails, draping — settled in advance rather than on the day.',
    detail:
      'These are the services that get forgotten until the morning and then run the timeline over. Each one is booked into your plan with its own slot. The touch-up kit and the second-artist option exist because large functions and long days need them, not as an upsell.',
    prepNote:
      'Brow shaping is done ten to fourteen days out so any redness has settled. Lash work is tested at the trial.',
    order: 5,
    imageId: 'service-grooming-and-add-ons',
    relatedLookSlug: 'soft-glam',
  },
] as const satisfies readonly ServiceCategory[];

export type ServiceCategorySlug = (typeof serviceCategories)[number]['slug'];

type Row = readonly [
  slug: string,
  categorySlug: ServiceCategorySlug,
  name: string,
  summary: string,
  durationMinutes: number,
];

/* ── Bridal Makeup — 8 ───────────────────────────────────────────────────── */

const MAKEUP = [
  ['bridal-day-makeup', 'bridal-makeup', 'Bridal Day Makeup', 'The full wedding look, applied on the morning to the plan agreed at your trial.', 150],
  ['engagement-makeup', 'bridal-makeup', 'Engagement Makeup', 'A lighter finish for a shorter, usually indoor function with close photography.', 105],
  ['reception-makeup', 'bridal-makeup', 'Reception Makeup', 'Built for evening light and stage lighting, with a stronger eye and a matte base.', 120],
  ['mehendi-makeup', 'bridal-makeup', 'Mehendi Makeup', 'Daylight-appropriate colour that survives heat and several hours of sitting.', 90],
  ['sangeet-makeup', 'bridal-makeup', 'Sangeet Makeup', 'A look you can dance in: locked base, secured lashes, transfer-resistant lip.', 105],
  ['airbrush-application', 'bridal-makeup', 'Airbrush Application', 'A fine, buildable base for long functions and heavy camera work. Tested at the trial first.', 45],
  ['hd-application', 'bridal-makeup', 'HD Application', 'Hand-applied coverage for textured or reactive skin, where airbrush is the wrong choice.', 45],
  ['bridesmaid-makeup', 'bridal-makeup', 'Bridesmaid Makeup', 'Coordinated with the bridal look, booked in parallel so nobody delays the call time.', 60],
] as const satisfies readonly Row[];

/* ── Bridal Hair — 7 ─────────────────────────────────────────────────────── */

const HAIR = [
  ['bridal-updo', 'bridal-hair', 'Bridal Updo', 'A pinned structure sized to carry a dupatta and any accessory you are wearing.', 120],
  ['open-waves', 'bridal-hair', 'Open Waves', 'Set waves for functions where hair stays down, held without visible product.', 90],
  ['braid-work', 'bridal-hair', 'Braid Work', 'Traditional braid dressing, including flower and jewellery placement along the length.', 105],
  ['veil-and-dupatta-setting', 'bridal-hair', 'Veil & Dupatta Setting', 'The drape pinned, photographed and documented so the placement can be repeated exactly.', 45],
  ['accessory-placement', 'bridal-hair', 'Accessory Placement', 'Maang tikka, matha patti or comb work, positioned to your parting and your outfit.', 30],
  ['reception-restyle', 'bridal-hair', 'Reception Restyle', 'A second look between functions, timed into your written plan rather than improvised.', 75],
  ['bridesmaid-hair', 'bridal-hair', 'Bridesmaid Hair', 'Simple, fast styles that read as a set beside the bride without competing with her.', 45],
] as const satisfies readonly Row[];

/* ── Skin & Prep — 7 ─────────────────────────────────────────────────────── */

const SKIN = [
  ['skin-consultation-and-patch-test', 'skin-and-prep', 'Skin Consultation & Patch Test', 'A reading of your skin and a patch test before any product or course is committed to.', 45],
  ['hydration-facial', 'skin-and-prep', 'Hydration Facial', 'A non-exfoliating session for texture and dullness, safe to repeat close to the date.', 60],
  ['brightening-course', 'skin-and-prep', 'Brightening Course', 'A spaced course for uneven tone, started at least eight weeks before the wedding.', 60],
  ['pre-wedding-peel', 'skin-and-prep', 'Pre-Wedding Peel', 'A controlled peel, scheduled no later than four weeks out and never in the final ten days.', 45],
  ['body-prep', 'skin-and-prep', 'Body Prep', 'Shoulders, back and arms — the areas an open blouse and a dupatta actually expose.', 75],
  ['under-eye-care', 'skin-and-prep', 'Under-Eye Care', 'Targeted work on puffiness and shadowing, which concealer alone tends to make worse.', 30],
  ['day-before-calm', 'skin-and-prep', 'Day-Before Calm', 'A deliberately minimal session: hydration, no actives, nothing your skin has not met.', 45],
] as const satisfies readonly Row[];

/* ── Hair Care & Treatments — 6 ──────────────────────────────────────────── */

const HAIRCARE = [
  ['scalp-assessment', 'hair-care-and-treatments', 'Scalp Assessment', 'A reading of scalp and strand condition, which decides whether a course is worth booking.', 30],
  ['strengthening-course', 'hair-care-and-treatments', 'Strengthening Course', 'Spaced sessions for breakage, ending two to three weeks before the wedding.', 75],
  ['gloss-treatment', 'hair-care-and-treatments', 'Gloss Treatment', 'Shine and tone refresh without lightening, safe near the date.', 60],
  ['smoothing-treatment', 'hair-care-and-treatments', 'Smoothing Treatment', 'For hair that fights a set. Booked early, because the result changes how it styles.', 150],
  ['trim-and-shape', 'hair-care-and-treatments', 'Trim & Shape', 'A cut planned around the bridal style, not against it.', 45],
  ['pre-wedding-conditioning', 'hair-care-and-treatments', 'Pre-Wedding Conditioning', 'A final conditioning session timed so hair holds pins rather than slipping.', 45],
] as const satisfies readonly Row[];

/* ── Grooming & Add-ons — 6 ──────────────────────────────────────────────── */

const GROOMING = [
  ['brow-shaping', 'grooming-and-add-ons', 'Brow Shaping', 'Shaped ten to fourteen days out, so any redness has fully settled by the function.', 30],
  ['lash-work', 'grooming-and-add-ons', 'Lash Work', 'Strip, cluster or extension, decided at the trial and matched to your eye shape.', 45],
  ['nails', 'grooming-and-add-ons', 'Nails', 'Colour chosen against your mehendi and your jewellery, applied close to the date.', 60],
  ['draping', 'grooming-and-add-ons', 'Draping', 'Saree or lehenga dupatta draping, pinned to hold through sitting, standing and dancing.', 40],
  ['touch-up-kit', 'grooming-and-add-ons', 'Touch-Up Kit', 'A small kit in your shades, handed over with instructions for after the artist leaves.', 15],
  ['second-artist', 'grooming-and-add-ons', 'Second-Artist Add-On', 'A second artist on site, for large parties or two looks running in parallel.', 0],
] as const satisfies readonly Row[];

/** Flattened, ordered within each category, then validated against the type. */
export const services = [...MAKEUP, ...HAIR, ...SKIN, ...HAIRCARE, ...GROOMING].map(
  ([slug, categorySlug, name, summary, durationMinutes], index) => ({
    slug,
    categorySlug,
    name,
    summary,
    durationMinutes,
    order: index + 1,
  }),
) satisfies readonly Service[];

export type ServiceSlug = (typeof services)[number]['slug'];

export const servicesByCategory = (categorySlug: ServiceCategorySlug): readonly Service[] =>
  services.filter((service) => service.categorySlug === categorySlug);



