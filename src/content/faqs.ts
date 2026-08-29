import type { Faq } from '@/types/content';

/**
 * Twelve questions across four topics (docs/CONTENT_SPEC.md §2).
 *
 * Answers are written to be genuinely useful in isolation, because this is the
 * content most likely to be surfaced as a search snippet — and because `FAQPage`
 * JSON-LD is emitted from it (docs/SEO_SPEC.md §4). Every answer is a real
 * answer: none of them ends in "contact us to find out".
 */

export const faqs = [
  {
    id: 'how-far-ahead',
    topic: 'booking',
    question: 'How far ahead should I book?',
    answer:
      'Six to nine months for a November-to-February wedding, three to four months outside that window. The constraint is artist availability on your specific date, not preparation time — though a full skin or hair course needs about three months of its own.',
    order: 1,
  },
  {
    id: 'is-a-deposit-needed',
    topic: 'booking',
    question: 'Do I have to pay anything to enquire?',
    answer:
      'No. The consultation is free and no payment is taken through this website. A booking is confirmed after the consultation, in writing, with the terms and the figure stated before anything is due.',
    order: 2,
  },
  {
    id: 'date-already-taken',
    topic: 'booking',
    question: 'What happens if my date is already taken?',
    answer:
      'We tell you at the date check rather than after a consultation. If the lead artist is unavailable but a second artist is free, we say which artist it would be and you decide. We do not accept a booking we cannot staff.',
    order: 3,
  },
  {
    id: 'which-package',
    topic: 'packages',
    question: 'Which package do I need?',
    answer:
      'Count your functions. One function is The Essential Bride, up to three is The Signature Bride, and up to five with a bridal party is The Atelier Experience. If two functions fall on the same day, you need two artists regardless of the count.',
    order: 4,
  },
  {
    id: 'what-changes-the-price',
    topic: 'packages',
    question: 'Why is the price a starting figure?',
    answer:
      'Six things move it: the number of functions, how close together they fall, the size of your bridal party, travel, whether you take preparation courses, and nothing else. All six are listed on the packages page so you can estimate before you enquire.',
    order: 5,
  },
  {
    id: 'can-i-mix-packages',
    topic: 'packages',
    question: 'Can I add one thing to a smaller package instead of moving up?',
    answer:
      'Usually yes. Draping, an extra party look or a second trial can be added to The Essential Bride. A second artist cannot be added to it, because that changes the shape of the whole day and belongs in the larger packages.',
    order: 6,
  },
  {
    id: 'when-is-the-trial',
    topic: 'trial',
    question: 'When does the trial happen?',
    answer:
      'About six weeks before the wedding. Earlier than that and your skin and hair will have changed by the day; later and there is no room to adjust anything we get wrong.',
    order: 7,
  },
  {
    id: 'what-to-bring-to-trial',
    topic: 'trial',
    question: 'What should I bring to the trial?',
    answer:
      'Photographs of your outfit, the jewellery if you have it, and any hair accessory you intend to wear. Come with clean, dry hair washed the evening before, and no makeup. Allow three hours.',
    order: 8,
  },
  {
    id: 'if-i-dislike-the-trial',
    topic: 'trial',
    question: 'What if I do not like the trial result?',
    answer:
      'Say so in the room. That is what the appointment is for, and adjusting it there costs nothing. If the direction is wrong rather than the detail, a second trial can be added at any package level.',
    order: 9,
  },
  {
    id: 'how-long-on-the-morning',
    topic: 'day-of',
    question: 'How long does the wedding morning take?',
    answer:
      'Between two and a half and three hours for hair and makeup together, plus draping. Your written timeline gives the exact call time, working backwards from when the photographer needs you.',
    order: 10,
  },
  {
    id: 'does-the-artist-stay',
    topic: 'day-of',
    question: 'Does the artist stay after the look is finished?',
    answer:
      'Yes, for the hours in your package — four in The Essential Bride, six per function in The Signature Bride, and until the ceremony ends in The Atelier Experience. Touch-ups during that time are included.',
    order: 11,
  },
  {
    id: 'travel-and-outstation',
    topic: 'day-of',
    question: 'Do you travel to the venue?',
    answer:
      'Yes. Within city limits is included in every package. Outstation is quoted at cost and agreed in writing before booking; The Atelier Experience includes one venue within 250 km.',
    order: 12,
  },
] as const satisfies readonly Faq[];

export const faqTopics = [
  { id: 'booking', label: 'Booking' },
  { id: 'packages', label: 'Packages' },
  { id: 'trial', label: 'The trial' },
  { id: 'day-of', label: 'On the day' },
] as const satisfies readonly { id: Faq['topic']; label: string }[];

export const faqsByTopic = (topic: Faq['topic']): readonly Faq[] =>
  faqs.filter((faq) => faq.topic === topic);
