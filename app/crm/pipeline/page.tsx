"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, DollarSign, Calendar, User, Building2, TrendingUp, Clock } from "lucide-react"

const pipelineStages = [
  {
    id: "prospeccao",
    name: "Prospecção",
    deals: [
      {
        id: 1,
        title: "Negócio de Software Corporativo",
        company: "Tech Corp",
        value: 45000,
        probability: 20,
        closeDate: "2024-03-15",
        contact: "João Silva",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      {
        id: 2,
        title: "Automação de Marketing",
        company: "Growth Co",
        value: 25000,
        probability: 15,
        closeDate: "2024-03-20",
        contact: "Sara Wilson",
        avatar: "/placeholder.svg?height=32&width=32",
      },
    ],
  },
  {
    id: "qualificacao",
    name: "Qualificação",
    deals: [
      {
        id: 3,
        title: "Implementação de CRM",
        company: "Business Inc",
        value: 35000,
        probability: 40,
        closeDate: "2024-02-28",
        contact: "Miguel Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      {
        id: 4,
        title: "Migração para Nuvem",
        company: "Data Systems",
        value: 60000,
        probability: 35,
        closeDate: "2024-03-10",
        contact: "Emilia Dias",
        avatar: "/placeholder.svg?height=32&width=32",
      },
    ],
  },
  {
    id: "proposta",
    name: "Proposta",
    deals: [
      {
        id: 5,
        title: "Auditoria de Segurança",
        company: "Finance Corp",
        value: 18000,
        probability: 60,
        closeDate: "2024-02-15",
        contact: "Roberto Souza",
        avatar: "/placeholder.svg?height=32&width=32",
      },
    ],
  },
  {
    id: "negociacao",
    name: "Negociação",
    deals: [
      {
        id: 6,
        title: "Transformação Digital",
        company: "Retail Plus",
        value: 85000,
        probability: 80,
        closeDate: "2024-02-10",
        contact: "Luisa Andrade",
        avatar: "/placeholder.svg?height=32&width=32",
      },
    ],
  },
  {
    id: "fechado",
    name: "Fechado (Ganho)",
    deals: [
      {
        id: 7,
        title: "Redesign de Website",
        company: "Creative Agency",
        value: 15000,
        probability: 100,
        closeDate: "2024-01-30",
        contact: "David Miller",
        avatar: "/placeholder.svg?height=32&width=32",
      },
    ],
  },
]

export default function PipelinePage() {
  const [isAddDealOpen, setIsAddDealOpen] = useState(false)

  const getTotalValue = (deals: any[]) => {
    return deals.reduce((sum, deal) => sum + deal.value, 0)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return "bg-green-100 text-green-800"
    if (probability >= 60) return "bg-blue-100 text-blue-800"
    if (probability >= 40) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
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
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/crm">CRM</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Pipeline</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pipeline de Vendas</h1>
            <p className="text-muted-foreground">Acompanhe seus negócios ao longo do processo de vendas</p>
          </div>
          <Dialog open={isAddDealOpen} onOpenChange={setIsAddDealOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Negócio
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Novo Negócio</DialogTitle>
                <DialogDescription>Crie um novo negócio no seu pipeline de vendas.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="deal-title" className="text-right">
                    Título
                  </Label>
                  <Input id="deal-title" className="col-span-3" placeholder="Digite o título" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="company" className="text-right">
                    Empresa
                  </Label>
                  <Input id="company" className="col-span-3" placeholder="Digite a empresa" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="value" className="text-right">
                    Valor
                  </Label>
                  <Input id="value" type="number" className="col-span-3" placeholder="Digite o valor" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="stage" className="text-right">
                    Etapa
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione a etapa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prospeccao">Prospecção</SelectItem>
                      <SelectItem value="qualificacao">Qualificação</SelectItem>
                      <SelectItem value="proposta">Proposta</SelectItem>
                      <SelectItem value="negociacao">Negociação</SelectItem>
                      <SelectItem value="fechado">Fechado (Ganho)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="close-date" className="text-right">
                    Data de Fechamento
                  </Label>
                  <Input id="close-date" type="date" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Observações
                  </Label>
                  <Textarea id="notes" className="col-span-3" placeholder="Adicione observações" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={() => setIsAddDealOpen(false)}>
                  Salvar Negócio
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Pipeline Overview */}
        <div className="grid gap-4 md:grid-cols-5">
          {pipelineStages.map((stage) => (
            <Card key={stage.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{stage.name}</CardTitle>
                <div className="text-2xl font-bold">{formatCurrency(getTotalValue(stage.deals))}</div>
                <p className="text-xs text-muted-foreground">
                  {stage.deals.length} negócio{stage.deals.length !== 1 ? "s" : ""}
                </p>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Pipeline Kanban Board */}
        <div className="grid gap-4 md:grid-cols-5">
          {pipelineStages.map((stage) => (
            <Card key={stage.id} className="h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  {stage.name}
                  <Badge variant="secondary">{stage.deals.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stage.deals.map((deal) => (
                  <Card key={deal.id} className="p-3 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="space-y-2">
                      <div className="font-medium text-sm">{deal.title}</div>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Building2 className="h-3 w-3" />
                        <span>{deal.company}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>{deal.contact}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-sm font-medium">
                          <DollarSign className="h-3 w-3" />
                          <span>{formatCurrency(deal.value)}</span>
                        </div>
                        <Badge className={getProbabilityColor(deal.probability)}>{deal.probability}%</Badge>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{deal.closeDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={deal.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">
                            {deal.contact
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{deal.contact}</span>
                      </div>
                    </div>
                  </Card>
                ))}
                {stage.deals.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground py-8">Nenhum negócio nesta etapa</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pipeline Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total do Pipeline</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(pipelineStages.reduce((total, stage) => total + getTotalValue(stage.deals), 0))}
              </div>
              <p className="text-xs text-muted-foreground">Em todas as etapas do pipeline</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  pipelineStages.reduce((total, stage) => total + getTotalValue(stage.deals), 0) /
                    pipelineStages.reduce((total, stage) => total + stage.deals.length, 0),
                )}
              </div>
              <p className="text-xs text-muted-foreground">Por negócio no pipeline</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Negócios no Mês</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pipelineStages.reduce((total, stage) => total + stage.deals.length, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Oportunidades ativas</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  )
}
