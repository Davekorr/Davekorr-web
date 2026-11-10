/* POST /api/suggest — "Suggest a song" from davekorr.com.
   Needs (Cloudflare Pages → Settings): KV binding SONGS, secret TURNSTILE_SECRET.
   Suggestions are stored privately for 90 days; nothing is ever shown on the site automatically. */
const MAX = { title: 120, artist: 120, by: 60, why: 280 };
const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export async function onRequestPost({ request, env }) {
  if (!env.SONGS || !env.TURNSTILE_SECRET) return json(503, { error: 'Suggestions are not switched on yet' });
  let d;
  try { d = await request.json(); } catch { return json(400, { error: 'Bad request' }); }
  const clean = {};
  for (const k of Object.keys(MAX)) clean[k] = String(d[k] || '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, MAX[k]);
  if (!clean.title || !clean.artist) return json(400, { error: 'Add the song and the artist' });

  // 1. spam check (Cloudflare Turnstile)
  const ip = request.headers.get('CF-Connecting-IP') || '';
  const form = new FormData(); form.append('secret', env.TURNSTILE_SECRET); form.append('response', String(d.token || '')); form.append('remoteip', ip);
  const ts = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form }).then(r => r.json()).catch(() => ({}));
  if (!ts.success) return json(403, { error: 'The spam check failed' });

  // 2. rate limit: 5 per visitor per day (visitor = hashed IP; the IP itself is never stored)
  const h = [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip + (env.TURNSTILE_SECRET || ''))))].slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('');
  const rlKey = `rl:${h}:${new Date().toISOString().slice(0, 10)}`;
  const n = parseInt(await env.SONGS.get(rlKey) || '0', 10);
  if (n >= 5) return json(429, { error: "That's plenty for today, thank you" });
  await env.SONGS.put(rlKey, String(n + 1), { expirationTtl: 86400 });

  // 3. store privately
  const at = new Date().toISOString();
  await env.SONGS.put(`s:${at}:${h}:${crypto.randomUUID().slice(0, 8)}`, JSON.stringify({ ...clean, at }), { expirationTtl: 90 * 86400 });
  return json(200, { ok: true });
}

export const onRequest = ({ request }) => json(405, { error: 'Use POST' });
