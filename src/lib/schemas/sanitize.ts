import { z } from 'zod';

/**
 * Input sanitisation, shared by the client and the server (docs/SECURITY_SPEC.md §2).
 *
 * Four things happen to every free-text field, in this order:
 *
 *  1. **Length is bounded before any work is done.** A 5 MB string is rejected
 *     rather than normalised — Unicode normalisation on unbounded input is a
 *     cheap way to burn server CPU.
 *  2. **NFKC normalisation.** Without it, visually identical strings compare
 *     unequal, and full-width or compatibility characters can slip past a naive
 *     filter downstream.
 *  3. **Control characters become spaces.** This is the one that matters most
 *     here: the API handlers write a structured log line per request, and a
 *     newline or carriage return inside a submitted value would let a caller
 *     forge a second log entry. Removing C0/C1 removes the whole class.
 *  4. **Invisible and direction-changing characters are dropped.** Zero-width
 *     joiners and bidi overrides have no legitimate use in a name or a city and
 *     are the standard homograph vector.
 *
 * Note what is deliberately *not* done: no HTML escaping and no tag stripping.
 * Nothing on this site renders a submitted string into the DOM, and escaping at
 * the input boundary corrupts the stored value while providing no protection at
 * the point that would actually matter. Escaping belongs at output, next to
 * whatever consumes the data.
 *
 * The character classes are expressed as code points rather than as regex
 * escapes so the source file stays pure ASCII and reviewable — a regex literal
 * full of invisible characters is exactly the kind of code nobody can audit.
 */

const TAB = 0x09;
const LF = 0x0a;
const CR = 0x0d;
const LF_CHAR = String.fromCharCode(LF);
const CR_CHAR = String.fromCharCode(CR);

/**
 * Soft hyphen, zero-width space/joiners, bidirectional overrides, word joiner,
 * invisible operators, deprecated formatting controls, and the byte-order mark.
 */
const INVISIBLE: readonly (readonly [number, number])[] = [
  [0x00ad, 0x00ad],
  [0x200b, 0x200f],
  [0x202a, 0x202e],
  [0x2060, 0x2064],
  [0x2066, 0x2069],
  [0x206a, 0x206f],
  [0xfeff, 0xfeff],
];

function isInvisible(code: number): boolean {
  for (const [from, to] of INVISIBLE) {
    if (code >= from && code <= to) return true;
  }
  return false;
}

/** C0 (0x00–0x1F), DEL (0x7F) and C1 (0x80–0x9F). */
function isControl(code: number): boolean {
  return code <= 0x1f || code === 0x7f || (code >= 0x80 && code <= 0x9f);
}

function scrub(value: string, keepBreaks: boolean): string {
  let out = '';
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    if (isInvisible(code)) continue;
    if (isControl(code)) {
      out += keepBreaks && (code === LF || code === TAB) ? char : ' ';
      continue;
    }
    out += char;
  }
  return out;
}

export function sanitizeText(value: string): string {
  return scrub(value.normalize('NFKC'), false).replace(/\s+/g, ' ').trim();
}

/**
 * Same, but paragraph breaks survive — a message field is allowed to have them.
 * Every other control character still goes, so a log line still cannot be forged
 * from a stray carriage return.
 */
export function sanitizeMultiline(value: string): string {
  const unified = value
    .normalize('NFKC')
    .split(CR_CHAR + LF_CHAR)
    .join(LF_CHAR)
    .split(CR_CHAR)
    .join(LF_CHAR);

  const lines = scrub(unified, true)
    .split(LF_CHAR)
    .map((line) => line.replace(/\s+/g, ' ').trim());

  // Collapse any run of blank lines to a single one, so a submitted wall of
  // empty lines cannot pad the stored value.
  const collapsed: string[] = [];
  for (const line of lines) {
    if (line === '' && collapsed[collapsed.length - 1] === '') continue;
    collapsed.push(line);
  }

  return collapsed.join(LF_CHAR).trim();
}

/* ── Zod field builders ──────────────────────────────────────────────────────
   Every builder bounds raw length *first*, sanitises second, and validates the
   sanitised value third. Messages are supplied by the caller so they can be
   written in the voice of the form rather than Zod's defaults, and so the same
   string is shown inline and in the error summary.
   ───────────────────────────────────────────────────────────────────────── */

/** A required, sanitised single-line field. */
export function text(options: {
  readonly min: number;
  readonly max: number;
  readonly required: string;
  readonly tooShort?: string;
  readonly tooLong: string;
}) {
  return z
    .string({ error: options.required })
    .max(options.max * 4, { error: options.tooLong })
    .transform(sanitizeText)
    .pipe(
      z
        .string()
        .min(options.min, { error: options.tooShort ?? options.required })
        .max(options.max, { error: options.tooLong }),
    );
}

/** An optional, sanitised single-line field. Blank normalises to `null`. */
export function optionalText(max: number, tooLong: string) {
  return z
    .string()
    .max(max * 4, { error: tooLong })
    .transform(sanitizeText)
    .pipe(z.string().max(max, { error: tooLong }))
    .transform((value) => (value.length > 0 ? value : null));
}

/** An optional, sanitised multi-line field. Blank normalises to `null`. */
export function optionalMultiline(max: number, tooLong: string) {
  return z
    .string()
    .max(max * 4, { error: tooLong })
    .transform(sanitizeMultiline)
    .pipe(z.string().max(max, { error: tooLong }))
    .transform((value) => (value.length > 0 ? value : null));
}
