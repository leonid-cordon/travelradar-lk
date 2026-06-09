// Travel Radar LK — Content Hub v2 / Content Menu partial generator (Stage 1)
//
// Single source: i18n.mjs (LANGS[code].switcher). Emits one partial per language
// into Partials/content-menu-<folder>.html, injected at runtime by js/load-header.js
// into the existing .article-nav-wrap anchor present in every article.
//
// Articles are NEVER modified. Hub pages already render the same switcher from the
// same i18n.mjs at build time (build-sections.mjs), so both surfaces share one source.
//
// Markup reuses the existing .site-nav / .nav-link component already styled by
// assets/css/article-content.css — no new CSS. No active state in Stage 1.
//
// The ua/uk seam is handled here: output file is named by `folder` (en/ru/ua) to
// match header-<folder>.html, while i18n is keyed by `code` (en/ru/uk).
//
// Usage:  node build-content-menu.mjs          (all languages)
//         node build-content-menu.mjs en        (single language)

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { LANGS } from './i18n.mjs';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Inner markup for .article-nav-wrap: same component the articles already style.
function renderMenu(lang) {
  const items = lang.switcher.map((s) => {
    const href = s.slug ? `/${lang.folder}/content/${s.slug}/` : `/${lang.folder}/content/`;
    return `                <a href="${href}" class="nav-link">${esc(s.label)}</a>`;
  }).join('\n');
  return `<nav class="site-nav">
            <div class="site-nav-inner">
${items}
            </div>
        </nav>
`;
}

const only = process.argv[2];
const codes = only ? [only] : Object.keys(LANGS);

console.log('Travel Radar LK — content menu partial generator\n');

for (const code of codes) {
  const lang = LANGS[code];
  if (!lang) { console.error(`FATAL: unknown language "${code}" (known: ${Object.keys(LANGS).join(', ')})`); process.exit(1); }

  const html = renderMenu(lang);
  const outRel = `Partials/content-menu-${lang.folder}.html`;
  writeFileSync(join(REPO_ROOT, outRel), html, { encoding: 'utf8' });

  // self-check: one <a> per switcher item, exactly zero active markers
  const itemCount = (html.match(/class="nav-link"/g) || []).length;
  const activeCount = (html.match(/nav-link active/g) || []).length;
  const ok = itemCount === lang.switcher.length && activeCount === 0;
  console.log(`${ok ? 'OK ' : 'FAIL'} wrote ${outRel}  (${itemCount}/${lang.switcher.length} items, ${activeCount} active)`);
  if (!ok) process.exit(1);
}
