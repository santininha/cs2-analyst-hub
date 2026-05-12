import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/PageHeader";
import { TeamBadge } from "@/components/TeamBadge";
import { DataSourceTag } from "@/components/DataSourceTag";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { teams, getTeam, getTeamPlayers, getTeamMapStats, getTeamMapHistory, maps, activeMaps, matches } from "@/data/mock";
import { useHeadToHead } from "@/contexts/HeadToHeadContext";
import { Mic, TrendingUp, TrendingDown, Check, ChevronsUpDown, Loader2 } from "lucide-react";

export const Route = createFileRoute("/comparar")({
  head: () => ({
    meta: [
      { title: "Comparar Times — CS2 Analyst Hub" },
      { name: "description", content: "Comparação head-to-head, win rate, melhores e piores mapas, jogadores destaque e insights ao vivo." },
    ],
  }),
  component: Compare,
});

function Compare() {
  const [aId, setAId] = useState("furia");
  const [bId, setBId] = useState("navi");
  const a = getTeam(aId)!;
  const b = getTeam(bId)!;

  const aStats = getTeamMapStats(aId);
  const bStats = getTeamMapStats(bId);

  const sharedMaps = activeMaps().map((m) => {
    const sa = aStats.find((s) => s.mapId === m.id);
    const sb = bStats.find((s) => s.mapId === m.id);
    return { map: m, a: sa, b: sb };
  }).filter((x) => x.a || x.b);

  const aBest = [...aStats].sort((s1, s2) => s2.winRate - s1.winRate).slice(0, 2);
  const aWorst = [...aStats].sort((s1, s2) => s1.winRate - s2.winRate).slice(0, 2);
  const bBest = [...bStats].sort((s1, s2) => s2.winRate - s1.winRate).slice(0, 2);
  const bWorst = [...bStats].sort((s1, s2) => s1.winRate - s2.winRate).slice(0, 2);

  const h2hCtx = useHeadToHead();
  const h2h = useMemo(() => {
    const realCount = h2hCtx.countBetween(aId, bId);
    const realList = h2hCtx.matchesBetween(aId, bId);
    if (realCount > 0 || h2hCtx.data) {
      return { total: realCount, list: realList, source: "grid" as const };
    }
    const list = matches.filter(
      (m) =>
        (m.teamAId === aId && m.teamBId === bId) ||
        (m.teamAId === bId && m.teamBId === aId)
    );
    return { total: list.length, list, source: "mock" as const };
  }, [aId, bId, h2hCtx]);

  const aPlayers = getTeamPlayers(aId);
  const bPlayers = getTeamPlayers(bId);
  const aStar = [...aPlayers].sort((x, y) => y.rating - x.rating)[0];
  const bStar = [...bPlayers].sort((x, y) => y.rating - x.rating)[0];

  const insights = useMemo(() => {
    const out: string[] = [];
    const diff = a.winRate - b.winRate;
    if (Math.abs(diff) >= 5) {
      const fav = diff > 0 ? a : b;
      out.push(`${fav.name} chega como favorito — ${Math.abs(diff)}pp de vantagem em win rate geral.`);
    } else {
      out.push(`Confronto equilibrado: ${a.winRate}% × ${b.winRate}% de win rate.`);
    }

    // best map advantages
    sharedMaps.forEach(({ map, a: sa, b: sb }) => {
      if (sa && sb) {
        const d = sa.winRate - sb.winRate;
        if (Math.abs(d) >= 15) {
          const winner = d > 0 ? a : b;
          out.push(`${winner.name} tem vantagem clara no ${map.name} (${Math.abs(d)}pp acima).`);
        }
      }
    });

    if (aBest[0]) {
      const mp = maps.find(m => m.id === aBest[0].mapId)?.name;
      out.push(`Melhor mapa de ${a.name}: ${mp} (${aBest[0].winRate}%).`);
    }
    if (bBest[0]) {
      const mp = maps.find(m => m.id === bBest[0].mapId)?.name;
      out.push(`Melhor mapa de ${b.name}: ${mp} (${bBest[0].winRate}%).`);
    }
    if (aWorst[0]) {
      const mp = maps.find(m => m.id === aWorst[0].mapId)?.name;
      out.push(`Ponto fraco de ${a.name}: ${mp} (apenas ${aWorst[0].winRate}%).`);
    }
    if (bWorst[0]) {
      const mp = maps.find(m => m.id === bWorst[0].mapId)?.name;
      out.push(`Ponto fraco de ${b.name}: ${mp} (apenas ${bWorst[0].winRate}%).`);
    }

    if (aStar && bStar) {
      const top = aStar.rating >= bStar.rating ? aStar : bStar;
      const topTeam = aStar.rating >= bStar.rating ? a : b;
      out.push(`${topTeam.name} depende muito de ${top.nick} (rating ${top.rating.toFixed(2)}).`);
    }

    return out;
  }, [a, b, aBest, aWorst, bBest, bWorst, sharedMaps, aStar, bStar]);

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader title="Comparar Times" subtitle="Selecione dois times e veja a análise completa para sua transmissão." />

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <TeamPicker label="Time A" value={aId} onChange={setAId} exclude={bId} />
        <TeamPicker label="Time B" value={bId} onChange={setBId} exclude={aId} />
      </div>

      <Card className="mb-6 border-border/60">
        <CardContent className="p-5">
          <div className="grid grid-cols-3 items-center gap-4">
            <TeamHeader team={a} align="left" />
            <div className="text-center">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Head-to-head</div>
              <div className="text-3xl font-bold text-primary">{h2h.total}</div>
              <div className="text-[11px] text-muted-foreground">confrontos no histórico</div>
            </div>
            <TeamHeader team={b} align="right" />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 bg-primary-soft border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-primary text-[14px]">
            <Mic className="h-4 w-4" /> O que falar ao vivo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1.5 text-[13px]">
            {insights.map((i, idx) => (
              <li key={idx} className="flex gap-2 leading-relaxed">
                <span className="text-primary font-bold shrink-0">→</span>
                <span className="text-foreground/90">{i}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <SideStats team={a} best={aBest} worst={aWorst} />
        <SideStats team={b} best={bBest} worst={bWorst} />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Análise mapa a mapa</CardTitle>
          <p className="text-sm text-muted-foreground">Clique em um mapa para abrir a comparação detalhada.</p>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {sharedMaps.map(({ map, a: sa, b: sb }) => {
              const wrA = sa?.winRate ?? 0;
              const wrB = sb?.winRate ?? 0;
              const diff = wrA - wrB;
              const advTeam = diff === 0 ? null : diff > 0 ? a : b;
              return (
                <AccordionItem key={map.id} value={map.id} className="border-b last:border-0">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-4 w-full pr-4">
                      <span className="font-extrabold text-lg w-28 text-left">{map.name}</span>
                      <div className="flex-1 grid grid-cols-3 items-center gap-2 text-sm">
                        <div className="text-right">
                          <span className="text-xs text-muted-foreground mr-2">{a.tag}</span>
                          <Badge variant="outline" className="font-bold">{sa ? `${sa.winRate}%` : "—"}</Badge>
                        </div>
                        <div className="text-center">
                          {advTeam ? (
                            <Badge className="bg-primary text-primary-foreground font-bold">
                              {advTeam.tag} +{Math.abs(diff)}pp
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">equilibrado</span>
                          )}
                        </div>
                        <div className="text-left">
                          <Badge variant="outline" className="font-bold">{sb ? `${sb.winRate}%` : "—"}</Badge>
                          <span className="text-xs text-muted-foreground ml-2">{b.tag}</span>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-6 md:grid-cols-2 pt-2">
                      <MapDetail team={a} stat={sa} mapId={map.id} />
                      <MapDetail team={b} stat={sb} mapId={map.id} />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <PlayersList teamId={aId} />
        <PlayersList teamId={bId} />
      </div>
    </div>
  );
}

function TeamPicker({ label, value, onChange, exclude }: { label: string; value: string; onChange: (v: string) => void; exclude: string }) {
  const [open, setOpen] = useState(false);
  const selected = getTeam(value);
  const list = teams.filter((t) => t.id !== exclude);
  return (
    <div>
      <label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5 block">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="h-11 w-full justify-between font-medium text-[13px] bg-card"
          >
            {selected ? (
              <span className="flex items-center gap-2 min-w-0">
                <TeamBadge team={selected} size="sm" />
                <span className="truncate">{selected.name}</span>
                <span className="text-muted-foreground text-xs">#{selected.worldRank}</span>
              </span>
            ) : (
              <span className="text-muted-foreground">Buscar time…</span>
            )}
            <ChevronsUpDown className="h-4 w-4 opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]" align="start">
          <Command>
            <CommandInput placeholder="Digite o nome do time…" className="h-10 text-[13px]" />
            <CommandList>
              <CommandEmpty>Nenhum time encontrado.</CommandEmpty>
              <CommandGroup>
                {list.map((t) => (
                  <CommandItem
                    key={t.id}
                    value={`${t.name} ${t.tag}`}
                    onSelect={() => { onChange(t.id); setOpen(false); }}
                    className="text-[13px] gap-2"
                  >
                    <TeamBadge team={t} size="sm" />
                    <span className="flex-1 truncate">{t.name}</span>
                    <span className="text-xs text-muted-foreground">#{t.worldRank}</span>
                    <Check className={`h-4 w-4 ${value === t.id ? "opacity-100" : "opacity-0"}`} />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function TeamHeader({ team, align }: { team: any; align: "left" | "right" }) {
  return (
    <div className={`flex items-center gap-3 ${align === "right" ? "justify-end" : ""}`}>
      {align === "left" && <TeamBadge team={team} size="lg" />}
      <div className={align === "right" ? "text-right" : ""}>
        <div className={`text-xl font-bold flex items-center gap-2 ${align === "right" ? "justify-end" : ""}`}>
          {team.name}
          <DataSourceTag team={team} size="xs" />
        </div>
        <div className="text-xs text-muted-foreground">#{team.worldRank} mundo • {team.winRate}% win rate</div>
      </div>
      {align === "right" && <TeamBadge team={team} size="lg" />}
    </div>
  );
}

function MapBars({ ct, tr }: { ct: number; tr: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-[10px] w-6 text-side-ct font-bold">CT</span>
        <Progress value={ct} className="h-2 bg-side-ct/15" indicatorClassName="bg-side-ct" />
        <span className="text-xs font-mono w-9">{ct}%</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] w-6 text-side-tr font-bold">TR</span>
        <Progress value={tr} className="h-2 bg-side-tr/15" indicatorClassName="bg-side-tr" />
        <span className="text-xs font-mono w-9">{tr}%</span>
      </div>
    </div>
  );
}

function MapDetail({ team, stat, mapId }: { team: any; stat: any; mapId: string }) {
  if (!stat) {
    return (
      <div className="rounded-lg border bg-muted/40 p-4">
        <div className="flex items-center gap-2 mb-2">
          <TeamBadge team={team} size="sm" />
          <span className="font-bold">{team.name}</span>
        </div>
        <p className="text-sm text-muted-foreground">Sem dados recentes neste mapa.</p>
      </div>
    );
  }
  const history = getTeamMapHistory(team.id, mapId);
  const wins = history.filter((h) => h.result === "W").length;
  return (
    <div className="rounded-lg border bg-muted/40 p-4 space-y-4">
      <div className="flex items-center gap-2">
        <TeamBadge team={team} size="sm" />
        <span className="font-bold">{team.name}</span>
        <Badge variant="outline" className="ml-auto">{stat.played} jogos</Badge>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-md bg-background p-3">
          <div className="text-2xl font-extrabold text-primary">{stat.winRate}%</div>
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">Win rate</div>
        </div>
        <div className="rounded-md bg-background p-3">
          <div className="text-2xl font-extrabold text-side-ct">{stat.ctWinRate}%</div>
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">CT</div>
        </div>
        <div className="rounded-md bg-background p-3">
          <div className="text-2xl font-extrabold text-side-tr">{stat.trWinRate}%</div>
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">TR</div>
        </div>
      </div>
      <MapBars ct={stat.ctWinRate} tr={stat.trWinRate} />
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Últimos 5 jogos</span>
          <span className="text-xs font-semibold">{wins}V — {history.length - wins}D</span>
        </div>
        <div className="space-y-1">
          {history.map((h, i) => (
            <div key={i} className="flex items-center justify-between text-sm bg-background rounded px-2 py-1">
              <span className={`font-bold w-6 ${h.result === "W" ? "text-green-600" : "text-destructive"}`}>{h.result}</span>
              <span className="text-muted-foreground">vs {h.opponent}</span>
              <span className="font-mono">{h.score}</span>
              <span className="text-xs text-muted-foreground">{h.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SideStats({ team, best, worst }: any) {
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><TeamBadge team={team} size="sm" />{team.name}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1"><TrendingUp className="h-3 w-3 text-green-600" />Melhores mapas</div>
          {best.map((s: any) => (
            <div key={s.mapId} className="flex justify-between text-sm py-1">
              <span>{maps.find(m=>m.id===s.mapId)?.name}</span>
              <Badge variant="outline" className="text-green-700 border-green-300">{s.winRate}%</Badge>
            </div>
          ))}
        </div>
        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1"><TrendingDown className="h-3 w-3 text-destructive" />Piores mapas</div>
          {worst.map((s: any) => (
            <div key={s.mapId} className="flex justify-between text-sm py-1">
              <span>{maps.find(m=>m.id===s.mapId)?.name}</span>
              <Badge variant="outline" className="text-destructive border-destructive/40">{s.winRate}%</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PlayersList({ teamId }: { teamId: string }) {
  const team = getTeam(teamId)!;
  const players = getTeamPlayers(teamId);
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Destaques de {team.name}</CardTitle></CardHeader>
      <CardContent className="space-y-1">
        {players.map((p) => (
          <Link key={p.id} to="/jogadores/$playerId" params={{ playerId: p.id }}
            className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
            <div>
              <div className="font-semibold">{p.nick}</div>
              <div className="text-xs text-muted-foreground">{p.role}</div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="border-primary text-primary">{p.rating.toFixed(2)}</Badge>
              <Badge variant="secondary">K/D {p.kd.toFixed(2)}</Badge>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
