"use client"

import { DASHBOARD_WIDGETS, UserProfile } from "@/lib/dashboard-widgets"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Calendar,
  Download,
  Filter,
  Settings,
  PieChart,
  LineChart,
  Activity,
} from "lucide-react"

const analyticsWidgets = [
  'sales-funnel',
  'ml-predictions',
  'export-data',
  'filter-dashboard',
  'custom-reports',
  'performance-analytics',
  'user-behavior',
  'conversion-tracking',
  'revenue-analysis',
  'traffic-sources'
]

export default function AnalyticsPage() {
  const widgets = DASHBOARD_WIDGETS.filter(widget => analyticsWidgets.includes(widget.id))

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Analytics</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Analytics Avançado</h1>
            <p className="text-muted-foreground">
              Análise detalhada de performance e insights de negócio
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button>
              <Settings className="mr-2 h-4 w-4" />
              Configurar
            </Button>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 245.680</div>
              <p className="text-xs text-green-600">+12.5% em relação ao mês anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversões</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.247</div>
              <p className="text-xs text-green-600">+8.3% em relação ao mês anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.942</div>
              <p className="text-xs text-green-600">+15.7% em relação ao mês anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">14.2%</div>
              <p className="text-xs text-green-600">+2.1% em relação ao mês anterior</p>
            </CardContent>
          </Card>
        </div>

        {/* Funil de Vendas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Funil de Vendas
            </CardTitle>
            <CardDescription>
              Acompanhe o progresso dos leads através do funil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span>Visitantes</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-64 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full w-full"></div>
                  </div>
                  <span className="font-semibold">12.456</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Leads</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-64 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-2/3"></div>
                  </div>
                  <span className="font-semibold">8.096</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span>Oportunidades</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-64 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full w-1/3"></div>
                  </div>
                  <span className="font-semibold">4.360</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span>Clientes</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-64 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full w-1/6"></div>
                  </div>
                  <span className="font-semibold">1.867</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gráficos de Performance */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Receita por Período
              </CardTitle>
              <CardDescription>
                Evolução da receita nos últimos 12 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border rounded-lg">
                <div className="text-center">
                  <LineChart className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Gráfico de Receita</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Distribuição por Canal
              </CardTitle>
              <CardDescription>
                Origem dos seus clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border rounded-lg">
                <div className="text-center">
                  <PieChart className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Gráfico de Canais</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Predições de ML */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Predições de Machine Learning
            </CardTitle>
            <CardDescription>
              Insights baseados em IA para otimizar suas estratégias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Previsão de Vendas</h4>
                <p className="text-2xl font-bold text-green-600">R$ 89.450</p>
                <p className="text-sm text-muted-foreground">Próximos 30 dias</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Churn Previsto</h4>
                <p className="text-2xl font-bold text-red-600">3.2%</p>
                <p className="text-sm text-muted-foreground">Próximos 30 dias</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Oportunidades</h4>
                <p className="text-2xl font-bold text-blue-600">247</p>
                <p className="text-sm text-muted-foreground">Leads quentes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Relatórios Customizados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Relatórios Personalizados
            </CardTitle>
            <CardDescription>
              Crie e agende relatórios customizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Relatório de Vendas
              </Button>
              <Button variant="outline" size="sm">
                <BarChart3 className="mr-2 h-4 w-4" />
                Análise de Conversão
              </Button>
              <Button variant="outline" size="sm">
                <Users className="mr-2 h-4 w-4" />
                Comportamento do Usuário
              </Button>
              <Button variant="outline" size="sm">
                <Target className="mr-2 h-4 w-4" />
                Performance de Campanhas
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Criar Relatório Personalizado
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
