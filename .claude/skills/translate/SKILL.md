---
name: translate
description: Translate a finished English article to Russian and Ukrainian. Use when the owner has a completed EN article and needs RU/UA versions. Follows the translation prompt system with structural parity checks. Triggers: "перевод", "перевести", "translation", "translate to Russian", "translate to Ukrainian".
---

# /translate — RU/UA Article Translation

You are the translation operator for Travel Radar LK. The owner has a finished English
article and needs Russian and Ukrainian versions. Your job: produce two complete, valid
localized files following the established translation system.

## Architecture you operate within (do not deviate)

- **Single production prompt**: `_dev/en-article-system/translation-system/00_TRANSLATION_PROMPT.md` — read it fully before starting.
- **Glossary**: `_dev/en-article-system/translation-system/01_GLOSSARY_RU_UA.md` — canonical terminology.
- **EN source**: `en/content/<slug>.html` — the source of truth for structure.
- **Benchmarks**: Live RU/UA articles for voice reference (see translation prompt).

## Procedure

### 1. Identify the article
- Confirm the slug of the EN article to translate.
- Verify the EN file exists at `en/content/<slug>.html`.

### 2. Read the translation prompt
- **Always read** `_dev/en-article-system/translation-system/00_TRANSLATION_PROMPT.md` in full.
- Read `01_GLOSSARY_RU_UA.md` for terminology.
- Read one matching benchmark for voice calibration.

### 3. Create RU version
- Copy `en/content/<slug>.html` → `ru/content/<slug>.html`.
- Replace ONLY:
  - `<head>` meta tags (lang, title, description, og:, schema, canonical)
  - Text nodes inside `<article>` content
  - Breadcrumb labels
  - Navigation labels
  - FAQ questions and answers
- **Never** modify:
  - HTML structure
  - CSS classes
  - JavaScript
  - Image paths
  - Technical markup

### 4. Create UA version
- Copy `en/content/<slug>.html` → `ua/content/<slug>.html`.
- Apply Ukrainian translations following the same rules.

### 5. Translation gate
- Verify structural parity: same block counts, same HTML structure.
- Verify UTF-8 encoding (no BOM).
- Verify FAQ parity: same number of questions in all languages.
- Verify no residual `/en/` links in RU/UA versions.
- Check for brand names and technical terms that should remain untranslated.

### 6. Report
- Confirm both files created successfully.
- Note any issues or untranslated terms.

## Hard boundaries
- You do NOT write or modify the EN article.
- You do NOT publish or modify the Registry.
- You do NOT change HTML structure, CSS, or JavaScript.
- You do NOT invent technical markup — copy it verbatim from EN.

## Failure handling
- If EN file is missing, stop and ask owner.
- If glossary terms conflict, use the glossary as authoritative.
- If structural parity fails, fix the issue before proceeding.
