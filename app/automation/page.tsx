"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Bot,
  Zap,
  ImageIcon,
  Plus,
  Settings,
  Activity,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Users,
  MessageSquare,
  Mail,
  Search,
} from "lucide-react"

const automationStats = {
  totalAutomations: 42,
  activeAutomations: 38,
  totalExecutions: 15847,
  successRate: 96.8,
  timeSaved: "1,247 horas",
  monthlyGrowth: 12.3,
}

const recentActivity = [
  {
    id: 1,
    type: "bot",
    name: "Bot de Suporte",
    action: "Respondeu 15 mensagens",
    time: "há 5 minutos",
    status: "success",
  },
  {
    id: 2,
    type: "workflow",
    name: "Lead Qualification",
    action: "Processou 3 novos leads",
    time: "há 12 minutos",
    status: "success",
  },
  {
    id: 3,
    type: "template",
    name: "E-mail de Boas-vindas",
    action: "Enviado para 8 novos usuários",
    time: "há 23 minutos",
    status: "success",
  },
  {
    id: 4,
    type: "workflow",
    name: "Backup de Dados",
    action: "Falha na execução",
    time: "há 1 hora",
    status: "error",
  },
  {
    id: 5,
    type: "bot",
    name: "Bot de Vendas",
    action: "Agendou 2 reuniões",
    time: "há 2 horas",
    status: "success",
  },
]

const quickActions = [
  {
    title: "Criar Bot",
    description: "Configure um novo bot de atendimento",
    icon: Bot,
    href: "/bots",
    color: "bg-blue-500",
  },
  {
    title: "Novo Workflow",
    description: "Automatize processos de negócio",
    icon: Zap,
    href: "/workflows",
    color: "bg-purple-500",
  },
  {
    title: "Template",
    description: "Crie modelos reutilizáveis",
    icon: ImageIcon,
    href: "/templates",
    color: "bg-green-500",
  },
]

const automationCategories = [
  {
    title: "Atendimento ao Cliente",
    count: 12,
    active: 11,
    description: "Bots e workflows para suporte",
    growth: "+8%",
  },
  {
    title: "Marketing e Vendas",
    count: 18,
    active: 16,
    description: "Automações de lead e conversão",
    growth: "+15%",
  },
  {
    title: "Operações Internas",
    count: 8,
    active: 7,
    description: "Processos administrativos",
    growth: "+5%",
  },
  {
    title: "Integrações",
    count: 4,
    active: 4,
    description: "Sincronização de dados",
    growth: "+25%",
  },
]

export default function AutomationPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Automação</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Automação</h1>
            <p className="text-muted-foreground">
              Gerencie bots, workflows e templates para automatizar seus processos
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar automações..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-[300px]"
              />
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Automação
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Automações</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{automationStats.totalAutomations}</div>
              <p className="text-xs text-muted-foreground">
                {automationStats.activeAutomations} ativas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Execuções</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{automationStats.totalExecutions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{automationStats.successRate}%</div>
              <Progress value={automationStats.successRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo Economizado</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{automationStats.timeSaved}</div>
              <p className="text-xs text-muted-foreground">
                +{automationStats.monthlyGrowth}% este mês
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>
                  Crie novas automações rapidamente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action) => (
                  <Link key={action.title} href={action.href}>
                    <Button
                      variant="outline"
                      className="w-full justify-start h-auto p-4 hover:bg-accent"
                    >
                      <div className={`p-2 rounded-md ${action.color} mr-3`}>
                        <action.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {action.description}
                        </div>
                      </div>
                      <ArrowRight className="ml-auto h-4 w-4" />
                    </Button>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
                <CardDescription>
                  Últimas execuções e eventos de automação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {activity.type === "bot" && (
                          <div className="p-2 bg-blue-100 rounded-full">
                            <Bot className="h-4 w-4 text-blue-600" />
                          </div>
                        )}
                        {activity.type === "workflow" && (
                          <div className="p-2 bg-purple-100 rounded-full">
                            <Zap className="h-4 w-4 text-purple-600" />
                          </div>
                        )}
                        {activity.type === "template" && (
                          <div className="p-2 bg-green-100 rounded-full">
                            <ImageIcon className="h-4 w-4 text-green-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {activity.name}
                          </p>
                          <div className="flex items-center">
                            {activity.status === "success" ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">{activity.action}</p>
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Automation Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Categorias de Automação</CardTitle>
            <CardDescription>
              Visão geral das automações por categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {automationCategories.map((category) => (
                <div key={category.title} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{category.title}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {category.growth}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold">{category.count}</div>
                  <div className="text-sm text-muted-foreground">
                    {category.active} ativas
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {category.description}
                  </p>
                  <Progress
                    value={(category.active / category.count) * 100}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Automações</CardTitle>
            <CardDescription>
              Acesse e configure suas automações por tipo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="bots">Bots</TabsTrigger>
                <TabsTrigger value="workflows">Workflows</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <Link href="/bots">
                    <Card className="cursor-pointer hover:bg-accent transition-colors">
                      <CardHeader className="text-center">
                        <Bot className="h-12 w-12 mx-auto text-blue-600" />
                        <CardTitle>Bots</CardTitle>
                        <CardDescription>
                          12 bots ativos automatizando atendimento
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>

                  <Link href="/workflows">
                    <Card className="cursor-pointer hover:bg-accent transition-colors">
                      <CardHeader className="text-center">
                        <Zap className="h-12 w-12 mx-auto text-purple-600" />
                        <CardTitle>Workflows</CardTitle>
                        <CardDescription>
                          18 workflows processando dados
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>

                  <Link href="/templates">
                    <Card className="cursor-pointer hover:bg-accent transition-colors">
                      <CardHeader className="text-center">
                        <ImageIcon className="h-12 w-12 mx-auto text-green-600" />
                        <CardTitle>Templates</CardTitle>
                        <CardDescription>
                          45 templates para comunicação
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="bots" className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-muted-foreground">
                    Configure e monitore seus bots de atendimento
                  </p>
                  <Link href="/bots">
                    <Button>
                      Gerenciar Bots
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="workflows" className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-muted-foreground">
                    Automatize processos de negócio com workflows
                  </p>
                  <Link href="/workflows">
                    <Button>
                      Gerenciar Workflows
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="templates" className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-muted-foreground">
                    Crie e reutilize templates de comunicação
                  </p>
                  <Link href="/templates">
                    <Button>
                      Gerenciar Templates
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
