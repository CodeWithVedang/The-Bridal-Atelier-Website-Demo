import 'server-only';

import { z } from 'zod';

/**
 * Server-only configuration. Importing this module from a Client Component is
 * a build error, which is the point: nothing here may reach the browser.
 *
 * `CONSULTATION_WEBHOOK_URL` is the documented integration seam for forwarding
 * a consultation request to a CRM or inbox. It is validated here and READ BUT
 * NEVER CALLED in this build — the brief requires that no external API is
 * connected unless required (docs/DECISION_LOG.md D12).
 */

const schema = z.object({
  consultationWebhookUrl: z.union([z.url({ protocol: /^https$/ }), z.null()]),
});

const raw = process.env.CONSULTATION_WEBHOOK_URL?.trim();

const parsed = schema.safeParse({
  consultationWebhookUrl: raw && raw.length > 0 ? raw : null,
});

if (!parsed.success) {
  // The value is never echoed: a webhook URL can itself carry a token.
  throw new Error(
    'Invalid CONSULTATION_WEBHOOK_URL: it must be an absolute https:// URL, or unset.',
  );
}

export const serverEnv = Object.freeze(parsed.data);

/** True when a forwarding target exists. Wiring the call is a one-function change. */
export const hasConsultationWebhook = serverEnv.consultationWebhookUrl !== null;
