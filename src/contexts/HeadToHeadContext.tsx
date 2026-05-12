import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useTeams } from "./TeamsContext";
import { getGridHeadToHead, type H2HResponse } from "@/server/headToHead.functions";

type H2HContextValue = {
  loading: boolean;
  error: string | null;
  data: H2HResponse | null;
  /** Conta confrontos reais entre dois mock-team ids nos últimos 6 meses. */
  countBetween: (mockIdA: string, mockIdB: string) => number;
  /** Lista de partidas reais entre dois mock-team ids (mais recentes primeiro). */
  matchesBetween: (mockIdA: string, mockIdB: string) => H2HResponse["matches"];
  windowLabel: string;
  fetchedAt: Date | null;
};

const HeadToHeadContext = createContext<H2HContextValue | null>(null);

export function HeadToHeadProvider({ children }: { children: ReactNode }) {
  const { teams, loading: teamsLoading } = useTeams();
  const [data, setData] = useState<H2HResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<Date | null>(null);

  // mock id -> gridId
  const gridByMock = useMemo(() => {
    const m: Record<string, string> = {};
    for (const t of teams) if (t.gridId) m[t.id] = t.gridId;
    return m;
  }, [teams]);

  const mockByGrid = useMemo(() => {
    const m: Record<string, string> = {};
    for (const [k, v] of Object.entries(gridByMock)) m[v] = k;
    return m;
  }, [gridByMock]);

  useEffect(() => {
    if (teamsLoading) return;
    const ids = Object.values(gridByMock);
    if (ids.length < 2) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await getGridHeadToHead({ data: { gridTeamIds: ids } });
        if (cancelled) return;
        setData(res);
        setError(res.error);
        setFetchedAt(new Date());
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [teamsLoading, gridByMock]);

  const value = useMemo<H2HContextValue>(() => {
    const pairs = data?.pairs ?? {};
    const matches = data?.matches ?? [];
    const key = (a: string, b: string) => (a < b ? `${a}::${b}` : `${b}::${a}`);
    const countBetween = (mockA: string, mockB: string) => {
      const ga = gridByMock[mockA];
      const gb = gridByMock[mockB];
      if (!ga || !gb) return 0;
      return pairs[key(ga, gb)] ?? 0;
    };
    const matchesBetween = (mockA: string, mockB: string) => {
      const ga = gridByMock[mockA];
      const gb = gridByMock[mockB];
      if (!ga || !gb) return [];
      return matches
        .filter(
          (m) =>
            (m.teamAGridId === ga && m.teamBGridId === gb) ||
            (m.teamAGridId === gb && m.teamBGridId === ga),
        )
        .sort((x, y) => y.startTime.localeCompare(x.startTime));
    };
    return {
      loading,
      error,
      data,
      countBetween,
      matchesBetween,
      windowLabel: "últimos 6 meses",
      fetchedAt,
    };
  }, [data, loading, error, gridByMock, fetchedAt]);

  // expose mockByGrid for potential debugging
  void mockByGrid;

  return <HeadToHeadContext.Provider value={value}>{children}</HeadToHeadContext.Provider>;
}

export function useHeadToHead() {
  const ctx = useContext(HeadToHeadContext);
  if (!ctx) throw new Error("useHeadToHead must be used within HeadToHeadProvider");
  return ctx;
}
