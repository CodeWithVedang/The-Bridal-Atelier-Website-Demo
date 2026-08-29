import { InMemoryContentRepository } from './in-memory-content';

import type { ContentRepository } from './types';

/**
 * The single place the application resolves a repository (docs/ARCHITECTURE.md §7).
 *
 * Pages and sections call `getContentRepository()`; nothing imports
 * `src/content/*.ts` directly. Replacing the data source is therefore a one-line
 * change here plus one new class.
 *
 * The content repository is a module-level singleton because it is stateless and
 * reads frozen arrays. The consultation repository is **not** exported from this
 * barrel: it is server-only and is resolved in `./server.ts`, so importing this
 * file from a Client Component cannot pull `node:crypto` into the browser bundle.
 */

let contentRepository: ContentRepository | null = null;

export function getContentRepository(): ContentRepository {
  contentRepository ??= new InMemoryContentRepository();
  return contentRepository;
}

export type {
  ConsultationCreateResult,
  ConsultationRecord,
  ConsultationRepository,
  ConsultationStatus,
  ContentRepository,
  PortfolioFilterSelection,
} from './types';
