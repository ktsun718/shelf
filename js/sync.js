// Optional cloud sync through Supabase (free tier). Data stays usable
// offline; changes are pushed whenever a connection is available.
import * as store from './store.js';
import { SUPABASE_URL, SUPABASE_KEY } from '../config.js';

const TABLE = 'shelf_records';
const LOCAL_CFG = 'shelf.cloud';
let client = null;
let user = null;
let status = 'off'; // off | signed-out | syncing | synced | error
let lastError = '';
const listeners = new Set();

export function cloudConfig() {
  let local = {};
  try { local = JSON.parse(localStorage.getItem(LOCAL_CFG) || '{}'); } catch {}
  return { url: SUPABASE_URL || local.url || '', key: SUPABASE_KEY || local.key || '', fromFile: !!SUPABASE_URL };
}

export function saveCloudConfig(url, key) {
  try { localStorage.setItem(LOCAL_CFG, JSON.stringify({ url: url.trim(), key: key.trim() })); } catch {}
}

export const getStatus = () => ({ status, user, error: lastError, configured: !!client });
export function onStatus(fn) { listeners.add(fn); return () => listeners.delete(fn); }
function setStatus(s, err = '') { status = s; lastError = err; listeners.forEach((fn) => fn(getStatus())); }

export async function initCloud() {
  const { url, key } = cloudConfig();
  if (!url || !key) { client = null; setStatus('off'); return; }
  try {
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.3/+esm');
    client = createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true, storageKey: 'shelf.auth' } });
    const { data } = await client.auth.getSession();
    user = data.session?.user || null;
    client.auth.onAuthStateChange((_event, session) => {
      const was = user?.id;
      user = session?.user || null;
      if (!user) setStatus('signed-out');
      else if (user.id !== was) syncNow();
    });
    if (user) syncNow(); else setStatus('signed-out');
  } catch (e) {
    client = null;
    setStatus('error', 'Could not reach Supabase — check the URL and key.');
  }
}

export async function signIn(email, password) {
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signUp(email, password) {
  const { data, error } = await client.auth.signUp({ email, password });
  if (error) throw error;
  return !!data.session; // false means "check your email to confirm"
}

export async function signOut() {
  await client.auth.signOut();
  user = null;
  setStatus('signed-out');
}

let running = null;
let again = false;

export function syncNow() {
  if (!client || !user) return Promise.resolve();
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
    // 1. pull everything changed since last time (5 s overlap to be safe)
    const since = store.lastPull();
    let newest = since;
    for (let from = 0; ; from += 1000) {
      let q = client.from(TABLE).select('id,data,updated_at').order('updated_at').range(from, from + 999);
      if (since) q = q.gte('updated_at', new Date(new Date(since).getTime() - 5000).toISOString());
      const { data, error } = await q;
      if (error) throw error;
      if (data.length) {
        store.mergeRemote(data);
        newest = data[data.length - 1].updated_at;
      }
      if (data.length < 1000) break;
    }
    // 2. push local changes
    const dirty = store.dirtyRecords();
    for (let i = 0; i < dirty.length; i += 200) {
      const chunk = dirty.slice(i, i + 200);
      const rows = chunk.map((r) => ({ id: r.id, user_id: user.id, data: r }));
      const { error } = await client.from(TABLE).upsert(rows, { onConflict: 'user_id,id' });
      if (error) throw error;
      store.clearDirty(chunk);
    }
    if (newest) store.setLastPull(newest);
    setStatus('synced');
  } catch (e) {
    const msg = String(e.message || e);
    setStatus('error', /relation|does not exist|schema cache/i.test(msg)
      ? 'The shelf_records table is missing — run the setup SQL in Supabase.'
      : msg);
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
setInterval(() => { if (document.visibilityState === 'visible') syncNow(); }, 60000);
