'use client';

import { Button } from '@/components/primitives';
import { track } from '@/lib/analytics';

import type { ButtonProps } from '@/components/primitives';
import type { EventProps } from '@/lib/analytics';
import type { ReactNode } from 'react';

/**
 * A `Button` that reports `cta_clicked` (docs/ANALYTICS_SPEC.md §2).
 *
 * This exists so the sections around it can stay Server Components. A single
 * `onClick` would otherwise force `'use client'` onto an entire editorial
 * section — the hero, the closing band — and ship its copy twice: once in the
 * HTML and again in the flight payload. The client boundary is drawn around the
 * one element that actually needs a handler.
 *
 * `channel` and `location` are the only two props the spec allows. Nothing about
 * the bride is passed: no name, no city, no date (docs/ANALYTICS_SPEC.md §3).
 */

export type CtaChannel =
  | 'consultation'
  | 'availability'
  | 'whatsapp'
  | 'phone'
  | 'packages'
  | 'portfolio';

type Inherited = Omit<
  Extract<ButtonProps, { href: string }>,
  'href' | 'children' | 'onClick'
>;

export interface TrackedCtaProps extends Inherited {
  readonly href: string;
  readonly children: ReactNode;
  readonly channel: CtaChannel;
  /** Where on the site the click happened, e.g. `hero`, `packages_section`. */
  readonly location: string;
}

export function TrackedCta({ channel, location, ...rest }: TrackedCtaProps) {
  const props: EventProps = { channel, location };
  return <Button {...rest} onClick={() => track('cta_clicked', props)} />;
}
