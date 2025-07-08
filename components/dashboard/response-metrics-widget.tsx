"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageCircle, Clock, TrendingUp, TrendingDown, Target, AlertCircle, CheckCircle, Users } from 'lucide-react'

interface ResponseMetrics {
  channel: string
  totalMessages: number
  avgResponseTime: number
  firstResponseTime: number
  resolutionRate: number
  customerSatisfaction: number
  agentUtilization: number
  trend: 'up' | 'down' | 'stable'
}

interface AgentPerformance {
  id: string
  name: string
  avatar: string
  status: 'online' | 'busy' | 'away' | 'offline'
  responsesHandled: number
  avgResponseTime: number
  satisfaction: number
  utilization: number
}

export function ResponseMetricsWidget() {
  const [timeRange, setTimeRange] = useState('hoje')
  const [selectedChannel, setSelectedChannel] = useState('todos')

  const metrics: ResponseMetrics[] = [
    {
      channel: 'WhatsApp',
      totalMessages: 1234,
      avgResponseTime: 45,
      firstResponseTime: 32,
      resolutionRate: 87,
      customerSatisfaction: 4.6,
      agentUtilization: 78,
      trend: 'up'
    },
    {
      channel: 'Email',
      totalMessages: 892,
      avgResponseTime: 120,
      firstResponseTime: 95,
      resolutionRate: 92,
      customerSatisfaction: 4.8,
      agentUtilization: 65,
      trend: 'stable'
    },
    {
      channel: 'Chat',
      totalMessages: 567,
      avgResponseTime: 28,
      firstResponseTime: 15,
      resolutionRate: 79,
      customerSatisfaction: 4.3,
      agentUtilization: 89,
      trend: 'down'
    },
    {
      channel: 'SMS',
      totalMessages: 234,
      avgResponseTime: 67,
      firstResponseTime: 52,
      resolutionRate: 95,
      customerSatisfaction: 4.7,
      agentUtilization: 45,
      trend: 'up'
    }
  ]

  const agents: AgentPerformance[] = [
    {
      id: '1',
      name: 'Ana Silva',
      avatar: '/placeholder-user.jpg',
      status: 'online',
      responsesHandled: 45,
      avgResponseTime: 32,
      satisfaction: 4.8,
      utilization: 85
    },
    {
      id: '2',
      name: 'Carlos Santos',
      avatar: '/placeholder-user.jpg',
      status: 'busy',
      responsesHandled: 38,
      avgResponseTime: 28,
      satisfaction: 4.6,
      utilization: 92
    },
    {
      id: '3',
      name: 'Maria Costa',
      avatar: '/placeholder-user.jpg',
      status: 'online',
      responsesHandled: 52,
      avgResponseTime: 41,
      satisfaction: 4.9,
      utilization: 78
    },
    {
      id: '4',
      name: 'Pedro Lima',
      avatar: '/placeholder-user.jpg',
      status: 'away',
      responsesHandled: 23,
      avgResponseTime: 55,
      satisfaction: 4.2,
      utilization: 45
    }
  ]

  const filteredMetrics = selectedChannel === 'todos' 
    ? metrics 
    : metrics.filter(m => m.channel.toLowerCase() === selectedChannel.toLowerCase())

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />
      case 'stable': return <Target className="h-4 w-4 text-yellow-600" />
      default: return null
    }
  }

  const getChannelColor = (channel: string) => {
    const colors = {
      'WhatsApp': 'bg-green-100 text-green-800',
      'Email': 'bg-purple-100 text-purple-800',
      'Chat': 'bg-blue-100 text-blue-800',
      'SMS': 'bg-yellow-100 text-yellow-800'
    }
    return colors[channel as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800'
      case 'busy': return 'bg-red-100 text-red-800'
      case 'away': return 'bg-yellow-100 text-yellow-800'
      case 'offline': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}min ${remainingSeconds}s`
  }

  const getPerformanceColor = (value: number, type: 'time' | 'rate' | 'satisfaction') => {
    if (type === 'time') {
      if (value <= 30) return 'text-green-600'
      if (value <= 60) return 'text-yellow-600'
      return 'text-red-600'
    }
    if (type === 'rate' || type === 'satisfaction') {
      if (value >= 80) return 'text-green-600'
      if (value >= 60) return 'text-yellow-600'
      return 'text-red-600'
    }
    return 'text-gray-600'
  }

  const totalMessages = filteredMetrics.reduce((sum, m) => sum + m.totalMessages, 0)
  const avgResponseTime = Math.round(filteredMetrics.reduce((sum, m) => sum + m.avgResponseTime, 0) / filteredMetrics.length)
  const avgResolutionRate = Math.round(filteredMetrics.reduce((sum, m) => sum + m.resolutionRate, 0) / filteredMetrics.length)
  const avgSatisfaction = (filteredMetrics.reduce((sum, m) => sum + m.customerSatisfaction, 0) / filteredMetrics.length).toFixed(1)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Métricas de Resposta
          <Badge variant="secondary" className="ml-auto">
            Tempo Real
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros */}
        <div className="grid grid-cols-2 gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hoje">Hoje</SelectItem>
              <SelectItem value="ontem">Ontem</SelectItem>
              <SelectItem value="7dias">Últimos 7 dias</SelectItem>
              <SelectItem value="30dias">Últimos 30 dias</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedChannel} onValueChange={setSelectedChannel}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Canais</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="chat">Chat</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Resumo Geral */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{totalMessages}</div>
            <div className="text-xs text-blue-700">Mensagens Hoje</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className={`text-2xl font-bold ${getPerformanceColor(avgResponseTime, 'time')}`}>
              {formatTime(avgResponseTime)}
            </div>
            <div className="text-xs text-green-700">Tempo Médio</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className={`text-2xl font-bold ${getPerformanceColor(avgResolutionRate, 'rate')}`}>
              {avgResolutionRate}%
            </div>
            <div className="text-xs text-purple-700">Taxa Resolução</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{avgSatisfaction}</div>
            <div className="text-xs text-yellow-700">Satisfação</div>
          </div>
        </div>

        {/* Métricas por Canal */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Performance por Canal</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filteredMetrics.map((metric) => (
              <div key={metric.channel} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={getChannelColor(metric.channel)}>
                      {metric.channel}
                    </Badge>
                    {getTrendIcon(metric.trend)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {metric.totalMessages} mensagens
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="flex items-center justify-between">
                      <span>Tempo Resposta</span>
                      <span className={getPerformanceColor(metric.avgResponseTime, 'time')}>
                        {formatTime(metric.avgResponseTime)}
                      </span>
                    </div>
                    <Progress 
                      value={100 - (metric.avgResponseTime / 120 * 100)} 
                      className="h-1 mt-1"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span>Taxa Resolução</span>
                      <span className={getPerformanceColor(metric.resolutionRate, 'rate')}>
                        {metric.resolutionRate}%
                      </span>
                    </div>
                    <Progress value={metric.resolutionRate} className="h-1 mt-1" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span>Satisfação</span>
                      <span className={getPerformanceColor(metric.customerSatisfaction * 20, 'satisfaction')}>
                        {metric.customerSatisfaction}/5
                      </span>
                    </div>
                    <Progress value={metric.customerSatisfaction * 20} className="h-1 mt-1" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span>Utilização</span>
                      <span className={getPerformanceColor(metric.agentUtilization, 'rate')}>
                        {metric.agentUtilization}%
                      </span>
                    </div>
                    <Progress value={metric.agentUtilization} className="h-1 mt-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance dos Agentes */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Performance dos Agentes</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {agents.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between p-2 border rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{agent.name}</div>
                    <Badge className={getStatusColor(agent.status)}>
                      {agent.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="text-center">
                    <div className="font-medium">{agent.responsesHandled}</div>
                    <div className="text-gray-600">Respostas</div>
                  </div>
                  <div className="text-center">
                    <div className={`font-medium ${getPerformanceColor(agent.avgResponseTime, 'time')}`}>
                      {formatTime(agent.avgResponseTime)}
                    </div>
                    <div className="text-gray-600">Tempo Médio</div>
                  </div>
                  <div className="text-center">
                    <div className={`font-medium ${getPerformanceColor(agent.satisfaction * 20, 'satisfaction')}`}>
                      {agent.satisfaction}
                    </div>
                    <div className="text-gray-600">Satisfação</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alertas */}
        <div className="bg-yellow-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">Alertas Ativos</span>
          </div>
          <div className="space-y-1 text-xs text-yellow-700">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              Chat: Tempo de resposta acima de 60s (último 1h)
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3" />
              WhatsApp: Meta de satisfação atingida (4.6/5)
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
