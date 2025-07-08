"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import {
  ShoppingCart,
  Package,
  Store,
  Truck,
  ExternalLink,
  Check,
  Settings,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  DollarSign,
} from "lucide-react"
import Link from "next/link"

const ecommerceIntegrations = [
  {
    name: "Shopify",
    description: "Plataforma completa de e-commerce",
    icon: ShoppingCart,
    status: "Ativo",
    color: "bg-green-500",
    users: 1850,
    conversion: 87.4,
    stats: {
      orders: 1234,
      revenue: 245600,
      products: 456
    }
  },
  {
    name: "WooCommerce",
    description: "E-commerce para WordPress",
    icon: Store,
    status: "Ativo",
    color: "bg-purple-500",
    users: 2100,
    conversion: 92.1,
    stats: {
      orders: 2890,
      revenue: 387200,
      products: 678
    }
  },
  {
    name: "Magento",
    description: "Plataforma enterprise de e-commerce",
    icon: Package,
    status: "Ativo",
    color: "bg-orange-500",
    users: 980,
    conversion: 85.7,
    stats: {
      orders: 756,
      revenue: 189300,
      products: 234
    }
  },
  {
    name: "Mercado Livre",
    description: "Marketplace líder na América Latina",
    icon: Truck,
    status: "Configurando",
    color: "bg-yellow-500",
    users: 0,
    conversion: 0,
    stats: {
      orders: 0,
      revenue: 0,
      products: 0
    }
  }
]

const ecommerceMetrics = [
  {
    title: "Pedidos Hoje",
    value: "347",
    change: "+18.2%",
    changeType: "positive",
    icon: ShoppingCart
  },
  {
    title: "Receita Total",
    value: "R$ 822.100",
    change: "+15.7%",
    changeType: "positive",
    icon: DollarSign
  },
  {
    title: "Produtos Ativos",
    value: "1.368",
    change: "+12.3%",
    changeType: "positive",
    icon: Package
  },
  {
    title: "Taxa de Conversão",
    value: "4.2%",
    change: "+0.8%",
    changeType: "positive",
    icon: Target
  }
]

const recentOrders = [
  {
    id: "#12345",
    customer: "João Silva",
    platform: "Shopify",
    value: "R$ 298,50",
    status: "Processando",
    date: "2h atrás"
  },
  {
    id: "#12346",
    customer: "Maria Santos",
    platform: "WooCommerce",
    value: "R$ 456,80",
    status: "Enviado",
    date: "4h atrás"
  },
  {
    id: "#12347",
    customer: "Carlos Oliveira",
    platform: "Magento",
    value: "R$ 189,90",
    status: "Entregue",
    date: "1d atrás"
  }
]

export default function EcommerceIntegrations() {
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
                <BreadcrumbPage>E-commerce</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Integrações de E-commerce</h1>
            <p className="text-muted-foreground">
              Gerencie suas lojas online e sincronize pedidos
            </p>
          </div>
          <Button>
            <Settings className="mr-2 h-4 w-4" />
            Configurar Nova Integração
          </Button>
        </div>

        {/* Métricas de E-commerce */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {ecommerceMetrics.map((metric) => (
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
          {ecommerceIntegrations.map((integration) => (
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
                      <span>Pedidos</span>
                      <span className="font-semibold">{integration.stats.orders.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Receita</span>
                      <span className="font-semibold">R$ {integration.stats.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Produtos</span>
                      <span className="font-semibold">{integration.stats.products.toLocaleString()}</span>
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

        {/* Pedidos Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Recentes</CardTitle>
            <CardDescription>
              Últimos pedidos de todas as plataformas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{order.id} - {order.customer}</p>
                      <p className="text-sm text-muted-foreground">{order.platform} • {order.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={
                      order.status === 'Entregue' ? 'default' : 
                      order.status === 'Enviado' ? 'secondary' : 'outline'
                    }>
                      {order.status}
                    </Badge>
                    <span className="font-semibold">{order.value}</span>
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
              Gerencie suas integrações de e-commerce
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <Package className="mr-2 h-4 w-4" />
                Sincronizar Produtos
              </Button>
              <Button variant="outline" size="sm">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Processar Pedidos
              </Button>
              <Button variant="outline" size="sm">
                <BarChart3 className="mr-2 h-4 w-4" />
                Relatório de Vendas
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Configurar Webhook
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
