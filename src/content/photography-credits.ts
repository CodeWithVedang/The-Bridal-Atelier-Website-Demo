import manifest from '../../public/photography/index.json';

/**
 * Photography provenance, read from the file the fetch script writes.
 *
 * `scripts/fetch-photography.mjs` records every photograph's photographer, source
 * page, licence, byte size and dimensions in `public/photography/index.json`.
 * That file is the single source of truth for attribution, so this module imports
 * it rather than restating it: a credits list maintained by hand would drift from
 * the files on disk the first time one was swapped, and a wrong photographer
 * credit is worse than none.
 *
 * Two provenance kinds live in that manifest and the split is deliberate. Most
 * files are licensed editorial images pinned by Pexels id; the six before/after
 * frames are matched studio originals supplied with the project. Describing the
 * second group as stock — or the first as the studio's own work — would both be
 * false, so the credits page reads them as two lists.
 *
 * The Pexels licence does not require attribution. It is given anyway — the
 * photographs are other people's work, and the cost of saying so is one list.
 */

export interface PhotographCredit {
  readonly id: string;
  readonly file: string;
  readonly width: number;
  readonly height: number;
  readonly bytes: number;
  readonly subject: string;
  readonly credit: {
    readonly photographer: string;
    readonly source: string;
    readonly licence: string;
    /** Empty for a studio original: there is no source page to link. */
    readonly page: string;
  };
}

export const photographyLicence: string = manifest.licence;

export const photographyCredits: readonly PhotographCredit[] = manifest.photographs;

/** The marker the fetch script writes for a file that is not from a stock library. */
const STUDIO_ORIGINAL = 'Studio original';

/** Licensed editorial images — everything with a named third-party photographer. */
export const licensedCredits: readonly PhotographCredit[] = photographyCredits.filter(
  (row) => row.credit.source !== STUDIO_ORIGINAL,
);

/** Matched originals supplied with the project, credited to no stock library. */
export const studioCredits: readonly PhotographCredit[] = photographyCredits.filter(
  (row) => row.credit.source === STUDIO_ORIGINAL,
);

/**
 * Alphabetical by photographer, so the list reads as an acknowledgement. Studio
 * originals are excluded: "Supplied with the project brief" is a provenance note,
 * not a photographer, and padding the acknowledgement with it would overstate how
 * many people's work is on the page.
 */
export const photographersByName: readonly { readonly name: string; readonly count: number }[] =
  Object.entries(
    licensedCredits.reduce<Record<string, number>>((tally, row) => {
      tally[row.credit.photographer] = (tally[row.credit.photographer] ?? 0) + 1;
      return tally;
    }, {}),
  )
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
