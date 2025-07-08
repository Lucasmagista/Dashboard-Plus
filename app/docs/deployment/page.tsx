"use client"

import { useState } from "react"
import { 
  Rocket, 
  ArrowLeft, 
  Server, 
  Cloud, 
  Container,
  Check,
  Copy,
  AlertTriangle,
  Info,
  Terminal,
  Globe,
  Shield,
  Clock
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

const deploymentOptions = [
  {
    name: "Vercel",
    description: "Deploy rápido e automático com Git",
    difficulty: "Fácil",
    time: "5 min",
    icon: Globe,
    pros: ["Deploy automático", "CDN global", "SSL gratuito", "Rollback fácil"],
    cons: ["Limitações no plano free", "Vendor lock-in"],
    suitable: ["Prototipagem", "Pequenos projetos", "MVP"]
  },
  {
    name: "Docker + VPS",
    description: "Controle total com containerização",
    difficulty: "Médio",
    time: "30 min",
    icon: Container,
    pros: ["Controle total", "Escalabilidade", "Portabilidade"],
    cons: ["Configuração manual", "Manutenção necessária"],
    suitable: ["Produção", "Alta performance", "Customização"]
  },
  {
    name: "Kubernetes",
    description: "Orquestração para alta escala",
    difficulty: "Avançado", 
    time: "2-4 horas",
    icon: Server,
    pros: ["Auto-scaling", "Alta disponibilidade", "Gestão de containers"],
    cons: ["Complexidade alta", "Overhead de recursos"],
    suitable: ["Enterprise", "Alta escala", "Microserviços"]
  },
  {
    name: "AWS/Google Cloud",
    description: "Serviços gerenciados na nuvem",
    difficulty: "Médio",
    time: "45 min",
    icon: Cloud,
    pros: ["Serviços gerenciados", "Escalabilidade automática", "Integração"],
    cons: ["Custos variáveis", "Vendor lock-in"],
    suitable: ["Produção", "Escalabilidade", "Integração"]
  }
]

const environmentVariables = [
  { name: "DATABASE_URL", description: "URL de conexão com o banco de dados", required: true },
  { name: "JWT_SECRET", description: "Chave secreta para tokens JWT", required: true },
  { name: "NEXTAUTH_SECRET", description: "Chave secreta para NextAuth", required: true },
  { name: "NEXTAUTH_URL", description: "URL base da aplicação", required: true },
  { name: "REDIS_URL", description: "URL de conexão com Redis (cache)", required: false },
  { name: "SENTRY_DSN", description: "DSN do Sentry para monitoramento", required: false },
  { name: "SMTP_HOST", description: "Servidor SMTP para envio de emails", required: false },
  { name: "SMTP_PORT", description: "Porta do servidor SMTP", required: false },
  { name: "SMTP_USER", description: "Usuário do servidor SMTP", required: false },
  { name: "SMTP_PASS", description: "Senha do servidor SMTP", required: false }
]

export default function DeploymentPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [selectedOption, setSelectedOption] = useState("vercel")

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
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
          <Rocket className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">Deploy em Produção</h1>
            <p className="text-muted-foreground">
              Guia completo para fazer deploy do CRM Pro Dashboard em diferentes ambientes
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <Badge variant="secondary">DevOps</Badge>
          <Badge variant="outline">Produção</Badge>
          <Badge variant="outline">Docker</Badge>
        </div>
      </div>

      {/* Deployment Options */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Opções de Deploy</CardTitle>
          <CardDescription>
            Escolha a melhor opção baseada nas suas necessidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {deploymentOptions.map((option) => {
              const IconComponent = option.icon
              return (
                <Card key={option.name} className="border-2 hover:border-blue-300 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{option.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getDifficultyColor(option.difficulty)} variant="secondary">
                            {option.difficulty}
                          </Badge>
                          <Badge variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            {option.time}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2 text-green-600">Vantagens</h4>
                        <ul className="space-y-1">
                          {option.pros.map((pro, index) => (
                            <li key={index} className="text-sm flex items-center gap-2">
                              <Check className="h-3 w-3 text-green-500" />
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-orange-600">Desvantagens</h4>
                        <ul className="space-y-1">
                          {option.cons.map((con, index) => (
                            <li key={index} className="text-sm flex items-center gap-2">
                              <AlertTriangle className="h-3 w-3 text-orange-500" />
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Ideal para</h4>
                        <div className="flex flex-wrap gap-1">
                          {option.suitable.map((use) => (
                            <Badge key={use} variant="outline" className="text-xs">
                              {use}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="vercel" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="vercel">Vercel</TabsTrigger>
          <TabsTrigger value="docker">Docker</TabsTrigger>
          <TabsTrigger value="kubernetes">Kubernetes</TabsTrigger>
          <TabsTrigger value="cloud">Cloud</TabsTrigger>
        </TabsList>

        {/* Vercel Tab */}
        <TabsContent value="vercel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Deploy na Vercel
              </CardTitle>
              <CardDescription>
                Deploy automático com integração Git
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3">1. Preparação do Projeto</h3>
                  <p className="text-muted-foreground mb-4">
                    Certifique-se de que seu projeto está configurado corretamente:
                  </p>
                  <div className="space-y-3">
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{`# Instalar dependências
npm install

# Build do projeto
npm run build

# Testar localmente
npm start`}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(`npm install\nnpm run build\nnpm start`, "vercel-prep")}
                      >
                        {copiedCode === "vercel-prep" ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">2. Deploy via Git</h3>
                  <div className="space-y-3">
                    <p className="text-muted-foreground">
                      1. Faça push do seu código para GitHub/GitLab/Bitbucket
                    </p>
                    <p className="text-muted-foreground">
                      2. Conecte seu repositório na <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Vercel</a>
                    </p>
                    <p className="text-muted-foreground">
                      3. Configure as variáveis de ambiente (ver seção abaixo)
                    </p>
                    <p className="text-muted-foreground">
                      4. Deploy automático a cada push!
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">3. Deploy via CLI</h3>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`# Instalar Vercel CLI
npm i -g vercel

# Login na Vercel
vercel login

# Deploy
vercel --prod`}</code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`npm i -g vercel\nvercel login\nvercel --prod`, "vercel-cli")}
                    >
                      {copiedCode === "vercel-cli" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    A Vercel detecta automaticamente projetos Next.js e configura o build.
                    Não é necessário configurar nada adicional para projetos padrão.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Docker Tab */}
        <TabsContent value="docker" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Container className="h-5 w-5" />
                Deploy com Docker
              </CardTitle>
              <CardDescription>
                Containerização para qualquer ambiente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">1. Dockerfile</h3>
                <p className="text-muted-foreground mb-4">
                  Crie um arquivo Dockerfile na raiz do projeto:
                </p>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]`}</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(`FROM node:18-alpine AS deps\nRUN apk add --no-cache libc6-compat\nWORKDIR /app\n\nCOPY package.json package-lock.json* ./\nRUN npm ci --only=production\n\nFROM node:18-alpine AS builder\nWORKDIR /app\nCOPY --from=deps /app/node_modules ./node_modules\nCOPY . .\n\nENV NEXT_TELEMETRY_DISABLED 1\nRUN npm run build\n\nFROM node:18-alpine AS runner\nWORKDIR /app\n\nENV NODE_ENV production\nENV NEXT_TELEMETRY_DISABLED 1\n\nRUN addgroup --system --gid 1001 nodejs\nRUN adduser --system --uid 1001 nextjs\n\nCOPY --from=builder /app/public ./public\nCOPY --from=builder /app/package.json ./package.json\nCOPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./\nCOPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static\n\nUSER nextjs\n\nEXPOSE 3000\n\nENV PORT 3000\n\nCMD ["node", "server.js"]`, "dockerfile")}
                  >
                    {copiedCode === "dockerfile" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">2. Docker Compose</h3>
                <p className="text-muted-foreground mb-4">
                  Arquivo docker-compose.yml para ambiente completo:
                </p>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/crmpro
      - JWT_SECRET=your-secret-key
      - NEXTAUTH_SECRET=your-nextauth-secret
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=crmpro
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:`}</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(`version: '3.8'\n\nservices:\n  app:\n    build: .\n    ports:\n      - "3000:3000"\n    environment:\n      - DATABASE_URL=postgresql://user:password@db:5432/crmpro\n      - JWT_SECRET=your-secret-key\n      - NEXTAUTH_SECRET=your-nextauth-secret\n      - NEXTAUTH_URL=http://localhost:3000\n    depends_on:\n      - db\n      - redis\n\n  db:\n    image: postgres:15\n    environment:\n      - POSTGRES_DB=crmpro\n      - POSTGRES_USER=user\n      - POSTGRES_PASSWORD=password\n    volumes:\n      - postgres_data:/var/lib/postgresql/data\n    ports:\n      - "5432:5432"\n\n  redis:\n    image: redis:7-alpine\n    ports:\n      - "6379:6379"\n\nvolumes:\n  postgres_data:`, "docker-compose")}
                  >
                    {copiedCode === "docker-compose" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">3. Comandos de Deploy</h3>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`# Build da imagem
docker build -t crmpro-dashboard .

# Executar com Docker Compose
docker-compose up -d

# Verificar logs
docker-compose logs -f app

# Parar serviços
docker-compose down`}</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(`docker build -t crmpro-dashboard .\ndocker-compose up -d\ndocker-compose logs -f app\ndocker-compose down`, "docker-commands")}
                  >
                    {copiedCode === "docker-commands" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Kubernetes Tab */}
        <TabsContent value="kubernetes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Deploy no Kubernetes
              </CardTitle>
              <CardDescription>
                Orquestração para alta disponibilidade e escala
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Pré-requisitos:</strong> Cluster Kubernetes configurado, kubectl instalado,
                  e conhecimento básico de Kubernetes.
                </AlertDescription>
              </Alert>

              <div>
                <h3 className="text-lg font-semibold mb-3">1. Deployment</h3>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`apiVersion: apps/v1
kind: Deployment
metadata:
  name: crmpro-dashboard
  labels:
    app: crmpro-dashboard
spec:
  replicas: 3
  selector:
    matchLabels:
      app: crmpro-dashboard
  template:
    metadata:
      labels:
        app: crmpro-dashboard
    spec:
      containers:
      - name: crmpro-dashboard
        image: your-registry/crmpro-dashboard:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: crmpro-secrets
              key: database-url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: crmpro-secrets
              key: jwt-secret
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"`}</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(`apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: crmpro-dashboard\n  labels:\n    app: crmpro-dashboard\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: crmpro-dashboard\n  template:\n    metadata:\n      labels:\n        app: crmpro-dashboard\n    spec:\n      containers:\n      - name: crmpro-dashboard\n        image: your-registry/crmpro-dashboard:latest\n        ports:\n        - containerPort: 3000\n        env:\n        - name: DATABASE_URL\n          valueFrom:\n            secretKeyRef:\n              name: crmpro-secrets\n              key: database-url\n        - name: JWT_SECRET\n          valueFrom:\n            secretKeyRef:\n              name: crmpro-secrets\n              key: jwt-secret\n        resources:\n          requests:\n            memory: "256Mi"\n            cpu: "250m"\n          limits:\n            memory: "512Mi"\n            cpu: "500m"`, "k8s-deployment")}
                  >
                    {copiedCode === "k8s-deployment" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">2. Service</h3>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`apiVersion: v1
kind: Service
metadata:
  name: crmpro-dashboard-service
spec:
  selector:
    app: crmpro-dashboard
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer`}</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(`apiVersion: v1\nkind: Service\nmetadata:\n  name: crmpro-dashboard-service\nspec:\n  selector:\n    app: crmpro-dashboard\n  ports:\n    - protocol: TCP\n      port: 80\n      targetPort: 3000\n  type: LoadBalancer`, "k8s-service")}
                  >
                    {copiedCode === "k8s-service" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">3. Comandos de Deploy</h3>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`# Aplicar configurações
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml

# Verificar status
kubectl get pods
kubectl get services

# Escalar aplicação
kubectl scale deployment crmpro-dashboard --replicas=5

# Verificar logs
kubectl logs -f deployment/crmpro-dashboard`}</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(`kubectl apply -f deployment.yaml\nkubectl apply -f service.yaml\nkubectl get pods\nkubectl get services\nkubectl scale deployment crmpro-dashboard --replicas=5\nkubectl logs -f deployment/crmpro-dashboard`, "k8s-commands")}
                  >
                    {copiedCode === "k8s-commands" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cloud Tab */}
        <TabsContent value="cloud" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5" />
                Deploy na Nuvem
              </CardTitle>
              <CardDescription>
                AWS, Google Cloud Platform e outros provedores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="aws" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="aws">AWS</TabsTrigger>
                  <TabsTrigger value="gcp">Google Cloud</TabsTrigger>
                  <TabsTrigger value="azure">Azure</TabsTrigger>
                </TabsList>

                <TabsContent value="aws">
                  <div className="space-y-4">
                    <h4 className="font-semibold">AWS Elastic Beanstalk</h4>
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{`# Instalar EB CLI
pip install awsebcli

# Inicializar aplicação
eb init

# Criar ambiente
eb create production

# Deploy
eb deploy

# Abrir aplicação
eb open`}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(`pip install awsebcli\neb init\neb create production\neb deploy\neb open`, "aws-eb")}
                      >
                        {copiedCode === "aws-eb" ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="gcp">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Google App Engine</h4>
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{`# app.yaml
runtime: nodejs18

env_variables:
  DATABASE_URL: "your-database-url"
  JWT_SECRET: "your-jwt-secret"

# Deploy
gcloud app deploy

# Abrir aplicação
gcloud app browse`}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(`runtime: nodejs18\n\nenv_variables:\n  DATABASE_URL: "your-database-url"\n  JWT_SECRET: "your-jwt-secret"\n\ngcloud app deploy\ngcloud app browse`, "gcp-app-engine")}
                      >
                        {copiedCode === "gcp-app-engine" ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="azure">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Azure Container Instances</h4>
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{`# Login no Azure
az login

# Criar resource group
az group create --name crmpro-rg --location eastus

# Deploy container
az container create \\
  --resource-group crmpro-rg \\
  --name crmpro-dashboard \\
  --image your-registry/crmpro-dashboard:latest \\
  --dns-name-label crmpro \\
  --ports 3000`}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(`az login\naz group create --name crmpro-rg --location eastus\naz container create \\\n  --resource-group crmpro-rg \\\n  --name crmpro-dashboard \\\n  --image your-registry/crmpro-dashboard:latest \\\n  --dns-name-label crmpro \\\n  --ports 3000`, "azure-aci")}
                      >
                        {copiedCode === "azure-aci" ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Environment Variables */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Variáveis de Ambiente
          </CardTitle>
          <CardDescription>
            Configurações necessárias para o ambiente de produção
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {environmentVariables.map((envVar) => (
              <div key={envVar.name} className="flex items-start justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-medium">{envVar.name}</code>
                    {envVar.required && (
                      <Badge variant="destructive" className="text-xs">
                        Obrigatório
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{envVar.description}</p>
                </div>
              </div>
            ))}
          </div>

          <Alert className="mt-6">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Segurança:</strong> Nunca commit variáveis sensíveis no código.
              Use sempre serviços de gerenciamento de secrets ou variáveis de ambiente seguras.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Links Úteis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/docs/quick-start">
              <Button variant="outline" className="w-full justify-start">
                <Rocket className="h-4 w-4 mr-2" />
                Início Rápido
              </Button>
            </Link>
            <Link href="/docs/security">
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Guia de Segurança
              </Button>
            </Link>
            <Link href="/docs/troubleshooting">
              <Button variant="outline" className="w-full justify-start">
                <Terminal className="h-4 w-4 mr-2" />
                Troubleshooting
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
