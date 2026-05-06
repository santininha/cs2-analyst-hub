export type Team = {
  id: string;
  name: string;
  tag: string;
  region: string;
  worldRank: number;
  winRate: number;
  logoColor: string;
};

export type Player = {
  id: string;
  nick: string;
  realName: string;
  teamId: string;
  role: string;
  rating: number;
  kd: number;
  hsPct: number;
  adr: number;
  ctRating: number;
  trRating: number;
  strongMaps: string[];
  weakMaps: string[];
  notes?: string;
};

export type CSMap = {
  id: string;
  name: string;
  pickRate: number;
  ctWinRate: number;
  trWinRate: number;
  topTeams: string[];
  topPlayers: string[];
};

export type Match = {
  id: string;
  event: string;
  teamAId: string;
  teamBId: string;
  date: string;
  status: "upcoming" | "live" | "finished";
  format: string;
  maps: { name: string; scoreA?: number; scoreB?: number }[];
  result?: { scoreA: number; scoreB: number };
  preNotes?: string;
  postNotes?: string;
  keywords?: string[];
  techNotes?: string;
};

export type TeamMapStat = {
  teamId: string;
  mapId: string;
  winRate: number;
  ctWinRate: number;
  trWinRate: number;
  played: number;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  priority: "alta" | "media" | "baixa";
  date: string;
  linkedTeamId?: string;
  linkedPlayerId?: string;
  linkedMapId?: string;
  linkedMatchId?: string;
};

export type GlossaryTerm = {
  id: string;
  term: string;
  phrase: string;
  category:
    | "entrada"
    | "clutch"
    | "economia"
    | "mapa"
    | "destaque"
    | "crise"
    | "pos-jogo";
  favorite: boolean;
};

export const teams: Team[] = [
  { id: "furia", name: "FURIA", tag: "FUR", region: "BR", worldRank: 8, winRate: 64, logoColor: "oklch(0.25 0.05 60)" },
  { id: "mibr", name: "MIBR", tag: "MBR", region: "BR", worldRank: 22, winRate: 55, logoColor: "oklch(0.55 0.18 25)" },
  { id: "navi", name: "NAVI", tag: "NAVI", region: "EU", worldRank: 3, winRate: 71, logoColor: "oklch(0.7 0.18 90)" },
  { id: "vitality", name: "Vitality", tag: "VIT", region: "EU", worldRank: 1, winRate: 78, logoColor: "oklch(0.85 0.16 95)" },
  { id: "g2", name: "G2", tag: "G2", region: "EU", worldRank: 5, winRate: 68, logoColor: "oklch(0.65 0.05 60)" },
  { id: "spirit", name: "Spirit", tag: "SPR", region: "EU", worldRank: 2, winRate: 73, logoColor: "oklch(0.55 0.15 30)" },
  { id: "imperial", name: "Imperial", tag: "IMP", region: "BR", worldRank: 28, winRate: 52, logoColor: "oklch(0.4 0.12 250)" },
  { id: "pain", name: "paiN", tag: "PAIN", region: "BR", worldRank: 18, winRate: 58, logoColor: "oklch(0.55 0.2 20)" },
];

export const players: Player[] = [
  { id: "kscerato", nick: "KSCERATO", realName: "Kaike Cerato", teamId: "furia", role: "Rifler", rating: 1.18, kd: 1.22, hsPct: 58, adr: 82, ctRating: 1.21, trRating: 1.15, strongMaps: ["Mirage", "Inferno"], weakMaps: ["Vertigo"] },
  { id: "yuurih", nick: "yuurih", realName: "Yuri Santos", teamId: "furia", role: "Rifler", rating: 1.14, kd: 1.18, hsPct: 54, adr: 79, ctRating: 1.18, trRating: 1.10, strongMaps: ["Nuke", "Mirage"], weakMaps: ["Anubis"] },
  { id: "fallen", nick: "FalleN", realName: "Gabriel Toledo", teamId: "furia", role: "AWPer/IGL", rating: 1.05, kd: 1.04, hsPct: 42, adr: 71, ctRating: 1.10, trRating: 1.00, strongMaps: ["Inferno", "Overpass"], weakMaps: ["Vertigo"] },
  { id: "molodoy", nick: "molodoy", realName: "Bogdan Molodoy", teamId: "navi", role: "AWPer", rating: 1.22, kd: 1.30, hsPct: 38, adr: 81, ctRating: 1.28, trRating: 1.16, strongMaps: ["Mirage", "Ancient"], weakMaps: ["Vertigo"] },
  { id: "aleksib", nick: "Aleksib", realName: "Aleksi Virolainen", teamId: "navi", role: "IGL", rating: 1.02, kd: 0.98, hsPct: 50, adr: 68, ctRating: 1.05, trRating: 0.99, strongMaps: ["Nuke"], weakMaps: ["Anubis"] },
  { id: "zywoo", nick: "ZywOo", realName: "Mathieu Herbaut", teamId: "vitality", role: "AWPer", rating: 1.35, kd: 1.41, hsPct: 48, adr: 92, ctRating: 1.40, trRating: 1.30, strongMaps: ["Inferno", "Mirage", "Ancient"], weakMaps: [] },
  { id: "apex", nick: "apEX", realName: "Dan Madesclaire", teamId: "vitality", role: "IGL", rating: 0.98, kd: 0.94, hsPct: 52, adr: 70, ctRating: 1.02, trRating: 0.95, strongMaps: ["Nuke"], weakMaps: ["Vertigo"] },
  { id: "donk", nick: "donk", realName: "Danil Kryshkovets", teamId: "spirit", role: "Rifler", rating: 1.32, kd: 1.38, hsPct: 56, adr: 95, ctRating: 1.30, trRating: 1.34, strongMaps: ["Mirage", "Inferno", "Ancient"], weakMaps: [] },
  { id: "chopper", nick: "chopper", realName: "Leonid Vishnyakov", teamId: "spirit", role: "IGL", rating: 1.05, kd: 1.02, hsPct: 49, adr: 72, ctRating: 1.10, trRating: 1.00, strongMaps: ["Overpass"], weakMaps: ["Vertigo"] },
  { id: "niko", nick: "NiKo", realName: "Nikola Kovač", teamId: "g2", role: "Rifler", rating: 1.24, kd: 1.28, hsPct: 55, adr: 87, ctRating: 1.26, trRating: 1.22, strongMaps: ["Mirage", "Nuke"], weakMaps: ["Anubis"] },
  { id: "exit", nick: "exit", realName: "Exit Player", teamId: "mibr", role: "Rifler", rating: 1.10, kd: 1.12, hsPct: 53, adr: 76, ctRating: 1.12, trRating: 1.08, strongMaps: ["Inferno"], weakMaps: ["Vertigo"] },
  { id: "biguzera", nick: "biguzera", realName: "Felipe Lima", teamId: "pain", role: "AWPer", rating: 1.16, kd: 1.20, hsPct: 41, adr: 78, ctRating: 1.20, trRating: 1.12, strongMaps: ["Mirage", "Ancient"], weakMaps: ["Nuke"] },
];

export const maps: CSMap[] = [
  { id: "mirage", name: "Mirage", pickRate: 78, ctWinRate: 52, trWinRate: 48, topTeams: ["vitality", "navi", "spirit"], topPlayers: ["zywoo", "donk", "molodoy"] },
  { id: "inferno", name: "Inferno", pickRate: 82, ctWinRate: 56, trWinRate: 44, topTeams: ["vitality", "furia"], topPlayers: ["zywoo", "kscerato"] },
  { id: "nuke", name: "Nuke", pickRate: 65, ctWinRate: 58, trWinRate: 42, topTeams: ["g2", "navi"], topPlayers: ["niko", "yuurih"] },
  { id: "ancient", name: "Ancient", pickRate: 60, ctWinRate: 49, trWinRate: 51, topTeams: ["spirit", "vitality"], topPlayers: ["donk", "biguzera"] },
  { id: "anubis", name: "Anubis", pickRate: 55, ctWinRate: 47, trWinRate: 53, topTeams: ["g2", "spirit"], topPlayers: ["niko"] },
  { id: "overpass", name: "Overpass", pickRate: 50, ctWinRate: 54, trWinRate: 46, topTeams: ["spirit", "furia"], topPlayers: ["chopper", "fallen"] },
  { id: "vertigo", name: "Vertigo", pickRate: 30, ctWinRate: 51, trWinRate: 49, topTeams: ["mibr"], topPlayers: ["exit"] },
];

export const matches: Match[] = [
  {
    id: "m1",
    event: "IEM Katowice 2026",
    teamAId: "furia",
    teamBId: "navi",
    date: "2026-05-08T18:00:00Z",
    status: "upcoming",
    format: "BO3",
    maps: [{ name: "Mirage" }, { name: "Inferno" }, { name: "Nuke" }],
    keywords: ["FalleN IGL", "molodoy AWP duel", "FURIA T-side"],
    preNotes: "FURIA volta com FalleN no comando. NAVI vem invicta no Mirage há 6 jogos.",
    techNotes: "Atenção ao mid control no Mirage — KSCERATO costuma jogar agressivo via top mid.",
  },
  {
    id: "m2",
    event: "BLAST Premier Spring",
    teamAId: "vitality",
    teamBId: "spirit",
    date: "2026-05-09T20:00:00Z",
    status: "upcoming",
    format: "BO3",
    maps: [{ name: "Inferno" }, { name: "Ancient" }, { name: "Mirage" }],
    keywords: ["ZywOo vs donk", "duelo de IGLs", "Ancient decisivo"],
    preNotes: "O confronto da temporada — top 1 vs top 2 mundial.",
  },
  {
    id: "m3",
    event: "ESL Pro League S20",
    teamAId: "g2",
    teamBId: "mibr",
    date: "2026-05-05T16:00:00Z",
    status: "finished",
    format: "BO3",
    maps: [
      { name: "Nuke", scoreA: 16, scoreB: 11 },
      { name: "Mirage", scoreA: 14, scoreB: 16 },
      { name: "Inferno", scoreA: 16, scoreB: 9 },
    ],
    result: { scoreA: 2, scoreB: 1 },
  },
  {
    id: "m4",
    event: "IEM Katowice 2026",
    teamAId: "pain",
    teamBId: "imperial",
    date: "2026-05-04T14:00:00Z",
    status: "finished",
    format: "BO1",
    maps: [{ name: "Ancient", scoreA: 16, scoreB: 12 }],
    result: { scoreA: 1, scoreB: 0 },
  },
];

export const teamMapStats: TeamMapStat[] = [
  { teamId: "furia", mapId: "mirage", winRate: 68, ctWinRate: 60, trWinRate: 52, played: 25 },
  { teamId: "furia", mapId: "inferno", winRate: 72, ctWinRate: 65, trWinRate: 55, played: 30 },
  { teamId: "furia", mapId: "nuke", winRate: 58, ctWinRate: 55, trWinRate: 48, played: 18 },
  { teamId: "furia", mapId: "vertigo", winRate: 32, ctWinRate: 38, trWinRate: 28, played: 12 },
  { teamId: "navi", mapId: "mirage", winRate: 80, ctWinRate: 72, trWinRate: 60, played: 28 },
  { teamId: "navi", mapId: "ancient", winRate: 70, ctWinRate: 62, trWinRate: 58, played: 20 },
  { teamId: "navi", mapId: "nuke", winRate: 65, ctWinRate: 60, trWinRate: 50, played: 22 },
  { teamId: "navi", mapId: "vertigo", winRate: 35, ctWinRate: 40, trWinRate: 30, played: 10 },
  { teamId: "vitality", mapId: "inferno", winRate: 85, ctWinRate: 75, trWinRate: 65, played: 32 },
  { teamId: "vitality", mapId: "mirage", winRate: 78, ctWinRate: 70, trWinRate: 62, played: 30 },
  { teamId: "spirit", mapId: "ancient", winRate: 82, ctWinRate: 70, trWinRate: 70, played: 25 },
  { teamId: "spirit", mapId: "mirage", winRate: 75, ctWinRate: 68, trWinRate: 60, played: 28 },
  { teamId: "g2", mapId: "nuke", winRate: 78, ctWinRate: 70, trWinRate: 60, played: 26 },
];

export const notes: Note[] = [
  {
    id: "n1",
    title: "FURIA agressiva no T-side do Mirage",
    content: "Sempre tenta default rápido para palace. KSCERATO faz peek pelo top mid no round 1 do T.",
    tags: ["furia", "mirage", "t-side"],
    priority: "alta",
    date: "2026-05-01",
    linkedTeamId: "furia",
    linkedMapId: "mirage",
  },
  {
    id: "n2",
    title: "donk em rounds de pistola",
    content: "Estatística absurda de 78% de win rate em pistolas no Inferno na T-side.",
    tags: ["donk", "pistola", "inferno"],
    priority: "alta",
    date: "2026-05-03",
    linkedPlayerId: "donk",
    linkedMapId: "inferno",
  },
  {
    id: "n3",
    title: "Vitality no force-buy",
    content: "Quando Vitality faz force no round 3, vence em 64% das vezes — apEX adora.",
    tags: ["vitality", "economia"],
    priority: "media",
    date: "2026-04-28",
    linkedTeamId: "vitality",
  },
];

export const glossary: GlossaryTerm[] = [
  { id: "g1", term: "Default", phrase: "As duas equipes vão de default — disputa de mapa pelo controle de informação.", category: "entrada", favorite: true },
  { id: "g2", term: "Clutch 1v3", phrase: "Round impossível! Ele tem que segurar a bomba e ainda eliminar três!", category: "clutch", favorite: true },
  { id: "g3", term: "Eco round", phrase: "Round de economia — a ideia aqui é causar dano e roubar arma.", category: "economia", favorite: false },
  { id: "g4", term: "Force buy", phrase: "Force buy! Eles abrem mão da economia futura por esse round agora.", category: "economia", favorite: true },
  { id: "g5", term: "Mid control", phrase: "Quem dominar o meio dita o ritmo da rodada nesse mapa.", category: "mapa", favorite: false },
  { id: "g6", term: "Pop off", phrase: "Que momento! Ele está dominando completamente a partida.", category: "destaque", favorite: true },
  { id: "g7", term: "Time travado", phrase: "A comunicação parece travar — eles estão visivelmente em crise no mapa.", category: "crise", favorite: false },
  { id: "g8", term: "Veredito", phrase: "Vitória merecida — leitura de mapa e disciplina tática fizeram a diferença.", category: "pos-jogo", favorite: true },
];

export const dataSources = [
  { id: "ds1", name: "HLTV API", type: "API", status: "Em desenvolvimento", description: "Importação automática de partidas, times e jogadores via HLTV." },
  { id: "ds2", name: "Upload CSV", type: "CSV", status: "Em desenvolvimento", description: "Importe planilhas de estatísticas pessoais ou de eventos." },
  { id: "ds3", name: "Upload JSON", type: "JSON", status: "Em desenvolvimento", description: "Suporte a dumps JSON de plataformas como Leetify, Faceit." },
  { id: "ds4", name: "Link de partida", type: "URL", status: "Em desenvolvimento", description: "Cole o link de uma partida HLTV / BO3 e importe os dados." },
];

export const getTeam = (id: string) => teams.find((t) => t.id === id);
export const getPlayer = (id: string) => players.find((p) => p.id === id);
export const getMap = (id: string) => maps.find((m) => m.id === id);
export const getMatch = (id: string) => matches.find((m) => m.id === id);
export const getTeamPlayers = (teamId: string) => players.filter((p) => p.teamId === teamId);
export const getTeamMapStats = (teamId: string) => teamMapStats.filter((s) => s.teamId === teamId);
