/**
 * Imports studio-supplied original photographs into `public/photography/`.
 *
 *   node scripts/import-local-photography.mjs
 *   node scripts/import-local-photography.mjs --from "D:/PROJECT - VEDANGS/photos"
 *   node scripts/import-local-photography.mjs --force
 *
 * The site's other photographs are licensed editorial images pulled by
 * `fetch-photography.mjs` from pinned Pexels ids. A handful are not: the
 * before/after pairs are matched originals supplied with the project, where the
 * same subject is photographed twice under one setup. No stock library can
 * provide that, and faking it with two different faces would be the one thing a
 * comparison slider must not do.
 *
 * Those originals live outside the repository (they are large PNGs), so this
 * script is the seam: it reads them from `--from`, centre-crops each to the exact
 * box `src/content/images.ts` declares, and writes a progressive JPEG at the
 * manifest id. Only the derived JPEG is committed, which is the same contract the
 * fetched photographs follow — one file per id, at the declared size.
 *
 * `sharp` is resolved from `node_modules` (Next ships it for image optimisation).
 * This is an asset step, not a build step: nothing in `npm run verify` calls it,
 * so a machine without sharp can still lint, test and build.
 */
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { LOCAL_CREDIT, LOCAL_PHOTOGRAPHY } from './photography-local.mjs';

const OUT_DIR = join(process.cwd(), 'public', 'photography');
const FORCE = process.argv.includes('--force');

const fromFlag = process.argv.indexOf('--from');
const FROM = resolve(
  fromFlag !== -1 && process.argv[fromFlag + 1]
    ? process.argv[fromFlag + 1]
    : join(process.cwd(), '..', 'photos'),
);

/** JPEG quality. 82 with mozjpeg holds skin tone on a face at this size. */
const QUALITY = 82;

let sharp;
try {
  ({ default: sharp } = await import('sharp'));
} catch {
  process.stderr.write(
    'sharp is not available. It ships with next for image optimisation; run `npm install` first.\n',
  );
  process.exit(1);
}

if (!existsSync(FROM)) {
  process.stderr.write(
    `Source folder not found: ${FROM}\n` +
      'Pass it explicitly, e.g. --from "D:/PROJECT - VEDANGS/photos".\n',
  );
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });

const available = new Set(readdirSync(FROM));
const failures = [];
let written = 0;

for (const [id, sourceFile, width, height] of LOCAL_PHOTOGRAPHY) {
  const target = join(OUT_DIR, `${id}.jpg`);

  if (!available.has(sourceFile)) {
    // A missing original is only a problem if the derived JPEG is missing too:
    // the committed file is what the site actually serves.
    if (existsSync(target)) {
      process.stdout.write(`  = ${id}  (original absent, committed JPEG kept)\n`);
    } else {
      failures.push({ id, reason: `original not found: ${sourceFile}` });
      process.stdout.write(`  ! ${id}  original not found: ${sourceFile}\n`);
    }
    continue;
  }

  if (!FORCE && existsSync(target) && statSync(target).size > 1024) {
    process.stdout.write(`  = ${id}\n`);
    continue;
  }

  try {
    const source = join(FROM, sourceFile);
    const meta = await sharp(source).metadata();
    if (meta.width < width || meta.height < height) {
      throw new Error(`original is ${meta.width}×${meta.height}, smaller than ${width}×${height}`);
    }

    await sharp(source)
      // `cover` + centre keeps the head and shoulders of a centred subject and
      // trims the surplus width, rather than squashing a landscape frame.
      .resize(width, height, { fit: 'cover', position: 'centre', withoutEnlargement: true })
      .jpeg({ quality: QUALITY, progressive: true, mozjpeg: true, chromaSubsampling: '4:4:4' })
      .toFile(target);

    const bytes = statSync(target).size;
    written += 1;
    process.stdout.write(`  + ${id}  ${width}×${height}  ${(bytes / 1024).toFixed(0)} KB\n`);
  } catch (error) {
    failures.push({ id, reason: error instanceof Error ? error.message : String(error) });
    process.stdout.write(`  ! ${id}  ${failures.at(-1).reason}\n`);
  }
}

process.stdout.write(
  `\n${written} written, ${LOCAL_PHOTOGRAPHY.length} declared, credited as "${LOCAL_CREDIT.source}".\n` +
    'Run `node scripts/fetch-photography.mjs` afterwards to refresh public/photography/index.json.\n',
);

if (failures.length) {
  process.stdout.write(`${failures.length} failed: ${failures.map((f) => f.id).join(', ')}\n`);
  process.exitCode = 1;
}
