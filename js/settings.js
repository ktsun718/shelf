// Settings: cloud account, display options, rating categories, backup.
import * as store from './store.js';
import * as sync from './sync.js';
import { loadSamples } from './samples.js';
import { esc, icon, toast, confirmSheet } from './ui.js';

export function renderSettings(root) {
  const st = store.settings();
  root.innerHTML = `<section class="page wrap settings">
    <header class="page-head">
      <p class="eyebrow fade-up" style="--d:0"><i class="live-dot"></i>Shelf</p>
      <h1 class="large-title fade-up" style="--d:1"><em>Settings</em></h1>
    </header>

    <div class="panel reveal" data-cloud></div>

    <div class="panel reveal">
      <div class="panel-head"><h2>Display</h2></div>
      <label class="switch-row">
        <span><b>Online scores on wishlist titles</b><small class="muted">Off keeps IMDb/TMDB scores hidden until you’ve watched it — no outside opinions before you decide. You can still peek on each title.</small></span>
        <input type="checkbox" class="switch" data-wishscores ${st.showWishScores ? 'checked' : ''}>
      </label>
    </div>

    <div class="panel reveal">
      <div class="panel-head"><h2>Rating categories</h2><button class="btn btn-glass btn-xs" data-reset-cats>Reset</button></div>
      <p class="muted">The colourful bars under “The details”. Changes apply to every title of that type.</p>
      ${['movie', 'tv', 'book'].map((k) => `<div class="cat-edit" data-kind="${k}">
        <h3>${{ movie: 'Movies', tv: 'TV shows & seasons', book: 'Books' }[k]}</h3>
        <div class="cat-chips">
          ${st.categories[k].map((c) => `<span class="cat-chip">${esc(c)}<button data-del-cat="${esc(c)}" aria-label="Remove ${esc(c)}">${icon.close}</button></span>`).join('')}
          <form class="cat-add" data-add-cat><input placeholder="Add…" maxlength="24" aria-label="New category"><button aria-label="Add category">${icon.plus}</button></form>
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
  const paintCloud = async () => {
    cloud.innerHTML = cloudPanel(null);
    let needsSetup = false;
    if (sync.configured() && !sync.signedIn()) {
      try { needsSetup = !(await sync.authStatus()).ready; } catch { /* offline: show the sign-in form */ }
    }
    if (!cloud.isConnected) return;
    cloud.innerHTML = cloudPanel(needsSetup);
    bindCloud(cloud, paintCloud);
  };
  paintCloud();
  const off = sync.onStatus(() => { if (cloud.isConnected && !cloud.contains(document.activeElement)) paintCloud(); });

  root.querySelector('[data-wishscores]').onchange = (e) => {
    store.setSettings({ showWishScores: e.target.checked });
    toast(e.target.checked ? 'Wishlist scores shown' : 'Wishlist scores hidden');
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
    if (v && !c[k].includes(v) && c[k].length < 10) { c[k].push(v); store.setSettings({ categories: c }); }
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
    if (f.size > 20 * 1024 * 1024) { toast('That file is too big to be a Shelf backup'); return; }
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

function cloudPanel(needsSetup) {
  const { status, error, configured, signedIn } = sync.getStatus();
  const label = { off: 'Not set up', 'signed-out': 'Signed out', syncing: 'Syncing…', synced: 'Synced', error: 'Problem' }[status];
  const head = `<div class="panel-head"><h2>Cloud & movie search</h2><span class="badge ${status === 'synced' ? 'ok' : status === 'error' ? 'bad' : ''}">${label}</span></div>`;
  if (!configured) {
    return `${head}<p class="muted">Your private Cloudflare helper isn’t connected yet. Until then, everything is saved on this device only, and movie/TV search is off. Books and typing titles in still work.</p>`;
  }
  if (needsSetup === null) return `${head}<p class="muted">Checking…</p>`;
  if (needsSetup) {
    return `${head}<p class="muted">First time here: enter the one-time setup code, then choose the password you’ll use on every device. Use at least 10 characters — a short sentence is easy to remember.</p>
      <form class="stack-form" data-setup>
        <input placeholder="One-time setup code" autocomplete="off" required data-code>
        <input type="password" placeholder="New password" autocomplete="new-password" required minlength="10" data-pass>
        <input type="password" placeholder="Type it again" autocomplete="new-password" required minlength="10" data-pass2>
        <button class="btn btn-grad btn-sm">Create password</button>
      </form>
      ${error ? `<p class="err">${esc(error)}</p>` : ''}`;
  }
  if (!signedIn) {
    return `${head}<p class="muted">Sign in to sync between your phone and computer and to search movies & TV.</p>
      <form class="stack-form" data-login>
        <input type="text" value="shelf" autocomplete="username" hidden>
        <input type="password" placeholder="Password" autocomplete="current-password" required data-pass>
        <button class="btn btn-grad btn-sm">Sign in</button>
      </form>
      ${error ? `<p class="err">${esc(error)}</p>` : ''}`;
  }
  return `${head}
    ${error ? `<p class="err">${esc(error)}</p>` : '<p class="muted">Signed in. Every change is saved to your Cloudflare automatically, and movie & TV search is on.</p>'}
    <div class="btn-grid">
      <button class="btn btn-glass btn-sm" data-sync>${icon.refresh}<span>Sync now</span></button>
      <button class="btn btn-glass btn-sm" data-signout>Sign out</button>
      <button class="btn btn-ghost-danger btn-sm" data-signout-all>Sign out on all devices</button>
    </div>
    <details class="sub-details"><summary>Change password</summary>
      <form class="stack-form" data-change>
        <input type="text" value="shelf" autocomplete="username" hidden>
        <input type="password" placeholder="Current password" autocomplete="current-password" required data-cur>
        <input type="password" placeholder="New password (10+ characters)" autocomplete="new-password" required minlength="10" data-next>
        <button class="btn btn-glass btn-sm">Change password</button>
      </form>
      <p class="muted small">Other devices will need the new password.</p>
    </details>`;
}

function bindCloud(el, repaint) {
  const busy = (form, on) => form.querySelector('button').classList.toggle('loading', on);
  el.querySelector('[data-setup]')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    const p1 = f.querySelector('[data-pass]').value;
    if (p1 !== f.querySelector('[data-pass2]').value) { toast('The two passwords don’t match'); return; }
    busy(f, true);
    try { await sync.setupPassword(f.querySelector('[data-code]').value.trim(), p1); toast('Password set — you’re signed in'); repaint(); } catch (err) { toast(err.message); busy(f, false); }
  });
  el.querySelector('[data-login]')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    busy(f, true);
    try { await sync.signIn(f.querySelector('[data-pass]').value); toast('Signed in'); repaint(); } catch (err) { toast(err.message); busy(f, false); }
  });
  el.querySelector('[data-change]')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    busy(f, true);
    try { await sync.changePassword(f.querySelector('[data-cur]').value, f.querySelector('[data-next]').value); toast('Password changed'); repaint(); } catch (err) { toast(err.message); busy(f, false); }
  });
  el.querySelector('[data-sync]')?.addEventListener('click', () => sync.syncNow());
  el.querySelector('[data-signout]')?.addEventListener('click', () => { sync.signOut(); repaint(); });
  el.querySelector('[data-signout-all]')?.addEventListener('click', async () => {
    if (!(await confirmSheet('Sign out everywhere?', 'Every phone and computer will need your password again.', 'Sign out all'))) return;
    try { await sync.signOutEverywhere(); toast('Signed out on all devices'); } catch (err) { toast(err.message); }
    repaint();
  });
}
