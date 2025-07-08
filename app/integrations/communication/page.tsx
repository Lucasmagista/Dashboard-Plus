"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import {
  MessageSquare,
  Phone,
  Mail,
  Video,
  ExternalLink,
  Check,
  Settings,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Send,
} from "lucide-react"
import Link from "next/link"

const communicationIntegrations = [
  {
    name: "WhatsApp Business",
    description: "Mensagens automatizadas via WhatsApp",
    icon: MessageSquare,
    status: "Ativo",
    color: "bg-green-500",
    users: 3200,
    conversion: 94.8,
    stats: {
      messages: 15680,
      responses: 89.2,
      automation: 76.5
    }
  },
  {
    name: "Telegram Bot",
    description: "Bot inteligente para Telegram",
    icon: Send,
    status: "Ativo",
    color: "bg-blue-500",
    users: 1850,
    conversion: 91.3,
    stats: {
      messages: 8940,
      responses: 92.7,
      automation: 83.1
    }
  },
  {
    name: "Twilio SMS",
    description: "Envio de SMS em massa",
    icon: Phone,
    status: "Ativo",
    color: "bg-red-500",
    users: 2100,
    conversion: 88.6,
    stats: {
      messages: 12450,
      responses: 76.8,
      automation: 65.2
    }
  },
  {
    name: "Zoom Integration",
    description: "Reuniões e webinars automáticos",
    icon: Video,
    status: "Configurando",
    color: "bg-purple-500",
    users: 0,
    conversion: 0,
    stats: {
      meetings: 0,
      attendees: 0,
      recordings: 0
    }
  }
]

const communicationMetrics = [
  {
    title: "Mensagens Hoje",
    value: "8.247",
    change: "+24.1%",
    changeType: "positive",
    icon: MessageSquare
  },
  {
    title: "Taxa de Resposta",
    value: "89.2%",
    change: "+5.3%",
    changeType: "positive",
    icon: Target
  },
  {
    title: "Usuários Ativos",
    value: "7.150",
    change: "+18.7%",
    changeType: "positive",
    icon: Users
  },
  {
    title: "Automação",
    value: "76.5%",
    change: "+12.4%",
    changeType: "positive",
    icon: BarChart3
  }
]

const recentMessages = [
  {
    platform: "WhatsApp",
    contact: "João Silva",
    message: "Olá! Gostaria de saber mais sobre...",
    time: "2 min atrás",
    status: "Respondido",
    type: "Cliente"
  },
  {
    platform: "Telegram",
    contact: "Maria Santos",
    message: "Preciso de ajuda com meu pedido",
    time: "5 min atrás",
    status: "Pendente",
    type: "Suporte"
  },
  {
    platform: "SMS",
    contact: "Carlos Oliveira",
    message: "Confirmação de agendamento",
    time: "12 min atrás",
    status: "Enviado",
    type: "Automático"
  }
]

export default function CommunicationIntegrations() {
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
                <BreadcrumbPage>Comunicação</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Integrações de Comunicação</h1>
            <p className="text-muted-foreground">
              Gerencie canais de comunicação e automações
            </p>
          </div>
          <Button>
            <Settings className="mr-2 h-4 w-4" />
            Configurar Nova Integração
          </Button>
        </div>

        {/* Métricas de Comunicação */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {communicationMetrics.map((metric) => (
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
          {communicationIntegrations.map((integration) => (
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
                    {integration.name === 'Zoom Integration' ? (
                      <>
                        <div className="flex justify-between text-sm">
                          <span>Reuniões</span>
                          <span className="font-semibold">{integration.stats.meetings}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Participantes</span>
                          <span className="font-semibold">{integration.stats.attendees}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Gravações</span>
                          <span className="font-semibold">{integration.stats.recordings}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between text-sm">
                          <span>Mensagens</span>
                          <span className="font-semibold">{integration.stats.messages?.toLocaleString?.() ?? '-'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Taxa de Resposta</span>
                          <span className="font-semibold">{integration.stats.responses}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Automação</span>
                          <span className="font-semibold">{integration.stats.automation}%</span>
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

        {/* Mensagens Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Mensagens Recentes</CardTitle>
            <CardDescription>
              Últimas interações em todos os canais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMessages.map((message, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{message.contact} - {message.platform}</p>
                      <p className="text-sm text-muted-foreground">{message.message}</p>
                      <p className="text-xs text-muted-foreground">{message.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={
                      message.status === 'Respondido' ? 'default' : 
                      message.status === 'Enviado' ? 'secondary' : 'outline'
                    }>
                      {message.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {message.type}
                    </Badge>
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
              Gerencie suas integrações de comunicação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <MessageSquare className="mr-2 h-4 w-4" />
                Enviar Broadcast
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Configurar Automação
              </Button>
              <Button variant="outline" size="sm">
                <BarChart3 className="mr-2 h-4 w-4" />
                Relatório de Mensagens
              </Button>
              <Button variant="outline" size="sm">
                <Check className="mr-2 h-4 w-4" />
                Moderar Mensagens
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
