import { daysBetweenIso, formatIsoDate, todayIso } from '@/lib/utils';

import type { AvailabilityInput } from '@/lib/schemas';

/**
 * The wedding-date check (docs/ARCHITECTURE.md §6).
 *
 * This is a rule engine, not a diary. It has to be, and saying so is the whole
 * design: a fictional studio has no bookings to look up, and inventing a
 * plausible-looking "3 slots left" would be fabricated scarcity — rejected in
 * docs/PSYCHOLOGY_SPEC.md §6. Every result therefore states that it is an
 * indication and that a coordinator confirms the actual slot.
 *
 * The four rules, in evaluation order:
 *
 *  1. A date in the past is `unavailable`. Nothing else is checked, because the
 *     user has almost certainly typed the wrong year.
 *  2. A date more than 24 months out is `available`, with a note that the diary
 *     is not open that far ahead yet.
 *  3. A peak-season weekend — November, December, January or February, falling
 *     on a Saturday or Sunday — is `limited`. Both conditions must hold.
 *  4. Everything else is `available`.
 *
 * Rules 1 and 3 are the two that can disappoint, so both carry a concrete next
 * step rather than a dead end (docs/UX_SPEC.md §4).
 */

export type AvailabilityStatus = 'available' | 'limited' | 'unavailable';

export interface AvailabilityResult {
  readonly status: AvailabilityStatus;
  readonly headline: string;
  readonly detail: string;
  /** What to do next, always present, even on `unavailable`. */
  readonly nextStep: string;
  readonly formattedDate: string;
  readonly leadTimeDays: number;
  readonly isPeakSeason: boolean;
  readonly isWeekend: boolean;
  /** Reassurance that this is a rule, not a live lookup. Rendered every time. */
  readonly basis: string;
}

/** November, December, January, February — the Indian wedding season peak. */
const PEAK_MONTHS = new Set([11, 12, 1, 2]);

const BASIS =
  'This is an indication based on season and day of the week, not a live diary. A coordinator confirms the actual slot when you enquire.';

/** Day of week for a `YYYY-MM-DD` string, computed in UTC so it never shifts. */
function dayOfWeek(iso: string): number {
  const [year, month, day] = iso.split('-').map(Number) as [number, number, number];
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

export function evaluateAvailability(
  input: AvailabilityInput,
  now: string = todayIso(),
): AvailabilityResult {
  const { weddingDate, functionCount } = input;
  const leadTimeDays = daysBetweenIso(now, weddingDate);
  const month = Number(weddingDate.slice(5, 7));
  const weekday = dayOfWeek(weddingDate);
  const isWeekend = weekday === 0 || weekday === 6;
  const isPeakSeason = PEAK_MONTHS.has(month);
  const formattedDate = formatIsoDate(weddingDate);

  const shared = { formattedDate, leadTimeDays, isPeakSeason, isWeekend, basis: BASIS } as const;

  // Rule 1 — the date has already passed.
  if (leadTimeDays < 0) {
    return {
      ...shared,
      status: 'unavailable',
      headline: `${formattedDate} has already passed`,
      detail:
        'We cannot check a date in the past. If the year is wrong, correct it and check again — that is the usual cause.',
      nextStep: 'Change the date and check again.',
    };
  }

  // Rule 2 — further out than the diary opens.
  if (leadTimeDays > 730) {
    return {
      ...shared,
      status: 'available',
      headline: `${formattedDate} is open`,
      detail:
        'The diary is not open more than two years ahead, so nothing is committed yet. It is still worth having the consultation now: the plan and the preparation schedule are useful long before a date is held.',
      nextStep: 'Book a consultation and we will hold the conversation, not the date.',
    };
  }

  // Rule 3 — peak-season weekend.
  if (isPeakSeason && isWeekend) {
    return {
      ...shared,
      status: 'limited',
      headline: `${formattedDate} is a peak-season weekend`,
      detail:
        functionCount > 2
          ? 'November to February weekends fill first, and a wedding of this size needs two artists. Both may already be committed on this date. We will tell you which artists are genuinely free before you decide anything.'
          : 'November to February weekends fill first. Your lead artist may already be committed on this date, in which case we will say which artist is free rather than quietly substituting one.',
      nextStep: 'Book a consultation early — this is the date range worth deciding sooner.',
    };
  }

  // Rule 4 — everything else.
  return {
    ...shared,
    status: 'available',
    headline: `${formattedDate} looks open`,
    detail:
      leadTimeDays < 45
        ? 'This date is close. A trial six weeks out is not possible, so we would schedule it as early as the calendar allows and keep preparation minimal rather than rushed.'
        : 'This is outside the peak weekend crush, so there is room to plan properly: trial about six weeks out, preparation scheduled backwards from your first function.',
    nextStep: 'Book a consultation to confirm the artist and the figure.',
  };
}
