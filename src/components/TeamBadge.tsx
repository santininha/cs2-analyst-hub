import { Team } from "@/data/mock";

export function TeamBadge({ team, size = "md" }: { team: Team; size?: "sm" | "md" | "lg" }) {
  const sz = size === "sm" ? "h-7 w-7 text-[10px]" : size === "lg" ? "h-12 w-12 text-base" : "h-9 w-9 text-xs";
  return (
    <div
      className={`${sz} rounded-md flex items-center justify-center font-bold text-white shrink-0`}
      style={{ background: team.logoColor }}
    >
      {team.tag.slice(0, 4)}
    </div>
  );
}
