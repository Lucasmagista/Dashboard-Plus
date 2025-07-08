"use client"

import { useActionSuggestions } from "@/hooks/use-action-suggestions"
import { DASHBOARD_WIDGETS, UserProfile } from "@/lib/dashboard-widgets"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { VirtualKeyboard } from "@/components/ui/virtual-keyboard"
import { Fab } from "@/components/ui/fab"
import { useSwipeNavigation } from "@/hooks/use-swipe-navigation"
import { MAIN_ROUTES } from "@/lib/main-routes"
import { useToast } from "@/components/ui/use-toast"
import {
  BarChart3,
  Users,
  MessageSquare,
  TrendingUp,
  Calendar,
  Phone,
  Mail,
  Target,
  Activity,
  Clock,
  CheckCircle,
} from "lucide-react"

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed";
}

const recentActivities = [
  {
    id: 1,
    type: "contact",
    title: "Novo contato adicionado",
    description: "Sarah Johnson da TechCorp",
    time: "há 2 minutos",
    icon: Users,
    status: "success",
  },
  {
    id: 2,
    type: "deal",
    title: "Negócio movido para negociação",
    description: "R$ 15.000 - Licença de Software Empresarial",
    time: "há 15 minutos",
    icon: Target,
    status: "warning",
  },
  {
    id: 3,
    type: "message",
    title: "Nova mensagem recebida",
    description: "Acompanhamento da proposta discutida",
    time: "há 1 hora",
    icon: MessageSquare,
    status: "info",
  },
  {
    id: 4,
    type: "call",
    title: "Chamada agendada",
    description: "Demonstração com cliente potencial",
    time: "há 2 horas",
    icon: Phone,
    status: "success",
  },
  {
    id: 5,
    type: "email",
    title: "Campanha de e-mail enviada",
    description: "Newsletter mensal para 1.247 assinantes",
    time: "há 3 horas",
    icon: Mail,
    status: "success",
  },
]

const PRIORITY_LABELS: Record<string, string> = {
  high: "Alta",
  medium: "Média",
  low: "Baixa",
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendente",
  "in-progress": "Em andamento",
  completed: "Concluída",
}

const upcomingTasksDefault: Task[] = [
  {
    id: 1,
    title: "Retornar contato com TechCorp",
    description: "Discutir termos do contrato e preços",
    dueDate: "Hoje, 14:00",
    priority: "high",
    status: "pending",
  },
  {
    id: 2,
    title: "Preparar relatório trimestral",
    description: "Análise de desempenho de vendas do 4º trimestre",
    dueDate: "Amanhã, 10:00",
    priority: "medium",
    status: "in-progress",
  },
  {
    id: 3,
    title: "Reunião de equipe",
    description: "Sincronização semanal da equipe de vendas",
    dueDate: "Sexta-feira, 9:00",
    priority: "low",
    status: "pending",
  },
  {
    id: 4,
    title: "Apresentação para cliente",
    description: "Demonstração do produto para cliente Enterprise",
    dueDate: "Próxima segunda, 15:00",
    priority: "high",
    status: "pending",
  },
]

export default function Dashboard() {
  const [upcomingTasks, setUpcomingTasks] = useState([...upcomingTasksDefault])
  const suggestions = useActionSuggestions({ recentActivities, upcomingTasks })
  const userProfile: UserProfile = "vendas"
  const bindSwipe = useSwipeNavigation(MAIN_ROUTES)
  const [quickAction, setQuickAction] = useState<string | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const { toast } = useToast()

  // Handlers for quick actions
  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault()
    setTimeout(() => {
      toast({ title: "Contato adicionado com sucesso!", description: "O contato foi cadastrado." })
      setQuickAction(null)
      setInputValue("")
    }, 800)
  }

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault()
    setTimeout(() => {
      toast({ title: "Negócio criado!", description: "Novo negócio cadastrado no funil." })
      setQuickAction(null)
    }, 800)
  }

  const handleScheduleMeeting = (e: React.FormEvent) => {
    e.preventDefault()
    setTimeout(() => {
      toast({ title: "Reunião agendada!", description: "A reunião foi adicionada à agenda." })
      setQuickAction(null)
    }, 800)
  }

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault()
    setTimeout(() => {
      toast({ title: "E-mail enviado!", description: "Sua mensagem foi enviada." })
      setQuickAction(null)
    }, 800)
  }

  // Task handlers
  const handleCompleteTask = (id: number) => {
    setUpcomingTasks(tasks => tasks.map(t => t.id === id ? { ...t, status: "completed" } : t))
    toast({ title: "Tarefa concluída!", description: "A tarefa foi marcada como concluída." })
  }

  const handleEditTask = (task: Task) => setEditingTask(task)

  const handleSaveEditTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingTask) {
      setUpcomingTasks(tasks => tasks.map(t => t.id === editingTask.id ? editingTask : t))
    }
    setEditingTask(null)
    toast({ title: "Tarefa atualizada!", description: "As informações da tarefa foram salvas." })
  }

  const handleDeleteTask = (id: number) => {
    setUpcomingTasks(tasks => tasks.filter(t => t.id !== id))
    toast({ title: "Tarefa removida!", description: "A tarefa foi excluída da agenda." })
  }

  // FAB actions
  const fabActions = [
    {
      icon: <Users className="h-5 w-5" />, 
      label: "Adicionar Contato", 
      onClick: () => setQuickAction('add-contact')
    },
    {
      icon: <Target className="h-5 w-5" />, 
      label: "Criar Negócio", 
      onClick: () => setQuickAction('create-deal')
    },
    {
      icon: <Calendar className="h-5 w-5" />, 
      label: "Agendar Reunião", 
      onClick: () => setQuickAction('schedule-meeting')
    },
    {
      icon: <Mail className="h-5 w-5" />, 
      label: "Enviar E-mail", 
      onClick: () => setQuickAction('send-email')
    },
  ]

  return (
    <SidebarInset {...bindSwipe()}>
      <header className="flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Painel</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <main className="main-content flex-1 space-y-4 p-4">
        <Fab actions={fabActions} />

        {/* Smart action suggestions */}
        {suggestions.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {suggestions.map(s => (
              <Button
                key={s.action}
                variant="secondary"
                size="sm"
                className="rounded-full px-3 py-1 text-xs shadow"
                title={s.reason}
                onClick={() => {
                  if (s.action === "add-contact") setQuickAction("add-contact")
                  if (s.action === "create-deal") setQuickAction("create-deal")
                  if (s.action === "schedule-meeting") setQuickAction("schedule-meeting")
                  if (s.action === "send-email") setQuickAction("send-email")
                }}
              >
                {s.label}
              </Button>
            ))}
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Painel</h1>
            <p className="text-muted-foreground">
              Bem-vindo de volta! Veja o que está acontecendo no seu negócio hoje.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Últimos 30 dias
            </Button>
            <Button size="sm">
              <BarChart3 className="mr-2 h-4 w-4" />
              Ver Relatórios
            </Button>
          </div>
        </div>

        {/* Essential KPIs Only - Simplified */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {DASHBOARD_WIDGETS.filter(w => 
            w.profiles.includes(userProfile) && 
            ['kpi-vendas', 'contatos-ativos', 'mensagens', 'negocios-ativos'].includes(w.id)
          ).map(widget => (
            <Card key={widget.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
                <widget.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {widget.render()}
                <div className="text-xs text-muted-foreground mt-1">{widget.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Virtual Assistant - Keep on main dashboard */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Assistente Virtual
            </CardTitle>
            <CardDescription>Seu assistente inteligente para consultas rápidas</CardDescription>
          </CardHeader>
          <CardContent>
            {DASHBOARD_WIDGETS.find(w => w.id === 'assistente-virtual-chatbot')?.render()}
          </CardContent>
        </Card>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
          {/* Recent Activity */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
              <CardDescription>Últimas atualizações do seu CRM</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity) => {
                  let activityClassName = "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                  if (activity.status === "success") {
                    activityClassName = "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                  } else if (activity.status === "warning") {
                    activityClassName = "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
                  }
                  return (
                    <div key={activity.id} className="flex items-center gap-3">
                      <div className="relative">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${activityClassName}`}
                        >
                          <activity.icon className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">{activity.time}</div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Próximas Tarefas</CardTitle>
              <CardDescription>Sua agenda para os próximos dias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingTasks.map((task) => {
                  let statusIcon = <Clock className="h-4 w-4 text-gray-400" aria-label="Pendente" />
                  if (task.status === "completed") {
                    statusIcon = <CheckCircle className="h-4 w-4 text-green-500" aria-label="Concluída" />
                  } else if (task.status === "in-progress") {
                    statusIcon = <Activity className="h-4 w-4 text-blue-500 animate-spin-slow" aria-label="Em andamento" />
                  }
                  return (
                    <div key={task.id} className="flex items-start gap-3 group border-b pb-3 last:border-b-0 last:pb-0">
                      <div className="mt-1" title={STATUS_LABELS[task.status] || task.status}>
                        {statusIcon}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium leading-none" title={task.title}>
                            {task.title}
                          </p>
                          {(() => {
                            let badgeVariant: "default" | "secondary" | "destructive" = "secondary"
                            if (task.priority === "high") {
                              badgeVariant = "destructive"
                            } else if (task.priority === "medium") {
                              badgeVariant = "default"
                            }
                            return (
                              <Badge
                                variant={badgeVariant}
                                className="text-xs cursor-help px-2 py-0.5"
                                title={`Prioridade: ${PRIORITY_LABELS[task.priority]}`}
                              >
                                {PRIORITY_LABELS[task.priority] || task.priority}
                              </Badge>
                            )
                          })()}
                        </div>
                        <p className="text-sm text-muted-foreground" title={task.description}>
                          {task.description}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center" title={`Prazo: ${task.dueDate}`}>
                          <Clock className="mr-1 h-3 w-3" />
                          {task.dueDate}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1 items-end self-center">
                        {task.status !== "completed" && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleCompleteTask(task.id)} 
                            title="Marcar como concluída"
                            className="h-8 w-8 p-0"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleEditTask(task)} 
                          title="Editar tarefa"
                          className="h-8 w-8 p-0"
                        >
                          <Activity className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleDeleteTask(task.id)} 
                          title="Excluir tarefa"
                          className="h-8 w-8 p-0"
                        >
                          <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Tarefas comuns para começar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 bg-transparent hover:bg-accent"
                onClick={() => setQuickAction('add-contact')}
              >
                <Users className="h-6 w-6" />
                <span className="text-sm">Adicionar Contato</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 bg-transparent hover:bg-accent"
                onClick={() => setQuickAction('create-deal')}
              >
                <Target className="h-6 w-6" />
                <span className="text-sm">Criar Negócio</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 bg-transparent hover:bg-accent"
                onClick={() => setQuickAction('schedule-meeting')}
              >
                <Calendar className="h-6 w-6" />
                <span className="text-sm">Agendar Reunião</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 bg-transparent hover:bg-accent"
                onClick={() => setQuickAction('send-email')}
              >
                <Mail className="h-6 w-6" />
                <span className="text-sm">Enviar E-mail</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Performance Charts - Simplified */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Visão Geral de Performance
            </CardTitle>
            <CardDescription>Resumo das métricas principais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div className="h-[140px] flex items-center justify-center bg-muted/30 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="h-10 w-10 mx-auto text-green-500 mb-2" />
                  <p className="text-base font-medium">Vendas +15%</p>
                  <p className="text-sm text-muted-foreground">vs. mês anterior</p>
                </div>
              </div>
              <div className="h-[140px] flex items-center justify-center bg-muted/30 rounded-lg">
                <div className="text-center">
                  <Users className="h-10 w-10 mx-auto text-blue-500 mb-2" />
                  <p className="text-base font-medium">Leads +8%</p>
                  <p className="text-sm text-muted-foreground">vs. mês anterior</p>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm" asChild>
                <a href="/analytics">
                  Ver Análises Completas
                  <BarChart3 className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Task Edit Dialog */}
      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Tarefa</DialogTitle>
            <DialogDescription>Altere as informações da tarefa.</DialogDescription>
          </DialogHeader>
          {editingTask && (
            <form onSubmit={handleSaveEditTask} className="space-y-4">
              <Input
                placeholder="Título"
                value={editingTask.title}
                onChange={e => setEditingTask({ ...editingTask, title: e.target.value })}
                required
              />
              <Textarea
                placeholder="Descrição"
                value={editingTask.description}
                onChange={e => setEditingTask({ ...editingTask, description: e.target.value })}
                required
              />
              <Input
                placeholder="Prazo"
                value={editingTask.dueDate}
                onChange={e => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                required
              />
              <div className="flex gap-2">
                <Select 
                  value={editingTask.priority} 
                  onValueChange={v => setEditingTask({ ...editingTask, priority: v as Task["priority"] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="low">Baixa</SelectItem>
                  </SelectContent>
                </Select>
                <Select 
                  value={editingTask.status} 
                  onValueChange={v => setEditingTask({ ...editingTask, status: v as Task["status"] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="in-progress">Em andamento</SelectItem>
                    <SelectItem value="completed">Concluída</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setEditingTask(null)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Quick Action Dialogs */}
      <Dialog open={quickAction === 'add-contact'} onOpenChange={() => setQuickAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Contato</DialogTitle>
            <DialogDescription>Preencha os dados do novo contato.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddContact} className="space-y-4">
            <Input
              placeholder="Nome Completo"
              required
              value={inputValue}
              onFocus={() => setShowKeyboard(true)}
              onChange={e => setInputValue(e.target.value)}
              autoComplete="off"
            />
            <Input placeholder="E-mail" type="email" required />
            <Input placeholder="Telefone (com DDD)" />
            <Input placeholder="Empresa" />
            <Textarea placeholder="Observações" />
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setQuickAction(null)}>
                Cancelar
              </Button>
              <Button type="submit">Adicionar</Button>
            </DialogFooter>
          </form>
          <VirtualKeyboard
            visible={showKeyboard}
            onInput={val => setInputValue(v => v + val)}
            onClose={() => setShowKeyboard(false)}
            suggestions={["João Silva", "Maria Souza", "Empresa X"]}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={quickAction === 'create-deal'} onOpenChange={() => setQuickAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Negócio</DialogTitle>
            <DialogDescription>Preencha os dados do novo negócio.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateDeal} className="space-y-4">
            <Input placeholder="Nome do Negócio" required />
            <Input placeholder="Valor Estimado (R$)" type="number" required min={0} step={0.01} />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o estágio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="negociação">Negociação</SelectItem>
                <SelectItem value="proposta">Proposta</SelectItem>
                <SelectItem value="fechado">Fechado</SelectItem>
              </SelectContent>
            </Select>
            <Textarea placeholder="Descrição" />
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setQuickAction(null)}>
                Cancelar
              </Button>
              <Button type="submit">Criar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={quickAction === 'schedule-meeting'} onOpenChange={() => setQuickAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agendar Reunião</DialogTitle>
            <DialogDescription>Preencha os dados da reunião.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleScheduleMeeting} className="space-y-4">
            <Input placeholder="Assunto" required />
            <Input placeholder="Data" type="date" required />
            <Input placeholder="Hora" type="time" required />
            <Input placeholder="Participantes (e-mails separados por vírgula)" />
            <Textarea placeholder="Descrição" />
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setQuickAction(null)}>
                Cancelar
              </Button>
              <Button type="submit">Agendar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={quickAction === 'send-email'} onOpenChange={() => setQuickAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar E-mail</DialogTitle>
            <DialogDescription>Preencha os dados do e-mail.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSendEmail} className="space-y-4">
            <Input placeholder="Para" type="email" required />
            <Input placeholder="Assunto" required />
            <Textarea placeholder="Mensagem" required rows={5} />
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setQuickAction(null)}>
                Cancelar
              </Button>
              <Button type="submit">Enviar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </SidebarInset>
  )
}

