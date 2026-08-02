# Travel Radar LK — EN Article Production Prompt

**This is the single production prompt for creating one English article (`en/content/<slug>.html`).**
Read it start to finish. All editorial knowledge, rules, doctrine, SEO, schema, and affiliate
logic you need are **inside this file**. The other files in this folder are pulled only when
needed (see the map below).

> **Scope:** EN article *creation* only. Translation (RU/UA), the Registry, hub/menu/index
> pages, cards, and sitemap are handled **after** you by the owner via `/publish` →
> `build-all`. Your deliverable is one complete, valid EN file. See **Handoff** at the end.
>
> **Working language with the owner:** Russian. **Article content:** native American English (en-US).

---

## SYSTEM MAP — what to read and when

**Inside this folder (`_dev/en-article-system/`):**
| File | Read it… | What it is |
|---|---|---|
| `00_PROMPT.md` (this file) | **always, fully** | All rules + doctrine + the Final Quality Gate |
| `ROADMAP.md` (and `ROADMAP_PART2.md`, etc.) | at the start | What to write next (article backlog). Search ALL roadmap parts! |
| `01_BLOCKS.md` | when assembling HTML | Canonical block library; also the CSS-class catalog *by example* |
| `02_QA_CHECKLIST.md` | before finishing (deep QA) | Optional selective editorial QA — go deeper than the Gate when the page is important |
| `BENCHMARK_commercial_best-honeymoon-resorts.html` | as a quality reference | Canonical **commercial** exemplar (quality/voice/depth/block-usage) — **not a template**; see the Benchmarks note below |
| `BENCHMARK_non-commercial_best-time-to-visit-tulum.html` | as a quality reference | Canonical **non-commercial** exemplar (quality/voice/depth/block-usage) — **not a template**; see the Benchmarks note below |
| `run-logs/NNNN-<slug>.md` | create at start, keep current | Per-article working journal & resume point (one per article) — see **PER-ARTICLE TRACKING** below |

**Living sources of truth — OUTSIDE this folder, referenced only, never copied here:**
| Path | Why it stays external |
|---|---|
| `assets/css/article-content.css` | The rendering truth. Open only to debug a visual issue — don't duplicate it. |
| `_dev/runbooks/affiliate/03-affiliate-link-placements.md` | The live affiliate-link registry (owner-maintained CJ URLs). Always check it before inserting any affiliate CTA. |
| A published EN article (optional) | Sanity-check the live `<head>`/schema *shape* only if needed. Note: published articles still carry **legacy breadcrumbs and some inline styles** — prefer the cleaned local `BENCHMARK_*` files, and always follow §7 for breadcrumbs. |

**Benchmarks = quality reference, NOT a template.** Two cleaned local exemplars live in this
folder — `BENCHMARK_commercial_best-honeymoon-resorts.html` and
`BENCHMARK_non-commercial_best-time-to-visit-tulum.html`. Read the one matching your article's
class to calibrate **quality, depth, voice, editorial level and block usage**. Do **NOT** copy
from a benchmark: breadcrumbs, schema values, affiliate URLs, inline CSS, `width`/`height`
attributes, or the article structure as a whole. Structure is dictated by *your* topic, the
system rules, and the real classes in `article-content.css` / `01_BLOCKS.md`. Never invent a
class name or add inline CSS because a benchmark appears to.

**CSS rule:** work only within `article-content.css`. No new CSS, no inline CSS, no old CSS
files (`article-rich.css`, `article-v2.css`, `article.css`, `content.css`). Don't invent
class names (inside `stat-row` the card is `stat-item`, never `stat-card`) — use the classes
exactly as they appear in `01_BLOCKS.md`. Don't modify `article-content.css` or
`article-image-viewer.js` without explicit owner approval.

**Windows / UTF-8 safety:** files are multilingual UTF-8. Console mojibake in PowerShell is a
*display* artifact, not corruption. Before editing, confirm the file decodes as UTF-8
(`python -c "open('file.html','rb').read().decode('utf-8')"`); if it decodes, don't "fix
encoding." Don't write multilingual text via PowerShell here-strings. Make one minimal,
verified edit — not a series of repair attempts. Save without BOM.

---

## MISSION

Travel Radar LK is a **travel decision system**, not an SEO machine or affiliate catalog.
Every article must help the reader decide, reduce pre-booking uncertainty, explain trade-offs
honestly, and build trust.

**Priorities:** 1) traveler usefulness · 2) decision clarity · 3) semantic completeness ·
4) trust · 5) monetization. SEO is an acquisition tool, not the goal.

**Natural variability is expected.** Articles need not match in length, rhythm, or block
structure — the topic dictates the shape. AI Search increasingly penalizes synthetic,
over-uniform structure; natural unevenness is a plus. The *only* things that don't vary are
production standards (CSS, schema, images, affiliate) — those are strict.

**Self-adaptation:** this document is direction, not a cage. If you see a stronger structure,
a more natural flow, or better semantic/AI-Search practice for a specific article, adapt it —
and tell the owner with a short rationale. Free to change: philosophy and content approach.
Only with explicit approval: production standards (CSS, schema, affiliate, images).

---

## ARTICLE TYPES

- **Informational** — explain/teach (weather, transport, safety, costs).
- **Comparison** — choose with trade-offs (Cancun vs Tulum, family vs adults-only).
- **Synthesis** — tie a cluster together, build topical authority (Riviera Maya Explained).
- **Hotel Decision** — help pick a hotel, explain hotel logic, manage expectations.

Weak: "Cancun is beautiful and has many beaches." Strong: who it suits and who it doesn't,
which areas, where it's quieter, where seaweed risk is higher, where logistics are simpler.

---

## PRE-WORK CHECKLIST

- [ ] Which article am I writing? (read `ROADMAP.md` and all its parts like `ROADMAP_PART2.md`; no duplicate — not direct, not semantic
      overlap, not keyword cannibalization)
- [ ] What is the reader trying to decide or avoid? What are they comparing? What do they fear
      getting wrong?
- [ ] Type: Informational / Comparison / Synthesis / Hotel Decision?
- [ ] Affiliate workflow needed? (hotel / resort / where-to-stay intent → yes)
- [ ] Any changeable facts? (prices, transport, rules, access, safety → verify sources)
- [ ] Read the matching local benchmark (`BENCHMARK_commercial_*` / `BENCHMARK_non-commercial_*`)
      as a quality/voice reference — not a structure to copy?

---

# EDITORIAL DOCTRINE (core — preserve in spirit and rigor)

## DECISION-FIRST TRAVEL WRITING
Articles are not hotel catalogs or generic destination guides. The primary goal is helping the
traveler avoid the wrong booking, reducing uncertainty before paying, explaining trade-offs
honestly, and preventing expectation mismatch. A strong article does NOT try to make every area
sound good for everyone — it explains who should avoid a place, why certain travelers regret
certain bookings, and what kind of vacation the reader is actually buying. It functions as a
decision system, not a list of options.

## REGRET PREVENTION FRAMEWORK
The most valuable travel content prevents regret before it happens. Actively identify
traveler-type mismatches, misleading expectations, hidden trade-offs, logistical frustrations,
and "great hotel, wrong vacation" scenarios.
Good: "This area feels isolating if you plan to leave nightly." · "Travelers expecting Cancun
energy often regret booking here." · "The beach looks better in drone photos than at ground
level." · "This works only if the resort itself is the trip."
Weak: "Something for everyone." · "Overall, a great option." · "Perfect for all traveler types."
Avoid fake balance when a stronger, honest position is appropriate.

## EXPERIENCED TRAVEL EDITOR VOICE
Write like an experienced travel editor, not an SEO content machine. The writer understands the
destination better than the reader, speaks directly and confidently, is allowed to make
judgments, doesn't soften every opinion, doesn't sound universally positive, doesn't over-explain
the obvious. Tone: experienced, calm, practical, slightly opinionated when useful, trustworthy
without sounding corporate. Avoid generic praise, influencer hype, "luxury escape" filler,
repetitive "best for" phrasing, fake enthusiasm.

## SENSORY AND LOGISTICAL SPECIFICITY
Avoid generic descriptions. Prefer concrete observations: transfer consequences, walking reality,
taxi dependency, beach width, reef proximity, wind exposure, seaweed patterns, pool atmosphere,
noise spillover, room-to-beach logistics, resort isolation, evening pacing, property scale, how
the area actually feels after dinner. Help the traveler visualize the real week, not the
marketing photos.
Good: "The reef keeps the water calm but limits open-water swimming." · "Golf carts become part
of the soundscape here." · "By 9pm the property becomes extremely quiet." · "Leaving nightly
turns into exhausting taxi math." Weak: "Beautiful beaches and relaxing atmosphere."

## HOTEL CARD DIFFERENTIATION
Hotel cards must NOT feel interchangeable. Each should carry a distinct traveler psychology,
vacation rhythm, reason to book, risk/trade-off, and a clear note on who may regret it. Avoid
repeating "fits well if" / "great option for" / "best for travelers who" across every property.
The reader should immediately grasp why two hotels in the same area create completely different
vacations.

## ANTI-AI RHYTHM RULES
AI writing becomes structurally predictable. Avoid equal paragraph lengths, identical sentence
cadence, repetitive transitions, symmetrical section endings, over-balanced tone, perfectly
uniform structure. Natural editorial writing has uneven pacing, occasional short paragraphs,
sharper observations, abrupt-but-useful sentences, different rhythm between sections, variation
in density and tone. Don't end every section with a summarizing wrap-up. Avoid "it's important
to note that…", "overall, this is a great option", "in conclusion".

## STRUCTURAL VARIATION (anti-sameness)
Fixed spine, interchangeable middle. Two articles of the same type must not share the same
skeleton. Keep CONSTANT every time: hero/meta, intro, Quick Answer, exactly one authored decision
element, FAQ, verdict, related-links (plus a mistakes block where the topic warrants). Everything
else is a variation surface — and the variation lives in the MIDDLE, never in the opening or the
required sections. Three levers create the difference:
1. **Decision-element form varies by question.** The one required decision element may be a
   comparison `table-wrap`, a `scenario-grid`, a `priority-widget`, a `compass-grid`, or a
   month-scorecard table. Do NOT default to a comparison table in every article — pick the form
   that fits the reader's core question.
2. **Visual rhythm varies — but the photo format does not.** All article photos are full-size 2:1
   `article-image` (see §5); never use `image-trio`/`photo-row` for photos. Vary *placement and count*
   of those full-size images and which non-photo enrichment blocks accompany them, so articles don't
   all look identical.
3. **Mid-article enrichment.** Add at least ONE — aim for TWO or more — extra content blocks in the
   middle, chosen from the topic palette in §4a. They must earn their place by serving the content;
   an empty or filler block is still forbidden (§9).

The visual vocabulary is the WHOLE of `article-content.css` (catalogued in `01_BLOCKS.md`), not a
habitual subset. Each article should use at least one component from outside the common dozen when
the topic supports it. Never invent a class or inline CSS; if a fitting component already exists, use it.

## HUMAN OBSERVATION REQUIREMENT
Each major article should include several observations that are hard to fake without real
understanding of the destination. E.g. "Beach chairs disappear before breakfast during peak
season." · "Pool music reaches half the property." · "The calm water exists because the reef
blocks wave energy." · "This area feels empty after dinner unless you planned for that." These
sharply increase perceived expertise and authenticity.

## GEOGRAPHY CHANGES THE VACATION
Don't describe areas as abstract map locations. Explain how geography changes the beach
experience, transportation, nightlife/restaurant access, transfer fatigue, seaweed exposure,
water conditions, isolation level, family practicality, and resort rhythm. Geography should feel
consequential, not decorative.

## STRONG OPINIONS ARE ALLOWED
Neutrality is not required when it weakens the article. If a pattern is consistently true, say it
directly, explain why, and explain who it affects. E.g. "Most travelers overpay for this area
expecting a different kind of vacation." · "This beach is calmer, but visually less dramatic."
Confidence and clarity build trust more than artificial neutrality.

## EDITORIAL QUALITY BAR (must-haves)
- Don't write like AI. Vary openers; don't reuse the same intro construction. Avoid filler
  crutches ("the reality is", "the key takeaway", "the trick is", "it's important to understand",
  "in fact" and the like).
- Include **≥1 surprising-but-useful fact** that makes the reader think "huh, I didn't know that"
  — an unexpected fact, a common mistake, an underrated problem, a quirk of the place, or a
  practical insight. Weave it in; no special block required.
- Include **2–3 practical observations** that read like an experienced editor/traveler.
- **Never fabricate** personal experience, trips, or visits. No first-person claims of
  experience that isn't real. When grounding in reviews, use honest framing: "reviews often
  mention…", "travelers commonly report…", "check recent reviews for…".
- Always show real limits and trade-offs, not just upsides; explain not only *what to choose*
  but *why people often choose wrong*. Each article should read as its own piece, not a variation
  of one template.
- **No symmetric enumerations.** Never write "The first… the second… the third…". Break
  enumerations into uneven prose. No over-polished copywriter closer ("cheaper than X, and far more
  useful"); end plainly. Include **≥1 asymmetry beat** — a "most overrated / what people fear
  wrongly" aside, a myth correction, or an unexpected turn — so the piece never reads as a template.
- **≥1 concrete worked example** in money/fee/time topics (e.g. a DCC loss: 5,000 MXN billed in USD
  ≈ $300 vs ≈ $270 through your own bank). Qualitative labels stay the rule for unsourced figures;
  one defensible, concrete example is required where the topic allows it.
- **A Featured-Snippet / AI-Overview hook near the top.** One compact, extractable element next to
  the Quick Answer — a one-line list ("main items + risk/verdict"), a tight definition, or a
  `stat-row` — using existing markup only (a bare `<ul>` is an accepted project pattern). Keep it
  snippet-clean, not a duplicate of the decision block.
- **Inline E-E-A-T.** Name 1–2 official sources in the body itself (U.S. State Department,
  Government of Canada, Profeco, NOAA, tourism boards), not only in Sources Checked. Light, never academic.

## ANTI-AI CONCRETENESS & SEO RULES (How to avoid sounding like a bot)
- **Concrete Numbers Over Vague Labels**: Never just say "expensive" or "low cost" in tables or text if you can provide a realistic estimate. Always include a `Typical spend/day` and `Room Rate/night` row with actual $ ranges in Decision Matrices. Always mention specific durations (e.g., "a 60 or 90-minute massage") and specific booking windows (e.g., "book 2–3 weeks ahead in Dec–Mar").
- **Practical Tourist Surprises**: Every article must contain at least one observation about what *actually surprises* tourists or disrupts expectations (e.g., hidden resort fees, no AC at night, generator noise, strict spa-pass policies). Introduce these naturally ("What usually surprises tourists is...").
- **Natural SEO Integration**: Never force exact-match long-tail keywords (like "wellness hotels Riviera Maya") awkwardly into the middle of prose sentences. Instead, weave them naturally into the text OR use them in `H2`/`H3` subheadings. The body text must always read like a human editor wrote it.
- **Forced Grid Differentiation**: When using `zone-grid`, `scenario-card`, or listing hotels/options, the descriptions must not blur together. End each card's description with a bolded, specific label. Example: `<strong>Standout:</strong> Best for luxury` or `<strong>Standout:</strong> Best spiritual atmosphere.`
- **Ban AI Adjective Clichés**: Strictly avoid empty marketing adjectives like "flawless luxury", "deeply atmospheric", "world-class practitioners", "authentic-feeling", or "stunning." Replace them with factual, observable conditions ("highly structured premium service", "rustic, natural environments", "experienced international instructors").
- **Intent-Driven FAQs**: Do not just ask generic questions. Include at least 1-2 comparative FAQs ("Is X or Y better for Z?") and value-based FAQs ("Is X worth the money?"). Ensure all FAQs are correctly mirrored in the `FAQPage` JSON-LD schema.

---

# BUILD

### 0. Classify and confirm before writing (owner checkpoint)
Before writing anything, do this and **wait for owner confirmation**:
1. Open `ROADMAP.md` (and all parts like `ROADMAP_PART2.md`), pick the next not-yet-created article (no duplicate), and tell the owner
   which one and why it's next.
2. State the type (Informational / Comparison / Synthesis / Hotel Decision) **and** whether it is
   **Commercial** (hotel / resort / all-inclusive / where-to-stay intent) or **Non-Commercial**
   (informational, no booking intent), with a one-line rationale. The `ROADMAP` hint is a
   suggestion; your independent intent check is the control — if they disagree, **stop and
   explain**, don't guess.
3. If **Commercial**: also state up front whether the affiliate registry
   (`_dev/runbooks/affiliate/03-affiliate-link-placements.md`) already has a suitable link (give
   its ID) or a new CJ URL is needed (propose a plain Expedia target + one-line reason). This lets
   the owner prepare the link *before* you write, so you never stall mid-article on a missing link.
4. Read the matching benchmark (commercial vs non-commercial) as a quality reference, not a template.
5. Only after the owner confirms the article and its classification, **immediately create the
   article's RUN_LOG** (`run-logs/NNNN-<slug>.md`, see **PER-ARTICLE TRACKING** below) with the
   confirmed article / slug / type / Commercial-or-Non-Commercial. Then start writing.

### 1. Pick the next article
Read `ROADMAP.md` (and all `ROADMAP_PART*.md` files); identify the next not-yet-created article; don't duplicate. (Roadmap = what to
write. The Registry = what's already published; that's a separate, later step — don't touch it
here.)

### 2. Source checking (when needed)
If the topic depends on prices, fees, access, rules, safety, transport, seasonal limits, or
visa/entry conditions: check official sources (government, airport, transport operator,
attraction, tourism board); supplement with recent reputable local sources if official ones are
thin; record the check date for the `Sources Checked` block; phrase carefully on conflicts
(range, "roughly", "check before booking"); never invent sources you didn't check.

### 3. Write the EN article
- Production HTML at `en/content/<slug>.html`. Slug: SEO-friendly, short, clear.
- Build from `01_BLOCKS.md`. Use ~70–80% of the fitting blocks, not all of them.
- **Required elements:** quick answer up front · clear decision logic · practical details ·
  mistakes/traps where the topic allows · one strong authored decision element (Decision Matrix,
  Comparison Table, Booking Risk Matrix, Quick Pick Table, or equivalent) · a final verdict ·
  FAQ · related links · 2–3 natural inline links inside the body.
- Use qualitative labels (low / medium / higher; usually / often / check current reports) rather
  than invented precise numbers.
- See **Affiliate** below for the hotel-intent CTA and the mobile-button rule.
- Avoid generic travel text, restating the obvious, ad tone, and identical rhythm article to
  article.

### 4. Blocks & CSS
Use only existing blocks from `01_BLOCKS.md` and existing `article-content.css` classes. The catalog
is the FULL palette — beyond the common dozen (`qa-grid`, `zone-grid`, `scenario-grid`, `table-wrap`,
`mistake-grid`, `stat-row`, `article-image`, `callout`, `checklist`, `verdict`,
`related-links`) it also includes `route-stop` timelines, `compass-grid`, `lifehack-list`,
`budget-cards`, `hidden-costs`, `info-card`/`info-stack`, `meta-pills`, `card-list`, and
`callout-plain`. (`image-trio` and `photo-row` still exist in the CSS but are **retired for article
photos** — all photos are full-size 2:1 `article-image`; see §5.) `01_BLOCKS.md` is your class catalog
by example — match its markup exactly. If a
component exists in `article-content.css` but is not yet in `01_BLOCKS.md`, treat the CSS as the
source of truth and copy markup verbatim from a live article that uses it. Forbidden: new CSS, inline
CSS, old CSS files, invented class names.

### 4a. Topic-based block selection (run before assembling)
1. Identify the topic family and take its candidate palette:
   - **Money / budget / fees / cost** → `stat-row`, `budget-cards`, `hidden-costs`, `lifehack-list`, `price-grid`
   - **Transport / airport / day-trip / itinerary** → `route-stop` timeline, `stat-row`, `article-image`, `scenario-grid`
   - **Safety / scams** → risk `table-wrap`, `mistake-grid`, `callout`/`callout-plain`, a compact top-of-article list, `scenario-grid`
   - **Hotels / where-to-stay / resorts** → `HotelCard`, `zone-grid`, `article-image`, comparison `table-wrap`, `qa-grid`
   - **Weather / season / timing** → month-scorecard `table-wrap`, `stat-row`, `qa-grid`, `callout`
   - **Orientation / "Explained"** → `compass-grid`, `info-card`/`info-stack`, `zone-grid`, `article-image`
   - **Activities / things-to-do** → `scenario-grid`, `article-image`, `qa-grid`, `mistake-grid`, `meta-pills`
2. Choose the decision-element form for THIS question (don't auto-pick a table).
3. Insert 1–2 enrichment blocks from the palette into the middle, driven by real content.
4. Open the last 2–3 RUN_LOGs of the same `primary_section`, read their "Blocks/structure" line; if
   your skeleton matches, swap at least one block for another palette candidate.
5. Record the final block set + a one-line reason in this article's RUN_LOG.

### 5. Images
Create the article's own folder up front: `assets/images/content/<slug>/`. Required set:

| File | Size | Format |
|---|---|---|
| `hero_1920x320.jpg` | 1920×320 | ultra-wide ~6:1 |
| `card_1200x600.jpg` | 1200×600 | horizontal 2:1 |
| `block-01_1200.jpg` | 1200×600 | horizontal 2:1 |
| `block-02_1200.jpg` … `block-0N_1200.jpg` (as many as the article needs) | 1200×600 | horizontal 2:1 |

No square/vertical/1:1 images for card/block. Never reference another article's image folder.
Keep the project filename standard exactly (`block-01_1200.jpg`, not `block-01_1200x600.jpg`).

Hero (with dimensions):
```html
<img src="/assets/images/content/<slug>/hero_1920x320.jpg" alt="..."
     class="article-hero-image" loading="eager" fetchpriority="high"
     width="1920" height="320">
```
In-article images (no `width`/`height`):
```html
<figure class="article-image reveal">
  <img src="/assets/images/content/<slug>/block-01_1200.jpg" alt="..." loading="lazy">
</figure>
```
If final images aren't ready, pick relevant temporary ones, physically copy them into the current
slug's folder, and reference that folder. No "temporary" comments in the HTML.

**Image count — driven by the article, not a fixed limit.** The number of in-article images is set by
what the *material* needs for comfortable reading (especially on mobile), never by a quota. The goal
is a comfortable visual rhythm on a phone, not a specific number.
- **Minimum 3** full-size in-article images (`article-image`, 2:1), on top of the hero.
- **Usually 4–5** when they genuinely improve comprehension and pacing.
- **Up to 6–7** for long, dense, or complex pieces, where extra images break up large text blocks and
  ease mobile reading.
- **Never pad to a maximum** — every image must carry a clear purpose (a place, a step, a contrast).
  Equally, **don't starve a text-heavy article** of images to stay "lean."
- **Only full-size 2:1 `article-image` for article photos — no small/side-by-side images.** Every
  in-article photo is a standalone full-width `article-image` (the `block-01`, `block-02`… backbone).
  **Do NOT use `photo-row` or `image-trio` for article photos** — they render images at reduced size,
  which the owner does not want. There is one visual format for photos: the full-size 2:1 `article-image`.
  Never swap a real full-size image for a small/multi-up component to satisfy a count.
- Judge the count by: total length, text density, number of major sections, mobile reading comfort, and
  any long stretch left with no visual pause.

This image-count policy is the source of truth and **overrides** both the older per-block `article-image`
maximum in `01_BLOCKS.md` and any earlier guidance that treated `image-trio`/`photo-row` as
interchangeable visual options. Structural-variation lever 2 (§ STRUCTURAL VARIATION) now varies
*where and how many* full-size images appear and which other (non-photo) enrichment blocks accompany
them — not the photo format itself.

### 6. SEO
Fill: `title` · `meta description` · `canonical` → `https://travelradarlk.com/en/content/<slug>` ·
`hreflang` ru / en / uk / x-default (x-default = EN) · `og:title` / `og:description` / `og:url` ·
`og:image` → `card_1200x600.jpg` with `og:image:width`=1200, `og:image:height`=600 ·
`twitter:title` / `twitter:description` · `schema.org Article` with `inLanguage = en-US` ·
`datePublished` / `dateModified` · `mainEntityOfPage`.
`og:title`/`twitter:title` should be informative — not too short, not too long.
Weak: `Cancun Beach Guide` · Better: `Cancun Beach Guide: Calm Water, Waves and Seaweed`.

### 7. Schema.org
**Author / Publisher** (required in every EN article):
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
    "jobTitle": "[Reviewer Job Title from about.html]"
  }
],
"publisher": {
  "@type": "Organization", "name": "Travel Radar LK",
  "url": "https://travelradarlk.com",
  "logo": { "@type": "ImageObject",
    "url": "https://travelradarlk.com/assets/images/brand/travel-radar-lk-logo-512.png",
    "width": 512, "height": 512 }
}
```
*(The AI must select the correct reviewer ID, Name, and Job Title based on the geography rules below).*
Hero author line (include reviewer based on geography):
- Mexico destinations (Cancun, Riviera Maya, Tulum, Playa del Carmen, etc.): reviewer is **Claire Bennett** (link: `/en/about#person-claire-bennett`, Job Title: `Regional Expert, Mexico`).
- Caribbean / Dominican Republic destinations (Punta Cana, etc.): reviewer is **Kimalie Smith** (link: `/en/about#person-kimalie-smith`, Job Title: `Regional Expert, Caribbean`).

```html
<p class="hero-subtitle">
  By <a href="/en/about#person-leonid-kadantsev" class="author-link">Leonid Kadantsev</a> &bull; 
  Reviewed by <a href="/en/about#person-[reviewer-id]" class="author-link">[Reviewer Name]</a>
</p>
```
**Dates:** `datePublished` = first public release; `dateModified` = last substantial change. Don't
backdate. The visible hero line must match the JSON-LD dates:
```html
<p class="hero-subtitle">Published [Month D, YYYY] &bull; Updated [Month D, YYYY] &bull; Sources checked [Month D, YYYY] &bull; [X]&ndash;[Y] min read</p>
```
For a brand-new article Published and Updated may be equal.

**Visible Breadcrumbs HTML:** 
Immediately after the opening `<main>` and before the `<article>` content begins, insert the premium breadcrumbs wrapper. Use the EXACT structure below (with `<nav>`, `<ol>`, and the active page at the end).

```html
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
**BreadcrumbList** — a separate JSON-LD block using the **Content Hub v2** taxonomy:
`Home → Content → <Primary Section> → [Article]`, where `<Primary Section>` is one of
`destinations` · `stay` · `things-to-do` · `weather` · `planning` · `safety`. Do NOT use the
legacy `Countries → Mexico` hierarchy. Pick the section that answers the reader's core question
(where to stay = `stay`, when to go = `weather`, how to get there / how much = `planning`):
```json
{ "@type": "BreadcrumbList", "itemListElement": [
  {"@type":"ListItem","position":1,"name":"Home","item":"https://travelradarlk.com/en/"},
  {"@type":"ListItem","position":2,"name":"Content","item":"https://travelradarlk.com/en/content/"},
  {"@type":"ListItem","position":3,"name":"Weather","item":"https://travelradarlk.com/en/content/weather/"},
  {"@type":"ListItem","position":4,"name":"[Article Title]"}
]}
```
**FAQPage schema** — add only if the FAQ is final and visible; schema Q&A must match the visible
HTML exactly. Don't add questions not on the page. When in doubt, omit.

### 8. Links
Editorial / source links (tourism board, government, transport operator, NOAA, etc.):
`rel="noopener"` (with `target="_blank"`). Affiliate / sponsored links:
`rel="sponsored nofollow noopener"`. Don't put `nofollow` on ordinary editorial sources; don't
mix editorial and affiliate links. Internal linking: 2–3 natural inline links in the body where
they genuinely help the next step (human, contextual anchor text — not a mechanical keyword) plus
a final `related-links` block. No random or repeated links. Logic: beach → hotel booking checklist
/ where to stay / best time; hotel → all-inclusive / best hotels; transport → airport transfer /
where to stay.

### 9. Grid balance
Check every card grid (`qa-grid`, `zone-grid`, `scenario-grid`, `mistake-grid`, `price-grid`):
3-col → 3 or 6 cards; 2-col → 2 or 4 cards. No lone card in the last row. Don't pad with empty/weak
cards.

### 10. Sources Checked
If the article relies on changeable facts, add a `Sources Checked` block with a 1–2 sentence
research method and the check date. Don't invent sources.
```html
<p><strong>How this guide was checked:</strong> We compared official tourism pages, recent monitoring sources, public access details, and traveler-facing booking risks.</p>
```

---

# AFFILIATE (rules inlined — the link *registry* stays external)

Decide first: does the article carry **hotel / resort / all-inclusive / accommodation /
where-to-stay intent**? If **no** → do not run the affiliate workflow; do not auto-insert
affiliate CTAs into informational-only sections. If **yes** → follow the rules below.

**Editorial protection (non-negotiable order): knowledge first → decision support second →
monetization third.** The affiliate CTA must help the decision, look natural, match page intent,
and support the editorial flow. Never turn the article into an affiliate landing page. Avoid
overly commercial wording, aggressive monetization, forced booking language, multiple CTAs in a
row, or any CTA in purely informational sections. CTAs appear *after* the reasoning, never up
front.

**Scope (current partner = Expedia / CJ):** Expedia fits only hotel-intent pages (hotels, resorts,
all-inclusive, where-to-stay, hotel checklist, or area comparison when the reader is close to
choosing a hotel). Don't add Expedia to non-hotel-intent articles or to hub pages.

**Hotel CTA + mobile-button rule:** for hotel-intent articles use BLOCK 09b (HotelCard) from
`01_BLOCKS.md`. Under each affiliate CTA `related-link` (desktop/regular), add a second
mobile-only `mobile-highlight-button`. The mobile button is visible only at `max-width: 767px`
and hidden on desktop by existing CSS; its text/href may differ from the desktop CTA when that
improves clarity. No inline CSS — the styles already live in `article-content.css`.
```html
<a href="[affiliate-url]" class="related-link" target="_blank" rel="sponsored nofollow noopener">[Desktop compare hotels/resorts]</a>
<a href="[affiliate-url]" class="mobile-highlight-button" target="_blank" rel="sponsored nofollow noopener">[Mobile compare hotels/resorts]</a>
```

**Never invent affiliate URLs.** You may decide a CTA is needed and propose a plain Expedia target
page, but real CJ/affiliate URLs are created by the owner. Before inserting any affiliate CTA,
open the live registry `_dev/runbooks/affiliate/03-affiliate-link-placements.md`:
- If a suitable link exists → use its ID; don't create a duplicate; add a placement card for this
  article (kept alphabetically by file path).
- If none exists → do NOT drop a plain Expedia link as if it were affiliate. Propose a plain
  Expedia target page to the owner, explain in one line why it's needed, and **stop and wait** for
  the CJ URL. Request format:
  ```
  New Expedia / CJ link needed.
  Article: [path]   Purpose: [e.g. Cancun all-inclusive resorts]
  Plain Expedia target page: [url]   Why: [one line]
  ```
- ID convention: `EXP-<PLACE>-<TYPE>-NNN` (places: CUN Cancun · TUL Tulum · PDC Playa del Carmen ·
  RIVMAYA Riviera Maya · MEX Mexico general). E.g. `EXP-CUN-ALLINCL-001`.
Don't reuse a link in a mismatched article (a Cancun-hotels link ≠ an all-inclusive CTA; a hotel
link ≠ tours/transfers/eSIM/insurance). When in doubt, don't auto-insert — leave a note for the
owner. (Full editorial QA for monetization & conversion path lives in `02_QA_CHECKLIST.md`.)

---

# FINAL QUALITY GATE (must pass before finishing)

Don't check mechanically — but every line below must be true or consciously N/A.

- [ ] One clear task: I know the single decision this article serves; I didn't merge 3 articles
- [ ] Quick answer up front — no generic "beautiful region" intro
- [ ] Clear decision logic ("If you are X → choose Y"), not just an overview
- [ ] One authored decision element (matrix / comparison table / quick-pick / booking-risk)
- [ ] Traveler-type framing + at least one "Avoid if…" where it genuinely helps
- [ ] Honest trade-offs shown; no fake "perfect for everyone" tone
- [ ] No fabricated personal experience; review-based claims use honest framing
- [ ] ≥1 "I didn't know that" insight + 2–3 editor-grade observations
- [ ] Strong final verdict ("Choose this if…"), not a vague ending
- [ ] 2–3 contextual inline links in the body + a `related-links` block
- [ ] Affiliate (if any) only after reasoning; CTA matches intent; link came from the registry
      (never invented); mobile-highlight-button added under hotel CTAs
- [ ] No empty visual blocks, no lone cards in grids (3→3/6, 2→2/4)
- [ ] No inline CSS, no old CSS files, no invented class names
- [ ] Hero `width="1920" height="320"`; block images no `width`/`height`; all card/block 2:1
- [ ] All images from the current slug's folder; filename standard kept
- [ ] SEO filled: title, meta, canonical, hreflang (ru/en/uk/x-default), og (incl. image w/h), twitter
- [ ] Article JSON-LD: author array includes `Leonid Kadantsev` AND the correct reviewer (`Claire Bennett` or `Kimalie Smith`). Visible hero line includes both with correct `#person-` anchors.
      `datePublished`/`dateModified`/`mainEntityOfPage`/`inLanguage=en-US` consistent with visible hero
- [ ] Visible HTML breadcrumbs use exact structure: `<div class="premium-breadcrumb-wrapper">` with `<nav>`, `<ol>`, and `<li class="active" aria-current="page">[Title]</li>` at the end.
- [ ] Breadcrumbs use Hub v2 section taxonomy (not legacy Countries/Mexico)
- [ ] FAQPage JSON-LD only if FAQ is final & visible, and matches the visible HTML EXACTLY, including quote characters (escape `\"` in JSON to mirror visible double quotes)
- [ ] Spine unchanged; variation lives only in the decision-element form and mid-article enrichment
- [ ] ≥1 (ideally ≥2) enrichment block added mid-article from the topic palette (§4a), each justified by content
- [ ] Block skeleton differs from the last same-section RUN_LOGs; ≥1 component used from outside the common dozen where the topic supports it
- [ ] ≥1 concrete worked example (money/time topics) · a Featured-Snippet hook near the top · 1–2 inline official-source mentions
- [ ] No "first/second/third" symmetry, no over-polished closer; ≥1 asymmetry beat present
- [ ] EN file valid, UTF-8, no BOM
- [ ] (Optional, for important pages) ran the deeper `02_QA_CHECKLIST.md`

---

# HANDOFF (do NOT do publication work here)

Your job ends at **one complete, valid EN file** at `en/content/<slug>.html` (plus its image
folder). You do **NOT**:
- edit `en/content/index.html`, hub/section pages, or any country index;
- create or update cards anywhere;
- touch `metadata-registry.v1.json` or run generators;
- touch `sitemap.xml`.

**Images lifecycle:** you ship working/temporary images that already meet the spec (2:1 ratio,
correct names and sizes) so the swap is drop-in. Replacing them with the final real images is the
**owner's** step after creation — flag which images are temporary in the Final Report. Do not
block delivery waiting for final art.

All of the above are generated/automated **after** you, by the owner: save EN + RU + UA files →
run `/publish` (which proposes taxonomy, inserts the Registry record, runs
`node dev/generator/build-all.mjs`, and reports `warnings: 0` / `parity OK` / `Full rebuild
complete`). Hubs, the article menu, and indexes are produced from the Registry — never by hand.
(Translation to RU/UA and sitemap are separate processes, out of scope for this prompt.)

---

# PER-ARTICLE TRACKING — RUN_LOG + ROADMAP status

Every article gets its own working journal, separate from `ROADMAP.md` (and its parts) and the system LOG.

**RUN_LOG — create it at the START, not the end.** The moment the owner confirms the article in the
§0 checkpoint (article + slug + type + Commercial/Non-Commercial), create
`run-logs/NNNN-<slug>.md`, where `NNNN` is the ROADMAP number zero-padded to 4 digits
(e.g. `run-logs/0058-mexico-sargassum-2026-hotel-geography.md`). One file = one article; the number
prefix keeps them sorted. Use `run-logs/_TEMPLATE.md` as the starting structure.

Keep the **Snapshot** block and **Stage checklist** at the top always current, plus a chronological
log. Record: per-article decisions, owner decisions, process changes, problems found, review fixes,
architecture notes, and the reason behind any non-standard choice. It is NOT a duplicate of ROADMAP
or the system LOG — it is the article's own history. **If the session is interrupted, the next
session opens this file and must immediately see: current stage, what's done, what's left, and which
owner decisions are already made.** Update it as you work, not after.

**Language — Russian.** The RUN_LOG is written for the project owner and future AI sessions, not for
the site or end users, so write it **in Russian**. Keep only technical tokens in English: the slug,
file paths, file names, HTML/CSS class names, technical identifiers, and project entity names that
exist only in English (e.g. `EN Complete`, `primary_section`, `hotel-card`).

**ROADMAP status — update the moment the EN draft first exists.** As soon as you have reported a
complete, valid EN file (the first successful draft), set the article's entry in `ROADMAP.md` (or its respective `ROADMAP_PART*.md`) to
`Status: EN Complete — YYYY-MM-DD`. The EN stage is "done" at first valid draft — do NOT wait for
review, final images, RU/UA, `/publish` or `build-all`. `EN Complete` later becomes
`Published — YYYY-MM-DD` after publication. (`ROADMAP.md` and its parts are the system's own backlog, not the
published Registry — updating its status here is in scope; the Registry and publish still belong to
the owner.)

---

# FINAL REPORT (to the owner, in Russian)

1. Which article was chosen from the roadmap and why it's next · 2. Slug · 3. Files created/changed
(EN file + image folder) · 4. Blocks used · 5. Images: final vs temporary · 6. Internal links:
inline + related-links · 7. Sources checked: which sources, check date · 8. Visible dates
(Published / Updated / Sources checked) in hero and JSON-LD · 9. Decision element: which block,
where · 10. Affiliate: workflow run or not, which links (registry IDs) added · 11. `publisher.logo`
present · 12. FAQPage JSON-LD: added or not (why) · 13. Author `Leonid K.` clickable with
`class="author-link"` · 14. Image rules: hero sized, block images unsized, all 2:1 · 15. Editorial
links `rel="noopener"` / affiliate `rel="sponsored nofollow noopener"` · 16. Breadcrumbs: which
Hub v2 section · 17. Grid balance checked · 18. Ready for `/publish` (EN done; RU/UA + publish are
the owner's next steps) · 19. Self-score /10 — rationale + what would give the next gain (weigh
content quality, SEO intent, trust/source transparency, internal linking, conversion readiness,
technical cleanliness; don't dock for honestly-flagged temp images).

20. RUN_LOG updated to reflect the final state, and `ROADMAP.md` (or the relevant `ROADMAP_PART*.md`) set to `EN Complete — YYYY-MM-DD`.
