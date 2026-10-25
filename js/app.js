// Router, navigation, page transitions and scroll effects.
import * as store from './store.js';
import * as sync from './sync.js';
import { renderHome, renderLibrary, renderCollections, renderGroup } from './views.js';
import { renderDetail } from './detail.js';
import { renderSettings } from './settings.js';
import { openAdd } from './add.js';
import { loadSamples } from './samples.js';
import { placePills, toast } from './ui.js';

const view = document.getElementById('view');
const html = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
history.scrollRestoration = 'manual';

// ---------- language (titles & descriptions only; UI stays English) ----------

let lang = 'en';
try { lang = localStorage.getItem('shelf.lang') || 'en'; } catch {}
html.dataset.lang = lang;
document.querySelectorAll('[data-action="lang"]').forEach((b) => b.setAttribute('aria-pressed', lang === 'zh'));

function toggleLang() {
  lang = lang === 'en' ? 'zh' : 'en';
  try { localStorage.setItem('shelf.lang', lang); } catch {}
  const apply = () => {
    html.dataset.lang = lang;
    document.querySelectorAll('[data-action="lang"]').forEach((b) => b.setAttribute('aria-pressed', lang === 'zh'));
  };
  if (document.startViewTransition && !reduced) {
    html.classList.add('vt-fade');
    const vt = document.startViewTransition(apply);
    vt.ready.catch(() => {});
    vt.finished.finally(() => html.classList.remove('vt-fade'));
  } else apply();
}

// ---------- routing ----------

const scrollMemory = new Map();
let current = '';
let cleanup = null;
let fromDetailId = null;

function parse(hash) {
  const [path, qs] = (hash.replace(/^#/, '') || '/').split('?');
  const parts = path.split('/').filter(Boolean);
  return { parts, query: new URLSearchParams(qs || ''), key: path };
}

function render(hash, { keepScroll = false } = {}) {
  const { parts, query } = parse(hash);
  cleanup?.();
  cleanup = null;
  const [a, b] = parts;
  let navKey = 'home';
  html.classList.toggle('on-home', !a);
  if (!a) cleanup = renderHome(view);
  else if (a === 'lib') {
    const kind = ['movie', 'tv', 'book'].includes(b) ? b : 'all';
    cleanup = renderLibrary(view, kind, query);
    navKey = kind;
  }
  else if (a === 'item') { renderDetail(view, b); navKey = ''; }
  else if (a === 'collections') { renderCollections(view); navKey = 'collections'; }
  else if (a === 'group') { renderGroup(view, b); navKey = 'collections'; }
  else if (a === 'settings') { cleanup = renderSettings(view); navKey = 'settings'; }
  else { location.replace('#/'); return; }

  document.querySelectorAll('[data-nav]').forEach((n) => n.classList.toggle('active', n.dataset.nav === navKey));
  placeBlob();
  if (!keepScroll) {
    const y = a === 'item' || a === 'group' ? 0 : scrollMemory.get(hash) || 0;
    window.scrollTo(0, y);
  }
  placePills(view);
  reveal(view);
  onScroll();
}

function navigate() {
  const next = location.hash || '#/';
  if (next === current) return;
  scrollMemory.set(current, window.scrollY);
  const leaving = parse(current);
  fromDetailId = leaving.parts[0] === 'item' ? leaving.parts[1] : null;
  current = next;

  let ran = false;
  const update = () => {
    if (ran) return;
    ran = true;
    clearNames();
    render(next);
    // Returning from a title: fly its poster back into the card it came from.
    if (fromDetailId) {
      const p = [...view.querySelectorAll(`.card[data-id="${fromDetailId}"] .poster, .member-link[data-id="${fromDetailId}"] .poster`)].find(inViewport);
      if (p) p.style.viewTransitionName = 'poster';
    }
  };
  if (document.startViewTransition && !reduced && current) {
    const vt = document.startViewTransition(update);
    vt.ready.catch(() => {}); // skipped animations (hidden tab etc.) are fine
    vt.finished.finally(clearNames);
    // Never let a stalled animation keep the old page on screen.
    setTimeout(() => { if (!ran) { vt.skipTransition(); update(); } }, 600);
  } else update();
}

function clearNames() {
  document.querySelectorAll('.poster[style*="view-transition-name"]').forEach((el) => { el.style.viewTransitionName = ''; });
}

const inViewport = (el) => {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
};

// Before navigating from a poster card, name it so it morphs into the big poster.
document.addEventListener('click', (e) => {
  const link = e.target.closest('a.card, a.member-link, a.wide, a.pick-poster');
  if (!link) return;
  clearNames();
  document.querySelectorAll('.detail-poster').forEach((d) => { d.style.viewTransitionName = 'none'; });
  const p = link.querySelector('.poster');
  if (p) p.style.viewTransitionName = 'poster';
}, true);

// ---------- global actions ----------

let navCount = 0;
addEventListener('hashchange', () => { navCount++; });
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-back]') && navCount > 0) { e.preventDefault(); history.back(); return; }
  const a = e.target.closest('[data-action]');
  if (!a) return;
  const act = a.dataset.action;
  if (act === 'add') openAdd();
  if (act === 'lang') toggleLang();
  if (act === 'samples') { loadSamples(); toast('Sample titles added — remove them anytime in Settings'); render(current, { keepScroll: false }); }
});

document.addEventListener('keydown', (e) => {
  if (e.target.matches('input, textarea, select') || e.metaKey || e.ctrlKey) return;
  if (e.key === 'n' && !document.querySelector('.sheet-wrap')) { e.preventDefault(); openAdd(); }
});

// Re-draw when data changes elsewhere (another device, or a list edit),
// but never while you're typing.
let pending = false;
function refreshView() {
  pending = false;
  const y = window.scrollY;
  render(current, { keepScroll: true });
  window.scrollTo(0, y);
}
store.onChange(() => {
  if (document.querySelector('.sheet-wrap')) { pending = true; return; }
  if (document.activeElement?.matches('textarea, input')) return;
  refreshView();
});
addEventListener('sheet:closed', () => { if (pending && !document.querySelector('.sheet-wrap')) refreshView(); });

// ---------- scroll effects ----------

const nav = document.querySelector('.nav');
let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    const y = window.scrollY;
    nav.classList.toggle('solid', y > 24 || !html.classList.contains('on-home'));
    if (reduced) return;
    const stage = view.querySelector('[data-stage]');
    if (stage) stage.style.setProperty('--p', Math.min(1, Math.max(0, y / stage.offsetHeight)).toFixed(4));
    view.querySelectorAll('[data-scrub]').forEach((el) => {
      const r = el.getBoundingClientRect();
      const start = innerHeight * 0.9;
      const end = innerHeight * 0.3;
      const prog = Math.min(1, Math.max(0, (start - r.top) / (start - end)));
      const ws = el.querySelectorAll('.w');
      const lit = Math.round(prog * ws.length);
      ws.forEach((w, i) => w.classList.toggle('lit', i < lit));
    });
  });
}
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', () => { placePills(document); placeBlob(); });

// The glowing pill in the navigation glides to the current section.
function placeBlob() {
  const pill = document.querySelector('.nav-pill');
  const blob = pill?.querySelector('.nav-blob');
  if (!blob) return;
  const on = pill.querySelector('a.active');
  if (!on) { blob.style.opacity = '0'; return; }
  blob.style.opacity = '1';
  blob.style.width = `${on.offsetWidth}px`;
  blob.style.transform = `translateX(${on.offsetLeft}px)`;
}
document.fonts?.ready.then(placeBlob);
if (window.ResizeObserver) new ResizeObserver(placeBlob).observe(document.querySelector('.nav-pill'));

// Posters lean towards the pointer.
if (matchMedia('(hover: hover)').matches && !reduced) {
  document.addEventListener('pointermove', (e) => {
    const t = e.target.closest?.('.card .tilt');
    if (!t) return;
    const r = t.getBoundingClientRect();
    t.style.setProperty('--rx', `${((e.clientY - r.top) / r.height - 0.5) * -10}deg`);
    t.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 12}deg`);
  }, { passive: true });
  document.addEventListener('pointerout', (e) => {
    const t = e.target.closest?.('.card .tilt');
    if (t && !t.contains(e.relatedTarget)) { t.style.removeProperty('--rx'); t.style.removeProperty('--ry'); }
  });
}

// Fade-up elements as they enter the screen; count numbers up.
const io = new IntersectionObserver((entries) => {
  for (const en of entries) {
    if (!en.isIntersecting) continue;
    en.target.classList.add('in');
    io.unobserve(en.target);
    en.target.querySelectorAll('[data-count]').forEach(countUp);
  }
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

function reveal(root) {
  root.querySelectorAll('.reveal:not(.in)').forEach((el) => (reduced ? el.classList.add('in') : io.observe(el)));
  if (reduced) root.querySelectorAll('[data-count]').forEach((el) => { el.textContent = el.dataset.count; });
}
window.__reveal = reveal;

function countUp(el) {
  const target = +el.dataset.count;
  const t0 = performance.now();
  const dur = 1400;
  const step = (t) => {
    const k = Math.min(1, (t - t0) / dur);
    el.textContent = Math.round(target * (1 - Math.pow(1 - k, 4))).toLocaleString();
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ---------- sync indicator ----------

sync.onStatus(({ status }) => {
  document.querySelectorAll('.sync-dot').forEach((d) => { d.dataset.state = status; d.title = `Cloud sync: ${status}`; });
});

// ---------- boot ----------

addEventListener('hashchange', navigate);
current = location.hash || '#/';
render(current);
requestAnimationFrame(() => html.classList.add('ready'));
sync.initCloud();

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
