import { createServerFn } from "@tanstack/react-start";

/**
 * Camada inicial de partidas reais GRID.
 *
 * A API da GRID expõe partidas via "allSeries" no Central Data. Como as
 * permissões da chave atual podem variar, esta função é defensiva: se a
 * query falhar ou retornar vazio, devolve { matches: [] } sem erro fatal,
 * permitindo que o app utilize o fallback mock.
 */

const GRID_ENDPOINT = "https://api-op.grid.gg/central-data/graphql";
const CS2_TITLE_ID = "28";

export type GridMatch = {
  id: string;
  tournament: string;
  boType: string;
  startTime: string;
  status: "upcoming" | "live" | "completed";
  teamA: { gridId: string; name: string };
  teamB: { gridId: string; name: string };
  result?: { scoreA: number; scoreB: number };
};

let cache: { at: number; matches: GridMatch[] } | null = null;
const TTL_MS = 5 * 60 * 1000; // 5 min — partidas mudam mais rápido que times

async function gql<T>(apiKey: string, query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(GRID_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`GRID HTTP ${res.status}`);
  const json: any = await res.json();
  if (json.errors?.length) throw new Error(`GRID GraphQL: ${json.errors[0]?.message ?? "unknown"}`);
  return json.data as T;
}

function deriveStatus(s: any): "upcoming" | "live" | "completed" {
  const t = String(s ?? "").toLowerCase();
  if (t.includes("live") || t.includes("progress")) return "live";
  if (t.includes("finish") || t.includes("complete") || t.includes("ended")) return "completed";
  return "upcoming";
}

async function fetchSeries(apiKey: string): Promise<GridMatch[]> {
  // Defensive query — only commonly available fields.
  const query = `query Series {
    allSeries(first: 25, filter: { titleId: ${CS2_TITLE_ID} }, orderBy: StartTimeScheduled) {
      edges {
        node {
          id
          startTimeScheduled
          format { nameShortened }
          tournament { name }
          teams {
            baseInfo { id name }
            scoreAdvantage
          }
        }
      }
    }
  }`;
  const data = await gql<any>(apiKey, query);
  const edges = data?.allSeries?.edges ?? [];
  const out: GridMatch[] = [];
  for (const e of edges) {
    const n = e.node;
    const teams = n.teams ?? [];
    if (teams.length < 2) continue;
    const a = teams[0]?.baseInfo;
    const b = teams[1]?.baseInfo;
    if (!a || !b) continue;
    const start = n.startTimeScheduled ?? new Date().toISOString();
    const past = new Date(start).getTime() < Date.now();
    out.push({
      id: String(n.id),
      tournament: n.tournament?.name ?? "—",
      boType: n.format?.nameShortened ?? "BO?",
      startTime: start,
      status: past ? "completed" : "upcoming",
      teamA: { gridId: String(a.id), name: a.name },
      teamB: { gridId: String(b.id), name: b.name },
    });
  }
  return out;
}

export const getGridMatches = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ matches: GridMatch[]; error: string | null; cached: boolean }> => {
    const apiKey = process.env.GRID_API_KEY;
    if (!apiKey) return { matches: [], error: "GRID_API_KEY not configured", cached: false };
    if (cache && Date.now() - cache.at < TTL_MS) {
      return { matches: cache.matches, error: null, cached: true };
    }
    try {
      const matches = await fetchSeries(apiKey);
      cache = { at: Date.now(), matches };
      return { matches, error: null, cached: false };
    } catch (err) {
      console.error("[grid] series failed:", err);
      if (cache) return { matches: cache.matches, error: String(err), cached: true };
      return { matches: [], error: err instanceof Error ? err.message : String(err), cached: false };
    }
  },
);
