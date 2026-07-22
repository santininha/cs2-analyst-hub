import { defineTool } from "@lovable.dev/mcp-js";
import { getMapPoolStatus } from "@/lib/mapPool";

export default defineTool({
  name: "get_active_map_pool",
  title: "Get CS2 active map pool",
  description:
    "Get the current CS2 Active Duty map pool tracked by the workspace, including season label, last-verified timestamp, active maps and recently removed maps.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const status = getMapPoolStatus();
    return {
      content: [{ type: "text", text: JSON.stringify(status, null, 2) }],
      structuredContent: status,
    };
  },
});
