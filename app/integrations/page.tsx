"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Zap,
  Mail,
  CreditCard,
  MessageSquare,
  Calendar,
  BarChart3,
  Globe,
  Settings,
  Check,
  X,
  Plus,
  ExternalLink,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IntegrationsDashboard } from '@/components/integrations-dashboard';

const integrations = [
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    description: "Conecte-se com clientes via mensagens do WhatsApp",
    category: "Comunicação",
    icon: MessageSquare,
    connected: true,
    color: "text-green-600",
    features: ["Automação de mensagens", "Listas de transmissão", "Suporte a mídia rica"],
    status: "healthy",
    lastSync: "há 2 minutos",
    messagesProcessed: 1247,
    apiCalls: 5632,
    uptime: 99.8,
    webhookUrl: "https://api.yourapp.com/webhooks/whatsapp",
    apiKey: "wa_live_••••••••••••••••",
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Aceite pagamentos e gerencie cobranças",
    category: "Pagamento",
    icon: CreditCard,
    connected: true,
    color: "text-purple-600",
    features: ["Processamento de pagamentos", "Cobrança recorrente", "Gestão de faturas"],
    status: "healthy",
    lastSync: "há 5 minutos",
    transactionsProcessed: 89,
    apiCalls: 2341,
    uptime: 100,
    webhookUrl: "https://api.yourapp.com/webhooks/stripe",
    apiKey: "sk_live_••••••••••••••••",
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "Plataforma de marketing e automação de e-mails",
    category: "Marketing",
    icon: Mail,
    connected: false,
    color: "text-yellow-600",
    features: ["Campanhas de e-mail", "Segmentação de público", "Análises"],
    status: "disconnected",
    lastSync: "Nunca",
    emailsSent: 0,
    apiCalls: 0,
    uptime: 0,
    webhookUrl: "",
    apiKey: "",
  },
  {
    id: "google-calendar",
    name: "Google Agenda",
    description: "Sincronize compromissos e reuniões",
    category: "Produtividade",
    icon: Calendar,
    connected: true,
    color: "text-blue-600",
    features: ["Sincronização de agenda", "Agendamento de reuniões", "Lembretes"],
    status: "warning",
    lastSync: "há 1 hora",
    eventsSynced: 45,
    apiCalls: 892,
    uptime: 95.2,
    webhookUrl: "https://api.yourapp.com/webhooks/calendar",
    apiKey: "gc_••••••••••••••••",
  },
  {
    id: "telegram",
    name: "Telegram",
    description: "Integração com plataforma de mensagens",
    category: "Comunicação",
    icon: MessageSquare,
    connected: true,
    color: "text-blue-500",
    features: ["Integração com bot", "Mensagens em grupo", "Compartilhamento de arquivos"],
    status: "healthy",
    lastSync: "há 30 segundos",
    messagesProcessed: 567,
    apiCalls: 1234,
    uptime: 99.9,
    webhookUrl: "https://api.yourapp.com/webhooks/telegram",
    apiKey: "tg_••••••••••••••••",
  },
  {
    id: "google-analytics",
    name: "Google Analytics",
    description: "Acompanhe análises de sites e aplicativos",
    category: "Análises",
    icon: BarChart3,
    connected: false,
    color: "text-orange-600",
    features: ["Análise de tráfego", "Rastreamento de conversões", "Relatórios personalizados"],
    status: "disconnected",
    lastSync: "Nunca",
    pageViews: 0,
    apiCalls: 0,
    uptime: 0,
    webhookUrl: "",
    apiKey: "",
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Automatize fluxos de trabalho entre aplicativos",
    category: "Automação",
    icon: Zap,
    connected: false,
    color: "text-orange-500",
    features: ["Automação de fluxos", "Conexão entre apps", "Ações automáticas"],
    status: "disconnected",
    lastSync: "Nunca",
    zapsTriggered: 0,
    apiCalls: 0,
    uptime: 0,
    webhookUrl: "",
    apiKey: "",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Comunicação e colaboração em equipe",
    category: "Comunicação",
    icon: MessageSquare,
    connected: false,
    color: "text-purple-500",
    features: ["Mensagens em equipe", "Compartilhamento de arquivos", "Notificações"],
    status: "disconnected",
    lastSync: "Nunca",
    messagesSent: 0,
    apiCalls: 0,
    uptime: 0,
    webhookUrl: "",
    apiKey: "",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "healthy":
      return "bg-green-100 text-green-800"
    case "warning":
      return "bg-yellow-100 text-yellow-800"
    case "error":
      return "bg-red-100 text-red-800"
    case "disconnected":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "healthy":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "warning":
      return <AlertCircle className="h-4 w-4 text-yellow-600" />
    case "error":
      return <AlertCircle className="h-4 w-4 text-red-600" />
    case "disconnected":
      return <X className="h-4 w-4 text-gray-600" />
    default:
      return <AlertCircle className="h-4 w-4 text-gray-600" />
  }
}

const categories = ["Todas", "Comunicação", "Pagamento", "Marketing", "Produtividade", "Análises", "Automação"]

export default function IntegrationsPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todas")
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null)

  const filteredIntegrations = integrations.filter(
    (integration) => selectedCategory === "Todas" || integration.category === selectedCategory,
  )

  const connectedCount = integrations.filter((i) => i.connected).length
  const totalCount = integrations.length

  const handleToggleIntegration = (integrationId: string) => {
    // Aqui você pode implementar a chamada de API para ativar/desativar a integração.
    alert(`Alternar integração: ${integrationId}`)
  }

  const handleConfigureIntegration = (integration: any) => {
    setSelectedIntegration(integration)
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
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Integrações</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Main Tabs for Basic vs Advanced Integrations */}
        <Tabs defaultValue="basic" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Integrações</h1>
              <p className="text-muted-foreground">Conecte suas ferramentas e serviços favoritos para potencializar seu fluxo de trabalho</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                {connectedCount} de {totalCount} conectadas
              </Badge>
            </div>
          </div>

          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="basic">Integrações Básicas</TabsTrigger>
            <TabsTrigger value="advanced">Integrações Avançadas</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Integrações Básicas</h2>
                <p className="text-muted-foreground">Configure suas integrações essenciais</p>
              </div>
            </div>

        {/* Integration Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conectadas</CardTitle>
              <Check className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{connectedCount}</div>
              <p className="text-xs text-muted-foreground">Integrações ativas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Disponíveis</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCount}</div>
              <p className="text-xs text-muted-foreground">Total de integrações</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Categorias</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length - 1}</div>
              <p className="text-xs text-muted-foreground">Tipos de integração</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Automação</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Workflows ativos</p>
            </CardContent>
          </Card>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-7">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredIntegrations.map((integration) => {
                const IconComponent = integration.icon
                return (
                  <Card key={integration.id} className="relative">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg bg-muted ${integration.color}`}>
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{integration.name}</CardTitle>
                            <Badge variant="outline" className="mt-1">
                              {integration.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {integration.connected ? (
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(integration.status)}
                              <Badge className={getStatusColor(integration.status)}>
                                {(() => {
                                  switch (integration.status) {
                                    case "healthy":
                                      return "Saudável"
                                    case "warning":
                                      return "Atenção"
                                    case "error":
                                      return "Erro"
                                    case "disconnected":
                                      return "Desconectada"
                                    default:
                                      return integration.status
                                  }
                                })()}
                              </Badge>
                            </div>
                          ) : (
                            <Badge variant="secondary">
                              <X className="h-3 w-3 mr-1" />
                              Não conectada
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">{integration.description}</CardDescription>

                      {integration.connected && (
                        <div className="space-y-3 mb-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Última sincronização:</span>
                              <p className="font-medium">{integration.lastSync}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Disponibilidade:</span>
                              <p className="font-medium">{integration.uptime}%</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Chamadas API:</span>
                              <p className="font-medium">{integration.apiCalls.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                {(() => {
                                  switch (integration.category) {
                                    case "Comunicação":
                                      return "Mensagens"
                                    case "Pagamento":
                                      return "Transações"
                                    case "Produtividade":
                                      return "Eventos"
                                    default:
                                      return "Ações"
                                  }
                                })()}
                                :
                              </span>
                              <p className="font-medium">
                                {(
                                  integration.messagesProcessed ??
                                  integration.transactionsProcessed ??
                                  integration.eventsSynced ??
                                  integration.zapsTriggered ??
                                  0
                                ).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2 mb-4">
                        <h4 className="text-sm font-medium">Recursos:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {integration.features.map((feature) => (
                            <li key={feature} className="flex items-center space-x-2">
                              <Check className="h-3 w-3 text-green-600" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={integration.connected}
                            onCheckedChange={() => handleToggleIntegration(integration.id)}
                          />
                          <span className="text-sm">{integration.connected ? "Ativada" : "Desativada"}</span>
                        </div>
                        <div className="flex space-x-2">
                          {integration.connected && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleConfigureIntegration(integration)}
                              >
                                <Settings className="h-4 w-4 mr-1" />
                                Configurar
                              </Button>
                              <Button variant="outline" size="sm">
                                <BarChart3 className="h-4 w-4 mr-1" />
                                Análises
                              </Button>
                            </>
                          )}
                          <Button variant={integration.connected ? "outline" : "default"} size="sm">
                            {integration.connected ? (
                              <>
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Gerenciar
                              </>
                            ) : (
                              <>
                                <Plus className="h-4 w-4 mr-1" />
                                Conectar
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Configuration Dialog */}
        <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Configurar {selectedIntegration?.name}</DialogTitle>
              <DialogDescription>
                Personalize as configurações da integração {selectedIntegration?.name}.
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">Geral</TabsTrigger>
                <TabsTrigger value="authentication">Autenticação</TabsTrigger>
                <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
                <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="integration-name" className="text-right">
                      Nome
                    </Label>
                    <Input id="integration-name" defaultValue={selectedIntegration?.name} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="sync-frequency" className="text-right">
                      Frequência de sincronização
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione a frequência" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Tempo real</SelectItem>
                        <SelectItem value="1min">A cada minuto</SelectItem>
                        <SelectItem value="5min">A cada 5 minutos</SelectItem>
                        <SelectItem value="15min">A cada 15 minutos</SelectItem>
                        <SelectItem value="1hour">A cada hora</SelectItem>
                        <SelectItem value="daily">Diariamente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Tentar novamente automaticamente</Label>
                      <div className="col-span-3 flex items-center space-x-2">
                        <Switch />
                        <span className="text-sm">Habilitar nova tentativa em caso de falha</span>
                      </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="authentication">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="api-key" className="text-right">
                      Chave da API
                    </Label>
                    <Input
                      id="api-key"
                      type="password"
                      className="col-span-3"
                      defaultValue={selectedIntegration?.apiKey}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="webhooks">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="webhook-url" className="text-right">
                      URL do Webhook
                    </Label>
                    <Input id="webhook-url" className="col-span-3" defaultValue={selectedIntegration?.webhookUrl} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="monitoring">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Habilitar logs</Label>
                      <div className="col-span-3 flex items-center space-x-2">
                        <Switch />
                        <span className="text-sm">Registrar atividade da integração</span>
                      </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <Button type="submit" onClick={() => setIsConfigDialogOpen(false)}>
                Salvar configurações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <IntegrationsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  )
}
