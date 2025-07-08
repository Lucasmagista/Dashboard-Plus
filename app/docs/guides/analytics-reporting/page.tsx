"use client";

import React from "react";
import { ArrowLeft, TrendingUp, BarChart3, PieChart, Clock, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function AnalyticsReportingGuide() {
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
          <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
            <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Analytics e Relatórios</h1>
            <p className="text-muted-foreground">
              Como interpretar métricas e criar relatórios personalizados
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <Badge variant="outline">Analytics</Badge>
          <Badge className="bg-yellow-100 text-yellow-800">Intermediário</Badge>
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            20 min
          </Badge>
          <Badge variant="secondary">
            <Star className="h-3 w-3 mr-1" />
            4.8
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="roi">ROI</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Vendas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">R$ 45.2k</div>
                  <div className="text-sm text-muted-foreground">Este mês</div>
                  <div className="text-sm text-green-600">+12% vs mês anterior</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Conversão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">3.2%</div>
                  <div className="text-sm text-muted-foreground">Taxa média</div>
                  <div className="text-sm text-red-600">-0.5% vs mês anterior</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Leads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">1.4k</div>
                  <div className="text-sm text-muted-foreground">Novos leads</div>
                  <div className="text-sm text-green-600">+8% vs mês anterior</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dashboards" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dashboards Customizados</CardTitle>
              <CardDescription>
                Crie visualizações personalizadas para suas métricas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Configure widgets personalizados para acompanhar KPIs específicos
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Automáticos</CardTitle>
              <CardDescription>
                Configure relatórios para envio automático
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Agende relatórios semanais, mensais ou trimestrais
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roi" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cálculo de ROI</CardTitle>
              <CardDescription>
                Meça o retorno sobre investimento das suas campanhas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Analise custos vs receita para otimizar investimentos
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
