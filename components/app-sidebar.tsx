"use client"

import React, { useEffect, useState } from "react"
import {
  BarChart3,
  Building2,
  Calendar,
  ChevronRight,
  ChevronUp,
  CreditCard,
  Home,
  Mail,
  MessageSquare,
  Settings,
  Users,
  Zap,
  User2,
  Phone,
  TrendingUp,
  Shield,
  Bell,
  Bot,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
  Monitor,
  Crown,
  Target,
  MessageCircle,
  ImageIcon,
  BookOpen,
  FileText,
  Code,
  Layers,
  Database,
  Globe,
  GitCommit,
} from "lucide-react"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"

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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Link from "next/link"


const data = {
  user: {
    name: "Lucas Magista",
    email: "lucas.magista1@gmail.com",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "Administrador",
    status: "online",
  },
  company: {
    name: "CRM Pro",
    plan: "Empresarial",
    logo: "/placeholder.svg?height=32&width=32",
  },
  navMain: [
    {
      title: "Painel",
      url: "/",
      icon: Home,
      badge: null,
    },
    {
      title: "CRM",
      url: "/crm",
      icon: Building2,
      badge: "",
      items: [
        {
          title: "Contatos",
          url: "/crm/contacts",
          icon: Users,
          badge: "",
        },
        {
          title: "Leads",
          url: "/crm/leads",
          icon: Target,
          badge: "",
        },
        {
          title: "Funil",
          url: "/crm/pipeline",
          icon: TrendingUp,
          badge: "",
        },
        {
          title: "Agenda",
          url: "/crm/calendar",
          icon: Calendar,
          badge: "",
        },
      ],
    },
    {
      title: "Comunicações",
      url: "/communications",
      icon: MessageSquare,
      badge: "",
      items: [
        {
          title: "Mensagens",
          url: "/communications/messages",
          icon: MessageCircle,
          badge: "",
        },
        {
          title: "E-mail",
          url: "/communications/email",
          icon: Mail,
          badge: "",
        },
        {
          title: "Telefone",
          url: "/communications/phone",
          icon: Phone,
          badge: "",
        },
      ],
    },
    {
      title: "Automação",
      url: "/automation",
      icon: Bot,
      badge: "",
      items: [
        {
          title: "Bots",
          url: "/bots",
          icon: Bot,
          badge: "",
        },
        {
          title: "Workflows",
          url: "/workflows",
          icon: Zap,
          badge: "",
        },
        {
          title: "Modelos",
          url: "/templates",
          icon: ImageIcon,
          badge: "",
        },
      ],
    },
    {
      title: "Análises",
      url: "/analytics",
      icon: BarChart3,
      badge: null,
    },
    {
      title: "Integrações",
      url: "/integrations",
      icon: Zap,
      badge: "",
      items: [
        {
          title: "Marketing",
          url: "/integrations/marketing",
          icon: Mail,
          badge: "",
        },
        {
          title: "Pagamentos",
          url: "/integrations/payments",
          icon: CreditCard,
          badge: "",
        },
        {
          title: "Business Intelligence",
          url: "/integrations/bi",
          icon: BarChart3,
          badge: "",
        },
        {
          title: "E-commerce",
          url: "/integrations/ecommerce",
          icon: Globe,
          badge: "",
        },
        {
          title: "Comunicação",
          url: "/integrations/communication",
          icon: MessageSquare,
          badge: "",
        },
        {
          title: "Automação",
          url: "/integrations/automation",
          icon: Bot,
          badge: "",
        },
        {
          title: "Todas as Integrações",
          url: "/integrations",
          icon: Layers,
          badge: "",
        },
      ],
    },
    {
      title: "Documentação",
      url: "/docs",
      icon: BookOpen,
      badge: "",
      items: [
        {
          title: "Início Rápido",
          url: "/docs/quick-start",
          icon: Zap,
          badge: null,
        },
        {
          title: "Instalação",
          url: "/docs/installation",
          icon: Code,
          badge: null,
        },
        {
          title: "API Reference",
          url: "/docs/api",
          icon: Database,
          badge: null,
        },
        {
          title: "Integrações",
          url: "/docs/integrations",
          icon: Globe,
          badge: null,
        },
        {
          title: "Design System",
          url: "/docs/design-system",
          icon: Layers,
          badge: null,
        },
        {
          title: "Guias",
          url: "/docs/guides",
          icon: FileText,
          badge: null,
        },
        {
          title: "Melhores Práticas",
          url: "/docs/best-practices",
          icon: Target,
          badge: null,
        },
        {
          title: "FAQ",
          url: "/docs/faq",
          icon: HelpCircle,
          badge: null,
        },
        {
          title: "Changelog",
          url: "/docs/changelog",
          icon: GitCommit,
          badge: null,
        },
        {
          title: "Contribuição",
          url: "/docs/contributing",
          icon: Users,
          badge: null,
        },
        {
          title: "Roadmap",
          url: "/docs/roadmap",
          icon: TrendingUp,
          badge: "",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "RH",
      url: "/rh",
      icon: User2,
      badge: null,
    },
    {
      title: "Configurações",
      url: "/settings",
      icon: Settings,
      badge: null,
    },
    {
      title: "Cobrança",
      url: "/billing",
      icon: CreditCard,
      badge: null,
    },
    {
      title: "Segurança",
      url: "/security",
      icon: Shield,
      badge: "",
    },
    {
      title: "Notificações",
      url: "/notifications",
      icon: Bell,
      badge: "",
    },
    {
      title: "Ajuda & Suporte",
      url: "/support",
      icon: HelpCircle,
      badge: null,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const isActive = (url: string) => {
    if (!isHydrated) return false // Evitar inconsistências durante hidratação
    if (url === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(url)
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="sidebar-header">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Building2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{data.company.name}</span>
                  <div className="flex items-center gap-1">
                    <span className="truncate text-xs">{data.company.plan}</span>
                    <Crown className="size-3 text-yellow-500" />
                  </div>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel data-sidebar-group-label>Plataforma</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    <Collapsible
                      defaultOpen={false} // Sempre fechado inicialmente para evitar hydration errors
                      className="group/collapsible"
                    >
                      <div className="flex items-center">
                        {/* Botão principal - clicável para navegar */}
                        <SidebarMenuButton 
                          asChild 
                          tooltip={item.title} 
                          className="gap-2 text-sm px-3 py-2 flex-1"
                          isActive={isHydrated && item.url ? isActive(item.url) : false}
                        >
                          <Link href={item.url ?? "#"}>
                            <item.icon className="size-4" />
                            <span>{item.title}</span>
                            {"badge" in item && (item as any).badge && (
                              <Badge
                                variant={(item as any).badge === "New" ? "default" : "secondary"}
                                className="ml-auto text-xs px-2 py-0.5 badge"
                              >
                                {(item as any).badge}
                              </Badge>
                            )}
                          </Link>
                        </SidebarMenuButton>
                        
                        {/* Botão da seta - separado para expandir/recolher */}
                        <CollapsibleTrigger asChild>
                          <button 
                            className="flex items-center justify-center w-8 h-8 rounded hover:bg-sidebar-accent transition-colors"
                            title="Expandir/Recolher submenu"
                          >
                            <ChevronRight className="size-3 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </button>
                        </CollapsibleTrigger>
                      </div>
                      
                      <CollapsibleContent>
                        <SidebarMenuSub data-sidebar-menu-sub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild isActive={isHydrated && isActive(subItem.url)} className="gap-2 text-sm px-3 py-2">
                                <Link href={subItem.url}>
                                  <subItem.icon className="size-4" />
                                  <span>{subItem.title}</span>
                                  {"badge" in subItem && (subItem as any).badge && (
                                    <Badge variant="secondary" className="ml-auto text-xs px-2 py-0.5 badge">
                                      {(subItem as any).badge}
                                    </Badge>
                                  )}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild isActive={isHydrated && isActive(item.url)} tooltip={item.title} className="gap-2 text-sm px-3 py-2">
                      <Link href={item.url}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                        {"badge" in item && (item as any).badge && (
                          <Badge variant="secondary" className="ml-auto text-xs px-2 py-0.5 badge">
                            {(item as any).badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navSecondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="sm" isActive={isHydrated && isActive(item.url)} tooltip={item.title} className="gap-2 text-sm px-3 py-2">
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                      {"badge" in item && (item as any).badge && (
                        <Badge variant="secondary" className="ml-auto text-xs px-2 py-0.5 badge">
                          {(item as any).badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="sidebar-footer">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="relative">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={data.user.avatar || "/placeholder.svg"} alt={data.user.name} />
                      <AvatarFallback className="rounded-lg">
                        {data.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-sidebar" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{data.user.name}</span>
                    <div className="flex items-center gap-1">
                      <span className="truncate text-xs">{data.user.role}</span>
                      <Badge variant="outline" className="text-xs px-1 py-0 badge">
                        {data.user.status}
                      </Badge>
                    </div>
                  </div>
                  <ChevronUp className="ml-auto size-4" data-slot="chevron" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User2 />
                    Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings />
                    Configurações
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}> 
                  {theme === "dark" ? (
                    <>
                      <Sun />
                      Modo Claro
                    </>
                  ) : (
                    <>
                      <Moon />
                      Modo Escuro
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}> 
                  <Monitor />
                  Tema do Sistema
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}