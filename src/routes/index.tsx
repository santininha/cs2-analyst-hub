import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TeamBadge } from "@/components/TeamBadge";
import {
  matches,
  getTeam,
  teams,
  players,
  notes,
} from "@/data/mock";
import {
  Swords,
  Calendar,
  ArrowRight,
  TrendingUp,
  Star,
  StickyNote,
  Flame,
  Mic,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Analyst Desk — CS2 Analyst Hub" },
      { name: "description", content: "Centro de controle contextual da analista: próximas partidas, análises em andamento e destaques." },
    ],
  }),
  component: AnalystDesk,
});

function AnalystDesk() {
  const upcoming = matches.filter((m) => m.status === "upcoming");
  const analyzing = matches.filter((m) => m.preNotes || m.techNotes || m.keywords?.length);
  const recent = matches.filter((m) => m.status === "finished").slice(0, 3);
  const trendingTeams = [...teams].sort((a, b) => a.worldRank - b.worldRank).slice(0, 5);
  const topPlayers = [...players].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const latestNotes = [...notes].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 3);
  const nextMatch = upcoming[0];

  return (
    <div>
      {/* Eyebrow + Hero */}
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="eyebrow">Analyst Desk · {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}</span>
          <h1 className="text-[28px] md:text-[34px] mt-1.5 text-foreground">
            Bom retorno, Santininha.
          </h1>
          <p className="text-[14px] text-muted-foreground mt-1.5 max-w-2xl leading-relaxed">
            {upcoming.length} partidas mapeadas · {analyzing.length} em análise ativa · {latestNotes.length} novas notas de transmissão.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild size="sm">
            <Link to="/notas"><StickyNote className="h-3.5 w-3.5 mr-1.5" />Caster Notes</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/comparar"><Swords className="h-3.5 w-3.5 mr-1.5" />Abrir Team Lab</Link>
          </Button>
        </div>
      </div>

      {/* Featured next match */}
      {nextMatch && <FeaturedMatch matchId={nextMatch.id} />}

      {/* Two-column workspace */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main column */}
        <div className="space-y-8 min-w-0">
          <Section
            eyebrow="Pipeline de transmissão"
            title="Próximas partidas"
            icon={<Calendar className="h-4 w-4" />}
            action={<Link to="/partidas" className="text-[12px] text-muted-foreground hover:text-foreground">Ver tudo →</Link>}
          >
            <div className="grid gap-3 md:grid-cols-2">
              {upcoming.map((m) => <MatchRow key={m.id} matchId={m.id} />)}
            </div>
          </Section>

          <Section
            eyebrow="Workspace ativo"
            title="Em análise"
            icon={<Swords className="h-4 w-4" />}
          >
            <div className="grid gap-3 md:grid-cols-2">
              {analyzing.map((m) => <MatchRow key={m.id} matchId={m.id} analyzing />)}
            </div>
          </Section>

          <Section
            eyebrow="Resultados recentes"
            title="Última rodada"
            icon={<TrendingUp className="h-4 w-4" />}
          >
            <div className="grid gap-3 md:grid-cols-2">
              {recent.map((m) => <MatchRow key={m.id} matchId={m.id} />)}
            </div>
          </Section>
        </div>

        {/* Side column */}
        <aside className="space-y-6">
          <SideCard eyebrow="Trending" title="Times em alta" icon={<Flame className="h-3.5 w-3.5" />}>
            <ul className="divide-y divide-border/60">
              {trendingTeams.map((t) => (
                <li key={t.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                  <span className="text-[11px] font-semibold text-muted-foreground tabular-nums w-5">#{t.worldRank}</span>
                  <TeamBadge team={t} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold truncate">{t.name}</div>
                    <div className="text-[11px] text-muted-foreground">{t.region} · {t.winRate}% WR</div>
                  </div>
                </li>
              ))}
            </ul>
          </SideCard>

          <SideCard eyebrow="Player Watch" title="Destaques" icon={<Star className="h-3.5 w-3.5" />}>
            <ul className="space-y-2">
              {topPlayers.map((p) => {
                const team = getTeam(p.teamId);
                return (
                  <li key={p.id}>
                    <Link
                      to="/jogadores/$playerId"
                      params={{ playerId: p.id }}
                      className="flex items-center justify-between gap-2 px-2 py-1.5 -mx-2 rounded-md hover:bg-muted/60 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold truncate">{p.nick}</div>
                        <div className="text-[11px] text-muted-foreground truncate">{team?.tag} · {p.role}</div>
                      </div>
                      <Badge variant="outline" className="border-primary/30 text-primary text-[11px] tabular-nums">
                        {p.rating.toFixed(2)}
                      </Badge>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </SideCard>

          <SideCard eyebrow="Caster Notes" title="Recentes" icon={<Mic className="h-3.5 w-3.5" />}>
            <ul className="space-y-3">
              {latestNotes.map((n) => (
                <li key={n.id}>
                  <Link to="/notas" className="block group">
                    <div className="text-[13px] font-semibold leading-snug group-hover:text-primary transition-colors">
                      {n.title}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                      {n.content}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </SideCard>
        </aside>
      </div>
    </div>
  );
}

function Section({
  eyebrow,
  title,
  icon,
  action,
  children,
}: {
  eyebrow: string;
  title: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-end justify-between mb-3">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="text-[18px] mt-0.5 flex items-center gap-2">
            {icon && <span className="text-primary">{icon}</span>}
            {title}
          </h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function SideCard({
  eyebrow,
  title,
  icon,
  children,
}: {
  eyebrow: string;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground/80 font-semibold">{eyebrow}</div>
          <div className="text-[14px] font-semibold flex items-center gap-1.5 mt-0.5">
            {icon && <span className="text-primary">{icon}</span>}
            {title}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

function FeaturedMatch({ matchId }: { matchId: string }) {
  const m = matches.find((x) => x.id === matchId)!;
  const a = getTeam(m.teamAId)!;
  const b = getTeam(m.teamBId)!;
  return (
    <Card className="overflow-hidden border-border/60">
      <div className="grid md:grid-cols-[1fr_auto] items-stretch">
        <div className="p-5 md:p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="eyebrow">Próxima partida em destaque</span>
            <Badge variant="default" className="text-[10px]">{m.event}</Badge>
          </div>
          <div className="flex items-center gap-5 mb-4">
            <div className="flex items-center gap-3">
              <TeamBadge team={a} size="lg" />
              <div>
                <div className="font-semibold text-[16px] leading-tight">{a.name}</div>
                <div className="text-[11px] text-muted-foreground">#{a.worldRank} · {a.winRate}%</div>
              </div>
            </div>
            <span className="text-2xl font-bold text-muted-foreground">vs</span>
            <div className="flex items-center gap-3">
              <TeamBadge team={b} size="lg" />
              <div>
                <div className="font-semibold text-[16px] leading-tight">{b.name}</div>
                <div className="text-[11px] text-muted-foreground">#{b.worldRank} · {b.winRate}%</div>
              </div>
            </div>
          </div>
          {m.preNotes && (
            <p className="text-[13px] text-foreground/80 leading-relaxed max-w-2xl">
              {m.preNotes}
            </p>
          )}
          {m.keywords && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {m.keywords.map((k) => (
                <Badge key={k} variant="secondary" className="text-[10px]">{k}</Badge>
              ))}
            </div>
          )}
        </div>
        <div className="bg-muted/40 border-t md:border-t-0 md:border-l border-border/60 p-5 md:p-6 flex flex-col justify-between gap-4 md:w-64">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Início</div>
            <div className="text-[14px] font-semibold mt-0.5">
              {new Date(m.date).toLocaleString("pt-BR", { weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">{m.format} · {m.maps.length} mapas previstos</div>
          </div>
          <Button asChild size="sm" className="w-full">
            <Link to="/partidas/$matchId" params={{ matchId: m.id }}>
              Abrir workspace <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}

function MatchRow({ matchId, analyzing }: { matchId: string; analyzing?: boolean }) {
  const m = matches.find((x) => x.id === matchId)!;
  const a = getTeam(m.teamAId)!;
  const b = getTeam(m.teamBId)!;
  return (
    <Link
      to="/partidas/$matchId"
      params={{ matchId: m.id }}
      className={`group block rounded-lg border bg-card p-3.5 transition-colors hover:border-primary/40 ${
        analyzing ? "border-primary/30" : "border-border/60"
      }`}
    >
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold truncate">{m.event}</span>
        <Badge
          variant={m.status === "upcoming" ? "default" : m.status === "live" ? "destructive" : "secondary"}
          className="text-[10px]"
        >
          {m.status === "upcoming" ? "Em breve" : m.status === "live" ? "AO VIVO" : "Final"}
        </Badge>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <TeamBadge team={a} size="sm" />
          <span className="font-semibold text-[13px] truncate">{a.name}</span>
        </div>
        <span className="text-[14px] font-bold text-foreground tabular-nums">
          {m.result ? `${m.result.scoreA}–${m.result.scoreB}` : "vs"}
        </span>
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <span className="font-semibold text-[13px] truncate text-right">{b.name}</span>
          <TeamBadge team={b} size="sm" />
        </div>
      </div>
      <div className="text-[11px] text-muted-foreground mt-2.5 flex items-center justify-between">
        <span>{new Date(m.date).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary font-semibold inline-flex items-center">
          Abrir <ArrowRight className="h-3 w-3 ml-1" />
        </span>
      </div>
    </Link>
  );
}
