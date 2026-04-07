# Head Templates for Indexable Pages

Этот набор шаблонов закрывает единый `head`-стандарт для основных типов индексируемых страниц проекта.

## Файлы

- `article-template.html` — новые article-страницы
- `page-template.html` — about / legal / одиночные статические страницы
- `collection-template.html` — content-index / category / listing страницы
- `country-hub-template.html` — country hub страницы
- `home-template.html` — базовый SEO-head для главной

## Что стандартизировано

- `title`
- `meta description`
- `robots`
- `canonical`
- `hreflang`
- `og:title`
- `og:description`
- `og:type`
- `og:url`
- `og:image`
- `og:site_name`
- `og:locale`
- `twitter:card`
- `twitter:title`
- `twitter:description`
- `twitter:image`
- JSON-LD под тип страницы

## Как использовать

1. Выберите нужный шаблон по типу страницы.
2. Подставьте язык: `ru`, `en`, `uk`.
3. Замените URL, title, description, image и `inLanguage`.
4. Для мультиязычных страниц обновите весь блок `hreflang`.
5. Проверьте, чтобы `canonical`, `og:url` и JSON-LD `url` совпадали.

## Языковые правила

- RU: `lang="ru"`, `og:locale="ru_RU"`, `inLanguage="ru"`
- EN: `lang="en"`, `og:locale="en_US"`, `inLanguage="en"`
- UA: `lang="uk"`, `og:locale="uk_UA"`, `inLanguage="uk"`

## Замечание

Шаблоны задают единый стандарт для новых страниц. Для уже существующих страниц можно постепенно приводить `head` к этим заготовкам по мере обновления контента и структуры.
