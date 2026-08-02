# План обновления промпта: `_dev/en-article-system/00_PROMPT.md`

Этот документ описывает точные фрагменты кода, которые будут изменены в рабочем промпте генерации статей `_dev/en-article-system/00_PROMPT.md`.

## 1. Блок: HTML Строка Автора (Hero author line)
**Где находится:** Файл `_dev/en-article-system/00_PROMPT.md`, строки 388-391.

**Как есть сейчас:**
```html
Hero author line:
<p class="hero-subtitle">By <a href="/en/about" class="author-link">Leonid K.</a>, founder/editor of Travel Radar LK</p>
```

**На что мы заменим:**
Внедряем точные имена и ссылки на якоря реальных экспертов со страницы `about.html`: `Claire Bennett` (Мексика) и `Kimalie Smith` (Карибы/Доминикана).

```html
Hero author line (include reviewer based on geography):
- Mexico destinations (Cancun, Riviera Maya, Tulum, Playa del Carmen, etc.): reviewer is **Claire Bennett** (link: `/en/about#person-claire-bennett`).
- Caribbean / Dominican Republic destinations (Punta Cana, etc.): reviewer is **Kimalie Smith** (link: `/en/about#person-kimalie-smith`).

<p class="hero-subtitle">
  By <a href="/en/about#person-leonid-kadantsev" class="author-link">Leonid Kadantsev</a> &bull; 
  Reviewed by <a href="/en/about#person-[reviewer-id]" class="author-link">[Reviewer Name]</a>
</p>
```

## 2. Блок: JSON-LD ORG-схема (Author / Publisher)
**Где находится:** Файл `_dev/en-article-system/00_PROMPT.md`, строки 372-387.

**Как есть сейчас:**
```json
"author": {
  "@type": "Person", "name": "Leonid K.",
  "url": "https://travelradarlk.com/en/about",
  "affiliation": { "@type": "Organization", "name": "Travel Radar LK",
    "url": "https://travelradarlk.com" }
},
```

**На что мы заменим:**
Мы вставим полную схему массива `author` с правильными `@id`, ссылками на `about.html` и должностями для обоих лиц (Леонида и выбранного гео-эксперта).

```json
"author": [
  {
    "@type": "Person",
    "@id": "https://travelradarlk.com#person-leonid-kadantsev",
    "name": "Leonid Kadantsev",
    "url": "https://travelradarlk.com/en/about#person-leonid-kadantsev",
    "jobTitle": "Founder, Editor-in-Chief, Lead Researcher"
  },
  {
    "@type": "Person",
    "@id": "https://travelradarlk.com#person-[reviewer-id]",
    "name": "[Reviewer Name]",
    "url": "https://travelradarlk.com/en/about#person-[reviewer-id]",
    "jobTitle": "[Reviewer Job Title]"
  }
],
```
*(ИИ будет подставлять `claire-bennett` / `kimalie-smith` в зависимости от гео).*

## 3. Блок: Видимые хлебные крошки (Premium Breadcrumbs HTML)
**Где находится:** В файле `_dev/en-article-system/00_PROMPT.md` перед строкой 398 (добавим новый раздел).

**На что мы заменим (Что ДОБАВИМ):**
```html
**Visible Breadcrumbs HTML:** 
Immediately after the opening `<main>` and before the `<article>` content begins, insert the premium breadcrumbs wrapper. Use the EXACT structure below (with `<nav>`, `<ol>`, and the active page at the end).

<div class="premium-breadcrumb-wrapper">
  <nav aria-label="Breadcrumb">
    <ol class="premium-breadcrumb">
      <li>
        <a href="/en/">
          <svg class="breadcrumb-icon" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125-.504 1.125-1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75"></path></svg>
          Home
        </a>
      </li>
      <li class="separator" aria-hidden="true"></li>
      <li>
        <a href="/en/content/">Content</a>
      </li>
      <li class="separator" aria-hidden="true"></li>
      <li>
        <a href="/en/content/[primary-section]/">[Primary Section Name]</a>
      </li>
      <li class="separator" aria-hidden="true"></li>
      <li class="active" aria-current="page">[Article Title]</li>
    </ol>
  </nav>
</div>
```

## 4. Блок: Чек-лист (Final Quality Gate)
**Где находится:** Файл `_dev/en-article-system/00_PROMPT.md`, строка 507.

**Как есть сейчас:**
`- [ ] Article JSON-LD: human author Leonid K. (clickable, class="author-link"), publisher.logo,`

**На что мы заменим:**
`- [ ] Article JSON-LD: author array includes Leonid Kadantsev AND the correct reviewer (Claire Bennett or Kimalie Smith). Visible hero line includes both with correct #person- anchors.`
`- [ ] Visible HTML breadcrumbs use exact structure: <div class="premium-breadcrumb-wrapper"> with <nav>, <ol>, and <li class="active" aria-current="page">[Title]</li> at the end.`
