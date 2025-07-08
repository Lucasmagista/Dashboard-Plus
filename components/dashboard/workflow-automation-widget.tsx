"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Play, 
  Pause, 
  Settings, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Plus,
  BarChart3,
  Zap,
  Users,
  Mail,
  MessageSquare,
  Phone,
  Bot
} from 'lucide-react'
import { cn } from "@/lib/utils"

interface Workflow {
  id: string
  name: string
  description: string
  status: 'active' | 'paused' | 'draft'
  trigger: string
  actions: string[]
  executionCount: number
  successRate: number
  lastRun: string
  avgExecutionTime: number
  category: 'sales' | 'marketing' | 'support' | 'general'
  iconType: 'mail' | 'phone' | 'bot' | 'users' | 'chart'
}

const mockWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Lead Qualification',
    description: 'Automatically qualify and score new leads',
    status: 'active',
    trigger: 'New contact created',
    actions: ['Score calculation', 'Segment assignment', 'Welcome email'],
    executionCount: 1247,
    successRate: 94.2,
    lastRun: '2 min ago',
    avgExecutionTime: 3.5,
    category: 'sales',
    iconType: 'users'
  },
  {
    id: '2',
    name: 'Email Campaign Follow-up',
    description: 'Send personalized follow-ups based on email engagement',
    status: 'active',
    trigger: 'Email opened',
    actions: ['Wait 2 days', 'Send follow-up', 'Update lead score'],
    executionCount: 892,
    successRate: 87.8,
    lastRun: '15 min ago',
    avgExecutionTime: 8.2,
    category: 'marketing',
    iconType: 'mail'
  },
  {
    id: '3',
    name: 'Support Ticket Routing',
    description: 'Automatically route tickets to appropriate teams',
    status: 'active',
    trigger: 'Support ticket created',
    actions: ['Analyze content', 'Assign team', 'Set priority'],
    executionCount: 345,
    successRate: 98.1,
    lastRun: '1 hour ago',
    avgExecutionTime: 1.8,
    category: 'support',
    iconType: 'bot'
  },
  {
    id: '4',
    name: 'Sales Call Reminder',
    description: 'Remind sales team of scheduled calls',
    status: 'paused',
    trigger: 'Meeting scheduled',
    actions: ['Send SMS reminder', 'Email notification', 'Calendar update'],
    executionCount: 156,
    successRate: 92.3,
    lastRun: '3 hours ago',
    avgExecutionTime: 2.1,
    category: 'sales',
    iconType: 'phone'
  },
  {
    id: '5',
    name: 'Monthly Report Generation',
    description: 'Generate and send monthly performance reports',
    status: 'draft',
    trigger: 'First day of month',
    actions: ['Compile data', 'Generate PDF', 'Email to stakeholders'],
    executionCount: 12,
    successRate: 100,
    lastRun: '1 month ago',
    avgExecutionTime: 45.2,
    category: 'general',
    iconType: 'chart'
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500'
    case 'paused': return 'bg-yellow-500'
    case 'draft': return 'bg-gray-500'
    default: return 'bg-gray-500'
  }
}

const getCategoryIcon = (iconType: string) => {
  switch (iconType) {
    case 'mail': return Mail
    case 'phone': return Phone
    case 'bot': return Bot
    case 'users': return Users
    case 'chart': return BarChart3
    default: return Zap
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'sales': return 'text-blue-600 bg-blue-50'
    case 'marketing': return 'text-purple-600 bg-purple-50'
    case 'support': return 'text-green-600 bg-green-50'
    case 'general': return 'text-gray-600 bg-gray-50'
    default: return 'text-gray-600 bg-gray-50'
  }
}

export default function WorkflowAutomationWidget() {
  const [workflows, setWorkflows] = useState<Workflow[]>(mockWorkflows)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [stats, setStats] = useState({
    totalExecutions: 0,
    avgSuccessRate: 0,
    activeWorkflows: 0,
    timeSaved: 0
  })

  useEffect(() => {
    // Calculate stats
    const totalExecutions = workflows.reduce((sum, w) => sum + w.executionCount, 0)
    const avgSuccessRate = workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length
    const activeWorkflows = workflows.filter(w => w.status === 'active').length
    const timeSaved = workflows.reduce((sum, w) => sum + (w.executionCount * w.avgExecutionTime), 0) / 60 // in hours

    setStats({
      totalExecutions,
      avgSuccessRate,
      activeWorkflows,
      timeSaved
    })
  }, [workflows])

  const toggleWorkflowStatus = (id: string) => {
    setWorkflows(prev => prev.map(workflow => 
      workflow.id === id 
        ? { ...workflow, status: workflow.status === 'active' ? 'paused' : 'active' as any }
        : workflow
    ))
  }

  const filteredWorkflows = selectedCategory === 'all' 
    ? workflows 
    : workflows.filter(w => w.category === selectedCategory)

  const categories = [
    { value: 'all', label: 'Todos', count: workflows.length },
    { value: 'sales', label: 'Vendas', count: workflows.filter(w => w.category === 'sales').length },
    { value: 'marketing', label: 'Marketing', count: workflows.filter(w => w.category === 'marketing').length },
    { value: 'support', label: 'Suporte', count: workflows.filter(w => w.category === 'support').length },
    { value: 'general', label: 'Geral', count: workflows.filter(w => w.category === 'general').length },
  ]

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-500" />
              Automações & Workflows
            </CardTitle>
            <CardDescription>
              Gerencie e monitore seus fluxos automatizados
            </CardDescription>
          </div>
          <Button size="sm" className="gap-1">
            <Plus className="h-4 w-4" />
            Novo
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-xs text-blue-600 font-medium">Execuções</div>
            <div className="text-lg font-bold text-blue-700">
              {stats.totalExecutions.toLocaleString()}
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-xs text-green-600 font-medium">Taxa Sucesso</div>
            <div className="text-lg font-bold text-green-700">
              {stats.avgSuccessRate.toFixed(1)}%
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-xs text-purple-600 font-medium">Ativos</div>
            <div className="text-lg font-bold text-purple-700">
              {stats.activeWorkflows}
            </div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="text-xs text-orange-600 font-medium">Horas Economizadas</div>
            <div className="text-lg font-bold text-orange-700">
              {stats.timeSaved.toFixed(0)}h
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-1 mt-4 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
              className="whitespace-nowrap"
            >
              {category.label}
              <Badge variant="secondary" className="ml-1 text-xs">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 max-h-80 overflow-y-auto">
        {filteredWorkflows.map((workflow) => {
          const IconComponent = getCategoryIcon(workflow.iconType)
          
          return (
            <div 
              key={workflow.id}
              className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={cn(
                    "p-2 rounded-lg",
                    getCategoryColor(workflow.category)
                  )}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm truncate">
                        {workflow.name}
                      </h4>
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        getStatusColor(workflow.status)
                      )} />
                      <Badge variant="outline" className="text-xs">
                        {workflow.status}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {workflow.description}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {workflow.executionCount} execuções
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        {workflow.successRate}% sucesso
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {workflow.lastRun}
                      </div>
                    </div>

                    {/* Progress bar for success rate */}
                    <div className="mt-2">
                      <Progress 
                        value={workflow.successRate} 
                        className="h-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleWorkflowStatus(workflow.id)}
                    className="h-8 w-8 p-0"
                  >
                    {workflow.status === 'active' ? (
                      <Pause className="h-3 w-3" />
                    ) : (
                      <Play className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Trigger and actions preview */}
              <div className="mt-2 pt-2 border-t border-gray-100">
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Trigger:</span> {workflow.trigger}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  <span className="font-medium">Ações:</span> {workflow.actions.join(' → ')}
                </div>
              </div>
            </div>
          )
        })}

        {filteredWorkflows.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Zap className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">Nenhum workflow encontrado para esta categoria</p>
            <Button variant="outline" size="sm" className="mt-2">
              <Plus className="h-4 w-4 mr-1" />
              Criar primeiro workflow
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
