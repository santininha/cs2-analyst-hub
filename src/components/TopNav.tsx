import { Link, useRouterState } from "@tanstack/react-router";
import { Crosshair } from "lucide-react";
import { LiveDataBadge } from "@/components/LiveDataBadge";

const nav = [
  { label: "Mesa de Análise", url: "/", exact: true },
  { label: "Sala da Partida", url: "/partidas" },
  { label: "Laboratório de Times", url: "/comparar" },
  { label: "Análise de Jogadores", url: "/jogadores" },
  { label: "Análise de Mapas", url: "/mapas" },
  { label: "Notas do Caster", url: "/notas" },
  { label: "Central de Conhecimento", url: "/glossario" },
  { label: "Fontes de Dados", url: "/fontes" },
];

export function TopNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (url: string, exact?: boolean) =>
    exact ? path === url : path === url || path.startsWith(url + "/") || path === url;

  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        {/* Brand row */}
        <div className="flex items-center justify-between h-12">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-background">
              <Crosshair className="h-3.5 w-3.5" />
            </div>
            <div className="flex items-baseline gap-2 leading-none">
              <span className="text-[13px] font-semibold tracking-tight">CS2 Analyst Hub</span>
              <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70 hidden sm:inline">
                Santininha · Workspace
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <LiveDataBadge />
            <span className="hidden md:inline text-[11px] text-muted-foreground">
              <span className="text-foreground/80 font-semibold">Caster ao vivo</span>
            </span>
          </div>
        </div>
        {/* Nav row */}
        <nav className="flex items-center gap-0.5 overflow-x-auto -mx-1 px-1 h-10">
          {nav.map((n) => {
            const active = isActive(n.url, n.exact);
            return (
              <Link
                key={n.url}
                to={n.url}
                className={`relative px-3 py-1.5 text-[13.5px] font-medium rounded-md whitespace-nowrap transition-colors ${
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                {n.label}
                {active && (
                  <span className="absolute left-2 right-2 -bottom-[7px] h-[2px] rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
