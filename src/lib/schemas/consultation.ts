import { z } from 'zod';

import { todayIso } from '@/lib/utils';

import { PACKAGE_PREFERENCES, isoDate } from './availability';
import { optionalMultiline, optionalText, text } from './sanitize';

/**
 * The bridal consultation request — eleven fields (brief §16, docs/UX_SPEC.md §5).
 *
 * There is deliberately no consent checkbox. Nothing is stored durably, nothing
 * is shared, and no marketing list exists, so a tick-box would be friction that
 * protects nobody. What the endpoint does with the submission is stated in plain
 * language beside the submit button and in full on `/privacy`
 * (docs/PSYCHOLOGY_SPEC.md §3, docs/SECURITY_SPEC.md §7).
 */

export const WEDDING_FUNCTIONS = [
  'engagement',
  'haldi',
  'mehendi',
  'sangeet',
  'ceremony',
  'reception',
  'other',
] as const;

export const ARTIST_PREFERENCES = [
  'ananya-mehta',
  'rhea-kapoor',
  'meera-shah',
  'no-preference',
] as const;

export const HOW_HEARD_OPTIONS = [
  'instagram',
  'search',
  'referral',
  'wedding-planner',
  'venue',
  'other',
] as const;

/**
 * A wedding date that has not already happened. `todayIso()` is called at parse
 * time rather than at module load, so a long-running server does not keep
 * yesterday's idea of "today". ISO date strings compare lexicographically in
 * chronological order, which is why a plain `>=` is correct here.
 */
const futureIsoDate = isoDate.refine((value) => value >= todayIso(), {
  error: 'That date has already passed. Check the year.',
});

export const consultationSchema = z.object({
  fullName: text({
    min: 2,
    max: 80,
    required: 'Enter your name.',
    tooShort: 'Enter your full name.',
    tooLong: 'Keep your name under 80 characters.',
  }),
  email: z
    .string({ error: 'Enter an email address we can reply to.' })
    .max(320, { error: 'That email address is too long.' })
    .transform((value) => value.trim().normalize('NFKC'))
    .pipe(z.email({ error: 'That does not look like an email address.' }))
    .transform((value) => value.toLowerCase()),
  phone: z
    .string({ error: 'Enter a phone number.' })
    .max(40, { error: 'That phone number is too long.' })
    .transform((value) => value.replace(/[^\d+]/g, ''))
    .pipe(
      z
        .string()
        .regex(/^\+?\d{7,15}$/, {
          error: 'Enter a phone number with 7 to 15 digits, optionally starting with +.',
        }),
    ),
  weddingDate: futureIsoDate,
  city: text({
    min: 2,
    max: 60,
    required: 'Enter the city your wedding is in.',
    tooLong: 'Keep the city name under 60 characters.',
  }),
  venue: optionalText(120, 'Keep the venue under 120 characters.'),
  packagePreference: z.enum(PACKAGE_PREFERENCES, {
    error: 'Choose a package, or select that you are not sure yet.',
  }),
  functions: z
    .array(z.enum(WEDDING_FUNCTIONS), { error: 'Choose the functions you need covered.' })
    .min(1, { error: 'Choose at least one function.' })
    .max(WEDDING_FUNCTIONS.length, { error: 'That is more functions than exist.' })
    // A checkbox group can post the same value twice if the DOM is tampered
    // with; de-duplicating here keeps the stored record honest.
    .transform((values) => [...new Set(values)]),
  artistPreference: z.enum(ARTIST_PREFERENCES, {
    error: 'Choose an artist, or select no preference.',
  }),
  howHeard: z.enum(HOW_HEARD_OPTIONS, { error: 'Tell us how you found the studio.' }),
  message: optionalMultiline(1500, 'Keep your message under 1500 characters.'),
});

export type ConsultationInput = z.infer<typeof consultationSchema>;

/**
 * The wire shape. Three fields exist purely as bot friction and never reach the
 * stored record (docs/SECURITY_SPEC.md §4):
 *
 *  - `honeypot` is a visually hidden field a human never fills.
 *  - `renderedAt` is a client timestamp; a submission under three seconds old is
 *    rejected, because nobody types eleven fields that fast.
 *  - `idempotencyKey` is generated once per mounted form, so a double-click or a
 *    retried request cannot create a second request record.
 */
export const consultationRequestSchema = consultationSchema.extend({
  honeypot: optionalText(200, 'Unexpected value.').optional(),
  renderedAt: z.coerce.number().int().nonnegative().optional(),
  idempotencyKey: z.uuid({ error: 'Reload the form and try again.' }),
});

export type ConsultationRequest = z.infer<typeof consultationRequestSchema>;
