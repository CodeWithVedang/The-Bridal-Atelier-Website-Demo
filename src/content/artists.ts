import type { Artist } from '@/types/content';

/**
 * The three artists (brief §13).
 *
 * These are fictional people for a fictional studio. `yearsPhrase` is written as
 * a phrase rather than a number field so it reads as a bio line and cannot be
 * mistaken for a verified credential in structured data — the `Person` JSON-LD
 * emits name, role and specialisms only (docs/SEO_SPEC.md §4).
 *
 * No awards, no client counts, no press mentions. A demonstration brand has not
 * earned any of those (docs/DECISION_LOG.md D3).
 */

export const artists = [
  {
    slug: 'ananya-mehta',
    name: 'Ananya Mehta',
    role: 'Founder & Lead Bridal Artist',
    specialisms: ['Traditional bridal makeup', 'Deep and warm skin tones', 'Long-wear base work'],
    yearsPhrase: 'Twelve years in bridal, the last six running this studio',
    bio: [
      'Ananya trained in a salon that took four weddings a weekend and learned there that the difference between a good bridal artist and a bad one is planning, not technique. She started the atelier to work the other way round: fewer brides, a named artist each, and a written plan before anything is applied.',
      'She takes the ceremony look herself on every wedding she is booked for, and she does the consultation for every bride in the studio. If a date is wrong for us, she says so at that meeting rather than after a deposit.',
    ],
    signatureLine: 'A red that still reads as red in the last photograph of the night.',
    imageId: 'artist-ananya-mehta',
    order: 1,
  },
  {
    slug: 'rhea-kapoor',
    name: 'Rhea Kapoor',
    role: 'Senior Artist — Hair & Draping',
    specialisms: ['Bridal hair structure', 'Veil and dupatta setting', 'Textured and fine hair'],
    yearsPhrase: 'Nine years, four of them in hair alone',
    bio: [
      'Rhea moved from full-service bridal work into hair specifically because it is where most wedding days lose time. She builds the pinning first and the shape second, which is why her sets hold through a sangeet and still take a dupatta change without being rebuilt.',
      'She photographs every drape at the trial and writes the placement down. On the morning, the same setting is repeated from her own notes rather than from memory.',
    ],
    signatureLine: 'A structure you can dance in and still hand over to a photographer at midnight.',
    imageId: 'artist-rhea-kapoor',
    order: 2,
  },
  {
    slug: 'meera-shah',
    name: 'Meera Shah',
    role: 'Artist — Skin & Preparation',
    specialisms: ['Pre-wedding skin planning', 'Reactive and acne-prone skin', 'Minimal-coverage looks'],
    yearsPhrase: 'Seven years, with a clinical aesthetics background',
    bio: [
      'Meera plans the months before the wedding rather than the morning of it. Every bride on a preparation course is assessed by her, patch-tested, and given a dated schedule that finishes well clear of the first function.',
      'She is the artist who will tell you not to have a treatment. That is the point of having her: the final ten days hold nothing your skin has not already met.',
    ],
    signatureLine: 'Skin that needs less covering, so the makeup can be lighter.',
    imageId: 'artist-meera-shah',
    order: 3,
  },
] as const satisfies readonly Artist[];

export type ArtistSlug = (typeof artists)[number]['slug'];
