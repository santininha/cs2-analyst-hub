import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import { TeamBadge } from "@/components/TeamBadge";
import { players, getTeam } from "@/data/mock";

export const Route = createFileRoute("/jogadores/")({
  head: () => ({ meta: [{ title: "Jogadores — CS2 Analyst Hub" }] }),
  component: PlayersList,
});

function PlayersList() {
  const sorted = [...players].sort((a, b) => b.rating - a.rating);
  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Jogadores" subtitle="Estatísticas individuais, mapas fortes e desempenho por lado." />
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {sorted.map((p) => {
          const t = getTeam(p.teamId)!;
          return (
            <Link key={p.id} to="/jogadores/$playerId" params={{ playerId: p.id }}>
              <Card className="hover:shadow-[var(--shadow-elevated)] transition cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <TeamBadge team={t} size="md" />
                    <div className="flex-1">
                      <div className="font-bold">{p.nick}</div>
                      <div className="text-xs text-muted-foreground">{p.realName} • {p.role}</div>
                    </div>
                    <Badge variant="outline" className="border-primary text-primary text-base">{p.rating.toFixed(2)}</Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <Stat label="K/D" value={p.kd.toFixed(2)} />
                    <Stat label="HS%" value={`${p.hsPct}%`} />
                    <Stat label="ADR" value={String(p.adr)} />
                    <Stat label="Time" value={t.tag} />
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border rounded p-1.5">
      <div className="font-bold">{value}</div>
      <div className="text-muted-foreground text-[10px]">{label}</div>
    </div>
  );
}
