/**
 * Studio-supplied originals — the photographs that are *not* stock.
 *
 * Everything in `photography-sources.mjs` is a licensed editorial image pinned by
 * Pexels id. These six are different in kind: they are matched before/after
 * originals supplied with the project, where the same subject is photographed
 * twice under one lighting setup, in one room, in one robe.
 *
 * That distinction is load-bearing rather than administrative. A comparison
 * slider claims "this is the same person, before and after" simply by existing.
 * Two unrelated stock photographs cannot honestly make that claim, which is why
 * the pairs previously carried a disclosure saying they were not the same bride
 * twice. With real matched originals the disclosure changes, so the provenance
 * has to be recorded separately — the credits list on `/privacy#photography`
 * reads from it, and must not describe these as Pexels images.
 *
 * Row: [manifestId, sourceFileName, width, height, subject]
 *
 * `width`/`height` are the box `src/content/images.ts` declares. The originals
 * are landscape 1402×1122; the import step centre-crops to the portrait box a
 * face comparison needs, without enlarging.
 */

/** @typedef {readonly [string, string, number, number, string]} LocalRow */

/** @type {readonly LocalRow[]} */
export const LOCAL_PHOTOGRAPHY = [
  /* ── Three first-brush / final-look pairings ────────────────────────────── */
  [
    'before-soft-glam',
    'First brush to soft glam before.png',
    1000,
    1120,
    'The same subject before the first brush: bare skin, hair clipped back at the mirror',
  ],
  [
    'after-soft-glam',
    'First brush to soft glam after.png',
    1000,
    1120,
    'The finished soft glam look on the same subject: warm neutral base, defined eye, glossed lip',
  ],
  [
    'before-classic-red',
    'First brush to classic red before.png',
    1000,
    1120,
    'The same subject before the first brush: bare skin, hair pinned away from the face',
  ],
  [
    'after-classic-red',
    'First brush to classic red after.png',
    1000,
    1120,
    'The finished classic red look on the same subject: deep red lip, softly smoked eye',
  ],
  [
    'before-modern-minimal',
    'First brush to modern minimal before.png',
    1000,
    1120,
    'The same subject before the first brush, seated at the studio mirror',
  ],
  [
    'after-modern-minimal',
    'First brush to modern minimal after.png',
    1000,
    1120,
    'The finished modern minimal look on the same subject: sheer base, groomed brow, bare lip tone',
  ],
];

/**
 * The credit recorded for every row above. There is no source page to link, so
 * `page` is empty and the credits list renders the source as plain text — a link
 * to nowhere would be worse than no link.
 */
export const LOCAL_CREDIT = {
  photographer: 'Supplied with the project brief',
  source: 'Studio original',
  licence: 'Supplied for use in this build. Not a stock image and not covered by the Pexels licence.',
  page: '',
};
