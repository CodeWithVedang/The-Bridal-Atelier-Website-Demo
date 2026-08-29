import type { BeforeAfterPair } from '@/types/content';

/**
 * First-brush / final-look pairings (brief §11).
 *
 * Positioned as artistry rather than correction. Each pair is two licensed
 * editorial photographs — one of a look being built, one of a finished look —
 * and the `note` says exactly that, because these are not the same bride
 * photographed twice and presenting them as one transformation would be a
 * fabricated result (docs/ACCESSIBILITY_SPEC.md §7, docs/DECISION_LOG.md D5).
 *
 * The framing matters as much as the disclosure: nothing here implies makeup
 * fixes a bride. The headline is the process — where a look starts and where it
 * arrives — not a defect and its repair.
 */

export const beforeAfterPairs = [
  {
    id: 'soft-glam',
    title: 'First brush to soft glam',
    note: 'Two licensed editorial photographs — a look being built, and a finished look. Not the same bride twice.',
    beforeImageId: 'before-soft-glam',
    afterImageId: 'after-soft-glam',
  },
  {
    id: 'classic-red',
    title: 'First brush to classic red',
    note: 'Two licensed editorial photographs. The slider handle is keyboard operable.',
    beforeImageId: 'before-classic-red',
    afterImageId: 'after-classic-red',
  },
  {
    id: 'modern-minimal',
    title: 'First brush to modern minimal',
    note: 'Two licensed editorial photographs. Both panels carry their own alt text.',
    beforeImageId: 'before-modern-minimal',
    afterImageId: 'after-modern-minimal',
  },
] as const satisfies readonly BeforeAfterPair[];
