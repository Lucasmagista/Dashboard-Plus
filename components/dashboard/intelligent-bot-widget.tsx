"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Bot, Brain, TrendingUp, Settings, Zap, User, Clock } from 'lucide-react'

interface BotMetrics {
  totalConversations: number
  successfulResolutions: number
  averageResponseTime: number
  userSatisfaction: number
  handoffRate: number
  topIntents: { intent: string; count: number; confidence: number }[]
}

interface ActiveConversation {
  id: string
  user: string
  channel: string
  status: 'active' | 'waiting' | 'resolved'
  lastMessage: string
  confidence: number
  intent: string
  duration: number
}

export function IntelligentBotWidget() {
  const [botEnabled, setBotEnabled] = useState(true)
  const [trainingMode, setTrainingMode] = useState(false)
  const [newIntent, setNewIntent] = useState('')
  const [newResponse, setNewResponse] = useState('')

  const metrics: BotMetrics = {
    totalConversations: 1547,
    successfulResolutions: 1205,
    averageResponseTime: 2.3,
    userSatisfaction: 87,
    handoffRate: 12,
    topIntents: [
      { intent: 'consulta_preco', count: 234, confidence: 94 },
      { intent: 'horario_funcionamento', count: 189, confidence: 98 },
      { intent: 'suporte_tecnico', count: 145, confidence: 87 },
      { intent: 'informacao_produto', count: 123, confidence: 91 },
      { intent: 'cancelamento', count: 89, confidence: 85 }
    ]
  }

  const activeConversations: ActiveConversation[] = [
    {
      id: '1',
      user: 'João Silva',
      channel: 'WhatsApp',
      status: 'active',
      lastMessage: 'Preciso saber sobre os preços dos seus planos',
      confidence: 94,
      intent: 'consulta_preco',
      duration: 120
    },
    {
      id: '2',
      user: 'Maria Santos',
      channel: 'Chat',
      status: 'waiting',
      lastMessage: 'Estou com problema no login do sistema',
      confidence: 67,
      intent: 'suporte_tecnico',
      duration: 340
    },
    {
      id: '3',
      user: 'Pedro Costa',
      channel: 'WhatsApp',
      status: 'active',
      lastMessage: 'Vocês funcionam aos sábados?',
      confidence: 98,
      intent: 'horario_funcionamento',
      duration: 45
    }
  ]

  const trainIntent = () => {
    if (!newIntent || !newResponse) return
    // Aqui seria integrada a API de treinamento do NLP
    console.log('Treinando intent:', newIntent, 'com resposta:', newResponse)
    setNewIntent('')
    setNewResponse('')
  }

  const handoffToHuman = (conversationId: string) => {
    console.log('Transferindo conversa', conversationId, 'para atendente humano')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'waiting': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getChannelColor = (channel: string) => {
    const colors = {
      'WhatsApp': 'bg-green-100 text-green-800',
      'Chat': 'bg-blue-100 text-blue-800',
      'Email': 'bg-purple-100 text-purple-800'
    }
    return colors[channel as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600'
    if (confidence >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Bot Inteligente
          <Badge variant={botEnabled ? "default" : "secondary"} className="ml-auto">
            {botEnabled ? 'Ativo' : 'Inativo'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Métricas Principais */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Taxa de Resolução</span>
              <span className="text-sm font-medium">
                {Math.round((metrics.successfulResolutions / metrics.totalConversations) * 100)}%
              </span>
            </div>
            <Progress 
              value={(metrics.successfulResolutions / metrics.totalConversations) * 100} 
              className="h-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Satisfação</span>
              <span className="text-sm font-medium">{metrics.userSatisfaction}%</span>
            </div>
            <Progress value={metrics.userSatisfaction} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tempo Resposta</span>
              <span className="text-sm font-medium">{metrics.averageResponseTime}s</span>
            </div>
            <Progress value={100 - (metrics.averageResponseTime * 10)} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Handoff Rate</span>
              <span className="text-sm font-medium">{metrics.handoffRate}%</span>
            </div>
            <Progress value={100 - metrics.handoffRate} className="h-2" />
          </div>
        </div>

        {/* Conversas Ativas */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Conversas Ativas</h4>
            <Badge variant="outline">
              {activeConversations.filter(c => c.status === 'active').length} ativas
            </Badge>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {activeConversations.map((conversation) => (
              <div key={conversation.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">{conversation.user}</span>
                    <Badge className={getChannelColor(conversation.channel)}>
                      {conversation.channel}
                    </Badge>
                    <Badge className={getStatusColor(conversation.status)}>
                      {conversation.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {formatDuration(conversation.duration)}
                  </div>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {conversation.lastMessage}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs">
                    <span>Intent: <strong>{conversation.intent}</strong></span>
                    <span className={getConfidenceColor(conversation.confidence)}>
                      Confiança: {conversation.confidence}%
                    </span>
                  </div>
                  {conversation.confidence < 70 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handoffToHuman(conversation.id)}
                    >
                      <User className="h-3 w-3 mr-1" />
                      Transferir
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Intents */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Top Intenções</h4>
          <div className="space-y-2">
            {metrics.topIntents.slice(0, 3).map((intent, index) => (
              <div key={intent.intent} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <span>{intent.intent.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">{intent.count}</span>
                  <span className={getConfidenceColor(intent.confidence)}>
                    {intent.confidence}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Treinamento */}
        {trainingMode && (
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <h4 className="font-medium text-sm">Treinamento NLP</h4>
            </div>
            
            <div className="space-y-2">
              <Input
                placeholder="Nova intenção (ex: consulta_delivery)"
                value={newIntent}
                onChange={(e) => setNewIntent(e.target.value)}
              />
              <Textarea
                placeholder="Resposta para esta intenção..."
                value={newResponse}
                onChange={(e) => setNewResponse(e.target.value)}
                rows={2}
              />
              <Button 
                onClick={trainIntent}
                disabled={!newIntent || !newResponse}
                className="w-full"
              >
                <Zap className="h-4 w-4 mr-2" />
                Treinar Intent
              </Button>
            </div>
          </div>
        )}

        {/* Controles */}
        <div className="flex gap-2 pt-4 border-t">
          <Button
            variant={botEnabled ? "destructive" : "default"}
            onClick={() => setBotEnabled(!botEnabled)}
            className="flex-1"
          >
            {botEnabled ? 'Desativar' : 'Ativar'} Bot
          </Button>
          <Button
            variant="outline"
            onClick={() => setTrainingMode(!trainingMode)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {/* Estatísticas em Tempo Real */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Performance Hoje</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-blue-600">234</div>
              <div className="text-xs text-blue-700">Conversas</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">91%</div>
              <div className="text-xs text-blue-700">Resolvidas</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">1.8s</div>
              <div className="text-xs text-blue-700">Resp. Média</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
