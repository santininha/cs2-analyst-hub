import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getTeam, getTeamPlayers } from "@/data/mock";

export default defineTool({
  name: "get_team",
  title: "Get team details",
  description:
    "Get a single CS2 team by id, including its current roster (nick, real name, role, rating, K/D, ADR, CT/TR ratings).",
  inputSchema: {
    id: z.string().describe("Team id, e.g. 'furia', 'navi', 'vitality'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ id }) => {
    const team = getTeam(id);
    if (!team) {
      return { content: [{ type: "text", text: `Team not found: ${id}` }], isError: true };
    }
    const roster = getTeamPlayers(id).map((p) => ({
      id: p.id,
      nick: p.nick,
      realName: p.realName,
      role: p.role,
      rating: p.rating,
      kd: p.kd,
      hsPct: p.hsPct,
      adr: p.adr,
      ctRating: p.ctRating,
      trRating: p.trRating,
      strongMaps: p.strongMaps,
      weakMaps: p.weakMaps,
    }));
    const payload = { team, roster };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
