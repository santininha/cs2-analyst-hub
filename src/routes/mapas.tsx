import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { maps, teams, getTeam, getPlayer, type Team, type CSMap } from "@/data/mock";
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

// Top 20 mundial — comparativo restrito por solicitação do caster.
const TOP20 = teams
  .filter((t) => t.worldRank <= 20)
  .sort((a, b) => a.worldRank - b.worldRank);

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Estimativa determinística de desempenho time-em-mapa enquanto a integração
 * de stats reais (HLTV/GRID por mapa) não está disponível. Baseada no winRate
 * do time + variação por mapa, sempre estável entre renders.
 */
function teamMapStats(team: Team, map: CSMap) {
  const v = (hash(team.id + ":" + map.id) % 13) - 6; // -6..+6
  const overall = Math.max(35, Math.min(85, team.winRate + v));
  const ctBias = ((hash("ct" + team.id + map.id) % 9) - 4); // -4..+4
  const ct = Math.max(30, Math.min(80, map.ctWinRate + Math.round(v / 2) + ctBias));
  const tr = Math.max(30, Math.min(80, map.trWinRate + Math.round(v / 2) - ctBias));
  return { overall, ct, tr };
}

function MapsPage() {
  const [windowId, setWindowId] = useState<AnalysisWindowId>(DEFAULT_ANALYSIS_WINDOW.id);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const win = ANALYSIS_WINDOWS[windowId];

  const sorted = useMemo(() => maps.filter((m) => isActiveMap(m.id)), []);
  const compareTeams = useMemo(
    () => TOP20.filter((t) => selectedTeams.includes(t.id)),
    [selectedTeams],
  );

  const toggleTeam = (id: string) =>
    setSelectedTeams((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

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

      {/* Comparativo por times — Top 20 mundial */}
      <Card className="mb-4 border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between gap-2 flex-wrap">
            <span className="flex items-center gap-2">
              Comparativo por time
              <Badge variant="outline" className="text-[9px] uppercase tracking-[0.1em]">
                Top 20 mundial
              </Badge>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground">
                {selectedTeams.length} selecionado{selectedTeams.length === 1 ? "" : "s"}
              </span>
              {selectedTeams.length > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 text-[11px]"
                  onClick={() => setSelectedTeams([])}
                >
                  Limpar
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5">
            {TOP20.map((t) => {
              const on = selectedTeams.includes(t.id);
              return (
                <button
                  key={t.id}
                  onClick={() => toggleTeam(t.id)}
                  className={`text-[11px] px-2 py-1 rounded-md border transition-colors ${
                    on
                      ? "bg-primary/15 border-primary/50 text-primary"
                      : "bg-muted/30 border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  <span className="font-mono opacity-60 mr-1">#{t.worldRank}</span>
                  {t.tag}
                </button>
              );
            })}
          </div>
          {compareTeams.length === 0 && (
            <p className="text-[11px] text-muted-foreground mt-2">
              Selecione um ou mais times para comparar desempenho por mapa.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="text-[11px] uppercase tracking-[0.13em] text-muted-foreground font-semibold mb-2">
        Recorte: {win.label}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sorted.map((m) => (
          <Card key={m.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2 flex-wrap">
                <span>{m.name}</span>
                <Badge variant="outline">Pick rate {m.pickRate}%</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-side-ct font-bold w-6">CT</span>
                  <Progress value={m.ctWinRate} className="h-2 bg-side-ct/15" indicatorClassName="bg-side-ct" />
                  <span className="font-mono w-9">{m.ctWinRate}%</span>
                </div>
                <div className="flex items-center gap-2 text-xs mt-1">
                  <span className="text-side-tr font-bold w-6">TR</span>
                  <Progress value={m.trWinRate} className="h-2 bg-side-tr/15" indicatorClassName="bg-side-tr" />
                  <span className="font-mono w-9">{m.trWinRate}%</span>
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  Diferença: {m.ctWinRate - m.trWinRate > 0 ? "+" : ""}
                  {m.ctWinRate - m.trWinRate} para o CT
                </div>
              </div>

              {compareTeams.length > 0 && (
                <div className="rounded-md border border-border/60 bg-muted/20 p-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10.5px] uppercase tracking-[0.1em] text-muted-foreground font-semibold">
                      Comparativo de times
                    </span>
                    <Badge variant="outline" className="text-[8.5px] uppercase tracking-[0.1em]">
                      estimativa
                    </Badge>
                  </div>
                  <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 gap-y-1 text-[11px]">
                    <span className="text-muted-foreground">Time</span>
                    <span className="text-side-ct font-semibold text-right">CT%</span>
                    <span className="text-side-tr font-semibold text-right">TR%</span>
                    <span className="text-muted-foreground text-right">Geral</span>
                    {compareTeams.map((t) => {
                      const s = teamMapStats(t, m);
                      return (
                        <div key={t.id} className="contents">
                          <span className="truncate">
                            <span className="font-mono opacity-60 mr-1">#{t.worldRank}</span>
                            {t.name}
                          </span>
                          <span className="font-mono text-right tabular-nums">{s.ct}%</span>
                          <span className="font-mono text-right tabular-nums">{s.tr}%</span>
                          <span className="font-mono text-right tabular-nums">{s.overall}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

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
        ))}
      </div>
    </div>
  );
}
