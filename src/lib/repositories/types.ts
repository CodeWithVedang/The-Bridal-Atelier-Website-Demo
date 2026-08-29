import type { ConsultationInput } from '@/lib/schemas';
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
 * Repository contracts (docs/ARCHITECTURE.md §7).
 *
 * Every read in the application goes through one of these interfaces rather than
 * importing a `src/content/*.ts` module directly. That indirection is the point
 * of the exercise: the content currently lives in typed TypeScript modules, and
 * swapping in a CMS or a database means writing one new class that satisfies
 * these signatures — no page, section or component changes.
 *
 * All methods are `async` even though the in-memory implementation resolves
 * immediately. If they were synchronous, every call site would have to change on
 * the day the data moves behind a network boundary, which would defeat the
 * abstraction entirely.
 */

export type PortfolioFilterSelection = Partial<
  Readonly<Record<PortfolioFilterDimension, readonly string[]>>
>;

export interface ContentRepository {
  listJourneyStages(): Promise<readonly JourneyStage[]>;

  listServiceCategories(): Promise<readonly ServiceCategory[]>;
  getServiceCategory(slug: string): Promise<ServiceCategory | null>;
  listServices(categorySlug?: string): Promise<readonly Service[]>;

  listPackages(): Promise<readonly BridalPackage[]>;
  getPackage(slug: string): Promise<BridalPackage | null>;

  listArtists(): Promise<readonly Artist[]>;
  getArtist(slug: string): Promise<Artist | null>;

  listBridalLooks(): Promise<readonly BridalLook[]>;
  getBridalLook(slug: string): Promise<BridalLook | null>;

  /**
   * Filters are `AND` across dimensions and `OR` within a dimension. An empty or
   * omitted selection returns everything rather than nothing, so a fresh page
   * load is never an empty state.
   */
  listPortfolioProjects(filters?: PortfolioFilterSelection): Promise<readonly PortfolioProject[]>;
  getPortfolioProject(slug: string): Promise<PortfolioProject | null>;
  listFeaturedProjects(limit?: number): Promise<readonly PortfolioProject[]>;

  listTestimonials(): Promise<readonly Testimonial[]>;
  listFaqs(topic?: Faq['topic']): Promise<readonly Faq[]>;
  listBeforeAfterPairs(): Promise<readonly BeforeAfterPair[]>;
  listInstagramTiles(): Promise<readonly InstagramTile[]>;
}

/* ── Write side ──────────────────────────────────────────────────────────── */

export type ConsultationStatus = 'received';

export interface ConsultationRecord {
  /** Opaque reference shown to the bride so she can quote it if she follows up. */
  readonly reference: string;
  readonly receivedAt: string;
  readonly status: ConsultationStatus;
  readonly input: ConsultationInput;
}

export interface ConsultationCreateResult {
  /** `false` when the idempotency key has been seen before. */
  readonly created: boolean;
  readonly record: ConsultationRecord;
}

export interface ConsultationRepository {
  /**
   * Idempotent by `idempotencyKey`. A double-click, a retried fetch or a
   * refreshed POST returns the original record with `created: false` instead of
   * creating a second one (docs/SECURITY_SPEC.md §4).
   */
  create(input: ConsultationInput, idempotencyKey: string): Promise<ConsultationCreateResult>;
  findByIdempotencyKey(idempotencyKey: string): Promise<ConsultationRecord | null>;
  count(): Promise<number>;
}
