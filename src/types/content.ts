/**
 * Content types — the shape a CMS or database would have to satisfy.
 *
 * These are the read-side contracts for docs/ARCHITECTURE.md §7. Every content
 * module is declared `satisfies readonly T[]`, so a typo in a slug or a missing
 * field is a build error rather than a blank region on the page.
 *
 * The `KnownImageId` import is type-only and therefore erased — there is no
 * runtime cycle with `src/content/images.ts`. It is worth the inversion: it
 * makes every `imageId` field in this file reject an unpublished asset id at
 * build time instead of rendering an empty frame.
 */

import type { KnownImageId } from '@/content/images';

export type ImageId = KnownImageId;

export interface ImageAsset {
  readonly id: ImageId;
  readonly src: string;
  readonly width: number;
  readonly height: number;
  /**
   * What is in the frame, described for someone who cannot see it. Photographs
   * describe the subject and the light; artwork describes the artwork and the
   * role it plays, never a person (docs/ACCESSIBILITY_SPEC.md §7).
   */
  readonly alt: string;
  /**
   * `photograph` — a licensed editorial photograph, self-hosted under
   * `/photography`, credited in `public/photography/index.json`.
   * `artwork` — a generated vector panel under `/atelier`, used where a
   * photograph would misrepresent something (a map we do not embed, a texture).
   *
   * Sections read this when the distinction matters: a photograph may carry a
   * human subject and needs a warm scrim behind overlaid text; artwork does not.
   */
  readonly kind: 'photograph' | 'artwork';
}

export interface ServiceCategory {
  readonly slug: string;
  readonly name: string;
  readonly eyebrow: string;
  readonly summary: string;
  readonly detail: string;
  readonly prepNote: string;
  readonly order: number;
  readonly imageId: ImageId;
  readonly relatedLookSlug: string;
}

export interface Service {
  readonly slug: string;
  readonly categorySlug: string;
  readonly name: string;
  readonly summary: string;
  readonly durationMinutes: number;
  readonly order: number;
}

export interface PackageInclusion {
  readonly label: string;
  readonly detail?: string;
}

export interface BridalPackage {
  readonly slug: string;
  readonly name: string;
  readonly fitStatement: string;
  readonly summary: string;
  /** Rupees. Published deliberately: hidden pricing to force contact is rejected. */
  readonly startingInvestment: number;
  readonly functionsCovered: string;
  readonly artistCount: number;
  readonly trialPolicy: string;
  readonly travelPolicy: string;
  readonly includes: readonly PackageInclusion[];
  readonly excludes: readonly string[];
  /** At most one package sets this. */
  readonly recommended: boolean;
  readonly order: number;
}

export interface ComparisonRow {
  readonly label: string;
  readonly values: Readonly<Record<string, string>>;
}

export interface Artist {
  readonly slug: string;
  readonly name: string;
  readonly role: string;
  readonly specialisms: readonly string[];
  readonly yearsPhrase: string;
  readonly bio: readonly string[];
  readonly signatureLine: string;
  readonly imageId: ImageId;
  readonly order: number;
}

export type PortfolioFilterDimension =
  | 'lookType'
  | 'skinTone'
  | 'weddingType'
  | 'function'
  | 'hairstyle'
  | 'colourStory'
  | 'coverage'
  | 'artist';

export interface PortfolioProject {
  readonly slug: string;
  readonly title: string;
  readonly city: string;
  readonly summary: string;
  readonly imageId: ImageId;
  readonly artistSlug: string;
  readonly feature: boolean;
  readonly order: number;
  readonly breakdown: readonly { readonly label: string; readonly value: string }[];
  readonly filters: Readonly<Record<PortfolioFilterDimension, readonly string[]>>;
}

export interface BridalLook {
  readonly slug: string;
  readonly name: string;
  readonly summary: string;
  readonly detail: string;
  readonly bestFor: string;
  readonly elements: readonly string[];
  readonly imageId: ImageId;
  readonly order: number;
}

export interface Testimonial {
  readonly id: string;
  readonly quote: string;
  readonly attribution: string;
  readonly city: string;
  readonly packageSlug: string;
  /**
   * Provenance is a first-class field, not a footnote. Every row in this build
   * is `true`: The Bridal Atelier is a demonstration brand and has no real
   * clients. No Review or AggregateRating structured data is emitted for these
   * (docs/SEO_SPEC.md §4, docs/DECISION_LOG.md D3).
   */
  readonly sample: true;
}

export interface Faq {
  readonly id: string;
  readonly topic: 'booking' | 'packages' | 'trial' | 'day-of';
  readonly question: string;
  readonly answer: string;
  readonly order: number;
}

export interface JourneyStage {
  readonly index: string;
  readonly slug: string;
  readonly name: string;
  readonly promise: string;
  readonly detail: string;
  readonly timing: string;
}

export interface BeforeAfterPair {
  readonly id: string;
  readonly title: string;
  readonly note: string;
  readonly beforeImageId: ImageId;
  readonly afterImageId: ImageId;
}

export interface InstagramTile {
  readonly id: string;
  readonly caption: string;
  readonly imageId: ImageId;
}

export interface LegalSection {
  readonly heading: string;
  readonly paragraphs: readonly string[];
  readonly bullets?: readonly string[];
}
