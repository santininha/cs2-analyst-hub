import { createServerFn } from "@tanstack/react-start";

/**
 * Camada inicial de partidas reais GRID.
 *
 * - Filtra partidas a partir de hoje (00:00) — não traz histórico antigo.
 * - Descarta GRID-TEST, scrims, showmatches e times genéricos (CS2-1, etc).
 * - Tolerante a falhas: se a query GraphQL falhar, devolve { matches: [] }
 *   sem erro fatal e o app cai no estado vazio (não inventa dados).
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
const TTL_MS = 5 * 60 * 1000;

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

function isLowRelevance(tournament: string, a: string, b: string): boolean {
  const t = tournament.toLowerCase();
  if (
    t.includes("test") ||
    t.includes("sandbox") ||
    t.includes("scrim") ||
    t.includes("showmatch") ||
    t.includes("demo") ||
    t.includes("grid-test")
  ) return true;
  const generic = (n: string) => {
    const x = (n ?? "").trim().toLowerCase();
    if (!x) return true;
    if (/^cs2[-_ ]?\d+$/.test(x)) return true;
    if (/^team[-_ ]?[a-z]$/.test(x)) return true;
    if (/^test/.test(x)) return true;
    if (/^tbd$/.test(x) || /^placeholder/.test(x)) return true;
    return false;
  };
  return generic(a) || generic(b);
}

async function fetchSeries(apiKey: string): Promise<GridMatch[]> {
  // Janela: a partir de agora. Não trazemos histórico — caster pediu apenas
  // partidas de hoje em diante.
  const startMs = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  })();

  const query = `query Series {
    allSeries(first: 50, filter: { titleId: ${CS2_TITLE_ID} }, orderBy: StartTimeScheduled) {
      edges {
        node {
          id
          startTimeScheduled
          format { nameShortened }
          tournament { name }
          teams {
            baseInfo { id name }
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
    const startTimeMs = new Date(start).getTime();
    if (Number.isFinite(startTimeMs) && startTimeMs < startMs) continue;
    const tournament = n.tournament?.name ?? "—";
    if (isLowRelevance(tournament, a.name, b.name)) continue;
    out.push({
      id: String(n.id),
      tournament,
      boType: n.format?.nameShortened ?? "BO?",
      startTime: start,
      // Sem campo de status confiável — "upcoming" por padrão; live é
      // detectado no client se start <= agora < start + janela.
      status: "upcoming",
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
