'use client';

import Link from 'next/link';

import { EditorialImage } from '@/components/content';
import { getImage } from '@/content/images';
import { cn } from '@/lib/cn';
import { track } from '@/lib/analytics';

import type { PortfolioProject } from '@/types/content';

/**
 * One portfolio tile (brief §10, docs/UI_SPEC.md §7 signature 4).
 *
 * A card — a bordered box with padding — which the design system allows in
 * exactly two places, this being one of them. The whole tile is the target via a
 * stretched link on the title (`before:`, since `underline-draw` owns `::after`),
 * so the accessible name is the project title and not the title plus the city
 * plus the summary.
 *
 * A client component only because `portfolio_project_opened` fires on the click
 * (docs/ANALYTICS_SPEC.md §2). Only the slug is sent — no city, no artist, no
 * detail of the wedding (§3).
 *
 * `feature` is the two-row tile in the asymmetric grid: taller crop, and the
 * summary shown, because the extra height is only worth taking if it carries
 * extra information.
 */

export interface PortfolioTileProps {
  readonly project: PortfolioProject;
  /** The tall tile in the asymmetric grid. */
  readonly feature?: boolean;
  readonly artistName?: string;
  readonly sizes?: string;
  readonly priority?: boolean;
  readonly className?: string;
}

export function PortfolioTile({
  project,
  feature = false,
  artistName,
  sizes,
  priority = false,
  className,
}: PortfolioTileProps) {
  const image = getImage(project.imageId);

  return (
    <article
      className={cn(
        'image-zoom group relative flex flex-col border border-sand-300 bg-ivory-50 transition-colors duration-(--dur-base) hover:border-sand-400',
        className,
      )}
    >
      <div
        className={cn(
          'relative w-full overflow-hidden',
          feature ? 'aspect-[4/5] md:aspect-auto md:grow' : 'aspect-[4/5]',
        )}
      >
        <EditorialImage
          asset={image}
          priority={priority}
          sizes={sizes ?? '(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 380px'}
          className="absolute inset-0 size-full"
        />
      </div>

      <div className="flex flex-col gap-1.5 p-4 lg:p-5">
        <h3 className="text-body-lg font-medium text-espresso-900">
          <Link
            href={`/portfolio/${project.slug}`}
            onClick={() => track('portfolio_project_opened', { project_slug: project.slug })}
            className="underline-draw before:absolute before:inset-0 before:content-['']"
          >
            {project.title}
          </Link>
        </h3>

        <p className="text-body-sm text-stone-500">
          {project.city}
          {artistName ? ` · ${artistName}` : null}
        </p>

        {feature ? (
          <p className="mt-1 hidden max-w-[46ch] text-body-sm leading-relaxed text-espresso-700 md:block">
            {project.summary}
          </p>
        ) : null}
      </div>
    </article>
  );
}
