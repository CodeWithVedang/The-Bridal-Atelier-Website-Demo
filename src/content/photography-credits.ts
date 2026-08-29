import manifest from '../../public/photography/index.json';

/**
 * Photography provenance, read from the file the fetch script writes.
 *
 * `scripts/fetch-photography.mjs` downloads each photograph and records its
 * photographer, source page, licence, byte size and dimensions in
 * `public/photography/index.json`. That file is the single source of truth for
 * attribution, so this module imports it rather than restating it: a credits list
 * maintained by hand would drift from the files on disk the first time one was
 * swapped, and a wrong photographer credit is worse than none.
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
    readonly page: string;
  };
}

export const photographyLicence: string = manifest.licence;

export const photographyCredits: readonly PhotographCredit[] = manifest.photographs;

/** Alphabetical by photographer, so the list reads as an acknowledgement. */
export const photographersByName: readonly { readonly name: string; readonly count: number }[] =
  Object.entries(
    photographyCredits.reduce<Record<string, number>>((tally, row) => {
      tally[row.credit.photographer] = (tally[row.credit.photographer] ?? 0) + 1;
      return tally;
    }, {}),
  )
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
