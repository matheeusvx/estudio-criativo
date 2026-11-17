'use strict';
/* =========================================================
   Estúdio Criativo — gestor de vídeos (TikTok · Instagram · YouTube)
   Dados ficam salvos no navegador (localStorage). Use
   Configurações → Exportar para fazer backup.
   ========================================================= */

const STORE_KEY = 'estudio-criativo.v1';
const PLATFORMS = {
  tiktok: { name: 'TikTok', short: 'TT', color: '#0b1b3a' },
  instagram: { name: 'Instagram', short: 'IG', color: '#7cb4fb' },
  youtube: { name: 'YouTube', short: 'YT', color: '#2563eb' },
};
const PKEYS = Object.keys(PLATFORMS);
const STATUS = { ideia: 'Ideia', roteiro: 'Roteiro', gravacao: 'Gravação', edicao: 'Edição', agendado: 'Agendado', publicado: 'Publicado' };
const PIPE = ['ideia', 'roteiro', 'gravacao', 'edicao', 'agendado'];
const FORMATS = ['História real', 'Mito ou verdade', 'E se...?', 'Desafio', 'Curiosidade', 'Lista / Top', 'Explicativo', 'Storytelling', 'Comparação', 'Trend'];
const SEED_VERSION = 2;
const MET = [['views', 'Views'], ['likes', 'Curtidas'], ['comments', 'Coment.'], ['shares', 'Compart.'], ['saves', 'Salvos']];
const WD = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const WD_FULL = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const MON = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const TEMPLATES = [
  ['{T}: 3 fatos que ninguém te contou', 'Lista / Top'],
  ['{T} explicado em 60 segundos', 'Explicativo'],
  ['Mito ou verdade? O que dizem sobre {t}', 'Mito ou verdade'],
  ['O maior mistério envolvendo {t}', 'Storytelling'],
  ['Top 5 curiosidades sobre {t}', 'Lista / Top'],
  ['Como seria visitar {t} de verdade?', 'Curiosidade'],
  ['O erro que todo mundo comete sobre {t}', 'Curiosidade'],
  ['{T} em escala: uma comparação que vai te chocar', 'Comparação'],
  ['A coisa mais bizarra sobre {t}', 'Curiosidade'],
  ['Você sabia? {T} em números', 'Lista / Top'],
  ['Respondendo seguidores: tudo sobre {t}', 'Explicativo'],
  ['A história real por trás de {t}', 'Storytelling'],
  ['Teste rápido: quanto você sabe sobre {t}?', 'Mito ou verdade'],
  ['3 perguntas sobre {t} que a ciência ainda não respondeu', 'Curiosidade'],
];

/* ---------- Icons ---------- */
const ICONS = {
  home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  video: '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m22 8-6 4 6 4V8Z"/>',
  trend: '<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
  trendDown: '<path d="m22 17-8.5-8.5-5 5L2 7"/><path d="M16 17h6v-6"/>',
  bulb: '<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z"/>',
  trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
  repeat: '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
  alert: '<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  sparkles: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 3v4M21 5h-4"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  chevL: '<path d="m15 18-6-6 6-6"/>',
  chevR: '<path d="m9 18 6-6-6-6"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  layers: '<path d="m12 2 10 5-10 5L2 7l10-5Z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
  arrowR: '<path d="M5 12h14M12 5l7 7-7 7"/>',
  arrowUR: '<path d="M7 17 17 7M7 7h10v10"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  panel: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 3v18"/>',
  bars: '<path d="M3 3v18h18"/><path d="M8 17v-5M13 17V8M18 17v-9"/>',
};
const icon = (n, cls = 'i') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${ICONS[n] || ''}</svg>`;

/* ---------- Utils ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = (n) => String(n).padStart(2, '0');
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const between = (s, a, b) => { if (!s) return false; const d = parse(s); return d >= a && d <= b; };
const fmtDate = (s) => { if (!s) return 'Sem data'; const d = parse(s); return `${pad(d.getDate())} ${MON[d.getMonth()]}`; };
const nf = new Intl.NumberFormat('pt-BR');
const cf = new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 });
const fmtN = (n) => nf.format(Math.round(n || 0));
const compact = (n) => (Math.abs(n) < 1000 ? fmtN(n) : cf.format(n));
const pct = (n, d = 1) => `${(n * 100).toFixed(d).replace('.', ',')}%`;
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const sum = (a) => a.reduce((s, x) => s + x, 0);
const avg = (a) => (a.length ? sum(a) / a.length : 0);
const median = (a) => { if (!a.length) return 0; const s = [...a].sort((x, y) => x - y); const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const pick = (r, a) => a[Math.floor(r() * a.length)];
function greeting() { const h = new Date().getHours(); return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'; }

/* ---------- Default data ---------- */
function idea(title, tag, format, hook, why, score = 4) { return { title, tag, format, hook, why, score }; }
function defaultChannels() {
  return {
    planeta: {
      name: 'Planeta Compacto', color: '#2563eb', tagline: 'Segue pra entender o mundo em 1 minuto',
      niche: 'Histórias reais que parecem inventadas: mitos da história, guerras absurdas e o Brasil no meio de conflitos mundiais — explicados em cerca de 1 minuto com animação 2D e mapas.',
      pattern: [
        'Gancho-paradoxo na 1ª frase: um fato que contradiz o que todo mundo acha ("O baixinho mais famoso da história não era baixinho").',
        'CTA cedo (~3s): "Segue o perfil, porque…" já prometendo a revelação.',
        'Contexto com data e lugar, contado com mapa animado ou personagem.',
        'Virada: "E aqui vem a parte boa" / "A parte que quase ninguém conta?".',
        'Fecho em uma frase de efeito que resume a lição.',
        'Pergunta binária pros comentários: SIM ou NÃO, ARTE ou PROPAGANDA.',
      ],
      specs: '60–90s · 9:16 · narração + legenda grande · mapas e personagens 2D',
      topics: ['Mitos da história', 'Guerras absurdas', 'Brasil x mundo', 'Propaganda de guerra', 'Tratados e fronteiras', 'Personagens históricos'],
      templates: [
        ['{T}: a parte que quase ninguém conta', 'História real'],
        ['O mito sobre {t} que todo mundo aprendeu errado', 'Mito ou verdade'],
        ['{T}: uma história real que parece inventada', 'História real'],
        ['Mito ou verdade? {T}', 'Mito ou verdade'],
        ['Como {t} virou propaganda', 'Storytelling'],
        ['O que o Brasil tem a ver com {t}?', 'História real'],
      ],
      ideas: [
        idea('A Guerra do Emu: o exército que perdeu para pássaros', 'Guerras absurdas', 'História real', 'Um exército com metralhadoras perdeu uma guerra… para pássaros.', 'Mesmo gatilho da Guerra das Lagostas: “guerra” com motivo absurdo', 5),
        idea('A Guerra do Futebol: o jogo que virou guerra de verdade', 'Guerras absurdas', 'História real', 'Uma partida de futebol terminou em guerra entre dois países.', 'Guerra absurda + futebol, tema que o brasileiro ama', 5),
        idea('A guerra mais curta da história durou 38 minutos', 'Guerras absurdas', 'História real', 'Teve guerra que acabou mais rápido que um episódio de série.', 'Número chocante logo no gancho, cabe fácil em 60s', 4),
        idea('A Guerra dos Doces: a França invadiu o México por causa de um confeiteiro', 'Guerras absurdas', 'História real', 'A França mandou navios de guerra por causa de uma confeitaria.', 'Repete a fórmula “França + motivo bobo” das lagostas', 4),
        idea('A Guerra do Bacalhau: a Islândia enfrentou a Marinha britânica', 'Guerras absurdas', 'História real', 'Igual à Guerra da Lagosta, só que com peixe — e a Islândia ganhou.', 'Continuação natural da Guerra das Lagostas', 4),
        idea('A Guerra do Porco: EUA e Inglaterra quase brigaram por um porco', 'Guerras absurdas', 'História real', 'Dois impérios mandaram soldados para uma ilha por causa de um porco.', 'Guerra absurda com personagem animal fácil de animar', 4),
        idea('O Brasil comprou o Acre por um cavalo?', 'Brasil x mundo', 'Mito ou verdade', 'Dizem que o Brasil trocou o Acre por um cavalo. Quase isso.', 'Mito + Brasil: junta os dois pilares do canal', 5),
        idea('Fordlândia: a cidade americana que Henry Ford construiu na Amazônia', 'Brasil x mundo', 'História real', 'O homem mais rico do mundo ergueu uma cidade americana no meio da Amazônia — e ela fracassou.', 'Brasil x EUA, mesma linha do Zé Carioca', 4),
        idea('“A cobra vai fumar”: a origem da expressão da FEB', 'Brasil x mundo', 'História real', 'Diziam que era mais fácil uma cobra fumar do que o Brasil ir pra guerra.', 'Brasil na 2ª Guerra, sequência direta do Zé Carioca', 5),
        idea('Carmen Miranda foi uma arma diplomática?', 'Propaganda de guerra', 'Mito ou verdade', 'A brasileira mais famosa de Hollywood virou peça de uma aliança de guerra.', 'Parte 2 do Zé Carioca: mesma política da boa vizinhança', 5),
        idea('O grito do Ipiranga foi do jeito do quadro?', 'Mitos da história', 'Mito ou verdade', 'O quadro mais famoso da Independência foi pintado 66 anos depois — e caprichou na ficção.', 'Mito famoso + pergunta SIM/NÃO no fim', 4),
        idea('Vikings usavam capacete com chifres?', 'Mitos da história', 'Mito ou verdade', 'O viking mais famoso do cinema nunca existiu.', 'Mesmo formato do Napoleão: imagem popular x realidade', 4),
        idea('Maria Antonieta nunca disse “que comam brioches”', 'Mitos da história', 'Mito ou verdade', 'A frase mais famosa da Revolução Francesa provavelmente nunca foi dita.', 'Mito + propaganda contra um governante, igual ao Napoleão', 4),
        idea('Einstein era ruim em matemática?', 'Mitos da história', 'Mito ou verdade', 'O gênio que “reprovou em matemática” nunca reprovou.', 'Mito conhecido por todo mundo, ótimo pra comentários', 3),
        idea('A Muralha da China dá pra ver do espaço?', 'Mitos da história', 'Mito ou verdade', 'Astronautas tentaram achar a Muralha da China lá de cima.', 'Mito + mapa/escala, bom pra animação', 3),
        idea('Colombo provou que a Terra era redonda?', 'Mitos da história', 'Mito ou verdade', 'Na época de Colombo, quase ninguém achava que a Terra era plana.', 'Mito escolar, gera debate', 3),
        idea('Por que o Brasil fala português e os vizinhos falam espanhol?', 'Tratados e fronteiras', 'Explicativo', 'Uma linha imaginária decidiu a língua que você fala.', 'Usa os mapas animados que já funcionam no canal', 4),
        idea('Santos Dumont ou irmãos Wright: quem inventou o avião?', 'Brasil x mundo', 'Mito ou verdade', 'Brasil e EUA brigam até hoje por causa de um voo de 1906.', 'Brasil x EUA + pergunta binária perfeita', 5),
      ],
    },
    nico: {
      name: 'Nico Verso', color: '#38bdf8', tagline: 'Roblox e games com o Nico',
      niche: 'Roblox e outros games com o Nico: situações “E se…?” com um contador subindo, upgrades de avatar e um final engraçado com a mãe.',
      pattern: [
        'Título em pergunta “E se eu…?” com um número absurdo (1 Robux por segundo).',
        'Contador na tela que só sobe: minuto → hora → dia 1 → dia 7.',
        'Recompensa visual a cada salto: loja, óculos, asas, coroa.',
        'Troca de cenário: do quarto para o mundo do jogo (parkour, obby).',
        'Final com piada de família: “Mãe, me ensina.”',
        'Cerca de 50s, ritmo rápido, legenda palavra a palavra com destaque.',
      ],
      specs: '45–60s · 9:16 · Nico + mãe recorrentes · cores saturadas estilo Roblox',
      topics: ['Roblox · E se', 'Roblox · Desafio', 'Jogos em alta', 'Nico e a mãe', 'Outros games'],
      templates: [
        ['E se eu ganhasse 1 {t} por segundo?', 'E se...?'],
        ['E se eu passasse 7 dias seguidos no {t}?', 'E se...?'],
        ['E se eu tivesse {t} infinito?', 'E se...?'],
        ['E se eu fosse o dono do {t} por um dia?', 'E se...?'],
        ['Nico vs Mãe no {t}: quem ganha?', 'Desafio'],
        ['E se minha mãe jogasse {t} comigo?', 'E se...?'],
      ],
      ideas: [
        idea('E se eu ganhasse 1 Robux por segundo durante um MÊS?', 'Roblox · E se', 'E se...?', 'Uma semana deu 604.800. E um mês inteiro?', 'Parte 2 do primeiro vídeo — aproveita quem já viu', 5),
        idea('E se eu ganhasse 1 nível por segundo no Blox Fruits?', 'Roblox · E se', 'E se...?', 'Nível 1 no café da manhã, nível máximo antes do almoço.', 'Mesma fórmula do contador, num dos jogos mais jogados', 5),
        idea('E se eu tivesse 1 milhão de Robux, mas só 1 hora pra gastar?', 'Roblox · E se', 'E se...?', 'Um milhão de Robux. Um cronômetro. Valendo!', 'Inverte o contador: agora ele desce — tensão garantida', 5),
        idea('E se cada vez que eu caísse no obby eu ganhasse 100 Robux?', 'Roblox · E se', 'E se...?', 'Pela primeira vez, cair é a melhor coisa que pode acontecer.', 'Contador + obby, cenário que já existe no Nico', 4),
        idea('E se a lava subisse 1 bloco por minuto?', 'Roblox · Desafio', 'Desafio', 'Minuto 1: tranquilo. Minuto 10: corre, Nico!', 'Contador de tempo + perigo crescente', 4),
        idea('E se minha mãe virasse a melhor jogadora do Roblox?', 'Nico e a mãe', 'E se...?', 'Eu ensinei minha mãe a jogar. Erro meu.', 'Expande a piada final que fechou o 1º vídeo', 5),
        idea('Nico vs Mãe: quem passa do obby mais difícil?', 'Nico e a mãe', 'Desafio', 'Ela disse que era fácil. Ela não sabia o que era um obby.', 'Personagens recorrentes criam série', 4),
        idea('E se eu fosse o último jogador do servidor?', 'Roblox · E se', 'E se...?', 'Entrei no servidor e não tinha mais ninguém. Nem os NPCs.', 'Mistério leve, bom pra retenção', 3),
        idea('E se eu virasse prefeito de Brookhaven por um dia?', 'Roblox · E se', 'E se...?', 'Primeira lei: todo mundo tem que usar coroa.', 'Brookhaven é um dos jogos mais populares entre crianças', 4),
        idea('E se eu pudesse pegar qualquer brainrot no Steal a Brainrot?', 'Jogos em alta', 'E se...?', 'Todo brainrot do servidor agora é meu.', 'Jogo em alta = busca e recomendação a favor', 4),
        idea('E se minha planta crescesse 1 metro por segundo no Grow a Garden?', 'Jogos em alta', 'E se...?', 'Plantei uma semente. Em um minuto, ela passou das nuvens.', 'Contador + jogo em alta', 4),
        idea('E se eu ganhasse 1 pet lendário por minuto no Adopt Me?', 'Roblox · E se', 'E se...?', 'Em uma hora, 60 lendários. Em um dia… não cabe na casa.', 'Contador + coleção visual que cresce', 4),
        idea('E se meu avatar ficasse 1% maior a cada segundo?', 'Roblox · E se', 'E se...?', 'Um minuto depois, eu não cabia mais no meu quarto.', 'Efeito visual forte e fácil de animar', 3),
        idea('E se eu ganhasse 1 diamante por segundo no Minecraft?', 'Outros games', 'E se...?', 'Uma hora: 3.600 diamantes. Uma casa inteira de diamante.', 'Testa a fórmula fora do Roblox', 3),
      ],
    },
  };
}

function emptyState() {
  return { version: 1, seedVersion: SEED_VERSION, demo: false, channels: defaultChannels(), goals: { planeta: 30, nico: 15 }, videos: [], followers: [], prefs: { filter: 'all' } };
}

/* ---------- Vídeos reais já publicados ---------- */
const EP = 'C:\\Users\\Sucesso\\Downloads\\workshop-animacao-kit\\episodios\\';
function realVideos() {
  const base = { status: 'publicado', platforms: [...PKEYS], metrics: {} };
  return [
    { ...base, id: 'pc-ep001', channel: 'planeta', title: 'Napoleão era baixinho?', date: '2026-11-15', time: '21:00', tag: 'Mitos da história', format: 'Mito ou verdade', duration: 83,
      notes: 'Gancho: "O baixinho mais famoso da história não era baixinho."\nVirada: polegada francesa x inglesa + caricaturas de James Gillray.\nCTA final: acreditava no mito? SIM ou NÃO.\nArquivo: ' + EP + 'ep001-napoleao-baixinho\\out\\ep001-napoleao-baixinho.mp4' },
    { ...base, id: 'pc-ep002', channel: 'planeta', title: 'Zé Carioca foi pra guerra?', date: '2026-11-16', time: '19:00', tag: 'Brasil x mundo', format: 'História real', duration: 90,
      notes: 'Gancho: "Um papagaio brasileiro foi recrutado pra Segunda Guerra Mundial."\nVirada: Disney + política da boa vizinhança, estreia no Rio em 1942. Mapas animados.\nCTA final: ARTE ou PROPAGANDA?\nArquivo: ' + EP + 'ep002-ze-carioca-guerra\\out\\ep002-ze-carioca-guerra.mp4' },
    { ...base, id: 'pc-ep003', channel: 'planeta', title: 'A Guerra das Lagostas: Brasil e França', date: '2026-11-17', time: '19:00', tag: 'Guerras absurdas', format: 'História real', duration: 59,
      notes: 'Gancho: "Brasil e França mobilizaram navios de guerra por causa de lagostas."\nVirada: a lagosta anda ou nada? (plataforma continental).\nCTA final: já conhecia essa história?\nArquivo: ' + EP + 'ep003-guerra-das-lagostas\\out\\ep003-guerra-das-lagostas.mp4' },
    { ...base, id: 'nv-ep001', channel: 'nico', title: 'E se eu ganhasse 1 Robux por segundo durante uma semana?', date: '2026-11-17', time: '18:00', tag: 'Roblox · E se', format: 'E se...?', duration: 49,
      notes: 'Contador: 60 → 3.600 → 86.400 → 604.800 Robux. Quarto → loja de avatar → parkour.\nFinal: "Mãe, me ensina."\nArquivo: ' + EP + 'ep001-nico-robux\\out\\ep001-nico-robux.mp4' },
  ];
}
function demoState() {
  const s = emptyState();
  s.demo = true;
  const r = rng(2026);
  const t = today();
  const fmts = FORMATS;
  const base = { tiktok: 2600, instagram: 1300, youtube: 800 };
  const chanMult = { planeta: 1.15, nico: 0.85 };
  const dayBoost = [0.9, 0.85, 0.95, 1.0, 1.25, 1.1, 1.15];
  for (let back = 84; back >= 1; back--) {
    const d = addDays(t, -back);
    for (const ch of ['planeta', 'nico']) {
      if (r() > (ch === 'planeta' ? 0.3 : 0.24)) continue;
      const topic = pick(r, s.channels[ch].topics);
      const format = pick(r, fmts);
      const pfs = r() < 0.7 ? [...PKEYS] : r() < 0.5 ? ['tiktok', 'instagram'] : ['tiktok', 'youtube'];
      const growth = 0.55 + (84 - back) / 84 * 0.9;
      const viral = r() < 0.07 ? 5 + r() * 5 : 1;
      const topicBoost = /buracos|vulc|oceano|Marte|animais/.test(topic) ? 1.5 : 1;
      const metrics = {};
      for (const p of pfs) {
        const v = Math.round(base[p] * chanMult[ch] * growth * viral * topicBoost * dayBoost[d.getDay()] * (0.45 + r() * 1.2));
        const er = (p === 'instagram' ? 0.085 : p === 'tiktok' ? 0.07 : 0.055) * (0.7 + r() * 0.7);
        const inter = v * er;
        metrics[p] = { views: v, likes: Math.round(inter * 0.72), comments: Math.round(inter * 0.07), shares: Math.round(inter * 0.11), saves: Math.round(inter * 0.1) };
      }
      s.videos.push({
        id: uid() + back + ch, title: demoTitle(r, topic), channel: ch, status: 'publicado', date: iso(d),
        time: pick(r, ['12:00', '18:30', '19:00', '20:00']), platforms: pfs, tag: topic, format,
        duration: Math.round(25 + r() * 60), notes: '', metrics,
      });
    }
  }
  const upcoming = [
    [1, 'planeta', 'agendado', 'auroras boreais'], [2, 'nico', 'agendado', 'buracos negros'], [3, 'planeta', 'edicao', 'oceano profundo'],
    [5, 'nico', 'edicao', 'Marte'], [6, 'planeta', 'gravacao', 'ilhas isoladas'], [8, 'nico', 'roteiro', 'viagem no tempo'],
    [10, 'planeta', 'roteiro', 'vulcões'], [13, 'nico', 'ideia', 'matéria escura'],
  ];
  for (const [dd, ch, st, topic] of upcoming) {
    s.videos.push({ id: uid() + dd, title: demoTitle(r, topic), channel: ch, status: st, date: iso(addDays(t, dd)), time: '19:00', platforms: [...PKEYS], tag: topic, format: pick(r, fmts), duration: 45, notes: '', metrics: {} });
  }
  s.videos.push({ id: uid() + 'i1', title: 'Por que o céu de Marte é vermelho?', channel: 'nico', status: 'ideia', date: '', time: '', platforms: [...PKEYS], tag: 'Marte', format: 'Explicativo', duration: '', notes: '', metrics: {} });
  s.videos.push({ id: uid() + 'i2', title: 'O lugar mais seco do planeta', channel: 'planeta', status: 'ideia', date: '', time: '', platforms: [...PKEYS], tag: 'desertos', format: 'Curiosidade', duration: '', notes: '', metrics: {} });
  // follower snapshots, weekly
  const fBase = { planeta: { tiktok: 900, instagram: 420, youtube: 160 }, nico: { tiktok: 600, instagram: 300, youtube: 110 } };
  for (let w = 12; w >= 0; w--) {
    const d = iso(addDays(t, -w * 7));
    for (const ch of ['planeta', 'nico']) for (const p of PKEYS) {
      const g = Math.pow(1.12 + (p === 'tiktok' ? 0.04 : 0), 12 - w);
      s.followers.push({ date: d, channel: ch, platform: p, value: Math.round(fBase[ch][p] * g) });
    }
  }
  return s;
}
function demoTitle(r, topic) { return ideaTitle(pick(r, TEMPLATES), topic); }

/* ---------- State ---------- */
let S = load();
const ui = {
  page: 'inicio', filter: S.prefs?.filter || 'all', period: 30, calMonth: (() => { const d = today(); d.setDate(1); return d; })(),
  sort: { key: 'date', dir: -1 }, search: '', platform: 'all', ideaSeed: 1, ideaTopic: '',
};
function load() {
  let s = null, ver = 0;
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) { const p = JSON.parse(raw); ver = p.seedVersion || 0; s = Object.assign(emptyState(), p); }
  } catch (e) { /* storage indisponível */ }
  if (!s || s.demo) { s = emptyState(); ver = 0; }
  if (ver < SEED_VERSION) {
    const d = defaultChannels();
    for (const k of Object.keys(d)) s.channels[k] = Object.assign({}, s.channels[k] || {}, d[k]);
    s.goals = Object.assign({}, emptyState().goals);
    for (const v of realVideos()) if (!s.videos.some((x) => x.id === v.id)) s.videos.push(v);
    s.seedVersion = SEED_VERSION;
  }
  return s;
}
function save() {
  S.prefs = { filter: ui.filter };
  try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) { toast('Não foi possível salvar no navegador'); }
}
const chName = (c) => S.channels[c]?.name || c;
const chColor = (c) => S.channels[c]?.color || '#2563eb';
const chOk = (v) => ui.filter === 'all' || v.channel === ui.filter;
const vids = () => S.videos.filter(chOk);
const published = () => vids().filter((v) => v.status === 'publicado' && v.date);
const activeChannels = () => (ui.filter === 'all' ? Object.keys(S.channels) : [ui.filter]);

const met = (v, p) => (v.metrics && v.metrics[p]) || {};
function stat(v, field, p = 'all') {
  const ks = p === 'all' ? v.platforms : v.platforms.includes(p) ? [p] : [];
  return sum(ks.map((k) => +met(v, k)[field] || 0));
}
const views = (v, p) => stat(v, 'views', p);
const inter = (v, p = 'all') => stat(v, 'likes', p) + stat(v, 'comments', p) + stat(v, 'shares', p) + stat(v, 'saves', p);
const engRate = (list, p = 'all') => { const vv = sum(list.map((v) => views(v, p))); return vv ? sum(list.map((v) => inter(v, p))) / vv : 0; };

function followersAt(date, chans = activeChannels(), plats = PKEYS) {
  let total = 0;
  for (const c of chans) for (const p of plats) {
    const snaps = S.followers.filter((f) => f.channel === c && f.platform === p && f.date <= date).sort((a, b) => (a.date < b.date ? 1 : -1));
    if (snaps[0]) total += snaps[0].value;
  }
  return total;
}

/* ---------- Tooltip / toast ---------- */
const tip = () => $('#tip');
document.addEventListener('mouseover', (e) => {
  const el = e.target.closest('[data-tip]');
  if (!el) { tip().classList.remove('show'); return; }
  tip().innerHTML = el.getAttribute('data-tip');
  tip().classList.add('show');
});
document.addEventListener('mousemove', (e) => {
  const t = tip(); if (!t.classList.contains('show')) return;
  const w = t.offsetWidth, h = t.offsetHeight;
  let x = e.clientX + 14, y = e.clientY - h - 12;
  if (x + w > innerWidth - 8) x = e.clientX - w - 14;
  if (y < 8) y = e.clientY + 18;
  t.style.left = x + 'px'; t.style.top = y + 'px';
});
let toastT;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2200); }

/* ---------- Charts (SVG, sem dependências) ---------- */
function niceMax(v) { if (v <= 0) return 10; const p = Math.pow(10, Math.floor(Math.log10(v))); const n = v / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p; }
let clipN = 0;
function drawBars(el, { labels, series, height = 250, fmt = compact }) {
  const W = Math.max(el.clientWidth, 280), H = height, pl = 44, pr = 6, pt = 10, pb = 28;
  const n = labels.length, iw = W - pl - pr, ih = H - pt - pb, slot = iw / n, bw = Math.min(42, slot * 0.6);
  const totals = labels.map((_, i) => sum(series.map((s) => s.values[i])));
  const max = niceMax(Math.max(...totals, 4));
  let g = '';
  for (let k = 0; k <= 4; k++) { const y = pt + ih - (ih * k) / 4; g += `<line x1="${pl}" x2="${W - pr}" y1="${y}" y2="${y}" class="grid-l"/><text x="${pl - 10}" y="${y + 4}" text-anchor="end" class="ax">${compact((max * k) / 4)}</text>`; }
  labels.forEach((l, i) => {
    const x = pl + slot * i + (slot - bw) / 2, id = 'cb' + ++clipN, th = (ih * totals[i]) / max;
    const tipH = `<b>${esc(l)}</b><br>` + series.map((s) => `<span style="color:${s.color === '#0b1b3a' ? '#93c5fd' : s.color}">●</span> ${esc(s.name)}: ${fmt(s.values[i])}`).join('<br>') + (series.length > 1 ? `<br>Total: ${fmt(totals[i])}` : '');
    g += `<g class="hb" data-tip="${esc(tipH)}"><rect x="${pl + slot * i}" y="${pt}" width="${slot}" height="${ih}" fill="transparent"/><rect class="track" x="${x}" y="${pt}" width="${bw}" height="${ih}" rx="10"/>`;
    g += `<clipPath id="${id}"><rect x="${x}" y="${pt + ih - th}" width="${bw}" height="${th}" rx="10"/></clipPath><g clip-path="url(#${id})">`;
    let y0 = pt + ih;
    series.forEach((s) => { const h = (ih * s.values[i]) / max; if (h <= 0) return; y0 -= h; g += `<rect x="${x}" y="${y0}" width="${bw}" height="${h + 0.5}" fill="${s.color}"/>`; });
    g += `</g></g>`;
    g += `<text x="${pl + slot * i + slot / 2}" y="${H - 8}" text-anchor="middle" class="ax">${esc(l)}</text>`;
  });
  el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" height="${H}">${g}</svg>`;
}
function smoothPath(pts) {
  if (pts.length < 2) return pts.length ? `M${pts[0][0]},${pts[0][1]}` : '';
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`;
  }
  return d;
}
function drawLine(el, { labels, series, height = 250, fmt = compact }) {
  const W = Math.max(el.clientWidth, 280), H = height, pl = 44, pr = 10, pt = 12, pb = 28;
  const n = labels.length, iw = W - pl - pr, ih = H - pt - pb;
  const max = niceMax(Math.max(4, ...series.flatMap((s) => s.values)));
  const X = (i) => pl + (n === 1 ? iw / 2 : (iw * i) / (n - 1)), Y = (v) => pt + ih - (ih * v) / max;
  let g = '<defs>';
  series.forEach((s, si) => { g += `<linearGradient id="lg${clipN}_${si}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s.color}" stop-opacity=".22"/><stop offset="1" stop-color="${s.color}" stop-opacity="0"/></linearGradient>`; });
  g += '</defs>';
  for (let k = 0; k <= 4; k++) { const y = pt + ih - (ih * k) / 4; g += `<line x1="${pl}" x2="${W - pr}" y1="${y}" y2="${y}" class="grid-l"/><text x="${pl - 10}" y="${y + 4}" text-anchor="end" class="ax">${compact((max * k) / 4)}</text>`; }
  const step = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(iw / 64))));
  labels.forEach((l, i) => { if (i % step === 0 || i === n - 1) g += `<text x="${X(i)}" y="${H - 8}" text-anchor="middle" class="ax">${esc(l)}</text>`; });
  series.forEach((s, si) => {
    const pts = s.values.map((v, i) => [X(i), Y(v)]);
    const d = smoothPath(pts);
    g += `<path d="${d} L${X(n - 1)},${pt + ih} L${X(0)},${pt + ih} Z" fill="url(#lg${clipN}_${si})"/>`;
    g += `<path d="${d}" fill="none" stroke="${s.color}" stroke-width="2.4" stroke-linecap="round"/>`;
  });
  clipN++;
  const cw = n > 1 ? iw / (n - 1) : iw;
  labels.forEach((l, i) => {
    const tipH = `<b>${esc(l)}</b><br>` + series.map((s) => `<span style="color:${s.color === '#0b1b3a' ? '#93c5fd' : s.color}">●</span> ${esc(s.name)}: ${fmt(s.values[i])}`).join('<br>');
    g += `<rect class="hcol" x="${X(i) - cw / 2}" y="${pt}" width="${cw}" height="${ih}" data-tip="${esc(tipH)}"/>`;
  });
  el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" height="${H}">${g}</svg>`;
}
function donutSVG(items, { size = 180, label = '', value = '' } = {}) {
  const r = size / 2 - 14, c = 2 * Math.PI * r, total = sum(items.map((i) => i.value)) || 1;
  let off = 0, g = `<circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="#f2f5fa" stroke-width="22"/>`;
  items.forEach((it) => {
    const len = (it.value / total) * c;
    if (len > 0) g += `<circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${it.color}" stroke-width="22" stroke-dasharray="${Math.max(len - 3, 0.1)} ${c}" stroke-dashoffset="${-off}" transform="rotate(-90 ${size / 2} ${size / 2})" data-tip="<b>${esc(it.name)}</b><br>${compact(it.value)} · ${pct(it.value / total)}" style="cursor:pointer"/>`;
    off += len;
  });
  g += `<text x="50%" y="${size / 2 - 2}" text-anchor="middle" font-size="22" font-weight="600" fill="#0b1630">${value}</text><text x="50%" y="${size / 2 + 18}" text-anchor="middle" font-size="11.5" fill="#7a8699">${label}</text>`;
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">${g}</svg>`;
}
function gaugeSVG(ratio, { w = 260 } = {}) {
  const N = 20, cx = w / 2, cy = w / 2 + 4, r1 = w / 2 - 44, r2 = w / 2 - 12, on = Math.round(Math.min(ratio, 1) * N);
  let g = '';
  for (let i = 0; i < N; i++) {
    const a = Math.PI - (Math.PI * (i + 0.5)) / N;
    const x1 = cx + r1 * Math.cos(a), y1 = cy - r1 * Math.sin(a), x2 = cx + r2 * Math.cos(a), y2 = cy - r2 * Math.sin(a);
    const t = i / (N - 1);
    const col = i < on ? `hsl(${217 + t * -10}, ${88 - t * 10}%, ${50 + t * 18}%)` : '#edf1f7';
    g += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="13" stroke-linecap="round"/>`;
  }
  return `<svg viewBox="0 0 ${w} ${w / 2 + 14}" width="100%" style="max-width:${w}px">${g}<text x="${cx}" y="${cy - 26}" text-anchor="middle" font-size="32" font-weight="600" fill="#0b1630" letter-spacing="-1">${Math.round(ratio * 100)}%</text><text x="${cx}" y="${cy - 6}" text-anchor="middle" font-size="12" fill="#7a8699">da meta do mês</text></svg>`;
}
function sparkSVG(values, color = '#fff') {
  const max = Math.max(...values, 1), n = values.length;
  const pts = values.map((v, i) => [(i / (n - 1 || 1)) * 100, 28 - (v / max) * 24]);
  return `<svg viewBox="0 0 100 30" preserveAspectRatio="none" width="100%" height="100%"><path d="${smoothPath(pts)}" fill="none" stroke="${color}" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linecap="round"/></svg>`;
}


/* ---------- Gráfico empilhado por dia (port do FinancialBreakdownChart / graphic.tsx) ----------
   Totais por série no topo (clicar mostra/oculta a série), uma barra empilhada por dia com cantos
   externos arredondados e 1px entre segmentos, grade tracejada, coluna destacando o dia ativo e
   tooltip escuro. Hover pré-visualiza, clique/setas selecionam. Entrada: totais contam, barras
   empilham segmento a segmento da esquerda pra direita, depois a coluna sobe e o tooltip aparece. */
function mountBreakdown(el, { title, series, data, selected, link = '#analytics', linkLabel = 'Ver dados' }) {
  const H = 240, GT = 16, GB = 236, BASE = GB - 1, SPAN = GB - GT;
  const BW = 32, RATIO = 32 / 60, R = 4, GAP = 1, PAD = 8, TGAP = 10, DELAY = 0.18;
  const n = data.length;
  if (!n) { el.innerHTML = ''; return; }
  const reduce = ui.noAnim || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp01 = (x) => Math.min(1, Math.max(0, x));
  const outCubic = (t) => 1 - (1 - t) ** 3;
  const outExpo = (t) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));
  const dayAxis = (s) => { const d = parse(s); return `${d.getDate()} ${MON[d.getMonth()]}`; };
  const dayTip = (s) => { const d = parse(s); return `${WD[d.getDay()]}, ${d.getDate()} ${MON[d.getMonth()]}`; };
  const totals = series.map((s) => sum(data.map((d) => d.values[s.key] || 0)));
  const id = 'bd' + ++clipN;
  const st = { hidden: new Set(), sel: Math.min(Math.max(selected ?? n - 1, 0), n - 1), hov: null, w: series.map(() => 1), grow: data.map(() => (reduce ? 1 : 0)), count: reduce ? 1 : 0, hi: 1, raf: 0 };
  const shownMax = () => {
    const top = (all) => Math.max(0, ...data.map((d) => sum(series.map((s) => (all || !st.hidden.has(s.key) ? d.values[s.key] || 0 : 0)))));
    return top(false) || top(true);
  };
  const ticksFor = (m) => { const step = niceMax(Math.max(m, 3) / 3); return [0, step, step * 2, step * 3]; };
  let ticks = ticksFor(shownMax());
  st.hi = ticks[3];

  el.innerHTML = `
    <div class="bd-head">
      <div class="bd-title"><span class="bd-tile">${icon('bars')}</span><h3>${esc(title)}</h3></div>
      <a class="btn btn-sm btn-ghost" href="${link}">${linkLabel} ${icon('arrowUR')}</a>
    </div>
    <div class="bd-stats" role="group" aria-label="Séries">${series.map((s, k) => `
      <button type="button" class="bd-stat" aria-pressed="true"><span class="l"><i class="bd-sw ${reduce ? '' : 'grow'}" style="background:${s.color};animation-delay:${100 + k * 90}ms"></i>${esc(s.label)}</span><b>${fmtN(reduce ? totals[k] : 0)}</b></button>`).join('')}
    </div>
    <div class="bd-body">
      <div class="bd-ticks" aria-hidden="true"></div>
      <div class="bd-main">
        <div class="bd-plot">
          <div class="bd-col no-tr ${reduce ? '' : 'pre'}"></div>
          <svg aria-hidden="true"></svg>
          <div class="bd-days" role="group" aria-label="${esc(title)} por dia"></div>
          <div class="bd-tip no-tr ${reduce ? '' : 'pre'}" aria-hidden="true"></div>
        </div>
        <div class="bd-axis" aria-hidden="true"></div>
      </div>
    </div>`;
  const plot = $('.bd-plot', el), svg = $('svg', plot), col = $('.bd-col', el), tip = $('.bd-tip', el);
  const axisEl = $('.bd-axis', el), ticksEl = $('.bd-ticks', el), daysEl = $('.bd-days', el), statEls = $$('.bd-stat', el);

  const geo = () => {
    const w = plot.clientWidth || 600, room = Math.max(0, w - 1);
    const bw = n > 1 ? Math.min(BW, (RATIO * room) / (n - 1 + RATIO)) : Math.min(BW, room);
    const pitch = n > 1 ? (room - bw) / (n - 1) : room;
    return { w, bw, pitch, x: (i) => (n > 1 ? i * pitch : (room - bw) / 2) };
  };
  const G = geo();
  const y = (v) => BASE - (Math.min(Math.max(v, 0), st.hi) / st.hi) * SPAN;
  const shape = (x, w, top, bot) => {
    const h = bot - top; if (h <= 0.01) return '';
    const r = Math.min(R, h / 2, w / 2);
    return `M${x},${top + r} A${r},${r} 0 0 1 ${x + r},${top} H${x + w - r} A${r},${r} 0 0 1 ${x + w},${top + r} V${bot - r} A${r},${r} 0 0 1 ${x + w - r},${bot} H${x + r} A${r},${r} 0 0 1 ${x},${bot - r} Z`;
  };
  const renderTicks = (animate) => {
    ticksEl.innerHTML = [...ticks].reverse().map((t, i) => `<span class="${animate ? 'in' : ''}" style="animation-delay:${(animate === 'enter' ? 200 : 0) + i * 45}ms">${compact(t)}</span>`).join('');
  };

  function draw() {
    const { w, bw, x } = G;
    let defs = '', body = '';
    for (let k = 0; k < 4; k++) {
      const ly = BASE - (k / 3) * SPAN + 0.5;
      body += `<line x1="0" x2="${w}" y1="${ly}" y2="${ly}" class="${k ? 'bd-grid' : 'bd-base'}"/>`;
    }
    const win = 1 - DELAY * Math.max(0, series.length - 1);
    data.forEach((d, i) => {
      const g = st.grow[i];
      let up = 0;
      const segs = [];
      series.forEach((s, k) => {
        const v = (d.values[s.key] || 0) * st.w[k] * outCubic(clamp01((g - k * DELAY) / win));
        if (v <= 0) return;
        const from = up; up += v;
        const top = y(up), bot = Math.max(top, y(from) - (from > 0 ? GAP : 0));
        segs.push([top, bot, s.color]);
      });
      if (!segs.length) return;
      const xi = x(i), p = shape(xi, bw, y(up), y(0));
      if (!p) return;
      defs += `<clipPath id="${id}-${i}"><path d="${p}"/></clipPath>`;
      body += `<g clip-path="url(#${id}-${i})">${segs.map(([t, b, c]) => `<rect x="${xi}" y="${t}" width="${bw}" height="${Math.max(0, b - t)}" fill="${c}"/>`).join('')}</g>`;
    });
    svg.innerHTML = `<defs>${defs}</defs>${body}`;
    statEls.forEach((b, k) => { b.querySelector('b').textContent = fmtN(totals[k] * st.count); });
  }

  function buildDays() {
    const { w, pitch, bw, x } = G;
    const label = (d) => `${dayTip(d.date)}: ` + series.filter((s) => !st.hidden.has(s.key)).map((s) => `${s.label} ${fmtN(d.values[s.key] || 0)}`).join(', ');
    daysEl.innerHTML = data.map((d, i) => {
      const c = x(i) + bw / 2;
      const l = n > 1 ? Math.max(0, c - pitch / 2) : 0, r = n > 1 ? Math.min(w, c + pitch / 2) : w;
      return `<button type="button" class="bd-day" data-i="${i}" style="left:${l}px;width:${r - l}px" aria-label="${esc(label(d))}"></button>`;
    }).join('');
    const labels = data.map((d) => dayAxis(d.date)), longest = Math.max(...labels.map((l) => l.length));
    const every = n > 1 && pitch > 0 ? Math.max(1, Math.ceil((longest * 7 + 8) / pitch)) : 1;
    axisEl.innerHTML = data.map((d, i) => ((n - 1 - i) % every === 0 ? `<span class="${reduce ? '' : 'in'}" style="left:${x(i) + bw / 2}px;animation-delay:${300 + i * 35}ms">${labels[i]}</span>` : '')).join('');
  }

  function place() {
    const off = st.hov === null && !st.kb;
    col.classList.toggle('hide', off); tip.classList.toggle('hide', off);
    if (off) return;
    const a = st.hov ?? st.sel, d = data[a];
    const { w, bw, x } = G;
    const cx = x(a) - PAD, cw = bw + 2 * PAD;
    col.style.left = cx + 'px';
    col.style.width = cw + 'px';
    tip.innerHTML = `<span class="d">${dayTip(d.date)}</span>` + series.map((s) => `<span class="r ${st.hidden.has(s.key) ? 'off' : ''}"><i class="bd-sw" style="background:${s.color}"></i><span class="lb">${esc(s.label)}</span><b>${fmtN(d.values[s.key] || 0)}</b></span>`).join('');
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    const flip = cx + cw + TGAP + tw > w;
    tip.style.left = Math.round(flip ? Math.max(0, cx - TGAP - tw) : cx + cw + TGAP) + 'px';
    tip.style.top = Math.max(0, Math.min(GT - 1 + TGAP, H - th)) + 'px';
    $$('.bd-day', daysEl).forEach((b, i) => { b.setAttribute('aria-pressed', String(i === st.sel)); b.tabIndex = i === st.sel ? 0 : -1; });
  }

  let morph = null, entering = !reduce;
  const t0 = performance.now();
  function frame(now) {
    if (!el.isConnected) { st.raf = 0; return; }
    let busy = false;
    if (entering) {
      const e = now - t0;
      st.grow = data.map((_, i) => clamp01((e - 250 - i * 45) / 1100));
      st.count = outExpo(clamp01(e / 1400));
      if (e < 250 + n * 45 + 1100 || e < 1400) busy = true;
      else { entering = false; st.grow = data.map(() => 1); st.count = 1; }
    }
    if (morph) {
      const p = clamp01((now - morph.start) / 750), k = outExpo(p);
      st.w = morph.from.w.map((a, j) => a + (morph.to.w[j] - a) * k);
      st.hi = morph.from.hi + (morph.to.hi - morph.from.hi) * k;
      if (p < 1) busy = true; else morph = null;
    }
    draw();
    st.raf = busy ? requestAnimationFrame(frame) : 0;
  }
  const kick = () => { if (!st.raf) st.raf = requestAnimationFrame(frame); };

  const select = (i) => { st.sel = Math.min(Math.max(i, 0), n - 1); place(); };
  daysEl.addEventListener('focusin', () => { st.kb = true; place(); });
  daysEl.addEventListener('focusout', () => { st.kb = false; place(); });
  daysEl.addEventListener('pointerover', (e) => { const b = e.target.closest('.bd-day'); if (b) { st.hov = +b.dataset.i; place(); } });
  plot.addEventListener('pointerleave', () => { if (st.hov !== null) { st.hov = null; place(); } });
  daysEl.addEventListener('click', (e) => { const b = e.target.closest('.bd-day'); if (b) select(+b.dataset.i); });
  daysEl.addEventListener('keydown', (e) => {
    const next = { ArrowRight: st.sel + 1, ArrowDown: st.sel + 1, ArrowLeft: st.sel - 1, ArrowUp: st.sel - 1, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault(); st.hov = null; select(next); daysEl.children[st.sel]?.focus();
  });
  statEls.forEach((b, k) => b.addEventListener('click', () => {
    const key = series[k].key;
    if (st.hidden.has(key)) st.hidden.delete(key); else st.hidden.add(key);
    b.setAttribute('aria-pressed', String(!st.hidden.has(key)));
    const next = ticksFor(shownMax()), changed = next[3] !== ticks[3];
    ticks = next;
    if (changed) renderTicks(!reduce);
    const to = { w: series.map((s) => (st.hidden.has(s.key) ? 0 : 1)), hi: ticks[3] };
    if (reduce) { st.w = to.w; st.hi = to.hi; draw(); } else { morph = { from: { w: st.w.slice(), hi: st.hi }, to, start: performance.now() }; kick(); }
    buildDays(); place();
  }));

  renderTicks(reduce ? false : 'enter');
  buildDays();
  draw();
  place();
  void col.offsetWidth;
  requestAnimationFrame(() => { col.classList.remove('no-tr'); tip.classList.remove('no-tr'); });
  if (!reduce) {
    kick();
    const shownAt = 250 + st.sel * 45 + 1100 * 0.55;
    setTimeout(() => { col.classList.remove('pre'); tip.classList.remove('pre'); }, shownAt);
  }
}

/* ---------- Shared bits ---------- */
const pfBadges = (v) => `<span class="pfs">${v.platforms.map((p) => `<span class="pf pf-${p}" data-tip="${PLATFORMS[p].name}">${PLATFORMS[p].short}</span>`).join('')}</span>`;
const stBadge = (s) => `<span class="badge st-${s}">${STATUS[s]}</span>`;
const chDot = (c) => `<span class="dot" style="background:${chColor(c)}"></span>`;
function delta(cur, prev) {
  if (!prev && !cur) return `<span class="delta flat">—</span>`;
  if (!prev) return `<span class="delta up">novo</span>`;
  const d = (cur - prev) / prev;
  if (Math.abs(d) < 0.005) return `<span class="delta flat">0%</span>`;
  return `<span class="delta ${d > 0 ? 'up' : 'down'}">${d > 0 ? '↑' : '↓'} ${pct(Math.abs(d), 0)}</span>`;
}
function channelSeg() {
  const opts = [['all', 'Todos os canais']].concat(Object.keys(S.channels).map((c) => [c, S.channels[c].name]));
  return `<div class="seg" id="chanSeg">${opts.map(([k, n]) => `<button data-ch="${k}" class="${ui.filter === k ? 'on' : ''}">${k !== 'all' ? chDot(k) : ''}${esc(n)}</button>`).join('')}</div>`;
}
function pageHead(title, sub, extra = '') {
  return `<div class="page-head"><div><h1>${title}</h1><p>${sub}</p></div><div class="head-tools">${extra}${channelSeg()}</div></div>`;
}
function demoBanner() {
  if (!S.demo) return '';
  return `<div class="banner"><div class="bt">${icon('sparkles')}<span><b>Dados de exemplo.</b> Explore à vontade — quando quiser, comece do zero com seus vídeos reais.</span></div><div class="bt"><button class="btn btn-sm btn-ghost" data-act="keep-demo">Manter exemplo</button><button class="btn btn-sm btn-primary" data-act="clear-demo">Começar do zero</button></div></div>`;
}
function metricsBanner() {
  const miss = published().filter((v) => views(v) === 0);
  if (!miss.length) return '';
  return `<div class="banner"><div class="bt">${icon('trend')}<span><b>${miss.length} vídeo(s) publicado(s) ainda sem métricas.</b> Preencha views e curtidas para liberar os gráficos e os insights.</span></div><div class="bt"><a class="btn btn-sm btn-primary" href="#publicados">Preencher métricas</a></div></div>`;
}
function weekBuckets(nWeeks) {
  const t = today(), out = [];
  for (let i = nWeeks - 1; i >= 0; i--) { const end = addDays(t, -7 * i), start = addDays(end, -6); out.push({ start, end, label: `${pad(start.getDate())}/${pad(start.getMonth() + 1)}` }); }
  return out;
}
const seriesByChannelOrPlatform = (buckets, inBucket, valueFn) => {
  if (ui.filter === 'all') {
    return Object.keys(S.channels).map((c) => ({ name: chName(c), color: chColor(c), values: buckets.map((b) => sum(S.videos.filter((v) => v.channel === c && v.status === 'publicado' && inBucket(v, b)).map((v) => valueFn(v, 'all')))) }));
  }
  return PKEYS.map((p) => ({ name: PLATFORMS[p].name, color: PLATFORMS[p].color, values: buckets.map((b) => sum(published().filter((v) => inBucket(v, b)).map((v) => valueFn(v, p)))) }));
};
const legendHTML = (series) => `<div class="legend">${series.map((s) => `<span><i class="dot" style="background:${s.color}"></i>${esc(s.name)}</span>`).join('')}</div>`;

/* =========================================================
   Pages
   ========================================================= */
const PAGES = {};
const after = []; // callbacks rodados depois do render (gráficos)

/* ---------- Início ---------- */
PAGES.inicio = () => {
  const t = today(), from = addDays(t, -29), pfrom = addDays(t, -59), pto = addDays(t, -30);
  const pub = published();
  const cur = pub.filter((v) => between(v.date, from, t)), prev = pub.filter((v) => between(v.date, pfrom, pto));
  const vCur = sum(cur.map((v) => views(v))), vPrev = sum(prev.map((v) => views(v)));
  const eCur = engRate(cur), ePrev = engRate(prev);
  const fNow = followersAt(iso(t)), fPrev = followersAt(iso(addDays(t, -30)));
  const weeks = weekBuckets(8);
  const inB = (v, b) => between(v.date, b.start, b.end);
  const wViews = weeks.map((b) => sum(pub.filter((v) => inB(v, b)).map((v) => views(v))));
  const wCount = weeks.map((b) => pub.filter((v) => inB(v, b)).length);
  const wEng = weeks.map((b) => engRate(pub.filter((v) => inB(v, b))) * 100);
  const series = seriesByChannelOrPlatform(weeks, inB, views);

  const monthStart = new Date(t.getFullYear(), t.getMonth(), 1);
  const monthPub = pub.filter((v) => between(v.date, monthStart, t)).length;
  const goal = sum(activeChannels().map((c) => +S.goals[c] || 0)) || 1;
  const monthEnd = new Date(t.getFullYear(), t.getMonth() + 1, 0);
  const monthPlanned = vids().filter((v) => v.status !== 'publicado' && between(v.date, t, monthEnd)).length;

  const upcoming = vids().filter((v) => v.status !== 'publicado' && v.date && v.date >= iso(t)).sort((a, b) => (a.date + a.time < b.date + b.time ? -1 : 1)).slice(0, 5);
  const top = [...cur.length >= 3 ? cur : pub].sort((a, b) => views(b) - views(a)).slice(0, 5);
  const topMax = Math.max(1, ...top.map((v) => views(v)));

  const bdSeries = ui.filter === 'all'
    ? Object.keys(S.channels).map((c) => ({ key: c, label: chName(c), color: chColor(c) }))
    : PKEYS.map((p) => ({ key: p, label: PLATFORMS[p].name, color: PLATFORMS[p].color }));
  const bdData = Array.from({ length: 14 }, (_, i) => {
    const di = iso(addDays(t, i - 13)), day = pub.filter((v) => v.date === di);
    return { date: di, values: Object.fromEntries(bdSeries.map((s) => [s.key, ui.filter === 'all' ? sum(day.filter((v) => v.channel === s.key).map((v) => views(v))) : sum(day.map((v) => views(v, s.key)))])) };
  });
  let bdSel = bdData.length - 1;
  while (bdSel > 0 && !sum(Object.values(bdData[bdSel].values))) bdSel--;
  if (!sum(Object.values(bdData[bdSel].values))) bdSel = bdData.length - 1;
  after.push(() => mountBreakdown($('#bdChart'), { title: 'Views por dia', series: bdSeries, data: bdData, selected: bdSel }));

  return `
  ${pageHead(`${greeting()}, criador`, 'Acompanhe seus vídeos, sua evolução e o que vem por aí.')}
  ${demoBanner()}${metricsBanner()}
  <div class="grid g-4 mt">
    <div class="card kpi hero">
      <div class="kpi-top"><span>Views · 30 dias</span></div>
      <div class="kpi-val">${compact(vCur)}</div>
      <div class="spark">${sparkSVG(wViews, 'rgba(255,255,255,.9)')}</div>
      <div class="kpi-foot">${delta(vCur, vPrev)}<span>vs. 30 dias anteriores</span></div>
    </div>
    <div class="card kpi">
      <div class="kpi-top"><span>Engajamento médio</span></div>
      <div class="kpi-val">${pct(eCur)}</div>
      <div class="spark">${sparkSVG(wEng, '#93c5fd')}</div>
      <div class="kpi-foot">${delta(eCur, ePrev)}<span>vs. 30 dias anteriores</span></div>
    </div>
    <div class="card kpi">
      <div class="kpi-top"><span>Vídeos publicados</span></div>
      <div class="kpi-val">${cur.length}</div>
      <div class="spark">${sparkSVG(wCount, '#93c5fd')}</div>
      <div class="kpi-foot">${delta(cur.length, prev.length)}<span>nos últimos 30 dias</span></div>
    </div>
    <div class="card kpi">
      <div class="kpi-top"><span>Seguidores</span></div>
      <div class="kpi-val">${fNow ? compact(fNow) : '—'}</div>
      <div class="kpi-foot">${fNow ? delta(fNow, fPrev) : ''}<span>${fNow ? 'soma das 3 plataformas' : '<a href="#" data-act="followers">Registrar seguidores</a>'}</span></div>
    </div>
  </div>

  <div class="grid g-main mt">
    <div class="card bd" id="bdChart"></div>
    <div class="card">
      <div class="card-head"><div><h3>Meta de ${MONTHS[t.getMonth()].toLowerCase()}</h3><p>${goal} vídeos planejados no mês</p></div><button class="icon-btn sm" data-act="settings" data-tip="Ajustar meta">${icon('target')}</button></div>
      <div class="gauge-wrap">
        ${gaugeSVG(monthPub / goal)}
        <div class="gauge-sub">
          <div class="inset"><small>Publicados</small><b>${monthPub}</b></div>
          <div class="inset"><small>Ainda no mês</small><b>${monthPlanned}</b></div>
        </div>
      </div>
    </div>
  </div>

  <div class="grid g-2 mt">
    <div class="card">
      <div class="card-head"><div><h3>Próximos vídeos</h3><p>O que está agendado e em produção</p></div><a class="btn btn-sm btn-ghost" href="#cronograma">Ver cronograma ${icon('arrowR')}</a></div>
      <div class="list">${upcoming.length ? upcoming.map((v) => { const d = parse(v.date); return `
        <div class="row" data-edit="${v.id}">
          <div class="date-box"><b>${d.getDate()}</b><small>${MON[d.getMonth()]}</small></div>
          <div class="grow"><div class="t">${esc(v.title)}</div><div class="s">${chDot(v.channel)}${esc(chName(v.channel))} · ${WD[d.getDay()]}${v.time ? ' ' + v.time : ''}</div></div>
          ${pfBadges(v)} ${stBadge(v.status)}
        </div>`; }).join('') : `<div class="empty"><b>Nada agendado</b>Planeje o próximo vídeo para manter a constância.<br><br><button class="btn btn-primary btn-sm" data-act="new">${icon('plus')} Novo vídeo</button></div>`}</div>
    </div>
    <div class="card">
      <div class="card-head"><div><h3>Top vídeos</h3><p>${cur.length >= 3 ? 'Mais vistos nos últimos 30 dias' : 'Mais vistos de todos os tempos'}</p></div><a class="btn btn-sm btn-ghost" href="#publicados">Ver todos ${icon('arrowR')}</a></div>
      <div class="list">${top.length ? top.map((v, i) => `
        <div class="row" data-edit="${v.id}">
          <div class="rank">${i + 1}</div>
          <div class="grow"><div class="t">${esc(v.title)}</div><div class="bar-mini"><i style="width:${(views(v) / topMax) * 100}%"></i></div></div>
          <div style="text-align:right"><div class="num">${compact(views(v))}</div><div class="s" style="font-size:12px;color:var(--muted)">${pct(engRate([v]))} eng.</div></div>
        </div>`).join('') : `<div class="empty"><b>Ainda sem vídeos publicados</b>Quando publicar, registre as métricas e eles aparecem aqui.</div>`}</div>
    </div>
  </div>`;
};

/* ---------- Cronograma ---------- */
PAGES.cronograma = () => {
  const m = ui.calMonth, y = m.getFullYear(), mo = m.getMonth();
  const first = new Date(y, mo, 1), startOffset = (first.getDay() + 6) % 7; // segunda primeiro
  const start = addDays(first, -startOffset), tIso = iso(today());
  const list = vids();
  let cells = '';
  for (let i = 0; i < 42; i++) {
    const d = addDays(start, i), di = iso(d);
    if (i >= 35 && d.getMonth() !== mo) break;
    const dv = list.filter((v) => v.date === di).sort((a, b) => (a.time < b.time ? -1 : 1));
    const chips = dv.slice(0, 3).map((v) => {
      const pub = v.status === 'publicado';
      return `<div class="chip ${pub ? 'pub' : ''}" data-edit="${v.id}" style="${pub ? `background:${chColor(v.channel)};border-left-color:${chColor(v.channel)}` : `border-left-color:${chColor(v.channel)}`}" data-tip="<b>${esc(v.title)}</b><br>${esc(chName(v.channel))} · ${STATUS[v.status]}${v.time ? ' · ' + v.time : ''}">${esc(v.title)}</div>`;
    }).join('') + (dv.length > 3 ? `<div class="chip more">+${dv.length - 3} mais</div>` : '');
    cells += `<div class="day ${d.getMonth() !== mo ? 'out' : ''} ${di === tIso ? 'today' : ''}" data-day="${di}"><div class="dn"><b>${d.getDate()}</b></div>${chips}</div>`;
  }
  const monthList = list.filter((v) => v.date && parse(v.date).getMonth() === mo && parse(v.date).getFullYear() === y);
  const pubN = monthList.filter((v) => v.status === 'publicado').length;
  const planN = monthList.length - pubN;
  const pipe = PIPE.map((s) => ({ s, items: list.filter((v) => v.status === s).sort((a, b) => ((a.date || '9') < (b.date || '9') ? -1 : 1)) }));

  return `
  ${pageHead('Cronograma', 'Planeje o que vai ao ar e acompanhe cada vídeo da ideia à publicação.')}
  <div class="card">
    <div class="card-head">
      <div class="cal-head">
        <button class="icon-btn sm" data-act="cal-prev">${icon('chevL')}</button>
        <h3>${MONTHS[mo]} ${y}</h3>
        <button class="icon-btn sm" data-act="cal-next">${icon('chevR')}</button>
        <button class="btn btn-sm btn-ghost" data-act="cal-today">Hoje</button>
      </div>
      <div class="legend">
        <span><i class="dot" style="background:var(--blue)"></i>${pubN} publicados</span>
        <span><i class="dot" style="background:var(--blue-200)"></i>${planN} a postar</span>
        ${Object.keys(S.channels).map((c) => `<span>${chDot(c)}${esc(chName(c))}</span>`).join('')}
      </div>
    </div>
    <div class="cal">${['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((w) => `<div class="wd">${w}</div>`).join('')}${cells}</div>
    <p class="hint">Clique em um dia para planejar um vídeo. Vídeos publicados aparecem preenchidos; os a postar, com contorno.</p>
  </div>

  <div class="card mt">
    <div class="card-head"><div><h3>Produção</h3><p>Arraste os cards entre as etapas</p></div></div>
    <div class="kanban">${pipe.map(({ s, items }) => `
      <div class="kcol" data-col="${s}">
        <div class="kcol-h"><b>${stBadge(s)}</b><span class="cnt">${items.length}</span></div>
        ${items.map((v) => `<div class="kcard" draggable="true" data-id="${v.id}" data-edit="${v.id}">
          <div class="t">${esc(v.title)}</div>
          <div class="s"><span style="display:inline-flex;gap:6px;align-items:center">${chDot(v.channel)}${v.date ? fmtDate(v.date) : 'Sem data'}</span>${pfBadges(v)}</div>
        </div>`).join('')}
        <button class="kadd" data-act="new-status" data-status="${s}">${icon('plus')}</button>
      </div>`).join('')}
    </div>
  </div>`;
};

/* ---------- Publicados ---------- */
function pubRows() {
  const p = ui.platform, q = ui.search.trim().toLowerCase();
  let rows = published().filter((v) => (p === 'all' || v.platforms.includes(p)) && (!q || (v.title + ' ' + v.tag + ' ' + v.format).toLowerCase().includes(q)));
  const key = ui.sort.key, dir = ui.sort.dir;
  const val = (v) => ({ date: v.date + v.time, title: v.title.toLowerCase(), channel: chName(v.channel), views: views(v, p), likes: stat(v, 'likes', p), comments: stat(v, 'comments', p), shares: stat(v, 'shares', p), eng: engRate([v], p) }[key]);
  rows.sort((a, b) => (val(a) < val(b) ? -dir : val(a) > val(b) ? dir : 0));
  return rows;
}
function renderPubBody() {
  const rows = pubRows(), p = ui.platform;
  const tb = $('#pubBody'); if (!tb) return;
  tb.innerHTML = rows.length ? rows.map((v) => `
    <tr data-edit="${v.id}">
      <td><span class="tt">${esc(v.title)}</span><span class="tg">${esc(v.tag || '')}${v.format ? ' · ' + esc(v.format) : ''}</span></td>
      <td>${chDot(v.channel)} ${esc(chName(v.channel))}</td>
      <td>${pfBadges(v)}</td>
      <td>${fmtDate(v.date)}</td>
      <td class="r num">${fmtN(views(v, p))}</td>
      <td class="r">${fmtN(stat(v, 'likes', p))}</td>
      <td class="r">${fmtN(stat(v, 'comments', p))}</td>
      <td class="r">${fmtN(stat(v, 'shares', p))}</td>
      <td class="r"><span class="badge ${engRate([v], p) >= 0.07 ? 'st-publicado' : 'st-agendado'}">${pct(engRate([v], p))}</span></td>
    </tr>`).join('') : `<tr><td colspan="9"><div class="empty"><b>Nenhum vídeo encontrado</b>Ajuste a busca ou registre um vídeo publicado.</div></td></tr>`;
  const all = rows;
  $('#pubSum').innerHTML = `${all.length} vídeos · ${compact(sum(all.map((v) => views(v, p))))} views · ${pct(engRate(all, p))} engajamento`;
  $$('th[data-sort]').forEach((th) => { const k = th.dataset.sort; th.querySelector('.arr').textContent = ui.sort.key === k ? (ui.sort.dir > 0 ? '↑' : '↓') : ''; });
}
PAGES.publicados = () => {
  after.push(renderPubBody);
  const cols = [['title', 'Vídeo'], ['channel', 'Canal'], [null, 'Plataformas'], ['date', 'Data'], ['views', 'Views', 'r'], ['likes', 'Curtidas', 'r'], ['comments', 'Coment.', 'r'], ['shares', 'Compart.', 'r'], ['eng', 'Engajamento', 'r']];
  return `
  ${pageHead('Publicados', 'Todos os vídeos que já foram ao ar, com suas métricas. Clique em um vídeo para atualizar os números.')}
  <div class="card">
    <div class="toolbar">
      <div class="search">${icon('search')}<input id="pubSearch" placeholder="Buscar por título, tema ou formato" value="${esc(ui.search)}"></div>
      <div class="seg dark" id="pfSeg">${[['all', 'Todas']].concat(PKEYS.map((p) => [p, PLATFORMS[p].name])).map(([k, n]) => `<button data-pf="${k}" class="${ui.platform === k ? 'on' : ''}">${n}</button>`).join('')}</div>
    </div>
    <p class="hint" id="pubSum" style="margin:0 0 12px"></p>
    <div class="table-wrap"><table>
      <thead><tr>${cols.map(([k, n, c]) => `<th ${k ? `data-sort="${k}"` : ''} class="${c || ''}">${n}<span class="arr"></span></th>`).join('')}</tr></thead>
      <tbody id="pubBody"></tbody>
    </table></div>
  </div>`;
};

/* ---------- Analytics ---------- */
PAGES.analytics = () => {
  const t = today(), P = ui.period;
  const pub = published();
  const firstDate = pub.length ? parse(pub.map((v) => v.date).sort()[0]) : addDays(t, -29);
  const from = P ? addDays(t, -(P - 1)) : firstDate;
  const span = Math.max(1, Math.round((t - from) / 864e5) + 1);
  const pfrom = addDays(from, -span), pto = addDays(from, -1);
  const cur = pub.filter((v) => between(v.date, from, t)), prev = pub.filter((v) => between(v.date, pfrom, pto));
  const k = (f) => sum(cur.map((v) => stat(v, f))), kp = (f) => sum(prev.map((v) => stat(v, f)));

  // série temporal
  let buckets;
  if (span <= 31) buckets = Array.from({ length: span }, (_, i) => { const d = addDays(from, i); return { start: d, end: d, label: `${pad(d.getDate())}/${pad(d.getMonth() + 1)}` }; });
  else buckets = weekBuckets(Math.ceil(span / 7));
  const inB = (v, b) => between(v.date, b.start, b.end);
  const lineSeries = seriesByChannelOrPlatform(buckets, inB, views).map((s) => ({ ...s, values: s.values }));

  // plataforma
  const pfItems = PKEYS.map((p) => ({ name: PLATFORMS[p].name, color: PLATFORMS[p].color, value: sum(cur.map((v) => views(v, p))) }));
  const pfEng = PKEYS.map((p) => ({ p, e: engRate(cur.filter((v) => v.platforms.includes(p)), p), avgV: avg(cur.filter((v) => v.platforms.includes(p)).map((v) => views(v, p))) }));

  // canais
  const chans = Object.keys(S.channels);
  const chStats = chans.map((c) => { const l = cur.filter((v) => v.channel === c); return { c, n: l.length, views: sum(l.map((v) => views(v))), avg: avg(l.map((v) => views(v))), eng: engRate(l) }; });
  const maxAvg = Math.max(1, ...chStats.map((x) => x.avg));

  // heatmap dia x plataforma
  const heat = PKEYS.map((p) => WD.map((_, wd) => { const l = cur.filter((v) => v.platforms.includes(p) && parse(v.date).getDay() === wd); return { n: l.length, v: avg(l.map((v) => views(v, p))) }; }));
  const hMax = Math.max(1, ...heat.flat().map((x) => x.v));
  const wdOrder = [1, 2, 3, 4, 5, 6, 0];

  // seguidores
  const fDates = [...new Set(S.followers.filter((f) => activeChannels().includes(f.channel)).map((f) => f.date))].sort().filter((d) => !P || parse(d) >= addDays(from, -7));
  const fSeries = PKEYS.map((p) => ({ name: PLATFORMS[p].name, color: PLATFORMS[p].color, values: fDates.map((d) => followersAt(d, activeChannels(), [p])) }));

  after.push(() => {
    drawLine($('#lnChart'), { labels: buckets.map((b) => b.label), series: lineSeries });
    if (fDates.length > 1) drawLine($('#fwChart'), { labels: fDates.map((d) => fmtDate(d)), series: fSeries, height: 220 });
  });
  const kpis = [['Views', 'views', 'eye'], ['Curtidas', 'likes', 'heart'], ['Comentários', 'comments', 'message'], ['Compartilhamentos', 'shares', 'repeat']];
  return `
  ${pageHead('Analytics', 'Entenda o que funciona em cada canal e plataforma.', `<div class="seg dark" id="perSeg">${[[7, '7 dias'], [30, '30 dias'], [90, '90 dias'], [0, 'Tudo']].map(([v, n]) => `<button data-per="${v}" class="${ui.period === v ? 'on' : ''}">${n}</button>`).join('')}</div>`)}
  <div class="grid g-4">
    ${kpis.map(([n, f, ic], i) => `<div class="card kpi ${i === 0 ? 'hero' : ''}" style="min-height:128px"><div class="kpi-top"><span>${n}</span></div><div class="kpi-val">${compact(k(f))}</div><div class="kpi-foot">${delta(k(f), kp(f))}<span>vs. período anterior</span></div></div>`).join('')}
  </div>
  <div class="grid g-main mt">
    <div class="card">
      <div class="card-head"><div><h3>Views ao longo do tempo</h3><p>${span <= 31 ? 'Por dia de publicação' : 'Por semana de publicação'} · média de ${compact(avg(cur.map((v) => views(v))))} views por vídeo</p></div>${legendHTML(lineSeries)}</div>
      <div class="chart" id="lnChart"></div>
    </div>
    <div class="card">
      <div class="card-head"><div><h3>Views por plataforma</h3><p>Onde seu público está</p></div></div>
      <div class="donut-wrap">
        ${donutSVG(pfItems, { value: compact(sum(pfItems.map((x) => x.value))), label: 'views totais' })}
        <div class="donut-legend">${pfEng.map(({ p, e, avgV }) => `<div><span><i class="dot" style="background:${PLATFORMS[p].color}"></i>${PLATFORMS[p].name}</span><span class="num" data-tip="Média de views por vídeo: ${compact(avgV)}">${pct(e)} eng.</span></div>`).join('')}</div>
      </div>
    </div>
  </div>
  <div class="grid g-main-r mt">
    <div class="card">
      <div class="card-head"><div><h3>Canais lado a lado</h3><p>Média de views por vídeo</p></div></div>
      <div class="list">${chStats.map((x) => `
        <div style="padding:10px 0;border-bottom:1px solid var(--line)">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><b style="display:flex;gap:8px;align-items:center">${chDot(x.c)}${esc(chName(x.c))}</b><span class="num">${compact(x.avg)}</span></div>
          <div class="bar-mini" style="height:10px"><i style="width:${(x.avg / maxAvg) * 100}%;background:${chColor(x.c)}"></i></div>
          <div class="s" style="font-size:12.5px;color:var(--muted);margin-top:6px">${x.n} vídeos · ${compact(x.views)} views · ${pct(x.eng)} engajamento</div>
        </div>`).join('')}</div>
    </div>
    <div class="card">
      <div class="card-head"><div><h3>Melhor dia para postar</h3><p>Média de views por dia da semana em cada plataforma</p></div></div>
      <div class="heat" style="grid-template-columns:84px repeat(7,minmax(0,1fr))">
        <div></div>${wdOrder.map((w) => `<div class="hh">${WD[w]}</div>`).join('')}
        ${PKEYS.map((p, pi) => `<div class="hl">${PLATFORMS[p].name}</div>` + wdOrder.map((w) => { const c = heat[pi][w]; const a = c.n ? 0.12 + 0.88 * (c.v / hMax) : 0; return `<div class="hc" style="background:${c.n ? `rgba(37,99,235,${a.toFixed(2)})` : '#f3f6fb'};color:${a > 0.5 ? '#fff' : '#334155'}" data-tip="<b>${PLATFORMS[p].name} · ${WD_FULL[w]}</b><br>${c.n ? `${c.n} vídeo(s) · média ${compact(c.v)} views` : 'Sem vídeos'}">${c.n ? compact(c.v) : ''}</div>`; }).join('')).join('')}
      </div>
    </div>
  </div>
  <div class="card mt">
    <div class="card-head"><div><h3>Crescimento de seguidores</h3><p>A partir dos registros que você faz em “Atualizar seguidores”</p></div><div style="display:flex;gap:12px;align-items:center">${legendHTML(fSeries)}<button class="btn btn-sm btn-ghost" data-act="followers">${icon('users')} Atualizar</button></div></div>
    ${fDates.length > 1 ? '<div class="chart" id="fwChart"></div>' : `<div class="empty"><b>Poucos registros ainda</b>Registre seus seguidores toda semana para ver a curva de crescimento.</div>`}
  </div>`;
};

/* ---------- Insights ---------- */
function computeInsights(list, chans) {
  const out = [];
  if (list.length < 3) return out;
  const t = today();
  const medV = median(list.map((v) => views(v)));

  // melhor dia
  const byWd = WD.map((_, w) => list.filter((v) => parse(v.date).getDay() === w)).map((l, w) => ({ w, n: l.length, a: avg(l.map((v) => views(v))) })).filter((x) => x.n >= 2).sort((a, b) => b.a - a.a);
  if (byWd.length >= 2) {
    const b = byWd[0], wst = byWd[byWd.length - 1];
    out.push({ ic: 'calendar', tone: 'good', title: `${cap(WD_FULL[b.w])} é seu melhor dia`, stat: `${compact(b.a)} views/vídeo`, text: `Vídeos postados na ${WD_FULL[b.w]} têm em média ${(b.a / Math.max(wst.a, 1)).toFixed(1).replace('.', ',')}× mais views que na ${WD_FULL[wst.w]} (${compact(wst.a)}).`, act: `Agende seus vídeos mais fortes para ${WD_FULL[b.w]}.` });
  }
  // plataforma por canal
  for (const c of chans) {
    const l = list.filter((v) => v.channel === c);
    if (l.length < 3) continue;
    const ps = PKEYS.map((p) => ({ p, a: avg(l.filter((v) => v.platforms.includes(p)).map((v) => views(v, p))), e: engRate(l.filter((v) => v.platforms.includes(p)), p) })).filter((x) => x.a > 0).sort((a, b) => b.a - a.a);
    if (ps.length >= 2) {
      const best = [...ps].sort((a, b) => b.e - a.e)[0];
      out.push({ ic: 'layers', tone: '', title: `${chName(c)}: ${PLATFORMS[ps[0].p].name} lidera em alcance`, stat: `${compact(ps[0].a)} views/vídeo`, text: `${PLATFORMS[ps[0].p].name} entrega ${(ps[0].a / Math.max(ps[ps.length - 1].a, 1)).toFixed(1).replace('.', ',')}× mais views que ${PLATFORMS[ps[ps.length - 1].p].name}. Já o maior engajamento está no ${PLATFORMS[best.p].name} (${pct(best.e)}).`, act: `Priorize ${PLATFORMS[ps[0].p].name} para alcance e use ${PLATFORMS[best.p].name} para criar comunidade.` });
    }
  }
  // tema campeão
  const tags = {};
  list.forEach((v) => { if (v.tag) (tags[v.tag] = tags[v.tag] || []).push(views(v)); });
  const tg = Object.entries(tags).filter(([, a]) => a.length >= 2).map(([k, a]) => ({ k, a: avg(a), n: a.length })).sort((a, b) => b.a - a.a);
  if (tg.length) out.push({ ic: 'trophy', tone: 'good', title: `“${cap(tg[0].k)}” é seu tema campeão`, stat: `${compact(tg[0].a)} views/vídeo`, text: `Com ${tg[0].n} vídeos, o tema rende ${(tg[0].a / Math.max(medV, 1)).toFixed(1).replace('.', ',')}× a mediana do canal.${tg[1] ? ` Em seguida vem “${tg[1].k}” (${compact(tg[1].a)}).` : ''}`, act: 'Faça uma série ou parte 2 sobre esse tema.', link: 'ideias' });
  // formato
  const fm = {};
  list.forEach((v) => { if (v.format) (fm[v.format] = fm[v.format] || []).push(v); });
  const fms = Object.entries(fm).filter(([, a]) => a.length >= 2).map(([k, a]) => ({ k, a: avg(a.map((v) => views(v))), e: engRate(a) })).sort((a, b) => b.a - a.a);
  if (fms.length >= 2) out.push({ ic: 'video', tone: '', title: `Formato que mais funciona: ${fms[0].k}`, stat: `${pct(fms[0].e)} engajamento`, text: `“${fms[0].k}” tem média de ${compact(fms[0].a)} views, contra ${compact(fms[fms.length - 1].a)} de “${fms[fms.length - 1].k}”.`, act: `Use mais o formato ${fms[0].k.toLowerCase()} nos próximos roteiros.` });
  // viral
  const top = [...list].sort((a, b) => views(b) - views(a))[0];
  if (top && views(top) > medV * 2.5) out.push({ ic: 'zap', tone: 'good', title: 'Você tem um vídeo fora da curva', stat: `${(views(top) / Math.max(medV, 1)).toFixed(1).replace('.', ',')}× a mediana`, text: `“${top.title}” fez ${compact(views(top))} views. Entenda o gancho, o tema e o horário dele para repetir a fórmula.`, act: 'Abrir vídeo', edit: top.id });
  // consistência
  const last4 = list.filter((v) => between(v.date, addDays(t, -27), t)).length / 4;
  const prev4 = list.filter((v) => between(v.date, addDays(t, -55), addDays(t, -28))).length / 4;
  out.push({ ic: last4 >= prev4 ? 'trend' : 'trendDown', tone: last4 >= prev4 ? 'good' : 'warn', title: last4 >= prev4 ? 'Ritmo de postagem em alta' : 'Seu ritmo de postagem caiu', stat: `${last4.toFixed(1).replace('.', ',')} vídeos/semana`, text: `Nas últimas 4 semanas foram ${last4.toFixed(1).replace('.', ',')} vídeos por semana, contra ${prev4.toFixed(1).replace('.', ',')} no mês anterior. Constância é o principal fator de crescimento no início.`, act: last4 >= prev4 ? 'Mantenha o ritmo e planeje com 1 semana de antecedência.' : 'Agende pelo menos 3 vídeos para a próxima semana.' });
  // repost
  const rep = list.filter((v) => v.platforms.length < 3 && views(v) > medV * 1.3).sort((a, b) => views(b) - views(a));
  if (rep.length) { const v = rep[0]; const miss = PKEYS.filter((p) => !v.platforms.includes(p)).map((p) => PLATFORMS[p].name).join(' e '); out.push({ ic: 'repeat', tone: '', title: 'Oportunidade de repost', stat: `${rep.length} vídeo(s)`, text: `“${v.title}” foi bem (${compact(views(v))} views) mas ainda não está no ${miss}. Reaproveitar um vídeo validado é alcance quase de graça.`, act: 'Abrir vídeo', edit: v.id }); }
  // duração
  const dur = list.filter((v) => +v.duration > 0);
  if (dur.length >= 6) {
    const bk = [[0, 30, 'até 30s'], [31, 60, '31–60s'], [61, 9999, 'mais de 60s']].map(([a, b, n]) => { const l = dur.filter((v) => +v.duration >= a && +v.duration <= b); return { n, c: l.length, a: avg(l.map((v) => views(v))) }; }).filter((x) => x.c >= 2).sort((a, b) => b.a - a.a);
    if (bk.length >= 2) out.push({ ic: 'clock', tone: '', title: `Duração ideal: ${bk[0].n}`, stat: `${compact(bk[0].a)} views/vídeo`, text: `Vídeos com ${bk[0].n} performam melhor que os de ${bk[bk.length - 1].n} (${compact(bk[bk.length - 1].a)}).`, act: 'Corte o roteiro para caber nessa faixa.' });
  }
  return out;
}
PAGES.insights = () => {
  const pub = published().filter((v) => views(v) > 0);
  const ins = computeInsights(pub, activeChannels());
  const t = today();
  const next7 = vids().filter((v) => v.status !== 'publicado' && between(v.date, t, addDays(t, 6)));
  const ideas = vids().filter((v) => v.status === 'ideia').length;
  if (next7.length < 3) ins.unshift({ ic: 'alert', tone: 'warn', title: 'Semana com poucos vídeos', stat: `${next7.length} agendado(s)`, text: `Você tem ${next7.length} vídeo(s) previsto(s) para os próximos 7 dias${ideas ? ` e ${ideas} ideia(s) no banco esperando roteiro` : ''}.`, act: 'Ver sugestões de temas', link: 'ideias' });
  return `
  ${pageHead('Insights', 'Leituras automáticas dos seus números com uma ação clara para cada uma.')}
  ${ins.length ? `<div class="grid g-2">${ins.map((x) => `
    <div class="card insight">
      <div class="ins-ic ${x.tone}">${icon(x.ic)}</div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;flex-wrap:wrap"><h4>${esc(x.title)}</h4><span class="badge st-agendado">${x.stat}</span></div>
        <p>${esc(x.text)}</p>
        <div class="act">${icon('arrowR')}${x.edit ? `<a href="#" data-edit="${x.edit}">${esc(x.act)}</a>` : x.link ? `<a href="#${x.link}">${esc(x.act)}</a>` : `<span>${esc(x.act)}</span>`}</div>
      </div>
    </div>`).join('')}</div>` : `<div class="card"><div class="empty"><b>Insights aparecem com pelo menos 3 vídeos com métricas</b>Abra cada vídeo em Publicados e preencha views, curtidas, comentários e compartilhamentos.</div></div>`}`;
};

/* ---------- Ideias ---------- */

function ideaTitle([tpl], topic) { return tpl.replace('{T}', cap(topic)).replace('{t}', topic); }
function channelProfile(c) {
  const l = S.videos.filter((v) => v.channel === c && v.status === 'publicado');
  const tags = {};
  l.forEach((v) => { if (v.tag) (tags[v.tag] = tags[v.tag] || []).push(views(v)); });
  const med = median(l.map((v) => views(v))) || 1;
  const tagPerf = Object.fromEntries(Object.entries(tags).map(([k, a]) => [k, avg(a) / med]));
  const recent = new Set(l.filter((v) => between(v.date, addDays(today(), -21), today())).map((v) => v.tag));
  const fm = {};
  l.forEach((v) => { if (v.format) (fm[v.format] = fm[v.format] || []).push(views(v)); });
  const fmPerf = Object.fromEntries(Object.entries(fm).map(([k, a]) => [k, avg(a) / med]));
  const byWd = WD.map((_, w) => ({ w, a: avg(l.filter((v) => parse(v.date).getDay() === w).map((v) => views(v))) })).sort((a, b) => b.a - a.a);
  const byPf = PKEYS.map((p) => ({ p, a: avg(l.filter((v) => v.platforms.includes(p)).map((v) => views(v, p))) })).sort((a, b) => b.a - a.a);
  return { tagPerf, recent, fmPerf, bestWd: l.length >= 3 ? byWd[0].w : null, bestPf: l.length >= 3 ? byPf[0].p : null, n: l.length };
}
function generateIdeas(c, n = 9) {
  const ch = S.channels[c];
  const r = rng(ui.ideaSeed * 977 + c.length * 31 + ui.ideaTopic.length * 7);
  const prof = channelProfile(c);
  const shuffle = (a) => a.map((x) => [r(), x]).sort((p, q) => p[0] - q[0]).map((p) => p[1]);
  if (ui.ideaTopic) {
    const tpls = shuffle(ch.templates?.length ? ch.templates : TEMPLATES);
    return { prof, ideas: tpls.slice(0, n).map((t) => ({ title: ideaTitle(t, ui.ideaTopic), tag: ui.ideaTopic, format: t[1], hook: '', why: 'Gancho no padrão do canal para o tema que você pediu', score: 3 })) };
  }
  const usedTitles = new Set(S.videos.map((v) => v.title.toLowerCase()));
  const pubTags = new Set(S.videos.filter((v) => v.channel === c && v.status === 'publicado').map((v) => v.tag));
  const pool = (ch.ideas || []).filter((i) => !usedTitles.has(i.title.toLowerCase())).map((i) => {
    let score = i.score || 3, why = i.why || '';
    const tp = prof.tagPerf[i.tag];
    if (tp >= 1.2) { score++; why = `“${i.tag}” rende ${tp.toFixed(1).replace('.', ',')}× a mediana do canal · ${why}`; }
    else if (!why && pubTags.has(i.tag)) why = 'Mesma linha de um vídeo que você já publicou';
    if ((prof.fmPerf[i.format] || 0) >= 1.15) score++;
    return { ...i, score: Math.min(5, score), why: why || 'Encaixa no padrão do canal', k: Math.min(5, score) + r() * 1.6 };
  });
  return { prof, ideas: pool.sort((a, b) => b.k - a.k).slice(0, n) };
}
PAGES.ideias = () => {
  const chans = activeChannels();
  const blocks = chans.map((c) => {
    const ch = S.channels[c];
    const { ideas, prof } = generateIdeas(c, ui.filter === 'all' ? 6 : 9);
    const best = prof.bestWd !== null && prof.bestPf ? `Melhor janela até agora: <b>${WD[prof.bestWd]}</b> no <b>${PLATFORMS[prof.bestPf].name}</b>` : `${prof.n} vídeo(s) publicado(s). As sugestões ficam mais precisas conforme você registra as métricas.`;
    const card = (x) => { const d = esc(JSON.stringify({ title: x.title, tag: x.tag, format: x.format, channel: c, notes: x.hook ? 'Gancho: ' + x.hook : '' })); return `
        <div class="card idea">
          <div class="meta"><span class="badge st-agendado">${esc(x.format)}</span><span class="badge st-ideia">${esc(x.tag)}</span></div>
          <h4>${esc(x.title)}</h4>
          ${x.hook ? `<p class="hook">“${esc(x.hook)}”</p>` : ''}
          <div class="why">${icon('sparkles')}<span>${esc(x.why)}</span></div>
          <div style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--muted)">Potencial <span class="pot">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= x.score ? 'on' : ''}"></i>`).join('')}</span></div>
          <div class="foot"><button class="btn btn-sm btn-primary" data-idea='${d}'>${icon('plus')} Planejar</button><button class="btn btn-sm btn-ghost" data-ideasave='${d}'>Salvar ideia</button></div>
        </div>`; };
    return `
    <div class="grid g-main-r mt">
      <div class="card niche-card">
        <div class="card-head"><div><h3>${esc(ch.name)}</h3><p>${esc(ch.tagline || '')}</p></div><button class="icon-btn sm" data-act="settings" style="background:rgba(255,255,255,.15);border-color:transparent;color:#fff" data-tip="Editar nicho e temas">${icon('sliders')}</button></div>
        <p style="margin:0 0 14px">${esc(ch.niche)}</p>
        ${ch.pattern?.length ? `<div class="pattern"><div class="pt">${icon('target')} Padrão que funciona no canal</div><ol>${ch.pattern.map((p) => `<li>${esc(p)}</li>`).join('')}</ol></div>` : ''}
        ${ch.specs ? `<div class="tags" style="margin-top:14px">${ch.specs.split(' · ').map((x) => `<span>${esc(x)}</span>`).join('')}</div>` : ''}
        <p style="margin:14px 0 0;font-size:13px">${best}</p>
      </div>
      <div class="grid g-3" style="align-content:start">${ideas.length ? ideas.map(card).join('') : `<div class="card span-2"><div class="empty"><b>Você já usou todas as sugestões da lista</b>Digite um assunto acima ou adicione temas em Configurações.</div></div>`}</div>
    </div>`;
  }).join('');
  return `
  ${pageHead('Ideias', 'Temas recomendados a partir do padrão dos seus vídeos e do que performar melhor em cada canal.', `<button class="btn btn-dark" data-act="reroll">${icon('refresh')} Embaralhar</button>`)}
  <div class="card" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
    <div class="ins-ic">${icon('bulb')}</div>
    <div style="flex:1;min-width:200px"><b>Tem um assunto em mente?</b><div class="hint" style="margin:0">Digite e eu crio ganchos no estilo de cada canal.</div></div>
    <div class="search" style="flex:1;min-width:220px">${icon('search')}<input id="ideaTopic" placeholder="Ex.: Guerra Fria, Doors, Pet Simulator…" value="${esc(ui.ideaTopic)}"></div>
    <button class="btn btn-primary" data-act="idea-topic">Gerar ganchos</button>
    ${ui.ideaTopic ? `<button class="btn btn-ghost" data-act="idea-clear">Limpar</button>` : ''}
  </div>
  ${blocks}`;
};

/* =========================================================
   Modals
   ========================================================= */
function openModal(html, wide = false) {
  const root = $('#modal-root');
  root.innerHTML = `<div class="overlay"><div class="modal ${wide ? 'wide' : ''}">${html}</div></div>`;
  root.querySelector('.overlay').addEventListener('mousedown', (e) => { if (e.target.classList.contains('overlay')) closeModal(); });
  $$('[data-close]', root).forEach((b) => b.addEventListener('click', closeModal));
  return root.querySelector('.modal');
}
function closeModal() { $('#modal-root').innerHTML = ''; }
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

function videoModal(input = {}) {
  const existing = input.id ? S.videos.find((v) => v.id === input.id) : null;
  const v = JSON.parse(JSON.stringify(Object.assign({ id: null, title: '', channel: ui.filter !== 'all' ? ui.filter : Object.keys(S.channels)[0], status: 'ideia', date: '', time: '', platforms: [...PKEYS], tag: '', format: FORMATS[0], duration: '', notes: '', metrics: {} }, existing || input)));
  const isNew = !existing;
  const allTags = [...new Set(S.videos.map((x) => x.tag).concat(...Object.values(S.channels).map((c) => c.topics)).filter(Boolean))];
  const el = openModal(`
    <div class="modal-head"><h2>${isNew ? 'Novo vídeo' : 'Editar vídeo'}</h2><button class="icon-btn sm" data-close>${icon('x')}</button></div>
    <form class="form" id="vf" autocomplete="off">
      <label class="f full"><span>Título</span><input name="title" value="${esc(v.title)}" placeholder="Ex.: 3 fatos sobre vulcões que ninguém te contou" required></label>
      <label class="f"><span>Canal</span><select name="channel">${Object.keys(S.channels).map((c) => `<option value="${c}" ${v.channel === c ? 'selected' : ''}>${esc(chName(c))}</option>`).join('')}</select></label>
      <label class="f"><span>Status</span><select name="status">${Object.keys(STATUS).map((s) => `<option value="${s}" ${v.status === s ? 'selected' : ''}>${STATUS[s]}</option>`).join('')}</select></label>
      <label class="f"><span>Data</span><input type="date" name="date" value="${esc(v.date)}"></label>
      <label class="f"><span>Horário</span><input type="time" name="time" value="${esc(v.time)}"></label>
      <div class="f full"><span>Plataformas</span><div class="checks">${PKEYS.map((p) => `<label class="check"><input type="checkbox" name="pf" value="${p}" ${v.platforms.includes(p) ? 'checked' : ''}><span>${PLATFORMS[p].name}</span></label>`).join('')}</div></div>
      <label class="f"><span>Tema</span><input name="tag" list="tagList" value="${esc(v.tag)}" placeholder="Ex.: vulcões"><datalist id="tagList">${allTags.map((t) => `<option value="${esc(t)}">`).join('')}</datalist></label>
      <label class="f"><span>Formato</span><select name="format">${FORMATS.map((f) => `<option ${v.format === f ? 'selected' : ''}>${f}</option>`).join('')}</select></label>
      <label class="f"><span>Duração (segundos)</span><input type="number" min="0" name="duration" value="${esc(v.duration)}" placeholder="45"></label>
      <div class="f"></div>
      <div class="f full" id="metricsBox"></div>
      <label class="f full"><span>Roteiro / notas</span><textarea name="notes" rows="3" placeholder="Gancho, pontos principais, CTA…">${esc(v.notes)}</textarea></label>
    </form>
    <div class="modal-foot">${!isNew ? `<button class="btn btn-ghost danger" id="vDel">Excluir</button>` : ''}<span class="sp"></span><button class="btn btn-ghost" data-close>Cancelar</button><button class="btn btn-primary" id="vSave">Salvar</button></div>`);
  const form = $('#vf', el);
  const readMetrics = () => { $$('#metricsBox input', el).forEach((i) => { const [p, f] = i.name.split('.'); v.metrics[p] = v.metrics[p] || {}; v.metrics[p][f] = i.value === '' ? '' : +i.value; }); };
  const renderMetrics = () => {
    const st = form.status.value, pfs = $$('input[name=pf]:checked', el).map((i) => i.value);
    const box = $('#metricsBox', el);
    if (st !== 'publicado') { box.innerHTML = ''; return; }
    box.innerHTML = `<div class="section-t">${icon('trend')} Métricas por plataforma</div>
      ${pfs.length ? `<div class="mgrid"><div></div>${MET.map(([, n]) => `<div class="h">${n}</div>`).join('')}
      ${pfs.map((p) => `<div><span class="pf pf-${p}">${PLATFORMS[p].short}</span> <span style="font-size:12.5px">${PLATFORMS[p].name}</span></div>${MET.map(([f]) => `<input type="number" min="0" name="${p}.${f}" value="${esc(met(v, p)[f] ?? '')}" placeholder="0">`).join('')}`).join('')}</div>
      <p class="hint">Atualize os números sempre que quiser — o painel recalcula tudo na hora.</p>` : '<p class="hint">Selecione ao menos uma plataforma.</p>'}`;
  };
  renderMetrics();
  form.status.addEventListener('change', () => { readMetrics(); if (form.status.value === 'publicado' && !form.date.value) form.date.value = iso(today()); renderMetrics(); });
  $$('input[name=pf]', el).forEach((i) => i.addEventListener('change', () => { readMetrics(); renderMetrics(); }));
  $('#vSave', el).addEventListener('click', () => {
    readMetrics();
    const title = form.title.value.trim();
    if (!title) { form.title.focus(); toast('Dê um título ao vídeo'); return; }
    const pfs = $$('input[name=pf]:checked', el).map((i) => i.value);
    if (!pfs.length) { toast('Escolha ao menos uma plataforma'); return; }
    Object.assign(v, { title, channel: form.channel.value, status: form.status.value, date: form.date.value, time: form.time.value, platforms: pfs, tag: form.tag.value.trim(), format: form.format.value, duration: form.duration.value === '' ? '' : +form.duration.value, notes: form.notes.value });
    if (v.status === 'publicado' && !v.date) v.date = iso(today());
    if (isNew) { v.id = uid(); S.videos.push(v); } else { Object.assign(existing, v); }
    save(); closeModal(); render(); toast(isNew ? 'Vídeo adicionado' : 'Vídeo atualizado');
  });
  $('#vDel', el)?.addEventListener('click', () => {
    if (!confirm('Excluir este vídeo? Essa ação não pode ser desfeita.')) return;
    S.videos = S.videos.filter((x) => x.id !== existing.id); save(); closeModal(); render(); toast('Vídeo excluído');
  });
  setTimeout(() => { if (isNew && !v.title) form.title.focus(); }, 30);
}

function followersModal() {
  const t = iso(today());
  const el = openModal(`
    <div class="modal-head"><h2>Atualizar seguidores</h2><button class="icon-btn sm" data-close>${icon('x')}</button></div>
    <div class="modal-body">
      <p class="hint" style="margin:0 0 14px">Anote quantos seguidores cada perfil tem hoje. Fazendo isso toda semana, o Analytics desenha sua curva de crescimento.</p>
      ${Object.keys(S.channels).map((c) => `
        <div class="section-t">${chDot(c)}${esc(chName(c))}</div>
        <div class="grid g-3" style="gap:10px">${PKEYS.map((p) => `<label class="f"><span>${PLATFORMS[p].name}</span><input class="inp" type="number" min="0" data-c="${c}" data-p="${p}" value="${followersAt(t, [c], [p]) || ''}" placeholder="0"></label>`).join('')}</div>`).join('')}
    </div>
    <div class="modal-foot"><span class="sp"></span><button class="btn btn-ghost" data-close>Cancelar</button><button class="btn btn-primary" id="fSave">Salvar registro de hoje</button></div>`);
  $('#fSave', el).addEventListener('click', () => {
    $$('input[data-c]', el).forEach((i) => {
      if (i.value === '') return;
      S.followers = S.followers.filter((f) => !(f.date === t && f.channel === i.dataset.c && f.platform === i.dataset.p));
      S.followers.push({ date: t, channel: i.dataset.c, platform: i.dataset.p, value: +i.value });
    });
    save(); closeModal(); render(); toast('Seguidores registrados');
  });
}

function settingsModal() {
  const el = openModal(`
    <div class="modal-head"><h2>Configurações</h2><button class="icon-btn sm" data-close>${icon('x')}</button></div>
    <div class="modal-body">
      ${Object.keys(S.channels).map((c) => { const ch = S.channels[c]; return `
        <div class="section-t">${chDot(c)}Canal</div>
        <div class="form" style="padding:0">
          <label class="f"><span>Nome</span><input data-k="name" data-c="${c}" value="${esc(ch.name)}"></label>
          <label class="f"><span>Meta de vídeos por mês</span><input type="number" min="1" data-goal="${c}" value="${S.goals[c] || 12}"></label>
          <label class="f full"><span>Nicho / proposta</span><textarea rows="2" data-k="niche" data-c="${c}">${esc(ch.niche)}</textarea></label>
          <label class="f full"><span>Temas do nicho (separados por vírgula) — alimentam as sugestões de ideias</span><textarea rows="3" data-k="topics" data-c="${c}">${esc(ch.topics.join(', '))}</textarea></label>
        </div>`; }).join('')}
      <div class="section-t">${icon('layers')}Seus dados</div>
      <p class="hint" style="margin:0 0 10px">Tudo fica salvo neste navegador. Exporte um backup de vez em quando — ou para levar para outro computador.</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-sm btn-ghost" id="sExport">${icon('download')} Exportar backup</button>
        <label class="btn btn-sm btn-ghost">${icon('upload')} Importar backup<input type="file" accept="application/json" id="sImport" hidden></label>
        <button class="btn btn-sm btn-ghost" id="sDemo">${icon('sparkles')} Carregar exemplo</button>
        <button class="btn btn-sm btn-ghost danger" id="sClear">Apagar tudo</button>
      </div>
    </div>
    <div class="modal-foot"><span class="sp"></span><button class="btn btn-ghost" data-close>Cancelar</button><button class="btn btn-primary" id="sSave">Salvar</button></div>`, true);
  $('#sSave', el).addEventListener('click', () => {
    $$('[data-k]', el).forEach((i) => { const ch = S.channels[i.dataset.c]; ch[i.dataset.k] = i.dataset.k === 'topics' ? i.value.split(',').map((x) => x.trim()).filter(Boolean) : i.value.trim(); });
    $$('[data-goal]', el).forEach((i) => { S.goals[i.dataset.goal] = Math.max(1, +i.value || 1); });
    save(); closeModal(); render(); toast('Configurações salvas');
  });
  $('#sExport', el).addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `estudio-backup-${iso(today())}.json`; a.click(); URL.revokeObjectURL(a.href);
  });
  $('#sImport', el).addEventListener('change', async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try { const d = JSON.parse(await f.text()); if (!Array.isArray(d.videos)) throw 0; S = Object.assign(emptyState(), d); save(); closeModal(); render(); toast('Backup importado'); }
    catch { toast('Arquivo inválido'); }
  });
  $('#sDemo', el).addEventListener('click', () => { if (!confirm('Substituir seus dados atuais pelos dados de exemplo?')) return; S = demoState(); save(); closeModal(); render(); });
  $('#sClear', el).addEventListener('click', () => { if (!confirm('Apagar todos os vídeos e registros? Exporte um backup antes se quiser guardar.')) return; const ch = S.channels, g = S.goals; S = emptyState(); S.channels = ch; S.goals = g; save(); closeModal(); render(); toast('Tudo limpo — bora começar!'); });
}

/* =========================================================
   Render & events
   ========================================================= */
const NAV = [['inicio', 'Início', 'home'], ['cronograma', 'Cronograma', 'calendar'], ['publicados', 'Publicados', 'video'], ['analytics', 'Analytics', 'bars'], ['insights', 'Insights', 'bulb'], ['ideias', 'Ideias', 'sparkles']];
const initials = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
let collapsed = false;
try { collapsed = localStorage.getItem('estudio.collapsed') === '1'; } catch (e) { /* ok */ }
function renderSidebar() {
  $('#nav').innerHTML = NAV.map(([k, n, ic]) => `<a data-page="${k}" class="${ui.page === k ? 'active' : ''}" ${collapsed ? `data-tip="${n}"` : ''}>${icon(ic)}<span class="lbl">${n}</span></a>`).join('');
  const count = (c) => S.videos.filter((v) => v.channel === c && v.status === 'publicado').length;
  $('#sideChannels').innerHTML = `<button class="side-ch ${ui.filter === 'all' ? 'on' : ''}" data-ch="all" ${collapsed ? 'data-tip="Todos os canais"' : ''}><span class="ch-av all">${icon('layers')}</span><span class="lbl"><b>Todos os canais</b><small>${S.videos.filter((v) => v.status === 'publicado').length} publicados</small></span></button>` +
    Object.keys(S.channels).map((c) => `<button class="side-ch ${ui.filter === c ? 'on' : ''}" data-ch="${c}" ${collapsed ? `data-tip="${esc(chName(c))}"` : ''}><span class="ch-av" style="background:${chColor(c)}">${esc(initials(chName(c)))}</span><span class="lbl"><b>${esc(chName(c))}</b><small>${count(c)} publicados</small></span></button>`).join('');
  $('#shell').classList.toggle('collapsed', collapsed);
  $('#btnCollapse .lbl').textContent = collapsed ? 'Expandir' : 'Recolher';
  $$('.side-bottom .side-link').forEach((b) => { if (collapsed) b.setAttribute('data-tip', b.querySelector('.lbl').textContent); else b.removeAttribute('data-tip'); });
  const d = new Date();
  $('#crumb').innerHTML = `<span>Estúdio</span>${icon('chevR')}<b>${NAV.find((x) => x[0] === ui.page)[1]}</b>`;
  $('#today').textContent = `${WD[d.getDay()]}, ${d.getDate()} ${MON[d.getMonth()]}`;
}
const setDrawer = (open) => $('#shell').classList.toggle('drawer', open);
function render() {
  const page = (location.hash.slice(1) || 'inicio');
  ui.page = PAGES[page] ? page : 'inicio';
  renderSidebar();
  after.length = 0;
  $('#main').innerHTML = `<div class="page">${PAGES[ui.page]()}</div>`;
  after.forEach((f) => f());
  tip().classList.remove('show');
}

document.addEventListener('click', (e) => {
  const t = e.target;
  const nav = t.closest('#nav a'); if (nav) { setDrawer(false); location.hash = nav.dataset.page; return; }
  const ch = t.closest('#chanSeg button, .side-ch'); if (ch) { setDrawer(false); ui.filter = ch.dataset.ch; save(); render(); return; }
  if (t.closest('#btnMenu')) { setDrawer(true); return; }
  if (t.closest('#scrim')) { setDrawer(false); return; }
  if (t.closest('#btnCollapse')) { collapsed = !collapsed; try { localStorage.setItem('estudio.collapsed', collapsed ? '1' : '0'); } catch (e) { /* ok */ } renderSidebar(); render(); return; }
  const per = t.closest('#perSeg button'); if (per) { ui.period = +per.dataset.per; render(); return; }
  const pf = t.closest('#pfSeg button'); if (pf) { ui.platform = pf.dataset.pf; $$('#pfSeg button').forEach((b) => b.classList.toggle('on', b === pf)); renderPubBody(); return; }
  const th = t.closest('th[data-sort]'); if (th) { const k = th.dataset.sort; ui.sort = { key: k, dir: ui.sort.key === k ? -ui.sort.dir : -1 }; renderPubBody(); return; }
  const idea = t.closest('[data-idea]'); if (idea) { videoModal(JSON.parse(idea.dataset.idea)); return; }
  const ideaSave = t.closest('[data-ideasave]');
  if (ideaSave) { const d = JSON.parse(ideaSave.dataset.ideasave); S.videos.push({ id: uid(), status: 'ideia', date: '', time: '', platforms: [...PKEYS], duration: '', notes: '', metrics: {}, ...d }); save(); ideaSave.textContent = 'Salva ✓'; ideaSave.disabled = true; toast('Ideia salva no cronograma (coluna Ideia)'); return; }
  const ed = t.closest('[data-edit]'); if (ed) { e.preventDefault(); e.stopPropagation(); videoModal({ id: ed.dataset.edit }); return; }
  const day = t.closest('[data-day]'); if (day) { videoModal({ date: day.dataset.day, status: day.dataset.day < iso(today()) ? 'publicado' : 'agendado' }); return; }
  const act = t.closest('[data-act]'); if (!act) return;
  const a = act.dataset.act;
  if (a !== 'new' && act.tagName === 'A') e.preventDefault();
  if (a === 'new') videoModal();
  else if (a === 'new-status') videoModal({ status: act.dataset.status });
  else if (a === 'settings') settingsModal();
  else if (a === 'followers') { e.preventDefault(); followersModal(); }
  else if (a === 'cal-prev') { ui.calMonth = new Date(ui.calMonth.getFullYear(), ui.calMonth.getMonth() - 1, 1); render(); }
  else if (a === 'cal-next') { ui.calMonth = new Date(ui.calMonth.getFullYear(), ui.calMonth.getMonth() + 1, 1); render(); }
  else if (a === 'cal-today') { const d = today(); d.setDate(1); ui.calMonth = d; render(); }
  else if (a === 'reroll') { ui.ideaSeed++; render(); }
  else if (a === 'idea-topic') { ui.ideaTopic = $('#ideaTopic').value.trim(); ui.ideaSeed++; render(); }
  else if (a === 'idea-clear') { ui.ideaTopic = ''; render(); }
  else if (a === 'keep-demo') { S.demo = false; save(); render(); }
  else if (a === 'clear-demo') { if (!confirm('Apagar os dados de exemplo e começar do zero?')) return; const ch = S.channels, g = S.goals; S = emptyState(); S.channels = ch; S.goals = g; save(); render(); toast('Pronto! Adicione seu primeiro vídeo.'); }
});
document.addEventListener('input', (e) => { if (e.target.id === 'pubSearch') { ui.search = e.target.value; renderPubBody(); } });
document.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.id === 'ideaTopic') { ui.ideaTopic = e.target.value.trim(); ui.ideaSeed++; render(); } });

// Kanban drag & drop
document.addEventListener('dragstart', (e) => { const c = e.target.closest?.('.kcard'); if (c) { e.dataTransfer.setData('text/plain', c.dataset.id); e.dataTransfer.effectAllowed = 'move'; } });
document.addEventListener('dragover', (e) => { const col = e.target.closest?.('.kcol'); if (col) { e.preventDefault(); $$('.kcol').forEach((k) => k.classList.toggle('over', k === col)); } });
document.addEventListener('dragleave', (e) => { if (!e.relatedTarget?.closest?.('.kcol')) $$('.kcol').forEach((k) => k.classList.remove('over')); });
document.addEventListener('drop', (e) => {
  const col = e.target.closest?.('.kcol'); if (!col) return;
  e.preventDefault();
  const v = S.videos.find((x) => x.id === e.dataTransfer.getData('text/plain'));
  if (v && v.status !== col.dataset.col) { v.status = col.dataset.col; save(); render(); toast(`Movido para ${STATUS[v.status]}`); }
  $$('.kcol').forEach((k) => k.classList.remove('over'));
});

let rT;
addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => { ui.noAnim = true; render(); ui.noAnim = false; }, 150); });
addEventListener('hashchange', () => { closeModal(); render(); });

// ícones estáticos do layout
$$('[data-icon]').forEach((el) => { el.outerHTML = icon(el.dataset.icon); });
$('#btnNew').innerHTML = `${icon('plus')}<span class="lbl-t">Novo vídeo</span>`;
$('#btnFollowers').addEventListener('click', followersModal);
$('#btnSettings').addEventListener('click', settingsModal);
$('#btnNew').addEventListener('click', () => videoModal());

save();
render();
