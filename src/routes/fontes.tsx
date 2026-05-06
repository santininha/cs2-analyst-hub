import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { dataSources } from "@/data/mock";
import { useTeams } from "@/contexts/TeamsContext";
import { Database, FileSpreadsheet, FileJson, Link as LinkIcon, Construction, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

export const Route = createFileRoute("/fontes")({
  head: () => ({ meta: [{ title: "Fontes de Dados — CS2 Analyst Hub" }] }),
  component: DataSources,
});

const icons: Record<string, any> = { API: Database, CSV: FileSpreadsheet, JSON: FileJson, URL: LinkIcon };

function DataSources() {
  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Fontes de Dados" subtitle="Em breve: importe dados reais via API, CSV, JSON ou link de partida." />

      <GridStatusCard />

      <Card className="mb-6 bg-accent border-primary/30">
        <CardContent className="p-4 flex items-start gap-3">
          <Construction className="h-5 w-5 text-primary mt-0.5" />
          <div className="text-sm">
            <strong>Funcionalidade em desenvolvimento.</strong> A arquitetura do app já está pronta para receber dados externos. As integrações serão liberadas progressivamente.
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        {dataSources.map((d) => {
          const Icon = icons[d.type] ?? Database;
          return (
            <Card key={d.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant="outline">{d.status}</Badge>
                </div>
                <h3 className="font-bold mb-1">{d.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{d.description}</p>
                <Button disabled className="w-full">Conectar (em breve)</Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

const GRID_ENDPOINT = "https://api-op.grid.gg/central-data/graphql";

function GridStatusCard() {
  const { loading, error, gridCount, matchedCount, rosterCount, lastSync, source, cached, teams } = useTeams();
  const connected = !error && gridCount > 0;
  const usingFallback = source === "mock" || matchedCount === 0;
  const enrichedTeams = teams.filter((t) => t.gridId);
  const fallbackTeams = teams.filter((t) => !t.gridId);

  const statusColor = loading
    ? "border-border/60 bg-card/40"
    : connected
      ? "border-emerald-500/30 bg-emerald-500/5"
      : "border-amber-500/40 bg-amber-500/5";

  const StatusIcon = loading ? Loader2 : connected ? CheckCircle2 : AlertTriangle;
  const statusLabel = loading
    ? "Sincronizando…"
    : connected
      ? "GRID conectado"
      : "GRID indisponível — usando mock";

  return (
    <Card className={`mb-6 backdrop-blur-md ${statusColor}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <StatusIcon
            className={`h-5 w-5 mt-0.5 ${
              loading ? "animate-spin text-muted-foreground" : connected ? "text-emerald-400" : "text-amber-400"
            }`}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[13px] font-semibold">{statusLabel}</span>
              <Badge variant="outline" className="text-[10px]">GRID Central Data</Badge>
              {cached && <Badge variant="secondary" className="text-[10px]">cache</Badge>}
              {usingFallback && !loading && (
                <Badge variant="outline" className="text-[10px] border-amber-500/40 text-amber-300">
                  fallback mock ativo
                </Badge>
              )}
            </div>
            <div className="mt-2 grid gap-x-6 gap-y-1 text-[12px] text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <span className="text-foreground/80 font-semibold tabular-nums">{gridCount}</span> times carregados
              </div>
              <div>
                <span className="text-foreground/80 font-semibold tabular-nums">{matchedCount}</span> enriquecidos
              </div>
              <div>
                <span className="text-foreground/80 font-semibold tabular-nums">{rosterCount}</span> jogadores
              </div>
              <div>
                Última sync:{" "}
                <span className="text-foreground/80 font-semibold">
                  {lastSync ? lastSync.toLocaleTimeString("pt-BR") : "—"}
                </span>
              </div>
            </div>

            <div className="mt-3 rounded-md border border-border/50 bg-background/40 px-3 py-2 text-[11px] font-mono text-muted-foreground/90 break-all">
              <span className="text-muted-foreground/60">endpoint · </span>
              {GRID_ENDPOINT}
              <span className="ml-2 text-muted-foreground/60">· auth: x-api-key (oculta)</span>
            </div>

            {(enrichedTeams.length > 0 || fallbackTeams.length > 0) && (
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div>
                  <div className="text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground font-semibold mb-1.5">
                    Times reais ({enrichedTeams.length})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {enrichedTeams.map((t) => (
                      <Badge
                        key={t.id}
                        variant="outline"
                        className="text-[10px] border-emerald-500/30 bg-emerald-500/5 text-emerald-200/90"
                      >
                        {t.name}
                      </Badge>
                    ))}
                    {enrichedTeams.length === 0 && (
                      <span className="text-[11px] text-muted-foreground italic">nenhum</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground font-semibold mb-1.5">
                    Mock fallback ({fallbackTeams.length})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {fallbackTeams.map((t) => (
                      <Badge key={t.id} variant="outline" className="text-[10px]">
                        {t.name}
                      </Badge>
                    ))}
                    {fallbackTeams.length === 0 && (
                      <span className="text-[11px] text-muted-foreground italic">—</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-2 text-[11px] text-amber-300/90 line-clamp-2">{error}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

