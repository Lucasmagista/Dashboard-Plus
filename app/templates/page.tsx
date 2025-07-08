"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  Star,
  Mail,
  MessageSquare,
  FileText,
  Phone,
  Users,
  Filter,
  Download,
  Upload,
} from "lucide-react"

const templates = [
  {
    id: 1,
    name: "E-mail de Boas-vindas",
    type: "e-mail",
    category: "Onboarding",
    subject: "Bem-vindo à nossa plataforma!",
    content:
      "Olá {{firstName}},\n\nBem-vindo à nossa plataforma! Estamos muito felizes em tê-lo conosco.\n\nPara começar, clique no link abaixo para verificar seu e-mail:\n{{verificationLink}}\n\nSe tiver dúvidas, entre em contato com nosso suporte.\n\nAtenciosamente,\nEquipe",
    variables: ["firstName", "verificationLink"],
    usage: 1247,
    lastUsed: "há 2 horas",
    created: "2024-01-10",
    tags: ["boas-vindas", "onboarding", "verificação"],
    starred: true,
  },
  {
    id: 2,
    name: "Mensagem de Follow-up",
    type: "mensagem",
    category: "Vendas",
    subject: "",
    content:
      "Olá {{name}},\n\nGostaria de dar continuidade à nossa conversa sobre {{product}}. Tem alguma dúvida sobre a proposta que enviei?\n\nEstou disponível para uma ligação rápida se quiser discutir mais.\n\nAtenciosamente,\n{{senderName}}",
    variables: ["name", "product", "senderName"],
    usage: 856,
    lastUsed: "há 1 dia",
    created: "2024-01-08",
    tags: ["follow-up", "vendas", "proposta"],
    starred: false,
  },
  {
    id: 3,
    name: "Lembrete de Reunião",
    type: "e-mail",
    category: "Agendamento",
    subject: "Lembrete: Reunião amanhã às {{time}}",
    content:
      "Olá {{name}},\n\nEste é um lembrete da nossa reunião agendada para amanhã às {{time}}.\n\nDetalhes:\n- Data: {{date}}\n- Hora: {{time}}\n- Local: {{location}}\n- Pauta: {{agenda}}\n\nAguardo você!\n\nAtenciosamente,\n{{senderName}}",
    variables: ["name", "time", "date", "location", "agenda", "senderName"],
    usage: 432,
    lastUsed: "há 3 dias",
    created: "2024-01-05",
    tags: ["reunião", "lembrete", "agendamento"],
    starred: true,
  },
  {
    id: 4,
    name: "Resposta de Suporte",
    type: "mensagem",
    category: "Suporte",
    subject: "",
    content:
      "Olá {{customerName}},\n\nObrigado por entrar em contato com nosso suporte sobre {{issue}}.\n\nAnalisei seu caso e encontrei o seguinte:\n{{resolution}}\n\nPor favor, me avise se isso resolveu seu problema ou se precisa de mais ajuda.\n\nAtenciosamente,\n{{agentName}}\nEquipe de Suporte",
    variables: ["customerName", "issue", "resolution", "agentName"],
    usage: 678,
    lastUsed: "há 5 horas",
    created: "2024-01-03",
    tags: ["suporte", "resposta", "solução"],
    starred: false,
  },
  {
    id: 5,
    name: "Notificação de Fatura",
    type: "e-mail",
    category: "Cobrança",
    subject: "Fatura #{{invoiceNumber}} - Vencimento {{dueDate}}",
    content:
      "Olá {{customerName}},\n\nSua fatura #{{invoiceNumber}} referente a {{amount}} está disponível.\n\nVencimento: {{dueDate}}\nValor: {{amount}}\n\nVocê pode visualizar e pagar sua fatura no link abaixo:\n{{paymentLink}}\n\nObrigado pela preferência!\n\nAtenciosamente,\nEquipe Financeiro",
    variables: ["customerName", "invoiceNumber", "amount", "dueDate", "paymentLink"],
    usage: 234,
    lastUsed: "há 1 semana",
    created: "2024-01-01",
    tags: ["fatura", "cobrança", "pagamento"],
    starred: false,
  },
  {
    id: 6,
    name: "Convite para Evento",
    type: "e-mail",
    category: "Eventos",
    subject: "Convite: {{eventName}}",
    content:
      "Olá {{name}},\n\nVocê está convidado para {{eventName}}!\n\nDetalhes:\n- Data: {{eventDate}}\n- Hora: {{eventTime}}\n- Local: {{eventLocation}}\n- Descrição: {{eventDescription}}\n\nPor favor, confirme presença até {{rsvpDate}} clicando no link abaixo:\n{{rsvpLink}}\n\nEsperamos você lá!\n\nAtenciosamente,\n{{organizerName}}",
    variables: [
      "name",
      "eventName",
      "eventDate",
      "eventTime",
      "eventLocation",
      "eventDescription",
      "rsvpDate",
      "rsvpLink",
      "organizerName",
    ],
    usage: 145,
    lastUsed: "há 2 semanas",
    created: "2023-12-28",
    tags: ["evento", "convite", "rsvp"],
    starred: true,
  },
]

const categories = [
  "Todos",
  "Onboarding",
  "Vendas",
  "Suporte",
  "Agendamento",
  "Cobrança",
  "Eventos",
  "Marketing"
]
const types = ["Todos", "e-mail", "mensagem", "sms"]

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [selectedType, setSelectedType] = useState("Todos")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = selectedCategory === "Todos" || template.category === selectedCategory
    const matchesType = selectedType === "Todos" || template.type === selectedType
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesCategory && matchesType && matchesSearch
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "e-mail":
        return <Mail className="h-4 w-4" />
      case "mensagem":
        return <MessageSquare className="h-4 w-4" />
      case "sms":
        return <Phone className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "e-mail":
        return "bg-blue-100 text-blue-800"
      case "mensagem":
        return "bg-green-100 text-green-800"
      case "sms":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handlePreviewTemplate = (template: any) => {
    setSelectedTemplate(template)
    setIsPreviewOpen(true)
  }

  const handleEditTemplate = (template: any) => {
    setSelectedTemplate(template)
    setIsEditOpen(true)
  }

  const handleUseTemplate = (template: any) => {
    // Aqui você pode implementar a navegação para a tela de composição usando o modelo selecionado.
    alert(`Modelo selecionado: ${template.name}`)
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
                <BreadcrumbPage>Modelos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Modelos</h1>
            <p className="text-muted-foreground">Crie e gerencie modelos reutilizáveis de mensagens</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Importar
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Dialog open={isCreateTemplateOpen} onOpenChange={setIsCreateTemplateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar modelo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Criar novo modelo</DialogTitle>
                  <DialogDescription>Crie um modelo reutilizável para e-mails, mensagens ou SMS.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="template-name" className="text-right">
                      Nome
                    </Label>
                    <Input id="template-name" className="col-span-3" placeholder="Nome do modelo" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="template-type" className="text-right">
                      Tipo
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="e-mail">E-mail</SelectItem>
                        <SelectItem value="mensagem">Mensagem</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="template-category" className="text-right">
                      Categoria
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Onboarding">Onboarding</SelectItem>
                        <SelectItem value="Vendas">Vendas</SelectItem>
                        <SelectItem value="Suporte">Suporte</SelectItem>
                        <SelectItem value="Agendamento">Agendamento</SelectItem>
                        <SelectItem value="Cobrança">Cobrança</SelectItem>
                        <SelectItem value="Eventos">Eventos</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="template-subject" className="text-right">
                      Assunto
                    </Label>
                    <Input id="template-subject" className="col-span-3" placeholder="Assunto do e-mail (opcional)" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="template-content" className="text-right">
                      Conteúdo
                    </Label>
                    <Textarea
                      id="template-content"
                      className="col-span-3 min-h-[120px]"
                      placeholder="Conteúdo do modelo com {{variaveis}}"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="template-tags" className="text-right">
                      Tags
                    </Label>
                    <Input id="template-tags" className="col-span-3" placeholder="Tags separadas por vírgula" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateTemplateOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setIsCreateTemplateOpen(false)}>Criar modelo</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Template Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de modelos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{templates.length}</div>
              <p className="text-xs text-muted-foreground">Em todas as categorias</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mais usado</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.max(...templates.map((t) => t.usage)).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Modelo de boas-vindas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Favoritos</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{templates.filter((t) => t.starred).length}</div>
              <p className="text-xs text-muted-foreground">Modelos favoritos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Categorias</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length - 1}</div>
              <p className="text-xs text-muted-foreground">Categorias de modelos</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar modelos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {types.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === "Todos" ? "Todos os tipos" : type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Templates Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(template.type)}
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    {template.starred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                    <Badge className={getTypeColor(template.type)}>{template.type}</Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{template.category}</Badge>
                  <span className="text-sm text-muted-foreground">Usado {template.usage} vezes</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {template.subject && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Assunto:</p>
                    <p className="text-sm">{template.subject}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Prévia do conteúdo:</p>
                  <p className="text-sm line-clamp-3">{template.content.slice(0, 120)}...</p>
                </div>

                {template.variables.length > 0 && (
                  <div>
                  <span className="text-xs text-muted-foreground">Variáveis: {template.variables.join(", ")}</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-1">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Último uso: {template.lastUsed}</span>
                  <span>Criado em: {template.created}</span>
                </div>

                <div className="flex items-center justify-between">
                  <Button onClick={() => handleUseTemplate(template)}>Usar modelo</Button>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handlePreviewTemplate(template)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleEditTemplate(template)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="text-red-600 bg-transparent">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Template Preview Dialog */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Prévia do modelo: {selectedTemplate?.name}</DialogTitle>
              <DialogDescription>Veja como este modelo ficará ao ser utilizado.</DialogDescription>
            </DialogHeader>
            {selectedTemplate && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(selectedTemplate.type)}
                  <Badge className={getTypeColor(selectedTemplate.type)}>{selectedTemplate.type}</Badge>
                  <Badge variant="outline">{selectedTemplate.category}</Badge>
                </div>

                {selectedTemplate.subject && (
                  <div>
                    <Label className="text-sm font-medium">Assunto:</Label>
                    <p className="text-sm bg-muted p-2 rounded mt-1">{selectedTemplate.subject}</p>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium">Conteúdo:</Label>
                  <div className="text-sm bg-muted p-4 rounded mt-1 whitespace-pre-wrap">
                    {selectedTemplate.content}
                  </div>
                </div>

                {selectedTemplate.variables.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Variáveis:</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedTemplate.variables.map((variable: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {`{{${variable}}}`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Usado {selectedTemplate.usage} vezes</span>
                  <span>Último uso: {selectedTemplate.lastUsed}</span>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                Fechar
              </Button>
              <Button
                onClick={() => {
                  setIsPreviewOpen(false)
                  handleUseTemplate(selectedTemplate)
                }}
              >
                Usar modelo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Template Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Editar modelo: {selectedTemplate?.name}</DialogTitle>
              <DialogDescription>Faça alterações no seu modelo.</DialogDescription>
            </DialogHeader>
            {selectedTemplate && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Nome
                  </Label>
                  <Input id="edit-name" defaultValue={selectedTemplate.name} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-type" className="text-right">
                    Tipo
                  </Label>
                  <Select defaultValue={selectedTemplate.type}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="e-mail">E-mail</SelectItem>
                      <SelectItem value="mensagem">Mensagem</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-category" className="text-right">
                    Categoria
                  </Label>
                  <Select defaultValue={selectedTemplate.category.toLowerCase()}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Onboarding">Onboarding</SelectItem>
                      <SelectItem value="Vendas">Vendas</SelectItem>
                      <SelectItem value="Suporte">Suporte</SelectItem>
                      <SelectItem value="Agendamento">Agendamento</SelectItem>
                      <SelectItem value="Cobrança">Cobrança</SelectItem>
                      <SelectItem value="Eventos">Eventos</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {selectedTemplate.subject && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-subject" className="text-right">
                    Assunto
                    </Label>
                    <Input id="edit-subject" defaultValue={selectedTemplate.subject} className="col-span-3" />
                  </div>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-content" className="text-right">
                    Conteúdo
                  </Label>
                  <Textarea
                    id="edit-content"
                    defaultValue={selectedTemplate.content}
                    className="col-span-3 min-h-[120px]"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-tags" className="text-right">
                    Tags
                  </Label>
                  <Input id="edit-tags" defaultValue={selectedTemplate.tags.join(", ")} className="col-span-3" />
                </div>
              </div>
            )}
            <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setIsEditOpen(false)}>Salvar alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarInset>
  )
}
