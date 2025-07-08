"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Settings, Shield, Bell, Palette, Database, Users, Trash2, Plus, Edit, Crown, Layout, Calendar, Download, Filter, BarChart3, Workflow } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const userRoles = [
  {
    id: 1,
    name: "Administrador",
    email: "admin@empresa.com",
    role: "Administrador",
    status: "Ativo",
    lastLogin: "2024-01-15",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    name: "João Silva",
    email: "joao@empresa.com",
    role: "Gerente de Vendas",
    status: "Ativo",
    lastLogin: "2024-01-14",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    email: "sarah@empresa.com",
    role: "Representante de Vendas",
    status: "Ativo",
    lastLogin: "2024-01-13",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 4,
    name: "Mike Wilson",
    email: "mike@empresa.com",
    role: "Marketing",
    status: "Inativo",
    lastLogin: "2024-01-10",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const { toast } = useToast()

  // Estado para dados da empresa e configurações
  const [company, setCompany] = useState({
    name: "",
    industry: "technology",
    phone: "",
    website: "",
    address: "",
  })
  const [platform, setPlatform] = useState({
    autoSave: true,
    activityLogging: true,
    dataBackup: true,
    timezone: "utc-3",
    dashboardLayout: "default",
    defaultPage: "dashboard",
    reportFrequency: "weekly",
    reportFormat: "pdf",
    widgets: {
      kpis: true,
      activities: true,
      tasks: true,
      assistant: true,
    },
    reports: {
      analytics: true,
      sales: true,
      performance: true,
      integrations: false,
    },
    automations: {
      backup: true,
      sync: true,
      notifications: true,
      cleanup: false,
    },
  })
  const [loading, setLoading] = useState(false)

  // Buscar dados reais da API ao abrir a tela
  useEffect(() => {
    async function fetchSettings() {
      setLoading(true)
      try {
        // Simulação de API (troque a URL para sua API real)
        const res = await fetch("/api/settings")
        if (!res.ok) throw new Error("Erro ao buscar configurações")
        const data = await res.json()
        setCompany(data.company)
        setPlatform(data.platform)
      } catch (e) {
        // fallback: valores default
        setCompany({
          name: "CRM Pro Empresarial",
          industry: "technology",
          phone: "+55 (11) 1234-5678",
          website: "https://empresa.com.br",
          address: "Rua Exemplo, 100, Centro, Cidade, Estado, 12345-000",
        })
        setPlatform({
          autoSave: true,
          activityLogging: true,
          dataBackup: true,
          timezone: "utc-3",
          dashboardLayout: "default",
          defaultPage: "dashboard",
          reportFrequency: "weekly",
          reportFormat: "pdf",
          widgets: {
            kpis: true,
            activities: true,
            tasks: true,
            assistant: true,
          },
          reports: {
            analytics: true,
            sales: true,
            performance: true,
            integrations: false,
          },
          automations: {
            backup: true,
            sync: true,
            notifications: true,
            cleanup: false,
          },
        })
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  // Salvar alterações na API
  const handleSaveSettings = async () => {
    setLoading(true)
    try {
      // Simulação de API (troque a URL para sua API real)
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, platform }),
      })
      if (!res.ok) throw new Error("Erro ao salvar configurações")
      toast({
        title: "Configurações salvas",
        description: "Suas configurações foram atualizadas com sucesso.",
      })
    } catch (e) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Administrador":
        return "bg-red-100 text-red-800"
      case "Gerente de Vendas":
        return "bg-blue-100 text-blue-800"
      case "Representante de Vendas":
        return "bg-green-100 text-green-800"
      case "Marketing":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    return status === "Ativo" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Painel</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Configurações</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
            <p className="text-muted-foreground">Gerencie as configurações e preferências da sua plataforma</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="general" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Geral</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Layout className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Usuários</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Segurança</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Notificações</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span>Aparência</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>Dados</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Empresa</CardTitle>
                <CardDescription>Atualize os dados e contatos da sua empresa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Nome da Empresa</Label>
                    <Input id="company-name" value={company.name} onChange={e => setCompany(c => ({ ...c, name: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Setor</Label>
                    <Select value={company.industry} onValueChange={v => setCompany(c => ({ ...c, industry: v }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Tecnologia</SelectItem>
                        <SelectItem value="finance">Finanças</SelectItem>
                        <SelectItem value="healthcare">Saúde</SelectItem>
                        <SelectItem value="retail">Varejo</SelectItem>
                        <SelectItem value="manufacturing">Indústria</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" value={company.phone} onChange={e => setCompany(c => ({ ...c, phone: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" value={company.website} onChange={e => setCompany(c => ({ ...c, website: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Textarea id="address" value={company.address} onChange={e => setCompany(c => ({ ...c, address: e.target.value }))} />
                </div>
                <Button onClick={handleSaveSettings} disabled={loading}>{loading ? "Salvando..." : "Salvar Alterações"}</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurações da Plataforma</CardTitle>
                <CardDescription>Defina o comportamento e preferências gerais da plataforma</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Salvamento automático</Label>
                    <p className="text-sm text-muted-foreground">Salva alterações automaticamente enquanto você trabalha</p>
                  </div>
                  <Switch checked={platform.autoSave} onCheckedChange={v => setPlatform(p => ({ ...p, autoSave: v }))} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Registro de atividades</Label>
                    <p className="text-sm text-muted-foreground">Acompanha atividades de usuários e eventos do sistema</p>
                  </div>
                  <Switch checked={platform.activityLogging} onCheckedChange={v => setPlatform(p => ({ ...p, activityLogging: v }))} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Backup de dados</Label>
                    <p className="text-sm text-muted-foreground">Habilita backups automáticos diários</p>
                  </div>
                  <Switch checked={platform.dataBackup} onCheckedChange={v => setPlatform(p => ({ ...p, dataBackup: v }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso horário</Label>
                  <Select value={platform.timezone} onValueChange={v => setPlatform(p => ({ ...p, timezone: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc-2">Horário de Fernando de Noronha (UTC-2)</SelectItem>
                      <SelectItem value="utc-3">Horário de Brasília (UTC-3)</SelectItem>
                      <SelectItem value="utc-4">Horário do Amazonas (UTC-4)</SelectItem>
                      <SelectItem value="utc-5">Horário do Acre (UTC-5)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuração do Dashboard</CardTitle>
                <CardDescription>Personalize a aparência e funcionalidades do seu dashboard</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dashboardLayout">Layout do Dashboard</Label>
                    <Select value={platform.dashboardLayout || "default"} onValueChange={(value) => setPlatform({ ...platform, dashboardLayout: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o layout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Padrão</SelectItem>
                        <SelectItem value="compact">Compacto</SelectItem>
                        <SelectItem value="expanded">Expandido</SelectItem>
                        <SelectItem value="custom">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="defaultPage">Página Inicial</Label>
                    <Select value={platform.defaultPage || "dashboard"} onValueChange={(value) => setPlatform({ ...platform, defaultPage: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a página inicial" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dashboard">Dashboard</SelectItem>
                        <SelectItem value="analytics">Analytics</SelectItem>
                        <SelectItem value="crm">CRM</SelectItem>
                        <SelectItem value="communications">Comunicações</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Widgets Visíveis</Label>
                      <p className="text-sm text-muted-foreground">Escolha quais widgets aparecerão no dashboard principal</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="widget-kpis"
                        checked={platform.widgets?.kpis !== false}
                        onCheckedChange={(checked) => setPlatform({ ...platform, widgets: { ...platform.widgets, kpis: checked } })}
                      />
                      <Label htmlFor="widget-kpis">KPIs Principais</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="widget-activities"
                        checked={platform.widgets?.activities !== false}
                        onCheckedChange={(checked) => setPlatform({ ...platform, widgets: { ...platform.widgets, activities: checked } })}
                      />
                      <Label htmlFor="widget-activities">Atividades Recentes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="widget-tasks"
                        checked={platform.widgets?.tasks !== false}
                        onCheckedChange={(checked) => setPlatform({ ...platform, widgets: { ...platform.widgets, tasks: checked } })}
                      />
                      <Label htmlFor="widget-tasks">Tarefas Pendentes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="widget-assistant"
                        checked={platform.widgets?.assistant !== false}
                        onCheckedChange={(checked) => setPlatform({ ...platform, widgets: { ...platform.widgets, assistant: checked } })}
                      />
                      <Label htmlFor="widget-assistant">Assistente Virtual</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Relatórios Agendados</CardTitle>
                <CardDescription>Configure relatórios automáticos e exportações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reportFrequency">Frequência dos Relatórios</Label>
                    <Select value={platform.reportFrequency || "weekly"} onValueChange={(value) => setPlatform({ ...platform, reportFrequency: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a frequência" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Diário</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensal</SelectItem>
                        <SelectItem value="custom">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reportFormat">Formato dos Relatórios</Label>
                    <Select value={platform.reportFormat || "pdf"} onValueChange={(value) => setPlatform({ ...platform, reportFormat: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o formato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Tipos de Relatórios</Label>
                      <p className="text-sm text-muted-foreground">Selecione os relatórios que deseja receber automaticamente</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="report-analytics"
                        checked={platform.reports?.analytics !== false}
                        onCheckedChange={(checked) => setPlatform({ ...platform, reports: { ...platform.reports, analytics: checked } })}
                      />
                      <Label htmlFor="report-analytics">Relatório de Analytics</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="report-sales"
                        checked={platform.reports?.sales !== false}
                        onCheckedChange={(checked) => setPlatform({ ...platform, reports: { ...platform.reports, sales: checked } })}
                      />
                      <Label htmlFor="report-sales">Relatório de Vendas</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="report-performance"
                        checked={platform.reports?.performance !== false}
                        onCheckedChange={(checked) => setPlatform({ ...platform, reports: { ...platform.reports, performance: checked } })}
                      />
                      <Label htmlFor="report-performance">Relatório de Performance</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="report-integrations"
                        checked={platform.reports?.integrations !== false}
                        onCheckedChange={(checked) => setPlatform({ ...platform, reports: { ...platform.reports, integrations: checked } })}
                      />
                      <Label htmlFor="report-integrations">Relatório de Integrações</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Automações e Workflows</CardTitle>
                <CardDescription>Configure automações para otimizar processos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Automações Ativas</Label>
                      <p className="text-sm text-muted-foreground">Ative ou desative automações específicas</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="auto-backup"
                        checked={platform.automations?.backup !== false}
                        onCheckedChange={(checked) => setPlatform({ ...platform, automations: { ...platform.automations, backup: checked } })}
                      />
                      <Label htmlFor="auto-backup">Backup Automático</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="auto-sync"
                        checked={platform.automations?.sync !== false}
                        onCheckedChange={(checked) => setPlatform({ ...platform, automations: { ...platform.automations, sync: checked } })}
                      />
                      <Label htmlFor="auto-sync">Sincronização Automática</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="auto-notifications"
                        checked={platform.automations?.notifications !== false}
                        onCheckedChange={(checked) => setPlatform({ ...platform, automations: { ...platform.automations, notifications: checked } })}
                      />
                      <Label htmlFor="auto-notifications">Notificações Automáticas</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="auto-cleanup"
                        checked={platform.automations?.cleanup !== false}
                        onCheckedChange={(checked) => setPlatform({ ...platform, automations: { ...platform.automations, cleanup: checked } })}
                      />
                      <Label htmlFor="auto-cleanup">Limpeza Automática</Label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Workflow className="mr-2 h-4 w-4" />
                    Gerenciar Workflows
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Agendar Tarefas
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Logs de Automação
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userRoles.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium flex items-center space-x-2">
                                <span>{user.name}</span>
                                {user.role === "Administrator" && <Crown className="h-4 w-4 text-yellow-500" />}
                              </div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                        </TableCell>
                        <TableCell>{user.lastLogin}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete User</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this user? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure security policies and authentication settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for all user accounts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Password Complexity</Label>
                    <p className="text-sm text-muted-foreground">Enforce strong password requirements</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">Automatically log out inactive users</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session-duration">Session Duration (minutes)</Label>
                  <Input id="session-duration" type="number" defaultValue="60" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                  <Input id="max-login-attempts" type="number" defaultValue="5" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Configure how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive important alerts via SMS</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Lead Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified when new leads are created</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Deal Updates</Label>
                    <p className="text-sm text-muted-foreground">Notifications for deal stage changes</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize the look and feel of your platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select defaultValue="light">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 cursor-pointer border-2 border-blue-600"></div>
                    <div className="w-8 h-8 rounded-full bg-green-600 cursor-pointer border-2 border-transparent hover:border-green-600"></div>
                    <div className="w-8 h-8 rounded-full bg-purple-600 cursor-pointer border-2 border-transparent hover:border-purple-600"></div>
                    <div className="w-8 h-8 rounded-full bg-red-600 cursor-pointer border-2 border-transparent hover:border-red-600"></div>
                    <div className="w-8 h-8 rounded-full bg-orange-600 cursor-pointer border-2 border-transparent hover:border-orange-600"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Sidebar Position</Label>
                  <Select defaultValue="left">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">Use a more compact interface layout</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Manage your data, backups, and exports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    Import Data
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Backup Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Data Retention (days)</Label>
                  <Input type="number" defaultValue="365" />
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete All Data
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete All Data</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete all your data including contacts, leads, and messages. This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-red-600 hover:bg-red-700">Delete All Data</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  )
}
