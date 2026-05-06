import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { TeamBadge } from "@/components/TeamBadge";
import { getMatch, getTeam } from "@/data/mock";
import { ArrowLeft, Save, Tag } from "lucide-react";
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
  const m = Route.useLoaderData();
  const a = getTeam(m.teamAId)!;
  const b = getTeam(m.teamBId)!;
  const [pre, setPre] = useState(m.preNotes ?? "");
  const [post, setPost] = useState(m.postNotes ?? "");
  const [tech, setTech] = useState(m.techNotes ?? "");
  const [keywords, setKeywords] = useState((m.keywords ?? []).join(", "));

  const save = () => toast.success("Roteiro salvo (apenas no protótipo).");

  return (
    <div className="max-w-5xl mx-auto">
      <Button variant="ghost" size="sm" asChild className="mb-3"><Link to="/partidas"><ArrowLeft className="h-4 w-4 mr-1" />Partidas</Link></Button>
      <PageHeader title={`${a.name} vs ${b.name}`} subtitle={`${m.event} • ${new Date(m.date).toLocaleString("pt-BR")} • ${m.format}`} />

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-3 items-center">
            <div className="flex items-center gap-3"><TeamBadge team={a} size="lg" /><div><div className="font-bold text-lg">{a.name}</div><div className="text-xs text-muted-foreground">#{a.worldRank}</div></div></div>
            <div className="text-center text-3xl font-black text-primary">{m.result ? `${m.result.scoreA} - ${m.result.scoreB}` : "vs"}</div>
            <div className="flex items-center gap-3 justify-end"><div className="text-right"><div className="font-bold text-lg">{b.name}</div><div className="text-xs text-muted-foreground">#{b.worldRank}</div></div><TeamBadge team={b} size="lg" /></div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base">Mapas {m.status === "finished" ? "jogados" : "previstos"}</CardTitle></CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-3">
          {m.maps.map((mp, i) => (
            <div key={i} className="border rounded-md p-3 flex justify-between items-center">
              <span className="font-semibold">{mp.name}</span>
              {mp.scoreA !== undefined && <Badge variant="outline">{mp.scoreA}-{mp.scoreB}</Badge>}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Notas técnicas</CardTitle></CardHeader>
          <CardContent>
            <Textarea value={tech} onChange={(e) => setTech(e.target.value)} rows={5} placeholder="Anotações técnicas sobre a partida..." />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Tag className="h-4 w-4 text-primary" />Palavras-chave para a transmissão</CardTitle></CardHeader>
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
