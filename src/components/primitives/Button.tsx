import Link from 'next/link';

import { cn } from '@/lib/cn';
import { Spinner } from '@/components/feedback/Spinner';

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * The one button in the system (docs/UI_SPEC.md §1).
 *
 * Three decisions worth knowing about:
 *
 * **Disabled and busy use `aria-disabled`, not the `disabled` attribute.** A
 * natively disabled element drops focus, so a keyboard user who presses "Send
 * enquiry" is thrown back to the top of the document at the exact moment they
 * need to hear what happened. `aria-disabled` keeps focus where it is, and the
 * click is refused in the handler instead. Submission is additionally guarded by
 * a ref inside `useValidatedForm`, so a second Enter press cannot get through.
 *
 * **The loading spinner sits in the button's own padding gutter.** It is
 * absolutely positioned inside the existing inline-end padding, so the label
 * neither moves nor changes and the button's width is identical before and
 * during submission. A spinner in normal flow would widen the button mid-click,
 * which reads as a glitch precisely when the bride is watching for reassurance.
 *
 * **Minimum target 44px at every size.** WCAG 2.2 SC 2.5.8 asks for 24px; 44px
 * is the comfortable-thumb figure from docs/UX_SPEC.md §7 and is applied even to
 * the `sm` size, which gets there through padding rather than font size.
 */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'gold' | 'inverse';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface CommonProps {
  readonly children: ReactNode;
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly loading?: boolean;
  readonly loadingLabel?: string;
  readonly fullWidth?: boolean;
  /** Decorative glyph after the label; never the only carrier of meaning. */
  readonly trailingIcon?: ReactNode;
  readonly className?: string;
}

type ButtonElementProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps | 'disabled'> & {
    readonly href?: undefined;
    readonly disabled?: boolean;
  };

type AnchorElementProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    readonly href: string;
    /** Adds `target`/`rel`; use for `wa.me`, `tel:` and Instagram. */
    readonly external?: boolean;
    readonly disabled?: undefined;
  };

export type ButtonProps = ButtonElementProps | AnchorElementProps;

const BASE =
  'relative inline-flex items-center justify-center gap-2.5 rounded-sm text-center align-middle font-medium transition-[background-color,color,border-color,box-shadow,transform] duration-(--dur-fast) ease-(--ease-editorial) select-none';

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-espresso-900 text-ivory-50 shadow-sm hover:bg-espresso-800 hover:-translate-y-px hover:shadow-md active:translate-y-0 active:shadow-sm',
  secondary:
    'border border-espresso-900/25 bg-transparent text-espresso-900 hover:border-espresso-900/60 hover:bg-espresso-900/[0.04] active:bg-espresso-900/[0.07]',
  ghost:
    'bg-transparent text-espresso-900 hover:bg-espresso-900/[0.05] active:bg-espresso-900/[0.08]',
  gold: 'bg-gold-200 text-espresso-900 hover:bg-gold-500/45 active:bg-gold-500/55',
  inverse:
    'border border-ivory-200/35 bg-transparent text-ivory-50 hover:border-ivory-200/70 hover:bg-ivory-50/10 active:bg-ivory-50/15',
};

const DISABLED = 'cursor-not-allowed bg-sand-400 text-stone-500 shadow-none hover:bg-sand-400 hover:translate-y-0 hover:shadow-none border-transparent';

/** Padding, not font-size, carries the 44px floor — see the header note. */
const SIZES: Record<ButtonSize, string> = {
  sm: 'min-h-11 px-4 py-2.5 text-body-sm',
  md: 'min-h-11 px-6 py-3 text-body-md',
  lg: 'min-h-13 px-7 py-3.5 text-body-md sm:text-body-lg',
};

const SPINNER_SLOT: Record<ButtonSize, string> = {
  sm: 'end-1.5',
  md: 'end-2',
  lg: 'end-2.5',
};

function Inner({
  children,
  loading,
  loadingLabel,
  trailingIcon,
  size,
}: {
  children: ReactNode;
  loading: boolean;
  loadingLabel: string;
  trailingIcon?: ReactNode;
  size: ButtonSize;
}) {
  return (
    <>
      <span className="inline-flex items-center gap-2.5">{children}</span>
      {trailingIcon ? (
        <span aria-hidden="true" className="inline-flex shrink-0">
          {trailingIcon}
        </span>
      ) : null}
      {loading ? (
        <Spinner
          label={loadingLabel}
          size="sm"
          className={cn('pointer-events-none absolute inset-y-0 items-center', SPINNER_SLOT[size])}
        />
      ) : null}
    </>
  );
}

/**
 * Strips the props this component owns, leaving only what belongs on the DOM
 * element. Without it a rest-spread carries `variant`, `size`, `trailingIcon`
 * and friends onto the `<a>`/`<button>`, where React renders them as unknown
 * attributes — and `trailingIcon` is a React element, so it lands as
 * `trailingicon="[object Object]"`.
 */
function forwardable<T extends CommonProps>(props: T): Omit<T, keyof CommonProps> {
  const {
    children,
    variant,
    size,
    loading,
    loadingLabel,
    fullWidth,
    trailingIcon,
    className,
    ...rest
  } = props;
  void children;
  void variant;
  void size;
  void loading;
  void loadingLabel;
  void fullWidth;
  void trailingIcon;
  void className;
  return rest;
}

export function Button(props: ButtonProps) {
  const {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    loadingLabel = 'Working',
    fullWidth = false,
    trailingIcon,
    className,
  } = props;

  const inactive = loading || ('disabled' in props && props.disabled === true);

  const classes = cn(
    BASE,
    SIZES[size],
    inactive ? DISABLED : VARIANTS[variant],
    fullWidth && 'w-full',
    className,
  );

  const inner = (
    <Inner loading={loading} loadingLabel={loadingLabel} trailingIcon={trailingIcon} size={size}>
      {children}
    </Inner>
  );

  if (props.href !== undefined) {
    const { href, external, ...rest } = forwardable(props);

    // A disabled link is not a thing in HTML, so the anchor is dropped entirely
    // and a matching `<span>` takes its place. Rendering `<a>` without `href`
    // would leave a focusable element that navigates nowhere.
    if (inactive) {
      return (
        <span aria-disabled="true" className={classes}>
          {inner}
        </span>
      );
    }

    if (external) {
      return (
        <a
          {...rest}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
        >
          {inner}
        </a>
      );
    }

    return (
      <Link {...rest} href={href} className={classes}>
        {inner}
      </Link>
    );
  }

  const { type = 'button', onClick, disabled: _d, ...rest } = forwardable(props);
  void _d;

  return (
    <button
      {...rest}
      type={type}
      aria-disabled={inactive || undefined}
      aria-busy={loading || undefined}
      onClick={(event) => {
        if (inactive) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      className={classes}
    >
      {inner}
    </button>
  );
}
