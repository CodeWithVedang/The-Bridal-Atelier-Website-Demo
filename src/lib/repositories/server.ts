import 'server-only';

import { InMemoryConsultationRepository } from './in-memory-consultation';

import type { ConsultationRepository } from './types';

/**
 * Server-only repository resolution.
 *
 * The consultation store lives behind its own module so that `import
 * 'server-only'` guards it: if a Client Component ever imports this file, the
 * build fails with a clear error instead of shipping `node:crypto` and an
 * in-memory list of submitted enquiries to the browser.
 *
 * The singleton is stored on `globalThis` rather than in a module variable. In
 * development, Turbopack's hot reload re-evaluates modules, which would otherwise
 * silently reset the store on every edit and make the idempotency behaviour
 * impossible to observe while working on it.
 */

const KEY = Symbol.for('bridal-atelier.consultation-repository');

interface GlobalWithRepository {
  [KEY]?: ConsultationRepository;
}

export function getConsultationRepository(): ConsultationRepository {
  const store = globalThis as GlobalWithRepository;
  store[KEY] ??= new InMemoryConsultationRepository();
  return store[KEY];
}
