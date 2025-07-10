"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Clock, Target, Plus, MoreHorizontal } from "lucide-react";

interface Deal {
  id: string;
  title: string;
  value: number;
  company: string;
  contact: string;
  probability: number;
  daysInStage: number;
  nextAction: string;
}

interface PipelineStage {
  id: string;
  name: string;
  deals: Deal[];
  color: string;
}

const mockPipeline: PipelineStage[] = [
  {
    id: "prospecting",
    name: "Prospecção",
    color: "bg-blue-100 border-blue-300",
    deals: [
      {
        id: "1",
        title: "Sistema ERP",
        value: 150000,
        company: "TechCorp",
        contact: "Ana Silva",
        probability: 20,
        daysInStage: 5,
        nextAction: "Enviar proposta"
      },
      {
        id: "2", 
        title: "Consultoria Digital",
        value: 75000,
        company: "StartupX",
        contact: "Carlos Santos",
        probability: 15,
        daysInStage: 12,
        nextAction: "Agendar reunião"
      }
    ]
  },
  {
    id: "qualification",
    name: "Qualificação",
    color: "bg-yellow-100 border-yellow-300",
    deals: [
      {
        id: "3",
        title: "CRM Enterprise",
        value: 200000,
        company: "BigCorp",
        contact: "Maria Oliveira",
        probability: 40,
        daysInStage: 8,
        nextAction: "Demo personalizada"
      }
    ]
  },
  {
    id: "proposal",
    name: "Proposta",
    color: "bg-orange-100 border-orange-300",
    deals: [
      {
        id: "4",
        title: "Automação Processos",
        value: 120000,
        company: "IndustrialCorp",
        contact: "João Costa",
        probability: 70,
        daysInStage: 15,
        nextAction: "Negociar termos"
      }
    ]
  },
  {
    id: "negotiation",
    name: "Negociação",
    color: "bg-purple-100 border-purple-300",
    deals: [
      {
        id: "5",
        title: "BI Dashboard",
        value: 90000,
        company: "DataCorp",
        contact: "Sandra Lima",
        probability: 85,
        daysInStage: 3,
        nextAction: "Assinatura contrato"
      }
    ]
  },
  {
    id: "closed-won",
    name: "Fechado - Ganho",
    color: "bg-green-100 border-green-300",
    deals: [
      {
        id: "6",
        title: "Plataforma E-commerce",
        value: 180000,
        company: "RetailCorp",
        contact: "Pedro Souza",
        probability: 100,
        daysInStage: 1,
        nextAction: "Onboarding"
      }
    ]
  }
];

export function SalesPipelineWidget() {
  const [pipeline] = useState<PipelineStage[]>(mockPipeline);

  const totalValue = pipeline.reduce((total, stage) => 
    total + stage.deals.reduce((stageTotal, deal) => stageTotal + deal.value, 0), 0
  );

  const weightedValue = pipeline.reduce((total, stage) => 
    total + stage.deals.reduce((stageTotal, deal) => 
      stageTotal + (deal.value * deal.probability / 100), 0
    ), 0
  );

  const totalDeals = pipeline.reduce((total, stage) => total + stage.deals.length, 0);
  const avgDealValue = totalDeals > 0 ? totalValue / totalDeals : 0;

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return "text-green-600";
    if (probability >= 60) return "text-yellow-600";
    if (probability >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getDaysColor = (days: number) => {
    if (days <= 7) return "text-green-600";
    if (days <= 14) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Pipeline de Vendas
            </CardTitle>
            <CardDescription>
              Kanban interativo com previsões de fechamento
            </CardDescription>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Nova Oportunidade
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor Total</p>
                <p className="text-lg font-bold text-blue-600">
                  R$ {totalValue.toLocaleString('pt-BR')}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor Ponderado</p>
                <p className="text-lg font-bold text-green-600">
                  R$ {weightedValue.toLocaleString('pt-BR')}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Oportunidades</p>
                <p className="text-lg font-bold text-purple-600">{totalDeals}</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ticket Médio</p>
                <p className="text-lg font-bold text-orange-600">
                  R$ {avgDealValue.toLocaleString('pt-BR')}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {pipeline.map((stage) => (
            <div key={stage.id} className={`p-3 rounded-lg border-2 ${stage.color}`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-sm">{stage.name}</h4>
                <Badge variant="secondary">{stage.deals.length}</Badge>
              </div>
              
              <div className="space-y-2">
                {stage.deals.map((deal) => (
                  <div key={deal.id} className="bg-card p-3 rounded-lg border shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-sm line-clamp-2">{deal.title}</h5>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Valor:</span>
                        <span className="font-bold text-green-600">
                          R$ {deal.value.toLocaleString('pt-BR')}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Empresa:</span>
                        <span className="font-medium">{deal.company}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Contato:</span>
                        <span>{deal.contact}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Probabilidade:</span>
                        <span className={`font-bold ${getProbabilityColor(deal.probability)}`}>
                          {deal.probability}%
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Dias no estágio:</span>
                        <span className={`font-medium ${getDaysColor(deal.daysInStage)}`}>
                          {deal.daysInStage}d
                        </span>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600 text-xs">{deal.nextAction}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full border-2 border-dashed border-gray-300 hover:border-gray-400"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar Deal
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <p className="text-gray-600">Taxa de Conversão</p>
              <p className="font-bold text-lg">23%</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Ciclo Médio</p>
              <p className="font-bold text-lg">45 dias</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Meta Mensal</p>
              <p className="font-bold text-lg">R$ 500K</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Previsão</p>
              <p className="font-bold text-lg text-green-600">
                R$ {(weightedValue * 1.2).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
