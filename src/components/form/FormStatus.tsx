'use client';

import { cn } from '@/lib/cn';
import { Alert } from '@/components/feedback/Alert';
import { Spinner } from '@/components/feedback/Spinner';

import type { ReactNode } from 'react';
import type { ApiErrorBody } from '@/lib/api';
import type { FormStatus } from '@/hooks/useValidatedForm';

/**
 * The form's own status region (brief §34 — *never silently fail*).
 *
 * It is rendered unconditionally, even when idle, and it is empty in that state.
 * That is the whole trick: an `aria-live` region has to exist in the DOM *before*
 * the message appears, or the insertion is not announced. A status block that is
 * conditionally mounted along with its first message is silent exactly when it
 * matters (docs/ACCESSIBILITY_SPEC.md §5).
 *
 * Field-level problems are not repeated here — `ErrorSummary` owns those. This
 * region carries the things that are not about one field: the network being
 * unreachable, a rate limit, a server fault, and success.
 */

export interface FormStatusProps {
  readonly status: FormStatus;
  readonly error: ApiErrorBody | null;
  /** Announced while submitting: "Sending your enquiry". */
  readonly busyLabel: string;
  /** Rendered on success; usually a heading plus the reference number. */
  readonly success?: ReactNode;
  readonly className?: string;
}

/** A retry-after in seconds, said the way a person would say it. */
function retryPhrase(seconds: number | undefined): string | null {
  if (!seconds || seconds <= 0) return null;
  if (seconds < 60) return `Please try again in about ${seconds} seconds.`;
  const minutes = Math.ceil(seconds / 60);
  return `Please try again in about ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}.`;
}

export function FormStatus({
  status,
  error,
  busyLabel,
  success,
  className,
}: FormStatusProps) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className={cn('min-h-0', className)}
    >
      {status === 'submitting' ? (
        <p className="flex items-center gap-3 text-body-sm text-espresso-700">
          <Spinner label={busyLabel} silent />
          <span>{busyLabel}…</span>
        </p>
      ) : null}

      {status === 'success' && success ? success : null}

      {/* A field-level 400 is shown by ErrorSummary; anything else lands here. */}
      {status === 'error' && error && error.code !== 'invalid' ? (
        <Alert
          tone={error.code === 'rate_limited' ? 'warning' : 'danger'}
          title={
            error.code === 'rate_limited'
              ? 'That is a few more attempts than we expected.'
              : 'We could not send that.'
          }
        >
          <p>{error.message}</p>
          {retryPhrase(error.retryAfterSeconds) ? (
            <p className="mt-1">{retryPhrase(error.retryAfterSeconds)}</p>
          ) : null}
          {error.requestId ? (
            <p className="mt-2 text-body-xs text-stone-500">
              Reference for the studio: {error.requestId}
            </p>
          ) : null}
        </Alert>
      ) : null}
    </div>
  );
}
