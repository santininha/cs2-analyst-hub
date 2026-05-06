import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map as MapIcon, RefreshCw, CheckCircle2, AlertTriangle } from "lucide-react";
import { getMapPoolStatus } from "@/lib/mapPool";

/**
 * Compact status card showing the active map pool, last verification time,
 * configured source, and any maps currently flagged as out-of-rotation.
 */
export function MapPoolStatusCard({ className = "" }: { className?: string }) {
  const status = getMapPoolStatus();
  const lastChecked = new Date(status.lastCheckedAt).toLocaleString("pt-BR");

  return (
    <Card className={`backdrop-blur-md border-emerald-500/25 bg-emerald-500/5 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-md flex items-center justify-center bg-emerald-500/10 border border-emerald-500/30 shrink-0">
            <MapIcon className="h-4 w-4 text-emerald-300" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[13px] font-semibold">Map pool ativo</span>
              <span className="inline-flex items-center gap-1 text-[10.5px] uppercase tracking-[0.1em] font-semibold text-emerald-300">
                <CheckCircle2 className="h-3 w-3" /> ok
              </span>
            </div>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              {status.active.length} mapas em rotação · Active Duty CS2
            </p>

            <div className="flex flex-wrap gap-1 mt-2">
              {status.active.map((m) => (
                <Badge
                  key={m.id}
                  variant="outline"
                  className="text-[10px] border-emerald-500/30 text-emerald-200/90"
                >
                  {m.name}
                </Badge>
              ))}
            </div>

            {status.historical.length > 0 && (
              <div className="mt-3">
                <div className="text-[10.5px] uppercase tracking-[0.1em] text-muted-foreground font-semibold mb-1 inline-flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-amber-400" /> Fora da rotação
                </div>
                <div className="flex flex-wrap gap-1">
                  {status.historical.map((m) => (
                    <Badge
                      key={m.id}
                      variant="outline"
                      className="text-[10px] border-amber-500/30 text-amber-300/90"
                    >
                      {m.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <dl className="mt-3 space-y-1 text-[11px]">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground inline-flex items-center gap-1">
                  <RefreshCw className="h-3 w-3" /> Última verificação
                </dt>
                <dd className="tabular-nums">{lastChecked}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Fonte configurada</dt>
                <dd className="text-right truncate text-muted-foreground/90">{status.sourceLabel}</dd>
              </div>
            </dl>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
