import 'server-only';

/**
 * Server-side request logging (docs/ANALYTICS_SPEC.md, docs/SECURITY_SPEC.md §7).
 *
 * One line per API request, as JSON, on a single `console` call. The field set is
 * fixed and deliberately narrow:
 *
 *   { requestId, route, status, durationMs, outcome }
 *
 * No submitted value ever appears in it — no name, email, phone, city or message.
 * That is not squeamishness: an operator reading logs to debug a 500 has no need
 * for a bride's phone number, and a log file is the easiest place for personal
 * data to end up somewhere nobody expected.
 *
 * Values that *are* interpolated have already been through
 * `src/lib/schemas/sanitize.ts`, which removes newlines and carriage returns, so
 * a caller cannot forge a second log entry by submitting one.
 */

export type RequestOutcome =
  | 'ok'
  | 'invalid'
  | 'rate-limited'
  | 'rejected-bot'
  | 'duplicate'
  | 'error';

export interface RequestLogFields {
  readonly requestId: string;
  readonly route: string;
  readonly status: number;
  readonly durationMs: number;
  readonly outcome: RequestOutcome;
}

export function logRequest(fields: RequestLogFields): void {
  const line = JSON.stringify({
    at: new Date().toISOString(),
    level: fields.status >= 500 ? 'error' : 'info',
    ...fields,
  });
  if (fields.status >= 500) {
    console.error(line);
  } else {
    console.info(line);
  }
}

/**
 * Log a thrown error without leaking its detail to the client.
 *
 * The message and stack go to the server log; the caller gets a request id and
 * nothing else. This is the split that lets a 500 be debuggable without turning
 * an internal path or a query into a response body.
 */
export function logException(requestId: string, route: string, error: unknown): void {
  console.error(
    JSON.stringify({
      at: new Date().toISOString(),
      level: 'error',
      requestId,
      route,
      outcome: 'error' satisfies RequestOutcome,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    }),
  );
}
