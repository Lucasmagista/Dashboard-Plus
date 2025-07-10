"use client"

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { GoogleForm, FormResponse } from '@/hooks/use-google-forms'
import { Calendar, Users, TrendingUp, Download, Eye, ExternalLink } from 'lucide-react'

interface FormAnalyticsProps {
  form: GoogleForm
  responses: FormResponse[]
  loading?: boolean
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function FormAnalytics({ form, responses, loading = false }: FormAnalyticsProps) {
  const [responseData, setResponseData] = useState<any[]>([])
  const [summaryStats, setSummaryStats] = useState({
    totalResponses: 0,
    avgResponseTime: 0,
    completionRate: 85,
    lastResponse: null as string | null
  })

  useEffect(() => {
    if (responses.length > 0) {
      // Processar dados para gráficos
      const processedData = processResponsesForCharts(responses)
      setResponseData(processedData)

      // Calcular estatísticas
      setSummaryStats({
        totalResponses: responses.length,
        avgResponseTime: 3.5, // Simulado
        completionRate: Math.round((responses.length / (responses.length + 5)) * 100),
        lastResponse: responses[responses.length - 1]?.submittedAt || null
      })
    }
  }, [responses])

  const processResponsesForCharts = (responses: FormResponse[]) => {
    // Simular processamento de respostas para diferentes tipos de gráfico
    const responsesByDate = responses.reduce((acc, response) => {
      const date = response.submittedAt
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(responsesByDate).map(([date, count]) => ({
      date,
      responses: count
    }))
  }

  // Mock data para demonstração de diferentes tipos de perguntas
  const mockChartData = {
    satisfaction: [
      { name: 'Muito Satisfeito', value: 12, percentage: 40 },
      { name: 'Satisfeito', value: 10, percentage: 33 },
      { name: 'Neutro', value: 5, percentage: 17 },
      { name: 'Insatisfeito', value: 2, percentage: 7 },
      { name: 'Muito Insatisfeito', value: 1, percentage: 3 }
    ],
    responsesTrend: [
      { date: '01/07', responses: 3 },
      { date: '02/07', responses: 5 },
      { date: '03/07', responses: 8 },
      { date: '04/07', responses: 6 },
      { date: '05/07', responses: 9 },
      { date: '06/07', responses: 12 },
      { date: '07/07', responses: 15 }
    ],
    departments: [
      { name: 'TI', responses: 15 },
      { name: 'RH', responses: 8 },
      { name: 'Vendas', responses: 12 },
      { name: 'Marketing', responses: 6 },
      { name: 'Financeiro', responses: 4 }
    ]
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header do formulário */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {form.title}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            {form.description}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Visualizar
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Abrir no Google
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Total de Respostas
                </p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {summaryStats.totalResponses}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Taxa de Conclusão
                </p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {summaryStats.completionRate}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <Progress value={summaryStats.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Tempo Médio
                </p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {summaryStats.avgResponseTime}min
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Status
                </p>
                <Badge 
                  variant={form.status === 'active' ? 'default' : 'secondary'}
                  className="mt-1"
                >
                  {form.status === 'active' ? 'Ativo' : 
                   form.status === 'draft' ? 'Rascunho' : 'Inativo'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de análise */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="responses">Respostas</TabsTrigger>
          <TabsTrigger value="analytics">Análise Detalhada</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de tendência de respostas */}
            <Card>
              <CardHeader>
                <CardTitle>Respostas por Dia</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockChartData.responsesTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="responses" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de satisfação */}
            <Card>
              <CardHeader>
                <CardTitle>Nível de Satisfação</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockChartData.satisfaction}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mockChartData.satisfaction.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="responses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Respostas por Departamento</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={mockChartData.departments} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="responses" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Análise Temporal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      Horário com mais respostas
                    </span>
                    <span className="font-semibold">14:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      Dia da semana preferido
                    </span>
                    <span className="font-semibold">Terça-feira</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      Taxa de abandono
                    </span>
                    <span className="font-semibold text-red-600">15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Alta participação:</strong> 85% dos colaboradores responderam ao formulário
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      <strong>Feedback positivo:</strong> 73% das respostas são positivas
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>Atenção:</strong> Departamento de TI precisa de mais respostas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
