import { z } from 'zod';

import { optionalText, text } from './sanitize';

/**
 * The wedding-date check — five fields (brief §15, docs/UX_SPEC.md §5).
 *
 * This exact schema is used in the browser and again in the route handler. The
 * client copy exists to give fast, field-level feedback; the server copy is the
 * one that decides anything. Nothing validated here is trusted from the client
 * (docs/SECURITY_SPEC.md §2).
 */

/** `YYYY-MM-DD`, and a real calendar date — `2027-02-31` is rejected. */
export const isoDate = z
  .string({ error: 'Enter your wedding date.' })
  .trim()
  .pipe(z.iso.date({ error: 'Enter the date as YYYY-MM-DD.' }))
  .refine(
    (value) => {
      const [year, month, day] = value.split('-').map(Number) as [number, number, number];
      const parsed = new Date(Date.UTC(year, month - 1, day));
      return (
        parsed.getUTCFullYear() === year &&
        parsed.getUTCMonth() === month - 1 &&
        parsed.getUTCDate() === day
      );
    },
    { error: 'That date does not exist. Check the day and month.' },
  )
  .refine((value) => Number(value.slice(0, 4)) <= 2100, {
    error: 'Enter a wedding date within the next few years.',
  });

export const PACKAGE_PREFERENCES = [
  'essential-bride',
  'signature-bride',
  'atelier-experience',
  'not-sure',
] as const;

export const DATE_FLEXIBILITY = ['fixed', 'few-days', 'exploring'] as const;

export const availabilitySchema = z.object({
  weddingDate: isoDate,
  city: text({
    min: 2,
    max: 60,
    required: 'Enter the city your wedding is in.',
    tooShort: 'That city name looks too short.',
    tooLong: 'Keep the city name under 60 characters.',
  }),
  functionCount: z.coerce
    .number({ error: 'Choose how many functions you need covered.' })
    .int({ error: 'Enter a whole number of functions.' })
    .min(1, { error: 'There has to be at least one function.' })
    .max(8, { error: 'For more than eight functions, please enquire directly.' }),
  packagePreference: z.enum(PACKAGE_PREFERENCES, {
    error: 'Choose a package, or select that you are not sure yet.',
  }),
  dateFlexibility: z.enum(DATE_FLEXIBILITY, {
    error: 'Tell us how fixed the date is.',
  }),
});

export type AvailabilityInput = z.infer<typeof availabilitySchema>;

/**
 * The wire shape. `honeypot` must be empty and `renderedAt` is used to reject
 * submissions faster than a human could type (docs/SECURITY_SPEC.md §4).
 */
export const availabilityRequestSchema = availabilitySchema.extend({
  honeypot: optionalText(200, 'Unexpected value.').optional(),
  renderedAt: z.coerce.number().int().nonnegative().optional(),
});

export type AvailabilityRequest = z.infer<typeof availabilityRequestSchema>;
