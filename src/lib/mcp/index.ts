import { defineMcp } from "@lovable.dev/mcp-js";
import listTeams from "./tools/list-teams";
import getTeamTool from "./tools/get-team";
import listMatches from "./tools/list-matches";
import getMapPool from "./tools/get-map-pool";
import searchGlossary from "./tools/search-glossary";

export default defineMcp({
  name: "cs2-analyst-hub-mcp",
  title: "CS2 Analyst Hub",
  version: "0.1.0",
  instructions:
    "Read-only tools for the CS2 Analyst Hub workspace: list and inspect tracked CS2 teams (top 20 world ranking, enriched with GRID metadata), list matches (upcoming / live / finished), read the current Active Duty map pool, and search the caster glossary.",
  tools: [listTeams, getTeamTool, listMatches, getMapPool, searchGlossary],
});
