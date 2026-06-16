# Daily Ops — Персональный операционный планировщик

Личный инструмент для управления повторяющимися ежедневными задачами с пошаговыми инструкциями (Runbook).

> ⚠️ Личный инструмент. Не индексируется поисковиками. Ссылок с сайта нет.

---

## Доступ

```
https://travelradarlk.com/dev/ToDo/daily-ops
```

---

## Возможности

- Список повторяющихся задач с дедлайнами и расписанием (Repeat)
- Пошаговые инструкции выполнения (Runbook) для каждой задачи
- Цветные индикаторы статуса: запланировано / скоро / просрочено / выполнено
- Countdown до дедлайна в реальном времени
- История выполнений с точным временем
- Серия выполнений (Streak 🔥)
- Журнал по датам
- Синхронизация между устройствами через Cloudflare KV
- Экспорт / Импорт резервной копии (JSON)

---

## Архитектура

```
HTML (статика)          → travelradarlk.com/dev/ToDo/daily-ops
Cloudflare Worker (API) → daily-ops-api.leonid-cordon.workers.dev/tasks
Cloudflare KV (данные)  → namespace: DAILY_OPS_STORE / key: tasks_v1
```

**Поток данных:**
1. Страница загружается → мгновенный рендер из `localStorage` (кеш)
2. В фоне запрос к Worker → получает актуальные данные с KV
3. Любое изменение → сразу в `localStorage` + в фоне на Worker

---

## Настройки синхронизации

В файле `daily-ops.html`, блок `1. ДАННЫЕ И ХРАНЕНИЕ`:

```javascript
const WORKER_URL   = 'https://daily-ops-api.leonid-cordon.workers.dev/tasks';
const WORKER_TOKEN = '<WORKER_TOKEN>'; // секретный токен
```

Токен должен совпадать с тем что в Worker-е:
```javascript
// Cloudflare Worker (daily-ops-api)
const SECRET_TOKEN = '<WORKER_TOKEN>';
```

---

## Cloudflare Worker

**Файл:** настроен через Cloudflare Dashboard  
**Название:** `daily-ops-api`  
**URL:** `daily-ops-api.leonid-cordon.workers.dev`  
**KV Binding:** `DAILY_OPS_STORE` → namespace `DAILY_OPS_STORE`

Маршруты:
- `GET /tasks` — получить все задачи
- `PUT /tasks` — сохранить все задачи

Защита: Bearer-токен в заголовке `Authorization`.

---

## Резервная копия

Кнопка **Экспорт** на странице скачивает актуальные данные с сервера в файл:
```
daily-ops-backup-YYYY-MM-DD.json
```

Кнопка **Импорт** загружает JSON обратно на сервер (заменяет данные на всех устройствах).

---

## Что НЕ делать

- Не добавлять ссылки на эту страницу с публичных страниц сайта
- Не убирать `<meta name="robots" content="noindex, nofollow">` из HTML
- Не публиковать токен в открытом доступе

---

## Планируется

- [ ] Уведомления браузера (Notification API) за 15 мин до дедлайна
- [ ] Фильтр по Device в шапке
- [ ] Статистика выполнений (график по неделям)
- [ ] PWA — иконка на рабочем столе
