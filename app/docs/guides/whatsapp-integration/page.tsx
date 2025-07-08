"use client";

import React from "react";
import { 
  ArrowLeft,
  MessageSquare,
  Smartphone,
  Settings,
  Webhook,
  MessageCircle,
  Clock,
  Star,
  CheckCircle,
  AlertCircle,
  Code,
  Key,
  Send,
  Bot
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

const setupSteps = [
  {
    title: "Configuração da API",
    description: "Configure sua conta WhatsApp Business API",
    time: "10 min",
    steps: [
      "Criar conta WhatsApp Business",
      "Verificar número de telefone",
      "Obter token de acesso",
      "Configurar webhook URL"
    ]
  },
  {
    title: "Webhooks e Callbacks",
    description: "Configure recebimento de mensagens",
    time: "15 min",
    steps: [
      "Configurar endpoint webhook",
      "Validar token de verificação",
      "Testar recebimento de mensagens",
      "Configurar eventos de status"
    ]
  },
  {
    title: "Templates de Mensagem",
    description: "Crie templates aprovados pelo WhatsApp",
    time: "20 min",
    steps: [
      "Criar templates no Meta Business",
      "Aguardar aprovação (24-48h)",
      "Importar templates para o CRM",
      "Testar envio de templates"
    ]
  },
  {
    title: "Gestão de Conversas",
    description: "Configure interface de atendimento",
    time: "15 min",
    steps: [
      "Configurar roteamento automático",
      "Definir horários de atendimento",
      "Configurar respostas automáticas",
      "Treinar equipe de atendimento"
    ]
  }
];

const features = [
  {
    title: "Mensagens Automáticas",
    description: "Envie mensagens baseadas em triggers",
    icon: Bot,
    examples: ["Boas-vindas", "Confirmações", "Lembretes", "Follow-ups"]
  },
  {
    title: "Templates Aprovados",
    description: "Use templates pré-aprovados pelo Meta",
    icon: MessageCircle,
    examples: ["Notificações", "Promoções", "Confirmações", "Alertas"]
  },
  {
    title: "Chat Unificado",
    description: "Centralize conversas em uma interface",
    icon: MessageSquare,
    examples: ["Histórico completo", "Tags automáticas", "Roteamento", "Escalação"]
  },
  {
    title: "API Completa",
    description: "Integração total via API REST",
    icon: Code,
    examples: ["Envio programado", "Status de entrega", "Mídia rica", "Botões interativos"]
  }
];

export default function WhatsAppIntegrationGuide() {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <Link href="/docs/guides">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos Guias
          </Button>
        </Link>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
            <MessageSquare className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Integração com WhatsApp Business</h1>
            <p className="text-muted-foreground">
              Configuração completa da integração com WhatsApp Business API
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <Badge variant="outline">Integrações</Badge>
          <Badge className="bg-yellow-100 text-yellow-800">Intermediário</Badge>
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            30 min
          </Badge>
          <Badge variant="secondary">
            <Star className="h-3 w-3 mr-1" />
            4.6
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="setup" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="setup">Configuração</TabsTrigger>
          <TabsTrigger value="features">Funcionalidades</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="automation">Automação</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6">
          {setupSteps.map((step, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <CardTitle>{step.title}</CardTitle>
                    <Badge variant="outline" className="text-xs mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {step.time}
                    </Badge>
                  </div>
                </div>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {step.steps.map((substep, subIndex) => (
                    <div key={subIndex} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{substep}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {features.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <FeatureIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Exemplos de uso:</h4>
                      <div className="grid gap-1">
                        {feature.examples.map((example, exampleIndex) => (
                          <div key={exampleIndex} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            {example}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Importante:</strong> Templates devem ser aprovados pelo Meta antes do uso. 
              O processo pode levar 24-48 horas.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Tipos de Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="p-4 rounded-lg border">
                  <h4 className="font-semibold mb-2">Utilitário</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Para notificações importantes e transacionais
                  </p>
                  <div className="text-sm">Exemplos: Confirmação de pedido, Status de entrega</div>
                </div>
                
                <div className="p-4 rounded-lg border">
                  <h4 className="font-semibold mb-2">Marketing</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Para promoções e campanhas (limitado)
                  </p>
                  <div className="text-sm">Exemplos: Ofertas especiais, Novos produtos</div>
                </div>
                
                <div className="p-4 rounded-lg border">
                  <h4 className="font-semibold mb-2">Autenticação</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Para códigos OTP e verificação
                  </p>
                  <div className="text-sm">Exemplos: Código de verificação, Login seguro</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automações Populares</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="h-4 w-4 text-primary" />
                    <h4 className="font-semibold">Resposta Automática</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Responda automaticamente fora do horário comercial
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Send className="h-4 w-4 text-primary" />
                    <h4 className="font-semibold">Follow-up Automático</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Envie lembretes após período de inatividade
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="h-4 w-4 text-primary" />
                    <h4 className="font-semibold">Roteamento Inteligente</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Direcione mensagens para agentes específicos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
