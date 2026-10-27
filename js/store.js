// Local-first data store. Every record lives in localStorage and is
// pushed to the cloud (if connected) by sync.js.

const KEY = 'shelf.v1';
const listeners = new Set();

export const DEFAULT_CATEGORIES = {
  movie: ['Story', 'Acting', 'Visuals', 'Music', 'Pacing'],
  tv: ['Story', 'Characters', 'Acting', 'Visuals', 'Pacing'],
  book: ['Plot', 'Characters', 'Writing', 'Pacing', 'Ideas'],
};

let db = { records: {}, dirty: {}, lastPull: null };

try {
  const raw = localStorage.getItem(KEY);
  if (raw) db = { ...db, ...JSON.parse(raw) };
} catch { /* first run or blocked storage */ }

let saveTimer = null;
function persist() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { console.warn('Save failed', e); }
  }, 120);
}

export function flush() {
  clearTimeout(saveTimer);
  try { localStorage.setItem(KEY, JSON.stringify(db)); } catch {}
}

export const uid = (p = 'i') => `${p}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
const now = () => new Date().toISOString();

export function onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }
function emit(source) { listeners.forEach((fn) => fn(source)); }

// Fires on every local edit (even silent ones) so sync.js can push it.
const editListeners = new Set();
export function onEdit(fn) { editListeners.add(fn); }
const edited = () => editListeners.forEach((fn) => fn());

export function get(id) {
  const r = db.records[id];
  return r && !r.deleted ? r : null;
}

export function put(rec, { silent = true } = {}) {
  rec.updatedAt = now();
  rec.addedAt ||= rec.updatedAt;
  db.records[rec.id] = rec;
  db.dirty[rec.id] = 1;
  persist();
  edited();
  if (!silent) emit('local');
  return rec;
}

// Adds records keeping their own timestamps (used for the starter list).
export function seed(recs) {
  for (const r of recs) {
    if (db.records[r.id]) continue;
    db.records[r.id] = r;
    db.dirty[r.id] = 1;
  }
  persist();
  edited();
  emit('local');
}

export function putMany(recs) {
  recs.forEach((r) => put(r));
  emit('local');
}

export function remove(id) {
  const rec = db.records[id];
  if (!rec) return;
  db.records[id] = { id, kind: rec.kind, deleted: true, updatedAt: now() };
  db.dirty[id] = 1;
  // drop the item from any groups that list it
  for (const g of groups()) {
    if (g.members?.includes(id)) { g.members = g.members.filter((m) => m !== id); put(g); }
  }
  persist();
  edited();
  emit('local');
}

export const items = () => Object.values(db.records).filter((r) => !r.deleted && ['movie', 'tv', 'book'].includes(r.kind));
export const groups = () => Object.values(db.records).filter((r) => !r.deleted && r.kind === 'group');
export const groupsOf = (id) => groups().filter((g) => g.members?.includes(id));

export function settings() {
  const s = db.records.settings || {};
  return {
    showWishScores: false,
    ...s,
    categories: { ...DEFAULT_CATEGORIES, ...(s.categories || {}) },
  };
}

export function setSettings(patch) {
  const cur = db.records.settings || { id: 'settings', kind: 'settings' };
  put({ ...cur, ...patch, id: 'settings', kind: 'settings' });
}

// ---- sync helpers ----
export const dirtyRecords = () => Object.keys(db.dirty).map((id) => db.records[id]).filter(Boolean);
export function clearDirty(pushed) {
  for (const r of pushed) if (db.records[r.id]?.updatedAt === r.updatedAt) delete db.dirty[r.id];
  persist();
}
export const lastPull = () => db.lastPull;
export function setLastPull(t) { db.lastPull = t; persist(); }

// Last-write-wins merge of rows pulled from the cloud.
export function mergeRemote(rows) {
  let changed = false;
  for (const row of rows) {
    const remote = row.data;
    const local = db.records[row.id];
    if (!local || (remote.updatedAt || '') > (local.updatedAt || '')) {
      db.records[row.id] = remote;
      delete db.dirty[row.id];
      changed = true;
    }
  }
  if (changed) { persist(); emit('remote'); }
  return changed;
}

export function exportAll() {
  return JSON.stringify({ app: 'shelf', version: 1, exportedAt: now(), records: Object.values(db.records).filter((r) => !r.deleted) }, null, 2);
}

export function importAll(json) {
  const data = JSON.parse(json);
  if (!Array.isArray(data.records)) throw new Error('Not a Shelf backup file');
  for (const r of data.records) { db.records[r.id] = r; db.dirty[r.id] = 1; }
  persist();
  edited();
  emit('local');
  return data.records.length;
}

export function removeSamples() {
  Object.values(db.records).filter((r) => r.sample && !r.deleted).forEach((r) => {
    db.records[r.id] = { id: r.id, kind: r.kind, deleted: true, updatedAt: now() };
    db.dirty[r.id] = 1;
  });
  persist();
  edited();
  emit('local');
}

export const hasSamples = () => Object.values(db.records).some((r) => r.sample && !r.deleted);
