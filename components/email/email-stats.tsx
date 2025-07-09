"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts"
import {
  Mail,
  Send,
  Eye,
  MousePointer,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCw
} from "lucide-react"
import { useEmail } from "@/hooks/use-email"

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export function EmailStats() {
  const { loadStats, stats, isLoading } = useEmail()
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadStats()
  }, [loadStats])

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadStats()
    setRefreshing(false)
  }

  if (!stats) {
    const loadingCards = [
      { id: 'sent-loading', label: 'Enviados' },
      { id: 'delivered-loading', label: 'Entregues' },
      { id: 'opened-loading', label: 'Abertos' },
      { id: 'clicked-loading', label: 'Clicados' }
    ]

    return (
      <div className="grid gap-4 md:grid-cols-4">
        {loadingCards.map((card) => (
          <Card key={card.id}>
            <CardHeader className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const performanceData = [
    { name: 'Taxa de Abertura', value: stats.openRate, color: '#2563eb' },
    { name: 'Taxa de Clique', value: stats.clickRate, color: '#10b981' },
    { name: 'Taxa de Rejeição', value: stats.bounceRate, color: '#ef4444' }
  ]

  const chartData = stats.dailyStats.map(day => ({
    date: new Date(day.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    enviados: day.sent,
    entregues: day.delivered,
    abertos: day.opened,
    clicados: day.clicked
  }))

  return (
    <div className="space-y-6">
      {/* Header com botão de refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Estatísticas de Email</h2>
          <p className="text-muted-foreground">Análise de performance das suas campanhas</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={refreshing || isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">E-mails Enviados</CardTitle>
            <Send className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.sent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">E-mails Entregues</CardTitle>
            <Mail className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.delivered.toLocaleString()}</div>
            <div className="flex items-center mt-2">
              <Progress value={(stats.delivered / stats.sent) * 100} className="flex-1 mr-2" />
              <span className="text-xs text-muted-foreground">
                {Math.round((stats.delivered / stats.sent) * 100)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">E-mails Abertos</CardTitle>
            <Eye className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.opened.toLocaleString()}</div>
            <div className="flex items-center mt-2">
              <Badge variant={stats.openRate > 25 ? "default" : "secondary"} className="text-xs">
                {stats.openRate > 25 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {stats.openRate}% taxa
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cliques</CardTitle>
            <MousePointer className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.clicked.toLocaleString()}</div>
            <div className="flex items-center mt-2">
              <Badge variant={stats.clickRate > 5 ? "default" : "secondary"} className="text-xs">
                {stats.clickRate > 5 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {stats.clickRate}% taxa
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas Secundárias */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">E-mails Rejeitados</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.bounced.toLocaleString()}</div>
            <div className="flex items-center mt-2">
              <Progress value={stats.bounceRate} className="flex-1 mr-2" />
              <span className="text-xs text-muted-foreground">{stats.bounceRate}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Descadastros</CardTitle>
            <Mail className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.unsubscribed.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.unsubscribed / stats.delivered) * 100).toFixed(2)}% dos entregues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Engajamento</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.round(((stats.opened + stats.clicked) / stats.delivered) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Abertos + Cliques</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Gráfico de Linha - Performance ao Longo do Tempo */}
        <Card>
          <CardHeader>
            <CardTitle>Performance ao Longo do Tempo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="enviados" stroke="#2563eb" strokeWidth={2} />
                <Line type="monotone" dataKey="entregues" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="abertos" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="clicados" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Pizza - Taxa de Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Taxa de Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={performanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {performanceData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Barras - Comparação Diária */}
      <Card>
        <CardHeader>
          <CardTitle>Comparação Diária Detalhada</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="enviados" fill="#2563eb" name="Enviados" />
              <Bar dataKey="entregues" fill="#10b981" name="Entregues" />
              <Bar dataKey="abertos" fill="#f59e0b" name="Abertos" />
              <Bar dataKey="clicados" fill="#8b5cf6" name="Clicados" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Insights e Recomendações */}
      <Card>
        <CardHeader>
          <CardTitle>Insights e Recomendações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">✅ Pontos Positivos</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {stats.openRate > 25 && <li>• Excelente taxa de abertura ({stats.openRate}%)</li>}
                {stats.clickRate > 5 && <li>• Boa taxa de clique ({stats.clickRate}%)</li>}
                {stats.bounceRate < 5 && <li>• Baixa taxa de rejeição ({stats.bounceRate}%)</li>}
                {stats.delivered / stats.sent > 0.95 && <li>• Alta taxa de entrega ({Math.round((stats.delivered / stats.sent) * 100)}%)</li>}
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-orange-600">⚠️ Áreas para Melhoria</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {stats.openRate <= 25 && <li>• Melhorar linha de assunto para aumentar abertura</li>}
                {stats.clickRate <= 5 && <li>• Otimizar call-to-action para mais cliques</li>}
                {stats.bounceRate >= 5 && <li>• Limpar lista de emails para reduzir rejeições</li>}
                {stats.delivered / stats.sent <= 0.95 && <li>• Verificar reputação do remetente</li>}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
