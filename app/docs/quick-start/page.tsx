"use client"

import { useState } from "react"
import { ArrowLeft, Copy, Check, Play, Terminal, Download, ExternalLink, Clock, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

const CodeBlock = ({ children, title }: { children: string; title?: string }) => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative">
      {title && (
        <div className="bg-muted px-4 py-2 text-sm font-medium border-b">
          {title}
        </div>
      )}
      <div className="relative bg-muted/30 p-4 rounded-md border">
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-2 right-2 h-8 w-8 p-0"
          onClick={copyToClipboard}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
        <pre className="text-sm overflow-x-auto pr-10">
          <code>{children}</code>
        </pre>
      </div>
    </div>
  )
}

export default function QuickStartPage() {
  return (
    <div className="flex-1 space-y-8 p-6 max-w-4xl">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/docs" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar para Documentação
            </Link>
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Início Rápido</h1>
            <Badge variant="default" className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              Recomendado
            </Badge>
          </div>
          <p className="text-xl text-muted-foreground">
            Configure e execute o CRM Pro Dashboard em menos de 5 minutos
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              5 minutos de leitura
            </span>
            <Badge variant="outline">Fácil</Badge>
            <Badge variant="secondary">Começando</Badge>
          </div>
        </div>
      </div>

      {/* Prerequisites */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">🎯 Pré-requisitos</CardTitle>
          <CardDescription>
            Certifique-se de ter os seguintes itens instalados antes de começar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <span className="text-green-600 dark:text-green-300 font-bold text-sm">N</span>
              </div>
              <div>
                <div className="font-medium">Node.js ≥ 18.0.0</div>
                <div className="text-sm text-muted-foreground">Runtime JavaScript</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-300 font-bold text-sm">D</span>
              </div>
              <div>
                <div className="font-medium">Docker & Docker Compose</div>
                <div className="text-sm text-muted-foreground">Containerização (recomendado)</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-300 font-bold text-sm">G</span>
              </div>
              <div>
                <div className="font-medium">Git</div>
                <div className="text-sm text-muted-foreground">Controle de versão</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="h-8 w-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <span className="text-orange-600 dark:text-orange-300 font-bold text-sm">P</span>
              </div>
              <div>
                <div className="font-medium">PostgreSQL</div>
                <div className="text-sm text-muted-foreground">Banco de dados (opcional)</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Installation Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">🚀 Instalação</CardTitle>
          <CardDescription>
            Escolha o método de instalação que melhor se adapta ao seu ambiente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="docker" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="docker" className="flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                Docker (Recomendado)
              </TabsTrigger>
              <TabsTrigger value="local" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Instalação Local
              </TabsTrigger>
            </TabsList>

            <TabsContent value="docker" className="space-y-4">
              <Alert>
                <Play className="h-4 w-4" />
                <AlertDescription>
                  <strong>Método recomendado:</strong> Docker simplifica a configuração e garante consistência entre ambientes.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">1. Clone o repositório</h4>
                  <CodeBlock>
{`git clone https://github.com/seu-usuario/crm-pro-dashboard.git
cd crm-pro-dashboard`}
                  </CodeBlock>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">2. Configure as variáveis de ambiente</h4>
                  <CodeBlock>
{`cp .env.example .env.local
# Edite o arquivo .env.local com suas configurações`}
                  </CodeBlock>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">3. Execute com Docker</h4>
                  <CodeBlock>
{`docker-compose up -d`}
                  </CodeBlock>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">4. Acesse as aplicações</h4>
                  <div className="grid gap-2 md:grid-cols-3">
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium">Frontend</div>
                      <div className="text-sm text-muted-foreground">http://localhost:3000</div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium">n8n</div>
                      <div className="text-sm text-muted-foreground">http://localhost:5678</div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium">Grafana</div>
                      <div className="text-sm text-muted-foreground">http://localhost:3001</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="local" className="space-y-4">
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertDescription>
                  Para instalação local, você precisará configurar PostgreSQL e Redis manualmente.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">1. Clone e instale dependências</h4>
                  <CodeBlock>
{`git clone https://github.com/seu-usuario/crm-pro-dashboard.git
cd crm-pro-dashboard
npm install`}
                  </CodeBlock>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">2. Configure banco de dados</h4>
                  <CodeBlock>
{`npx prisma migrate dev
npx prisma generate`}
                  </CodeBlock>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">3. Execute em desenvolvimento</h4>
                  <CodeBlock>
{`npm run dev`}
                  </CodeBlock>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">4. Acesse a aplicação</h4>
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium">Dashboard</div>
                    <div className="text-sm text-muted-foreground">http://localhost:3000</div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* First Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">🔧 Primeiros Passos</CardTitle>
          <CardDescription>
            Configure sua instância do CRM Pro Dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold">Acessar o Dashboard</h4>
                <p className="text-sm text-muted-foreground">
                  Abra http://localhost:3000 e faça o cadastro inicial (primeiro usuário será admin)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-6 w-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold">Configurar Integrações</h4>
                <p className="text-sm text-muted-foreground">
                  Vá para Configurações → Integrações e conecte seus serviços (Gmail, Stripe, etc.)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-6 w-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold">Criar Primeiro Pipeline</h4>
                <p className="text-sm text-muted-foreground">
                  Acesse CRM → Pipelines e configure seu funil de vendas
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Check */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">🔍 Verificar Instalação</CardTitle>
          <CardDescription>
            Execute estes comandos para validar se tudo está funcionando
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Verificar serviços</h4>
            <CodeBlock>
{`# Verificar status dos serviços
npm run health-check

# Testar conexões de API
npm run test-integrations`}
            </CodeBlock>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Checklist de Funcionamento</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                Dashboard principal carrega sem erros
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                Login/cadastro funcionando
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                Conexão com banco de dados ativa
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                APIs externas configuradas
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">📚 Próximos Passos</CardTitle>
          <CardDescription>
            Continue explorando a documentação para aproveitar ao máximo o CRM Pro Dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Button variant="outline" asChild className="h-auto p-4 justify-start">
              <Link href="/docs/installation" className="flex flex-col items-start gap-2">
                <div className="font-semibold">Guia de Instalação Completo</div>
                <div className="text-sm text-muted-foreground text-left">
                  Setup detalhado para desenvolvimento e produção
                </div>
              </Link>
            </Button>

            <Button variant="outline" asChild className="h-auto p-4 justify-start">
              <Link href="/docs/api" className="flex flex-col items-start gap-2">
                <div className="font-semibold">API Reference</div>
                <div className="text-sm text-muted-foreground text-left">
                  Documentação completa da API REST e GraphQL
                </div>
              </Link>
            </Button>

            <Button variant="outline" asChild className="h-auto p-4 justify-start">
              <Link href="/docs/integrations" className="flex flex-col items-start gap-2">
                <div className="font-semibold">Configurar Integrações</div>
                <div className="text-sm text-muted-foreground text-left">
                  Gmail, Stripe, WhatsApp e outros serviços
                </div>
              </Link>
            </Button>

            <Button variant="outline" asChild className="h-auto p-4 justify-start">
              <Link href="/docs/troubleshooting" className="flex flex-col items-start gap-2">
                <div className="font-semibold">Troubleshooting</div>
                <div className="text-sm text-muted-foreground text-left">
                  Resolução de problemas comuns
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-8 border-t">
        <Button variant="ghost" asChild>
          <Link href="/docs" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar para Documentação
          </Link>
        </Button>
        <Button asChild>
          <Link href="/docs/installation" className="flex items-center gap-2">
            Próximo: Instalação Completa
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
