"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Database,
  ExternalLink,
  Check,
  Settings,
  Users,
  Target,
  Activity,
  LineChart,
} from "lucide-react"
import Link from "next/link"

const biIntegrations = [
  {
    name: "Google Analytics",
    description: "Análise detalhada do comportamento do usuário",
    icon: BarChart3,
    status: "Ativo",
    color: "bg-orange-500",
    users: 2100,
    conversion: 94.2,
    stats: {
      sessions: 45600,
      bounceRate: 34.5,
      avgTime: 245
    }
  },
  {
    name: "Tableau",
    description: "Visualização avançada de dados",
    icon: PieChart,
    status: "Ativo",
    color: "bg-blue-500",
    users: 850,
    conversion: 91.8,
    stats: {
      dashboards: 23,
      reports: 67,
      users: 45
    }
  },
  {
    name: "Power BI",
    description: "Business Intelligence da Microsoft",
    icon: Database,
    status: "Ativo",
    color: "bg-yellow-600",
    users: 1200,
    conversion: 88.7,
    stats: {
      datasets: 34,
      reports: 89,
      refreshes: 156
    }
  },
  {
    name: "Looker Studio",
    description: "Relatórios interativos do Google",
    icon: LineChart,
    status: "Configurando",
    color: "bg-green-500",
    users: 0,
    conversion: 0,
    stats: {
      reports: 0,
      datasources: 0,
      viewers: 0
    }
  }
]

const biMetrics = [
  {
    title: "Relatórios Ativos",
    value: "89",
    change: "+23.1%",
    changeType: "positive",
    icon: BarChart3
  },
  {
    title: "Fontes de Dados",
    value: "156",
    change: "+8.7%",
    changeType: "positive",
    icon: Database
  },
  {
    title: "Usuários Ativos",
    value: "4.150",
    change: "+12.3%",
    changeType: "positive",
    icon: Users
  },
  {
    title: "Atualizações/Dia",
    value: "342",
    change: "+15.2%",
    changeType: "positive",
    icon: Activity
  }
]

const recentReports = [
  {
    name: "Relatório de Vendas Q4",
    type: "Vendas",
    lastUpdate: "2h atrás",
    views: 156,
    status: "Atualizado"
  },
  {
    name: "Análise de Conversão",
    type: "Marketing",
    lastUpdate: "4h atrás",
    views: 89,
    status: "Atualizado"
  },
  {
    name: "KPIs Operacionais",
    type: "Operações",
    lastUpdate: "1d atrás",
    views: 234,
    status: "Pendente"
  }
]

export default function BIIntegrations() {
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
                <BreadcrumbPage>Business Intelligence</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Integrações de Business Intelligence</h1>
            <p className="text-muted-foreground">
              Analise dados e gere insights através de ferramentas de BI
            </p>
          </div>
          <Button>
            <Settings className="mr-2 h-4 w-4" />
            Configurar Nova Integração
          </Button>
        </div>

        {/* Métricas de BI */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {biMetrics.map((metric) => (
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
          {biIntegrations.map((integration) => (
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
                    {integration.name === 'Google Analytics' && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span>Sessões</span>
                          <span className="font-semibold">{integration.stats.sessions?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Taxa de Rejeição</span>
                          <span className="font-semibold">{integration.stats.bounceRate}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Tempo Médio</span>
                          <span className="font-semibold">{integration.stats.avgTime}s</span>
                        </div>
                      </>
                    )}
                    {integration.name === 'Tableau' && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span>Dashboards</span>
                          <span className="font-semibold">{integration.stats.dashboards}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Relatórios</span>
                          <span className="font-semibold">{integration.stats.reports}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Usuários</span>
                          <span className="font-semibold">{integration.stats.users}</span>
                        </div>
                      </>
                    )}
                    {integration.name === 'Power BI' && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span>Datasets</span>
                          <span className="font-semibold">{integration.stats.datasets}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Relatórios</span>
                          <span className="font-semibold">{integration.stats.reports}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Atualizações</span>
                          <span className="font-semibold">{integration.stats.refreshes}</span>
                        </div>
                      </>
                    )}
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

        {/* Relatórios Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Relatórios Recentes</CardTitle>
            <CardDescription>
              Seus relatórios mais atualizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div key={report.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <p className="text-sm text-muted-foreground">{report.type} • {report.lastUpdate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={report.status === 'Atualizado' ? 'default' : 'secondary'}>
                      {report.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{report.views} visualizações</span>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
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
              Gerencie suas integrações de BI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <BarChart3 className="mr-2 h-4 w-4" />
                Criar Novo Relatório
              </Button>
              <Button variant="outline" size="sm">
                <Database className="mr-2 h-4 w-4" />
                Configurar Fonte de Dados
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Agendar Atualizações
              </Button>
              <Button variant="outline" size="sm">
                <Check className="mr-2 h-4 w-4" />
                Revisar Dashboards
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
