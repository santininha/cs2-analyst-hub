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
  { title: "Comparar Times", url: "/comparar", icon: Swords, highlight: true },
  { title: "Partidas", url: "/partidas", icon: Calendar },
  { title: "Jogadores", url: "/jogadores", icon: Users },
  { title: "Mapas", url: "/mapas", icon: MapIcon },
  { title: "Glossário", url: "/glossario", icon: BookOpen },
  { title: "Notas", url: "/notas", icon: StickyNote },
  { title: "Fontes de Dados", url: "/fontes", icon: Database },
];

export function AppSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (url: string) => (url === "/" ? path === "/" : path.startsWith(url));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Crosshair className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold">CS2 Analyst Hub</span>
            <span className="text-[10px] text-muted-foreground">por Santininha</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Análise</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
