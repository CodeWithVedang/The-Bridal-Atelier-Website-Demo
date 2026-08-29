#!/usr/bin/env node
/**
 * Deterministic editorial art generator — THE BRIDAL ATELIER
 * ---------------------------------------------------------------------------
 * There is no licensed bridal photography for a fictional brand, and the brief
 * forbids unrelated generic stock imagery. So the site ships abstract editorial
 * art, generated here into `public/atelier/`.
 *
 * Properties that matter:
 *  - Deterministic. Output is seeded from the asset id, so re-running produces
 *    byte-identical files and a diff stays clean.
 *  - Palette-locked. Every colour comes from the brand tokens in
 *    docs/BRAND_SYSTEM.md §2 — nothing here can drift from the design system.
 *  - Deliberately abstract. It can never be mistaken for a photograph of a
 *    real bride, which is the point (docs/DECISION_LOG.md D5).
 *
 * Run with: npm run art
 */

import { mkdir, writeFile, readdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'public', 'atelier');

/* ── Brand palette (docs/BRAND_SYSTEM.md §2) ────────────────────────────── */
const C = {
  ivory50: '#FDFBF7',
  ivory100: '#F8F4EC',
  ivory200: '#F1EADE',
  sand300: '#E4D9C8',
  sand400: '#D2C3AC',
  espresso900: '#2A211C',
  espresso800: '#3A2E27',
  espresso700: '#4E4038',
  stone500: '#7A6A5F',
  gold600: '#8A6D33',
  gold500: '#A9884E',
  gold200: '#E8D9BC',
  blush100: '#F3E7E3',
};

/** Duotone grounds. `ink` is always the darker of the pair. */
const SCHEMES = {
  ivory: { from: C.ivory100, to: C.ivory200, ink: C.sand400, accent: C.gold500 },
  sand: { from: C.ivory200, to: C.sand300, ink: C.stone500, accent: C.gold600 },
  gold: { from: C.gold200, to: C.ivory200, ink: C.gold600, accent: C.espresso700 },
  blush: { from: C.blush100, to: C.ivory100, ink: C.stone500, accent: C.gold500 },
  espresso: { from: C.espresso900, to: C.espresso700, ink: C.gold200, accent: C.gold500 },
};

/* ── Seeded randomness ──────────────────────────────────────────────────── */

function fnv1a(input) {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeRng(id) {
  const next = mulberry32(fnv1a(id));
  return {
    next,
    between: (min, max) => min + next() * (max - min),
    int: (min, max) => Math.floor(min + next() * (max - min + 1)),
    pick: (list) => list[Math.floor(next() * list.length)],
  };
}

/** Trim float noise so output stays small and byte-stable. */
const n = (value) => Number(value.toFixed(2));

/* ── Families ───────────────────────────────────────────────────────────────
   Seven abstract vocabularies, each a legible idea rather than a random blob:
   veil (sheer layered folds), drape (fabric columns), arch (studio doorway),
   rosette (radial ornament), filigree (interlaced line-work), portrait
   (silhouette mass, no features), texture (quiet ground).
   ───────────────────────────────────────────────────────────────────────── */

function veil({ rng, w, h, scheme }) {
  let body = '';

  // Three wide translucent sheets, each sagging like held fabric.
  for (let i = 0; i < 3; i += 1) {
    const top = h * rng.between(-0.15, 0.2);
    const sag = h * rng.between(0.3, 0.62);
    const depth = h * rng.between(0.55, 1.15);
    body +=
      `<path d="M0 ${n(top)} Q ${n(w * rng.between(0.35, 0.68))} ${n(top + sag)} ${w} ${n(top - h * 0.06)}` +
      ` L ${w} ${n(top + depth)} Q ${n(w * rng.between(0.3, 0.7))} ${n(top + depth + sag * 0.7)} 0 ${n(top + depth * 0.9)} Z"` +
      ` fill="${scheme.ink}" opacity="${n(rng.between(0.06, 0.13))}"/>`;
  }

  // Fold lines: thin arcs that follow the sheets.
  const folds = rng.int(6, 9);
  for (let i = 0; i < folds; i += 1) {
    const y = h * rng.between(0.05, 0.95);
    const lift = h * rng.between(0.06, 0.28);
    body +=
      `<path d="M${n(-w * 0.05)} ${n(y)} Q ${n(w * rng.between(0.35, 0.65))} ${n(y - lift)} ${n(w * 1.05)} ${n(y + lift * 0.4)}"` +
      ` fill="none" stroke="${i % 3 === 0 ? scheme.accent : scheme.ink}"` +
      ` stroke-width="${n(rng.between(0.6, 1.4))}" opacity="${n(rng.between(0.18, 0.4))}"/>`;
  }

  return { body };
}

function drape({ rng, w, h, scheme }) {
  const columns = rng.int(7, 11);
  const step = w / columns;
  let body = '';

  for (let i = 0; i < columns; i += 1) {
    const x = i * step;
    const bow = step * rng.between(0.25, 0.85);
    const dir = i % 2 === 0 ? 1 : -1;
    body +=
      `<path d="M${n(x)} 0 C ${n(x + bow * dir)} ${n(h * 0.34)} ${n(x - bow * dir * 0.6)} ${n(h * 0.68)} ${n(x + step * rng.between(-0.2, 0.2))} ${h}` +
      ` L ${n(x + step)} ${h} C ${n(x + step - bow * dir * 0.5)} ${n(h * 0.7)} ${n(x + step + bow * dir * 0.4)} ${n(h * 0.32)} ${n(x + step)} 0 Z"` +
      ` fill="${scheme.ink}" opacity="${n(rng.between(0.05, 0.16))}"/>`;
  }

  // A single accent seam, so the block has one focal line.
  const seam = w * rng.between(0.3, 0.7);
  body +=
    `<path d="M${n(seam)} 0 C ${n(seam + step * 0.9)} ${n(h * 0.4)} ${n(seam - step * 0.7)} ${n(h * 0.72)} ${n(seam + step * 0.2)} ${h}"` +
    ` fill="none" stroke="${scheme.accent}" stroke-width="1.25" opacity="0.5"/>`;

  return { body };
}

function arch({ rng, w, h, scheme }) {
  const rings = rng.int(3, 5);
  const cx = w * rng.between(0.42, 0.58);
  const baseline = h * rng.between(0.88, 0.96);
  const outerW = w * rng.between(0.52, 0.72);
  let body = `<path d="M0 ${n(baseline)} H ${w}" stroke="${scheme.ink}" stroke-width="1" opacity="0.35" fill="none"/>`;

  for (let i = 0; i < rings; i += 1) {
    const t = i / rings;
    const halfW = (outerW / 2) * (1 - t * 0.62);
    const top = h * (0.1 + t * 0.16);
    const springLine = baseline - (baseline - top) * 0.42;
    body +=
      `<path d="M${n(cx - halfW)} ${n(baseline)} L ${n(cx - halfW)} ${n(springLine)}` +
      ` A ${n(halfW)} ${n(springLine - top)} 0 0 1 ${n(cx + halfW)} ${n(springLine)}` +
      ` L ${n(cx + halfW)} ${n(baseline)}"` +
      ` fill="${i === rings - 1 ? scheme.accent : scheme.ink}"` +
      ` opacity="${n(i === rings - 1 ? 0.16 : rng.between(0.05, 0.1))}"` +
      ` stroke="${scheme.ink}" stroke-width="${n(rng.between(0.5, 1))}" stroke-opacity="0.3"/>`;
  }

  return { body };
}

function rosette({ rng, w, h, scheme }) {
  const cx = w / 2;
  const cy = h * rng.between(0.44, 0.56);
  const petals = rng.int(9, 15);
  const radius = Math.min(w, h) * rng.between(0.3, 0.42);
  let body = '';

  for (let i = 0; i < petals; i += 1) {
    const angle = (360 / petals) * i;
    const len = radius * rng.between(0.82, 1);
    const width = radius * rng.between(0.16, 0.26);
    body +=
      `<path transform="rotate(${n(angle)} ${n(cx)} ${n(cy)})"` +
      ` d="M${n(cx)} ${n(cy)} C ${n(cx - width)} ${n(cy - len * 0.45)} ${n(cx - width * 0.5)} ${n(cy - len)} ${n(cx)} ${n(cy - len)}` +
      ` C ${n(cx + width * 0.5)} ${n(cy - len)} ${n(cx + width)} ${n(cy - len * 0.45)} ${n(cx)} ${n(cy)} Z"` +
      ` fill="${scheme.ink}" opacity="${n(rng.between(0.07, 0.15))}"` +
      ` stroke="${scheme.accent}" stroke-width="0.6" stroke-opacity="0.35"/>`;
  }

  body += `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(radius * 0.14)}" fill="${scheme.accent}" opacity="0.4"/>`;
  for (let i = 1; i <= 2; i += 1) {
    body += `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(radius * (1 + i * 0.18))}" fill="none" stroke="${scheme.ink}" stroke-width="0.75" opacity="${n(0.28 - i * 0.08)}"/>`;
  }

  return { body };
}

function filigree({ rng, w, h, scheme }) {
  const strands = rng.int(5, 8);
  let body = '';

  for (let i = 0; i < strands; i += 1) {
    const y = h * ((i + 0.5) / strands);
    const amp = h * rng.between(0.05, 0.14);
    const waves = rng.int(2, 4);
    let d = `M0 ${n(y)}`;
    for (let k = 0; k < waves; k += 1) {
      const segment = w / waves;
      const x0 = segment * k;
      const dir = (i + k) % 2 === 0 ? -1 : 1;
      d += ` C ${n(x0 + segment * 0.3)} ${n(y + amp * dir)} ${n(x0 + segment * 0.7)} ${n(y - amp * dir)} ${n(x0 + segment)} ${n(y)}`;
    }
    body += `<path d="${d}" fill="none" stroke="${i % 2 === 0 ? scheme.ink : scheme.accent}" stroke-width="${n(rng.between(0.6, 1.1))}" opacity="${n(rng.between(0.3, 0.55))}"/>`;
  }

  // Nodes where strands appear to cross.
  const nodes = rng.int(3, 6);
  for (let i = 0; i < nodes; i += 1) {
    body += `<circle cx="${n(w * rng.between(0.1, 0.9))}" cy="${n(h * rng.between(0.1, 0.9))}" r="${n(rng.between(1.5, 3.5))}" fill="${scheme.accent}" opacity="0.45"/>`;
  }

  return { body };
}

function portrait({ rng, w, h, scheme, id }) {
  // A silhouette mass only: no features, no skin tone, nothing that could be
  // read as a photograph of a person.
  const cx = w * rng.between(0.44, 0.56);
  const headR = Math.min(w, h) * rng.between(0.15, 0.19);
  const headCy = h * rng.between(0.3, 0.36);
  const shoulderY = headCy + headR * rng.between(2.1, 2.6);
  const shoulderW = headR * rng.between(2.6, 3.4);
  const clipId = `p${fnv1a(id) % 99999}`;

  const defs = `<clipPath id="${clipId}"><rect width="${w}" height="${h}"/></clipPath>`;
  let body = `<g clip-path="url(#${clipId})">`;
  body += `<circle cx="${n(cx)}" cy="${n(headCy)}" r="${n(headR)}" fill="${scheme.ink}" opacity="0.16"/>`;
  body +=
    `<path d="M${n(cx - shoulderW)} ${h} C ${n(cx - shoulderW * 0.9)} ${n(shoulderY)} ${n(cx - headR * 0.9)} ${n(shoulderY - headR * 0.4)} ${n(cx)} ${n(shoulderY - headR * 0.5)}` +
    ` C ${n(cx + headR * 0.9)} ${n(shoulderY - headR * 0.4)} ${n(cx + shoulderW * 0.9)} ${n(shoulderY)} ${n(cx + shoulderW)} ${h} Z"` +
    ` fill="${scheme.ink}" opacity="0.16"/>`;
  // Veil arc behind the silhouette.
  body +=
    `<path d="M${n(cx - headR * 2.2)} ${h} C ${n(cx - headR * 2)} ${n(headCy)} ${n(cx - headR * 1.1)} ${n(headCy - headR * 1.5)} ${n(cx)} ${n(headCy - headR * 1.35)}` +
    ` C ${n(cx + headR * 1.1)} ${n(headCy - headR * 1.5)} ${n(cx + headR * 2)} ${n(headCy)} ${n(cx + headR * 2.2)} ${h}"` +
    ` fill="none" stroke="${scheme.accent}" stroke-width="1.1" opacity="0.5"/>`;
  body += '</g>';

  return { defs, body };
}

function texture({ rng, w, h, scheme }) {
  let body = '';
  const bands = rng.int(3, 5);
  for (let i = 0; i < bands; i += 1) {
    const y = h * rng.between(0, 0.9);
    const thickness = h * rng.between(0.04, 0.16);
    body += `<rect x="0" y="${n(y)}" width="${w}" height="${n(thickness)}" fill="${scheme.ink}" opacity="${n(rng.between(0.03, 0.07))}"/>`;
  }
  const rules = rng.int(2, 4);
  for (let i = 0; i < rules; i += 1) {
    const y = h * ((i + 1) / (rules + 1));
    body += `<path d="M0 ${n(y)} H ${w}" stroke="${scheme.accent}" stroke-width="0.75" opacity="0.28"/>`;
  }
  return { body };
}

const FAMILIES = { veil, drape, arch, rosette, filigree, portrait, texture };

/* ── SVG shell ──────────────────────────────────────────────────────────── */

function shell({ id, w, h, scheme, defs = '', body }) {
  const grainSeed = fnv1a(`${id}:grain`) % 9973;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${scheme.from}"/><stop offset="1" stop-color="${scheme.to}"/></linearGradient><filter id="n" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="${grainSeed}" result="t"/><feColorMatrix in="t" type="saturate" values="0"/></filter>${defs}</defs><rect width="${w}" height="${h}" fill="url(#g)"/>${body}<rect width="${w}" height="${h}" filter="url(#n)" opacity="0.055" style="mix-blend-mode:multiply"/></svg>`;
}

/* ── Asset specifications ───────────────────────────────────────────────────
   [ id, family, width, height, scheme ]
   Alt text lives beside each entry in src/content/images.ts — the app's single
   source of truth. tests/images.test.ts asserts the two lists never drift.
   ───────────────────────────────────────────────────────────────────────── */

const SPECS = [
  ['hero-veil', 'veil', 1200, 1500, 'sand'],
  ['journey-arch', 'arch', 1200, 800, 'ivory'],
  ['about-studio', 'arch', 1400, 900, 'sand'],
  ['about-philosophy', 'drape', 900, 1200, 'blush'],
  ['cta-drape', 'drape', 1600, 600, 'espresso'],
  ['contact-map', 'texture', 1200, 800, 'ivory'],
  ['texture-ivory', 'texture', 1600, 600, 'ivory'],

  ['service-bridal-makeup', 'rosette', 900, 1200, 'gold'],
  ['service-bridal-hair', 'drape', 900, 1200, 'sand'],
  ['service-skin-and-prep', 'texture', 900, 1200, 'blush'],
  ['service-hair-care-and-treatments', 'filigree', 900, 1200, 'ivory'],
  ['service-grooming-and-add-ons', 'arch', 900, 1200, 'sand'],

  ['look-classic-red', 'rosette', 900, 1200, 'gold'],
  ['look-ivory-pearl', 'veil', 900, 1200, 'ivory'],
  ['look-soft-glam', 'portrait', 900, 1200, 'blush'],
  ['look-modern-minimal', 'filigree', 900, 1200, 'sand'],

  ['artist-ananya-mehta', 'portrait', 800, 1000, 'sand'],
  ['artist-rhea-kapoor', 'portrait', 800, 1000, 'blush'],
  ['artist-meera-shah', 'portrait', 800, 1000, 'ivory'],

  ['portfolio-jaipur-courtyard', 'arch', 1000, 1250, 'gold'],
  ['portfolio-ivory-morning', 'veil', 1000, 1250, 'ivory'],
  ['portfolio-monsoon-mehendi', 'filigree', 1000, 1400, 'sand'],
  ['portfolio-coastal-sangeet', 'drape', 1000, 1250, 'blush'],
  ['portfolio-heirloom-red', 'rosette', 1000, 1250, 'gold'],
  ['portfolio-terrace-reception', 'portrait', 1000, 1250, 'espresso'],
  ['portfolio-temple-vows', 'arch', 1000, 1250, 'sand'],
  ['portfolio-champagne-engagement', 'veil', 1000, 1400, 'gold'],
  ['portfolio-desert-haldi', 'texture', 1000, 1250, 'sand'],
  ['portfolio-winter-nikah', 'drape', 1000, 1250, 'ivory'],
  ['portfolio-garden-christian', 'filigree', 1000, 1250, 'blush'],
  ['portfolio-studio-portrait', 'portrait', 1000, 1250, 'ivory'],

  ['before-soft-glam', 'texture', 900, 1200, 'ivory'],
  ['after-soft-glam', 'portrait', 900, 1200, 'blush'],
  ['before-classic-red', 'texture', 900, 1200, 'sand'],
  ['after-classic-red', 'rosette', 900, 1200, 'gold'],
  ['before-modern-minimal', 'texture', 900, 1200, 'blush'],
  ['after-modern-minimal', 'filigree', 900, 1200, 'sand'],

  ['instagram-01', 'rosette', 600, 600, 'gold'],
  ['instagram-02', 'veil', 600, 600, 'ivory'],
  ['instagram-03', 'drape', 600, 600, 'sand'],
  ['instagram-04', 'filigree', 600, 600, 'blush'],
  ['instagram-05', 'arch', 600, 600, 'sand'],
  ['instagram-06', 'portrait', 600, 600, 'ivory'],
  ['instagram-07', 'texture', 600, 600, 'gold'],
  ['instagram-08', 'rosette', 600, 600, 'blush'],
];

/* ── Runner ─────────────────────────────────────────────────────────────── */

async function main() {
  const ids = new Set();
  for (const [id] of SPECS) {
    if (ids.has(id)) throw new Error(`Duplicate asset id: ${id}`);
    ids.add(id);
  }

  await mkdir(OUT_DIR, { recursive: true });

  // Remove art that is no longer specified, so a deleted asset does not linger
  // in `public/` and get deployed forever.
  const existing = await readdir(OUT_DIR).catch(() => []);
  const expected = new Set([...SPECS.map(([id]) => `${id}.svg`), 'index.json']);
  for (const file of existing) {
    if (!expected.has(file)) {
      await rm(path.join(OUT_DIR, file));
      process.stdout.write(`  removed  ${file}\n`);
    }
  }

  const manifest = [];

  for (const [id, familyName, w, h, schemeName] of SPECS) {
    const family = FAMILIES[familyName];
    if (!family) throw new Error(`Unknown family "${familyName}" for ${id}`);
    const scheme = SCHEMES[schemeName];
    if (!scheme) throw new Error(`Unknown scheme "${schemeName}" for ${id}`);

    const rng = makeRng(id);
    const { defs = '', body } = family({ rng, w, h, scheme, id });
    const svg = shell({ id, w, h, scheme, defs, body });

    await writeFile(path.join(OUT_DIR, `${id}.svg`), svg, 'utf8');
    manifest.push({ id, family: familyName, width: w, height: h, scheme: schemeName });
  }

  await writeFile(
    path.join(OUT_DIR, 'index.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );

  process.stdout.write(
    `Generated ${manifest.length} editorial art files in public/atelier/\n`,
  );
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
