// Your starter library: the titles you told me you've watched and read.
// Details (posters, Hong Kong titles, seasons) were looked up on TMDB / Open Library.
// Ids are fixed, so loading this on two devices never creates duplicates.
import * as store from './store.js';

const RECORDS = [
{
"id":"tm_m_438631",
"kind":"movie",
"status":"done",
"source":{
"type":"tmdb",
"id":438631
},
"title":{
"en":"Dune",
"zh":"沙丘瀚戰"
},
"originalTitle":"",
"overview":{
"en":"Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people. As malevolent forces explode into conflict over the planet's exclusive supply of the most precious resource in existence - a commodity capable of unlocking humanity's greatest potential - only those who can conquer their fear will survive.",
"zh":"保羅亞崔迪是一個聰明又富有天賦的年輕人，肩負超越自己理解的偉大天命，且必須遠行至宇宙中最危險的行星，以確保他家人及族人未來的延續。敵對勢力為搶奪唯有此行星才出產的珍貴資源大打出手，而這也是人類最珍視的資源，一種能解鎖人類偉大潛能的物質，唯有能戰勝自己恐懼的人才能存活。"
},
"tagline":"It begins.",
"year":"2021",
"runtime":155,
"genres":[
"Science Fiction",
"Adventure"
],
"people":{
"label":"Directed by",
"names":[
"Denis Villeneuve"
],
"cast":[
"Timothée Chalamet",
"Rebecca Ferguson",
"Oscar Isaac",
"Jason Momoa",
"Stellan Skarsgård",
"Stephen McKinley Henderson",
"Josh Brolin",
"Javier Bardem"
]
},
"poster":"https://image.tmdb.org/t/p/w500/v1tRXZ4JtD2Iv6fjkPvT4GiwslV.jpg",
"backdrop":"https://image.tmdb.org/t/p/w1280/jYEW5xZkZk2WTrdbMGAPFuBqbDc.jpg",
"web":{
"tmdb":7.8
},
"imdbId":"tt1160419",
"my":{}
},
{
"id":"tm_m_693134",
"kind":"movie",
"status":"done",
"source":{
"type":"tmdb",
"id":693134
},
"title":{
"en":"Dune: Part Two",
"zh":"沙丘瀚戰：第二章"
},
"originalTitle":"",
"overview":{
"en":"Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, Paul endeavors to prevent a terrible future only he can foresee.",
"zh":"保羅亞崔迪（提摩西夏勒梅 飾演）騎上巨大沙蟲，獲得全新的力量，成為新的領袖。故事將探索保羅亞崔迪的偉大神祕之旅，他和荃妮（辛蒂亞 飾演）以及弗瑞曼人聯手，對毀滅他家族的陰謀者展開報復；保羅必須在他畢生摯愛與已知宇宙命運之間做抉擇，並且努力阻止只有他能預見的可怕未來。"
},
"tagline":"Long live the fighters.",
"year":"2024",
"runtime":167,
"genres":[
"Science Fiction",
"Adventure"
],
"people":{
"label":"Directed by",
"names":[
"Denis Villeneuve"
],
"cast":[
"Timothée Chalamet",
"Zendaya",
"Rebecca Ferguson",
"Javier Bardem",
"Josh Brolin",
"Austin Butler",
"Florence Pugh",
"Dave Bautista"
]
},
"poster":"https://image.tmdb.org/t/p/w500/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg",
"backdrop":"https://image.tmdb.org/t/p/w1280/eZ239CUp1d6OryZEBPnO2n87gMG.jpg",
"web":{
"tmdb":8.1
},
"imdbId":"tt15239678",
"my":{}
},
{
"id":"tm_m_284054",
"kind":"movie",
"status":"done",
"source":{
"type":"tmdb",
"id":284054
},
"title":{
"en":"Black Panther",
"zh":"黑豹"
},
"originalTitle":"",
"overview":{
"en":"King T'Challa returns home to the reclusive, technologically advanced African nation of Wakanda to serve as his country's new leader. However, T'Challa soon finds that he is challenged for the throne by factions within his own country as well as without. Using powers reserved to Wakandan kings, T'Challa assumes the Black Panther mantle to join with ex-girlfriend Nakia, the queen-mother, his princess-kid sister, members of the Dora Milaje (the Wakandan 'special forces') and an American secret agent, to prevent Wakanda from being dragged into a world war.",
"zh":"《黑豹》的故事將接續在《美國隊長3：英雄內戰》之後，帝查拉返回擁有先進科技卻與世隔絕的瓦干達接下王位。 然而積怨已久的宿敵再度出現，將他捲入一場波及瓦干達全國甚至全世界安危的巨大紛爭中，帝查拉身為國王和黑豹的勇氣和能力將受到最嚴峻的挑戰。"
},
"tagline":"Long live the king.",
"year":"2018",
"runtime":135,
"genres":[
"Action",
"Adventure",
"Science Fiction"
],
"people":{
"label":"Directed by",
"names":[
"Ryan Coogler"
],
"cast":[
"Chadwick Boseman",
"Michael B. Jordan",
"Lupita Nyong'o",
"Danai Gurira",
"Martin Freeman",
"Daniel Kaluuya",
"Letitia Wright",
"Winston Duke"
]
},
"poster":"https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg",
"backdrop":"https://image.tmdb.org/t/p/w1280/b6ZJZHUdMEFECvGiDpJjlfUWela.jpg",
"web":{
"tmdb":7.4
},
"imdbId":"tt1825683",
"my":{}
},
{
"id":"tm_m_24428",
"kind":"movie",
"status":"done",
"source":{
"type":"tmdb",
"id":24428
},
"title":{
"en":"The Avengers",
"zh":"復仇者聯盟"
},
"originalTitle":"",
"overview":{
"en":"When an unexpected enemy emerges and threatens global safety and security, Nick Fury, director of the international peacekeeping agency known as S.H.I.E.L.D., finds himself in need of a team to pull the world back from the brink of disaster. Spanning the globe, a daring recruitment effort begins!",
"zh":"邪惡勢力悄悄集結，力量已龐大到極為驚人的地步，危機已非任何英雄能獨力面對。為了保護地球的安危，神盾局局長尼克福瑞費盡心力將各方超級英雄聚集一堂，包括鋼鐵人、浩克、雷神索爾、鷹眼與黑寡婦，還有剛從冰獄裡甦醒的美國隊長。於是「復仇者聯盟」就此組成，然而各自擁有強大神力或武器的超級英雄，必須能夠放下彼此之間的偏見，同心協力找到合作的模式，才有機會與邪惡勢力一博。而要阻止邪惡計畫的他們，團結的力量真能成功擊敗敵人？"
},
"tagline":"Some assembly required.",
"year":"2012",
"runtime":143,
"genres":[
"Science Fiction",
"Action",
"Adventure"
],
"people":{
"label":"Directed by",
"names":[
"Joss Whedon"
],
"cast":[
"Robert Downey Jr.",
"Chris Evans",
"Mark Ruffalo",
"Chris Hemsworth",
"Scarlett Johansson",
"Jeremy Renner",
"Tom Hiddleston",
"Clark Gregg"
]
},
"poster":"https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg",
"backdrop":"https://image.tmdb.org/t/p/w1280/86IbFy98QjRIqg6WanKYb9tXNbJ.jpg",
"web":{
"tmdb":8.1
},
"imdbId":"tt0848228",
"my":{}
},
{
"id":"tm_m_99861",
"kind":"movie",
"status":"done",
"source":{
"type":"tmdb",
"id":99861
},
"title":{
"en":"Avengers: Age of Ultron",
"zh":"復仇者聯盟2：奧創紀元"
},
"originalTitle":"",
"overview":{
"en":"When Tony Stark tries to jumpstart a dormant peacekeeping program, things go awry and Earth’s Mightiest Heroes are put to the ultimate test as the fate of the planet hangs in the balance. As the villainous Ultron emerges, it is up to The Avengers to stop him from enacting his terrible plans, and soon uneasy alliances and unexpected action pave the way for an epic and unique global adventure.",
"zh":"「鋼鐵人」東尼史塔克為了維護地球和平安全，神盾局瓦解後，把史塔克大樓改成新的復仇者基地。鋼鐵人在圍剿九頭蛇時，中了汪達的幻術魔法，認為地球無力抵抗外星人入侵，於是打造人工智慧機器人「奧創」，不料奧創自行進化，卻認為唯有殲滅人類，才能維護世界和平。而後奧創與汪達結盟，黑寡婦、美國隊長與雷神索爾接連中了汪達的幻術，心中的夢魘陰影化成幻覺浮現眼前，浩克大搞破壞，鋼鐵人只好穿上「浩克毀滅者」來制服。復仇者們遭逢前所未見的心理戰猛攻，潰不成軍。他們要如何克服自己的陰影，重新集結，打敗奧創呢?"
},
"tagline":"A new age has come.",
"year":"2015",
"runtime":141,
"genres":[
"Action",
"Adventure",
"Science Fiction"
],
"people":{
"label":"Directed by",
"names":[
"Joss Whedon"
],
"cast":[
"Robert Downey Jr.",
"Chris Hemsworth",
"Mark Ruffalo",
"Chris Evans",
"Scarlett Johansson",
"Jeremy Renner",
"James Spader",
"Samuel L. Jackson"
]
},
"poster":"https://image.tmdb.org/t/p/w500/4ssDuvEDkSArWEdyBl2X5EHvYKU.jpg",
"backdrop":"https://image.tmdb.org/t/p/w1280/kIBK5SKwgqIIuRKhhWrJn3XkbPq.jpg",
"web":{
"tmdb":7.3
},
"imdbId":"tt2395427",
"my":{}
},
{
"id":"tm_m_299536",
"kind":"movie",
"status":"done",
"source":{
"type":"tmdb",
"id":299536
},
"title":{
"en":"Avengers: Infinity War",
"zh":"復仇者聯盟3：無限之戰"
},
"originalTitle":"",
"overview":{
"en":"As the Avengers and their allies have continued to protect the world from threats too large for any one hero to handle, a new danger has emerged from the cosmic shadows: Thanos. A despot of intergalactic infamy, his goal is to collect all six Infinity Stones, artifacts of unimaginable power, and use them to inflict his twisted will on all of reality. Everything the Avengers have fought for has led up to this moment - the fate of Earth and existence itself has never been more uncertain.",
"zh":"漫威電影宇宙10年集大成巔峰之作！史上最強超級英雄全面集結，我們打不了的戰爭，他們為我們挺身而出。地球的存亡，宇宙的平衡，在薩諾斯毀天滅地以前，尚有復仇者聯盟。《復仇者聯盟》系列的第三部，也是漫威宇宙最後階段最終章。將帶來前所未見，最極致、最致命的存亡對決。復仇者聯盟和他們的超級英雄盟友們必須要不顧一切攜手合作才有可能組止最強的終極反派薩諾斯將整個宇宙毀滅。"
},
"tagline":"An entire universe. Once and for all.",
"year":"2018",
"runtime":149,
"genres":[
"Adventure",
"Action",
"Science Fiction"
],
"people":{
"label":"Directed by",
"names":[
"Joe Russo",
"Anthony Russo"
],
"cast":[
"Robert Downey Jr.",
"Chris Evans",
"Chris Hemsworth",
"Josh Brolin",
"Mark Ruffalo",
"Scarlett Johansson",
"Don Cheadle",
"Benedict Cumberbatch"
]
},
"poster":"https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
"backdrop":"https://image.tmdb.org/t/p/w1280/mDfJG3LC3Dqb67AZ52x3Z0jU0uB.jpg",
"web":{
"tmdb":8.2
},
"imdbId":"tt4154756",
"my":{}
},
{
"id":"tm_m_299534",
"kind":"movie",
"status":"done",
"source":{
"type":"tmdb",
"id":299534
},
"title":{
"en":"Avengers: Endgame",
"zh":"復仇者聯盟4：終局之戰"
},
"originalTitle":"",
"overview":{
"en":"After the devastating events of Avengers: Infinity War, the universe is in ruins due to the efforts of the Mad Titan, Thanos. With the help of remaining allies, the Avengers must assemble once more in order to undo Thanos' actions and restore order to the universe once and for all, no matter what consequences may be in store.",
"zh":"復仇者聯盟系列最終章！灰飛煙毀後的世界該如何走下去，是否還有逆轉結局的機會？一切都將在此揭曉。 接續《復仇者聯盟3：無限之戰》，薩諾斯彈指間毀滅宇宙一半的生物後，僅存的復仇者們要如何重整旗鼓，背水一戰，為僅存的信念而戰。在《復仇者聯盟3：無限之戰》中未現身的鷹眼、蟻人，皆在本片登場，《驚奇隊長》也加入戰局。"
},
"tagline":"Avenge the fallen.",
"year":"2019",
"runtime":181,
"genres":[
"Adventure",
"Science Fiction",
"Action"
],
"people":{
"label":"Directed by",
"names":[
"Anthony Russo",
"Joe Russo"
],
"cast":[
"Robert Downey Jr.",
"Chris Evans",
"Mark Ruffalo",
"Chris Hemsworth",
"Scarlett Johansson",
"Jeremy Renner",
"Josh Brolin",
"Don Cheadle"
]
},
"poster":"https://image.tmdb.org/t/p/w500/bR8ISy1O9XQxqiy0fQFw2BX72RQ.jpg",
"backdrop":"https://image.tmdb.org/t/p/w1280/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
"web":{
"tmdb":8.2
},
"imdbId":"tt4154796",
"my":{}
},
{
"id":"tm_m_872585",
"kind":"movie",
"status":"done",
"source":{
"type":"tmdb",
"id":872585
},
"title":{
"en":"Oppenheimer",
"zh":"奧本海默"
},
"originalTitle":"",
"overview":{
"en":"The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
"zh":"以「原子彈之父」奧本海默為中心，他與一組科學家開發出改變人類命運的武器。一個謎一般的男人是如何陷入一個自相矛盾的困境，他為了拯救這個世界，必須先毀滅它。"
},
"tagline":"The world forever changes.",
"year":"2023",
"runtime":181,
"genres":[
"Drama",
"History",
"War"
],
"people":{
"label":"Directed by",
"names":[
"Christopher Nolan"
],
"cast":[
"Cillian Murphy",
"Emily Blunt",
"Matt Damon",
"Robert Downey Jr.",
"Florence Pugh",
"Josh Hartnett",
"Casey Affleck",
"Rami Malek"
]
},
"poster":"https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
"backdrop":"https://image.tmdb.org/t/p/w1280/neeNHeXjMF5fXoCJRsOmkNGC7q.jpg",
"web":{
"tmdb":8
},
"imdbId":"tt15398776",
"my":{}
},
{
"id":"tm_m_577922",
"kind":"movie",
"status":"done",
"source":{
"type":"tmdb",
"id":577922
},
"title":{
"en":"Tenet",
"zh":"TENET 天能"
},
"originalTitle":"",
"overview":{
"en":"Armed with only one word - Tenet - and fighting for the survival of the entire world, the Protagonist journeys through a twilight world of international espionage on a mission that will unfold in something beyond real time.",
"zh":"時間將至。克里斯多福諾蘭編導，卡司羅伯派汀森、約翰大衛華盛頓主演。這不是時空旅行，而是逆轉未來。全新主角必須僅靠一個字「天能」，在順向與逆轉的時空中，為地球全人類的存亡誓死奮戰。"
},
"tagline":"Time runs out.",
"year":"2020",
"runtime":150,
"genres":[
"Action",
"Thriller",
"Science Fiction"
],
"people":{
"label":"Directed by",
"names":[
"Christopher Nolan"
],
"cast":[
"John David Washington",
"Robert Pattinson",
"Elizabeth Debicki",
"Kenneth Branagh",
"Dimple Kapadia",
"Michael Caine",
"Martin Donovan",
"Fiona Dourif"
]
},
"poster":"https://image.tmdb.org/t/p/w500/rrKH3VhHssGTCfPuaEQkxvEoElv.jpg",
"backdrop":"https://image.tmdb.org/t/p/w1280/mQOUyqDybTqxl73hO5LujCZsM1o.jpg",
"web":{
"tmdb":7.2
},
"imdbId":"tt6723592",
"my":{}
},
{
"id":"tm_m_1368337",
"kind":"movie",
"status":"done",
"source":{
"type":"tmdb",
"id":1368337
},
"title":{
"en":"The Odyssey",
"zh":"奧德賽"
},
"originalTitle":"",
"overview":{
"en":"Odysseus, the legendary King of Ithaca, embarks on a long and perilous journey home following the Trojan War. Throughout his voyage, he is forced to confront the whims of gods, mythological monsters, and trials that stretch both his cunning and his humanity to the breaking point.",
"zh":"講述奧德修斯在特洛伊戰爭後歷經艱險返鄉，途中遭遇獨眼巨人、女妖與女巫，最終與妻子重逢的傳奇旅程。"
},
"tagline":"Defy the gods.",
"year":"2026",
"runtime":173,
"genres":[
"Adventure",
"Action",
"Fantasy"
],
"people":{
"label":"Directed by",
"names":[
"Christopher Nolan"
],
"cast":[
"Matt Damon",
"Tom Holland",
"Anne Hathaway",
"Robert Pattinson",
"Himesh Patel",
"Charlize Theron",
"John Leguizamo",
"Travis Scott"
]
},
"poster":"https://image.tmdb.org/t/p/w500/krVa7rKCQb4OBfsr2LTJv4rTz5q.jpg",
"backdrop":"https://image.tmdb.org/t/p/w1280/bulFtfy3oBQtCnAMSi7g6DSSds3.jpg",
"web":{
"tmdb":8
},
"imdbId":"tt33764258",
"my":{}
},
{
"id":"tm_m_361743",
"kind":"movie",
"status":"done",
"source":{
"type":"tmdb",
"id":361743
},
"title":{
"en":"Top Gun: Maverick",
"zh":"壯志凌雲：獨行俠"
},
"originalTitle":"",
"overview":{
"en":"After more than thirty years of service as one of the Navy’s top aviators, and dodging the advancement in rank that would ground him, Pete “Maverick” Mitchell finds himself training a detachment of TOP GUN graduates for a specialized mission the likes of which no living pilot has ever seen.",
"zh":"服役超過30年，身為海軍頂尖飛行員的「獨行俠」彼得米契爾上校仍舊堅守他的崗位，以試飛員的身份不斷突破飛行極限，也放棄任何足以終止飛行生涯的晉升。他在訓練一組 TOP GUN 菁英小組去執行一個前所未聞的特殊任務時，遇見了已故搭檔「呆頭鵝」尼克布雷德蕭中尉的兒子 -「公雞」布雷德利布雷德蕭中尉。在面對不確定的未來和來自過去夢靨的影響下，「獨行俠」在這個要求飛行員奉獻出最終代價的行動裡，被迫面對自己最深層的心魔。"
},
"tagline":"Feel the need... The need for speed.",
"year":"2022",
"runtime":131,
"genres":[
"Action",
"Drama"
],
"people":{
"label":"Directed by",
"names":[
"Joseph Kosinski"
],
"cast":[
"Tom Cruise",
"Miles Teller",
"Jennifer Connelly",
"Bashir Salahuddin",
"Jon Hamm",
"Charles Parnell",
"Monica Barbaro",
"Lewis Pullman"
]
},
"poster":"https://image.tmdb.org/t/p/w500/n0YuM4f5lvGAP6MAW2kBIzugXnc.jpg",
"backdrop":"https://image.tmdb.org/t/p/w1280/AaV1YIdWKnjAIAOe8UUKBFm327v.jpg",
"web":{
"tmdb":8.2
},
"imdbId":"tt1745960",
"my":{}
},
{
"id":"tm_m_954",
"kind":"movie",
"status":"done",
"source":{
"type":"tmdb",
"id":954
},
"title":{
"en":"Mission: Impossible",
"zh":"職業特工隊"
},
"originalTitle":"",
"overview":{
"en":"When Ethan Hunt, the leader of a crack espionage team whose perilous operation has gone awry with no explanation, discovers that a mole has penetrated the CIA, he's surprised to learn that he's the prime suspect. To clear his name, Hunt now must ferret out the real double agent and, in the process, even the score.",
"zh":"改編自70年代知名影集《虎膽妙算》的《不可能的任務》，描寫一位受誣諂的情報員韓特，由於與他同組的人員在布拉格執行任務時全遭殲滅，因此唯一的活口韓特被視為是中情局潛伏已久的叛徒，孤身一人的他雖被政府追殺卻不顧重重危機，力闖中情局總部，決心找出真正的主謀者，然而最後的真相卻出乎大家的意料。  《虎膽妙算》雖然是一部舊影集，但是卻一點也不輸給007系列的影片，可說是集集精彩刺激。湯姆克魯斯一直是相當聰明的演員，不但懂得選擇能夠展現自己魅力的影片，卻沒有流於為為花瓶的困擾，可說是名利雙收的優秀男演員。"
},
"tagline":"Expect the impossible.",
"year":"1996",
"runtime":111,
"genres":[
"Adventure",
"Action",
"Thriller"
],
"people":{
"label":"Directed by",
"names":[
"Brian De Palma"
],
"cast":[
"Tom Cruise",
"Jon Voight",
"Emmanuelle Béart",
"Henry Czerny",
"Jean Reno",
"Ving Rhames",
"Kristin Scott Thomas",
"Vanessa Redgrave"
]
},
"poster":"https://image.tmdb.org/t/p/w500/l5uxY5m5OInWpcExIpKG6AR3rgL.jpg",
"backdrop":"https://image.tmdb.org/t/p/w1280/sra8XnL96OyLHENcglmZJg6HA8z.jpg",
"web":{
"tmdb":7
},
"imdbId":"tt0117060",
"my":{}
},
{
"id":"tm_m_955",
"kind":"movie",
"status":"done",
"source":{
"type":"tmdb",
"id":955
},
"title":{
"en":"Mission: Impossible II",
"zh":"職業特工隊 2"
},
"originalTitle":"",
"overview":{
"en":"With computer genius Luther Stickell at his side and a beautiful thief on his mind, agent Ethan Hunt races across Australia and Spain to stop a former IMF agent from unleashing a genetically engineered biological weapon called Chimera. This mission, should Hunt choose to accept it, plunges him into the center of an international crisis of terrifying magnitude.",
"zh":"特別幹員伊森韓特這次必須解除一項禍在旦夕的國際危機。他的老朋友死於人為空難，他被指派任務，卻不知道自已要找的是誰，那個人偷了什麼東西，以及那個東西究竟有什麼用途？他的線索只有一段古希臘的傳說故事而已。  為了幫他達成任務，他得要找到一位神祕的女竊賊，這位女子魅力十足，使得伊森在他的任務中增添了幾許浪漫情愫。  本片在吳宇森導演下，加進了吳宇森式的動作美感，而且本片的動作設計十分出人意料，常有令人意想不到的動作出現，特別是吳宇森把人跟人對手的舞蹈式美感也帶進了汽車和機車的交手戰之中，嗯！看著兩輛車、兩輛機車如何起舞！  另一方面，湯姆克魯斯在本片的表演方式不同於第一集，觀眾將可以欣賞到湯姆內歛而自然的演技。"
},
"tagline":"Expect the impossible again.",
"year":"2000",
"runtime":123,
"genres":[
"Adventure",
"Action",
"Thriller"
],
"people":{
"label":"Directed by",
"names":[
"John Woo"
],
"cast":[
"Tom Cruise",
"Dougray Scott",
"Thandiwe Newton",
"Ving Rhames",
"Richard Roxburgh",
"John Polson",
"Brendan Gleeson",
"Rade Šerbedžija"
]
},
"poster":"https://image.tmdb.org/t/p/w500/hfnrual76gPeNFduhD4xzHWpfTw.jpg",
"backdrop":"https://image.tmdb.org/t/p/w1280/24DZfupDlhXeTchmcOkoGRhP5Vg.jpg",
"web":{
"tmdb":6.1
},
"imdbId":"tt0120755",
"my":{}
},
{
"id":"tm_m_956",
"kind":"movie",
"status":"done",
"source":{
"type":"tmdb",
"id":956
},
"title":{
"en":"Mission: Impossible III",
"zh":"職業特工隊 3"
},
"originalTitle":"",
"overview":{
"en":"Retired from active duty, and training recruits for the Impossible Mission Force, agent Ethan Hunt faces the toughest foe of his career: Owen Davian, an international broker of arms and information, who's as cunning as he is ruthless. Davian emerges to threaten Hunt and all that he holds dear – including the woman Hunt loves.",
"zh":"秘密特工伊森（湯姆·克魯斯 Tom Cruise 飾）隱藏了真實身份，准備和女友安心生活。這時，他突然接到了上級的電話。超市接頭時，同僚向他傳達了新的任務命令。任務中，他和黑人老搭檔以及兩位女將琳賽（凱莉·羅素 飾）和珍（Maggie Q 飾）並肩作戰，在攻入某大廈尋找一個名叫「兔子腿」的證物時，不幸中了埋伏，結果琳賽當場陣亡。因為被控失職，伊森身心背負了巨大的痛苦，在跟上司鬧翻之後，他執著地追查著這起事故的起因，卻在死者遺留的秘密視頻中發現了一個驚天大秘密。為了給死者報仇，讓罪魁禍首伏法，伊森踏上了去往上海尋找關鍵證據的凶險旅途，結果卻落入了犯罪團夥首領歐文（菲利浦·西摩·霍夫曼 飾）的圈套，甚至女友也成了人質……"
},
"tagline":"The mission begins.",
"year":"2006",
"runtime":126,
"genres":[
"Adventure",
"Action",
"Thriller"
],
"people":{
"label":"Directed by",
"names":[
"J.J. Abrams"
],
"cast":[
"Tom Cruise",
"Philip Seymour Hoffman",
"Ving Rhames",
"Billy Crudup",
"Michelle Monaghan",
"Jonathan Rhys Meyers",
"Keri Russell",
"Maggie Q"
]
},
"poster":"https://image.tmdb.org/t/p/w500/vKGYCpmQyV9uHybWDzXuII8Los5.jpg",
"backdrop":"https://image.tmdb.org/t/p/w1280/bYKeB9uUcPmvikjouEEQ86uvPw9.jpg",
"web":{
"tmdb":6.8
},
"imdbId":"tt0317919",
"my":{}
},
{
"id":"tm_m_56292",
"kind":"movie",
"status":"done",
"source":{
"type":"tmdb",
"id":56292
},
"title":{
"en":"Mission: Impossible - Ghost Protocol",
"zh":"職業特工隊：鬼影約章"
},
"originalTitle":"",
"overview":{
"en":"Ethan Hunt and his team are racing against time to track down a dangerous terrorist named Hendricks, who has gained access to Russian nuclear launch codes and is planning a strike on the United States. An attempt to stop him ends in an explosion causing severe destruction to the Kremlin and the IMF to be implicated in the bombing, forcing the President to disavow them. No longer being aided by the government, Ethan and his team chase Hendricks around the globe, although they might still be too late to stop a disaster.",
"zh":"探員伊森韓特在莫斯科克林姆林宮出任務時遭陷害，引發克林姆林宮爆炸，美國總統因而啟動了鬼影行動，解散情報局，韓特在失去任何資源以及支援的險惡情況下，他必須自行找尋出路，洗清情報局的罪名，更要和其他組員合力阻止敵人引爆核彈，毀滅世界。"
},
"tagline":"No plan. No backup. No choice.",
"year":"2011",
"runtime":133,
"genres":[
"Action",
"Thriller",
"Adventure"
],
"people":{
"label":"Directed by",
"names":[
"Brad Bird"
],
"cast":[
"Tom Cruise",
"Paula Patton",
"Simon Pegg",
"Jeremy Renner",
"Michael Nyqvist",
"Vladimir Mashkov",
"Samuli Edelmann",
"Ivan Shvedoff"
]
},
"poster":"https://image.tmdb.org/t/p/w500/eRZTGx7GsiKqPch96k27LK005ZL.jpg",
"backdrop":"https://image.tmdb.org/t/p/w1280/hqyjzDRCs1N5gEsh2gklzPdsEFD.jpg",
"web":{
"tmdb":7.1
},
"imdbId":"tt1229238",
"my":{}
},
{
"id":"tm_m_177677",
"kind":"movie",
"status":"done",
"source":{
"type":"tmdb",
"id":177677
},
"title":{
"en":"Mission: Impossible - Rogue Nation",
"zh":"職業特工隊：叛逆帝國"
},
"originalTitle":"",
"overview":{
"en":"Ethan and team take on their most impossible mission yet—eradicating 'The Syndicate', an International and highly-skilled rogue organization committed to destroying the IMF.",
"zh":"敘述從事深入臥底任務的IMF已為千夫所指，即使對自由世界最可怕的威脅正在醞釀，他們正面臨全面解散的危機。造成威脅的 “辛迪加”，是一個無法突破、由一群受過精良訓練的叛逃間諜組成的組織，他們為了自己的理想離鄉背井——企圖瓦解文明世界的基礎。在諜報世界裡，辛迪加長期以來只被視為空穴來風，但伊森韓特揭露眾人不願面對的現實，他發現這個秘密組織真的存在，如果再不行動，將會在全球引爆一連串災難。中情局不肯相信，伊森韓特自己的團隊命運岌岌可危，但在盡所有努力之前，他絕不會放棄。  伊森韓特面對他的終極對手，他所有無可取代的特質立刻面臨考驗：在危急時刻從容不迫的脫身能力、穿梭遊走全球各地的技巧、與邪不勝正的渴望。從維也納到卡薩布蘭加，從軍機上的一髮千鈞到深水危機，伊森韓特將用盡手段，抵抗他出生入死的間諜生涯中最嚴峻的危險。但最重要的是，他將企圖達成最具意義的任務：堅持對朋友的忠心，並維繫創造不可能的理想。"
},
"tagline":"Desperate times. Desperate measures.",
"year":"2015",
"runtime":131,
"genres":[
"Action",
"Adventure"
],
"people":{
"label":"Directed by",
"names":[
"Christopher McQuarrie"
],
"cast":[
"Tom Cruise",
"Jeremy Renner",
"Simon Pegg",
"Rebecca Ferguson",
"Ving Rhames",
"Sean Harris",
"Simon McBurney",
"Zhang Jingchu"
]
},
"poster":"https://image.tmdb.org/t/p/w500/fRJLXQBHK2wyznK5yZbO7vmsuVK.jpg",
"backdrop":"https://image.tmdb.org/t/p/w1280/vYIUN5rrCncHFY8WvcuXQlM4hk5.jpg",
"web":{
"tmdb":7.2
},
"imdbId":"tt2381249",
"my":{}
},
{
"id":"tm_m_353081",
"kind":"movie",
"status":"done",
"source":{
"type":"tmdb",
"id":353081
},
"title":{
"en":"Mission: Impossible - Fallout",
"zh":"職業特工隊：叛逆之謎"
},
"originalTitle":"",
"overview":{
"en":"When an IMF mission ends badly, the world is faced with dire consequences. As Ethan Hunt takes it upon himself to fulfill his original briefing, the CIA begin to question his loyalty and his motives. The IMF team find themselves in a race against time, hunted by assassins while trying to prevent a global catastrophe.",
"zh":"劇情描述伊森韓特 在逮捕無政府恐怖組織「辛迪加」的領導人連恩後，接下新任務是阻止餘黨、以約翰拉克為首的12個「使徒」的瘋狂計畫，伊森韓特得早一步比「使徒」先拿到鈽元素，避免讓「使徒」在72小時內製造出核彈攻擊主要城市。然而，伊森韓特這項搶走鈽元素的任務執行失敗，他必須接受中情局的監督，讓中情局特務沃克 進入IMF團隊，並且借助盟友伊爾莎 的消息，合力再找回鈽元素。"
},
"tagline":"Some missions are not a choice.",
"year":"2018",
"runtime":147,
"genres":[
"Action",
"Adventure"
],
"people":{
"label":"Directed by",
"names":[
"Christopher McQuarrie"
],
"cast":[
"Tom Cruise",
"Henry Cavill",
"Ving Rhames",
"Simon Pegg",
"Rebecca Ferguson",
"Sean Harris",
"Angela Bassett",
"Vanessa Kirby"
]
},
"poster":"https://image.tmdb.org/t/p/w500/AkJQpZp9WoNdj7pLYSj1L0RcMMN.jpg",
"backdrop":"https://image.tmdb.org/t/p/w1280/5jnoAA74Qwb5w6B9FMvnc20n6Ie.jpg",
"web":{
"tmdb":7.5
},
"imdbId":"tt4912910",
"my":{}
},
{
"id":"tm_m_575264",
"kind":"movie",
"status":"done",
"source":{
"type":"tmdb",
"id":575264
},
"title":{
"en":"Mission: Impossible - Dead Reckoning Part One",
"zh":"職業特工隊：死亡清算"
},
"originalTitle":"",
"overview":{
"en":"Ethan Hunt and his IMF team embark on their most dangerous mission yet: To track down a terrifying new weapon that threatens all of humanity before it falls into the wrong hands. With control of the future and the world's fate at stake and dark forces from Ethan's past closing in, a deadly race around the globe begins. Confronted by a mysterious, all-powerful enemy, Ethan must consider that nothing can matter more than his mission—not even the lives of those he cares about most.",
"zh":"伊森韓特（湯姆克魯斯 飾）和他的IMF（不可能任務情報局）小組展開他們至今最危險的任務，他們必須追查並奪取一項可能威脅全人類安危的全新致命武器，並且不讓它落入壞人手中。全世界未來的命運岌岌可危，來自伊森過去的黑暗勢力也步步逼近，一場橫跨全球的生死追逐就此展開。當他面對神祕可怕且力量強大的敵人，伊森就被迫面對他的任務比任何事情都還要更重要，就連他最在乎的人的性命也包括在內，他該如何抉擇。"
},
"tagline":"We all share the same fate.",
"year":"2023",
"runtime":164,
"genres":[
"Action",
"Adventure",
"Thriller"
],
"people":{
"label":"Directed by",
"names":[
"Christopher McQuarrie"
],
"cast":[
"Tom Cruise",
"Hayley Atwell",
"Ving Rhames",
"Simon Pegg",
"Rebecca Ferguson",
"Vanessa Kirby",
"Esai Morales",
"Pom Klementieff"
]
},
"poster":"https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg",
"backdrop":"https://image.tmdb.org/t/p/w1280/628Dep6AxEtDxjZoGP78TsOxYbK.jpg",
"web":{
"tmdb":7.5
},
"imdbId":"tt9603212",
"my":{}
},
{
"id":"tm_m_575265",
"kind":"movie",
"status":"done",
"source":{
"type":"tmdb",
"id":575265
},
"title":{
"en":"Mission: Impossible - The Final Reckoning",
"zh":"職業特工隊：最終清算"
},
"originalTitle":"",
"overview":{
"en":"Ethan Hunt and team continue their search for the terrifying AI known as the Entity — which has infiltrated intelligence networks all over the globe — with the world's governments and a mysterious ghost from Hunt's past on their trail. Joined by new allies and armed with the means to shut the Entity down for good, Hunt is in a race against time to prevent the world as we know it from changing forever.",
"zh":"這次，伊森不只要面對過去的種種，還將迎來前所未有的考驗，這是一場關乎信念與命運的抉擇。"
},
"tagline":"Our lives are the sum of our choices.",
"year":"2025",
"runtime":170,
"genres":[
"Action",
"Thriller",
"Adventure"
],
"people":{
"label":"Directed by",
"names":[
"Christopher McQuarrie"
],
"cast":[
"Tom Cruise",
"Hayley Atwell",
"Ving Rhames",
"Simon Pegg",
"Esai Morales",
"Pom Klementieff",
"Henry Czerny",
"Holt McCallany"
]
},
"poster":"https://image.tmdb.org/t/p/w500/iKPsC9EFUafRP9SrUznI61getVP.jpg",
"backdrop":"https://image.tmdb.org/t/p/w1280/xPNDRM50a58uvv1il2GVZrtWjkZ.jpg",
"web":{
"tmdb":7.2
},
"imdbId":"tt9603208",
"my":{}
},
{
"id":"tm_m_245891",
"kind":"movie",
"status":"done",
"source":{
"type":"tmdb",
"id":245891
},
"title":{
"en":"John Wick",
"zh":"殺神 John Wick"
},
"originalTitle":"",
"overview":{
"en":"Ex-hitman John Wick comes out of retirement to track down the gangsters that took everything from him.",
"zh":"引退的殺手約翰維克(基努李維 飾)，某天發現自己遭追殺，對方不僅偷走一輛福特老爺車，還順手殺害了他過世的妻子給他留下的狗。面對生死相逼的步步殺機，城市裡逐漸沒有可以安身的棲息處，他決定再度冒著危險重返殺手行列。  約翰維克一路殺到紐約報仇，發現昔日殺手好友的父親是一名心狠手辣的俄羅斯黑幫大佬，開出重金要取自己的性命，而前來殺他的卻是維克從前的老朋友馬庫斯(威廉達佛 飾)"
},
"tagline":"Don't set him off.",
"year":"2014",
"runtime":101,
"genres":[
"Action",
"Thriller"
],
"people":{
"label":"Directed by",
"names":[
"Chad Stahelski"
],
"cast":[
"Keanu Reeves",
"Michael Nyqvist",
"Alfie Allen",
"Willem Dafoe",
"Dean Winters",
"Adrianne Palicki",
"Omer Barnea",
"Toby Leonard Moore"
]
},
"poster":"https://image.tmdb.org/t/p/w500/wXqWR7dHncNRbxoEGybEy7QTe9h.jpg",
"backdrop":"https://image.tmdb.org/t/p/w1280/ff2ti5DkA9UYLzyqhQfI2kZqEuh.jpg",
"web":{
"tmdb":7.5
},
"imdbId":"tt2911666",
"my":{}
},
{
"id":"tm_m_324552",
"kind":"movie",
"status":"done",
"source":{
"type":"tmdb",
"id":324552
},
"title":{
"en":"John Wick: Chapter 2",
"zh":"殺神 John Wick 2"
},
"originalTitle":"",
"overview":{
"en":"John Wick is forced out of retirement by a former associate looking to seize control of a shadowy international assassins’ guild. Bound by a blood oath to aid him, Wick travels to Rome and does battle against some of the world’s most dangerous killers.",
"zh":"《捍衛任務2：殺神回歸》故事發生在第一集的四天後，因失去一切而被迫重出江湖的「殺神」約翰維克，得知先前的盟友計畫控制一個神秘的國際刺客協會，由於兩人年輕時曾立下血誓盟約，約翰不得不再度提槍上陣，並因此來到羅馬，與世界上最致命的頂尖殺手展開兇惡對決。這場殺手與殺手的對決戰裡，約翰將使出渾身解數、直搗黃龍，並將擋住他去路的人一一解決！"
},
"tagline":"Never stab the devil in the back!",
"year":"2017",
"runtime":122,
"genres":[
"Action",
"Thriller",
"Crime"
],
"people":{
"label":"Directed by",
"names":[
"Chad Stahelski"
],
"cast":[
"Keanu Reeves",
"Common",
"Laurence Fishburne",
"Riccardo Scamarcio",
"Ruby Rose",
"Lance Reddick",
"Peter Stormare",
"Bridget Moynahan"
]
},
"poster":"https://image.tmdb.org/t/p/w500/hXWBc0ioZP3cN4zCu6SN3YHXZVO.jpg",
"backdrop":"https://image.tmdb.org/t/p/w1280/Aa9Lx6gotP0szl9tlt5SPCN08oF.jpg",
"web":{
"tmdb":7.3
},
"imdbId":"tt4425200",
"my":{}
},
{
"id":"tm_m_458156",
"kind":"movie",
"status":"done",
"source":{
"type":"tmdb",
"id":458156
},
"title":{
"en":"John Wick: Chapter 3 - Parabellum",
"zh":"殺神 John Wick 3"
},
"originalTitle":"",
"overview":{
"en":"Super-assassin John Wick returns with a $14 million price tag on his head and an army of bounty-hunting killers on his trail. After killing a member of the shadowy international assassin’s guild, the High Table, John Wick is excommunicado, but the world’s most ruthless hit men and women await his every turn.",
"zh":"好萊塢最性感大叔基努李維飾演「地表最強殺神系列」電影續集《捍衛任務3：全面開戰》睽違兩年，再度強勢回歸，劇情接續《捍衛任務2：殺神回歸》片尾，「殺神」約翰維克因觸犯大陸酒店中「內部不可殺人」的規定，在孤立無援的情況下，遭殺手高層組織下達1400萬美金的全球通緝令，約翰維克必須設法在僅存的一個小時中逃出紐約，躲避來自各路殺手的瘋狂追殺。"
},
"tagline":"If you want peace, prepare for war.",
"year":"2019",
"runtime":131,
"genres":[
"Action",
"Thriller",
"Crime"
],
"people":{
"label":"Directed by",
"names":[
"Chad Stahelski"
],
"cast":[
"Keanu Reeves",
"Halle Berry",
"Ian McShane",
"Laurence Fishburne",
"Mark Dacascos",
"Asia Kate Dillon",
"Lance Reddick",
"Anjelica Huston"
]
},
"poster":"https://image.tmdb.org/t/p/w500/ziEuG1essDuWuC5lpWUaw1uXY2O.jpg",
"backdrop":"https://image.tmdb.org/t/p/w1280/vVpEOvdxVBP2aV166j5Xlvb5Cdc.jpg",
"web":{
"tmdb":7.4
},
"imdbId":"tt6146586",
"my":{}
},
{
"id":"tm_m_603692",
"kind":"movie",
"status":"done",
"source":{
"type":"tmdb",
"id":603692
},
"title":{
"en":"John Wick: Chapter 4",
"zh":"殺神 John Wick 4"
},
"originalTitle":"",
"overview":{
"en":"With the price on his head ever increasing, John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe and forces that turn old friends into foes.",
"zh":"約翰維克（基努李維 飾）經歷上集的事件後，繼續與驅逐他的殺手組織「高桌會」展開對抗，隨著懸賞金額的不斷飆升，約翰維克將迎來他殺手生涯最強大的對手……。"
},
"tagline":"No way back, one way out.",
"year":"2023",
"runtime":170,
"genres":[
"Action",
"Thriller",
"Crime"
],
"people":{
"label":"Directed by",
"names":[
"Chad Stahelski"
],
"cast":[
"Keanu Reeves",
"Donnie Yen",
"Bill Skarsgård",
"Ian McShane",
"Laurence Fishburne",
"Lance Reddick",
"Clancy Brown",
"Hiroyuki Sanada"
]
},
"poster":"https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
"backdrop":"https://image.tmdb.org/t/p/w1280/7I6VUdPj6tQECNHdviJkUHD2u89.jpg",
"web":{
"tmdb":7.7
},
"imdbId":"tt10366206",
"my":{}
},
{
"id":"tm_t_37680",
"kind":"tv",
"status":"progress",
"source":{
"type":"tmdb",
"id":37680
},
"title":{
"en":"Suits",
"zh":"金裝律師"
},
"originalTitle":"",
"overview":{
"en":"While running from a drug deal gone bad, Mike Ross, a brilliant young college-dropout, slips into a job interview with one of New York City's best legal closers, Harvey Specter. Tired of cookie-cutter law school grads, Harvey takes a gamble by hiring Mike on the spot after he recognizes his raw talent and photographic memory.",
"zh":"Mike Ross，一位誤入歧途的大學輟學生，為了給重病中的祖母提供更好的看護服務挺而走險。偶然遇見了知名律師事務所的王牌律師Harvey Specter。Harvey從這個年輕人身上看到了自己的影子。所以儘管Mike沒有法學學歷及律師執照，Harvey仍決定冒險雇用Mike為自己的助理律師。在這個工作壓力極大，競爭極為激烈的事務所中，要如何守住Mike的秘密？兩個處境截然不同，卻又性情相投的人之間又會擦出怎樣的火花呢？"
},
"tagline":"Two lawyers. One degree.",
"year":"2011",
"endYear":"2019",
"airing":"Ended",
"runtime":42,
"genres":[
"Drama"
],
"networks":[
"USA Network"
],
"people":{
"label":"Created by",
"names":[
"Aaron Korsh"
],
"cast":[
"Gabriel Macht",
"Rick Hoffman",
"Sarah Rafferty",
"Patrick J. Adams",
"Meghan, Duchess of Sussex",
"Gina Torres",
"Amanda Schull",
"Wendell Pierce"
]
},
"poster":"https://image.tmdb.org/t/p/w500/vQiryp6LioFxQThywxbC6TuoDjy.jpg",
"backdrop":"https://image.tmdb.org/t/p/w1280/or0E36KfzJYZwqXeiCfm1JgepKF.jpg",
"web":{
"tmdb":8.2
},
"imdbId":"tt1632701",
"seasons":[
{
"n":0,
"name":{
"en":"Specials",
"zh":"特別篇"
},
"year":"2012",
"poster":"https://image.tmdb.org/t/p/w342/agyP4DQE9Ny8kZDc3hvaVoTxYgK.jpg",
"episodeCount":76,
"overview":{
"en":""
},
"web":{
"tmdb":null
},
"my":{}
},
{
"n":1,
"name":{
"en":"Season 1",
"zh":"第 1 季"
},
"year":"2011",
"poster":"https://image.tmdb.org/t/p/w342/6gbwMw7k8Utq2lP6y91BdnYfDXg.jpg",
"episodeCount":12,
"overview":{
"en":"Manhattan attorney Harvey Specter finds the perfect associate in streetwise prodigy Mike Ross. The trouble is, Mike's a college dropout — not a lawyer."
},
"web":{
"tmdb":7.6
},
"my":{
"seen":true
}
},
{
"n":2,
"name":{
"en":"Season 2",
"zh":"第 2 季"
},
"year":"2012",
"poster":"https://image.tmdb.org/t/p/w342/xxZPBZZHkii6o2yFDrBSTZvC2Yr.jpg",
"episodeCount":16,
"overview":{
"en":"As Harvey focuses on protecting Mike's position, Jessica deals with the fallout after the unexpected reappearance of her co-founding partner."
},
"web":{
"tmdb":8
},
"my":{}
},
{
"n":3,
"name":{
"en":"Season 3",
"zh":"第 3 季"
},
"year":"2013",
"poster":"https://image.tmdb.org/t/p/w342/j9nAfPK8csOMMZ9tjPLsiQIV0H2.jpg",
"episodeCount":16,
"overview":{
"en":"Skilled corporate lawyer Harvey Specter and his associate Mike Ross continue their unusual partnership in this season of the smart courtroom drama."
},
"web":{
"tmdb":8
},
"my":{}
},
{
"n":4,
"name":{
"en":"Season 4",
"zh":"第 4 季"
},
"year":"2014",
"poster":"https://image.tmdb.org/t/p/w342/uYatRS9fSyk6tEQ7FVBpAk33F85.jpg",
"episodeCount":16,
"overview":{
"en":"In Season 4, Harvey and Mike find themselves on opposite sides of a corporate takeover battle that draws attention from the government."
},
"web":{
"tmdb":7.8
},
"my":{}
},
{
"n":5,
"name":{
"en":"Season 5",
"zh":"第 5 季"
},
"year":"2015",
"poster":"https://image.tmdb.org/t/p/w342/hCjppZ3SYQIRW3HubVmNhUOZ6dE.jpg",
"episodeCount":16,
"overview":{
"en":"Harvey regroups in the wake of Donna's departure, Mike and Rachel edge closer to marriage, and Jessica continues to come to grips with her new life."
},
"web":{
"tmdb":7.9
},
"my":{}
},
{
"n":6,
"name":{
"en":"Season 6",
"zh":"第 6 季"
},
"year":"2016",
"poster":"https://image.tmdb.org/t/p/w342/nOsi11j9tQgZqiuwVqUwSDiJ7Rx.jpg",
"episodeCount":16,
"overview":{
"en":"In the aftermath of the trial, Mike faces the realities of his situation while Jessica, Harvey and Louis grapple to contain the firm's vulnerability."
},
"web":{
"tmdb":7.5
},
"my":{}
},
{
"n":7,
"name":{
"en":"Season 7",
"zh":"第 7 季"
},
"year":"2017",
"poster":"https://image.tmdb.org/t/p/w342/w126E6YAv1qNgUrDJX6gPbl2xS9.jpg",
"episodeCount":16,
"overview":{
"en":"Now that Mike is officially recognized as a lawyer and has accepted Harvey’s offer to return to the firm, Season 7 will see the team back together again at Pearson Specter Litt - each dealing with their own struggles as they adjust to a new world order without Jessica ."
},
"web":{
"tmdb":7.3
},
"my":{}
},
{
"n":8,
"name":{
"en":"Season 8",
"zh":"第 8 季"
},
"year":"2018",
"poster":"https://image.tmdb.org/t/p/w342/rrztnIAOPeqvG3l7bEegwEWhFF4.jpg",
"episodeCount":16,
"overview":{
"en":"In the wake of two emotional departures, Harvey and the rest of Specter Litt face an infusion of ambitious new blood and chart a daring new course."
},
"web":{
"tmdb":7.2
},
"my":{}
},
{
"n":9,
"name":{
"en":"Season 9",
"zh":"第 9 季"
},
"year":"2019",
"poster":"https://image.tmdb.org/t/p/w342/uEO93DzpoYYwFcUPZCkT6n4JAZC.jpg",
"episodeCount":10,
"overview":{
"en":"As the firm chafes under intense new oversight, each partner faces a reckoning -- and Mike Ross returns to square off against his old mentor, Harvey."
},
"web":{
"tmdb":7.5
},
"my":{}
}
],
"my":{}
},
{
"id":"tm_t_85937",
"kind":"tv",
"status":"done",
"source":{
"type":"tmdb",
"id":85937
},
"title":{
"en":"Demon Slayer: Kimetsu no Yaiba",
"zh":"鬼滅之刃"
},
"originalTitle":"鬼滅の刃",
"overview":{
"en":"After a demon attack leaves his family slain and his sister cursed, Tanjiro embarks upon a perilous journey to find a cure and avenge those he's lost.",
"zh":"時代背景為日本大正時期，賣炭維生的善良少年炭治郎，某天家人慘遭鬼殺害。而唯一倖存的妹妹禰豆子卻變化成鬼。遭到絕望現實打擊的炭治郎，為了讓妹妹恢復回人類，為了被殺害的家人向鬼報仇，決定踏上「獵鬼」之路。人鬼交織的悲憤兄妹故事現在開始了。"
},
"tagline":"The love of a brother transcends everything.",
"year":"2019",
"endYear":"2024",
"airing":"Ended",
"runtime":null,
"genres":[
"Animation",
"Action & Adventure",
"Sci-Fi & Fantasy"
],
"networks":[
"Fuji TV",
"Gunma TV",
"TOKYO MX",
"BS11",
"Tokai Television Broadcasting",
"Kansai TV",
"Tochigi TV",
"Fukui TV",
"Hokkaido Cultural Broadcasting",
"Iwate Menkoi Television",
"TOS",
"Sendai Television",
"SAGA TV",
"Ishikawa TV",
"TNC",
"OHK",
"Kochi Sun Sun Broadcasting",
"Television Shin Hiroshima System",
"TV Shizuoka",
"UMK TV Miyazaki",
"NST",
"NBS",
"Sakuranbo TV",
"TSK",
"Ehime Broadcasting",
"KTS",
"Fukushima TV",
"AKT",
"Toyama Television",
"TV Kumamoto",
"Okinawa Television Broadcasting",
"KTN"
],
"people":{
"label":"Created by",
"names":[],
"cast":[
"Natsuki Hanae",
"Shinya Takahashi",
"Hiro Shimono",
"Yoshitsugu Matsuoka",
"Akari Kito",
"Katsuyuki Konishi",
"Takumi Yamazaki",
"Toshiyuki Morikawa"
]
},
"poster":"https://image.tmdb.org/t/p/w500/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg",
"backdrop":"https://image.tmdb.org/t/p/w1280/nTvM4mhqNlHIvUkI1gVnW6XP7GG.jpg",
"web":{
"tmdb":8.6
},
"imdbId":"tt9335498",
"seasons":[
{
"n":0,
"name":{
"en":"Specials",
"zh":"特別篇"
},
"year":"2020",
"poster":"https://image.tmdb.org/t/p/w342/xkBepJmdcWBU1yBG9bCmtTO6PGh.jpg",
"episodeCount":18,
"overview":{
"en":""
},
"web":{
"tmdb":null
},
"my":{}
},
{
"n":1,
"name":{
"en":"Unwavering Resolve Arc",
"zh":"第 1 季"
},
"year":"2019",
"poster":"https://image.tmdb.org/t/p/w342/bV0ZCL0IqrTQKClu6EtXlZaJevD.jpg",
"episodeCount":26,
"overview":{
"en":"It is the Taisho Period in Japan. Tanjiro, a kindhearted boy who sells charcoal for a living, finds his family slaughtered by a demon. To make matters worse, his younger sister Nezuko, the sole survivor, has been transformed into a demon herself. Though devastated by this grim reality, Tanjiro resolves to become a “demon slayer” so that he can turn his sister back into a human, and kill the demon that massacred his family."
},
"web":{
"tmdb":7.9
},
"my":{
"seen":true
}
},
{
"n":2,
"name":{
"en":"Mugen Train Arc",
"zh":"第 2 季"
},
"year":"2021",
"poster":"https://image.tmdb.org/t/p/w342/pLGjaDyg2LeA2d9KZxBZCiiqC2B.jpg",
"episodeCount":7,
"overview":{
"en":"Flame Hashira Kyojuro Rengoku receives new orders: Travel to the Mugen Train, where over forty people have gone missing, and conduct an investigation. Leaving the Demon Slayer Corps Headquarters, he sets off on this new mission. Tanjiro's group, fresh from completing their training at the Butterfly Mansion, also head to their next mission, the Mugen Train. There they rendezvous with Rengoku, who arrived ahead of them. On this train running through the darkness, a new battle is about to begin."
},
"web":{
"tmdb":8.2
},
"my":{
"seen":true
}
},
{
"n":3,
"name":{
"en":"Entertainment District Arc",
"zh":"第 3 季"
},
"year":"2021",
"poster":"https://image.tmdb.org/t/p/w342/gbmhcOtre5SeBgwR9gvTpUra5kZ.jpg",
"episodeCount":11,
"overview":{
"en":"After visiting the Rengoku residence, Tanjirou and his comrades volunteer for a mission within the Entertainment District, a place where desires are sold and demons dwell. They journey alongside the flashy Sound Hashira, Tengen Uzui, in search of a monstrous foe terrorizing the town. Sworn to slay creatures of the night, the hunt continues."
},
"web":{
"tmdb":8.2
},
"my":{
"seen":true
}
},
{
"n":4,
"name":{
"en":"Swordsmith Village Arc",
"zh":"第 4 季"
},
"year":"2023",
"poster":"https://image.tmdb.org/t/p/w342/6gD7G8HQay1X8mHiFVttWJ3czYb.jpg",
"episodeCount":11,
"overview":{
"en":"Tanjiro’s journey leads him to the Swordsmith Village, where he reunites with two Hashira, members of the Demon Slayer Corps’ highest-ranking swordsmen - Mist Hashira Muichiro Tokito and Love Hashira Mitsuri Kanroji. With the shadows of demons lurking near, a new battle begins for Tanjiro and his comrades."
},
"web":{
"tmdb":7
},
"my":{
"seen":true
}
},
{
"n":5,
"name":{
"en":"Hashira Training Arc",
"zh":"第 5 季"
},
"year":"2024",
"poster":"https://image.tmdb.org/t/p/w342/axI3BUZgTYz36IYtUtRhivtspUo.jpg",
"episodeCount":8,
"overview":{
"en":"The members of the Demon Slayer Corps and their highest-ranking swordsmen, the Hashira. In preparation for the forthcoming final battle against Muzan Kibutsuji, the Hashira Training commences. While each carry faith and determination within their hearts, Tanjiro and the Hashira enter a new story."
},
"web":{
"tmdb":7.6
},
"my":{
"seen":true
}
}
],
"my":{}
},
{
"id":"tm_t_127532",
"kind":"tv",
"status":"done",
"source":{
"type":"tmdb",
"id":127532
},
"title":{
"en":"Solo Leveling",
"zh":"我獨自升級"
},
"originalTitle":"俺だけレベルアップな件",
"overview":{
"en":"They say whatever doesn’t kill you makes you stronger, but that’s not the case for the world’s weakest hunter Sung Jinwoo. After being brutally slaughtered by monsters in a high-ranking dungeon, Jinwoo came back with the System, a program only he could see, that’s leveling him up in every way. Now, he’s inspired to discover the secrets behind his powers and the dungeon that spawned them.",
"zh":"十多年前，各地突然出現連接異次元與現實世界的＂傳送門＂，而世界上也開始出現覺醒了超人般力量、被稱之為＂獵人＂的覺醒者。”獵人”們利用其自身能力，攻略各地傳送門內的地下城並以此為業，而在眾多強大獵人中，有位被稱為人類最弱兵器的下級獵人”成振宇”。某一天，他進入了隱藏在低級地下城中的雙重地下城，就在振宇身負重傷，瀕臨死亡之際前，他的面前突然出現了一道神秘任務視窗。危急之際選擇接受任務的振宇，發現了自己有了”升級”的能力…。"
},
"tagline":"He used to be the weakest.",
"year":"2024",
"endYear":"2025",
"airing":"Ended",
"runtime":24,
"genres":[
"Animation",
"Action & Adventure",
"Sci-Fi & Fantasy"
],
"networks":[
"Gunma TV",
"TOKYO MX",
"BS11",
"Tochigi TV"
],
"people":{
"label":"Created by",
"names":[],
"cast":[
"Taito Ban",
"Genta Nakamura",
"Haruna Mikawa",
"Reina Ueda",
"Daisuke Hirakawa",
"Hiroki Touchi",
"Banjo Ginga",
"Makoto Furukawa"
]
},
"poster":"https://image.tmdb.org/t/p/w500/geCRueV3ElhRTr0xtJuEWJt6dJ1.jpg",
"backdrop":"https://image.tmdb.org/t/p/w1280/xMNH87maNLt9n2bMDYeI6db5VFm.jpg",
"web":{
"tmdb":8.7
},
"imdbId":"tt21209876",
"seasons":[
{
"n":0,
"name":{
"en":"Specials",
"zh":"特別篇"
},
"year":"2024",
"poster":"https://image.tmdb.org/t/p/w342/hUQRnwRuVtz0CRZhUiOA26gXRoU.jpg",
"episodeCount":1,
"overview":{
"en":""
},
"web":{
"tmdb":null
},
"my":{}
},
{
"n":1,
"name":{
"en":"Solo Leveling",
"zh":"第 1 季"
},
"year":"2024",
"poster":"https://image.tmdb.org/t/p/w342/geCRueV3ElhRTr0xtJuEWJt6dJ1.jpg",
"episodeCount":25,
"overview":{
"en":""
},
"web":{
"tmdb":8.3
},
"my":{
"seen":true
}
}
],
"my":{}
},
{
"id":"tm_t_209867",
"kind":"tv",
"status":"done",
"source":{
"type":"tmdb",
"id":209867
},
"title":{
"en":"Frieren: Beyond Journey's End",
"zh":"葬送的芙莉蓮"
},
"originalTitle":"葬送のフリーレン",
"overview":{
"en":"After the party of heroes defeated the Demon King, they restored peace to the land and returned to lives of solitude. Generations pass, and the elven mage Frieren comes face to face with humanity's mortality. She takes on a new apprentice and promises to fulfill old friends' dying wishes. Can an elven mind make peace with the nature of life and death? Frieren embarks on her quest to find out.",
"zh":"魔法使芙莉蓮與勇者欣梅爾等人一同經歷了10年的冒險，最終打倒魔王，替世界帶來了和平。芙莉蓮身為活了千年以上的精靈，她與欣梅爾等人約好再次相會後，便獨自踏上旅程。在那之後過了50年，芙莉蓮造訪欣梅爾的所在地，但她與50年前長得一模一樣，相較之下欣梅爾已經老去，早已時日無多。之後，芙莉蓮親眼見到過世的欣梅爾，深深體悟自己至今都沒有去「了解他人」，對此感到懊悔的她，決定「為了了解他人」而踏上旅程。與各種人的邂逅，以及各式各樣的遭遇，正在這趟旅程的前方等著她。"
},
"tagline":"Living means being known and remembered by someone.",
"year":"2023",
"endYear":"",
"airing":"Returning Series",
"runtime":25,
"genres":[
"Animation",
"Action & Adventure",
"Drama",
"Sci-Fi & Fantasy"
],
"networks":[
"Nippon TV",
"YTV",
"FBS",
"Chukyo TV",
"RNB",
"HTV",
"FCT",
"STV",
"KNB",
"YBS",
"KTK",
"NKT",
"RAB",
"TVI",
"MMT",
"ABS",
"JRT",
"YBC",
"UMK TV Miyazaki",
"TSB",
"TeNY",
"RNC",
"NIB",
"KKT",
"Daiichi-TV",
"FBC",
"RKC",
"KYT",
"KRY"
],
"people":{
"label":"Created by",
"names":[],
"cast":[
"Atsumi Tanezaki",
"Kana Ichinose",
"Chiaki Kobayashi",
"Nobuhiko Okamoto",
"Hiroki Touchi",
"Yoji Ueda",
"Masafumi Kobatake",
"Jiro Saito"
]
},
"poster":"https://image.tmdb.org/t/p/w500/dqZENchTd7lp5zht7BdlqM7RBhD.jpg",
"backdrop":"https://image.tmdb.org/t/p/w1280/rBOnrVlck7BIlGeWVlzYiZeg4l2.jpg",
"web":{
"tmdb":8.8
},
"imdbId":"tt22248376",
"seasons":[
{
"n":0,
"name":{
"en":"Specials",
"zh":"特別篇"
},
"year":"2023",
"poster":"https://image.tmdb.org/t/p/w342/fazbwo9OYXhhHCrRfwPU3Eup4iL.jpg",
"episodeCount":26,
"overview":{
"en":""
},
"web":{
"tmdb":null
},
"my":{}
},
{
"n":1,
"name":{
"en":"Season 1",
"zh":"第 1 季"
},
"year":"2023",
"poster":"https://image.tmdb.org/t/p/w342/yHsxHEugPPlOPqFZrPGvurltPjm.jpg",
"episodeCount":38,
"overview":{
"en":""
},
"web":{
"tmdb":8.2
},
"my":{
"seen":true
}
}
],
"my":{}
},
{
"id":"tm_t_45790",
"kind":"tv",
"status":"done",
"source":{
"type":"tmdb",
"id":45790
},
"title":{
"en":"JoJo's Bizarre Adventure",
"zh":"JoJo 奇妙冒險"
},
"originalTitle":"ジョジョの奇妙な冒険",
"overview":{
"en":"Follow the intergenerational feud between the Joestar Family and various forces of evil, the most prominent of which is Dio Brando and his followers.",
"zh":"在一次意外中，喬納森（興津和幸配音）的父親喬斯達爵士（菅原正志配音）被陌生少年迪奧布蘭度（子安武人配音）所救，善良的爵士收留了自稱無依無靠的迪奧，後者則以養子的身份正式進入了喬斯達家族的大門。在他人的眼中，迪奧是一個優秀正直的少年，可是，只有經歷過迪奧殘酷欺辱的喬納森才知道，在迪奧光鮮的面具後面，隱藏著一顆邪惡的心。果不其然，隨著年齡的增長，迪奧開始覬覦起了喬斯達家族的龐大家產。無意間，迪奧發現了能夠使人變得強大的石鬼面具，為了獲得更多的財富和權力，迪奧毫不猶豫的帶上了面具。在成為了恐怖的吸血鬼后，迪奧開始了對喬斯達家族的瘋狂報復。為了替父親和整個家族報仇，喬納森開始修煉唯一能夠打敗吸血鬼的波紋氣功，面對著強大的敵人極其黨羽，喬納森能夠獲得最終的勝利嗎？"
},
"tagline":"",
"year":"2012",
"endYear":"",
"airing":"Returning Series",
"runtime":24,
"genres":[
"Animation",
"Action & Adventure",
"Sci-Fi & Fantasy"
],
"networks":[
"Netflix",
"TOKYO MX",
"BS11"
],
"people":{
"label":"Created by",
"names":[],
"cast":[
"Daisuke Ono",
"Takehito Koyasu",
"Kenta Miyake",
"Unsho Ishizuka",
"Fuminori Komatsu",
"Daisuke Hirakawa",
"Yuki Kaji",
"Junichi Suwabe"
]
},
"poster":"https://image.tmdb.org/t/p/w500/ogAWwbh3frWtiTyyXrZaVFtqCgp.jpg",
"backdrop":"https://image.tmdb.org/t/p/w1280/l2gc2dPRUPe3bAfYCRTjc6uAMmB.jpg",
"web":{
"tmdb":8.5
},
"imdbId":"tt2359704",
"seasons":[
{
"n":0,
"name":{
"en":"Specials",
"zh":"特別篇"
},
"year":"2017",
"poster":"https://image.tmdb.org/t/p/w342/jGmCwKTvYrCIGjYxEKNMHzf0TtK.jpg",
"episodeCount":7,
"overview":{
"en":""
},
"web":{
"tmdb":null
},
"my":{}
},
{
"n":1,
"name":{
"en":"Phantom Blood & Battle Tendency",
"zh":"第 1 季"
},
"year":"2012",
"poster":"https://image.tmdb.org/t/p/w342/co0K9FS9rQPxPoKADs4nuGckk3A.jpg",
"episodeCount":26,
"overview":{
"en":"Jonathan Joestar's antagonistic relationship with his adopted brother Dio begins a truly bizarre lineage, which is continued by his grandson Joseph."
},
"web":{
"tmdb":7.6
},
"my":{
"seen":true
}
},
{
"n":2,
"name":{
"en":"Stardust Crusaders",
"zh":"第 2 季"
},
"year":"2014",
"poster":"https://image.tmdb.org/t/p/w342/kX9noqY0YpOPKwXpRXYg1hEIqmM.jpg",
"episodeCount":48,
"overview":{
"en":"Joseph Joestar's grandson Jotaro Kujo has a strange new superpower, which turns out to be connected to the reemergence of old foe Dio Brando."
},
"web":{
"tmdb":7.3
},
"my":{
"seen":true
}
},
{
"n":3,
"name":{
"en":"Diamond Is Unbreakable",
"zh":"第 3 季"
},
"year":"2016",
"poster":"https://image.tmdb.org/t/p/w342/9X4iCnCBZ7Y1AXi4nm4RfMwLW4I.jpg",
"episodeCount":39,
"overview":{
"en":"It's the year 1999, 11 years after Jotaro Kujo's desperate fight against DIO in Egypt. Jotaro meets with Josuke Higashikata, the illegitimate son of his grandfather Joseph Joestar. He discovers that Josuke also has the same \"Stand\" power and that a new threat is surfacing in Morioh City."
},
"web":{
"tmdb":7.6
},
"my":{
"seen":true
}
},
{
"n":4,
"name":{
"en":"Golden Wind",
"zh":"第 4 季"
},
"year":"2018",
"poster":"https://image.tmdb.org/t/p/w342/cMFg7X0gSJjWajuj9DNL4UaUmcP.jpg",
"episodeCount":39,
"overview":{
"en":"In Naples, Italy, the suspected son of Joestar family arch nemesis Dio dreams of becoming a Gang Star so he can bring down the local mafia from within."
},
"web":{
"tmdb":8.6
},
"my":{
"seen":true
}
},
{
"n":5,
"name":{
"en":"STONE OCEAN",
"zh":"第 5 季"
},
"year":"2022",
"poster":"https://image.tmdb.org/t/p/w342/pgfHO4mnozfDLYKjhgtaOZDq9Kc.jpg",
"episodeCount":38,
"overview":{
"en":"The legacy of the Joestar family continues with Jolyne as she and her companions take on new Stand users behind the bars of Green Dolphin Street Prison."
},
"web":{
"tmdb":8.4
},
"my":{
"seen":true
}
},
{
"n":6,
"name":{
"en":"STEEL BALL RUN",
"zh":"第 6 季"
},
"year":"2026",
"poster":"https://image.tmdb.org/t/p/w342/yB2cUOuT3OMGtU3CTLQjuFUL8Ox.jpg",
"episodeCount":12,
"overview":{
"en":"America, 1890. Johnny Joestar, a genius jockey now paralyzed from the waist down, chases after outlaw Gyro Zeppeli in a tough cross-continent horse race."
},
"web":{
"tmdb":8.5
},
"my":{
"seen":true
}
}
],
"my":{}
},
{
"id":"tm_t_82684",
"kind":"tv",
"status":"done",
"source":{
"type":"tmdb",
"id":82684
},
"title":{
"en":"That Time I Got Reincarnated as a Slime",
"zh":"關於我轉生變成史萊姆這檔事"
},
"originalTitle":"転生したらスライムだった件",
"overview":{
"en":"Corporate worker Mikami Satoru is stabbed by a random killer, and is reborn to an alternate world. But he turns out to be reborn a slime! Thrown into this new world with the name Rimuru, he begins his quest to create a world that’s welcoming to all races.",
"zh":"上班族三上悟遭到隨機殺人魔刺殺身亡。當他醒來時發現自己轉生到了異世界。但是，他的模樣卻變成了史萊姆！在獲得了「利姆路」這個嶄新人生（史萊姆生？），並且來到了這充滿了各式各樣種族的世界後，他決定以「打造出不分種族、讓大家都能夠快樂生活的國家」為目標 ──！"
},
"tagline":"Ascend into your true form.",
"year":"2018",
"endYear":"",
"airing":"Returning Series",
"runtime":24,
"genres":[
"Action & Adventure",
"Animation",
"Sci-Fi & Fantasy",
"Comedy"
],
"networks":[
"Nippon TV",
"YTV",
"TOKYO MX",
"BS11",
"FBS",
"Chukyo TV",
"RNB",
"HTV",
"FCT",
"STV",
"KNB",
"YBS",
"KTK",
"NKT",
"RAB",
"TVI",
"MMT",
"ABS",
"JRT",
"TOS",
"YBC",
"TSB",
"TeNY",
"RNC",
"NIB",
"KKT",
"Daiichi-TV",
"FBC",
"RKC",
"KYT",
"KRY"
],
"people":{
"label":"Created by",
"names":[],
"cast":[
"Tomoaki Maeno",
"Takuya Eguchi",
"Hochu Otsuka",
"Asuna Tomari",
"Chikahiro Kobayashi",
"Jun Fukushima",
"Rie Tanaka",
"Rina Hidaka"
]
},
"poster":"https://image.tmdb.org/t/p/w500/pzujcdPAoH361NObVrtbA7zACE7.jpg",
"backdrop":"https://image.tmdb.org/t/p/w1280/eJOy7YWAHgOS3V477sdTsq4v9jp.jpg",
"web":{
"tmdb":8.4
},
"imdbId":"tt9054364",
"seasons":[
{
"n":0,
"name":{
"en":"Specials",
"zh":"特別篇"
},
"year":"2019",
"poster":"https://image.tmdb.org/t/p/w342/z88YuC2De7AuXayfYU6izDORple.jpg",
"episodeCount":16,
"overview":{
"en":""
},
"web":{
"tmdb":null
},
"my":{}
},
{
"n":1,
"name":{
"en":"Season 1",
"zh":"第 1 季"
},
"year":"2018",
"poster":"https://image.tmdb.org/t/p/w342/bQlHgqXFpZ1xpiiBEzncSpXYIwF.jpg",
"episodeCount":24,
"overview":{
"en":"Corporate worker Mikami Satoru is stabbed by a random killer, and is reborn to an alternate world. But he turns out to be reborn a slime! Thrown into this new world with the name Rimuru, he begins his quest to create a world that’s welcoming to all races."
},
"web":{
"tmdb":8.2
},
"my":{
"seen":true
}
},
{
"n":2,
"name":{
"en":"Season 2",
"zh":"第 2 季"
},
"year":"2021",
"poster":"https://image.tmdb.org/t/p/w342/v6tZuRm81zUWGgODfxFvS6sW0Vm.jpg",
"episodeCount":24,
"overview":{
"en":"Now that the Jura Tempest Alliance is growing even further, they will now be meeting the animal kingdom of Eurazania, reuniting with King Gazel, rising tensions between monsters and humans, and Rimuru encountering the strongest enemy he’s ever faced."
},
"web":{
"tmdb":8.3
},
"my":{
"seen":true
}
},
{
"n":3,
"name":{
"en":"Season 3",
"zh":"第 3 季"
},
"year":"2024",
"poster":"https://image.tmdb.org/t/p/w342/p1t65WL9w6ZUB3axHmlP5V9t5gA.jpg",
"episodeCount":24,
"overview":{
"en":"After Clayman’s defeat, Rimuru returns home and learns that Diablo healed the nobles of Falmuth, securing their alliance with Tempest. Meanwhile, Hinata becomes suspicious of Rimuru’s growing power and confronts him—unaware that a powerful organization is pulling the strings behind the scenes."
},
"web":{
"tmdb":7.6
},
"my":{
"seen":true
}
},
{
"n":4,
"name":{
"en":"Season 4",
"zh":"第 4 季"
},
"year":"2026",
"poster":"https://image.tmdb.org/t/p/w342/94MjsZUyxubodMPJdWOVkcJ0bdU.jpg",
"episodeCount":24,
"overview":{
"en":"Demon Lord Rimuru's dream of creating an alliance between humans and monsters takes a step closer to being realized. As Tempest continues to prosper, Granville Rozzo and his granddaughter, Maribel Rozzo, clash with Demon Lord Rimuru over their plan to protect mankind by ruling over them. Meanwhile, in El Dorado, Demon Lord Leon works toward goals of his own. The awakening of a new Hero draws near!"
},
"web":{
"tmdb":8.3
},
"my":{
"seen":true
}
}
],
"my":{}
},
{
"id":"tm_t_105248",
"kind":"tv",
"status":"progress",
"source":{
"type":"tmdb",
"id":105248
},
"title":{
"en":"Cyberpunk: Edgerunners",
"zh":"電馭叛客：邊緣行者"
},
"originalTitle":"",
"overview":{
"en":"In a dystopia riddled with corruption and cybernetic implants, a talented but reckless street kid strives to become a mercenary outlaw — an edgerunner.",
"zh":"在貪墨成風的反烏托邦世界中，四處都是生化改造植入體。一個在街頭長大的魯莽天才少年努力想成為邊緣行者：拿錢辦事的法外之徒。"
},
"tagline":"New legends. Same Night City.",
"year":"2022",
"endYear":"",
"airing":"Returning Series",
"runtime":null,
"genres":[
"Animation",
"Action & Adventure",
"Sci-Fi & Fantasy",
"Crime"
],
"networks":[
"Netflix"
],
"people":{
"label":"Created by",
"names":[
"Rafał Jaki",
"Bartosz Sztybor"
],
"cast":[
"KENN",
"Koki Uchiyama",
"Momoka Terasawa",
"Akari Kito",
"Kentaro Tone",
"Kento Shiraishi",
"Aoi Yuki",
"Aoi Koga"
]
},
"poster":"https://image.tmdb.org/t/p/w500/v3JuB15WybKmxDeT1hWdK3j6eSJ.jpg",
"backdrop":"https://image.tmdb.org/t/p/w1280/4NmCfWHzytiKM3riCMcbVYBJhlB.jpg",
"web":{
"tmdb":8.5
},
"imdbId":"tt12590266",
"seasons":[
{
"n":1,
"name":{
"en":"Cyberpunk: Edgerunners",
"zh":"第 1 季"
},
"year":"2022",
"poster":"https://image.tmdb.org/t/p/w342/6MMjX9T0L7eoRfZFTnzC6WXYZLK.jpg",
"episodeCount":10,
"overview":{
"en":"In a dystopia riddled with corruption and cybernetic implants, a talented but reckless street kid strives to become a mercenary outlaw — an edgerunner."
},
"web":{
"tmdb":8.3
},
"my":{
"seen":true
}
},
{
"n":2,
"name":{
"en":"Cyberpunk: Edgerunners 2",
"zh":"第 2 季"
},
"year":"2026",
"poster":"https://image.tmdb.org/t/p/w342/w3XGb8zwhiq9sUEGWCPY0ZNOWmh.jpg",
"episodeCount":10,
"overview":{
"en":"Weak, a washed-up cyberpunk legend, is now forced to live without chrome as he searches for a sense of purpose in a world that’s passed him by. Meanwhile, the deadly nomad D sets out on a path to revenge that brings him close to corpo secrets never meant to be found."
},
"web":{
"tmdb":7.5
},
"my":{}
}
],
"my":{}
},
{
"id":"ol_OL893414W",
"kind":"book",
"status":"done",
"source":{
"type":"openlibrary",
"id":"/works/OL893414W"
},
"title":{
"en":"Dune",
"zh":"沙丘"
},
"year":"1965",
"pages":604,
"genres":[
"Science fiction"
],
"people":{
"label":"Written by",
"names":[
"Frank Herbert"
],
"cast":[]
},
"overview":{
"en":"The novel that started it all: politics, religion and ecology collide on the desert planet Arrakis.",
"zh":"一切的起點：政治、宗教與生態在沙漠星球厄拉科斯上激烈碰撞。"
},
"poster":"https://covers.openlibrary.org/b/id/11481354-L.jpg",
"backdrop":"",
"web":{
"openlibrary":4.3
},
"my":{}
},
{
"id":"ol_OL17267881W",
"kind":"book",
"status":"progress",
"source":{
"type":"openlibrary",
"id":"/works/OL17267881W"
},
"title":{
"en":"The Three-Body Problem",
"zh":"三體"
},
"year":"2008",
"genres":[
"Science fiction"
],
"people":{
"label":"Written by",
"names":[
"Liu Cixin"
],
"cast":[]
},
"overview":{
"en":"A secret military project sends signals into space — and an alien civilisation on the brink of destruction answers.",
"zh":"一項秘密軍事計劃向太空發出訊號，一個瀕臨毀滅的外星文明竟然作出回應。"
},
"poster":"https://covers.openlibrary.org/b/id/9157544-L.jpg",
"backdrop":"",
"web":{
"openlibrary":3.9
},
"my":{}
},
{
"id":"ol_OL1161171W",
"kind":"book",
"status":"done",
"source":{
"type":"openlibrary",
"id":"/works/OL1161171W"
},
"title":{
"en":"Nausea",
"zh":"嘔吐"
},
"originalTitle":"La Nausée",
"year":"1938",
"pages":240,
"genres":[
"Philosophical fiction",
"Existentialism"
],
"people":{
"label":"Written by",
"names":[
"Jean-Paul Sartre"
],
"cast":[]
},
"overview":{
"en":"Antoine Roquentin, a historian living alone in a grey seaside town, is overcome by a creeping disgust at the bare, meaningless existence of things — Sartre’s founding novel of existentialism.",
"zh":"歷史學者洛根丁獨居在灰暗的海港小城，逐漸被事物赤裸而毫無意義的「存在」所帶來的噁心感吞沒——沙特奠定存在主義的經典小說。"
},
"poster":"https://covers.openlibrary.org/b/id/598532-L.jpg",
"backdrop":"",
"web":{
"openlibrary":4.0
},
"my":{}
},
{
"id":"g_dune",
"kind":"group",
"name":{
"en":"Dune",
"zh":"沙丘"
},
"overview":{
"en":"The book and the films, together.",
"zh":"原著小說與電影，一次過收藏。"
},
"members":[
"ol_OL893414W",
"tm_m_438631",
"tm_m_693134"
]
},
{
"id":"g_marvel",
"kind":"group",
"name":{
"en":"Marvel Cinematic Universe",
"zh":"漫威電影宇宙"
},
"overview":{
"en":"Wakanda and the Avengers.",
"zh":"瓦干達與復仇者聯盟。"
},
"members":[
"tm_m_284054",
"tm_m_24428",
"tm_m_99861",
"tm_m_299536",
"tm_m_299534"
]
},
{
"id":"g_nolan",
"kind":"group",
"name":{
"en":"Christopher Nolan",
"zh":"基斯杜化·路蘭"
},
"overview":{
"en":"Time, physics and myth.",
"zh":"時間、物理與神話。"
},
"members":[
"tm_m_577922",
"tm_m_872585",
"tm_m_1368337"
]
},
{
"id":"g_mi",
"kind":"group",
"name":{
"en":"Mission: Impossible",
"zh":"職業特工隊系列"
},
"overview":{
"en":"Ethan Hunt, all eight missions.",
"zh":"伊森·韓特的八次任務。"
},
"source":{
"type":"tmdb-collection",
"id":87359
},
"members":[
"tm_m_954",
"tm_m_955",
"tm_m_956",
"tm_m_56292",
"tm_m_177677",
"tm_m_353081",
"tm_m_575264",
"tm_m_575265"
]
},
{
"id":"g_jw",
"kind":"group",
"name":{
"en":"John Wick",
"zh":"殺神 John Wick 系列"
},
"overview":{
"en":"Never touch his dog.",
"zh":"千萬別碰他的狗。"
},
"source":{
"type":"tmdb-collection",
"id":404609
},
"members":[
"tm_m_245891",
"tm_m_324552",
"tm_m_458156",
"tm_m_603692"
]
}
];

// Loads the list once per device, replacing the old demo titles. Returns how many were added.
export function loadStarter({ force = false } = {}) {
  const FLAG = 'shelf.starter.v1';
  let done = false;
  try { done = !!localStorage.getItem(FLAG); } catch {}
  if (done && !force) return 0;
  if (store.hasSamples()) store.removeSamples();
  // A fixed, old timestamp: anything you've edited on another device always wins over this list.
  const base = Date.parse('2026-10-27T00:00:00Z');
  const fresh = RECORDS.filter((r) => !store.get(r.id)).map((r) => {
    const i = RECORDS.indexOf(r);
    const at = new Date(base - i * 60000).toISOString();
    return { ...structuredClone(r), addedAt: at, updatedAt: at };
  });
  if (fresh.length) store.seed(fresh);
  try { localStorage.setItem(FLAG, '1'); } catch {}
  return fresh.length;
}
