import type { JourneyStage } from '@/types/content';

/**
 * The five stages of the bridal process (brief §7, docs/CONTENT_SPEC.md §5).
 *
 * This is the site's core anxiety-reduction device: a bride can see the whole
 * sequence before she gives up an email address (docs/PSYCHOLOGY_SPEC.md §4).
 * `timing` is relative to the wedding date, never an absolute date, so the copy
 * never goes stale.
 */

export const journeyStages = [
  {
    index: '01',
    slug: 'consultation',
    name: 'Consultation',
    promise: 'A 45-minute conversation about the wedding, not a sales call.',
    detail:
      'We go through your functions, your outfits and the jewellery you already own, then talk about what suits your skin and hair. You leave knowing which package fits and what it covers. Nothing is booked in this meeting.',
    timing: 'Any time after your dates are fixed',
  },
  {
    index: '02',
    slug: 'bridal-trial',
    name: 'Bridal Trial',
    promise: 'The full look tested six weeks out, photographed in daylight and evening light.',
    detail:
      'Your artist builds the complete look — base, eyes, hair, drape — and we photograph it twice, once by a window and once under warm light, because those are the two conditions your photographer will work in. You keep the images.',
    timing: 'About six weeks before the wedding',
  },
  {
    index: '03',
    slug: 'the-plan',
    name: 'The Plan',
    promise: 'A written timeline for every function, with call times and travel.',
    detail:
      'You receive a single document: who arrives when, how long each look takes, when the photographer gets you, and what happens if a function runs late. Your family gets the same copy, so nobody is asking you for details on the morning.',
    timing: 'Within a week of the trial',
  },
  {
    index: '04',
    slug: 'wedding-week',
    name: 'Wedding Week',
    promise: 'Skin and hair prep sessions in the run-up, on a fixed schedule.',
    detail:
      'Prep is booked in advance rather than squeezed in. Nothing new is introduced in the final ten days — no first-time peel, no untested treatment — because the week before a wedding is the wrong time to find out how your skin reacts.',
    timing: 'The ten days before the first function',
  },
  {
    index: '05',
    slug: 'the-day',
    name: 'The Day',
    promise: 'Your named artist on site, with touch-ups through the ceremony.',
    detail:
      'The artist who did your trial is the artist who does your wedding. They stay for the hours agreed in your package, carry a touch-up kit sized for the weather, and hand over a small kit for anything after they leave.',
    timing: 'Each function, from your call time',
  },
] as const satisfies readonly JourneyStage[];

export type JourneyStageSlug = (typeof journeyStages)[number]['slug'];
