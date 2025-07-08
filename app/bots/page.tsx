"use client"

import * as React from "react"
import { useState } from "react"
import { useSwipeNavigation } from "@/hooks/use-swipe-navigation"
import { MAIN_ROUTES } from "@/lib/main-routes"
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
import { Bot, Plus, Settings, Edit, Trash2, Cloud, Server, MessageSquare, BarChart3, Activity } from "lucide-react"

const initialBots = [
  {
    id: 1,
    name: "Bot de Suporte ao Cliente",
    type: "local",
    platform: "WhatsApp",
    status: "active",
    description: "Atende dúvidas e tickets de suporte de clientes",
    responses: 1247,
    accuracy: 94,
    uptime: 99.8,
    lastActive: "há 2 minutos",
    created: "2024-01-10",
  },
  {
    id: 2,
    name: "Bot de Qualificação de Leads",
    type: "cloud",
    platform: "Website",
    status: "active",
    description: "Qualifica leads e agenda demonstrações",
    responses: 856,
    accuracy: 89,
    uptime: 100,
    lastActive: "há 5 minutos",
    created: "2024-01-08",
  },
  {
    id: 3,
    name: "Bot Assistente de Vendas",
    type: "local",
    platform: "Telegram",
    status: "paused",
    description: "Auxilia em dúvidas e informações de produtos",
    responses: 432,
    accuracy: 91,
    uptime: 98.5,
    lastActive: "há 1 hora",
    created: "2024-01-05",
  },
  {
    id: 4,
    name: "Agendador de Compromissos",
    type: "cloud",
    platform: "Email",
    status: "active",
    description: "Agenda compromissos e gerencia calendário",
    responses: 678,
    accuracy: 96,
    uptime: 99.9,
    lastActive: "há 10 minutos",
    created: "2024-01-03",
  },
]

const botTemplates = [
  {
    id: 1,
    name: "Suporte ao Cliente",
    description: "Atende dúvidas e tickets de suporte de clientes",
    features: ["Respostas a FAQs", "Criação de tickets", "Escalonamento de chamados"],
    platforms: ["WhatsApp", "Telegram", "Website"],
  },
  {
    id: 2,
    name: "Geração de Leads",
    description: "Captura e qualifica leads de várias fontes",
    features: ["Pontuação de leads", "Coleta de contatos", "Agendamento de demonstrações"],
    platforms: ["Website", "Facebook", "LinkedIn"],
  },
  {
    id: 3,
    name: "Assistente de Vendas",
    description: "Auxilia nos processos de vendas e informações de produtos",
    features: ["Catálogo de produtos", "Cotações de preços", "Rastreamento de pedidos"],
    platforms: ["WhatsApp", "Website", "Email"],
  },
  {
    id: 4,
    name: "Agendamento de Compromissos",
    description: "Agenda e gerencia compromissos automaticamente",
    features: ["Integração com calendário", "Notificações de lembrete", "Reagendamento"],
    platforms: ["Website", "WhatsApp", "Email"],
  },
]

export default function BotsPage() {
  // Swipe navigation entre rotas principais
  const bindSwipe = useSwipeNavigation(MAIN_ROUTES)
  const [bots, setBots] = useState(initialBots)
  const [isCreateBotOpen, setIsCreateBotOpen] = useState(false)
  const [selectedBot, setSelectedBot] = useState<any>(null)
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editBot, setEditBot] = useState<any>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteBot, setDeleteBot] = useState<any>(null)
  const [customBotForm, setCustomBotForm] = useState({
    name: "",
    type: "local",
    platform: "WhatsApp",
    description: ""
  })

  // Estado para edição de configuração do bot
  const [configBot, setConfigBot] = useState<any>(null)

  // Upload de pasta do bot local
  const [botFolderFiles, setBotFolderFiles] = useState<FileList | null>(null)
  const [analyzingFolder, setAnalyzingFolder] = useState(false)
  const [analyzeResult, setAnalyzeResult] = useState<{ success: boolean, missing?: string[] } | null>(null)
  const folderInputRef = React.useRef<HTMLInputElement>(null)

  // Arquivos obrigatórios para um bot local funcionar (ajuste conforme sua stack)
  const REQUIRED_FILES = ["index.js", "package.json"] // ou ["main.py", "requirements.txt"] para Python

  function handleFolderChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    setBotFolderFiles(files)
    setAnalyzeResult(null)
    if (!files || files.length === 0) return
    setAnalyzingFolder(true)
    setTimeout(() => {
      // Coleta todos os nomes de arquivos (apenas basename)
      const fileNames = Array.from(files).map(f => f.webkitRelativePath.split("/").pop() || f.name)
      const missing = REQUIRED_FILES.filter(req => !fileNames.includes(req))
      if (missing.length === 0) {
        setAnalyzeResult({ success: true })
      } else {
        setAnalyzeResult({ success: false, missing })
      }
      setAnalyzingFolder(false)
    }, 1200) // Simula tempo de análise
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    return type === "cloud" ? <Cloud className="h-4 w-4" /> : <Server className="h-4 w-4" />
  }

  const handleBotToggle = (botId: number) => {
    setBots((prev) => prev.map((b) =>
      b.id === botId ? { ...b, status: b.status === "active" ? "paused" : "active" } : b
    ))
  }

  // Função de configuração já implementada abaixo (mantida apenas uma declaração)

  const handleEditBot = (bot: any) => {
    setEditBot(bot)
    setIsEditDialogOpen(true)
  }

  const handleSaveEditBot = (updatedBot: any) => {
    setBots((prev) => prev.map((b) => b.id === updatedBot.id ? updatedBot : b))
    setIsEditDialogOpen(false)
    setEditBot(null)
  }

  const handleDeleteBot = (bot: any) => {
    setDeleteBot(bot)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteBot = () => {
    setBots((prev) => prev.filter((b) => b.id !== deleteBot.id))
    setIsDeleteDialogOpen(false)
    setDeleteBot(null)
  }

  const handleCreateBot = () => {
    let newBot
    if (selectedTemplate) {
      newBot = {
        id: Date.now(),
        name: `Bot ${selectedTemplate.name}`,
        type: "cloud",
        platform: selectedTemplate.platforms[0],
        status: "active",
        description: selectedTemplate.description,
        responses: 0,
        accuracy: 90,
        uptime: 100,
        lastActive: "agora",
        created: new Date().toISOString().slice(0, 10)
      }
    } else {
      newBot = {
        id: Date.now(),
        name: customBotForm.name,
        type: customBotForm.type,
        platform: customBotForm.platform,
        status: "active",
        description: customBotForm.description,
        responses: 0,
        accuracy: 90,
        uptime: 100,
        lastActive: "agora",
        created: new Date().toISOString().slice(0, 10)
      }
    }
    setBots((prev) => [...prev, newBot])
    setIsCreateBotOpen(false)
    setSelectedTemplate(null)
    setCustomBotForm({ name: "", type: "local", platform: "WhatsApp", description: "" })
  }

  const handleConfigureBot = (bot: any) => {
    setSelectedBot(bot)
    setConfigBot({
      ...bot,
      port: bot.port ?? '',
      token: bot.token ?? '',
      env: bot.env ?? '',
      greeting: bot.greeting ?? '',
      fallback: bot.fallback ?? '',
      escalation: bot.escalation ?? '',
      keywords: bot.keywords ?? '',
      workingHoursEnabled: bot.workingHoursEnabled ?? false,
      workingStart: bot.workingStart ?? '09:00',
      workingEnd: bot.workingEnd ?? '17:00',
      autoReply: bot.autoReply ?? true,
      replyDelay: bot.replyDelay ?? 'instant',
    })
    setIsConfigDialogOpen(true)
  }

  // Salvar alterações de configuração do bot
  const handleSaveConfigBot = () => {
    if (!configBot) return;
    setBots((prev) => prev.map((b) => b.id === configBot.id ? { ...b, ...configBot } : b))
    setIsConfigDialogOpen(false)
    setSelectedBot(null)
    setConfigBot(null)
  }

  return (
    <SidebarInset {...bindSwipe()}>
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
              <BreadcrumbPage>Bots</BreadcrumbPage>
            </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bots</h1>
            <p className="text-muted-foreground">Gerencie seus bots de IA e fluxos de automação</p>
          </div>
          <Dialog open={isCreateBotOpen} onOpenChange={setIsCreateBotOpen}>
            <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Bot
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Novo Bot</DialogTitle>
                <DialogDescription>Escolha um modelo e configure seu novo bot.</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="templates" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-2">
                  <TabsTrigger value="templates">Modelos</TabsTrigger>
                  <TabsTrigger value="custom">Personalizado</TabsTrigger>
                </TabsList>
                <TabsContent value="templates" className="space-y-2">
                  <div className="grid gap-2 grid-cols-1">
                    {botTemplates.map((template) => (
                      <Card
                        key={template.id}
                        className={`cursor-pointer transition-colors px-2 py-1 ${
                          selectedTemplate?.id === template.id ? "border-primary bg-primary/5" : ""
                        }`}
                        onClick={() => {
                          setSelectedTemplate(template)
                          setCustomBotForm((prev) => ({ ...prev, platform: template.platforms[0] }))
                        }}
                      >
                        <CardHeader className="pb-1">
                          <CardTitle className="text-base font-semibold mb-1">{template.name}</CardTitle>
                          <CardDescription className="mb-1 text-xs">{template.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-1 mb-1">
                            {template.features.map((feature) => (
                              <Badge key={feature} variant="secondary" className="text-xs">{feature}</Badge>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-1 mb-1">
                            {template.platforms.map((platform) => (
                              <Badge key={platform} variant="outline" className="text-xs">{platform}</Badge>
                            ))}
                          </div>
                          {selectedTemplate?.id === template.id && (
                            <div className="mt-1">
                              <Label className="text-xs">Escolha a plataforma:</Label>
                              <Select
                                value={customBotForm.platform}
                                onValueChange={v => setCustomBotForm({ ...customBotForm, platform: v })}
                              >
                                <SelectTrigger className="w-full mt-1">
                                  <SelectValue placeholder="Selecione a plataforma" />
                                </SelectTrigger>
                                <SelectContent>
                                  {template.platforms.map((p) => (
                                    <SelectItem key={p} value={p}>{p}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="custom" className="space-y-4">
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="bot-name" className="text-right">
                        Nome
                      </Label>
                      <Input
                        id="bot-name"
                        className="col-span-3"
                        value={customBotForm.name}
                        onChange={e => setCustomBotForm({ ...customBotForm, name: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="bot-type" className="text-right">
                        Tipo
                      </Label>
                      <Select
                        value={customBotForm.type}
                        onValueChange={v => setCustomBotForm({ ...customBotForm, type: v })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="local">Bot Local</SelectItem>
                          <SelectItem value="cloud">Bot na Nuvem</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="bot-platform" className="text-right">
                        Plataforma
                      </Label>
                      <Select
                        value={customBotForm.platform}
                        onValueChange={v => setCustomBotForm({ ...customBotForm, platform: v })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Selecione a plataforma" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                          <SelectItem value="Telegram">Telegram</SelectItem>
                          <SelectItem value="Website">Website</SelectItem>
                          <SelectItem value="Email">Email</SelectItem>
                          <SelectItem value="Facebook">Facebook</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="bot-description" className="text-right">
                        Descrição
                      </Label>
                      <Textarea
                        id="bot-description"
                        className="col-span-3"
                        value={customBotForm.description}
                        onChange={e => setCustomBotForm({ ...customBotForm, description: e.target.value })}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateBotOpen(false)}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleCreateBot}
                    disabled={
                      (selectedTemplate && !customBotForm.platform) ||
                      (!selectedTemplate && !customBotForm.name)
                    }
                  >
                    Criar Bot
                  </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Bot Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bots Ativos</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bots.filter((b) => b.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">De {bots.length} no total</p>
          </CardContent>
          </Card>

          <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Respostas</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bots.reduce((sum, bot) => sum + bot.responses, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Neste mês</p>
          </CardContent>
          </Card>

          <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acurácia Média</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(bots.reduce((sum, bot) => sum + bot.accuracy, 0) / bots.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Acurácia das respostas</p>
          </CardContent>
          </Card>

          <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibilidade</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(bots.reduce((sum, bot) => sum + bot.uptime, 0) / bots.length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Disponibilidade média</p>
          </CardContent>
          </Card>
        </div>

        {/* Bots Management */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bots.map((bot) => (
            <Card key={bot.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(bot.type)}
                    <CardTitle className="text-lg">{bot.name}</CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(bot.status)}>{bot.status}</Badge>
                    <Switch checked={bot.status === "active"} onCheckedChange={() => handleBotToggle(bot.id)} />
                  </div>
                </div>
                <CardDescription>{bot.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Plataforma:</span>
                  <Badge variant="outline">{bot.platform}</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Respostas:</span>
                    <span className="font-medium">{bot.responses.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Acurácia:</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={bot.accuracy} className="w-16 h-2" />
                      <span className="font-medium">{bot.accuracy}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Disponibilidade:</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={bot.uptime} className="w-16 h-2" />
                      <span className="font-medium">{bot.uptime}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Última atividade: {bot.lastActive}</span>
                  <span>Criado em: {bot.created}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleConfigureBot(bot)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Configurar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEditBot(bot)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 bg-transparent" onClick={() => handleDeleteBot(bot)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

        {/* Diálogo de edição de bot */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Editar Bot</DialogTitle>
              <DialogDescription>Altere as informações do bot.</DialogDescription>
            </DialogHeader>
            {editBot && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-bot-name" className="text-right">Nome</Label>
                  <Input id="edit-bot-name" className="col-span-3" value={editBot.name} onChange={e => setEditBot({ ...editBot, name: e.target.value })} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-bot-type" className="text-right">Tipo</Label>
                  <Select value={editBot.type} onValueChange={v => setEditBot({ ...editBot, type: v })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Bot Local</SelectItem>
                      <SelectItem value="cloud">Bot na Nuvem</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-bot-platform" className="text-right">Plataforma</Label>
                  <Select value={editBot.platform} onValueChange={v => setEditBot({ ...editBot, platform: v })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                      <SelectItem value="Telegram">Telegram</SelectItem>
                      <SelectItem value="Website">Website</SelectItem>
                      <SelectItem value="Email">Email</SelectItem>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-bot-description" className="text-right">Descrição</Label>
                  <Textarea id="edit-bot-description" className="col-span-3" value={editBot.description} onChange={e => setEditBot({ ...editBot, description: e.target.value })} />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
              <Button onClick={() => handleSaveEditBot(editBot)}>Salvar Alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo de confirmação de exclusão */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Excluir Bot</DialogTitle>
              <DialogDescription>Tem certeza que deseja excluir o bot "{deleteBot?.name}"?</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
              <Button className="text-red-600" onClick={confirmDeleteBot}>Excluir</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>

        {/* Bot Configuration Dialog - versão robusta e completa */}
        <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Configurar {selectedBot?.name}</DialogTitle>
              <DialogDescription>Ajuste as configurações e parâmetros do seu bot.</DialogDescription>
            </DialogHeader>
            {configBot && (
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="general">Geral</TabsTrigger>
                  <TabsTrigger value="responses">Respostas</TabsTrigger>
                  <TabsTrigger value="triggers">Disparadores</TabsTrigger>
                  <TabsTrigger value="analytics">Análises</TabsTrigger>
                </TabsList>

                {/* Aba Geral */}
                <TabsContent value="general" className="space-y-4">
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="config-name" className="text-right">Nome</Label>
                      <Input id="config-name" value={configBot.name} onChange={e => setConfigBot((prev:any) => ({ ...prev, name: e.target.value }))} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="config-description" className="text-right">Descrição</Label>
                      <Textarea id="config-description" value={configBot.description} onChange={e => setConfigBot((prev:any) => ({ ...prev, description: e.target.value }))} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="config-type" className="text-right">Tipo</Label>
                      <Select value={configBot.type} onValueChange={v => setConfigBot((prev:any) => ({ ...prev, type: v }))}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="local">Bot Local</SelectItem>
                          <SelectItem value="cloud">Bot na Nuvem</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="config-platform" className="text-right">Plataforma</Label>
                      <Select value={configBot.platform} onValueChange={v => setConfigBot((prev:any) => ({ ...prev, platform: v }))}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Selecione a plataforma" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                          <SelectItem value="Telegram">Telegram</SelectItem>
                          <SelectItem value="Website">Website</SelectItem>
                          <SelectItem value="Email">Email</SelectItem>
                          <SelectItem value="Facebook">Facebook</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {configBot.type === "local" && (
                      <>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="config-bot-folder" className="text-right">Upload da Pasta do Bot</Label>
                          <div className="col-span-3 flex flex-col gap-2">
                            <input
                              id="config-bot-folder"
                              type="file"
                              ref={folderInputRef}
                              style={{ display: 'none' }}
                              multiple
                              onChange={handleFolderChange}
                              // @ts-ignore
                              webkitdirectory=""
                              // @ts-ignore
                              directory=""
                              title="Selecione a pasta do bot"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => folderInputRef.current?.click()}
                              disabled={analyzingFolder}
                            >
                              Selecionar Pasta
                            </Button>
                            {botFolderFiles && (
                              <span className="text-xs text-muted-foreground">{botFolderFiles.length} arquivos selecionados</span>
                            )}
                            {analyzingFolder && (
                              <div className="flex items-center gap-2 mt-2 animate-pulse">
                                <svg className="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                <span>Analisando arquivos da pasta...</span>
                              </div>
                            )}
                            {analyzeResult && (
                              <div className="flex items-center gap-2 mt-2">
                                {analyzeResult.success ? (
                                  <span className="text-green-600 font-medium flex items-center gap-1 animate-bounce">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                    Pasta válida! Todos os arquivos necessários encontrados.
                                  </span>
                                ) : (
                                  <span className="text-red-600 font-medium flex items-center gap-1 animate-shake">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                    Faltando arquivos: {analyzeResult.missing?.join(", ")}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="config-port" className="text-right">Porta</Label>
                          <Input id="config-port" type="number" placeholder="Ex: 3000" className="col-span-3" value={configBot.port} onChange={e => setConfigBot((prev:any) => ({ ...prev, port: e.target.value }))} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="config-token" className="text-right">Token/API Key</Label>
                          <Input id="config-token" type="text" placeholder="Token de autenticação" className="col-span-3" value={configBot.token} onChange={e => setConfigBot((prev:any) => ({ ...prev, token: e.target.value }))} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="config-env" className="text-right">Variáveis de Ambiente</Label>
                          <Textarea id="config-env" placeholder="CHAVE1=valor1\nCHAVE2=valor2" className="col-span-3" value={configBot.env} onChange={e => setConfigBot((prev:any) => ({ ...prev, env: e.target.value }))} />
                        </div>
                      </>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Resposta automática</Label>
                      <div className="col-span-3 flex items-center space-x-2">
                        <Switch checked={configBot.autoReply} onCheckedChange={v => setConfigBot((prev:any) => ({ ...prev, autoReply: v }))} />
                        <span className="text-sm">Habilitar respostas automáticas</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Atraso de Resposta</Label>
                      <Select value={configBot.replyDelay} onValueChange={v => setConfigBot((prev:any) => ({ ...prev, replyDelay: v }))}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Selecione o atraso" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instant">Instantâneo</SelectItem>
                          <SelectItem value="1s">1 segundo</SelectItem>
                          <SelectItem value="3s">3 segundos</SelectItem>
                          <SelectItem value="5s">5 segundos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                {/* Aba Respostas */}
                <TabsContent value="responses" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label>Saudação Padrão</Label>
                      <Textarea placeholder="Olá! Como posso ajudar você hoje?" className="mt-1" value={configBot.greeting} onChange={e => setConfigBot((prev:any) => ({ ...prev, greeting: e.target.value }))} />
                    </div>
                    <div>
                      <Label>Resposta de Contorno</Label>
                      <Textarea placeholder="Desculpe, não entendi. Você pode reformular?" className="mt-1" value={configBot.fallback} onChange={e => setConfigBot((prev:any) => ({ ...prev, fallback: e.target.value }))} />
                    </div>
                    <div>
                      <Label>Mensagem de Escalonamento</Label>
                      <Textarea placeholder="Vou te conectar com um atendente humano." className="mt-1" value={configBot.escalation} onChange={e => setConfigBot((prev:any) => ({ ...prev, escalation: e.target.value }))} />
                    </div>
                  </div>
                </TabsContent>

                {/* Aba Disparadores */}
                <TabsContent value="triggers" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Palavras-chave</Label>
                        <p className="text-sm text-muted-foreground">Palavras que ativam o bot</p>
                      </div>
                    </div>
                    <Input placeholder="Digite as palavras separadas por vírgula" value={configBot.keywords} onChange={e => setConfigBot((prev:any) => ({ ...prev, keywords: e.target.value }))} />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Horário de Funcionamento</Label>
                        <p className="text-sm text-muted-foreground">Quando o bot deve estar ativo</p>
                      </div>
                      <Switch checked={configBot.workingHoursEnabled} onCheckedChange={v => setConfigBot((prev:any) => ({ ...prev, workingHoursEnabled: v }))} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Início</Label>
                        <Input type="time" value={configBot.workingStart} onChange={e => setConfigBot((prev:any) => ({ ...prev, workingStart: e.target.value }))} />
                      </div>
                      <div>
                        <Label>Fim</Label>
                        <Input type="time" value={configBot.workingEnd} onChange={e => setConfigBot((prev:any) => ({ ...prev, workingEnd: e.target.value }))} />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Aba Análises */}
                <TabsContent value="analytics" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Taxa de Resposta</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{selectedBot.accuracy}%</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Total de Interações</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{selectedBot.responses}</div>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <Label>Acompanhamento de Performance</Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Acurácia das Respostas</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={selectedBot.accuracy} className="w-24 h-2" />
                            <span className="text-sm font-medium">{selectedBot.accuracy}%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Disponibilidade</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={selectedBot.uptime} className="w-24 h-2" />
                            <span className="text-sm font-medium">{selectedBot.uptime}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsConfigDialogOpen(false); setConfigBot(null); setSelectedBot(null); }}>
                Cancelar
              </Button>
              <Button onClick={handleSaveConfigBot}>Salvar Alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarInset>
  )
}
