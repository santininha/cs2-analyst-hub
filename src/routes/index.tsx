import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import { TeamBadge } from "@/components/TeamBadge";
import { matches, getTeam } from "@/data/mock";
import { Swords, Calendar, Trophy, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — CS2 Analyst Hub" },
      { name: "description", content: "Próximos jogos importantes e partidas em análise para o caster." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const upcoming = matches.filter((m) => m.status === "upcoming");
  const analyzing = matches.filter((m) => (m.preNotes || m.techNotes || m.keywords?.length));
  const recent = matches.filter((m) => m.status === "finished").slice(0, 2);

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Olá, Santininha 👋"
        subtitle="Foco no que importa: próximos jogos e análises em andamento."
        actions={
          <Button asChild size="lg">
            <Link to="/comparar"><Swords className="mr-2 h-4 w-4" />Comparar times</Link>
          </Button>
        }
      />

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" /> Próximos jogos importantes
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {upcoming.map((m) => <PriorityMatchCard key={m.id} matchId={m.id} />)}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Swords className="h-5 w-5 text-primary" /> Partidas que estou analisando
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {analyzing.map((m) => <PriorityMatchCard key={m.id} matchId={m.id} analyzing />)}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" /> Últimos resultados
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {recent.map((m) => <PriorityMatchCard key={m.id} matchId={m.id} />)}
        </div>
      </section>
    </div>
  );
}

function PriorityMatchCard({ matchId, analyzing }: { matchId: string; analyzing?: boolean }) {
  const m = matches.find((x) => x.id === matchId)!;
  const a = getTeam(m.teamAId)!;
  const b = getTeam(m.teamBId)!;
  return (
    <Card className={analyzing ? "border-primary/40" : ""}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">{m.event}</span>
          <Badge variant={m.status === "upcoming" ? "default" : m.status === "live" ? "destructive" : "secondary"}>
            {m.status === "upcoming" ? "Em breve" : m.status === "live" ? "AO VIVO" : "Finalizada"}
          </Badge>
        </div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <TeamBadge team={a} size="sm" />
            <span className="font-semibold truncate">{a.name}</span>
          </div>
          <span className="text-lg font-bold text-primary">
            {m.result ? `${m.result.scoreA} - ${m.result.scoreB}` : "vs"}
          </span>
          <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
            <span className="font-semibold truncate text-right">{b.name}</span>
            <TeamBadge team={b} size="sm" />
          </div>
        </div>
        <div className="text-xs text-muted-foreground mb-3">
          {new Date(m.date).toLocaleString("pt-BR")} • {m.format}
        </div>
        <Button asChild size="sm" className="w-full">
          <Link to="/partidas/$matchId" params={{ matchId: m.id }}>
            Abrir análise completa <ArrowRight className="ml-2 h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
