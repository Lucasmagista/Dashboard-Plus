"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { 
  Bell, 
  Settings,
  Mail,
  MessageSquare,
  Phone,
  Smartphone,
  Globe,
  Priority,
  Clock,
  Users,
  Filter,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  Zap,
  Target,
  Archive,
  Reply,
  Forward,
  MoreHorizontal
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, isToday, isYesterday, differenceInMinutes } from "date-fns"
import { ptBR } from "date-fns/locale"

type NotificationPriority = 'low' | 'medium' | 'high' | 'critical'
type NotificationChannel = 'in_app' | 'email' | 'sms' | 'push' | 'slack' | 'teams'
type NotificationCategory = 'lead' | 'deal' | 'task' | 'system' | 'marketing' | 'support'

interface SmartNotification {
  id: string
  title: string
  message: string
  category: NotificationCategory
  priority: NotificationPriority
  channels: NotificationChannel[]
  recipients: string[]
  createdAt: Date
  readAt?: Date
  actionTaken?: string
  metadata: Record<string, any>
  groupId?: string
  relatedId?: string
  canReply?: boolean
  actions?: NotificationAction[]
}

interface NotificationAction {
  id: string
  label: string
  type: 'primary' | 'secondary' | 'danger'
  action: string
  params?: Record<string, any>
}

interface NotificationRule {
  id: string
  name: string
  description: string
  enabled: boolean
  triggers: {
    events: string[]
    conditions: Array<{
      field: string
      operator: string
      value: any
    }>
  }
  channels: NotificationChannel[]
  priority: NotificationPriority
  template: {
    title: string
    message: string
  }
  recipients: {
    type: 'all' | 'role' | 'specific' | 'dynamic'
    values: string[]
  }
  frequency: {
    type: 'immediate' | 'digest' | 'scheduled'
    interval?: number
    time?: string
  }
  createdAt: Date
}

interface NotificationGroup {
  id: string
  title: string
  notifications: SmartNotification[]
  priority: NotificationPriority
  createdAt: Date
  summary: string
}

const NOTIFICATION_CHANNELS = [
  { id: 'in_app', name: 'No App', icon: Bell, description: 'Notificações dentro da plataforma' },
  { id: 'email', name: 'Email', icon: Mail, description: 'Envio por email' },
  { id: 'sms', name: 'SMS', icon: MessageSquare, description: 'Mensagem de texto' },
  { id: 'push', name: 'Push', icon: Smartphone, description: 'Notificações push no dispositivo' },
  { id: 'slack', name: 'Slack', icon: MessageSquare, description: 'Integração com Slack' },
  { id: 'teams', name: 'Teams', icon: MessageSquare, description: 'Microsoft Teams' }
]

const NOTIFICATION_CATEGORIES = [
  { id: 'lead', name: 'Leads', icon: Users, color: 'bg-blue-500' },
  { id: 'deal', name: 'Negócios', icon: Target, color: 'bg-green-500' },
  { id: 'task', name: 'Tarefas', icon: CheckCircle, color: 'bg-orange-500' },
  { id: 'system', name: 'Sistema', icon: Settings, color: 'bg-gray-500' },
  { id: 'marketing', name: 'Marketing', icon: Globe, color: 'bg-purple-500' },
  { id: 'support', name: 'Suporte', icon: MessageSquare, color: 'bg-red-500' }
]

const PRIORITY_LEVELS = [
  { id: 'low', name: 'Baixa', color: 'text-gray-500', bgColor: 'bg-gray-100' },
  { id: 'medium', name: 'Média', color: 'text-blue-500', bgColor: 'bg-blue-100' },
  { id: 'high', name: 'Alta', color: 'text-orange-500', bgColor: 'bg-orange-100' },
  { id: 'critical', name: 'Crítica', color: 'text-red-500', bgColor: 'bg-red-100' }
]

export function SmartNotificationsWidget() {
  const [notifications, setNotifications] = useState<SmartNotification[]>([])
  const [groups, setGroups] = useState<NotificationGroup[]>([])
  const [rules, setRules] = useState<NotificationRule[]>([])
  const [selectedNotification, setSelectedNotification] = useState<SmartNotification | null>(null)
  const [showRuleEditor, setShowRuleEditor] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)

  // Estados do editor de regras
  const [ruleName, setRuleName] = useState('')
  const [ruleDescription, setRuleDescription] = useState('')
  const [ruleChannels, setRuleChannels] = useState<NotificationChannel[]>(['in_app'])
  const [rulePriority, setRulePriority] = useState<NotificationPriority>('medium')
  const [ruleTemplate, setRuleTemplate] = useState({ title: '', message: '' })

  // Carregar dados mockados
  useEffect(() => {
    const mockNotifications: SmartNotification[] = [
      {
        id: '1',
        title: 'Novo lead de alto valor',
        message: 'Lead João Silva com interesse em plano premium (R$ 15.000)',
        category: 'lead',
        priority: 'high',
        channels: ['in_app', 'email'],
        recipients: ['vendas@empresa.com'],
        createdAt: new Date(Date.now() - 5 * 60 * 1000),
        metadata: { leadId: 'lead_123', value: 15000 },
        canReply: true,
        actions: [
          { id: 'call', label: 'Ligar', type: 'primary', action: 'make_call' },
          { id: 'email', label: 'Enviar Email', type: 'secondary', action: 'send_email' }
        ]
      },
      {
        id: '2',
        title: 'Tarefa atrasada',
        message: 'Follow-up com cliente ABC venceu há 2 dias',
        category: 'task',
        priority: 'medium',
        channels: ['in_app'],
        recipients: ['usuario@empresa.com'],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        readAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        metadata: { taskId: 'task_456', daysOverdue: 2 }
      },
      {
        id: '3',
        title: 'Negócio em risco',
        message: 'Proposta para XYZ Corp sem movimento há 7 dias',
        category: 'deal',
        priority: 'critical',
        channels: ['in_app', 'email', 'sms'],
        recipients: ['vendas@empresa.com', 'gerencia@empresa.com'],
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        metadata: { dealId: 'deal_789', riskScore: 85 },
        actions: [
          { id: 'contact', label: 'Entrar em Contato', type: 'primary', action: 'contact_client' },
          { id: 'update', label: 'Atualizar Status', type: 'secondary', action: 'update_deal' }
        ]
      }
    ]

    setNotifications(mockNotifications)

    // Agrupar notificações similares
    const grouped = groupSimilarNotifications(mockNotifications)
    setGroups(grouped)
  }, [])

  // Agrupar notificações similares
  const groupSimilarNotifications = (notifications: SmartNotification[]): NotificationGroup[] => {
    const groups: Record<string, SmartNotification[]> = {}
    
    notifications.forEach(notification => {
      const key = `${notification.category}_${notification.priority}`
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(notification)
    })

    return Object.entries(groups)
      .filter(([, notifications]) => notifications.length > 1)
      .map(([key, notifications]) => ({
        id: key,
        title: `${notifications.length} notificações de ${notifications[0].category}`,
        notifications,
        priority: notifications[0].priority,
        createdAt: notifications[0].createdAt,
        summary: `Várias notificações de ${notifications[0].category} com prioridade ${notifications[0].priority}`
      }))
  }

  // Filtrar notificações
  const filteredNotifications = notifications.filter(notification => {
    if (showUnreadOnly && notification.readAt) return false
    if (filterCategory !== 'all' && notification.category !== filterCategory) return false
    if (filterPriority !== 'all' && notification.priority !== filterPriority) return false
    return true
  })

  // Marcar como lida
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId && !n.readAt 
        ? { ...n, readAt: new Date() }
        : n
    ))
  }

  // Marcar todas como lidas
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => 
      !n.readAt ? { ...n, readAt: new Date() } : n
    ))
  }

  // Arquivar notificação
  const archiveNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
  }

  // Executar ação da notificação
  const executeAction = (notification: SmartNotification, action: NotificationAction) => {
    // Simular execução da ação
    console.log(`Executando ação ${action.action} para notificação ${notification.id}`)
    
    // Marcar como lida e com ação tomada
    setNotifications(prev => prev.map(n => 
      n.id === notification.id 
        ? { ...n, readAt: new Date(), actionTaken: action.label }
        : n
    ))
  }

  // Obter ícone da categoria
  const getCategoryIcon = (category: NotificationCategory) => {
    const categoryConfig = NOTIFICATION_CATEGORIES.find(c => c.id === category)
    if (categoryConfig) {
      const Icon = categoryConfig.icon
      return <Icon className="h-4 w-4" />
    }
    return <Bell className="h-4 w-4" />
  }

  // Obter cor da prioridade
  const getPriorityColor = (priority: NotificationPriority) => {
    return PRIORITY_LEVELS.find(p => p.id === priority)?.color || 'text-gray-500'
  }

  // Formatar tempo relativo
  const formatRelativeTime = (date: Date) => {
    const minutes = differenceInMinutes(new Date(), date)
    
    if (minutes < 1) return 'Agora mesmo'
    if (minutes < 60) return `${minutes}m atrás`
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h atrás`
    if (isToday(date)) return format(date, 'HH:mm')
    if (isYesterday(date)) return 'Ontem'
    return format(date, 'dd/MM', { locale: ptBR })
  }

  // Salvar regra
  const saveRule = () => {
    if (!ruleName.trim()) return

    const newRule: NotificationRule = {
      id: `rule_${Date.now()}`,
      name: ruleName.trim(),
      description: ruleDescription.trim(),
      enabled: true,
      triggers: {
        events: ['lead_created'],
        conditions: []
      },
      channels: [...ruleChannels],
      priority: rulePriority,
      template: { ...ruleTemplate },
      recipients: {
        type: 'all',
        values: []
      },
      frequency: {
        type: 'immediate'
      },
      createdAt: new Date()
    }

    setRules([...rules, newRule])
    resetRuleEditor()
  }

  const resetRuleEditor = () => {
    setRuleName('')
    setRuleDescription('')
    setRuleChannels(['in_app'])
    setRulePriority('medium')
    setRuleTemplate({ title: '', message: '' })
    setShowRuleEditor(false)
  }

  const unreadCount = notifications.filter(n => !n.readAt).length

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações Inteligentes
              {unreadCount > 0 && (
                <Badge variant="destructive" className="rounded-full px-2 py-1 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Sistema inteligente de notificações multi-canal com agrupamento e priorização
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowRuleEditor(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Configurar
            </Button>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Marcar Todas
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="groups">Agrupadas</TabsTrigger>
            <TabsTrigger value="rules">Regras</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4">
            {/* Filtros */}
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Filtros:</span>
              </div>
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {NOTIFICATION_CATEGORIES.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {PRIORITY_LEVELS.map(priority => (
                    <SelectItem key={priority.id} value={priority.id}>
                      {priority.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Switch
                  id="unread-only"
                  checked={showUnreadOnly}
                  onCheckedChange={setShowUnreadOnly}
                />
                <Label htmlFor="unread-only" className="text-sm">Apenas não lidas</Label>
              </div>
            </div>

            {/* Lista de notificações */}
            <div className="space-y-2">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma notificação encontrada</p>
                  <p className="text-sm">Ajuste os filtros para ver mais notificações</p>
                </div>
              ) : (
                filteredNotifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      !notification.readAt 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-background hover:bg-muted/50'
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Ícone da categoria */}
                      <div className={`p-2 rounded-full ${
                        NOTIFICATION_CATEGORIES.find(c => c.id === notification.category)?.color || 'bg-gray-500'
                      }`}>
                        {getCategoryIcon(notification.category)}
                      </div>

                      {/* Conteúdo */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getPriorityColor(notification.priority)}`}
                          >
                            {PRIORITY_LEVELS.find(p => p.id === notification.priority)?.name}
                          </Badge>
                          {!notification.readAt && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{formatRelativeTime(notification.createdAt)}</span>
                            <div className="flex items-center gap-1">
                              {notification.channels.map(channel => {
                                const channelConfig = NOTIFICATION_CHANNELS.find(c => c.id === channel)
                                if (channelConfig) {
                                  const ChannelIcon = channelConfig.icon
                                  return <ChannelIcon key={channel} className="h-3 w-3" />
                                }
                                return null
                              })}
                            </div>
                            {notification.actionTaken && (
                              <Badge variant="secondary" className="text-xs">
                                {notification.actionTaken}
                              </Badge>
                            )}
                          </div>

                          {/* Ações */}
                          {notification.actions && notification.actions.length > 0 && (
                            <div className="flex items-center gap-1">
                              {notification.actions.slice(0, 2).map(action => (
                                <Button
                                  key={action.id}
                                  variant={action.type === 'primary' ? 'default' : 'outline'}
                                  size="sm"
                                  className="text-xs px-2 py-1"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    executeAction(notification, action)
                                  }}
                                >
                                  {action.label}
                                </Button>
                              ))}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-1"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  archiveNotification(notification.id)
                                }}
                              >
                                <Archive className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="groups" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Notificações Agrupadas</h3>
              
              {groups.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum grupo formado</p>
                  <p className="text-sm">Grupos são criados automaticamente quando há notificações similares</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {groups.map(group => (
                    <div key={group.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{group.title}</h4>
                        <Badge variant="outline">
                          {group.notifications.length} notificações
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {group.summary}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(group.createdAt)}
                        </span>
                        <Button variant="outline" size="sm">
                          Ver Todas
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="rules" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Regras de Notificação</h3>
                <p className="text-sm text-muted-foreground">
                  Configure quando e como receber notificações
                </p>
              </div>
              <Button onClick={() => setShowRuleEditor(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Regra
              </Button>
            </div>

            {rules.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma regra configurada</p>
                <p className="text-sm">Crie regras para personalizar suas notificações</p>
              </div>
            ) : (
              <div className="space-y-3">
                {rules.map(rule => (
                  <div key={rule.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{rule.name}</h4>
                          <Badge variant={rule.enabled ? "default" : "secondary"}>
                            {rule.enabled ? 'Ativa' : 'Inativa'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {PRIORITY_LEVELS.find(p => p.id === rule.priority)?.name}
                          </Badge>
                        </div>
                        {rule.description && (
                          <p className="text-sm text-muted-foreground mb-3">
                            {rule.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            {rule.channels.map(channel => {
                              const channelConfig = NOTIFICATION_CHANNELS.find(c => c.id === channel)
                              if (channelConfig) {
                                const ChannelIcon = channelConfig.icon
                                return <ChannelIcon key={channel} className="h-4 w-4" />
                              }
                              return null
                            })}
                          </div>
                          <span className="text-muted-foreground">
                            {rule.frequency.type === 'immediate' ? 'Imediato' : 'Agendado'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={(enabled) => {
                            setRules(prev => prev.map(r => 
                              r.id === rule.id ? { ...r, enabled } : r
                            ))
                          }}
                        />
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setRules(prev => prev.filter(r => r.id !== rule.id))
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

          <TabsContent value="analytics" className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Analytics de notificações em desenvolvimento</p>
              <p className="text-sm">Métricas de engajamento e efetividade em breve</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Editor de Regras */}
        {showRuleEditor && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-background p-6 rounded-lg border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-medium mb-4">Nova Regra de Notificação</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rule-name">Nome da Regra</Label>
                    <Input
                      id="rule-name"
                      placeholder="Ex: Novos leads importantes"
                      value={ruleName}
                      onChange={(e) => setRuleName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="rule-priority">Prioridade</Label>
                    <Select value={rulePriority} onValueChange={(value) => setRulePriority(value as NotificationPriority)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PRIORITY_LEVELS.map(priority => (
                          <SelectItem key={priority.id} value={priority.id}>
                            {priority.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="rule-description">Descrição</Label>
                  <Textarea
                    id="rule-description"
                    placeholder="Descreva quando esta regra deve ser acionada"
                    value={ruleDescription}
                    onChange={(e) => setRuleDescription(e.target.value)}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">Canais de Notificação</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {NOTIFICATION_CHANNELS.map(channel => {
                      const ChannelIcon = channel.icon
                      const isSelected = ruleChannels.includes(channel.id as NotificationChannel)
                      return (
                        <div
                          key={channel.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => {
                            if (isSelected) {
                              setRuleChannels(ruleChannels.filter(c => c !== channel.id))
                            } else {
                              setRuleChannels([...ruleChannels, channel.id as NotificationChannel])
                            }
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <ChannelIcon className="h-4 w-4" />
                            <span className="font-medium text-sm">{channel.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {channel.description}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="template-title">Título do Template</Label>
                    <Input
                      id="template-title"
                      placeholder="{{tipo}} {{valor}}"
                      value={ruleTemplate.title}
                      onChange={(e) => setRuleTemplate({...ruleTemplate, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="template-message">Mensagem do Template</Label>
                    <Input
                      id="template-message"
                      placeholder="{{descricao}} - {{detalhes}}"
                      value={ruleTemplate.message}
                      onChange={(e) => setRuleTemplate({...ruleTemplate, message: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={resetRuleEditor}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={saveRule}
                    disabled={!ruleName.trim() || ruleChannels.length === 0}
                  >
                    Salvar Regra
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
