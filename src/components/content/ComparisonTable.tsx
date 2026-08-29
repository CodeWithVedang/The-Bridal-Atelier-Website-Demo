import { cn } from '@/lib/cn';

import type { ComparisonRow } from '@/types/content';

/**
 * Package comparison (brief §9, §21).
 *
 * A real `<table>` with a `<caption>`, a `<thead>`, row headers marked
 * `scope="row"` and column headers `scope="col"`. This is the one place on the
 * site where the data genuinely is tabular, and a grid of `<div>`s here would
 * strip a screen-reader user of the ability to ask "what does this cell belong
 * to?" — which is the only question this section exists to answer.
 *
 * Below 1024px the table is replaced (not reflowed) by one stacked definition
 * list per package. A three-column table on a 360px screen either scrolls
 * sideways, losing the row header, or shrinks the type below legibility. Two
 * markups is the honest cost of not doing either (docs/UI_SPEC.md §8).
 *
 * Only one column may be highlighted, and the highlight is a ground plus a
 * heavier border plus a text label in the header — never colour alone.
 */

export interface ComparisonColumn {
  /** Must match the keys used in each row's `values`. */
  readonly id: string;
  readonly label: string;
  /** A short note under the column head — the starting investment, usually. */
  readonly note?: string;
  readonly highlighted?: boolean;
}

export interface ComparisonTableProps {
  readonly caption: string;
  readonly rowHeader: string;
  readonly columns: readonly ComparisonColumn[];
  readonly rows: readonly ComparisonRow[];
  readonly className?: string;
}

/** "Not included" is real information, but it should not shout. */
function cellTone(value: string): string {
  return value === 'Not included' ? 'text-stone-500' : 'text-espresso-700';
}

export function ComparisonTable({
  caption,
  rowHeader,
  columns,
  rows,
  className,
}: ComparisonTableProps) {
  return (
    <div className={className}>
      {/* ── 1024px and up: the table ─────────────────────────────────────── */}
      <table className="hidden w-full border-collapse text-left lg:table">
        <caption className="pb-6 text-left text-body-sm text-stone-500">{caption}</caption>
        <thead>
          <tr>
            <th scope="col" className="w-[26%] border-b border-sand-300 pb-4 align-bottom">
              <span className="text-label text-stone-500">{rowHeader}</span>
            </th>
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                className={cn(
                  'border-b pb-4 align-bottom',
                  column.highlighted
                    ? 'border-espresso-900 bg-ivory-100 px-4'
                    : 'border-sand-300 px-4',
                )}
              >
                <span className="flex flex-col gap-1">
                  <span className="font-display text-body-lg leading-tight text-espresso-900">
                    {column.label}
                  </span>
                  {column.note ? (
                    <span className="text-body-xs font-normal text-stone-500">{column.note}</span>
                  ) : null}
                  {column.highlighted ? (
                    <span className="text-body-xs font-normal text-gold-600">Most chosen</span>
                  ) : null}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-sand-300 last:border-b-0">
              <th scope="row" className="py-4 pr-6 align-top">
                <span className="text-body-sm font-medium text-espresso-900">{row.label}</span>
              </th>
              {columns.map((column) => {
                const value = row.values[column.id] ?? '—';
                return (
                  <td
                    key={column.id}
                    className={cn(
                      'px-4 py-4 align-top text-body-sm',
                      column.highlighted && 'bg-ivory-100',
                      cellTone(value),
                    )}
                  >
                    {value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Below 1024px: one list per package ───────────────────────────── */}
      <div className="flex flex-col gap-8 lg:hidden">
        <p className="text-body-sm text-stone-500">{caption}</p>
        {columns.map((column) => (
          <section
            key={column.id}
            aria-labelledby={`compare-${column.id}`}
            className={cn(
              'flex flex-col gap-4 border p-5',
              column.highlighted ? 'border-espresso-900 bg-ivory-100' : 'border-sand-300',
            )}
          >
            <div className="flex flex-col gap-1">
              <h3
                id={`compare-${column.id}`}
                className="font-display text-display-sm leading-tight text-espresso-900"
              >
                {column.label}
              </h3>
              {column.note ? <p className="text-body-xs text-stone-500">{column.note}</p> : null}
              {column.highlighted ? (
                <p className="text-body-xs text-gold-600">Most chosen</p>
              ) : null}
            </div>
            <dl className="flex flex-col divide-y divide-sand-300 border-t border-sand-300">
              {rows.map((row) => {
                const value = row.values[column.id] ?? '—';
                return (
                  <div key={row.label} className="flex flex-col gap-1 py-3">
                    <dt className="text-body-xs tracking-wide text-stone-500 uppercase">
                      {row.label}
                    </dt>
                    <dd className={cn('text-body-sm', cellTone(value))}>{value}</dd>
                  </div>
                );
              })}
            </dl>
          </section>
        ))}
      </div>
    </div>
  );
}
