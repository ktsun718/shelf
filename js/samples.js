// Sample titles so the app looks alive before you add your own.
// They carry real TMDB ids, so "Refresh info" works once a TMDB key is set.
import * as store from './store.js';

const P = (p, s = 'w500') => `https://image.tmdb.org/t/p/${s}/${p}.jpg`;
const B = (p) => P(p, 'w1280');
const seasons = (count, zhCounts = {}) =>
  Array.from({ length: count }, (_, i) => ({
    n: i + 1,
    name: { en: `Season ${i + 1}`, zh: `第 ${i + 1} 季` },
    episodeCount: zhCounts[i + 1] || null,
    overview: { en: '' },
    my: {},
  }));

const day = (n) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);

export function loadSamples() {
  const s = (o) => ({ sample: true, people: { names: [], cast: [] }, genres: [], web: {}, my: {}, ...o });
  const items = [
    s({ id: 'smp_tdk', kind: 'movie', status: 'done', source: { type: 'tmdb', id: 155 },
      title: { en: 'The Dark Knight', zh: '蝙蝠俠：黑夜之神' }, year: '2008', runtime: 152,
      genres: ['Action', 'Crime', 'Drama'], people: { label: 'Directed by', names: ['Christopher Nolan'], cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'] },
      overview: { en: 'Batman, Lieutenant Gordon and District Attorney Harvey Dent take on organised crime in Gotham — until a chaotic criminal calling himself the Joker pushes the city, and Batman, to the edge.', zh: '蝙蝠俠聯同戈登警長及檢察官哈維．丹特打擊高譚市的有組織罪案，卻遇上自稱「小丑」的瘋狂罪犯，令整座城市與蝙蝠俠都被逼到崩潰邊緣。' },
      poster: P('qJ2tW6WMUDux911r6m7haRef0WH'), backdrop: B('dqK9Hag1054tghRQSqLSfrkvQnA'), web: { imdb: '9.0', tmdb: 8.5 },
      my: { overall: 5, cats: { Story: 5, Acting: 5, Visuals: 4.5, Music: 5, Pacing: 4.5 }, comment: 'Heath Ledger is unforgettable. The interrogation scene still gives me chills.', date: day(40) } }),
    s({ id: 'smp_tdkr', kind: 'movie', status: 'done', source: { type: 'tmdb', id: 49026 },
      title: { en: 'The Dark Knight Rises', zh: '蝙蝠俠：夜神起義' }, year: '2012', runtime: 165,
      genres: ['Action', 'Crime', 'Drama'], people: { label: 'Directed by', names: ['Christopher Nolan'], cast: ['Christian Bale', 'Tom Hardy', 'Anne Hathaway'] },
      overview: { en: 'Eight years after the Joker, a masked revolutionary named Bane forces a retired Bruce Wayne to return as Batman.', zh: '小丑事件八年後，蒙面革命者班恩橫空出世，逼使隱退的布魯斯．韋恩再次披上蝙蝠戰衣。' },
      poster: P('hr0L2aueqlP2BYUblTTjmtn0hw4'), web: { imdb: '8.4', tmdb: 7.8 },
      my: { overall: 4, cats: { Story: 3.5, Acting: 4.5, Visuals: 4.5, Music: 4.5, Pacing: 3.5 }, comment: 'A grand ending, a bit long in the middle.', date: day(32) } }),
    s({ id: 'smp_bb', kind: 'movie', status: 'done', source: { type: 'tmdb', id: 272 },
      title: { en: 'Batman Begins', zh: '蝙蝠俠：俠影之謎' }, year: '2005', runtime: 140,
      genres: ['Action', 'Crime', 'Drama'], people: { label: 'Directed by', names: ['Christopher Nolan'], cast: ['Christian Bale', 'Michael Caine', 'Liam Neeson'] },
      overview: { en: 'Driven by the murder of his parents, Bruce Wayne trains across the world and returns to Gotham to fight the corruption swallowing his city.', zh: '父母遇害後，布魯斯．韋恩遠赴世界各地修練，重返高譚市對抗吞噬城市的腐敗勢力。' },
      poster: P('8RW2runSEc34IwKN2D1aPcJd2UL'), web: { imdb: '8.2', tmdb: 7.7 },
      my: { overall: 4, cats: { Story: 4, Acting: 4, Visuals: 4, Music: 4, Pacing: 4 }, date: day(45) } }),
    s({ id: 'smp_inception', kind: 'movie', status: 'done', source: { type: 'tmdb', id: 27205 },
      title: { en: 'Inception', zh: '潛行凶間' }, year: '2010', runtime: 148,
      genres: ['Action', 'Science Fiction', 'Adventure'], people: { label: 'Directed by', names: ['Christopher Nolan'], cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'] },
      overview: { en: 'A thief who steals secrets from inside dreams is offered one last job: plant an idea in someone’s mind instead.', zh: '一名潛入夢境盜取機密的神偷，接下最後一宗任務：不是偷取，而是在目標腦中植入一個念頭。' },
      poster: P('9gk7adHYeDvHkCSEqAvQNLV5Uge'), backdrop: B('s3TBrRGB1iav7gFOCNx3H31MoES'), web: { imdb: '8.8', tmdb: 8.4 },
      my: { overall: 4.5, cats: { Story: 5, Acting: 4, Visuals: 5, Music: 5, Pacing: 4 }, comment: 'That spinning top.', date: day(12) } }),
    s({ id: 'smp_interstellar', kind: 'movie', status: 'progress', source: { type: 'tmdb', id: 157336 },
      title: { en: 'Interstellar', zh: '星際啓示錄' }, year: '2014', runtime: 169,
      genres: ['Adventure', 'Drama', 'Science Fiction'], people: { label: 'Directed by', names: ['Christopher Nolan'], cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'] },
      overview: { en: 'With Earth dying, a former pilot leaves his children behind to lead a mission through a wormhole in search of a new home for humanity.', zh: '地球日漸衰亡，一名前太空機師告別子女，帶領團隊穿越蟲洞，為人類尋找新家園。' },
      poster: P('gEU2QniE6E77NI6lCU6MxlNBvIx'), backdrop: B('xJHokMbljvjADYdit5fK5VQsXEG'), web: { imdb: '8.7', tmdb: 8.5 } }),
    s({ id: 'smp_dune1', kind: 'movie', status: 'done', source: { type: 'tmdb', id: 438631 },
      title: { en: 'Dune', zh: '沙丘瀚戰' }, year: '2021', runtime: 155,
      genres: ['Science Fiction', 'Adventure'], people: { label: 'Directed by', names: ['Denis Villeneuve'], cast: ['Timothée Chalamet', 'Rebecca Ferguson', 'Zendaya'] },
      overview: { en: 'Paul Atreides travels to Arrakis, the most dangerous planet in the universe, where his family is betrayed in a war over its precious spice.', zh: '保羅．亞崔迪隨家族前往宇宙中最危險的星球厄拉科斯，卻在爭奪珍貴香料的戰爭中遭到背叛。' },
      poster: P('d5NXSklXo0qyIYkgV94XAgMIckC'), web: { imdb: '8.0', tmdb: 7.8 },
      my: { overall: 4.5, cats: { Story: 4, Acting: 4.5, Visuals: 5, Music: 5, Pacing: 3.5 }, comment: 'The sound design in the cinema was unreal.', date: day(70) } }),
    s({ id: 'smp_dune2', kind: 'movie', status: 'wishlist', source: { type: 'tmdb', id: 693134 },
      title: { en: 'Dune: Part Two', zh: '沙丘瀚戰：第二章' }, year: '2024', runtime: 167,
      genres: ['Science Fiction', 'Adventure'], people: { label: 'Directed by', names: ['Denis Villeneuve'], cast: ['Timothée Chalamet', 'Zendaya', 'Austin Butler'] },
      overview: { en: 'Paul unites with Chani and the Fremen on a path of revenge against those who destroyed his family.', zh: '保羅與琪妮及弗瑞曼人並肩作戰，向摧毀他家族的人展開復仇。' },
      poster: P('1pdfLvkbY9ohJlCjQH2CZjjYVvJ'), backdrop: B('xOMo8BRK7PfcJv9JCnx7s5hj0PX'), web: { imdb: '8.5', tmdb: 8.1 } }),
    s({ id: 'smp_parasite', kind: 'movie', status: 'wishlist', source: { type: 'tmdb', id: 496243 },
      title: { en: 'Parasite', zh: '上流寄生族' }, year: '2019', runtime: 133,
      genres: ['Comedy', 'Thriller', 'Drama'], people: { label: 'Directed by', names: ['Bong Joon Ho'], cast: ['Song Kang-ho', 'Choi Woo-shik', 'Park So-dam'] },
      overview: { en: 'A poor family schemes its way into working for a wealthy household, until an unexpected discovery changes everything.', zh: '一個貧窮家庭設法逐一混入富裕人家工作，直至一個意外發現令一切失控。' },
      poster: P('7IiTTgloJzvGI1TAYymCfbfl3vT'), web: { imdb: '8.5', tmdb: 8.5 } }),
    s({ id: 'smp_spirited', kind: 'movie', status: 'wishlist', source: { type: 'tmdb', id: 129 },
      title: { en: 'Spirited Away', zh: '千與千尋' }, year: '2001', runtime: 125,
      genres: ['Animation', 'Family', 'Fantasy'], people: { label: 'Directed by', names: ['Hayao Miyazaki'], cast: [] },
      overview: { en: 'A ten-year-old girl wanders into a world of spirits and must work in a bathhouse to free herself and her parents.', zh: '十歲女孩千尋誤闖神靈世界，必須在澡堂工作，才能救回自己和變成豬的父母。' },
      poster: P('39wmItIWsg5sZMyRUHLkWBcuVCM'), web: { imdb: '8.6', tmdb: 8.5 } }),
    s({ id: 'smp_mood', kind: 'movie', status: 'wishlist', source: { type: 'tmdb', id: 843 },
      title: { en: 'In the Mood for Love', zh: '花樣年華' }, year: '2000', runtime: 98,
      genres: ['Drama', 'Romance'], people: { label: 'Directed by', names: ['Wong Kar-wai'], cast: ['Tony Leung Chiu-wai', 'Maggie Cheung'] },
      overview: { en: 'Hong Kong, 1962. Two neighbours discover their spouses are having an affair, and slowly grow close themselves.', zh: '一九六二年的香港，一對鄰居發現各自的伴侶有染，兩人在壓抑中漸生情愫。' },
      poster: P('iYypPT4bhqXfq1b6EnmxvRt6b2Y'), web: { imdb: '8.1', tmdb: 8.1 } }),

    s({ id: 'smp_breakingbad', kind: 'tv', status: 'done', source: { type: 'tmdb', id: 1396 },
      title: { en: 'Breaking Bad', zh: '絕命毒師' }, year: '2008', endYear: '2013', runtime: 47,
      genres: ['Drama', 'Crime'], people: { label: 'Created by', names: ['Vince Gilligan'], cast: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn'] },
      overview: { en: 'A high-school chemistry teacher diagnosed with cancer turns to making meth to secure his family’s future.', zh: '一名確診癌症的高中化學老師，為了給家人留下保障，走上製毒之路。' },
      poster: P('ggFHVNu6YYI5L9pCfOacjizRGt'), backdrop: B('tsRy63Mu5cu8etL1X7ZLyf7UP1M'), web: { imdb: '9.5', tmdb: 8.9 },
      seasons: seasons(5, { 1: 7, 2: 13, 3: 13, 4: 13, 5: 16 }),
      my: { overall: 5, cats: { Story: 5, Characters: 5, Acting: 5, Visuals: 4.5, Pacing: 4.5 }, comment: 'Best TV show I have ever seen.', date: day(120) } }),
    s({ id: 'smp_bcs', kind: 'tv', status: 'progress', source: { type: 'tmdb', id: 60059 },
      title: { en: 'Better Call Saul', zh: '絕命律師' }, year: '2015', endYear: '2022', runtime: 46,
      genres: ['Crime', 'Drama'], people: { label: 'Created by', names: ['Vince Gilligan', 'Peter Gould'], cast: ['Bob Odenkirk', 'Rhea Seehorn', 'Jonathan Banks'] },
      overview: { en: 'Six years before Breaking Bad, small-time lawyer Jimmy McGill slowly becomes the morally flexible Saul Goodman.', zh: '《絕命毒師》六年前，落魄律師占美．麥基爾一步步蛻變成不擇手段的索爾．古德曼。' },
      poster: P('fC2HDm5t0kHl7mTm7jxMR31b7by'), web: { imdb: '9.0', tmdb: 8.7 },
      seasons: seasons(6, { 1: 10, 2: 10, 3: 10, 4: 10, 5: 10, 6: 13 }) }),
    s({ id: 'smp_tlou', kind: 'tv', status: 'progress', source: { type: 'tmdb', id: 100088 },
      title: { en: 'The Last of Us', zh: '最後生還者' }, year: '2023', runtime: 55,
      genres: ['Drama', 'Sci-Fi & Fantasy'], people: { label: 'Created by', names: ['Craig Mazin', 'Neil Druckmann'], cast: ['Pedro Pascal', 'Bella Ramsey'] },
      overview: { en: 'Twenty years after a fungal pandemic, a hardened survivor is hired to smuggle a 14-year-old girl across a ruined America.', zh: '真菌疫症爆發二十年後，一名飽歷風霜的倖存者受託護送一名十四歲少女，橫越滿目瘡痍的美國。' },
      poster: P('uKvVjHNqB5VmOrdxqAt2F7J78ED'), backdrop: B('uDgy6hyPd82kOHh6I95FLtLnj6p'), web: { imdb: '8.6', tmdb: 8.6 },
      seasons: seasons(2, { 1: 9, 2: 7 }) }),
    s({ id: 'smp_severance', kind: 'tv', status: 'wishlist', source: { type: 'tmdb', id: 95396 },
      title: { en: 'Severance', zh: '人生切割術' }, year: '2022', runtime: 50,
      genres: ['Drama', 'Mystery', 'Sci-Fi & Fantasy'], people: { label: 'Created by', names: ['Dan Erickson'], cast: ['Adam Scott', 'Britt Lower', 'Patricia Arquette'] },
      overview: { en: 'Employees at Lumon have their memories surgically split between work and home life — until one of them starts asking questions.', zh: '盧蒙公司的員工透過手術把工作與私人生活的記憶完全分割，直至其中一人開始追尋真相。' },
      poster: P('lFf6LLrQjYldcZItzOkGmMMigP7'), web: { imdb: '8.7', tmdb: 8.4 }, seasons: seasons(2) }),
    s({ id: 'smp_shogun', kind: 'tv', status: 'wishlist', source: { type: 'tmdb', id: 126308 },
      title: { en: 'Shōgun', zh: '幕府將軍' }, year: '2024', runtime: 60,
      genres: ['Drama', 'War & Politics'], people: { label: 'Created by', names: ['Rachel Kondo', 'Justin Marks'], cast: ['Hiroyuki Sanada', 'Cosmo Jarvis', 'Anna Sawai'] },
      overview: { en: 'In feudal Japan, 1600, a shipwrecked English sailor is drawn into a deadly power struggle between rival lords.', zh: '一六〇〇年的日本，一名英國水手遇上船難，被捲入群雄爭霸的權力鬥爭之中。' },
      poster: P('7O4iVfOMQmdCSxhOg1WnzG1AgYT'), web: { imdb: '8.6', tmdb: 8.5 }, seasons: seasons(1, { 1: 10 }) }),

    s({ id: 'smp_dunebook', kind: 'book', status: 'done', source: { type: 'openlibrary', id: '/works/OL893414W' },
      title: { en: 'Dune', zh: '沙丘' }, year: '1965', pages: 604, genres: ['Science fiction'],
      people: { label: 'Written by', names: ['Frank Herbert'], cast: [] },
      overview: { en: 'The novel that started it all: politics, religion and ecology collide on the desert planet Arrakis.', zh: '一切的起點：政治、宗教與生態在沙漠星球厄拉科斯上激烈碰撞。' },
      poster: 'https://covers.openlibrary.org/b/id/11481354-L.jpg', web: { openlibrary: 4.3 },
      my: { overall: 4.5, cats: { Plot: 4.5, Characters: 4, Writing: 4.5, Pacing: 3.5, Ideas: 5 }, comment: 'Dense at first, then impossible to put down.', date: day(200) } }),
    s({ id: 'smp_threebody', kind: 'book', status: 'progress', source: { type: 'openlibrary', id: '/works/OL17267881W' },
      title: { en: 'The Three-Body Problem', zh: '三體' }, year: '2008', genres: ['Science fiction'],
      people: { label: 'Written by', names: ['Liu Cixin'], cast: [] },
      overview: { en: 'A secret military project sends signals into space — and an alien civilisation on the brink of destruction answers.', zh: '一項秘密軍事計劃向太空發出訊號，一個瀕臨毀滅的外星文明竟然作出回應。' },
      poster: 'https://covers.openlibrary.org/b/id/9157544-L.jpg', web: { openlibrary: 3.9 } }),
  ];

  // Season reviews for Breaking Bad and progress on Better Call Saul.
  const bb = items.find((i) => i.id === 'smp_breakingbad');
  [4, 4.5, 4.5, 5, 5].forEach((v, i) => { bb.seasons[i].my = { overall: v, seen: true }; });
  bb.seasons[4].my.comment = 'Ozymandias. Enough said.';
  const bcs = items.find((i) => i.id === 'smp_bcs');
  [4, 4.5, 4.5].forEach((v, i) => { bcs.seasons[i].my = { overall: v, seen: true }; });

  const groups = [
    { id: 'smp_g_tdk', kind: 'group', sample: true, name: { en: 'The Dark Knight Trilogy', zh: '蝙蝠俠三部曲' },
      overview: { en: 'Christopher Nolan’s Batman.', zh: '基斯杜化．路蘭執導的蝙蝠俠系列。' },
      source: { type: 'tmdb-collection', id: 263 }, members: ['smp_bb', 'smp_tdk', 'smp_tdkr'] },
    { id: 'smp_g_dune', kind: 'group', sample: true, name: { en: 'Dune', zh: '沙丘' },
      overview: { en: 'The book and the films, together.', zh: '原著小說與電影，一次過收藏。' },
      members: ['smp_dunebook', 'smp_dune1', 'smp_dune2'] },
    { id: 'smp_g_bb', kind: 'group', sample: true, name: { en: 'Breaking Bad Universe', zh: '絕命毒師宇宙' },
      overview: { en: 'Walter White, Jesse Pinkman and Saul Goodman.', zh: '華特．懷特、謝西．平克曼與索爾．古德曼的故事。' },
      members: ['smp_breakingbad', 'smp_bcs'] },
  ];

  // Stagger "added" dates so sorting looks natural.
  [...items, ...groups].forEach((r, i) => { r.addedAt = new Date(Date.now() - i * 3600000).toISOString(); });
  store.putMany([...items, ...groups]);
}
