// Shared UI building blocks: escaping, bilingual text, stars, cards, sheets, toasts.
import { sized } from './api.js';
import * as store from './store.js';

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

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

export function statusLabel(kind, s) {
  const book = kind === 'book';
  return {
    wishlist: book ? 'Want to Read' : 'Wishlist',
    progress: book ? 'Reading' : 'Watching',
    done: book ? 'Read' : 'Watched',
  }[s];
}

export const icon = {
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
  right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.6-6.4L21 8"/><path d="M21 3v5h-5"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16v4z"/></svg>',
  stack: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><rect x="3" y="7" width="13" height="14" rx="2"/><path d="M7 4h11a2 2 0 0 1 2 2v12"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>',
  film: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2.5"/><path d="M7 3v18M17 3v18M3 8h4M3 16h4M17 8h4M17 16h4M3 12h18"/></svg>',
  tv: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="round"><rect x="2.5" y="5" width="19" height="13" rx="2.5"/><path d="M8 21h8M8 1.8 12 5l4-3.2"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H20v16H5.5A1.5 1.5 0 0 0 4 20.5z"/><path d="M4 20.5A1.5 1.5 0 0 0 5.5 22H20v-3"/></svg>',
  comment: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 21 12z"/></svg>',
  up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>',
  down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
};

// ---------- stars ----------

const STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.4l2.95 6.2 6.8.83-5.02 4.68 1.32 6.74L12 17.5l-6.05 3.35 1.32-6.74L2.25 9.43l6.8-.83z"/></svg>';

export function stars(value, { attrs = '', size = '', label = 'Rating' } = {}) {
  const v = +value || 0;
  let h = '';
  for (let i = 0; i < 5; i++) {
    const f = Math.max(0, Math.min(1, v - i)) * 100;
    h += `<span class="star">${STAR}<span class="fill" style="width:${f}%">${STAR}</span></span>`;
  }
  const editable = attrs.includes('data-rate');
  const a11y = editable ? `role="slider" tabindex="0" aria-label="${esc(label)}" aria-valuemin="0" aria-valuemax="5" aria-valuenow="${v}"` : `aria-label="${v} out of 5 stars"`;
  return `<div class="stars ${size}" data-value="${v}" ${a11y} ${attrs}>${h}</div>`;
}

export function paintStars(el, v) {
  el.dataset.value = v;
  el.setAttribute('aria-valuenow', v);
  el.querySelectorAll('.fill').forEach((f, i) => { f.style.width = `${Math.max(0, Math.min(1, v - i)) * 100}%`; });
  const out = el.parentElement?.querySelector('.stars-val');
  if (out) out.textContent = v ? v.toFixed(1) : '–';
}

// Drag or tap to rate in half stars. Tapping the current value clears it.
export function bindStars(root, commit) {
  const valueAt = (el, x) => {
    const r = el.getBoundingClientRect();
    const raw = ((x - r.left) / r.width) * 5;
    return Math.min(5, Math.max(0.5, Math.ceil(raw * 2) / 2));
  };
  root.addEventListener('pointerdown', (e) => {
    const el = e.target.closest('.stars[data-rate]');
    if (!el || e.button > 0) return;
    const start = +el.dataset.value || 0;
    let v = valueAt(el, e.clientX);
    let moved = false;
    paintStars(el, v);
    el.classList.add('active');
    const move = (ev) => { moved = true; v = valueAt(el, ev.clientX); paintStars(el, v); };
    const done = (ev) => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', done);
      el.removeEventListener('pointercancel', done);
      el.classList.remove('active');
      if (ev.type === 'pointercancel') { paintStars(el, start); return; }
      if (!moved && v === start) v = 0;
      paintStars(el, v);
      el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }], { duration: 260, easing: 'cubic-bezier(.2,.8,.2,1)' });
      commit(el, v);
    };
    try { el.setPointerCapture(e.pointerId); } catch {}
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', done);
    el.addEventListener('pointercancel', done);
  });
  root.addEventListener('keydown', (e) => {
    const el = e.target.closest?.('.stars[data-rate]');
    if (!el) return;
    const d = { ArrowRight: 0.5, ArrowUp: 0.5, ArrowLeft: -0.5, ArrowDown: -0.5 }[e.key];
    if (d == null) return;
    e.preventDefault();
    const v = Math.min(5, Math.max(0, (+el.dataset.value || 0) + d));
    paintStars(el, v);
    commit(el, v);
  });
}

// ---------- cards ----------

function hue(s) { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360; return h; }

export function posterBox(item, size = 'w342', extraClass = '') {
  const t = plain(item.title || item.name);
  const src = sized(item.poster, size);
  return `<div class="poster ${extraClass}" style="--h:${hue(t)}">
    <div class="poster-fallback"><span>${bi(item.title || item.name)}</span></div>
    ${src ? `<img src="${esc(src)}" alt="" loading="lazy" decoding="async" onload="this.classList.add('ok')" onerror="this.remove()">` : ''}
  </div>`;
}

export function myScore(item) { return item.my?.overall || 0; }

export function webScore(item) {
  const w = item.web || {};
  if (w.imdb) return `IMDb ${w.imdb}`;
  if (w.tmdb) return `TMDB ${w.tmdb}`;
  if (w.google) return `Google ${w.google}`;
  if (w.openlibrary) return `${w.openlibrary} / 5`;
  return '';
}

export function card(item, i = 0) {
  const sub = [item.year, item.status === 'done' && myScore(item) ? `<span class="gold">★ ${myScore(item).toFixed(1)}</span>` : webScore(item)]
    .filter(Boolean).join(' · ');
  const pill = item.status === 'progress' ? `<span class="pill-on">${statusLabel(item.kind, 'progress')}</span>` : '';
  return `<a class="card" href="#/item/${item.id}" data-id="${item.id}" style="--i:${i}">
    ${posterBox(item)}${pill}
    <div class="card-title">${bi(item.title)}</div>
    <div class="card-sub">${sub}</div>
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
    <div class="card-sub">${members.length} title${members.length === 1 ? '' : 's'} · ${done.length} finished${avg ? ` · <span class="gold">★ ${avg.toFixed(1)}</span>` : ''}</div>
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

export function segmented(name, options, active) {
  return `<div class="seg" role="tablist" data-seg="${name}">
    ${options.map(([v, label]) => `<button role="tab" data-v="${v}" aria-selected="${v === active}" class="${v === active ? 'on' : ''}">${label}</button>`).join('')}
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
