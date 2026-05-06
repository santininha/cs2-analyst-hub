import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { TeamBadge } from "@/components/TeamBadge";
import {
  getMatch,
  getTeam,
  getTeamPlayers,
  getTeamMapStats,
  maps,
} from "@/data/mock";
import { ArrowLeft, Save, Tag, Mic, Flame, Star, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/partidas/$matchId")({
  head: ({ params }) => {
    const m = getMatch(params.matchId);
    const title = m ? `${getTeam(m.teamAId)?.name} vs ${getTeam(m.teamBId)?.name}` : "Partida";
    return { meta: [{ title: `${title} — CS2 Analyst Hub` }] };
  },
  loader: ({ params }) => {
    const m = getMatch(params.matchId);
    if (!m) throw notFound();
    return m;
  },
  notFoundComponent: () => <div className="p-6">Partida não encontrada. <Link to="/partidas" className="text-primary underline">Voltar</Link></div>,
  errorComponent: ({ error }) => <div className="p-6 text-destructive">{error.message}</div>,
  component: MatchPage,
});

function MatchPage() {
  const m = Route.useLoaderData() as import("@/data/mock").Match;
  const a = getTeam(m.teamAId)!;
  const b = getTeam(m.teamBId)!;
  const aPlayers = getTeamPlayers(a.id);
  const bPlayers = getTeamPlayers(b.id);
  const aStats = getTeamMapStats(a.id);
  const bStats = getTeamMapStats(b.id);

  const [pre, setPre] = useState(m.preNotes ?? "");
  const [post, setPost] = useState(m.postNotes ?? "");
  const [tech, setTech] = useState(m.techNotes ?? "");
  const [keywords, setKeywords] = useState((m.keywords ?? []).join(", "));

  const aStar = useMemo(() => [...aPlayers].sort((x, y) => y.rating - x.rating)[0], [aPlayers]);
  const bStar = useMemo(() => [...bPlayers].sort((x, y) => y.rating - x.rating)[0], [bPlayers]);

  const summary = useMemo(() => {
    const favorite = a.winRate >= b.winRate ? a : b;
    const allStar = aStar && bStar ? (aStar.rating >= bStar.rating ? aStar : bStar) : aStar ?? bStar;

    const aBest = [...aStats].sort((x, y) => y.winRate - x.winRate)[0];
    const bBest = [...bStats].sort((x, y) => y.winRate - x.winRate)[0];
    const aWorst = [...aStats].sort((x, y) => x.winRate - y.winRate)[0];
    const bWorst = [...bStats].sort((x, y) => x.winRate - y.winRate)[0];

    const aBestMap = aBest ? maps.find((mp) => mp.id === aBest.mapId)?.name : null;
    const bBestMap = bBest ? maps.find((mp) => mp.id === bBest.mapId)?.name : null;
    const aWorstMap = aWorst ? maps.find((mp) => mp.id === aWorst.mapId)?.name : null;
    const bWorstMap = bWorst ? maps.find((mp) => mp.id === bWorst.mapId)?.name : null;

    return { favorite, allStar, aBest, bBest, aWorst, bWorst, aBestMap, bBestMap, aWorstMap, bWorstMap };
  }, [a, b, aStar, bStar, aStats, bStats]);

  const save = () => toast.success("Roteiro salvo (apenas no protótipo).");

  return (
    <div className="max-w-6xl mx-auto">
      <Button variant="ghost" size="sm" asChild className="mb-3"><Link to="/partidas"><ArrowLeft className="h-4 w-4 mr-1" />Partidas</Link></Button>
      <PageHeader title={`${a.name} vs ${b.name}`} subtitle={`${m.event} • ${new Date(m.date).toLocaleString("pt-BR")} • ${m.format}`} />

      {/* Confronto */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-3 items-center">
            <div className="flex items-center gap-3"><TeamBadge team={a} size="lg" /><div><div className="font-bold text-lg">{a.name}</div><div className="text-xs text-muted-foreground">#{a.worldRank} • {a.winRate}%</div></div></div>
            <div className="text-center text-3xl font-black text-primary">{m.result ? `${m.result.scoreA} - ${m.result.scoreB}` : "vs"}</div>
            <div className="flex items-center gap-3 justify-end"><div className="text-right"><div className="font-bold text-lg">{b.name}</div><div className="text-xs text-muted-foreground">#{b.worldRank} • {b.winRate}%</div></div><TeamBadge team={b} size="lg" /></div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo rápido para caster */}
      <Card className="mb-6 bg-primary text-primary-foreground border-primary">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-primary-foreground">
            <Mic className="h-5 w-5" /> Resumo rápido para caster
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <SummaryItem label="Time favorito" value={`${summary.favorite.name} (${summary.favorite.winRate}% WR)`} />
            <SummaryItem label="Jogador destaque" value={summary.allStar ? `${summary.allStar.nick} — ${summary.allStar.rating.toFixed(2)}` : "—"} />
            <SummaryItem label={`Mapa forte de ${a.tag}`} value={summary.aBestMap ? `${summary.aBestMap} (${summary.aBest!.winRate}%)` : "—"} />
            <SummaryItem label={`Mapa forte de ${b.tag}`} value={summary.bBestMap ? `${summary.bBestMap} (${summary.bBest!.winRate}%)` : "—"} />
            <SummaryItem label={`Ponto fraco de ${a.tag}`} value={summary.aWorstMap ? `${summary.aWorstMap} (${summary.aWorst!.winRate}%)` : "—"} />
            <SummaryItem label={`Ponto fraco de ${b.tag}`} value={summary.bWorstMap ? `${summary.bWorstMap} (${summary.bWorst!.winRate}%)` : "—"} />
          </div>
        </CardContent>
      </Card>

      {/* Mapas */}
      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base">Mapas {m.status === "finished" ? "jogados" : "previstos"}</CardTitle></CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-3">
          {m.maps.map((mp, i) => (
            <div key={i} className="border rounded-md p-3 flex justify-between items-center bg-muted/30">
              <span className="font-semibold">{mp.name}</span>
              {mp.scoreA !== undefined && <Badge variant="outline">{mp.scoreA}-{mp.scoreB}</Badge>}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Jogadores dos dois times */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <RosterCard team={a} starId={aStar?.id} />
        <RosterCard team={b} starId={bStar?.id} />
      </div>

      {/* Roteiros */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Notas técnicas</CardTitle></CardHeader>
          <CardContent>
            <Textarea value={tech} onChange={(e) => setTech(e.target.value)} rows={5} placeholder="Anotações técnicas sobre a partida..." />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Tag className="h-4 w-4 text-primary" />Palavras-chave</CardTitle></CardHeader>
          <CardContent>
            <Input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="separadas por vírgula" />
            <div className="flex flex-wrap gap-1 mt-3">
              {keywords.split(",").map(k => k.trim()).filter(Boolean).map((k, i) => (
                <Badge key={i} variant="secondary">{k}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Roteiro pré-jogo</CardTitle></CardHeader>
          <CardContent><Textarea value={pre} onChange={(e) => setPre(e.target.value)} rows={6} placeholder="O que abordar antes do jogo começar..." /></CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Roteiro pós-jogo</CardTitle></CardHeader>
          <CardContent><Textarea value={post} onChange={(e) => setPost(e.target.value)} rows={6} placeholder="Análise pós-jogo, veredito..." /></CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={save} size="lg"><Save className="h-4 w-4 mr-2" />Salvar roteiro</Button>
      </div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-primary-foreground/10 rounded-md p-3">
      <div className="text-[11px] uppercase tracking-wide opacity-80">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}

function RosterCard({ team, starId }: { team: import("@/data/mock").Team; starId?: string }) {
  const players = [...getTeamPlayers(team.id)].sort((a, b) => b.rating - a.rating);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <TeamBadge team={team} size="sm" /> Elenco {team.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {players.map((p) => {
          const isStar = p.id === starId;
          return (
            <Link
              key={p.id}
              to="/jogadores/$playerId"
              params={{ playerId: p.id }}
              className={`flex items-center justify-between p-2 rounded-md transition border ${
                isStar ? "border-primary bg-accent" : "border-transparent hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-2">
                {isStar ? <Star className="h-4 w-4 text-primary fill-primary" /> : <Flame className="h-3.5 w-3.5 text-muted-foreground" />}
                <div>
                  <div className="font-semibold text-sm">{p.nick}</div>
                  <div className="text-[11px] text-muted-foreground">{p.role}</div>
                </div>
              </div>
              <div className="flex gap-1 items-center">
                {p.ctRating > p.trRating ? (
                  <Badge variant="outline" className="text-[10px]"><TrendingUp className="h-2.5 w-2.5 mr-0.5" />CT</Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px]"><TrendingDown className="h-2.5 w-2.5 mr-0.5" />TR</Badge>
                )}
                <Badge variant="outline" className="border-primary text-primary">{p.rating.toFixed(2)}</Badge>
              </div>
            </Link>
          );
        })}
        {players.length === 0 && <div className="text-sm text-muted-foreground py-3">Elenco não cadastrado.</div>}
      </CardContent>
    </Card>
  );
}
