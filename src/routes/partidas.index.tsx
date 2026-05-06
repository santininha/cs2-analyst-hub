import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import { TeamBadge } from "@/components/TeamBadge";
import { matches, getTeam } from "@/data/mock";

export const Route = createFileRoute("/partidas/")({
  head: () => ({
    meta: [
      { title: "Partidas — CS2 Analyst Hub" },
      { name: "description", content: "Lista de partidas analisadas com roteiros pré e pós-jogo." },
    ],
  }),
  component: MatchesList,
});

function MatchesList() {
  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Partidas" subtitle="Selecione uma partida para ver detalhes, notas e roteiro." />
      <div className="grid gap-3 md:grid-cols-2">
        {matches.map((m) => {
          const a = getTeam(m.teamAId)!;
          const b = getTeam(m.teamBId)!;
          return (
            <Link key={m.id} to="/partidas/$matchId" params={{ matchId: m.id }}>
              <Card className="hover:shadow-[var(--shadow-elevated)] transition cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-muted-foreground">{m.event}</span>
                    <Badge variant={m.status === "upcoming" ? "default" : "secondary"}>
                      {m.status === "upcoming" ? "Em breve" : "Finalizada"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><TeamBadge team={a} size="sm" /><span className="font-semibold">{a.name}</span></div>
                    <span className="font-bold text-primary">{m.result ? `${m.result.scoreA} - ${m.result.scoreB}` : "vs"}</span>
                    <div className="flex items-center gap-2"><span className="font-semibold">{b.name}</span><TeamBadge team={b} size="sm" /></div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-3">
                    {new Date(m.date).toLocaleString("pt-BR")} • {m.format}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
