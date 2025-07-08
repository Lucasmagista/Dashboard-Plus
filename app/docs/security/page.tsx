"use client"

import { useState } from "react"
import { 
  Shield, 
  ArrowLeft, 
  Lock, 
  Key, 
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Copy,
  Check,
  FileText,
  Database,
  Globe,
  Users,
  Settings
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

const securityChecklist = [
  {
    category: "Autenticação",
    items: [
      { text: "Configurar autenticação multifator (MFA)", critical: true, completed: false },
      { text: "Implementar política de senhas fortes", critical: true, completed: false },
      { text: "Configurar expiração de sessão", critical: false, completed: false },
      { text: "Implementar rate limiting para login", critical: true, completed: false },
      { text: "Configurar bloqueio de conta após tentativas falhadas", critical: true, completed: false }
    ]
  },
  {
    category: "Dados",
    items: [
      { text: "Criptografar dados sensíveis em repouso", critical: true, completed: false },
      { text: "Usar HTTPS em todas as conexões", critical: true, completed: false },
      { text: "Implementar backup automático", critical: true, completed: false },
      { text: "Configurar política de retenção de dados", critical: false, completed: false },
      { text: "Implementar logs de auditoria", critical: true, completed: false }
    ]
  },
  {
    category: "Conformidade",
    items: [
      { text: "Implementar termos de uso e política de privacidade", critical: true, completed: false },
      { text: "Configurar formulário de consentimento LGPD", critical: true, completed: false },
      { text: "Implementar direito ao esquecimento", critical: true, completed: false },
      { text: "Configurar relatórios de impacto de dados", critical: false, completed: false },
      { text: "Implementar processo de notificação de violação", critical: true, completed: false }
    ]
  }
]

const vulnerabilities = [
  {
    name: "SQL Injection",
    severity: "Alto",
    description: "Injection de código SQL malicioso",
    prevention: "Use prepared statements e ORM",
    code: `// ❌ Vulnerável
const query = "SELECT * FROM users WHERE id = " + userId;

// ✅ Seguro
const query = "SELECT * FROM users WHERE id = ?";
db.prepare(query).get(userId);`
  },
  {
    name: "Cross-Site Scripting (XSS)",
    severity: "Alto", 
    description: "Execução de scripts maliciosos no navegador",
    prevention: "Sanitize inputs e use CSP headers",
    code: `// ❌ Vulnerável
element.innerHTML = userInput;

// ✅ Seguro
element.textContent = userInput;
// ou use bibliotecas como DOMPurify`
  },
  {
    name: "Cross-Site Request Forgery (CSRF)",
    severity: "Médio",
    description: "Requisições não autorizadas em nome do usuário",
    prevention: "Use tokens CSRF e SameSite cookies",
    code: `// Configuração de cookies seguros
app.use(session({
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: 'strict'
  }
}));`
  },
  {
    name: "Insecure Direct Object References",
    severity: "Alto",
    description: "Acesso direto a objetos sem autorização",
    prevention: "Validar permissões para cada recurso",
    code: `// ❌ Vulnerável
app.get('/user/:id', (req, res) => {
  const user = db.getUser(req.params.id);
  res.json(user);
});

// ✅ Seguro
app.get('/user/:id', auth, (req, res) => {
  if (req.user.id !== req.params.id && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const user = db.getUser(req.params.id);
  res.json(user);
});`
  }
]

const lgpdRequirements = [
  {
    title: "Consentimento",
    description: "Obter consentimento explícito para coleta de dados",
    implementation: "Implementar formulários de consentimento claros",
    status: "required"
  },
  {
    title: "Transparência",
    description: "Informar claramente como os dados são usados",
    implementation: "Criar política de privacidade detalhada",
    status: "required"
  },
  {
    title: "Portabilidade",
    description: "Permitir exportação de dados do usuário",
    implementation: "Criar endpoint para exportar dados em formato estruturado",
    status: "required"
  },
  {
    title: "Direito ao Esquecimento",
    description: "Permitir exclusão completa dos dados do usuário",
    implementation: "Implementar processo de exclusão em cascata",
    status: "required"
  },
  {
    title: "Notificação de Violação",
    description: "Notificar autoridades e usuários sobre violações",
    implementation: "Criar processo automatizado de notificação",
    status: "required"
  },
  {
    title: "DPO (Data Protection Officer)",
    description: "Designar responsável pela proteção de dados",
    implementation: "Definir responsável e canais de contato",
    status: "recommended"
  }
]

export default function SecurityPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [showCode, setShowCode] = useState<Record<string, boolean>>({})

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const toggleCode = (id: string) => {
    setShowCode(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Alto": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      case "Médio": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
      case "Baixo": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "required": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      case "recommended": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  const completedItems = securityChecklist.reduce((acc, category) => 
    acc + category.items.filter(item => item.completed).length, 0
  )
  const totalItems = securityChecklist.reduce((acc, category) => 
    acc + category.items.length, 0
  )
  const completionPercentage = Math.round((completedItems / totalItems) * 100)

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
          <Shield className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">Guia de Segurança</h1>
            <p className="text-muted-foreground">
              Melhores práticas de segurança e conformidade LGPD/GDPR
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <Badge variant="secondary">Segurança</Badge>
          <Badge variant="outline">LGPD</Badge>
          <Badge variant="outline">GDPR</Badge>
        </div>
      </div>

      {/* Security Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Visão Geral de Segurança
          </CardTitle>
          <CardDescription>
            Status atual da implementação de segurança
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progresso de Implementação</span>
              <span className="text-sm text-muted-foreground">
                {completedItems} de {totalItems} itens
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {securityChecklist.reduce((acc, cat) => 
                    acc + cat.items.filter(item => item.critical && !item.completed).length, 0
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Itens Críticos Pendentes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {securityChecklist.reduce((acc, cat) => 
                    acc + cat.items.filter(item => item.completed).length, 0
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Itens Concluídos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{completionPercentage}%</div>
                <div className="text-sm text-muted-foreground">Completude</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="checklist" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="vulnerabilities">Vulnerabilidades</TabsTrigger>
          <TabsTrigger value="lgpd">LGPD</TabsTrigger>
          <TabsTrigger value="configuration">Configuração</TabsTrigger>
        </TabsList>

        {/* Checklist Tab */}
        <TabsContent value="checklist" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Checklist de Segurança</CardTitle>
              <CardDescription>
                Lista completa de verificações de segurança para implementar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {securityChecklist.map((category) => (
                  <div key={category.category}>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      {category.category === "Autenticação" && <Key className="h-5 w-5" />}
                      {category.category === "Dados" && <Database className="h-5 w-5" />}
                      {category.category === "Conformidade" && <FileText className="h-5 w-5" />}
                      {category.category}
                    </h3>
                    <div className="space-y-3">
                      {category.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="flex-1 flex items-center gap-3">
                            {item.completed ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{item.text}</span>
                                {item.critical && (
                                  <Badge variant="destructive" className="text-xs">
                                    Crítico
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Simular toggle do item
                              item.completed = !item.completed
                            }}
                          >
                            {item.completed ? "Marcar como Pendente" : "Marcar como Concluído"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vulnerabilities Tab */}
        <TabsContent value="vulnerabilities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vulnerabilidades Comuns</CardTitle>
              <CardDescription>
                Principais vulnerabilidades e como preveni-las
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {vulnerabilities.map((vuln, index) => (
                  <Card key={index} className="border-2">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{vuln.name}</CardTitle>
                        <Badge className={getSeverityColor(vuln.severity)} variant="secondary">
                          {vuln.severity}
                        </Badge>
                      </div>
                      <CardDescription>{vuln.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Prevenção:</h4>
                          <p className="text-sm text-muted-foreground">{vuln.prevention}</p>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">Exemplo de Código:</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleCode(`vuln-${index}`)}
                            >
                              {showCode[`vuln-${index}`] ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          
                          {showCode[`vuln-${index}`] && (
                            <div className="relative">
                              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                                <code>{vuln.code}</code>
                              </pre>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => copyToClipboard(vuln.code, `vuln-code-${index}`)}
                              >
                                {copiedCode === `vuln-code-${index}` ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* LGPD Tab */}
        <TabsContent value="lgpd" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conformidade LGPD</CardTitle>
              <CardDescription>
                Requisitos para estar em conformidade com a Lei Geral de Proteção de Dados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {lgpdRequirements.map((req, index) => (
                  <Card key={index} className="border-2">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{req.title}</CardTitle>
                        <Badge 
                          className={getStatusColor(req.status)} 
                          variant="secondary"
                        >
                          {req.status === "required" ? "Obrigatório" : "Recomendado"}
                        </Badge>
                      </div>
                      <CardDescription>{req.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium mb-2">Implementação:</h4>
                          <p className="text-sm text-muted-foreground">{req.implementation}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Alert className="mt-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Importante:</strong> A não conformidade com a LGPD pode resultar em multas
                  de até 2% do faturamento da empresa, limitado a R$ 50 milhões por infração.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="configuration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>
                Configurações essenciais para um ambiente seguro
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Configuração de Headers HTTP</h3>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig`}</code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`// next.config.js\n/** @type {import('next').NextConfig} */\nconst nextConfig = {\n  async headers() {\n    return [\n      {\n        source: '/:path*',\n        headers: [\n          {\n            key: 'X-Frame-Options',\n            value: 'DENY',\n          },\n          {\n            key: 'X-Content-Type-Options',\n            value: 'nosniff',\n          },\n          {\n            key: 'Referrer-Policy',\n            value: 'strict-origin-when-cross-origin',\n          },\n          {\n            key: 'Content-Security-Policy',\n            value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",\n          },\n        ],\n      },\n    ]\n  },\n}\n\nmodule.exports = nextConfig`, "headers-config")}
                    >
                      {copiedCode === "headers-config" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Configuração de Autenticação</h3>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`// lib/auth.ts
import NextAuth from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './db'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
  },
}

export default NextAuth(authOptions)`}</code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`// lib/auth.ts\nimport NextAuth from 'next-auth'\nimport { PrismaAdapter } from '@next-auth/prisma-adapter'\nimport { prisma } from './db'\n\nexport const authOptions = {\n  adapter: PrismaAdapter(prisma),\n  session: {\n    strategy: 'jwt',\n    maxAge: 30 * 24 * 60 * 60, // 30 dias\n  },\n  jwt: {\n    secret: process.env.JWT_SECRET,\n  },\n  pages: {\n    signIn: '/auth/signin',\n    error: '/auth/error',\n  },\n  callbacks: {\n    async session({ token, session }) {\n      if (token) {\n        session.user.id = token.id\n        session.user.role = token.role\n      }\n      return session\n    },\n    async jwt({ token, user }) {\n      if (user) {\n        token.id = user.id\n        token.role = user.role\n      }\n      return token\n    },\n  },\n}\n\nexport default NextAuth(authOptions)`, "auth-config")}
                    >
                      {copiedCode === "auth-config" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Configuração de Rate Limiting</h3>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

// Limite para login: 5 tentativas por 10 minutos
export const loginRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '10 m'),
  analytics: true,
})

// Limite para API: 100 requisições por minuto
export const apiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: true,
})`}</code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`// lib/rate-limit.ts\nimport { Ratelimit } from '@upstash/ratelimit'\nimport { Redis } from '@upstash/redis'\n\nconst redis = new Redis({\n  url: process.env.UPSTASH_REDIS_REST_URL,\n  token: process.env.UPSTASH_REDIS_REST_TOKEN,\n})\n\n// Limite para login: 5 tentativas por 10 minutos\nexport const loginRateLimit = new Ratelimit({\n  redis,\n  limiter: Ratelimit.slidingWindow(5, '10 m'),\n  analytics: true,\n})\n\n// Limite para API: 100 requisições por minuto\nexport const apiRateLimit = new Ratelimit({\n  redis,\n  limiter: Ratelimit.slidingWindow(100, '1 m'),\n  analytics: true,\n})`, "rate-limit")}
                    >
                      {copiedCode === "rate-limit" ? (
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

      {/* Quick Links */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Links Úteis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/docs/deployment">
              <Button variant="outline" className="w-full justify-start">
                <Globe className="h-4 w-4 mr-2" />
                Guia de Deploy
              </Button>
            </Link>
            <Link href="/docs/api">
              <Button variant="outline" className="w-full justify-start">
                <Lock className="h-4 w-4 mr-2" />
                API Reference
              </Button>
            </Link>
            <Link href="/docs/best-practices">
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Melhores Práticas
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
