import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/PageHeader";
import { TeamBadge } from "@/components/TeamBadge";
import { getPlayer, getTeam, notes as allNotes } from "@/data/mock";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/jogadores/$playerId")({
  loader: ({ params }) => {
    const p = getPlayer(params.playerId);
    if (!p) throw notFound();
    return p;
  },
  head: ({ params }) => {
    const p = getPlayer(params.playerId);
    return { meta: [{ title: `${p?.nick ?? "Jogador"} — CS2 Analyst Hub` }] };
  },
  notFoundComponent: () => <div className="p-6">Jogador não encontrado.</div>,
  errorComponent: ({ error }) => <div className="p-6 text-destructive">{error.message}</div>,
  component: PlayerPage,
});

function PlayerPage() {
  const p = Route.useLoaderData() as import("@/data/mock").Player;
  const team = getTeam(p.teamId)!;
  const [note, setNote] = useState(p.notes ?? "");
  const linked = allNotes.filter((n) => n.linkedPlayerId === p.id);

  return (
    <div className="max-w-5xl mx-auto">
      <Button variant="ghost" size="sm" asChild className="mb-3"><Link to="/jogadores"><ArrowLeft className="h-4 w-4 mr-1" />Times & Jogadores</Link></Button>

      <Card className="mb-6">
        <CardContent className="p-6 flex items-center gap-4">
          <TeamBadge team={team} size="lg" />
          <div className="flex-1">
            <div className="text-3xl font-bold">{p.nick}</div>
            <div className="text-sm text-muted-foreground">{p.realName} • {p.role} • {team.name}</div>
          </div>
          <Badge className="text-lg px-3 py-1" variant="outline">Rating {p.rating.toFixed(2)}</Badge>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <BigStat label="K/D" value={p.kd.toFixed(2)} />
        <BigStat label="HS%" value={`${p.hsPct}%`} />
        <BigStat label="ADR" value={String(p.adr)} />
        <BigStat label="Rating" value={p.rating.toFixed(2)} highlight />
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Desempenho por lado</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-blue-600 font-bold">CT</span><span>{p.ctRating.toFixed(2)}</span></div>
              <Progress value={(p.ctRating / 1.5) * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-orange-600 font-bold">TR</span><span>{p.trRating.toFixed(2)}</span></div>
              <Progress value={(p.trRating / 1.5) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Mapas</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div>
              <div className="text-xs font-semibold text-muted-foreground">Fortes</div>
              <div className="flex gap-1 flex-wrap mt-1">{p.strongMaps.map((m) => <Badge key={m} className="bg-green-100 text-green-800 hover:bg-green-100">{m}</Badge>)}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-muted-foreground">Fracos</div>
              <div className="flex gap-1 flex-wrap mt-1">{p.weakMaps.length ? p.weakMaps.map((m) => <Badge key={m} variant="outline" className="border-destructive text-destructive">{m}</Badge>) : <span className="text-xs text-muted-foreground">— sem fraquezas notáveis</span>}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base">Anotações da caster</CardTitle></CardHeader>
        <CardContent>
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} placeholder="Suas observações sobre este jogador..." />
          <div className="flex justify-end mt-3">
            <Button onClick={() => toast.success("Anotação salva.")}><Save className="h-4 w-4 mr-2" />Salvar</Button>
          </div>
        </CardContent>
      </Card>

      {linked.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Notas relacionadas</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {linked.map((n) => (
              <div key={n.id} className="border rounded p-3">
                <div className="font-semibold text-sm">{n.title}</div>
                <div className="text-sm text-muted-foreground">{n.content}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function BigStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <Card className={highlight ? "border-primary" : ""}>
      <CardContent className="p-4 text-center">
        <div className={`text-3xl font-bold ${highlight ? "text-primary" : ""}`}>{value}</div>
        <div className="text-xs text-muted-foreground uppercase">{label}</div>
      </CardContent>
    </Card>
  );
}
