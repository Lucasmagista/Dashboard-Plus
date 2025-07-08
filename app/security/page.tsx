"use client"

import { useState } from "react"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Shield,
  Key,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Download,
  RefreshCw,
} from "lucide-react"

const securityEvents = [
  {
    id: 1,
    type: "login",
    description: "Successful login from New York, US",
    timestamp: "2024-01-15 10:30 AM",
    ip: "192.168.1.100",
    device: "Chrome on Windows",
    status: "success",
  },
  {
    id: 2,
    type: "password_change",
    description: "Password changed successfully",
    timestamp: "2024-01-14 3:45 PM",
    ip: "192.168.1.100",
    device: "Chrome on Windows",
    status: "success",
  },
  {
    id: 3,
    type: "failed_login",
    description: "Failed login attempt",
    timestamp: "2024-01-13 11:20 AM",
    ip: "203.0.113.45",
    device: "Unknown",
    status: "failed",
  },
  {
    id: 4,
    type: "api_access",
    description: "API key used for data export",
    timestamp: "2024-01-12 9:15 AM",
    ip: "192.168.1.100",
    device: "API Client",
    status: "success",
  },
]

const activeSessions = [
  {
    id: 1,
    device: "Chrome on Windows",
    location: "New York, US",
    ip: "192.168.1.100",
    lastActive: "2 minutes ago",
    current: true,
  },
  {
    id: 2,
    device: "Safari on iPhone",
    location: "New York, US",
    ip: "192.168.1.101",
    lastActive: "1 hour ago",
    current: false,
  },
  {
    id: 3,
    device: "Chrome on Android",
    location: "Boston, US",
    ip: "203.0.113.22",
    lastActive: "2 days ago",
    current: false,
  },
]

const apiKeys = [
  {
    id: 1,
    name: "Production API",
    key: "pk_live_••••••••••••••••",
    created: "2024-01-01",
    lastUsed: "2 minutes ago",
    permissions: ["read", "write"],
    status: "active",
  },
  {
    id: 2,
    name: "Development API",
    key: "pk_test_••••••••••••••••",
    created: "2023-12-15",
    lastUsed: "1 week ago",
    permissions: ["read"],
    status: "active",
  },
  {
    id: 3,
    name: "Analytics API",
    key: "pk_analytics_••••••••••••••••",
    created: "2023-11-20",
    lastUsed: "Never",
    permissions: ["read"],
    status: "inactive",
  },
]

export default function SecurityPage() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(true)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [isAPIKeyDialogOpen, setIsAPIKeyDialogOpen] = useState(false)

  const getEventIcon = (type: string) => {
    switch (type) {
      case "login":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "failed_login":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "password_change":
        return <Key className="h-4 w-4 text-blue-600" />
      case "api_access":
        return <Globe className="h-4 w-4 text-purple-600" />
      default:
        return <Shield className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDeviceIcon = (device: string) => {
    if (device.includes("iPhone") || device.includes("Android")) {
      return <Smartphone className="h-4 w-4" />
    }
    return <Monitor className="h-4 w-4" />
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
                <BreadcrumbPage>Segurança</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Segurança</h1>
            <p className="text-muted-foreground">Gerencie a segurança da sua conta e os controles de acesso</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar Logs
            </Button>
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Visão Geral de Segurança */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pontuação de Segurança</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">95%</div>
              <p className="text-xs text-muted-foreground">Segurança excelente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessões Ativas</CardTitle>
              <Monitor className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeSessions.length}</div>
              <p className="text-xs text-muted-foreground">Em todos os dispositivos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chaves de API</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{apiKeys.filter((k) => k.status === "active").length}</div>
              <p className="text-xs text-muted-foreground">Chaves ativas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Último Login</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2m ago</div>
              <p className="text-xs text-muted-foreground">De New York, US</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="settings" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="settings">Configurações</TabsTrigger>
            <TabsTrigger value="sessions">Sessões</TabsTrigger>
            <TabsTrigger value="api-keys">Chaves de API</TabsTrigger>
            <TabsTrigger value="activity">Log de Atividades</TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Autenticação</CardTitle>
                <CardDescription>Configure suas preferências de login e autenticação</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Autenticação em Duas Etapas</Label>
                    <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança à sua conta</p>
                  </div>
                  <Switch checked={is2FAEnabled} onCheckedChange={setIs2FAEnabled} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Notificações de Login</Label>
                    <p className="text-sm text-muted-foreground">Receba notificações quando alguém acessar sua conta</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Tempo de Sessão</Label>
                    <p className="text-sm text-muted-foreground">Desconectar automaticamente após inatividade</p>
                  </div>
                  <Select defaultValue="30min">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15min">15 minutos</SelectItem>
                      <SelectItem value="30min">30 minutos</SelectItem>
                      <SelectItem value="1hour">1 hora</SelectItem>
                      <SelectItem value="4hours">4 horas</SelectItem>
                      <SelectItem value="never">Nunca</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Senha</Label>
                    <p className="text-sm text-muted-foreground">Última alteração há 30 dias</p>
                  </div>
                  <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">Alterar Senha</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Alterar Senha</DialogTitle>
                        <DialogDescription>Digite sua senha atual e escolha uma nova.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="current-password" className="text-right">
                            Atual
                          </Label>
                          <Input id="current-password" type="password" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="new-password" className="text-right">
                            Nova
                          </Label>
                          <Input id="new-password" type="password" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="confirm-password" className="text-right">
                            Confirmar
                          </Label>
                          <Input id="confirm-password" type="password" className="col-span-3" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={() => setIsPasswordDialogOpen(false)}>
                          Atualizar Senha
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurações de Privacidade</CardTitle>
                <CardDescription>Controle como seus dados são usados e compartilhados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Análise de Dados</Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir analisar padrões de uso para melhorar o serviço
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Comunicações de Marketing</Label>
                    <p className="text-sm text-muted-foreground">Receber e-mails sobre novidades e atualizações</p>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Exportação de Dados</Label>
                    <p className="text-sm text-muted-foreground">Baixar uma cópia dos seus dados</p>
                  </div>
                  <Button variant="outline">Solicitar Exportação</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sessões Ativas</CardTitle>
                <CardDescription>Gerencie suas sessões de login ativas em todos os dispositivos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        {getDeviceIcon(session.device)}
                        <div>
                          <div className="font-medium flex items-center space-x-2">
                            <span>{session.device}</span>
                            {session.current && <Badge variant="secondary">Atual</Badge>}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {session.location} • {session.ip}
                          </div>
                          <div className="text-xs text-muted-foreground">Última atividade: {session.lastActive}</div>
                        </div>
                      </div>
                      {!session.current && (
                        <Button variant="outline" size="sm">
                          Revogar
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api-keys" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Chaves de API</CardTitle>
                    <CardDescription>Gerencie suas chaves de API para acesso programático</CardDescription>
                  </div>
                  <Dialog open={isAPIKeyDialogOpen} onOpenChange={setIsAPIKeyDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>Criar Chave de API</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Criar Chave de API</DialogTitle>
                        <DialogDescription>
                          Crie uma nova chave de API para acessar sua conta programaticamente.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="key-name" className="text-right">
                            Nome
                          </Label>
                          <Input id="key-name" placeholder="Minha Chave de API" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="permissions" className="text-right">
                            Permissões
                          </Label>
                          <Select>
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Selecione as permissões" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="read">Somente Leitura</SelectItem>
                              <SelectItem value="write">Leitura & Escrita</SelectItem>
                              <SelectItem value="admin">Acesso Total</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={() => setIsAPIKeyDialogOpen(false)}>
                          Criar Chave
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Chave</TableHead>
                      <TableHead>Permissões</TableHead>
                      <TableHead>Último Uso</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.map((key) => (
                      <TableRow key={key.id}>
                        <TableCell className="font-medium">{key.name}</TableCell>
                        <TableCell className="font-mono text-sm">{key.key}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            {key.permissions.map((permission) => (
                              <Badge key={permission} variant="outline" className="text-xs">
                                {(() => {
                                  if (permission === "read") return "Leitura";
                                  if (permission === "write") return "Leitura & Escrita";
                                  return "Acesso Total";
                                })()}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{key.lastUsed}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              key.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }
                          >
                            {key.status === "active" ? "Ativa" : "Inativa"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              Revogar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Log de Atividades de Segurança</CardTitle>
                <CardDescription>Monitore todos os eventos relacionados à segurança da sua conta</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Evento</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>IP</TableHead>
                      <TableHead>Dispositivo</TableHead>
                      <TableHead>Horário</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {securityEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getEventIcon(event.type)}
                            <span className="capitalize">{event.type.replace("_", " ")}</span>
                          </div>
                        </TableCell>
                        <TableCell>{event.description}</TableCell>
                        <TableCell className="font-mono text-sm">{event.ip}</TableCell>
                        <TableCell>{event.device}</TableCell>
                        <TableCell>{event.timestamp}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(event.status)}>{(() => {
                            if (event.status === "success") return "Sucesso";
                            if (event.status === "failed") return "Falha";
                            return event.status;
                          })()}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  )
}
