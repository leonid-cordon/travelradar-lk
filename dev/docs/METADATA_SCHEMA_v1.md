# Travel Radar LK — Metadata Schema v1

**Статус:** УТВЕРЖДЁН. Это окончательный контракт данных проекта.
**Дата:** 2026-06-07
**Область:** все статьи в `/en/content/`, `/ru/content/`, `/ua/content/`.

Этот документ — единственный источник правды по metadata. Любое изменение
полей, словарей или правил вносится только сюда и помечается версией.

---

## 0. Инварианты (не нарушать никогда)

- **URL статей не меняются.** Никаких миграций, редиректов, перемещений файлов.
- **slug одинаков во всех 3 языках.** Меняется только `lang`. slug — первичный
  ключ, связывающий переводы, related и поиск.
- **Статья — источник истины.** Любой общий индекс/манифест для меню, секций,
  поиска ГЕНЕРИРУЕТСЯ из статей, а не ведётся параллельно вручную.
- **Словари закрыты.** Новое значение оси (section/country/region/destination/
  content_type/audience) добавляется только правкой этого документа.
- **Теги — контролируемый словарь.** Новый тег добавляется только при покрытии
  ≥3 статей, в kebab-case, одно понятие на тег.

---

## 1. Поля схемы

Три оси таксономии + служебная ось формата + identity + presentation.

### 1.1. Identity

| Поле | Тип | Обяз. | Источник | Назначение |
|---|---|---|---|---|
| `slug` | string | **да** | имя файла без `.html` | кросс-язычный первичный ключ |
| `lang` | enum | **да** | `en` \| `ru` \| `uk` | язык версии |
| `title` | string | **да** | переиспользовать `<title>` / og:title | заголовок карточки |
| `description` | string | **да** | переиспользовать meta description | сниппет карточки |
| `url` | string | **да** | переиспользовать `<link canonical>` | канонический путь |

> `lang` использует `uk` (BCP-47), как в существующих hreflang. Папка остаётся `ua/`.

### 1.2. Ось 1 — Тема

| Поле | Тип | Обяз. | Назначение |
|---|---|---|---|
| `primary_section` | enum (1 знач.) | **да** | главный раздел меню статьи; одна и только одна секция |

### 1.3. Ось 2 — География (иерархия страна → регион → точка)

| Поле | Тип | Обяз. | Назначение |
|---|---|---|---|
| `country` | enum | **да** | страновые хабы, фильтрация секций по стране |
| `region` | enum \| null | нет | региональные хабы |
| `destination` | enum \| null | нет | city-хабы, related «то же место»; только при фокусе на ОДНОЙ точке |
| `related_destinations` | [enum] | нет | вторичная география для сравнений/мульти-дестинационных статей |

### 1.4. Ось 3 — Теги

| Поле | Тип | Обяз. | Назначение |
|---|---|---|---|
| `tags` | [enum] | **да** (может быть `[]`) | пересекающиеся связи, фасетный поиск, related |

### 1.5. Ось 4 (служебная) — Формат

| Поле | Тип | Обяз. | Назначение |
|---|---|---|---|
| `content_type` | enum | **да** | шаблон карточки, related «такого же типа», сортировка |

### 1.6. Фасеты и presentation

| Поле | Тип | Обяз. | Источник | Назначение |
|---|---|---|---|---|
| `audience` | [enum] | нет (`[]`) | — | фасет «для кого» |
| `card_image` | string | **да** | переиспользовать og:image (1200×600) | картинка карточки |
| `date_published` | date | **да** | переиспользовать JSON-LD | сортировка, News |
| `date_modified` | date | **да** | переиспользовать JSON-LD | свежесть |
| `featured` | bool/int | нет (def 0) | — | ручной приоритет в секциях/related |
| `intent` | enum \| null | нет | — | стадия воронки; заложить, использовать позже |

**Новых полей проставлять руками:** slug, primary_section, country, region,
destination, related_destinations, tags, content_type, audience, featured, intent.
Остальные 7 — переиспользование существующего `<head>`/JSON-LD.

---

## 2. Словари (закрытые)

### 2.1. primary_section (7)
```
destinations   — что это за место: гиды, обзоры районов, пляжи
stay           — где жить: отели, зоны, where-to-stay, all-inclusive
things-to-do   — что делать: активности, экскурсии, маршруты
weather        — когда ехать: сезоны, погода, sargassum, дожди
planning       — как организовать: деньги, бюджет, перелёты, eSIM, визы, трансферы
safety         — безопасно ли: вода/еда, мошенничество, риски
news           — свежее/срочное: новости, изменения правил
```
> `all` — это UI-представление (view), НЕ значение primary_section.

### 2.2. country
```
mexico
egypt
turkey
dominican-republic   (зарезервировано, контента пока нет)
caribbean            (зарезервировано — кросс-островной/региональный контент)
generic              (статья без привязки к стране)
```

### 2.3. region (nullable)
```
riviera-maya         (mexico)   — Playa, Tulum, Akumal; БЕЗ Cancun
yucatan              (mexico)   — Chichen Itza и материковый Юкатан
istanbul             (turkey)
red-sea              (egypt)        зарезервировано
punta-cana           (dominican-republic) зарезервировано
null
```
> Cancun НЕ входит в riviera-maya (географически отдельно). Для статей
> «Cancun + Riviera Maya вместе»: region=riviera-maya, destination=null.

### 2.4. destination (nullable)
```
cancun
tulum
playa-del-carmen
cozumel
isla-mujeres
riviera-maya         (как точка-обзор, когда статья про регион целиком)
istanbul
punta-cana
null
```
> Заполняется ТОЛЬКО при фокусе на одной точке. Сравнение двух точек →
> destination=null, обе точки → `related_destinations[]` + теги.

### 2.5. content_type (5)
```
guide        — объясняющий разбор одной темы
comparison   — X vs Y (vs Z)
listicle     — «best …», ранжированные подборки
advice       — методология/чек-листы/предостережения («как выбирать»)
news         — новостной формат
```
> `comparison` — ТОЛЬКО content_type, НЕ тег. Кандидаты на будущее расширение:
> `itinerary`, `checklist` — добавлять при покрытии ≥5 статей.

### 2.6. audience
```
family
couples
solo
first-timer
```

### 2.7. intent (заложить, использовать позже)
```
inspire   — вдохновить/выбрать направление
plan      — спланировать поездку
book      — готов бронировать
null
```

### 2.8. tags — словарь v1 (29 значений)

**Тип жилья:** `all-inclusive`, `adults-only`, `family-resort`, `honeymoon`,
`boutique-hotel`

**Активности/достопримечательности:** `cenotes`, `snorkeling`, `beaches`,
`day-trips`, `theme-parks`, `archaeology`, `island-trip`

**Логистика/планирование:** `airport-transfer`, `flights`, `budget`, `money`,
`esim`, `travel-insurance`, `visa-entry`, `itinerary`, `booking-checklist`

**Сезон/природа:** `hurricane-season`, `rainy-season`, `sargassum`, `best-time`

**Зоны/районы:** `neighborhoods`

**Метод/предупреждения:** `hotel-mistakes`, `scam-warning`, `food-safety`

> НЕ теги (живут в других осях): comparison (content_type), family/couples
> (audience), названия отелей/брендов, страны/города (география).

---

## 3. Правила заполнения (резолверы)

Детерминированы, чтобы новые статьи (≈1/день) классифицировались за секунды.

### 3.1. primary_section
- `where-to-stay-*` → **stay**
- `*-travel-guide` / `*-explained` / `*-neighborhoods` / `*-beach-guide` → **destinations**
- `*-vs-*` про **жильё** (resorts, all-inclusive, where-to-stay) → **stay**;
  про **места** (острова, направления) → **destinations**; в обоих content_type=comparison
- `*-itinerary` / `*-day-trip(s)` / cenotes / snorkeling / theme-parks / chichen-itza → **things-to-do**
- `*-budget` / `*-airport-*` / `flights-*` / `*-esim` / `*-insurance` / `*-entry` / `visa-*` / money → **planning**
- `*-season` / `best-time-*` / `*-rainy` / `*-hurricane` / `*-seaweed` → **weather**
- `*-scam*` / `*-safe*` / `food-water-*` → **safety** (тема = риск)
- Методология выбора отеля (`hotel-mistakes`, `rating-trap`, `*-checklist`) → **stay** (content_type=advice), НЕ safety
- audience-гайды (`*-for-couples`, `*-family-vacation-*`) → primary по доминирующей теме (обычно stay) + `audience`-фасет, НЕ отдельная секция

### 3.2. География
- `country` — обязательна всегда. Без страновой привязки → `generic`.
- `region` — географическая точность важнее маркетинговой (Chichen Itza = yucatan, не riviera-maya).
- Cancun ≠ riviera-maya (см. 2.3).
- `destination` — только при фокусе на одной точке.
- Сравнение/мульти-точка → destination=null + `related_destinations[]`.
- Cross-country сравнение → `country` = страна-якорь (аудитория статьи),
  вторая страна-точка → `related_destinations[]`.

### 3.3. tags
- Только из словаря 2.8. Новый тег — только правкой этого документа при покрытии ≥3.
- Аудиторию НЕ дублировать в теги — использовать `audience`.
- «vs» НЕ тег — использовать content_type=comparison.

### 3.4. content_type
- `best-*` → listicle; `*-vs-*` → comparison; чек-лист/методология → advice;
  новость → news; иначе → guide.

---

## 4. Правила для новых статей

Чек-лист публикации (≈1 статья/день):

1. `slug` = имя файла, идентичен в en/ru/ua.
2. Применить резолверы §3.1 → выбрать **ровно один** `primary_section`.
3. Заполнить географию по §3.2 (country обязательна).
4. `content_type` по §3.4.
5. Назначить `tags` только из §2.8 (0–4 тега, без дублей аудитории/гео/формата).
6. `audience` — если статья таргетирована (иначе `[]`).
7. `related_destinations` — только для сравнений/мульти-точки (иначе опустить).
8. identity/presentation поля переиспользовать из `<head>`/JSON-LD.
9. Если статья НЕ ложится ни в один section или требует нового тега/значения —
   НЕ импровизировать: остановиться, внести правку в этот документ, поднять версию.

---

## 5. Правила для будущих направлений (Dominican Republic, Caribbean и др.)

- `country` для них уже зарезервированы: `dominican-republic`, `caribbean`.
  Региональные значения (`punta-cana`, `red-sea`) — в §2.3, расширять по факту контента.
- **Тематические секции НЕ дублируются по странам.** Один `stay` на весь сайт,
  фильтрация по `country` — задача индекса/UI, не таксономии.
- Generic-методология (`hotel-check-before-booking`, `hotel-rating-9-trap`,
  `visa-free-travel-destinations`) переиспользуется на новых направлениях без
  изменений — country остаётся `generic`.
- City/region-хабы поднимаются, когда на точку набирается ~15–20 статей; до тех
  пор `destination`/`region` просто накапливаются в metadata.
- Новый регион/точка нового направления → сначала добавить в §2.3/§2.4, потом размечать.
- Cross-country сравнения (тип `punta-cana-vs-cancun`) → §3.2: country=якорь,
  вторая страна в `related_destinations`. Менять country существующих статей при
  запуске нового направления НЕ требуется.

---

## 6. Формат хранения

`<script type="application/json" id="tr-meta">` внутри `<head>` каждой статьи,
сразу после блока JSON-LD. Браузер не исполняет и не рендерит; JS читает через
`JSON.parse(document.getElementById('tr-meta').textContent)`. Держит массивы и
вложенность; синхронизируется со статьёй (источник истины — статья).

Порядок ключей фиксирован (identity → 4 оси → presentation) для читаемости и diff-стабильности.

---

## 7. Примеры tr-meta

### 7.1. Listicle, одна точка (best-adults-only-resorts-cancun)
```json
{
  "slug": "best-adults-only-resorts-cancun",
  "lang": "en",
  "title": "Best Adults-Only Resorts in Cancun",
  "description": "...",
  "url": "https://travelradarlk.com/en/content/best-adults-only-resorts-cancun",
  "primary_section": "stay",
  "country": "mexico",
  "region": null,
  "destination": "cancun",
  "related_destinations": [],
  "content_type": "listicle",
  "tags": ["adults-only"],
  "audience": ["couples"],
  "card_image": "https://travelradarlk.com/assets/images/content/best-adults-only-resorts-cancun/card_1200x600.jpg",
  "date_published": "2026-05-20",
  "date_modified": "2026-05-20",
  "featured": 0,
  "intent": "book"
}
```

### 7.2. Weather guide, регион + точка (best-time-to-visit-tulum)
```json
{
  "slug": "best-time-to-visit-tulum",
  "lang": "en",
  "title": "Best Time to Visit Tulum: Weather, Seaweed and Prices",
  "description": "...",
  "url": "https://travelradarlk.com/en/content/best-time-to-visit-tulum",
  "primary_section": "weather",
  "country": "mexico",
  "region": "riviera-maya",
  "destination": "tulum",
  "related_destinations": [],
  "content_type": "guide",
  "tags": ["best-time", "sargassum"],
  "audience": [],
  "card_image": "https://travelradarlk.com/assets/images/content/best-time-to-visit-tulum/card_1200x600.jpg",
  "date_published": "2026-06-05",
  "date_modified": "2026-06-05",
  "featured": 0,
  "intent": "plan"
}
```

### 7.3. Cross-country comparison (punta-cana-vs-cancun)
```json
{
  "slug": "punta-cana-vs-cancun",
  "lang": "en",
  "title": "Punta Cana vs Cancun: Which to Choose",
  "description": "...",
  "url": "https://travelradarlk.com/en/content/punta-cana-vs-cancun",
  "primary_section": "destinations",
  "country": "mexico",
  "region": null,
  "destination": null,
  "related_destinations": ["cancun", "punta-cana"],
  "content_type": "comparison",
  "tags": [],
  "audience": [],
  "card_image": "https://travelradarlk.com/assets/images/content/punta-cana-vs-cancun/card_1200x600.jpg",
  "date_published": "2026-05-10",
  "date_modified": "2026-05-10",
  "featured": 0,
  "intent": "inspire"
}
```

### 7.4. Generic advice, без страны (hotel-rating-9-trap)
```json
{
  "slug": "hotel-rating-9-trap",
  "lang": "en",
  "title": "Why a 9.2 Hotel Rating Can Ruin Your Vacation",
  "description": "...",
  "url": "https://travelradarlk.com/en/content/hotel-rating-9-trap",
  "primary_section": "stay",
  "country": "generic",
  "region": null,
  "destination": null,
  "related_destinations": [],
  "content_type": "advice",
  "tags": ["hotel-mistakes"],
  "audience": [],
  "card_image": "https://travelradarlk.com/assets/images/content/hotel-rating-9-trap/card_1200x600.jpg",
  "date_published": "2026-04-28",
  "date_modified": "2026-04-28",
  "featured": 0,
  "intent": "plan"
}
```

### 7.5. Planning guide, без точки (mexico-esim-for-us-travelers)
```json
{
  "slug": "mexico-esim-for-us-travelers",
  "lang": "en",
  "title": "Mexico eSIM for US Travelers",
  "description": "...",
  "url": "https://travelradarlk.com/en/content/mexico-esim-for-us-travelers",
  "primary_section": "planning",
  "country": "mexico",
  "region": null,
  "destination": null,
  "related_destinations": [],
  "content_type": "guide",
  "tags": ["esim"],
  "audience": [],
  "card_image": "https://travelradarlk.com/assets/images/content/mexico-esim-for-us-travelers/card_1200x600.jpg",
  "date_published": "2026-05-02",
  "date_modified": "2026-05-02",
  "featured": 0,
  "intent": "plan"
}
```

---

## 8. Контроль версий

- **v1 (2026-06-07):** первичный контракт. 7 секций, 4 оси (3 + content_type),
  audience-фасет, related_destinations, словарь тегов 29 значений.
- Любая правка словарей/полей → новая запись здесь + bump версии в tr-meta-процессе.
