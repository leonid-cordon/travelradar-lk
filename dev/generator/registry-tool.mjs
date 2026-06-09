// Travel Radar LK — Registry helper for the /publish skill (deterministic primitives)
//
// This tool does the MECHANICAL, risky parts of publishing so they never depend on
// an AI getting JSON punctuation right. The AI (via /publish) decides taxonomy and
// drives the conversation; this script detects new articles and inserts records
// safely, validating against the same closed dictionaries build-index.mjs uses.
//
// It does NOT build the site — that stays `node dev/generator/build-all.mjs`.
// It does NOT modify articles. Single source of truth (Registry) is preserved;
// this only edits dev/docs/metadata-registry.v1.json in the project's exact style.
//
// Commands:
//   node registry-tool.mjs detect [--json]
//       List article slugs that have files but no Registry record, with which
//       languages are present/missing. --json prints machine-readable output.
//
//   node registry-tool.mjs validate '<json-record>'
//       Validate one record object against the dictionaries. Exit 0 = OK.
//
//   node registry-tool.mjs insert <slug> '<json-record>'
//       Validate, then insert the record under <slug> (refuses if slug exists or
//       any of the 3 language files is missing). Rewrites the file byte-stably.

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, '..', '..');
const REGISTRY_PATH = join(REPO_ROOT, 'dev', 'docs', 'metadata-registry.v1.json');

// Language folders on disk (matches i18n.mjs `folder`). slug file = <folder>/content/<slug>.html
const LANG_FOLDERS = ['en', 'ru', 'ua'];

// Closed dictionaries — kept in sync with build-index.mjs DICT and METADATA_SCHEMA_v1.md.
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

// Canonical field order for a record (matches existing records → clean diffs).
const FIELD_ORDER = ['primary_section', 'country', 'region', 'destination', 'related_destinations', 'content_type', 'tags', 'audience', 'featured', 'intent'];

function die(msg) { console.error(`FATAL: ${msg}`); process.exit(1); }

function readRegistry() {
  let raw;
  try { raw = readFileSync(REGISTRY_PATH, 'utf8'); }
  catch (e) { die(`cannot read registry: ${e.message}`); }
  let obj;
  try { obj = JSON.parse(raw); }
  catch (e) { die(`registry is not valid JSON: ${e.message}`); }
  return obj;
}

// Slugs present as files (in EN) — the EN folder is the canonical article set.
function fileSlugs() {
  const dir = join(REPO_ROOT, 'en', 'content');
  return readdirSync(dir)
    .filter((f) => f.endsWith('.html'))
    .map((f) => f.slice(0, -'.html'.length))
    // section hubs live in subfolders, not as <slug>.html — nothing to exclude here,
    // but guard against any stray index file.
    .filter((s) => s !== 'index');
}

function langsPresent(slug) {
  const present = {}, missing = [];
  for (const f of LANG_FOLDERS) {
    const ok = existsSync(join(REPO_ROOT, f, 'content', `${slug}.html`));
    present[f] = ok;
    if (!ok) missing.push(f);
  }
  return { present, missing };
}

// ── validation ──
function validateRecord(slug, r) {
  const errs = [];
  const inDict = (v, d) => DICT[d].includes(v);
  const need = (k) => { if (!(k in r)) errs.push(`missing field "${k}"`); };
  for (const k of FIELD_ORDER) need(k);

  if (r.primary_section !== undefined && !inDict(r.primary_section, 'primary_section')) errs.push(`primary_section out of dict: ${r.primary_section}`);
  if (r.primary_section === 'news') errs.push(`primary_section "news" is not in use (no v2 page)`);
  if (r.country !== undefined && !inDict(r.country, 'country')) errs.push(`country out of dict: ${r.country}`);
  if (r.region !== undefined && r.region !== null && !inDict(r.region, 'region')) errs.push(`region out of dict: ${r.region}`);
  if (r.destination !== undefined && r.destination !== null && !inDict(r.destination, 'destination')) errs.push(`destination out of dict: ${r.destination}`);
  if (r.content_type !== undefined && !inDict(r.content_type, 'content_type')) errs.push(`content_type out of dict: ${r.content_type}`);
  for (const t of r.tags || []) if (!inDict(t, 'tags')) errs.push(`tag out of vocab: ${t}`);
  for (const a of r.audience || []) if (!inDict(a, 'audience')) errs.push(`audience out of dict: ${a}`);
  if (r.intent !== undefined && r.intent !== null && !inDict(r.intent, 'intent')) errs.push(`intent out of dict: ${r.intent}`);
  for (const rd of r.related_destinations || []) if (!inDict(rd, 'destination')) errs.push(`related_destinations out of dict: ${rd}`);
  if (r.featured !== undefined && r.featured !== 0 && r.featured !== 1) errs.push(`featured must be 0 or 1`);
  if (Array.isArray(r.related_destinations) === false) errs.push(`related_destinations must be an array`);
  if (Array.isArray(r.tags) === false) errs.push(`tags must be an array`);
  if (Array.isArray(r.audience) === false) errs.push(`audience must be an array`);
  return errs;
}

// ── serializer: reproduce the project's exact on-disk style ──
// Scalars/strings via JSON.stringify; arrays use ", " between items (project style:
//   "tags": ["itinerary", "day-trips"]  ← space after comma, unlike JSON.stringify).
const j = (v) => {
  if (Array.isArray(v)) return `[${v.map((x) => JSON.stringify(x)).join(', ')}]`;
  return JSON.stringify(v);
};
function serializeRecordBody(r) {
  return FIELD_ORDER.map((k) => `${j(k)}: ${j(r[k])}`).join(', ');
}
function serializeRegistry(obj) {
  const head = [
    `  "version": ${j(obj.version)}`,
    `  "schema": ${j(obj.schema)}`,
    `  "source_of_truth": ${j(obj.source_of_truth)}`,
    `  "updated": ${j(obj.updated)}`,
    `  "note": ${j(obj.note)}`,
    `  "record_count": ${j(obj.record_count)}`,
  ];
  const slugs = Object.keys(obj.records).sort();
  const recs = slugs.map((s) => `    ${j(s)}: {\n      ${serializeRecordBody(obj.records[s])}\n    }`).join(',\n');
  return `{\n${head.join(',\n')},\n  "records": {\n${recs}\n  }\n}\n`;
}

// Normalize a parsed record to canonical field set/order (fill array/null defaults).
function normalize(r) {
  return {
    primary_section: r.primary_section,
    country: r.country,
    region: r.region ?? null,
    destination: r.destination ?? null,
    related_destinations: r.related_destinations ?? [],
    content_type: r.content_type,
    tags: r.tags ?? [],
    audience: r.audience ?? [],
    featured: r.featured ?? 0,
    intent: r.intent ?? null,
  };
}

// ── commands ──
const cmd = process.argv[2];

if (cmd === 'detect') {
  const asJson = process.argv.includes('--json');
  const reg = readRegistry();
  const known = new Set(Object.keys(reg.records));
  const news = fileSlugs().filter((s) => !known.has(s)).sort();
  const report = news.map((slug) => ({ slug, ...langsPresent(slug) }));

  if (asJson) { console.log(JSON.stringify({ new_articles: report, registry_count: known.size }, null, 2)); process.exit(0); }

  if (!report.length) { console.log(`No new articles. Registry has ${known.size} records; all EN article files are registered.`); process.exit(0); }
  console.log(`New articles not yet in Registry (${report.length}):\n`);
  for (const it of report) {
    const flags = LANG_FOLDERS.map((f) => `${f}:${it.present[f] ? '✓' : '✗'}`).join('  ');
    const note = it.missing.length ? `  ← MISSING ${it.missing.join(',')}` : '  (all 3 languages present)';
    console.log(`  ${it.slug}\n     ${flags}${note}`);
  }
  process.exit(0);
}

if (cmd === 'validate') {
  const payload = process.argv[3];
  if (!payload) die(`usage: validate '<json-record>'`);
  let r; try { r = JSON.parse(payload); } catch (e) { die(`record is not valid JSON: ${e.message}`); }
  const errs = validateRecord('(record)', r);
  if (errs.length) die(`invalid record:\n - ${errs.join('\n - ')}`);
  console.log('OK: record is valid against all dictionaries.');
  process.exit(0);
}

if (cmd === 'insert') {
  const slug = process.argv[3];
  const payload = process.argv[4];
  if (!slug || !payload) die(`usage: insert <slug> '<json-record>'`);

  const { missing } = langsPresent(slug);
  if (missing.length) die(`cannot insert "${slug}": missing language file(s): ${missing.join(', ')} (need en, ru, ua)`);

  let r; try { r = JSON.parse(payload); } catch (e) { die(`record is not valid JSON: ${e.message}`); }
  const errs = validateRecord(slug, r);
  if (errs.length) die(`invalid record for "${slug}":\n - ${errs.join('\n - ')}`);

  const reg = readRegistry();
  if (reg.records[slug]) die(`"${slug}" already exists in Registry (this is an update, not a new article — just run build-all.mjs)`);

  reg.records[slug] = normalize(r);
  reg.record_count = Object.keys(reg.records).length;

  writeFileSync(REGISTRY_PATH, serializeRegistry(reg), { encoding: 'utf8' });
  console.log(`OK: inserted "${slug}". Registry now has ${reg.record_count} records.`);
  console.log(`Next: node dev/generator/build-all.mjs`);
  process.exit(0);
}

die(`unknown command "${cmd || ''}". Use: detect | validate | insert`);
