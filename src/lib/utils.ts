/**
 * Small shared helpers. Everything here is pure and has no DOM dependency, so
 * it is safe in a Server Component, a Client Component and a test alike.
 */

/**
 * Rupee formatting for published investment figures.
 *
 * `en-IN` gives the lakh/crore grouping an Indian reader expects (₹1,65,000,
 * not ₹165,000). Fraction digits are dropped because every published figure in
 * `content/packages.ts` is a whole number of rupees and trailing `.00` reads
 * like a checkout total rather than a starting investment.
 */
const rupeeFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function formatRupees(amount: number): string {
  return rupeeFormatter.format(amount);
}

/** `150` → `2 hr 30 min`. Used for service durations, never for prices. */
export function formatDuration(minutes: number): string {
  if (minutes <= 0) return 'Quoted per booking';
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  if (rest === 0) return `${hours} hr`;
  return `${hours} hr ${rest} min`;
}

/**
 * `2027-02-14` → `14 February 2027`.
 *
 * Takes the ISO string apart by hand rather than constructing a `Date`. `new
 * Date('2027-02-14')` is parsed as UTC midnight and then formatted in the local
 * zone, which renders the previous day for anyone west of Greenwich. This
 * function has no timezone behaviour at all, which is what a wedding date wants.
 */
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

export function formatIsoDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  const [, year, month, day] = match;
  const monthName = MONTHS[Number(month) - 1];
  if (!monthName) return iso;
  return `${Number(day)} ${monthName} ${year}`;
}

/** Today in the same `YYYY-MM-DD` shape, for `min` attributes and comparisons. */
export function todayIso(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Whole days between two `YYYY-MM-DD` strings. Negative when `to` is earlier. */
export function daysBetweenIso(from: string, to: string): number {
  const a = Date.parse(`${from}T00:00:00Z`);
  const b = Date.parse(`${to}T00:00:00Z`);
  if (Number.isNaN(a) || Number.isNaN(b)) return 0;
  return Math.round((b - a) / 86_400_000);
}

/** Stable list joiner: `a`, `a and b`, `a, b and c`. */
export function joinWithAnd(items: readonly string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0] as string;
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

/** `Bridal Makeup` → `bridal-makeup`. Only used on authored content, never input. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
