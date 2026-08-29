import { artists } from '@/content/artists';
import { beforeAfterPairs } from '@/content/before-after';
import { faqs } from '@/content/faqs';
import { instagramTiles } from '@/content/instagram';
import { journeyStages } from '@/content/journey';
import { bridalLooks } from '@/content/looks';
import { packages } from '@/content/packages';
import { portfolioProjects } from '@/content/portfolio';
import { serviceCategories, services } from '@/content/services';
import { testimonials } from '@/content/testimonials';

import type {
  ContentRepository,
  PortfolioFilterSelection,
} from './types';
import type {
  Artist,
  BeforeAfterPair,
  BridalLook,
  BridalPackage,
  Faq,
  InstagramTile,
  JourneyStage,
  PortfolioFilterDimension,
  PortfolioProject,
  Service,
  ServiceCategory,
  Testimonial,
} from '@/types/content';

/**
 * The content repository backed by the typed modules in `src/content/`.
 *
 * Everything here is a pure read over frozen arrays, so it is safe to share one
 * instance across requests. Ordering is applied here rather than trusted from
 * the source arrays, because a database would return rows in whatever order it
 * felt like and the pages must not depend on file order.
 */

const byOrder = <T extends { readonly order: number }>(a: T, b: T): number => a.order - b.order;

function matchesFilters(
  project: PortfolioProject,
  filters: PortfolioFilterSelection,
): boolean {
  for (const [dimension, selected] of Object.entries(filters) as readonly [
    PortfolioFilterDimension,
    readonly string[] | undefined,
  ][]) {
    if (!selected || selected.length === 0) continue;
    const values = project.filters[dimension];
    // OR within a dimension, AND across dimensions.
    if (!selected.some((value) => values.includes(value))) return false;
  }
  return true;
}

export class InMemoryContentRepository implements ContentRepository {
  async listJourneyStages(): Promise<readonly JourneyStage[]> {
    return [...journeyStages].sort((a, b) => a.index.localeCompare(b.index));
  }

  async listServiceCategories(): Promise<readonly ServiceCategory[]> {
    return [...serviceCategories].sort(byOrder);
  }

  async getServiceCategory(slug: string): Promise<ServiceCategory | null> {
    return serviceCategories.find((category) => category.slug === slug) ?? null;
  }

  async listServices(categorySlug?: string): Promise<readonly Service[]> {
    const rows = categorySlug
      ? services.filter((service) => service.categorySlug === categorySlug)
      : services;
    return [...rows].sort(byOrder);
  }

  async listPackages(): Promise<readonly BridalPackage[]> {
    return [...packages].sort(byOrder);
  }

  async getPackage(slug: string): Promise<BridalPackage | null> {
    return packages.find((row) => row.slug === slug) ?? null;
  }

  async listArtists(): Promise<readonly Artist[]> {
    return [...artists].sort(byOrder);
  }

  async getArtist(slug: string): Promise<Artist | null> {
    return artists.find((artist) => artist.slug === slug) ?? null;
  }

  async listBridalLooks(): Promise<readonly BridalLook[]> {
    return [...bridalLooks].sort(byOrder);
  }

  async getBridalLook(slug: string): Promise<BridalLook | null> {
    return bridalLooks.find((look) => look.slug === slug) ?? null;
  }

  async listPortfolioProjects(
    filters: PortfolioFilterSelection = {},
  ): Promise<readonly PortfolioProject[]> {
    const rows = portfolioProjects.filter((project) => matchesFilters(project, filters));
    return [...rows].sort(byOrder);
  }

  async getPortfolioProject(slug: string): Promise<PortfolioProject | null> {
    return portfolioProjects.find((project) => project.slug === slug) ?? null;
  }

  async listFeaturedProjects(limit = 6): Promise<readonly PortfolioProject[]> {
    return [...portfolioProjects.filter((project) => project.feature)]
      .sort(byOrder)
      .slice(0, limit);
  }

  async listTestimonials(): Promise<readonly Testimonial[]> {
    return testimonials;
  }

  async listFaqs(topic?: Faq['topic']): Promise<readonly Faq[]> {
    const rows = topic ? faqs.filter((faq) => faq.topic === topic) : faqs;
    return [...rows].sort(byOrder);
  }

  async listBeforeAfterPairs(): Promise<readonly BeforeAfterPair[]> {
    return beforeAfterPairs;
  }

  async listInstagramTiles(): Promise<readonly InstagramTile[]> {
    return instagramTiles;
  }
}
