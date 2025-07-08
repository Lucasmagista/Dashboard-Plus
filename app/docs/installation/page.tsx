"use client"

import { useState } from "react"
import { ArrowLeft, Copy, Check, Terminal, Database, Shield, Globe, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
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
        <div className="bg-muted px-4 py-2 text-sm font-medium border-b rounded-t-md">
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

export default function InstallationPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">Guia de Instalação</h1>
          <p className="text-xl text-muted-foreground">
            Configuração completa do ambiente de desenvolvimento e produção
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Badge variant="outline">Médio</Badge>
            <Badge variant="secondary">15 min de leitura</Badge>
            <Badge variant="secondary">Desenvolvimento</Badge>
          </div>
        </div>
      </div>

      {/* System Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Requisitos do Sistema
          </CardTitle>
          <CardDescription>
            Especificações mínimas e recomendadas para execução
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Mínimo</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">CPU</div>
                    <div className="text-sm text-muted-foreground">2 cores, 2.0 GHz</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">RAM</div>
                    <div className="text-sm text-muted-foreground">4 GB</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">Armazenamento</div>
                    <div className="text-sm text-muted-foreground">10 GB livre</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Recomendado</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">CPU</div>
                    <div className="text-sm text-muted-foreground">4+ cores, 3.0+ GHz</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">RAM</div>
                    <div className="text-sm text-muted-foreground">8+ GB</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">Armazenamento</div>
                    <div className="text-sm text-muted-foreground">50+ GB SSD</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <h4 className="font-semibold">Softwares Necessários</h4>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <div className="p-3 border rounded-lg">
                <div className="font-medium">Node.js</div>
                <div className="text-sm text-muted-foreground">≥ 18.0.0</div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="font-medium">npm/yarn/pnpm</div>
                <div className="text-sm text-muted-foreground">Gerenciador de pacotes</div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="font-medium">Git</div>
                <div className="text-sm text-muted-foreground">≥ 2.30.0</div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="font-medium">Docker</div>
                <div className="text-sm text-muted-foreground">≥ 20.10.0 (opcional)</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Installation Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Métodos de Instalação
          </CardTitle>
          <CardDescription>
            Escolha o método que melhor se adequa ao seu ambiente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="docker" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="docker">Docker</TabsTrigger>
              <TabsTrigger value="local">Local</TabsTrigger>
              <TabsTrigger value="cloud">Cloud</TabsTrigger>
            </TabsList>

            <TabsContent value="docker" className="space-y-6">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Recomendado para desenvolvimento:</strong> Docker garante consistência entre ambientes e facilita a configuração.
                </AlertDescription>
              </Alert>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. Preparação do Ambiente</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Clone o repositório:</p>
                      <CodeBlock>
{`git clone https://github.com/seu-usuario/crm-pro-dashboard.git
cd crm-pro-dashboard`}
                      </CodeBlock>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Verifique se o Docker está executando:</p>
                      <CodeBlock>
{`docker --version
docker-compose --version`}
                      </CodeBlock>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. Configuração de Variáveis de Ambiente</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Copie o arquivo de exemplo:</p>
                      <CodeBlock>
{`cp .env.example .env.local`}
                      </CodeBlock>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Configure as variáveis principais:</p>
                      <CodeBlock title=".env.local">
{`# Database
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/crm_dashboard"
REDIS_URL="redis://redis:6379"

# Authentication
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# API Keys (opcionais para desenvolvimento)
OPENAI_API_KEY="sk-your-openai-key"
GMAIL_CLIENT_ID="your-gmail-client-id"
GMAIL_CLIENT_SECRET="your-gmail-client-secret"
STRIPE_SECRET_KEY="sk_test_your-stripe-key"`}
                      </CodeBlock>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. Inicialização dos Serviços</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Execute os serviços em background:</p>
                      <CodeBlock>
{`docker-compose up -d`}
                      </CodeBlock>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Verifique o status dos containers:</p>
                      <CodeBlock>
{`docker-compose ps`}
                      </CodeBlock>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">4. Configuração do Banco de Dados</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Execute as migrações:</p>
                      <CodeBlock>
{`docker-compose exec app npx prisma migrate dev
docker-compose exec app npx prisma generate`}
                      </CodeBlock>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Popular com dados de exemplo (opcional):</p>
                      <CodeBlock>
{`docker-compose exec app npm run seed`}
                      </CodeBlock>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="local" className="space-y-6">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Atenção:</strong> Instalação local requer configuração manual de PostgreSQL e Redis.
                </AlertDescription>
              </Alert>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. Preparação do Ambiente</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Clone e instale dependências:</p>
                      <CodeBlock>
{`git clone https://github.com/seu-usuario/crm-pro-dashboard.git
cd crm-pro-dashboard
npm install`}
                      </CodeBlock>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">2. Configuração do PostgreSQL</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Instale PostgreSQL (Ubuntu/Debian):</p>
                      <CodeBlock>
{`sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql`}
                      </CodeBlock>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Crie o banco de dados:</p>
                      <CodeBlock>
{`sudo -u postgres psql
CREATE DATABASE crm_dashboard;
CREATE USER crm_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE crm_dashboard TO crm_user;
\\q`}
                      </CodeBlock>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. Configuração do Redis</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Instale Redis:</p>
                      <CodeBlock>
{`sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server`}
                      </CodeBlock>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">4. Configuração de Variáveis</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Configure o .env.local:</p>
                      <CodeBlock title=".env.local">
{`DATABASE_URL="postgresql://crm_user:your_password@localhost:5432/crm_dashboard"
REDIS_URL="redis://localhost:6379"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"`}
                      </CodeBlock>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">5. Inicialização</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Execute migrações e inicie o servidor:</p>
                      <CodeBlock>
{`npx prisma migrate dev
npx prisma generate
npm run dev`}
                      </CodeBlock>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cloud" className="space-y-6">
              <Alert>
                <Globe className="h-4 w-4" />
                <AlertDescription>
                  <strong>Deploy em produção:</strong> Configure para ambientes cloud como Vercel, AWS, ou DigitalOcean.
                </AlertDescription>
              </Alert>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Vercel (Recomendado)</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Install Vercel CLI e faça deploy:</p>
                      <CodeBlock>
{`npm i -g vercel
vercel login
vercel --prod`}
                      </CodeBlock>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Configure variáveis de ambiente na Vercel:</p>
                      <CodeBlock>
{`vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add REDIS_URL`}
                      </CodeBlock>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Docker Cloud</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Build e push da imagem:</p>
                      <CodeBlock>
{`docker build -t crm-dashboard .
docker tag crm-dashboard your-registry/crm-dashboard
docker push your-registry/crm-dashboard`}
                      </CodeBlock>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Database Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Configuração do Banco de Dados
          </CardTitle>
          <CardDescription>
            Setup detalhado do PostgreSQL e Redis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Schema do Banco</h4>
            <p className="text-sm text-muted-foreground mb-4">
              O CRM utiliza Prisma ORM para gerenciar o esquema do banco de dados.
            </p>
            <CodeBlock>
{`# Visualizar o schema atual
npx prisma studio

# Aplicar mudanças no schema
npx prisma migrate dev --name description

# Resetar banco de dados (CUIDADO!)
npx prisma migrate reset`}
            </CodeBlock>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Backup e Restore</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium mb-2">Backup</p>
                <CodeBlock>
{`pg_dump -h localhost -U crm_user -d crm_dashboard > backup.sql`}
                </CodeBlock>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Restore</p>
                <CodeBlock>
{`psql -h localhost -U crm_user -d crm_dashboard < backup.sql`}
                </CodeBlock>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Performance</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Índices automáticos via Prisma
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Connection pooling configurado
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Query optimization habilitada
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification */}
      <Card>
        <CardHeader>
          <CardTitle>✅ Verificação da Instalação</CardTitle>
          <CardDescription>
            Confirme se todos os serviços estão funcionando corretamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Health Checks</h4>
            <CodeBlock>
{`# Verificar todos os serviços
npm run health-check

# Testar conectividade de APIs
npm run test-integrations

# Verificar banco de dados
npx prisma studio`}
            </CodeBlock>
          </div>

          <div>
            <h4 className="font-semibold mb-3">URLs de Acesso</h4>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <div className="p-3 border rounded-lg">
                <div className="font-medium">Dashboard Principal</div>
                <div className="text-sm text-muted-foreground">http://localhost:3000</div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="font-medium">n8n Workflows</div>
                <div className="text-sm text-muted-foreground">http://localhost:5678</div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="font-medium">Grafana Monitoring</div>
                <div className="text-sm text-muted-foreground">http://localhost:3001</div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="font-medium">Prisma Studio</div>
                <div className="text-sm text-muted-foreground">http://localhost:5555</div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="font-medium">API Health</div>
                <div className="text-sm text-muted-foreground">http://localhost:3000/api/health</div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="font-medium">API Docs</div>
                <div className="text-sm text-muted-foreground">http://localhost:3000/api/docs</div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Logs importantes</h4>
            <CodeBlock>
{`# Logs da aplicação
docker-compose logs -f app

# Logs do banco de dados
docker-compose logs -f postgres

# Logs de todos os serviços
docker-compose logs -f`}
            </CodeBlock>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle>🔧 Troubleshooting</CardTitle>
          <CardDescription>
            Soluções para problemas comuns durante a instalação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-4 border rounded-lg">
              <h5 className="font-medium mb-2">Erro de porta ocupada</h5>
              <p className="text-sm text-muted-foreground mb-2">Se a porta 3000 estiver em uso:</p>
              <CodeBlock>
{`# Verificar processo na porta
lsof -i :3000

# Matar processo (substituir PID)
kill -9 <PID>

# Ou usar porta diferente
PORT=3001 npm run dev`}
              </CodeBlock>
            </div>

            <div className="p-4 border rounded-lg">
              <h5 className="font-medium mb-2">Erro de conexão com banco</h5>
              <p className="text-sm text-muted-foreground mb-2">Verifique se PostgreSQL está executando:</p>
              <CodeBlock>
{`# Status do serviço
sudo systemctl status postgresql

# Reiniciar PostgreSQL
sudo systemctl restart postgresql

# Testar conexão
psql -h localhost -U crm_user -d crm_dashboard`}
              </CodeBlock>
            </div>

            <div className="p-4 border rounded-lg">
              <h5 className="font-medium mb-2">Problemas com Docker</h5>
              <p className="text-sm text-muted-foreground mb-2">Limpar containers e volumes:</p>
              <CodeBlock>
{`# Parar todos os containers
docker-compose down

# Remover volumes (CUIDADO: apaga dados)
docker-compose down -v

# Rebuild completo
docker-compose up --build -d`}
              </CodeBlock>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <div className="flex items-center justify-between pt-8 border-t">
        <Button variant="ghost" asChild>
          <Link href="/docs/quick-start" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Anterior: Início Rápido
          </Link>
        </Button>
        <Button asChild>
          <Link href="/docs/api" className="flex items-center gap-2">
            Próximo: API Reference
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
