import type { BeforeAfterPair } from '@/types/content';

/**
 * First-brush / final-look pairings (brief §11).
 *
 * Positioned as artistry rather than correction. Each pair is now a matched
 * original: the same subject photographed twice, in one room, under one lighting
 * setup, before the first brush and after the finished look
 * (`scripts/photography-local.mjs`).
 *
 * That is a change of kind, not of degree. These pairs previously held two
 * unrelated licensed photographs and each `note` had to say so out loud, because
 * a slider claims "this is the same person" simply by existing and two different
 * faces would have made that claim false. With genuinely matched frames the
 * disclosure inverts: the honest note is that it *is* one subject, and that what
 * changed between the two frames is makeup and hair rather than the person.
 *
 * The framing still matters as much as the provenance. Nothing here implies
 * makeup fixes a bride: the headline is where a look starts and where it arrives,
 * not a defect and its repair, and the "before" frame is described as bare skin
 * at a mirror rather than as a problem (docs/ACCESSIBILITY_SPEC.md §7,
 * docs/DECISION_LOG.md D5).
 */

export const beforeAfterPairs = [
  {
    id: 'soft-glam',
    title: 'First brush to soft glam',
    note: 'One subject, two frames, same light: bare skin, then a warm neutral base with a softly defined eye. Nothing between them but makeup and hair.',
    beforeImageId: 'before-soft-glam',
    afterImageId: 'after-soft-glam',
  },
  {
    id: 'classic-red',
    title: 'First brush to classic red',
    note: 'The same face before and after a deep red lip and a smoked eye. The slider handle is keyboard operable.',
    beforeImageId: 'before-classic-red',
    afterImageId: 'after-classic-red',
  },
  {
    id: 'modern-minimal',
    title: 'First brush to modern minimal',
    note: 'Restraint is a decision, not an absence: sheer base, groomed brow, her own lip tone. Both panels carry their own alt text.',
    beforeImageId: 'before-modern-minimal',
    afterImageId: 'after-modern-minimal',
  },
] as const satisfies readonly BeforeAfterPair[];
