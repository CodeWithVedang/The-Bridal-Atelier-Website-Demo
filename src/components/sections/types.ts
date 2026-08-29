import type { SectionTone } from '@/components/primitives';

/**
 * The shape every section heading arrives in.
 *
 * Sections do not own copy. They receive a block from `src/content/site-copy.ts`
 * (or a page-local equivalent), which is what makes the CMS swap in
 * docs/ARCHITECTURE.md §7 a data-layer change: the section keeps its layout and
 * the words come from somewhere else (docs/UI_SPEC.md §6).
 *
 * `ctaLabel` and `ctaHref` travel together — a label without a target renders
 * nothing rather than a dead button. That pairing is checked at each call site
 * rather than in the type, because a discriminated union here would make every
 * `homeSections` entry noisier to author for no real gain.
 */
export interface SectionCopy {
  readonly eyebrow: string;
  readonly heading: string;
  readonly intro?: string;
  readonly ctaLabel?: string;
  readonly ctaHref?: string;
}

/**
 * Ground colour, passed in by the page rather than chosen by the section.
 *
 * Alternation is a property of a page, not of a component: the same
 * `PackagesSection` sits on `ivory-50` on the home page and on `ivory-100` on
 * `/packages`, and only the page knows what precedes it. The one-`blush`-per-page
 * convention in docs/BRAND_SYSTEM.md §3 is only reviewable if the decision lives
 * at page level too.
 */
export type SectionGround = SectionTone;
