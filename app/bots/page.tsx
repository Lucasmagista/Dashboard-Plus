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

// Type definitions
type BotType = 'nodejs' | 'python' | 'unknown'

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

  // Upload de pasta do bot local - removida variável não utilizada
  const [analyzingFolder, setAnalyzingFolder] = useState(false)
  const [analyzeResult, setAnalyzeResult] = useState<{ 
    success: boolean, 
    missing?: string[], 
    found?: string[],
    totalFiles?: number,
    botType?: BotType
  } | null>(null)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [currentAnalyzing, setCurrentAnalyzing] = useState('')
  const [installationStatus, setInstallationStatus] = useState<'idle' | 'installing' | 'running' | 'error' | 'success'>('idle')
  const [installationLogs, setInstallationLogs] = useState<string[]>([])
  const [botProcess, setBotProcess] = useState<{ pid: number, status: 'running' | 'stopped' } | null>(null)
  const folderInputRef = React.useRef<HTMLInputElement>(null)

  // Arquivos obrigatórios para diferentes tipos de bot
  const BOT_REQUIREMENTS = {
    nodejs: ["package.json", "index.js"],
    python: ["requirements.txt", "main.py"],
    alternative_nodejs: ["package.json", "app.js"],
    alternative_python: ["requirements.txt", "bot.py"]
  }

  // Funções auxiliares para análise de pasta
  const detectBotType = (fileNames: string[]) => {
    let botType: BotType = 'unknown'
    let requirements: string[] = []
    
    if (fileNames.includes('package.json')) {
      botType = 'nodejs'
      requirements = fileNames.includes('index.js') ? BOT_REQUIREMENTS.nodejs : BOT_REQUIREMENTS.alternative_nodejs
    } else if (fileNames.includes('requirements.txt')) {
      botType = 'python'
      requirements = fileNames.includes('main.py') ? BOT_REQUIREMENTS.python : BOT_REQUIREMENTS.alternative_python
    }
    
    return { botType, requirements }
  }

  const performAnalysisSteps = (requirements: string[], fileNames: string[], totalFiles: number, botType: BotType) => {
    const analysisSteps = [
      'Verificando estrutura do projeto...',
      'Analisando dependências...',
      'Validando arquivos principais...',
      'Verificando configurações...',
      'Finalizando análise...'
    ]
    
    const analyzeStep = (stepIndex: number) => {
      if (stepIndex >= analysisSteps.length) {
        const foundFiles = requirements.filter(req => fileNames.includes(req))
        const missingFiles = requirements.filter(req => !fileNames.includes(req))
        
        setAnalyzeResult({
          success: missingFiles.length === 0,
          missing: missingFiles,
          found: foundFiles,
          totalFiles,
          botType
        })
        setAnalyzingFolder(false)
        setAnalysisProgress(100)
        setCurrentAnalyzing('Análise concluída!')
        return
      }
      
      setCurrentAnalyzing(analysisSteps[stepIndex])
      setAnalysisProgress((stepIndex + 1) * 20)
      
      setTimeout(() => analyzeStep(stepIndex + 1), 800)
    }
    
    analyzeStep(0)
  }

  function handleFolderChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    setAnalyzeResult(null)
    setAnalysisProgress(0)
    setCurrentAnalyzing('')
    
    if (!files || files.length === 0) return
    
    setAnalyzingFolder(true)
    
    const fileNames = Array.from(files).map(f => f.webkitRelativePath.split("/").pop() || f.name)
    const totalFiles = files.length
    
    const { botType, requirements } = detectBotType(fileNames)
    performAnalysisSteps(requirements, fileNames, totalFiles, botType)
  }

  // Funções de gerenciamento do bot
  const runInstallationSteps = async () => {
    const steps = [
      'Extraindo arquivos...',
      'Instalando dependências...',
      'Configurando ambiente...',
      'Verificando conectividade...',
      'Instalação concluída!'
    ]
    
    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setInstallationLogs(prev => [...prev, step])
    }
  }

  // Funções para gerenciar o bot
  const handleInstallBot = async () => {
    if (!configBot) return
    
    setInstallationStatus('installing')
    setInstallationLogs(['Iniciando instalação...'])
    
    await runInstallationSteps()
    setInstallationStatus('success')
  }
  
  const handleStartBot = async () => {
    if (!configBot) return
    
    setInstallationStatus('running')
    setInstallationLogs(prev => [...prev, 'Iniciando bot...'])
    
    // Simula inicialização
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setBotProcess({ pid: Math.floor(Math.random() * 10000) + 1000, status: 'running' })
    setInstallationLogs(prev => [...prev, `Bot iniciado com PID ${Math.floor(Math.random() * 10000) + 1000}`, 'Bot está rodando e pronto para receber mensagens'])
  }
  
  const handleStopBot = async () => {
    if (!botProcess) return
    
    setInstallationLogs(prev => [...prev, `Parando bot (PID: ${botProcess.pid})...`])
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setBotProcess({ ...botProcess, status: 'stopped' })
    setInstallationLogs(prev => [...prev, 'Bot parado com sucesso'])
    setInstallationStatus('success')
  }
  
  const handleRestartBot = async () => {
    await handleStopBot()
    await new Promise(resolve => setTimeout(resolve, 500))
    await handleStartBot()
  }

  // Funções auxiliares para reduzir complexidade
  const getBotTypeLabel = (botType?: 'nodejs' | 'python' | 'unknown') => {
    switch (botType) {
      case 'nodejs': return 'Node.js'
      case 'python': return 'Python'
      default: return 'Desconhecido'
    }
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

  // Funções de criação e configuração de bots
  const createBotFromTemplate = (template: any) => ({
    id: Date.now(),
    name: `Bot ${template.name}`,
    type: "cloud",
    platform: template.platforms[0],
    status: "active",
    description: template.description,
    responses: 0,
    accuracy: 90,
    uptime: 100,
    lastActive: "agora",
    created: new Date().toISOString().slice(0, 10)
  })

  const createBotFromForm = () => ({
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
  })

  const resetCreateBotState = () => {
    setIsCreateBotOpen(false)
    setSelectedTemplate(null)
    setCustomBotForm({ name: "", type: "local", platform: "WhatsApp", description: "" })
  }

  const handleCreateBot = () => {
    const newBot = selectedTemplate ? createBotFromTemplate(selectedTemplate) : createBotFromForm()
    setBots((prev) => [...prev, newBot])
    resetCreateBotState()
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
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="general">Geral</TabsTrigger>
                  <TabsTrigger value="management">Gerenciamento</TabsTrigger>
                  <TabsTrigger value="responses">Respostas</TabsTrigger>
                  <TabsTrigger value="triggers">Disparadores</TabsTrigger>
                  <TabsTrigger value="analytics">Análises</TabsTrigger>
                </TabsList>

                {/* Aba Geral */}
                <TabsContent value="general" className="space-y-4">
                  <div className="max-h-[60vh] overflow-y-auto px-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Nome */}
                      <div className="flex flex-col gap-1">
                        <Label htmlFor="config-name">Nome</Label>
                        <Input id="config-name" value={configBot.name} onChange={e => setConfigBot((prev:any) => ({ ...prev, name: e.target.value }))} />
                        <span className="text-xs text-muted-foreground">Nome do bot para identificação interna.</span>
                      </div>
                      {/* Descrição */}
                      <div className="flex flex-col gap-1">
                        <Label htmlFor="config-description">Descrição</Label>
                        <Textarea id="config-description" value={configBot.description} onChange={e => setConfigBot((prev:any) => ({ ...prev, description: e.target.value }))} />
                        <span className="text-xs text-muted-foreground">Breve descrição da função do bot.</span>
                      </div>
                      {/* Tipo */}
                      <div className="flex flex-col gap-1">
                        <Label htmlFor="config-type">Tipo</Label>
                        <Select value={configBot.type} onValueChange={v => setConfigBot((prev:any) => ({ ...prev, type: v }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="local">Bot Local</SelectItem>
                            <SelectItem value="cloud">Bot na Nuvem</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="text-xs text-muted-foreground">Onde o bot será executado.</span>
                      </div>
                      {/* Plataforma */}
                      <div className="flex flex-col gap-1">
                        <Label htmlFor="config-platform">Plataforma</Label>
                        <Select value={configBot.platform} onValueChange={v => setConfigBot((prev:any) => ({ ...prev, platform: v }))}>
                          <SelectTrigger>
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
                        <span className="text-xs text-muted-foreground">Canal principal de atuação do bot.</span>
                      </div>
                      {/* Porta */}
                      <div className="flex flex-col gap-1">
                        <Label htmlFor="config-port">Porta</Label>
                        <Input id="config-port" type="number" placeholder="Ex: 3000" value={configBot.port} onChange={e => setConfigBot((prev:any) => ({ ...prev, port: e.target.value }))} />
                        <span className="text-xs text-muted-foreground">Porta de execução do bot local.</span>
                      </div>
                      {/* Token/API Key */}
                      <div className="flex flex-col gap-1">
                        <Label htmlFor="config-token">Token/API Key</Label>
                        <Input id="config-token" type="text" placeholder="Token de autenticação" value={configBot.token} onChange={e => setConfigBot((prev:any) => ({ ...prev, token: e.target.value }))} />
                        <span className="text-xs text-muted-foreground">Chave de autenticação para integrações.</span>
                      </div>
                      {/* Variáveis de Ambiente */}
                      <div className="flex flex-col gap-1 md:col-span-2">
                        <Label htmlFor="config-env">Variáveis de Ambiente</Label>
                        <Textarea id="config-env" placeholder={"CHAVE1=valor1\nCHAVE2=valor2"} value={configBot.env} onChange={e => setConfigBot((prev:any) => ({ ...prev, env: e.target.value }))} rows={3} />
                        <span className="text-xs text-muted-foreground">Variáveis no formato CHAVE=valor, uma por linha.</span>
                      </div>
                      {/* Upload de Pasta do Bot */}
                      <div className="flex flex-col gap-1 md:col-span-2">
                        <Label>Upload da Pasta do Bot</Label>
                        <input
                          type="file"
                          multiple
                          ref={folderInputRef}
                          title="Selecione a pasta do bot"
                          className="block w-full text-sm text-muted-foreground border border-input rounded-md file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                          onChange={handleFolderChange}
                          {...({ webkitdirectory: "true" } as any)}
                        />
                        
                        {/* Análise em progresso */}
                        {analyzingFolder && (
                          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                              <span className="text-sm font-medium text-blue-700">Analisando arquivos...</span>
                            </div>
                            <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
                              <Progress value={analysisProgress} className="h-2" />
                            </div>
                            <p className="text-xs text-blue-600">{currentAnalyzing}</p>
                          </div>
                        )}
                        
                        {/* Resultado da análise */}
                        {analyzeResult && !analyzingFolder && (
                          <div className={`mt-2 p-3 rounded-md border ${
                            analyzeResult.success 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-red-50 border-red-200'
                          }`}>
                            <div className="flex items-center gap-2 mb-2">
                              {analyzeResult.success ? (
                                <div className="h-4 w-4 text-green-600">
                                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              ) : (
                                <div className="h-4 w-4 text-red-600">
                                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </div>
                              )}
                              <span className={`text-sm font-medium ${
                                analyzeResult.success ? 'text-green-700' : 'text-red-700'
                              }`}>
                                {analyzeResult.success ? 'Pasta válida!' : 'Problemas encontrados'}
                              </span>
                            </div>
                            
                            <div className="text-xs space-y-1">
                              <p className="text-gray-600">
                                <strong>Tipo detectado:</strong> {getBotTypeLabel(analyzeResult.botType)}
                              </p>
                              <p className="text-gray-600">
                                <strong>Total de arquivos:</strong> {analyzeResult.totalFiles}
                              </p>
                              
                              {analyzeResult.found && analyzeResult.found.length > 0 && (
                                <p className="text-green-600">
                                  <strong>Arquivos encontrados:</strong> {analyzeResult.found.join(', ')}
                                </p>
                              )}
                              
                              {analyzeResult.missing && analyzeResult.missing.length > 0 && (
                                <p className="text-red-600">
                                  <strong>Arquivos faltando:</strong> {analyzeResult.missing.join(', ')}
                                </p>
                              )}
                            </div>
                            
                            {/* Botões de ação após análise bem-sucedida */}
                            {analyzeResult.success && (
                              <div className="mt-3 flex gap-2">
                                <Button 
                                  size="sm" 
                                  onClick={handleInstallBot}
                                  disabled={installationStatus === 'installing'}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  {installationStatus === 'installing' ? 'Instalando...' : 'Instalar'}
                                </Button>
                                {installationStatus === 'success' && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={handleStartBot}
                                    disabled={botProcess?.status === 'running'}
                                  >
                                    Iniciar Bot
                                  </Button>
                                )}
                                {botProcess?.status === 'running' && (
                                  <>
                                    <Button size="sm" variant="outline" onClick={handleStopBot}>
                                      Parar
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={handleRestartBot}>
                                      Reiniciar
                                    </Button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Logs de instalação */}
                        {installationLogs.length > 0 && (
                          <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Logs de Instalação</h4>
                            <div className="max-h-32 overflow-y-auto space-y-1">
                              {installationLogs.map((log) => (
                                <p key={log} className="text-xs text-gray-600 font-mono">
                                  {log}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Status do processo */}
                        {botProcess && (
                          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-blue-700">
                                <strong>PID:</strong> {botProcess.pid} | <strong>Status:</strong> {botProcess.status}
                              </span>
                              <div className={`h-2 w-2 rounded-full ${
                                botProcess.status === 'running' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                              }`}></div>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Resposta Automática */}
                      <div className="flex flex-col gap-1">
                        <Label htmlFor="config-auto-reply">Resposta automática</Label>
                        <Switch id="config-auto-reply" checked={configBot.autoReply} onCheckedChange={v => setConfigBot((prev:any) => ({ ...prev, autoReply: v }))} />
                        <span className="text-xs text-muted-foreground">Habilitar respostas automáticas.</span>
                      </div>
                      {/* Atraso de Resposta */}
                      <div className="flex flex-col gap-1">
                        <Label htmlFor="config-reply-delay">Atraso de Resposta</Label>
                        <Select value={configBot.replyDelay} onValueChange={v => setConfigBot((prev:any) => ({ ...prev, replyDelay: v }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o atraso" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="instant">Instantâneo</SelectItem>
                            <SelectItem value="1s">1 segundo</SelectItem>
                            <SelectItem value="3s">3 segundos</SelectItem>
                            <SelectItem value="5s">5 segundos</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="text-xs text-muted-foreground">Tempo de espera antes de responder.</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Aba Gerenciamento */}
                <TabsContent value="management" className="space-y-4">
                  <div className="max-h-[60vh] overflow-y-auto px-1">
                    <div className="space-y-6">
                      {/* Status do Bot */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="pt-4">
                            <div className="text-center">
                              <div className={`h-12 w-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
                                botProcess?.status === 'running' ? 'bg-green-100' : 'bg-gray-100'
                              }`}>
                                <div className={`h-6 w-6 rounded-full ${
                                  botProcess?.status === 'running' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                                }`}></div>
                              </div>
                              <p className="text-sm font-medium">Status</p>
                              <p className="text-xs text-muted-foreground">
                                {botProcess?.status === 'running' ? 'Executando' : 'Parado'}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="pt-4">
                            <div className="text-center">
                              <div className="h-12 w-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-2">
                                <Server className="h-6 w-6 text-blue-600" />
                              </div>
                              <p className="text-sm font-medium">PID</p>
                              <p className="text-xs text-muted-foreground">
                                {botProcess?.pid || 'N/A'}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="pt-4">
                            <div className="text-center">
                              <div className="h-12 w-12 mx-auto rounded-full bg-purple-100 flex items-center justify-center mb-2">
                                <Activity className="h-6 w-6 text-purple-600" />
                              </div>
                              <p className="text-sm font-medium">Uptime</p>
                              <p className="text-xs text-muted-foreground">
                                {botProcess?.status === 'running' ? '1h 23m' : '0m'}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      {/* Controles do Bot */}
                      <div className="border rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-4">Controles do Bot</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <Button 
                              className="w-full"
                              onClick={handleInstallBot}
                              disabled={installationStatus === 'installing' || !analyzeResult?.success}
                            >
                              {installationStatus === 'installing' ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Instalando...
                                </>
                              ) : (
                                'Instalar Dependências'
                              )}
                            </Button>
                            
                            <Button 
                              className="w-full"
                              variant="outline"
                              onClick={handleStartBot}
                              disabled={installationStatus !== 'success' || botProcess?.status === 'running'}
                            >
                              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <polygon points="5,3 19,12 5,21" />
                              </svg>
                              Iniciar Bot
                            </Button>
                            
                            <Button 
                              className="w-full"
                              variant="outline"
                              onClick={handleStopBot}
                              disabled={botProcess?.status !== 'running'}
                            >
                              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <rect x="6" y="4" width="4" height="16" />
                                <rect x="14" y="4" width="4" height="16" />
                              </svg>
                              Parar Bot
                            </Button>
                          </div>
                          
                          <div className="space-y-3">
                            <Button 
                              className="w-full"
                              variant="outline"
                              onClick={handleRestartBot}
                              disabled={botProcess?.status !== 'running'}
                            >
                              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <polyline points="23,4 23,10 17,10" />
                                <polyline points="1,20 1,14 7,14" />
                                <path d="M20.49,9A9,9,0,0,0,5.64,5.64L1,10" />
                                <path d="M3.51,15a9,9,0,0,0,14.85,4.36L23,14" />
                              </svg>
                              Reiniciar Bot
                            </Button>
                            
                            <Button 
                              className="w-full text-red-600 border-red-300 hover:bg-red-50"
                              variant="outline"
                              onClick={() => {
                                setInstallationLogs([])
                                setInstallationStatus('idle')
                                setBotProcess(null)
                              }}
                            >
                              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Limpar Dados
                            </Button>
                            
                            <Button 
                              className="w-full"
                              variant="outline"
                              onClick={() => window.open(`http://localhost:${configBot?.port || 3000}`, '_blank')}
                              disabled={botProcess?.status !== 'running'}
                            >
                              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              Abrir Interface
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Monitoramento em Tempo Real */}
                      <div className="border rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-4">Monitoramento</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium">CPU</Label>
                            <div className="mt-1">
                              <Progress value={botProcess?.status === 'running' ? 15 : 0} className="h-2" />
                              <span className="text-xs text-muted-foreground">
                                {botProcess?.status === 'running' ? '15%' : '0%'}
                              </span>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Memória</Label>
                            <div className="mt-1">
                              <Progress value={botProcess?.status === 'running' ? 32 : 0} className="h-2" />
                              <span className="text-xs text-muted-foreground">
                                {botProcess?.status === 'running' ? '128MB / 400MB' : '0MB'}
                              </span>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Mensagens Processadas</Label>
                            <div className="text-2xl font-bold">
                              {botProcess?.status === 'running' ? '1,247' : '0'}
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Taxa de Resposta</Label>
                            <div className="text-2xl font-bold">
                              {botProcess?.status === 'running' ? '94%' : '0%'}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Console de Logs */}
                      {installationLogs.length > 0 && (
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Console</h3>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setInstallationLogs([])}
                            >
                              Limpar
                            </Button>
                          </div>
                          <div className="bg-gray-900 text-green-400 p-3 rounded-md font-mono text-sm max-h-40 overflow-y-auto">
                            {installationLogs.map((log) => (
                              <div key={log} className="mb-1">
                                <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span> {log}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
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
