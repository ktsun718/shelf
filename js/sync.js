// Talks to your private Cloudflare helper: cloud sync + movie look-ups.
// The app works offline; edits are pushed whenever you're signed in and online.
import * as store from './store.js';
import { API_URL } from '../config.js';

const TOKEN_KEY = 'shelf.token';
let token = null;
try { token = localStorage.getItem(TOKEN_KEY); } catch {}
let status = 'off'; // off | signed-out | syncing | synced | error
let lastError = '';
const listeners = new Set();

const base = () => (API_URL || '').replace(/\/+$/, '');
export const configured = () => !!base();
export const signedIn = () => !!token;
export const getStatus = () => ({ status, error: lastError, configured: configured(), signedIn: !!token });
export function onStatus(fn) { listeners.add(fn); return () => listeners.delete(fn); }
function setStatus(s, err = '') { status = s; lastError = err; listeners.forEach((fn) => fn(getStatus())); }

function setToken(t) {
  token = t;
  try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); } catch {}
}

async function call(path, { method = 'GET', body, auth = true } = {}) {
  if (!configured()) throw new Error('Cloud isn’t set up yet');
  const headers = { accept: 'application/json' };
  if (body) headers['content-type'] = 'application/json';
  if (auth) {
    if (!token) throw new Error('Sign in first (Settings → Cloud)');
    headers.authorization = `Bearer ${token}`;
  }
  let r;
  try {
    r = await fetch(base() + path, { method, headers, body: body ? JSON.stringify(body) : undefined, credentials: 'omit', cache: 'no-store' });
  } catch {
    throw new Error('You seem to be offline');
  }
  let data = {};
  try { data = await r.json(); } catch {}
  if (r.status === 401 && auth) {
    setToken(null);
    setStatus('signed-out', 'Your session ended — please sign in again.');
  }
  if (!r.ok) throw new Error(data.error || `Request failed (${r.status})`);
  return data;
}

// Used by api.js for TMDB look-ups.
export const apiFetch = (path) => call(path);

export const authStatus = () => call('/auth/status', { auth: false });

export async function setupPassword(code, password) {
  const d = await call('/auth/setup', { method: 'POST', body: { code, password }, auth: false });
  setToken(d.token);
  syncNow();
}

export async function signIn(password) {
  const d = await call('/auth/login', { method: 'POST', body: { password }, auth: false });
  setToken(d.token);
  syncNow();
}

export function signOut() {
  setToken(null);
  setStatus('signed-out');
}

// Invalidates every device's session, including this one.
export async function signOutEverywhere() {
  await call('/auth/logout-all', { method: 'POST' });
  signOut();
}

export async function changePassword(current, next) {
  const d = await call('/auth/password', { method: 'POST', body: { current, next } });
  setToken(d.token);
}

export function initCloud() {
  if (!configured()) { setStatus('off'); return; }
  if (!token) { setStatus('signed-out'); return; }
  syncNow();
}

let running = null;
let again = false;

export function syncNow() {
  if (!configured() || !token) return Promise.resolve();
  if (running) { again = true; return running; }
  running = doSync().finally(() => {
    running = null;
    if (again) { again = false; syncNow(); }
  });
  return running;
}

async function doSync() {
  setStatus('syncing');
  try {
    // 1. pull what changed elsewhere (5 s overlap to be safe)
    const since = store.lastPull();
    const from = since ? new Date(new Date(since).getTime() - 5000).toISOString() : '';
    let cursor = from;
    let after = '';
    let newest = since;
    for (let page = 0; page < 50; page++) {
      const d = await call(`/sync?since=${encodeURIComponent(cursor)}&after=${encodeURIComponent(after)}`);
      if (d.rows.length) {
        store.mergeRemote(d.rows.map((r) => ({ id: r.id, data: JSON.parse(r.data), updated_at: r.updated_at })));
        const last = d.rows[d.rows.length - 1];
        newest = last.updated_at;
        cursor = last.updated_at;
        after = last.id;
      }
      if (!d.more) break;
    }
    // 2. push local edits
    const dirty = store.dirtyRecords();
    for (let i = 0; i < dirty.length; i += 100) {
      const chunk = dirty.slice(i, i + 100);
      await call('/sync', { method: 'POST', body: { records: chunk } });
      store.clearDirty(chunk);
    }
    if (newest) store.setLastPull(newest);
    setStatus('synced');
  } catch (e) {
    if (token) setStatus('error', e.message);
  }
}

// Push soon after local edits; pull when the app comes back to the front.
let pushTimer = null;
store.onEdit(() => {
  clearTimeout(pushTimer);
  pushTimer = setTimeout(syncNow, 1500);
});
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') syncNow();
  else store.flush();
});
addEventListener('online', () => syncNow());
setInterval(() => { if (document.visibilityState === 'visible') syncNow(); }, 60000);
