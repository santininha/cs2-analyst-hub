import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { matches, getTeam } from "@/data/mock";

export default defineTool({
  name: "list_matches",
  title: "List CS2 matches",
  description:
    "List CS2 matches known to the workspace (mock + curated). Filter by status (upcoming / live / finished) and optionally by team id.",
  inputSchema: {
    status: z.enum(["upcoming", "live", "finished"]).optional(),
    teamId: z.string().optional().describe("Only return matches involving this team id."),
    limit: z.number().int().positive().optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ status, teamId, limit }) => {
    let out = matches.slice();
    if (status) out = out.filter((m) => m.status === status);
    if (teamId) out = out.filter((m) => m.teamAId === teamId || m.teamBId === teamId);
    out = out.sort((a, b) => (a.date < b.date ? 1 : -1));
    if (limit) out = out.slice(0, limit);
    const rows = out.map((m) => ({
      id: m.id,
      event: m.event,
      status: m.status,
      date: m.date,
      format: m.format,
      teamA: { id: m.teamAId, name: getTeam(m.teamAId)?.name ?? m.teamAId },
      teamB: { id: m.teamBId, name: getTeam(m.teamBId)?.name ?? m.teamBId },
      result: m.result ?? null,
      maps: m.maps,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { matches: rows },
    };
  },
});
