import { createServerFn } from "@tanstack/react-start";

export type GridTeam = {
  id: string;
  name: string;
  logoUrl: string | null;
  colorPrimary: string | null;
  colorSecondary: string | null;
};

const GRID_ENDPOINT = "https://api-op.grid.gg/central-data/graphql";

// Simple in-memory cache (per server instance). 1h TTL.
let cache: { at: number; teams: GridTeam[] } | null = null;
const TTL_MS = 60 * 60 * 1000;

const QUERY = /* GraphQL */ `
  query Teams($first: Int!, $after: Cursor) {
    teams(first: $first, after: $after) {
      edges {
        node {
          id
          name
          logoUrl
          colorPrimary
          colorSecondary
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

async function fetchAllTeams(apiKey: string): Promise<GridTeam[]> {
  const out: GridTeam[] = [];
  let after: string | null = null;
  // Cap pagination to avoid runaway loops
  for (let i = 0; i < 20; i++) {
    const res = await fetch(GRID_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({ query: QUERY, variables: { first: 100, after } }),
    });
    if (!res.ok) {
      throw new Error(`GRID HTTP ${res.status}: ${await res.text().catch(() => "")}`);
    }
    const json: any = await res.json();
    if (json.errors?.length) {
      throw new Error(`GRID GraphQL: ${json.errors[0]?.message ?? "unknown"}`);
    }
    const edges = json?.data?.teams?.edges ?? [];
    for (const e of edges) if (e?.node) out.push(e.node as GridTeam);
    const page = json?.data?.teams?.pageInfo;
    if (!page?.hasNextPage) break;
    after = page.endCursor ?? null;
    if (!after) break;
  }
  return out;
}

export const getGridTeams = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ teams: GridTeam[]; error: string | null; cached: boolean }> => {
    const apiKey = process.env.GRID_API_KEY;
    if (!apiKey) {
      return { teams: [], error: "GRID_API_KEY not configured", cached: false };
    }
    if (cache && Date.now() - cache.at < TTL_MS) {
      return { teams: cache.teams, error: null, cached: true };
    }
    try {
      const teams = await fetchAllTeams(apiKey);
      cache = { at: Date.now(), teams };
      return { teams, error: null, cached: false };
    } catch (err) {
      console.error("[grid] fetch teams failed:", err);
      // Serve stale cache if available
      if (cache) return { teams: cache.teams, error: String(err), cached: true };
      return { teams: [], error: err instanceof Error ? err.message : String(err), cached: false };
    }
  },
);
