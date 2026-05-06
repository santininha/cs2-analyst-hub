import { Team } from "@/data/mock";

export function TeamBadge({ team, size = "md" }: { team: Team; size?: "sm" | "md" | "lg" }) {
  const sz =
    size === "sm"
      ? "h-7 w-7 text-[10px]"
      : size === "lg"
        ? "h-12 w-12 text-base"
        : "h-9 w-9 text-xs";

  const primary = team.colorPrimary ?? undefined;
  const secondary = team.colorSecondary ?? team.colorPrimary ?? undefined;

  // Subtle brand tint background even when logo loads — gives a soft halo
  const fallbackBg = primary
    ? `linear-gradient(135deg, ${primary}, ${secondary ?? primary})`
    : team.logoColor;

  const ringStyle = primary
    ? { boxShadow: `inset 0 0 0 1px ${primary}55` }
    : undefined;

  if (team.logoUrl) {
    return (
      <div
        className={`${sz} rounded-md flex items-center justify-center shrink-0 overflow-hidden bg-card/60 backdrop-blur-sm`}
        style={ringStyle}
        title={team.name}
      >
        <img
          src={team.logoUrl}
          alt={`${team.name} logo`}
          className="h-full w-full object-contain p-0.5"
          loading="lazy"
          onError={(e) => {
            // Hide broken image and reveal tag fallback below
            (e.currentTarget as HTMLImageElement).style.display = "none";
            const parent = (e.currentTarget as HTMLImageElement).parentElement;
            if (parent) {
              parent.style.background = fallbackBg;
              parent.innerHTML = `<span class="font-bold text-white">${team.tag.slice(0, 4)}</span>`;
            }
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`${sz} rounded-md flex items-center justify-center font-bold text-white shrink-0`}
      style={{ background: fallbackBg, ...ringStyle }}
      title={team.name}
    >
      {team.tag.slice(0, 4)}
    </div>
  );
}
