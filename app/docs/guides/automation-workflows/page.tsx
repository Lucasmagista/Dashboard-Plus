"use client";

import React, { useState } from "react";
import { 
  ArrowLeft,
  Settings,
  Zap,
  GitBranch,
  Play,
  Pause,
  BarChart3,
  Clock,
  Star,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Target,
  Mail,
  MessageSquare,
  Phone,
  Calendar,
  Timer,
  Filter,
  Shuffle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

const workflowTypes = [
  {
    id: "nurturing",
    title: "Nutrição de Leads",
    description: "Eduque leads com conteúdo relevante ao longo do tempo",
    icon: Target,
    difficulty: "Intermediário",
    timeToSetup: "30 min",
    examples: [
      "Sequência de e-mails educativos",
      "Conteúdo baseado em interesse",
      "Scoring automático de leads"
    ]
  },
  {
    id: "welcome",
    title: "Boas-vindas",
    description: "Receba novos contatos com sequência personalizada",
    icon: Mail,
    difficulty: "Fácil",
    timeToSetup: "15 min",
    examples: [
      "E-mail de boas-vindas imediato",
      "Apresentação da empresa",
      "Guia de primeiros passos"
    ]
  },
  {
    id: "reengagement",
    title: "Reativação",
    description: "Reconquiste contatos inativos",
    icon: Zap,
    difficulty: "Intermediário",
    timeToSetup: "25 min",
    examples: [
      "Detecção de inatividade",
      "Oferta especial personalizada",
      "Pesquisa de satisfação"
    ]
  },
  {
    id: "followup",
    title: "Follow-up de Vendas",
    description: "Automatize o processo pós-venda",
    icon: Phone,
    difficulty: "Avançado",
    timeToSetup: "45 min",
    examples: [
      "Agendamento automático",
      "Lembretes para vendedores",
      "Pesquisa de satisfação"
    ]
  }
];

const triggerTypes = [
  {
    type: "Evento",
    description: "Baseado em ações do usuário",
    icon: Play,
    examples: ["Cadastro", "Compra", "Download", "Clique em link"]
  },
  {
    type: "Tempo",
    description: "Baseado em data/hora específica",
    icon: Clock,
    examples: ["Data específica", "X dias após evento", "Dia da semana"]
  },
  {
    type: "Condição",
    description: "Baseado em propriedades do contato",
    icon: Filter,
    examples: ["Tag específica", "Localização", "Valor de campo"]
  },
  {
    type: "Comportamento",
    description: "Baseado em padrões de uso",
    icon: BarChart3,
    examples: ["Inatividade", "Engajamento alto", "Múltiplas visitas"]
  }
];

const actions = [
  {
    category: "Comunicação",
    icon: Mail,
    actions: [
      "Enviar e-mail",
      "Enviar SMS",
      "Enviar WhatsApp",
      "Criar tarefa para vendedor"
    ]
  },
  {
    category: "Organização",
    icon: Settings,
    actions: [
      "Adicionar tag",
      "Mover para lista",
      "Atualizar campo",
      "Calcular score"
    ]
  },
  {
    category: "Vendas",
    icon: Target,
    actions: [
      "Criar oportunidade",
      "Agendar reunião",
      "Notificar vendedor",
      "Atualizar pipeline"
    ]
  },
  {
    category: "Integrações",
    icon: Zap,
    actions: [
      "Webhook",
      "API externa",
      "Zapier",
      "Integração personalizada"
    ]
  }
];

const bestPractices = [
  {
    title: "Teste com Pequenos Grupos",
    description: "Sempre teste workflows com uma amostra antes de ativar para toda a base",
    importance: "Alta"
  },
  {
    title: "Monitore Métricas",
    description: "Acompanhe taxa de abertura, cliques e conversões",
    importance: "Alta"
  },
  {
    title: "Personalize Conteúdo",
    description: "Use campos personalizados para tornar mensagens mais relevantes",
    importance: "Média"
  },
  {
    title: "Defina Limites",
    description: "Configure frequência máxima de envios para evitar spam",
    importance: "Alta"
  },
  {
    title: "Segmente por Estágio",
    description: "Crie workflows diferentes para cada estágio do funil",
    importance: "Média"
  },
  {
    title: "Configure Exits",
    description: "Defina condições de saída para evitar mensagens desnecessárias",
    importance: "Alta"
  }
];

export default function AutomationWorkflowsGuide() {
  const [activeWorkflow, setActiveWorkflow] = useState("nurturing");
  
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/docs/guides">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos Guias
          </Button>
        </Link>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
            <Settings className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Criando Workflows de Automação</h1>
            <p className="text-muted-foreground">
              Aprenda a criar fluxos automatizados para nurturing e conversão de leads
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <Badge variant="outline">Automação</Badge>
          <Badge className="bg-yellow-100 text-yellow-800">Intermediário</Badge>
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            25 min
          </Badge>
          <Badge variant="secondary">
            <Star className="h-3 w-3 mr-1" />
            4.7
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="types" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="types">Tipos</TabsTrigger>
          <TabsTrigger value="triggers">Triggers</TabsTrigger>
          <TabsTrigger value="actions">Ações</TabsTrigger>
          <TabsTrigger value="setup">Configuração</TabsTrigger>
          <TabsTrigger value="optimization">Otimização</TabsTrigger>
        </TabsList>

        <TabsContent value="types" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tipos de Workflows</CardTitle>
              <CardDescription>
                Escolha o tipo de automação mais adequado para seu objetivo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {workflowTypes.map((workflow) => {
                  const WorkflowIcon = workflow.icon;
                  return (
                    <Card key={workflow.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <WorkflowIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{workflow.title}</CardTitle>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {workflow.difficulty}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                <Timer className="h-3 w-3 mr-1" />
                                {workflow.timeToSetup}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <CardDescription>{workflow.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Exemplos de uso:</h4>
                          <ul className="text-sm space-y-1">
                            {workflow.examples.map((example, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                {example}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="triggers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Tipos de Triggers
              </CardTitle>
              <CardDescription>
                Eventos que iniciam seus workflows automaticamente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {triggerTypes.map((trigger, index) => {
                  const TriggerIcon = trigger.icon;
                  return (
                    <div key={index} className="p-4 rounded-lg border">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                          <TriggerIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{trigger.type}</h4>
                          <p className="text-sm text-muted-foreground">{trigger.description}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {trigger.examples.map((example, exampleIndex) => (
                          <div key={exampleIndex} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {example}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Dica:</strong> Combine múltiplos triggers para criar workflows mais inteligentes. 
              Por exemplo: "Após 7 dias do cadastro" + "Não abriu nenhum e-mail".
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Ações Disponíveis
              </CardTitle>
              <CardDescription>
                O que seu workflow pode fazer automaticamente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {actions.map((category, index) => {
                  const CategoryIcon = category.icon;
                  return (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CategoryIcon className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold">{category.category}</h4>
                      </div>
                      <div className="grid gap-2">
                        {category.actions.map((action, actionIndex) => (
                          <div key={actionIndex} className="flex items-center gap-2 p-2 rounded bg-muted/30">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                            <span className="text-sm">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="setup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Passo a Passo da Configuração
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                      1
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Definir Objetivo</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Determine claramente o que você quer alcançar com o workflow
                    </p>
                    <div className="grid gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Target className="h-3 w-3 text-green-500" />
                        Aumentar engajamento de novos leads
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-3 w-3 text-green-500" />
                        Educar prospects sobre o produto
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-3 w-3 text-green-500" />
                        Reativar contatos dormentes
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                      2
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Escolher Trigger</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Selecione o evento que iniciará o workflow
                    </p>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <code className="text-sm">
                        Exemplo: Quando contato recebe tag "Lead Qualificado"
                      </code>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                      3
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Criar Sequência</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Defina as ações e tempos de espera
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-blue-500" />
                        Enviar e-mail de boas-vindas (imediato)
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        Aguardar 3 dias
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-blue-500" />
                        Enviar conteúdo educativo
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                      4
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Testar e Ativar</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Teste com um grupo pequeno antes de ativar completamente
                    </p>
                    <Button size="sm" className="mr-2">
                      <Play className="h-4 w-4 mr-1" />
                      Testar Workflow
                    </Button>
                    <Button size="sm" variant="outline">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Ver Métricas
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Melhores Práticas</CardTitle>
              <CardDescription>
                Dicas para otimizar seus workflows e maximizar resultados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {bestPractices.map((practice, index) => (
                  <div key={index} className="p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-sm">{practice.title}</h4>
                      <Badge 
                        variant={practice.importance === "Alta" ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {practice.importance}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{practice.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Métricas Importantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 rounded-lg bg-muted/30">
                  <div className="text-2xl font-bold text-blue-600">25%</div>
                  <div className="text-sm text-muted-foreground">Taxa de Abertura</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/30">
                  <div className="text-2xl font-bold text-green-600">8%</div>
                  <div className="text-sm text-muted-foreground">Taxa de Cliques</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/30">
                  <div className="text-2xl font-bold text-purple-600">12%</div>
                  <div className="text-sm text-muted-foreground">Taxa de Conversão</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Next Steps */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Próximos Passos</CardTitle>
          <CardDescription>
            Continue aprendendo sobre automação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/docs/guides/analytics-reporting">
              <Button variant="outline" className="w-full justify-start h-auto p-4">
                <BarChart3 className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Analytics e Relatórios</div>
                  <div className="text-xs text-muted-foreground">Monitore performance dos workflows</div>
                </div>
              </Button>
            </Link>
            
            <Link href="/docs/guides/whatsapp-integration">
              <Button variant="outline" className="w-full justify-start h-auto p-4">
                <MessageSquare className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Integração WhatsApp</div>
                  <div className="text-xs text-muted-foreground">Automatize mensagens no WhatsApp</div>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
