import { useTeams } from "@/contexts/TeamsContext";

export type IntegrationStatus = {
  hasGridData: boolean;
  teamsCount: number;
  enrichedCount: number;
  hasRealLogos: boolean;
  realLogosCount: number;
  hasBranding: boolean;
  brandingCount: number;
  hasLineups: boolean;
  lineupsCount: number;
  playersCount: number;
  isUsingFallback: boolean;
  lastSyncAt: Date | null;
  cached: boolean;
  error: string | null;
  loading: boolean;
  gridState: "connected" | "fallback" | "error" | "loading";
};

/**
 * Derives a single read-only diagnostic snapshot from the existing GRID
 * teams context. No duplicate fetching — pure projection of state.
 */
export function useIntegrationStatus(): IntegrationStatus {
  const {
    teams,
    rosters,
    source,
    loading,
    error,
    gridCount,
    matchedCount,
    rosterCount,
    lastSync,
    cached,
  } = useTeams();

  const realLogosCount = teams.filter((t) => !!t.gridId && !!t.logoUrl).length;
  const brandingCount = teams.filter((t) => !!t.gridId && (!!t.colorPrimary || !!t.colorSecondary)).length;
  const lineupsCount = Object.values(rosters).filter((r) => r.length > 0).length;

  const hasGridData = gridCount > 0 && !error;
  const isUsingFallback = source === "mock" || matchedCount === 0;

  const gridState: IntegrationStatus["gridState"] = loading
    ? "loading"
    : error && gridCount === 0
      ? "error"
      : isUsingFallback
        ? "fallback"
        : "connected";

  return {
    hasGridData,
    teamsCount: teams.length,
    enrichedCount: matchedCount,
    hasRealLogos: realLogosCount > 0,
    realLogosCount,
    hasBranding: brandingCount > 0,
    brandingCount,
    hasLineups: lineupsCount > 0,
    lineupsCount,
    playersCount: rosterCount,
    isUsingFallback,
    lastSyncAt: lastSync,
    cached,
    error,
    loading,
    gridState,
  };
}
