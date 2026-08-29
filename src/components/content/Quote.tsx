import { cn } from '@/lib/cn';
import { disclosures } from '@/content/site-copy';
import { IconDiamond } from '@/components/icons';

/**
 * A testimonial.
 *
 * `<blockquote>` + `<figcaption>` inside a `<figure>` — the markup that actually
 * ties an attribution to a quote. A `<p>` in italics with a name under it in a
 * smaller size looks identical and tells assistive tech nothing.
 *
 * `sample` renders the provenance line. It is not optional in the content type
 * (`sample: true` is required on every `Testimonial`), and the note is printed
 * next to the quote rather than once at the foot of the page, because a quote
 * lifted into a screenshot or read aloud in isolation should still carry it
 * (docs/DECISION_LOG.md D3).
 *
 * No stars, no rating, no `Review` structured data. There is nothing to rate.
 */

export interface QuoteProps {
  readonly quote: string;
  readonly attribution: string;
  readonly meta?: string;
  readonly sample?: boolean;
  readonly size?: 'md' | 'lg';
  readonly className?: string;
}

export function Quote({
  quote,
  attribution,
  meta,
  sample = false,
  size = 'md',
  className,
}: QuoteProps) {
  return (
    <figure className={cn('flex flex-col gap-5', className)}>
      <IconDiamond className="size-2.5 text-gold-600" />
      <blockquote
        className={cn(
          'font-display text-espresso-900',
          size === 'lg' ? 'text-display-sm leading-tight' : 'text-body-lg leading-snug',
        )}
      >
        {/* Typographic quotation marks are deliberately absent: at display sizes
            they read as debris, and the element already says "quotation". */}
        {quote}
      </blockquote>
      <figcaption className="flex flex-col gap-1 text-body-sm">
        <span className="font-medium text-espresso-900">{attribution}</span>
        {meta ? <span className="text-stone-500">{meta}</span> : null}
        {sample ? (
          <span className="text-body-xs text-stone-500">{disclosures.sampleContent}</span>
        ) : null}
      </figcaption>
    </figure>
  );
}
