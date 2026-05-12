import { createServerFn } from "@tanstack/react-start";

/**
 * Head-to-head real via GRID — janela dos últimos 6 meses.
 *
 * Estratégia:
 *  - Busca paginada de séries CS2 ordenadas por StartTimeScheduled.
 *  - Filtra client-side: só considera séries onde AMBOS os times estão no
 *    conjunto de gridIds enviado pelo client (os 20+ times do banco).
 *  - Descarta torneios irrelevantes (test/scrim/showmatch) e times genéricos.
 *  - Devolve uma lista de confrontos { teamAId, teamBId, date, tournament }
 *    e um índice agregado pair -> count para uso direto pela UI.
 *
 * Tolerante a falha: se o GRID quebrar, devolve { pairs: {}, matches: [] }
 * com error preenchido — a UI cai pra contagem zero, sem inventar dados.
 */

const GRID_ENDPOINT = "https://api-op.grid.gg/central-data/graphql";
const CS2_TITLE_ID = "28";
const SIX_MONTHS_MS = 1000 * 60 * 60 * 24 * 30 * 6;
const MAX_PAGES = 25; // ~1250 séries no pior caso
const PAGE_SIZE = 50;

export type H2HMatch = {
  seriesId: string;
  startTime: string;
  tournament: string;
  teamAGridId: string;
  teamBGridId: string;
  teamAName: string;
  teamBName: string;
};

export type H2HResponse = {
  matches: H2HMatch[];
  /** key = `${gridIdA}::${gridIdB}` (sorted asc) -> número de confrontos */
  pairs: Record<string, number>;
  windowStart: string;
  windowEnd: string;
  fetchedSeries: number;
  cached: boolean;
  error: string | null;
};

let cache: { at: number; key: string; data: H2HResponse } | null = null;
const TTL_MS = 30 * 60 * 1000;

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

function isLowRelevance(tournament: string): boolean {
  const t = (tournament ?? "").toLowerCase();
  return (
    t.includes("test") ||
    t.includes("sandbox") ||
    t.includes("scrim") ||
    t.includes("showmatch") ||
    t.includes("demo") ||
    t.includes("grid-test")
  );
}

function pairKey(a: string, b: string) {
  return a < b ? `${a}::${b}` : `${b}::${a}`;
}

export const getGridHeadToHead = createServerFn({ method: "POST" })
  .inputValidator((data: { gridTeamIds: string[] }) => data)
  .handler(async ({ data }): Promise<H2HResponse> => {
    const apiKey = process.env.GRID_API_KEY;
    const windowEnd = new Date();
    const windowStart = new Date(windowEnd.getTime() - SIX_MONTHS_MS);
    const empty: H2HResponse = {
      matches: [],
      pairs: {},
      windowStart: windowStart.toISOString(),
      windowEnd: windowEnd.toISOString(),
      fetchedSeries: 0,
      cached: false,
      error: null,
    };

    if (!apiKey) return { ...empty, error: "GRID_API_KEY not configured" };
    const ids = Array.from(new Set(data.gridTeamIds.filter(Boolean)));
    if (ids.length < 2) return { ...empty, error: null };

    const idSet = new Set(ids);
    const cacheKey = ids.slice().sort().join(",");
    if (cache && cache.key === cacheKey && Date.now() - cache.at < TTL_MS) {
      return { ...cache.data, cached: true };
    }

    const query = `query H2H($after: Cursor) {
      allSeries(first: ${PAGE_SIZE}, after: $after, filter: { titleId: ${CS2_TITLE_ID} }, orderBy: StartTimeScheduled) {
        pageInfo { hasNextPage endCursor }
        edges {
          node {
            id
            startTimeScheduled
            tournament { name }
            teams { baseInfo { id name } }
          }
        }
      }
    }`;

    try {
      const matches: H2HMatch[] = [];
      const pairs: Record<string, number> = {};
      let after: string | null = null;
      let fetched = 0;
      let pages = 0;
      // Como não temos garantia de ordenação descendente, paginamos até
      // hasNextPage=false ou MAX_PAGES, e filtramos client-side por janela.
      while (pages < MAX_PAGES) {
        const res: any = await gql(apiKey, query, { after });
        const conn = res?.allSeries;
        const edges: any[] = conn?.edges ?? [];
        fetched += edges.length;
        for (const e of edges) {
          const n = e.node;
          const teams = n.teams ?? [];
          if (teams.length < 2) continue;
          const a = teams[0]?.baseInfo;
          const b = teams[1]?.baseInfo;
          if (!a?.id || !b?.id) continue;
          if (!idSet.has(String(a.id)) || !idSet.has(String(b.id))) continue;
          const startMs = new Date(n.startTimeScheduled ?? 0).getTime();
          if (!Number.isFinite(startMs)) continue;
          if (startMs < windowStart.getTime() || startMs > windowEnd.getTime()) continue;
          const tournament = n.tournament?.name ?? "—";
          if (isLowRelevance(tournament)) continue;
          matches.push({
            seriesId: String(n.id),
            startTime: new Date(startMs).toISOString(),
            tournament,
            teamAGridId: String(a.id),
            teamBGridId: String(b.id),
            teamAName: a.name,
            teamBName: b.name,
          });
          const k = pairKey(String(a.id), String(b.id));
          pairs[k] = (pairs[k] ?? 0) + 1;
        }
        pages++;
        if (!conn?.pageInfo?.hasNextPage) break;
        after = conn.pageInfo.endCursor;
      }
      const data: H2HResponse = {
        matches,
        pairs,
        windowStart: windowStart.toISOString(),
        windowEnd: windowEnd.toISOString(),
        fetchedSeries: fetched,
        cached: false,
        error: null,
      };
      cache = { at: Date.now(), key: cacheKey, data };
      return data;
    } catch (err) {
      console.error("[grid] h2h failed:", err);
      const msg = err instanceof Error ? err.message : String(err);
      if (cache && cache.key === cacheKey) return { ...cache.data, cached: true, error: msg };
      return { ...empty, error: msg };
    }
  });
