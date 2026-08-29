// Scratch tool: dump Pexels search candidates so photo ids can be curated by hand.
// Not part of the build. Run: node scripts/harvest-candidates.mjs "query" ...
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36';

// Node's fetch is refused (403) by the origin; curl with a browser UA is not.
function get(url) {
  return execFileSync(
    'curl',
    ['-sS', '--compressed', '--max-time', '45', '-A', UA, '-H', 'Accept-Language: en-US,en;q=0.9', url],
    { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
  );
}

function findPhotos(node, out, depth = 0) {
  if (!node || typeof node !== 'object' || depth > 8) return;
  if (Array.isArray(node)) {
    for (const item of node) findPhotos(item, out, depth + 1);
    return;
  }
  if (node.type === 'photo' && node.attributes && node.attributes.id) out.push(node.attributes);
  for (const key of Object.keys(node)) findPhotos(node[key], out, depth + 1);
}

const queries = process.argv.slice(2);
const rows = [];

for (const query of queries) {
  const url = `https://www.pexels.com/search/${encodeURIComponent(query)}/`;
  const html = get(url);
  const match = html.match(/<script[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!match) {
    console.error(`no payload for ${query} (${html.length} bytes)`);
    continue;
  }
  const found = [];
  findPhotos(JSON.parse(match[1]), found);
  const seen = new Set();
  for (const p of found) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    rows.push({
      query,
      id: p.id,
      w: p.width,
      h: p.height,
      ar: Number(p.aspect_ratio ?? p.width / p.height).toFixed(2),
      by: `${p.user?.first_name ?? ''} ${p.user?.last_name ?? ''}`.trim(),
      slug: p.slug,
      title: p.title,
      desc: p.description,
      tags: (p.tags ?? []).map((t) => t.name).slice(0, 8).join('|'),
    });
  }
  console.error(`${query}: ${seen.size}`);
}

writeFileSync('candidates.json', JSON.stringify(rows, null, 1));
for (const r of rows) {
  console.log(
    [r.query, r.id, `${r.w}x${r.h}`, r.ar, r.by, r.title ?? r.slug, (r.desc ?? '').slice(0, 90)].join(
      ' :: ',
    ),
  );
}
