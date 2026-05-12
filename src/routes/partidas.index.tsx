import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from "@/components/PageHeader";
import { TeamBadge } from "@/components/TeamBadge";
import { DataSourceTag } from "@/components/DataSourceTag";
import { useMatches } from "@/contexts/MatchesContext";
import type { MatchEnriched, MatchQuality } from "@/lib/matchTypes";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/partidas/")({
  head: () => ({
    meta: [
      { title: "Partidas — CS2 Analyst Hub" },
      { name: "description", content: "Hoje, próximas, ao vivo e histórico — partidas reais e prévias manuais." },
    ],
  }),
  component: MatchesList,
});

function MatchesList() {
  const { today, upcoming, live, history, loading, source, gridCount, manualCount } = useMatches();
  const [tab, setTab] = useState<string>("hoje");

  // "Hoje" inclui live + upcoming do dia. "Próximas" = upcoming futuras.
  const futureUpcoming = upcoming.filter(
    (m) => !today.some((t) => t.id === m.id),
  );

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Partidas"
        subtitle="Apenas partidas relevantes para análise — hoje em diante."
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
            <span>{gridCount} GRID real · {manualCount} prévia manual</span>
            <span>·</span>
            <span>{live.length} ao vivo · {today.length} hoje · {futureUpcoming.length} próximas</span>
          </>
        )}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="hoje">Hoje ({today.length})</TabsTrigger>
          <TabsTrigger value="proximas">Próximas ({futureUpcoming.length})</TabsTrigger>
          <TabsTrigger value="live">Ao vivo ({live.length})</TabsTrigger>
          <TabsTrigger value="historico">Tier S últimos 3 meses ({history.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="hoje" className="mt-4">
          <MatchGrid items={today} loading={loading} emptyText="Nenhuma partida relevante encontrada para hoje." />
        </TabsContent>
        <TabsContent value="proximas" className="mt-4">
          <MatchGrid items={futureUpcoming} loading={loading} emptyText="Nenhuma partida relevante encontrada para os próximos dias." />
        </TabsContent>
        <TabsContent value="live" className="mt-4">
          <MatchGrid items={live} loading={loading} emptyText="Nenhuma partida ao vivo no momento." />
        </TabsContent>
        <TabsContent value="historico" className="mt-4">
          <MatchGrid items={history} loading={loading} emptyText="Sem partidas Tier S concluídas nos últimos 3 meses." />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MatchGrid({ items, loading, emptyText }: { items: MatchEnriched[]; loading: boolean; emptyText: string }) {
  if (loading && items.length === 0) {
    return <div className="text-sm text-muted-foreground italic">Carregando…</div>;
  }
  if (items.length === 0) {
    return <div className="text-sm text-muted-foreground italic">{emptyText}</div>;
  }
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((m) => <MatchCard key={m.id} m={m} />)}
    </div>
  );
}

function QualityBadge({ quality }: { quality: MatchQuality }) {
  if (quality === "grid-real") {
    return (
      <span className="text-[9px] uppercase tracking-[0.1em] font-semibold px-1.5 py-[1.5px] rounded bg-emerald-500/10 text-emerald-300/90 border border-emerald-500/25 inline-flex items-center gap-1">
        <span className="h-1 w-1 rounded-full bg-emerald-400" />
        GRID real
      </span>
    );
  }
  if (quality === "manual") {
    return (
      <span className="text-[9px] uppercase tracking-[0.1em] font-semibold px-1.5 py-[1.5px] rounded bg-amber-500/10 text-amber-300/90 border border-amber-500/30">
        Prévia manual
      </span>
    );
  }
  if (quality === "mock-fallback") {
    return (
      <span className="text-[9px] uppercase tracking-[0.1em] font-semibold px-1.5 py-[1.5px] rounded bg-muted text-muted-foreground border border-border/60">
        Mock fallback
      </span>
    );
  }
  return null;
}

function MatchCard({ m }: { m: MatchEnriched }) {
  const a = m.teamA;
  const b = m.teamB;
  const isMock = m.source === "mock";
  const inner = (
    <Card className="hover:shadow-[var(--shadow-elevated)] transition cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
          <span className="text-xs font-semibold text-muted-foreground truncate">{m.tournament}</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <QualityBadge quality={m.quality} />
            <Badge
              variant={m.status === "live" ? "destructive" : m.status === "upcoming" ? "default" : "secondary"}
            >
              {m.status === "live" ? "AO VIVO" : m.status === "upcoming" ? "Em breve" : "Finalizada"}
            </Badge>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0"><TeamBadge team={a} size="sm" /><span className="font-semibold truncate">{a.name}</span><DataSourceTag team={a} size="xs" /></div>
          <span className="font-bold text-foreground px-2">{m.result ? `${m.result.scoreA} - ${m.result.scoreB}` : "vs"}</span>
          <div className="flex items-center gap-2 min-w-0"><DataSourceTag team={b} size="xs" /><span className="font-semibold truncate">{b.name}</span><TeamBadge team={b} size="sm" /></div>
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
