// Online look-ups: TMDB (movies & TV), OMDb (IMDb / Rotten Tomatoes scores),
// Open Library + Google Books (books), and OpenCC (Simplified -> Traditional).
import { settings } from './store.js';

const TMDB = 'https://api.themoviedb.org/3';

export const img = (path, size = 'w500') => (path ? `https://image.tmdb.org/t/p/${size}${path}` : '');

// Swap a TMDB image to another size, e.g. a smaller one for grid cards.
export function sized(url, size) {
  return url && url.includes('image.tmdb.org') ? url.replace(/\/t\/p\/[^/]+\//, `/t/p/${size}/`) : url;
}

export class NoKeyError extends Error {}

async function tmdb(path, params = {}) {
  const key = (settings().tmdbKey || '').trim();
  if (!key) throw new NoKeyError('TMDB key missing');
  const u = new URL(TMDB + path);
  const headers = { accept: 'application/json' };
  // TMDB gives two kinds of key: a short "API key" and a long "Read Access Token".
  if (key.length > 40) headers.Authorization = `Bearer ${key}`;
  else u.searchParams.set('api_key', key);
  for (const [k, v] of Object.entries(params)) if (v != null) u.searchParams.set(k, v);
  const r = await fetch(u, { headers });
  if (r.status === 401) throw new Error('TMDB rejected the key — check it in Settings');
  if (!r.ok) throw new Error(`TMDB error ${r.status}`);
  return r.json();
}

export async function testTmdbKey() {
  await tmdb('/configuration');
  return true;
}

// ---------- Chinese text ----------

let openccReady = null;
function loadOpenCC() {
  openccReady ||= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/opencc-js@1.4.2/dist/umd/full.js';
    s.onload = () => resolve(window.OpenCC);
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return openccReady;
}

export async function toTraditional(text, variant = 'hk') {
  if (!text) return text;
  try {
    const OpenCC = await loadOpenCC();
    return OpenCC.Converter({ from: 'cn', to: variant })(text);
  } catch { return text; }
}

// Titles prefer the Hong Kong release name; descriptions prefer Taiwan's
// translation (standard written Chinese), then HK, then converted Simplified.
async function pickChinese(translations, titleField) {
  const list = translations?.translations || [];
  const find = (region) => list.find((t) => t.iso_639_1 === 'zh' && t.iso_3166_1 === region)?.data || {};
  const hk = find('HK'), tw = find('TW'), cn = find('CN'), sg = find('SG');
  let title = hk[titleField] || tw[titleField] || '';
  if (!title && (cn[titleField] || sg[titleField])) title = await toTraditional(cn[titleField] || sg[titleField], 'hk');
  let overview = tw.overview || hk.overview || '';
  if (!overview && (cn.overview || sg.overview)) overview = await toTraditional(cn.overview || sg.overview, 'tw');
  return { title: title.trim(), overview: overview.trim() };
}

const year = (d) => (d ? d.slice(0, 4) : '');
const round1 = (n) => (n ? Math.round(n * 10) / 10 : null);

// ---------- search ----------

export async function searchScreen(query) {
  const data = await tmdb('/search/multi', { query, include_adult: 'false', language: 'en-US' });
  return data.results
    .filter((r) => r.media_type === 'movie' || r.media_type === 'tv')
    .map((r) => ({
      source: { type: 'tmdb', id: r.id },
      kind: r.media_type,
      title: r.title || r.name,
      year: year(r.release_date || r.first_air_date),
      poster: img(r.poster_path, 'w342'),
      overview: r.overview,
      rating: round1(r.vote_average),
    }));
}

// ---------- details ----------

export async function movieDetails(id) {
  const d = await tmdb(`/movie/${id}`, { append_to_response: 'translations,credits', language: 'en-US' });
  const zh = await pickChinese(d.translations, 'title');
  const item = {
    kind: 'movie',
    source: { type: 'tmdb', id: d.id },
    title: { en: d.title, zh: zh.title },
    originalTitle: d.original_title !== d.title ? d.original_title : '',
    overview: { en: d.overview || '', zh: zh.overview },
    tagline: d.tagline || '',
    year: year(d.release_date),
    runtime: d.runtime || null,
    genres: (d.genres || []).map((g) => g.name),
    people: {
      label: 'Directed by',
      names: (d.credits?.crew || []).filter((c) => c.job === 'Director').map((c) => c.name),
      cast: (d.credits?.cast || []).slice(0, 8).map((c) => c.name),
    },
    poster: img(d.poster_path, 'w500'),
    backdrop: img(d.backdrop_path, 'w1280'),
    web: { tmdb: round1(d.vote_average) },
    imdbId: d.imdb_id || '',
  };
  const collection = d.belongs_to_collection
    ? { id: d.belongs_to_collection.id, name: d.belongs_to_collection.name }
    : null;
  await addOmdb(item);
  return { item, collection };
}

export async function tvDetails(id) {
  const d = await tmdb(`/tv/${id}`, { append_to_response: 'translations,aggregate_credits,external_ids', language: 'en-US' });
  const zh = await pickChinese(d.translations, 'name');
  const ended = ['Ended', 'Canceled'].includes(d.status);
  const item = {
    kind: 'tv',
    source: { type: 'tmdb', id: d.id },
    title: { en: d.name, zh: zh.title },
    originalTitle: d.original_name !== d.name ? d.original_name : '',
    overview: { en: d.overview || '', zh: zh.overview },
    tagline: d.tagline || '',
    year: year(d.first_air_date),
    endYear: ended ? year(d.last_air_date) : '',
    airing: d.status,
    runtime: d.episode_run_time?.[0] || null,
    genres: (d.genres || []).map((g) => g.name),
    networks: (d.networks || []).map((n) => n.name),
    people: {
      label: 'Created by',
      names: (d.created_by || []).map((c) => c.name),
      cast: (d.aggregate_credits?.cast || []).slice(0, 8).map((c) => c.name),
    },
    poster: img(d.poster_path, 'w500'),
    backdrop: img(d.backdrop_path, 'w1280'),
    web: { tmdb: round1(d.vote_average) },
    imdbId: d.external_ids?.imdb_id || '',
    seasons: (d.seasons || []).map((s) => ({
      n: s.season_number,
      name: { en: s.name, zh: s.season_number === 0 ? '特別篇' : `第 ${s.season_number} 季` },
      year: year(s.air_date),
      poster: img(s.poster_path, 'w342'),
      episodeCount: s.episode_count,
      overview: { en: s.overview || '' },
      web: { tmdb: round1(s.vote_average) },
      my: {},
    })),
  };
  await addOmdb(item);
  return { item, collection: null };
}

export async function seasonEpisodes(tvId, n) {
  const [en, zh] = await Promise.all([
    tmdb(`/tv/${tvId}/season/${n}`, { language: 'en-US' }),
    tmdb(`/tv/${tvId}/season/${n}`, { language: 'zh-TW' }).catch(() => null),
  ]);
  const zhEp = new Map((zh?.episodes || []).map((e) => [e.episode_number, e]));
  return {
    overview: { en: en.overview || '', zh: zh?.overview || '' },
    episodes: (en.episodes || []).map((e) => {
      const z = zhEp.get(e.episode_number);
      return {
        n: e.episode_number,
        name: { en: e.name, zh: z?.name && z.name !== e.name ? z.name : '' },
        overview: { en: e.overview || '', zh: z?.overview || '' },
        date: e.air_date || '',
        still: img(e.still_path, 'w300'),
        runtime: e.runtime || null,
        web: { tmdb: round1(e.vote_average) },
        my: {},
      };
    }),
  };
}

export async function collectionDetails(id) {
  const [d, tr] = await Promise.all([
    tmdb(`/collection/${id}`, { language: 'en-US' }),
    tmdb(`/collection/${id}/translations`).catch(() => null),
  ]);
  const zh = await pickChinese(tr, 'title');
  return {
    id: d.id,
    name: { en: d.name, zh: zh.title },
    overview: { en: d.overview || '', zh: zh.overview },
    poster: img(d.poster_path, 'w500'),
    backdrop: img(d.backdrop_path, 'w1280'),
    parts: (d.parts || [])
      .filter((p) => p.release_date)
      .sort((a, b) => a.release_date.localeCompare(b.release_date))
      .map((p) => ({ id: p.id, title: p.title, year: year(p.release_date), poster: img(p.poster_path, 'w342') })),
  };
}

async function addOmdb(item) {
  const key = (settings().omdbKey || '').trim();
  if (!key || !item.imdbId) return;
  try {
    const r = await fetch(`https://www.omdbapi.com/?i=${item.imdbId}&apikey=${encodeURIComponent(key)}`);
    const d = await r.json();
    if (d.Response === 'False') return;
    if (d.imdbRating && d.imdbRating !== 'N/A') item.web.imdb = d.imdbRating;
    const rt = (d.Ratings || []).find((x) => x.Source === 'Rotten Tomatoes');
    if (rt) item.web.rt = rt.Value;
  } catch { /* scores are a bonus; ignore failures */ }
}

export const details = (kind, id) => (kind === 'tv' ? tvDetails(id) : movieDetails(id));

// ---------- books ----------

const hasCJK = (s) => /[㐀-鿿]/.test(s || '');

export async function searchBooks(query) {
  const ol = fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=16&fields=key,title,author_name,first_publish_year,cover_i,ratings_average,number_of_pages_median`)
    .then((r) => r.json())
    .then((d) => d.docs.map((b) => ({
      source: { type: 'openlibrary', id: b.key },
      kind: 'book',
      title: b.title,
      authors: b.author_name || [],
      year: b.first_publish_year ? String(b.first_publish_year) : '',
      poster: b.cover_i ? `https://covers.openlibrary.org/b/id/${b.cover_i}-L.jpg` : '',
      rating: b.ratings_average ? round1(b.ratings_average) : null,
      pages: b.number_of_pages_median || null,
    })))
    .catch(() => []);
  const gb = fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=12&printType=books`)
    .then((r) => (r.ok ? r.json() : { items: [] }))
    .then((d) => (d.items || []).map(googleBook))
    .catch(() => []);
  const [a, b] = await Promise.all([ol, gb]);
  // Chinese queries: Google Books usually has better Chinese coverage, list it first.
  return hasCJK(query) ? [...b, ...a] : [...a, ...b];
}

function googleBook(v) {
  const i = v.volumeInfo || {};
  let cover = i.imageLinks?.thumbnail || i.imageLinks?.smallThumbnail || '';
  if (cover) cover = cover.replace('http:', 'https:').replace('&edge=curl', '') + '&fife=w600';
  return {
    source: { type: 'googlebooks', id: v.id },
    kind: 'book',
    title: i.subtitle ? `${i.title}: ${i.subtitle}` : i.title,
    authors: i.authors || [],
    year: year(i.publishedDate),
    poster: cover,
    rating: i.averageRating || null,
    pages: i.pageCount || null,
    description: (i.description || '').replace(/<[^>]+>/g, ''),
    genres: i.categories || [],
    lang: i.language,
  };
}

export async function bookDetails(result) {
  const item = {
    kind: 'book',
    source: result.source,
    title: { en: result.title, zh: hasCJK(result.title) ? await toTraditional(result.title, 'hk') : '' },
    overview: { en: '', zh: '' },
    year: result.year,
    pages: result.pages,
    genres: result.genres || [],
    people: { label: 'Written by', names: result.authors, cast: [] },
    poster: result.poster,
    backdrop: '',
    web: {},
  };
  if (result.source.type === 'openlibrary') {
    if (result.rating) item.web.openlibrary = result.rating;
    try {
      const w = await fetch(`https://openlibrary.org${result.source.id}.json`).then((r) => r.json());
      const desc = typeof w.description === 'string' ? w.description : w.description?.value || '';
      item.overview.en = desc.replace(/\(\[source\]\[\d+\]\)|\[\d+\]:.*$/gms, '').trim();
      if (!item.genres.length) item.genres = (w.subjects || []).slice(0, 4);
    } catch { /* description is optional */ }
  } else {
    if (result.rating) item.web.google = result.rating;
    if (hasCJK(result.description)) item.overview.zh = await toTraditional(result.description, 'tw');
    else item.overview.en = result.description || '';
  }
  return { item, collection: null };
}
