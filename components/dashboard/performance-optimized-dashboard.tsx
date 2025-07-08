"use client"

import React, { Suspense, lazy } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LazyWidget } from "./lazy-widget"
import { RealTimeNotifications } from "./real-time-notifications"
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Target,
  Activity,
  MessageSquare,
  Calendar,
  Settings,
  Zap
} from 'lucide-react'
import WorkflowAutomationWidget from './workflow-automation-widget'
import BusinessIntelligenceWidget from './business-intelligence-widget'
import TelecommunicationsWidget from './telecommunications-widget'
import SecurityComplianceWidget from './security-compliance-widget'
import SocialMediaMarketingWidget from './social-media-marketing-widget'
import IntegrationsAPIWidget from './integrations-api-widget'

// Lazy load dos componentes pesados
const CustomizableDashboard = lazy(() => import('./customizable-dashboard').then(module => ({ default: module.CustomizableDashboard })))
const InteractiveChartsWidget = lazy(() => import('./interactive-charts-widget').then(module => ({ default: module.InteractiveChartsWidget })))
const SalesPredictionWidget = lazy(() => import('./sales-prediction-widget').then(module => ({ default: module.SalesPredictionWidget })))

// Componentes leves para carregamento imediato
const QuickStats = React.memo(() => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">R$ 45.231,89</div>
        <p className="text-xs text-muted-foreground">
          +20.1% em relação ao mês passado
        </p>
      </CardContent>
    </Card>
    
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Contatos Ativos</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">2.350</div>
        <p className="text-xs text-muted-foreground">
          +180 novos este mês
        </p>
      </CardContent>
    </Card>
    
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">12.5%</div>
        <p className="text-xs text-muted-foreground">
          +2.3% em relação ao mês passado
        </p>
      </CardContent>
    </Card>
    
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Negócios em Andamento</CardTitle>
        <Target className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">73</div>
        <p className="text-xs text-muted-foreground">
          Valor total: R$ 89.500
        </p>
      </CardContent>
    </Card>
  </div>
))

const RecentActivity = React.memo(() => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle>Atividades Recentes</CardTitle>
        <Badge variant="secondary">Tempo real</Badge>
      </div>
      <CardDescription>Últimas atualizações do seu CRM</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {[
          { type: 'lead', title: 'Novo lead capturado', time: 'há 2 min', icon: Users },
          { type: 'deal', title: 'Negócio movido para negociação', time: 'há 15 min', icon: Target },
          { type: 'message', title: 'Nova mensagem recebida', time: 'há 1 hora', icon: MessageSquare },
          { type: 'meeting', title: 'Reunião agendada', time: 'há 2 horas', icon: Calendar }
        ].map((activity, i) => (
          <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="p-2 bg-primary/10 rounded-full">
              <activity.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{activity.title}</p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
))

const PerformanceOptimizedDashboard = () => {
  const [activeTab, setActiveTab] = React.useState('overview')

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header com notificações */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard CRM Pro</h2>
          <p className="text-muted-foreground">
            Visão geral otimizada para alta performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <RealTimeNotifications />
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </Button>
        </div>
      </div>

      {/* Tabs principais */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Visão Geral</span>
          </TabsTrigger>
          <TabsTrigger value="customizable" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Customizável</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span className="hidden sm:inline">Performance</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab Overview - Carregamento rápido */}
        <TabsContent value="overview" className="space-y-4">
          <QuickStats />
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
              <LazyWidget
                id="interactive-charts"
                title="Gráficos Interativos"
                description="Análise visual de vendas"
                importFunction={() => import('./interactive-charts-widget')}
                priority="high"
              />
            </div>
            <div className="col-span-3">
              <RecentActivity />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <LazyWidget
              id="sales-prediction"
              title="Previsão de Vendas"
              description="IA para predição de resultados"
              importFunction={() => import('./sales-prediction-widget')}
              priority="medium"
            />
            <LazyWidget
              id="sales-funnel"
              title="Funil de Vendas"
              description="Acompanhamento do pipeline"
              importFunction={() => import('./sales-funnel-widget')}
              priority="medium"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <LazyWidget
              id="workflow-automation"
              title="Automações"
              description="Gerencie suas automações"
              importFunction={() => import('./workflow-automation-widget')}
              priority="medium"
            />
            <LazyWidget
              id="business-intelligence"
              title="Business Intelligence"
              description="Integração com ferramentas de BI"
              importFunction={() => import('./business-intelligence-widget')}
              priority="medium"
            />
            <LazyWidget
              id="telecommunications"
              title="Central Telefônica"
              description="Gerencie suas comunicações"
              importFunction={() => import('./telecommunications-widget')}
              priority="medium"
            />
            <LazyWidget
              id="security-compliance"
              title="Segurança e Conformidade"
              description="Monitoramento de segurança"
              importFunction={() => import('./security-compliance-widget')}
              priority="medium"
            />
            <LazyWidget
              id="social-media-marketing"
              title="Marketing em Mídias Sociais"
              description="Gerencie suas campanhas"
              importFunction={() => import('./social-media-marketing-widget')}
              priority="medium"
            />
            <LazyWidget
              id="integrations-api"
              title="Integrações & APIs"
              description="Monitoramento de integrações"
              importFunction={() => import('./integrations-api-widget')}
              priority="medium"
            />
          </div>
        </TabsContent>

        {/* Tab Customizable - Dashboard personalizado */}
        <TabsContent value="customizable" className="space-y-4">
          <Suspense fallback={
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))}
              </div>
            </div>
          }>
            <CustomizableDashboard />
          </Suspense>
        </TabsContent>

        {/* Tab Analytics - Análises avançadas */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <LazyWidget
              id="heatmap"
              title="Mapa de Calor"
              description="Análise de atividades por horário"
              importFunction={() => import('./heatmap-widget')}
              priority="low"
            />
            <LazyWidget
              id="customer-timeline"
              title="Timeline do Cliente"
              description="Jornada completa do cliente"
              importFunction={() => import('./customer-timeline-widget')}
              priority="low"
            />
          </div>
          
          <LazyWidget
            id="bi-integration"
            title="Business Intelligence"
            description="Integração com ferramentas de BI"
            importFunction={() => import('./bi-integration-widget')}
            priority="low"
          />
        </TabsContent>

        {/* Tab Performance - Métricas e otimização */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Métricas de Performance
              </CardTitle>
              <CardDescription>
                Monitoramento em tempo real da aplicação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">2.1s</div>
                  <p className="text-sm text-muted-foreground">Time to Interactive</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">0.8s</div>
                  <p className="text-sm text-muted-foreground">First Contentful Paint</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">0.05</div>
                  <p className="text-sm text-muted-foreground">Cumulative Layout Shift</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <LazyWidget
            id="performance-monitor"
            title="Monitor de Performance"
            description="Análise detalhada de performance"
            importFunction={() => import('./performance-monitor-widget')}
            priority="low"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PerformanceOptimizedDashboard
