import { cn } from '@/lib/cn';

import type { ReactNode } from 'react';

/**
 * Inline SVG icons.
 *
 * Inline rather than an icon package for three reasons: nothing ships that is
 * not used, the glyphs inherit `currentColor` so no variant needs a colour prop,
 * and there is no icon-font request on the critical path
 * (docs/PERFORMANCE_SPEC.md §3, docs/DECISION_LOG.md D9).
 *
 * Every icon is `aria-hidden` by default. An icon is decoration unless a `label`
 * is passed, in which case it becomes `role="img"` with an accessible name. That
 * default is the safe one: an unlabelled decorative glyph announced as "image"
 * is noise, while a meaningful icon without a label is a silent control — and
 * the components in this project never use an icon as the only carrier of
 * meaning (docs/ACCESSIBILITY_SPEC.md §4).
 *
 * The stroke width is 1.5 throughout, matching the hairline weight of the
 * borders and rules in the brand system so the icons do not read as heavier
 * than the type around them.
 */

export interface IconProps {
  readonly className?: string;
  /** Supplying this makes the icon meaningful rather than decorative. */
  readonly label?: string;
}

function Svg({
  children,
  className,
  label,
  filled = false,
  viewBox = '0 0 24 24',
}: IconProps & { children: ReactNode; filled?: boolean; viewBox?: string }) {
  return (
    <svg
      viewBox={viewBox}
      className={cn('size-4 shrink-0', className)}
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={filled ? undefined : 1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4.5 12.5 9 17 19.5 6.5" />
    </Svg>
  );
}

export function IconInfo(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5M12 7.75h.01" />
    </Svg>
  );
}

export function IconWarning(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 4.5 21 19.5H3L12 4.5Z" />
      <path d="M12 10v4M12 17h.01" />
    </Svg>
  );
}

export function IconDanger(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.75v6M12 16.5h.01" />
    </Svg>
  );
}

export function IconChevronDown(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 9.5 12 15.5 18 9.5" />
    </Svg>
  );
}

export function IconChevronRight(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9.5 6 15.5 12 9.5 18" />
    </Svg>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 12h16M14 6l6 6-6 6" />
    </Svg>
  );
}

export function IconArrowUpRight(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7 17 17 7M8.5 7H17v8.5" />
    </Svg>
  );
}

export function IconClose(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Svg>
  );
}

export function IconMenu(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />
    </Svg>
  );
}

export function IconPhone(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7.5 3.5h-2A2.5 2.5 0 0 0 3 6c0 8.28 6.72 15 15 15a2.5 2.5 0 0 0 2.5-2.5v-2l-4-1.5-2 2.5a15.6 15.6 0 0 1-6-6l2.5-2-1.5-4Z" />
    </Svg>
  );
}

export function IconMail(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
      <path d="m3.75 7 8.25 6 8.25-6" />
    </Svg>
  );
}

/** The WhatsApp glyph is filled — the outline form is unrecognisable at 16px. */
export function IconWhatsApp(props: IconProps) {
  return (
    <Svg {...props} filled>
      <path d="M12.02 2.5A9.44 9.44 0 0 0 3.9 16.86L2.5 21.5l4.79-1.35a9.44 9.44 0 1 0 4.73-17.65Zm0 1.7a7.74 7.74 0 0 1 3.83 14.46l-.35.19-3.05.86.85-2.9-.22-.36a7.74 7.74 0 0 1 6.1-11.66l-.02.02Zm-3.4 3.5c-.18 0-.47.07-.71.34-.24.27-.93.9-.93 2.2 0 1.3.94 2.55 1.07 2.73.13.18 1.83 2.9 4.5 3.94 2.22.87 2.67.7 3.15.65.48-.04 1.55-.63 1.77-1.25.22-.62.22-1.15.15-1.26-.06-.11-.24-.18-.5-.31-.27-.13-1.55-.76-1.79-.85-.24-.09-.41-.13-.59.13-.18.27-.68.88-.83 1.06-.16.18-.31.2-.58.07-.26-.13-1.13-.42-2.15-1.33-.79-.7-1.32-1.57-1.48-1.84-.15-.26-.02-.4.12-.54.13-.13.27-.31.4-.47.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.47-.07-.13-.6-1.44-.82-1.97-.18-.42-.37-.4-.5-.4h-.5Z" />
    </Svg>
  );
}

export function IconInstagram(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="4.75" />
      <circle cx="12" cy="12" r="4" />
      <path d="M16.85 7.15h.01" />
    </Svg>
  );
}

export function IconPinterest(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.75" />
      <path d="M10.4 17.6 12.2 11m-1.6.3c-.3-.9.1-2 1.1-2.4 1.1-.4 2.3.1 2.6 1.2.4 1.4-.4 3-1.7 3.3-.9.2-1.7-.2-2-1" />
    </Svg>
  );
}

export function IconCalendar(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="1.5" />
      <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" />
    </Svg>
  );
}

export function IconMapPin(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 21s6.5-5.4 6.5-10.2A6.5 6.5 0 0 0 5.5 10.8C5.5 15.6 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2.25" />
    </Svg>
  );
}

export function IconClock(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </Svg>
  );
}

/** Rotated square: the brand's ornament, used on rules and list markers. */
export function IconDiamond(props: IconProps) {
  return (
    <Svg {...props} filled viewBox="0 0 12 12">
      <path d="M6 0l6 6-6 6L0 6z" />
    </Svg>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 5.5v13M5.5 12h13" />
    </Svg>
  );
}

export function IconMinus(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5.5 12h13" />
    </Svg>
  );
}

export function IconSliders(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="8" cy="17" r="2" />
    </Svg>
  );
}



