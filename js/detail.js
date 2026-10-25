// Title detail page: info, your take (ratings + diary), seasons & episodes, collections.
import * as store from './store.js';
import * as api from './api.js';
import {
  bi, esc, plain, KIND, statusLabel, icon, stars, bindRatings, posterBox, card, catBar, radar, mood,
  openSheet, confirmSheet, toast, debounce, myScore, safeUrl, showWeb,
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
  const years = it.year && (it.endYear && it.endYear !== it.year ? `${esc(it.year)}–${it.endYear}` : it.year);
  const meta = [KIND[it.kind], years, it.runtime && (it.kind === 'tv' ? `${it.runtime} min / ep` : fmtRuntime(it.runtime)), it.pages && `${it.pages} pages`].filter(Boolean).map((m) => `<span>${esc(m)}</span>`).join('');
  const groups = store.groupsOf(it.id);
  const bg = safeUrl(it.backdrop || api.sized(it.poster, 'w780'));
  const glow = safeUrl(api.sized(it.poster, 'w185'));

  root.innerHTML = `<article class="detail" data-detail>
    <div class="detail-backdrop ${it.backdrop ? '' : 'from-poster'}" ${bg ? `style="background-image:url('${esc(bg)}')"` : ''}></div>
    ${glow ? `<img class="detail-glow" src="${esc(glow)}" alt="" aria-hidden="true">` : ''}
    <div class="detail-top wrap">
      <a class="back-link" href="#/" data-back>${icon.back}<span>Back</span></a>
      <div class="detail-hero">
        <div class="detail-poster" style="view-transition-name:poster">${posterBox(it, 'w500').replace('class="poster ', 'class="poster big ')}</div>
        <div class="detail-head">
          <p class="meta-line fade-up" style="--d:0">${meta}</p>
          <h1 class="detail-title fade-up" style="--d:1">${bi(it.title)}</h1>
          ${it.originalTitle ? `<p class="orig fade-up" style="--d:1">${esc(it.originalTitle)}</p>` : ''}
          ${it.people?.names?.length ? `<p class="people fade-up" style="--d:2"><span>${esc(it.people.label || 'By')}</span> ${esc(it.people.names.join(', '))}</p>` : ''}
          ${it.genres?.length ? `<div class="tags fade-up" style="--d:2">${it.genres.map((g) => `<span>${esc(g)}</span>`).join('')}</div>` : ''}
          ${webRatings(it)}
          <div class="status-pills fade-up" style="--d:4" role="radiogroup" aria-label="Status">
            ${['wishlist', 'progress', 'done'].map((s) => `<button class="sp sp-${s} ${it.status === s ? 'on' : ''}" data-status="${s}" role="radio" aria-checked="${it.status === s}">${statusIcon(s)}<span>${statusLabel(it.kind, s)}</span></button>`).join('')}
          </div>
        </div>
      </div>
    </div>

    ${it.overview?.en || it.overview?.zh || it.tagline ? `<section class="wrap detail-section story reveal">
      ${it.tagline ? `<p class="tagline">${esc(it.tagline)}</p>` : ''}
      <p class="detail-overview">${bi(it.overview)}</p>
      ${it.people?.cast?.length ? `<p class="cast"><span>Starring</span> ${esc(it.people.cast.join(' · '))}</p>` : ''}
    </section>` : ''}

    <section class="wrap detail-section take reveal">
      <div class="sec-head"><h2>Your <em>take</em></h2>${it.status === 'wishlist' ? `<span class="muted">Haven’t ${it.kind === 'book' ? 'read' : 'watched'} it yet? Notes are welcome anyway.</span>` : ''}</div>
      ${reviewBlock(it, cats, { r: it.id })}
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
      ${it.imdbId ? `<p class="ext-links"><a href="https://www.imdb.com/title/${encodeURIComponent(it.imdbId)}/" target="_blank" rel="noopener noreferrer">IMDb ↗</a>${it.source?.type === 'tmdb' ? ` <a href="https://www.themoviedb.org/${it.kind === 'tv' ? 'tv' : 'movie'}/${encodeURIComponent(it.source.id)}" target="_blank" rel="noopener noreferrer">TMDB ↗</a>` : ''}</p>` : ''}
    </section>
  </article>`;

  bindDetail(root.querySelector('[data-detail]'), it);
}

const fmtRuntime = (m) => (m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`);

function statusIcon(s) {
  return {
    wishlist: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M6 3.5h12v17l-6-4-6 4z"/></svg>',
    progress: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>',
    done: icon.check,
  }[s];
}

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
  const html = chips.map(([l, v, c]) => `<div class="wr wr-${c}"><b>${esc(v)}</b><span>${esc(l)}</span></div>`).join('');
  // Wishlist: keep outside opinions hidden until you ask for them.
  if (!showWeb(it)) {
    return `<div class="web-ratings veiled fade-up" style="--d:3" data-veil>
      <button class="peek" data-peek>${icon.eye}<span>Peek at online scores</span></button>
      <div class="wr-list">${html}</div>
    </div>`;
  }
  return `<div class="web-ratings fade-up" style="--d:3"><div class="wr-list">${html}</div></div>`;
}

// "Your take": big stars + mood word, colourful category bars + radar, and a diary note.
function reviewBlock(it, cats, at, { compact = false } = {}) {
  const my = target(it, at) || {};
  const a = `data-r="${esc(at.r)}"${at.s != null ? ` data-s="${at.s}"` : ''}`;
  const m = mood(my.overall);
  const hasCats = cats.some((c) => my.cats?.[c]);
  const dateLabel = it.kind === 'book' ? 'Finished' : 'Watched';
  return `<div class="rv ${compact ? 'compact' : ''}" data-rv>
    <div class="rv-card">
      <div class="rv-main">
        <span class="rv-q">${compact ? 'This season' : it.kind === 'book' ? 'How was the read?' : 'How was it?'}</span>
        ${stars(my.overall, { attrs: `data-rate ${a} data-f="overall"`, size: compact ? 'lg' : 'xl', label: 'Overall rating' })}
        <div class="rv-mood tone-${m.tone}"><b class="rv-num">${my.overall ? (+my.overall).toFixed(1) : ''}</b><span class="rv-word">${m.word}</span></div>
      </div>
      ${cats.length ? `<details class="rv-details" ${!compact || hasCats ? 'open' : ''}>
        <summary><span>The details</span>${icon.chevron}</summary>
        <div class="rv-detail-body">
          <div class="rv-bars">${cats.map((c, i) => catBar(c, my.cats?.[c], `${a} data-f="cat:${esc(c)}"`, i)).join('')}</div>
          <div class="rv-radar" data-radar>${radar(cats, my.cats || {})}</div>
        </div>
      </details>` : ''}
    </div>
    <div class="journal">
      <span class="journal-mark" aria-hidden="true">“</span>
      <textarea class="journal-text" rows="${compact ? 2 : 3}" maxlength="20000" placeholder="${compact ? 'What happened this season that stuck with you?' : 'Write it like a diary — what stayed with you?'}" data-comment ${a}>${esc(my.comment || '')}</textarea>
      <div class="journal-foot">
        ${compact ? '' : `<label class="date-chip">${icon.calendar}<span>${dateLabel}</span><input type="date" data-date ${a} value="${esc(it.my?.date || '')}"></label>`}
        <span class="saved" data-saved>${icon.check}Saved</span>
      </div>
    </div>
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

const addr = (el) => ({ r: el.dataset.r, s: el.dataset.s, e: el.dataset.e });

// ---------- seasons ----------

function seasonsSection(it) {
  const list = it.seasons || [];
  const regular = list.filter((s) => s.n > 0);
  const seen = regular.filter((s) => s.my?.seen).length;
  return `<section class="wrap detail-section reveal" data-seasons>
    <div class="sec-head"><h2><em>Seasons</em></h2>
      ${regular.length ? `<div class="progress"><div class="bar"><i style="width:${(seen / regular.length) * 100}%"></i></div><span class="muted" data-progress>${seen} of ${regular.length} watched</span></div>` : ''}
    </div>
    <div class="seasons">${list.map((s) => seasonRow(it, s)).join('')}</div>
    <button class="btn btn-glass btn-sm add-season" data-add-season>${icon.plus}<span>Add a season</span></button>
  </section>`;
}

function seasonSummary(s) {
  const my = s.my || {};
  return `${my.overall ? `${stars(my.overall, { size: 'xs' })}<span class="season-word tone-${mood(my.overall).tone}">${mood(my.overall).word}</span>` : '<span class="muted">Not rated</span>'}${my.comment ? `<span class="has-note">${icon.comment}</span>` : ''}`;
}

function seasonRow(it, s) {
  const my = s.my || {};
  return `<div class="season ${my.seen ? 'is-seen' : ''}" data-season="${s.n}">
    <div class="season-head">
      <button class="season-open" data-toggle-season aria-expanded="false">
        <span class="season-num">${s.n === 0 ? 'SP' : String(s.n).padStart(2, '0')}</span>
        ${posterBox({ title: s.name, poster: s.poster || it.poster }, 'w154')}
        <div class="season-info">
          <div class="season-name">${bi(s.name)}</div>
          <div class="muted">${[s.year, s.episodeCount && `${s.episodeCount} episodes`, showWeb(it) && s.web?.tmdb && `TMDB ${s.web.tmdb}`].filter(Boolean).map(esc).join(' · ') || '&nbsp;'}</div>
          <div class="season-sum" data-sum="${s.n}">${seasonSummary(s)}</div>
        </div>
        <span class="chev">${icon.chevron}</span>
      </button>
      <button class="seen-btn ${my.seen ? 'on' : ''}" data-seen data-r="${esc(it.id)}" data-s="${s.n}" aria-pressed="${!!my.seen}" title="Mark season as watched">${icon.check}</button>
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
  const a = `data-r="${esc(it.id)}" data-s="${s.n}" data-e="${e.n}"`;
  const still = safeUrl(e.still);
  return `<div class="ep ${my.seen ? 'is-seen' : ''}">
    <div class="ep-still">${still ? `<img src="${esc(still)}" alt="" loading="lazy">` : ''}<span>E${e.n}</span></div>
    <div class="ep-main">
      <div class="ep-title">${bi(e.name) || `Episode ${e.n}`}</div>
      <div class="muted small">${[e.date, e.runtime && `${e.runtime}m`, showWeb(it) && e.web?.tmdb && `TMDB ${e.web.tmdb}`].filter(Boolean).map(esc).join(' · ')}</div>
      ${e.overview?.en || e.overview?.zh ? `<p class="ep-ov">${bi(e.overview)}</p>` : ''}
      <div class="ep-rate">${stars(my.overall, { attrs: `data-rate ${a} data-f="overall"`, size: 'sm', label: `Episode ${e.n} rating` })}<span class="stars-val">${my.overall ? (+my.overall).toFixed(1) : ''}</span>
        <button class="ep-note-btn ${my.comment ? 'has' : ''}" data-note aria-label="Notes">${icon.comment}</button>
      </div>
      <textarea class="ep-note" rows="2" maxlength="5000" placeholder="Notes on this episode…" data-comment ${a} ${my.comment ? '' : 'hidden'}>${esc(my.comment || '')}</textarea>
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
  const cats = store.settings().categories;
  const save = () => store.put(it);
  const flashSaved = (el) => {
    const s = el.closest('[data-rv]')?.querySelector('[data-saved]');
    if (!s) return;
    s.classList.remove('show');
    void s.offsetWidth;
    s.classList.add('show');
  };

  bindRatings(art, (el, v) => {
    const a = addr(el);
    const my = target(it, a);
    if (!my) return;
    const f = el.dataset.f;
    const rv = el.closest('[data-rv]');
    if (f.startsWith('cat:')) {
      my.cats ||= {};
      if (v) my.cats[f.slice(4)] = v; else delete my.cats[f.slice(4)];
      const r = rv?.querySelector('[data-radar]');
      if (r) r.innerHTML = radar(cats[it.kind] || [], my.cats);
    } else {
      my.overall = v || undefined;
      if (rv && a.e == null) {
        const m = mood(v);
        const box = rv.querySelector('.rv-mood');
        box.className = `rv-mood tone-${m.tone} pop`;
        box.querySelector('.rv-num').textContent = v ? v.toFixed(1) : '';
        box.querySelector('.rv-word').textContent = m.word;
      }
      // Rating something on your wishlist? You must have watched it.
      if (v && a.s == null && it.status === 'wishlist') setStatus('done', true);
      if (a.s != null && a.e == null) refreshSeasonSummary(a.s);
    }
    save();
    flashSaved(el);
  });

  art.addEventListener('input', debounce((e) => {
    const ta = e.target.closest('[data-comment]');
    if (!ta) return;
    const a = addr(ta);
    const my = target(it, a);
    if (!my) return;
    my.comment = ta.value;
    save();
    flashSaved(ta);
    if (a.s != null && a.e == null) refreshSeasonSummary(a.s);
    if (a.e != null) ta.closest('.ep').querySelector('[data-note]').classList.toggle('has', !!ta.value);
  }, 400));
  art.addEventListener('input', (e) => { if (e.target.matches('textarea')) autosize(e.target); });
  art.querySelectorAll('textarea').forEach(autosize);

  art.querySelector('.take [data-date]')?.addEventListener('change', (e) => { (it.my ||= {}).date = e.target.value; save(); flashSaved(e.target); });

  const setStatus = (v, quiet = false) => {
    it.status = v;
    if (v === 'done' && !it.my?.date) {
      (it.my ||= {}).date = new Date().toISOString().slice(0, 10);
      const d = art.querySelector('.take [data-date]');
      if (d) d.value = it.my.date;
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
    art.querySelectorAll('[data-status]').forEach((b) => {
      const on = b.dataset.status === v;
      b.classList.toggle('on', on);
      b.setAttribute('aria-checked', on);
    });
    save();
    if (!quiet) toast(`Moved to ${statusLabel(it.kind, v)}`);
  };

  art.addEventListener('click', async (e) => {
    const t = e.target;

    const st = t.closest('[data-status]');
    if (st) { if (st.dataset.status !== it.status) setStatus(st.dataset.status); return; }

    if (t.closest('[data-peek]')) { t.closest('[data-veil]').classList.add('open'); return; }

    const toggle = t.closest('[data-toggle-season]');
    if (toggle) {
      const row = toggle.closest('.season');
      const n = +row.dataset.season;
      const inner = row.querySelector('[data-inner]');
      const opening = !row.classList.contains('open');
      if (opening && !inner.childElementCount) inner.innerHTML = seasonInner(it, it.seasons.find((s) => s.n === n));
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
      const season = it.seasons.find((s) => s.n === +a.s);
      if (a.e == null) {
        season.episodes?.forEach((ep) => { (ep.my ||= {}).seen = my.seen; });
        const row = seen.closest('.season');
        row.classList.toggle('is-seen', my.seen);
        row.querySelectorAll('.ep').forEach((epEl) => {
          epEl.classList.toggle('is-seen', my.seen);
          epEl.querySelector('.seen-btn').classList.toggle('on', my.seen);
        });
      } else {
        seen.closest('.ep').classList.toggle('is-seen', my.seen);
        const all = season.episodes.every((ep) => ep.my?.seen);
        if (all !== !!season.my?.seen) {
          (season.my ||= {}).seen = all;
          const row = seen.closest('.season');
          row.classList.toggle('is-seen', all);
          row.querySelector('.season-head .seen-btn').classList.toggle('on', all);
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
        season.overview = { en: season.overview?.en || data.overview.en, zh: season.overview?.zh || data.overview.zh };
        save();
        const inner = load.closest('[data-inner]');
        inner.innerHTML = seasonInner(it, season);
        inner.querySelectorAll('textarea').forEach(autosize);
      } catch (err) {
        toast(err.message);
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
      addEp.closest('[data-inner]').innerHTML = seasonInner(it, season);
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
    const el = art.querySelector(`[data-sum="${+n}"]`);
    if (s && el) el.innerHTML = seasonSummary(s);
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
    toast(err.message);
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
