import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/PageHeader";
import { maps, getTeam, getPlayer } from "@/data/mock";

export const Route = createFileRoute("/mapas")({
  head: () => ({ meta: [{ title: "Mapas — CS2 Analyst Hub" }] }),
  component: MapsPage,
});

function MapsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Mapas competitivos" subtitle="Estatísticas gerais, times e jogadores em destaque por mapa." />
      <div className="grid gap-4 md:grid-cols-2">
        {maps.map((m) => (
          <Card key={m.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{m.name}</span>
                <Badge variant="outline">Pick rate {m.pickRate}%</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex items-center gap-2 text-xs"><span className="text-blue-600 font-bold w-6">CT</span><Progress value={m.ctWinRate} className="h-2" /><span className="font-mono w-9">{m.ctWinRate}%</span></div>
                <div className="flex items-center gap-2 text-xs mt-1"><span className="text-orange-600 font-bold w-6">TR</span><Progress value={m.trWinRate} className="h-2" /><span className="font-mono w-9">{m.trWinRate}%</span></div>
                <div className="text-[10px] text-muted-foreground mt-1">Diferença: {m.ctWinRate - m.trWinRate > 0 ? "+" : ""}{m.ctWinRate - m.trWinRate} para o CT</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-1">Times fortes</div>
                <div className="flex flex-wrap gap-1">{m.topTeams.map((id) => { const t = getTeam(id); return t && <Badge key={id} variant="secondary">{t.name}</Badge>; })}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-1">Jogadores destaque</div>
                <div className="flex flex-wrap gap-1">{m.topPlayers.map((id) => { const p = getPlayer(id); return p && <Badge key={id} className="bg-primary/10 text-primary hover:bg-primary/10 border border-primary/30">{p.nick}</Badge>; })}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
