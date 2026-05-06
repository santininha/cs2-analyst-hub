import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import { TeamBadge } from "@/components/TeamBadge";
import { DataSourceTag } from "@/components/DataSourceTag";
import { useMatches } from "@/contexts/MatchesContext";
import type { MatchEnriched } from "@/lib/matchTypes";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/partidas/")({
  head: () => ({
    meta: [
      { title: "Partidas — CS2 Analyst Hub" },
      { name: "description", content: "Lista de partidas reais e mapeadas com roteiros pré e pós-jogo." },
    ],
  }),
  component: MatchesList,
});

function MatchesList() {
  const { matches, upcoming, live, completed, loading, source, gridCount } = useMatches();

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Partidas"
        subtitle="Próximas, ao vivo e finalizadas. Mock + GRID quando disponível."
      />

      <div className="mb-4 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
        {loading ? (
          <span className="inline-flex items-center gap-1.5">
            <Loader2 className="h-3 w-3 animate-spin" /> Conectando GRID · carregando partidas…
          </span>
        ) : (
          <>
            <span className="uppercase tracking-[0.12em] font-semibold">Fonte: {source}</span>
            <span>·</span>
            <span>{matches.length} partidas · {gridCount} via GRID</span>
            <span>·</span>
            <span>{live.length} ao vivo · {upcoming.length} próximas · {completed.length} finalizadas</span>
          </>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {matches.map((m) => <MatchCard key={m.id} m={m} />)}
        {!loading && matches.length === 0 && (
          <div className="text-sm text-muted-foreground italic">Nenhuma partida disponível.</div>
        )}
      </div>
    </div>
  );
}

function MatchCard({ m }: { m: MatchEnriched }) {
  const a = m.teamA;
  const b = m.teamB;
  const isMock = m.source === "mock";
  const inner = (
    <Card className="hover:shadow-[var(--shadow-elevated)] transition cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3 gap-2">
          <span className="text-xs font-semibold text-muted-foreground truncate">{m.tournament}</span>
          <div className="flex items-center gap-1.5">
            {m.source !== "mock" && (
              <span className="text-[9px] uppercase tracking-[0.1em] font-semibold px-1.5 py-[1.5px] rounded bg-emerald-500/10 text-emerald-300/90 border border-emerald-500/25 inline-flex items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-emerald-400" />
                GRID
              </span>
            )}
            <Badge
              variant={m.status === "live" ? "destructive" : m.status === "upcoming" ? "default" : "secondary"}
            >
              {m.status === "live" ? "AO VIVO" : m.status === "upcoming" ? "Em breve" : "Finalizada"}
            </Badge>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><TeamBadge team={a} size="sm" /><span className="font-semibold">{a.name}</span><DataSourceTag team={a} size="xs" /></div>
          <span className="font-bold text-foreground">{m.result ? `${m.result.scoreA} - ${m.result.scoreB}` : "vs"}</span>
          <div className="flex items-center gap-2"><DataSourceTag team={b} size="xs" /><span className="font-semibold">{b.name}</span><TeamBadge team={b} size="sm" /></div>
        </div>
        <div className="text-xs text-muted-foreground mt-3">
          {new Date(m.startTime).toLocaleString("pt-BR")} • {m.boType}
        </div>
      </CardContent>
    </Card>
  );
  if (!isMock) return inner;
  return (
    <Link to="/partidas/$matchId" params={{ matchId: m.slug }}>
      {inner}
    </Link>
  );
}
