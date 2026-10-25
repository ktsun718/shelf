// Home, library (grid + spotlight), collections and collection detail.
import * as store from './store.js';
import { sized } from './api.js';
import {
  bi, esc, plain, card, wideCard, groupCard, icon, KIND, KIND_PLURAL, statusLabel, segmented, setSeg, placePills,
  stars, myScore, posterBox, openSheet, confirmSheet, toast, debounce, safeUrl, showWeb, webScore,
} from './ui.js';

const byAdded = (a, b) => (b.addedAt || '').localeCompare(a.addedAt || '');
const byFinished = (a, b) => (b.my?.date || b.updatedAt || '').localeCompare(a.my?.date || a.updatedAt || '');

// ---------------- HOME ----------------

let homeFilter = 'all';

export function renderHome(root) {
  const all = store.items();
  if (!all.length) return renderWelcome(root);

  const done = all.filter((i) => i.status === 'done');
  const wish = all.filter((i) => i.status === 'wishlist');
  const hours = Math.round(minutesWatched(all) / 60);
  const picks = shuffle(all.filter((i) => i.status !== 'done'));

  root.innerHTML = `
  <section class="stage" data-stage>
    <div class="wall" aria-hidden="true"><div class="wall-plane">${wallRows(all)}</div></div>
    <div class="stage-vignette"></div>
    <div class="stage-copy wrap">
      <p class="eyebrow fade-up" style="--d:0"><i class="live-dot"></i>${greeting()}</p>
      <h1 class="stage-title fade-up" style="--d:1">What’s on <em>tonight</em>?</h1>
      <p class="stage-lead fade-up" style="--d:2">${wish.length} waiting on your wishlist · ${done.length} finished</p>
      ${picks.length ? `<div class="pick-card fade-up" style="--d:3" data-pick>${pickCard(picks[0])}</div>` : `<div class="fade-up" style="--d:3"><button class="btn btn-light btn-lg" data-action="add">${icon.plus}<span>Add a title</span></button></div>`}
    </div>
  </section>

  <section class="intro wrap">
    <h2 class="scrub" data-scrub>${words('Everything you’ve watched. Everything you’ve read. And everything you will.')}</h2>
    <div class="stats">
      ${stat(done.filter((i) => i.kind !== 'book').length, 'Movies & shows watched', 'sunset')}
      ${stat(done.filter((i) => i.kind === 'book').length, 'Books read', 'aurora')}
      ${stat(wish.length, 'On your wishlist', 'violet')}
      ${stat(hours, 'Hours of screen time', 'gold')}
    </div>
  </section>

  <div class="wrap home-filter reveal">
    ${segmented('home', [['all', 'Everything'], ['done', 'Finished'], ['wishlist', 'Wishlist']], homeFilter)}
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

  // "Another" shuffles tonight's pick.
  let p = 0;
  root.querySelector('[data-pick]')?.addEventListener('click', (e) => {
    if (!e.target.closest('[data-another]')) return;
    const box = e.currentTarget;
    p = (p + 1) % picks.length;
    box.classList.add('swap');
    setTimeout(() => { box.innerHTML = pickCard(picks[p]); box.classList.remove('swap'); }, 260);
  });

  return stageParallax(root);
}

function greeting() {
  const h = new Date().getHours();
  return h < 5 ? 'Up late' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function pickCard(it) {
  return `<a class="pick-poster" href="#/item/${it.id}" data-id="${it.id}">${posterBox(it, 'w185')}</a>
    <div class="pick-body">
      <span class="pick-label">${icon.sparkle} Tonight’s pick</span>
      <a class="pick-title" href="#/item/${it.id}">${bi(it.title)}</a>
      <span class="pick-meta">${KIND[it.kind]}${it.year ? ` · ${esc(it.year)}` : ''} · ${statusLabel(it.kind, it.status)}</span>
      <div class="pick-actions">
        <a class="btn btn-light btn-sm" href="#/item/${it.id}">Open</a>
        <button class="btn btn-glass btn-sm" data-another>${icon.refresh}<span>Another</span></button>
      </div>
    </div>`;
}

// Four drifting rows of posters, tilted in 3D.
function wallRows(all) {
  const withPoster = all.filter((i) => i.poster);
  if (!withPoster.length) return '';
  const rows = 4;
  let html = '';
  for (let r = 0; r < rows; r++) {
    let list = shuffle(withPoster);
    while (list.length < 12) list = list.concat(shuffle(withPoster));
    const strip = list.map((i) => `<div class="wall-tile">${safeUrl(sized(i.poster, 'w185')) ? `<img src="${esc(sized(i.poster, 'w185'))}" alt="" loading="eager" decoding="async">` : ''}</div>`).join('');
    html += `<div class="wall-row" style="--dur:${70 + r * 14}s;--dir:${r % 2 ? 'reverse' : 'normal'}"><div class="wall-strip">${strip}${strip}</div></div>`;
  }
  return html;
}

function stageParallax(root) {
  const stage = root.querySelector('[data-stage]');
  if (!stage || matchMedia('(hover: none)').matches) return null;
  const move = (e) => {
    stage.style.setProperty('--mx', ((e.clientX / innerWidth) - 0.5).toFixed(3));
    stage.style.setProperty('--my', ((e.clientY / innerHeight) - 0.5).toFixed(3));
  };
  addEventListener('pointermove', move, { passive: true });
  return () => removeEventListener('pointermove', move);
}

const words = (s) => s.split(' ').map((w, i) => `<span class="w" style="--w:${i}">${w}</span>`).join(' ');
const stat = (n, label, tone) => `<div class="stat reveal tone-${tone}"><b data-count="${n}">0</b><span>${label}</span></div>`;

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
  let html = '';
  if (filter !== 'wishlist') {
    const cont = of(null, 'progress');
    if (cont.length) html += row('Continue <em>where you left off</em>', cont.map(wideCard), '#/lib/all?status=progress', 'wides');
  }
  const rows = [];
  if (filter === 'all') {
    rows.push(['<em>Movies</em>', of('movie'), '#/lib/movie'], ['<em>TV</em> Shows', of('tv'), '#/lib/tv'], ['<em>Books</em>', of('book'), '#/lib/book']);
  } else if (filter === 'done') {
    const top = all.filter((i) => i.status === 'done' && myScore(i) >= 4).sort((a, b) => myScore(b) - myScore(a));
    if (top.length) rows.push(['Your <em>favourites</em>', top, '#/lib/all?status=done&sort=mine']);
    rows.push(['Recently <em>finished</em>', all.filter((i) => i.status === 'done').sort(byFinished).slice(0, 20), '#/lib/all?status=done']);
  } else {
    rows.push(['Movies <em>to watch</em>', of('movie', 'wishlist'), '#/lib/movie?status=wishlist'], ['Shows <em>to watch</em>', of('tv', 'wishlist'), '#/lib/tv?status=wishlist'], ['Books <em>to read</em>', of('book', 'wishlist'), '#/lib/book?status=wishlist']);
  }
  html += rows.filter(([, list]) => list.length).map(([title, list, link]) => row(title, list.map(card), link)).join('');
  const gs = store.groups();
  if (filter === 'all' && gs.length) html += row('<em>Collections</em>', gs.map(groupCard), '#/collections', 'groups');
  return html || '<p class="empty wrap">Nothing here yet.</p>';
}

function row(title, cards, link, cls = '') {
  return `<section class="row reveal ${cls}">
    <div class="row-head wrap"><h3>${title}</h3>${link ? `<a class="see-all" href="${link}">See all ${icon.right}</a>` : ''}</div>
    <div class="row-scroller">
      <div class="row-track">${cards.join('')}</div>
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

// ---------------- WELCOME ----------------

function renderWelcome(root) {
  root.innerHTML = `<section class="welcome">
    <div class="welcome-bg"><i></i><i></i><i></i></div>
    <div class="welcome-inner wrap">
      <p class="eyebrow fade-up" style="--d:0"><i class="live-dot"></i>Shelf</p>
      <h1 class="display fade-up" style="--d:1">Every story.<br><em class="grad">Beautifully kept.</em></h1>
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
const readView = (kind) => { try { return localStorage.getItem(`shelf.view.${kind}`) || 'grid'; } catch { return 'grid'; } };

export function renderLibrary(root, kind, query) {
  const st = (libState[kind] ||= { status: 'all', sort: 'added', q: '', type: 'all', view: readView(kind) });
  if (query.get('status')) st.status = query.get('status');
  if (query.get('sort')) st.sort = query.get('sort');
  const pool = () => store.items().filter((i) => kind === 'all' || i.kind === kind);
  const k = kind === 'book' ? 'book' : 'movie';
  const count = (s) => pool().filter((i) => s === 'all' || i.status === s).length;
  const title = { movie: '<em>Movies</em>', tv: '<em>TV</em> Shows', book: '<em>Books</em>', all: 'Every<em>thing</em>' }[kind];

  root.innerHTML = `<section class="page wrap">
    <header class="page-head">
      <p class="eyebrow fade-up" style="--d:0"><i class="live-dot"></i>${kind === 'all' ? 'Your whole shelf' : 'Your library'}</p>
      <h1 class="large-title fade-up" style="--d:1">${title}</h1>
      <div class="page-tools fade-up" style="--d:2">
        <div class="tools-top">
          ${segmented('status', [
            ['all', `All <small>${count('all')}</small>`],
            ['done', `${kind === 'all' ? 'Finished' : statusLabel(k, 'done')} <small>${count('done')}</small>`],
            ['progress', `${kind === 'all' ? 'In progress' : statusLabel(k, 'progress')} <small>${count('progress')}</small>`],
            ['wishlist', `${kind === 'all' ? 'Wishlist' : statusLabel(k, 'wishlist')} <small>${count('wishlist')}</small>`],
          ], st.status)}
          ${segmented('view', [['grid', `${icon.grid}<span>Grid</span>`, 'aria-label="Grid view"'], ['spot', `${icon.spot}<span>Spotlight</span>`, 'aria-label="Spotlight view"']], st.view, 'icon-seg')}
        </div>
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
    <div class="lib-body" data-body></div>
  </section>`;

  const body = root.querySelector('[data-body]');
  let spotCleanup = null;
  const list = () => {
    const q = st.q.trim().toLowerCase();
    let l = pool().filter((i) => (st.status === 'all' || i.status === st.status) && (st.type === 'all' || i.kind === st.type));
    if (q) l = l.filter((i) => [i.title?.en, i.title?.zh, i.originalTitle, ...(i.people?.names || []), ...(i.people?.cast || [])].some((t) => t && t.toLowerCase().includes(q)));
    const webNum = (i) => parseFloat(i.web?.imdb || i.web?.tmdb || (i.web?.openlibrary || i.web?.google || 0) * 2) || 0;
    const sorters = {
      added: byAdded,
      title: (a, b) => plain(a.title).localeCompare(plain(b.title)),
      year: (a, b) => (b.year || '').localeCompare(a.year || ''),
      mine: (a, b) => myScore(b) - myScore(a),
      web: (a, b) => webNum(b) - webNum(a),
    };
    return l.sort(sorters[st.sort]);
  };
  const paint = (animate = true) => {
    spotCleanup?.();
    spotCleanup = null;
    const items = list();
    body.classList.toggle('is-spot', st.view === 'spot');
    if (!items.length) {
      body.innerHTML = `<div class="empty"><p>${st.q ? 'No matches.' : 'Nothing here yet.'}</p><button class="btn btn-glass" data-action="add">${icon.plus}<span>Add a title</span></button></div>`;
      return;
    }
    if (st.view === 'spot') { spotCleanup = renderSpotlight(body, items); return; }
    body.innerHTML = `<div class="grid ${animate ? '' : 'no-anim'}">${items.map((it, i) => card(it, Math.min(i, 24))).join('')}</div>`;
  };
  paint();

  root.querySelector('[data-seg="status"]').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    st.status = b.dataset.v;
    setSeg(b.parentElement, st.status);
    paint();
  });
  root.querySelector('[data-seg="view"]').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b || b.dataset.v === st.view) return;
    st.view = b.dataset.v;
    try { localStorage.setItem(`shelf.view.${kind}`, st.view); } catch {}
    setSeg(b.parentElement, st.view);
    body.classList.add('swap');
    setTimeout(() => { paint(); body.classList.remove('swap'); }, 200);
  });
  root.querySelector('[data-type]')?.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    st.type = b.dataset.v;
    b.parentElement.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c === b));
    paint();
  });
  root.querySelector('[data-q]').addEventListener('input', debounce((e) => { st.q = e.target.value; paint(false); }, 150));
  root.querySelector('[data-sort]').addEventListener('change', (e) => { st.sort = e.target.value; paint(); });
  return () => spotCleanup?.();
}

// ---------------- SPOTLIGHT (cover-flow) ----------------
// Posters slide past in 3D; only the one in the middle shows its details.

let spotMemory = {};

function renderSpotlight(body, items) {
  const key = location.hash;
  body.innerHTML = `<div class="spot" data-spot>
    <div class="spot-ambient"><img alt="" data-amb="0"><img alt="" data-amb="1"></div>
    <div class="spot-track" tabindex="0" aria-label="Titles — use left and right arrow keys">
      ${items.map((it, i) => `<button class="spot-item" data-i="${i}" aria-label="${esc(plain(it.title))}">
        <div class="spot-card">${posterBox(it, 'w500')}</div>
      </button>`).join('')}
    </div>
    <button class="spot-arrow prev" aria-label="Previous">${icon.back}</button>
    <button class="spot-arrow next" aria-label="Next">${icon.right}</button>
    <div class="spot-info" aria-live="polite"></div>
  </div>`;

  const spot = body.querySelector('[data-spot]');
  const track = spot.querySelector('.spot-track');
  const els = [...track.children];
  const info = spot.querySelector('.spot-info');
  const amb = [...spot.querySelectorAll('[data-amb]')];
  let current = -1;
  let ambTurn = 0;
  let raf = 0;

  const show = (i) => {
    if (i === current) return;
    current = i;
    spotMemory[key] = i;
    const it = items[i];
    els.forEach((el, k) => el.classList.toggle('center', k === i));
    // ambient light from the centred poster
    const src = safeUrl(sized(it.poster, 'w342'));
    const next = amb[ambTurn ^ 1];
    if (src) { next.src = src; next.classList.add('on'); amb[ambTurn].classList.remove('on'); ambTurn ^= 1; }
    info.classList.add('swap');
    clearTimeout(show.t);
    show.t = setTimeout(() => { info.innerHTML = spotInfo(it); info.classList.remove('swap'); }, 160);
  };

  const layout = () => {
    raf = 0;
    const mid = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let bestD = Infinity;
    els.forEach((el, k) => {
      const d = (el.offsetLeft + el.offsetWidth / 2 - mid) / el.offsetWidth;
      const ad = Math.min(Math.abs(d), 3);
      el.style.setProperty('--d', Math.max(-3, Math.min(3, d)).toFixed(3));
      el.style.setProperty('--ad', ad.toFixed(3));
      el.style.zIndex = String(100 - Math.round(ad * 10));
      if (Math.abs(d) < bestD) { bestD = Math.abs(d); best = k; }
    });
    show(best);
  };
  const queue = () => { if (!raf) raf = requestAnimationFrame(layout); };
  const goTo = (i, smooth = true) => {
    const el = els[Math.max(0, Math.min(els.length - 1, i))];
    track.scrollTo({ left: el.offsetLeft + el.offsetWidth / 2 - track.clientWidth / 2, behavior: smooth ? 'smooth' : 'auto' });
  };

  track.addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  track.addEventListener('click', (e) => {
    const el = e.target.closest('.spot-item');
    if (!el) return;
    const i = +el.dataset.i;
    if (i !== current) { goTo(i); return; }
    document.querySelectorAll('.poster[style*="view-transition-name"]').forEach((p) => { p.style.viewTransitionName = ''; });
    el.querySelector('.poster').style.viewTransitionName = 'poster';
    location.hash = `#/item/${items[i].id}`;
  });
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); }
    if (e.key === 'Enter') { e.preventDefault(); location.hash = `#/item/${items[current].id}`; }
  });
  spot.querySelector('.prev').onclick = () => goTo(current - 1);
  spot.querySelector('.next').onclick = () => goTo(current + 1);

  requestAnimationFrame(() => { goTo(spotMemory[key] || 0, false); layout(); });
  return () => removeEventListener('resize', queue);
}

function spotInfo(it) {
  const score = myScore(it)
    ? `<div class="spot-score">${stars(myScore(it), { size: 'sm' })}<b>${myScore(it).toFixed(1)}</b><span>yours</span></div>`
    : showWeb(it) && webScore(it) ? `<div class="spot-score"><b>${esc(webScore(it))}</b></div>` : '';
  const people = it.people?.names?.length ? `<span>${esc(it.people.names.slice(0, 2).join(', '))}</span>` : '';
  return `<p class="spot-meta"><span class="status-chip s-${it.status}">${statusLabel(it.kind, it.status)}</span><span>${KIND[it.kind]}</span>${it.year ? `<span>${esc(it.year)}</span>` : ''}${people}</p>
    <h2 class="spot-title"><a href="#/item/${it.id}">${bi(it.title)}</a></h2>
    ${score}
    ${it.overview?.en || it.overview?.zh ? `<p class="spot-ov">${bi(it.overview)}</p>` : ''}
    <a class="btn btn-light btn-sm" href="#/item/${it.id}">Open ${icon.right}</a>`;
}

// ---------------- COLLECTIONS ----------------

export function renderCollections(root) {
  const gs = store.groups().sort(byAdded);
  root.innerHTML = `<section class="page wrap">
    <header class="page-head">
      <p class="eyebrow fade-up" style="--d:0"><i class="live-dot"></i>Series, franchises & universes</p>
      <h1 class="large-title fade-up" style="--d:1"><em>Collections</em></h1>
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
    <label class="field"><span>Name</span><input name="en" required maxlength="120" value="${esc(g.name.en)}" placeholder="e.g. Marvel Cinematic Universe"></label>
    <label class="field"><span>中文名稱 <small>(optional)</small></span><input name="zh" maxlength="120" value="${esc(g.name.zh || '')}" placeholder="例如：漫威電影宇宙"></label>
    <label class="field"><span>Description <small>(optional)</small></span><textarea name="ov" rows="2" maxlength="2000">${esc(g.overview?.en || '')}</textarea></label>
    <label class="field"><span>中文簡介 <small>(optional)</small></span><textarea name="ovzh" rows="2" maxlength="2000">${esc(g.overview?.zh || '')}</textarea></label>
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
  const bg = safeUrl(members.find((m) => m.backdrop)?.backdrop || sized(members[0]?.poster, 'w780') || '');

  root.innerHTML = `<article class="detail group-detail">
    <div class="detail-backdrop ${members.find((m) => m.backdrop) ? '' : 'from-poster'}" ${bg ? `style="background-image:url('${esc(bg)}')"` : ''}></div>
    <div class="detail-top wrap">
      <a class="back-link" href="#/collections">${icon.back}<span>Collections</span></a>
      <p class="eyebrow fade-up" style="--d:0"><i class="live-dot"></i>Collection · ${members.length} title${members.length === 1 ? '' : 's'}</p>
      <h1 class="detail-title fade-up" style="--d:1">${bi(g.name)}</h1>
      ${g.overview?.en || g.overview?.zh ? `<p class="detail-overview fade-up" style="--d:2">${bi(g.overview)}</p>` : ''}
      <div class="group-stats fade-up" style="--d:3">
        <div><b>${done.length}<small>/${members.length}</small></b><span>finished</span></div>
        <div><b>${avg ? avg.toFixed(1) : '–'}</b><span>your average</span></div>
        <div>${stars(avg, { size: 'md' })}</div>
      </div>
    </div>
    <section class="wrap detail-section">
      <div class="sec-head"><h2>In this <em>collection</em></h2>
        <div class="sec-actions">
          <button class="btn btn-glass btn-sm" data-add-members>${icon.plus}<span>Add titles</span></button>
          <button class="btn btn-glass btn-sm" data-edit-group>${icon.edit}<span>Edit</span></button>
        </div>
      </div>
      <ol class="members">
        ${members.map((m, i) => `<li class="member reveal" style="--i:${i}">
          <a class="member-link" href="#/item/${m.id}" data-id="${m.id}">
            <span class="member-n">${String(i + 1).padStart(2, '0')}</span>
            ${posterBox(m, 'w185')}
            <div class="member-main">
              <div class="member-title">${bi(m.title)}</div>
              <div class="member-meta"><span class="status-chip s-${m.status}">${statusLabel(m.kind, m.status)}</span>${KIND[m.kind]}${m.year ? ` · ${esc(m.year)}` : ''}</div>
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
      <span><b>${bi(i.title)}</b><small class="muted">${KIND[i.kind]}${i.year ? ` · ${esc(i.year)}` : ''}</small></span>
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
