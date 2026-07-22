import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { glossary } from "@/data/mock";

export default defineTool({
  name: "search_glossary",
  title: "Search caster glossary",
  description:
    "Search the caster glossary (palavras-chave, expressões, termos técnicos) by free-text query. Returns matching terms with their definition and category.",
  inputSchema: {
    query: z.string().min(1).describe("Free-text query matched against term and definition."),
    limit: z.number().int().positive().optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, limit }) => {
    const q = query.toLowerCase();
    let out = glossary.filter((g) => {
      const hay = `${(g as { term?: string }).term ?? ""} ${(g as { definition?: string }).definition ?? ""} ${JSON.stringify(g)}`.toLowerCase();
      return hay.includes(q);
    });
    if (limit) out = out.slice(0, limit);
    return {
      content: [{ type: "text", text: JSON.stringify(out, null, 2) }],
      structuredContent: { results: out },
    };
  },
});
