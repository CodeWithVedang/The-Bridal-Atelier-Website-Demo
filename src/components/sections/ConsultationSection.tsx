'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

import {
  CheckboxGroup,
  DateInput,
  ErrorSummary,
  Field,
  FormStatus,
  Honeypot,
  RadioCardGroup,
  Select,
  StepProgress,
  TextArea,
  TextInput,
} from '@/components/form';
import { Button, Container, Rule, Section, SectionHeading, TextLink } from '@/components/primitives';
import { IconArrowRight, IconCheck } from '@/components/icons';
import { useValidatedForm } from '@/hooks/useValidatedForm';
import { consultationSchema } from '@/lib/schemas';
import { track } from '@/lib/analytics';
import { daysBetweenIso, formatIsoDate, todayIso } from '@/lib/utils';

import type { SectionCopy, SectionGround } from './types';
import type { FormEvent } from 'react';
import type { ConsultationSuccess } from '@/lib/api';
import type { ConsultationInput } from '@/lib/schemas';

/**
 * The consultation request — eleven fields over three steps (brief §16,
 * docs/UX_SPEC.md §3–§5).
 *
 * **Why three steps rather than one long form.** Eleven fields in a single column
 * is a page a bride scrolls once and abandons. Split by subject — her wedding,
 * then her, then what she wants — each screen is four fields and one question,
 * and the progress indicator says how much is left. The order is deliberate too:
 * the wedding first, because it is the part she is certain about, and her phone
 * number second, after she has already invested three answers.
 *
 * **Steps are a view, not a state machine.** Every value lives in one `values`
 * object for the whole form, so going back loses nothing and going forward again
 * re-renders what was already typed (docs/UX_SPEC.md §3: *steps are reversible,
 * nothing is lost on back-navigation*). Changing step changes which fields are
 * rendered and nothing else.
 *
 * **Validation runs against the whole schema, and is only *shown* per step.**
 * Advancing from step 1 parses all eleven fields and then filters the complaints
 * down to the four on screen — a step cannot be blocked by a field the bride
 * cannot see, and there is no second, subtly-different per-step schema to keep in
 * sync. The final submit shows everything and, if a problem belongs to an earlier
 * step, moves back to it: an error listed in the summary that links to a field
 * which is not rendered would be exactly the silent failure brief §34 forbids.
 *
 * **Success replaces the form.** Unlike the availability check — which a bride
 * runs two or three times — a consultation request is sent once, so the panel
 * takes over the column and receives focus. A live region is not enough here,
 * because a region that mounts together with its first message is frequently not
 * announced at all (docs/ACCESSIBILITY_SPEC.md §5).
 *
 * Nothing identifying reaches `track()`: the submitted event carries the package
 * slug, how many functions, and a lead time in days — never the name, the phone
 * number, the email, the city, the venue, the notes, or the date itself
 * (docs/ANALYTICS_SPEC.md §3).
 */

export interface ConsultationOption {
  readonly value: string;
  readonly label: string;
  readonly description?: string;
  readonly meta?: string;
}

export interface ConsultationSectionProps {
  readonly copy: SectionCopy;
  /** The three packages plus "not sure yet", in display order. */
  readonly packageOptions: readonly ConsultationOption[];
  /** The three artists plus "no preference", in display order. */
  readonly artistOptions: readonly ConsultationOption[];
  /** What happens to the submission, in one line. Usually the in-memory notice. */
  readonly note?: string;
  readonly tone?: SectionGround;
  readonly id?: string;
}

const HEADING_ID = 'consultation-heading';

/**
 * The three steps, their labels, and the fields each one owns.
 *
 * This array is the single source for the progress indicator, for which fields
 * render, for which errors block an advance, and for which step a failed submit
 * returns to. Adding a field means adding it here, which is what stops a field
 * existing in the schema but on no step.
 */
const STEPS = [
  {
    label: 'About the wedding',
    question: 'When and where is it?',
    fields: ['weddingDate', 'city', 'venue', 'functions'],
  },
  {
    label: 'About you',
    question: 'How should we reach you?',
    fields: ['fullName', 'email', 'phone'],
  },
  {
    label: 'What you are looking for',
    question: 'What do you have in mind?',
    fields: ['packagePreference', 'artistPreference', 'howHeard', 'message'],
  },
] as const satisfies readonly {
  readonly label: string;
  readonly question: string;
  readonly fields: readonly string[];
}[];

/** Screen order across all three steps — also the order the summary lists in. */
const FIELD_ORDER = STEPS.flatMap((step) => step.fields);

/** The progress indicator wants labels only. */
const STEP_LABELS = STEPS.map((step) => step.label);

const FIELD_LABELS = {
  weddingDate: 'Wedding date',
  city: 'Wedding city',
  venue: 'Venue',
  functions: 'Functions to cover',
  fullName: 'Your name',
  email: 'Email',
  phone: 'Phone',
  packagePreference: 'Package you have in mind',
  artistPreference: 'Artist preference',
  howHeard: 'How you found the studio',
  message: 'Anything else',
} as const satisfies Readonly<Record<string, string>>;

/**
 * Labels for `WEDDING_FUNCTIONS`. Kept here rather than in a content module
 * because these are the schema's own vocabulary — renaming one is a validation
 * change, not an editorial one.
 */
const FUNCTION_OPTIONS = [
  { value: 'engagement', label: 'Engagement' },
  { value: 'haldi', label: 'Haldi' },
  { value: 'mehendi', label: 'Mehendi' },
  { value: 'sangeet', label: 'Sangeet' },
  { value: 'ceremony', label: 'Wedding ceremony' },
  { value: 'reception', label: 'Reception' },
  { value: 'other', label: 'Something else', hint: 'Tell us which in the last step.' },
] as const;

const HOW_HEARD_LABELS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'search', label: 'A search engine' },
  { value: 'referral', label: 'Someone recommended us' },
  { value: 'wedding-planner', label: 'My wedding planner' },
  { value: 'venue', label: 'My venue' },
  { value: 'other', label: 'Somewhere else' },
] as const;

interface Values {
  fullName: string;
  email: string;
  phone: string;
  weddingDate: string;
  city: string;
  venue: string;
  packagePreference: string;
  functions: readonly string[];
  artistPreference: string;
  howHeard: string;
  message: string;
  honeypot: string;
}

const EMPTY: Values = {
  fullName: '',
  email: '',
  phone: '',
  weddingDate: '',
  city: '',
  venue: '',
  packagePreference: '',
  functions: [],
  artistPreference: '',
  howHeard: '',
  message: '',
  honeypot: '',
};

const MESSAGE_MAX = 1500;

/**
 * What happens after Send, said before it is pressed.
 *
 * A form that ends at a button asks the bride to guess what she has started.
 * These three lines are the same promise the hero makes ("a coordinator replies
 * with the next available slots") and the closing band makes ("you are not asked
 * to book anything in that meeting"), stated where the commitment is actually
 * being made (docs/PSYCHOLOGY_SPEC.md §4).
 */
const WHAT_HAPPENS = [
  {
    title: 'A coordinator reads it',
    detail:
      'Your date and your functions are checked against the artists’ diary before anyone replies, so the answer you get is real.',
  },
  {
    title: 'You get times and a recommendation',
    detail:
      'Two or three consultation slots, and which package actually fits the wedding you have described.',
  },
  {
    title: 'Then the consultation itself',
    detail:
      'Forty-five minutes, in the studio or on a call. Nothing is booked in that meeting and no payment is taken.',
  },
] as const;


/** First issue per field wins: "required" is more useful than a follow-on "too short". */
function collectErrors(values: Values): Readonly<Record<string, string>> {
  const parsed = consultationSchema.safeParse(values);
  if (parsed.success) return {};

  const out: Record<string, string> = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0];
    if (key === undefined) continue;
    out[String(key)] ??= issue.message;
  }
  return out;
}

/**
 * What to show for a set of fields: the client-side complaint if there is one,
 * otherwise the server's.
 *
 * Scoped to `fields` deliberately. `ErrorSummary` renders each entry as a link to
 * `#field-<name>`, so an entry for a field the current step does not render would
 * link to nothing — the silent failure brief §34 forbids. Every caller therefore
 * passes the fields actually on screen, and the submit handler moves to the step
 * that owns the earliest problem rather than listing it from a distance.
 */
function visible(
  local: Readonly<Record<string, string>>,
  server: Readonly<Record<string, string | undefined>>,
  fields: readonly string[],
): Readonly<Record<string, string>> {
  const out: Record<string, string> = {};
  for (const field of fields) {
    const message = local[field] ?? server[field];
    if (message) out[field] = message;
  }
  return out;
}

export function ConsultationSection({
  copy,
  packageOptions,
  artistOptions,
  note,
  tone = 'ivory',
  id = 'consultation',
}: ConsultationSectionProps) {
  const pathname = usePathname();

  const [values, setValues] = useState<Values>(EMPTY);
  const [step, setStep] = useState(1);
  /** Client-side complaints, shown only after an attempt to move on. */
  const [localErrors, setLocalErrors] = useState<Readonly<Record<string, string>>>({});
  /** Failed step-validations, added to the hook's count so the summary re-focuses. */
  const [attempts, setAttempts] = useState(0);

  const startedRef = useRef(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const form = useValidatedForm<ConsultationInput, ConsultationSuccess>({
    schema: consultationSchema,
    endpoint: '/api/consultation',
    // A consultation request creates something, and a bride who taps twice on a
    // flaky connection must not end up in the diary twice.
    idempotent: true,
    onSuccess: (result) => {
      // "201 received" (docs/ANALYTICS_SPEC.md §2). A duplicate answers 200 and
      // is the same enquiry arriving twice, not a second conversion.
      if (result.duplicate) return;
      track('consultation_submitted', {
        package_interest: values.packagePreference,
        service_count: values.functions.length,
        // A derived integer, explicitly sanctioned by docs/ANALYTICS_SPEC.md §3 —
        // unlike the date it is derived from, which never leaves the form.
        lead_time_days: Math.max(0, daysBetweenIso(todayIso(), values.weddingDate)),
      });
    },
    onFailure: ({ error, fieldErrors }) => {
      // Every attempt is pre-validated below, so reaching here means the network
      // or the server answered — which is what makes `consultation_failed` mean
      // "non-2xx received" (docs/ANALYTICS_SPEC.md §2). A `null` error would mean
      // the hook rejected the payload itself; reporting that as a server failure
      // would be a lie in the funnel, so it is skipped rather than guessed at.
      if (error) track('consultation_failed', { code: error.code });

      // If the problem belongs to an earlier step, go there. An error listed in
      // the summary that links to a field which is not rendered is exactly the
      // silent failure brief §34 forbids.
      const failing = STEPS.findIndex((entry) =>
        entry.fields.some((field) => fieldErrors[field]),
      );
      if (failing >= 0) setStep(failing + 1);
    },
  });

  const current = STEPS[step - 1];
  const isLast = step === STEPS.length;
  const shown = visible(localErrors, form.fieldErrors, current.fields);
  const succeeded = form.status === 'success' && form.result !== null;

  /**
   * Focus the confirmation, rather than trusting a live region.
   *
   * The panel replaces the form, so it mounts at the same moment as its first
   * message — and a live region that appears together with its content is
   * frequently not announced at all. Moving focus is the reliable mechanism, and
   * it is also where a sighted bride is looking (docs/ACCESSIBILITY_SPEC.md §5).
   */
  useEffect(() => {
    if (!succeeded) return;
    panelRef.current?.focus();
  }, [succeeded]);

  /** `consultation_started` fires on the first field change, not on mount. */
  function markStarted(): void {
    if (startedRef.current) return;
    startedRef.current = true;
    track('consultation_started', { entry_route: pathname });
  }

  function set<K extends keyof Values>(key: K, value: Values[K]): void {
    setValues((currentValues) => ({ ...currentValues, [key]: value }));
    form.clearFieldError(key);
    setLocalErrors((currentErrors) => {
      if (currentErrors[key] === undefined) return currentErrors;
      const next = { ...currentErrors };
      delete next[key];
      return next;
    });
    markStarted();
  }

  /**
   * Validate the whole schema, then show only what this step owns.
   *
   * One schema, filtered — not a second per-step schema that can drift from it.
   * A field the bride cannot see can therefore never block her.
   */
  function advance(): void {
    const blocking = visible(collectErrors(values), form.fieldErrors, current.fields);
    if (Object.keys(blocking).length > 0) {
      setLocalErrors(blocking);
      setAttempts((n) => n + 1);
      return;
    }
    setLocalErrors({});
    track('consultation_step_completed', { step });
    setStep((n) => Math.min(STEPS.length, n + 1));
  }

  function back(): void {
    setStep((n) => Math.max(1, n - 1));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (!isLast) {
      advance();
      return;
    }

    const all = collectErrors(values);
    const failing = STEPS.findIndex((entry) => entry.fields.some((field) => all[field]));
    if (failing >= 0) {
      setLocalErrors(all);
      setAttempts((n) => n + 1);
      setStep(failing + 1);
      return;
    }

    setLocalErrors({});
    // Sent as typed, including `venue` and `message` as `''` when untouched:
    // `optionalText`/`optionalMultiline` begin with `z.string()` and normalise
    // blank to `null` themselves, so `undefined` would be rejected outright
    // rather than read as "not answered". `honeypot` rides along for the server's
    // `consultationRequestSchema`; the client's schema strips it.
    void form.submit({ ...values });
  }

  function startOver(): void {
    setValues(EMPTY);
    setStep(1);
    setLocalErrors({});
    setAttempts(0);
    // A second enquiry is a second conversion, so it gets its own `started` event.
    startedRef.current = false;
    form.reset();
  }

  return (
    <Section id={id} tone={tone} labelledBy={HEADING_ID}>
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col gap-6 lg:col-span-5">
          <SectionHeading id={HEADING_ID} eyebrow={copy.eyebrow} lead={copy.intro} size="md">
            {copy.heading}
          </SectionHeading>

          <Rule ornament className="max-w-24" />

          <ol className="flex flex-col gap-5">
            {WHAT_HAPPENS.map((item, index) => (
              <li key={item.title} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="font-display text-body-lg leading-none text-gold-600 tabular-nums"
                >
                  {`0${index + 1}`}
                </span>
                <div className="flex flex-col gap-1">
                  <p className="text-body-sm font-medium text-espresso-900">{item.title}</p>
                  <p className="text-body-sm text-espresso-700">{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="text-body-sm text-stone-500">
            Would rather talk it through first?{' '}
            <TextLink href="/contact">See how to reach the studio</TextLink>.
          </p>
        </div>

        <div className="lg:col-span-7">
          {succeeded && form.result ? (
            /* Focusable, and focused by the effect above — this panel replaces the
               form, so there is nowhere else for focus to sensibly be. */
            <div
              ref={panelRef}
              tabIndex={-1}
              className="flex flex-col gap-6 border border-success-700/40 bg-ivory-100 p-6 sm:p-8"
            >
              <span
                aria-hidden="true"
                className="grid size-11 place-items-center rounded-full bg-success-700/12 text-success-700"
              >
                <IconCheck className="size-5" />
              </span>

              <div className="flex flex-col gap-3">
                <h3 className="font-display text-display-sm leading-tight text-espresso-900">
                  {form.result.duplicate
                    ? 'We already have this enquiry'
                    : 'Your enquiry is with the studio'}
                </h3>
                <p className="text-body-md text-espresso-700">
                  {form.result.duplicate
                    ? 'This request had already reached us, so nothing was sent twice. The reference below is the original one.'
                    : form.result.nextStep}
                </p>
              </div>

              <dl className="flex flex-col gap-3 border-t border-sand-400 pt-6 text-body-sm">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <dt className="font-medium text-espresso-900">Your reference</dt>
                  <dd className="tracking-wider text-espresso-700 tabular-nums">
                    {form.result.reference}
                  </dd>
                </div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <dt className="font-medium text-espresso-900">Received</dt>
                  <dd className="text-espresso-700">
                    {formatIsoDate(form.result.receivedAt.slice(0, 10))}
                  </dd>
                </div>
              </dl>

              <p className="text-body-sm text-stone-500">
                Quote that reference if you message or call about this enquiry. It is the only
                thing you need — there is no account to log into.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button href="/portfolio" size="md">
                  Look at the portfolio while you wait
                </Button>
                <Button type="button" variant="ghost" size="md" onClick={startOver}>
                  Send another enquiry
                </Button>
              </div>
            </div>
          ) : (
            <form noValidate onSubmit={onSubmit} className="flex flex-col gap-7">
              <StepProgress steps={STEP_LABELS} current={step} />

              <ErrorSummary
                errors={shown}
                order={FIELD_ORDER}
                labels={FIELD_LABELS}
                submitCount={attempts + form.submitCount}
              />

              <div className="flex flex-col gap-6">
                <h3 className="font-display text-display-sm leading-tight text-espresso-900">
                  {current.question}
                </h3>

                {step === 1 ? (
                  <>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <Field
                        name="weddingDate"
                        label={FIELD_LABELS.weddingDate}
                        required
                        hint="As YYYY-MM-DD. The ceremony date, if there are several."
                        error={shown.weddingDate}
                      >
                        {(props) => (
                          <DateInput
                            {...props}
                            value={values.weddingDate}
                            // A real gate here, unlike the availability check:
                            // `consultationSchema` uses `futureIsoDate`, so a past
                            // date is invalid rather than merely unhelpful.
                            min={todayIso()}
                            max="2100-12-31"
                            autoComplete="off"
                            enterKeyHint="next"
                            invalid={Boolean(shown.weddingDate)}
                            onChange={(event) => set('weddingDate', event.target.value)}
                          />
                        )}
                      </Field>

                      <Field
                        name="city"
                        label={FIELD_LABELS.city}
                        required
                        hint="Where the wedding is, not where you live now."
                        error={shown.city}
                      >
                        {(props) => (
                          <TextInput
                            {...props}
                            value={values.city}
                            placeholder="Udaipur"
                            autoComplete="address-level2"
                            enterKeyHint="next"
                            invalid={Boolean(shown.city)}
                            onChange={(event) => set('city', event.target.value)}
                          />
                        )}
                      </Field>
                    </div>

                    <Field
                      name="venue"
                      label={FIELD_LABELS.venue}
                      hint="If it is booked. Travel and set-up time are planned from this."
                      error={shown.venue}
                    >
                      {(props) => (
                        <TextInput
                          {...props}
                          value={values.venue}
                          placeholder="The Leela Palace, or “still deciding”"
                          autoComplete="off"
                          enterKeyHint="next"
                          invalid={Boolean(shown.venue)}
                          onChange={(event) => set('venue', event.target.value)}
                        />
                      )}
                    </Field>

                    <CheckboxGroup
                      name="functions"
                      legend={FIELD_LABELS.functions}
                      hint="Every function you want an artist for. This is what decides the package, so an approximate answer is fine."
                      required
                      options={FUNCTION_OPTIONS}
                      value={values.functions}
                      error={shown.functions}
                      onChange={(next) => set('functions', next)}
                    />
                  </>
                ) : null}

                {step === 2 ? (
                  <>
                    <Field
                      name="fullName"
                      label={FIELD_LABELS.fullName}
                      required
                      error={shown.fullName}
                    >
                      {(props) => (
                        <TextInput
                          {...props}
                          value={values.fullName}
                          autoComplete="name"
                          enterKeyHint="next"
                          invalid={Boolean(shown.fullName)}
                          onChange={(event) => set('fullName', event.target.value)}
                        />
                      )}
                    </Field>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <Field
                        name="email"
                        label={FIELD_LABELS.email}
                        required
                        hint="Where the written quote and timeline go."
                        error={shown.email}
                      >
                        {(props) => (
                          <TextInput
                            {...props}
                            type="email"
                            value={values.email}
                            inputMode="email"
                            autoComplete="email"
                            autoCapitalize="off"
                            spellCheck={false}
                            enterKeyHint="next"
                            invalid={Boolean(shown.email)}
                            onChange={(event) => set('email', event.target.value)}
                          />
                        )}
                      </Field>

                      <Field
                        name="phone"
                        label={FIELD_LABELS.phone}
                        required
                        hint="With the country code, so a coordinator can reach you on WhatsApp."
                        error={shown.phone}
                      >
                        {(props) => (
                          <TextInput
                            {...props}
                            type="tel"
                            value={values.phone}
                            placeholder="+91 98765 43210"
                            inputMode="tel"
                            autoComplete="tel"
                            enterKeyHint="next"
                            invalid={Boolean(shown.phone)}
                            onChange={(event) => set('phone', event.target.value)}
                          />
                        )}
                      </Field>
                    </div>

                    <p className="text-body-sm text-stone-500">
                      Used to answer this enquiry and nothing else. No newsletter, no list, and
                      nothing passed to anyone outside the studio.
                    </p>
                  </>
                ) : null}

                {step === 3 ? (
                  <>
                    <RadioCardGroup
                      name="packagePreference"
                      legend={FIELD_LABELS.packagePreference}
                      hint="A starting point for the conversation, not a booking. “Not sure yet” is a real answer."
                      required
                      columns={2}
                      options={packageOptions}
                      value={values.packagePreference}
                      error={shown.packagePreference}
                      onChange={(next) => set('packagePreference', next)}
                    />

                    <RadioCardGroup
                      name="artistPreference"
                      legend={FIELD_LABELS.artistPreference}
                      hint="If you have read the artists' pages and one of them fits. Availability is checked before anything is promised."
                      required
                      columns={2}
                      options={artistOptions}
                      value={values.artistPreference}
                      error={shown.artistPreference}
                      onChange={(next) => set('artistPreference', next)}
                    />

                    <Field
                      name="howHeard"
                      label={FIELD_LABELS.howHeard}
                      required
                      error={shown.howHeard}
                      className="sm:max-w-sm"
                    >
                      {(props) => (
                        <Select
                          {...props}
                          value={values.howHeard}
                          options={HOW_HEARD_LABELS}
                          placeholder="Choose one"
                          invalid={Boolean(shown.howHeard)}
                          onChange={(event) => set('howHeard', event.target.value)}
                        />
                      )}
                    </Field>

                    <Field
                      name="message"
                      label={FIELD_LABELS.message}
                      hint="Outfit colours, a look you have saved, a family member who also needs hair, a travel day. The more specific, the more useful the consultation."
                      error={shown.message}
                    >
                      {(props) => (
                        <TextArea
                          {...props}
                          value={values.message}
                          rows={5}
                          count={{ value: values.message.length, max: MESSAGE_MAX }}
                          invalid={Boolean(shown.message)}
                          onChange={(event) => set('message', event.target.value)}
                        />
                      )}
                    </Field>
                  </>
                ) : null}
              </div>

              {/* Rendered once, outside the steps: a bot that fills every input on
                  the first screen has already answered it. */}
              <Honeypot value={values.honeypot} onChange={(next) => set('honeypot', next)} />

              <div className="flex flex-col gap-4 border-t border-sand-400 pt-6">
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  {step > 1 ? (
                    <Button type="button" variant="ghost" size="md" onClick={back}>
                      Back to {STEPS[step - 2].label.toLowerCase()}
                    </Button>
                  ) : (
                    <span className="hidden sm:block" />
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    loading={form.isSubmitting}
                    loadingLabel="Sending your enquiry"
                    trailingIcon={isLast ? undefined : <IconArrowRight className="size-4" />}
                  >
                    {isLast ? 'Send my enquiry' : 'Continue'}
                  </Button>
                </div>

                {note ? <p className="text-body-xs text-stone-500">{note}</p> : null}
              </div>

              <FormStatus
                status={form.status}
                error={form.formError}
                busyLabel="Sending your enquiry"
              />

              {/* docs/UX_SPEC.md §5: a failure has to say the answers survived it. */}
              {form.status === 'error' ? (
                <p className="text-body-xs text-stone-500">
                  Your details were not lost — every answer is still in the form, exactly as you
                  typed it.
                </p>
              ) : null}
            </form>
          )}

        </div>
      </Container>
    </Section>
  );
}

