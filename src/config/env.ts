import { z } from 'zod';

/**
 * Environment configuration, parsed and validated exactly once.
 *
 * Rules this module enforces (docs/SECURITY_SPEC.md §5):
 *  - Every `process.env.NEXT_PUBLIC_*` lookup is written as a literal member
 *    expression, because that is what the bundler statically replaces. Reading
 *    them through a computed key would silently yield `undefined` in the browser.
 *  - An empty string means "not configured", not "configured as empty".
 *  - An invalid value fails the build with the variable's name, rather than
 *    degrading into a broken URL or a fake phone number at runtime.
 *  - No secret has a default. Nothing here is logged.
 */

const blankToNull = (value: string | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
};

const optionalUrl = z
  .union([z.url({ protocol: /^https?$/ }), z.null()])
  .transform((value) => (value ? value.replace(/\/+$/, '') : null));

/** Digits only, with the country code, as `wa.me` requires. */
const whatsappNumber = z.union([z.string().regex(/^[1-9]\d{7,14}$/), z.null()]);

/** Display form of a phone number: digits plus the usual separators. */
const displayPhone = z.union([z.string().regex(/^\+?[\d\s()-]{7,24}$/), z.null()]);

const schema = z.object({
  siteUrl: z
    .url({ protocol: /^https?$/ })
    .transform((value) => value.replace(/\/+$/, '')),
  isIndexable: z.boolean(),
  whatsappNumber,
  phone: displayPhone,
  email: z.union([z.email().max(160), z.null()]),
  studioAddress: z.union([z.string().min(4).max(200), z.null()]),
  studioCity: z.union([z.string().min(2).max(80), z.null()]),
  studioRegion: z.union([z.string().min(2).max(80), z.null()]),
  studioPostalCode: z.union([z.string().min(3).max(16), z.null()]),
  instagramUrl: optionalUrl,
  pinterestUrl: optionalUrl,
});

const parsed = schema.safeParse({
  siteUrl: blankToNull(process.env.NEXT_PUBLIC_SITE_URL) ?? 'http://localhost:3000',
  isIndexable: blankToNull(process.env.NEXT_PUBLIC_SITE_INDEXABLE) === 'true',
  whatsappNumber: blankToNull(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),
  phone: blankToNull(process.env.NEXT_PUBLIC_PHONE),
  email: blankToNull(process.env.NEXT_PUBLIC_EMAIL),
  studioAddress: blankToNull(process.env.NEXT_PUBLIC_STUDIO_ADDRESS),
  studioCity: blankToNull(process.env.NEXT_PUBLIC_STUDIO_CITY),
  studioRegion: blankToNull(process.env.NEXT_PUBLIC_STUDIO_REGION),
  studioPostalCode: blankToNull(process.env.NEXT_PUBLIC_STUDIO_POSTAL_CODE),
  instagramUrl: blankToNull(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
  pinterestUrl: blankToNull(process.env.NEXT_PUBLIC_PINTEREST_URL),
});

const ENV_VAR_NAMES: Record<string, string> = {
  siteUrl: 'NEXT_PUBLIC_SITE_URL',
  isIndexable: 'NEXT_PUBLIC_SITE_INDEXABLE',
  whatsappNumber: 'NEXT_PUBLIC_WHATSAPP_NUMBER',
  phone: 'NEXT_PUBLIC_PHONE',
  email: 'NEXT_PUBLIC_EMAIL',
  studioAddress: 'NEXT_PUBLIC_STUDIO_ADDRESS',
  studioCity: 'NEXT_PUBLIC_STUDIO_CITY',
  studioRegion: 'NEXT_PUBLIC_STUDIO_REGION',
  studioPostalCode: 'NEXT_PUBLIC_STUDIO_POSTAL_CODE',
  instagramUrl: 'NEXT_PUBLIC_INSTAGRAM_URL',
  pinterestUrl: 'NEXT_PUBLIC_PINTEREST_URL',
};

if (!parsed.success) {
  const lines = parsed.error.issues.map((issue) => {
    const key = String(issue.path[0] ?? '');
    return `  ${ENV_VAR_NAMES[key] ?? key}: ${issue.message}`;
  });
  // The value itself is deliberately not included in the message.
  throw new Error(
    `Invalid environment configuration. See .env.example.\n${lines.join('\n')}`,
  );
}

export const env = Object.freeze(parsed.data);

export type Env = typeof env;
