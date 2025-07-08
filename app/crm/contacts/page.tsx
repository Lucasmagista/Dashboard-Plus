"use client"

import { DASHBOARD_WIDGETS, UserProfile } from "@/lib/dashboard-widgets"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  Target,
  Activity,
  Edit,
  MessageSquare,
  FileText,
} from "lucide-react"
import { Input } from "@/components/ui/input"

const crmWidgets = [
  'timeline',
  'pipeline-kanban',
  'contact-templates',
  'contact-management'
]

const contacts = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@empresa.com",
    phone: "(11) 99999-9999",
    company: "Tech Solutions",
    position: "CEO",
    status: "Ativo",
    lastContact: "2 dias atrás",
    value: "R$ 25.000",
    stage: "Negociação",
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@startup.com",
    phone: "(11) 88888-8888",
    company: "StartupX",
    position: "Fundadora",
    status: "Lead Quente",
    lastContact: "1 semana atrás",
    value: "R$ 15.000",
    stage: "Proposta",
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    id: 3,
    name: "Carlos Oliveira",
    email: "carlos@corp.com",
    phone: "(11) 77777-7777",
    company: "Corporation Inc",
    position: "Diretor",
    status: "Cliente",
    lastContact: "3 dias atrás",
    value: "R$ 50.000",
    stage: "Fechado",
    avatar: "/placeholder.svg?height=40&width=40"
  }
]

const pipelineStages = [
  { name: "Lead", count: 12, value: "R$ 180.000" },
  { name: "Qualificado", count: 8, value: "R$ 120.000" },
  { name: "Proposta", count: 5, value: "R$ 75.000" },
  { name: "Negociação", count: 3, value: "R$ 45.000" },
  { name: "Fechado", count: 2, value: "R$ 30.000" }
]

const recentActivities = [
  {
    type: "call",
    contact: "João Silva",
    action: "Ligação realizada",
    time: "2h atrás",
    description: "Discussão sobre proposta comercial"
  },
  {
    type: "email",
    contact: "Maria Santos",
    action: "Email enviado",
    time: "4h atrás",
    description: "Enviado contrato para análise"
  },
  {
    type: "meeting",
    contact: "Carlos Oliveira",
    action: "Reunião agendada",
    time: "1d atrás",
    description: "Reunião para próxima semana"
  }
]

export default function CRMContactsPage() {
  const widgets = DASHBOARD_WIDGETS.filter(widget => crmWidgets.includes(widget.id))

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/crm">CRM</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Contatos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Gestão de Contatos CRM</h1>
            <p className="text-muted-foreground">
              Gerencie seus contatos, pipeline e relacionamentos
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Contato
            </Button>
          </div>
        </div>

        {/* Métricas CRM */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Contatos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.247</div>
              <p className="text-xs text-green-600">+12.5% em relação ao mês anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pipeline Total</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 450.000</div>
              <p className="text-xs text-green-600">+8.3% em relação ao mês anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18.2%</div>
              <p className="text-xs text-green-600">+2.1% em relação ao mês anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atividades Hoje</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">34</div>
              <p className="text-xs text-green-600">+15.7% em relação ao mês anterior</p>
            </CardContent>
          </Card>
        </div>

        {/* Pipeline Kanban */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Pipeline de Vendas
            </CardTitle>
            <CardDescription>
              Visualize o progresso dos seus leads através do funil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              {pipelineStages.map((stage) => (
                <div key={stage.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">{stage.name}</h4>
                    <Badge variant="outline">{stage.count}</Badge>
                  </div>
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">Valor Total</p>
                    <p className="font-semibold">{stage.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Lista de Contatos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Contatos Recentes
              </CardTitle>
              <CardDescription>
                Seus contatos mais ativos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar contatos..." className="pl-8" />
                </div>
              </div>
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={contact.avatar} alt={contact.name} />
                        <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">{contact.position} • {contact.company}</p>
                        <p className="text-xs text-muted-foreground">{contact.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        contact.status === 'Cliente' ? 'default' : 
                        contact.status === 'Lead Quente' ? 'secondary' : 'outline'
                      }>
                        {contact.status}
                      </Badge>
                      <p className="text-sm font-semibold mt-1">{contact.value}</p>
                      <p className="text-xs text-muted-foreground">{contact.lastContact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Timeline de Atividades */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Timeline de Atividades
              </CardTitle>
              <CardDescription>
                Histórico de interações recentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                    <div className="p-2 rounded-full bg-muted">
                      {activity.type === 'call' && <Phone className="h-4 w-4" />}
                      {activity.type === 'email' && <Mail className="h-4 w-4" />}
                      {activity.type === 'meeting' && <Calendar className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{activity.action}</p>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.contact}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Templates de Comunicação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Templates de Comunicação
            </CardTitle>
            <CardDescription>
              Templates prontos para agilizar sua comunicação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="justify-start">
                <Mail className="mr-2 h-4 w-4" />
                Email de Follow-up
              </Button>
              <Button variant="outline" className="justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Proposta Comercial
              </Button>
              <Button variant="outline" className="justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Agendamento de Reunião
              </Button>
              <Button variant="outline" className="justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Contrato Padrão
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Acelere seus processos de CRM
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Importar Contatos
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="mr-2 h-4 w-4" />
                Enviar Email em Massa
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Agendar Follow-up
              </Button>
              <Button variant="outline" size="sm">
                <TrendingUp className="mr-2 h-4 w-4" />
                Relatório de Pipeline
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
