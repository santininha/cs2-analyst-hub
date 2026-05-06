import { createFileRoute } from "@tanstack/react-router";
import { introspectGrid } from "@/server/grid-introspect.functions";

export const Route = createFileRoute("/api/public/debug-grid")({
  server: {
    handlers: {
      GET: async () => {
        const data = await introspectGrid();
        return new Response(JSON.stringify(data, null, 2), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
