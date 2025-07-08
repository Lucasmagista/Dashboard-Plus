"use client"

import { Suspense, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { StatCard, ActivityItem } from "@/components/dashboard/optimized-components"
import { DashboardLoadingSkeleton } from "@/components/ui/loading-skeleton"
import { LazyLoad } from "@/components/lazy-loading"
import { useCachedState } from "@/lib/cache"
import { usePerformanceMonitor } from "@/hooks/use-performance"
import {
  DollarSign,
  Users,
  TrendingUp,
  Target,
  MessageSquare,
  Phone,
  Mail,
} from "lucide-react"

// Dados mockados otimizados
const STATS_DATA = [
  {
    title: "Receita Total",
    value: "R$ 45.231,89",
    change: "+20,1%",
    trend: "up" as const,
    icon: DollarSign,
    description: "em relação ao mês passado",
  },
  {
    title: "Contatos Ativos",
    value: "2.847",
    change: "+12,5%",
    trend: "up" as const,
    icon: Users,
    description: "em relação ao mês passado",
  },
  {
    title: "Taxa de Conversão",
    value: "24,8%",
    change: "-2,1%",
    trend: "down" as const,
    icon: TrendingUp,
    description: "em relação ao mês passado",
  },
  {
    title: "Negócios Ativos",
    value: "234",
    change: "+8,2%",
    trend: "up" as const,
    icon: Target,
    description: "no funil",
  },
] as const

const ACTIVITIES_DATA = [
  {
    id: 1,
    type: "contact",
    title: "Novo contato adicionado",
    description: "Sarah Johnson da TechCorp",
    time: "há 2 minutos",
    icon: Users,
    status: "success" as const,
  },
  {
    id: 2,
    type: "deal",
    title: "Negócio movido para negociação",
    description: "R$ 15.000 - Licença de Software Empresarial",
    time: "há 15 minutos",
    icon: Target,
    status: "warning" as const,
  },
  {
    id: 3,
    type: "message",
    title: "Nova mensagem recebida",
    description: "Acompanhamento da proposta discutida",
    time: "há 1 hora",
    icon: MessageSquare,
    status: "info" as const,
  },
  {
    id: 4,
    type: "call",
    title: "Chamada agendada",
    description: "Demonstração com cliente potencial",
    time: "há 2 horas",
    icon: Phone,
    status: "success" as const,
  },
  {
    id: 5,
    type: "email",
    title: "Campanha de e-mail enviada",
    description: "Newsletter mensal para 1.247 assinantes",
    time: "há 3 horas",
    icon: Mail,
    status: "success" as const,
  },
] as const

export default function OptimizedDashboard() {
  // Hook de performance para monitoramento
  const metrics = usePerformanceMonitor()
  
  // Estado com cache
  const [refreshKey, setRefreshKey] = useCachedState('dashboard-refresh', 0, 60000)

  // Memoização dos componentes pesados
  const statsCards = useMemo(() => 
    STATS_DATA.map((stat, index) => (
      <StatCard key={`${stat.title}-${refreshKey}`} {...stat} />
    )), [refreshKey]
  )

  const recentActivities = useMemo(() =>
    ACTIVITIES_DATA.slice(0, 5).map((activity) => (
      <ActivityItem key={`${activity.id}-${refreshKey}`} {...activity} />
    )), [refreshKey]
  )

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Painel Principal</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="space-y-6">
          {/* Header otimizado */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Visão geral do seu negócio e atividades recentes
            </p>
          </div>

          {/* Stats Cards com Suspense */}
          <Suspense fallback={<DashboardLoadingSkeleton />}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {statsCards}
            </div>
          </Suspense>

          {/* Conteúdo principal com Lazy Loading */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <LazyLoad placeholder={<div className="col-span-4"><DashboardLoadingSkeleton /></div>}>
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Visão Geral de Vendas</CardTitle>
                  <CardDescription>
                    Performance de vendas dos últimos 6 meses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Placeholder para gráfico - será substituído por componente lazy */}
                  <div className="h-[300px] flex items-center justify-center bg-muted/10 rounded-lg">
                    <p className="text-muted-foreground">Gráfico de vendas carregando...</p>
                  </div>
                </CardContent>
              </Card>
            </LazyLoad>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Atividades Recentes</CardTitle>
                <CardDescription>
                  Últimas atividades da sua equipe
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-0">
                <div className="space-y-1">
                  {recentActivities}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Debug de Performance (apenas em desenvolvimento) */}
          {process.env.NODE_ENV === 'development' && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">Métricas de Performance</CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-1">
                <p>Tempo de Carregamento: {metrics.loadTime.toFixed(2)}ms</p>
                <p>Tempo de Renderização: {metrics.renderTime.toFixed(2)}ms</p>
                <p>Uso de Memória: {metrics.memoryUsage.toFixed(2)}MB</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </SidebarInset>
  )
}
