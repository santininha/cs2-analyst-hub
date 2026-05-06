import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import { TeamBadge } from "@/components/TeamBadge";
import { matches, getTeam, players, notes, glossary } from "@/data/mock";
import { Swords, BookOpen, StickyNote, Trophy, Calendar, Flame } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — CS2 Analyst Hub" },
      { name: "description", content: "Resumo dos próximos jogos, partidas recentes e atalhos para análise rápida." },
    ],
  }),
  component: Dashboard,
});

function MatchCard({ matchId }: { matchId: string }) {
  const m = matches.find((x) => x.id === matchId)!;
  const a = getTeam(m.teamAId)!;
  const b = getTeam(m.teamBId)!;
  const date = new Date(m.date);
  return (
    <Link to="/partidas/$matchId" params={{ matchId: m.id }}>
      <Card className="hover:shadow-[var(--shadow-elevated)] transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground">{m.event}</span>
            <Badge variant={m.status === "upcoming" ? "default" : m.status === "live" ? "destructive" : "secondary"}>
              {m.status === "upcoming" ? "Em breve" : m.status === "live" ? "AO VIVO" : "Finalizada"}
            </Badge>
          </div>
          <div className="flex items-center justify-between gap-2">
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
          <div className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {date.toLocaleDateString("pt-BR")} • {m.format}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function Dashboard() {
  const upcoming = matches.filter((m) => m.status === "upcoming");
  const recent = matches.filter((m) => m.status === "finished");
  const topPlayers = [...players].sort((a, b) => b.rating - a.rating).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Olá, Santininha 👋"
        subtitle="Tudo pronto para a próxima transmissão. Aqui está seu resumo."
        actions={
          <Button asChild size="lg">
            <Link to="/comparar"><Swords className="mr-2 h-4 w-4" />Comparar times</Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <StatCard icon={Calendar} label="Próximos jogos" value={String(upcoming.length)} />
        <StatCard icon={Trophy} label="Partidas analisadas" value={String(matches.length)} />
        <StatCard icon={StickyNote} label="Notas técnicas" value={String(notes.length)} />
        <StatCard icon={BookOpen} label="Frases no glossário" value={String(glossary.length)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" /> Próximos jogos
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {upcoming.map((m) => <MatchCard key={m.id} matchId={m.id} />)}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" /> Partidas recentes
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {recent.map((m) => <MatchCard key={m.id} matchId={m.id} />)}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Flame className="h-4 w-4 text-primary" />Jogadores em destaque</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {topPlayers.map((p) => {
                const t = getTeam(p.teamId)!;
                return (
                  <Link key={p.id} to="/jogadores/$playerId" params={{ playerId: p.id }}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <TeamBadge team={t} size="sm" />
                      <div>
                        <div className="font-semibold text-sm">{p.nick}</div>
                        <div className="text-xs text-muted-foreground">{t.tag}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-primary text-primary">{p.rating.toFixed(2)}</Badge>
                  </Link>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Atalhos rápidos</CardTitle></CardHeader>
            <CardContent className="grid gap-2">
              <Button variant="outline" asChild className="justify-start"><Link to="/notas"><StickyNote className="mr-2 h-4 w-4" />Minhas notas</Link></Button>
              <Button variant="outline" asChild className="justify-start"><Link to="/glossario"><BookOpen className="mr-2 h-4 w-4" />Glossário</Link></Button>
              <Button variant="outline" asChild className="justify-start"><Link to="/jogadores"><Flame className="mr-2 h-4 w-4" />Jogadores em destaque</Link></Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-md bg-accent flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}
