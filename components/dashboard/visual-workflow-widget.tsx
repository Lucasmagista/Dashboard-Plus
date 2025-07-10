"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  GitBranch, 
  Play, 
  Pause,
  Plus, 
  Edit,
  Trash2,
  Save,
  Copy,
  Zap,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  Users,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Settings,
  ArrowRight,
  ArrowDown,
  Circle,
  Diamond,
  Square
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

interface WorkflowNode {
  id: string
  type: 'trigger' | 'condition' | 'action' | 'delay'
  title: string
  description: string
  config: Record<string, any>
  position: { x: number; y: number }
  connections: string[]
}

interface Workflow {
  id: string
  name: string
  description: string
  enabled: boolean
  nodes: WorkflowNode[]
  triggers: number
  executions: number
  successRate: number
  createdAt: Date
  lastRun?: Date
}

interface WorkflowExecution {
  id: string
  workflowId: string
  status: 'running' | 'completed' | 'failed'
  startedAt: Date
  completedAt?: Date
  steps: Array<{
    nodeId: string
    status: 'pending' | 'running' | 'completed' | 'failed'
    result?: any
    error?: string
  }>
}

const TRIGGER_TYPES = [
  { 
    id: 'lead_created', 
    name: 'Novo Lead Criado', 
    icon: Users,
    description: 'Acionado quando um novo lead é adicionado ao sistema'
  },
  { 
    id: 'deal_value_changed', 
    name: 'Valor do Negócio Alterado', 
    icon: DollarSign,
    description: 'Acionado quando o valor de um negócio é modificado'
  },
  { 
    id: 'email_received', 
    name: 'Email Recebido', 
    icon: Mail,
    description: 'Acionado quando um email é recebido de um cliente'
  },
  { 
    id: 'task_overdue', 
    name: 'Tarefa Atrasada', 
    icon: Clock,
    description: 'Acionado quando uma tarefa passa do prazo'
  }
]

const ACTION_TYPES = [
  { 
    id: 'send_email', 
    name: 'Enviar Email', 
    icon: Mail,
    description: 'Envia um email personalizado'
  },
  { 
    id: 'send_sms', 
    name: 'Enviar SMS', 
    icon: MessageSquare,
    description: 'Envia uma mensagem SMS'
  },
  { 
    id: 'make_call', 
    name: 'Fazer Ligação', 
    icon: Phone,
    description: 'Agenda uma ligação automática'
  },
  { 
    id: 'create_task', 
    name: 'Criar Tarefa', 
    icon: CheckCircle,
    description: 'Cria uma nova tarefa'
  },
  { 
    id: 'update_field', 
    name: 'Atualizar Campo', 
    icon: Edit,
    description: 'Atualiza um campo do lead/negócio'
  },
  { 
    id: 'assign_user', 
    name: 'Atribuir Usuário', 
    icon: Users,
    description: 'Atribui o lead a um usuário específico'
  }
]

const CONDITION_TYPES = [
  { 
    id: 'value_comparison', 
    name: 'Comparar Valor', 
    icon: DollarSign,
    operators: ['>', '<', '=', '!=', '>=', '<=']
  },
  { 
    id: 'text_contains', 
    name: 'Texto Contém', 
    icon: MessageSquare,
    operators: ['contains', 'not_contains', 'starts_with', 'ends_with']
  },
  { 
    id: 'date_comparison', 
    name: 'Comparar Data', 
    icon: Clock,
    operators: ['before', 'after', 'between']
  },
  { 
    id: 'status_check', 
    name: 'Verificar Status', 
    icon: CheckCircle,
    operators: ['is', 'is_not', 'in', 'not_in']
  }
]

export function VisualWorkflowWidget() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [executions, setExecutions] = useState<WorkflowExecution[]>([])
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [draggedNode, setDraggedNode] = useState<WorkflowNode | null>(null)

  // Estados do editor
  const [workflowName, setWorkflowName] = useState('')
  const [workflowDescription, setWorkflowDescription] = useState('')
  const [nodes, setNodes] = useState<WorkflowNode[]>([])
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null)

  // Carregar dados salvos
  useEffect(() => {
    const savedWorkflows = localStorage.getItem('crm_workflows')
    const savedExecutions = localStorage.getItem('crm_workflow_executions')
    
    if (savedWorkflows) {
      try {
        const parsed = JSON.parse(savedWorkflows).map((w: any) => ({
          ...w,
          createdAt: new Date(w.createdAt),
          lastRun: w.lastRun ? new Date(w.lastRun) : undefined
        }))
        setWorkflows(parsed)
      } catch (error) {
        console.error('Erro ao carregar workflows:', error)
      }
    }

    if (savedExecutions) {
      try {
        const parsed = JSON.parse(savedExecutions).map((e: any) => ({
          ...e,
          startedAt: new Date(e.startedAt),
          completedAt: e.completedAt ? new Date(e.completedAt) : undefined
        }))
        setExecutions(parsed)
      } catch (error) {
        console.error('Erro ao carregar execuções:', error)
      }
    }
  }, [])

  // Salvar dados
  const saveWorkflows = useCallback((newWorkflows: Workflow[]) => {
    localStorage.setItem('crm_workflows', JSON.stringify(newWorkflows))
    setWorkflows(newWorkflows)
  }, [])

  const saveExecutions = useCallback((newExecutions: WorkflowExecution[]) => {
    localStorage.setItem('crm_workflow_executions', JSON.stringify(newExecutions))
    setExecutions(newExecutions)
  }, [])

  // Criar novo nó
  const createNode = (type: WorkflowNode['type'], nodeType: string) => {
    const newNode: WorkflowNode = {
      id: `node_${Date.now()}`,
      type,
      title: getNodeTitle(type, nodeType),
      description: getNodeDescription(type, nodeType),
      config: { type: nodeType },
      position: { x: 100 + nodes.length * 200, y: 100 },
      connections: []
    }

    setNodes([...nodes, newNode])
  }

  const getNodeTitle = (type: WorkflowNode['type'], nodeType: string) => {
    switch (type) {
      case 'trigger':
        return TRIGGER_TYPES.find(t => t.id === nodeType)?.name || 'Trigger'
      case 'action':
        return ACTION_TYPES.find(a => a.id === nodeType)?.name || 'Ação'
      case 'condition':
        return CONDITION_TYPES.find(c => c.id === nodeType)?.name || 'Condição'
      case 'delay':
        return 'Aguardar'
      default:
        return 'Nó'
    }
  }

  const getNodeDescription = (type: WorkflowNode['type'], nodeType: string) => {
    switch (type) {
      case 'trigger':
        return TRIGGER_TYPES.find(t => t.id === nodeType)?.description || ''
      case 'action':
        return ACTION_TYPES.find(a => a.id === nodeType)?.description || ''
      case 'condition':
        return 'Verifica uma condição específica'
      case 'delay':
        return 'Adiciona um atraso antes da próxima ação'
      default:
        return ''
    }
  }

  // Conectar nós
  const connectNodes = (fromId: string, toId: string) => {
    setNodes(nodes.map(node => {
      if (node.id === fromId) {
        return {
          ...node,
          connections: [...node.connections.filter(c => c !== toId), toId]
        }
      }
      return node
    }))
  }

  // Remover nó
  const removeNode = (nodeId: string) => {
    setNodes(nodes.filter(n => n.id !== nodeId))
    // Remover conexões para este nó
    setNodes(prev => prev.map(node => ({
      ...node,
      connections: node.connections.filter(c => c !== nodeId)
    })))
  }

  // Salvar workflow
  const saveWorkflow = () => {
    if (!workflowName.trim() || nodes.length === 0) return

    const workflow: Workflow = {
      id: editingWorkflow?.id || `workflow_${Date.now()}`,
      name: workflowName.trim(),
      description: workflowDescription.trim(),
      enabled: true,
      nodes: [...nodes],
      triggers: nodes.filter(n => n.type === 'trigger').length,
      executions: editingWorkflow?.executions || 0,
      successRate: editingWorkflow?.successRate || 0,
      createdAt: editingWorkflow?.createdAt || new Date()
    }

    let updatedWorkflows
    if (editingWorkflow) {
      updatedWorkflows = workflows.map(w => w.id === editingWorkflow.id ? workflow : w)
    } else {
      updatedWorkflows = [...workflows, workflow]
    }

    saveWorkflows(updatedWorkflows)
    resetEditor()
  }

  // Resetar editor
  const resetEditor = () => {
    setWorkflowName('')
    setWorkflowDescription('')
    setNodes([])
    setSelectedNode(null)
    setEditingWorkflow(null)
    setShowEditor(false)
  }

  // Editar workflow
  const editWorkflow = (workflow: Workflow) => {
    setWorkflowName(workflow.name)
    setWorkflowDescription(workflow.description)
    setNodes([...workflow.nodes])
    setEditingWorkflow(workflow)
    setShowEditor(true)
  }

  // Toggle workflow
  const toggleWorkflow = (workflowId: string) => {
    const updatedWorkflows = workflows.map(w => 
      w.id === workflowId ? { ...w, enabled: !w.enabled } : w
    )
    saveWorkflows(updatedWorkflows)
  }

  // Executar workflow
  const runWorkflow = (workflow: Workflow) => {
    const execution: WorkflowExecution = {
      id: `exec_${Date.now()}`,
      workflowId: workflow.id,
      status: 'running',
      startedAt: new Date(),
      steps: workflow.nodes.map(node => ({
        nodeId: node.id,
        status: 'pending'
      }))
    }

    const newExecutions = [execution, ...executions]
    saveExecutions(newExecutions)

    // Simular execução
    let currentStep = 0
    const executeStep = () => {
      if (currentStep < execution.steps.length) {
        const updatedExecution = {
          ...execution,
          steps: execution.steps.map((step, index) => {
            if (index === currentStep) {
              return { ...step, status: 'completed' as const }
            }
            if (index === currentStep + 1) {
              return { ...step, status: 'running' as const }
            }
            return step
          })
        }

        const finalExecutions = newExecutions.map(e => 
          e.id === execution.id ? updatedExecution : e
        )
        saveExecutions(finalExecutions)

        currentStep++
        setTimeout(executeStep, 2000)
      } else {
        // Finalizar execução
        const completedExecution = {
          ...execution,
          status: 'completed' as const,
          completedAt: new Date(),
          steps: execution.steps.map(step => ({ ...step, status: 'completed' as const }))
        }

        const finalExecutions = newExecutions.map(e => 
          e.id === execution.id ? completedExecution : e
        )
        saveExecutions(finalExecutions)

        // Atualizar estatísticas do workflow
        const updatedWorkflows = workflows.map(w => {
          if (w.id === workflow.id) {
            return {
              ...w,
              executions: w.executions + 1,
              lastRun: new Date(),
              successRate: Math.round(((w.successRate * w.executions) + 100) / (w.executions + 1))
            }
          }
          return w
        })
        saveWorkflows(updatedWorkflows)
      }
    }

    setTimeout(executeStep, 1000)
  }

  // Duplicar workflow
  const duplicateWorkflow = (workflow: Workflow) => {
    const duplicated: Workflow = {
      ...workflow,
      id: `workflow_${Date.now()}`,
      name: `${workflow.name} (Cópia)`,
      enabled: false,
      executions: 0,
      successRate: 0,
      createdAt: new Date(),
      lastRun: undefined,
      nodes: workflow.nodes.map(node => ({
        ...node,
        id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }))
    }

    saveWorkflows([...workflows, duplicated])
  }

  // Renderizar ícone do nó
  const renderNodeIcon = (node: WorkflowNode) => {
    const iconClass = "h-5 w-5"
    
    switch (node.type) {
      case 'trigger':
        const trigger = TRIGGER_TYPES.find(t => t.id === node.config.type)
        if (trigger) {
          const TriggerIcon = trigger.icon
          return <TriggerIcon className={iconClass} />
        }
        return <Zap className={iconClass} />
      case 'action':
        const action = ACTION_TYPES.find(a => a.id === node.config.type)
        if (action) {
          const ActionIcon = action.icon
          return <ActionIcon className={iconClass} />
        }
        return <Play className={iconClass} />
      case 'condition':
        return <Diamond className={iconClass} />
      case 'delay':
        return <Clock className={iconClass} />
      default:
        return <Circle className={iconClass} />
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          Workflows Visuais
        </CardTitle>
        <CardDescription>
          Crie automações visuais sem código com triggers, condições e ações
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="workflows" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="executions">Execuções</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="workflows" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Workflows Ativos</h3>
                <p className="text-sm text-muted-foreground">
                  {workflows.filter(w => w.enabled).length} de {workflows.length} workflows ativos
                </p>
              </div>
              <Button onClick={() => setShowEditor(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Workflow
              </Button>
            </div>

            {workflows.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <GitBranch className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum workflow criado ainda</p>
                <p className="text-sm">Crie seu primeiro workflow automatizado</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {workflows.map((workflow) => (
                  <div key={workflow.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{workflow.name}</h4>
                          <Badge variant={workflow.enabled ? "default" : "secondary"}>
                            {workflow.enabled ? 'Ativo' : 'Inativo'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {workflow.triggers} trigger{workflow.triggers !== 1 ? 's' : ''}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {workflow.nodes.length} nós
                          </Badge>
                        </div>
                        
                        {workflow.description && (
                          <p className="text-sm text-muted-foreground mb-3">
                            {workflow.description}
                          </p>
                        )}

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Execuções:</span>
                            <div className="font-medium">{workflow.executions}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Taxa de Sucesso:</span>
                            <div className="font-medium text-green-600">{workflow.successRate}%</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Última Execução:</span>
                            <div className="font-medium">
                              {workflow.lastRun ? workflow.lastRun.toLocaleDateString() : 'Nunca'}
                            </div>
                          </div>
                        </div>

                        {/* Preview dos nós */}
                        <div className="flex items-center gap-2 mt-3">
                          {workflow.nodes.slice(0, 5).map((node, index) => (
                            <div key={node.id} className="flex items-center gap-1">
                              {index > 0 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
                              <div className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs">
                                {renderNodeIcon(node)}
                                <span className="hidden sm:inline">{node.title}</span>
                              </div>
                            </div>
                          ))}
                          {workflow.nodes.length > 5 && (
                            <span className="text-xs text-muted-foreground">+{workflow.nodes.length - 5} mais</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => runWorkflow(workflow)}
                          disabled={!workflow.enabled}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editWorkflow(workflow)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => duplicateWorkflow(workflow)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Switch
                          checked={workflow.enabled}
                          onCheckedChange={() => toggleWorkflow(workflow.id)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const updatedWorkflows = workflows.filter(w => w.id !== workflow.id)
                            saveWorkflows(updatedWorkflows)
                          }}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="executions" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Execuções Recentes</h3>
              
              {executions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma execução registrada</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {executions.slice(0, 10).map((execution) => {
                    const workflow = workflows.find(w => w.id === execution.workflowId)
                    return (
                      <div key={execution.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{workflow?.name || 'Workflow Removido'}</span>
                            {execution.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                            {execution.status === 'failed' && <AlertCircle className="h-4 w-4 text-red-500" />}
                            {execution.status === 'running' && (
                              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {execution.startedAt.toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-muted-foreground">Status:</span>
                            <div className="capitalize">{execution.status}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Duração:</span>
                            <div>
                              {execution.completedAt 
                                ? `${Math.round((execution.completedAt.getTime() - execution.startedAt.getTime()) / 1000)}s`
                                : 'Em execução'
                              }
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Passos:</span>
                            <div>{execution.steps.length}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Sucessos:</span>
                            <div>{execution.steps.filter(s => s.status === 'completed').length}</div>
                          </div>
                        </div>

                        {/* Progress dos passos */}
                        <div className="flex items-center gap-1">
                          {execution.steps.map((step, index) => (
                            <div key={step.nodeId} className="flex items-center gap-1">
                              {index > 0 && <ArrowRight className="h-2 w-2 text-muted-foreground" />}
                              <div 
                                className={`w-3 h-3 rounded-full ${
                                  step.status === 'completed' ? 'bg-green-500' :
                                  step.status === 'running' ? 'bg-blue-500 animate-pulse' :
                                  step.status === 'failed' ? 'bg-red-500' :
                                  'bg-gray-300'
                                }`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Templates de workflow em desenvolvimento</p>
              <p className="text-sm">Em breve você terá templates pré-configurados</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Editor de Workflow */}
        {showEditor && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-background rounded-lg border max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">
                    {editingWorkflow ? 'Editar Workflow' : 'Novo Workflow'}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={resetEditor}>
                      Cancelar
                    </Button>
                    <Button 
                      onClick={saveWorkflow}
                      disabled={!workflowName.trim() || nodes.length === 0}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 overflow-hidden">
                {/* Painel lateral */}
                <div className="w-80 border-r p-4 overflow-y-auto">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="workflow-name">Nome do Workflow</Label>
                      <Input
                        id="workflow-name"
                        placeholder="Ex: Boas-vindas para novos leads"
                        value={workflowName}
                        onChange={(e) => setWorkflowName(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="workflow-description">Descrição</Label>
                      <Textarea
                        id="workflow-description"
                        placeholder="Descreva o propósito deste workflow"
                        value={workflowDescription}
                        onChange={(e) => setWorkflowDescription(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-2 block">Triggers</Label>
                      <div className="space-y-2">
                        {TRIGGER_TYPES.map((trigger) => {
                          const TriggerIcon = trigger.icon
                          return (
                            <Button
                              key={trigger.id}
                              variant="outline"
                              size="sm"
                              className="w-full justify-start"
                              onClick={() => createNode('trigger', trigger.id)}
                            >
                              <TriggerIcon className="h-4 w-4 mr-2" />
                              {trigger.name}
                            </Button>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-2 block">Ações</Label>
                      <div className="space-y-2">
                        {ACTION_TYPES.slice(0, 4).map((action) => {
                          const ActionIcon = action.icon
                          return (
                            <Button
                              key={action.id}
                              variant="outline"
                              size="sm"
                              className="w-full justify-start"
                              onClick={() => createNode('action', action.id)}
                            >
                              <ActionIcon className="h-4 w-4 mr-2" />
                              {action.name}
                            </Button>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-2 block">Controle</Label>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => createNode('condition', 'value_comparison')}
                        >
                          <Diamond className="h-4 w-4 mr-2" />
                          Condição
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => createNode('delay', 'wait')}
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          Aguardar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Canvas */}
                <div className="flex-1 p-4 overflow-auto bg-muted">
                  <div className="relative min-h-full">
                    {nodes.length === 0 ? (
                      <div className="text-center py-16 text-muted-foreground">
                        <GitBranch className="h-16 w-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg">Canvas do Workflow</p>
                        <p className="text-sm">Adicione triggers e ações do painel lateral</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {nodes.map((node, index) => (
                          <div key={node.id} className="flex items-center gap-4">
                            {index > 0 && <ArrowDown className="h-6 w-6 text-muted-foreground mx-auto" />}
                            <div 
                              className={`p-4 border rounded-lg bg-card cursor-pointer transition-all ${
                                selectedNode?.id === node.id ? 'ring-2 ring-primary' : ''
                              }`}
                              onClick={() => setSelectedNode(node)}
                            >
                              <div className="flex items-center gap-3">
                                {renderNodeIcon(node)}
                                <div className="flex-1">
                                  <h4 className="font-medium">{node.title}</h4>
                                  <p className="text-sm text-muted-foreground">{node.description}</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    removeNode(node.id)
                                  }}
                                  className="text-muted-foreground hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
