import { createServerFn } from "@tanstack/react-start";

export type GridTeam = {
  id: string;
  name: string;
  nameShortened?: string | null;
  logoUrl: string | null;
  colorPrimary: string | null;
  colorSecondary: string | null;
};

export type GridPlayer = {
  id: string;
  nickname: string;
  fullName: string | null;
  imageUrl: string | null;
  nationality: string[];
  roles: string[];
  teamId: string | null;
};

const GRID_ENDPOINT = "https://api-op.grid.gg/central-data/graphql";
const CS2_TITLE_ID = "28";

// ---------- caches (per server instance) ----------
let teamsCache: { at: number; teams: GridTeam[] } | null = null;
const rosterCache = new Map<string, { at: number; players: GridPlayer[] }>();
const TTL_MS = 60 * 60 * 1000;

async function gql<T>(apiKey: string, query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(GRID_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`GRID HTTP ${res.status}: ${await res.text().catch(() => "")}`);
  const json: any = await res.json();
  if (json.errors?.length) throw new Error(`GRID GraphQL: ${json.errors[0]?.message ?? "unknown"}`);
  return json.data as T;
}

// Build one query with one alias per requested name.
function aliasFor(i: number) {
  return `t${i}`;
}

async function findTeamsByNames(apiKey: string, names: string[]): Promise<GridTeam[]> {
  if (!names.length) return [];
  const varDefs = names.map((_, i) => `$n${i}: String!`).join(", ");
  const body = names
    .map(
      (_, i) => `${aliasFor(i)}: teams(first: 5, filter: { titleId: ${CS2_TITLE_ID}, name: { equals: $n${i} } }) {
        edges { node { id name nameShortened logoUrl colorPrimary colorSecondary } }
      }`,
    )
    .join("\n");
  const query = `query Resolve(${varDefs}) {\n${body}\n}`;
  const variables: Record<string, string> = {};
  names.forEach((n, i) => (variables[`n${i}`] = n));
  const data = await gql<Record<string, { edges: { node: GridTeam }[] }>>(apiKey, query, variables);
  const out: GridTeam[] = [];
  names.forEach((_, i) => {
    const edges = data[aliasFor(i)]?.edges ?? [];
    if (edges[0]?.node) out.push(edges[0].node);
  });
  return out;
}

export const getGridTeamsByNames = createServerFn({ method: "POST" })
  .inputValidator((data: { names: string[] }) => data)
  .handler(
    async ({ data }): Promise<{ teams: GridTeam[]; error: string | null; cached: boolean }> => {
      const apiKey = process.env.GRID_API_KEY;
      if (!apiKey) return { teams: [], error: "GRID_API_KEY not configured", cached: false };
      if (teamsCache && Date.now() - teamsCache.at < TTL_MS) {
        return { teams: teamsCache.teams, error: null, cached: true };
      }
      try {
        const teams = await findTeamsByNames(apiKey, data.names);
        teamsCache = { at: Date.now(), teams };
        return { teams, error: null, cached: false };
      } catch (err) {
        console.error("[grid] resolve teams failed:", err);
        if (teamsCache) return { teams: teamsCache.teams, error: String(err), cached: true };
        return { teams: [], error: err instanceof Error ? err.message : String(err), cached: false };
      }
    },
  );

// Backward compat: legacy callers expect getGridTeams(). Falls back to a small CS2 page.
export const getGridTeams = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ teams: GridTeam[]; error: string | null; cached: boolean }> => {
    const apiKey = process.env.GRID_API_KEY;
    if (!apiKey) return { teams: [], error: "GRID_API_KEY not configured", cached: false };
    if (teamsCache && Date.now() - teamsCache.at < TTL_MS) {
      return { teams: teamsCache.teams, error: null, cached: true };
    }
    return { teams: [], error: null, cached: false };
  },
);

// ---------- rosters ----------

async function fetchRoster(apiKey: string, gridTeamId: string): Promise<GridPlayer[]> {
  const query = `query Roster($id: ID!) {
    players(first: 25, filter: { titleId: ${CS2_TITLE_ID}, teamIdFilter: { id: $id } }) {
      edges { node { id nickname fullName imageUrl nationality roles { role { name } } } }
    }
  }`;
  const data = await gql<any>(apiKey, query, { id: gridTeamId });
  const edges = data?.players?.edges ?? [];
  return edges.map((e: any) => ({
    id: e.node.id,
    nickname: e.node.nickname,
    fullName: e.node.fullName ?? null,
    imageUrl: e.node.imageUrl ?? null,
    nationality: e.node.nationality ?? [],
    roles: (e.node.roles ?? []).map((r: any) => r?.role?.name).filter(Boolean),
    teamId: gridTeamId,
  }));
}

export const getGridRosters = createServerFn({ method: "POST" })
  .inputValidator((data: { teamIds: string[] }) => data)
  .handler(
    async ({ data }): Promise<{ rosters: Record<string, GridPlayer[]>; error: string | null }> => {
      const apiKey = process.env.GRID_API_KEY;
      if (!apiKey) return { rosters: {}, error: "GRID_API_KEY not configured" };
      const out: Record<string, GridPlayer[]> = {};
      const errors: string[] = [];
      await Promise.all(
        data.teamIds.map(async (id) => {
          const cached = rosterCache.get(id);
          if (cached && Date.now() - cached.at < TTL_MS) {
            out[id] = cached.players;
            return;
          }
          try {
            const players = await fetchRoster(apiKey, id);
            rosterCache.set(id, { at: Date.now(), players });
            out[id] = players;
          } catch (err) {
            console.error(`[grid] roster ${id} failed:`, err);
            errors.push(`${id}: ${err instanceof Error ? err.message : String(err)}`);
            if (cached) out[id] = cached.players;
            else out[id] = [];
          }
        }),
      );
      return { rosters: out, error: errors.length ? errors.join("; ") : null };
    },
  );
