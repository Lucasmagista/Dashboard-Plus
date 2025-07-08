"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Zap,
  Plus,
  Settings,
  Edit,
  Trash2,
  Pause,
  Copy,
  BarChart3,
  Activity,
  Clock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react"

const workflows = [
  {
    id: 1,
    name: "Sequência de Nutrição de Leads",
    description: "Sequência automatizada de e-mails para novos leads",
    status: "ativo",
    trigger: "Novo lead criado",
    actions: ["Enviar e-mail de boas-vindas", "Adicionar ao CRM", "Agendar follow-up"],
    executions: 1247,
    successRate: 94.2,
    lastRun: "há 2 minutos",
    created: "2024-01-10",
    category: "Vendas",
    tags: ["E-mail", "CRM", "Leads"],
  },
  {
    id: 2,
    name: "Onboarding de Cliente",
    description: "Dê boas-vindas a novos clientes com instruções de configuração",
    status: "ativo",
    trigger: "Pagamento concluído",
    actions: ["Enviar e-mail de boas-vindas", "Criar conta", "Enviar guia de configuração"],
    executions: 856,
    successRate: 98.1,
    lastRun: "há 5 minutos",
    created: "2024-01-08",
    category: "Sucesso do Cliente",
    tags: ["Onboarding", "E-mail", "Conta"],
  },
  {
    id: 3,
    name: "Recuperação de Carrinho Abandonado",
    description: "Reengaje clientes que deixaram itens no carrinho",
    status: "pausado",
    trigger: "Carrinho abandonado por 1 hora",
    actions: ["Enviar e-mail de lembrete", "Oferecer desconto", "Fazer follow-up"],
    executions: 432,
    successRate: 67.8,
    lastRun: "há 1 hora",
    created: "2024-01-05",
    category: "E-commerce",
    tags: ["Carrinho", "E-mail", "Recuperação"],
  },
  {
    id: 4,
    name: "Sistema de Lembrete de Reunião",
    description: "Lembretes automáticos para reuniões agendadas",
    status: "ativo",
    trigger: "Reunião agendada",
    actions: ["Enviar convite de calendário", "Lembrete por SMS", "Lembrete por e-mail"],
    executions: 678,
    successRate: 99.2,
    lastRun: "há 10 minutos",
    created: "2024-01-03",
    category: "Agendamento",
    tags: ["Calendário", "SMS", "E-mail"],
  },
  {
    id: 5,
    name: "Escalonamento de Chamados de Suporte",
    description: "Escalone chamados não resolvidos para gerentes",
    status: "ativo",
    trigger: "Chamado aberto há 24 horas",
    actions: ["Notificar gerente", "Atualizar prioridade", "Enviar atualização"],
    executions: 234,
    successRate: 91.5,
    lastRun: "há 30 minutos",
    created: "2024-01-01",
    category: "Suporte",
    tags: ["Chamados", "Escalonamento", "Notificações"],
  },
]

const workflowTemplates = [
  {
    id: 1,
    name: "Campanha de E-mail Marketing",
    description: "Sequências automatizadas de e-mails para campanhas de marketing",
    category: "Marketing",
    triggers: ["Contato adicionado à lista", "Tag aplicada", "Data/hora"],
    actions: ["Enviar e-mail", "Aguardar", "Adicionar/remover tags", "Atualizar contato"],
  },
  {
    id: 2,
    name: "Automação do Pipeline de Vendas",
    description: "Mova negócios automaticamente entre etapas do pipeline",
    category: "Vendas",
    triggers: ["Negócio criado", "Negócio atualizado", "Atividade concluída"],
    actions: ["Mover etapa do negócio", "Atribuir responsável", "Criar tarefa", "Enviar notificação"],
  },
  {
    id: 3,
    name: "Workflow de Suporte ao Cliente",
    description: "Automatize o roteamento e respostas de chamados de suporte",
    category: "Suporte",
    triggers: ["Chamado criado", "Chamado atualizado", "Resposta do cliente"],
    actions: ["Atribuir agente", "Enviar resposta automática", "Atualizar status", "Escalonar"],
  },
  {
    id: 4,
    name: "Processo de Inscrição em Evento",
    description: "Gerencie inscrições e confirmações de eventos",
    category: "Eventos",
    triggers: ["Inscrição enviada", "Pagamento recebido"],
    actions: ["Enviar confirmação", "Adicionar ao calendário", "Enviar lembretes"],
  },
]

export default function WorkflowsPage() {
  const [isCreateWorkflowOpen, setIsCreateWorkflowOpen] = useState(false)
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null)
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-green-100 text-green-800"
      case "pausado":
        return "bg-yellow-100 text-yellow-800"
      case "erro":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ativo":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pausado":
        return <Pause className="h-4 w-4 text-yellow-600" />
      case "erro":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const handleToggleWorkflow = (workflowId: number) => {
    const workflow = workflows.find((w) => w.id === workflowId)
    if (workflow) {
      workflow.status = workflow.status === "active" ? "paused" : "active"
    }
  }

  const handleConfigureWorkflow = (workflow: any) => {
    setSelectedWorkflow(workflow)
    setIsConfigDialogOpen(true)
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Painel</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Workflows</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
            <p className="text-muted-foreground">Automatize processos do seu negócio e economize tempo</p>
          </div>
          <Dialog open={isCreateWorkflowOpen} onOpenChange={setIsCreateWorkflowOpen}>
            <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Workflow
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Novo Workflow</DialogTitle>
                <DialogDescription>Escolha um modelo ou crie um workflow personalizado.</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="templates" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="templates">Modelos</TabsTrigger>
                  <TabsTrigger value="custom">Personalizado</TabsTrigger>
                </TabsList>
                <TabsContent value="templates" className="space-y-4">
                  <div className="grid gap-4">
                    {workflowTemplates.map((template) => (
                      <Card
                        key={template.id}
                        className={`cursor-pointer transition-colors ${
                          selectedTemplate?.id === template.id ? "border-primary bg-primary/5" : ""
                        }`}
                        onClick={() => setSelectedTemplate(template)}
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <CardDescription>{template.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm font-medium">Categoria:</p>
                              <Badge variant="outline">{template.category}</Badge>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Disparadores:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {template.triggers.map((trigger, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {trigger}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Ações:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {template.actions.map((action, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {action}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="custom" className="space-y-4">
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="workflow-name" className="text-right">
                        Nome
                      </Label>
                      <Input id="workflow-name" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="workflow-description" className="text-right">
                        Descrição
                      </Label>
                      <Textarea id="workflow-description" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="workflow-category" className="text-right">
                        Categoria
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vendas">Vendas</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="suporte">Suporte</SelectItem>
                          <SelectItem value="operacoes">Operações</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateWorkflowOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsCreateWorkflowOpen(false)}>Criar Workflow</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Workflow Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Workflows Ativos</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{workflows.filter((w) => w.status === "ativo").length}</div>
              <p className="text-xs text-muted-foreground">De {workflows.length} no total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Execuções</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {workflows.reduce((sum, workflow) => sum + workflow.executions, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(workflows.reduce((sum, workflow) => sum + workflow.successRate, 0) / workflows.length)}%
              </div>
              <p className="text-xs text-muted-foreground">Average success rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247h</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Workflows List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workflows.map((workflow) => (
            <Card key={workflow.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{workflow.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(workflow.status)}
                    <Badge className={getStatusColor(workflow.status)}>{workflow.status}</Badge>
                  </div>
                </div>
                <CardDescription>{workflow.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Category:</span>
                    <Badge variant="outline">{workflow.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Trigger:</span>
                    <span className="text-muted-foreground text-right">{workflow.trigger}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Actions:</h4>
                  <div className="space-y-1">
                    {workflow.actions.map((action, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span>{action}</span>
                        {index < workflow.actions.length - 1 && (
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Executions:</span>
                    <span className="font-medium">{workflow.executions.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Success Rate:</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={workflow.successRate} className="w-16 h-2" />
                      <span className="font-medium">{workflow.successRate}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Last run: {workflow.lastRun}</span>
                  <span>Created: {workflow.created}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {workflow.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <Switch
                    checked={workflow.status === "active"}
                    onCheckedChange={() => handleToggleWorkflow(workflow.id)}
                  />
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleConfigureWorkflow(workflow)}>
                      <Settings className="mr-2 h-4 w-4" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="mr-2 h-4 w-4" />
                      Clone
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 bg-transparent">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Workflow Configuration Dialog */}
        <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Configure {selectedWorkflow?.name}</DialogTitle>
              <DialogDescription>Adjust settings and parameters for your workflow.</DialogDescription>
            </DialogHeader>
            {selectedWorkflow && (
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="trigger">Trigger</TabsTrigger>
                  <TabsTrigger value="actions">Actions</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="config-name" className="text-right">
                        Name
                      </Label>
                      <Input id="config-name" defaultValue={selectedWorkflow.name} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="config-description" className="text-right">
                        Description
                      </Label>
                      <Textarea
                        id="config-description"
                        defaultValue={selectedWorkflow.description}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Auto-start</Label>
                      <div className="col-span-3 flex items-center space-x-2">
                        <Switch defaultChecked />
                        <span className="text-sm">Start workflow automatically when triggered</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="trigger" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label>Trigger Event</Label>
                      <Select defaultValue="lead-created">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lead-created">New lead created</SelectItem>
                          <SelectItem value="contact-updated">Contact updated</SelectItem>
                          <SelectItem value="deal-won">Deal won</SelectItem>
                          <SelectItem value="email-opened">Email opened</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Conditions</Label>
                      <Textarea placeholder="Define conditions for when this workflow should run..." className="mt-1" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="actions" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Workflow Actions</Label>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Action
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {selectedWorkflow.actions.map((action: string, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
                              {index + 1}
                            </div>
                            <span>{action}</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Success Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{selectedWorkflow.successRate}%</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Total Executions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{selectedWorkflow.executions}</div>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <Label>Performance Tracking</Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Completion Rate</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={selectedWorkflow.successRate} className="w-24 h-2" />
                            <span className="text-sm font-medium">{selectedWorkflow.successRate}%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Average Duration</span>
                          <span className="text-sm font-medium">2.5 minutes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConfigDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsConfigDialogOpen(false)}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarInset>
  )
}
