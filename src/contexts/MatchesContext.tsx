import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { matches as mockMatches, type Match } from "@/data/mock";
import { useTeams } from "@/contexts/TeamsContext";
import { activeDutyMapPool, type MatchEnriched, type MatchSource, type MatchStatus } from "@/lib/matchTypes";
import { getGridMatches, type GridMatch } from "@/server/matches.functions";

type MatchesContextValue = {
  matches: MatchEnriched[];
  upcoming: MatchEnriched[];
  live: MatchEnriched[];
  completed: MatchEnriched[];
  source: MatchSource;
  loading: boolean;
  error: string | null;
  gridCount: number;
  lastSync: Date | null;
  cached: boolean;
};

const MatchesContext = createContext<MatchesContextValue | null>(null);

function mockToEnriched(m: Match, getTeam: (id: string) => any, lastSyncAt: string): MatchEnriched | null {
  const a = getTeam(m.teamAId);
  const b = getTeam(m.teamBId);
  if (!a || !b) return null;
  const status: MatchStatus =
    m.status === "finished" ? "completed" : m.status === "live" ? "live" : "upcoming";
  return {
    id: m.id,
    slug: m.id,
    tournament: m.event,
    boType: m.format,
    startTime: m.date,
    status,
    teamA: a,
    teamB: b,
    result: m.result,
    mapPool: activeDutyMapPool(),
    maps: m.maps,
    source: "mock",
    lastSyncAt,
  };
}

function gridToEnriched(g: GridMatch, teamByGridId: Map<string, any>, lastSyncAt: string): MatchEnriched | null {
  const a = teamByGridId.get(g.teamA.gridId);
  const b = teamByGridId.get(g.teamB.gridId);
  // If we don't have enriched team data, build a minimal Team-shaped object
  // so cards can still render the GRID name (logos won't be available).
  const teamA = a ?? minimalTeam(g.teamA.gridId, g.teamA.name);
  const teamB = b ?? minimalTeam(g.teamB.gridId, g.teamB.name);
  return {
    id: `grid:${g.id}`,
    slug: g.id,
    tournament: g.tournament,
    boType: g.boType,
    startTime: g.startTime,
    status: g.status,
    teamA,
    teamB,
    result: g.result,
    mapPool: activeDutyMapPool(),
    maps: [],
    source: a && b ? "mock+grid" : "grid",
    lastSyncAt,
  };
}

function minimalTeam(gridId: string, name: string): any {
  return {
    id: `grid-${gridId}`,
    name,
    tag: name.slice(0, 4).toUpperCase(),
    region: "—",
    country: "",
    worldRank: 999,
    winRate: 0,
    gridId,
    logoUrl: null,
    colorPrimary: null,
    colorSecondary: null,
  };
}

export function MatchesProvider({ children }: { children: ReactNode }) {
  const { bySlug, teams } = useTeams();
  const [grid, setGrid] = useState<GridMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [cached, setCached] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getGridMatches();
        if (cancelled) return;
        setGrid(res.matches);
        setError(res.error);
        setCached(res.cached);
        setLastSync(new Date());
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<MatchesContextValue>(() => {
    const lastSyncAt = (lastSync ?? new Date()).toISOString();
    const teamByGridId = new Map<string, any>();
    for (const t of teams) if (t.gridId) teamByGridId.set(t.gridId, t);

    const getTeam = (id: string) => bySlug[id];
    const mocks = mockMatches
      .map((m) => mockToEnriched(m, getTeam, lastSyncAt))
      .filter((x): x is MatchEnriched => !!x);

    const grids = grid
      .map((g) => gridToEnriched(g, teamByGridId, lastSyncAt))
      .filter((x): x is MatchEnriched => !!x);

    // Deduplicate: prefer GRID when same teams + same day.
    const dedupKey = (m: MatchEnriched) =>
      `${m.teamA.id}::${m.teamB.id}::${m.startTime.slice(0, 10)}`;
    const seen = new Map<string, MatchEnriched>();
    for (const m of grids) seen.set(dedupKey(m), m);
    for (const m of mocks) if (!seen.has(dedupKey(m))) seen.set(dedupKey(m), m);

    const merged = [...seen.values()].sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );

    const source: MatchSource =
      grids.length === 0 ? "mock" : mocks.length === 0 ? "grid" : "mock+grid";

    return {
      matches: merged,
      upcoming: merged.filter((m) => m.status === "upcoming"),
      live: merged.filter((m) => m.status === "live"),
      completed: merged.filter((m) => m.status === "completed"),
      source,
      loading,
      error,
      gridCount: grids.length,
      lastSync,
      cached,
    };
  }, [grid, teams, bySlug, loading, error, lastSync, cached]);

  return <MatchesContext.Provider value={value}>{children}</MatchesContext.Provider>;
}

export function useMatches() {
  const ctx = useContext(MatchesContext);
  if (!ctx) throw new Error("useMatches must be used within MatchesProvider");
  return ctx;
}

export function useMatch(slugOrId: string | undefined): MatchEnriched | undefined {
  const { matches } = useMatches();
  if (!slugOrId) return undefined;
  return matches.find((m) => m.slug === slugOrId || m.id === slugOrId);
}
