"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import {
  CreditCard,
  DollarSign,
  Banknote,
  Receipt,
  ExternalLink,
  Check,
  Settings,
  TrendingUp,
  Users,
  Target,
  BarChart3,
} from "lucide-react"
import Link from "next/link"

const paymentIntegrations = [
  {
    name: "Stripe",
    description: "Plataforma completa de pagamentos online",
    icon: CreditCard,
    status: "Ativo",
    color: "bg-blue-500",
    users: 1250,
    conversion: 89.5,
    stats: {
      transactions: 3420,
      revenue: 89500,
      growth: 12.3
    }
  },
  {
    name: "PayPal",
    description: "Pagamentos seguros e confiáveis",
    icon: DollarSign,
    status: "Ativo",
    color: "bg-blue-600",
    users: 2100,
    conversion: 92.1,
    stats: {
      transactions: 5630,
      revenue: 156000,
      growth: 8.7
    }
  },
  {
    name: "PagSeguro",
    description: "Solução brasileira de pagamentos",
    icon: Banknote,
    status: "Ativo",
    color: "bg-green-500",
    users: 890,
    conversion: 85.3,
    stats: {
      transactions: 2100,
      revenue: 67200,
      growth: 15.2
    }
  },
  {
    name: "Mercado Pago",
    description: "Pagamentos rápidos e seguros",
    icon: Receipt,
    status: "Configurando",
    color: "bg-yellow-500",
    users: 0,
    conversion: 0,
    stats: {
      transactions: 0,
      revenue: 0,
      growth: 0
    }
  }
]

const paymentMetrics = [
  {
    title: "Transações Hoje",
    value: "2,847",
    change: "+12.5%",
    changeType: "positive",
    icon: Receipt
  },
  {
    title: "Receita Total",
    value: "R$ 312.700",
    change: "+8.3%",
    changeType: "positive",
    icon: DollarSign
  },
  {
    title: "Taxa de Conversão",
    value: "89.2%",
    change: "+2.1%",
    changeType: "positive",
    icon: Target
  },
  {
    title: "Usuários Ativos",
    value: "4.240",
    change: "+15.7%",
    changeType: "positive",
    icon: Users
  }
]

export default function PaymentsIntegrations() {
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
                <BreadcrumbPage>Pagamentos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Integrações de Pagamentos</h1>
            <p className="text-muted-foreground">
              Gerencie suas integrações de pagamento e processe transações
            </p>
          </div>
          <Button>
            <Settings className="mr-2 h-4 w-4" />
            Configurar Nova Integração
          </Button>
        </div>

        {/* Métricas de Pagamentos */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {paymentMetrics.map((metric) => (
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
          {paymentIntegrations.map((integration) => (
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
                      <span>Transações</span>
                      <span className="font-semibold">{integration.stats.transactions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Receita</span>
                      <span className="font-semibold">R$ {integration.stats.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Crescimento</span>
                      <span className="font-semibold text-green-600">+{integration.stats.growth}%</span>
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
                    <span className="text-sm">{integration.conversion}% conversão</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Gerencie suas integrações de pagamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <Receipt className="mr-2 h-4 w-4" />
                Ver Todas as Transações
              </Button>
              <Button variant="outline" size="sm">
                <BarChart3 className="mr-2 h-4 w-4" />
                Relatório de Pagamentos
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Configurar Webhooks
              </Button>
              <Button variant="outline" size="sm">
                <Check className="mr-2 h-4 w-4" />
                Aprovar Pagamentos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
