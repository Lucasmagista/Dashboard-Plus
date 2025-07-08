"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { GitBranch, Play, Pause, Edit, Trash2, Plus, Clock, CheckCircle, XCircle, AlertCircle, Zap } from 'lucide-react'

interface WorkflowStep {
  id: string
  type: 'trigger' | 'condition' | 'action' | 'delay'
  name: string
  config: Record<string, any>
  status: 'success' | 'error' | 'pending' | 'skipped'
}

interface Workflow {
  id: string
  name: string
  description: string
  isActive: boolean
  trigger: string
  channels: string[]
  steps: WorkflowStep[]
  executions: number
  successRate: number
  lastRun: string
  avgExecutionTime: number
}

interface WorkflowExecution {
  id: string
  workflowId: string
  status: 'running' | 'completed' | 'failed' | 'cancelled'
  startTime: string
  endTime?: string
  currentStep: number
  totalSteps: number
  customer: string
  channel: string
}

export function MultiChannelWorkflowWidget() {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'Onboarding Completo',
      description: 'Sequência de boas-vindas para novos clientes',
      isActive: true,
      trigger: 'novo_cliente',
      channels: ['Email', 'WhatsApp', 'SMS'],
      steps: [
        { id: '1', type: 'trigger', name: 'Cliente Cadastrado', config: {}, status: 'success' },
        { id: '2', type: 'action', name: 'Enviar Email Boas-vindas', config: {}, status: 'success' },
        { id: '3', type: 'delay', name: 'Aguardar 24h', config: {}, status: 'success' },
        { id: '4', type: 'action', name: 'Enviar WhatsApp Tutorial', config: {}, status: 'pending' },
        { id: '5', type: 'condition', name: 'Cliente Ativo?', config: {}, status: 'pending' }
      ],
      executions: 234,
      successRate: 87,
      lastRun: '2024-01-15T10:30:00Z',
      avgExecutionTime: 142
    },
    {
      id: '2',
      name: 'Recuperação de Carrinho',
      description: 'Sequência para recuperar carrinhos abandonados',
      isActive: true,
      trigger: 'carrinho_abandonado',
      channels: ['Email', 'WhatsApp'],
      steps: [
        { id: '1', type: 'trigger', name: 'Carrinho Abandonado', config: {}, status: 'success' },
        { id: '2', type: 'delay', name: 'Aguardar 1h', config: {}, status: 'success' },
        { id: '3', type: 'action', name: 'Email Lembrete', config: {}, status: 'success' },
        { id: '4', type: 'delay', name: 'Aguardar 24h', config: {}, status: 'success' },
        { id: '5', type: 'action', name: 'WhatsApp com Desconto', config: {}, status: 'error' }
      ],
      executions: 445,
      successRate: 62,
      lastRun: '2024-01-15T11:45:00Z',
      avgExecutionTime: 1440
    }
  ])

  const [activeExecutions] = useState<WorkflowExecution[]>([
    {
      id: '1',
      workflowId: '1',
      status: 'running',
      startTime: '2024-01-15T12:00:00Z',
      currentStep: 3,
      totalSteps: 5,
      customer: 'João Silva',
      channel: 'WhatsApp'
    },
    {
      id: '2',
      workflowId: '2',
      status: 'completed',
      startTime: '2024-01-15T11:30:00Z',
      endTime: '2024-01-15T12:15:00Z',
      currentStep: 5,
      totalSteps: 5,
      customer: 'Maria Santos',
      channel: 'Email'
    }
  ])

  const toggleWorkflow = (id: string) => {
    setWorkflows(prev => prev.map(workflow => 
      workflow.id === id 
        ? { ...workflow, isActive: !workflow.isActive }
        : workflow
    ))
  }

  const deleteWorkflow = (id: string) => {
    setWorkflows(prev => prev.filter(workflow => workflow.id !== id))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'skipped': return <AlertCircle className="h-4 w-4 text-gray-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getExecutionStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getChannelColor = (channel: string) => {
    const colors = {
      'WhatsApp': 'bg-green-100 text-green-800',
      'Email': 'bg-purple-100 text-purple-800',
      'SMS': 'bg-yellow-100 text-yellow-800',
      'Chat': 'bg-blue-100 text-blue-800'
    }
    return colors[channel as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}min`
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
          <GitBranch className="h-5 w-5" />
          Workflows Multi-canal
          <Badge variant="secondary" className="ml-auto">
            {workflows.filter(w => w.isActive).length} ativos
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estatísticas Gerais */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {workflows.reduce((sum, w) => sum + w.executions, 0)}
            </div>
            <div className="text-xs text-gray-600">Execuções</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length)}%
            </div>
            <div className="text-xs text-gray-600">Taxa de Sucesso</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {activeExecutions.filter(e => e.status === 'running').length}
            </div>
            <div className="text-xs text-gray-600">Em Execução</div>
          </div>
        </div>

        {/* Botão Criar Novo */}
        <Button 
          onClick={() => console.log('Criar workflow')}
          className="w-full"
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-2" />
          Criar Novo Workflow
        </Button>

        {/* Lista de Workflows */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{workflow.name}</h4>
                    <Badge variant={workflow.isActive ? "default" : "secondary"}>
                      {workflow.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">{workflow.description}</p>
                  <div className="flex gap-1">
                    {workflow.channels.map(channel => (
                      <Badge key={channel} className={getChannelColor(channel)}>
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log('Editar', workflow.id)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleWorkflow(workflow.id)}
                  >
                    {workflow.isActive ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteWorkflow(workflow.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Métricas do Workflow */}
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div className="text-center">
                  <div className="font-medium">{workflow.executions}</div>
                  <div className="text-gray-600">Execuções</div>
                </div>
                <div className="text-center">
                  <div className={`font-medium ${getSuccessRateColor(workflow.successRate)}`}>
                    {workflow.successRate}%
                  </div>
                  <div className="text-gray-600">Sucesso</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">{formatDuration(workflow.avgExecutionTime)}</div>
                  <div className="text-gray-600">Tempo Médio</div>
                </div>
              </div>

              {/* Steps Preview */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-700">Etapas:</div>
                <div className="flex gap-1 flex-wrap">
                  {workflow.steps.map((step) => (
                    <div key={step.id} className="flex items-center gap-1">
                      {getStatusIcon(step.status)}
                      <span className="text-xs">{step.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Execuções Ativas */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Execuções em Andamento</h4>
          <div className="space-y-2">
            {activeExecutions.filter(e => e.status === 'running').map((execution) => (
              <div key={execution.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{execution.customer}</span>
                    <Badge className={getChannelColor(execution.channel)}>
                      {execution.channel}
                    </Badge>
                    <Badge className={getExecutionStatusColor(execution.status)}>
                      {execution.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(execution.startTime).toLocaleTimeString('pt-BR')}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Progresso</span>
                    <span>{execution.currentStep}/{execution.totalSteps}</span>
                  </div>
                  <Progress 
                    value={(execution.currentStep / execution.totalSteps) * 100} 
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Ações Rápidas</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline" className="text-xs">
              Pausar Todos
            </Button>
            <Button size="sm" variant="outline" className="text-xs">
              Logs de Execução
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
