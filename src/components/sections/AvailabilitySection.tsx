'use client';

import { useState } from 'react';

import { ResultCard } from '@/components/feedback';
import {
  DateInput,
  ErrorSummary,
  Field,
  FormStatus,
  Honeypot,
  RadioCardGroup,
  Select,
  TextInput,
} from '@/components/form';
import { Button, Container, Section, SectionHeading } from '@/components/primitives';
import { useValidatedForm } from '@/hooks/useValidatedForm';
import { availabilitySchema } from '@/lib/schemas';
import { track } from '@/lib/analytics';
import { todayIso } from '@/lib/utils';

import type { SectionCopy, SectionGround } from './types';
import type { FormEvent } from 'react';
import type { AvailabilitySuccess } from '@/lib/api';
import type { AvailabilityInput } from '@/lib/schemas';

/**
 * The wedding-date check (brief §15, docs/UX_SPEC.md §4–§5).
 *
 * This is the low-commitment ask, and it sits before the consultation form for
 * exactly that reason: five fields, no name, no phone number, nothing that feels
 * like being put on a list. What comes back is a `ResultCard` whose last line
 * always says the answer came from season and day-of-week rules rather than a
 * live diary — a fictional studio has no bookings to look up, and a confident
 * "2 slots left" would be fabricated scarcity (docs/PSYCHOLOGY_SPEC.md §6,
 * docs/DECISION_LOG.md D6).
 *
 * Three things about the state handling are deliberate:
 *
 *  - **The form stays on screen under the result.** A check is something a bride
 *    does two or three times — her date, then her sister's suggestion, then the
 *    Friday instead of the Sunday. Replacing the form with the answer would make
 *    the second check a page reload.
 *  - **Both error surfaces are rendered.** `FormStatus` deliberately ignores
 *    `code === 'invalid'` because `ErrorSummary` owns field-level messages; a
 *    form that renders only one of the two is silent for one whole class of
 *    failure (brief §34).
 *  - **No idempotency key.** `availabilityRequestSchema` has no such field:
 *    checking a date creates nothing, so there is nothing to deduplicate. The
 *    in-flight ref in `useValidatedForm` still drops a double-click.
 *
 * `availability_checked` carries the outcome, the month and whether the date is a
 * weekend — never the date itself, the city, or anything else identifying
 * (docs/ANALYTICS_SPEC.md §3).
 */

export interface AvailabilitySectionProps {
  readonly copy: SectionCopy;
  /** Package labels for the radio group, in display order. */
  readonly packageOptions: readonly { readonly value: string; readonly label: string; readonly meta?: string }[];
  /** Where the "Continue to consultation" button goes. */
  readonly consultationHref?: string;
  readonly tone?: SectionGround;
  readonly id?: string;
}

const HEADING_ID = 'availability-heading';

/** Screen order, which is also the order errors are listed in. */
const FIELD_ORDER = [
  'weddingDate',
  'city',
  'functionCount',
  'packagePreference',
  'dateFlexibility',
] as const;

const FIELD_LABELS = {
  weddingDate: 'Wedding date',
  city: 'Wedding city',
  functionCount: 'Functions to cover',
  packagePreference: 'Package you have in mind',
  dateFlexibility: 'How fixed the date is',
} as const satisfies Readonly<Record<string, string>>;

const FUNCTION_COUNTS = [
  { value: '1', label: 'One function' },
  { value: '2', label: 'Two functions' },
  { value: '3', label: 'Three functions' },
  { value: '4', label: 'Four functions' },
  { value: '5', label: 'Five functions' },
  { value: '6', label: 'Six functions' },
  { value: '7', label: 'Seven functions' },
  { value: '8', label: 'Eight functions' },
] as const;

const FLEXIBILITY_OPTIONS = [
  {
    value: 'fixed',
    label: 'The date is set',
    description: 'Venue booked, invitations either sent or about to be.',
  },
  {
    value: 'few-days',
    label: 'Within a few days either side',
    description: 'The weekend is decided; the exact day is still movable.',
  },
  {
    value: 'exploring',
    label: 'Still choosing',
    description: 'You are comparing dates and want to know which ones are easier.',
  },
] as const;

interface Values {
  weddingDate: string;
  city: string;
  functionCount: string;
  packagePreference: string;
  dateFlexibility: string;
  honeypot: string;
}

const EMPTY: Values = {
  weddingDate: '',
  city: '',
  functionCount: '',
  packagePreference: '',
  dateFlexibility: '',
  honeypot: '',
};

export function AvailabilitySection({
  copy,
  packageOptions,
  consultationHref = '/book#consultation',
  tone = 'inset',
  id = 'availability',
}: AvailabilitySectionProps) {
  const [values, setValues] = useState<Values>(EMPTY);

  const form = useValidatedForm<AvailabilityInput, AvailabilitySuccess>({
    schema: availabilitySchema,
    endpoint: '/api/availability',
    onSuccess: (result) => {
      track('availability_checked', {
        status: result.status,
        // The month alone, so seasonality is measurable without the date being
        // recoverable from the event stream.
        month: Number(values.weddingDate.slice(5, 7)) || 0,
        is_weekend: result.isWeekend,
      });
    },
  });

  function set<K extends keyof Values>(key: K, value: Values[K]): void {
    setValues((current) => ({ ...current, [key]: value }));
    form.clearFieldError(key);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    void form.submit({
      ...values,
      // An untouched `<select>` holds `''`, and `Number('')` is `0` — which is a
      // valid number, so Zod would answer "there has to be at least one
      // function" instead of "choose how many". Sending nothing instead makes it
      // a missing field, which is what it actually is. `JSON.stringify` drops the
      // key too, so the server sees the same thing the client validated.
      functionCount: values.functionCount === '' ? undefined : values.functionCount,
    });
  }

  return (
    <Section id={id} tone={tone} labelledBy={HEADING_ID}>
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col gap-6 lg:col-span-5">
          <SectionHeading id={HEADING_ID} eyebrow={copy.eyebrow} lead={copy.intro} size="md">
            {copy.heading}
          </SectionHeading>

          {/* Said before the form rather than after the answer: what this check
              is and is not, so nobody reads the result as a held date. */}
          <dl className="flex flex-col gap-4 border-t border-sand-400 pt-6 text-body-sm">
            <div className="flex flex-col gap-1">
              <dt className="font-medium text-espresso-900">What you get back</dt>
              <dd className="text-espresso-700">
                Whether your date sits in the peak-season crush, and what that means for artist
                choice. Answered on this page, in one step.
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="font-medium text-espresso-900">What it is not</dt>
              <dd className="text-espresso-700">
                A held date. Nothing is reserved and no payment is taken here — a coordinator
                confirms the actual slot after the consultation.
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-7">
          <form noValidate onSubmit={onSubmit} className="flex flex-col gap-6">
            <ErrorSummary
              errors={form.fieldErrors}
              order={FIELD_ORDER}
              labels={FIELD_LABELS}
              submitCount={form.submitCount}
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field
                name="weddingDate"
                label={FIELD_LABELS.weddingDate}
                required
                hint="As YYYY-MM-DD. If the exact day is not settled, use the one you are leaning towards."
                error={form.fieldErrors.weddingDate}
              >
                {(props) => (
                  <DateInput
                    {...props}
                    value={values.weddingDate}
                    // A courtesy on the picker, not a gate: `availabilitySchema`
                    // accepts a past date on purpose, so the "already passed —
                    // check the year" result stays reachable for the case that
                    // actually produces it, a wrong year typed straight in.
                    min={todayIso()}
                    max="2100-12-31"
                    autoComplete="off"
                    enterKeyHint="next"
                    invalid={Boolean(form.fieldErrors.weddingDate)}
                    onChange={(event) => set('weddingDate', event.target.value)}
                  />
                )}
              </Field>

              <Field
                name="city"
                label={FIELD_LABELS.city}
                required
                hint="The city the wedding is in, not where you live now."
                error={form.fieldErrors.city}
              >
                {(props) => (
                  <TextInput
                    {...props}
                    value={values.city}
                    placeholder="Jaipur"
                    autoComplete="address-level2"
                    enterKeyHint="next"
                    invalid={Boolean(form.fieldErrors.city)}
                    onChange={(event) => set('city', event.target.value)}
                  />
                )}
              </Field>
            </div>

            <Field
              name="functionCount"
              label={FIELD_LABELS.functionCount}
              required
              hint="Count every function you want an artist for, including the ceremony."
              error={form.fieldErrors.functionCount}
              className="sm:max-w-xs"
            >
              {(props) => (
                <Select
                  {...props}
                  value={values.functionCount}
                  options={FUNCTION_COUNTS}
                  placeholder="Choose a number"
                  invalid={Boolean(form.fieldErrors.functionCount)}
                  onChange={(event) => set('functionCount', event.target.value)}
                />
              )}
            </Field>

            <RadioCardGroup
              name="packagePreference"
              legend={FIELD_LABELS.packagePreference}
              hint="Only so the answer is specific to your wedding. Nothing is committed by choosing one."
              required
              columns={2}
              options={packageOptions}
              value={values.packagePreference}
              error={form.fieldErrors.packagePreference}
              onChange={(next) => set('packagePreference', next)}
            />

            <RadioCardGroup
              name="dateFlexibility"
              legend={FIELD_LABELS.dateFlexibility}
              required
              options={FLEXIBILITY_OPTIONS}
              value={values.dateFlexibility}
              error={form.fieldErrors.dateFlexibility}
              onChange={(next) => set('dateFlexibility', next)}
            />

            <Honeypot value={values.honeypot} onChange={(next) => set('honeypot', next)} />

            <div className="flex flex-col gap-4 border-t border-sand-400 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="submit"
                size="lg"
                loading={form.isSubmitting}
                loadingLabel="Checking your date"
                className="sm:w-auto"
                fullWidth
              >
                {form.status === 'success' ? 'Check another date' : 'Check this date'}
              </Button>
              <p className="text-body-xs text-stone-500 sm:max-w-[32ch] sm:text-end">
                No payment, no account, and nothing stored. This check leaves no record.
              </p>
            </div>

            <FormStatus
              status={form.status}
              error={form.formError}
              busyLabel="Checking your date"
            />
          </form>

          {/* Below the form, not instead of it: checking a second date is one
              field edit away rather than a fresh page. */}
          {form.status === 'success' && form.result ? (
            <ResultCard
              result={form.result}
              action={
                <>
                  <Button href={consultationHref} size="md">
                    Continue to consultation
                  </Button>
                  <Button href="/packages" variant="secondary" size="md">
                    See what each package covers
                  </Button>
                </>
              }
            />
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
