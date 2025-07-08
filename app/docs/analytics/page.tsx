"use client"

import { useState } from "react"
import { 
  TrendingUp, 
  ArrowLeft, 
  BarChart3, 
  PieChart, 
  LineChart,
  Download,
  Filter,
  Calendar,
  Users,
  Eye,
  MousePointer,
  Target,
  DollarSign,
  MessageSquare,
  Clock,
  Zap,
  Settings
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

const kpis = [
  {
    name: "Contatos Totais",
    value: "2,847",
    change: "+12.5%",
    trend: "up",
    description: "Total de contatos na base",
    icon: Users,
    color: "blue"
  },
  {
    name: "Taxa de Conversão",
    value: "23.4%",
    change: "+5.7%",
    trend: "up",
    description: "Leads convertidos em clientes",
    icon: Target,
    color: "green"
  },
  {
    name: "Revenue Mensal",
    value: "R$ 85.2K",
    change: "+18.3%",
    trend: "up",
    description: "Receita gerada no mês",
    icon: DollarSign,
    color: "emerald"
  },
  {
    name: "Mensagens Enviadas",
    value: "15,420",
    change: "+8.1%",
    trend: "up",
    description: "Total de mensagens no período",
    icon: MessageSquare,
    color: "purple"
  },
  {
    name: "Tempo Médio de Resposta",
    value: "2.3min",
    change: "-15.2%",
    trend: "down",
    description: "Tempo médio para primeira resposta",
    icon: Clock,
    color: "orange"
  },
  {
    name: "Taxa de Abertura",
    value: "89.2%",
    change: "+3.4%",
    trend: "up",
    description: "Mensagens abertas vs enviadas",
    icon: Eye,
    color: "indigo"
  }
]

const dashboardWidgets = [
  {
    title: "Funil de Vendas",
    description: "Visualização do pipeline de vendas",
    type: "funnel",
    features: ["Múltiplos estágios", "Drag & drop", "Filtros avançados"],
    complexity: "Médio"
  },
  {
    title: "Gráfico de Conversões",
    description: "Análise temporal de conversões",
    type: "line",
    features: ["Múltiplas séries", "Zoom interativo", "Comparação de períodos"],
    complexity: "Básico"
  },
  {
    title: "Mapa de Calor",
    description: "Atividade de usuários por horário",
    type: "heatmap",
    features: ["Interatividade", "Tooltips", "Gradientes customizáveis"],
    complexity: "Avançado"
  },
  {
    title: "Métricas em Tempo Real",
    description: "KPIs atualizados automaticamente",
    type: "realtime",
    features: ["WebSocket", "Auto-refresh", "Alertas"],
    complexity: "Avançado"
  },
  {
    title: "Distribuição por Segmento",
    description: "Análise demográfica dos contatos",
    type: "pie",
    features: ["Legendas interativas", "Drill-down", "Exportação"],
    complexity: "Básico"
  },
  {
    title: "Performance de Campanhas",
    description: "ROI e métricas de campanhas",
    type: "bar",
    features: ["Comparações", "Filtros temporais", "Benchmarks"],
    complexity: "Médio"
  }
]

const reportTypes = [
  {
    name: "Relatório Executivo",
    description: "Visão geral para gestores e diretores",
    frequency: "Mensal",
    format: "PDF/Excel",
    metrics: ["KPIs principais", "Trends", "Insights estratégicos"],
    automation: true
  },
  {
    name: "Relatório Operacional",
    description: "Métricas detalhadas para equipes",
    frequency: "Semanal",
    format: "Excel/Dashboard",
    metrics: ["Performance individual", "Atividades", "Conversões"],
    automation: true
  },
  {
    name: "Relatório de Campanhas",
    description: "Performance de campanhas de marketing",
    frequency: "Por campanha",
    format: "PDF/Dashboard",
    metrics: ["ROI", "Reach", "Engagement", "Conversões"],
    automation: false
  },
  {
    name: "Relatório Financeiro",
    description: "Análise financeira e de receita",
    frequency: "Mensal/Trimestral",
    format: "Excel/PDF",
    metrics: ["Revenue", "LTV", "CAC", "Margem"],
    automation: true
  },
  {
    name: "Relatório de Compliance",
    description: "Conformidade LGPD e auditoria",
    frequency: "Trimestral",
    format: "PDF",
    metrics: ["Consentimentos", "Opt-outs", "Violações"],
    automation: false
  }
]

const integrationOptions = [
  {
    name: "Google Analytics",
    description: "Integração com GA4 para tracking avançado",
    setup: "Configurar GTM e eventos customizados",
    benefits: ["Tracking de conversões", "Análise de comportamento", "Atribuição"]
  },
  {
    name: "Meta Pixel",
    description: "Tracking para Facebook e Instagram Ads",
    setup: "Instalar pixel e configurar eventos",
    benefits: ["Otimização de campanhas", "Lookalike audiences", "Retargeting"]
  },
  {
    name: "Google Data Studio",
    description: "Dashboards customizados e compartilháveis",
    setup: "Conectar via API ou BigQuery",
    benefits: ["Visualizações avançadas", "Colaboração", "Templates"]
  },
  {
    name: "Power BI",
    description: "Business Intelligence da Microsoft",
    setup: "Connector personalizado ou API",
    benefits: ["Dashboards corporativos", "Integração Office", "AI insights"]
  },
  {
    name: "Mixpanel",
    description: "Analytics de produto e eventos",
    setup: "SDK e configuração de eventos",
    benefits: ["Event tracking", "Cohort analysis", "A/B testing"]
  },
  {
    name: "HubSpot",
    description: "Sincronização bidirecional de dados",
    setup: "API integration com webhooks",
    benefits: ["Unified customer view", "Marketing automation", "Sales insights"]
  }
]

export default function AnalyticsPage() {
  const [selectedKPI, setSelectedKPI] = useState<string | null>(null)

  const getIconColor = (color: string) => {
    switch (color) {
      case "blue": return "text-blue-600 bg-blue-100 dark:bg-blue-900/20"
      case "green": return "text-green-600 bg-green-100 dark:bg-green-900/20"
      case "emerald": return "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20"
      case "purple": return "text-purple-600 bg-purple-100 dark:bg-purple-900/20"
      case "orange": return "text-orange-600 bg-orange-100 dark:bg-orange-900/20"
      case "indigo": return "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/20"
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-900/20"
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Básico": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      case "Médio": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
      case "Avançado": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  const getWidgetIcon = (type: string) => {
    switch (type) {
      case "funnel": return TrendingUp
      case "line": return LineChart
      case "heatmap": return BarChart3
      case "realtime": return Zap
      case "pie": return PieChart
      case "bar": return BarChart3
      default: return BarChart3
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/docs">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Documentação
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">Analytics e Relatórios</h1>
            <p className="text-muted-foreground">
              Dashboards, métricas e relatórios avançados para tomada de decisão
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <Badge variant="secondary">Analytics</Badge>
          <Badge variant="outline">Dashboards</Badge>
          <Badge variant="outline">Relatórios</Badge>
        </div>
      </div>

      {/* KPIs Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Principais Indicadores (KPIs)
          </CardTitle>
          <CardDescription>
            Métricas essenciais para monitoramento do negócio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kpis.map((kpi) => {
              const IconComponent = kpi.icon
              return (
                <Card 
                  key={kpi.name} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedKPI === kpi.name ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedKPI(selectedKPI === kpi.name ? null : kpi.name)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getIconColor(kpi.color)}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{kpi.name}</p>
                          <p className="text-2xl font-bold">{kpi.value}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {kpi.change}
                        </div>
                        <div className="text-xs text-muted-foreground">vs. mês anterior</div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">{kpi.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="dashboards" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
          <TabsTrigger value="configuration">Configuração</TabsTrigger>
        </TabsList>

        {/* Dashboards Tab */}
        <TabsContent value="dashboards" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Widgets de Dashboard</CardTitle>
              <CardDescription>
                Componentes disponíveis para criar dashboards personalizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardWidgets.map((widget, index) => {
                  const IconComponent = getWidgetIcon(widget.type)
                  return (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            <IconComponent className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{widget.title}</CardTitle>
                            <Badge 
                              className={getComplexityColor(widget.complexity)} 
                              variant="secondary"
                            >
                              {widget.complexity}
                            </Badge>
                          </div>
                        </div>
                        <CardDescription>{widget.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium mb-2">Recursos:</h4>
                            <ul className="space-y-1">
                              {widget.features.map((feature, idx) => (
                                <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              <Eye className="h-4 w-4 mr-1" />
                              Preview
                            </Button>
                            <Button size="sm" variant="outline">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dashboard Builder</CardTitle>
              <CardDescription>
                Construtor visual de dashboards personalizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold">Recursos Disponíveis:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <MousePointer className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Drag & Drop Interface</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-green-500" />
                        <span className="text-sm">15+ Tipos de Gráficos</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">Filtros Dinâmicos</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-orange-500" />
                        <span className="text-sm">Seletores de Período</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold">Funcionalidades Avançadas:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Atualizações em Tempo Real</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Download className="h-4 w-4 text-indigo-500" />
                        <span className="text-sm">Exportação (PDF/Excel)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-pink-500" />
                        <span className="text-sm">Compartilhamento de Dashboards</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-red-500" />
                        <span className="text-sm">Alertas Inteligentes</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <Separator />
                <div className="flex gap-4">
                  <Button>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Criar Novo Dashboard
                  </Button>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Templates
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tipos de Relatórios</CardTitle>
              <CardDescription>
                Relatórios predefinidos e personalizáveis para diferentes necessidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reportTypes.map((report, index) => (
                  <Card key={index} className="border-2">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{report.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{report.frequency}</Badge>
                          <Badge variant="outline">{report.format}</Badge>
                          {report.automation && (
                            <Badge variant="secondary">
                              <Zap className="h-3 w-3 mr-1" />
                              Auto
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardDescription>{report.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Métricas Incluídas:</h4>
                          <div className="flex flex-wrap gap-2">
                            {report.metrics.map((metric, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {metric}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Baixar
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4 mr-1" />
                            Configurar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agendamento de Relatórios</CardTitle>
              <CardDescription>
                Configure envio automático de relatórios por email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-semibold">Frequência</h3>
                    <p className="text-sm text-muted-foreground">
                      Diário, semanal, mensal ou personalizado
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <h3 className="font-semibold">Destinatários</h3>
                    <p className="text-sm text-muted-foreground">
                      Múltiplos emails e grupos
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Download className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <h3 className="font-semibold">Formatos</h3>
                    <p className="text-sm text-muted-foreground">
                      PDF, Excel, CSV ou links diretos
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integrações de Analytics</CardTitle>
              <CardDescription>
                Conecte com ferramentas externas para análises avançadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {integrationOptions.map((integration, index) => (
                  <Card key={index} className="border-2 hover:border-blue-300 transition-colors">
                    <CardHeader>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <CardDescription>{integration.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Setup:</h4>
                          <p className="text-sm text-muted-foreground">{integration.setup}</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Benefícios:</h4>
                          <ul className="space-y-1">
                            {integration.benefits.map((benefit, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="flex-1">
                            Conectar
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="configuration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Analytics</CardTitle>
              <CardDescription>
                Configurar tracking, goals e eventos personalizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Eventos de Tracking</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-medium">Eventos Padrão:</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Page View</span>
                          <Badge variant="secondary">Ativo</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Contact Created</span>
                          <Badge variant="secondary">Ativo</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Message Sent</span>
                          <Badge variant="secondary">Ativo</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Conversion</span>
                          <Badge variant="secondary">Ativo</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium">Eventos Customizados:</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Campaign Click</span>
                          <Badge variant="outline">Configurar</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">File Download</span>
                          <Badge variant="outline">Configurar</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Form Submit</span>
                          <Badge variant="outline">Configurar</Badge>
                        </div>
                        <Button size="sm" variant="outline" className="w-full">
                          + Adicionar Evento
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Goals e Conversões</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <Target className="h-8 w-8 mx-auto mb-2 text-green-600" />
                            <h4 className="font-medium">Lead Generation</h4>
                            <p className="text-sm text-muted-foreground">Meta: 100/mês</p>
                            <Progress value={75} className="mt-2" />
                            <p className="text-xs text-muted-foreground mt-1">75 de 100</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <DollarSign className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                            <h4 className="font-medium">Revenue</h4>
                            <p className="text-sm text-muted-foreground">Meta: R$ 100K/mês</p>
                            <Progress value={85} className="mt-2" />
                            <p className="text-xs text-muted-foreground mt-1">R$ 85K de R$ 100K</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                            <h4 className="font-medium">New Contacts</h4>
                            <p className="text-sm text-muted-foreground">Meta: 500/mês</p>
                            <Progress value={60} className="mt-2" />
                            <p className="text-xs text-muted-foreground mt-1">300 de 500</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Configurações Avançadas</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Sampling de Dados</h4>
                        <p className="text-sm text-muted-foreground">Reduzir volume para melhor performance</p>
                      </div>
                      <Badge variant="outline">100%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Retenção de Dados</h4>
                        <p className="text-sm text-muted-foreground">Tempo de armazenamento dos dados</p>
                      </div>
                      <Badge variant="outline">24 meses</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Filtros de Bot</h4>
                        <p className="text-sm text-muted-foreground">Excluir tráfego de bots conhecidos</p>
                      </div>
                      <Badge variant="secondary">Ativo</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Links */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Links Úteis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/docs/api">
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                API Reference
              </Button>
            </Link>
            <Link href="/docs/integrations">
              <Button variant="outline" className="w-full justify-start">
                <Zap className="h-4 w-4 mr-2" />
                Integrações
              </Button>
            </Link>
            <Link href="/docs/best-practices">
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Melhores Práticas
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
