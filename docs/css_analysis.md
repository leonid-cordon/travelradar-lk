# Анализ CSS-архитектуры — Travel Radar LK

> [!NOTE]
> Только анализ. Файлы не изменялись.

---

## 1. Где и как используется `article.css`

### Подключение: **только в статьях**

`article.css` подключается **исключительно** в файлах типа `*.html` внутри директорий `ru/content/`, `en/content/`, `ua/content/`. Ни на главной (`ru/index.html`), ни на страницах стран (`ru/egypt/`, `ru/turkey/`, `ru/mexico/`), ни на страницах категорий (`ru/content/index.html`) он **не подключается**.

| Страница | article.css | content.css |
|---|---|---|
| `ru/index.html` (главная) | ❌ | ❌ |
| `ru/egypt/index.html` | ❌ | ❌ |
| `ru/turkey/index.html` | ❌ | ❌ |
| `ru/mexico/index.html` | ❌ | ❌ |
| `ru/content/index.html` (категория) | ❌ | ✅ |
| `ru/content/egypt-bez-obmana.html` | ✅ | ✅ |
| `ru/content/kuda-poehat-bez-vizy.html` | ✅ | ✅ |
| `ru/content/hotel-rating-9-trap.html` | ✅ | ✅ |
| `ru/content/where-to-stay-istanbul.html` | ✅ | ✅ |
| `ru/content/where-to-stay-in-cancun-hotel-zone-vs-downtown.html` | ✅ | ✅ |

**Вывод:** `article.css` безопасен. Он изолирован в рамках статей (content pages).

---

## 2. Классы `article-*` — где используются

### Классы из `article.css` (внешний файл)

| Класс | Где используется |
|---|---|
| `.article-hero` | Все статьи (секция с hero-картинкой) |
| `.article-hero-image` | Все статьи (тег `<img>`) |
| `.article-nav` | Все статьи (навигационная панель категорий) |
| `.article-container` | Все статьи (основной контейнер) |
| `.article-header` | Все статьи |
| `.article-title` | Старые статьи (в новых — h1 внутри hero) |
| `.article-content` | Все статьи (тег `<article>`) |
| `.article-point` | Все статьи (блок-раздел) |
| `.article-subpoint` | Все статьи (подраздел) |
| `.article-image` | Все статьи (обёртка изображения) |
| `.article-summary` | Старые статьи (kuda-poehat, egypt-bez-obmana) |
| `.article-summary--note` | Все статьи |
| `.article-checklist` | Старые статьи (egypt-bez-obmana) |
| `.article-footer` | Некоторые статьи |
| `.article-table` / `.article-table-intro` | Потенциально (определены в CSS) |
| `.article-subpoint--table` | Потенциально |
| `.article-meta` | ⚠️ Переопределяется в inline `<style>` |

**Вывод:** Все классы `article-*` используются **только в статьях**. На глобальных страницах проекта их нет.

---

## 3. Две системы CSS в статьях: сравнение

### Старые статьи (1–6, до `hotel-rating-9-trap`)

**Используют:** только внешний `article.css` + `content.css`. Без `<style>`.

Примеры: `egypt-bez-obmana`, `kuda-poehat-bez-vizy`, `flights-egypt`, `entry-egypt-2026`

**Структура:**
- `.article-hero` — высота 250px (из `article.css`)
- `.article-point` — карточки с border + gradient (из `article.css`)
- `.article-subpoint` — с border + gradient (из `article.css`)
- `.article-summary` / `.article-checklist` / `.article-footer`

---

### Новые статьи (7–9: `hotel-rating-9-trap`, `hotel-check`, Istanbul, Cancun)

**Используют:** внешний `article.css` + `content.css` **плюс** большой блок `<style>` внутри `<head>`.

**Что переопределяется во встроенном `<style>`:**

| Класс | В `article.css` | В `<style>` статьи | Конфликт? |
|---|---|---|---|
| `.article-hero` | `height: 250px` | `height: 350px` | ✅ ПЕРЕОПРЕДЕЛЯЕТ |
| `.article-hero-image` | `object-fit: cover` | + `transition: transform 6s ease` | Дополняет |
| `.article-hero::after` | Не определён | Добавлен overlay gradient | Добавляет |
| `.hero-content` | Не определён в article.css — только в home.css/egypt.css | Перемещён внутрь hero | ⚠️ Возможен конфликт |
| `.hero-subtitle` | Не в article.css | Переопределяет egypt.css / content.css | ⚠️ Зависит от cascade |
| `.article-point` | `margin: 3rem 0; border; gradient` | `margin: 70px 0` (без border!) | ✅ КОНФЛИКТ — новый перебивает старый |
| `.article-subpoint` | `border-radius: 12px; border; gradient` | `background: rgba(...); padding: 24px; border-radius: 14px` — без border! | ✅ КОНФЛИКТ |
| `.article-image` | `margin: 3rem 0` | `margin: 60px 0; border-radius: 18px; overflow: hidden` | ✅ ПЕРЕОПРЕДЕЛЯЕТ |
| `.article-image img` | `border-radius: 12px; border` | `width: 100%; display:block` (без border) | ✅ КОНФЛИКТ |
| `.article-meta` | Не определён в article.css | `display: flex; font-size: 0.88rem...` | Добавляет |
| `.article-summary--note` | `font-size: 0.95rem` | `padding: 35px; border-left; background` | ✅ ПЕРЕОПРЕДЕЛЯЕТ |
| `.article-content a` | Не в article.css | Добавлен hover opacity | Добавляет |
| `.reveal` | Не в article.css | Анимация появления | Добавляет (новый компонент) |

---

## 4. Новые классы только в `<style>` (нет в `article.css`)

Эти классы существуют **только** в inline-стилях новых статей — в `article.css` их нет:

| Класс | Назначение |
|---|---|
| `.article-lead` | Лид-подзаголовок |
| `.article-intro` | Вступительные абзацы |
| `.article-quote` | Цитатный блок (синяя полоса слева) |
| `.article-divider` | Декоративный разделитель |
| `.article-case` / `.case-label` | Мини-кейс (Канкун/Стамбул) |
| `.article-finale` | Финальный блок |
| `.article-point--accent` | Акцентный вариант article-point |
| `.checklist-premium` | Премиальный чек-лист |
| `.check-item` / `.check-icon` | Элементы чек-листа |
| `.match-cards` / `.match-card` / `.match-card-num` / `.match-card-text` | Карточки "метода совпадений" |
| `.reveal` / `.reveal.visible` | Анимация появления при скролле |
| `.lb-overlay` / `.lb-img-wrap` / `.lb-close` | Лайтбокс для изображений |
| `.image-caption` | Подпись к изображению |

---

## 5. Глобальные пересечения — классы, влияющие шире статей

### ⚠️ `.section-title` — дублируется в 3 файлах

Класс определён в:
- `base.css` (font-size: clamp(2rem, 4vw, 3rem))
- `egypt.css` (font-size: clamp(1.75rem, 3vw, 2.5rem))
- `content.css` (font-size: clamp(1.75rem, 3vw, 2.5rem))

Это **не конфликт**, но cascade-зависимость. Порядок подключения файлов важен.

### ⚠️ `.quick-nav-list` / `.quick-nav-item` — глобальные компоненты

Определены в `egypt.css` и `content.css`. Используются:
- На странице Egypt (`data-page="egypt"`) — sticky навигация
- На страницах Content (категории, index) — не sticky
- В статьях — внутри `.article-nav`, стилизуется через `article.css`

В статьях навигация рендерится внутри `.article-nav` (класс article.css), который содержит `.quick-nav-list` и `.quick-nav-item`. Это создаёт двойную вложенность — styles из `article.css` + styles из `content.css`/`egypt.css` могут накладываться.

**Риск:** На статьях применяются стили `.quick-nav-item.active` из `content.css` (без dashed border), а не из `egypt.css` (с dashed border). Это правильный порядок, но зависит от того, что `content.css` подключается **после** `article.css`.

### ⚠️ `.hero-content` / `.hero-subtitle` — переопределяется на каждой странице

`hero-content` — разный на каждом типе страницы:
- `home.css`: позиционирован слева, max-width: 700px
- `egypt.css`: z-index: 2, color: white
- `content.css`: `heroFadeUp` animation
- `<style>` в новых статьях: position: absolute, bottom: 40px, right: 60px

Cascade работает: `<style>` в `<head>` перебивает подключённые CSS-файлы для стилей выше по cascade. **Риска нет**, но порядок имеет значение.

### ✅ `.container` — глобальный, определён только в `base.css`

Используется везде, переопределений нет. Безопасен.

### ✅ `.destinations-grid` / `.content-card`

Определён в `home.css` и `content.css`. В статьях **не используется**. Безопасен.

---

## 6. Итог по рискам объединения

| Риск | Уровень | Описание |
|---|---|---|
| `.article-point` / `.article-subpoint` стили разные в старых и новых статьях | 🔴 Высокий | В старых — border + gradient + padding 1.75rem. В новых — нет border, нет gradient из CSS, только inline rgba() background с padding 24px. При объединении нужно выбрать один стандарт. |
| `.article-hero` высота различается | 🟡 Средний | Старые: 250px (из article.css). Новые: 350px (перебито в `<style>`). Нельзя унифицировать без дизайн-решения. |
| `.article-image` / `.article-image img` — разные скругления и отступы | 🟡 Средний | Старые: margin 3rem, radius 12px, border. Новые: margin 60px, radius 18px, нет border. |
| `.hero-content` расположение | 🟡 Средний | Старые (egypt-bez-obmana, kuda-poehat): `.hero-content` без position:absolute (отображается как обычный блок внутри section). Новые: position: absolute, bottom:40px, right:60px — поверх картинки. |
| Дублирование `.section-title` | 🟢 Низкий | Три файла, но не конфликт — cascade корректный. |
| `.quick-nav` стили | 🟢 Низкий | Работает корректно через cascade. |

---

## 7. Классификация статей по CSS-системе

### Группа A — «Старый стиль» (только external CSS)
| Статья | Дата |
|---|---|
| egypt-bez-obmana | 2026-01-10 |
| kuda-poehat-bez-vizy | 2026-01-18 |
| flights-egypt | 2026-01-27 |
| entry-egypt-2026 | 2026-02-05 |

**Характеристики:** hero 250px, article-point с border, article-subpoint с border, article-summary box.

---

### Группа B — «Новый стиль» (external CSS + inline `<style>`)
| Статья | Дата |
|---|---|
| hotel-rating-9-trap | 2026-02-17 |
| hotel-check-before-booking | 2026-02-23 |
| where-to-stay-istanbul | 2026-03-10 |
| where-to-stay-istanbul-best-areas | 2026-03-25 |
| where-to-stay-in-cancun-hotel-zone-vs-downtown | 2026-03-28 |

**Характеристики:** hero 350px с overlay, article-point без border (только отступ 70px), article-subpoint с rgba background, кастомные классы (quote, divider, reveal, lightbox, checklist-premium).

---

## 8. План безопасного перехода к единому CSS

### Принципы
1. **Не ломать ни одну статью** — переход пошаговый, через новый файл
2. **article.css остаётся нетронутым** до полной замены
3. Новые статьи уже используют `<style>` — это временные "патчи" для будущего файла

### Шаг 1. Создать `article-v2.css`

Вынести из `<style>` всех новых статей в `article-v2.css` следующие блоки:

```
.article-hero { height: 350px; }
.article-hero-image { transition: transform 6s ease; }
.article-hero::after { overlay gradient }
.hero-content { position:absolute; bottom 40px; right 60px }
.article-point { margin: 70px 0 }
.article-subpoint { background rgba; padding 24px; radius 14px }
.article-image { margin 60px 0; radius 18px; overflow hidden }
.article-lead, .article-intro
.article-quote, .article-divider
.article-case, .article-finale
.article-point--accent
.checklist-premium, .check-item, .check-icon
.match-cards, .match-card
.reveal, .reveal.visible
.lb-overlay (lightbox)
```

### Шаг 2. Подключить `article-v2.css` в новых статьях (替换 `<style>`)

Новые статьи (Группа B):
```html
<link rel="stylesheet" href="/assets/css/pages/article.css">
<link rel="stylesheet" href="/assets/css/pages/article-v2.css">
<!-- убрать <style>...</style> -->
```

### Шаг 3. Обновить старые статьи под единый стандарт

Для Группы A решить: принять стиль Группы B как эталон?
- Если да: добавить `article-v2.css` + адаптировать HTML (убрать `.article-summary`/`.article-checklist` или сохранить как legacy)
- Если нет: создать два подкласса — `article-classic.css` и `article-modern.css`

### Шаг 4. Объединить в один файл

Когда все статьи переведены на `article-v2.css`:
- Переименовать в `article.css` (заменить старый)
- Удалить старый `article.css` или архивировать

### Шаг 5. Убрать дублирование `content.css`

Проверить, что блоки `article-*` из `content.css` (блок внутри `@media (max-width: 768px)`) не конфликтуют с новым `article.css`. В `content.css` на строках 239–346 находится большой блок стилей `.article-content` **внутри** медиа-запроса — это визуальная иерархия для мобильных. Нужно решить: оставить их в `content.css` или перенести в `article.css`.

---

## 9. Итоговые ответы на вопросы задачи

### Где используется `article.css`?
**Только в статьях** (`/ru/content/*.html`, `/en/content/*.html`, `/ua/content/*.html`). На главной, страницах стран, страницах категорий — **не используется**.

### Безопасны ли классы `article-*`?
**Да, полностью безопасны.** Применяются только там, где подключён `article.css`. Не затрагивают главную, Egypt/Turkey/Mexico страницы, категории.

### Есть ли риски объединения?
**Да, три реальных риска:**
1. Разная высота hero (250px vs 350px) — нужно выбрать стандарт
2. Разный визуал `.article-point` и `.article-subpoint` — старые имеют border/gradient из CSS, новые — нет
3. Разное позиционирование `.hero-content` — в старых он не absolute (флоу), в новых — absolute поверх картинки

### Ключевой вывод

Две системы сложились органически: Группа A пишет в "базовом" стиле (external CSS), Группа B — в "редакционном" (inline enrichment). При переходе нужно:
- Принять дизайн Группы B за эталон (он богаче и современнее)
- Вынести inline-стили в общий `article-v2.css`
- Обновить Группу A статей под новый стандарт (или оставить legacy)
- **Не трогать** `content.css`, `egypt.css`, `home.css` — они не конфликтуют
