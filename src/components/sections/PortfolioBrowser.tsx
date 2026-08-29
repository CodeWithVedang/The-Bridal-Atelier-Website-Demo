'use client';

import { useMemo, useState } from 'react';

import { EmptyState } from '@/components/feedback';
import { FilterChips } from '@/components/content';
import { Button, Container, Section, SectionHeading } from '@/components/primitives';
import { cn } from '@/lib/cn';
import { track } from '@/lib/analytics';

import { PortfolioTile } from './PortfolioTile';

import type { SectionCopy, SectionGround } from './types';
import type { PortfolioFilterDimension, PortfolioProject } from '@/types/content';

/**
 * The filterable portfolio (brief §10, docs/UX_SPEC.md §3–§4).
 *
 * Eight dimensions, one chip row each, `AND` across dimensions and `OR` within
 * one — a project matches a dimension when its own values include the selected
 * option (docs/CONTENT_SPEC.md, `src/content/portfolio.ts`).
 *
 * **Counts are faceted, not static.** Each chip shows how many weddings you
 * would get if you pressed it, given everything else already selected. That is
 * what stops the grid emptying for a reason the visitor cannot see: `Sikh 0` is
 * legible before the click, not after it (docs/UX_SPEC.md §4).
 *
 * Three dimensions are always visible and five sit behind a native `<details>`.
 * Eight rows of chips above the work would put the first photograph most of a
 * screen down, and this is a page about photographs. The panel is forced open
 * whenever one of the filters inside it is active, so a hidden filter can never
 * be silently narrowing the grid.
 *
 * The feature tile — the two-row one — appears only in the unfiltered state. Once
 * a filter is on, "the biggest tile" is no longer an editorial choice about what
 * to lead with; it is just whichever project happens to sort first.
 *
 * All filtering is client-side over build-time data: twelve projects is not a
 * data-fetching problem, and a URL round-trip per chip would make the page feel
 * slower than it is. No filter state is written to the URL, which is a real
 * tradeoff — a filtered view cannot be shared. Recorded as such rather than
 * hidden (docs/DECISION_LOG.md).
 */

export interface PortfolioFilterGroup {
  readonly dimension: PortfolioFilterDimension;
  readonly label: string;
  readonly options: readonly string[];
}

export interface PortfolioBrowserProps {
  readonly copy: SectionCopy;
  readonly projects: readonly PortfolioProject[];
  readonly filters: readonly PortfolioFilterGroup[];
  /** Slug → display name, so each tile can credit the artist. */
  readonly artistNames?: Readonly<Record<string, string>>;
  /** How many leading dimensions stay outside the disclosure. */
  readonly visibleFilters?: number;
  readonly tone?: SectionGround;
  readonly id?: string;
}

const HEADING_ID = 'portfolio-browser-heading';

/**
 * The unfiltered value for a dimension. Not a real option, and it cannot collide
 * with one: every option label in the content module is capitalised prose.
 */
const ALL = 'all';

type Selection = Readonly<Partial<Record<PortfolioFilterDimension, string>>>;

function matches(project: PortfolioProject, selection: Selection): boolean {
  return Object.entries(selection).every(([dimension, value]) => {
    if (!value || value === ALL) return true;
    return project.filters[dimension as PortfolioFilterDimension].includes(value);
  });
}

function activeDimensions(selection: Selection): readonly string[] {
  return Object.entries(selection)
    .filter(([, value]) => value && value !== ALL)
    .map(([dimension]) => dimension);
}

export function PortfolioBrowser({
  copy,
  projects,
  filters,
  artistNames,
  visibleFilters = 3,
  tone = 'ivory',
  id,
}: PortfolioBrowserProps) {
  const [selection, setSelection] = useState<Selection>({});
  const [panelOpen, setPanelOpen] = useState(false);

  const primary = filters.slice(0, visibleFilters);
  const secondary = filters.slice(visibleFilters);

  const active = activeDimensions(selection);
  const results = useMemo(
    () => projects.filter((project) => matches(project, selection)),
    [projects, selection],
  );

  /**
   * How many of the filters inside the disclosure are on. The panel can be
   * closed while they are, so the count is printed on the summary — a hidden
   * filter must never be the unexplained reason the grid is short.
   */
  const secondaryCount = secondary.filter((group) => active.includes(group.dimension)).length;

  function countFor(dimension: PortfolioFilterDimension, option: string): number {
    const probe: Selection = { ...selection, [dimension]: option };
    return projects.filter((project) => matches(project, probe)).length;
  }

  function apply(dimension: PortfolioFilterDimension, value: string): void {
    // Pressing the chip that is already on clears that dimension, so a filter
    // row is never a one-way door on a touch device.
    const current = selection[dimension] ?? ALL;
    const next: Selection = { ...selection, [dimension]: value === current ? ALL : value };

    setSelection(next);
    track('portfolio_filtered', {
      dimensions_active: activeDimensions(next).length,
      result_count: projects.filter((project) => matches(project, next)).length,
    });
  }

  function clearAll(): void {
    setSelection({});
    setPanelOpen(false);
    track('portfolio_filtered', { dimensions_active: 0, result_count: projects.length });
  }

  function row(group: PortfolioFilterGroup) {
    const value = selection[group.dimension] ?? ALL;

    return (
      <div key={group.dimension} className="flex flex-col gap-2.5">
        <p className="text-label uppercase text-stone-500">{group.label}</p>
        <FilterChips
          label={group.label}
          value={value}
          onChange={(next) => apply(group.dimension, next)}
          options={[
            { value: ALL, label: 'All', count: projects.filter((p) => matches(p, { ...selection, [group.dimension]: ALL })).length },
            ...group.options.map((option) => ({
              value: option,
              label: option,
              count: countFor(group.dimension, option),
            })),
          ]}
        />
      </div>
    );
  }

  return (
    <Section id={id} tone={tone} labelledBy={HEADING_ID}>
      <Container className="flex flex-col gap-10 lg:gap-12">
        <SectionHeading id={HEADING_ID} eyebrow={copy.eyebrow} lead={copy.intro}>
          {copy.heading}
        </SectionHeading>

        <div className="flex flex-col gap-6 border-y border-sand-300 py-6">
          <div className="flex flex-col gap-5">{primary.map(row)}</div>

          {secondary.length > 0 ? (
            <details
              open={panelOpen}
              onToggle={(event) => setPanelOpen((event.currentTarget as HTMLDetailsElement).open)}
              className="group/filters"
            >
              <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 text-body-sm font-medium text-espresso-900 [&::-webkit-details-marker]:hidden">
                <span className="underline-draw">
                  {panelOpen ? 'Fewer filters' : `More filters (${secondary.length})`}
                </span>
                {!panelOpen && secondaryCount > 0 ? (
                  <span className="text-body-xs text-gold-600">
                    {secondaryCount} applied in here
                  </span>
                ) : null}
                <span
                  aria-hidden="true"
                  className="text-stone-500 transition-transform duration-(--dur-fast) group-open/filters:rotate-180"
                >
                  ↓
                </span>
              </summary>
              <div className="mt-5 flex flex-col gap-5">{secondary.map(row)}</div>
            </details>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-4">
            <p role="status" className="text-body-sm text-stone-500">
              Showing {results.length} of {projects.length} weddings
              {active.length > 0 ? ` · ${active.length} filter${active.length === 1 ? '' : 's'} applied` : null}
            </p>
            {active.length > 0 ? (
              <Button variant="ghost" size="sm" onClick={clearAll}>
                Clear all filters
              </Button>
            ) : null}
          </div>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-3">
            {results.map((project, index) => {
              const isFeature = active.length === 0 && index === 0;

              return (
                <PortfolioTile
                  key={project.slug}
                  project={project}
                  feature={isFeature}
                  artistName={artistNames?.[project.artistSlug]}
                  className={cn(isFeature && 'md:row-span-2')}
                  sizes={
                    isFeature
                      ? '(max-width: 767px) 50vw, (max-width: 1279px) 50vw, 420px'
                      : '(max-width: 767px) 50vw, (max-width: 1279px) 50vw, 380px'
                  }
                />
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No brides match these filters yet."
            reason={`All ${projects.length} published weddings are tagged on every one of the ${filters.length} dimensions, and no single one carries every combination. Clearing a filter or two brings the closest work back.`}
            action={
              <Button variant="secondary" onClick={clearAll}>
                Clear all filters
              </Button>
            }
          />
        )}
      </Container>
    </Section>
  );
}
