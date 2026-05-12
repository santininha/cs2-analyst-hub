export type Team = {
  id: string;
  name: string;
  tag: string;
  region: string;
  worldRank: number;
  winRate: number;
  logoColor: string;
  // Enrichment from GRID API (optional — falls back to mock styling)
  logoUrl?: string;
  colorPrimary?: string;
  colorSecondary?: string;
  gridId?: string;
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
  /** False if the map is no longer in the current Active Duty rotation. */
  active?: boolean;
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
    | "pos-jogo"
    | "palavras-chave"
    | "expressao"
    | "termos-tecnicos";
  favorite: boolean;
};

// Top 20 — HLTV World Ranking on May 11th, 2026
export const teams: Team[] = [
  { id: "vitality", name: "Vitality", tag: "VIT", region: "EU", worldRank: 1, winRate: 78, logoColor: "oklch(0.85 0.16 95)" },
  { id: "navi", name: "Natus Vincere", tag: "NAVI", region: "EU", worldRank: 2, winRate: 71, logoColor: "oklch(0.7 0.18 90)" },
  { id: "furia", name: "FURIA", tag: "FUR", region: "BR", worldRank: 3, winRate: 68, logoColor: "oklch(0.25 0.05 60)" },
  { id: "falcons", name: "Falcons", tag: "FLCN", region: "SA", worldRank: 4, winRate: 66, logoColor: "oklch(0.55 0.18 30)" },
  { id: "spirit", name: "Team Spirit", tag: "SPR", region: "EU", worldRank: 5, winRate: 67, logoColor: "oklch(0.55 0.15 30)" },
  { id: "aurora", name: "Aurora", tag: "AUR", region: "EU", worldRank: 6, winRate: 64, logoColor: "oklch(0.6 0.15 280)" },
  { id: "parivision", name: "PARIVISION", tag: "PARI", region: "EU", worldRank: 7, winRate: 63, logoColor: "oklch(0.55 0.18 340)" },
  { id: "mongolz", name: "The MongolZ", tag: "MGZ", region: "AS", worldRank: 8, winRate: 62, logoColor: "oklch(0.45 0.1 30)" },
  { id: "astralis", name: "Astralis", tag: "AST", region: "EU", worldRank: 9, winRate: 60, logoColor: "oklch(0.55 0.18 25)" },
  { id: "fut", name: "FUT Esports", tag: "FUT", region: "EU", worldRank: 10, winRate: 59, logoColor: "oklch(0.5 0.14 260)" },
  { id: "mouz", name: "MOUZ", tag: "MOUZ", region: "EU", worldRank: 11, winRate: 60, logoColor: "oklch(0.55 0.18 20)" },
  { id: "g2", name: "G2 Esports", tag: "G2", region: "EU", worldRank: 12, winRate: 58, logoColor: "oklch(0.65 0.05 60)" },
  { id: "faze", name: "FaZe Clan", tag: "FAZE", region: "EU", worldRank: 13, winRate: 57, logoColor: "oklch(0.55 0.18 30)" },
  { id: "gamerlegion", name: "GamerLegion", tag: "GL", region: "EU", worldRank: 14, winRate: 56, logoColor: "oklch(0.5 0.12 30)" },
  { id: "3dmax", name: "3DMAX", tag: "3DM", region: "EU", worldRank: 15, winRate: 55, logoColor: "oklch(0.6 0.15 50)" },
  { id: "9z", name: "9z Team", tag: "9Z", region: "SA", worldRank: 16, winRate: 54, logoColor: "oklch(0.6 0.18 150)" },
  { id: "b8", name: "B8", tag: "B8", region: "EU", worldRank: 17, winRate: 53, logoColor: "oklch(0.55 0.15 250)" },
  { id: "legacy", name: "Legacy", tag: "LEG", region: "BR", worldRank: 18, winRate: 52, logoColor: "oklch(0.45 0.12 30)" },
  { id: "monte", name: "Monte", tag: "MNT", region: "EU", worldRank: 19, winRate: 51, logoColor: "oklch(0.55 0.15 80)" },
  { id: "heroic", name: "Heroic", tag: "HRC", region: "EU", worldRank: 20, winRate: 50, logoColor: "oklch(0.55 0.18 25)" },
  // Legacy entries kept to preserve existing player/match references (out of top 20).
  { id: "mibr", name: "MIBR", tag: "MBR", region: "BR", worldRank: 26, winRate: 55, logoColor: "oklch(0.55 0.18 25)" },
  { id: "imperial", name: "Imperial", tag: "IMP", region: "BR", worldRank: 40, winRate: 52, logoColor: "oklch(0.4 0.12 250)" },
  { id: "pain", name: "paiN", tag: "PAIN", region: "BR", worldRank: 35, winRate: 58, logoColor: "oklch(0.55 0.2 20)" },
];

// Active rosters (5 per team) — snapshot of May 12, 2026
export const players: Player[] = [
  // #1 Vitality
  { id: "zywoo", nick: "ZywOo", realName: "Mathieu Herbaut", teamId: "vitality", role: "AWPer", rating: 1.35, kd: 1.41, hsPct: 48, adr: 92, ctRating: 1.40, trRating: 1.30, strongMaps: ["Inferno", "Mirage", "Ancient"], weakMaps: [] },
  { id: "ropz", nick: "ropz", realName: "Robin Kool", teamId: "vitality", role: "Rifler", rating: 1.20, kd: 1.22, hsPct: 47, adr: 82, ctRating: 1.24, trRating: 1.16, strongMaps: ["Mirage", "Nuke"], weakMaps: [] },
  { id: "flamez", nick: "flameZ", realName: "Shahar Shushan", teamId: "vitality", role: "Entry", rating: 1.18, kd: 1.20, hsPct: 51, adr: 84, ctRating: 1.16, trRating: 1.21, strongMaps: ["Inferno", "Ancient"], weakMaps: ["Anubis"] },
  { id: "mezii", nick: "mezii", realName: "William Merriman", teamId: "vitality", role: "Support", rating: 1.08, kd: 1.06, hsPct: 49, adr: 74, ctRating: 1.10, trRating: 1.05, strongMaps: ["Nuke"], weakMaps: ["Vertigo"] },
  { id: "apex", nick: "apEX", realName: "Dan Madesclaire", teamId: "vitality", role: "IGL", rating: 0.98, kd: 0.94, hsPct: 52, adr: 70, ctRating: 1.02, trRating: 0.95, strongMaps: ["Nuke"], weakMaps: ["Vertigo"] },

  // #2 Natus Vincere
  { id: "w0nderful", nick: "w0nderful", realName: "Ihor Zhdanov", teamId: "navi", role: "AWPer", rating: 1.18, kd: 1.20, hsPct: 41, adr: 78, ctRating: 1.22, trRating: 1.13, strongMaps: ["Mirage", "Ancient"], weakMaps: [] },
  { id: "b1t", nick: "b1t", realName: "Valeriy Vakhovskyi", teamId: "navi", role: "Rifler", rating: 1.15, kd: 1.18, hsPct: 53, adr: 81, ctRating: 1.17, trRating: 1.13, strongMaps: ["Inferno", "Mirage"], weakMaps: ["Anubis"] },
  { id: "im", nick: "iM", realName: "Ihor Zubenko", teamId: "navi", role: "Rifler", rating: 1.10, kd: 1.10, hsPct: 50, adr: 76, ctRating: 1.12, trRating: 1.08, strongMaps: ["Nuke"], weakMaps: ["Vertigo"] },
  { id: "makazze", nick: "makazze", realName: "Mihai Gheorghe", teamId: "navi", role: "Entry", rating: 1.06, kd: 1.05, hsPct: 52, adr: 75, ctRating: 1.04, trRating: 1.08, strongMaps: ["Mirage"], weakMaps: ["Anubis"] },
  { id: "aleksib", nick: "Aleksib", realName: "Aleksi Virolainen", teamId: "navi", role: "IGL", rating: 1.02, kd: 0.98, hsPct: 50, adr: 68, ctRating: 1.05, trRating: 0.99, strongMaps: ["Nuke"], weakMaps: ["Anubis"] },

  // #3 FURIA
  { id: "kscerato", nick: "KSCERATO", realName: "Kaike Cerato", teamId: "furia", role: "Rifler", rating: 1.18, kd: 1.22, hsPct: 58, adr: 82, ctRating: 1.21, trRating: 1.15, strongMaps: ["Mirage", "Inferno"], weakMaps: ["Vertigo"] },
  { id: "yuurih", nick: "yuurih", realName: "Yuri Santos", teamId: "furia", role: "Rifler", rating: 1.14, kd: 1.18, hsPct: 54, adr: 79, ctRating: 1.18, trRating: 1.10, strongMaps: ["Nuke", "Mirage"], weakMaps: ["Anubis"] },
  { id: "molodoy", nick: "molodoy", realName: "Bogdan Molodoy", teamId: "furia", role: "AWPer", rating: 1.22, kd: 1.30, hsPct: 38, adr: 81, ctRating: 1.28, trRating: 1.16, strongMaps: ["Mirage", "Ancient"], weakMaps: ["Vertigo"] },
  { id: "yekindar", nick: "YEKINDAR", realName: "Mareks Gaļinskis", teamId: "furia", role: "Entry", rating: 1.12, kd: 1.10, hsPct: 50, adr: 80, ctRating: 1.08, trRating: 1.16, strongMaps: ["Inferno", "Anubis"], weakMaps: [] },
  { id: "fallen", nick: "FalleN", realName: "Gabriel Toledo", teamId: "furia", role: "IGL", rating: 1.05, kd: 1.04, hsPct: 42, adr: 71, ctRating: 1.10, trRating: 1.00, strongMaps: ["Inferno", "Overpass"], weakMaps: ["Vertigo"] },

  // #4 Falcons
  { id: "m0nesy", nick: "m0NESY", realName: "Ilya Osipov", teamId: "falcons", role: "AWPer", rating: 1.30, kd: 1.34, hsPct: 44, adr: 88, ctRating: 1.32, trRating: 1.28, strongMaps: ["Mirage", "Inferno"], weakMaps: [] },
  { id: "niko", nick: "NiKo", realName: "Nikola Kovač", teamId: "falcons", role: "Rifler", rating: 1.24, kd: 1.28, hsPct: 55, adr: 87, ctRating: 1.26, trRating: 1.22, strongMaps: ["Mirage", "Nuke"], weakMaps: ["Anubis"] },
  { id: "teses", nick: "TeSeS", realName: "René Madsen", teamId: "falcons", role: "Rifler", rating: 1.14, kd: 1.16, hsPct: 49, adr: 80, ctRating: 1.16, trRating: 1.12, strongMaps: ["Ancient"], weakMaps: ["Vertigo"] },
  { id: "kyousuke", nick: "kyousuke", realName: "Kyousuke Saito", teamId: "falcons", role: "Entry", rating: 1.10, kd: 1.10, hsPct: 51, adr: 78, ctRating: 1.06, trRating: 1.14, strongMaps: ["Inferno"], weakMaps: ["Anubis"] },
  { id: "karrigan", nick: "karrigan", realName: "Finn Andersen", teamId: "falcons", role: "IGL", rating: 0.96, kd: 0.92, hsPct: 50, adr: 68, ctRating: 1.00, trRating: 0.93, strongMaps: ["Nuke", "Overpass"], weakMaps: ["Vertigo"] },

  // #5 Spirit
  { id: "donk", nick: "donk", realName: "Danil Kryshkovets", teamId: "spirit", role: "Rifler", rating: 1.32, kd: 1.38, hsPct: 56, adr: 95, ctRating: 1.30, trRating: 1.34, strongMaps: ["Mirage", "Inferno", "Ancient"], weakMaps: [] },
  { id: "sh1ro", nick: "sh1ro", realName: "Dmitry Sokolov", teamId: "spirit", role: "AWPer", rating: 1.20, kd: 1.22, hsPct: 38, adr: 80, ctRating: 1.26, trRating: 1.14, strongMaps: ["Inferno", "Nuke"], weakMaps: [] },
  { id: "magixx", nick: "magixx", realName: "Boris Vorobiev", teamId: "spirit", role: "Rifler", rating: 1.10, kd: 1.10, hsPct: 53, adr: 76, ctRating: 1.12, trRating: 1.08, strongMaps: ["Mirage"], weakMaps: ["Vertigo"] },
  { id: "zont1x", nick: "zont1x", realName: "Myroslav Plakhotia", teamId: "spirit", role: "Entry", rating: 1.12, kd: 1.14, hsPct: 51, adr: 78, ctRating: 1.08, trRating: 1.16, strongMaps: ["Ancient"], weakMaps: ["Anubis"] },
  { id: "chopper", nick: "chopper", realName: "Leonid Vishnyakov", teamId: "spirit", role: "IGL", rating: 1.05, kd: 1.02, hsPct: 49, adr: 72, ctRating: 1.10, trRating: 1.00, strongMaps: ["Overpass"], weakMaps: ["Vertigo"] },

  // #6 Aurora
  { id: "xantares", nick: "XANTARES", realName: "İsmailcan Dörtkardeş", teamId: "aurora", role: "Entry", rating: 1.16, kd: 1.18, hsPct: 56, adr: 84, ctRating: 1.12, trRating: 1.20, strongMaps: ["Mirage", "Inferno"], weakMaps: ["Anubis"] },
  { id: "woxic", nick: "woxic", realName: "Özgür Eker", teamId: "aurora", role: "AWPer", rating: 1.18, kd: 1.20, hsPct: 42, adr: 80, ctRating: 1.22, trRating: 1.14, strongMaps: ["Mirage"], weakMaps: ["Vertigo"] },
  { id: "wicadia", nick: "Wicadia", realName: "Ali Haydar Yalçın", teamId: "aurora", role: "Rifler", rating: 1.04, kd: 1.04, hsPct: 51, adr: 73, ctRating: 1.06, trRating: 1.02, strongMaps: ["Nuke"], weakMaps: ["Vertigo"] },
  { id: "soulfly", nick: "soulfly", realName: "Caner Kesici", teamId: "aurora", role: "Rifler", rating: 1.00, kd: 0.99, hsPct: 50, adr: 70, ctRating: 1.02, trRating: 0.98, strongMaps: ["Inferno"], weakMaps: ["Anubis"] },
  { id: "maj3r", nick: "MAJ3R", realName: "Engin Küpeli", teamId: "aurora", role: "IGL", rating: 0.91, kd: 0.88, hsPct: 47, adr: 65, ctRating: 0.95, trRating: 0.88, strongMaps: ["Overpass"], weakMaps: ["Vertigo"] },

  // #7 PARIVISION
  { id: "jame", nick: "Jame", realName: "Dzhami Ali", teamId: "parivision", role: "AWPer/IGL", rating: 1.10, kd: 1.10, hsPct: 36, adr: 72, ctRating: 1.16, trRating: 1.04, strongMaps: ["Inferno", "Nuke"], weakMaps: [] },
  { id: "zweih", nick: "zweih", realName: "Ivan Gogin", teamId: "parivision", role: "Rifler", rating: 1.08, kd: 1.06, hsPct: 52, adr: 76, ctRating: 1.06, trRating: 1.10, strongMaps: ["Mirage"], weakMaps: ["Anubis"] },
  { id: "nota", nick: "nota", realName: "Aleksey Smelaya", teamId: "parivision", role: "Rifler", rating: 1.05, kd: 1.04, hsPct: 50, adr: 74, ctRating: 1.07, trRating: 1.03, strongMaps: ["Ancient"], weakMaps: ["Vertigo"] },
  { id: "belchonokk", nick: "BELCHONOKK", realName: "Vladimir Belousov", teamId: "parivision", role: "Entry", rating: 1.06, kd: 1.06, hsPct: 49, adr: 75, ctRating: 1.02, trRating: 1.10, strongMaps: ["Inferno"], weakMaps: ["Vertigo"] },
  { id: "dastan", nick: "dastan", realName: "Dastan Akbaev", teamId: "parivision", role: "Support", rating: 0.98, kd: 0.96, hsPct: 48, adr: 68, ctRating: 1.00, trRating: 0.96, strongMaps: ["Nuke"], weakMaps: ["Anubis"] },

  // #8 The MongolZ
  { id: "910", nick: "910", realName: "Usukhbayar Banzragch", teamId: "mongolz", role: "Rifler", rating: 1.16, kd: 1.18, hsPct: 55, adr: 82, ctRating: 1.14, trRating: 1.18, strongMaps: ["Mirage", "Ancient"], weakMaps: ["Vertigo"] },
  { id: "blitz", nick: "bLitz", realName: "Garidmagnai Byambasuren", teamId: "mongolz", role: "AWPer", rating: 1.14, kd: 1.16, hsPct: 40, adr: 78, ctRating: 1.18, trRating: 1.10, strongMaps: ["Inferno"], weakMaps: ["Anubis"] },
  { id: "mzinho", nick: "mzinho", realName: "Khuukhenkhuu Erdenebat", teamId: "mongolz", role: "Rifler", rating: 1.10, kd: 1.10, hsPct: 51, adr: 76, ctRating: 1.12, trRating: 1.08, strongMaps: ["Nuke"], weakMaps: ["Vertigo"] },
  { id: "techno", nick: "Techno", realName: "Sodbayar Munkhbold", teamId: "mongolz", role: "Entry", rating: 1.06, kd: 1.05, hsPct: 50, adr: 75, ctRating: 1.02, trRating: 1.10, strongMaps: ["Mirage"], weakMaps: ["Anubis"] },
  { id: "senzu", nick: "Senzu", realName: "Khishigbat Ariunbold", teamId: "mongolz", role: "IGL", rating: 1.00, kd: 0.97, hsPct: 49, adr: 70, ctRating: 1.04, trRating: 0.96, strongMaps: ["Overpass"], weakMaps: ["Vertigo"] },

  // #9 Astralis
  { id: "jabbi", nick: "jabbi", realName: "Jakob Nygaard", teamId: "astralis", role: "Rifler", rating: 1.08, kd: 1.08, hsPct: 52, adr: 76, ctRating: 1.10, trRating: 1.06, strongMaps: ["Mirage"], weakMaps: ["Vertigo"] },
  { id: "staehr", nick: "Staehr", realName: "Victor Staehr", teamId: "astralis", role: "Entry", rating: 1.06, kd: 1.04, hsPct: 50, adr: 76, ctRating: 1.02, trRating: 1.10, strongMaps: ["Inferno"], weakMaps: ["Anubis"] },
  { id: "phzy", nick: "phzy", realName: "Love Smidebrant", teamId: "astralis", role: "AWPer", rating: 1.13, kd: 1.14, hsPct: 40, adr: 78, ctRating: 1.18, trRating: 1.08, strongMaps: ["Nuke"], weakMaps: ["Vertigo"] },
  { id: "ryu", nick: "ryu", realName: "Gytis Glušauskas", teamId: "astralis", role: "Rifler", rating: 1.05, kd: 1.05, hsPct: 51, adr: 74, ctRating: 1.06, trRating: 1.04, strongMaps: ["Ancient"], weakMaps: ["Anubis"] },
  { id: "hooxi", nick: "HooXi", realName: "Rasmus Nielsen", teamId: "astralis", role: "IGL", rating: 0.86, kd: 0.82, hsPct: 47, adr: 62, ctRating: 0.90, trRating: 0.82, strongMaps: ["Overpass"], weakMaps: ["Vertigo"] },

  // #10 FUT Esports
  { id: "krabeni", nick: "Krabeni", realName: "Aulon Fazlija", teamId: "fut", role: "Rifler", rating: 1.10, kd: 1.10, hsPct: 50, adr: 77, ctRating: 1.12, trRating: 1.08, strongMaps: ["Mirage"], weakMaps: ["Vertigo"] },
  { id: "launx", nick: "lauNX", realName: "Laurențiu Țârlea", teamId: "fut", role: "AWPer", rating: 1.14, kd: 1.16, hsPct: 41, adr: 79, ctRating: 1.18, trRating: 1.10, strongMaps: ["Nuke"], weakMaps: ["Anubis"] },
  { id: "dem0n", nick: "dem0n", realName: "Dmytro Myroshnychenko", teamId: "fut", role: "Rifler", rating: 1.06, kd: 1.06, hsPct: 51, adr: 74, ctRating: 1.08, trRating: 1.04, strongMaps: ["Inferno"], weakMaps: ["Vertigo"] },
  { id: "dziugss", nick: "dziugss", realName: "Džiugas Steponavičius", teamId: "fut", role: "Entry", rating: 1.06, kd: 1.05, hsPct: 50, adr: 75, ctRating: 1.02, trRating: 1.10, strongMaps: ["Ancient"], weakMaps: ["Anubis"] },
  { id: "cmtry", nick: "cmtry", realName: "Nykyta Samolotov", teamId: "fut", role: "IGL", rating: 1.07, kd: 1.07, hsPct: 49, adr: 73, ctRating: 1.10, trRating: 1.04, strongMaps: ["Overpass"], weakMaps: ["Vertigo"] },

  // #11 MOUZ
  { id: "torzsi", nick: "torzsi", realName: "Ádám Torzsás", teamId: "mouz", role: "AWPer", rating: 1.18, kd: 1.20, hsPct: 38, adr: 80, ctRating: 1.22, trRating: 1.14, strongMaps: ["Mirage", "Nuke"], weakMaps: [] },
  { id: "spinx", nick: "Spinx", realName: "Lotan Giladi", teamId: "mouz", role: "Rifler", rating: 1.16, kd: 1.18, hsPct: 52, adr: 82, ctRating: 1.16, trRating: 1.16, strongMaps: ["Inferno", "Mirage"], weakMaps: ["Vertigo"] },
  { id: "xertion", nick: "xertioN", realName: "Dorian Berman", teamId: "mouz", role: "Entry", rating: 1.10, kd: 1.10, hsPct: 51, adr: 78, ctRating: 1.06, trRating: 1.14, strongMaps: ["Ancient"], weakMaps: ["Anubis"] },
  { id: "jl", nick: "jL", realName: "Justinas Lekavičius", teamId: "mouz", role: "Rifler", rating: 1.12, kd: 1.12, hsPct: 50, adr: 78, ctRating: 1.14, trRating: 1.10, strongMaps: ["Mirage"], weakMaps: ["Vertigo"] },
  { id: "xelex", nick: "xelex", realName: "Xelex Player", teamId: "mouz", role: "IGL", rating: 1.00, kd: 0.98, hsPct: 49, adr: 70, ctRating: 1.02, trRating: 0.98, strongMaps: ["Overpass"], weakMaps: ["Vertigo"] },

  // #12 G2 Esports
  { id: "huntr", nick: "huNter-", realName: "Nemanja Kovač", teamId: "g2", role: "Rifler", rating: 1.10, kd: 1.10, hsPct: 52, adr: 76, ctRating: 1.12, trRating: 1.08, strongMaps: ["Mirage", "Nuke"], weakMaps: ["Vertigo"] },
  { id: "malbsmd", nick: "malbsMd", realName: "Malek Bsata", teamId: "g2", role: "Rifler", rating: 1.12, kd: 1.14, hsPct: 53, adr: 79, ctRating: 1.10, trRating: 1.14, strongMaps: ["Inferno"], weakMaps: ["Anubis"] },
  { id: "matys", nick: "MATYS", realName: "Mateusz Bochenek", teamId: "g2", role: "Entry", rating: 1.08, kd: 1.08, hsPct: 51, adr: 76, ctRating: 1.04, trRating: 1.12, strongMaps: ["Ancient"], weakMaps: ["Vertigo"] },
  { id: "sunpayus", nick: "SunPayus", realName: "Álvaro Garcia", teamId: "g2", role: "AWPer", rating: 1.10, kd: 1.10, hsPct: 38, adr: 76, ctRating: 1.16, trRating: 1.04, strongMaps: ["Mirage"], weakMaps: ["Vertigo"] },
  { id: "heavygod", nick: "HeavyGod", realName: "Slavi Iliev", teamId: "g2", role: "IGL", rating: 0.98, kd: 0.96, hsPct: 49, adr: 70, ctRating: 1.02, trRating: 0.94, strongMaps: ["Overpass"], weakMaps: ["Anubis"] },

  // #13 FaZe Clan
  { id: "broky", nick: "broky", realName: "Helvijs Saukants", teamId: "faze", role: "AWPer", rating: 1.16, kd: 1.18, hsPct: 42, adr: 80, ctRating: 1.20, trRating: 1.12, strongMaps: ["Mirage", "Inferno"], weakMaps: [] },
  { id: "frozen", nick: "frozen", realName: "David Čerňanský", teamId: "faze", role: "Rifler", rating: 1.15, kd: 1.16, hsPct: 53, adr: 81, ctRating: 1.14, trRating: 1.16, strongMaps: ["Mirage"], weakMaps: ["Vertigo"] },
  { id: "twistzz", nick: "Twistzz", realName: "Russel Van Dulken", teamId: "faze", role: "Rifler", rating: 1.16, kd: 1.18, hsPct: 50, adr: 80, ctRating: 1.18, trRating: 1.14, strongMaps: ["Inferno", "Nuke"], weakMaps: [] },
  { id: "neityu", nick: "Neityu", realName: "Ryan Aubry", teamId: "faze", role: "Entry", rating: 1.04, kd: 1.02, hsPct: 50, adr: 73, ctRating: 1.02, trRating: 1.06, strongMaps: ["Ancient"], weakMaps: ["Anubis"] },
  { id: "jcobbb", nick: "jcobbb", realName: "Jakub Pietruszewski", teamId: "faze", role: "IGL", rating: 1.00, kd: 0.99, hsPct: 49, adr: 72, ctRating: 1.04, trRating: 0.96, strongMaps: ["Overpass"], weakMaps: ["Vertigo"] },

  // #14 GamerLegion
  { id: "rez", nick: "REZ", realName: "Fredrik Sterner", teamId: "gamerlegion", role: "Rifler", rating: 1.12, kd: 1.12, hsPct: 52, adr: 78, ctRating: 1.10, trRating: 1.14, strongMaps: ["Mirage"], weakMaps: ["Anubis"] },
  { id: "ztr", nick: "ztr", realName: "Ryan Sukmanov", teamId: "gamerlegion", role: "AWPer", rating: 1.10, kd: 1.10, hsPct: 39, adr: 76, ctRating: 1.14, trRating: 1.06, strongMaps: ["Inferno"], weakMaps: ["Vertigo"] },
  { id: "sl3nd", nick: "sl3nd", realName: "Vlad Vetrov", teamId: "gamerlegion", role: "Rifler", rating: 1.06, kd: 1.06, hsPct: 51, adr: 74, ctRating: 1.08, trRating: 1.04, strongMaps: ["Nuke"], weakMaps: ["Vertigo"] },
  { id: "tauson", nick: "Tauson", realName: "Rasmus Tauson", teamId: "gamerlegion", role: "Entry", rating: 1.05, kd: 1.04, hsPct: 50, adr: 74, ctRating: 1.02, trRating: 1.08, strongMaps: ["Ancient"], weakMaps: ["Anubis"] },
  { id: "pr", nick: "PR", realName: "Patryk Krupiński", teamId: "gamerlegion", role: "IGL", rating: 0.96, kd: 0.94, hsPct: 48, adr: 68, ctRating: 1.00, trRating: 0.92, strongMaps: ["Overpass"], weakMaps: ["Vertigo"] },

  // #15 3DMAX
  { id: "lucky", nick: "Lucky", realName: "Lucas Touret", teamId: "3dmax", role: "AWPer", rating: 1.10, kd: 1.10, hsPct: 41, adr: 77, ctRating: 1.14, trRating: 1.06, strongMaps: ["Mirage"], weakMaps: ["Vertigo"] },
  { id: "graviti", nick: "Graviti", realName: "Mathéo Rocchi", teamId: "3dmax", role: "Rifler", rating: 1.06, kd: 1.06, hsPct: 51, adr: 75, ctRating: 1.08, trRating: 1.04, strongMaps: ["Inferno"], weakMaps: ["Anubis"] },
  { id: "ex3rcice", nick: "Ex3rcice", realName: "Pierre Bulinge", teamId: "3dmax", role: "Rifler", rating: 1.04, kd: 1.04, hsPct: 50, adr: 74, ctRating: 1.06, trRating: 1.02, strongMaps: ["Ancient"], weakMaps: ["Vertigo"] },
  { id: "misutaaa", nick: "misutaaa", realName: "Audric Pelissier", teamId: "3dmax", role: "Entry", rating: 1.05, kd: 1.04, hsPct: 50, adr: 75, ctRating: 1.02, trRating: 1.08, strongMaps: ["Mirage"], weakMaps: ["Anubis"] },
  { id: "maka", nick: "Maka", realName: "David Ajavon", teamId: "3dmax", role: "IGL", rating: 0.97, kd: 0.95, hsPct: 48, adr: 68, ctRating: 1.00, trRating: 0.94, strongMaps: ["Overpass"], weakMaps: ["Vertigo"] },

  // #16 9z Team
  { id: "dgt", nick: "dgt", realName: "Franco García", teamId: "9z", role: "Rifler", rating: 1.17, kd: 1.18, hsPct: 53, adr: 80, ctRating: 1.18, trRating: 1.16, strongMaps: ["Mirage", "Inferno"], weakMaps: ["Vertigo"] },
  { id: "luchov", nick: "luchov", realName: "Luciano Herrera", teamId: "9z", role: "Rifler", rating: 1.04, kd: 1.04, hsPct: 50, adr: 74, ctRating: 1.06, trRating: 1.02, strongMaps: ["Nuke"], weakMaps: ["Anubis"] },
  { id: "huasopeek", nick: "HUASOPEEK", realName: "Matías Ibáñez", teamId: "9z", role: "Entry", rating: 1.06, kd: 1.05, hsPct: 51, adr: 75, ctRating: 1.02, trRating: 1.10, strongMaps: ["Ancient"], weakMaps: ["Vertigo"] },
  { id: "meyern", nick: "meyern", realName: "Ignacio Meyer", teamId: "9z", role: "AWPer", rating: 1.08, kd: 1.08, hsPct: 39, adr: 76, ctRating: 1.12, trRating: 1.04, strongMaps: ["Mirage"], weakMaps: ["Anubis"] },
  { id: "max", nick: "max", realName: "Maximiliano Gonzalez", teamId: "9z", role: "IGL", rating: 0.92, kd: 0.90, hsPct: 47, adr: 66, ctRating: 0.96, trRating: 0.88, strongMaps: ["Overpass"], weakMaps: ["Vertigo"] },

  // #17 B8
  { id: "alex666", nick: "alex666", realName: "Oleksandr Krat", teamId: "b8", role: "Rifler", rating: 1.10, kd: 1.10, hsPct: 51, adr: 77, ctRating: 1.10, trRating: 1.10, strongMaps: ["Mirage"], weakMaps: ["Vertigo"] },
  { id: "esenthial", nick: "esenthial", realName: "Vitaliy Tymchenko", teamId: "b8", role: "AWPer", rating: 1.08, kd: 1.08, hsPct: 38, adr: 75, ctRating: 1.12, trRating: 1.04, strongMaps: ["Inferno"], weakMaps: ["Anubis"] },
  { id: "kensizor", nick: "kensizor", realName: "Serhii Khrystenko", teamId: "b8", role: "Entry", rating: 1.06, kd: 1.05, hsPct: 50, adr: 75, ctRating: 1.02, trRating: 1.10, strongMaps: ["Ancient"], weakMaps: ["Vertigo"] },
  { id: "maddened", nick: "maddened", realName: "Yegor Tarasenko", teamId: "b8", role: "Rifler", rating: 1.04, kd: 1.04, hsPct: 50, adr: 73, ctRating: 1.06, trRating: 1.02, strongMaps: ["Nuke"], weakMaps: ["Anubis"] },
  { id: "npl", nick: "npl", realName: "Mykyta Trotsenko", teamId: "b8", role: "IGL", rating: 0.95, kd: 0.93, hsPct: 48, adr: 67, ctRating: 0.98, trRating: 0.92, strongMaps: ["Overpass"], weakMaps: ["Vertigo"] },

  // #18 Legacy
  { id: "dumau", nick: "dumau", realName: "Lucas Schettino", teamId: "legacy", role: "AWPer", rating: 1.14, kd: 1.14, hsPct: 40, adr: 78, ctRating: 1.18, trRating: 1.10, strongMaps: ["Mirage", "Inferno"], weakMaps: [] },
  { id: "latto", nick: "latto", realName: "Caio Lobato", teamId: "legacy", role: "Rifler", rating: 1.10, kd: 1.10, hsPct: 52, adr: 77, ctRating: 1.10, trRating: 1.10, strongMaps: ["Nuke"], weakMaps: ["Vertigo"] },
  { id: "saadzin", nick: "saadzin", realName: "Igor Sá", teamId: "legacy", role: "Rifler", rating: 1.08, kd: 1.08, hsPct: 51, adr: 76, ctRating: 1.10, trRating: 1.06, strongMaps: ["Ancient"], weakMaps: ["Anubis"] },
  { id: "n1ssim", nick: "n1ssim", realName: "Vinicius Pereira", teamId: "legacy", role: "Entry", rating: 1.05, kd: 1.04, hsPct: 50, adr: 74, ctRating: 1.02, trRating: 1.08, strongMaps: ["Mirage"], weakMaps: ["Vertigo"] },
  { id: "art", nick: "arT", realName: "Andrei Piovezan", teamId: "legacy", role: "IGL", rating: 1.00, kd: 0.98, hsPct: 47, adr: 72, ctRating: 0.96, trRating: 1.04, strongMaps: ["Overpass"], weakMaps: ["Vertigo"] },

  // #19 Monte
  { id: "rainwalker", nick: "Rainwalker", realName: "Volodymyr Bohdanov", teamId: "monte", role: "Rifler", rating: 1.06, kd: 1.06, hsPct: 51, adr: 75, ctRating: 1.06, trRating: 1.06, strongMaps: ["Mirage"], weakMaps: ["Vertigo"] },
  { id: "leen", nick: "leen", realName: "Vladyslav Stepanov", teamId: "monte", role: "AWPer", rating: 1.04, kd: 1.04, hsPct: 39, adr: 73, ctRating: 1.08, trRating: 1.00, strongMaps: ["Inferno"], weakMaps: ["Anubis"] },
  { id: "demqq", nick: "DemQQ", realName: "Demid Golubenkov", teamId: "monte", role: "Entry", rating: 1.06, kd: 1.05, hsPct: 50, adr: 75, ctRating: 1.02, trRating: 1.10, strongMaps: ["Ancient"], weakMaps: ["Vertigo"] },
  { id: "jr", nick: "jR", realName: "Roman Khrystych", teamId: "monte", role: "Rifler", rating: 1.04, kd: 1.04, hsPct: 50, adr: 73, ctRating: 1.06, trRating: 1.02, strongMaps: ["Nuke"], weakMaps: ["Anubis"] },
  { id: "leqi", nick: "leqi", realName: "Konstantin Pohorielov", teamId: "monte", role: "IGL", rating: 0.96, kd: 0.94, hsPct: 48, adr: 68, ctRating: 1.00, trRating: 0.92, strongMaps: ["Overpass"], weakMaps: ["Vertigo"] },

  // #20 Heroic
  { id: "yxngstxr", nick: "yxngstxr", realName: "Anton Pedersen", teamId: "heroic", role: "Rifler", rating: 1.08, kd: 1.08, hsPct: 51, adr: 76, ctRating: 1.08, trRating: 1.08, strongMaps: ["Mirage"], weakMaps: ["Vertigo"] },
  { id: "tn1r", nick: "tN1R", realName: "Magnus Tornow", teamId: "heroic", role: "AWPer", rating: 1.06, kd: 1.06, hsPct: 39, adr: 74, ctRating: 1.10, trRating: 1.02, strongMaps: ["Inferno"], weakMaps: ["Anubis"] },
  { id: "maden", nick: "Maden", realName: "Mads Ostergaard", teamId: "heroic", role: "Entry", rating: 1.05, kd: 1.04, hsPct: 50, adr: 74, ctRating: 1.02, trRating: 1.08, strongMaps: ["Ancient"], weakMaps: ["Vertigo"] },
  { id: "kjaerbye", nick: "Kjaerbye", realName: "Markus Kjærbye", teamId: "heroic", role: "Rifler", rating: 1.02, kd: 1.00, hsPct: 49, adr: 72, ctRating: 1.04, trRating: 1.00, strongMaps: ["Nuke"], weakMaps: ["Anubis"] },
  { id: "chr1zn", nick: "Chr1zN", realName: "Christoffer Storgaard", teamId: "heroic", role: "IGL", rating: 0.94, kd: 0.92, hsPct: 47, adr: 67, ctRating: 0.98, trRating: 0.90, strongMaps: ["Overpass"], weakMaps: ["Vertigo"] },

  // Legacy: MIBR
  { id: "insani", nick: "insani", realName: "Gabriel Vasconcelos", teamId: "mibr", role: "Rifler", rating: 1.08, kd: 1.08, hsPct: 51, adr: 76, ctRating: 1.10, trRating: 1.06, strongMaps: ["Mirage"], weakMaps: ["Vertigo"] },
  { id: "brnz4n", nick: "brnz4n", realName: "Breno Poletto", teamId: "mibr", role: "AWPer", rating: 1.06, kd: 1.06, hsPct: 39, adr: 74, ctRating: 1.10, trRating: 1.02, strongMaps: ["Inferno"], weakMaps: ["Anubis"] },
  { id: "kl1m", nick: "kl1m", realName: "Vladislav Klimenko", teamId: "mibr", role: "Rifler", rating: 1.04, kd: 1.04, hsPct: 50, adr: 73, ctRating: 1.06, trRating: 1.02, strongMaps: ["Nuke"], weakMaps: ["Vertigo"] },
  { id: "lnz", nick: "LNZ", realName: "Leonardo Zaratin", teamId: "mibr", role: "Entry", rating: 1.05, kd: 1.04, hsPct: 50, adr: 74, ctRating: 1.02, trRating: 1.08, strongMaps: ["Ancient"], weakMaps: ["Anubis"] },
  { id: "venomzera", nick: "venomzera", realName: "Roni Schmitz", teamId: "mibr", role: "IGL", rating: 0.95, kd: 0.93, hsPct: 47, adr: 67, ctRating: 0.98, trRating: 0.92, strongMaps: ["Overpass"], weakMaps: ["Vertigo"] },

  // Legacy: Imperial
  { id: "chelo", nick: "chelo", realName: "Marcelo Cespedes", teamId: "imperial", role: "Rifler", rating: 1.06, kd: 1.04, hsPct: 51, adr: 75, ctRating: 1.06, trRating: 1.06, strongMaps: ["Mirage"], weakMaps: ["Vertigo"] },
  { id: "decenty", nick: "decenty", realName: "Lucas Bacela", teamId: "imperial", role: "Entry", rating: 1.10, kd: 1.10, hsPct: 52, adr: 77, ctRating: 1.06, trRating: 1.14, strongMaps: ["Inferno"], weakMaps: ["Anubis"] },
  { id: "levi", nick: "levi", realName: "Guilherme Godoy", teamId: "imperial", role: "AWPer", rating: 1.06, kd: 1.06, hsPct: 39, adr: 74, ctRating: 1.10, trRating: 1.02, strongMaps: ["Mirage"], weakMaps: ["Vertigo"] },
  { id: "noway", nick: "noway", realName: "Kaiky Santos", teamId: "imperial", role: "Rifler", rating: 1.05, kd: 1.04, hsPct: 50, adr: 74, ctRating: 1.06, trRating: 1.04, strongMaps: ["Ancient"], weakMaps: ["Anubis"] },
  { id: "vini", nick: "VINI", realName: "Vinicius Figueiredo", teamId: "imperial", role: "IGL", rating: 0.96, kd: 0.94, hsPct: 48, adr: 68, ctRating: 1.00, trRating: 0.92, strongMaps: ["Overpass"], weakMaps: ["Vertigo"] },

  // Legacy: paiN
  { id: "biguzera", nick: "biguzera", realName: "Felipe Lima", teamId: "pain", role: "IGL/Rifler", rating: 1.16, kd: 1.20, hsPct: 41, adr: 78, ctRating: 1.20, trRating: 1.12, strongMaps: ["Mirage", "Ancient"], weakMaps: ["Nuke"] },
  { id: "nqz", nick: "nqz", realName: "Felipe Gonçalves", teamId: "pain", role: "AWPer", rating: 1.10, kd: 1.10, hsPct: 39, adr: 76, ctRating: 1.14, trRating: 1.06, strongMaps: ["Inferno"], weakMaps: ["Vertigo"] },
  { id: "snow", nick: "snow", realName: "Otávio Carvalho", teamId: "pain", role: "Rifler", rating: 1.06, kd: 1.06, hsPct: 51, adr: 75, ctRating: 1.08, trRating: 1.04, strongMaps: ["Mirage"], weakMaps: ["Anubis"] },
  { id: "piriajr", nick: "piriajr", realName: "André Pires", teamId: "pain", role: "Entry", rating: 1.05, kd: 1.04, hsPct: 50, adr: 74, ctRating: 1.02, trRating: 1.08, strongMaps: ["Ancient"], weakMaps: ["Vertigo"] },
  { id: "vsm", nick: "vsm", realName: "Vinicius Moreira", teamId: "pain", role: "Rifler", rating: 1.04, kd: 1.04, hsPct: 50, adr: 73, ctRating: 1.06, trRating: 1.02, strongMaps: ["Nuke"], weakMaps: ["Anubis"] },
];

export const maps: CSMap[] = [
  { id: "dust2", name: "Dust2", pickRate: 62, ctWinRate: 53, trWinRate: 47, topTeams: ["vitality", "g2"], topPlayers: ["zywoo", "niko"], active: true },
  { id: "mirage", name: "Mirage", pickRate: 78, ctWinRate: 52, trWinRate: 48, topTeams: ["vitality", "navi", "spirit"], topPlayers: ["zywoo", "donk", "molodoy"], active: true },
  { id: "inferno", name: "Inferno", pickRate: 82, ctWinRate: 56, trWinRate: 44, topTeams: ["vitality", "furia"], topPlayers: ["zywoo", "kscerato"], active: true },
  { id: "nuke", name: "Nuke", pickRate: 65, ctWinRate: 58, trWinRate: 42, topTeams: ["g2", "navi"], topPlayers: ["niko", "yuurih"], active: true },
  { id: "ancient", name: "Ancient", pickRate: 60, ctWinRate: 49, trWinRate: 51, topTeams: ["spirit", "vitality"], topPlayers: ["donk", "biguzera"], active: true },
  { id: "anubis", name: "Anubis", pickRate: 55, ctWinRate: 47, trWinRate: 53, topTeams: ["g2", "spirit"], topPlayers: ["niko"], active: true },
  { id: "overpass", name: "Overpass", pickRate: 50, ctWinRate: 54, trWinRate: 46, topTeams: ["spirit", "furia"], topPlayers: ["chopper", "fallen"], active: true },
  // Historical only — kept for old match data, never used as current rotation.
  { id: "vertigo", name: "Vertigo", pickRate: 0, ctWinRate: 51, trWinRate: 49, topTeams: ["mibr"], topPlayers: ["insani"], active: false },
];

// Filter mock maps using the central Active Duty config (single source of truth).
import { ACTIVE_MAP_IDS as _ACTIVE_MAP_IDS } from "@/lib/mapPool";
export const activeMaps = (): CSMap[] =>
  maps.filter((m) => _ACTIVE_MAP_IDS.includes(m.id));

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

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 0xffffffff;
}

export type TeamMapHistoryEntry = {
  opponent: string;
  score: string;
  result: "W" | "L";
  date: string;
};

export function getTeamMapHistory(teamId: string, mapId: string): TeamMapHistoryEntry[] {
  const otherTeams = teams.filter((t) => t.id !== teamId);
  const entries: TeamMapHistoryEntry[] = [];
  for (let i = 0; i < 5; i++) {
    const r = hash(teamId + mapId + i);
    const opp = otherTeams[Math.floor(r * otherTeams.length)];
    const win = hash(teamId + mapId + "w" + i) > 0.42;
    const a = win ? 13 : 8 + Math.floor(r * 5);
    const b = win ? 8 + Math.floor(r * 5) : 13;
    const d = new Date(2026, 3, 28 - i * 3);
    entries.push({
      opponent: opp.tag,
      score: `${a}-${b}`,
      result: win ? "W" : "L",
      date: d.toISOString().slice(0, 10),
    });
  }
  return entries;
}

export type PlayerMapStat = {
  mapId: string;
  rating: number;
  kd: number;
  adr: number;
  impact: number;
  ctRating: number;
  trRating: number;
};

export function getPlayerMapStats(playerId: string): PlayerMapStat[] {
  const p = getPlayer(playerId);
  if (!p) return [];
  return activeMaps().map((m) => {
    const r = hash(playerId + m.id);
    const isStrong = p.strongMaps.includes(m.name);
    const isWeak = p.weakMaps.includes(m.name);
    const bias = isStrong ? 0.15 : isWeak ? -0.15 : 0;
    const rating = +(p.rating + bias + (r - 0.5) * 0.1).toFixed(2);
    const kd = +(p.kd + bias + (r - 0.5) * 0.1).toFixed(2);
    const adr = Math.round(p.adr + bias * 20 + (r - 0.5) * 8);
    const impact = +(1 + bias + (r - 0.5) * 0.2).toFixed(2);
    const ctRating = +(p.ctRating + bias + (r - 0.5) * 0.08).toFixed(2);
    const trRating = +(p.trRating + bias + (r - 0.5) * 0.08).toFixed(2);
    return { mapId: m.id, rating, kd, adr, impact, ctRating, trRating };
  });
}
