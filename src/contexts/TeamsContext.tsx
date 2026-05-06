import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { teams as mockTeams, type Team } from "@/data/mock";
import { getGridTeams, type GridTeam } from "@/server/grid.functions";

type TeamsContextValue = {
  teams: Team[];
  bySlug: Record<string, Team>;
  source: "mock" | "grid" | "mock+grid";
  loading: boolean;
  error: string | null;
};

const TeamsContext = createContext<TeamsContextValue | null>(null);

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");

function mergeTeams(base: Team[], grid: GridTeam[]): { merged: Team[]; matched: number } {
  if (!grid.length) return { merged: base, matched: 0 };
  const gridByName = new Map<string, GridTeam>();
  for (const g of grid) gridByName.set(norm(g.name), g);
  let matched = 0;
  const merged = base.map((t) => {
    const g = gridByName.get(norm(t.name)) ?? gridByName.get(norm(t.tag));
    if (!g) return t;
    matched++;
    return {
      ...t,
      gridId: g.id,
      logoUrl: g.logoUrl ?? t.logoUrl,
      colorPrimary: g.colorPrimary ?? t.colorPrimary,
      colorSecondary: g.colorSecondary ?? t.colorSecondary,
    };
  });
  return { merged, matched };
}

export function TeamsProvider({ children }: { children: ReactNode }) {
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [source, setSource] = useState<TeamsContextValue["source"]>("mock");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getGridTeams();
        if (cancelled) return;
        if (res.error && res.teams.length === 0) {
          setError(res.error);
          setSource("mock");
        } else {
          const { merged, matched } = mergeTeams(mockTeams, res.teams);
          setTeams(merged);
          setSource(matched > 0 ? "mock+grid" : "mock");
          setError(res.error);
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
    return { teams, bySlug, source, loading, error };
  }, [teams, source, loading, error]);

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
