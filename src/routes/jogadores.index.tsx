import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { TeamBadge } from "@/components/TeamBadge";
import { teams, getTeamPlayers } from "@/data/mock";
import { ChevronDown, ChevronRight, Flame } from "lucide-react";

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
  const sorted = [...teams].sort((a, b) => a.worldRank - b.worldRank);

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Times & Jogadores"
        subtitle="Selecione um time para ver seu elenco. Sem listas genéricas — só contexto que importa."
      />

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
