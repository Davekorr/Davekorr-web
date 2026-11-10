/* GET /api/suggestions?days=7 — private list for the Apis waggle dance (Sirius).
   Needs secret SUGGEST_READ_TOKEN (same value in Sirius /etc/apis.env). */
const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export async function onRequestGet({ request, env }) {
  if (!env.SONGS || !env.SUGGEST_READ_TOKEN) return json(503, { error: 'not configured' });
  const auth = request.headers.get('Authorization') || '';
  if (auth !== `Bearer ${env.SUGGEST_READ_TOKEN}`) return json(401, { error: 'unauthorized' });
  const days = Math.min(90, Math.max(1, parseInt(new URL(request.url).searchParams.get('days') || '7', 10)));
  const since = new Date(Date.now() - days * 86400e3).toISOString();
  const out = []; let cursor;
  do {
    const page = await env.SONGS.list({ prefix: 's:', cursor });
    for (const k of page.keys) if (k.name.slice(2, 26) >= since) { const v = await env.SONGS.get(k.name); if (v) out.push(JSON.parse(v)); }
    cursor = page.list_complete ? null : page.cursor;
  } while (cursor);
  out.sort((a, b) => a.at < b.at ? -1 : 1);
  return json(200, { days, count: out.length, suggestions: out });
}

export const onRequest = () => json(405, { error: 'Use GET' });
