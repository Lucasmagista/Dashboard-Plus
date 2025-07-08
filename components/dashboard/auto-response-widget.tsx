"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bot, Clock, MessageCircle, Zap, Plus, Edit, Trash2, Play, Pause } from 'lucide-react'

interface AutoResponse {
  id: string
  trigger: string
  response: string
  channel: string
  isActive: boolean
  priority: number
  conditions: string[]
  responseTime: number
  usageCount: number
  successRate: number
}

export function AutoResponseWidget() {
  const [responses, setResponses] = useState<AutoResponse[]>([
    {
      id: '1',
      trigger: 'horário de funcionamento',
      response: 'Nosso horário de atendimento é de segunda a sexta, das 8h às 18h, e sábados das 8h às 12h.',
      channel: 'WhatsApp',
      isActive: true,
      priority: 1,
      conditions: ['business_hours'],
      responseTime: 2,
      usageCount: 245,
      successRate: 89
    },
    {
      id: '2',
      trigger: 'preço|valor|quanto custa',
      response: 'Temos várias opções de planos. Gostaria de receber nossa tabela de preços completa? Posso enviar no WhatsApp ou email.',
      channel: 'Chat',
      isActive: true,
      priority: 2,
      conditions: ['lead_qualified'],
      responseTime: 1,
      usageCount: 189,
      successRate: 76
    },
    {
      id: '3',
      trigger: 'cancelar|cancelamento',
      response: 'Lamento que queira cancelar. Posso te ajudar com alguma dúvida? Se realmente deseja cancelar, vou te transferir para um especialista.',
      channel: 'Email',
      isActive: true,
      priority: 3,
      conditions: ['existing_customer'],
      responseTime: 5,
      usageCount: 67,
      successRate: 45
    },
    {
      id: '4',
      trigger: 'suporte técnico|problema|erro',
      response: 'Entendo que está com dificuldades técnicas. Vou conectar você com nossa equipe de suporte especializada. Aguarde um momento.',
      channel: 'WhatsApp',
      isActive: false,
      priority: 1,
      conditions: ['customer_verified'],
      responseTime: 3,
      usageCount: 134,
      successRate: 92
    }
  ])

  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newResponse, setNewResponse] = useState({
    trigger: '',
    response: '',
    channel: 'WhatsApp',
    priority: 1,
    conditions: [] as string[]
  })

  const channels = ['WhatsApp', 'Chat', 'Email', 'SMS']

  const toggleResponse = (id: string) => {
    setResponses(prev => prev.map(response => 
      response.id === id 
        ? { ...response, isActive: !response.isActive }
        : response
    ))
  }

  const deleteResponse = (id: string) => {
    setResponses(prev => prev.filter(response => response.id !== id))
  }

  const saveResponse = () => {
    if (!newResponse.trigger || !newResponse.response) return

    const response: AutoResponse = {
      id: editingId || Date.now().toString(),
      ...newResponse,
      isActive: true,
      responseTime: Math.floor(Math.random() * 5) + 1,
      usageCount: 0,
      successRate: 0
    }

    if (editingId) {
      setResponses(prev => prev.map(r => r.id === editingId ? response : r))
    } else {
      setResponses(prev => [...prev, response])
    }

    setNewResponse({
      trigger: '',
      response: '',
      channel: 'WhatsApp',
      priority: 1,
      conditions: []
    })
    setIsCreating(false)
    setEditingId(null)
  }

  const startEdit = (response: AutoResponse) => {
    setNewResponse({
      trigger: response.trigger,
      response: response.response,
      channel: response.channel,
      priority: response.priority,
      conditions: response.conditions
    })
    setEditingId(response.id)
    setIsCreating(true)
  }

  const getChannelColor = (channel: string) => {
    const colors = {
      'WhatsApp': 'bg-green-100 text-green-800',
      'Chat': 'bg-blue-100 text-blue-800',
      'Email': 'bg-purple-100 text-purple-800',
      'SMS': 'bg-yellow-100 text-yellow-800'
    }
    return colors[channel as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600'
    if (rate >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Respostas Automáticas
          <Badge variant="secondary" className="ml-auto">
            {responses.filter(r => r.isActive).length} ativas
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {responses.reduce((sum, r) => sum + r.usageCount, 0)}
            </div>
            <div className="text-xs text-gray-600">Total de usos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(responses.reduce((sum, r) => sum + r.successRate, 0) / responses.length)}%
            </div>
            <div className="text-xs text-gray-600">Taxa de sucesso</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(responses.reduce((sum, r) => sum + r.responseTime, 0) / responses.length)}s
            </div>
            <div className="text-xs text-gray-600">Tempo médio</div>
          </div>
        </div>

        {/* Botão Criar */}
        {!isCreating && (
          <Button 
            onClick={() => setIsCreating(true)}
            className="w-full"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Resposta Automática
          </Button>
        )}

        {/* Formulário Criar/Editar */}
        {isCreating && (
          <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
            <div className="space-y-2">
              <label htmlFor="trigger-input" className="text-sm font-medium">Palavras-chave (regex suportado)</label>
              <Input
                id="trigger-input"
                placeholder="ex: horário|funcionamento|quando abrem"
                value={newResponse.trigger}
                onChange={(e) => setNewResponse(prev => ({ ...prev, trigger: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="response-textarea" className="text-sm font-medium">Resposta</label>
              <Textarea
                id="response-textarea"
                placeholder="Digite a resposta automática..."
                value={newResponse.response}
                onChange={(e) => setNewResponse(prev => ({ ...prev, response: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="channel-select" className="text-sm font-medium">Canal</label>
                <Select 
                  value={newResponse.channel} 
                  onValueChange={(value) => setNewResponse(prev => ({ ...prev, channel: value }))}
                >
                  <SelectTrigger id="channel-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {channels.map(channel => (
                      <SelectItem key={channel} value={channel}>
                        {channel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="priority-select" className="text-sm font-medium">Prioridade</label>
                <Select 
                  value={newResponse.priority.toString()} 
                  onValueChange={(value) => setNewResponse(prev => ({ ...prev, priority: parseInt(value) }))}
                >
                  <SelectTrigger id="priority-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Alta (1)</SelectItem>
                    <SelectItem value="2">Média (2)</SelectItem>
                    <SelectItem value="3">Baixa (3)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={saveResponse} disabled={!newResponse.trigger || !newResponse.response}>
                {editingId ? 'Atualizar' : 'Criar'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreating(false)
                  setEditingId(null)
                  setNewResponse({
                    trigger: '',
                    response: '',
                    channel: 'WhatsApp',
                    priority: 1,
                    conditions: []
                  })
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Lista de Respostas */}
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {responses.map((response) => (
            <div key={response.id} className="border rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge className={getChannelColor(response.channel)}>
                    {response.channel}
                  </Badge>
                  <Badge variant="outline">
                    Prioridade {response.priority}
                  </Badge>
                  {response.isActive ? (
                    <Badge className="bg-green-100 text-green-800">
                      <Play className="h-3 w-3 mr-1" />
                      Ativa
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <Pause className="h-3 w-3 mr-1" />
                      Pausada
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEdit(response)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleResponse(response.id)}
                  >
                    {response.isActive ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteResponse(response.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium">Trigger: </span>
                  <code className="text-xs bg-gray-100 px-1 rounded">{response.trigger}</code>
                </div>
                <p className="text-sm text-gray-600">{response.response}</p>
              </div>

              <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {response.usageCount} usos
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {response.responseTime}s
                  </span>
                </div>
                <span className={`flex items-center gap-1 ${getSuccessRateColor(response.successRate)}`}>
                  <Zap className="h-3 w-3" />
                  {response.successRate}% sucesso
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
