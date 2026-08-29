import 'server-only';

import { randomUUID } from 'node:crypto';

import type { ConsultationInput } from '@/lib/schemas';
import type {
  ConsultationCreateResult,
  ConsultationRecord,
  ConsultationRepository,
} from './types';

/**
 * The consultation store (docs/ARCHITECTURE.md §7, docs/DECISION_LOG.md D10).
 *
 * Submissions are held in the memory of the running process and nowhere else.
 * They are not written to disk, not emailed, and not forwarded. When the process
 * restarts they are gone, and `/privacy` says exactly that.
 *
 * This is a deliberate choice rather than an unfinished one. Adding a real
 * database to a demonstration brand would mean provisioning credentials and
 * accepting real personal data into real storage for a site that has no operator
 * to act on it. The repository interface is the seam: the migration path to a
 * real datastore is written up in docs/DEVOPS_SPEC.md §5 and requires no changes
 * outside this file.
 *
 * Two properties still have to be right, because they are what a real
 * implementation would also need:
 *
 *  - **Idempotency.** A double-click, a retried fetch or a refreshed POST must
 *    not create a second record. Keyed on the client-generated UUID.
 *  - **A bounded store.** An unbounded `Map` fed by a public endpoint is a
 *    memory-exhaustion vector, so the oldest entries are evicted past a cap.
 */

const MAX_RECORDS = 500;

/** Human-quotable reference: `TBA-7F3K2Q`. Not a security token — it identifies
 *  a record in conversation and grants no access to anything. */
function makeReference(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = randomUUID().replace(/-/g, '');
  let out = '';
  for (let i = 0; i < 6; i += 1) {
    const slice = Number.parseInt(bytes.slice(i * 2, i * 2 + 2), 16);
    out += alphabet[slice % alphabet.length];
  }
  return `TBA-${out}`;
}

export class InMemoryConsultationRepository implements ConsultationRepository {
  private readonly byKey = new Map<string, ConsultationRecord>();

  async create(
    input: ConsultationInput,
    idempotencyKey: string,
  ): Promise<ConsultationCreateResult> {
    const existing = this.byKey.get(idempotencyKey);
    if (existing) return { created: false, record: existing };

    const record: ConsultationRecord = {
      reference: makeReference(),
      receivedAt: new Date().toISOString(),
      status: 'received',
      input,
    };

    this.byKey.set(idempotencyKey, record);

    // Insertion order is preserved by Map, so the first key is the oldest.
    while (this.byKey.size > MAX_RECORDS) {
      const oldest = this.byKey.keys().next();
      if (oldest.done) break;
      this.byKey.delete(oldest.value);
    }

    return { created: true, record };
  }

  async findByIdempotencyKey(idempotencyKey: string): Promise<ConsultationRecord | null> {
    return this.byKey.get(idempotencyKey) ?? null;
  }

  async count(): Promise<number> {
    return this.byKey.size;
  }
}
