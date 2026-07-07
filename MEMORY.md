# Travel Radar LK — Project Memory

## Project Overview
Multilingual travel content site focused on Cancun/Riviera Maya, Egypt, and Turkey. Pure HTML/CSS/JS (no frameworks, no build tools). SEO-first with three languages: EN/RU/UA.

## Rules

### Image Policy (2026-06-13)
- Minimum 3 full-size images per article; usually 4-5; up to 6-7 for long/complex articles.
- All images must be full-size `article-image` (2:1 ratio).
- `photo-row` and `image-trio` blocks are **retired** — never use for article images.
- Photos come from `_dev\en-article-system\референсные_ФОТО` (reference placeholders, owner swaps later).

### Article Creation Workflow
- User provides article number/topic; AI follows `_dev\en-article-system\00_PROMPT.md`.
- Article prompt requires §0 classification checkpoint before writing.
- Always create RUN_LOG per article in `_dev\en-article-system\run-logs\`.
- Translation to RU/UA uses `_dev\en-article-system\translation-system\00_TRANSLATION_PROMPT.md`.
- Translation Gate: structural parity (block counts), UTF-8/BOM, FAQ parity, no residual `/en/` links.

### Publishing Workflow (`/publish` skill)
- Single source of truth: `dev/docs/metadata-registry.v1.json`.
- Use `node dev/generator/registry-tool.mjs` for detect/validate/insert — never hand-edit JSON.
- All three language files (EN/RU/UA) must exist before publishing.
- After build, run `node dev/generator/update-sitemap.mjs` for sitemap.
- Never modify article HTML during publishing.

### CSS Policy (2026-07-01)
- Avoid creating new CSS; consult owner first if CSS changes are needed.

## Architecture Decisions

### Registry as Single Source of Truth (2026-06-08)
- Metadata Registry v1 is the authoritative list of all articles + taxonomy.
- Per-language title/description/image/dates come from `<head>` at build time, not the Registry.

### Content Hub v2 (2026-06-08)
- Section Switcher replaces legacy article-nav on Hub pages.
- Articles still use legacy article-nav (known inconsistency).

### Monetization Structure (2026-07-06)
- `_dev/Monetization/` directory created with: README, Master Plan, Affiliate Programs, Applications, Architecture, Automation, Analytics, Decisions, Research, Templates.

## Discovered Durable Knowledge

### Article Quality Benchmarks
- Typical article scores: 8.4-8.8/10 (text 9/10, SEO 8.5-9/10, reader value 8.5-9/10, ranking probability 7-8/10).
- Key improvement patterns: comparison tables, "Who should NOT" blocks, specific price ranges, "Best for" category summaries.

### Content Cluster Strategy
- Primary focus: Cancun/Riviera Maya cluster (~95 EN articles).
- Also covers Egypt, Istanbul, general travel topics.
- Hub articles (#100+) serve as central navigation pages.

### RUN_LOG System (2026-06-10)
- Per-article RUN_LOG created for each new article.
- Language: Russian (for owner and future AI sessions).
- Tracks creation progress, translation status, quality gates.

### Translation System
- EN → RU/UA translation with structural parity checks.
- Glossary exists for consistent terminology.
- Translation Gate validates: block counts, FAQ parity, UTF-8, no residual English links.

## Patterns

### Article Creation Request Pattern
User provides: "1) создание статьи на английском / выполни промт _dev\en-article-system\00_PROMPT.md / фото не ищем а берём тут _dev\en-article-system\референсные_ФОТО / статью берём НОМЕР [number + title]"

### Quality Review Pattern
User provides: "3 лучших улучшения" with specific improvement suggestions and effect ratings (Высокий/Средний/Низкий).

## Gotchas

- `photo-row`/`image-trio` blocks are retired but still referenced in some legacy files.
- Sitemap is hand-maintained; `build-all.mjs` does NOT update it — must run `update-sitemap.mjs` separately.
- Articles are read-only during publishing — never modify HTML.
- Registry tool refuses on dictionary errors, missing language files, or duplicate slugs.
