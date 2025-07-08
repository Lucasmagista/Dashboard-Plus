"use client"

import { useState, useEffect } from "react"
import { registerPushNotifications } from "@/lib/push-notifications"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Bell,
  Mail,
  MessageSquare,
  Phone,
  Calendar,
  DollarSign,
  Users,
  Check,
  Archive,
  Trash2,
  Filter,
} from "lucide-react"

type Notification = {
  id: number
  type: string
  title: string
  description: string
  timestamp: string
  read: boolean
  priority: string
  avatar: string | null
}

const notifications: Notification[] = [
  {
    id: 1,
    type: "mensagem",
    title: "Nova mensagem de Alice Souza",
    description: "Obrigado pela resposta rápida! Tenho algumas dúvidas...",
    timestamp: "há 2 minutos",
    read: false,
    priority: "alta",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    type: "reuniao",
    title: "Reunião agendada",
    description: "Reunião de demonstração com TechStart Ltda em 30 minutos",
    timestamp: "há 30 minutos",
    read: true,
    priority: "alta",
    avatar: null,
  },
  {
    id: 4,
    type: "pagamento",
    title: "Pagamento recebido",
    description: "Pagamento de R$15.000 recebido de Creative Agency",
    timestamp: "há 1 hora",
    read: true,
    priority: "media",
    avatar: null,
  },
  {
    id: 5,
    type: "usuario",
    title: "Novo membro adicionado à equipe",
    description: "Sara Souza foi adicionada à sua equipe",
    timestamp: "há 2 horas",
    read: true,
    priority: "baixa",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

const notificationSettings = {
  email: {
    newMessages: true,
    dealUpdates: true,
    meetingReminders: true,
    paymentAlerts: true,
    teamUpdates: false,
    systemUpdates: true,
  },
  push: {
    newMessages: true,
    dealUpdates: false,
    meetingReminders: true,
    paymentAlerts: true,
    teamUpdates: false,
    systemUpdates: false,
  },
  sms: {
    newMessages: false,
    dealUpdates: false,
    meetingReminders: true,
    paymentAlerts: true,
    teamUpdates: false,
    systemUpdates: false,
  },
}

export default function NotificationsPage() {
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [settings, setSettings] = useState(notificationSettings)
  const [pushStatus, setPushStatus] = useState<string | null>(null)

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "mensagem":
      return <MessageSquare className="h-4 w-4 text-blue-600" />
    case "negocio":
      return <DollarSign className="h-4 w-4 text-green-600" />
    case "reuniao":
      return <Calendar className="h-4 w-4 text-purple-600" />
    case "pagamento":
      return <DollarSign className="h-4 w-4 text-green-600" />
    case "usuario":
      return <Users className="h-4 w-4 text-orange-600" />
    default:
      return <Bell className="h-4 w-4 text-gray-600" />
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "alta":
      return "bg-red-100 text-red-800"
    case "media":
      return "bg-yellow-100 text-yellow-800"
    case "baixa":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

  const filteredNotifications = notifications.filter((notification) => {
    if (selectedFilter === "all") return true
    if (selectedFilter === "unread") return !notification.read
    if (selectedFilter === "high") return notification.priority === "high"
    return notification.type === selectedFilter
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAsRead = (id: number) => {
    // Mark notification as read
    console.log("Mark as read:", id)
  }

  const handleMarkAllAsRead = () => {
    // Mark all notifications as read
    console.log("Mark all as read")
  }

  const updateSetting = (channel: keyof typeof settings, setting: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [setting]: value,
      },
    }))
  }

  return (
    <SidebarInset>
      {pushStatus && (
        <div className="mb-2 p-2 rounded bg-blue-50 text-blue-900 text-xs font-medium border border-blue-200">
          {pushStatus}
        </div>
      )}
      {pushStatus && (
        <div className="mb-2 p-2 rounded bg-blue-50 text-blue-900 text-xs font-medium border border-blue-200">
          {pushStatus}
        </div>
      )}
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Notificações</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notificações</h1>
            <p className="text-muted-foreground">Acompanhe as atividades e alertas do seu negócio</p>
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button variant="outline" onClick={handleMarkAllAsRead}>
                <Check className="mr-2 h-4 w-4" />
                Marcar todas como lidas
              </Button>
            )}
            <Badge variant="secondary">{unreadCount} não lidas</Badge>
          </div>
        </div>

        <Tabs defaultValue="inbox" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inbox">Caixa de Entrada</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="inbox" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Central de Notificações</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="unread">Não lidas</SelectItem>
                        <SelectItem value="alta">Alta prioridade</SelectItem>
                        <SelectItem value="mensagem">Mensagens</SelectItem>
                        <SelectItem value="negocio">Negócios</SelectItem>
                        <SelectItem value="reuniao">Reuniões</SelectItem>
                        <SelectItem value="pagamento">Pagamentos</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start space-x-4 p-4 rounded-lg border ${
                        !notification.read ? "bg-blue-50 border-blue-200 dark:bg-zinc-900" : "bg-zinc-900 dark:bg-zinc-900"
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {notification.avatar ? (
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={notification.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {notification.title
                                .split(" ")
                                .slice(-2)
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                            {getNotificationIcon(notification.type)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-sm font-medium ${!notification.read ? "text-gray-900" : "text-gray-600"}`}
                          >
                            {notification.title}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Badge className={getPriorityColor(notification.priority)}>{notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)}</Badge>
                            <span className="text-xs text-gray-500">{notification.timestamp}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{notification.description}</p>
                        <div className="flex items-center space-x-2 mt-3">
                          {!notification.read && (
                            <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notification.id)}>
                              <Check className="h-4 w-4 mr-1" />
                              Marcar como lida
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <Archive className="h-4 w-4 mr-1" />
                            Arquivar
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredNotifications.length === 0 && (
                    <div className="text-center py-8">
                      <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Nenhuma notificação encontrada</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Notificação</CardTitle>
                <CardDescription>Escolha como deseja ser notificado sobre diferentes eventos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-4 flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>Notificações por E-mail</span>
                    </h4>
                    <div className="space-y-3 ml-6">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-messages">Novas Mensagens</Label>
                        <Switch
                          id="email-messages"
                          checked={settings.email.newMessages}
                          onCheckedChange={(value) => updateSetting("email", "newMessages", value)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-deals">Atualizações de Negócios</Label>
                        <Switch
                          id="email-deals"
                          checked={settings.email.dealUpdates}
                          onCheckedChange={(value) => updateSetting("email", "dealUpdates", value)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-meetings">Lembretes de Reunião</Label>
                        <Switch
                          id="email-meetings"
                          checked={settings.email.meetingReminders}
                          onCheckedChange={(value) => updateSetting("email", "meetingReminders", value)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-payments">Alertas de Pagamento</Label>
                        <Switch
                          id="email-payments"
                          checked={settings.email.paymentAlerts}
                          onCheckedChange={(value) => updateSetting("email", "paymentAlerts", value)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-team">Atualizações da Equipe</Label>
                        <Switch
                          id="email-team"
                          checked={settings.email.teamUpdates}
                          onCheckedChange={(value) => updateSetting("email", "teamUpdates", value)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-system">Atualizações do Sistema</Label>
                        <Switch
                          id="email-system"
                          checked={settings.email.systemUpdates}
                          onCheckedChange={(value) => updateSetting("email", "systemUpdates", value)}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-medium mb-4 flex items-center space-x-2">
                      <Bell className="h-4 w-4" />
                      <span>Notificações Push</span>
                    </h4>
                    <div className="space-y-3 ml-6">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="push-messages">Novas Mensagens</Label>
                        <Switch
                          id="push-messages"
                          checked={settings.push.newMessages}
                          onCheckedChange={(value) => updateSetting("push", "newMessages", value)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="push-deals">Atualizações de Negócios</Label>
                        <Switch
                          id="push-deals"
                          checked={settings.push.dealUpdates}
                          onCheckedChange={(value) => updateSetting("push", "dealUpdates", value)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="push-meetings">Lembretes de Reunião</Label>
                        <Switch
                          id="push-meetings"
                          checked={settings.push.meetingReminders}
                          onCheckedChange={(value) => updateSetting("push", "meetingReminders", value)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="push-payments">Alertas de Pagamento</Label>
                        <Switch
                          id="push-payments"
                          checked={settings.push.paymentAlerts}
                          onCheckedChange={(value) => updateSetting("push", "paymentAlerts", value)}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-medium mb-4 flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>Notificações por SMS</span>
                    </h4>
                    <div className="space-y-3 ml-6">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="sms-phone">Número de Celular</Label>
                        <Input id="sms-phone" placeholder="+1 (555) 123-4567" className="w-48" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="sms-meetings">Lembretes de Reunião</Label>
                        <Switch
                          id="sms-meetings"
                          checked={settings.sms.meetingReminders}
                          onCheckedChange={(value) => updateSetting("sms", "meetingReminders", value)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="sms-payments">Alertas de Pagamento</Label>
                        <Switch
                          id="sms-payments"
                          checked={settings.sms.paymentAlerts}
                          onCheckedChange={(value) => updateSetting("sms", "paymentAlerts", value)}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-medium mb-4">Horário Silencioso</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="quiet-hours">Ativar Horário Silencioso</Label>
                        <Switch id="quiet-hours" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="quiet-start">Início</Label>
                          <Input id="quiet-start" type="time" defaultValue="22:00" />
                        </div>
                        <div>
                          <Label htmlFor="quiet-end">Fim</Label>
                          <Input id="quiet-end" type="time" defaultValue="08:00" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Frequência de Notificações</CardTitle>
                <CardDescription>Controle com que frequência você recebe notificações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="digest-frequency">Resumo por E-mail</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Tempo real</SelectItem>
                        <SelectItem value="hourly">A cada hora</SelectItem>
                        <SelectItem value="daily">Diário</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="never">Nunca</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="summary-time">Horário do Resumo Diário</Label>
                    <Input id="summary-time" type="time" defaultValue="09:00" className="w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  )
}
