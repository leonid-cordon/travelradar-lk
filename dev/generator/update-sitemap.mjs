// Travel Radar LK — sitemap incremental updater
//
// Adds any published article that is NOT yet in sitemap.xml, as a trio of
// <url> entries (en, ru, ua) appended before </urlset>. It NEVER regenerates
// the whole file: the 70+ structural URLs (home, /about, country pages, section
// hubs) and their historical <lastmod> values are left untouched.
//
// Why this design:
//   - sitemap.xml is hand-maintained and holds historical <lastmod> for pages
//     that have no date in the Registry. A full regen would lose those dates or
//     stamp everything "today", which is a bad signal to search engines.
//   - The article list + dates already exist in assets/data/content-index.en.json
//     (built by build-index.mjs from each article's <head> datePublished), so we
//     read THAT — no HTML parsing, same source of truth as the rest of the system.
//
// Idempotent: an article counts as "present" if its slug appears anywhere in the
// file (not just at the end), so re-running adds nothing. New articles are sorted
// oldest→newest by date_published, then appended in trios (en/ru/ua per article).
//
//   node dev/generator/update-sitemap.mjs
//
// Run it AFTER build-all.mjs (it consumes the freshly built content-index).

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, '..', '..');
const SITEMAP_PATH = join(REPO_ROOT, 'sitemap.xml');
const INDEX_PATH = join(REPO_ROOT, 'assets', 'data', 'content-index.en.json');
const ORIGIN = 'https://travelradarlk.com';
// URL path segments per language. Note: the Ukrainian web path is /ua/ to match
// the file tree, even though its i18n language code elsewhere is "uk".
const LANG_SEGMENTS = ['en', 'ru', 'ua'];

function fail(msg) {
  console.error(`\nFATAL: ${msg}`);
  process.exit(1);
}

// --- read inputs ---------------------------------------------------------------
let index;
try {
  index = JSON.parse(readFileSync(INDEX_PATH, 'utf8'));
} catch {
  fail(`cannot read ${INDEX_PATH} — run "node dev/generator/build-all.mjs" first.`);
}
if (!Array.isArray(index.records)) fail('content-index.en.json has no records array.');

let sitemap = readFileSync(SITEMAP_PATH, 'utf8');
const closing = '</urlset>';
if (!sitemap.includes(closing)) fail('sitemap.xml has no </urlset> closing tag.');

// Match the file's existing line ending (sitemap.xml is CRLF on this Windows repo);
// writing LF into a CRLF file would create mixed endings and a noisy git diff.
const EOL = sitemap.includes('\r\n') ? '\r\n' : '\n';

// --- compute the missing articles ---------------------------------------------
// "Present" = slug appears ANYWHERE in the file (robust to manual reordering),
// not merely at the tail. Uniqueness of the slug is guaranteed by registry-tool.
const articles = index.records
  .filter((r) => r.slug && r.date_published)
  .map((r) => ({ slug: r.slug, date: r.date_published }));

const missing = articles
  .filter((a) => !sitemap.includes(`/content/${a.slug}`))
  // oldest → newest, so multiple new articles append in chronological order;
  // tie-break by slug for a deterministic result.
  .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0));

if (missing.length === 0) {
  console.log(`Travel Radar LK — sitemap updater\n\n✓ already up to date (no new articles; ${articles.length} articles tracked).`);
  process.exit(0);
}

// --- build and insert the new trios -------------------------------------------
const trioFor = ({ slug, date }) =>
  LANG_SEGMENTS.map(
    (seg) =>
      `  <url>${EOL}    <loc>${ORIGIN}/${seg}/content/${slug}</loc>${EOL}    <lastmod>${date}</lastmod>${EOL}  </url>${EOL}`
  ).join('');

const block = missing.map(trioFor).join('');
sitemap = sitemap.replace(closing, `${block}${closing}`);
writeFileSync(SITEMAP_PATH, sitemap);

// --- report --------------------------------------------------------------------
console.log('Travel Radar LK — sitemap updater\n');
for (const a of missing) console.log(`  + ${a.slug}  (${a.date})  → en/ru/ua`);
console.log(`\n✓ added ${missing.length} article(s), ${missing.length * 3} URLs, before </urlset>.`);
