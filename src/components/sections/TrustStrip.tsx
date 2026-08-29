import { cn } from '@/lib/cn';
import { Container, Section } from '@/components/primitives';

import type { SectionGround } from './types';

/**
 * Four structural facts, directly under the hero (docs/UX_SPEC.md §3).
 *
 * Not a card row and not a stat row. Each cell states a fact that is verifiable
 * somewhere else on this site — the artists page names the artists, the packages
 * page publishes the figures — because the alternative (a rating, a client
 * count, "trusted by 500 brides") would be invented social proof for a brand
 * that has no clients (docs/PSYCHOLOGY_SPEC.md §2).
 *
 * The rules between cells are the container's ground showing through a 1px grid
 * gap. Cells therefore carry the *same* colour as the section, so nothing reads
 * as a tile: one hairline grid, four facts, no boxes (docs/UI_SPEC.md §7).
 *
 * The list is pulled out by exactly its own cell padding from `sm` up, so the
 * first cell's text still starts on the page's text edge instead of one gutter
 * inside it. The offset is always smaller than `Container`'s padding at the same
 * breakpoint, so it can never introduce horizontal scroll.
 */

export interface TrustFact {
  readonly label: string;
  readonly detail: string;
}

export interface TrustStripProps {
  readonly facts: readonly TrustFact[];
  readonly tone?: SectionGround;
}

/** Cell paint must equal the section ground, or the grid gap reads as a border. */
const CELL: Record<SectionGround, string> = {
  ivory: 'bg-ivory-50',
  'ivory-alt': 'bg-ivory-100',
  inset: 'bg-ivory-200',
  espresso: 'bg-espresso-900',
  blush: 'bg-blush-100',
};

const RULE: Record<SectionGround, string> = {
  ivory: 'bg-sand-300',
  'ivory-alt': 'bg-sand-300',
  inset: 'bg-sand-400',
  espresso: 'bg-espresso-700',
  blush: 'bg-sand-300',
};

export function TrustStrip({ facts, tone = 'ivory-alt' }: TrustStripProps) {
  const inverse = tone === 'espresso';

  return (
    <Section tone={tone} spacing="flush" className="py-10 lg:py-14">
      <Container>
        <ul
          className={cn(
            'grid grid-cols-1 gap-px sm:-mx-6 sm:grid-cols-2 lg:-mx-8 lg:grid-cols-4',
            RULE[tone],
          )}
        >
          {facts.map((fact) => (
            <li
              key={fact.label}
              className={cn('flex flex-col gap-2 py-5 sm:px-6 lg:px-8', CELL[tone])}
            >
              <p
                className={cn(
                  'text-body-md font-medium',
                  inverse ? 'text-ivory-50' : 'text-espresso-900',
                )}
              >
                {fact.label}
              </p>
              <p
                className={cn(
                  'max-w-[34ch] text-body-sm',
                  inverse ? 'text-ivory-200/85' : 'text-espresso-700',
                )}
              >
                {fact.detail}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
