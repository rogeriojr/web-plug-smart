import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  Bot,
  ChevronRight,
  ChevronsUpDown,
  LogOut,
  LayoutDashboard,
  SquareTerminal,
  MessageCircle,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import logo from "@/assets/icon.png";
import { useEffect, useState } from "react";

const data = {
  user: {
    name: "Plug Smart",
    email: "plug@gmail.com",
    avatar: logo,
  },
  teams: [
    {
      name: "Plug Smart",
      logo: logo,
      plan: "Administração",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Boas Vindas",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Usuários",
      url: "#",
      icon: SquareTerminal,
      items: [
        {
          title: "Lista de usuários",
          url: "/users",
        },
      ],
    },
    {
      title: "Travas",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Lista de travas",
          url: "/travas",
        },
        {
          title: "Acessos",
          url: "/travas/acessos",
        },
      ],
    },
    {
      title: "Notificações",
      url: "#",
      icon: MessageCircle,
      items: [
        {
          title: "Enviar SMS",
          url: "/sms",
        },
      ],
    },
  ],
};

const AppSidebar = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Atualiza se o localStorage mudar
  useEffect(() => {
    const handleStorage = () => {
      const storedUser = localStorage.getItem("currentUser");
      setCurrentUser(storedUser ? JSON.parse(storedUser) : null);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon">
      <>{console.log("currentUser", currentUser)}</>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  {data?.teams?.length > 0 && (
                    <div className="flex items-center gap-2">
                      <img
                        src={data?.teams[0]?.logo}
                        alt="Team Logo"
                        className="h-8 w-8 object-contain rounded-lg"
                      />
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {data?.teams[0].name}
                        </span>
                        <span className="truncate text-xs">
                          {data?.teams[0].plan}
                        </span>
                      </div>
                    </div>
                  )}
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
          <SidebarMenu>
            {data?.navMain.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link to={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {currentUser && data && (
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={data?.user?.avatar}
                        alt={currentUser?.nome}
                      />
                      <AvatarFallback className="rounded-lg">
                        {currentUser?.nome?.length > 0
                          ? currentUser?.nome[0]
                          : ""}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {currentUser?.nome}
                      </span>
                      <span className="truncate text-xs">
                        {currentUser?.email}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={data?.user?.avatar}
                          alt={currentUser?.nome}
                        />
                        <AvatarFallback className="rounded-lg">
                          {currentUser?.nome?.length > 0
                            ? currentUser?.nome[0]
                            : ""}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {currentUser?.nome}
                        </span>
                        <span className="truncate text-xs">
                          {currentUser?.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuItem
                    className="text-red-500 hover:text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
