// Travel Radar LK — Content Hub v2 / Section Page Generator (Step 2, EN, weather)
//
// Reads:  assets/data/content-index.en.json   (the public runtime artifact from Step 1)
// Writes: en/content/<section>/index.html      (pre-rendered, static, no runtime JS)
//
// Articles are NEVER modified. Cards are baked into HTML (visible without JS).
// Reuses existing conventions: body[data-page="content"] + content-index.css,
// #site-header / #site-footer partials via /js/load-header.js. No new CSS file.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const INDEX_PATH = join(REPO_ROOT, 'assets', 'data', 'content-index.en.json');

const SITE = 'https://travelradarlk.com';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Human labels for geo badges (closed vocab → display).
const GEO = {
  mexico: 'Mexico', egypt: 'Egypt', turkey: 'Turkey', 'dominican-republic': 'Dominican Republic', caribbean: 'Caribbean', generic: '',
  'riviera-maya': 'Riviera Maya', yucatan: 'Yucatán', istanbul: 'Istanbul', 'red-sea': 'Red Sea', 'punta-cana': 'Punta Cana',
  cancun: 'Cancun', tulum: 'Tulum', 'playa-del-carmen': 'Playa del Carmen', cozumel: 'Cozumel', 'isla-mujeres': 'Isla Mujeres',
};

// Per-section hard-coded config (only weather built in this MVP step).
const SECTIONS = {
  weather: {
    slug: 'weather',
    label: 'Weather & Seasons',
    titleTag: 'Mexico Weather & Seasons: When to Visit Cancun, Tulum & the Riviera Maya | Travel Radar LK',
    ogTitle: 'Mexico Weather & Seasons: When to Visit Cancun, Tulum & the Riviera Maya',
    description: 'When to visit Cancun, Tulum and the Riviera Maya — dry vs rainy season, hurricane risk, sargassum timing and the best months to book.',
    h1: 'Weather & Seasons',
    subtitle: 'When to go to Mexico — and when to think twice',
    heroImage: '/assets/images/hero/hero-desktop_2400x1350.jpg',
    heroAlt: "Weather and seasons across Mexico's Caribbean coast",
    intro: [
      'Mexico has no bad season — only trade-offs. These guides show when Cancun, Tulum and the Riviera Maya get the best weather, when prices spike, and when hurricanes and sargassum are most likely.',
      'Use them to pick the right month before you book.',
    ],
  },
};

const TARGET = process.argv[2] || 'weather';

// ── helpers ──
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const rootRel = (url) => url.replace(/^https?:\/\/[^/]+/, '');
const geo = (key) => (key && GEO[key]) || '';

function renderCard(r) {
  const href = `/en/content/${r.slug}`;
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

function renderPage(cfg, recs) {
  // sort: featured desc, then date_published desc
  recs = [...recs].sort((a, b) =>
    (b.featured - a.featured) ||
    (a.date_published < b.date_published ? 1 : a.date_published > b.date_published ? -1 : 0));

  const count = recs.length;
  const maxMod = recs.reduce((m, r) => (r.date_modified > m ? r.date_modified : m), recs[0].date_modified);
  const [y, mo] = maxMod.split('-');
  const metaLine = `${count} ${count === 1 ? 'guide' : 'guides'} • Updated ${MONTHS[+mo - 1]} ${y}`;

  const url = `${SITE}/en/content/${cfg.slug}/`;
  const heroImageAbs = `${SITE}${cfg.heroImage}`;

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: cfg.label,
    headline: cfg.ogTitle,
    description: cfg.description,
    url,
    inLanguage: 'en-US',
    isPartOf: { '@type': 'WebSite', name: 'Travel Radar LK', url: `${SITE}/` },
    publisher: { '@type': 'Organization', name: 'Travel Radar LK' },
    image: heroImageAbs,
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/en/` },
      { '@type': 'ListItem', position: 2, name: 'Content', item: `${SITE}/en/content/` },
      { '@type': 'ListItem', position: 3, name: cfg.label, item: url },
    ],
  };

  const cards = recs.map(renderCard).join('\n\n');

  return `<!DOCTYPE html>
<html lang="en">

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
    <meta property="og:locale" content="en_US">

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
</head>

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

    <!-- Breadcrumb -->
    <nav class="container" aria-label="Breadcrumb" style="padding-top:1rem;font-size:.85rem;color:var(--ci-muted);">
        <a href="/en/" style="color:inherit;text-decoration:none;">Home</a>
        <span aria-hidden="true"> › </span>
        <a href="/en/content/" style="color:inherit;text-decoration:none;">Content</a>
        <span aria-hidden="true"> › </span>
        <span aria-current="page">${esc(cfg.label)}</span>
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
            </div>

            <p style="margin:1.8rem 0 0;">
                <a href="/en/content/" style="color:var(--ci-accent);text-decoration:none;font-weight:500;">← All content</a>
            </p>
        </div>
    </section>

    <div id="site-footer"></div>

    <script src="/js/load-header.js"></script>
</body>

</html>
`;
}

// ── main ──
console.log('Travel Radar LK — section page generator (EN, MVP)\n');

const cfg = SECTIONS[TARGET];
if (!cfg) { console.error(`FATAL: no section config for "${TARGET}"`); process.exit(1); }

let index;
try { index = JSON.parse(readFileSync(INDEX_PATH, 'utf8')); }
catch (e) { console.error(`FATAL: cannot read content-index.en.json (run build-index first): ${e.message}`); process.exit(1); }

const recs = index.records.filter((r) => r.primary_section === TARGET);
if (!recs.length) { console.error(`FATAL: 0 records for section "${TARGET}" in index`); process.exit(1); }

const html = renderPage(cfg, recs);

const outDir = join(REPO_ROOT, 'en', 'content', cfg.slug);
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, 'index.html');
writeFileSync(outPath, html, { encoding: 'utf8' });

// ── self-check ──
const back = readFileSync(outPath, 'utf8');
const cardCount = (back.match(/class="content-card"/g) || []).length;
const checks = [
  [cardCount === recs.length, `cards rendered: ${cardCount}/${recs.length}`],
  [back.includes(`<link rel="canonical" href="${SITE}/en/content/${cfg.slug}/">`), 'canonical present'],
  [back.includes('id="site-header"') && back.includes('id="site-footer"'), 'header/footer placeholders present'],
  [back.includes('data-page="content"'), 'data-page="content" set'],
  [back.includes('/js/load-header.js'), 'partial loader linked'],
];
const failed = checks.filter(([ok]) => !ok);

console.log(`OK: wrote en/content/${cfg.slug}/index.html`);
console.log(`  section: ${cfg.label}`);
console.log(`  records: ${recs.length} (sorted featured→date)`);
for (const [ok, msg] of checks) console.log(`  ${ok ? '✓' : '✗'} ${msg}`);
if (failed.length) { console.error(`FATAL: ${failed.length} self-check(s) failed`); process.exit(1); }
