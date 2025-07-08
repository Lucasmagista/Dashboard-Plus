"use client";

import React from "react";
import { 
  ArrowLeft,
  CheckCircle,
  Zap,
  User,
  Upload,
  Send,
  Settings,
  Download,
  Play,
  AlertCircle,
  Clock,
  Star
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

const steps = [
  {
    id: 1,
    title: "Criando sua conta",
    description: "Configure sua conta e perfil inicial",
    timeEstimate: "3 min",
    difficulty: "Fácil",
    icon: User,
    substeps: [
      "Acesse o portal de cadastro",
      "Preencha seus dados pessoais",
      "Verifique seu e-mail",
      "Configure sua senha segura"
    ]
  },
  {
    id: 2,
    title: "Configuração inicial",
    description: "Personalize o sistema para suas necessidades",
    timeEstimate: "5 min",
    difficulty: "Fácil",
    icon: Settings,
    substeps: [
      "Defina informações da empresa",
      "Configure fusos horários",
      "Personalize campos obrigatórios",
      "Configure preferências de notificação"
    ]
  },
  {
    id: 3,
    title: "Importando contatos",
    description: "Migre sua base de contatos existente",
    timeEstimate: "10 min",
    difficulty: "Médio",
    icon: Upload,
    substeps: [
      "Prepare arquivo CSV/Excel",
      "Mapeie campos de importação",
      "Execute importação",
      "Valide dados importados"
    ]
  },
  {
    id: 4,
    title: "Primeira campanha",
    description: "Lance sua primeira campanha de e-mail",
    timeEstimate: "15 min",
    difficulty: "Médio",
    icon: Send,
    substeps: [
      "Crie lista de contatos",
      "Escolha template de e-mail",
      "Configure agendamento",
      "Monitore resultados"
    ]
  }
];

const quickTips = [
  {
    tip: "Use a importação em lote para grandes volumes de contatos",
    icon: Upload
  },
  {
    tip: "Configure tags desde o início para melhor organização",
    icon: Settings
  },
  {
    tip: "Teste sempre com poucos contatos antes de campanhas grandes",
    icon: AlertCircle
  },
  {
    tip: "Monitore métricas desde a primeira campanha",
    icon: Star
  }
];

export default function GettingStartedGuide() {
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);
  
  const toggleStep = (stepId: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const progress = (completedSteps.length / steps.length) * 100;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/docs/guides">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos Guias
          </Button>
        </Link>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
            <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Primeiros Passos</h1>
            <p className="text-muted-foreground">
              Guia completo para configurar e usar o CRM Pro Dashboard pela primeira vez
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <Badge variant="outline">Básico</Badge>
          <Badge className="bg-green-100 text-green-800">Iniciante</Badge>
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            10 min
          </Badge>
          <Badge variant="secondary">
            <Star className="h-3 w-3 mr-1" />
            4.9
          </Badge>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progresso do Guia</span>
              <span className="text-sm text-muted-foreground">{completedSteps.length}/{steps.length} passos</span>
            </div>
            <Progress value={progress} className="mb-2" />
            <p className="text-xs text-muted-foreground">
              {progress === 100 ? "Parabéns! Você completou todos os passos!" : "Continue seguindo os passos para completar a configuração"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="steps" className="space-y-6">
        <TabsList>
          <TabsTrigger value="steps">Passo a Passo</TabsTrigger>
          <TabsTrigger value="tips">Dicas Rápidas</TabsTrigger>
          <TabsTrigger value="resources">Recursos</TabsTrigger>
        </TabsList>

        <TabsContent value="steps" className="space-y-6">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const StepIcon = step.icon;
            
            return (
              <Card key={step.id} className={`transition-all ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompleted ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                        }`}>
                          {isCompleted ? <CheckCircle className="h-5 w-5" /> : step.id}
                        </div>
                        {index < steps.length - 1 && (
                          <div className={`w-0.5 h-16 mt-2 ${
                            isCompleted ? 'bg-green-500' : 'bg-muted'
                          }`} />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <StepIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{step.title}</CardTitle>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {step.timeEstimate}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {step.difficulty}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <CardDescription className="text-base">
                          {step.description}
                        </CardDescription>
                      </div>
                    </div>
                    
                    <Button
                      variant={isCompleted ? "outline" : "default"}
                      size="sm"
                      onClick={() => toggleStep(step.id)}
                    >
                      {isCompleted ? "Concluído" : "Marcar como Concluído"}
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="ml-14">
                    <h4 className="font-medium mb-3">Passos detalhados:</h4>
                    <div className="space-y-2">
                      {step.substeps.map((substep, subIndex) => (
                        <div key={subIndex} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          <span className="text-sm">{substep}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="tips" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dicas para o Sucesso</CardTitle>
              <CardDescription>
                Aproveite ao máximo sua experiência inicial
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {quickTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <tip.icon className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-sm">{tip.tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Dica Pro:</strong> Dedique tempo à configuração inicial. Uma base bem estruturada 
              facilitará muito seu trabalho futuro no CRM.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Templates e Recursos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Template de Importação CSV
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Checklist de Configuração
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Guia de Boas Práticas
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Vídeos Tutorial
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Play className="h-4 w-4 mr-2" />
                  Configuração Inicial (5 min)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Play className="h-4 w-4 mr-2" />
                  Importação de Contatos (8 min)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Play className="h-4 w-4 mr-2" />
                  Primeira Campanha (12 min)
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Next Steps */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Próximos Passos</CardTitle>
          <CardDescription>
            Continue sua jornada com estes guias recomendados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/docs/guides/contact-management">
              <Button variant="outline" className="w-full justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-semibold">Gestão de Contatos</div>
                  <div className="text-xs text-muted-foreground">Organize sua base de contatos</div>
                </div>
              </Button>
            </Link>
            
            <Link href="/docs/guides/automation-workflows">
              <Button variant="outline" className="w-full justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-semibold">Workflows de Automação</div>
                  <div className="text-xs text-muted-foreground">Automatize seus processos</div>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
