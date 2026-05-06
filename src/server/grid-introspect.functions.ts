import { createServerFn } from "@tanstack/react-start";

const ENDPOINT = "https://api-op.grid.gg/central-data/graphql";

export const introspectGrid = createServerFn({ method: "GET" }).handler(async () => {
  const apiKey = process.env.GRID_API_KEY;
  if (!apiKey) return { error: "no key" };
  const q = `query{
    __type(name:"Team"){ name fields{ name type{ name kind ofType{ name kind } } } }
    Q: __schema{ queryType{ fields{ name args{ name type{ name kind ofType{ name } } } } } }
  }`;
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey },
    body: JSON.stringify({ query: q }),
  });
  const json = await res.json();
  return json;
});
