import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { matches as mockMatches, type Match } from "@/data/mock";
import { useTeams } from "@/contexts/TeamsContext";
import {
  activeDutyMapPool,
  isLowRelevance,
  startOfTodayMs,
  type MatchEnriched,
  type MatchQuality,
  type MatchSource,
  type MatchStatus,
} from "@/lib/matchTypes";
import { getGridMatches, type GridMatch } from "@/lib/data-fns/matches.functions";
import { getGridRecentTierSSeries, type RecentSeries } from "@/lib/data-fns/recentSeries.functions";

type MatchesContextValue = {
  matches: MatchEnriched[];
  upcoming: MatchEnriched[];
  live: MatchEnriched[];
  today: MatchEnriched[];
  completed: MatchEnriched[];
  /** Histórico (passadas, abaixo do dia atual) — não exibido por padrão. */
  history: MatchEnriched[];
  source: MatchSource | "mixed" | "empty";
  loading: boolean;
  error: string | null;
  gridCount: number;
  manualCount: number;
  ignoredCount: number;
  lastSync: Date | null;
  cached: boolean;
};

const MatchesContext = createContext<MatchesContextValue | null>(null);

const LIVE_WINDOW_MS = 4 * 60 * 60 * 1000;

function deriveStatus(startMs: number, now: number, hasResult: boolean): MatchStatus {
  if (hasResult) return "completed";
  if (startMs <= now && now < startMs + LIVE_WINDOW_MS) return "live";
  if (startMs < now) return "completed";
  return "upcoming";
}

function isSameDay(aMs: number, bMs: number): boolean {
  const a = new Date(aMs);
  const b = new Date(bMs);
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Pontuação simples de relevância (maior = mais útil). */
function scoreRelevance(args: {
  source: MatchSource;
  teamAEnriched: boolean;
  teamBEnriched: boolean;
  tournament: string;
}): number {
  let s = 0;
  if (args.source === "grid") s += 30;
  if (args.teamAEnriched) s += 25;
  if (args.teamBEnriched) s += 25;
  const t = args.tournament.toLowerCase();
  if (/(major|iem|esl pro|blast|katowice|cologne|paris)/.test(t)) s += 20;
  return s;
}

function mockToEnriched(
  m: Match,
  getTeam: (id: string) => any,
  lastSyncAt: string,
  now: number,
): MatchEnriched | null {
  const a = getTeam(m.teamAId);
  const b = getTeam(m.teamBId);
  if (!a || !b) return null;
  const startMs = new Date(m.date).getTime();
  if (isLowRelevance({ tournament: m.event, teamAName: a.name, teamBName: b.name })) return null;
  const status: MatchStatus = m.status === "finished"
    ? "completed"
    : m.status === "live"
      ? "live"
      : deriveStatus(startMs, now, false);
  // Mocks marcados como "manual" (prévia/preview do caster). Histórico mock
  // antigo é descartado por padrão para não poluir a tela.
  const todayMs = startOfTodayMs(new Date(now));
  if (status === "completed" && startMs < todayMs - 24 * 60 * 60 * 1000) return null;
  const quality: MatchQuality = "manual";
  const teamAEnriched = !!a.gridId;
  const teamBEnriched = !!b.gridId;
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
    quality,
    relevance: scoreRelevance({
      source: "mock",
      teamAEnriched,
      teamBEnriched,
      tournament: m.event,
    }),
    lastSyncAt,
  };
}

function gridToEnriched(
  g: GridMatch,
  teamByGridId: Map<string, any>,
  lastSyncAt: string,
  now: number,
): MatchEnriched | null {
  if (isLowRelevance({ tournament: g.tournament, teamAName: g.teamA.name, teamBName: g.teamB.name })) {
    return null;
  }
  const a = teamByGridId.get(g.teamA.gridId);
  const b = teamByGridId.get(g.teamB.gridId);
  const teamA = a ?? minimalTeam(g.teamA.gridId, g.teamA.name);
  const teamB = b ?? minimalTeam(g.teamB.gridId, g.teamB.name);
  const startMs = new Date(g.startTime).getTime();
  const status = deriveStatus(startMs, now, !!g.result);
  return {
    id: `grid:${g.id}`,
    slug: g.id,
    tournament: g.tournament,
    boType: g.boType,
    startTime: g.startTime,
    status,
    teamA,
    teamB,
    result: g.result,
    mapPool: activeDutyMapPool(),
    maps: [],
    source: "grid",
    quality: "grid-real",
    relevance: scoreRelevance({
      source: "grid",
      teamAEnriched: !!a,
      teamBEnriched: !!b,
      tournament: g.tournament,
    }),
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
  const [recent, setRecent] = useState<RecentSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [cached, setCached] = useState(false);
  const [ignoredCount, setIgnoredCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [res, recRes] = await Promise.all([
          getGridMatches(),
          getGridRecentTierSSeries(),
        ]);
        if (cancelled) return;
        setGrid(res.matches);
        setRecent(recRes.series);
        setError(res.error ?? recRes.error);
        setCached(res.cached || recRes.cached);
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
    const now = Date.now();
    const todayMs = startOfTodayMs(new Date(now));
    const lastSyncAt = (lastSync ?? new Date()).toISOString();

    const teamByGridId = new Map<string, any>();
    for (const t of teams) if (t.gridId) teamByGridId.set(t.gridId, t);
    const getTeam = (id: string) => bySlug[id];

    const grids = grid
      .map((g) => gridToEnriched(g, teamByGridId, lastSyncAt, now))
      .filter((x): x is MatchEnriched => !!x);

    const recents: MatchEnriched[] = recent
      .map((r): MatchEnriched | null => {
        if (isLowRelevance({ tournament: r.tournament, teamAName: r.teamA.name, teamBName: r.teamB.name })) return null;
        const teamA = teamByGridId.get(r.teamA.gridId) ?? minimalTeam(r.teamA.gridId, r.teamA.name);
        const teamB = teamByGridId.get(r.teamB.gridId) ?? minimalTeam(r.teamB.gridId, r.teamB.name);
        return {
          id: `grid-recent:${r.id}`,
          slug: r.id,
          tournament: r.tournament,
          boType: r.boType,
          startTime: r.startTime,
          status: "completed",
          teamA,
          teamB,
          mapPool: activeDutyMapPool(),
          maps: [],
          source: "grid",
          quality: "grid-real",
          relevance: scoreRelevance({
            source: "grid",
            teamAEnriched: !!teamByGridId.get(r.teamA.gridId),
            teamBEnriched: !!teamByGridId.get(r.teamB.gridId),
            tournament: r.tournament,
          }) + 10, // Tier S boost
          lastSyncAt,
        };
      })
      .filter((x): x is MatchEnriched => !!x);

    const mocks = mockMatches
      .map((m) => mockToEnriched(m, getTeam, lastSyncAt, now))
      .filter((x): x is MatchEnriched => !!x);

    // Dedup: mesmo confronto + mesmo dia → preferir GRID (real) sobre mock.
    const dedupKey = (m: MatchEnriched) => {
      const day = m.startTime.slice(0, 10);
      const ids = [m.teamA.id, m.teamB.id].sort().join("::");
      return `${day}::${ids}`;
    };
    const seen = new Map<string, MatchEnriched>();
    for (const m of grids) seen.set(dedupKey(m), m);
    for (const m of recents) {
      const k = dedupKey(m);
      if (!seen.has(k)) seen.set(k, m);
    }
    for (const m of mocks) {
      const k = dedupKey(m);
      if (!seen.has(k)) seen.set(k, m);
    }

    const merged = [...seen.values()].sort((a, b) => {
      // Primeiro por status (live → upcoming → completed), depois por
      // relevance, depois por hora.
      const order = { live: 0, upcoming: 1, completed: 2 } as const;
      const so = order[a.status] - order[b.status];
      if (so !== 0) return so;
      if (a.relevance !== b.relevance) return b.relevance - a.relevance;
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });

    const upcoming = merged.filter((m) => m.status === "upcoming");
    const live = merged.filter((m) => m.status === "live");
    const completed = merged.filter((m) => m.status === "completed");
    const history = completed.filter((m) => new Date(m.startTime).getTime() < todayMs);
    const today = merged.filter(
      (m) => m.status !== "completed" && isSameDay(new Date(m.startTime).getTime(), now),
    );

    const hasGrid = grids.length > 0;
    const hasMock = mocks.length > 0;
    const source: MatchesContextValue["source"] = hasGrid && hasMock
      ? "mixed"
      : hasGrid
        ? "grid"
        : hasMock
          ? "mock"
          : "empty";

    return {
      matches: merged,
      upcoming,
      live,
      today,
      completed,
      history,
      source,
      loading,
      error,
      gridCount: grids.length,
      manualCount: mocks.length,
      ignoredCount,
      lastSync,
      cached,
    };
  }, [grid, recent, teams, bySlug, loading, error, lastSync, cached, ignoredCount]);

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
