// "Add a title" sheet (search online or type it in) and the edit form.
import * as store from './store.js';
import * as api from './api.js';
import * as sync from './sync.js';
import {
  bi, esc, plain, KIND, icon, statusLabel, segmented, setSeg, placePills, openSheet, toast, debounce, shrinkImage, safeUrl,
} from './ui.js';

let lastTab = 'screen';

export function openAdd(tab = lastTab) {
  const s = openSheet(`<div class="add" data-add>
    <div class="add-search-view">
      <h2 class="add-title">Add to your shelf</h2>
      ${segmented('addtab', [['screen', 'Movies & TV'], ['book', 'Books'], ['manual', 'Type it in']], tab)}
      <div class="add-pane"></div>
    </div>
    <div class="add-pick-view"></div>
  </div>`, { wide: true });
  const root = s.el.querySelector('[data-add]');
  requestAnimationFrame(() => placePills(root));
  const pane = root.querySelector('.add-pane');

  const show = (t) => {
    lastTab = t;
    setSeg(root.querySelector('[data-seg="addtab"]'), t);
    if (t === 'manual') { pane.innerHTML = ''; pane.appendChild(editorForm(null, s)); return; }
    const noKey = t === 'screen' && !sync.signedIn();
    pane.innerHTML = noKey ? `<div class="notice">
        <h3>${sync.configured() ? 'Sign in to search movies & TV' : 'Movie & TV search is almost ready'}</h3>
        <p class="muted">${sync.configured()
          ? 'Movie look-ups go through your private Cloudflare helper, so they need your password once on each device.'
          : 'It switches on once your free Cloudflare account is connected. Meanwhile you can type titles in, or search books.'}</p>
        <div class="notice-actions">${sync.configured() ? '<a class="btn btn-light" href="#/settings" data-close>Sign in</a>' : ''}<button class="btn btn-glass" data-go-manual>Type it in instead</button></div>
      </div>`
      : `<label class="search-field big">${icon.search}<input type="search" placeholder="${t === 'book' ? 'Search books by title or author…' : 'Search movies and TV shows…'}" autocomplete="off" maxlength="120" data-q></label>
         <div class="results" data-results><p class="muted hint">${t === 'book' ? 'Tip: Chinese titles work too, e.g. 三體' : 'Tip: try “Breaking Bad” or “潛行凶間”'}</p></div>`;
    pane.querySelector('[data-close]')?.addEventListener('click', () => s.close());
    pane.querySelector('[data-go-manual]')?.addEventListener('click', () => show('manual'));
    const input = pane.querySelector('[data-q]');
    if (!input) return;
    setTimeout(() => input.focus(), 350);
    const results = pane.querySelector('[data-results]');
    let seq = 0;
    input.addEventListener('input', debounce(async () => {
      const q = input.value.trim();
      if (q.length < 2) return;
      const my = ++seq;
      results.innerHTML = skeleton();
      try {
        const list = t === 'book' ? await api.searchBooks(q) : await api.searchScreen(q);
        if (my !== seq) return;
        results.innerHTML = list.length
          ? `<div class="result-grid">${list.map((r, i) => resultCard(r, i)).join('')}</div>`
          : '<p class="muted hint">No results. You can always type it in yourself.</p>';
        results.querySelectorAll('[data-pick]').forEach((b) => b.addEventListener('click', () => pick(list[+b.dataset.pick])));
      } catch (err) {
        results.innerHTML = `<p class="muted hint">${esc(err.message)}</p>`;
      }
    }, 380));
  };

  root.querySelector('[data-seg="addtab"]').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b) show(b.dataset.v);
  });
  show(tab);

  // Step 2: preview with full details, choose status, add.
  const pickView = root.querySelector('.add-pick-view');
  async function pick(result) {
    root.classList.add('picking');
    pickView.innerHTML = `<button class="back-link" data-back>${icon.back}<span>Results</span></button><div class="pick-loading"><div class="spinner"></div><p class="muted">Getting details…</p></div>`;
    pickView.querySelector('[data-back]').onclick = () => root.classList.remove('picking');
    const existing = store.items().find((i) => i.source?.type === result.source.type && String(i.source.id) === String(result.source.id));
    try {
      const { item, collection } = result.kind === 'book' ? await api.bookDetails(result) : await api.details(result.kind, result.source.id);
      let coll = null;
      if (collection) coll = await api.collectionDetails(collection.id).catch(() => null);
      const others = coll ? coll.parts.filter((p) => p.id !== item.source.id && !store.items().some((i) => i.source?.type === 'tmdb' && i.source.id === p.id)) : [];
      const k = item.kind;
      pickView.innerHTML = `<button class="back-link" data-back>${icon.back}<span>Results</span></button>
        <div class="pick">
          <div class="pick-poster">${safeUrl(item.poster) ? `<img src="${esc(item.poster)}" alt="">` : ''}</div>
          <div class="pick-info">
            <p class="eyebrow">${KIND[k]}${item.year ? ` · ${esc(item.year)}` : ''}${item.runtime ? ` · ${item.runtime} min` : ''}${item.seasons ? ` · ${item.seasons.filter((x) => x.n > 0).length} seasons` : ''}</p>
            <h2>${bi(item.title)}</h2>
            ${item.title.zh ? `<p class="muted">${esc(item.title.zh)}</p>` : ''}
            ${item.people?.names?.length ? `<p class="muted">${esc(item.people.label)} ${esc(item.people.names.join(', '))}</p>` : ''}
            <p class="pick-ov">${bi(item.overview) || '<span class="muted">No description available.</span>'}</p>
          </div>
        </div>
        ${existing ? `<div class="notice slim"><p>Already on your shelf.</p><a class="btn btn-light" href="#/item/${existing.id}" data-close>Open it</a></div>` : `
        <div class="pick-controls">
          <p class="muted small">Add to</p>
          ${segmented('pickstatus', [['wishlist', statusLabel(k, 'wishlist')], ['progress', statusLabel(k, 'progress')], ['done', statusLabel(k, 'done')]], 'wishlist')}
          ${coll && others.length ? `<label class="pick-coll">
            <input type="checkbox" checked data-coll>
            <span><b>Also add the rest of ${esc(coll.name.en)}</b><small class="muted">${others.length} more film${others.length > 1 ? 's' : ''}: ${esc(others.map((p) => `${p.title} (${p.year})`).join(', '))}. They go on your wishlist and are grouped together so you can rate each one.</small></span>
          </label>` : ''}
          <button class="btn btn-light btn-lg wide-btn" data-confirm>${icon.plus}<span>Add to Shelf</span></button>
        </div>`}`;
      requestAnimationFrame(() => placePills(pickView));
      pickView.querySelector('[data-back]').onclick = () => root.classList.remove('picking');
      pickView.querySelector('[data-close]')?.addEventListener('click', () => s.close());
      const seg = pickView.querySelector('[data-seg="pickstatus"]');
      let status = 'wishlist';
      seg?.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { status = b.dataset.v; setSeg(seg, status); } });
      pickView.querySelector('[data-confirm]')?.addEventListener('click', async (e) => {
        const btn = e.currentTarget;
        btn.disabled = true;
        btn.classList.add('loading');
        const rec = { ...item, id: store.uid(), status, my: status === 'done' ? { date: today() } : {} };
        store.put(rec);
        if (coll) {
          const withRest = pickView.querySelector('[data-coll]')?.checked;
          let g = store.groups().find((x) => x.source?.type === 'tmdb-collection' && x.source.id === coll.id);
          if (g || withRest) {
            g ||= { id: store.uid('g'), kind: 'group', name: coll.name, overview: coll.overview, source: { type: 'tmdb-collection', id: coll.id }, members: [] };
            const order = coll.parts.map((p) => p.id);
            const ids = new Map(store.items().filter((i) => i.source?.type === 'tmdb').map((i) => [i.source.id, i.id]));
            if (withRest) {
              for (const p of others) {
                btn.querySelector('span').textContent = `Adding ${p.title}…`;
                try {
                  const { item: part } = await api.movieDetails(p.id);
                  const pr = store.put({ ...part, id: store.uid(), status: 'wishlist', my: {} });
                  ids.set(p.id, pr.id);
                } catch { /* skip a part that fails */ }
              }
            }
            const inColl = order.map((tid) => ids.get(tid)).filter(Boolean);
            g.members = [...new Set([...inColl, ...(g.members || [])])].filter((m) => store.get(m));
            store.put(g);
          }
        }
        s.close();
        toast(`Added ${plain(rec.title)}`);
        location.hash = `#/item/${rec.id}`;
      });
    } catch (err) {
      pickView.querySelector('.pick-loading').innerHTML = `<p class="muted">${esc(err.message)}</p>`;
    }
  }
}

const today = () => new Date().toISOString().slice(0, 10);

function skeleton() {
  return `<div class="result-grid">${Array.from({ length: 8 }, () => '<div class="result sk"><div class="sk-poster"></div><div class="sk-line"></div><div class="sk-line short"></div></div>').join('')}</div>`;
}

function resultCard(r, i) {
  const sub = [r.kind === 'book' ? (r.authors || []).slice(0, 2).join(', ') : KIND[r.kind], r.year].filter(Boolean).join(' · ');
  return `<button class="result" data-pick="${i}" style="--i:${i}">
    <div class="r-poster"><span>${esc(r.title)}</span>${safeUrl(r.poster) ? `<img src="${esc(r.poster)}" alt="" loading="lazy">` : ''}</div>
    <div class="r-title">${esc(r.title)}</div>
    <div class="r-sub muted">${esc(sub)}</div>
  </button>`;
}

// ---------- manual add / edit form ----------

export function openEditor(item) {
  const s = openSheet('<div class="editor-host"></div>', { wide: true });
  s.el.querySelector('.editor-host').appendChild(editorForm(item, s));
}

function editorForm(item, sheet) {
  const it = item || { kind: 'movie', title: {}, overview: {}, web: {}, people: {}, genres: [] };
  const form = document.createElement('form');
  form.className = 'form editor';
  form.innerHTML = `
    ${item ? '<h2>Edit details</h2>' : ''}
    <div class="field-row">
      <label class="field"><span>Type</span><select name="kind" ${item ? 'disabled' : ''}>${['movie', 'tv', 'book'].map((k) => `<option value="${k}" ${it.kind === k ? 'selected' : ''}>${KIND[k]}</option>`).join('')}</select></label>
      ${item ? '' : `<label class="field"><span>Status</span><select name="status">${['wishlist', 'progress', 'done'].map((v) => `<option value="${v}">${statusLabel('movie', v)} / ${statusLabel('book', v)}</option>`).join('')}</select></label>`}
    </div>
    <div class="field-row">
      <label class="field"><span>Title</span><input name="en" required value="${esc(it.title.en || '')}" placeholder="English title"></label>
      <label class="field"><span>中文片名 / 書名 <small>(Hong Kong)</small></span><input name="zh" value="${esc(it.title.zh || '')}" placeholder="例如：潛行凶間"></label>
    </div>
    <div class="field-row three">
      <label class="field"><span>Year</span><input name="year" inputmode="numeric" value="${esc(it.year || '')}" placeholder="2024"></label>
      <label class="field" data-only="tv"><span>Ended</span><input name="endYear" inputmode="numeric" value="${esc(it.endYear || '')}" placeholder="optional"></label>
      <label class="field" data-only="movie tv"><span>Minutes</span><input name="runtime" inputmode="numeric" value="${esc(it.runtime || '')}" placeholder="${it.kind === 'tv' ? 'per episode' : '120'}"></label>
      <label class="field" data-only="book"><span>Pages</span><input name="pages" inputmode="numeric" value="${esc(it.pages || '')}"></label>
      ${item ? '' : '<label class="field" data-only="tv"><span>Seasons</span><input name="seasons" inputmode="numeric" placeholder="e.g. 3"></label>'}
    </div>
    <div class="field-row">
      <label class="field"><span data-people-label>${it.kind === 'book' ? 'Author' : it.kind === 'tv' ? 'Created by' : 'Director'}</span><input name="people" value="${esc((it.people?.names || []).join(', '))}" placeholder="Separate names with commas"></label>
      <label class="field"><span>Genres</span><input name="genres" value="${esc((it.genres || []).join(', '))}" placeholder="Drama, Thriller"></label>
    </div>
    <label class="field"><span>Description</span><textarea name="ov" rows="3">${esc(it.overview?.en || '')}</textarea></label>
    <label class="field"><span>中文簡介 <small>(繁體書面語)</small></span><textarea name="ovzh" rows="3">${esc(it.overview?.zh || '')}</textarea></label>
    <div class="field-row three">
      <label class="field"><span>IMDb score</span><input name="imdb" inputmode="decimal" value="${esc(it.web?.imdb || '')}" placeholder="8.5"></label>
      <label class="field"><span>Rotten Tomatoes</span><input name="rt" value="${esc(it.web?.rt || '')}" placeholder="94%"></label>
      <label class="field"><span>Other score</span><input name="other" value="${esc(it.web?.other || '')}" placeholder="e.g. 4.2/5 Goodreads"></label>
    </div>
    <div class="field">
      <span>Poster</span>
      <div class="poster-input">
        <div class="pi-preview">${safeUrl(it.poster) ? `<img src="${esc(it.poster)}" alt="">` : ''}</div>
        <div class="pi-controls">
          <input name="poster" value="${esc(it.poster?.startsWith('data:') ? '' : it.poster || '')}" placeholder="Paste an image link…">
          <label class="btn btn-glass btn-sm file-btn">Upload a picture<input type="file" accept="image/*" hidden data-file></label>
        </div>
      </div>
    </div>
    <label class="field"><span>Wide background image <small>(optional link)</small></span><input name="backdrop" value="${esc(it.backdrop || '')}" placeholder="https://…"></label>
    <div class="form-actions"><button class="btn btn-light btn-lg" type="submit">${item ? 'Save changes' : `${icon.plus}<span>Add to Shelf</span>`}</button></div>`;

  let uploaded = it.poster?.startsWith('data:') ? it.poster : '';
  const kindSel = form.querySelector('[name=kind]');
  const syncKind = () => {
    const k = kindSel.value;
    form.querySelectorAll('[data-only]').forEach((el) => { el.hidden = !el.dataset.only.split(' ').includes(k); });
    form.querySelector('[data-people-label]').textContent = k === 'book' ? 'Author' : k === 'tv' ? 'Created by' : 'Director';
  };
  kindSel.addEventListener('change', syncKind);
  syncKind();

  const preview = form.querySelector('.pi-preview');
  form.querySelector('[name=poster]').addEventListener('input', debounce((e) => {
    uploaded = '';
    preview.innerHTML = safeUrl(e.target.value) ? `<img src="${esc(e.target.value)}" alt="">` : '';
  }, 300));
  form.querySelector('[data-file]').addEventListener('change', async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    uploaded = await shrinkImage(f);
    form.querySelector('[name=poster]').value = '';
    preview.innerHTML = `<img src="${uploaded}" alt="">`;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(form);
    const list = (v) => String(v || '').split(',').map((x) => x.trim()).filter(Boolean);
    const num = (v) => (v && !isNaN(+v) ? +v : null);
    const kind = item ? item.kind : f.get('kind');
    const rec = item || { id: store.uid(), kind, source: { type: 'manual' }, status: f.get('status'), my: {} };
    rec.title = { en: f.get('en').trim(), zh: f.get('zh').trim() };
    rec.overview = { en: f.get('ov').trim(), zh: f.get('ovzh').trim() };
    rec.year = f.get('year').trim();
    rec.endYear = kind === 'tv' ? (f.get('endYear') || '').trim() : '';
    rec.runtime = kind !== 'book' ? num(f.get('runtime')) : null;
    rec.pages = kind === 'book' ? num(f.get('pages')) : rec.pages;
    rec.people = { ...(rec.people || {}), label: kind === 'book' ? 'Written by' : kind === 'tv' ? 'Created by' : 'Directed by', names: list(f.get('people')), cast: rec.people?.cast || [] };
    rec.genres = list(f.get('genres'));
    rec.web = { ...(rec.web || {}), imdb: f.get('imdb').trim() || undefined, rt: f.get('rt').trim() || undefined, other: f.get('other').trim() || undefined };
    rec.poster = uploaded || safeUrl(f.get('poster').trim());
    rec.backdrop = safeUrl(f.get('backdrop').trim());
    if (!item) {
      if (rec.status === 'done') rec.my.date = today();
      const n = Math.min(60, num(f.get('seasons')) || 0);
      if (kind === 'tv') rec.seasons = Array.from({ length: n }, (_, i) => ({ n: i + 1, name: { en: `Season ${i + 1}`, zh: `第 ${i + 1} 季` }, overview: {}, my: {} }));
    }
    store.put(rec, { silent: false });
    sheet.close();
    toast(item ? 'Saved' : `Added ${rec.title.en}`);
    if (!item) location.hash = `#/item/${rec.id}`;
  });
  return form;
}
