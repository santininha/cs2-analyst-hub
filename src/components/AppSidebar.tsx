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
      <SidebarHeader className="border-b border-sidebar-border py-4">
        <Link to="/" className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
            <Crosshair className="h-6 w-6" />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-base font-extrabold tracking-tight">
              CS2 Analyst Hub
            </span>
            <span className="text-[11px] uppercase tracking-wider text-sidebar-foreground/60 font-semibold">
              por Santininha
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="pt-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] uppercase tracking-widest font-bold text-sidebar-foreground/60 px-3 mb-2">
            Análise
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {items.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={`h-11 text-[15px] font-semibold rounded-md transition-colors data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:font-bold data-[active=true]:shadow-sm hover:bg-sidebar-accent`}
                    >
                      <Link to={item.url} className="flex items-center gap-3 px-3">
                        <item.icon className="h-5 w-5 shrink-0" />
                        <span className="truncate">{item.title}</span>
                        {active && (
                          <span className="ml-auto h-2 w-2 rounded-full bg-primary-foreground/80 group-data-[collapsible=icon]:hidden" />
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
