import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import { useIntegrationStatus } from "@/lib/integrationStatus";
import { MapPoolStatusCard } from "@/components/MapPoolStatusCard";
import { TEAM_SCOPES, DEFAULT_ANALYSIS_WINDOW } from "@/lib/mapPool";
import { Trophy, Globe2 } from "lucide-react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  Database,
  Users,
  Image as ImageIcon,
  Palette,
  Shield,
  Radio,
  Swords,
  UserSquare2,
  BarChart3,
  Clock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const GRID_ENDPOINT = "https://api-op.grid.gg/central-data/graphql";

export const Route = createFileRoute("/fontes")({
  head: () => ({
    meta: [
      { title: "Fontes de Dados — CS2 Analyst Hub" },
      {
        name: "description",
        content:
          "Diagnóstico das integrações do CS2 Analyst Hub: status GRID, times, logos, branding e lineups.",
      },
    ],
  }),
  component: DataSourcesPage,
});

type Tone = "ok" | "warn" | "err" | "idle" | "info";

function toneClasses(tone: Tone) {
  switch (tone) {
    case "ok":
      return {
        border: "border-emerald-500/30",
        bg: "bg-emerald-500/5",
        text: "text-emerald-300",
        dot: "bg-emerald-400",
      };
    case "warn":
      return {
        border: "border-amber-500/30",
        bg: "bg-amber-500/5",
        text: "text-amber-300",
        dot: "bg-amber-400",
      };
    case "err":
      return {
        border: "border-red-500/30",
        bg: "bg-red-500/5",
        text: "text-red-300",
        dot: "bg-red-400",
      };
    case "info":
      return {
        border: "border-primary/30",
        bg: "bg-primary/5",
        text: "text-primary",
        dot: "bg-primary",
      };
    default:
      return {
        border: "border-border/60",
        bg: "bg-card/40",
        text: "text-muted-foreground",
        dot: "bg-muted-foreground/60",
      };
  }
}

function DataSourcesPage() {
  const s = useIntegrationStatus();

  const gridTone: Tone =
    s.gridState === "connected"
      ? "ok"
      : s.gridState === "fallback"
        ? "warn"
        : s.gridState === "error"
          ? "err"
          : "idle";

  const gridLabel =
    s.gridState === "connected"
      ? "Dados sincronizados · GRID"
      : s.gridState === "fallback"
        ? "GRID indisponível — usando fallback mock"
        : s.gridState === "error"
          ? "Erro ao conectar GRID"
          : "Sincronizando…";

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Fontes de Dados"
        subtitle="Diagnóstico em tempo real das integrações que alimentam o workspace."
      />

      <div className="grid gap-3 md:grid-cols-2">
        {/* GRID API */}
        <StatusCard
          icon={Radio}
          tone={gridTone}
          title="GRID API"
          subtitle={gridLabel}
          loading={s.loading}
          rows={[
            {
              label: "Endpoint",
              value: (
                <span className="font-mono text-[11px] break-all text-muted-foreground/90">
                  {GRID_ENDPOINT}
                </span>
              ),
            },
            {
              label: "Autenticação",
              value: (
                <span className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground">
                  <Shield className="h-3 w-3" /> x-api-key (oculta no servidor)
                </span>
              ),
            },
            {
              label: "Última sincronização",
              value: (
                <span className="inline-flex items-center gap-1.5 text-[12px]">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  {s.lastSyncAt ? s.lastSyncAt.toLocaleString("pt-BR") : "—"}
                  {s.cached && (
                    <Badge variant="secondary" className="text-[9px] ml-1">
                      cache
                    </Badge>
                  )}
                </span>
              ),
            },
          ]}
          footer={s.error ? <span className="text-amber-300/90">{s.error}</span> : undefined}
        />

        {/* Times */}
        <StatusCard
          icon={Database}
          tone={s.enrichedCount > 0 ? "ok" : s.teamsCount > 0 ? "warn" : "idle"}
          title="Times"
          subtitle={
            s.enrichedCount > 0
              ? `${s.enrichedCount} de ${s.teamsCount} times com dados reais GRID`
              : `${s.teamsCount} times carregados (mock)`
          }
          loading={s.loading}
          rows={[
            { label: "Carregados", value: <Num>{s.teamsCount}</Num> },
            {
              label: "Reais (GRID)",
              value: (
                <span className="inline-flex items-center gap-1.5">
                  <Num>{s.enrichedCount}</Num>
                  {s.enrichedCount > 0 && (
                    <Badge
                      variant="outline"
                      className="text-[9px] border-emerald-500/30 text-emerald-300/90"
                    >
                      reais
                    </Badge>
                  )}
                </span>
              ),
            },
            {
              label: "Mock fallback",
              value: <Num>{Math.max(0, s.teamsCount - s.enrichedCount)}</Num>,
            },
          ]}
        />

        {/* Logos & Branding */}
        <StatusCard
          icon={ImageIcon}
          tone={s.hasRealLogos ? "ok" : "idle"}
          title="Logos reais"
          subtitle={
            s.hasRealLogos
              ? `${s.realLogosCount} logos carregados via GRID`
              : "Nenhum logo real carregado"
          }
          loading={s.loading}
          rows={[
            { label: "Logos GRID", value: <Num>{s.realLogosCount}</Num> },
            {
              label: "Cobertura",
              value: (
                <span className="text-[12px] tabular-nums">
                  {s.teamsCount > 0
                    ? `${Math.round((s.realLogosCount / s.teamsCount) * 100)}%`
                    : "—"}
                </span>
              ),
            },
          ]}
        />

        <StatusCard
          icon={Palette}
          tone={s.hasBranding ? "ok" : "idle"}
          title="Branding"
          subtitle={
            s.hasBranding
              ? `${s.brandingCount} times com cores oficiais`
              : "Sem cores oficiais carregadas"
          }
          loading={s.loading}
          rows={[
            { label: "Cores oficiais", value: <Num>{s.brandingCount}</Num> },
            {
              label: "Aplicação",
              value: (
                <span className="text-[12px] text-muted-foreground">
                  bordas, tags e detalhes
                </span>
              ),
            },
          ]}
        />

        {/* Lineups */}
        <StatusCard
          icon={Users}
          tone={s.hasLineups ? "ok" : "idle"}
          title="Lineups"
          subtitle={
            s.hasLineups
              ? `${s.lineupsCount} lineups · ${s.playersCount} jogadores`
              : "Aguardando próxima etapa de integração"
          }
          loading={s.loading}
          rows={[
            { label: "Lineups carregadas", value: <Num>{s.lineupsCount}</Num> },
            { label: "Jogadores", value: <Num>{s.playersCount}</Num> },
          ]}
        />

        {/* Fallback */}
        <StatusCard
          icon={Shield}
          tone={s.isUsingFallback ? "warn" : "ok"}
          title="Fallback mock"
          subtitle={s.isUsingFallback ? "Ativo" : "Inativo"}
          loading={s.loading}
          rows={[
            {
              label: "Estado",
              value: (
                <Badge
                  variant="outline"
                  className={`text-[10px] ${
                    s.isUsingFallback
                      ? "border-amber-500/40 text-amber-300"
                      : "border-emerald-500/30 text-emerald-300/90"
                  }`}
                >
                  {s.isUsingFallback ? "ativo" : "inativo"}
                </Badge>
              ),
            },
          ]}
          footer={
            <span className="text-muted-foreground">
              O fallback mantém o app navegável caso a GRID não responda.
            </span>
          }
        />
      </div>

      {/* Map pool */}
      <section className="mt-8">
        <div className="mb-3">
          <span className="text-[11px] uppercase tracking-[0.13em] text-muted-foreground font-semibold">
            Map pool
          </span>
          <h2 className="text-[18px] mt-0.5">Rotação competitiva (Active Duty)</h2>
        </div>
        <MapPoolStatusCard />
        <p className="text-[11px] text-muted-foreground mt-2">
          Recorte padrão de análise: <span className="text-foreground/90 font-semibold">{DEFAULT_ANALYSIS_WINDOW.label}</span>.
        </p>
      </section>

      {/* Team scopes */}
      <section className="mt-8">
        <div className="mb-3">
          <span className="text-[11px] uppercase tracking-[0.13em] text-muted-foreground font-semibold">
            Escopo de times
          </span>
          <h2 className="text-[18px] mt-0.5">Rankings configurados</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <ScopeCard scope={TEAM_SCOPES["top30-world"]} icon={Globe2} />
          <ScopeCard scope={TEAM_SCOPES["top20-sa"]} icon={Trophy} />
        </div>
      </section>

      {/* Roadmap */}
      <section className="mt-8">
        <div className="mb-3">
          <span className="text-[11px] uppercase tracking-[0.13em] text-muted-foreground font-semibold">
            Roadmap
          </span>
          <h2 className="text-[18px] mt-0.5">Próximas integrações</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <RoadmapCard icon={Swords} title="Matches reais" description="Calendário e resultados oficiais via GRID." />
          <RoadmapCard
            icon={UserSquare2}
            title="Players reais"
            description="Perfis completos: papel, país, agência e histórico."
          />
          <RoadmapCard icon={BarChart3} title="Stats por mapa" description="Win rate, lados e desempenho mapa a mapa." />
        </div>
      </section>
    </div>
  );
}

function ScopeCard({
  scope,
  icon: Icon,
}: {
  scope: (typeof TEAM_SCOPES)[keyof typeof TEAM_SCOPES];
  icon: LucideIcon;
}) {
  return (
    <Card className="border-amber-500/25 bg-amber-500/5 backdrop-blur-md">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Icon className="h-4 w-4 text-amber-300" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[13px] font-semibold">{scope.label}</span>
              <Badge variant="outline" className="text-[9px] uppercase tracking-[0.1em] border-amber-500/40 text-amber-300">
                ranking externo pendente
              </Badge>
            </div>
            <p className="text-[12px] text-muted-foreground mt-1 leading-relaxed">{scope.description}</p>
            <p className="text-[11px] text-muted-foreground/80 mt-2">
              Fonte planejada: <span className="text-foreground/80">{scope.plannedSource}</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Num({ children }: { children: number }) {
  return <span className="font-semibold tabular-nums text-foreground/90">{children}</span>;
}

function StatusCard({
  icon: Icon,
  tone,
  title,
  subtitle,
  rows,
  footer,
  loading,
}: {
  icon: LucideIcon;
  tone: Tone;
  title: string;
  subtitle: string;
  rows: { label: string; value: React.ReactNode }[];
  footer?: React.ReactNode;
  loading?: boolean;
}) {
  const t = toneClasses(tone);
  const StatusIcon = loading
    ? Loader2
    : tone === "ok"
      ? CheckCircle2
      : tone === "warn"
        ? AlertTriangle
        : tone === "err"
          ? XCircle
          : CheckCircle2;

  return (
    <Card className={`backdrop-blur-md ${t.border} ${t.bg}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={`h-9 w-9 rounded-md flex items-center justify-center shrink-0 ${t.bg} border ${t.border}`}
          >
            <Icon className={`h-4 w-4 ${t.text}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[13px] font-semibold">{title}</span>
              <span className={`inline-flex items-center gap-1 text-[10.5px] uppercase tracking-[0.1em] font-semibold ${t.text}`}>
                <StatusIcon
                  className={`h-3 w-3 ${loading ? "animate-spin" : ""}`}
                />
                {loading ? "sincronizando" : tone === "ok" ? "ok" : tone === "warn" ? "atenção" : tone === "err" ? "erro" : "—"}
              </span>
            </div>
            <p className="text-[12px] text-muted-foreground mt-0.5">{subtitle}</p>

            <dl className="mt-3 space-y-1.5">
              {rows.map((r) => (
                <div key={r.label} className="flex items-center justify-between gap-3 text-[12px]">
                  <dt className="text-muted-foreground">{r.label}</dt>
                  <dd className="text-right min-w-0 truncate">{r.value}</dd>
                </div>
              ))}
            </dl>

            {footer && <div className="mt-3 text-[11px] leading-relaxed">{footer}</div>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RoadmapCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-border/60 bg-card/40 backdrop-blur-md">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold">{title}</span>
              <Badge variant="outline" className="text-[9px] uppercase tracking-[0.1em]">
                em breve
              </Badge>
            </div>
            <p className="text-[12px] text-muted-foreground mt-1 leading-relaxed">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
