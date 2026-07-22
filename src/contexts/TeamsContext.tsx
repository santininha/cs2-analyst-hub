import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { teams as mockTeams, type Team } from "@/data/mock";
import {
  getGridTeamsByNames,
  getGridRosters,
  type GridTeam,
  type GridPlayer,
} from "@/lib/data-fns/grid.functions";

type TeamsContextValue = {
  teams: Team[];
  bySlug: Record<string, Team>;
  rosters: Record<string, GridPlayer[]>; // key: mock team id (e.g. "furia")
  source: "mock" | "grid" | "mock+grid";
  loading: boolean;
  error: string | null;
  gridCount: number;
  matchedCount: number;
  rosterCount: number;
  lastSync: Date | null;
  cached: boolean;
};

const TeamsContext = createContext<TeamsContextValue | null>(null);

// Map our mock team ids to their official GRID names (CS2 titleId 28).
// Without this, fuzzy matching picks wrong entities (e.g. NaVi Youth instead of Natus Vincere).
const GRID_NAME_BY_MOCK_ID: Record<string, string> = {
  // Top 20 — HLTV ranking on May 11th, 2026
  vitality: "Team Vitality",
  navi: "Natus Vincere",
  furia: "FURIA",
  falcons: "Team Falcons",
  spirit: "Team Spirit",
  aurora: "Aurora Gaming",
  parivision: "PARIVISION",
  mongolz: "The MongolZ",
  astralis: "Astralis",
  fut: "FUT Esports",
  mouz: "MOUZ",
  g2: "G2 Esports",
  faze: "FaZe Clan",
  gamerlegion: "GamerLegion",
  "3dmax": "3DMAX",
  "9z": "9z Team",
  b8: "B8",
  legacy: "Legacy",
  monte: "Monte",
  heroic: "Heroic",
  // Legacy (out of top 20, kept for player/match references)
  mibr: "MIBR",
  imperial: "Imperial",
  pain: "Pain Gaming",
};

function mergeTeams(base: Team[], grid: GridTeam[]) {
  if (!grid.length) return { merged: base, matched: 0 };
  const byName = new Map<string, GridTeam>();
  for (const g of grid) byName.set(g.name.toLowerCase(), g);
  let matched = 0;
  for (const t of base) {
    const expected = GRID_NAME_BY_MOCK_ID[t.id];
    const g = expected ? byName.get(expected.toLowerCase()) : undefined;
    if (!g) continue;
    matched++;
    t.gridId = g.id;
    if (g.logoUrl) t.logoUrl = g.logoUrl;
    if (g.colorPrimary) t.colorPrimary = g.colorPrimary;
    if (g.colorSecondary) t.colorSecondary = g.colorSecondary;
    if (g.name) t.name = g.name;
  }
  return { merged: [...base], matched };
}

export function TeamsProvider({ children }: { children: ReactNode }) {
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [rosters, setRosters] = useState<Record<string, GridPlayer[]>>({});
  const [source, setSource] = useState<TeamsContextValue["source"]>("mock");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gridCount, setGridCount] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [rosterCount, setRosterCount] = useState(0);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [cached, setCached] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const names = mockTeams.map((t) => GRID_NAME_BY_MOCK_ID[t.id]).filter(Boolean);
        const res = await getGridTeamsByNames({ data: { names } });
        if (cancelled) return;
        setGridCount(res.teams.length);
        setCached(res.cached);
        setLastSync(new Date());
        if (res.error && res.teams.length === 0) {
          setError(res.error);
          setSource("mock");
        } else {
          const { merged, matched } = mergeTeams(mockTeams, res.teams);
          setTeams(merged);
          setMatchedCount(matched);
          setSource(matched > 0 ? "mock+grid" : "mock");
          setError(res.error);

          // Fetch rosters in parallel for matched teams
          const teamIds = merged.map((t) => t.gridId).filter(Boolean) as string[];
          if (teamIds.length) {
            const r = await getGridRosters({ data: { teamIds } });
            if (cancelled) return;
            const map: Record<string, GridPlayer[]> = {};
            let count = 0;
            for (const t of merged) {
              if (!t.gridId) continue;
              const list = r.rosters[t.gridId] ?? [];
              map[t.id] = list;
              count += list.length;
            }
            setRosters(map);
            setRosterCount(count);
          }
        }
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

  const value = useMemo<TeamsContextValue>(() => {
    const bySlug: Record<string, Team> = {};
    for (const t of teams) bySlug[t.id] = t;
    return {
      teams,
      bySlug,
      rosters,
      source,
      loading,
      error,
      gridCount,
      matchedCount,
      rosterCount,
      lastSync,
      cached,
    };
  }, [teams, rosters, source, loading, error, gridCount, matchedCount, rosterCount, lastSync, cached]);

  return <TeamsContext.Provider value={value}>{children}</TeamsContext.Provider>;
}

export function useTeams() {
  const ctx = useContext(TeamsContext);
  if (!ctx) throw new Error("useTeams must be used within TeamsProvider");
  return ctx;
}

export function useTeam(id: string | undefined): Team | undefined {
  const { bySlug } = useTeams();
  if (!id) return undefined;
  return bySlug[id] ?? mockTeams.find((t) => t.id === id);
}

export function useRoster(mockTeamId: string | undefined): GridPlayer[] {
  const { rosters } = useTeams();
  if (!mockTeamId) return [];
  return rosters[mockTeamId] ?? [];
}
