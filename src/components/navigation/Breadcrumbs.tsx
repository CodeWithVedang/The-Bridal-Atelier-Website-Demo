import Link from 'next/link';

import { cn } from '@/lib/cn';
import { breadcrumbNode, graph } from '@/lib/jsonld';
import { IconChevronRight } from '@/components/icons';

import type { Crumb } from '@/lib/seo';

/**
 * Visible breadcrumb trail plus its `BreadcrumbList` markup (docs/SEO_SPEC.md §4).
 *
 * Both are built from the same `Crumb[]`, in one component, on purpose. A
 * structured-data trail that disagrees with the rendered one is a markup
 * violation rather than a cosmetic slip, and the only reliable way to keep them
 * in step is to give them no opportunity to diverge.
 *
 * The last crumb is text, not a link. Linking the page you are already on is a
 * no-op the visitor has to discover by clicking, and `aria-current="page"` says
 * the same thing to assistive technology without the dead target.
 *
 * Links carry `min-h-6` so each one clears the 24×24px minimum in WCAG 2.2
 * SC 2.5.8 — 13px type on a 1.5 line-height is only about 20px tall, which is
 * the sort of thing that passes review and fails an audit.
 *
 * Renders nothing for a single crumb: a trail reading "Home" alone is furniture,
 * not orientation.
 */

export interface BreadcrumbsProps {
  readonly crumbs: readonly Crumb[];
  readonly className?: string;
}

export function Breadcrumbs({ crumbs, className }: BreadcrumbsProps) {
  if (crumbs.length < 2) return null;

  return (
    <>
      <nav aria-label="Breadcrumb" className={cn('text-body-xs', className)}>
        <ol className="flex flex-wrap items-center gap-x-2">
          {crumbs.map((crumb, index) => {
            const last = index === crumbs.length - 1;
            return (
              <li key={crumb.href} className="flex items-center gap-x-2">
                {last ? (
                  <span
                    aria-current="page"
                    className="inline-flex min-h-6 items-center font-medium text-espresso-900"
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <>
                    <Link
                      href={crumb.href}
                      className="underline-draw inline-flex min-h-6 items-center text-stone-500 transition-colors duration-(--dur-fast) hover:text-espresso-900"
                    >
                      {crumb.label}
                    </Link>
                    <IconChevronRight className="size-3 shrink-0 text-sand-400" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <script
        type="application/ld+json"
        // `graph` escapes `<`, `>` and `&` to their JSON unicode form, so no
        // string in a crumb label can close this element early.
        dangerouslySetInnerHTML={{ __html: graph(breadcrumbNode(crumbs)) }}
      />
    </>
  );
}
