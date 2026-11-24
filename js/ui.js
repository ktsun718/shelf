// Shared UI building blocks: escaping, bilingual text, ratings, cards, sheets, toasts.
import { sized } from './api.js';
import * as store from './store.js';

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Only allow http(s) and our own resized-upload data URLs into src/url().
export const safeUrl = (u) => (/^(https:\/\/|http:\/\/127\.0\.0\.1|data:image\/(jpeg|png|webp);base64,)/i.test(u || '') ? u : '');

// Bilingual text: both languages are in the page, CSS shows one.
// Switching language is instant — no reload, no re-render.
export function bi(o) {
  if (!o) return '';
  if (typeof o === 'string') return esc(o);
  const en = o.en || o.zh || '';
  const zh = o.zh || '';
  if (!zh || zh === en) return esc(en);
  return `<span class="l-en">${esc(en)}</span><span class="l-zh" lang="zh-HK">${esc(zh)}</span>`;
}
export const plain = (o) => (typeof o === 'string' ? o : o?.en || o?.zh || '');

export const KIND = { movie: 'Movie', tv: 'TV Show', book: 'Book' };
export const KIND_PLURAL = { movie: 'Movies', tv: 'TV Shows', book: 'Books', all: 'Library' };

// Small coloured dot that marks a title's kind (film, series, book).
export const kindDot = (kind) => `<i class="kd kd-${kind}" aria-hidden="true"></i>`;

export function statusLabel(kind, s) {
  const book = kind === 'book';
  return {
    wishlist: book ? 'Want to read' : 'Wishlist',
    progress: book ? 'Reading' : 'Watching',
    done: book ? 'Read' : 'Watched',
  }[s];
}

const SV = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" ${extra}>${d}</svg>`;

export const icon = {
  plus: SV('<path d="M12 5v14M5 12h14"/>'),
  search: SV('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
  close: SV('<path d="M18 6 6 18M6 6l12 12"/>'),
  back: SV('<path d="m15 18-6-6 6-6"/>'),
  chevron: SV('<path d="m6 9 6 6 6-6"/>'),
  right: SV('<path d="m9 18 6-6-6-6"/>'),
  check: SV('<path d="M20 6 9 17l-5-5"/>'),
  refresh: SV('<path d="M21 12a9 9 0 1 1-2.64-6.36L21 8"/><path d="M21 3v5h-5"/>'),
  shuffle: SV('<path d="m18 14 4 4-4 4"/><path d="m18 2 4 4-4 4"/><path d="M2 18h1.97a4 4 0 0 0 3.3-1.7l5.45-7.6a4 4 0 0 1 3.3-1.7H22"/><path d="M2 6h1.97a4 4 0 0 1 3.6 2.2"/><path d="M22 18h-6.04a4 4 0 0 1-3.3-1.8l-.36-.45"/>'),
  trash: SV('<path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>'),
  edit: SV('<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/>'),
  stack: SV('<rect x="3" y="7" width="13" height="14" rx="2"/><path d="M7 4h11a2 2 0 0 1 2 2v12"/>'),
  comment: SV('<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/>'),
  up: SV('<path d="m18 15-6-6-6 6"/>'),
  down: SV('<path d="m6 9 6 6 6-6"/>'),
  grid: SV('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>'),
  spot: SV('<rect x="8" y="4" width="8" height="16" rx="1.5"/><path d="M5 7v10M2 9v6M19 7v10M22 9v6"/>'),
  eye: SV('<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
  calendar: SV('<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'),
  bookmark: SV('<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>'),
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>',
  star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.4l2.95 6.2 6.8.83-5.02 4.68 1.32 6.74L12 17.5l-6.05 3.35 1.32-6.74L2.25 9.43l6.8-.83z"/></svg>',
};

// ---------- mood words for a score ----------

export function mood(v) {
  if (!v) return { word: 'Not rated yet', tone: 0 };
  if (v <= 1) return { word: 'Not for me', tone: 1 };
  if (v <= 2) return { word: 'Meh', tone: 2 };
  if (v <= 3) return { word: 'Decent', tone: 3 };
  if (v <= 3.5) return { word: 'Good', tone: 4 };
  if (v <= 4) return { word: 'Great', tone: 5 };
  if (v <= 4.5) return { word: 'Loved it', tone: 6 };
  return { word: 'Masterpiece', tone: 7 };
}

// ---------- stars ----------

const STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.4l2.95 6.2 6.8.83-5.02 4.68 1.32 6.74L12 17.5l-6.05 3.35 1.32-6.74L2.25 9.43l6.8-.83z"/></svg>';

export function stars(value, { attrs = '', size = '', label = 'Rating' } = {}) {
  const v = +value || 0;
  let h = '';
  for (let i = 0; i < 5; i++) {
    const f = Math.max(0, Math.min(1, v - i)) * 100;
    h += `<span class="star" style="--k:${i}">${STAR}<span class="fill" style="width:${f}%">${STAR}</span></span>`;
  }
  const editable = attrs.includes('data-rate');
  const a11y = editable ? `role="slider" tabindex="0" aria-label="${esc(label)}" aria-valuemin="0" aria-valuemax="5" aria-valuenow="${v}"` : `role="img" aria-label="${v} out of 5 stars"`;
  return `<div class="stars ${size}" data-value="${v}" ${a11y} ${attrs}>${h}</div>`;
}

// Bar used for the per-category scores.
export function catBar(label, value, attrs) {
  const v = +value || 0;
  return `<div class="cbar" data-rate ${attrs} data-value="${v}" role="slider" tabindex="0" aria-label="${esc(label)}" aria-valuemin="0" aria-valuemax="5" aria-valuenow="${v}">
    <span class="cbar-label">${esc(label)}</span>
    <span class="cbar-track"><i class="cbar-fill" style="transform:scaleX(${v / 5})"></i></span>
    <b class="cbar-val">${v ? v.toFixed(1) : '–'}</b>
  </div>`;
}

// Radar chart of category scores — a quick "shape" of how you felt.
export function radar(cats, values) {
  const n = cats.length;
  if (n < 3) return '';
  const R = 72, C = 120;
  const pt = (i, r) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [C + Math.cos(a) * r, C + Math.sin(a) * r];
  };
  const ring = (k) => cats.map((_, i) => pt(i, R * k).join(',')).join(' ');
  const shape = cats.map((c, i) => pt(i, (R * (values[c] || 0)) / 5).join(',')).join(' ');
  const anchor = (x) => (x < C - 8 ? 'end' : x > C + 8 ? 'start' : 'middle');
  return `<svg class="radar" viewBox="0 0 240 240" aria-hidden="true">
    ${[0.25, 0.5, 0.75, 1].map((k) => `<polygon class="radar-ring" points="${ring(k)}"/>`).join('')}
    ${cats.map((_, i) => { const [x, y] = pt(i, R); return `<line class="radar-axis" x1="${C}" y1="${C}" x2="${x}" y2="${y}"/>`; }).join('')}
    <polygon class="radar-shape" points="${shape}"/>
    ${cats.map((c, i) => { const [x, y] = pt(i, R + 12); return `<text x="${x}" y="${y}" text-anchor="${anchor(x)}" dominant-baseline="middle">${esc(c)}</text>`; }).join('')}
  </svg>`;
}

export function paintRating(el, v) {
  el.dataset.value = v;
  el.setAttribute('aria-valuenow', v);
  if (el.classList.contains('cbar')) {
    el.querySelector('.cbar-fill').style.transform = `scaleX(${v / 5})`;
    el.querySelector('.cbar-val').textContent = v ? v.toFixed(1) : '–';
    return;
  }
  el.querySelectorAll('.fill').forEach((f, i) => { f.style.width = `${Math.max(0, Math.min(1, v - i)) * 100}%`; });
  const out = el.parentElement?.querySelector('.stars-val');
  if (out) out.textContent = v ? v.toFixed(1) : '–';
}

// A short pulse along the stars when you give something a higher score.
export function burst(el, v) {
  if (!v || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  el.classList.remove('pulse');
  void el.offsetWidth;
  el.classList.add('pulse');
  clearTimeout(el._pulse);
  el._pulse = setTimeout(() => el.classList.remove('pulse'), 600);
}

// Drag or tap to rate in half steps; tapping the current value clears it.
export function bindRatings(root, commit) {
  const valueAt = (el, x) => {
    const r = (el.querySelector('.cbar-track') || el).getBoundingClientRect();
    const raw = ((x - r.left) / r.width) * 5;
    return Math.min(5, Math.max(0.5, Math.ceil(raw * 2) / 2));
  };
  root.addEventListener('pointerdown', (e) => {
    const el = e.target.closest('[data-rate]');
    if (!el || e.button > 0) return;
    const start = +el.dataset.value || 0;
    let v = valueAt(el, e.clientX);
    let moved = false;
    paintRating(el, v);
    el.classList.add('active');
    const move = (ev) => { moved = true; v = valueAt(el, ev.clientX); paintRating(el, v); };
    const done = (ev) => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', done);
      el.removeEventListener('pointercancel', done);
      el.classList.remove('active');
      if (ev.type === 'pointercancel') { paintRating(el, start); return; }
      if (!moved && v === start) v = 0;
      paintRating(el, v);
      if (v > start && el.classList.contains('stars')) burst(el, v);
      commit(el, v);
    };
    try { el.setPointerCapture(e.pointerId); } catch {}
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', done);
    el.addEventListener('pointercancel', done);
  });
  root.addEventListener('keydown', (e) => {
    const el = e.target.closest?.('[data-rate]');
    if (!el) return;
    const d = { ArrowRight: 0.5, ArrowUp: 0.5, ArrowLeft: -0.5, ArrowDown: -0.5 }[e.key];
    if (d == null) return;
    e.preventDefault();
    const v = Math.min(5, Math.max(0, (+el.dataset.value || 0) + d));
    paintRating(el, v);
    commit(el, v);
  });
}

// ---------- cards ----------

export function hue(s) { let h = 0; for (const c of s || '') h = (h * 31 + c.charCodeAt(0)) % 360; return h; }

export function posterBox(item, size = 'w342', extraClass = '') {
  const t = plain(item.title || item.name);
  const src = safeUrl(sized(item.poster, size));
  return `<div class="poster ${extraClass}" style="--h:${hue(t)}">
    <div class="poster-fallback"><span>${bi(item.title || item.name)}</span></div>
    ${src ? `<img src="${esc(src)}" alt="" loading="lazy" decoding="async">` : ''}
  </div>`;
}

export const myScore = (item) => item.my?.overall || 0;

export function webScore(item) {
  const w = item.web || {};
  if (w.imdb) return `IMDb ${w.imdb}`;
  if (w.tmdb) return `TMDB ${w.tmdb}`;
  if (w.google) return `Google ${w.google}`;
  if (w.openlibrary) return `${w.openlibrary} / 5`;
  return '';
}

// Wishlist titles hide outside scores unless you turned them on.
export const showWeb = (item) => item.status !== 'wishlist' || store.settings().showWishScores;

export function cardSub(item) {
  const parts = [esc(item.year)];
  if (!myScore(item) && showWeb(item) && webScore(item)) parts.push(webScore(item));
  else if (item.genres?.[0]) parts.push(esc(item.genres[0]));
  return parts.filter(Boolean).join('<i class="dot"></i>');
}

function badges(item) {
  const pill = item.status === 'progress' ? `<span class="pill-on"><i></i>${statusLabel(item.kind, 'progress')}</span>` : '';
  const score = myScore(item) ? `<span class="score-chip" aria-label="Your rating ${myScore(item).toFixed(1)}">${icon.star}${myScore(item).toFixed(1)}</span>` : '';
  return pill + score;
}

// Portrait poster: the artwork does the talking; the name slides up on hover.
export function card(item, i = 0) {
  return `<a class="card" href="#/item/${item.id}" data-id="${item.id}" style="--i:${i}" aria-label="${esc(plain(item.title))}">
    <div class="tilt">
      ${posterBox(item)}${badges(item)}
      <div class="cap"><span class="cap-title">${bi(item.title)}</span><span class="cap-sub">${cardSub(item)}</span></div>
    </div>
  </a>`;
}

// Big wide card for things in progress.
export function wideCard(item, i = 0) {
  const bg = safeUrl(item.backdrop ? sized(item.backdrop, 'w780') : sized(item.poster, 'w500'));
  const regular = (item.seasons || []).filter((s) => s.n > 0);
  const seen = regular.filter((s) => s.my?.seen).length;
  const progress = regular.length ? `<div class="wide-progress"><i style="width:${(seen / regular.length) * 100}%"></i></div><span class="wide-note">${seen} of ${regular.length} seasons</span>` : `<span class="wide-note">${statusLabel(item.kind, 'progress')}</span>`;
  return `<a class="wide" href="#/item/${item.id}" data-id="${item.id}" style="--i:${i}">
    <div class="wide-media ${item.backdrop ? '' : 'from-poster'}">${bg ? `<img src="${esc(bg)}" alt="" loading="lazy">` : ''}</div>
    <div class="wide-copy">
      <span class="wide-kind">${kindDot(item.kind)}${KIND[item.kind]}</span>
      <h4>${bi(item.title)}</h4>
      ${progress}
    </div>
    <span class="wide-play">${icon.play}</span>
  </a>`;
}

export function groupCard(g, i = 0) {
  const members = (g.members || []).map(store.get).filter(Boolean);
  const done = members.filter((m) => m.status === 'done');
  const rated = done.filter(myScore);
  const avg = rated.length ? rated.reduce((a, m) => a + myScore(m), 0) / rated.length : 0;
  const layers = members.slice(0, 3);
  return `<a class="gcard" href="#/group/${g.id}" style="--i:${i}">
    <div class="gstack n${layers.length}">
      ${layers.map((m, k) => `<div class="glayer l${k}">${posterBox(m)}</div>`).reverse().join('') || posterBox({ title: g.name })}
    </div>
    <div class="card-title">${bi(g.name)}</div>
    <div class="card-sub">${members.length} title${members.length === 1 ? '' : 's'}<i class="dot"></i>${done.length} finished${avg ? `<i class="dot"></i><span class="gold">★</span>&nbsp;${avg.toFixed(1)}` : ''}</div>
  </a>`;
}

// ---------- sheets (bottom sheet on phones, centred panel on desktop) ----------

export function openSheet(html, { wide = false, onClose } = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'sheet-wrap';
  wrap.innerHTML = `<div class="sheet-backdrop"></div>
    <div class="sheet ${wide ? 'wide' : ''}" role="dialog" aria-modal="true">
      <button class="sheet-close icon-btn" aria-label="Close">${icon.close}</button>
      <div class="sheet-body">${html}</div>
    </div>`;
  document.body.appendChild(wrap);
  document.documentElement.classList.add('locked');
  requestAnimationFrame(() => requestAnimationFrame(() => wrap.classList.add('open')));
  const close = () => {
    if (!wrap.isConnected || wrap.classList.contains('closing')) return;
    wrap.classList.add('closing');
    wrap.classList.remove('open');
    document.removeEventListener('keydown', onKey);
    setTimeout(() => {
      wrap.remove();
      if (!document.querySelector('.sheet-wrap')) document.documentElement.classList.remove('locked');
      onClose?.();
      dispatchEvent(new Event('sheet:closed'));
    }, 380);
  };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);
  wrap.querySelector('.sheet-backdrop').addEventListener('click', close);
  wrap.querySelector('.sheet-close').addEventListener('click', close);
  return { el: wrap.querySelector('.sheet-body'), close };
}

export function confirmSheet(title, message, okLabel = 'Remove') {
  return new Promise((resolve) => {
    let answered = false;
    const s = openSheet(`<div class="confirm">
      <h2>${esc(title)}</h2><p class="muted">${esc(message)}</p>
      <div class="confirm-actions"><button class="btn btn-glass" data-no>Cancel</button><button class="btn btn-danger" data-yes>${esc(okLabel)}</button></div>
    </div>`, { onClose: () => { if (!answered) resolve(false); } });
    s.el.querySelector('[data-no]').onclick = () => { answered = true; resolve(false); s.close(); };
    s.el.querySelector('[data-yes]').onclick = () => { answered = true; resolve(true); s.close(); };
  });
}

// ---------- toast ----------

export function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('in'));
  setTimeout(() => { t.classList.remove('in'); setTimeout(() => t.remove(), 400); }, 2600);
}

export const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

export function segmented(name, options, active, cls = '') {
  return `<div class="seg ${cls}" role="tablist" data-seg="${name}">
    ${options.map(([v, label, extra = '']) => `<button role="tab" data-v="${v}" aria-selected="${v === active}" class="${v === active ? 'on' : ''}" ${extra}>${label}</button>`).join('')}
    <i class="seg-pill"></i>
  </div>`;
}

// Slides the pill under the active segment.
export function placePills(root = document) {
  root.querySelectorAll('.seg').forEach((seg) => {
    const on = seg.querySelector('button.on');
    const pill = seg.querySelector('.seg-pill');
    if (!on || !pill) return;
    pill.style.width = `${on.offsetWidth}px`;
    pill.style.transform = `translateX(${on.offsetLeft}px)`;
  });
}

export function setSeg(seg, v) {
  seg.querySelectorAll('button').forEach((b) => {
    const on = b.dataset.v === v;
    b.classList.toggle('on', on);
    b.setAttribute('aria-selected', on);
  });
  placePills(seg.parentElement);
}

// Resize an uploaded picture so it stays small enough to sync.
export function shrinkImage(file, max = 600) {
  return new Promise((resolve, reject) => {
    if (!/^image\//.test(file.type)) { reject(new Error('Please choose a picture')); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const im = new Image();
      im.onload = () => {
        const k = Math.min(1, max / im.width);
        const c = document.createElement('canvas');
        c.width = Math.round(im.width * k);
        c.height = Math.round(im.height * k);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', 0.82));
      };
      im.onerror = reject;
      im.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Fade pictures in when they arrive; drop broken ones (no inline handlers, so CSP can stay strict).
document.addEventListener('load', (e) => { if (e.target.tagName === 'IMG') e.target.classList.add('ok'); }, true);
document.addEventListener('error', (e) => { if (e.target.tagName === 'IMG') e.target.remove(); }, true);
