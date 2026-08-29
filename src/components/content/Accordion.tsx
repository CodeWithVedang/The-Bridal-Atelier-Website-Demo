'use client';

import { cn } from '@/lib/cn';
import { track } from '@/lib/analytics';
import { IconMinus, IconPlus } from '@/components/icons';

import type { ReactNode } from 'react';

/**
 * FAQ disclosure built on native `<details>`/`<summary>`.
 *
 * A hand-rolled disclosure needs `aria-expanded`, `aria-controls`, a button role,
 * Enter *and* Space handling, and it stops working the moment hydration fails.
 * `<details>` has all of that in the platform, plus in-page find ("find in page"
 * expands a closed `<details>` in Chromium), and it works with JavaScript off —
 * which matters because the FAQ answers contain the studio's actual policies
 * (docs/ACCESSIBILITY_SPEC.md §4).
 *
 * The default disclosure triangle is removed (`[&::-webkit-details-marker]` plus
 * `list-style: none`) and replaced with a plus/minus that swaps on `open`. Two
 * glyphs, not a rotating chevron, because the state has to be legible from the
 * icon alone in High Contrast Mode where a transform still reads as "arrow".
 *
 * `id` on the `<details>` makes `/faq#deposit` land on the right question, and
 * `defaultOpen` on the first item is left to the caller — the section decides.
 */

export interface AccordionItem {
  readonly id: string;
  readonly question: string;
  readonly answer: ReactNode;
}

export interface AccordionProps {
  readonly items: readonly AccordionItem[];
  /** Ids to render already open. Usually empty, occasionally the first item. */
  readonly openIds?: readonly string[];
  readonly className?: string;
}

export function Accordion({ items, openIds = [], className }: AccordionProps) {
  return (
    <div className={cn('divide-y divide-sand-300 border-y border-sand-300', className)}>
      {items.map((item) => (
        <details
          key={item.id}
          id={item.id}
          open={openIds.includes(item.id)}
          className="group/item scroll-mt-(--header-h)"
          onToggle={(event) => {
            // `faq_opened` only, and only on open — a close is not an intent
            // signal, and firing on both would double every count.
            if (!(event.currentTarget as HTMLDetailsElement).open) return;
            track('faq_opened', { question_id: item.id });
          }}
        >
          <summary
            className={cn(
              'flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-5 text-body-md font-medium text-espresso-900',
              'transition-colors duration-(--dur-fast) hover:text-espresso-700',
              '[&::-webkit-details-marker]:hidden',
            )}
          >
            <span className="flex-1">{item.question}</span>
            <span
              aria-hidden="true"
              className="grid size-8 shrink-0 place-items-center rounded-full border border-sand-300 text-espresso-700 transition-colors duration-(--dur-fast) group-hover/item:border-sand-400"
            >
              <IconPlus className="size-4 group-open/item:hidden" />
              <IconMinus className="hidden size-4 group-open/item:block" />
            </span>
          </summary>
          <div className="max-w-[62ch] pb-6 text-body-sm leading-relaxed text-espresso-700">
            {item.answer}
          </div>
        </details>
      ))}
    </div>
  );
}
