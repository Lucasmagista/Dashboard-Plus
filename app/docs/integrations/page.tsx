"use client"

import { useState } from "react"
import { Globe, Search, ExternalLink, ArrowLeft, CheckCircle, AlertTriangle, Clock, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

const integrations = [
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    description: "Integração completa com WhatsApp Business API para mensagens e automação",
    category: "Comunicação",
    status: "stable",
    difficulty: "Médio",
    setupTime: "30 min",
    features: ["Mensagens", "Mídia", "Webhooks", "Templates"],
    logo: "🟢",
    popular: true,
    config: {
      webhook_url: "https://your-app.com/webhooks/whatsapp",
      token: "your_whatsapp_token",
      verify_token: "your_verify_token"
    }
  },
  {
    id: "telegram",
    name: "Telegram Bot",
    description: "Bot do Telegram para atendimento automatizado e notificações",
    category: "Comunicação",
    status: "stable",
    difficulty: "Fácil",
    setupTime: "15 min",
    features: ["Bot Commands", "Inline Keyboards", "File Upload"],
    logo: "📱",
    config: {
      bot_token: "your_telegram_bot_token",
      webhook_url: "https://your-app.com/webhooks/telegram"
    }
  },
  {
    id: "smtp",
    name: "E-mail SMTP",
    description: "Configuração de servidor SMTP para envio de e-mails transacionais",
    category: "E-mail",
    status: "stable",
    difficulty: "Fácil",
    setupTime: "10 min",
    features: ["Templates", "Anexos", "Tracking", "Bounce Handling"],
    logo: "📧",
    config: {
      host: "smtp.gmail.com",
      port: 587,
      username: "your_email@gmail.com",
      password: "your_app_password"
    }
  },
  {
    id: "webhook",
    name: "Webhooks Genéricos",
    description: "Configuração de webhooks para integração com sistemas externos",
    category: "Webhook",
    status: "stable",
    difficulty: "Médio",
    setupTime: "20 min",
    features: ["HTTP Methods", "Headers", "Authentication", "Retry Logic"],
    logo: "🔗",
    config: {
      url: "https://external-system.com/webhook",
      method: "POST",
      headers: {},
      auth_type: "bearer"
    }
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Conecte com mais de 5000 aplicações via Zapier",
    category: "Automação",
    status: "beta",
    difficulty: "Fácil",
    setupTime: "5 min",
    features: ["Triggers", "Actions", "Multi-step Zaps"],
    logo: "⚡",
    popular: true,
    config: {
      webhook_url: "https://hooks.zapier.com/hooks/catch/...",
      api_key: "your_zapier_api_key"
    }
  },
  {
    id: "google-sheets",
    name: "Google Sheets",
    description: "Sincronização de dados com planilhas do Google Sheets",
    category: "Dados",
    status: "stable",
    difficulty: "Médio",
    setupTime: "25 min",
    features: ["Read/Write", "Real-time Sync", "Multiple Sheets"],
    logo: "📊",
    config: {
      spreadsheet_id: "your_spreadsheet_id",
      service_account_key: "path/to/service-account.json",
      sheet_name: "Sheet1"
    }
  },
  {
    id: "slack",
    name: "Slack",
    description: "Notificações e comandos via Slack para sua equipe",
    category: "Comunicação",
    status: "stable",
    difficulty: "Fácil",
    setupTime: "15 min",
    features: ["Messages", "Slash Commands", "Interactive Buttons"],
    logo: "💬",
    config: {
      bot_token: "xoxb-your-slack-bot-token",
      channel: "#general",
      webhook_url: "https://hooks.slack.com/services/..."
    }
  },
  {
    id: "mysql",
    name: "MySQL Database",
    description: "Conexão externa com banco de dados MySQL",
    category: "Dados",
    status: "stable",
    difficulty: "Avançado",
    setupTime: "40 min",
    features: ["Read/Write", "Transactions", "Connection Pool"],
    logo: "🗄️",
    config: {
      host: "localhost",
      port: 3306,
      database: "crm_external",
      username: "user",
      password: "password"
    }
  }
]

const categories = ["Todas", "Comunicação", "E-mail", "Webhook", "Automação", "Dados"]

export default function IntegrationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todas")
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null)

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "Todas" || integration.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "stable": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      case "beta": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
      case "experimental": return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      case "Médio": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
      case "Avançado": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/docs">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Documentação
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">Integrações</h1>
            <p className="text-muted-foreground">
              Conecte o CRM Pro com seus serviços e ferramentas favoritas
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <Badge variant="secondary">{integrations.length} integrações</Badge>
          <Badge variant="outline">API REST</Badge>
          <Badge variant="outline">Webhooks</Badge>
        </div>
      </div>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Explorar</TabsTrigger>
          <TabsTrigger value="setup">Configuração</TabsTrigger>
          <TabsTrigger value="guides">Guias</TabsTrigger>
        </TabsList>

        {/* Browse Tab */}
        <TabsContent value="browse" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar integrações..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Popular Integrations */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Integrações Populares</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {integrations.filter(i => i.popular).map((integration) => (
                <Card key={integration.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{integration.logo}</span>
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <Badge className={getStatusColor(integration.status)} variant="secondary">
                            {integration.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{integration.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Badge className={getDifficultyColor(integration.difficulty)} variant="outline">
                          {integration.difficulty}
                        </Badge>
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          {integration.setupTime}
                        </Badge>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => setSelectedIntegration(integration.id)}
                      >
                        Configurar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* All Integrations */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Todas as Integrações</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIntegrations.map((integration) => (
                <Card key={integration.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{integration.logo}</span>
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <Badge variant="outline">{integration.category}</Badge>
                        </div>
                      </div>
                      {integration.popular && (
                        <Badge variant="secondary">Popular</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{integration.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        {integration.features.map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(integration.status)} variant="secondary">
                            {integration.status}
                          </Badge>
                          <Badge className={getDifficultyColor(integration.difficulty)} variant="outline">
                            {integration.difficulty}
                          </Badge>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => setSelectedIntegration(integration.id)}
                        >
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredIntegrations.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">
                    Nenhuma integração encontrada com os filtros aplicados.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Setup Tab */}
        <TabsContent value="setup" className="space-y-6">
          {selectedIntegration ? (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {integrations.find(i => i.id === selectedIntegration)?.logo}
                  </span>
                  <div>
                    <CardTitle>
                      Configurar {integrations.find(i => i.id === selectedIntegration)?.name}
                    </CardTitle>
                    <CardDescription>
                      Siga os passos abaixo para configurar esta integração
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Certifique-se de ter as credenciais necessárias antes de prosseguir com a configuração.
                    </AlertDescription>
                  </Alert>

                  <div>
                    <h3 className="font-semibold mb-3">Configuração Necessária</h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <pre className="text-sm">
                        <code>
                          {JSON.stringify(
                            integrations.find(i => i.id === selectedIntegration)?.config,
                            null,
                            2
                          )}
                        </code>
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Passos para Configuração</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                          1
                        </div>
                        <div>
                          <p className="font-medium">Obter Credenciais</p>
                          <p className="text-sm text-muted-foreground">
                            Acesse o painel do serviço e gere as credenciais necessárias
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                          2
                        </div>
                        <div>
                          <p className="font-medium">Configurar Webhook</p>
                          <p className="text-sm text-muted-foreground">
                            Configure o endpoint de webhook no serviço externo
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                          3
                        </div>
                        <div>
                          <p className="font-medium">Testar Conexão</p>
                          <p className="text-sm text-muted-foreground">
                            Execute um teste para verificar se a integração está funcionando
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Configurar Agora
                    </Button>
                    <Button variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Documentação Externa
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Selecione uma integração na aba "Explorar" para ver as instruções de configuração.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Guides Tab */}
        <TabsContent value="guides" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Guia de Webhooks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Aprenda como configurar webhooks para receber eventos em tempo real do CRM Pro.
                </p>
                <Button variant="outline" size="sm">
                  Ver Guia
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  API de Integrações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Documentação completa da API para criar integrações personalizadas.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/docs/api">
                    Ver API
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Melhores Práticas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Dicas e práticas recomendadas para integrações robustas e seguras.
                </p>
                <Button variant="outline" size="sm">
                  Ver Práticas
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Solução de Problemas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Problemas comuns e suas soluções nas integrações.
                </p>
                <Button variant="outline" size="sm">
                  Ver Troubleshooting
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Links */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Links Úteis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/docs/api">
              <Button variant="outline" className="w-full justify-start">
                <Globe className="h-4 w-4 mr-2" />
                API Reference
              </Button>
            </Link>
            <Link href="/docs/quick-start">
              <Button variant="outline" className="w-full justify-start">
                <Zap className="h-4 w-4 mr-2" />
                Início Rápido
              </Button>
            </Link>
            <Link href="/integrations">
              <Button variant="outline" className="w-full justify-start">
                <ExternalLink className="h-4 w-4 mr-2" />
                Painel de Integrações
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
