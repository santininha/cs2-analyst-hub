import { Radio } from "lucide-react";
import { useTeams } from "@/contexts/TeamsContext";

export function LiveDataBadge() {
  const { loading, error, gridCount, matchedCount, lastSync } = useTeams();
  const connected = !error && gridCount > 0;

  const dotClass = loading
    ? "bg-muted-foreground"
    : connected
      ? "bg-success"
      : "bg-amber-400";

  const label = loading
    ? "Conectando · GRID"
    : connected
      ? "Dados sincronizados · GRID"
      : "GRID indisponível";

  const detail = loading
    ? "aguardando"
    : connected
      ? lastSync
        ? lastSync.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
        : "agora"
      : "fallback mock";

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
      title={connected ? `${matchedCount}/${gridCount} times enriquecidos` : error ?? undefined}
    >
      <span className="relative flex h-1.5 w-1.5">
        {connected && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${dotClass}`} />
      </span>
      <Radio className="h-3 w-3 opacity-60" />
      <span>
        <span className="text-foreground/80">{label}</span> · {detail}
      </span>
    </span>
  );
}
