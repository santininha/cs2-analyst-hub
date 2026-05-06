import { ANALYSIS_WINDOWS, type AnalysisWindowId } from "@/lib/mapPool";
import { Clock } from "lucide-react";

/**
 * Tiny segmented control for the analysis time window. Defaults are wired
 * from `DEFAULT_ANALYSIS_WINDOW`; callers own the state.
 */
export function AnalysisWindowPicker({
  value,
  onChange,
  className = "",
}: {
  value: AnalysisWindowId;
  onChange: (id: AnalysisWindowId) => void;
  className?: string;
}) {
  const ids: AnalysisWindowId[] = ["1m", "3m", "6m", "12m"];
  return (
    <div
      className={`inline-flex flex-col gap-1 rounded-md border border-border/60 bg-card/40 backdrop-blur-md p-1.5 ${className}`}
    >
      <span className="px-1.5 text-[9.5px] uppercase tracking-[0.13em] text-muted-foreground inline-flex items-center gap-1">
        <Clock className="h-3 w-3" /> Recorte
      </span>
      <div className="flex gap-1">
        {ids.map((id) => {
          const w = ANALYSIS_WINDOWS[id];
          const active = id === value;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              title={w.label}
              className={`px-2 py-1 rounded text-[11px] font-semibold tabular-nums transition-colors ${
                active
                  ? "bg-primary/15 text-primary border border-primary/40"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-transparent"
              }`}
            >
              {w.shortLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}
