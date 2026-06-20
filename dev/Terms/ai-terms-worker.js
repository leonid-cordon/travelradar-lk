// ============================================================
// ai-terms-api — Worker для синхронизации базы терминов
// Тот же принцип, что и daily-ops-api: токен + KV + два метода
// ============================================================

// ⚠️ ЗАМЕНИ на свою секретную строку перед деплоем.
// Это не банковский пароль, но не публикуй её в открытом репозитории.
const TOKEN = 'ai-terms-secret-2026-change-me';

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');
    const cors = corsHeaders(origin);

    // Браузер сначала спрашивает разрешение (preflight) перед PUT-запросом
    // с заголовком Authorization — отвечаем "да, можно" без проверки токена.
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: cors });
    }

    if (url.pathname !== '/terms') {
      return new Response('Not found', { status: 404, headers: cors });
    }

    // Проверка токена — как швейцар у daily-ops-api
    const auth = request.headers.get('Authorization') || '';
    if (auth !== `Bearer ${TOKEN}`) {
      return new Response('Unauthorized', { status: 401, headers: cors });
    }

    // Отдать все термины
    if (request.method === 'GET') {
      const data = await env.AI_TERMS_STORE.get('terms_v1');
      return new Response(data || '[]', {
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    }

    // Сохранить все термины (весь массив целиком, как в daily-ops)
    if (request.method === 'PUT') {
      const body = await request.text();
      try {
        const parsed = JSON.parse(body);
        if (!Array.isArray(parsed)) throw new Error('not an array');
      } catch (e) {
        return new Response('Invalid JSON — ожидался массив терминов', { status: 400, headers: cors });
      }
      await env.AI_TERMS_STORE.put('terms_v1', body);
      return new Response('OK', { headers: cors });
    }

    return new Response('Method not allowed', { status: 405, headers: cors });
  },
};
