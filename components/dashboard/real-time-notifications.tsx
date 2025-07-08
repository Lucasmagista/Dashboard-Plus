"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  AlertTriangle,
  Users,
  DollarSign,
  MessageSquare,
  Calendar,
  Settings,
  Filter,
  Volume2,
  VolumeX
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'

type NotificationType = 'success' | 'warning' | 'error' | 'info'
type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent'

interface RealTimeNotification {
  id: string
  type: NotificationType
  priority: NotificationPriority
  title: string
  message: string
  timestamp: Date
  read: boolean
  category: string
  actionUrl?: string
  userData?: any
}

const NOTIFICATION_ICONS = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info
}

const NOTIFICATION_COLORS = {
  success: 'text-green-500 border-green-200 bg-green-50',
  warning: 'text-yellow-500 border-yellow-200 bg-yellow-50',
  error: 'text-red-500 border-red-200 bg-red-50',
  info: 'text-blue-500 border-blue-200 bg-blue-50'
}

const CATEGORY_ICONS = {
  leads: Users,
  sales: DollarSign,
  messages: MessageSquare,
  appointments: Calendar,
  system: Settings
}

export const RealTimeNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<RealTimeNotification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState<string>('all')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [ws, setWs] = useState<WebSocket | null>(null)

  // Simular WebSocket connection
  useEffect(() => {
    // Em produção, isso seria uma conexão WebSocket real
    const mockWebSocket = {
      onmessage: null as ((event: MessageEvent) => void) | null,
      send: (data: string) => {},
      close: () => {}
    }

    // Simular recebimento de notificações
    const interval = setInterval(() => {
      const mockNotifications = [
        {
          id: `notif-${Date.now()}`,
          type: 'success' as NotificationType,
          priority: 'medium' as NotificationPriority,
          title: 'Novo lead capturado',
          message: 'Maria Silva se interessou pela sua solução',
          timestamp: new Date(),
          read: false,
          category: 'leads',
          actionUrl: '/leads'
        },
        {
          id: `notif-${Date.now() + 1}`,
          type: 'warning' as NotificationType,
          priority: 'high' as NotificationPriority,
          title: 'Pagamento pendente',
          message: 'Fatura de R$ 1.500 vence em 2 dias',
          timestamp: new Date(),
          read: false,
          category: 'sales',
          actionUrl: '/billing'
        },
        {
          id: `notif-${Date.now() + 2}`,
          type: 'info' as NotificationType,
          priority: 'low' as NotificationPriority,
          title: 'Reunião agendada',
          message: 'Demonstração marcada para amanhã às 15h',
          timestamp: new Date(),
          read: false,
          category: 'appointments',
          actionUrl: '/calendar'
        }
      ]

      const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)]
      
      // Evitar duplicatas
      setNotifications(prev => {
        const exists = prev.some(n => n.title === randomNotification.title)
        if (exists) return prev
        
        const newNotifications = [randomNotification, ...prev.slice(0, 49)] // Máximo 50 notificações
        
        // Tocar som para notificações importantes
        if (soundEnabled && randomNotification.priority === 'high') {
          playNotificationSound()
        }

        // Mostrar toast para notificações urgentes
        if (randomNotification.priority === 'urgent') {
          toast.error(randomNotification.title, {
            description: randomNotification.message,
            duration: 5000
          })
        }

        return newNotifications
      })
    }, 15000) // Nova notificação a cada 15 segundos

    return () => {
      clearInterval(interval)
      if (ws) {
        ws.close()
      }
    }
  }, [soundEnabled, ws])

  const playNotificationSound = useCallback(() => {
    if (typeof window !== 'undefined' && soundEnabled) {
      // Criar um som simples usando Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = 800
      oscillator.type = 'square'
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    }
  }, [soundEnabled])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }, [])

  const getFilteredNotifications = () => {
    if (filter === 'all') return notifications
    if (filter === 'unread') return notifications.filter(n => !n.read)
    return notifications.filter(n => n.category === filter)
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="relative">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificações
                {unreadCount > 0 && (
                  <Badge variant="secondary">
                    {unreadCount} não lidas
                  </Badge>
                )}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                >
                  {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  Marcar todas como lidas
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          {/* Filtros */}
          <div className="flex flex-wrap gap-2 py-4 border-b">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Todas
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              Não lidas
            </Button>
            <Button
              variant={filter === 'leads' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('leads')}
            >
              <Users className="h-4 w-4 mr-2" />
              Leads
            </Button>
            <Button
              variant={filter === 'sales' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('sales')}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Vendas
            </Button>
            <Button
              variant={filter === 'messages' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('messages')}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Mensagens
            </Button>
          </div>

          {/* Lista de notificações */}
          <ScrollArea className="flex-1 max-h-96">
            <div className="space-y-2">
              {getFilteredNotifications().length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma notificação encontrada</p>
                </div>
              ) : (
                getFilteredNotifications().map(notification => {
                  const Icon = NOTIFICATION_ICONS[notification.type]
                  const CategoryIcon = CATEGORY_ICONS[notification.category as keyof typeof CATEGORY_ICONS]
                  
                  return (
                    <Card 
                      key={notification.id}
                      className={`transition-all duration-200 ${
                        notification.read ? 'opacity-60' : 'border-l-4 border-l-primary'
                      } ${notification.priority === 'urgent' ? 'animate-pulse' : ''}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`p-2 rounded-full ${NOTIFICATION_COLORS[notification.type]}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-sm">{notification.title}</h4>
                                {CategoryIcon && <CategoryIcon className="h-3 w-3 text-muted-foreground" />}
                                <Badge 
                                  variant={notification.priority === 'urgent' ? 'destructive' : 'secondary'}
                                  className="text-xs"
                                >
                                  {notification.priority}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                  {format(notification.timestamp, 'HH:mm - dd/MM/yyyy', { locale: ptBR })}
                                </span>
                                {notification.actionUrl && (
                                  <Button variant="link" size="sm" className="p-0 h-auto">
                                    Ver detalhes
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeNotification(notification.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
