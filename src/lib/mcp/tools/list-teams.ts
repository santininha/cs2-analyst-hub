import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { teams, getTeam, getTeamPlayers, players } from "@/data/mock";

export default defineTool({
  name: "list_teams",
  title: "List CS2 teams",
  description:
    "List the CS2 teams tracked by the workspace (top 20 world ranking plus legacy Brazilian teams). Returns id, name, tag, region, world rank, GRID id when enriched, and brand colors.",
  inputSchema: {
    region: z.string().optional().describe("Optional region filter, e.g. 'Europe', 'South America'."),
    limit: z.number().int().positive().optional().describe("Max number of teams to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ region, limit }) => {
    let out = teams.slice();
    if (region) out = out.filter((t) => t.region.toLowerCase() === region.toLowerCase());
    out = out.sort((a, b) => a.worldRank - b.worldRank);
    if (limit) out = out.slice(0, limit);
    const rows = out.map((t) => ({
      id: t.id,
      name: t.name,
      tag: t.tag,
      region: t.region,
      worldRank: t.worldRank,
      winRate: t.winRate,
      gridId: t.gridId ?? null,
      logoUrl: t.logoUrl ?? null,
      colorPrimary: t.colorPrimary ?? null,
      colorSecondary: t.colorSecondary ?? null,
      rosterCount: players.filter((p) => p.teamId === t.id).length,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { teams: rows },
    };
  },
});

export { getTeam, getTeamPlayers };
