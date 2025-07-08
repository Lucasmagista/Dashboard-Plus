"use client";

import React, { useState } from "react";
import { 
  GitBranch,
  Code,
  GitPullRequest,
  MessageSquare,
  Bug,
  Lightbulb,
  Heart,
  ChevronRight,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Users,
  Award,
  BookOpen,
  Terminal,
  FileText
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

const contributionTypes = [
  {
    icon: Code,
    title: "Desenvolvimento",
    description: "Contribua com código, correções de bugs e novas funcionalidades",
    color: "bg-blue-500",
    examples: ["Implementar novas features", "Corrigir bugs", "Melhorar performance", "Escrever testes"]
  },
  {
    icon: FileText,
    title: "Documentação",
    description: "Ajude a melhorar a documentação e guias do projeto",
    color: "bg-green-500",
    examples: ["Atualizar READMEs", "Escrever tutoriais", "Traduzir conteúdo", "Revisar documentos"]
  },
  {
    icon: Bug,
    title: "Relatório de Bugs",
    description: "Reporte problemas e ajude na investigação de bugs",
    color: "bg-red-500",
    examples: ["Reportar bugs", "Testar correções", "Criar casos de reprodução", "Validar fixes"]
  },
  {
    icon: Lightbulb,
    title: "Ideias e Sugestões",
    description: "Compartilhe ideias para melhorias e novas funcionalidades",
    color: "bg-yellow-500",
    examples: ["Sugerir features", "Melhorias de UX", "Otimizações", "Novas integrações"]
  }
];

const setupSteps = [
  {
    title: "1. Fork do Repositório",
    description: "Faça um fork do repositório principal",
    code: "# Via GitHub Web Interface\n# Clique no botão 'Fork' no repositório principal"
  },
  {
    title: "2. Clone Localmente",
    description: "Clone seu fork para sua máquina local",
    code: "git clone https://github.com/SEU_USUARIO/crm-pro-dashboard.git\ncd crm-pro-dashboard"
  },
  {
    title: "3. Configurar Ambiente",
    description: "Instale as dependências e configure o ambiente",
    code: "npm install\ncp .env.example .env\n# Configure as variáveis de ambiente"
  },
  {
    title: "4. Executar Localmente",
    description: "Inicie o servidor de desenvolvimento",
    code: "npm run dev\n# Acesse http://localhost:3000"
  }
];

const workflowSteps = [
  {
    step: 1,
    title: "Criar Branch",
    description: "Crie uma nova branch para sua contribuição",
    code: "git checkout -b feature/nome-da-feature\n# ou\ngit checkout -b fix/nome-do-bug"
  },
  {
    step: 2, 
    title: "Fazer Mudanças",
    description: "Implemente suas mudanças seguindo as diretrizes",
    details: ["Siga os padrões de código estabelecidos", "Escreva testes para novas funcionalidades", "Mantenha commits atômicos e bem documentados"]
  },
  {
    step: 3,
    title: "Testar",
    description: "Execute os testes e validações",
    code: "npm run test\nnpm run lint\nnpm run type-check"
  },
  {
    step: 4,
    title: "Commit",
    description: "Faça commit das suas mudanças",
    code: "git add .\ngit commit -m \"feat: adiciona nova funcionalidade X\"\n# Use conventional commits"
  },
  {
    step: 5,
    title: "Push e PR",
    description: "Envie suas mudanças e abra um Pull Request",
    code: "git push origin feature/nome-da-feature\n# Abra um PR via GitHub Interface"
  }
];

const guidelines = [
  {
    category: "Código",
    rules: [
      "Use TypeScript para todos os novos arquivos",
      "Siga as convenções do ESLint e Prettier configurados",
      "Escreva testes para funcionalidades críticas (>80% coverage)",
      "Use nomes descritivos para variáveis e funções",
      "Documente funções complexas com JSDoc"
    ]
  },
  {
    category: "Commits",
    rules: [
      "Use Conventional Commits (feat:, fix:, docs:, etc.)",
      "Escreva mensagens claras e em português ou inglês",
      "Mantenha commits atômicos e focados",
      "Referencie issues relacionadas (#123)",
      "Use co-authored-by para contribuições colaborativas"
    ]
  },
  {
    category: "Pull Requests",
    rules: [
      "Preencha completamente o template de PR",
      "Adicione screenshots para mudanças visuais",
      "Teste em diferentes navegadores quando relevante",
      "Mantenha PRs pequenos e focados",
      "Responda aos comentários rapidamente"
    ]
  },
  {
    category: "Documentação", 
    rules: [
      "Atualize a documentação para novas features",
      "Use markdown padrão e seja consistente",
      "Inclua exemplos práticos e código",
      "Mantenha READMEs atualizados",
      "Traduza conteúdo importante para português"
    ]
  }
];

const contributors = [
  { name: "João Silva", avatar: "/placeholder-user.jpg", contributions: 47, role: "Core Maintainer" },
  { name: "Maria Santos", avatar: "/placeholder-user.jpg", contributions: 23, role: "Developer" },
  { name: "Pedro Costa", avatar: "/placeholder-user.jpg", contributions: 18, role: "Designer" },
  { name: "Ana Lima", avatar: "/placeholder-user.jpg", contributions: 15, role: "Documentation" },
];

export default function ContributionPage() {
  const [activeTab, setActiveTab] = useState("getting-started");

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Guia de Contribuição</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Junte-se à nossa comunidade e ajude a construir o melhor CRM do mercado. 
          Toda contribuição é bem-vinda!
        </p>
      </div>

      {/* Contribution Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {contributionTypes.map((type, index) => (
          <Card key={index} className="h-full">
            <CardContent className="pt-6">
              <div className={`w-12 h-12 rounded-lg ${type.color} flex items-center justify-center mb-4`}>
                <type.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">{type.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{type.description}</p>
              <div className="space-y-1">
                {type.examples.map((example, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>{example}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="getting-started">Começando</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="guidelines">Diretrizes</TabsTrigger>
          <TabsTrigger value="community">Comunidade</TabsTrigger>
        </TabsList>

        <TabsContent value="getting-started" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                Configuração do Ambiente
              </CardTitle>
              <CardDescription>
                Siga estes passos para configurar o ambiente de desenvolvimento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {setupSteps.map((step, index) => (
                <div key={index} className="border-l-2 border-primary/20 pl-4">
                  <h4 className="font-semibold mb-2">{step.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                  <div className="bg-muted p-3 rounded-md">
                    <code className="text-sm whitespace-pre-line">{step.code}</code>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Dica:</strong> Use Docker para um setup mais rápido. Execute{" "}
              <code className="bg-muted px-1 rounded">docker-compose up -d</code> na raiz do projeto.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="workflow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Fluxo de Trabalho
              </CardTitle>
              <CardDescription>
                Processo padrão para contribuições no projeto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {workflowSteps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                        {step.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">{step.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                      
                      {step.code && (
                        <div className="bg-muted p-3 rounded-md mb-3">
                          <code className="text-sm whitespace-pre-line">{step.code}</code>
                        </div>
                      )}
                      
                      {step.details && (
                        <ul className="space-y-1">
                          {step.details.map((detail, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guidelines" className="space-y-6">
          <div className="grid gap-6">
            {guidelines.map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{section.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.rules.map((rule, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="community" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Principais Contribuidores
              </CardTitle>
              <CardDescription>
                Agradecemos a todos que tornam este projeto possível
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contributors.map((contributor, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{contributor.name}</h4>
                      <p className="text-sm text-muted-foreground">{contributor.role}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {contributor.contributions} contribuições
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Canais de Comunicação</CardTitle>
              <CardDescription>
                Entre em contato com a comunidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto p-4 justify-start" asChild>
                  <a href="https://github.com/your-repo/discussions" target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">GitHub Discussions</div>
                      <div className="text-xs text-muted-foreground">Discussões e perguntas</div>
                    </div>
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </a>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 justify-start" asChild>
                  <a href="https://discord.gg/your-server" target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Discord</div>
                      <div className="text-xs text-muted-foreground">Chat em tempo real</div>
                    </div>
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recognition */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Reconhecimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              <h4 className="font-semibold mb-2">Hall of Fame</h4>
              <p className="text-sm text-muted-foreground">
                Contribuidores especiais são reconhecidos publicamente
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <GitPullRequest className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Mergência Rápida</h4>
              <p className="text-sm text-muted-foreground">
                PRs de qualidade são revisados rapidamente
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Mentoria</h4>
              <p className="text-sm text-muted-foreground">
                Oferecemos orientação para novos contribuidores
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Navigation */}
      <div className="flex justify-between items-center mt-12 pt-8 border-t">
        <Button variant="outline" asChild>
          <a href="/docs/api">
            <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
            API Reference
          </a>
        </Button>
        <Button asChild>
          <a href="/docs">
            Voltar à Documentação
            <ChevronRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}
