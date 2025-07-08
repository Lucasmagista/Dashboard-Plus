"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Activity, Camera } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const activityData = [
  {
    id: 1,
    action: "Novo contato criado",
    details: "João Silva - Tech Corp",
    timestamp: "há 2 horas",
    type: "contact",
  },
  {
    id: 2,
    action: "Negócio atualizado",
    details: "Negócio de Software Empresarial - R$ 45.000",
    timestamp: "há 4 horas",
    type: "deal",
  },
  {
    id: 3,
    action: "E-mail enviado",
    details: "Follow-up com Sarah Johnson",
    timestamp: "há 6 horas",
    type: "email",
  },
  {
    id: 4,
    action: "Reunião agendada",
    details: "Chamada de demonstração com Mike Wilson",
    timestamp: "há 1 dia",
    type: "meeting",
  },
  {
    id: 5,
    action: "Negócio fechado",
    details: "Redesign de site - R$ 15.000",
    timestamp: "há 2 dias",
    type: "deal",
  },
]

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()

  const handleSaveProfile = () => {
    setIsEditing(false)
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    })
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "contact":
        return <User className="h-4 w-4 text-blue-600" />
      case "deal":
        return <Briefcase className="h-4 w-4 text-green-600" />
      case "email":
        return <Mail className="h-4 w-4 text-purple-600" />
      case "meeting":
        return <Calendar className="h-4 w-4 text-orange-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
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
                <BreadcrumbPage>Perfil</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Perfil</h1>
            <p className="text-muted-foreground">Gerencie suas informações pessoais e preferências</p>
          </div>
          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
          >
            {isEditing ? "Salvar Alterações" : "Editar Perfil"}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Profile Overview */}
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <div className="relative mx-auto">
                <Avatar className="h-24 w-24 mx-auto">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" />
                  <AvatarFallback className="text-2xl">JD</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-transparent"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <CardTitle className="text-xl">João da Silva</CardTitle>
              <CardDescription>Gerente de Vendas</CardDescription>
              <div className="flex justify-center space-x-2 mt-2">
                <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                <Badge variant="outline">Premium</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">joao@empresa.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">+55 (11) 91234-5678</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">São Paulo, SP</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Entrou em Jan 2023</span>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details */}
          <div className="md:col-span-2 space-y-4">
            <Tabs defaultValue="personal" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Informações Pessoais</TabsTrigger>
                <TabsTrigger value="activity">Atividade</TabsTrigger>
                <TabsTrigger value="preferences">Preferências</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <Card>
                  <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>Atualize seus dados pessoais e informações de contato</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">Nome</Label>
                        <Input id="first-name" defaultValue="João" disabled={!isEditing} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Sobrenome</Label>
                        <Input id="last-name" defaultValue="da Silva" disabled={!isEditing} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input id="email" type="email" defaultValue="joao@empresa.com" disabled={!isEditing} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input id="phone" defaultValue="+55 (11) 91234-5678" disabled={!isEditing} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="title">Cargo</Label>
                        <Input id="title" defaultValue="Gerente de Vendas" disabled={!isEditing} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Sobre</Label>
                      <Textarea
                        id="bio"
                        defaultValue="Gerente de vendas com mais de 8 anos de experiência em vendas B2B. Apaixonado por construir relacionamentos e impulsionar o crescimento de receita."
                        disabled={!isEditing}
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="department">Departamento</Label>
                        <Select defaultValue="sales" disabled={!isEditing}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sales">Vendas</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="support">Suporte</SelectItem>
                            <SelectItem value="management">Gestão</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Localização</Label>
                        <Input id="location" defaultValue="São Paulo, SP" disabled={!isEditing} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                <CardTitle>Estatísticas de Desempenho</CardTitle>
                <CardDescription>Métricas e conquistas de desempenho</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">247</div>
                        <div className="text-sm text-muted-foreground">Contatos</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">89</div>
                        <div className="text-sm text-muted-foreground">Negócios Fechados</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">$2.4M</div>
                        <div className="text-sm text-muted-foreground">Receita</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">94%</div>
                        <div className="text-sm text-muted-foreground">Meta</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
                <CardDescription>Suas ações e interações recentes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activityData.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium">{activity.action}</p>
                            <p className="text-sm text-muted-foreground">{activity.details}</p>
                            <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-4">
                <Card>
                  <CardHeader>
                <CardTitle>Preferências</CardTitle>
                <CardDescription>Personalize sua experiência e notificações</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Idioma</Label>
                      <Select defaultValue="pt">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pt">Português</SelectItem>
                          <SelectItem value="en">Inglês</SelectItem>
                          <SelectItem value="es">Espanhol</SelectItem>
                          <SelectItem value="fr">Francês</SelectItem>
                          <SelectItem value="de">Alemão</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Fuso Horário</Label>
                      <Select defaultValue="brt">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="brt">Horário de Brasília</SelectItem>
                          <SelectItem value="pst">Horário do Pacífico</SelectItem>
                          <SelectItem value="mst">Horário das Montanhas</SelectItem>
                          <SelectItem value="cst">Horário Central</SelectItem>
                          <SelectItem value="est">Horário do Leste</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date-format">Formato de Data</Label>
                      <Select defaultValue="dd-mm-yyyy">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dd-mm-yyyy">DD/MM/AAAA</SelectItem>
                          <SelectItem value="mm-dd-yyyy">MM/DD/AAAA</SelectItem>
                          <SelectItem value="yyyy-mm-dd">AAAA-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Moeda</Label>
                      <Select defaultValue="brl">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="brl">BRL (R$)</SelectItem>
                          <SelectItem value="usd">USD ($)</SelectItem>
                          <SelectItem value="eur">EUR (€)</SelectItem>
                          <SelectItem value="gbp">GBP (£)</SelectItem>
                          <SelectItem value="cad">CAD (C$)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}
