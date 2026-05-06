import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/PageHeader";
import { maps, getTeam, getPlayer } from "@/data/mock";
import { MapPoolStatusCard } from "@/components/MapPoolStatusCard";
import { AnalysisWindowPicker } from "@/components/AnalysisWindowPicker";
import {
  ANALYSIS_WINDOWS,
  DEFAULT_ANALYSIS_WINDOW,
  isActiveMap,
  type AnalysisWindowId,
} from "@/lib/mapPool";

export const Route = createFileRoute("/mapas")({
  head: () => ({ meta: [{ title: "Mapas — CS2 Analyst Hub" }] }),
  component: MapsPage,
});

function MapsPage() {
  const [windowId, setWindowId] = useState<AnalysisWindowId>(DEFAULT_ANALYSIS_WINDOW.id);
  const win = ANALYSIS_WINDOWS[windowId];

  // Show active maps first, historical at the bottom (clearly tagged).
  const sorted = [...maps].sort((a, b) => Number(b.active !== false) - Number(a.active !== false));

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Mapas competitivos"
        subtitle="Estatísticas gerais, times e jogadores em destaque por mapa do Active Duty."
      />

      <div className="grid gap-3 md:grid-cols-[1fr_auto] mb-4 items-start">
        <MapPoolStatusCard />
        <AnalysisWindowPicker value={windowId} onChange={setWindowId} />
      </div>

      <div className="text-[11px] uppercase tracking-[0.13em] text-muted-foreground font-semibold mb-2">
        Recorte: {win.label}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sorted.map((m) => {
          const active = isActiveMap(m.id);
          return (
            <Card key={m.id} className={active ? "" : "opacity-70 border-amber-500/30"}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="flex items-center gap-2">
                    {m.name}
                    {!active && (
                      <Badge
                        variant="outline"
                        className="text-[9px] uppercase tracking-[0.1em] border-amber-500/40 text-amber-300"
                      >
                        fora da rotação
                      </Badge>
                    )}
                  </span>
                  {active ? (
                    <Badge variant="outline">Pick rate {m.pickRate}%</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[10px]">histórico</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-side-ct font-bold w-6">CT</span>
                    <Progress value={m.ctWinRate} className="h-2" />
                    <span className="font-mono w-9">{m.ctWinRate}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs mt-1">
                    <span className="text-side-tr font-bold w-6">TR</span>
                    <Progress value={m.trWinRate} className="h-2" />
                    <span className="font-mono w-9">{m.trWinRate}%</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    Diferença: {m.ctWinRate - m.trWinRate > 0 ? "+" : ""}
                    {m.ctWinRate - m.trWinRate} para o CT
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-muted-foreground mb-1">Times fortes</div>
                  <div className="flex flex-wrap gap-1">
                    {m.topTeams.map((id) => {
                      const t = getTeam(id);
                      return t && <Badge key={id} variant="secondary">{t.name}</Badge>;
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-muted-foreground mb-1">Jogadores destaque</div>
                  <div className="flex flex-wrap gap-1">
                    {m.topPlayers.map((id) => {
                      const p = getPlayer(id);
                      return (
                        p && (
                          <Badge
                            key={id}
                            className="bg-primary/10 text-primary hover:bg-primary/10 border border-primary/30"
                          >
                            {p.nick}
                          </Badge>
                        )
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
