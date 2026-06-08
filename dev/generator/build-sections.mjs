// Travel Radar LK — Content Hub v2 / Section Page Generator (Step 2, multilingual)
//
// Usage:  node build-sections.mjs <lang> <section>
//           lang    ∈ keys of LANGS (en, ru, …)
//           section ∈ all | destinations | stay | things-to-do | weather | planning | safety
//
// Reads:  assets/data/content-index.<code>.json   (the public runtime artifact from Step 1)
// Writes: <folder>/content/<section>/index.html    (pre-rendered, static, no runtime JS)
//
// Articles are NEVER modified. Cards are baked into HTML (visible without JS).
// Reuses existing conventions: body[data-page="content"] + content-index.css,
// #site-header / #site-footer partials via /js/load-header.js. No new CSS file.
// All display text comes from i18n.mjs; only GEO badges stay Latin (shared below).

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { LANGS, pluralGuides } from './i18n.mjs';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

const SITE = 'https://travelradarlk.com';
const HERO_IMAGE = '/assets/images/hero/hero-desktop_2400x1350.jpg';

// Human labels for geo badges (closed vocab → display). Intentionally Latin for
// every language (deferred localization decision); shared across all languages.
const GEO = {
  mexico: 'Mexico', egypt: 'Egypt', turkey: 'Turkey', 'dominican-republic': 'Dominican Republic', caribbean: 'Caribbean', generic: '',
  'riviera-maya': 'Riviera Maya', yucatan: 'Yucatán', istanbul: 'Istanbul', 'red-sea': 'Red Sea', 'punta-cana': 'Punta Cana',
  cancun: 'Cancun', tulum: 'Tulum', 'playa-del-carmen': 'Playa del Carmen', cozumel: 'Cozumel', 'isla-mujeres': 'Isla Mujeres',
};

// Structural section metadata (language-invariant): slug + showcase flag.
// All display copy lives in i18n.mjs (LANGS[lang].sections[<key>]).
// `news` (0 records) stays on its legacy page and is handled separately.
const STRUCT = {
  all: { slug: '', isShowcase: true },
  destinations: { slug: 'destinations' },
  stay: { slug: 'stay' },
  'things-to-do': { slug: 'things-to-do' },
  weather: { slug: 'weather' },
  planning: { slug: 'planning' },
  safety: { slug: 'safety' },
};

// ── CLI args ──
const LANG = process.argv[2] || 'en';
const TARGET = process.argv[3] || 'weather';

const lang = LANGS[LANG];
if (!lang) {
  console.error(`FATAL: unknown language "${LANG}" (known: ${Object.keys(LANGS).join(', ')})`);
  process.exit(1);
}
const INDEX_PATH = join(REPO_ROOT, 'assets', 'data', `content-index.${lang.code}.json`);

// Section switcher — fixed order shared by All + every section; labels from i18n.
// For other languages only the labels and the /<folder>/ path prefix change, not
// the order or structure. `news` is intentionally absent (0 records, no v2 page).
const SWITCHER = lang.switcher;

const MONTHS = lang.months;

// ── helpers ──
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const rootRel = (url) => url.replace(/^https?:\/\/[^/]+/, '');
const geo = (key) => (key && GEO[key]) || '';

function renderCard(r) {
  const href = `/${lang.folder}/content/${r.slug}`;
  const img = rootRel(r.image);
  const c1 = geo(r.country);
  const c2 = geo(r.destination || r.region);
  const badges = [c1, c2].filter(Boolean)
    .map((b) => `                        <span class="content-category">${esc(b)}</span>`).join('\n');
  return `                <a href="${href}" class="content-card">
                    <div class="content-image">
                        <img src="${img}" width="1200" height="600" alt="${esc(r.title)}" loading="lazy">
                    </div>
                    <div class="content-body">
${badges}
                        <h3 class="content-title">${esc(r.title)}</h3>
                        <p class="content-excerpt">${esc(r.description)}</p>
                    </div>
                </a>`;
}

// Section switcher markup (same `quick-nav` component as legacy, new v2 items).
// `activeSlug` = cfg.slug ('' for the All showcase) → marks the current tab.
function renderSwitcher(activeSlug) {
  const items = SWITCHER.map((s) => {
    const href = s.slug ? `/${lang.folder}/content/${s.slug}/` : `/${lang.folder}/content/`;
    const isActive = s.slug === activeSlug;
    const cls = `quick-nav-item${isActive ? ' active' : ''}`;
    const cur = isActive ? ' aria-current="page"' : '';
    return `                <a href="${href}" class="${cls}"${cur}>${esc(s.label)}</a>`;
  }).join('\n');
  return `    <!-- Section switcher -->
    <section class="quick-nav">
        <div class="container">
            <nav class="quick-nav-list" aria-label="${esc(lang.ui.sectionsAria)}">
${items}
            </nav>
        </div>
    </section>

`;
}

function renderPage(cfg, recs) {
  // sort: featured desc, then date_published desc
  recs = [...recs].sort((a, b) =>
    (b.featured - a.featured) ||
    (a.date_published < b.date_published ? 1 : a.date_published > b.date_published ? -1 : 0));

  const count = recs.length;
  const maxMod = recs.reduce((m, r) => (r.date_modified > m ? r.date_modified : m), recs[0].date_modified);
  const [y, mo] = maxMod.split('-');
  const metaLine = `${count} ${pluralGuides(lang.code, count)} • ${lang.ui.updated} ${MONTHS[+mo - 1]} ${y}`;

  const url = cfg.isShowcase ? `${SITE}/${lang.folder}/content/` : `${SITE}/${lang.folder}/content/${cfg.slug}/`;
  const heroImageAbs = `${SITE}${cfg.heroImage}`;

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: cfg.label,
    headline: cfg.ogTitle,
    description: cfg.description,
    url,
    inLanguage: lang.inLanguage,
    isPartOf: { '@type': 'WebSite', name: 'Travel Radar LK', url: `${SITE}/` },
    publisher: { '@type': 'Organization', name: 'Travel Radar LK' },
    image: heroImageAbs,
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: cfg.isShowcase
      ? [
          { '@type': 'ListItem', position: 1, name: lang.ui.home, item: `${SITE}/${lang.folder}/` },
          { '@type': 'ListItem', position: 2, name: cfg.label, item: url },
        ]
      : [
          { '@type': 'ListItem', position: 1, name: lang.ui.home, item: `${SITE}/${lang.folder}/` },
          { '@type': 'ListItem', position: 2, name: lang.ui.contentRoot, item: `${SITE}/${lang.folder}/content/` },
          { '@type': 'ListItem', position: 3, name: cfg.label, item: url },
        ],
  };

  // hreflang block (showcase only); empty string keeps thematic sections byte-identical.
  const hreflang = cfg.hreflang
    ? Object.entries(cfg.hreflang).map(([k, v]) => `    <link rel="alternate" hreflang="${k}" href="${v}">`).join('\n') + '\n'
    : '';

  // Breadcrumb trail: showcase is 2-level (Home › Content); sections are 3-level.
  const breadcrumbNav = cfg.isShowcase
    ? `<a href="/${lang.folder}/" style="color:inherit;text-decoration:none;">${esc(lang.ui.home)}</a>
        <span aria-hidden="true"> › </span>
        <span aria-current="page">${esc(cfg.label)}</span>`
    : `<a href="/${lang.folder}/" style="color:inherit;text-decoration:none;">${esc(lang.ui.home)}</a>
        <span aria-hidden="true"> › </span>
        <a href="/${lang.folder}/content/" style="color:inherit;text-decoration:none;">${esc(lang.ui.contentRoot)}</a>
        <span aria-hidden="true"> › </span>
        <span aria-current="page">${esc(cfg.label)}</span>`;

  // back-link is omitted on the showcase (it is the all-content page).
  const backLink = cfg.isShowcase ? '' : `

            <p style="margin:1.8rem 0 0;">
                <a href="/${lang.folder}/content/" style="color:var(--ci-accent);text-decoration:none;font-weight:500;">${esc(lang.ui.backAll)}</a>
            </p>`;

  const switcher = renderSwitcher(cfg.slug);

  const cards = recs.map(renderCard).join('\n\n');

  return `<!DOCTYPE html>
<html lang="${lang.htmlLang}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="index, follow">
    <meta name="site-base" content="">

    <title>${esc(cfg.titleTag)}</title>
    <meta name="description" content="${esc(cfg.description)}">
    <link rel="canonical" href="${url}">

    <meta property="og:title" content="${esc(cfg.ogTitle)}">
    <meta property="og:description" content="${esc(cfg.description)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${url}">
    <meta property="og:image" content="${heroImageAbs}">
    <meta property="og:site_name" content="Travel Radar LK">
    <meta property="og:locale" content="${lang.ogLocale}">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${esc(cfg.ogTitle)}">
    <meta name="twitter:description" content="${esc(cfg.description)}">
    <meta name="twitter:image" content="${heroImageAbs}">

    <script type="application/ld+json">
${JSON.stringify(collectionLd, null, 4)}
    </script>
    <script type="application/ld+json">
${JSON.stringify(breadcrumbLd, null, 4)}
    </script>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=Inter:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap"
        rel="stylesheet">

    <link rel="icon" type="image/x-icon" href="/favicon.ico?v=3">

    <link rel="stylesheet" href="/theme.css">
    <link rel="stylesheet" href="/assets/css/base.css">
    <link rel="stylesheet" href="/assets/css/header.css">
    <link rel="stylesheet" href="/assets/css/footer.css">
    <link rel="stylesheet" href="/assets/css/pages/content-index.css">

    <script>
        (function () {
            const theme = localStorage.getItem('theme') || 'dark';
            document.documentElement.setAttribute('data-theme', theme);
        })();
    </script>
${hreflang}</head>

<body data-page="content">

    <div id="site-header"></div>

    <!-- Hero -->
    <section class="content-hero">
        <div class="hero-image-container">
            <img src="${cfg.heroImage}" width="2400" height="1350" alt="${esc(cfg.heroAlt)}" class="hero-image">
            <div class="hero-overlay"></div>

            <div class="container hero-content-wrapper">
                <div class="hero-content">
                    <h1 class="hero-title">${esc(cfg.h1)}</h1>
                    <p class="hero-subtitle">${esc(cfg.subtitle)}</p>
                    <p class="hero-meta" style="margin:.6rem 0 0;font-size:.82rem;font-weight:500;letter-spacing:.03em;color:rgba(255,255,255,.74);">${esc(metaLine)}</p>
                </div>
            </div>
        </div>
    </section>

${switcher}    <!-- Breadcrumb -->
    <nav class="container" aria-label="Breadcrumb" style="padding-top:1rem;font-size:.85rem;color:var(--ci-muted);">
        ${breadcrumbNav}
    </nav>

    <!-- Intro -->
    <section class="content-section content-intro-section">
        <div class="container">
            <div class="article-summary--note">
${cfg.intro.map((p) => `                <p>${esc(p)}</p>`).join('\n')}
            </div>
        </div>
    </section>

    <!-- Cards -->
    <section class="content-section">
        <div class="container">
            <div class="destinations-grid">
${cards}
            </div>${backLink}
        </div>
    </section>

    <div id="site-footer"></div>

    <script src="/js/load-header.js"></script>
</body>

</html>
`;
}

// ── main ──
console.log(`Travel Radar LK — section page generator (lang=${lang.code}, section=${TARGET})\n`);

const struct = STRUCT[TARGET];
const text = lang.sections[TARGET];
if (!struct || !text) { console.error(`FATAL: no section config for "${TARGET}" in lang "${lang.code}"`); process.exit(1); }
const cfg = { ...struct, ...text, heroImage: HERO_IMAGE };

let index;
try { index = JSON.parse(readFileSync(INDEX_PATH, 'utf8')); }
catch (e) { console.error(`FATAL: cannot read content-index.${lang.code}.json (run build-index ${lang.code} first): ${e.message}`); process.exit(1); }

const recs = cfg.isShowcase
  ? index.records.slice()
  : index.records.filter((r) => r.primary_section === TARGET);
if (!recs.length) { console.error(`FATAL: 0 records for section "${TARGET}" in index`); process.exit(1); }

const html = renderPage(cfg, recs);

const outDir = join(REPO_ROOT, lang.folder, 'content', cfg.slug);
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, 'index.html');
writeFileSync(outPath, html, { encoding: 'utf8' });

// ── self-check ──
const back = readFileSync(outPath, 'utf8');
const cardCount = (back.match(/class="content-card"/g) || []).length;
const expectCanonical = cfg.isShowcase ? `${SITE}/${lang.folder}/content/` : `${SITE}/${lang.folder}/content/${cfg.slug}/`;
const outRel = cfg.isShowcase ? `${lang.folder}/content/index.html` : `${lang.folder}/content/${cfg.slug}/index.html`;
const checks = [
  [cardCount === recs.length, `cards rendered: ${cardCount}/${recs.length}`],
  [back.includes(`<link rel="canonical" href="${expectCanonical}">`), 'canonical present'],
  [back.includes('id="site-header"') && back.includes('id="site-footer"'), 'header/footer placeholders present'],
  [back.includes('data-page="content"'), 'data-page="content" set'],
  [back.includes('/js/load-header.js'), 'partial loader linked'],
  [!cfg.hreflang || (back.match(/rel="alternate" hreflang=/g) || []).length === Object.keys(cfg.hreflang).length, 'hreflang alternates present'],
  [(back.match(/class="quick-nav-item/g) || []).length === SWITCHER.length, `section switcher: ${SWITCHER.length} items`],
  [(back.match(/quick-nav-item active"/g) || []).length === 1, 'section switcher: exactly one active'],
];
const failed = checks.filter(([ok]) => !ok);

console.log(`OK: wrote ${outRel}`);
console.log(`  section: ${cfg.label}`);
console.log(`  records: ${recs.length} (sorted featured→date)`);
for (const [ok, msg] of checks) console.log(`  ${ok ? '✓' : '✗'} ${msg}`);
if (failed.length) { console.error(`FATAL: ${failed.length} self-check(s) failed`); process.exit(1); }
