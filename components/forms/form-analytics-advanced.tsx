"use client"

import { useState, useEffect, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts'
import { GoogleForm, FormResponse } from '@/hooks/use-google-forms'
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Download, 
  Eye, 
  ExternalLink, 
  Filter,
  Share,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Clock,
  MapPin,
  Smartphone,
  Globe,
  Star,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Target,
  Zap,
  Brain,
  FileSpreadsheet,
  Mail,
  MessageSquare
} from 'lucide-react'

interface FormAnalyticsProps {
  form: GoogleForm
  responses: FormResponse[]
  loading?: boolean
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316']

// Dados mock mais realistas para demonstração
const mockDetailedData = {
  timeAnalysis: [
    { hour: '00-02', responses: 2, percentage: 1.2 },
    { hour: '02-04', responses: 1, percentage: 0.6 },
    { hour: '04-06', responses: 0, percentage: 0 },
    { hour: '06-08', responses: 5, percentage: 3.1 },
    { hour: '08-10', responses: 25, percentage: 15.6 },
    { hour: '10-12', responses: 32, percentage: 20.0 },
    { hour: '12-14', responses: 28, percentage: 17.5 },
    { hour: '14-16', responses: 35, percentage: 21.9 },
    { hour: '16-18', responses: 22, percentage: 13.8 },
    { hour: '18-20', responses: 8, percentage: 5.0 },
    { hour: '20-22', responses: 2, percentage: 1.2 },
    { hour: '22-00', responses: 0, percentage: 0 }
  ],
  deviceAnalysis: [
    { device: 'Desktop', count: 85, percentage: 53.1 },
    { device: 'Mobile', count: 65, percentage: 40.6 },
    { device: 'Tablet', count: 10, percentage: 6.3 }
  ],
  locationAnalysis: [
    { location: 'São Paulo', count: 45, percentage: 28.1 },
    { location: 'Rio de Janeiro', count: 32, percentage: 20.0 },
    { location: 'Belo Horizonte', count: 18, percentage: 11.3 },
    { location: 'Brasília', count: 15, percentage: 9.4 },
    { location: 'Salvador', count: 12, percentage: 7.5 },
    { location: 'Outros', count: 38, percentage: 23.7 }
  ],
  completionFunnel: [
    { stage: 'Visualizaram', count: 250, percentage: 100 },
    { stage: 'Iniciaram', count: 200, percentage: 80 },
    { stage: 'Metade completa', count: 180, percentage: 72 },
    { stage: 'Quase finalizaram', count: 170, percentage: 68 },
    { stage: 'Enviaram', count: 160, percentage: 64 }
  ],
  sentimentAnalysis: [
    { sentiment: 'Muito Positivo', count: 48, percentage: 30.0, color: '#10b981' },
    { sentiment: 'Positivo', count: 64, percentage: 40.0, color: '#84cc16' },
    { sentiment: 'Neutro', count: 32, percentage: 20.0, color: '#6b7280' },
    { sentiment: 'Negativo', count: 12, percentage: 7.5, color: '#f59e0b' },
    { sentiment: 'Muito Negativo', count: 4, percentage: 2.5, color: '#ef4444' }
  ],
  responseTime: [
    { timeRange: '< 1 min', count: 45, percentage: 28.1 },
    { timeRange: '1-3 min', count: 72, percentage: 45.0 },
    { timeRange: '3-5 min', count: 28, percentage: 17.5 },
    { timeRange: '5-10 min', count: 12, percentage: 7.5 },
    { timeRange: '> 10 min', count: 3, percentage: 1.9 }
  ],
  weeklyTrend: [
    { week: 'Sem 1', responses: 12, abandoned: 3, completion: 75 },
    { week: 'Sem 2', responses: 25, abandoned: 5, completion: 80 },
    { week: 'Sem 3', responses: 35, abandoned: 4, completion: 89 },
    { week: 'Sem 4', responses: 42, abandoned: 6, completion: 86 },
    { week: 'Sem 5', responses: 46, abandoned: 2, completion: 96 }
  ]
}

export function FormAnalytics({ form, responses, loading = false }: FormAnalyticsProps) {
  const [selectedMetric, setSelectedMetric] = useState('overview')
  const [dateRange, setDateRange] = useState('all')
  const [exportFormat, setExportFormat] = useState('pdf')
  const [shareSettings, setShareSettings] = useState({ public: false, password: '' })

  // Cálculos de métricas avançadas
  const analytics = useMemo(() => {
    const totalResponses = responses.length || 160 // Mock data
    const avgResponseTime = 3.2 // Mock
    const completionRate = 89
    const bounceRate = 11
    const npsScore = 67
    const satisfactionScore = 4.2

    return {
      totalResponses,
      avgResponseTime,
      completionRate,
      bounceRate,
      npsScore,
      satisfactionScore,
      totalViews: Math.round(totalResponses / (completionRate / 100)),
      avgTimeToComplete: '3min 12s',
      peakResponseHour: '14:00-16:00',
      topDevice: 'Desktop (53.1%)',
      topLocation: 'São Paulo (28.1%)'
    }
  }, [responses])

  const StatCard = ({ title, value, change, icon: Icon, color = 'blue' }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {title}
            </p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {value}
            </p>
            {change && (
              <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change > 0 ? '+' : ''}{change}% vs. período anterior
              </p>
            )}
          </div>
          <Icon className={`h-8 w-8 text-${color}-600`} />
        </div>
      </CardContent>
    </Card>
  )

  const QuestionAnalysis = ({ question, responses: questionResponses }: any) => {
    // Mock analysis for demonstration
    const analysis = {
      averageRating: 4.2,
      mostCommonAnswer: 'Muito satisfeito',
      responseCount: 145,
      skipRate: 9,
      timeSpent: '45s'
    }

    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg">{question.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analysis.responseCount}</div>
              <div className="text-xs text-zinc-500">Respostas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{(100 - analysis.skipRate)}%</div>
              <div className="text-xs text-zinc-500">Taxa de resposta</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{analysis.averageRating}</div>
              <div className="text-xs text-zinc-500">Nota média</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{analysis.timeSpent}</div>
              <div className="text-xs text-zinc-500">Tempo médio</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-zinc-700 truncate">{analysis.mostCommonAnswer}</div>
              <div className="text-xs text-zinc-500">Resposta mais comum</div>
            </div>
          </div>

          {/* Gráfico específico por tipo de pergunta */}
          {question.type === 'radio' && (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Muito satisfeito', value: 45, color: '#10b981' },
                    { name: 'Satisfeito', value: 32, color: '#84cc16' },
                    { name: 'Neutro', value: 15, color: '#6b7280' },
                    { name: 'Insatisfeito', value: 6, color: '#f59e0b' },
                    { name: 'Muito insatisfeito', value: 2, color: '#ef4444' }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {[
                    { name: 'Muito satisfeito', value: 45, color: '#10b981' },
                    { name: 'Satisfeito', value: 32, color: '#84cc16' },
                    { name: 'Neutro', value: 15, color: '#6b7280' },
                    { name: 'Insatisfeito', value: 6, color: '#f59e0b' },
                    { name: 'Muito insatisfeito', value: 2, color: '#ef4444' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}

          {question.type === 'linear-scale' && (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[
                { rating: '1', count: 2 },
                { rating: '2', count: 5 },
                { rating: '3', count: 12 },
                { rating: '4', count: 45 },
                { rating: '5', count: 81 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
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
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {form.title}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">
            {form.description}
          </p>
          <div className="flex items-center gap-4 mt-2 text-sm text-zinc-500">
            <span>Criado em {form.createdAt}</span>
            <span>•</span>
            <span>Última atualização {form.updatedAt}</span>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todo período</SelectItem>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
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

      {/* Cards de métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Respostas"
          value={analytics.totalResponses}
          change={12}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Taxa de Conclusão"
          value={`${analytics.completionRate}%`}
          change={5}
          icon={Target}
          color="green"
        />
        <StatCard
          title="Tempo Médio"
          value={analytics.avgTimeToComplete}
          change={-8}
          icon={Clock}
          color="purple"
        />
        <StatCard
          title="NPS Score"
          value={analytics.npsScore}
          change={3}
          icon={Star}
          color="yellow"
        />
      </div>

      {/* Métricas secundárias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Visualizações"
          value={analytics.totalViews}
          icon={Eye}
          color="indigo"
        />
        <StatCard
          title="Taxa de Abandono"
          value={`${analytics.bounceRate}%`}
          icon={XCircle}
          color="red"
        />
        <StatCard
          title="Satisfação Média"
          value={analytics.satisfactionScore}
          icon={ThumbsUp}
          color="green"
        />
        <StatCard
          title="Pico de Respostas"
          value={analytics.peakResponseHour}
          icon={TrendingUp}
          color="orange"
        />
      </div>

      {/* Tabs de análise detalhada */}
      <Tabs value={selectedMetric} onValueChange={setSelectedMetric} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="responses">Respostas</TabsTrigger>
          <TabsTrigger value="behavior">Comportamento</TabsTrigger>
          <TabsTrigger value="demographics">Demografia</TabsTrigger>
          <TabsTrigger value="questions">Por Pergunta</TabsTrigger>
          <TabsTrigger value="insights">Insights IA</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tendência de respostas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Tendência de Respostas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={mockDetailedData.weeklyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="responses" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Funil de conversão */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Funil de Conversão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDetailedData.completionFunnel.map((stage, index) => (
                    <div key={stage.stage} className="flex items-center gap-4">
                      <div className="w-24 text-sm font-medium">{stage.stage}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Progress value={stage.percentage} className="flex-1" />
                          <span className="text-sm font-medium w-12">{stage.percentage}%</span>
                        </div>
                      </div>
                      <div className="text-sm text-zinc-500 w-16">{stage.count}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Análise de sentimento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Análise de Sentimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockDetailedData.sentimentAnalysis}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="count"
                      label={({ sentiment, percentage }) => `${sentiment}: ${percentage}%`}
                    >
                      {mockDetailedData.sentimentAnalysis.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-4">
                  {mockDetailedData.sentimentAnalysis.map((item, index) => (
                    <div key={item.sentiment} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium">{item.sentiment}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{item.count}</div>
                        <div className="text-sm text-zinc-500">{item.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Análise temporal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Padrões Temporais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockDetailedData.timeAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="responses" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Tempo de resposta */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Distribuição do Tempo de Resposta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockDetailedData.responseTime} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="timeRange" type="category" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dispositivos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Dispositivos Utilizados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockDetailedData.deviceAnalysis}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="count"
                      label={({ device, percentage }) => `${device}: ${percentage}%`}
                    >
                      {mockDetailedData.deviceAnalysis.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Localização */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Distribuição Geográfica
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockDetailedData.locationAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="location" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#06b6d4" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <div className="space-y-6">
            {/* Mock questions analysis */}
            {[
              { 
                title: 'Como você avalia o atendimento recebido?', 
                type: 'radio',
                responses: []
              },
              { 
                title: 'Em uma escala de 1 a 5, qual sua satisfação geral?', 
                type: 'linear-scale',
                responses: []
              },
              { 
                title: 'Que melhorias você sugere?', 
                type: 'textarea',
                responses: []
              }
            ].map((question, index) => (
              <QuestionAnalysis key={index} question={question} responses={[]} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Insights Automáticos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-800 dark:text-green-200">
                          Alta Satisfação Geral
                        </h4>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          89% das respostas indicam satisfação positiva. Manter estratégias atuais.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                      <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                          Pico de Engajamento
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Horário ideal para envio: 14:00-16:00. 35% mais respostas neste período.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
                          Otimização Mobile
                        </h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          40% das respostas vêm de mobile. Considere otimizar para telas menores.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex items-start gap-3">
                      <Target className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-purple-800 dark:text-purple-200">
                          Oportunidade de Melhoria
                        </h4>
                        <p className="text-sm text-purple-700 dark:text-purple-300">
                          11% de taxa de abandono. Considere simplificar perguntas complexas.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recomendações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">📈 Para Aumentar Respostas:</h4>
                    <ul className="text-sm space-y-1 text-zinc-600 dark:text-zinc-400">
                      <li>• Enviar lembretes após 3 dias</li>
                      <li>• Usar incentivos para participação</li>
                      <li>• Reduzir número de perguntas opcionais</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">🎯 Para Melhorar Qualidade:</h4>
                    <ul className="text-sm space-y-1 text-zinc-600 dark:text-zinc-400">
                      <li>• Adicionar validação em campos de texto</li>
                      <li>• Incluir exemplos nas perguntas abertas</li>
                      <li>• Testar formulário em diferentes dispositivos</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">💡 Próximos Passos:</h4>
                    <ul className="text-sm space-y-1 text-zinc-600 dark:text-zinc-400">
                      <li>• Criar segmentação por departamento</li>
                      <li>• Implementar follow-up automático</li>
                      <li>• Configurar alertas de baixa participação</li>
                    </ul>
                  </div>

                  <Separator />

                  <div className="text-center">
                    <Button className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Gerar Relatório Executivo
                    </Button>
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
