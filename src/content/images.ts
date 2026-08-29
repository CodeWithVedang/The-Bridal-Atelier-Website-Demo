import type { ImageAsset } from '@/types/content';

/**
 * The image manifest — the only place an asset file is named.
 *
 * Two kinds of asset live here, and the distinction is deliberate:
 *
 *  - **`photograph`** — a self-hosted JPEG in `public/photography/`. Most are
 *    licensed editorial images downloaded at their final dimensions by
 *    `scripts/fetch-photography.mjs` from the hand-curated id list in
 *    `scripts/photography-sources.mjs`. The six before/after frames are matched
 *    studio originals instead, imported from outside the repository by
 *    `scripts/import-local-photography.mjs`. Either way the provenance of every
 *    file is recorded in `public/photography/index.json`, and nothing is
 *    hot-linked — `next/image` optimises it and no third-party origin is
 *    contacted when the page renders.
 *  - **`artwork`** — a generated vector panel in `public/atelier/`, used in the
 *    three places where a photograph would assert something untrue: a map we do
 *    not embed, a plain ground texture, and the Open Graph card.
 *
 * To swap in real studio photography: drop a file at
 * `public/photography/<id>.jpg` at the stated size and remove that id's row from
 * `scripts/photography-sources.mjs` so the fetch step stops overwriting it. No
 * component changes are required (docs/BRAND_SYSTEM.md §7).
 *
 * Alt text describes the subject and the light for a photograph, and the artwork
 * and its role for a panel (docs/ACCESSIBILITY_SPEC.md §7). No alt text names an
 * artist, a bride or a client, because none of these people are ours.
 *
 * `tests/images.test.ts` asserts this list agrees with what is actually on disk,
 * so the manifest and the files can never drift apart.
 */

type Row = readonly [
  id: string,
  width: number,
  height: number,
  kind: ImageAsset['kind'],
  alt: string,
];

const MANIFEST = [
  /* ── Generated artwork — deliberately not photographs ──────────────────── */
  ['contact-map', 1200, 800, 'artwork', 'Editorial artwork shown in place of a map. No map service is embedded on this site.'],
  ['texture-ivory', 1600, 600, 'artwork', 'Editorial artwork: a quiet ivory field crossed by two hairline rules.'],
  ['cta-drape', 1600, 600, 'artwork', 'Editorial artwork: dark espresso folds crossed by a single gold seam.'],

  /* ── Home ─────────────────────────────────────────────────────────────── */
  ['hero-veil', 1200, 1500, 'photograph', 'A bride photographed close, eyes lowered, a pearl and gold maang tikka set at her parting.'],
  ['hero-detail', 800, 1000, 'photograph', 'A gold jhumka earring photographed close against dark hair.'],
  ['cta-bride', 1600, 900, 'photograph', 'A bride outdoors in warm afternoon light, wearing layered traditional jewellery.'],
  ['journey-arch', 1200, 800, 'photograph', 'An artist smiling as she works on a seated client in a bright studio.'],
  ['testimonial-portrait', 900, 1200, 'photograph', 'A bride in a red and gold sari, turned slightly away from the camera.'],

  /* ── The five journey stages ───────────────────────────────────────────── */
  ['journey-consultation', 800, 600, 'photograph', 'An artist talking with a client across a lit studio bench.'],
  ['journey-bridal-trial', 800, 600, 'photograph', 'Makeup being applied slowly in a bright studio, mirror to one side.'],
  ['journey-the-plan', 800, 600, 'photograph', "A close view of a bride's veil and jewellery as the placement is recorded."],
  ['journey-wedding-week', 800, 600, 'photograph', 'A facial treatment underway in a quiet, warm-lit room.'],
  ['journey-the-day', 800, 600, 'photograph', 'A bride at a mirror on the morning of her wedding, dressed and ready.'],

  /* ── About ─────────────────────────────────────────────────────────────── */
  ['about-studio', 1400, 900, 'photograph', 'A bride reflected in a tall ornate mirror, the room warm behind her.'],
  ['about-philosophy', 900, 1200, 'photograph', 'Two women in traditional dress helping each other get ready.'],

  /* ── Page headers ──────────────────────────────────────────────────────── */
  ['services-hero', 1200, 1500, 'photograph', 'A bride smiling in a salon chair while flowers are pinned into her hair.'],
  ['services-hero-detail', 800, 1000, 'photograph', 'Eyeshadow laid down with a flat brush, eyes closed.'],
  ['packages-hero', 1200, 800, 'photograph', 'A bride wearing traditional jewellery, photographed in soft indoor light.'],
  ['portfolio-hero', 1600, 900, 'photograph', 'A bride in bright traditional accessories against a warm background.'],
  ['looks-hero', 1200, 1500, 'photograph', 'A bride smiling in an ornate red bridal outfit.'],
  ['artists-hero', 1400, 900, 'photograph', 'An artist working on a seated bride, tools laid out beside them.'],
  ['contact-hero', 1200, 800, 'photograph', 'A woman in a traditional saree and gold jewellery, turned to the light.'],
  ['book-hero', 1200, 800, 'photograph', 'A makeup artist part-way through a look, working close to the face.'],

  /* ── The five service categories ───────────────────────────────────────── */
  ['service-bridal-makeup', 900, 1200, 'photograph', 'A bridal base and eye being built up close, brush in frame.'],
  ['service-bridal-hair', 900, 1200, 'photograph', 'Bridal hair being pinned and set in a salon chair.'],
  ['service-skin-and-prep', 900, 1200, 'photograph', 'A treatment mask brushed over the face and throat in a warm-lit room.'],
  ['service-hair-care-and-treatments', 900, 1200, 'photograph', 'Hair being finished after a treatment, sections held and combed through.'],
  ['service-grooming-and-add-ons', 900, 1200, 'photograph', 'Mascara worked through the lashes at close range.'],

  /* ── The four signature looks ──────────────────────────────────────────── */
  ['look-classic-red', 900, 1200, 'photograph', 'A bride in a vivid red outfit with a strong lip and a defined eye.'],
  ['look-ivory-pearl', 900, 1200, 'photograph', 'A pale luminous bridal look with traditional jewellery, in flat daylight.'],
  ['look-soft-glam', 900, 1200, 'photograph', 'A warm neutral bridal look photographed close, jewellery at the ear.'],
  ['look-modern-minimal', 900, 1200, 'photograph', 'A restrained bridal look: clear skin, groomed brow, almost no colour.'],

  /* ── Artists — craft, not portraits ─────────────────────────────────────
   * These three artists are demonstration profiles. A licensed photograph of a
   * stranger captioned with an invented name would be a fabricated credential,
   * so each card carries an image of the work that artist is described as doing
   * and says as much in the section (docs/DECISION_LOG.md).
   */
  ['artist-ananya-mehta', 800, 1000, 'photograph', 'Traditional bridal makeup, photographed close: warm base, defined eye, deep lip.'],
  ['artist-rhea-kapoor', 800, 1000, 'photograph', 'A bridal updo seen from behind, dressed with red flowers.'],
  ['artist-meera-shah', 800, 1000, 'photograph', 'A preparation treatment being applied, face relaxed and eyes closed.'],

  /* ── The twelve portfolio projects ─────────────────────────────────────── */
  ['portfolio-jaipur-courtyard', 1000, 1250, 'photograph', 'A bride in red standing outdoors in direct afternoon light.'],
  ['portfolio-ivory-morning', 1000, 1250, 'photograph', 'A bride lit only by a window, base kept sheer.'],
  ['portfolio-monsoon-mehendi', 1000, 1400, 'photograph', 'Hands covered in fresh henna, resting palm up.'],
  ['portfolio-coastal-sangeet', 1000, 1250, 'photograph', 'A bride in red photographed against dense greenery.'],
  ['portfolio-heirloom-red', 1000, 1250, 'photograph', 'A bride in a deep red lehenga with heavy gold jewellery.'],
  ['portfolio-terrace-reception', 1000, 1250, 'photograph', 'A bride in jewellery under warm evening light.'],
  ['portfolio-temple-vows', 1000, 1250, 'photograph', 'A South Indian bridal portrait with jasmine along the braid.'],
  ['portfolio-champagne-engagement', 1000, 1400, 'photograph', 'A bride in soft champagne tones, photographed close.'],
  ['portfolio-desert-haldi', 1000, 1250, 'photograph', 'A bride smiling at her haldi, marigold and turmeric around her.'],
  ['portfolio-winter-nikah', 1000, 1250, 'photograph', 'A bride in a layered outfit with the dupatta drawn over her head.'],
  ['portfolio-garden-christian', 1000, 1250, 'photograph', 'A bride outdoors with henna on her hands, in daylight.'],
  ['portfolio-studio-portrait', 1000, 1250, 'photograph', 'A studio bridal portrait against a plain warm ground.'],

  /* ── Three first-brush / final-look pairings ───────────────────────────────
   * The only matched originals on the site: the same subject photographed twice
   * in one room under one setup, supplied with the project rather than pulled
   * from a stock library (scripts/photography-local.mjs). Declared portrait at
   * 1000×1120 — the imported crop of a landscape original — because a comparison
   * slider is read as a face, not as a room.
   */
  ['before-soft-glam', 1000, 1120, 'photograph', 'A woman at a studio mirror before any makeup is applied, hair clipped back from her face.'],
  ['after-soft-glam', 1000, 1120, 'photograph', 'The same woman with the soft glam look finished: warm neutral base, softly defined eye, glossed lip.'],
  ['before-classic-red', 1000, 1120, 'photograph', 'A woman at a studio mirror before any makeup is applied, hair pinned away from her face.'],
  ['after-classic-red', 1000, 1120, 'photograph', 'The same woman with the classic red look finished: deep red lip, smoked eye, hair dressed up.'],
  ['before-modern-minimal', 1000, 1120, 'photograph', 'A woman seated at a studio mirror before any makeup is applied, hair loosely pinned.'],
  ['after-modern-minimal', 1000, 1120, 'photograph', 'The same woman with the modern minimal look finished: sheer base, groomed brow, lip left close to her own tone.'],

  /* ── The wedding week, function by function ────────────────────────────── */
  ['event-mehendi', 900, 1200, 'photograph', 'A bride at her mehendi, henna drying on her hands.'],
  ['event-haldi', 900, 1200, 'photograph', 'A bride at her haldi, turmeric on her skin and marigold behind her.'],
  ['event-engagement', 900, 1200, 'photograph', 'A bride in an engagement look, jewellery light and the eye softly defined.'],
  ['event-wedding', 900, 1200, 'photograph', 'A bride on her wedding day in full traditional dress and jewellery.'],
  ['event-reception', 900, 1200, 'photograph', 'A bride in a reception look, hair dressed away from the face.'],

  /* ── The eight social tiles, square ────────────────────────────────────── */
  ['instagram-01', 600, 600, 'photograph', 'Traditional gold earrings photographed close.'],
  ['instagram-02', 600, 600, 'photograph', 'Fresh mehndi across a pair of hands.'],
  ['instagram-03', 600, 600, 'photograph', 'Red and gold bangles stacked along a wrist.'],
  ['instagram-04', 600, 600, 'photograph', 'Bridal jewellery laid against a red saree.'],
  ['instagram-05', 600, 600, 'photograph', 'A braid dressed with white flowers.'],
  ['instagram-06', 600, 600, 'photograph', 'A single earring at the ear, hair swept back.'],
  ['instagram-07', 600, 600, 'photograph', 'Bridal hair seen from behind, pinned and finished.'],
  ['instagram-08', 600, 600, 'photograph', 'Foundation and brushes laid out on a bench.'],

  /* ── Mixed-ratio gallery, for the masonry compositions ─────────────────────
   * Deliberately five different aspect ratios (0.67, 0.73, 0.80, 1.43, 1.50) so
   * a masonry wall can vary its rhythm instead of repeating one rectangle.
   */
  ['gallery-01', 800, 1000, 'photograph', 'A bride in a red sari, photographed at half length.'],
  ['gallery-02', 1000, 700, 'photograph', 'A bride in a red lehenga, smiling away from the camera.'],
  ['gallery-03', 800, 1100, 'photograph', 'Mehndi being drawn onto an open palm.'],
  ['gallery-04', 1000, 667, 'photograph', 'A bridal portrait in low, warm light.'],
  ['gallery-05', 800, 1000, 'photograph', 'A seated bride with her veil drawn forward.'],
  ['gallery-06', 1000, 667, 'photograph', 'A bride in traditional attire, turned to the window.'],
  ['gallery-07', 800, 1200, 'photograph', 'A floral bridal updo seen from behind.'],
  ['gallery-08', 1000, 667, 'photograph', 'Henna and bangles on a pair of bridal hands.'],
  ['gallery-09', 800, 1000, 'photograph', 'A bride being prepared, blush worked over the cheek.'],
  ['gallery-10', 1000, 667, 'photograph', 'Eye makeup laid down with a brush, close in.'],
] as const satisfies readonly Row[];

/** Literal union of every declared asset id, so a typo is a build error. */
export type KnownImageId = (typeof MANIFEST)[number][0];

export const images = Object.fromEntries(
  MANIFEST.map(([id, width, height, kind, alt]) => [
    id,
    {
      id,
      src: kind === 'photograph' ? `/photography/${id}.jpg` : `/atelier/${id}.svg`,
      width,
      height,
      alt,
      kind,
    } satisfies ImageAsset,
  ]),
) as Readonly<Record<KnownImageId, ImageAsset>>;

/**
 * Resolve an asset. The signature already rejects unknown ids at build time;
 * the runtime throw covers ids that arrive from outside TypeScript (a future
 * CMS payload, a JSON fixture) rather than failing silently to a blank slot.
 */
export function getImage(id: KnownImageId): ImageAsset {
  const asset = images[id];
  if (!asset) throw new Error(`Unknown image id: ${id}`);
  return asset;
}

export const imageList: readonly ImageAsset[] = MANIFEST.map(([id]) => images[id]);

/** Every photograph, for the credits list on the privacy page. */
export const photographs: readonly ImageAsset[] = imageList.filter(
  (asset) => asset.kind === 'photograph',
);
