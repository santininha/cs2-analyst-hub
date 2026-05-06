/**
 * Central source of truth for the CS2 competitive map pool (Active Duty).
 *
 * Any UI that talks about "current rotation", "matchup picks", "team strengths
 * by map" or "caster prep" must read from here — never hardcode map lists in
 * components. If Valve rotates a map in/out, change it here and the whole app
 * follows.
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

/** Active Duty map pool — competitive rotation as of 2026-05. */
export const ACTIVE_DUTY: MapPoolEntry[] = [
  { id: "dust2", name: "Dust2", active: true },
  { id: "mirage", name: "Mirage", active: true },
  { id: "inferno", name: "Inferno", active: true },
  { id: "nuke", name: "Nuke", active: true },
  { id: "ancient", name: "Ancient", active: true },
  { id: "overpass", name: "Overpass", active: true },
  { id: "anubis", name: "Anubis", active: true },
];

/** Maps that have been in past rotations but are NOT current Active Duty. */
export const HISTORICAL_MAPS: MapPoolEntry[] = [
  { id: "vertigo", name: "Vertigo", active: false, removedAt: "2025-10-01" },
  { id: "train", name: "Train", active: false, removedAt: "2024-09-01" },
  { id: "cache", name: "Cache", active: false, removedAt: "2020-04-01" },
];

export const ALL_MAPS: MapPoolEntry[] = [...ACTIVE_DUTY, ...HISTORICAL_MAPS];

const NAME_INDEX: Record<string, MapPoolEntry> = {};
for (const m of ALL_MAPS) {
  NAME_INDEX[m.id.toLowerCase()] = m;
  NAME_INDEX[m.name.toLowerCase()] = m;
}

export function getMapMeta(idOrName: string): MapPoolEntry | undefined {
  return NAME_INDEX[idOrName.toLowerCase()];
}

export function isActiveMap(idOrName: string): boolean {
  return !!getMapMeta(idOrName)?.active;
}

/** Active map IDs for filtering downstream data structures. */
export const ACTIVE_MAP_IDS: ReadonlyArray<string> = ACTIVE_DUTY.map((m) => m.id);

/**
 * Map pool source/diagnostic metadata. Currently configured statically; a
 * future integration can replace `source` with a live feed.
 */
export type MapPoolStatus = {
  source: "static-config";
  sourceLabel: string;
  lastCheckedAt: string;
  active: MapPoolEntry[];
  historical: MapPoolEntry[];
};

export function getMapPoolStatus(): MapPoolStatus {
  return {
    source: "static-config",
    sourceLabel: "Configuração interna (src/lib/mapPool.ts)",
    lastCheckedAt: new Date().toISOString(),
    active: ACTIVE_DUTY,
    historical: HISTORICAL_MAPS,
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
  /** Status of the underlying ranking data source. */
  status: "pending-integration" | "live";
  /** Where the ranking will eventually come from. */
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
