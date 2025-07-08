"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import {
  Zap,
  Settings,
  Workflow,
  Bot,
  ExternalLink,
  Check,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Play,
  Pause,
} from "lucide-react"
import Link from "next/link"

const automationIntegrations = [
  {
    name: "Zapier",
    description: "Conecte aplicativos e automatize fluxos",
    icon: Zap,
    status: "Ativo",
    color: "bg-orange-500",
    users: 1450,
    conversion: 96.2,
    stats: {
      workflows: 67,
      executions: 15680,
      success: 94.2
    }
  },
  {
    name: "n8n",
    description: "Automação de fluxos de trabalho",
    icon: Workflow,
    status: "Ativo",
    color: "bg-pink-500",
    users: 890,
    conversion: 92.8,
    stats: {
      workflows: 34,
      executions: 8940,
      success: 97.1
    }
  },
  {
    name: "Microsoft Power Automate",
    description: "Automação empresarial",
    icon: Bot,
    status: "Ativo",
    color: "bg-blue-500",
    users: 2100,
    conversion: 89.5,
    stats: {
      workflows: 89,
      executions: 24570,
      success: 91.8
    }
  },
  {
    name: "IFTTT",
    description: "Se isso, então aquilo",
    icon: Settings,
    status: "Configurando",
    color: "bg-black",
    users: 0,
    conversion: 0,
    stats: {
      workflows: 0,
      executions: 0,
      success: 0
    }
  }
]

const automationMetrics = [
  {
    title: "Workflows Ativos",
    value: "190",
    change: "+15.2%",
    changeType: "positive",
    icon: Workflow
  },
  {
    title: "Execuções Hoje",
    value: "12.847",
    change: "+28.5%",
    changeType: "positive",
    icon: Play
  },
  {
    title: "Taxa de Sucesso",
    value: "94.2%",
    change: "+2.1%",
    changeType: "positive",
    icon: Target
  },
  {
    title: "Tempo Economizado",
    value: "156h",
    change: "+23.7%",
    changeType: "positive",
    icon: TrendingUp
  }
]

const recentWorkflows = [
  {
    name: "Sincronizar Leads CRM",
    platform: "Zapier",
    status: "Ativo",
    lastRun: "2 min atrás",
    executions: 1250,
    success: 98.4
  },
  {
    name: "Backup Automático",
    platform: "n8n",
    status: "Ativo",
    lastRun: "1h atrás",
    executions: 567,
    success: 100
  },
  {
    name: "Notificações Slack",
    platform: "Power Automate",
    status: "Pausado",
    lastRun: "2d atrás",
    executions: 2340,
    success: 89.2
  }
]

export default function AutomationIntegrations() {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/integrations">Integrações</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Automação</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Integrações de Automação</h1>
            <p className="text-muted-foreground">
              Automatize processos e otimize fluxos de trabalho
            </p>
          </div>
          <Button>
            <Settings className="mr-2 h-4 w-4" />
            Configurar Nova Integração
          </Button>
        </div>

        {/* Métricas de Automação */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {automationMetrics.map((metric) => (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <metric.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className={`text-xs ${metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change} em relação ao mês anterior
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Lista de Integrações */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {automationIntegrations.map((integration) => (
            <Card key={integration.name} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${integration.color}`}>
                    <integration.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <Badge 
                      variant={integration.status === 'Ativo' ? 'default' : 'secondary'}
                      className="mt-1"
                    >
                      {integration.status}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {integration.description}
                </p>
                
                {integration.status === 'Ativo' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Workflows</span>
                      <span className="font-semibold">{integration.stats.workflows}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Execuções</span>
                      <span className="font-semibold">{integration.stats.executions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Taxa de Sucesso</span>
                      <span className="font-semibold">{integration.stats.success}%</span>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{integration.users.toLocaleString()} usuários</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{integration.conversion}% uptime</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Workflows Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Workflows Recentes</CardTitle>
            <CardDescription>
              Status dos seus workflows automatizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentWorkflows.map((workflow, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Workflow className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{workflow.name}</p>
                      <p className="text-sm text-muted-foreground">{workflow.platform} • {workflow.lastRun}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={
                      workflow.status === 'Ativo' ? 'default' : 'secondary'
                    }>
                      {workflow.status}
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm font-medium">{workflow.executions.toLocaleString()} execuções</p>
                      <p className="text-xs text-muted-foreground">{workflow.success}% sucesso</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      {workflow.status === 'Ativo' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Gerencie suas integrações de automação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <Workflow className="mr-2 h-4 w-4" />
                Criar Workflow
              </Button>
              <Button variant="outline" size="sm">
                <Play className="mr-2 h-4 w-4" />
                Executar Todos
              </Button>
              <Button variant="outline" size="sm">
                <BarChart3 className="mr-2 h-4 w-4" />
                Relatório de Execuções
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Configurar Triggers
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
