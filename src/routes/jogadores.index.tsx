import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/PageHeader";
import { TeamBadge } from "@/components/TeamBadge";
import { DataSourceTag } from "@/components/DataSourceTag";
import { teams, getTeamPlayers } from "@/data/mock";
import { ChevronDown, ChevronRight, Flame, Search } from "lucide-react";

export const Route = createFileRoute("/jogadores/")({
  head: () => ({
    meta: [
      { title: "Times & Jogadores — CS2 Analyst Hub" },
      { name: "description", content: "Explore os times e seus jogadores. Foco em contexto, não em listas genéricas." },
    ],
  }),
  component: TeamsList,
});

function TeamsList() {
  const [openId, setOpenId] = useState<string | null>(teams[0]?.id ?? null);
  const [query, setQuery] = useState("");
  const sorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = [...teams].sort((a, b) => a.worldRank - b.worldRank);
    if (!q) return list;
    return list.filter((t) => {
      if (t.name.toLowerCase().includes(q) || t.tag.toLowerCase().includes(q)) return true;
      return getTeamPlayers(t.id).some((p) => p.nick.toLowerCase().includes(q));
    });
  }, [query]);

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Times & Jogadores"
        subtitle="Selecione um time para ver seu elenco. Sem listas genéricas — só contexto que importa."
      />

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar time, tag ou jogador…"
          className="pl-10 h-10 bg-card text-[13px]"
        />
      </div>

      <div className="grid gap-3">
        {sorted.map((t) => {
          const open = openId === t.id;
          const roster = getTeamPlayers(t.id);
          const star = [...roster].sort((a, b) => b.rating - a.rating)[0];
          return (
            <Card key={t.id} className="overflow-hidden">
              <button
                onClick={() => setOpenId(open ? null : t.id)}
                className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition text-left"
              >
                <TeamBadge team={t} size="md" />
                <div className="flex-1">
                  <div className="font-bold flex items-center gap-2">
                    {t.name}
                    <Badge variant="outline" className="text-[10px]">#{t.worldRank}</Badge>
                    <DataSourceTag team={t} size="xs" />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t.region} • {roster.length} jogadores • Win rate {t.winRate}%
                    {star && <> • Destaque: <span className="text-primary font-semibold">{star.nick}</span></>}
                  </div>
                </div>
                {open ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              </button>

              {open && (
                <CardContent className="bg-muted/30 border-t pt-4">
                  {roster.length === 0 ? (
                    <div className="text-sm text-muted-foreground py-4 text-center">Elenco não cadastrado.</div>
                  ) : (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {[...roster].sort((a, b) => b.rating - a.rating).map((p, i) => (
                        <Link
                          key={p.id}
                          to="/jogadores/$playerId"
                          params={{ playerId: p.id }}
                          className="flex items-center gap-3 p-3 rounded-md bg-card hover:shadow-[var(--shadow-elevated)] transition border"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold flex items-center gap-1">
                              {i === 0 && <Flame className="h-3.5 w-3.5 text-primary" />}
                              {p.nick}
                            </div>
                            <div className="text-[11px] text-muted-foreground truncate">{p.role}</div>
                          </div>
                          <div className="flex gap-1">
                            <Badge variant="outline" className="border-primary text-primary">{p.rating.toFixed(2)}</Badge>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-end mt-3">
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/comparar">Comparar com outro time</Link>
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
