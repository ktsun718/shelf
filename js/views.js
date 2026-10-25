// Home, library grids, collections and collection detail.
import * as store from './store.js';
import { sized } from './api.js';
import {
  bi, esc, plain, card, groupCard, icon, KIND, KIND_PLURAL, statusLabel, segmented, setSeg, placePills,
  stars, myScore, posterBox, openSheet, confirmSheet, toast, debounce,
} from './ui.js';

const byAdded = (a, b) => (b.addedAt || '').localeCompare(a.addedAt || '');
const byFinished = (a, b) => (b.my?.date || b.updatedAt || '').localeCompare(a.my?.date || a.updatedAt || '');

// ---------------- HOME ----------------

let homeFilter = 'all';

export function renderHome(root) {
  const all = store.items();
  if (!all.length) return renderWelcome(root);

  const featured = pickFeatured(all);
  const done = all.filter((i) => i.status === 'done');
  const wish = all.filter((i) => i.status === 'wishlist');
  const hours = Math.round(minutesWatched(all) / 60);

  root.innerHTML = `
  <section class="hero" data-hero>
    <div class="hero-media">
      ${featured.map((it, i) => `<div class="hero-slide ${i === 0 ? 'active' : ''} ${it.backdrop ? '' : 'from-poster'}" style="background-image:url('${esc(it.backdrop || sized(it.poster, 'w780'))}')"></div>`).join('')}
    </div>
    <div class="hero-shade"></div>
    <div class="hero-inner wrap">
      <div class="hero-copies">
      ${featured.map((it, i) => `<div class="hero-copy ${i === 0 ? 'active' : ''}">
        <p class="eyebrow">${heroEyebrow(it)}</p>
        <h1 class="hero-title">${bi(it.title)}</h1>
        <p class="hero-desc">${bi(it.overview)}</p>
        <div class="hero-actions">
          <a class="btn btn-light" href="#/item/${it.id}">View details</a>
          <button class="btn btn-glass" data-action="add" aria-label="Add a title">${icon.plus}<span>Add title</span></button>
        </div>
      </div>`).join('')}
      </div>
      ${featured.length > 1 ? `<div class="hero-dots">${featured.map((_, i) => `<button class="${i === 0 ? 'active' : ''}" data-dot="${i}" aria-label="Show slide ${i + 1}"><i></i></button>`).join('')}</div>` : ''}
    </div>
  </section>

  <section class="intro wrap">
    <h2 class="scrub" data-scrub>${words('Everything you’ve watched. Everything you’ve read. And everything you will.')}</h2>
    <div class="stats">
      ${stat(done.filter((i) => i.kind !== 'book').length, 'Movies & shows watched')}
      ${stat(done.filter((i) => i.kind === 'book').length, 'Books read')}
      ${stat(wish.length, 'Waiting on your wishlist')}
      ${stat(hours, 'Hours of screen time')}
    </div>
  </section>

  <div class="wrap home-filter reveal">
    ${segmented('home', [['all', 'All'], ['done', 'Watched & Read'], ['wishlist', 'Wishlist']], homeFilter)}
  </div>
  <div class="home-rows"></div>
  <div class="home-foot wrap reveal">
    <a class="btn btn-glass" href="#/lib/all">${icon.search}<span>Browse & search everything</span></a>
  </div>`;

  const rowsEl = root.querySelector('.home-rows');
  const paintRows = () => { rowsEl.innerHTML = homeRows(all, homeFilter); bindRowArrows(rowsEl); };
  paintRows();

  root.querySelector('[data-seg="home"]').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    homeFilter = b.dataset.v;
    setSeg(b.parentElement, homeFilter);
    rowsEl.classList.add('swap');
    setTimeout(() => { paintRows(); rowsEl.classList.remove('swap'); window.__reveal?.(rowsEl); }, 220);
  });

  return heroController(root);
}

function pickFeatured(all) {
  const rank = { progress: 0, wishlist: 1, done: 2 };
  const pool = [...all].sort((a, b) => (rank[a.status] - rank[b.status]) || byAdded(a, b));
  const withBackdrop = pool.filter((i) => i.backdrop);
  return (withBackdrop.length >= 3 ? withBackdrop : pool).slice(0, 6);
}

function heroEyebrow(it) {
  const verb = { progress: it.kind === 'book' ? 'Currently reading' : 'Continue watching', wishlist: 'On your wishlist', done: it.kind === 'book' ? 'You read' : 'You watched' }[it.status];
  return `${verb} · ${KIND[it.kind]}${it.year ? ` · ${it.year}` : ''}`;
}

const words = (s) => s.split(' ').map((w, i) => `<span class="w" style="--w:${i}">${w}</span>`).join(' ');
const stat = (n, label) => `<div class="stat reveal"><b data-count="${n}">0</b><span>${label}</span></div>`;

function minutesWatched(all) {
  let m = 0;
  for (const i of all) {
    if (i.kind === 'movie' && i.status === 'done') m += i.runtime || 0;
    if (i.kind === 'tv') {
      for (const s of i.seasons || []) {
        if (i.status === 'done' || s.my?.seen) m += (s.episodeCount || s.episodes?.length || 0) * (i.runtime || 0);
      }
    }
  }
  return m;
}

function homeRows(all, filter) {
  const of = (kind, status) => all.filter((i) => (!kind || i.kind === kind) && (!status || i.status === status)).sort(byAdded);
  const rows = [];
  if (filter !== 'wishlist') {
    const cont = of(null, 'progress');
    if (cont.length) rows.push(['Continue', cont, '#/lib/all?status=progress']);
  }
  if (filter === 'all') {
    rows.push(['Movies', of('movie'), '#/lib/movie'], ['TV Shows', of('tv'), '#/lib/tv'], ['Books', of('book'), '#/lib/book']);
  } else if (filter === 'done') {
    rows.push(['Recently finished', all.filter((i) => i.status === 'done').sort(byFinished).slice(0, 20), '#/lib/all?status=done']);
    const top = all.filter((i) => i.status === 'done' && myScore(i) >= 4).sort((a, b) => myScore(b) - myScore(a));
    if (top.length) rows.push(['Your highest rated', top, '#/lib/all?status=done&sort=mine']);
    rows.push(['Movies you’ve watched', of('movie', 'done'), '#/lib/movie?status=done'], ['Shows you’ve watched', of('tv', 'done'), '#/lib/tv?status=done'], ['Books you’ve read', of('book', 'done'), '#/lib/book?status=done']);
  } else {
    rows.push(['Movies to watch', of('movie', 'wishlist'), '#/lib/movie?status=wishlist'], ['Shows to watch', of('tv', 'wishlist'), '#/lib/tv?status=wishlist'], ['Books to read', of('book', 'wishlist'), '#/lib/book?status=wishlist']);
  }
  let html = rows.filter(([, list]) => list.length).map(([title, list, link]) => row(title, list.map(card), link)).join('');
  const gs = store.groups();
  if (filter === 'all' && gs.length) html += row('Collections', gs.map(groupCard), '#/collections', 'groups');
  return html || `<p class="empty wrap">Nothing here yet.</p>`;
}

function row(title, cards, link, cls = '') {
  return `<section class="row reveal ${cls}">
    <div class="row-head wrap"><h3>${title}</h3>${link ? `<a class="see-all" href="${link}">See all ${icon.right}</a>` : ''}</div>
    <div class="row-scroller">
      <div class="row-track">${cards.map((c, i) => c.replace('style="--i:0"', `style="--i:${i}"`)).join('')}</div>
      <button class="row-arrow prev" aria-label="Scroll left">${icon.back}</button>
      <button class="row-arrow next" aria-label="Scroll right">${icon.right}</button>
    </div>
  </section>`;
}

function bindRowArrows(root) {
  root.querySelectorAll('.row-scroller').forEach((sc) => {
    const track = sc.querySelector('.row-track');
    const update = () => {
      sc.classList.toggle('at-start', track.scrollLeft < 8);
      sc.classList.toggle('at-end', track.scrollLeft + track.clientWidth > track.scrollWidth - 8);
    };
    sc.querySelector('.prev').onclick = () => track.scrollBy({ left: -track.clientWidth * 0.85, behavior: 'smooth' });
    sc.querySelector('.next').onclick = () => track.scrollBy({ left: track.clientWidth * 0.85, behavior: 'smooth' });
    track.addEventListener('scroll', update, { passive: true });
    update();
  });
}

// Auto-advancing hero with crossfade + slow zoom, and scroll-linked fade.
function heroController(root) {
  const hero = root.querySelector('[data-hero]');
  const slides = [...hero.querySelectorAll('.hero-slide')];
  // Only fade a backdrop in once its picture has downloaded.
  slides.forEach((sl) => {
    const url = sl.style.backgroundImage.slice(5, -2);
    const im = new Image();
    im.onload = im.onerror = () => sl.classList.add('loaded');
    im.src = url;
  });
  const copies = [...hero.querySelectorAll('.hero-copy')];
  const dots = [...hero.querySelectorAll('[data-dot]')];
  let i = 0;
  const go = (n) => {
    i = (n + slides.length) % slides.length;
    [slides, copies, dots].forEach((list) => list.forEach((el, k) => el.classList.toggle('active', k === i)));
    copies.forEach((c, k) => { c.inert = k !== i; });
  };
  copies.forEach((c, k) => { c.inert = k !== 0; });
  let timer = slides.length > 1 ? setInterval(() => go(i + 1), 7000) : null;
  dots.forEach((d) => d.addEventListener('click', () => {
    go(+d.dataset.dot);
    clearInterval(timer);
    timer = setInterval(() => go(i + 1), 7000);
  }));
  return () => clearInterval(timer);
}

// ---------------- WELCOME ----------------

function renderWelcome(root) {
  root.innerHTML = `<section class="welcome">
    <div class="welcome-bg"><i></i><i></i><i></i></div>
    <div class="welcome-inner wrap">
      <p class="eyebrow fade-up" style="--d:0">Shelf</p>
      <h1 class="display fade-up" style="--d:1">Every story.<br><span class="grad">Beautifully kept.</span></h1>
      <p class="lead fade-up" style="--d:2">The movies, shows and books you love — and the ones you’re waiting for. Rated your way, season by season.</p>
      <div class="welcome-actions fade-up" style="--d:3">
        <button class="btn btn-light btn-lg" data-action="add">${icon.plus}<span>Add your first title</span></button>
        <button class="btn btn-glass btn-lg" data-action="samples">Explore with samples</button>
      </div>
    </div>
  </section>`;
}

// ---------------- LIBRARY ----------------

const libState = {};

export function renderLibrary(root, kind, query) {
  const st = (libState[kind] ||= { status: 'all', sort: 'added', q: '', type: 'all' });
  if (query.get('status')) st.status = query.get('status');
  if (query.get('sort')) st.sort = query.get('sort');
  const pool = () => store.items().filter((i) => kind === 'all' || i.kind === kind);
  const k = kind === 'book' ? 'book' : 'movie';
  const count = (s) => pool().filter((i) => s === 'all' || i.status === s).length;

  root.innerHTML = `<section class="page wrap">
    <header class="page-head">
      <p class="eyebrow fade-up" style="--d:0">${kind === 'all' ? 'Everything' : 'Your library'}</p>
      <h1 class="large-title fade-up" style="--d:1">${KIND_PLURAL[kind]}</h1>
      <div class="page-tools fade-up" style="--d:2">
        ${segmented('status', [
          ['all', `All <small>${count('all')}</small>`],
          ['done', `${kind === 'all' ? 'Finished' : statusLabel(k, 'done')} <small>${count('done')}</small>`],
          ['progress', `${kind === 'all' ? 'In progress' : statusLabel(k, 'progress')} <small>${count('progress')}</small>`],
          ['wishlist', `${kind === 'all' ? 'Wishlist' : statusLabel(k, 'wishlist')} <small>${count('wishlist')}</small>`],
        ], st.status)}
        <div class="tool-row">
          ${kind === 'all' ? `<div class="chips" data-type>${[['all', 'All'], ['movie', 'Movies'], ['tv', 'TV'], ['book', 'Books']].map(([v, l]) => `<button class="chip ${st.type === v ? 'on' : ''}" data-v="${v}">${l}</button>`).join('')}</div>` : ''}
          <label class="search-field">${icon.search}<input type="search" placeholder="Search titles, people…" value="${esc(st.q)}" data-q></label>
          <label class="select"><span>Sort</span>
            <select data-sort>
              ${[['added', 'Recently added'], ['title', 'Title'], ['year', 'Release year'], ['mine', 'My rating'], ['web', 'Online rating']].map(([v, l]) => `<option value="${v}" ${st.sort === v ? 'selected' : ''}>${l}</option>`).join('')}
            </select>
          </label>
        </div>
      </div>
    </header>
    <div class="grid" data-grid></div>
  </section>`;

  const grid = root.querySelector('[data-grid]');
  const paint = (animate = true) => {
    const q = st.q.trim().toLowerCase();
    let list = pool().filter((i) => (st.status === 'all' || i.status === st.status) && (st.type === 'all' || i.kind === st.type));
    if (q) list = list.filter((i) => [i.title?.en, i.title?.zh, i.originalTitle, ...(i.people?.names || []), ...(i.people?.cast || [])].some((t) => t && t.toLowerCase().includes(q)));
    const webNum = (i) => parseFloat(i.web?.imdb || i.web?.tmdb || (i.web?.openlibrary || i.web?.google || 0) * 2) || 0;
    const sorters = {
      added: byAdded,
      title: (a, b) => plain(a.title).localeCompare(plain(b.title)),
      year: (a, b) => (b.year || '').localeCompare(a.year || ''),
      mine: (a, b) => myScore(b) - myScore(a),
      web: (a, b) => webNum(b) - webNum(a),
    };
    list.sort(sorters[st.sort]);
    grid.classList.toggle('no-anim', !animate);
    grid.innerHTML = list.length
      ? list.map((it, i) => card(it, Math.min(i, 24))).join('')
      : `<div class="empty"><p>${q ? 'No matches.' : 'Nothing here yet.'}</p><button class="btn btn-glass" data-action="add">${icon.plus}<span>Add a title</span></button></div>`;
  };
  paint();

  root.querySelector('[data-seg="status"]').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    st.status = b.dataset.v;
    setSeg(b.parentElement, st.status);
    paint();
  });
  root.querySelector('[data-type]')?.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    st.type = b.dataset.v;
    b.parentElement.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c === b));
    paint();
  });
  root.querySelector('[data-q]').addEventListener('input', debounce((e) => { st.q = e.target.value; paint(false); }, 120));
  root.querySelector('[data-sort]').addEventListener('change', (e) => { st.sort = e.target.value; paint(); });
}

// ---------------- COLLECTIONS ----------------

export function renderCollections(root) {
  const gs = store.groups().sort(byAdded);
  root.innerHTML = `<section class="page wrap">
    <header class="page-head">
      <p class="eyebrow fade-up" style="--d:0">Series, franchises & universes</p>
      <h1 class="large-title fade-up" style="--d:1">Collections</h1>
      <p class="lead-sm fade-up" style="--d:2">Keep related movies, seasons and books together — and rate each one on its own.</p>
      <div class="fade-up" style="--d:3"><button class="btn btn-light" data-new-group>${icon.plus}<span>New collection</span></button></div>
    </header>
    <div class="grid groups">${gs.length ? gs.map(groupCard).join('') : '<div class="empty"><p>No collections yet. Movies that belong to a series are grouped automatically when you add them.</p></div>'}</div>
  </section>`;
  root.querySelector('[data-new-group]').onclick = () => editGroupSheet(null);
}

export function editGroupSheet(group, { addId } = {}) {
  const g = group || { id: store.uid('g'), kind: 'group', name: { en: '', zh: '' }, overview: { en: '', zh: '' }, members: addId ? [addId] : [] };
  const s = openSheet(`<form class="form" data-form>
    <h2>${group ? 'Edit collection' : 'New collection'}</h2>
    <label class="field"><span>Name</span><input name="en" required value="${esc(g.name.en)}" placeholder="e.g. Marvel Cinematic Universe"></label>
    <label class="field"><span>中文名稱 <small>(optional)</small></span><input name="zh" value="${esc(g.name.zh || '')}" placeholder="例如：漫威電影宇宙"></label>
    <label class="field"><span>Description <small>(optional)</small></span><textarea name="ov" rows="2">${esc(g.overview?.en || '')}</textarea></label>
    <label class="field"><span>中文簡介 <small>(optional)</small></span><textarea name="ovzh" rows="2">${esc(g.overview?.zh || '')}</textarea></label>
    <div class="form-actions"><button class="btn btn-light" type="submit">${group ? 'Save' : 'Create'}</button></div>
  </form>`);
  s.el.querySelector('[data-form]').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    g.name = { en: f.get('en').trim(), zh: f.get('zh').trim() };
    g.overview = { en: f.get('ov').trim(), zh: f.get('ovzh').trim() };
    store.put(g, { silent: false });
    s.close();
    if (!group) location.hash = `#/group/${g.id}`;
  });
}

export function renderGroup(root, id) {
  const g = store.get(id);
  if (!g) { root.innerHTML = '<section class="page wrap"><p class="empty">This collection no longer exists.</p></section>'; return; }
  const members = (g.members || []).map(store.get).filter(Boolean);
  const done = members.filter((m) => m.status === 'done');
  const rated = done.filter(myScore);
  const avg = rated.length ? rated.reduce((a, m) => a + myScore(m), 0) / rated.length : 0;
  const bg = members.find((m) => m.backdrop)?.backdrop || sized(members[0]?.poster, 'w780') || '';

  root.innerHTML = `<article class="detail group-detail">
    <div class="detail-backdrop ${members.find((m) => m.backdrop) ? '' : 'from-poster'}" style="background-image:url('${esc(bg)}')"></div>
    <div class="detail-top wrap">
      <a class="back-link" href="#/collections">${icon.back}<span>Collections</span></a>
      <p class="eyebrow fade-up" style="--d:0">Collection · ${members.length} title${members.length === 1 ? '' : 's'}</p>
      <h1 class="detail-title fade-up" style="--d:1">${bi(g.name)}</h1>
      ${g.overview?.en || g.overview?.zh ? `<p class="detail-overview fade-up" style="--d:2">${bi(g.overview)}</p>` : ''}
      <div class="group-stats fade-up" style="--d:3">
        <div><b>${done.length}/${members.length}</b><span>finished</span></div>
        <div><b>${avg ? avg.toFixed(1) : '–'}</b><span>your average</span></div>
        <div>${stars(avg, { size: 'md' })}</div>
      </div>
    </div>
    <section class="wrap detail-section">
      <div class="sec-head"><h2>In this collection</h2>
        <div class="sec-actions">
          <button class="btn btn-glass btn-sm" data-add-members>${icon.plus}<span>Add titles</span></button>
          <button class="btn btn-glass btn-sm" data-edit-group>${icon.edit}<span>Edit</span></button>
        </div>
      </div>
      <ol class="members">
        ${members.map((m, i) => `<li class="member reveal" style="--i:${i}">
          <a class="member-link" href="#/item/${m.id}" data-id="${m.id}">
            <span class="member-n">${i + 1}</span>
            ${posterBox(m, 'w185')}
            <div class="member-main">
              <div class="member-title">${bi(m.title)}</div>
              <div class="muted">${KIND[m.kind]}${m.year ? ` · ${m.year}` : ''} · <span class="status-${m.status}">${statusLabel(m.kind, m.status)}</span></div>
              ${myScore(m) ? stars(myScore(m), { size: 'sm' }) : ''}
            </div>
          </a>
          <div class="member-tools">
            <button class="icon-btn" data-move="-1" data-m="${m.id}" aria-label="Move up" ${i === 0 ? 'disabled' : ''}>${icon.up}</button>
            <button class="icon-btn" data-move="1" data-m="${m.id}" aria-label="Move down" ${i === members.length - 1 ? 'disabled' : ''}>${icon.down}</button>
            <button class="icon-btn" data-unlink="${m.id}" aria-label="Remove from collection">${icon.close}</button>
          </div>
        </li>`).join('') || '<p class="empty">No titles yet — add some from your library.</p>'}
      </ol>
      <div class="danger-zone"><button class="btn btn-ghost-danger btn-sm" data-delete-group>${icon.trash}<span>Delete collection</span></button><small class="muted">Titles stay in your library.</small></div>
    </section>
  </article>`;

  root.querySelector('[data-edit-group]').onclick = () => editGroupSheet(g);
  root.querySelector('[data-add-members]').onclick = () => pickMembersSheet(g);
  root.querySelector('[data-delete-group]').onclick = async () => {
    if (await confirmSheet('Delete this collection?', 'The titles inside stay in your library.', 'Delete')) {
      store.remove(g.id);
      location.hash = '#/collections';
    }
  };
  root.querySelectorAll('[data-move]').forEach((b) => b.onclick = () => {
    const arr = g.members;
    const from = arr.indexOf(b.dataset.m);
    const to = from + +b.dataset.move;
    [arr[from], arr[to]] = [arr[to], arr[from]];
    store.put(g, { silent: false });
  });
  root.querySelectorAll('[data-unlink]').forEach((b) => b.onclick = () => {
    g.members = g.members.filter((m) => m !== b.dataset.unlink);
    store.put(g, { silent: false });
    toast('Removed from collection');
  });
}

function pickMembersSheet(g) {
  const all = store.items().sort((a, b) => plain(a.title).localeCompare(plain(b.title)));
  const s = openSheet(`<div class="picker">
    <h2>Add to “${esc(plain(g.name))}”</h2>
    <label class="search-field">${icon.search}<input type="search" placeholder="Filter your library…" data-f></label>
    <div class="pick-list">${all.map((i) => `<label class="pick-row" data-t="${esc(`${i.title?.en} ${i.title?.zh || ''}`.toLowerCase())}">
      <input type="checkbox" value="${i.id}" ${g.members.includes(i.id) ? 'checked' : ''}>
      ${posterBox(i, 'w92')}
      <span><b>${bi(i.title)}</b><small class="muted">${KIND[i.kind]}${i.year ? ` · ${i.year}` : ''}</small></span>
      <i class="tick">${icon.check}</i>
    </label>`).join('')}</div>
    <div class="form-actions"><button class="btn btn-light" data-save>Done</button></div>
  </div>`, { wide: true });
  s.el.querySelector('[data-f]').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    s.el.querySelectorAll('.pick-row').forEach((r) => { r.hidden = q && !r.dataset.t.includes(q); });
  });
  s.el.querySelector('[data-save]').onclick = () => {
    const checked = [...s.el.querySelectorAll('input[type=checkbox]:checked')].map((c) => c.value);
    g.members = [...g.members.filter((m) => checked.includes(m)), ...checked.filter((m) => !g.members.includes(m))];
    store.put(g, { silent: false });
    s.close();
  };
}

export { placePills };
