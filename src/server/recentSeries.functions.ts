import { createServerFn } from "@tanstack/react-start";

/**
 * Recent completed CS2 series (last 3 months) — Tier S only.
 *
 * Tier S é heurístico por nome de torneio (lista oficial: BLAST Premier,
 * IEM, ESL Pro League, PGL Majors, BLAST World Final, Esports World Cup,
 * BLAST Open). Sempre que um torneio Tier S muda no calendário, basta
 * atualizar TIER_S_PATTERNS.
 *
 * Tolerante a falhas: devolve { series: [] } com error preenchido se a
 * GRID quebrar, sem inventar dados.
 */

const GRID_ENDPOINT = "https://api-op.grid.gg/central-data/graphql";
const CS2_TITLE_ID = "28";
const THREE_MONTHS_MS = 1000 * 60 * 60 * 24 * 30 * 3;
const PAGE_SIZE = 50;
const MAX_PAGES = 20;

const TIER_S_PATTERNS: RegExp[] = [
  /\bmajor\b/i,
  /\biem\b/i,
  /esl\s+pro\s+league/i,
  /\bblast\s+premier\b/i,
  /\bblast\s+open\b/i,
  /\bblast\s+(world|fall|spring)\b/i,
  /\bpgl\b/i,
  /\besports\s+world\s+cup\b/i,
  /katowice|cologne|dallas|chengdu|cluj|bucharest|austin|paris|copenhagen/i,
];

function isTierS(tournament: string): boolean {
  const t = tournament ?? "";
  return TIER_S_PATTERNS.some((re) => re.test(t));
}

function isLowRelevance(tournament: string): boolean {
  const t = (tournament ?? "").toLowerCase();
  return (
    t.includes("test") ||
    t.includes("sandbox") ||
    t.includes("scrim") ||
    t.includes("showmatch") ||
    t.includes("grid-test")
  );
}

export type RecentSeries = {
  id: string;
  startTime: string;
  tournament: string;
  boType: string;
  teamA: { gridId: string; name: string };
  teamB: { gridId: string; name: string };
};

export type RecentSeriesResponse = {
  series: RecentSeries[];
  windowStart: string;
  windowEnd: string;
  fetched: number;
  cached: boolean;
  error: string | null;
};

let cache: { at: number; data: RecentSeriesResponse } | null = null;
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

export const getGridRecentTierSSeries = createServerFn({ method: "GET" }).handler(
  async (): Promise<RecentSeriesResponse> => {
    const apiKey = process.env.GRID_API_KEY;
    const windowEnd = new Date();
    const windowStart = new Date(windowEnd.getTime() - THREE_MONTHS_MS);
    const empty: RecentSeriesResponse = {
      series: [],
      windowStart: windowStart.toISOString(),
      windowEnd: windowEnd.toISOString(),
      fetched: 0,
      cached: false,
      error: null,
    };
    if (!apiKey) return { ...empty, error: "GRID_API_KEY not configured" };
    if (cache && Date.now() - cache.at < TTL_MS) return { ...cache.data, cached: true };

    const query = `query Recent($after: Cursor) {
      allSeries(first: ${PAGE_SIZE}, after: $after, filter: { titleId: ${CS2_TITLE_ID} }, orderBy: StartTimeScheduled) {
        pageInfo { hasNextPage endCursor }
        edges {
          node {
            id
            startTimeScheduled
            format { nameShortened }
            tournament { name }
            teams { baseInfo { id name } }
          }
        }
      }
    }`;

    try {
      const series: RecentSeries[] = [];
      let after: string | null = null;
      let fetched = 0;
      let pages = 0;
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
          const startMs = new Date(n.startTimeScheduled ?? 0).getTime();
          if (!Number.isFinite(startMs)) continue;
          // Janela: últimos 3 meses, apenas concluídas (start < agora)
          if (startMs < windowStart.getTime() || startMs >= windowEnd.getTime()) continue;
          const tournament = n.tournament?.name ?? "—";
          if (isLowRelevance(tournament)) continue;
          if (!isTierS(tournament)) continue;
          series.push({
            id: String(n.id),
            startTime: new Date(startMs).toISOString(),
            tournament,
            boType: n.format?.nameShortened ?? "BO?",
            teamA: { gridId: String(a.id), name: a.name },
            teamB: { gridId: String(b.id), name: b.name },
          });
        }
        pages++;
        if (!conn?.pageInfo?.hasNextPage) break;
        after = conn.pageInfo.endCursor;
      }
      const data: RecentSeriesResponse = {
        series: series.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()),
        windowStart: windowStart.toISOString(),
        windowEnd: windowEnd.toISOString(),
        fetched,
        cached: false,
        error: null,
      };
      cache = { at: Date.now(), data };
      return data;
    } catch (err) {
      console.error("[grid] recent tier-s failed:", err);
      const msg = err instanceof Error ? err.message : String(err);
      if (cache) return { ...cache.data, cached: true, error: msg };
      return { ...empty, error: msg };
    }
  },
);
