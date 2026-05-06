import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { WorkspaceSidebar } from "@/components/WorkspaceSidebar";
import { LiveDataBadge } from "@/components/LiveDataBadge";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Voltar à Mesa de Análise
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CS2 Analyst Hub — Workspace da Caster" },
      { name: "description", content: "Workspace contextual de análise de Counter-Strike 2 para casters e analistas." },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "16rem",
          "--sidebar-width-icon": "3.25rem",
        } as React.CSSProperties
      }
    >
      <div className="min-h-screen flex w-full bg-background">
        <WorkspaceSidebar />
        <SidebarInset className="flex flex-col min-w-0">
          <header className="sticky top-0 z-20 h-12 flex items-center gap-3 px-4 border-b border-border/60 bg-background/85 backdrop-blur-md">
            <SidebarTrigger className="-ml-1" />
            <div className="h-4 w-px bg-border/80" />
            <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-muted-foreground/70">
              Workspace
            </span>
            <div className="ml-auto flex items-center gap-3">
              <LiveDataBadge />
              <span className="hidden md:inline text-[11px] text-muted-foreground">
                <span className="text-foreground/80 font-semibold">Caster ao vivo</span>
              </span>
            </div>
          </header>
          <main className="flex-1 px-4 md:px-8 py-6 md:py-8">
            <div className="max-w-[1320px] mx-auto">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
