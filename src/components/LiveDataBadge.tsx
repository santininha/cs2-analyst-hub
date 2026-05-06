import { Radio } from "lucide-react";

export function LiveDataBadge({
  source = "HLTV",
  updatedAt = "agora há pouco",
}: {
  source?: string;
  updatedAt?: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
      </span>
      <Radio className="h-3 w-3 opacity-60" />
      <span>
        Sincronizado · <span className="text-foreground/80">{source}</span> · {updatedAt}
      </span>
    </span>
  );
}
