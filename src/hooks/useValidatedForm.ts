'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { z } from 'zod';
import type { ApiErrorBody, ApiResponse } from '@/lib/api';

/**
 * The shared submission engine for both forms (docs/UX_SPEC.md §5, brief §34).
 *
 * It exists because the availability check and the consultation request need
 * identical behaviour in six places that are easy to get subtly different:
 *
 *  1. **Validate on the client with the same schema the server uses.** The
 *     import comes from `src/lib/schemas`, so the two cannot disagree. Client
 *     validation is for speed of feedback only — the server never trusts it.
 *  2. **Duplicate-submission protection.** A submit while one is in flight is
 *     dropped by a ref, not by state, because two clicks inside one React batch
 *     would both see the old `status`. A stable `idempotencyKey` covers the
 *     harder case: a click that *did* reach the server, then a retry.
 *  3. **Every outcome is a state.** Network failure, 400, 429, 500 and success
 *     all land somewhere the UI renders. There is no path that returns to idle
 *     with nothing shown.
 *  4. **Errors are announced.** `submitCount` increments on each failed attempt
 *     so the error summary can re-focus even when the same errors repeat.
 *  5. **Field errors clear as the bride types**, rather than persisting under a
 *     corrected field until the next submit.
 *  6. **In-flight requests are abandoned on unmount** so a resolved fetch never
 *     calls `setState` on an unmounted form.
 */

export type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export interface FieldErrorMap {
  readonly [field: string]: string | undefined;
}

interface ParsableSchema<T> {
  safeParse(value: unknown): { success: true; data: T } | { success: false; error: z.ZodError };
}

export interface SubmissionFailure {
  /**
   * `null` only when the payload was rejected by the schema on this side with no
   * form-level issue — a caller must not report that as a server failure.
   */
  readonly error: ApiErrorBody | null;
  readonly fieldErrors: Readonly<Record<string, string>>;
}

export interface UseValidatedFormOptions<TValues, TResult> {
  readonly schema: ParsableSchema<TValues>;
  readonly endpoint: string;
  /**
   * Adds a per-form-instance UUID to the payload. Required by
   * `/api/consultation`; pointless for the availability check, which creates
   * nothing.
   */
  readonly idempotent?: boolean;
  readonly onSuccess?: (result: TResult) => void;
  /**
   * Called once per rejected attempt, at the moment the outcome is known.
   *
   * It exists so a caller can react to a failure — emit an analytics event, move
   * a multi-step form back to the step that owns the problem — without watching
   * `submitCount` from an effect. An effect would fire a render later, would need
   * its own guard against re-running, and would call `setState` from inside an
   * effect body for no reason: the event has a precise moment, and this is it.
   */
  readonly onFailure?: (failure: SubmissionFailure) => void;
}

export interface UseValidatedFormReturn<TResult> {
  readonly status: FormStatus;
  readonly isSubmitting: boolean;
  readonly fieldErrors: FieldErrorMap;
  readonly formError: ApiErrorBody | null;
  readonly result: TResult | null;
  /** Increments on every rejected attempt; a focus effect can depend on it. */
  readonly submitCount: number;
  readonly submit: (values: Record<string, unknown>) => Promise<void>;
  readonly clearFieldError: (field: string) => void;
  readonly reset: () => void;
}

const NETWORK_ERROR: ApiErrorBody = {
  code: 'network',
  message:
    'We could not reach the studio just now. Check your connection and try again — nothing has been sent.',
};

const MALFORMED_ERROR: ApiErrorBody = {
  code: 'server_error',
  message:
    'Something went wrong at our end. Please try again, or send us a message on WhatsApp instead.',
};

/** `crypto.randomUUID` is unavailable outside a secure context; the fallback only needs to be unique. */
function newKey(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  }
  // RFC 4122 version and variant bits, so the value still satisfies `z.uuid()`.
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function useValidatedForm<TValues, TResult>(
  options: UseValidatedFormOptions<TValues, TResult>,
): UseValidatedFormReturn<TResult> {
  const { schema, endpoint, idempotent = false, onSuccess, onFailure } = options;

  const [status, setStatus] = useState<FormStatus>('idle');
  const [fieldErrors, setFieldErrors] = useState<FieldErrorMap>({});
  const [formError, setFormError] = useState<ApiErrorBody | null>(null);
  const [result, setResult] = useState<TResult | null>(null);
  const [submitCount, setSubmitCount] = useState(0);

  const inFlight = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const keyRef = useRef<string | null>(null);
  /**
   * When the form became interactive. Set in an effect rather than from a
   * `useRef(Date.now())` initialiser, because reading the clock during render is
   * impure — the value would differ between the server render and hydration. Mount
   * is also the more honest zero point: it is when the bride could first type.
   */
  const renderedAtRef = useRef<number | null>(null);
  const onSuccessRef = useRef(onSuccess);
  const onFailureRef = useRef(onFailure);

  // Refs are written in an effect, not during render: a render must not mutate
  // anything, and `submit` cannot run before the first effect has flushed.
  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onFailureRef.current = onFailure;
  });

  useEffect(() => {
    renderedAtRef.current = Date.now();
  }, []);

  /** One place for the four ways a submission can be rejected. */
  const fail = useCallback((error: ApiErrorBody | null, fieldErrors: Record<string, string>) => {
    setFieldErrors(fieldErrors);
    setFormError(error);
    setStatus('error');
    setSubmitCount((n) => n + 1);
    onFailureRef.current?.({ error, fieldErrors });
  }, []);

  useEffect(
    () => () => {
      abortRef.current?.abort();
    },
    [],
  );

  const clearFieldError = useCallback((field: string) => {
    setFieldErrors((current) => {
      if (current[field] === undefined) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    inFlight.current = false;
    keyRef.current = null;
    renderedAtRef.current = Date.now();
    setStatus('idle');
    setFieldErrors({});
    setFormError(null);
    setResult(null);
  }, []);

  const submit = useCallback(
    async (values: Record<string, unknown>): Promise<void> => {
      if (inFlight.current) return;

      if (idempotent) keyRef.current ??= newKey();

      const payload: Record<string, unknown> = {
        ...values,
        // Elapsed milliseconds, not a timestamp: it tells the server how long the
        // form was on screen without revealing the visitor's clock. `null` is only
        // possible before the mount effect has run, which a submit cannot precede.
        renderedAt: Math.max(0, Date.now() - (renderedAtRef.current ?? Date.now())),
        ...(idempotent ? { idempotencyKey: keyRef.current } : {}),
      };

      const parsed = schema.safeParse(payload);
      if (!parsed.success) {
        // Walked issue by issue rather than through `z.flattenError`, for two
        // reasons: the first issue per field wins (a "required" message is more
        // useful than a follow-on "too short"), and an issue on an array member
        // — `functions.0` — is attributed to the field the bride can actually
        // see, `functions`.
        const next: Record<string, string> = {};
        let topLevel: string | undefined;
        for (const issue of parsed.error.issues) {
          const field = issue.path[0];
          if (field === undefined) {
            topLevel ??= issue.message;
            continue;
          }
          const key = String(field);
          next[key] ??= issue.message;
        }
        fail(topLevel ? { code: 'invalid', message: topLevel } : null, next);
        return;
      }

      inFlight.current = true;
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setStatus('submitting');
      setFieldErrors({});
      setFormError(null);

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
          // No cookies exist, and sending credentials to an endpoint that needs
          // none is surface area for nothing.
          credentials: 'omit',
          cache: 'no-store',
        });

        let body: ApiResponse<TResult> | null = null;
        try {
          body = (await response.json()) as ApiResponse<TResult>;
        } catch {
          body = null;
        }

        if (body === null || typeof body !== 'object' || !('ok' in body)) {
          fail(MALFORMED_ERROR, {});
          return;
        }

        if (body.ok) {
          setResult(body.data);
          setStatus('success');
          // A new enquiry after a successful one must not be deduplicated
          // against the previous key.
          keyRef.current = null;
          onSuccessRef.current?.(body.data);
          return;
        }

        fail(body.error, { ...body.error.fieldErrors });
      } catch (error) {
        // An abort is a deliberate teardown, not a failure to report.
        if (error instanceof DOMException && error.name === 'AbortError') return;
        fail(NETWORK_ERROR, {});
      } finally {
        inFlight.current = false;
      }
    },
    [endpoint, fail, idempotent, schema],
  );

  return {
    status,
    isSubmitting: status === 'submitting',
    fieldErrors,
    formError,
    result,
    submitCount,
    submit,
    clearFieldError,
    reset,
  };
}
