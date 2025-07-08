"use client"

import { DASHBOARD_WIDGETS, UserProfile } from "@/lib/dashboard-widgets"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MessageSquare,
  Mail,
  Phone,
  Bot,
  Brain,
  MessageCircle,
  Send,
  Clock,
  TrendingUp,
  Users,
  Target,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

export default function CommunicationsPage() {
  const [activeTab, setActiveTab] = useState("templates")
  const userProfile: UserProfile = "vendas"

  const communicationWidgets = DASHBOARD_WIDGETS.filter(w => 
    w.profiles.includes(userProfile) && 
    [
      'templates-inteligentes',
      'respostas-automaticas',
      'bot-inteligente',
      'workflows-multicanal',
      'metricas-resposta',
      'notificacoes-inteligentes-multicanal'
    ].includes(w.id)
  )

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
                <BreadcrumbPage>Comunicações</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <main className="flex-1 space-y-4 p-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Central de Comunicações</h1>
            <p className="text-muted-foreground">
              Gerencie templates, respostas automáticas e métricas de comunicação
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <MessageCircle className="mr-2 h-4 w-4" />
              Nova Mensagem
            </Button>
            <Button size="sm">
              <Send className="mr-2 h-4 w-4" />
              Enviar Campanha
            </Button>
          </div>
        </div>

        {/* Communication Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mensagens Enviadas</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,847</div>
              <p className="text-xs text-muted-foreground">+15% vs mês anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Resposta</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78.5%</div>
              <p className="text-xs text-muted-foreground">+5.2% vs mês anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo Médio de Resposta</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.3h</div>
              <p className="text-xs text-muted-foreground">-15 min vs mês anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Automações Ativas</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">+3 novas este mês</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="templates" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="automation">Automação</TabsTrigger>
            <TabsTrigger value="bot">Bot Inteligente</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="metrics">Métricas</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            {/* Smart Templates */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Templates Inteligentes
                </CardTitle>
                <CardDescription>Mensagens personalizadas com IA para diferentes situações</CardDescription>
              </CardHeader>
              <CardContent>
                {DASHBOARD_WIDGETS.find(w => w.id === 'templates-inteligentes')?.render()}
              </CardContent>
            </Card>

            {/* Quick Template Categories */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Templates de E-mail</h3>
                      <p className="text-sm text-muted-foreground">23 templates disponíveis</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Templates WhatsApp</h3>
                      <p className="text-sm text-muted-foreground">18 templates disponíveis</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Phone className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Scripts de Ligação</h3>
                      <p className="text-sm text-muted-foreground">12 scripts disponíveis</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="automation" className="space-y-4">
            {/* Auto Response */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Respostas Automáticas
                </CardTitle>
                <CardDescription>Configure respostas automáticas com NLP em múltiplos canais</CardDescription>
              </CardHeader>
              <CardContent>
                {DASHBOARD_WIDGETS.find(w => w.id === 'respostas-automaticas')?.render()}
              </CardContent>
            </Card>

            {/* Automation Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Respostas Automáticas</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">Esta semana</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Precisão</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">94.2%</div>
                  <p className="text-xs text-muted-foreground">Reconhecimento NLP</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tempo Economizado</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">127h</div>
                  <p className="text-xs text-muted-foreground">Este mês</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Satisfação</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.7/5</div>
                  <p className="text-xs text-muted-foreground">Avaliação média</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bot" className="space-y-4">
            {/* Intelligent Bot */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Bot Inteligente
                </CardTitle>
                <CardDescription>Assistente virtual com NLP avançado e integração ChatGPT</CardDescription>
              </CardHeader>
              <CardContent>
                {DASHBOARD_WIDGETS.find(w => w.id === 'bot-inteligente')?.render()}
              </CardContent>
            </Card>

            {/* Bot Performance */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance do Bot</CardTitle>
                  <CardDescription>Métricas de interação e eficiência</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Conversas Iniciadas</span>
                      <span className="text-2xl font-bold">2,847</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Conversas Finalizadas</span>
                      <span className="text-2xl font-bold">2,134</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Taxa de Resolução</span>
                      <span className="text-2xl font-bold">75%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Aprendizado Contínuo</CardTitle>
                  <CardDescription>Evolução e melhorias do bot</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Novos Padrões</span>
                      <span className="text-2xl font-bold">47</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Acurácia</span>
                      <span className="text-2xl font-bold">94.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Melhorias</span>
                      <span className="text-2xl font-bold">+5.8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="workflows" className="space-y-4">
            {/* Multi-channel Workflows */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Workflows Multi-canal
                </CardTitle>
                <CardDescription>Automações complexas em email, WhatsApp, SMS e chat</CardDescription>
              </CardHeader>
              <CardContent>
                {DASHBOARD_WIDGETS.find(w => w.id === 'workflows-multicanal')?.render()}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            {/* Response Metrics */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Métricas de Resposta
                </CardTitle>
                <CardDescription>KPIs de tempo de resposta, satisfação e performance por canal</CardDescription>
              </CardHeader>
              <CardContent>
                {DASHBOARD_WIDGETS.find(w => w.id === 'metricas-resposta')?.render()}
              </CardContent>
            </Card>

            {/* Smart Notifications */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Notificações Inteligentes
                </CardTitle>
                <CardDescription>Sistema multi-canal com agrupamento e priorização</CardDescription>
              </CardHeader>
              <CardContent>
                {DASHBOARD_WIDGETS.find(w => w.id === 'notificacoes-inteligentes-multicanal')?.render()}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </SidebarInset>
  )
}
