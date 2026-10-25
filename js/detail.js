// Title detail page: info, my review, seasons & episodes, collections.
import * as store from './store.js';
import * as api from './api.js';
import {
  bi, esc, plain, KIND, statusLabel, icon, stars, paintStars, bindStars, posterBox, card,
  segmented, setSeg, openSheet, confirmSheet, toast, debounce, myScore,
} from './ui.js';
import { editGroupSheet } from './views.js';
import { openEditor } from './add.js';

export function renderDetail(root, id) {
  const it = store.get(id);
  if (!it) {
    root.innerHTML = '<section class="page wrap"><p class="empty">This title is no longer on your shelf.</p><a class="btn btn-glass" href="#/">Go home</a></section>';
    return;
  }
  const cats = store.settings().categories[it.kind] || [];
  const meta = [KIND[it.kind], it.year && (it.endYear && it.endYear !== it.year ? `${it.year}–${it.endYear}` : it.year), it.runtime && (it.kind === 'tv' ? `${it.runtime} min / ep` : fmtRuntime(it.runtime)), it.pages && `${it.pages} pages`].filter(Boolean).join(' · ');
  const groups = store.groupsOf(it.id);

  root.innerHTML = `<article class="detail" data-detail>
    <div class="detail-backdrop ${it.backdrop ? '' : 'from-poster'}" style="background-image:url('${esc(it.backdrop || api.sized(it.poster, 'w780'))}')"></div>
    <div class="detail-top wrap">
      <a class="back-link" href="#/" data-back>${icon.back}<span>Back</span></a>
      <div class="detail-hero">
        <div class="detail-poster" style="view-transition-name:poster">${posterBox(it, 'w500').replace('class="poster ', 'class="poster big ')}</div>
        <div class="detail-head">
          <p class="eyebrow fade-up" style="--d:0">${meta}</p>
          <h1 class="detail-title fade-up" style="--d:1">${bi(it.title)}</h1>
          ${it.originalTitle ? `<p class="muted fade-up" style="--d:1">${esc(it.originalTitle)}</p>` : ''}
          ${it.people?.names?.length ? `<p class="people fade-up" style="--d:2"><span class="muted">${esc(it.people.label || 'By')}</span> ${esc(it.people.names.join(', '))}</p>` : ''}
          ${it.genres?.length ? `<div class="tags fade-up" style="--d:2">${it.genres.map((g) => `<span>${esc(g)}</span>`).join('')}</div>` : ''}
          ${webRatings(it)}
          <div class="fade-up status-wrap" style="--d:4">
            ${segmented('status', [['wishlist', statusLabel(it.kind, 'wishlist')], ['progress', statusLabel(it.kind, 'progress')], ['done', statusLabel(it.kind, 'done')]], it.status)}
          </div>
        </div>
      </div>
    </div>

    ${it.overview?.en || it.overview?.zh || it.tagline ? `<section class="wrap detail-section reveal">
      ${it.tagline ? `<p class="tagline">${esc(it.tagline)}</p>` : ''}
      <p class="detail-overview">${bi(it.overview)}</p>
      ${it.people?.cast?.length ? `<p class="cast"><span class="muted">Starring</span> ${esc(it.people.cast.join(' · '))}</p>` : ''}
    </section>` : ''}

    <section class="wrap detail-section review reveal">
      <div class="sec-head"><h2>My review</h2>${it.status === 'wishlist' ? `<span class="muted">Not ${it.kind === 'book' ? 'read' : 'watched'} yet — you can still jot down notes.</span>` : ''}</div>
      ${reviewBlock(it, cats, { r: it.id })}
      <label class="date-field"><span>${it.kind === 'book' ? 'Finished reading on' : 'Watched on'}</span><input type="date" data-date data-r="${it.id}" value="${esc(it.my?.date || '')}"></label>
    </section>

    ${it.kind === 'tv' ? seasonsSection(it) : ''}

    ${groups.map((g) => groupStrip(g, it)).join('')}

    <section class="wrap detail-section reveal">
      <div class="actions-row">
        <button class="btn btn-glass btn-sm" data-act="collect">${icon.stack}<span>Add to collection</span></button>
        <button class="btn btn-glass btn-sm" data-act="edit">${icon.edit}<span>Edit details</span></button>
        ${it.source?.type === 'tmdb' ? `<button class="btn btn-glass btn-sm" data-act="refresh">${icon.refresh}<span>Refresh info & scores</span></button>` : ''}
        <button class="btn btn-ghost-danger btn-sm" data-act="delete">${icon.trash}<span>Remove</span></button>
      </div>
      ${it.imdbId ? `<p class="ext-links"><a href="https://www.imdb.com/title/${esc(it.imdbId)}/" target="_blank" rel="noopener">IMDb ↗</a>${it.source?.type === 'tmdb' ? ` <a href="https://www.themoviedb.org/${it.kind}/${it.source.id}" target="_blank" rel="noopener">TMDB ↗</a>` : ''}</p>` : ''}
    </section>
  </article>`;

  const art = root.querySelector('[data-detail]');
  bindDetail(art, it);
}

const fmtRuntime = (m) => (m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`);

function webRatings(it) {
  const w = it.web || {};
  const chips = [
    w.imdb && ['IMDb', w.imdb, 'imdb'],
    w.rt && ['Rotten Tomatoes', w.rt, 'rt'],
    w.tmdb && ['TMDB', w.tmdb, 'tmdb'],
    w.openlibrary && ['Open Library', `${w.openlibrary} / 5`, 'ol'],
    w.google && ['Google Books', `${w.google} / 5`, 'gb'],
    w.other && [w.otherLabel || 'Rating', w.other, 'other'],
  ].filter(Boolean);
  if (!chips.length) return '';
  return `<div class="web-ratings fade-up" style="--d:3">${chips.map(([l, v, c]) => `<div class="wr wr-${c}"><b>${esc(v)}</b><span>${esc(l)}</span></div>`).join('')}</div>`;
}

// One review block: overall + categories + comment. `at` addresses the target (item / season).
function reviewBlock(it, cats, at, { compact = false } = {}) {
  const my = target(it, at) || {};
  const attr = (f) => `data-rate data-r="${at.r}"${at.s != null ? ` data-s="${at.s}"` : ''} data-f="${f}"`;
  const catVals = cats.map((c) => my.cats?.[c] || 0).filter(Boolean);
  const avg = catVals.length ? catVals.reduce((a, b) => a + b, 0) / catVals.length : 0;
  const open = !compact || catVals.length;
  return `<div class="rv ${compact ? 'compact' : ''}">
    <div class="rv-overall">
      <span class="rv-label">Overall</span>
      ${stars(my.overall, { attrs: attr('overall'), size: compact ? 'md' : 'lg', label: 'Overall rating' })}
      <span class="stars-val">${my.overall ? (+my.overall).toFixed(1) : '–'}</span>
    </div>
    ${cats.length ? `<details class="rv-cats" ${open ? 'open' : ''}>
      <summary>Rate by category <span class="muted cat-avg">${avg ? `avg ${avg.toFixed(1)}` : ''}</span>${icon.chevron}</summary>
      <div class="rv-cat-list">
        ${cats.map((c) => `<div class="rv-cat"><span>${esc(c)}</span>${stars(my.cats?.[c], { attrs: attr(`cat:${c}`), size: 'sm', label: c })}<span class="stars-val">${my.cats?.[c] ? (+my.cats[c]).toFixed(1) : '–'}</span></div>`).join('')}
      </div>
    </details>` : ''}
    <textarea class="rv-comment" rows="${compact ? 2 : 3}" placeholder="${compact ? 'Thoughts on this season…' : 'What did you think?'}" data-comment data-r="${at.r}"${at.s != null ? ` data-s="${at.s}"` : ''}>${esc(my.comment || '')}</textarea>
  </div>`;
}

// Locate the "my" object for an item, a season or an episode.
function target(it, { s, e }) {
  if (s == null) return (it.my ||= {});
  const season = it.seasons?.find((x) => x.n === +s);
  if (!season) return null;
  if (e == null) return (season.my ||= {});
  const ep = season.episodes?.find((x) => x.n === +e);
  return ep ? (ep.my ||= {}) : null;
}

function addr(el) { return { r: el.dataset.r, s: el.dataset.s, e: el.dataset.e }; }

// ---------- seasons ----------

function seasonsSection(it) {
  const list = it.seasons || [];
  const regular = list.filter((s) => s.n > 0);
  const seen = regular.filter((s) => s.my?.seen).length;
  return `<section class="wrap detail-section reveal" data-seasons>
    <div class="sec-head"><h2>Seasons</h2>
      ${regular.length ? `<div class="progress"><div class="bar"><i style="width:${(seen / regular.length) * 100}%"></i></div><span class="muted" data-progress>${seen} of ${regular.length} watched</span></div>` : ''}
    </div>
    <div class="seasons">${list.map((s) => seasonRow(it, s)).join('')}</div>
    <button class="btn btn-glass btn-sm add-season" data-add-season>${icon.plus}<span>Add a season</span></button>
  </section>`;
}

function seasonRow(it, s) {
  const my = s.my || {};
  return `<div class="season ${my.seen ? 'is-seen' : ''}" data-season="${s.n}">
    <div class="season-head">
      <button class="season-open" data-toggle-season aria-expanded="false">
        ${posterBox({ title: s.name, poster: s.poster || it.poster }, 'w154')}
        <div class="season-info">
          <div class="season-name">${bi(s.name)}</div>
          <div class="muted">${[s.year, s.episodeCount && `${s.episodeCount} episodes`, s.web?.tmdb && `TMDB ${s.web.tmdb}`].filter(Boolean).join(' · ') || '&nbsp;'}</div>
          <div class="season-sum" data-sum="${s.n}">${my.overall ? stars(my.overall, { size: 'xs' }) : '<span class="muted">Not rated</span>'}${my.comment ? `<span class="has-note">${icon.comment}</span>` : ''}</div>
        </div>
        <span class="chev">${icon.chevron}</span>
      </button>
      <button class="seen-btn ${my.seen ? 'on' : ''}" data-seen data-r="${it.id}" data-s="${s.n}" aria-pressed="${!!my.seen}" title="Mark season as watched">${icon.check}</button>
    </div>
    <div class="season-body"><div class="season-inner" data-inner></div></div>
  </div>`;
}

function seasonInner(it, s) {
  const cats = store.settings().categories.tv || [];
  const eps = s.episodes || [];
  return `<div class="season-content">
    ${s.overview?.en || s.overview?.zh ? `<p class="season-ov">${bi(s.overview)}</p>` : ''}
    ${reviewBlock(it, cats, { r: it.id, s: s.n }, { compact: true })}
    <div class="eps-head"><h3>Episodes</h3>
      ${it.source?.type === 'tmdb' ? `<button class="btn btn-glass btn-xs" data-load-eps="${s.n}">${icon.refresh}<span>${eps.length ? 'Reload' : 'Load episodes'}</span></button>` : ''}
      <button class="btn btn-glass btn-xs" data-add-ep="${s.n}">${icon.plus}<span>Add episode</span></button>
    </div>
    <div class="eps">${eps.map((e) => epRow(it, s, e)).join('') || `<p class="muted small">${it.source?.type === 'tmdb' ? 'Load the episode list to rate single episodes.' : 'Add episodes to rate them one by one.'}</p>`}</div>
  </div>`;
}

function epRow(it, s, e) {
  const my = e.my || {};
  const a = `data-r="${it.id}" data-s="${s.n}" data-e="${e.n}"`;
  return `<div class="ep ${my.seen ? 'is-seen' : ''}">
    <div class="ep-still">${e.still ? `<img src="${esc(e.still)}" alt="" loading="lazy" onload="this.classList.add('ok')">` : ''}<span>E${e.n}</span></div>
    <div class="ep-main">
      <div class="ep-title">${bi(e.name) || `Episode ${e.n}`}</div>
      <div class="muted small">${[e.date, e.runtime && `${e.runtime}m`, e.web?.tmdb && `TMDB ${e.web.tmdb}`].filter(Boolean).join(' · ')}</div>
      ${e.overview?.en || e.overview?.zh ? `<p class="ep-ov">${bi(e.overview)}</p>` : ''}
      <div class="ep-rate">${stars(my.overall, { attrs: `data-rate ${a} data-f="overall"`, size: 'sm', label: `Episode ${e.n} rating` })}<span class="stars-val">${my.overall ? (+my.overall).toFixed(1) : '–'}</span>
        <button class="ep-note-btn ${my.comment ? 'has' : ''}" data-note aria-label="Comment">${icon.comment}</button>
      </div>
      <textarea class="rv-comment ep-note" rows="2" placeholder="Notes on this episode…" data-comment ${a} ${my.comment ? '' : 'hidden'}>${esc(my.comment || '')}</textarea>
    </div>
    <button class="seen-btn sm ${my.seen ? 'on' : ''}" data-seen ${a} aria-pressed="${!!my.seen}" title="Mark episode as watched">${icon.check}</button>
  </div>`;
}

function groupStrip(g, it) {
  const members = (g.members || []).map(store.get).filter(Boolean);
  return `<section class="detail-section reveal strip">
    <div class="sec-head wrap"><h2><span class="muted">Part of</span> ${bi(g.name)}</h2><a class="see-all" href="#/group/${g.id}">Open collection ${icon.right}</a></div>
    <div class="row-scroller"><div class="row-track">${members.map((m, i) => card(m, i).replace('class="card"', `class="card ${m.id === it.id ? 'current' : ''}"`)).join('')}</div></div>
  </section>`;
}

// ---------- behaviour ----------

function bindDetail(art, it) {
  const save = () => store.put(it);

  bindStars(art, (el, v) => {
    const a = addr(el);
    const my = target(it, a);
    if (!my) return;
    const f = el.dataset.f;
    if (f.startsWith('cat:')) {
      my.cats ||= {};
      if (v) my.cats[f.slice(4)] = v; else delete my.cats[f.slice(4)];
      const rv = el.closest('.rv');
      const vals = Object.values(my.cats).filter(Boolean);
      rv.querySelector('.cat-avg').textContent = vals.length ? `avg ${(vals.reduce((x, y) => x + y, 0) / vals.length).toFixed(1)}` : '';
    } else {
      my.overall = v || undefined;
      // Rating something you haven't marked as watched? Move it along.
      if (v && a.s == null && it.status === 'wishlist') setStatus('done');
      if (a.s != null && a.e == null) refreshSeasonSummary(a.s);
    }
    save();
  });

  art.addEventListener('input', debounce((e) => {
    const ta = e.target.closest('[data-comment]');
    if (!ta) return;
    const a = addr(ta);
    const my = target(it, a);
    if (!my) return;
    my.comment = ta.value;
    save();
    if (a.s != null && a.e == null) refreshSeasonSummary(a.s);
    if (a.e != null) ta.closest('.ep').querySelector('[data-note]').classList.toggle('has', !!ta.value);
  }, 350));
  art.addEventListener('input', (e) => { if (e.target.matches('textarea')) autosize(e.target); });
  art.querySelectorAll('textarea').forEach(autosize);

  art.querySelector('[data-date]').addEventListener('change', (e) => { (it.my ||= {}).date = e.target.value; save(); });

  const statusSeg = art.querySelector('[data-seg="status"]');
  const setStatus = (v) => {
    it.status = v;
    if (v === 'done' && !it.my?.date) {
      (it.my ||= {}).date = new Date().toISOString().slice(0, 10);
      art.querySelector('[data-date]').value = it.my.date;
    }
    // Finishing a show means every season is watched.
    if (v === 'done' && it.kind === 'tv') {
      it.seasons?.filter((s) => s.n > 0).forEach((s) => { (s.my ||= {}).seen = true; });
      art.querySelectorAll('.season').forEach((row) => {
        if (+row.dataset.season === 0) return;
        row.classList.add('is-seen');
        row.querySelector('.season-head .seen-btn').classList.add('on');
      });
      updateProgress();
    }
    setSeg(statusSeg, v);
    save();
  };
  statusSeg.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b || b.dataset.v === it.status) return;
    setStatus(b.dataset.v);
    toast(`Moved to ${statusLabel(it.kind, b.dataset.v)}`);
  });

  art.addEventListener('click', async (e) => {
    const t = e.target;

    const toggle = t.closest('[data-toggle-season]');
    if (toggle) {
      const row = toggle.closest('.season');
      const n = +row.dataset.season;
      const inner = row.querySelector('[data-inner]');
      const opening = !row.classList.contains('open');
      if (opening && !inner.childElementCount) {
        inner.innerHTML = seasonInner(it, it.seasons.find((s) => s.n === n));
        inner.querySelectorAll('textarea').forEach(autosize);
      }
      row.classList.toggle('open', opening);
      toggle.setAttribute('aria-expanded', opening);
      if (opening) requestAnimationFrame(() => inner.querySelectorAll('textarea').forEach(autosize));
      return;
    }

    const seen = t.closest('[data-seen]');
    if (seen) {
      const a = addr(seen);
      const my = target(it, a);
      my.seen = !my.seen;
      seen.classList.toggle('on', my.seen);
      seen.setAttribute('aria-pressed', my.seen);
      seen.animate([{ transform: 'scale(.8)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' }], { duration: 320, easing: 'cubic-bezier(.2,.8,.2,1)' });
      const season = it.seasons.find((s) => s.n === +a.s);
      if (a.e == null) {
        // Whole season toggled: carry it down to every episode.
        season.episodes?.forEach((ep) => { (ep.my ||= {}).seen = my.seen; });
        const row = seen.closest('.season');
        row.classList.toggle('is-seen', my.seen);
        row.querySelectorAll('.ep').forEach((epEl) => {
          epEl.classList.toggle('is-seen', my.seen);
          epEl.querySelector('.seen-btn').classList.toggle('on', my.seen);
        });
      } else {
        seen.closest('.ep').classList.toggle('is-seen', my.seen);
        if (season.episodes.every((ep) => ep.my?.seen) !== !!season.my?.seen) {
          (season.my ||= {}).seen = season.episodes.every((ep) => ep.my?.seen);
          const row = seen.closest('.season');
          row.classList.toggle('is-seen', season.my.seen);
          row.querySelector('.season-head .seen-btn').classList.toggle('on', season.my.seen);
        }
      }
      if (it.status === 'wishlist' && my.seen) setStatus('progress');
      updateProgress();
      save();
      return;
    }

    const note = t.closest('[data-note]');
    if (note) {
      const ta = note.closest('.ep').querySelector('.ep-note');
      ta.hidden = !ta.hidden;
      if (!ta.hidden) { autosize(ta); ta.focus(); }
      return;
    }

    const load = t.closest('[data-load-eps]');
    if (load) {
      const n = +load.dataset.loadEps;
      load.disabled = true;
      load.classList.add('loading');
      try {
        const data = await api.seasonEpisodes(it.source.id, n);
        const season = it.seasons.find((s) => s.n === n);
        const old = new Map((season.episodes || []).map((ep) => [ep.n, ep.my]));
        season.episodes = data.episodes.map((ep) => ({ ...ep, my: old.get(ep.n) || {} }));
        season.episodeCount = season.episodes.length;
        if (data.overview.zh && !season.overview?.zh) season.overview = { ...season.overview, zh: data.overview.zh };
        save();
        const inner = load.closest('[data-inner]');
        inner.innerHTML = seasonInner(it, season);
        inner.querySelectorAll('textarea').forEach(autosize);
      } catch (err) {
        toast(err instanceof api.NoKeyError ? 'Add your TMDB key in Settings first' : err.message);
        load.disabled = false;
        load.classList.remove('loading');
      }
      return;
    }

    const addEp = t.closest('[data-add-ep]');
    if (addEp) {
      const season = it.seasons.find((s) => s.n === +addEp.dataset.addEp);
      const eps = (season.episodes ||= []);
      const n = (eps.at(-1)?.n || 0) + 1;
      eps.push({ n, name: { en: `Episode ${n}` }, overview: {}, my: {} });
      season.episodeCount = Math.max(season.episodeCount || 0, eps.length);
      save();
      const inner = addEp.closest('[data-inner]');
      inner.innerHTML = seasonInner(it, season);
      return;
    }

    if (t.closest('[data-add-season]')) {
      const n = Math.max(0, ...(it.seasons || []).map((s) => s.n)) + 1;
      (it.seasons ||= []).push({ n, name: { en: `Season ${n}`, zh: `第 ${n} 季` }, overview: {}, my: {} });
      save();
      renderDetail(art.parentElement, it.id);
      return;
    }

    const act = t.closest('[data-act]')?.dataset.act;
    if (act === 'edit') openEditor(it);
    if (act === 'collect') collectSheet(it);
    if (act === 'refresh') refresh(it, t.closest('[data-act]'));
    if (act === 'delete') {
      if (await confirmSheet(`Remove “${plain(it.title)}”?`, 'Your ratings and notes for it will be deleted too.')) {
        store.remove(it.id);
        toast('Removed');
        history.length > 1 ? history.back() : (location.hash = '#/');
      }
    }
  });

  function refreshSeasonSummary(n) {
    const s = it.seasons.find((x) => x.n === +n);
    const el = art.querySelector(`[data-sum="${n}"]`);
    if (!s || !el) return;
    el.innerHTML = `${s.my?.overall ? stars(s.my.overall, { size: 'xs' }) : '<span class="muted">Not rated</span>'}${s.my?.comment ? `<span class="has-note">${icon.comment}</span>` : ''}`;
  }

  function updateProgress() {
    const regular = (it.seasons || []).filter((s) => s.n > 0);
    if (!regular.length) return;
    const seen = regular.filter((s) => s.my?.seen).length;
    const bar = art.querySelector('.progress .bar i');
    if (bar) bar.style.width = `${(seen / regular.length) * 100}%`;
    const txt = art.querySelector('[data-progress]');
    if (txt) txt.textContent = `${seen} of ${regular.length} watched`;
  }
}

function autosize(ta) {
  if (ta.hidden || !ta.offsetParent) return;
  ta.style.height = 'auto';
  ta.style.height = `${ta.scrollHeight + 2}px`;
}

async function refresh(it, btn) {
  btn.disabled = true;
  btn.classList.add('loading');
  try {
    const { item: fresh } = await api.details(it.kind, it.source.id);
    // Keep everything personal; take new info and scores.
    const keepZh = (newer, older) => ({ en: newer.en || older?.en || '', zh: newer.zh || older?.zh || '' });
    fresh.title = keepZh(fresh.title, it.title);
    fresh.overview = keepZh(fresh.overview, it.overview);
    if (it.seasons) {
      const old = new Map(it.seasons.map((s) => [s.n, s]));
      fresh.seasons = (fresh.seasons || []).map((s) => ({ ...s, my: old.get(s.n)?.my || {}, episodes: old.get(s.n)?.episodes }));
      for (const s of it.seasons) if (!fresh.seasons.some((x) => x.n === s.n)) fresh.seasons.push(s);
      fresh.seasons.sort((a, b) => a.n - b.n);
    }
    Object.assign(it, fresh, { sample: false });
    store.put(it);
    toast('Info and scores updated');
    renderDetail(document.getElementById('view'), it.id);
  } catch (err) {
    toast(err instanceof api.NoKeyError ? 'Add your TMDB key in Settings first' : err.message);
    btn.disabled = false;
    btn.classList.remove('loading');
  }
}

function collectSheet(it) {
  const gs = store.groups();
  const s = openSheet(`<div class="picker">
    <h2>Add to a collection</h2>
    <p class="muted">Group related titles — a trilogy, a TV universe, or the book a film is based on.</p>
    <div class="pick-list">${gs.map((g) => `<label class="pick-row">
      <input type="checkbox" value="${g.id}" ${g.members?.includes(it.id) ? 'checked' : ''}>
      <span><b>${bi(g.name)}</b><small class="muted">${g.members?.length || 0} titles</small></span>
      <i class="tick">${icon.check}</i>
    </label>`).join('') || '<p class="muted">You have no collections yet.</p>'}</div>
    <div class="form-actions">
      <button class="btn btn-glass" data-new>${icon.plus}<span>New collection</span></button>
      <button class="btn btn-light" data-save>Done</button>
    </div>
  </div>`);
  s.el.querySelector('[data-new]').onclick = () => { s.close(); editGroupSheet(null, { addId: it.id }); };
  s.el.querySelector('[data-save]').onclick = () => {
    const checked = new Set([...s.el.querySelectorAll('input:checked')].map((c) => c.value));
    for (const g of gs) {
      const has = g.members?.includes(it.id);
      if (checked.has(g.id) && !has) { g.members = [...(g.members || []), it.id]; store.put(g); }
      if (!checked.has(g.id) && has) { g.members = g.members.filter((m) => m !== it.id); store.put(g); }
    }
    s.close();
    renderDetail(document.getElementById('view'), it.id);
  };
}

export { myScore };
