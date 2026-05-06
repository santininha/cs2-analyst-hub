import type { Team } from "@/data/mock";

/**
 * Subtle indicator showing whether a team's data is real (enriched via GRID)
 * or a mock fallback. Designed to sit next to team names without disrupting
 * the dark hybrid layout.
 */
export function DataSourceTag({
  team,
  size = "sm",
  className = "",
}: {
  team: Pick<Team, "gridId">;
  size?: "xs" | "sm";
  className?: string;
}) {
  const real = !!team.gridId;
  const padding = size === "xs" ? "px-1 py-[1px] text-[8.5px]" : "px-1.5 py-[1.5px] text-[9px]";
  return (
    <span
      title={real ? "Dados reais via GRID" : "Dados mock (fallback)"}
      className={`inline-flex items-center gap-1 uppercase tracking-[0.1em] font-semibold rounded backdrop-blur-sm ${padding} ${
        real
          ? "bg-emerald-500/12 text-emerald-300/90 border border-emerald-500/30"
          : "bg-muted/50 text-muted-foreground border border-border/60"
      } ${className}`}
    >
      <span className={`h-1 w-1 rounded-full ${real ? "bg-emerald-400" : "bg-muted-foreground/60"}`} />
      {real ? "GRID" : "MOCK"}
    </span>
  );
}
