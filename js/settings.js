// Settings: data sources, cloud sync, rating categories, backup.
import * as store from './store.js';
import * as sync from './sync.js';
import { testTmdbKey } from './api.js';
import { loadSamples } from './samples.js';
import { esc, icon, toast, confirmSheet } from './ui.js';

const SQL = `create table public.shelf_records (
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  id text not null,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);
alter table public.shelf_records enable row level security;
create policy "own rows" on public.shelf_records for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create or replace function public.shelf_touch() returns trigger
  language plpgsql as $$ begin new.updated_at = now(); return new; end $$;
create trigger shelf_touch before insert or update on public.shelf_records
  for each row execute function public.shelf_touch();
create index on public.shelf_records (user_id, updated_at);`;

export function renderSettings(root) {
  const st = store.settings();
  root.innerHTML = `<section class="page wrap settings">
    <header class="page-head">
      <p class="eyebrow fade-up" style="--d:0">Shelf</p>
      <h1 class="large-title fade-up" style="--d:1">Settings</h1>
    </header>

    <div class="panel reveal">
      <div class="panel-head"><h2>Movie & TV information</h2><span class="badge ${st.tmdbKey ? 'ok' : ''}">${st.tmdbKey ? 'Connected' : 'Not connected'}</span></div>
      <p class="muted">Free key from <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener">themoviedb.org ↗</a> — gives posters, descriptions, Hong Kong titles, seasons and episodes. Either the “API Key” or the “API Read Access Token” works.</p>
      <div class="inline-form">
        <input type="password" placeholder="Paste your TMDB key" value="${esc(st.tmdbKey)}" data-tmdb autocomplete="off">
        <button class="btn btn-light btn-sm" data-save-tmdb>Test & save</button>
      </div>
    </div>

    <div class="panel reveal">
      <div class="panel-head"><h2>IMDb & Rotten Tomatoes scores</h2><span class="badge ${st.omdbKey ? 'ok' : ''}">${st.omdbKey ? 'On' : 'Optional'}</span></div>
      <p class="muted">Free key from <a href="https://www.omdbapi.com/apikey.aspx" target="_blank" rel="noopener">omdbapi.com ↗</a> (choose FREE, 1,000 look-ups a day). Without it you still get TMDB scores.</p>
      <div class="inline-form">
        <input type="password" placeholder="Paste your OMDb key" value="${esc(st.omdbKey)}" data-omdb autocomplete="off">
        <button class="btn btn-light btn-sm" data-save-omdb>Save</button>
      </div>
    </div>

    <div class="panel reveal" data-cloud></div>

    <div class="panel reveal">
      <div class="panel-head"><h2>Rating categories</h2><button class="btn btn-glass btn-xs" data-reset-cats>Reset</button></div>
      <p class="muted">The things you score besides “Overall”. Changes apply to every title of that type.</p>
      ${['movie', 'tv', 'book'].map((k) => `<div class="cat-edit" data-kind="${k}">
        <h3>${{ movie: 'Movies', tv: 'TV shows & seasons', book: 'Books' }[k]}</h3>
        <div class="cat-chips">
          ${st.categories[k].map((c) => `<span class="cat-chip">${esc(c)}<button data-del-cat="${esc(c)}" aria-label="Remove ${esc(c)}">${icon.close}</button></span>`).join('')}
          <form class="cat-add" data-add-cat><input placeholder="Add…" maxlength="24"><button aria-label="Add category">${icon.plus}</button></form>
        </div>
      </div>`).join('')}
    </div>

    <div class="panel reveal">
      <div class="panel-head"><h2>Your data</h2></div>
      <div class="btn-grid">
        <button class="btn btn-glass btn-sm" data-export>Download a backup</button>
        <label class="btn btn-glass btn-sm file-btn">Restore a backup<input type="file" accept="application/json,.json" hidden data-import></label>
        ${store.hasSamples() ? '<button class="btn btn-glass btn-sm" data-rm-samples>Remove sample titles</button>' : '<button class="btn btn-glass btn-sm" data-samples>Load sample titles</button>'}
      </div>
    </div>

    <p class="muted small about">Shelf · Movie & TV data from TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB. Book data from Open Library and Google Books.</p>
  </section>`;

  const cloud = root.querySelector('[data-cloud]');
  const paintCloud = () => { cloud.innerHTML = cloudPanel(); bindCloud(cloud, paintCloud); };
  paintCloud();
  const off = sync.onStatus(() => { if (cloud.isConnected) paintCloud(); });

  root.querySelector('[data-save-tmdb]').onclick = async (e) => {
    const key = root.querySelector('[data-tmdb]').value.trim();
    const btn = e.currentTarget;
    const before = store.settings().tmdbKey;
    store.setSettings({ tmdbKey: key });
    if (!key) { toast('TMDB key removed'); return renderSettings(root); }
    btn.classList.add('loading');
    try {
      await testTmdbKey();
      toast('TMDB connected ✓');
      renderSettings(root);
    } catch (err) {
      store.setSettings({ tmdbKey: before });
      toast(err.message.includes('rejected') ? 'That key didn’t work — check you copied all of it' : err.message);
      btn.classList.remove('loading');
    }
  };
  root.querySelector('[data-save-omdb]').onclick = () => {
    store.setSettings({ omdbKey: root.querySelector('[data-omdb]').value.trim() });
    toast('Saved');
    renderSettings(root);
  };

  const cats = () => structuredClone(store.settings().categories);
  root.querySelectorAll('[data-del-cat]').forEach((b) => b.onclick = () => {
    const k = b.closest('[data-kind]').dataset.kind;
    const c = cats();
    c[k] = c[k].filter((x) => x !== b.dataset.delCat);
    store.setSettings({ categories: c });
    renderSettings(root);
  });
  root.querySelectorAll('[data-add-cat]').forEach((f) => f.onsubmit = (e) => {
    e.preventDefault();
    const v = f.querySelector('input').value.trim();
    const k = f.closest('[data-kind]').dataset.kind;
    const c = cats();
    if (v && !c[k].includes(v)) { c[k].push(v); store.setSettings({ categories: c }); }
    renderSettings(root);
    root.querySelector(`[data-kind="${k}"] .cat-add input`)?.focus();
  });
  root.querySelector('[data-reset-cats]').onclick = () => { store.setSettings({ categories: store.DEFAULT_CATEGORIES }); renderSettings(root); };

  root.querySelector('[data-export]').onclick = () => {
    const blob = new Blob([store.exportAll()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `shelf-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  root.querySelector('[data-import]').onchange = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    try { toast(`Restored ${store.importAll(await f.text())} records`); } catch (err) { toast(err.message); }
  };
  root.querySelector('[data-samples]')?.addEventListener('click', () => { loadSamples(); toast('Samples added'); location.hash = '#/'; });
  root.querySelector('[data-rm-samples]')?.addEventListener('click', async () => {
    if (await confirmSheet('Remove sample titles?', 'Only the samples are removed. Anything you added stays.')) {
      store.removeSamples();
      renderSettings(root);
    }
  });
  return off;
}

function cloudPanel() {
  const { status, user, error } = sync.getStatus();
  const cfg = sync.cloudConfig();
  const label = { off: 'Off', 'signed-out': 'Signed out', syncing: 'Syncing…', synced: 'Synced', error: 'Problem' }[status];
  let body;
  if (!cfg.url || !cfg.key || (status === 'error' && !user)) {
    body = `<p class="muted">Sync between your phone and computer with a free <a href="https://supabase.com" target="_blank" rel="noopener">Supabase ↗</a> project. The setup guide walks you through it.</p>
      ${error ? `<p class="err">${esc(error)}</p>` : ''}
      <div class="stack-form">
        <input placeholder="Project URL (https://….supabase.co)" value="${esc(cfg.url)}" data-url ${cfg.fromFile ? 'disabled' : ''}>
        <input placeholder="Publishable or anon key" value="${esc(cfg.key)}" data-key ${cfg.fromFile ? 'disabled' : ''}>
        <button class="btn btn-light btn-sm" data-connect>Connect</button>
      </div>
      <details class="sql"><summary>Setup SQL (run once in Supabase → SQL Editor)</summary><pre>${esc(SQL)}</pre><button class="btn btn-glass btn-xs" data-copy-sql>Copy SQL</button></details>`;
  } else if (!user) {
    body = `<p class="muted">Sign in to sync. Use the same email and password on every device.</p>
      <form class="stack-form" data-auth>
        <input type="email" placeholder="Email" autocomplete="username" required data-email>
        <input type="password" placeholder="Password (6+ characters)" autocomplete="current-password" required minlength="6" data-pass>
        <div class="btn-grid"><button class="btn btn-light btn-sm" data-signin>Sign in</button><button class="btn btn-glass btn-sm" type="button" data-signup>Create account</button></div>
      </form>
      ${error ? `<p class="err">${esc(error)}</p>` : ''}
      <button class="link-btn" data-forget>Use a different Supabase project</button>`;
  } else {
    body = `<p>Signed in as <b>${esc(user.email)}</b></p>
      ${error ? `<p class="err">${esc(error)}</p>` : '<p class="muted">Everything you change is saved to the cloud automatically.</p>'}
      <div class="btn-grid"><button class="btn btn-glass btn-sm" data-sync>${icon.refresh}<span>Sync now</span></button><button class="btn btn-glass btn-sm" data-signout>Sign out</button></div>`;
  }
  return `<div class="panel-head"><h2>Cloud sync</h2><span class="badge ${status === 'synced' ? 'ok' : status === 'error' ? 'bad' : ''}">${label}</span></div>${body}`;
}

function bindCloud(el, repaint) {
  el.querySelector('[data-connect]')?.addEventListener('click', async (e) => {
    const url = el.querySelector('[data-url]').value.trim();
    const key = el.querySelector('[data-key]').value.trim();
    if (!/^https:\/\/.+/.test(url) || !key) return toast('Paste both the Project URL and the key');
    e.currentTarget.classList.add('loading');
    sync.saveCloudConfig(url, key);
    await sync.initCloud();
    repaint();
  });
  el.querySelector('[data-copy-sql]')?.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(SQL); toast('SQL copied'); } catch { toast('Select the text and copy it manually'); }
  });
  const form = el.querySelector('[data-auth]');
  if (form) {
    const creds = () => [el.querySelector('[data-email]').value.trim(), el.querySelector('[data-pass]').value];
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = el.querySelector('[data-signin]');
      btn.classList.add('loading');
      try { await sync.signIn(...creds()); toast('Signed in'); } catch (err) { toast(err.message); btn.classList.remove('loading'); }
    });
    el.querySelector('[data-signup]').addEventListener('click', async (e) => {
      if (!form.reportValidity()) return;
      const btn = e.currentTarget;
      btn.classList.add('loading');
      try {
        const live = await sync.signUp(...creds());
        toast(live ? 'Account created — syncing' : 'Check your email to confirm, then sign in');
      } catch (err) { toast(err.message); }
      btn.classList.remove('loading');
    });
  }
  el.querySelector('[data-forget]')?.addEventListener('click', async () => { sync.saveCloudConfig('', ''); await sync.initCloud(); repaint(); });
  el.querySelector('[data-sync]')?.addEventListener('click', () => sync.syncNow());
  el.querySelector('[data-signout]')?.addEventListener('click', async () => { await sync.signOut(); repaint(); });
}
