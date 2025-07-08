"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  Filter
} from "lucide-react";

interface KPI {
  id: string;
  name: string;
  value: number;
  target: number;
  previousValue: number;
  format: "currency" | "number" | "percentage";
  category: "sales" | "marketing" | "support" | "general";
  trend: "up" | "down" | "stable";
  alert?: "danger" | "warning" | "success";
}

interface ExecutiveDashboard {
  period: "today" | "week" | "month" | "quarter";
  kpis: KPI[];
  alerts: Alert[];
  comparisons: Comparison[];
}

interface Alert {
  id: string;
  type: "danger" | "warning" | "info";
  title: string;
  description: string;
  timestamp: string;
}

interface Comparison {
  metric: string;
  current: number;
  previous: number;
  change: number;
  period: string;
}

const mockKPIs: KPI[] = [
  {
    id: "revenue",
    name: "Receita Mensal",
    value: 485320,
    target: 500000,
    previousValue: 456890,
    format: "currency",
    category: "sales",
    trend: "up"
  },
  {
    id: "leads",
    name: "Leads Qualificados",
    value: 1247,
    target: 1200,
    previousValue: 1156,
    format: "number",
    category: "marketing",
    trend: "up",
    alert: "success"
  },
  {
    id: "conversion",
    name: "Taxa de Conversão",
    value: 23.5,
    target: 25,
    previousValue: 22.1,
    format: "percentage",
    category: "sales",
    trend: "up"
  },
  {
    id: "satisfaction",
    name: "Satisfação do Cliente",
    value: 4.7,
    target: 4.5,
    previousValue: 4.6,
    format: "number",
    category: "support",
    trend: "up",
    alert: "success"
  },
  {
    id: "churn",
    name: "Taxa de Churn",
    value: 2.8,
    target: 3.0,
    previousValue: 3.2,
    format: "percentage",
    category: "general",
    trend: "down",
    alert: "success"
  },
  {
    id: "arpu",
    name: "ARPU (Receita por Usuário)",
    value: 287.50,
    target: 300,
    previousValue: 275.30,
    format: "currency",
    category: "sales",
    trend: "up"
  }
];

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "warning",
    title: "Meta de receita em risco",
    description: "Receita atual 3% abaixo da meta mensal",
    timestamp: "2h atrás"
  },
  {
    id: "2",
    type: "success",
    title: "Leads qualificados superaram meta",
    description: "104% da meta mensal atingida",
    timestamp: "4h atrás"
  },
  {
    id: "3",
    type: "info",
    title: "Novo recorde de satisfação",
    description: "NPS atingiu 72 pontos, novo recorde histórico",
    timestamp: "1 dia atrás"
  }
];

const mockComparisons: Comparison[] = [
  {
    metric: "Vendas",
    current: 485320,
    previous: 456890,
    change: 6.2,
    period: "vs mês anterior"
  },
  {
    metric: "Novos Clientes",
    current: 89,
    previous: 76,
    change: 17.1,
    period: "vs mês anterior"
  },
  {
    metric: "Tempo de Resposta",
    current: 2.3,
    previous: 2.8,
    change: -17.9,
    period: "vs semana anterior"
  },
  {
    metric: "ROI Marketing",
    current: 4.2,
    previous: 3.8,
    change: 10.5,
    period: "vs trimestre anterior"
  }
];

export function ExecutiveAnalyticsWidget() {
  const [selectedPeriod, setSelectedPeriod] = useState<"today" | "week" | "month" | "quarter">("month");
  const [kpis] = useState<KPI[]>(mockKPIs);
  const [alerts] = useState<Alert[]>(mockAlerts);
  const [comparisons] = useState<Comparison[]>(mockComparisons);

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case "currency":
        return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
      case "percentage":
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString('pt-BR');
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <span className="h-4 w-4 text-gray-400">→</span>;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "danger":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "danger":
        return "bg-red-100 text-red-800 border-red-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const calculateProgress = (value: number, target: number) => {
    return Math.min((value / target) * 100, 100);
  };

  const calculateChange = (current: number, previous: number) => {
    return previous > 0 ? ((current - previous) / previous) * 100 : 0;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics Executivo
            </CardTitle>
            <CardDescription>
              KPIs em tempo real e comparativos históricos
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-1" />
              Atualizar
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Exportar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="kpis" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="kpis">KPIs Principais</TabsTrigger>
            <TabsTrigger value="comparisons">Comparativos</TabsTrigger>
            <TabsTrigger value="alerts">Alertas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="kpis" className="space-y-4">
            <div className="flex gap-2">
              {["today", "week", "month", "quarter"].map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPeriod(period as any)}
                  className="capitalize"
                >
                  {period === "today" ? "Hoje" : 
                   period === "week" ? "Semana" :
                   period === "month" ? "Mês" : "Trimestre"}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {kpis.map((kpi) => {
                const change = calculateChange(kpi.value, kpi.previousValue);
                const progress = calculateProgress(kpi.value, kpi.target);
                
                return (
                  <div key={kpi.id} className="p-4 border rounded-lg relative">
                    {kpi.alert && (
                      <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
                        kpi.alert === "success" ? "bg-green-400" :
                        kpi.alert === "warning" ? "bg-yellow-400" : "bg-red-400"
                      }`} />
                    )}
                    
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{kpi.name}</h4>
                      {getTrendIcon(kpi.trend)}
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-2xl font-bold">
                        {formatValue(kpi.value, kpi.format)}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className={`flex items-center gap-1 ${
                          change >= 0 ? "text-green-600" : "text-red-600"
                        }`}>
                          {change >= 0 ? "+" : ""}{change.toFixed(1)}% vs anterior
                        </span>
                        <span className="text-gray-500">
                          Meta: {formatValue(kpi.target, kpi.format)}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progresso da meta</span>
                          <span>{progress.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              progress >= 100 ? "bg-green-500" :
                              progress >= 80 ? "bg-blue-500" :
                              progress >= 60 ? "bg-yellow-500" : "bg-red-500"
                            }`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">Resumo por Categoria</h4>
                <div className="space-y-2">
                  {["sales", "marketing", "support", "general"].map((category) => {
                    const categoryKPIs = kpis.filter(kpi => kpi.category === category);
                    const metasAtingidas = categoryKPIs.filter(kpi => kpi.value >= kpi.target).length;
                    
                    return (
                      <div key={category} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm capitalize">
                          {category === "sales" ? "Vendas" :
                           category === "marketing" ? "Marketing" :
                           category === "support" ? "Suporte" : "Geral"}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {metasAtingidas}/{categoryKPIs.length} metas
                          </span>
                          <div className={`w-2 h-2 rounded-full ${
                            metasAtingidas === categoryKPIs.length ? "bg-green-400" :
                            metasAtingidas >= categoryKPIs.length / 2 ? "bg-yellow-400" : "bg-red-400"
                          }`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">Performance Geral</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Metas Atingidas</span>
                    <span className="font-bold text-green-600">
                      {kpis.filter(kpi => kpi.value >= kpi.target).length}/{kpis.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tendência Positiva</span>
                    <span className="font-bold text-blue-600">
                      {kpis.filter(kpi => kpi.trend === "up").length}/{kpis.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Alertas Ativos</span>
                    <span className="font-bold text-orange-600">
                      {kpis.filter(kpi => kpi.alert).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="comparisons" className="space-y-4">
            <div className="space-y-3">
              {comparisons.map((comparison, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{comparison.metric}</h4>
                    <span className="text-sm text-gray-500">{comparison.period}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">Atual</p>
                      <p className="text-lg font-bold">{comparison.current.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Anterior</p>
                      <p className="text-lg font-medium text-gray-500">{comparison.previous.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Mudança</p>
                      <p className={`text-lg font-bold flex items-center gap-1 ${
                        comparison.change >= 0 ? "text-green-600" : "text-red-600"
                      }`}>
                        {comparison.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        {comparison.change >= 0 ? "+" : ""}{comparison.change.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="alerts" className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Alertas Automáticos ({alerts.length})</h4>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Filtrar
              </Button>
            </div>
            
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className={`p-4 border rounded-lg ${getAlertColor(alert.type)}`}>
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <h5 className="font-medium">{alert.title}</h5>
                      <p className="text-sm mt-1">{alert.description}</p>
                      <span className="text-xs text-gray-500 mt-2 block">{alert.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
