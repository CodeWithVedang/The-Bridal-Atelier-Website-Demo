import { Container, Section, SectionHeading } from '@/components/primitives';
import { cn } from '@/lib/cn';

import { PortfolioTile } from './PortfolioTile';
import { TrackedCta } from './TrackedCta';

import type { SectionCopy, SectionGround } from './types';
import type { PortfolioProject } from '@/types/content';

/**
 * The home-page portfolio preview (docs/UX_SPEC.md §3 — six and a link).
 *
 * The asymmetric grid from docs/UI_SPEC.md §7 signature 4: one tile carries two
 * rows and the rest fill around it, so the block reads as an editorial page
 * rather than a product listing. Below 768 the feature tile drops its row span
 * and every tile is equal, because on a 360px column a "big" tile is just a tall
 * one (docs/UI_SPEC.md §8).
 *
 * Six is a deliberate stop. The full set is twelve, filterable, one route away;
 * a home page that shows all of them has no reason for the portfolio page to
 * exist.
 */

export interface PortfolioPreviewProps {
  readonly copy: SectionCopy;
  readonly projects: readonly PortfolioProject[];
  /** Slug → display name, so the tile can credit the artist. */
  readonly artistNames?: Readonly<Record<string, string>>;
  readonly tone?: SectionGround;
  readonly id?: string;
}

const HEADING_ID = 'portfolio-preview-heading';

export function PortfolioPreview({
  copy,
  projects,
  artistNames,
  tone = 'ivory',
  id,
}: PortfolioPreviewProps) {
  return (
    <Section id={id} tone={tone} labelledBy={HEADING_ID}>
      <Container className="flex flex-col gap-10 lg:gap-14">
        <SectionHeading
          id={HEADING_ID}
          eyebrow={copy.eyebrow}
          lead={copy.intro}
          action={
            copy.ctaLabel && copy.ctaHref ? (
              <TrackedCta
                href={copy.ctaHref}
                channel="portfolio"
                location="portfolio_preview"
                variant="secondary"
              >
                {copy.ctaLabel}
              </TrackedCta>
            ) : undefined
          }
        >
          {copy.heading}
        </SectionHeading>

        <div className="grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-3">
          {projects.map((project, index) => {
            const isFeature = index === 0;

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
      </Container>
    </Section>
  );
}
