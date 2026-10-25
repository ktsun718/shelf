// Shelf's private helper on Cloudflare Workers.
//  - /auth/*   one-password login, signed sessions that can be revoked
//  - /sync     stores your shelf in a D1 database
//  - /tmdb/*   movie & TV look-ups; the TMDB key stays here, never in the browser
//  - /omdb/:id optional IMDb / Rotten Tomatoes scores
//
// Secrets (set with `wrangler secret put`): TMDB_KEY, SESSION_SECRET, SETUP_CODE, optional OMDB_KEY.

const ORIGINS = new Set(['https://ktsun718.github.io', 'http://127.0.0.1:8765', 'http://localhost:8765']);
const SESSION_DAYS = 180;
const PBKDF2_ITER = 100000; // Workers' maximum
const MAX_BODY = 6 * 1024 * 1024;
const MAX_RECORD = 1024 * 1024;
const ID_RE = /^[A-Za-z0-9_-]{1,64}$/;
const TMDB_PATHS = [
  /^\/search\/multi$/, /^\/movie\/\d{1,9}$/, /^\/tv\/\d{1,9}$/, /^\/tv\/\d{1,9}\/season\/\d{1,3}$/,
  /^\/collection\/\d{1,9}$/, /^\/collection\/\d{1,9}\/translations$/, /^\/configuration$/,
];
const TMDB_PARAMS = new Set(['query', 'language', 'append_to_response', 'include_adult', 'page']);

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || '';
    const cors = ORIGINS.has(origin)
      ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin', 'Access-Control-Allow-Headers': 'authorization, content-type', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Max-Age': '86400' }
      : {};
    if (req.method === 'OPTIONS') return new Response(null, { status: ORIGINS.has(origin) ? 204 : 403, headers: cors });
    let res;
    try {
      res = await route(req, env);
    } catch (e) {
      const status = e instanceof HttpError ? e.status : 500;
      if (status === 500) console.error(e);
      res = json({ error: status === 500 ? 'Something went wrong on the server' : e.message }, status);
    }
    for (const [k, v] of Object.entries(cors)) res.headers.set(k, v);
    return res;
  },
};

function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
      ...extra,
    },
  });
}

async function route(req, env) {
  const url = new URL(req.url);
  const p = url.pathname;
  const m = req.method;

  if (p === '/auth/status' && m === 'GET') return json({ ready: !!(await getMeta(env, 'pw')) });
  if (p === '/auth/setup' && m === 'POST') return setup(req, env);
  if (p === '/auth/login' && m === 'POST') return login(req, env);

  await requireSession(req, env);

  if (p === '/auth/logout-all' && m === 'POST') { await bumpVersion(env); return json({ ok: true }); }
  if (p === '/auth/password' && m === 'POST') return changePassword(req, env);
  if (p === '/sync' && m === 'GET') return pull(url, env);
  if (p === '/sync' && m === 'POST') return push(req, env);
  if (p.startsWith('/tmdb/') && m === 'GET') return tmdb(url, env);
  if (p.startsWith('/omdb/') && m === 'GET') return omdb(p.slice(6), env);
  throw new HttpError(404, 'Not found');
}

// ---------------- helpers ----------------

const enc = new TextEncoder();
const b64u = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64u = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));

async function readJson(req) {
  const len = +(req.headers.get('content-length') || 0);
  if (len > MAX_BODY) throw new HttpError(413, 'Too much data in one go');
  const text = await req.text();
  if (text.length > MAX_BODY) throw new HttpError(413, 'Too much data in one go');
  try { return JSON.parse(text); } catch { throw new HttpError(400, 'Bad request'); }
}

async function getMeta(env, key) {
  const row = await env.DB.prepare('SELECT value FROM meta WHERE key = ?').bind(key).first();
  return row ? row.value : null;
}
const setMeta = (env, key, value) => env.DB.prepare('INSERT INTO meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value').bind(key, String(value)).run();

async function hashPassword(password, saltB64) {
  const salt = saltB64 ? unb64u(saltB64) : crypto.getRandomValues(new Uint8Array(16));
  const keyMat = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: PBKDF2_ITER }, keyMat, 256);
  return { salt: b64u(salt), hash: b64u(bits) };
}

// Constant-time comparison of two strings.
async function same(a, b) {
  const [x, y] = await Promise.all([crypto.subtle.digest('SHA-256', enc.encode(a)), crypto.subtle.digest('SHA-256', enc.encode(b))]);
  const ua = new Uint8Array(x), ub = new Uint8Array(y);
  let diff = 0;
  for (let i = 0; i < ua.length; i++) diff |= ua[i] ^ ub[i];
  return diff === 0;
}

function checkNewPassword(pw) {
  if (typeof pw !== 'string' || pw.length < 10) throw new HttpError(400, 'Use at least 10 characters');
  if (pw.length > 200) throw new HttpError(400, 'That password is too long');
}

async function hmacKey(env) {
  if (!env.SESSION_SECRET || env.SESSION_SECRET.length < 32) throw new Error('SESSION_SECRET missing');
  return crypto.subtle.importKey('raw', enc.encode(env.SESSION_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

async function issueToken(env) {
  const v = +(await getMeta(env, 'pv')) || 1;
  const payload = b64u(enc.encode(JSON.stringify({ v, exp: Math.floor(Date.now() / 1000) + SESSION_DAYS * 86400 })));
  const sig = await crypto.subtle.sign('HMAC', await hmacKey(env), enc.encode(payload));
  return `${payload}.${b64u(sig)}`;
}

async function requireSession(req, env) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const [payload, sig] = token.split('.');
  if (!payload || !sig) throw new HttpError(401, 'Please sign in');
  let ok = false;
  try { ok = await crypto.subtle.verify('HMAC', await hmacKey(env), unb64u(sig), enc.encode(payload)); } catch { ok = false; }
  if (!ok) throw new HttpError(401, 'Please sign in');
  let data;
  try { data = JSON.parse(new TextDecoder().decode(unb64u(payload))); } catch { throw new HttpError(401, 'Please sign in'); }
  const v = +(await getMeta(env, 'pv')) || 1;
  if (data.v !== v || data.exp < Date.now() / 1000) throw new HttpError(401, 'Your session ended — please sign in again');
}

async function bumpVersion(env) {
  const v = +(await getMeta(env, 'pv')) || 1;
  await setMeta(env, 'pv', v + 1);
}

// Slow down password guessing: 8 misses per 15 min per address, 40 per hour overall.
async function rateLimit(req, env) {
  const ip = req.headers.get('cf-connecting-ip') || 'unknown';
  const now = Date.now();
  await env.DB.prepare('DELETE FROM attempts WHERE ts < ?').bind(now - 3600_000).run();
  const mine = await env.DB.prepare('SELECT COUNT(*) AS n FROM attempts WHERE ip = ? AND ts > ?').bind(ip, now - 900_000).first();
  const all = await env.DB.prepare('SELECT COUNT(*) AS n FROM attempts').first();
  if (mine.n >= 8 || all.n >= 40) throw new HttpError(429, 'Too many tries — wait 15 minutes and try again');
  return {
    fail: () => env.DB.prepare('INSERT INTO attempts (ip, ts) VALUES (?, ?)').bind(ip, now).run(),
    clear: () => env.DB.prepare('DELETE FROM attempts WHERE ip = ?').bind(ip).run(),
  };
}

// ---------------- auth ----------------

async function setup(req, env) {
  const limiter = await rateLimit(req, env);
  if (await getMeta(env, 'pw')) throw new HttpError(409, 'A password is already set — sign in instead');
  const { code, password } = await readJson(req);
  if (!env.SETUP_CODE || typeof code !== 'string' || !(await same(code.trim(), env.SETUP_CODE))) {
    await limiter.fail();
    throw new HttpError(403, 'That setup code isn’t right');
  }
  checkNewPassword(password);
  await setMeta(env, 'pw', JSON.stringify(await hashPassword(password)));
  await setMeta(env, 'pv', 1);
  await limiter.clear();
  return json({ token: await issueToken(env) });
}

async function login(req, env) {
  const limiter = await rateLimit(req, env);
  const { password } = await readJson(req);
  const stored = await getMeta(env, 'pw');
  if (!stored) throw new HttpError(409, 'No password set yet');
  const { salt, hash } = JSON.parse(stored);
  const attempt = typeof password === 'string' && password.length <= 200 ? (await hashPassword(password, salt)).hash : '';
  if (!(await same(attempt, hash))) {
    await limiter.fail();
    throw new HttpError(403, 'Wrong password');
  }
  await limiter.clear();
  return json({ token: await issueToken(env) });
}

async function changePassword(req, env) {
  const limiter = await rateLimit(req, env);
  const { current, next } = await readJson(req);
  const { salt, hash } = JSON.parse(await getMeta(env, 'pw'));
  const attempt = typeof current === 'string' && current.length <= 200 ? (await hashPassword(current, salt)).hash : '';
  if (!(await same(attempt, hash))) { await limiter.fail(); throw new HttpError(403, 'Current password is wrong'); }
  checkNewPassword(next);
  await setMeta(env, 'pw', JSON.stringify(await hashPassword(next)));
  await bumpVersion(env);
  return json({ token: await issueToken(env) });
}

// ---------------- sync ----------------

async function pull(url, env) {
  const since = url.searchParams.get('since') || '';
  const after = url.searchParams.get('after') || '';
  if (since.length > 40 || after.length > 64) throw new HttpError(400, 'Bad request');
  const { results } = await env.DB.prepare(
    'SELECT id, data, updated_at FROM records WHERE updated_at > ?1 OR (updated_at = ?1 AND id > ?2) ORDER BY updated_at, id LIMIT 500',
  ).bind(since, after).all();
  return json({ rows: results, more: results.length === 500 });
}

async function push(req, env) {
  const { records } = await readJson(req);
  if (!Array.isArray(records) || records.length > 100) throw new HttpError(400, 'Send up to 100 records at a time');
  const now = new Date().toISOString();
  const stmts = [];
  for (const r of records) {
    if (!r || typeof r !== 'object' || !ID_RE.test(r.id || '')) throw new HttpError(400, 'Bad record');
    const data = JSON.stringify(r);
    if (data.length > MAX_RECORD) throw new HttpError(413, 'One title has too much data (try a smaller picture)');
    // Last edit wins: never overwrite a newer copy with an older one.
    stmts.push(env.DB.prepare(
      `INSERT INTO records (id, data, updated_at) VALUES (?1, ?2, ?3)
       ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at
       WHERE coalesce(json_extract(excluded.data, '$.updatedAt'), '') >= coalesce(json_extract(records.data, '$.updatedAt'), '')`,
    ).bind(r.id, data, now));
  }
  if (stmts.length) await env.DB.batch(stmts);
  return json({ ok: true, at: now });
}

// ---------------- look-ups ----------------

async function tmdb(url, env) {
  const path = url.pathname.slice(5);
  if (!TMDB_PATHS.some((re) => re.test(path))) throw new HttpError(400, 'Not allowed');
  if (!env.TMDB_KEY) throw new HttpError(503, 'Movie search isn’t configured');
  const out = new URL(`https://api.themoviedb.org/3${path}`);
  for (const [k, v] of url.searchParams) {
    if (!TMDB_PARAMS.has(k) || v.length > 200) throw new HttpError(400, 'Not allowed');
    out.searchParams.set(k, v);
  }
  out.searchParams.set('api_key', env.TMDB_KEY);
  const r = await fetch(out, { headers: { accept: 'application/json' }, cf: { cacheTtl: 3600, cacheEverything: true } });
  if (!r.ok) throw new HttpError(r.status === 404 ? 404 : 502, r.status === 404 ? 'Not found on TMDB' : 'TMDB is not responding');
  return json(await r.json(), 200, { 'Cache-Control': 'private, max-age=300' });
}

async function omdb(id, env) {
  if (!/^tt\d{5,10}$/.test(id)) throw new HttpError(400, 'Bad id');
  if (!env.OMDB_KEY) throw new HttpError(404, 'Not configured');
  const r = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${encodeURIComponent(env.OMDB_KEY)}`, { cf: { cacheTtl: 86400, cacheEverything: true } });
  const d = await r.json();
  if (d.Response === 'False') throw new HttpError(404, 'Not found');
  const rt = (d.Ratings || []).find((x) => x.Source === 'Rotten Tomatoes');
  return json({ imdb: d.imdbRating !== 'N/A' ? d.imdbRating : null, rt: rt ? rt.Value : null }, 200, { 'Cache-Control': 'private, max-age=3600' });
}
