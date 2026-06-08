// Travel Radar LK — Content Hub v2 / content-index Generator (Step 1, multilingual)
//
// Usage:  node build-index.mjs <lang>     (lang ∈ keys of LANGS, default 'en')
//
// Reads:  dev/docs/metadata-registry.v1.json   (source of truth, language-independent taxonomy)
//         <folder>/content/<slug>.html          (read-only, <head> only — per-language strings)
// Writes: assets/data/content-index.<code>.json (public runtime artifact)
//
// Articles are NEVER modified. No facets, no runtime JS.
// The Registry is language-independent; only <head> strings and labels differ per language.
//
// Confirmed extraction rules (Step 0 PASS):
//   1. JSON-LD: pick the block with @type == "Article".
//   2. title/description come from og:title / og:description.
//   3. HTML-decode extracted strings before writing.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { LANGS } from './i18n.mjs';

const SITE = 'https://travelradarlk.com';

const LANG = process.argv[2] || 'en';
const langCfg = LANGS[LANG];
if (!langCfg) {
  console.error(`FATAL: unknown language "${LANG}" (known: ${Object.keys(LANGS).join(', ')})`);
  process.exit(1);
}

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const REGISTRY_PATH = join(REPO_ROOT, 'dev', 'docs', 'metadata-registry.v1.json');
const ARTICLES_DIR = join(REPO_ROOT, langCfg.folder, 'content');
const OUT_DIR = join(REPO_ROOT, 'assets', 'data');
const OUT_PATH = join(OUT_DIR, `content-index.${langCfg.code}.json`);

// ── Closed dictionaries (mirror METADATA_SCHEMA_v1.md; not parsed from MD) ──
const DICT = {
  primary_section: ['destinations', 'stay', 'things-to-do', 'weather', 'planning', 'safety', 'news'],
  country: ['mexico', 'egypt', 'turkey', 'dominican-republic', 'caribbean', 'generic'],
  region: ['riviera-maya', 'yucatan', 'istanbul', 'red-sea', 'punta-cana'],
  destination: ['cancun', 'tulum', 'playa-del-carmen', 'cozumel', 'isla-mujeres', 'riviera-maya', 'istanbul', 'punta-cana'],
  content_type: ['guide', 'comparison', 'listicle', 'advice', 'news'],
  audience: ['family', 'couples', 'solo', 'first-timer'],
  intent: ['inspire', 'plan', 'book'],
  tags: [
    'all-inclusive', 'adults-only', 'family-resort', 'honeymoon', 'boutique-hotel',
    'cenotes', 'snorkeling', 'beaches', 'day-trips', 'theme-parks', 'archaeology', 'island-trip',
    'airport-transfer', 'flights', 'budget', 'money', 'esim', 'travel-insurance', 'visa-entry', 'itinerary', 'booking-checklist',
    'hurricane-season', 'rainy-season', 'sargassum', 'best-time',
    'neighborhoods', 'hotel-mistakes', 'scam-warning', 'food-safety',
  ],
};

// Per-language display labels for primary_section (from i18n.mjs).
const SECTION_LABELS = langCfg.sectionLabels;

// Expected section distribution (Stage 2 / Audit) — sanity gate.
// Language-independent: taxonomy lives in the shared Registry, so every language
// must reproduce the same counts.
const EXPECTED_SECTIONS = { stay: 22, planning: 11, 'things-to-do': 9, destinations: 7, weather: 5, safety: 3, news: 0 };

// ── Diagnostics ──
const errors = [];
const warnings = [];
const fail = (slug, msg) => errors.push(slug ? `[${slug}] ${msg}` : msg);
const warn = (slug, msg) => warnings.push(slug ? `[${slug}] ${msg}` : msg);

// ── HTML entity decode (named common + numeric dec/hex) ──
const NAMED = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'" };
function decodeEntities(s) {
  if (s == null) return s;
  return s.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (m, body) => {
    if (body[0] === '#') {
      const cp = body[1] === 'x' || body[1] === 'X'
        ? parseInt(body.slice(2), 16)
        : parseInt(body.slice(1), 10);
      return Number.isFinite(cp) ? String.fromCodePoint(cp) : m;
    }
    const k = body.toLowerCase();
    return k in NAMED ? NAMED[k] : m;
  });
}

// ── <head> extraction helpers ──
function headOf(html) {
  const i = html.search(/<\/head>/i);
  return i === -1 ? html : html.slice(0, i);
}
function attr(tag, name) {
  const m = tag.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`, 'i'));
  return m ? m[1] : null;
}
function metaContent(head, prop) {
  const tags = head.match(/<meta\b[^>]*>/gi) || [];
  for (const t of tags) {
    const key = attr(t, 'property') || attr(t, 'name');
    if (key && key.toLowerCase() === prop.toLowerCase()) return attr(t, 'content');
  }
  return null;
}
function canonicalOf(head) {
  const tags = head.match(/<link\b[^>]*>/gi) || [];
  for (const t of tags) {
    if ((attr(t, 'rel') || '').toLowerCase() === 'canonical') return attr(t, 'href');
  }
  return null;
}
function titleTag(head) {
  const m = head.match(/<title>([\s\S]*?)<\/title>/i);
  return m ? m[1].trim() : null;
}
// JSON-LD block whose @type is (or includes) "Article".
function articleLd(head) {
  const blocks = head.match(/<script\b[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi) || [];
  for (const b of blocks) {
    const json = b.replace(/^[\s\S]*?>/, '').replace(/<\/script>$/i, '').trim();
    let parsed;
    try { parsed = JSON.parse(json); } catch { continue; }
    const nodes = Array.isArray(parsed) ? parsed : (Array.isArray(parsed['@graph']) ? parsed['@graph'] : [parsed]);
    for (const n of nodes) {
      const t = n && n['@type'];
      const isArticle = Array.isArray(t) ? t.includes('Article') : t === 'Article';
      if (isArticle) return n;
    }
  }
  return null;
}

function buildSearchText({ title, description, destination, region, tags }) {
  const raw = [title, description, destination, region, ...(tags || [])].filter(Boolean).join(' ');
  // Keep ASCII alphanumerics + Cyrillic (U+0400–U+04FF); drop other punctuation.
  return raw.toLowerCase().replace(/[^a-z0-9Ѐ-ӿ\s-]/g, ' ').replace(/\s+/g, ' ').trim();
}

// ── Validate one registry record against closed dictionaries ──
function validateTaxonomy(slug, r) {
  const inDict = (v, d) => DICT[d].includes(v);
  if (!inDict(r.primary_section, 'primary_section')) fail(slug, `primary_section out of dict: ${r.primary_section}`);
  if (!inDict(r.country, 'country')) fail(slug, `country out of dict: ${r.country}`);
  if (r.region !== null && !inDict(r.region, 'region')) fail(slug, `region out of dict: ${r.region}`);
  if (r.destination !== null && !inDict(r.destination, 'destination')) fail(slug, `destination out of dict: ${r.destination}`);
  if (!inDict(r.content_type, 'content_type')) fail(slug, `content_type out of dict: ${r.content_type}`);
  for (const t of r.tags || []) if (!inDict(t, 'tags')) fail(slug, `tag out of vocab: ${t}`);
  for (const a of r.audience || []) if (!inDict(a, 'audience')) fail(slug, `audience out of dict: ${a}`);
  if (r.intent !== null && !inDict(r.intent, 'intent')) fail(slug, `intent out of dict: ${r.intent}`);
  if ((r.tags || []).includes('comparison')) fail(slug, `"comparison" must not be a tag (content_type only)`);
  for (const rd of r.related_destinations || []) if (!inDict(rd, 'destination')) fail(slug, `related_destinations out of dict: ${rd}`);
}

// ── Main ──
console.log(`Travel Radar LK — content-index generator (lang=${langCfg.code})\n`);

let registry;
try {
  registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'));
} catch (e) {
  console.error(`FATAL: cannot read/parse registry: ${e.message}`);
  process.exit(1);
}

const slugs = Object.keys(registry.records).sort();
const records = [];

for (const slug of slugs) {
  const r = registry.records[slug];
  validateTaxonomy(slug, r);

  const file = join(ARTICLES_DIR, `${slug}.html`);
  if (!existsSync(file)) { fail(slug, `EN article file missing: en/content/${slug}.html`); continue; }

  const head = headOf(readFileSync(file, 'utf8'));

  const canonical = canonicalOf(head);
  const ogTitle = metaContent(head, 'og:title') || titleTag(head);
  const ogDesc = metaContent(head, 'og:description') || metaContent(head, 'description');
  const ogImage = metaContent(head, 'og:image');
  const ld = articleLd(head);

  if (!canonical) fail(slug, 'missing <link rel=canonical>');
  if (!ogTitle) fail(slug, 'missing og:title / <title>');
  if (!ogDesc) fail(slug, 'missing og:description / meta description');
  if (!ld) fail(slug, 'no JSON-LD block with @type=="Article"');
  if (ld && !ld.datePublished) fail(slug, 'Article JSON-LD has no datePublished');

  let image = ogImage;
  if (!image) { warn(slug, 'missing og:image → section placeholder'); image = `${SITE}/assets/images/placeholder/${r.primary_section}.jpg`; }

  let dateModified = ld ? ld.dateModified : null;
  if (ld && !dateModified) { warn(slug, 'missing dateModified → = datePublished'); dateModified = ld.datePublished; }

  const expectedUrl = `${SITE}/${langCfg.folder}/content/${slug}`;
  if (canonical && canonical !== expectedUrl) warn(slug, `canonical != expected (${canonical})`);

  if (errors.some((e) => e.startsWith(`[${slug}]`))) continue; // skip building broken record

  const title = decodeEntities(ogTitle).trim();
  const description = decodeEntities(ogDesc).trim();

  records.push({
    slug,
    lang: langCfg.code,
    primary_section: r.primary_section,
    section_label: SECTION_LABELS[r.primary_section],
    country: r.country,
    region: r.region,
    destination: r.destination,
    related_destinations: r.related_destinations,
    content_type: r.content_type,
    tags: r.tags,
    audience: r.audience,
    featured: r.featured,
    intent: r.intent,
    title,
    description,
    url: canonical,
    image,
    date_published: ld.datePublished,
    date_modified: dateModified,
    search_text: buildSearchText({ title, description, destination: r.destination, region: r.region, tags: r.tags }),
  });
}

// ── Self-check (output sanity) ──
const dist = {};
for (const rec of records) dist[rec.primary_section] = (dist[rec.primary_section] || 0) + 1;
for (const [sec, n] of Object.entries(EXPECTED_SECTIONS)) {
  const got = dist[sec] || 0;
  if (got !== n) fail(null, `section distribution mismatch: ${sec} expected ${n}, got ${got}`);
}
const seen = new Set();
for (const rec of records) { if (seen.has(rec.slug)) fail(null, `duplicate slug in output: ${rec.slug}`); seen.add(rec.slug); }

if (errors.length) {
  console.error(`FATAL: ${errors.length} error(s), nothing written:\n - ${errors.join('\n - ')}`);
  process.exit(1);
}

// ── Emit ──
const index = {
  version: 1,
  lang: langCfg.code,
  generated_from: 'metadata-registry.v1.json',
  generated_at: new Date().toISOString(),
  count: records.length,
  records: records.sort((a, b) => (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0)),
};

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_PATH, JSON.stringify(index, null, 2) + '\n', { encoding: 'utf8' });

console.log(`OK: wrote assets/data/content-index.${langCfg.code}.json`);
console.log(`  records: ${records.length}`);
console.log(`  sections: ${Object.entries(dist).sort().map(([k, v]) => `${k}=${v}`).join(', ')}`);
console.log(`  warnings: ${warnings.length}${warnings.length ? '\n   - ' + warnings.join('\n   - ') : ''}`);
console.log(`  generated_at: ${index.generated_at}`);
