"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
  MessageSquare,
  MoreHorizontal,
  Edit,
  Trash2,
  TrendingUp,
  Target,
  Star,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const leads = [
  {
    id: 1,
    name: "Alice Souza",
    email: "alice.souza@techstart.com",
    phone: "+55 (11) 92345-6789",
    company: "TechStart Ltda",
    source: "Site",
    status: "Novo",
    score: 85,
    value: 25000,
    lastContact: "2024-01-15",
    avatar: "/placeholder.svg?height=32&width=32",
    notes: "Interessada em solução corporativa",
  },
  {
    id: 2,
    name: "Bruno Martins",
    email: "bruno.martins@inovar.com",
    phone: "+55 (21) 93456-7890",
    company: "Inovar S.A.",
    source: "LinkedIn",
    status: "Qualificado",
    score: 92,
    value: 45000,
    lastContact: "2024-01-14",
    avatar: "/placeholder.svg?height=32&width=32",
    notes: "Pronto para apresentação de demo",
  },
  {
    id: 3,
    name: "Carla Junqueira",
    email: "carla.j@futuretech.io",
    phone: "+55 (31) 94567-8901",
    company: "FutureTech",
    source: "Indicação",
    status: "Contactado",
    score: 78,
    value: 35000,
    lastContact: "2024-01-13",
    avatar: "/placeholder.svg?height=32&width=32",
    notes: "Solicitou informações de preço",
  },
  {
    id: 4,
    name: "Daniela Kim",
    email: "daniela.kim@nextsol.com",
    phone: "+55 (41) 95678-9012",
    company: "NextSol",
    source: "E-mail Frio",
    status: "Nutrição",
    score: 65,
    value: 18000,
    lastContact: "2024-01-12",
    avatar: "/placeholder.svg?height=32&width=32",
    notes: "Retornar contato em 2 semanas",
  },
]

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState<any>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Novo":
        return "bg-blue-100 text-blue-800"
      case "Qualificado":
        return "bg-green-100 text-green-800"
      case "Contactado":
        return "bg-yellow-100 text-yellow-800"
      case "Nutrição":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const handleLeadClick = (lead: any) => {
    setSelectedLead(lead)
    setIsDetailDialogOpen(true)
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
                <BreadcrumbPage>Leads</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
            <p className="text-muted-foreground">Acompanhe e gerencie seus leads e oportunidades de venda</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Novo Lead</DialogTitle>
                <DialogDescription>Crie um novo lead no seu CRM.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lead-name" className="text-right">
                    Nome
                  </Label>
                  <Input id="lead-name" className="col-span-3" placeholder="Digite o nome" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lead-email" className="text-right">
                    E-mail
                  </Label>
                  <Input id="lead-email" type="email" className="col-span-3" placeholder="Digite o e-mail" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lead-phone" className="text-right">
                    Telefone
                  </Label>
                  <Input id="lead-phone" className="col-span-3" placeholder="Digite o telefone" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lead-company" className="text-right">
                    Empresa
                  </Label>
                  <Input id="lead-company" className="col-span-3" placeholder="Digite a empresa" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lead-source" className="text-right">
                    Origem
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione a origem" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="site">Site</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="indicacao">Indicação</SelectItem>
                      <SelectItem value="email-frio">E-mail Frio</SelectItem>
                      <SelectItem value="social-media">Mídia Social</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lead-value" className="text-right">
                    Valor Estimado
                  </Label>
                  <Input id="lead-value" type="number" className="col-span-3" placeholder="Digite o valor" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lead-notes" className="text-right">
                    Observações
                  </Label>
                  <Textarea id="lead-notes" className="col-span-3" placeholder="Adicione observações" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={() => setIsAddDialogOpen(false)}>
                  Salvar Lead
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lead Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leads.length}</div>
              <p className="text-xs text-muted-foreground">+12% em relação ao mês passado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leads Qualificados</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leads.filter((l) => l.status === "Qualificado").length}</div>
              <p className="text-xs text-muted-foreground">Oportunidades de alta qualidade</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média de Pontuação</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length)}
              </div>
              <p className="text-xs text-muted-foreground">De 0 a 100</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor no Pipeline</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R${leads.reduce((sum, lead) => sum + lead.value, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Receita potencial total</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gestão de Leads</CardTitle>
            <CardDescription>Visualize e gerencie todos os seus leads e oportunidades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button variant="outline" size="icon" title="Filtrar">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pontuação</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id} className="cursor-pointer" onClick={() => handleLeadClick(lead)}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={lead.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {lead.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{lead.name}</div>
                          <div className="text-sm text-muted-foreground">{lead.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{lead.company}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{lead.source}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className={`font-medium ${getScoreColor(lead.score)}`}>{lead.score}</span>
                        <Progress value={lead.score} className="w-16 h-2" />
                      </div>
                    </TableCell>
                    <TableCell>R${lead.value.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()} title="Enviar e-mail">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()} title="Ligar">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" title="Mais ações">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Converter em Negócio
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Lead Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Detalhes do Lead</DialogTitle>
              <DialogDescription>Informações detalhadas sobre {selectedLead?.name}</DialogDescription>
            </DialogHeader>
            {selectedLead && (
              <div className="grid gap-4 py-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedLead.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {selectedLead.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedLead.name}</h3>
                    <p className="text-muted-foreground">{selectedLead.company}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getStatusColor(selectedLead.status)}>{selectedLead.status}</Badge>
                      <Badge variant="outline">{selectedLead.source}</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">E-mail</Label>
                    <p className="text-sm text-muted-foreground">{selectedLead.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Telefone</Label>
                    <p className="text-sm text-muted-foreground">{selectedLead.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Pontuação</Label>
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium ${getScoreColor(selectedLead.score)}`}>{selectedLead.score}</span>
                      <Progress value={selectedLead.score} className="w-24 h-2" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Valor Estimado</Label>
                    <p className="text-sm text-muted-foreground">R${selectedLead.value.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Último Contato</Label>
                    <p className="text-sm text-muted-foreground">{selectedLead.lastContact}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Origem</Label>
                    <p className="text-sm text-muted-foreground">{selectedLead.source}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Observações</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedLead.notes}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                Fechar
              </Button>
              <Button>Converter em Negócio</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarInset>
  )
}
