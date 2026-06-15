// Travel Radar LK — Content Hub v2 / one-command rebuild (orchestrator)
//
// Thin wrapper: runs the existing generators in dependency order so the owner
// never has to remember the sequence or risk forgetting one (e.g. the article
// menu). It does NOT change any generator's logic — it only shells out to them.
//
//   1) build-index.mjs       <lang>            → assets/data/content-index.<code>.json
//   1b) cross-language parity check (here, not in build-index — needs all 3 indexes)
//   2) build-sections.mjs    <lang> <section>  → <folder>/content/<section>/index.html (Hub pages)
//   3) build-content-menu.mjs                  → Partials/content-menu-<folder>.html (article menu)
//   4) build-home.mjs                          → <folder>/index.html (homepage "Latest" block)
//
// Single source of truth stays i18n.mjs; this just guarantees every consumer of
// it is rebuilt together. No package.json, no build-system — one command:
//
//   node dev/generator/build-all.mjs

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, '..', '..');
const run = (script, args = []) =>
  execFileSync('node', [join(HERE, script), ...args], { stdio: 'inherit' });

// Language codes (i18n keys) and the fixed section set, mirroring the generators.
const LANGS = ['en', 'ru', 'uk'];
const SECTIONS = ['all', 'destinations', 'stay', 'things-to-do', 'weather', 'planning', 'safety', 'news'];

// Cross-language parity: one Registry record must yield an article in EVERY
// language, so all indexes must share the SAME section distribution. This replaces
// the old frozen EXPECTED_SECTIONS gate — it checks languages against each other,
// not against hard-coded counts, so the corpus can grow without code edits.
// A real mismatch (e.g. a missing translation) still fails loudly here, before hubs.
function distOf(code) {
  const idx = JSON.parse(readFileSync(join(REPO_ROOT, 'assets', 'data', `content-index.${code}.json`), 'utf8'));
  const d = {};
  for (const r of idx.records) d[r.primary_section] = (d[r.primary_section] || 0) + 1;
  return d;
}
function checkParity() {
  const dists = LANGS.map((l) => [l, distOf(l)]);
  const [refLang, ref] = dists[0];
  const keys = new Set(dists.flatMap(([, d]) => Object.keys(d)));
  const problems = [];
  for (const [lang, d] of dists.slice(1)) {
    for (const k of keys) {
      if ((d[k] || 0) !== (ref[k] || 0)) {
        problems.push(`section "${k}": ${refLang}=${ref[k] || 0} vs ${lang}=${d[k] || 0}`);
      }
    }
  }
  if (problems.length) {
    console.error(`\nFATAL: cross-language section parity mismatch (a translation is likely missing):\n - ${problems.join('\n - ')}`);
    process.exit(1);
  }
  const total = Object.values(ref).reduce((a, b) => a + b, 0);
  console.log(`\n✓ cross-language parity OK (${LANGS.join('/')} identical; ${total} records each)\n`);
}

console.log('Travel Radar LK — full rebuild (index → hubs → article menu → homepage)\n');

// 1) Indexes (sections depend on these).
for (const l of LANGS) run('build-index.mjs', [l]);

// 1b) Verify every language reproduced the same distribution before building hubs.
checkParity();

// 2) Hub pages (All + 7 sections, per language).
for (const l of LANGS) for (const s of SECTIONS) run('build-sections.mjs', [l, s]);

// 3) Article menu partials (all languages in one pass).
run('build-content-menu.mjs');

// 4) Homepage "Latest" block (all languages in one pass).
run('build-home.mjs');

console.log('\n✓ Full rebuild complete.');
