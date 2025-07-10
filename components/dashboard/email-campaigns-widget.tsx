"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Mail, 
  Send, 
  Users, 
  TrendingUp, 
  Eye, 
  MousePointer,
  Play,
  Pause,
  Settings,
  Plus,
  BarChart3
} from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  type: "regular" | "ab_test" | "drip";
  status: "draft" | "scheduled" | "running" | "completed" | "paused";
  subject: string;
  recipients: number;
  sent: number;
  opened: number;
  clicked: number;
  converted: number;
  schedule?: string;
  abTest?: {
    variantA: {
      subject: string;
      openRate: number;
      clickRate: number;
      recipients: number;
    };
    variantB: {
      subject: string;
      openRate: number;
      clickRate: number;
      recipients: number;
    };
    winner?: "A" | "B";
  };
}

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Lançamento Produto Q3",
    type: "ab_test",
    status: "running",
    subject: "Novidade: Sistema de Automação",
    recipients: 5000,
    sent: 5000,
    opened: 1850,
    clicked: 185,
    converted: 37,
    abTest: {
      variantA: {
        subject: "🚀 Novidade: Sistema de Automação",
        openRate: 38.5,
        clickRate: 4.2,
        recipients: 2500
      },
      variantB: {
        subject: "Revolucione seus processos com automação",
        openRate: 35.2,
        clickRate: 3.8,
        recipients: 2500
      },
      winner: "A"
    }
  },
  {
    id: "2",
    name: "Newsletter Semanal",
    type: "regular",
    status: "completed",
    subject: "Novidades da semana - CRM Pro",
    recipients: 8500,
    sent: 8500,
    opened: 3145,
    clicked: 377,
    converted: 23,
    schedule: "Toda segunda-feira, 09:00"
  },
  {
    id: "3",
    name: "Sequência Onboarding",
    type: "drip",
    status: "running",
    subject: "Bem-vindo ao CRM Pro!",
    recipients: 350,
    sent: 280,
    opened: 238,
    clicked: 89,
    converted: 12
  },
  {
    id: "4",
    name: "Promoção Black Friday",
    type: "regular",
    status: "scheduled",
    subject: "50% OFF em todos os planos",
    recipients: 12000,
    sent: 0,
    opened: 0,
    clicked: 0,
    converted: 0,
    schedule: "25/11/2024, 00:00"
  }
];

export function EmailCampaignsWidget() {
  const [campaigns] = useState<Campaign[]>(mockCampaigns);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "scheduled": return "bg-yellow-100 text-yellow-800";
      case "paused": return "bg-orange-100 text-orange-800";
      case "draft": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "running": return "Em execução";
      case "completed": return "Concluída";
      case "scheduled": return "Agendada";
      case "paused": return "Pausada";
      case "draft": return "Rascunho";
      default: return status;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "ab_test": return "🧪";
      case "drip": return "💧";
      case "regular": return "📧";
      default: return "📧";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "ab_test": return "Teste A/B";
      case "drip": return "Sequência";
      case "regular": return "Regular";
      default: return type;
    }
  };

  const calculateRate = (numerator: number, denominator: number) => {
    return denominator > 0 ? ((numerator / denominator) * 100).toFixed(1) : "0.0";
  };

  const totalSent = campaigns.reduce((sum, campaign) => sum + campaign.sent, 0);
  const totalOpened = campaigns.reduce((sum, campaign) => sum + campaign.opened, 0);
  const totalClicked = campaigns.reduce((sum, campaign) => sum + campaign.clicked, 0);
  const totalConverted = campaigns.reduce((sum, campaign) => sum + campaign.converted, 0);

  const avgOpenRate = calculateRate(totalOpened, totalSent);
  const avgClickRate = calculateRate(totalClicked, totalSent);
  const avgConversionRate = calculateRate(totalConverted, totalSent);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Campanhas de Email
            </CardTitle>
            <CardDescription>
              Editor visual com A/B testing automático
            </CardDescription>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Nova Campanha
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="campaigns" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="campaigns" className="space-y-4">
            <div className="space-y-3">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getTypeIcon(campaign.type)}</span>
                      <div>
                        <h4 className="font-semibold">{campaign.name}</h4>
                        <p className="text-sm text-gray-600">{campaign.subject}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{getTypeLabel(campaign.type)}</Badge>
                      <Badge className={getStatusColor(campaign.status)}>
                        {getStatusLabel(campaign.status)}
                      </Badge>
                      {campaign.status === "running" && (
                        <Button variant="outline" size="sm">
                          <Pause className="h-4 w-4 mr-1" />
                          Pausar
                        </Button>
                      )}
                      {campaign.status === "paused" && (
                        <Button variant="outline" size="sm">
                          <Play className="h-4 w-4 mr-1" />
                          Retomar
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {campaign.abTest && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <h5 className="font-medium mb-3 flex items-center gap-2">
                        🧪 Teste A/B
                        {campaign.abTest.winner && (
                          <Badge variant="default">
                            Vencedor: Variante {campaign.abTest.winner}
                          </Badge>
                        )}
                      </h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-card p-3 rounded border">
                          <h6 className="font-medium text-sm mb-2">Variante A</h6>
                          <p className="text-sm text-gray-600 mb-2">{campaign.abTest.variantA.subject}</p>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span>Taxa de abertura:</span>
                              <span className="font-medium">{campaign.abTest.variantA.openRate}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Taxa de clique:</span>
                              <span className="font-medium">{campaign.abTest.variantA.clickRate}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Destinatários:</span>
                              <span className="font-medium">{campaign.abTest.variantA.recipients.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-card p-3 rounded border">
                          <h6 className="font-medium text-sm mb-2">Variante B</h6>
                          <p className="text-sm text-gray-600 mb-2">{campaign.abTest.variantB.subject}</p>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span>Taxa de abertura:</span>
                              <span className="font-medium">{campaign.abTest.variantB.openRate}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Taxa de clique:</span>
                              <span className="font-medium">{campaign.abTest.variantB.clickRate}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Destinatários:</span>
                              <span className="font-medium">{campaign.abTest.variantB.recipients.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-gray-600">Destinatários</p>
                        <p className="font-semibold">{campaign.recipients.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-gray-600">Enviados</p>
                        <p className="font-semibold">{campaign.sent.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="text-gray-600">Abertos</p>
                        <p className="font-semibold">
                          {campaign.opened.toLocaleString()} ({calculateRate(campaign.opened, campaign.sent)}%)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MousePointer className="h-4 w-4 text-purple-500" />
                      <div>
                        <p className="text-gray-600">Cliques</p>
                        <p className="font-semibold">
                          {campaign.clicked.toLocaleString()} ({calculateRate(campaign.clicked, campaign.sent)}%)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-orange-500" />
                      <div>
                        <p className="text-gray-600">Conversões</p>
                        <p className="font-semibold">
                          {campaign.converted.toLocaleString()} ({calculateRate(campaign.converted, campaign.sent)}%)
                        </p>
                      </div>
                    </div>
                  </div>

                  {campaign.schedule && (
                    <div className="mt-3 text-sm text-gray-600">
                      <span className="font-medium">Agendamento:</span> {campaign.schedule}
                    </div>
                  )}

                  {campaign.status === "running" && campaign.sent > 0 && (
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progresso do envio</span>
                        <span>{calculateRate(campaign.sent, campaign.recipients)}%</span>
                      </div>
                      <Progress value={(campaign.sent / campaign.recipients) * 100} className="h-2" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Emails Enviados</p>
                    <p className="text-lg font-bold text-blue-600">{totalSent.toLocaleString()}</p>
                  </div>
                  <Send className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Taxa de Abertura</p>
                    <p className="text-lg font-bold text-green-600">{avgOpenRate}%</p>
                  </div>
                  <Eye className="h-8 w-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Taxa de Clique</p>
                    <p className="text-lg font-bold text-purple-600">{avgClickRate}%</p>
                  </div>
                  <MousePointer className="h-8 w-8 text-purple-500" />
                </div>
              </div>
              
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Taxa de Conversão</p>
                    <p className="text-lg font-bold text-orange-600">{avgConversionRate}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">Performance por Tipo</h4>
                <div className="space-y-2">
                  {["regular", "ab_test", "drip"].map((type) => {
                    const typeCampaigns = campaigns.filter(c => c.type === type);
                    const typeOpens = typeCampaigns.reduce((sum, c) => sum + c.opened, 0);
                    const typeSent = typeCampaigns.reduce((sum, c) => sum + c.sent, 0);
                    const openRate = calculateRate(typeOpens, typeSent);
                    
                    return (
                      <div key={type} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="flex items-center gap-2">
                          <span>{getTypeIcon(type)}</span>
                          <span className="text-sm">{getTypeLabel(type)}</span>
                        </span>
                        <span className="font-medium">{openRate}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">Melhores Práticas</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-green-600">
                    ✓ Use emojis no assunto (aumenta abertura em 25%)
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    ✓ Personalize com nome do destinatário
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    ✓ Teste A/B diferentes assuntos
                  </div>
                  <div className="flex items-center gap-2 text-yellow-600">
                    ⚠️ Evite palavras como "grátis" e "promoção"
                  </div>
                  <div className="flex items-center gap-2 text-yellow-600">
                    ⚠️ Mantenha assunto com menos de 50 caracteres
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-4">
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Templates de email aparecerão aqui</p>
              <Button className="mt-4" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Criar Template
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
