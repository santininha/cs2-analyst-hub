import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Swords,
  Calendar,
  Users,
  Map as MapIcon,
  BookOpen,
  StickyNote,
  Database,
  Crosshair,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Comparar Times", url: "/comparar", icon: Swords },
  { title: "Partidas", url: "/partidas", icon: Calendar },
  { title: "Times & Jogadores", url: "/jogadores", icon: Users },
  { title: "Mapas", url: "/mapas", icon: MapIcon },
  { title: "Glossário", url: "/glossario", icon: BookOpen },
  { title: "Notas", url: "/notas", icon: StickyNote },
  { title: "Fontes de Dados", url: "/fontes", icon: Database },
];

export function AppSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (url: string) =>
    url === "/" ? path === "/" : path.startsWith(url);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border py-3.5">
        <Link to="/" className="flex items-center gap-2.5 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Crosshair className="h-4 w-4" />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-[13px] font-semibold tracking-tight">
              CS2 Analyst Hub
            </span>
            <span className="text-[10px] uppercase tracking-wider text-sidebar-foreground/50 font-medium">
              por Santininha
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="pt-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.14em] font-semibold text-sidebar-foreground/50 px-3 mb-1.5">
            Análise
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {items.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={`h-9 text-[13px] font-medium rounded-lg transition-colors data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-semibold hover:bg-sidebar-accent/60`}
                    >
                      <Link to={item.url} className="flex items-center gap-2.5 px-3">
                        <item.icon className="h-4 w-4 shrink-0 opacity-80" />
                        <span className="truncate">{item.title}</span>
                        {active && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary group-data-[collapsible=icon]:hidden" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
