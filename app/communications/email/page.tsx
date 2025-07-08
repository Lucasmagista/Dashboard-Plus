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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Send,
  Reply,
  Forward,
  Archive,
  Trash2,
  Star,
  Paperclip,
  Plus,
  Mail,
  Inbox,
  SendIcon as Sent,
  DraftingCompassIcon as Draft,
  SpellCheckIcon as Spam,
  RefreshCw,
} from "lucide-react"

const emails = [
  {
    id: 1,
    from: "Alice Cooper",
    fromEmail: "alice.cooper@techstart.com",
    subject: "Re: Enterprise Solution Inquiry",
    preview: "Thank you for the detailed proposal. I have a few questions about the implementation timeline...",
    timestamp: "10:30 AM",
    read: false,
    starred: true,
    folder: "inbox",
    avatar: "/placeholder.svg?height=32&width=32",
    body: "Thank you for the detailed proposal. I have a few questions about the implementation timeline and the training process for our team. Could we schedule a call to discuss these details further?",
  },
  {
    id: 2,
    from: "Bob Martinez",
    fromEmail: "bob.martinez@innovate.co",
    subject: "Demo Feedback",
    preview: "The demo was excellent! Our team is very impressed with the features and functionality...",
    timestamp: "Yesterday",
    read: true,
    starred: false,
    folder: "inbox",
    avatar: "/placeholder.svg?height=32&width=32",
    body: "The demo was excellent! Our team is very impressed with the features and functionality. We'd like to move forward with the next steps. What would be the best time for a follow-up meeting?",
  },
  {
    id: 3,
    from: "Carol Johnson",
    fromEmail: "carol.j@futuretech.io",
    subject: "Pricing Information Request",
    preview: "Could you please send me the detailed pricing breakdown for the enterprise package...",
    timestamp: "2 days ago",
    read: true,
    starred: false,
    folder: "inbox",
    avatar: "/placeholder.svg?height=32&width=32",
    body: "Could you please send me the detailed pricing breakdown for the enterprise package? We're particularly interested in the volume discounts and annual payment options.",
  },
  {
    id: 4,
    from: "David Kim",
    fromEmail: "david.kim@nextsol.com",
    subject: "Follow-up Meeting",
    preview: "I wanted to follow up on our conversation last week about the integration possibilities...",
    timestamp: "3 days ago",
    read: false,
    starred: false,
    folder: "inbox",
    avatar: "/placeholder.svg?height=32&width=32",
    body: "I wanted to follow up on our conversation last week about the integration possibilities with our existing systems. When would be a good time to schedule a technical discussion?",
  },
]

const folders = [
  { name: "Caixa de Entrada", icon: Inbox, count: 4 },
  { name: "Enviados", icon: Sent, count: 12 },
  { name: "Rascunhos", icon: Draft, count: 2 },
  { name: "Favoritos", icon: Star, count: 1 },
  { name: "Arquivados", icon: Archive, count: 45 },
  { name: "Spam", icon: Spam, count: 0 },
  { name: "Lixeira", icon: Trash2, count: 3 },
]

export default function EmailPage() {
  const [selectedEmail, setSelectedEmail] = useState(emails[0])
  const [selectedFolder, setSelectedFolder] = useState("Caixa de Entrada")
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredEmails = emails.filter(
    (email) =>
      email.folder === selectedFolder.toLowerCase() &&
      (email.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.preview.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleEmailClick = (email: any) => {
    setSelectedEmail(email)
    // Mark as read
    email.read = true
  }

  const handleStarToggle = (emailId: number) => {
    const email = emails.find((e) => e.id === emailId)
    if (email) {
      email.starred = !email.starred
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
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/communications">Comunicações</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>E-mail</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">E-mail</h1>
            <p className="text-muted-foreground">Gerencie suas comunicações e campanhas por e-mail</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo E-mail
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Escrever E-mail</DialogTitle>
                  <DialogDescription>Crie uma nova mensagem de e-mail.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="to" className="text-right">
                      Para
                    </Label>
                    <Input id="to" placeholder="destinatario@exemplo.com" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cc" className="text-right">
                      Cópia
                    </Label>
                    <Input id="cc" placeholder="copia@exemplo.com" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="subject" className="text-right">
                      Assunto
                    </Label>
                    <Input id="subject" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="template" className="text-right">
                      Modelo
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione o modelo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blank">Em branco</SelectItem>
                        <SelectItem value="follow-up">Follow-up</SelectItem>
                        <SelectItem value="proposal">Proposta</SelectItem>
                        <SelectItem value="meeting">Solicitação de Reunião</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="body" className="text-right mt-2">
                      Mensagem
                    </Label>
                    <Textarea id="body" rows={8} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Anexos</Label>
                    <Button variant="outline" className="col-span-3 justify-start bg-transparent">
                      <Paperclip className="mr-2 h-4 w-4" />
                      Adicionar Anexo
                    </Button>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
                    Salvar Rascunho
                  </Button>
                  <Button onClick={() => setIsComposeOpen(false)}>
                    <Send className="mr-2 h-4 w-4" />
                    Enviar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Email Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Não lidas</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{emails.filter((e) => !e.read).length}</div>
              <p className="text-xs text-muted-foreground">Novas mensagens</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enviadas Hoje</CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Mensagens enviadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Resposta</CardTitle>
              <Reply className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
              <p className="text-xs text-muted-foreground">Esta semana</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Favoritos</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{emails.filter((e) => e.starred).length}</div>
              <p className="text-xs text-muted-foreground">E-mails importantes</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {/* Email Folders */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pastas</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {folders.map((folder) => {
                  const IconComponent = folder.icon
                  return (
                    <div
                      key={folder.name}
                      className={`flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 ${
                        selectedFolder === folder.name ? "bg-muted" : ""
                      }`}
                      onClick={() => setSelectedFolder(folder.name)}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className="h-4 w-4" />
                        <span className="text-sm font-medium">{folder.name}</span>
                      </div>
                      {folder.count > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {folder.count}
                        </Badge>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Email List */}
          <Card className="md:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{selectedFolder}</CardTitle>
                <Badge variant="secondary">{filteredEmails.length}</Badge>
              </div>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar e-mails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                {filteredEmails.map((email) => (
                  <div
                    key={email.id}
                    className={`flex items-start space-x-3 p-4 cursor-pointer hover:bg-muted/50 border-b ${
                      selectedEmail.id === email.id ? "bg-muted" : ""
                    } ${!email.read ? "bg-blue-50/50" : ""}`}
                    onClick={() => handleEmailClick(email)}
                  >
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={email.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {email.from
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm truncate ${!email.read ? "font-semibold" : "font-medium"}`}>
                          {email.from}
                        </p>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleStarToggle(email.id)
                            }}
                          >
                            <Star className={`h-3 w-3 ${email.starred ? "fill-yellow-400 text-yellow-400" : ""}`} />
                          </Button>
                          <span className="text-xs text-muted-foreground">{email.timestamp}</span>
                        </div>
                      </div>
                      <p className={`text-sm truncate ${!email.read ? "font-medium" : ""}`}>{email.subject}</p>
                      <p className="text-xs text-muted-foreground truncate mt-1">{email.preview}</p>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Email Content */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedEmail.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {selectedEmail.from
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{selectedEmail.subject}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      From: {selectedEmail.from} &lt;{selectedEmail.fromEmail}&gt;
                    </p>
                    <p className="text-xs text-muted-foreground">{selectedEmail.timestamp}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon">
                    <Reply className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Forward className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-sm leading-relaxed">{selectedEmail.body}</p>
              </div>
              <div className="flex items-center space-x-2 mt-6 pt-4 border-t">
                <Button>
                  <Reply className="mr-2 h-4 w-4" />
                  Responder
                </Button>
                <Button variant="outline">
                  <Forward className="mr-2 h-4 w-4" />
                  Encaminhar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  )
}
