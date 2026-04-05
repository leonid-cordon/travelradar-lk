# SEO Audit Log — travelradarlk.com

---

## Batch 1 — 2026-04-05 12:36

---

URL: https://travelradarlk.com/
STATUS: ISSUE
— lang="en" но весь контент на трёх языках (страница-сплиттер) — lang не отражает реального содержимого
— og:locale отсутствует
— H1 отсутствует (контент только через JS, div.title — не H1)
— meta robots отсутствует (нет явного index/follow)

---

URL: https://travelradarlk.com/ru/
STATUS: ISSUE
— hreflang x-default указывает на /en/ — не на / (корень)
— og:locale отсутствует
— og:title / og:description отсутствуют

---

URL: https://travelradarlk.com/ru/about.html
STATUS: ISSUE
— canonical: https://travelradarlk.com/ru/about/ (с /), файл — about.html (без /): несоответствие пути
— hreflang ссылаются на /ru/about/, /en/about/, /ua/about/ — директории без .html, реальный файл — .html
— meta description есть, OK
— H1: «О проекте» — есть, OK

---

URL: https://travelradarlk.com/ru/egypt/
STATUS: OK
— title, description, canonical, hreflang, robots — все есть
— H1 «Египет» — есть
— lang="ru" — OK
— site-header без data-lang (потеря языкового контекста для хедера)

---

URL: https://travelradarlk.com/ru/turkey/
STATUS: ISSUE
— site-header без data-lang (в отличие от ru/index.html)
— hreflang x-default указывает на /en/turkey/ — OK
— H1 «Турция» — есть
— canonical, description — OK

---

URL: https://travelradarlk.com/ru/mexico/
STATUS: ISSUE
— site-header без data-lang
— canonical, description, hreflang — OK
— H1 «Мексика» — есть

---

URL: https://travelradarlk.com/ru/content/
STATUS: ISSUE
— hreflang указывают на /ru/content/index.html/ (с index.html в пути) — некорректно, должно быть /ru/content/
— canonical корректный: /ru/content/
— H1 «Контент» — есть
— og:locale / og:title — отсутствуют

---

URL: https://travelradarlk.com/ru/content/lifehacks/
STATUS: ISSUE
— meta description отсутствует
— hreflang указывают на /ru/content/lifehacks/index.html/ — некорректно
— canonical отсутствует
— og:locale / og:title — отсутствуют

---

URL: https://travelradarlk.com/ru/content/countries/
STATUS: ISSUE
— meta description отсутствует
— canonical отсутствует
— hreflang указывают на /ru/content/countries/index.html/ — некорректно
— og:locale / og:title — отсутствуют

---

URL: https://travelradarlk.com/ru/content/countries/egypt/
STATUS: ISSUE
— meta description отсутствует
— canonical отсутствует
— hreflang указывают на /ru/content/countries/egypt/index.html/ — некорректно
— og:locale / og:title — отсутствуют

---

ПРОВЕРЕНО ВСЕГО: 10 URL

---

## Batch 2 — 2026-04-05 12:37

---

URL: https://travelradarlk.com/ru/content/countries/turkey/
STATUS: ISSUE
— hreflang указывают на /ru/content/countries/turkey/index.html/ — лишний index.html в пути
— meta description отсутствует
— canonical отсутствует
— og:locale / og:title — отсутствуют

---

URL: https://travelradarlk.com/ru/content/countries/mexico/
STATUS: OK
— title, description, canonical, hreflang — все есть и корректные
— hreflang x-default → / (корень) — правильно
— H1 «Мексика» — есть
— lang="ru" — OK
— og:locale / og:title — отсутствуют (незначительно для страницы категории)

---

URL: https://travelradarlk.com/ru/content/flights/
STATUS: ISSUE
— hreflang указывают на /ru/content/flights/index.html/ — лишний index.html в пути
— meta description отсутствует
— canonical отсутствует
— hreflang x-default → /en/content/flights/index.html/ — некорректно (должен указывать на /)
— og:locale / og:title — отсутствуют

---

URL: https://travelradarlk.com/ru/content/collections/
STATUS: OK
— title, description, canonical, hreflang — все есть и корректные
— hreflang x-default → / (корень) — правильно
— H1 «Подборки» — есть
— robots: index, follow — OK
— Небольшое замечание: подключён article-v2.css (избыточно для страницы категории, но не критично)

---

URL: https://travelradarlk.com/ru/content/news/
STATUS: ISSUE
— hreflang указывают на /ru/content/news/index.html/ — лишний index.html в пути
— meta description отсутствует
— canonical отсутствует
— hreflang x-default → /en/content/news/index.html/ — некорректно
— og:locale / og:title — отсутствуют

---

URL: https://travelradarlk.com/ru/content/best-hotels-cancun-2026.html
STATUS: ISSUE
— canonical: .../best-hotels-cancun-2026/ (с /) но файл — .html без trailing slash: расхождение
— og:url: .../best-hotels-cancun-2026 (без / и без .html): тройное несоответствие canonical/og:url/реального пути
— JSON-LD mainEntityOfPage @id: тот же путь без / и без .html — несоответствует canonical
— og:locale — отсутствует
— Inline <style> дублирует часть article-v2.css (технический долг, не критично для SEO)
— В остальном: title, description, H1, hreflang, robots — все есть, OK

---

URL: https://travelradarlk.com/ru/content/cancun-vs-tulum-vs-playa-del-carmen-where-to-stay.html
STATUS: OK
— title, description, canonical, hreflang — все есть
— og:title, og:description, og:locale (ru_RU), og:url, og:image — все есть, OK
— JSON-LD: Article с datePublished, dateModified, inLanguage — OK
— H1 есть, robots: index, follow — OK
— hreflang x-default → /en/content/.../  — корректно
— Небольшое замечание: canonical и og:url оба заканчиваются на / — консистентно

---

URL: https://travelradarlk.com/ru/content/egypt-bez-obmana.html
STATUS: ISSUE
— canonical: .../egypt-bez-obmana/ (с /) но файл — .html без trailing slash
— og:url: .../egypt-bez-obmana (без / и без .html)
— JSON-LD @id: .../egypt-bez-obmana (без /) — несоответствие canonical
— og:locale — отсутствует
— hreflang x-default → /en/content/egypt-bez-obmana/ — OK

---

URL: https://travelradarlk.com/ru/content/entry-egypt-2026.html
STATUS: ISSUE
— canonical: .../entry-egypt-2026/ (с /) но файл — .html без trailing slash
— og:url: .../entry-egypt-2026 (без / и без .html)
— JSON-LD @id: .../entry-egypt-2026 (без /) — несоответствие canonical
— og:locale — отсутствует
— hreflang корректные (с /)
— В остальном: title, description, H1, robots — OK

---

URL: https://travelradarlk.com/ru/content/flights-egypt.html
STATUS: ISSUE
— canonical: .../flights-egypt/ (с /) но файл — .html без trailing slash
— og:url: .../flights-egypt (без / и без .html)
— JSON-LD @id: .../flights-egypt (без /) — несоответствие canonical
— og:locale — отсутствует
— hreflang корректные (с /)
— В остальном: title, description, H1, robots — OK

---

ПРОВЕРЕНО ВСЕГО: 20 URL

---

## Batch 3 — 2026-04-05 13:25

---

URL: https://travelradarlk.com/ru/content/hotel-check-before-booking.html
STATUS: ISSUE
— hreflang ru указывает на .../hotel-check-before-booking/ (с /) — не совпадает с canonical (без /)
— og:locale — отсутствует
— JSON-LD: inLanguage отсутствует (в отличие от kuda-poehat-bez-vizy.html — непоследовательно)
— internal-link href="/ru/content/hotel-rating-9-trap" — без .html и без / : потенциальный 404

---

URL: https://travelradarlk.com/ru/content/hotel-rating-9-trap.html
STATUS: ISSUE
— hreflang ru указывает на .../hotel-rating-9-trap/ (с /) — не совпадает с canonical (без /)
— og:locale — отсутствует
— JSON-LD: inLanguage отсутствует
— internal-link href="/ru/egypt/" — OK (директория), href="/ru/content/lifehacks/" — OK

---

URL: https://travelradarlk.com/ru/content/kuda-poehat-bez-vizy.html
STATUS: ISSUE
— hreflang ru указывает на .../kuda-poehat-bez-vizy/ (с /) — не совпадает с canonical (без /)
— og:locale — отсутствует
— internal-links (footer): /ru/content/egypt-bez-obmana, /ru/content/hotel-check-before-booking, /ru/content/where-to-stay-istanbul — все без .html и без / : потенциальные 404 при прямом запросе

---

URL: https://travelradarlk.com/ru/content/where-to-stay-in-cancun-hotel-zone-vs-downtown.html
STATUS: ISSUE
— hreflang ru указывает на .../where-to-stay-in-cancun-hotel-zone-vs-downtown/ — не совпадает с canonical (.html без /)
— og:locale — отсутствует
— JSON-LD: inLanguage отсутствует
— internal-links (footer): /ru/content/hotel-check-before-booking, /ru/content/hotel-rating-9-trap, /ru/content/kuda-poehat-bez-vizy — без .html расширения

---

URL: https://travelradarlk.com/ru/content/where-to-stay-istanbul.html
STATUS: ISSUE
— hreflang ru указывает на .../where-to-stay-istanbul/ — не совпадает с canonical (.html без /)
— og:locale — отсутствует
— JSON-LD: inLanguage отсутствует
— internal-link в footer: /ru/content/where-to-stay-istanbul-best-areas — без .html расширения

---

URL: https://travelradarlk.com/ru/content/where-to-stay-istanbul-best-areas.html
STATUS: ISSUE
— hreflang ru указывает на .../where-to-stay-istanbul-best-areas/ — не совпадает с canonical (.html без /)
— og:locale — отсутствует
— JSON-LD: inLanguage отсутствует
— internal-links (footer): /ru/content/where-to-stay-istanbul, /ru/content/hotel-rating-9-trap — без .html расширения

---

URL: https://travelradarlk.com/ru/privacy.html
STATUS: ISSUE
— hreflang указывают на /ru/privacy/, /en/privacy/, /ua/privacy/ — директории, canonical — .html файл: несоответствие
— og:url — отсутствует
— JSON-LD — отсутствует (приемлемо для legal-страниц, но не идеально)
— og:locale — отсутствует

---

URL: https://travelradarlk.com/ru/terms.html
STATUS: ISSUE
— hreflang указывают на /ru/terms/, /en/terms/, /ua/terms/ — директории, canonical — .html файл: несоответствие
— og:url — отсутствует
— JSON-LD — отсутствует
— og:locale — отсутствует

---

URL: https://travelradarlk.com/ru/disclaimer.html
STATUS: ISSUE
— hreflang указывают на /ru/disclaimer/, /en/disclaimer/, /ua/disclaimer/ — директории, canonical — .html файл: несоответствие
— og:url — отсутствует
— JSON-LD — отсутствует
— og:locale — отсутствует

---

URL: https://travelradarlk.com/en/
STATUS: OK
— title, description, canonical (https://travelradarlk.com/en/), hreflang — все есть
— robots: index, follow — OK
— lang="en", hreflang="en" — OK
— H1 «✈ Travel Radar LK» — есть
— x-default указывает на /en/ — OK
— og:url, og:locale — отсутствуют (незначительно для главной)

---

ПРОВЕРЕНО ВСЕГО: 30 URL

---

## Batch 4 — 2026-04-05 13:35

---

URL: https://travelradarlk.com/en/about.html
STATUS: OK
— title, description, canonical, hreflang (ru/en/uk/x-default) — все корректны, .html без /
— lang="en" — OK
— H1 «About» — есть
— robots: index, follow — OK
— внутренние ссылки: нет (страница About, норма)

---

URL: https://travelradarlk.com/en/egypt/
STATUS: OK
— title, description, canonical, hreflang — все есть и корректны
— lang="en", canonical /en/egypt/ — OK
— H1 «Egypt» — есть
— x-default → /en/egypt/ — OK
— site-header без data-lang (в отличие от других EN страниц)

---

URL: https://travelradarlk.com/en/turkey/
STATUS: OK
— title, description, canonical, hreflang — все корректны
— lang="en", canonical /en/turkey/ — OK
— H1 «Turkey» — есть
— site-header без data-lang

---

URL: https://travelradarlk.com/en/mexico/
STATUS: OK
— title, description, canonical, hreflang — все корректны
— lang="en", canonical /en/mexico/ — OK
— H1 «Mexico» — есть
— внутренние ссылки: /en/content/where-to-stay-in-cancun-hotel-zone-vs-downtown.html — с .html, корректно

---

URL: https://travelradarlk.com/en/content/
STATUS: ISSUE
— canonical — отсутствует
— hreflang указывают на /en/content/index.html/ — некорректно (должно быть /en/content/)
— meta description — отсутствует
— og:url, og:locale, og:title — отсутствуют

---

URL: https://travelradarlk.com/en/content/lifehacks/
STATUS: ISSUE
— canonical — отсутствует
— meta description — отсутствует
— hreflang указывают на /en/content/lifehacks/index.html/ — некорректно
— og:url, og:title — отсутствуют

---

URL: https://travelradarlk.com/en/content/countries/
STATUS: ISSUE
— canonical — отсутствует
— meta description — отсутствует
— hreflang указывают на /en/content/countries/index.html/ — некорректно
— og:url, og:title — отсутствуют

---

URL: https://travelradarlk.com/en/content/countries/egypt/
STATUS: ISSUE
— canonical — отсутствует
— meta description — отсутствует
— hreflang указывают на /en/content/countries/egypt/index.html/ — некорректно
— og:url, og:title — отсутствуют

---

URL: https://travelradarlk.com/en/content/countries/turkey/
STATUS: ISSUE
— canonical — отсутствует
— meta description — отсутствует
— hreflang указывают на /en/content/countries/turkey/index.html/ — некорректно
— og:url, og:title — отсутствуют

---

URL: https://travelradarlk.com/en/content/countries/mexico/
STATUS: OK
— canonical: /en/content/countries/mexico/ — есть и корректный
— hreflang ru/en/uk/x-default — все корректны (с /)
— description — есть, OK
— H1 «Mexico» — есть
— внутренние ссылки с /en/content/... .html — корректны

---

ПРОВЕРЕНО ВСЕГО: 40 URL

---

## Batch 5 — 2026-04-05 13:42

---

URL: https://travelradarlk.com/en/content/flights/
STATUS: OK
— canonical: /en/content/flights/ — корректный (добавлен скриптом fix-index-canonical)
— hreflang ru/en/uk/x-default — все корректны, со /
— title: «Flights | Travel Radar LK» — есть
— H1 «Flights» — есть
— description — отсутствует (ISSUE: мета-описания нет)
— robots: index, follow — OK
— внутренние ссылки: ../flights-egypt.html — с .html, корректно

---

URL: https://travelradarlk.com/en/content/collections/
STATUS: OK
— canonical: /en/content/collections/ — есть
— hreflang ru/en/uk/x-default — все корректны
— title, description — есть
— H1 «Collections» — есть
— Internal links: ../best-hotels-cancun-2026.html, ../kuda-poehat-bez-vizy.html — корректны

---

URL: https://travelradarlk.com/en/content/news/
STATUS: OK
— canonical: /en/content/news/ — есть
— hreflang ru/en/uk/x-default — все корректны
— title: «Travel News | Travel Radar LK» — есть
— H1 «News» — есть
— description — отсутствует (ISSUE: мета-описания нет)
— Internal links: ../entry-egypt-2026.html — корректно

---

URL: https://travelradarlk.com/en/content/best-hotels-cancun-2026.html
STATUS: OK
— canonical, og:url, @id — все совпадают, .html без /
— hreflang ru/en/uk/x-default — корректны
— og:locale — отсутствует (MINOR ISSUE)
— title, description, H1, robots — OK
— inLanguage: "en" — OK
— Schema: datePublished отсутствует в JSON-LD (только mainEntityOfPage/Article)
— Internal links absolutные (/en/content/...) — корректны

---

URL: https://travelradarlk.com/en/content/cancun-vs-tulum-vs-playa-del-carmen-where-to-stay.html
STATUS: OK
— canonical, og:url, @id — все одинаковые, без /
— hreflang ru/en/uk/x-default — корректны
— og:locale: en_US — есть
— inLanguage: "en" — OK
— datePublished: 2026-04-04 — есть
— H1 — есть
— Internal links абсолютные (/en/content/...) — корректны

---

URL: https://travelradarlk.com/en/content/egypt-bez-obmana.html
STATUS: OK
— canonical, og:url, @id — совпадают, .html без /
— hreflang ru/en/uk/x-default — корректны
— og:locale — отсутствует (MINOR ISSUE)
— inLanguage: "en" — OK
— datePublished: 2026-01-10 — есть
— H1 — есть
— Internal links: относительные (./) — OK для данного уровня

---

URL: https://travelradarlk.com/en/content/entry-egypt-2026.html
STATUS: OK
— canonical, og:url, @id — совпадают
— hreflang ru/en/uk/x-default — корректны
— og:locale — отсутствует (MINOR ISSUE)
— inLanguage: "en" — OK
— datePublished: 2026-02-05 — есть
— H1 — есть

---

URL: https://travelradarlk.com/en/content/flights-egypt.html
STATUS: OK
— canonical, og:url, @id — совпадают
— hreflang ru/en/uk/x-default — корректны
— og:locale — отсутствует (MINOR ISSUE)
— inLanguage: "en" — OK
— datePublished: 2026-01-27 — есть
— H1 — есть

---

URL: https://travelradarlk.com/en/content/hotel-check-before-booking.html
STATUS: ISSUE
— canonical: есть, корректный
— hreflang ru/en/uk/x-default — есть, корректны
— og:locale — отсутствует (MINOR ISSUE)
— inLanguage: "en" — OK
— Internal link: /en/content/hotel-rating-9-trap (БЕЗ .html) → потенциальный 404!

---

URL: https://travelradarlk.com/en/content/hotel-rating-9-trap.html
STATUS: ISSUE
— canonical: есть
— hreflang ru/en/uk/x-default — есть, корректны
— og:locale — отсутствует (MINOR ISSUE)
— inLanguage — отсутствует в JSON-LD (ISSUE)
— Internal link: /en/egypt/ — OK (directory), /en/content/lifehacks/ — OK

---

ПРОВЕРЕНО ВСЕГО: 50 URL



