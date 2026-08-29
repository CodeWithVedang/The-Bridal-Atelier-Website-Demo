import { formatRupees } from './utils';

import type { Artist, BridalPackage } from '@/types/content';

/**
 * Content → form options (docs/ARCHITECTURE.md §7).
 *
 * The two forms offer a package and an artist, and both lists are already
 * authored in `src/content/`. Deriving the options rather than re-typing them
 * means a renamed package or a new artist cannot leave a form offering something
 * that no longer exists — the failure mode being a submission the server's enum
 * then rejects, with no field to attach the error to.
 *
 * The trailing "not sure" and "no preference" entries are not content: they are
 * schema values (`PACKAGE_PREFERENCES`, `ARTIST_PREFERENCES`) that exist so a
 * bride is never forced to guess. Being able to say "I don't know yet" is the
 * point of a consultation.
 */

export interface ChoiceOption {
  readonly value: string;
  readonly label: string;
  readonly description?: string;
  readonly meta?: string;
}

/** Includes the `not-sure` option. Used by both forms' package question. */
export function packageChoices(packages: readonly BridalPackage[]): readonly ChoiceOption[] {
  return [
    ...packages.map((pkg) => ({
      value: pkg.slug,
      label: pkg.name,
      description: pkg.fitStatement,
      meta: `From ${formatRupees(pkg.startingInvestment)}`,
    })),
    {
      value: 'not-sure',
      label: 'Not sure yet',
      description: 'We will tell you which one fits at the consultation.',
    },
  ];
}

/** Compact form — label and starting figure only, for the date check. */
export function packageChoicesCompact(
  packages: readonly BridalPackage[],
): readonly ChoiceOption[] {
  return [
    ...packages.map((pkg) => ({
      value: pkg.slug,
      label: pkg.name,
      meta: formatRupees(pkg.startingInvestment),
    })),
    { value: 'not-sure', label: 'Not sure yet' },
  ];
}

/** Includes the `no-preference` option. */
export function artistChoices(artists: readonly Artist[]): readonly ChoiceOption[] {
  return [
    ...artists.map((artist) => ({
      value: artist.slug,
      label: artist.name,
      description: artist.role,
    })),
    {
      value: 'no-preference',
      label: 'No preference',
      description: 'We match you to the artist free on your dates.',
    },
  ];
}

/** Slug → display name, for tiles and quotes that credit an entity. */
export function nameMap(
  rows: readonly { readonly slug: string; readonly name: string }[],
): Readonly<Record<string, string>> {
  return Object.fromEntries(rows.map((row) => [row.slug, row.name]));
}
