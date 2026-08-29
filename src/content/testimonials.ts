import type { Testimonial } from '@/types/content';

/**
 * Sample testimonials — every row carries `sample: true`.
 *
 * This studio is a demonstration brand with no clients, so these are written
 * examples, not reviews. Three consequences, all deliberate:
 *
 *  - The `sample: true` field is required by the type, not optional, so a future
 *    real testimonial cannot be added without someone changing the contract.
 *  - No star ratings anywhere.
 *  - No `Review` or `AggregateRating` JSON-LD is emitted (docs/SEO_SPEC.md §4).
 *    Marking up invented reviews would be both dishonest and a search-spam
 *    violation.
 *
 * The quotes talk about the *process* rather than the result, because process is
 * the thing this site is actually claiming (docs/PSYCHOLOGY_SPEC.md §2).
 */

export const testimonials = [
  {
    id: 'aditi-jaipur',
    quote:
      'The timeline was the part I did not know I needed. My mother had a copy, the photographer had a copy, and nobody spent the morning asking me what happened next.',
    attribution: 'Aditi',
    city: 'Jaipur',
    packageSlug: 'signature-bride',
    sample: true,
  },
  {
    id: 'noor-mumbai',
    quote:
      'I came in with a saved photograph of somebody else. At the trial we worked out which half of it suited me, and the other half was quietly dropped. That conversation was worth more than the makeup.',
    attribution: 'Noor',
    city: 'Mumbai',
    packageSlug: 'signature-bride',
    sample: true,
  },
  {
    id: 'sneha-pune',
    quote:
      'Meera told me not to have the peel I had already booked elsewhere. Six weeks was not enough time. I was annoyed for a day and grateful for the rest of it.',
    attribution: 'Sneha',
    city: 'Pune',
    packageSlug: 'atelier-experience',
    sample: true,
  },
  {
    id: 'kavya-bengaluru',
    quote:
      'Two functions in one day, two artists, and we still left for the venue eight minutes early. I have been to enough weddings to know how unusual that is.',
    attribution: 'Kavya',
    city: 'Bengaluru',
    packageSlug: 'atelier-experience',
    sample: true,
  },
  {
    id: 'farida-hyderabad',
    quote:
      'One function, one look, and they did not once try to sell me a package I did not need. The starting price on the website was the price on the invoice.',
    attribution: 'Farida',
    city: 'Hyderabad',
    packageSlug: 'essential-bride',
    sample: true,
  },
  {
    id: 'ishita-delhi',
    quote:
      'Rhea had written down exactly where every pin went at the trial. On the day she rebuilt it from her notes in forty minutes and it held until two in the morning.',
    attribution: 'Ishita',
    city: 'Delhi',
    packageSlug: 'signature-bride',
    sample: true,
  },
] as const satisfies readonly Testimonial[];
