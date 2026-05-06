import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutGrid,
  Swords,
  Calendar,
  Users,
  Map as MapIcon,
  BookOpen,
  StickyNote,
  Database,
  Crosshair,
  Radio,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const primary = [
  { title: "Mesa de Análise", url: "/", icon: LayoutGrid, exact: true },
  { title: "Sala da Partida", url: "/partidas", icon: Calendar },
  { title: "Laboratório de Times", url: "/comparar", icon: Swords },
];

const research = [
  { title: "Análise de Jogadores", url: "/jogadores", icon: Users },
  { title: "Análise de Mapas", url: "/mapas", icon: MapIcon },
];

const knowledge = [
  { title: "Notas do Caster", url: "/notas", icon: StickyNote },
  { title: "Central de Conhecimento", url: "/glossario", icon: BookOpen },
  { title: "Fontes de Dados", url: "/fontes", icon: Database },
];

export function WorkspaceSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const isActive = (url: string, exact?: boolean) =>
    exact ? path === url : path === url || path.startsWith(url + "/");

  const renderItem = (item: { title: string; url: string; icon: any; exact?: boolean }) => {
    const active = isActive(item.url, item.exact);
    return (
      <SidebarMenuItem key={item.url}>
        <SidebarMenuButton
          asChild
          isActive={active}
          tooltip={item.title}
          className="h-8 text-[12.5px] font-medium rounded-md data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-semibold hover:bg-sidebar-accent/60"
        >
          <Link to={item.url} className="flex items-center gap-2.5">
            <item.icon className="h-[15px] w-[15px] shrink-0 opacity-80" />
            <span className="truncate">{item.title}</span>
            {active && (
              <span className="ml-auto h-1 w-1 rounded-full bg-primary group-data-[collapsible=icon]:hidden" />
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  const renderGroup = (label: string, items: typeof primary) => (
    <SidebarGroup className="py-1">
      {!collapsed && (
        <SidebarGroupLabel className="text-[9.5px] uppercase tracking-[0.16em] font-semibold text-sidebar-foreground/40 px-2 mb-1">
          {label}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu className="gap-0.5">{items.map(renderItem)}</SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border py-3">
        <Link to="/" className="flex items-center gap-2.5 px-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground shrink-0">
            <Crosshair className="h-3.5 w-3.5" />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-[12.5px] font-semibold tracking-tight text-sidebar-foreground">
              CS2 Analyst Hub
            </span>
            <span className="text-[9.5px] uppercase tracking-[0.16em] text-sidebar-foreground/40 font-medium">
              Workspace · Santininha
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="pt-2">
        {renderGroup("Workspace", primary)}
        {renderGroup("Pesquisa", research)}
        {renderGroup("Conhecimento", knowledge)}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-2">
        <div className="flex items-center gap-2 px-1.5 py-1 group-data-[collapsible=icon]:justify-center">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          <div className="group-data-[collapsible=icon]:hidden flex items-center gap-1.5 text-[10.5px] text-sidebar-foreground/60">
            <Radio className="h-3 w-3 opacity-60" />
            <span>Sincronizado · HLTV</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
