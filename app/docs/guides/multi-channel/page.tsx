"use client"

import { useState } from "react"
import { 
  ArrowLeft,
  Globe,
  MessageSquare,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Clock,
  User,
  Star,
  Zap,
  Settings,
  Target,
  BarChart3,
  Users,
  Workflow,
  CheckCircle,
  Copy,
  AlertTriangle,
  TrendingUp,
  Smartphone,
  Monitor
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

export default function MultiChannelGuide() {
  const [copiedCode, setCopiedCode] = useState("")

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(""), 2000)
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/docs/guides" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Guias
        </Link>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <Globe className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Comunicação Multicanal</h1>
            <p className="text-muted-foreground">Estratégias para orquestrar comunicação em múltiplos canais</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            25 min de leitura
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            Marketing Team
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            4.7 (134 avaliações)
          </div>
          <Badge variant="secondary">Intermediário</Badge>
          <Badge variant="outline">Comunicação</Badge>
        </div>
      </div>

      {/* Visão Geral dos Canais */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Panorama dos Canais Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-950/10 rounded-lg border border-green-200 dark:border-green-800">
              <MessageSquare className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="font-medium">WhatsApp</div>
              <div className="text-sm text-muted-foreground">93% de alcance</div>
              <Progress value={93} className="mt-2" />
            </div>
            
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/10 rounded-lg border border-blue-200 dark:border-blue-800">
              <Mail className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-medium">Email</div>
              <div className="text-sm text-muted-foreground">76% de alcance</div>
              <Progress value={76} className="mt-2" />
            </div>
            
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/10 rounded-lg border border-orange-200 dark:border-orange-800">
              <Phone className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="font-medium">SMS</div>
              <div className="text-sm text-muted-foreground">98% de alcance</div>
              <Progress value={98} className="mt-2" />
            </div>
            
            <div className="text-center p-4 bg-pink-50 dark:bg-pink-950/10 rounded-lg border border-pink-200 dark:border-pink-800">
              <Instagram className="h-8 w-8 text-pink-600 mx-auto mb-2" />
              <div className="font-medium">Social Media</div>
              <div className="text-sm text-muted-foreground">45% de alcance</div>
              <Progress value={45} className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert de Estratégia */}
      <Alert className="mb-8 border-purple-200 dark:border-purple-800">
        <TrendingUp className="h-4 w-4" />
        <AlertTitle>Estratégia Omnichannel</AlertTitle>
        <AlertDescription>
          Uma abordagem multicanal bem executada pode aumentar a taxa de conversão em até 300% e melhorar significativamente a experiência do cliente.
        </AlertDescription>
      </Alert>

      {/* Tabs de Conteúdo */}
      <Tabs defaultValue="strategy" className="mb-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="strategy">Estratégia</TabsTrigger>
          <TabsTrigger value="synchronization">Sincronização</TabsTrigger>
          <TabsTrigger value="experience">Experiência</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
        </TabsList>

        <TabsContent value="strategy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="h-5 w-5" />
                Estratégia Omnichannel
              </CardTitle>
              <CardDescription>
                Como criar uma estratégia coesa entre todos os canais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Princípios Fundamentais</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h5 className="font-medium text-blue-600 dark:text-blue-400">Consistência</h5>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Mensagem unificada em todos os canais</li>
                      <li>• Tom de voz coerente</li>
                      <li>• Identidade visual consistente</li>
                      <li>• Timing coordenado</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h5 className="font-medium text-green-600 dark:text-green-400">Personalização</h5>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Conteúdo adaptado por canal</li>
                      <li>• Segmentação por preferência</li>
                      <li>• Histórico de interações</li>
                      <li>• Contexto do cliente</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold">Mapeamento da Jornada do Cliente</h4>
                <div className="bg-muted p-4 rounded-lg space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-background rounded border">
                      <div className="font-medium text-blue-600 mb-2">Descoberta</div>
                      <div className="text-xs space-y-1 text-muted-foreground">
                        <div>• Redes sociais</div>
                        <div>• Google Ads</div>
                        <div>• Indicações</div>
                      </div>
                    </div>
                    
                    <div className="text-center p-3 bg-background rounded border">
                      <div className="font-medium text-green-600 mb-2">Consideração</div>
                      <div className="text-xs space-y-1 text-muted-foreground">
                        <div>• Email marketing</div>
                        <div>• WhatsApp</div>
                        <div>• Website</div>
                      </div>
                    </div>
                    
                    <div className="text-center p-3 bg-background rounded border">
                      <div className="font-medium text-orange-600 mb-2">Decisão</div>
                      <div className="text-xs space-y-1 text-muted-foreground">
                        <div>• Ligação direta</div>
                        <div>• Demo personalizada</div>
                        <div>• Proposta comercial</div>
                      </div>
                    </div>
                    
                    <div className="text-center p-3 bg-background rounded border">
                      <div className="font-medium text-purple-600 mb-2">Pós-venda</div>
                      <div className="text-xs space-y-1 text-muted-foreground">
                        <div>• Onboarding</div>
                        <div>• Suporte</div>
                        <div>• Upselling</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Configuração de Canais por Propósito</h4>
                <div className="grid grid-cols-1 gap-4">
                  <Card className="p-4">
                    <h5 className="font-medium mb-3">Canal de Aquisição</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="bg-muted p-3 rounded">
                        <div className="font-medium text-sm mb-2">Redes Sociais</div>
                        <div className="text-xs text-muted-foreground">
                          Conteúdo educativo, awareness, engajamento
                        </div>
                      </div>
                      <div className="bg-muted p-3 rounded">
                        <div className="font-medium text-sm mb-2">Google Ads</div>
                        <div className="text-xs text-muted-foreground">
                          Captura de leads qualificados
                        </div>
                      </div>
                      <div className="bg-muted p-3 rounded">
                        <div className="font-medium text-sm mb-2">SEO/Blog</div>
                        <div className="text-xs text-muted-foreground">
                          Educação e captura orgânica
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h5 className="font-medium mb-3">Canal de Conversão</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="bg-muted p-3 rounded">
                        <div className="font-medium text-sm mb-2">WhatsApp</div>
                        <div className="text-xs text-muted-foreground">
                          Relacionamento próximo, dúvidas
                        </div>
                      </div>
                      <div className="bg-muted p-3 rounded">
                        <div className="font-medium text-sm mb-2">Email</div>
                        <div className="text-xs text-muted-foreground">
                          Nutrição, cases, propostas
                        </div>
                      </div>
                      <div className="bg-muted p-3 rounded">
                        <div className="font-medium text-sm mb-2">Telefone</div>
                        <div className="text-xs text-muted-foreground">
                          Fechamento, negociação
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="synchronization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Sincronização de Canais
              </CardTitle>
              <CardDescription>
                Como manter todos os canais coordenados e sincronizados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Central de Dados Unificada</h4>
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Todos os canais devem compartilhar a mesma base de dados para garantir consistência:
                  </p>
                  <div className="bg-background p-3 rounded border font-mono text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span>Estrutura de Dados Unificada</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(`// Central de dados do cliente
const customerData = {
  id: "customer_123",
  profile: {
    name: "João Silva",
    email: "joao@email.com",
    phone: "+5511999999999",
    preferences: {
      channels: ["whatsapp", "email"],
      frequency: "weekly",
      topics: ["produtos", "ofertas"]
    }
  },
  interactions: [
    {
      channel: "whatsapp",
      timestamp: "2024-01-15T10:30:00Z",
      type: "message_received",
      content: "Interesse em produto X"
    },
    {
      channel: "email",
      timestamp: "2024-01-15T14:00:00Z",
      type: "email_opened",
      campaign: "produto_x_nurturing"
    }
  ],
  journey: {
    stage: "consideration",
    score: 75,
    next_action: "send_demo_invitation"
  }
};`, "unified-data")}
                      >
                        {copiedCode === "unified-data" ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                    <pre className="text-muted-foreground whitespace-pre-wrap">{`// Central de dados do cliente
const customerData = {
  id: "customer_123",
  profile: {
    name: "João Silva",
    email: "joao@email.com",
    phone: "+5511999999999",
    preferences: {
      channels: ["whatsapp", "email"],
      frequency: "weekly",
      topics: ["produtos", "ofertas"]
    }
  },
  interactions: [
    {
      channel: "whatsapp",
      timestamp: "2024-01-15T10:30:00Z",
      type: "message_received",
      content: "Interesse em produto X"
    },
    {
      channel: "email",
      timestamp: "2024-01-15T14:00:00Z",
      type: "email_opened",
      campaign: "produto_x_nurturing"
    }
  ],
  journey: {
    stage: "consideration",
    score: 75,
    next_action: "send_demo_invitation"
  }
};`}</pre>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Triggers de Sincronização</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h5 className="font-medium text-green-600 dark:text-green-400 mb-2">Triggers Automáticos</h5>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Email aberto → WhatsApp follow-up</li>
                      <li>• Link clicado → Remarketing ads</li>
                      <li>• Carrinho abandonado → SMS + Email</li>
                      <li>• Inatividade → Re-engajamento multicanal</li>
                    </ul>
                  </Card>
                  
                  <Card className="p-4">
                    <h5 className="font-medium text-blue-600 dark:text-blue-400 mb-2">Triggers Manuais</h5>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Reunião agendada → Preparação multicanal</li>
                      <li>• Proposta enviada → Acompanhamento coordenado</li>
                      <li>• Objeção identificada → Conteúdo específico</li>
                      <li>• Fechamento → Onboarding integrado</li>
                    </ul>
                  </Card>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Exemplo de Automação Integrada</h4>
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Fluxo automatizado para lead que baixou material:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2 bg-background rounded border">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="text-sm">
                        <strong>Dia 0:</strong> Email de boas-vindas + Material
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-background rounded border">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="text-sm">
                        <strong>Dia 1:</strong> WhatsApp: "Conseguiu acessar o material?"
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-background rounded border">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="text-sm">
                        <strong>Dia 3:</strong> Email: Case de sucesso relacionado
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-background rounded border">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div className="text-sm">
                        <strong>Dia 7:</strong> SMS: Convite para demo personalizada
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Evite Spam Multicanal</AlertTitle>
                <AlertDescription>
                  Configure frequency capping para evitar sobrecarga de mensagens. Respeite as preferências de canal do cliente.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Experiência do Cliente
              </CardTitle>
              <CardDescription>
                Como criar uma experiência fluida e consistente entre canais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Transições Suaves Entre Canais</h4>
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <p className="text-sm text-muted-foreground">
                    O cliente deve sentir que está conversando com a mesma empresa, independente do canal:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">✅ Boas Práticas</h5>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li>• Histórico compartilhado entre canais</li>
                        <li>• Contexto preservado nas mudanças</li>
                        <li>• Resposta rápida independente do canal</li>
                        <li>• Tom consistente de comunicação</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">❌ Evitar</h5>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li>• Pedir informações já fornecidas</li>
                        <li>• Mensagens conflitantes entre canais</li>
                        <li>• Tempos de resposta muito diferentes</li>
                        <li>• Forçar mudança de canal</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Personalização por Canal</h4>
                <div className="grid grid-cols-1 gap-4">
                  <Card className="p-4">
                    <h5 className="font-medium mb-3 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-green-600" />
                      WhatsApp Business
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-muted p-3 rounded">
                        <div className="font-medium text-sm mb-1">Características</div>
                        <div className="text-xs text-muted-foreground">
                          Informal, rápido, visual, emoticons
                        </div>
                      </div>
                      <div className="bg-muted p-3 rounded">
                        <div className="font-medium text-sm mb-1">Melhor para</div>
                        <div className="text-xs text-muted-foreground">
                          Suporte, atualizações, confirmações
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h5 className="font-medium mb-3 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-600" />
                      Email Marketing
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-muted p-3 rounded">
                        <div className="font-medium text-sm mb-1">Características</div>
                        <div className="text-xs text-muted-foreground">
                          Formal, detalhado, estruturado
                        </div>
                      </div>
                      <div className="bg-muted p-3 rounded">
                        <div className="font-medium text-sm mb-1">Melhor para</div>
                        <div className="text-xs text-muted-foreground">
                          Nutrição, newsletters, propostas
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h5 className="font-medium mb-3 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-orange-600" />
                      SMS
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-muted p-3 rounded">
                        <div className="font-medium text-sm mb-1">Características</div>
                        <div className="text-xs text-muted-foreground">
                          Conciso, urgente, direto
                        </div>
                      </div>
                      <div className="bg-muted p-3 rounded">
                        <div className="font-medium text-sm mb-1">Melhor para</div>
                        <div className="text-xs text-muted-foreground">
                          Alertas, lembretes, ofertas flash
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Preferências do Cliente</h4>
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Configure um centro de preferências para que o cliente escolha como quer ser contatado:
                  </p>
                  <div className="bg-background p-3 rounded border">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-green-600" />
                          <span className="text-sm">WhatsApp</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Preferido para: Suporte, Updates</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">Email</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Preferido para: Newsletter, Ofertas</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-orange-600" />
                          <span className="text-sm">Telefone</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Apenas emergências</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Métricas Unificadas
              </CardTitle>
              <CardDescription>
                Como medir e otimizar a performance multicanal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">KPIs por Canal</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h5 className="font-medium mb-3">Métricas de Alcance</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Taxa de entrega</span>
                        <span className="font-medium">96%</span>
                      </div>
                      <Progress value={96} className="h-2" />
                      
                      <div className="flex justify-between text-sm">
                        <span>Taxa de abertura</span>
                        <span className="font-medium">34%</span>
                      </div>
                      <Progress value={34} className="h-2" />
                      
                      <div className="flex justify-between text-sm">
                        <span>Taxa de clique</span>
                        <span className="font-medium">8%</span>
                      </div>
                      <Progress value={8} className="h-2" />
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <h5 className="font-medium mb-3">Métricas de Conversão</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Lead to MQL</span>
                        <span className="font-medium">23%</span>
                      </div>
                      <Progress value={23} className="h-2" />
                      
                      <div className="flex justify-between text-sm">
                        <span>MQL to SQL</span>
                        <span className="font-medium">41%</span>
                      </div>
                      <Progress value={41} className="h-2" />
                      
                      <div className="flex justify-between text-sm">
                        <span>SQL to Customer</span>
                        <span className="font-medium">67%</span>
                      </div>
                      <Progress value={67} className="h-2" />
                    </div>
                  </Card>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Attribution Modeling</h4>
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Entenda a contribuição de cada canal na jornada do cliente:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-background p-3 rounded border text-center">
                      <div className="text-sm font-medium mb-1">First Touch</div>
                      <div className="text-xs text-muted-foreground">Primeiro canal de contato</div>
                      <div className="text-lg font-bold text-blue-600 mt-2">35%</div>
                    </div>
                    
                    <div className="bg-background p-3 rounded border text-center">
                      <div className="text-sm font-medium mb-1">Last Touch</div>
                      <div className="text-xs text-muted-foreground">Último canal antes da conversão</div>
                      <div className="text-lg font-bold text-green-600 mt-2">42%</div>
                    </div>
                    
                    <div className="bg-background p-3 rounded border text-center">
                      <div className="text-sm font-medium mb-1">Multi-Touch</div>
                      <div className="text-xs text-muted-foreground">Contribuição distribuída</div>
                      <div className="text-lg font-bold text-purple-600 mt-2">23%</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Dashboard de Performance</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-green-50 dark:bg-green-950/10 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="text-2xl font-bold text-green-600">156</div>
                    <div className="text-sm text-muted-foreground">Leads este mês</div>
                    <div className="text-xs text-green-600 mt-1">↑ 23% vs mês anterior</div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-950/10 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="text-2xl font-bold text-blue-600">3.2</div>
                    <div className="text-sm text-muted-foreground">Canais por conversão</div>
                    <div className="text-xs text-blue-600 mt-1">Média de touchpoints</div>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-950/10 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="text-2xl font-bold text-purple-600">R$ 4.2k</div>
                    <div className="text-sm text-muted-foreground">CAC médio</div>
                    <div className="text-xs text-purple-600 mt-1">↓ 15% vs mês anterior</div>
                  </div>
                  
                  <div className="bg-orange-50 dark:bg-orange-950/10 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="text-2xl font-bold text-orange-600">18.5x</div>
                    <div className="text-sm text-muted-foreground">ROI multicanal</div>
                    <div className="text-xs text-orange-600 mt-1">LTV/CAC ratio</div>
                  </div>
                </div>
              </div>

              <Alert className="border-green-200 dark:border-green-800">
                <TrendingUp className="h-4 w-4" />
                <AlertTitle>Otimização Contínua</AlertTitle>
                <AlertDescription>
                  Monitore as métricas semanalmente e ajuste a estratégia baseada nos dados. Teste novos canais e abandone os que não performam.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Próximos Passos e Links */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Passos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/docs/guides/automation-workflows" className="block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Workflow className="h-6 w-6 text-purple-500" />
                    <div>
                      <h4 className="font-medium">Workflows de Automação</h4>
                      <p className="text-sm text-muted-foreground">Automatize a coordenação entre canais</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/docs/guides/analytics-reporting" className="block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-6 w-6 text-blue-500" />
                    <div>
                      <h4 className="font-medium">Analytics e Relatórios</h4>
                      <p className="text-sm text-muted-foreground">Meça a performance multicanal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
