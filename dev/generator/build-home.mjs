// Travel Radar LK — Content Hub v2 / Homepage "Latest" block generator (multilingual)
//
// Usage:  node build-home.mjs [lang]      lang ∈ keys of LANGS (default: all three)
//
// Reads:  assets/data/content-index.<code>.json   (public runtime artifact)
// Writes: <folder>/index.html  — ONLY the region between the marker comments:
//             <!-- AUTO:latest:start -->  …N newest cards…  <!-- AUTO:latest:end -->
//         Everything else on the homepage (hero, country cards, About, the future
//         curated "Start here" block) is never touched. Idempotent.
//
// Card markup matches the existing homepage cards byte-for-byte (same classes and
// indentation) so the only diff between runs is which articles appear. Articles
// are NEVER modified. Chip 1 = localized country, chip 2 = section_label (already
// localized in the index).

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { LANGS } from './i18n.mjs';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

const N = 9;                       // newest articles shown on the homepage
const INDENT = '                '; // 16 spaces — matches existing card indentation

// Chip 1: localized country names. Homepage keeps these localized (unlike the Hub
// pages, which render geo badges in Latin). `generic` → no chip (filtered out).
const COUNTRY = {
  mexico:  { en: 'Mexico', ru: 'Мексика', uk: 'Мексика' },
  egypt:   { en: 'Egypt',  ru: 'Египет',  uk: 'Єгипет'  },
  turkey:  { en: 'Turkey', ru: 'Турция',  uk: 'Туреччина' },
  generic: { en: '',       ru: '',        uk: ''        },
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function renderCard(r, code) {
  const country = (COUNTRY[r.country] && COUNTRY[r.country][code]) || '';
  const chips = [country, r.section_label].filter(Boolean)
    .map((c) => `${INDENT}        <span class="content-category">${esc(c)}</span>`).join('\n');
  return `${INDENT}<a href="content/${r.slug}" class="content-card">
${INDENT}    <div class="content-image">
${INDENT}        <img src="../assets/images/content/${r.slug}/card_1200x600.jpg" width="1200" height="600" alt="${esc(r.title)}" loading="lazy">
${INDENT}    </div>

${INDENT}    <div class="content-body">
${chips}

${INDENT}        <h3 class="content-title">
${INDENT}            ${esc(r.title)}
${INDENT}        </h3>

${INDENT}        <p class="content-excerpt">
${INDENT}            ${esc(r.description)}
${INDENT}        </p>
${INDENT}    </div>
${INDENT}</a>`;
}

function buildLang(key) {
  const lang = LANGS[key];
  const indexPath = join(REPO_ROOT, 'assets', 'data', `content-index.${lang.code}.json`);
  const htmlPath = join(REPO_ROOT, lang.folder, 'index.html');

  let index;
  try { index = JSON.parse(readFileSync(indexPath, 'utf8')); }
  catch (e) { console.error(`FATAL [${lang.code}]: cannot read content-index.${lang.code}.json (run build-index first): ${e.message}`); process.exit(1); }

  // Newest first by date_published; stable tie-break on slug.
  const recs = [...index.records]
    .sort((a, b) =>
      (a.date_published < b.date_published ? 1 : a.date_published > b.date_published ? -1 : 0) ||
      (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0))
    .slice(0, N);
  if (recs.length < N) { console.error(`FATAL [${lang.code}]: only ${recs.length} records, need ${N}`); process.exit(1); }

  let html;
  try { html = readFileSync(htmlPath, 'utf8'); }
  catch (e) { console.error(`FATAL [${lang.code}]: cannot read ${lang.folder}/index.html: ${e.message}`); process.exit(1); }

  const re = /<!-- AUTO:latest:start -->[\s\S]*?<!-- AUTO:latest:end -->/;
  if (!re.test(html)) { console.error(`FATAL [${lang.code}]: AUTO:latest markers not found in ${lang.folder}/index.html`); process.exit(1); }

  const cards = recs.map((r) => renderCard(r, lang.code)).join('\n\n');
  const block = `<!-- AUTO:latest:start -->\n${cards}\n${INDENT}<!-- AUTO:latest:end -->`;
  const out = html.replace(re, block);

  writeFileSync(htmlPath, out, { encoding: 'utf8' });

  // ── self-check ──
  const back = readFileSync(htmlPath, 'utf8');
  const region = back.match(re)[0];
  const cardCount = (region.match(/class="content-card"/g) || []).length;
  const badAlt = /alt="(Изображение статьи|Зображення статті|Article image)"/.test(region);
  const checks = [
    [cardCount === N, `cards rendered: ${cardCount}/${N}`],
    [!badAlt, 'no placeholder alt text'],
    [back.includes('<!-- AUTO:latest:start -->') && back.includes('<!-- AUTO:latest:end -->'), 'markers preserved'],
    [(back.match(/AUTO:latest:start/g) || []).length === 1, 'exactly one start marker'],
  ];
  const failed = checks.filter(([ok]) => !ok);
  console.log(`OK: ${lang.folder}/index.html — newest ${N} (${recs[0].slug} … ${recs[N - 1].slug})`);
  for (const [ok, msg] of checks) console.log(`  ${ok ? '✓' : '✗'} ${msg}`);
  if (failed.length) { console.error(`FATAL [${lang.code}]: ${failed.length} self-check(s) failed`); process.exit(1); }
}

// ── main ──
const only = process.argv[2];
const keys = only ? [only] : ['en', 'ru', 'uk'];
for (const k of keys) {
  if (!LANGS[k]) { console.error(`FATAL: unknown language "${k}" (known: ${Object.keys(LANGS).join(', ')})`); process.exit(1); }
}
console.log(`Travel Radar LK — homepage "Latest" generator (N=${N})\n`);
for (const k of keys) buildLang(k);
console.log('\n✓ Homepage latest blocks rebuilt.');
