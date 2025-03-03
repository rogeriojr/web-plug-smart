import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
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
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  return _jsxs(Sidebar, {
    collapsible: "icon",
    children: [
      _jsx(SidebarHeader, {
        children: _jsx(SidebarMenu, {
          children: _jsx(SidebarMenuItem, {
            children: _jsx(DropdownMenu, {
              children: _jsx(DropdownMenuTrigger, {
                asChild: true,
                children: _jsxs(SidebarMenuButton, {
                  size: "lg",
                  className:
                    "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
                  children: [
                    _jsxs("div", {
                      className: "flex items-center gap-2",
                      children: [
                        _jsx("img", {
                          src: data?.teams[0]?.logo,
                          alt: "Team Logo",
                          className: "h-8 w-8 object-contain rounded-lg",
                        }),
                        _jsxs("div", {
                          className:
                            "grid flex-1 text-left text-sm leading-tight",
                          children: [
                            _jsx("span", {
                              className: "truncate font-semibold",
                              children: data?.teams[0].name,
                            }),
                            _jsx("span", {
                              className: "truncate text-xs",
                              children: data?.teams[0].plan,
                            }),
                          ],
                        }),
                      ],
                    }),
                    _jsx(ChevronsUpDown, { className: "ml-auto" }),
                  ],
                }),
              }),
            }),
          }),
        }),
      }),
      _jsx(SidebarContent, {
        children: _jsxs(SidebarGroup, {
          children: [
            _jsx(SidebarGroupLabel, { children: "Plataforma" }),
            _jsx(SidebarMenu, {
              children: data?.navMain.map((item) =>
                _jsx(
                  Collapsible,
                  {
                    asChild: true,
                    defaultOpen: item.isActive,
                    className: "group/collapsible",
                    children: _jsxs(SidebarMenuItem, {
                      children: [
                        _jsx(CollapsibleTrigger, {
                          asChild: true,
                          children: _jsxs(SidebarMenuButton, {
                            tooltip: item.title,
                            children: [
                              item.icon && _jsx(item.icon, {}),
                              _jsx("span", { children: item.title }),
                              _jsx(ChevronRight, {
                                className:
                                  "ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90",
                              }),
                            ],
                          }),
                        }),
                        _jsx(CollapsibleContent, {
                          children: _jsx(SidebarMenuSub, {
                            children: item.items?.map((subItem) =>
                              _jsx(
                                SidebarMenuSubItem,
                                {
                                  children: _jsx(SidebarMenuSubButton, {
                                    asChild: true,
                                    children: _jsx(Link, {
                                      to: subItem.url,
                                      children: _jsx("span", {
                                        children: subItem.title,
                                      }),
                                    }),
                                  }),
                                },
                                subItem.title
                              )
                            ),
                          }),
                        }),
                      ],
                    }),
                  },
                  item.title
                )
              ),
            }),
          ],
        }),
      }),
      _jsx(SidebarFooter, {
        children: _jsx(SidebarMenu, {
          children: _jsx(SidebarMenuItem, {
            children: _jsxs(DropdownMenu, {
              children: [
                _jsx(DropdownMenuTrigger, {
                  asChild: true,
                  children: _jsxs(SidebarMenuButton, {
                    size: "lg",
                    className:
                      "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
                    children: [
                      _jsxs(Avatar, {
                        className: "h-8 w-8 rounded-lg",
                        children: [
                          _jsx(AvatarImage, {
                            src: data?.user?.avatar,
                            alt: currentUser?.nome,
                          }),
                          _jsx(AvatarFallback, {
                            className: "rounded-lg",
                            children: currentUser?.nome[0],
                          }),
                        ],
                      }),
                      _jsxs("div", {
                        className:
                          "grid flex-1 text-left text-sm leading-tight",
                        children: [
                          _jsx("span", {
                            className: "truncate font-semibold",
                            children: currentUser?.nome,
                          }),
                          _jsx("span", {
                            className: "truncate text-xs",
                            children: currentUser?.email,
                          }),
                        ],
                      }),
                      _jsx(ChevronsUpDown, { className: "ml-auto size-4" }),
                    ],
                  }),
                }),
                _jsxs(DropdownMenuContent, {
                  className:
                    "w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg",
                  side: "bottom",
                  align: "end",
                  sideOffset: 4,
                  children: [
                    _jsx(DropdownMenuLabel, {
                      className: "p-0 font-normal",
                      children: _jsxs("div", {
                        className:
                          "flex items-center gap-2 px-1 py-1.5 text-left text-sm",
                        children: [
                          _jsxs(Avatar, {
                            className: "h-8 w-8 rounded-lg",
                            children: [
                              _jsx(AvatarImage, {
                                src: data?.user?.avatar,
                                alt: currentUser?.nome,
                              }),
                              _jsx(AvatarFallback, {
                                className: "rounded-lg",
                                children: currentUser?.nome[0],
                              }),
                            ],
                          }),
                          _jsxs("div", {
                            className:
                              "grid flex-1 text-left text-sm leading-tight",
                            children: [
                              _jsx("span", {
                                className: "truncate font-semibold",
                                children: currentUser?.nome,
                              }),
                              _jsx("span", {
                                className: "truncate text-xs",
                                children: currentUser?.email,
                              }),
                            ],
                          }),
                        ],
                      }),
                    }),
                    _jsxs(DropdownMenuItem, {
                      className: "text-red-500 hover:text-red-600",
                      onClick: handleLogout,
                      children: [
                        _jsx(LogOut, { className: "mr-2 h-4 w-4" }),
                        "Sair",
                      ],
                    }),
                  ],
                }),
              ],
            }),
          }),
        }),
      }),
      _jsx(SidebarRail, {}),
    ],
  });
};
export default AppSidebar;
