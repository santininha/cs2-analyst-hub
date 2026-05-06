import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/PageHeader";
import { TeamBadge } from "@/components/TeamBadge";
import { teams, getTeam, getTeamPlayers, getTeamMapStats, maps, matches } from "@/data/mock";
import { Mic, TrendingUp, TrendingDown } from "lucide-react";

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

  const sharedMaps = maps.map((m) => {
    const sa = aStats.find((s) => s.mapId === m.id);
    const sb = bStats.find((s) => s.mapId === m.id);
    return { map: m, a: sa, b: sb };
  }).filter((x) => x.a || x.b);

  const aBest = [...aStats].sort((s1, s2) => s2.winRate - s1.winRate).slice(0, 2);
  const aWorst = [...aStats].sort((s1, s2) => s1.winRate - s2.winRate).slice(0, 2);
  const bBest = [...bStats].sort((s1, s2) => s2.winRate - s1.winRate).slice(0, 2);
  const bWorst = [...bStats].sort((s1, s2) => s1.winRate - s2.winRate).slice(0, 2);

  const h2h = useMemo(() => {
    const list = matches.filter(
      (m) =>
        (m.teamAId === aId && m.teamBId === bId) ||
        (m.teamAId === bId && m.teamBId === aId)
    );
    return { total: list.length, list };
  }, [aId, bId]);

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

      <Card className="mb-6 border-primary/30">
        <CardContent className="p-6">
          <div className="grid grid-cols-3 items-center gap-4">
            <TeamHeader team={a} align="left" />
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Head-to-head</div>
              <div className="text-4xl font-black text-primary">{h2h.total}</div>
              <div className="text-xs text-muted-foreground">confrontos no histórico</div>
            </div>
            <TeamHeader team={b} align="right" />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 bg-primary text-primary-foreground border-primary">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-primary-foreground">
            <Mic className="h-5 w-5" /> O que falar ao vivo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {insights.map((i, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="font-bold">→</span>
                <span>{i}</span>
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
        <CardHeader><CardTitle>Desempenho CT/TR por mapa</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {sharedMaps.map(({ map, a: sa, b: sb }) => (
            <div key={map.id} className="grid grid-cols-7 gap-3 items-center text-sm">
              <div className="font-semibold col-span-1">{map.name}</div>
              <div className="col-span-3">
                <div className="text-xs text-muted-foreground mb-1">{a.tag}</div>
                {sa ? <MapBars ct={sa.ctWinRate} tr={sa.trWinRate} /> : <span className="text-xs text-muted-foreground">sem dados</span>}
              </div>
              <div className="col-span-3">
                <div className="text-xs text-muted-foreground mb-1">{b.tag}</div>
                {sb ? <MapBars ct={sb.ctWinRate} tr={sb.trWinRate} /> : <span className="text-xs text-muted-foreground">sem dados</span>}
              </div>
            </div>
          ))}
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
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground mb-1 block">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
        <SelectContent>
          {teams.filter((t) => t.id !== exclude).map((t) => (
            <SelectItem key={t.id} value={t.id}>{t.name} ({t.tag}) — #{t.worldRank}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function TeamHeader({ team, align }: { team: any; align: "left" | "right" }) {
  return (
    <div className={`flex items-center gap-3 ${align === "right" ? "justify-end" : ""}`}>
      {align === "left" && <TeamBadge team={team} size="lg" />}
      <div className={align === "right" ? "text-right" : ""}>
        <div className="text-xl font-bold">{team.name}</div>
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
        <span className="text-[10px] w-6 text-blue-600 font-bold">CT</span>
        <Progress value={ct} className="h-2" />
        <span className="text-xs font-mono w-9">{ct}%</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] w-6 text-orange-600 font-bold">TR</span>
        <Progress value={tr} className="h-2" />
        <span className="text-xs font-mono w-9">{tr}%</span>
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
