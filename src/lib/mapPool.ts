/**
 * Central source of truth for the CS2 competitive map pool (Active Duty).
 *
 * O map pool é intencionalmente manual/configurável para evitar dados
 * desatualizados gerados automaticamente. Quando a Valve alterar o Active
 * Duty, atualizar apenas o objeto `CURRENT_ACTIVE_DUTY_MAP_POOL` abaixo —
 * todas as telas (Análise de Mapas, Sala da Partida, Laboratório de Times,
 * Fontes de Dados, etc.) seguem essa única fonte de verdade.
 */

export type MapPoolEntry = {
  id: string;
  name: string;
  /** True if currently part of the Active Duty pool. */
  active: boolean;
  /** When this map last entered the pool, for "recently added" UX. */
  addedAt?: string;
  /** When this map last left the pool, for historical rendering. */
  removedAt?: string;
};

export type ActiveDutyConfig = {
  season: string;
  lastVerifiedAt: string;
  sourceLabel: string;
  activeMaps: MapPoolEntry[];
  inactiveMaps: MapPoolEntry[];
};

/**
 * ÚNICA fonte de verdade do map pool. Editar aqui ao mudar a rotação.
 */
export const CURRENT_ACTIVE_DUTY_MAP_POOL: ActiveDutyConfig = {
  season: "CS2 Premier Season 4 (2026)",
  lastVerifiedAt: new Date().toISOString(),
  sourceLabel: "Valve / HLTV / Liquipedia (validação manual, sync diário GRID)",
  activeMaps: [
    { id: "ancient", name: "Ancient", active: true },
    { id: "anubis", name: "Anubis", active: true, addedAt: "2026-01-19" },
    { id: "dust2", name: "Dust2", active: true },
    { id: "inferno", name: "Inferno", active: true },
    { id: "mirage", name: "Mirage", active: true },
    { id: "nuke", name: "Nuke", active: true },
    { id: "overpass", name: "Overpass", active: true },
  ],
  inactiveMaps: [
    { id: "train", name: "Train", active: false, removedAt: "2026-01-19" },
    { id: "vertigo", name: "Vertigo", active: false, removedAt: "2025-10-01" },
    { id: "cache", name: "Cache", active: false, removedAt: "2020-04-01" },
  ],
};

// =============================================================================
// Derived collections + lookups (always read from CURRENT_ACTIVE_DUTY_MAP_POOL)
// =============================================================================

export function getActiveMaps(): MapPoolEntry[] {
  return CURRENT_ACTIVE_DUTY_MAP_POOL.activeMaps;
}

export function getInactiveMaps(): MapPoolEntry[] {
  return CURRENT_ACTIVE_DUTY_MAP_POOL.inactiveMaps;
}

/** Backwards-compatible aliases used across the app. */
export const ACTIVE_DUTY: MapPoolEntry[] = CURRENT_ACTIVE_DUTY_MAP_POOL.activeMaps;
export const HISTORICAL_MAPS: MapPoolEntry[] = CURRENT_ACTIVE_DUTY_MAP_POOL.inactiveMaps;
export const ALL_MAPS: MapPoolEntry[] = [
  ...CURRENT_ACTIVE_DUTY_MAP_POOL.activeMaps,
  ...CURRENT_ACTIVE_DUTY_MAP_POOL.inactiveMaps,
];

function buildIndex(): Record<string, MapPoolEntry> {
  const idx: Record<string, MapPoolEntry> = {};
  for (const m of ALL_MAPS) {
    idx[m.id.toLowerCase()] = m;
    idx[m.name.toLowerCase()] = m;
  }
  return idx;
}
const NAME_INDEX = buildIndex();

export function getMapMeta(idOrName: string): MapPoolEntry | undefined {
  return NAME_INDEX[idOrName.toLowerCase()];
}

export function isActiveMap(idOrName: string): boolean {
  return !!getMapMeta(idOrName)?.active;
}

/** Active map IDs for filtering downstream data structures. */
export const ACTIVE_MAP_IDS: ReadonlyArray<string> = getActiveMaps().map((m) => m.id);

// =============================================================================
// Status (consumed by /fontes and the MapPoolStatusCard)
// =============================================================================

export type MapPoolStatus = {
  season: string;
  source: "manual-config";
  sourceLabel: string;
  lastCheckedAt: string;
  active: MapPoolEntry[];
  historical: MapPoolEntry[];
};

export function getMapPoolStatus(): MapPoolStatus {
  return {
    season: CURRENT_ACTIVE_DUTY_MAP_POOL.season,
    source: "manual-config",
    sourceLabel: CURRENT_ACTIVE_DUTY_MAP_POOL.sourceLabel,
    lastCheckedAt: CURRENT_ACTIVE_DUTY_MAP_POOL.lastVerifiedAt,
    active: getActiveMaps(),
    historical: getInactiveMaps(),
  };
}

// =============================================================================
// Analysis time window
// =============================================================================

export type AnalysisWindowId = "1m" | "3m" | "6m" | "12m";

export type AnalysisWindow = {
  id: AnalysisWindowId;
  label: string;
  shortLabel: string;
  days: number;
};

export const ANALYSIS_WINDOWS: Record<AnalysisWindowId, AnalysisWindow> = {
  "1m": { id: "1m", label: "Último mês", shortLabel: "1M", days: 30 },
  "3m": { id: "3m", label: "Últimos 3 meses", shortLabel: "3M", days: 90 },
  "6m": { id: "6m", label: "Últimos 6 meses", shortLabel: "6M", days: 180 },
  "12m": { id: "12m", label: "Últimos 12 meses", shortLabel: "12M", days: 365 },
};

export const DEFAULT_ANALYSIS_WINDOW: AnalysisWindow = ANALYSIS_WINDOWS["3m"];

// =============================================================================
// Team scope (rankings) — structure ready, integrations pending
// =============================================================================

export type TeamScopeId = "top30-world" | "top20-sa";

export type TeamScope = {
  id: TeamScopeId;
  label: string;
  description: string;
  status: "pending-integration" | "live";
  plannedSource: string;
};

export const TEAM_SCOPES: Record<TeamScopeId, TeamScope> = {
  "top30-world": {
    id: "top30-world",
    label: "Top 30 mundial",
    description: "Times do top 30 mundial — base do Laboratório de Times.",
    status: "pending-integration",
    plannedSource: "Ranking externo (HLTV / Valve regional)",
  },
  "top20-sa": {
    id: "top20-sa",
    label: "Top 20 South America",
    description: "Recorte regional priorizando cobertura sul-americana.",
    status: "pending-integration",
    plannedSource: "Ranking externo (HLTV regional SA)",
  },
};
