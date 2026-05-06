import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { TeamBadge } from "@/components/TeamBadge";
import { DataSourceTag } from "@/components/DataSourceTag";
import {
  getPlayer,
  getTeam,
  getPlayerMapStats,
  maps,
  notes as allNotes,
  type PlayerMapStat,
} from "@/data/mock";
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
  errorComponent: ({ error }) => (
    <div className="p-6 text-destructive">{error.message}</div>
  ),
  component: PlayerPage,
});

type Side = "all" | "ct" | "t";

function PlayerPage() {
  const p = Route.useLoaderData() as import("@/data/mock").Player;
  const team = getTeam(p.teamId)!;
  const [note, setNote] = useState(p.notes ?? "");
  const linked = allNotes.filter((n) => n.linkedPlayerId === p.id);
  const mapStats = getPlayerMapStats(p.id);

  return (
    <div className="max-w-6xl mx-auto">
      <Button variant="ghost" size="sm" asChild className="mb-3">
        <Link to="/jogadores">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Times & Jogadores
        </Link>
      </Button>

      <Card className="mb-5">
        <CardContent className="p-5 flex items-center gap-4">
          <TeamBadge team={team} size="lg" />
          <div className="flex-1">
            <div className="text-2xl font-bold tracking-tight flex items-center gap-2">
              {p.nick}
              <DataSourceTag team={team} size="xs" />
            </div>
            <div className="text-[13px] text-muted-foreground mt-0.5">
              {p.realName} • {p.role} • {team.name}
            </div>
          </div>
          <Badge className="text-sm px-3 py-1.5 bg-primary text-primary-foreground font-semibold">
            Rating {p.rating.toFixed(2)}
          </Badge>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-4 mb-5">
        <BigStat label="K/D" value={p.kd.toFixed(2)} />
        <BigStat label="HS%" value={`${p.hsPct}%`} />
        <BigStat label="ADR" value={String(p.adr)} />
        <BigStat label="Rating" value={p.rating.toFixed(2)} highlight />
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="h-10">
          <TabsTrigger value="all" className="text-[13px] font-medium px-4">
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="t" className="text-[13px] font-medium px-4">
            T Side
          </TabsTrigger>
          <TabsTrigger value="ct" className="text-[13px] font-medium px-4">
            CT Side
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Desempenho geral por mapa</CardTitle>
            </CardHeader>
            <CardContent>
              <MapList stats={mapStats} side="all" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="t" className="mt-4">
          <Card className="border-side-tr/40">
            <CardHeader>
              <CardTitle className="text-lg text-side-tr">T Side por mapa</CardTitle>
            </CardHeader>
            <CardContent>
              <MapList stats={mapStats} side="t" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ct" className="mt-4">
          <Card className="border-blue-300/40">
            <CardHeader>
              <CardTitle className="text-lg text-side-ct">CT Side por mapa</CardTitle>
            </CardHeader>
            <CardContent>
              <MapList stats={mapStats} side="ct" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Anotações da caster</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            placeholder="Suas observações sobre este jogador..."
          />
          <div className="flex justify-end mt-3">
            <Button onClick={() => toast.success("Anotação salva.")}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </CardContent>
      </Card>

      {linked.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notas relacionadas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {linked.map((n) => (
              <div key={n.id} className="border rounded-md p-4 bg-muted/30">
                <div className="font-bold">{n.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{n.content}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MapList({ stats, side }: { stats: PlayerMapStat[]; side: Side }) {
  const ratingFor = (s: PlayerMapStat) =>
    side === "ct" ? s.ctRating : side === "t" ? s.trRating : s.rating;

  const sorted = [...stats].sort((a, b) => ratingFor(b) - ratingFor(a));

  return (
    <Accordion type="single" collapsible className="w-full">
      {sorted.map((s) => {
        const map = maps.find((m) => m.id === s.mapId)!;
        const r = ratingFor(s);
        const tone =
          r >= 1.2 ? "text-green-600" : r >= 1.0 ? "text-foreground" : "text-destructive";
        return (
          <AccordionItem key={s.mapId} value={s.mapId} className="border-b last:border-0">
            <AccordionTrigger className="hover:no-underline py-3">
              <div className="flex items-center gap-4 w-full pr-4 text-sm">
                <span className="font-extrabold text-base w-28 text-left">{map.name}</span>
                <div className="flex-1 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className={`font-bold ${tone}`}>{r.toFixed(2)}</div>
                    <div className="text-[10px] uppercase text-muted-foreground">Rating</div>
                  </div>
                  <div>
                    <div className="font-bold">{s.kd.toFixed(2)}</div>
                    <div className="text-[10px] uppercase text-muted-foreground">K/D</div>
                  </div>
                  <div>
                    <div className="font-bold">{s.impact.toFixed(2)}</div>
                    <div className="text-[10px] uppercase text-muted-foreground">Impacto</div>
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-3 md:grid-cols-2 pt-1">
                <div className="rounded-md bg-muted/40 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-side-ct uppercase">CT</span>
                    <span className="font-mono text-sm">{s.ctRating.toFixed(2)}</span>
                  </div>
                  <Progress value={(s.ctRating / 1.6) * 100} className="h-2 bg-side-ct/15" indicatorClassName="bg-side-ct" />
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs font-bold text-side-tr uppercase">TR</span>
                    <span className="font-mono text-sm">{s.trRating.toFixed(2)}</span>
                  </div>
                  <Progress value={(s.trRating / 1.6) * 100} className="h-2 bg-side-tr/15" indicatorClassName="bg-side-tr" />
                </div>
                <div className="rounded-md bg-muted/40 p-3 grid grid-cols-2 gap-3 text-center">
                  <div>
                    <div className="text-2xl font-extrabold text-primary">{s.adr}</div>
                    <div className="text-[10px] uppercase text-muted-foreground font-semibold">ADR</div>
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold">{s.impact.toFixed(2)}</div>
                    <div className="text-[10px] uppercase text-muted-foreground font-semibold">Impact</div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

function BigStat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <Card className={highlight ? "border-primary/40" : ""}>
      <CardContent className="p-4 text-center">
        <div className={`text-2xl font-bold ${highlight ? "text-primary" : ""}`}>
          {value}
        </div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mt-1">
          {label}
        </div>
      </CardContent>
    </Card>
  );
}
