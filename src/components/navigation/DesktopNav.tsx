'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/cn';

/**
 * Horizontal navigation, 1024px and up (docs/UX_SPEC.md §2).
 *
 * `isCurrent` treats a section as current when the path is the link *or* a child
 * of it, so `/services/bridal-hair` still marks "Services". Without the prefix
 * check, a visitor five clicks into the services tree sees no indication of where
 * they are.
 *
 * `aria-current="page"` is on the link, and the underline is drawn with an
 * explicit `::after` rule rather than the shared `underline-draw` utility,
 * because the current item needs the line held open permanently and mixing the
 * two would depend on stylesheet ordering to resolve.
 */

export interface NavItem {
  readonly href: string;
  readonly label: string;
}

export interface DesktopNavProps {
  readonly items: readonly NavItem[];
  readonly className?: string;
}

export function isCurrent(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

const UNDERLINE =
  'relative after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:bg-current after:transition-transform after:duration-(--dur-fast) after:ease-(--ease-editorial)';

export function DesktopNav({ items, className }: DesktopNavProps) {
  const pathname = usePathname();

  return (
    <ul className={cn('flex items-center gap-7', className)}>
      {items.map((item) => {
        const current = isCurrent(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={current ? 'page' : undefined}
              className={cn(
                'inline-flex min-h-11 items-center text-body-sm transition-colors duration-(--dur-fast)',
                UNDERLINE,
                current
                  ? 'font-medium text-espresso-900 after:scale-x-100'
                  : 'text-espresso-700 after:scale-x-0 hover:text-espresso-900 hover:after:scale-x-100 focus-visible:after:scale-x-100',
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
