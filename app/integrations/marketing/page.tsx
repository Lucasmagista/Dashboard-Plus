"use client"

import { DASHBOARD_WIDGETS, UserProfile } from "@/lib/dashboard-widgets"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import {
  Mail,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  ExternalLink,
  Check,
  Settings,
  TrendingUp,
  Users,
  Target,
  BarChart3,
} from "lucide-react"
import Link from "next/link"

const marketingIntegrations = [
  {
    name: "Mailchimp",
    description: "Plataforma completa de email marketing",
    icon: Mail,
    status: "connected",
    category: "Email Marketing",
    features: ["Campanhas", "Automação", "Segmentação"],
  },
  {
    name: "HubSpot",
    description: "CRM e automação de marketing",
    icon: Target,
    status: "connected",
    category: "Marketing Automation",
    features: ["Lead Scoring", "Nurturing", "Analytics"],
  },
  {
    name: "Facebook Ads",
    description: "Publicidade no Facebook e Instagram",
    icon: Facebook,
    status: "connected",
    category: "Publicidade",
    features: ["Campanhas", "Pixel", "Remarketing"],
  },
  {
    name: "Google Ads",
    description: "Publicidade no Google",
    icon: BarChart3,
    status: "disconnected",
    category: "Publicidade",
    features: ["Search Ads", "Display", "Shopping"],
  },
  {
    name: "LinkedIn Ads",
    description: "Publicidade profissional no LinkedIn",
    icon: Linkedin,
    status: "disconnected",
    category: "Publicidade",
    features: ["Sponsored Content", "Lead Gen", "Message Ads"],
  },
]

export default function MarketingIntegrationsPage() {
  const userProfile: UserProfile = "marketing"

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Painel</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/integrations">Integrações</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Marketing</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <main className="flex-1 space-y-4 p-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Integrações de Marketing</h1>
            <p className="text-muted-foreground">
              Conecte suas ferramentas de marketing para maximizar resultados
            </p>
          </div>
          <Button size="sm">
            <ExternalLink className="mr-2 h-4 w-4" />
            Explorar Mais
          </Button>
        </div>

        {/* Marketing Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Integrações Ativas</CardTitle>
              <Check className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">de 5 disponíveis</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Campanhas Ativas</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Em execução</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leads Gerados</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">Este mês</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ROI Médio</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">234%</div>
              <p className="text-xs text-muted-foreground">+15% vs mês anterior</p>
            </CardContent>
          </Card>
        </div>

        {/* Marketing Integration Widget */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Central de Marketing
            </CardTitle>
            <CardDescription>Gerencie todas as suas integrações de marketing</CardDescription>
          </CardHeader>
          <CardContent>
            {DASHBOARD_WIDGETS.find(w => w.id === 'integracao-marketing')?.render()}
          </CardContent>
        </Card>

        {/* Available Integrations */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {marketingIntegrations.map((integration) => (
            <Card key={integration.name} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <integration.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{integration.name}</CardTitle>
                      <CardDescription className="text-xs">{integration.category}</CardDescription>
                    </div>
                  </div>
                  <Badge 
                    variant={integration.status === "connected" ? "default" : "secondary"}
                    className={integration.status === "connected" ? "bg-green-100 text-green-800" : ""}
                  >
                    {integration.status === "connected" ? "Conectado" : "Disponível"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3">
                  {integration.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {integration.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  {integration.status === "connected" ? (
                    <>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Settings className="mr-2 h-3 w-3" />
                        Configurar
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" className="flex-1">
                      Conectar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Configure suas integrações de marketing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Mail className="h-6 w-6" />
                <span>Nova Campanha</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Target className="h-6 w-6" />
                <span>Criar Audiência</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <BarChart3 className="h-6 w-6" />
                <span>Ver Relatórios</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Settings className="h-6 w-6" />
                <span>Configurações</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </SidebarInset>
  )
}
