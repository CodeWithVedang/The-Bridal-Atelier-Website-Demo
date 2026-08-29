/**
 * Downloads every pinned photograph in `scripts/photography-sources.mjs` into
 * `public/photography/`, then writes a provenance manifest beside them.
 *
 *   node scripts/fetch-photography.mjs          # skip files already present
 *   node scripts/fetch-photography.mjs --force  # re-download everything
 *
 * Self-hosting rather than hot-linking is a deliberate decision:
 *
 *  - `next/image` can only optimise (and serve AVIF/WebP for) files it can
 *    reach locally without an allow-listed remote pattern.
 *  - Nothing on the rendered page then points at a third-party origin, which is
 *    what lets the privacy page keep saying no external asset is requested.
 *  - A pinned id plus a committed file means the build cannot break because a
 *    remote search result moved.
 *
 * Every response is checked for HTTP 200, a JPEG content type *and* the JPEG
 * magic bytes before it is written, so a rate-limit page or an error document
 * can never land on disk as a `.jpg`.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { PHOTOGRAPHY } from './photography-sources.mjs';
import { LOCAL_CREDIT, LOCAL_PHOTOGRAPHY } from './photography-local.mjs';

const OUT_DIR = join(process.cwd(), 'public', 'photography');
const FORCE = process.argv.includes('--force');

// The CDN answers Node's fetch without complaint, but curl is what the harvest
// step already proved against this origin, so both steps use the same client.
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36';

/** Pexels' delivery URL. `fit=crop` centre-crops to the exact box we ask for. */
const url = (pexelsId, width, height) =>
  `https://images.pexels.com/photos/${pexelsId}/pexels-photo-${pexelsId}.jpeg` +
  `?auto=compress&cs=tinysrgb&fit=crop&w=${width}&h=${height}`;

function download(target, source) {
  const meta = execFileSync(
    'curl',
    ['-sS', '-L', '--max-time', '90', '-A', UA, '-o', target, '-w', '%{http_code} %{content_type}', source],
    { encoding: 'utf8' },
  ).trim();

  const [status, contentType = ''] = meta.split(/\s+/);
  if (status !== '200') throw new Error(`HTTP ${status}`);
  if (!contentType.startsWith('image/jpeg')) throw new Error(`content-type ${contentType}`);

  // A rate-limit or error body can arrive with a 200; the magic bytes cannot lie.
  const head = readFileSync(target).subarray(0, 3);
  if (head[0] !== 0xff || head[1] !== 0xd8 || head[2] !== 0xff) throw new Error('not a JPEG');

  return statSync(target).size;
}

mkdirSync(OUT_DIR, { recursive: true });

const entries = [];
const failures = [];

for (const [id, pexelsId, width, height, photographer, subject] of PHOTOGRAPHY) {
  const file = join(OUT_DIR, `${id}.jpg`);
  const source = url(pexelsId, width, height);
  let bytes;

  if (!FORCE && existsSync(file) && statSync(file).size > 1024) {
    bytes = statSync(file).size;
    process.stdout.write(`  = ${id}\n`);
  } else {
    try {
      bytes = download(file, source);
      process.stdout.write(`  + ${id}  ${(bytes / 1024).toFixed(0)} KB\n`);
    } catch (error) {
      rmSync(file, { force: true });
      failures.push({ id, pexelsId, reason: error instanceof Error ? error.message : String(error) });
      process.stdout.write(`  ! ${id}  ${failures.at(-1).reason}\n`);
      continue;
    }
  }

  entries.push({
    id,
    file: `/photography/${id}.jpg`,
    width,
    height,
    bytes,
    subject,
    credit: { photographer, source: 'Pexels', licence: 'Pexels licence', page: `https://www.pexels.com/photo/${pexelsId}/` },
  });
}

/**
 * The studio-supplied originals are already on disk — `import-local-photography.mjs`
 * derived them from PNGs that live outside the repository. They still belong in
 * the manifest, because `index.json` is what the credits page reads: an entry
 * missing from it would silently drop a photograph out of the attribution list.
 * Their credit is deliberately not a Pexels one.
 */
function localEntries() {
  const rows = [];
  for (const [id, , width, height, subject] of LOCAL_PHOTOGRAPHY) {
    const file = join(OUT_DIR, `${id}.jpg`);
    if (!existsSync(file)) {
      failures.push({ id, pexelsId: null, reason: 'studio original not imported' });
      process.stdout.write(`  ! ${id}  studio original not imported\n`);
      continue;
    }
    process.stdout.write(`  · ${id}  (studio original)\n`);
    rows.push({
      id,
      file: `/photography/${id}.jpg`,
      width,
      height,
      bytes: statSync(file).size,
      subject,
      credit: { ...LOCAL_CREDIT },
    });
  }
  return rows;
}

entries.push(...localEntries());

writeFileSync(
  join(OUT_DIR, 'index.json'),
  `${JSON.stringify(
    {
      generatedBy: 'scripts/fetch-photography.mjs',
      note: 'Provenance for every photograph on the site. Replace a file with real studio work at the same id and dimensions, and remove its row from scripts/photography-sources.mjs.',
      licence:
        'Most photographs are used under the Pexels licence (free to use, attribution not required, modification permitted) and credited here regardless. Rows credited to a studio original were supplied with the project and are not Pexels images.',
      count: entries.length,
      photographs: entries,
    },
    null,
    2,
  )}\n`,
);

process.stdout.write(
  `\n${entries.length}/${PHOTOGRAPHY.length + LOCAL_PHOTOGRAPHY.length} photographs in public/photography/\n`,
);
if (failures.length) {
  process.stdout.write(`${failures.length} failed: ${failures.map((f) => f.id).join(', ')}\n`);
  process.exitCode = 1;
}
