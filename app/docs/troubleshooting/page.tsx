"use client"

import { useState } from "react"
import { 
  AlertTriangle, 
  ArrowLeft, 
  Search, 
  CheckCircle, 
  XCircle,
  Info,
  Terminal,
  Bug,
  Wrench,
  HelpCircle,
  Book,
  Zap,
  Database,
  Globe,
  MessageSquare,
  Shield,
  Copy,
  Check,
  Eye,
  EyeOff
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

const commonIssues = [
  {
    id: "login-fail",
    title: "Falha no Login",
    category: "Autenticação",
    severity: "Alto",
    description: "Usuários não conseguem fazer login na plataforma",
    symptoms: ["Mensagem de erro ao tentar login", "Redirecionamento para página de erro", "Sessão expirada rapidamente"],
    causes: ["Credenciais incorretas", "Problema com servidor de autenticação", "Token JWT expirado"],
    solutions: [
      "Verificar credenciais do usuário",
      "Resetar senha do usuário",
      "Verificar configuração do NextAuth",
      "Verificar logs do servidor"
    ],
    code: `// Verificar configuração do NextAuth
export const authOptions = {
  providers: [...],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async jwt({ token, user }) {
      // Verificar se o token está sendo criado corretamente
      console.log("JWT Token:", token);
      return token;
    }
  }
}`
  },
  {
    id: "database-connection",
    title: "Erro de Conexão com Banco de Dados",
    category: "Database",
    severity: "Crítico",
    description: "Aplicação não consegue conectar com o banco de dados",
    symptoms: ["Erro 500 em todas as páginas", "Mensagens de timeout", "Dados não carregam"],
    causes: ["Servidor de banco indisponível", "Credenciais incorretas", "Pool de conexões esgotado"],
    solutions: [
      "Verificar status do servidor de banco",
      "Validar string de conexão",
      "Reiniciar pool de conexões",
      "Verificar firewall e rede"
    ],
    code: `// Testar conexão com o banco
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  try {
    await prisma.$connect()
    console.log("Conexão com banco OK")
  } catch (error) {
    console.error("Erro na conexão:", error)
  } finally {
    await prisma.$disconnect()
  }
}`
  },
  {
    id: "api-slow",
    title: "API Lenta",
    category: "Performance",
    severity: "Médio",
    description: "Endpoints da API respondendo muito lentamente",
    symptoms: ["Timeouts frequentes", "Páginas carregando devagar", "Usuários reclamando de lentidão"],
    causes: ["Queries N+1", "Índices faltando", "Cache não configurado", "Servidor sobrecarregado"],
    solutions: [
      "Otimizar queries do banco",
      "Adicionar índices necessários",
      "Implementar cache Redis",
      "Análise de performance com APM"
    ],
    code: `// Exemplo de query otimizada
// ❌ Query N+1
const users = await prisma.user.findMany()
for (const user of users) {
  const posts = await prisma.post.findMany({
    where: { userId: user.id }
  })
}

// ✅ Query otimizada
const users = await prisma.user.findMany({
  include: {
    posts: true
  }
})`
  },
  {
    id: "whatsapp-webhook",
    title: "Webhooks do WhatsApp Falhando",
    category: "Integrações",
    severity: "Alto",
    description: "Mensagens do WhatsApp não chegando na plataforma",
    symptoms: ["Mensagens não aparecem no dashboard", "Erro 400/500 nos webhooks", "Logs de webhook com erro"],
    causes: ["URL do webhook incorreta", "Validação de assinatura falhando", "Servidor webhook offline"],
    solutions: [
      "Verificar URL do webhook no Meta",
      "Validar token de verificação",
      "Verificar logs do servidor",
      "Testar endpoint manualmente"
    ],
    code: `// Validação de webhook do WhatsApp
export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('x-hub-signature-256')
  
  // Verificar assinatura
  const expectedSignature = crypto
    .createHmac('sha256', process.env.WHATSAPP_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex')
  
  if (signature !== \`sha256=\${expectedSignature}\`) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  // Processar webhook...
}`
  },
  {
    id: "memory-leak",
    title: "Vazamento de Memória",
    category: "Performance",
    severity: "Alto",
    description: "Uso de memória aumentando constantemente",
    symptoms: ["Servidor travando", "Out of memory errors", "Performance degradando"],
    causes: ["Event listeners não removidos", "Timers não limpos", "Referencias circulares"],
    solutions: [
      "Analisar com heap profiler",
      "Limpar event listeners",
      "Usar WeakMap/WeakSet",
      "Implementar garbage collection"
    ],
    code: `// Evitar vazamentos de memória
useEffect(() => {
  const handleResize = () => { /* ... */ }
  
  window.addEventListener('resize', handleResize)
  
  // ✅ Sempre limpar event listeners
  return () => {
    window.removeEventListener('resize', handleResize)
  }
}, [])

// ✅ Limpar timers
useEffect(() => {
  const timer = setInterval(() => { /* ... */ }, 1000)
  
  return () => {
    clearInterval(timer)
  }
}, [])`
  },
  {
    id: "cors-error",
    title: "Erro de CORS",
    category: "API",
    severity: "Médio",
    description: "Requisições bloqueadas por política CORS",
    symptoms: ["Erro CORS no console", "Requisições falhando do frontend", "API não acessível"],
    causes: ["Headers CORS não configurados", "Origem não permitida", "Preflight request falhando"],
    solutions: [
      "Configurar headers CORS",
      "Adicionar origem permitida",
      "Configurar preflight requests",
      "Usar proxy para desenvolvimento"
    ],
    code: `// Configuração CORS no Next.js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  }
}`
  }
]

const diagnosticSteps = [
  {
    title: "Verificação Básica",
    steps: [
      "Verificar se o servidor está rodando",
      "Testar conectividade de rede",
      "Verificar logs de erro",
      "Validar variáveis de ambiente"
    ]
  },
  {
    title: "Análise de Performance",
    steps: [
      "Monitorar uso de CPU e memória",
      "Analisar tempo de resposta das APIs",
      "Verificar queries lentas no banco",
      "Revisar métricas do CDN"
    ]
  },
  {
    title: "Debugging Avançado",
    steps: [
      "Ativar logs de debug",
      "Usar profiler de performance",
      "Analisar heap dumps",
      "Verificar conexões ativas"
    ]
  }
]

const quickFixes = [
  {
    issue: "Página não carrega",
    fix: "Limpar cache do navegador (Ctrl+F5)",
    category: "Frontend"
  },
  {
    issue: "Erro 500 interno",
    fix: "Verificar logs do servidor e reiniciar aplicação",
    category: "Backend"
  },
  {
    issue: "Dados não salvam",
    fix: "Verificar conexão com banco e validações",
    category: "Database"
  },
  {
    issue: "Login não funciona",
    fix: "Limpar cookies e verificar credenciais",
    category: "Auth"
  },
  {
    issue: "API lenta",
    fix: "Verificar cache e otimizar queries",
    category: "Performance"
  },
  {
    issue: "Webhooks falhando",
    fix: "Verificar URL e token de validação",
    category: "Integration"
  }
]

export default function TroubleshootingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [expandedIssues, setExpandedIssues] = useState<Record<string, boolean>>({})

  const categories = ["Todos", "Autenticação", "Database", "Performance", "Integrações", "API", "Frontend", "Backend"]

  const filteredIssues = commonIssues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.symptoms.some(symptom => symptom.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "Todos" || issue.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const toggleIssue = (issueId: string) => {
    setExpandedIssues(prev => ({
      ...prev,
      [issueId]: !prev[issueId]
    }))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Crítico": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      case "Alto": return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300"
      case "Médio": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
      case "Baixo": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Autenticação": return Shield
      case "Database": return Database
      case "Performance": return Zap
      case "Integrações": return Globe
      case "API": return Terminal
      default: return Bug
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
          <AlertTriangle className="h-8 w-8 text-orange-600" />
          <div>
            <h1 className="text-3xl font-bold">Troubleshooting</h1>
            <p className="text-muted-foreground">
              Guia de resolução de problemas comuns e debugging
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <Badge variant="secondary">Suporte</Badge>
          <Badge variant="outline">Debug</Badge>
          <Badge variant="outline">Problemas</Badge>
        </div>
      </div>

      {/* Quick Fixes */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Soluções Rápidas
          </CardTitle>
          <CardDescription>
            Fixes comuns para problemas frequentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickFixes.map((fix, index) => (
              <Card key={index} className="border-2 hover:border-blue-300 transition-colors">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm">{fix.issue}</h3>
                      <Badge variant="outline" className="text-xs">
                        {fix.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{fix.fix}</p>
                    <Button size="sm" variant="outline" className="w-full">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Aplicar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="common-issues" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="common-issues">Problemas Comuns</TabsTrigger>
          <TabsTrigger value="diagnostic">Diagnóstico</TabsTrigger>
          <TabsTrigger value="tools">Ferramentas</TabsTrigger>
        </TabsList>

        {/* Common Issues Tab */}
        <TabsContent value="common-issues" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Buscar Problemas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por problema, sintoma ou solução..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
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

          {/* Issues List */}
          <div className="space-y-4">
            {filteredIssues.map((issue) => {
              const IconComponent = getCategoryIcon(issue.category)
              const isExpanded = expandedIssues[issue.id]
              
              return (
                <Card key={issue.id} className="border-2">
                  <Collapsible 
                    open={isExpanded} 
                    onOpenChange={() => toggleIssue(issue.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                              <IconComponent className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{issue.title}</CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline">{issue.category}</Badge>
                                <Badge className={getSeverityColor(issue.severity)} variant="secondary">
                                  {issue.severity}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isExpanded ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </div>
                        </div>
                        <CardDescription>{issue.description}</CardDescription>
                      </CardHeader>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <CardContent>
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <Bug className="h-4 w-4" />
                              Sintomas
                            </h4>
                            <ul className="space-y-2">
                              {issue.symptoms.map((symptom, index) => (
                                <li key={index} className="flex items-center gap-2 text-sm">
                                  <XCircle className="h-3 w-3 text-red-500" />
                                  {symptom}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <Separator />

                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <HelpCircle className="h-4 w-4" />
                              Possíveis Causas
                            </h4>
                            <ul className="space-y-2">
                              {issue.causes.map((cause, index) => (
                                <li key={index} className="flex items-center gap-2 text-sm">
                                  <AlertTriangle className="h-3 w-3 text-orange-500" />
                                  {cause}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <Separator />

                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <CheckCircle className="h-4 w-4" />
                              Soluções
                            </h4>
                            <ul className="space-y-2">
                              {issue.solutions.map((solution, index) => (
                                <li key={index} className="flex items-center gap-2 text-sm">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  {solution}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {issue.code && (
                            <>
                              <Separator />
                              <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                  <Terminal className="h-4 w-4" />
                                  Código de Exemplo
                                </h4>
                                <div className="relative">
                                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                                    <code>{issue.code}</code>
                                  </pre>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute top-2 right-2"
                                    onClick={() => copyToClipboard(issue.code!, `issue-${issue.id}`)}
                                  >
                                    {copiedCode === `issue-${issue.id}` ? (
                                      <Check className="h-4 w-4" />
                                    ) : (
                                      <Copy className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              )
            })}
          </div>

          {filteredIssues.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Nenhum problema encontrado com os filtros aplicados.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("Todos")
                  }}
                >
                  Limpar Filtros
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Diagnostic Tab */}
        <TabsContent value="diagnostic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Processo de Diagnóstico</CardTitle>
              <CardDescription>
                Etapas sistemáticas para identificar e resolver problemas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {diagnosticSteps.map((step, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      {step.title}
                    </h3>
                    <div className="ml-8 space-y-2">
                      {step.steps.map((stepItem, stepIndex) => (
                        <div key={stepIndex} className="flex items-center gap-3 p-3 border rounded-lg">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{stepItem}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Checklist de Diagnóstico</CardTitle>
              <CardDescription>
                Lista de verificação para problemas gerais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  "Servidor está online e acessível",
                  "Banco de dados está conectado",
                  "Variáveis de ambiente estão configuradas",
                  "Logs não mostram erros críticos",
                  "Recursos do servidor estão adequados (CPU/RAM)",
                  "Rede e firewall estão configurados",
                  "Certificados SSL estão válidos",
                  "Cache está funcionando corretamente",
                  "Integrações externas estão ativas",
                  "Backup recente está disponível"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <input
                      type="checkbox"
                      className="rounded"
                      id={`diagnostic-check-${index}`}
                      aria-label={item}
                    />
                    <label htmlFor={`diagnostic-check-${index}`} className="text-sm cursor-pointer">
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tools Tab */}
        <TabsContent value="tools" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ferramentas de Debug</CardTitle>
              <CardDescription>
                Ferramentas úteis para diagnóstico e monitoramento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Monitoramento</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Terminal className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium">Next.js DevTools</h4>
                        <p className="text-sm text-muted-foreground">Debug do React e Next.js</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Database className="h-5 w-5 text-green-600" />
                      <div>
                        <h4 className="font-medium">Prisma Studio</h4>
                        <p className="text-sm text-muted-foreground">Interface visual do banco</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Zap className="h-5 w-5 text-yellow-600" />
                      <div>
                        <h4 className="font-medium">Vercel Analytics</h4>
                        <p className="text-sm text-muted-foreground">Performance e métricas</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Debugging</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Bug className="h-5 w-5 text-red-600" />
                      <div>
                        <h4 className="font-medium">Console Browser</h4>
                        <p className="text-sm text-muted-foreground">Debug no navegador</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Globe className="h-5 w-5 text-purple-600" />
                      <div>
                        <h4 className="font-medium">Postman/Insomnia</h4>
                        <p className="text-sm text-muted-foreground">Teste de APIs</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium">Webhook Tester</h4>
                        <p className="text-sm text-muted-foreground">Debug de webhooks</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comandos Úteis</CardTitle>
              <CardDescription>
                Comandos para debug e manutenção
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Logs e Monitoramento</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`# Ver logs do Next.js
npm run dev

# Logs do Docker
docker-compose logs -f

# Verificar status dos serviços
docker-compose ps

# Monitorar recursos
top
htop
docker stats`}</code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`npm run dev\ndocker-compose logs -f\ndocker-compose ps\ntop\nhtop\ndocker stats`, "monitoring-commands")}
                    >
                      {copiedCode === "monitoring-commands" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Database Debug</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`# Prisma Studio
npx prisma studio

# Reset do banco
npx prisma db reset

# Ver migrations
npx prisma migrate status

# Verificar schema
npx prisma validate`}</code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`npx prisma studio\nnpx prisma db reset\nnpx prisma migrate status\nnpx prisma validate`, "db-commands")}
                    >
                      {copiedCode === "db-commands" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Emergency Contacts */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Contatos de Emergência</CardTitle>
          <CardDescription>
            Quando nada mais funciona, entre em contato
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold">Suporte Técnico</h3>
              <p className="text-sm text-muted-foreground">suporte@crmrpo.com</p>
              <p className="text-sm text-muted-foreground">24/7 disponível</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Bug className="h-8 w-8 mx-auto mb-2 text-red-600" />
              <h3 className="font-semibold">Report de Bugs</h3>
              <p className="text-sm text-muted-foreground">bugs@crmrpo.com</p>
              <p className="text-sm text-muted-foreground">Resposta em 2h</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Book className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-semibold">Documentação</h3>
              <p className="text-sm text-muted-foreground">docs.crmrpo.com</p>
              <p className="text-sm text-muted-foreground">Sempre atualizada</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Links Úteis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/docs/installation">
              <Button variant="outline" className="w-full justify-start">
                <Terminal className="h-4 w-4 mr-2" />
                Guia de Instalação
              </Button>
            </Link>
            <Link href="/docs/api">
              <Button variant="outline" className="w-full justify-start">
                <Globe className="h-4 w-4 mr-2" />
                API Reference
              </Button>
            </Link>
            <Link href="/docs/security">
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Guia de Segurança
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
