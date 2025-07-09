"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Mail,
  Send,
  Star,
  Reply,
  Plus,
  Settings,
  RefreshCw,
  BarChart3,
  FileText,
  Search,
  Filter,
  SortAsc,
  Inbox,
  Archive,
  Trash2,
  MoreVertical,
  Forward,
  StarOff,
  Paperclip,
  Download,
  Flag,
  Tag,
  RotateCcw,
  AlertTriangle,
  Eye
} from "lucide-react"
import { EmailComposer } from "@/components/email/email-composer"
import { EmailStats } from "@/components/email/email-stats"
import { EmailSettings } from "@/components/email/email-settings"
import { useEmail } from "@/hooks/use-email"
import { useToast } from "@/hooks/use-toast"

// Tipos de dados
interface EmailAttachment {
  name: string
  size: string
  type: string
}

interface EmailData {
  id: number
  from?: string
  fromEmail?: string
  to?: string
  toName?: string
  subject: string
  preview: string
  timestamp: string
  date: string
  read?: boolean
  starred: boolean
  folder: string
  avatar?: string
  body: string
  priority: "high" | "medium" | "low"
  labels?: string[]
  attachments?: EmailAttachment[]
}

// Dados iniciais completos dos e-mails
const initialEmails: EmailData[] = [
  {
    id: 1,
    from: "Alice Cooper",
    fromEmail: "alice.cooper@techstart.com",
    subject: "Re: Enterprise Solution Inquiry",
    preview: "Thank you for the detailed proposal. I have a few questions about the implementation timeline...",
    timestamp: "10:30 AM",
    date: "2025-01-09",
    read: false,
    starred: true,
    folder: "inbox",
    avatar: "/placeholder.svg?height=32&width=32",
    body: `
      <p>Olá,</p>
      <p>Thank you for the detailed proposal. I have a few questions about the implementation timeline and the training process for our team.</p>
      <p>Could we schedule a call to discuss these details further?</p>
      <p>Best regards,<br>Alice Cooper</p>
    `,
    priority: "high",
    labels: ["cliente", "proposta"],
    attachments: [
      { name: "proposal.pdf", size: "2.4 MB", type: "application/pdf" }
    ]
  },
  {
    id: 2,
    from: "Bob Martinez",
    fromEmail: "bob.martinez@innovate.co",
    subject: "Demo Feedback",
    preview: "The demo was excellent! Our team is very impressed with the features and functionality...",
    timestamp: "Yesterday",
    date: "2025-01-08",
    read: true,
    starred: false,
    folder: "inbox",
    avatar: "/placeholder.svg?height=32&width=32",
    body: `
      <p>Hi there,</p>
      <p>The demo was excellent! Our team is very impressed with the features and functionality.</p>
      <p>We'd like to move forward with the next steps. What would be the best time for a follow-up meeting?</p>
      <p>Thanks,<br>Bob Martinez</p>
    `,
    priority: "medium",
    labels: ["demo", "feedback"],
    attachments: []
  },
  {
    id: 3,
    from: "Carol Johnson",
    fromEmail: "carol.j@futuretech.io",
    subject: "Pricing Information Request",
    preview: "Could you please send me the detailed pricing breakdown for the enterprise package...",
    timestamp: "2 days ago",
    date: "2025-01-07",
    read: true,
    starred: false,
    folder: "inbox",
    avatar: "/placeholder.svg?height=32&width=32",
    body: `
      <p>Hello,</p>
      <p>Could you please send me the detailed pricing breakdown for the enterprise package?</p>
      <p>We're particularly interested in the volume discounts and annual payment options.</p>
      <p>Looking forward to your response.</p>
    `,
    priority: "medium",
    labels: ["pricing", "enterprise"],
    attachments: []
  },
  {
    id: 4,
    from: "David Kim",
    fromEmail: "david.kim@nextsol.com",
    subject: "Follow-up Meeting",
    preview: "I wanted to follow up on our conversation last week about the integration possibilities...",
    timestamp: "3 days ago",
    date: "2025-01-06",
    read: false,
    starred: false,
    folder: "inbox",
    avatar: "/placeholder.svg?height=32&width=32",
    body: `
      <p>Hi,</p>
      <p>I wanted to follow up on our conversation last week about the integration possibilities with our existing systems.</p>
      <p>When would be a good time to schedule a technical discussion?</p>
      <p>Best,<br>David Kim</p>
    `,
    priority: "low",
    labels: ["follow-up", "integração"],
    attachments: []
  },
  // E-mails enviados
  {
    id: 101,
    to: "alice.cooper@techstart.com",
    toName: "Alice Cooper",
    subject: "Enterprise Solution Proposal",
    preview: "Thank you for your interest in our enterprise solution. Please find attached...",
    timestamp: "Yesterday",
    date: "2025-01-08",
    starred: false,
    folder: "sent",
    body: `
      <p>Dear Alice,</p>
      <p>Thank you for your interest in our enterprise solution. Please find attached our comprehensive proposal.</p>
      <p>I'm available for a call this week to discuss any questions you might have.</p>
      <p>Best regards,<br>Sales Team</p>
    `,
    priority: "medium",
    attachments: [
      { name: "enterprise-proposal.pdf", size: "3.2 MB", type: "application/pdf" }
    ]
  },
  {
    id: 102,
    to: "bob.martinez@innovate.co",
    toName: "Bob Martinez",
    subject: "Demo Follow-up",
    preview: "Thank you for attending our demo session. Here are the next steps...",
    timestamp: "2 days ago",
    date: "2025-01-07",
    starred: false,
    folder: "sent",
    body: `
      <p>Hi Bob,</p>
      <p>Thank you for attending our demo session. Here are the next steps we discussed:</p>
      <ul>
        <li>Technical integration meeting</li>
        <li>Pricing discussion</li>
        <li>Timeline planning</li>
      </ul>
      <p>Looking forward to continuing our conversation.</p>
    `,
    priority: "medium",
    attachments: []
  },
  // Rascunhos
  {
    id: 201,
    to: "prospect@example.com",
    toName: "New Prospect",
    subject: "Welcome to Our Platform",
    preview: "Welcome to our platform! We're excited to have you on board...",
    timestamp: "Draft",
    date: "2025-01-09",
    starred: false,
    folder: "drafts",
    body: `
      <p>Dear [Name],</p>
      <p>Welcome to our platform! We're excited to have you on board.</p>
      <p>TODO: Add more content here...</p>
    `,
    priority: "medium",
    attachments: []
  },
  // E-mails arquivados
  {
    id: 301,
    from: "Old Client",
    fromEmail: "old@client.com",
    subject: "Project Completion",
    preview: "The project has been completed successfully...",
    timestamp: "Last month",
    date: "2024-12-15",
    read: true,
    starred: false,
    folder: "archived",
    body: `<p>The project has been completed successfully. Thank you for your business.</p>`,
    priority: "low",
    attachments: []
  },
  // E-mails na lixeira
  {
    id: 401,
    from: "Spam Sender",
    fromEmail: "spam@example.com",
    subject: "You've won a million dollars!",
    preview: "Congratulations! You've won...",
    timestamp: "Last week",
    date: "2025-01-02",
    read: false,
    starred: false,
    folder: "trash",
    body: `<p>This is obviously spam content...</p>`,
    priority: "low",
    attachments: []
  }
]
const folders = [
  { name: "inbox", label: "Caixa de Entrada", icon: Inbox, count: 4 },
  { name: "sent", label: "Enviados", icon: Send, count: 2 },
  { name: "drafts", label: "Rascunhos", icon: FileText, count: 1 },
  { name: "starred", label: "Favoritos", icon: Star, count: 1 },
  { name: "archived", label: "Arquivados", icon: Archive, count: 1 },
  { name: "spam", label: "Spam", icon: AlertTriangle, count: 0 },
  { name: "trash", label: "Lixeira", icon: Trash2, count: 1 },
]

const priorityColors = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  low: "bg-green-100 text-green-700 border-green-200"
}

export default function EmailPage() {
  const [emails, setEmails] = useState<EmailData[]>(initialEmails)
  const [selectedEmail, setSelectedEmail] = useState<EmailData | null>(emails[0] || null)
  const [selectedFolder, setSelectedFolder] = useState("inbox")
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [isReplyOpen, setIsReplyOpen] = useState(false)
  const [isForwardOpen, setIsForwardOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("emails")
  const [sortBy, setSortBy] = useState("date")
  const [filterBy, setFilterBy] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [emailToDelete, setEmailToDelete] = useState<number | null>(null)
  
  const { getDrafts } = useEmail()
  const { toast } = useToast()

  const [drafts, setDrafts] = useState<any[]>([])

  useEffect(() => {
    setDrafts(getDrafts())
  }, [getDrafts])

  // Função para obter emails filtrados por pasta
  const getEmailsByFolder = (folder: string) => {
    if (folder === "starred") {
      return emails.filter(email => email.starred && email.folder !== "trash")
    }
    return emails.filter(email => email.folder === folder)
  }

  // Função para filtrar emails por busca
  const filteredEmails = getEmailsByFolder(selectedFolder).filter(
    (email) =>
      (email.from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       email.to?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
       email.preview.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Atualizar contadores das pastas
  const updateFolderCounts = () => {
    return folders.map(folder => ({
      ...folder,
      count: folder.name === "starred" 
        ? emails.filter(email => email.starred && email.folder !== "trash").length
        : emails.filter(email => email.folder === folder.name).length
    }))
  }

  const handleEmailClick = (email: EmailData) => {
    setSelectedEmail(email)
    // Mark as read
    if (email.read === false) {
      setEmails(prev => 
        prev.map(e => e.id === email.id ? { ...e, read: true } : e)
      )
    }
  }

  const handleStarToggle = (emailId: number) => {
    setEmails(prev => 
      prev.map(email => 
        email.id === emailId ? { ...email, starred: !email.starred } : email
      )
    )
    
    if (selectedEmail?.id === emailId) {
      setSelectedEmail(prev => prev ? { ...prev, starred: !prev.starred } : null)
    }

    toast({
      title: "E-mail atualizado",
      description: "Status de favorito alterado com sucesso."
    })
  }

  const handleArchiveEmail = (emailId: number) => {
    setEmails(prev => 
      prev.map(email => 
        email.id === emailId ? { ...email, folder: "archived" } : email
      )
    )

    toast({
      title: "E-mail arquivado",
      description: "E-mail movido para a pasta Arquivados."
    })

    // Se o email selecionado foi arquivado e estamos na pasta atual, selecionar próximo
    if (selectedEmail?.id === emailId && selectedFolder !== "archived") {
      const currentEmails = filteredEmails
      const currentIndex = currentEmails.findIndex(e => e.id === emailId)
      const nextEmail = currentEmails[currentIndex + 1] || currentEmails[currentIndex - 1]
      setSelectedEmail(nextEmail || null)
    }
  }

  const handleDeleteEmail = (emailId: number) => {
    const email = emails.find(e => e.id === emailId)
    if (!email) return

    if (email.folder === "trash") {
      // Deletar permanentemente
      setEmails(prev => prev.filter(e => e.id !== emailId))
      
      if (selectedEmail?.id === emailId) {
        const remaining = filteredEmails.filter(e => e.id !== emailId)
        setSelectedEmail(remaining[0] || null)
      }

      toast({
        title: "E-mail deletado",
        description: "E-mail deletado permanentemente."
      })
    } else {
      // Mover para lixeira
      setEmails(prev => 
        prev.map(e => 
          e.id === emailId ? { ...e, folder: "trash" } : e
        )
      )

      toast({
        title: "E-mail movido",
        description: "E-mail movido para a Lixeira."
      })

      // Se o email selecionado foi deletado e estamos na pasta atual, selecionar próximo
      if (selectedEmail?.id === emailId && selectedFolder !== "trash") {
        const currentEmails = filteredEmails
        const currentIndex = currentEmails.findIndex(e => e.id === emailId)
        const nextEmail = currentEmails[currentIndex + 1] || currentEmails[currentIndex - 1]
        setSelectedEmail(nextEmail || null)
      }
    }
  }

  const handleRestoreEmail = (emailId: number) => {
    setEmails(prev => 
      prev.map(email => 
        email.id === emailId ? { ...email, folder: "inbox" } : email
      )
    )

    toast({
      title: "E-mail restaurado",
      description: "E-mail restaurado para a Caixa de Entrada."
    })
  }

  const handleReply = (email: EmailData) => {
    setSelectedEmail(email)
    setIsReplyOpen(true)
  }

  const handleForward = (email: EmailData) => {
    setSelectedEmail(email)
    setIsForwardOpen(true)
  }

  const confirmDelete = (emailId: number) => {
    setEmailToDelete(emailId)
    setDeleteDialogOpen(true)
  }

  const executeDelete = () => {
    if (emailToDelete) {
      handleDeleteEmail(emailToDelete)
      setEmailToDelete(null)
    }
    setDeleteDialogOpen(false)
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return "🔴"
      case "medium":
        return "🟡"
      case "low":
        return "🟢"
      default:
        return ""
    }
  }

  const updatedFolders = updateFolderCounts()

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
            <h1 className="text-3xl font-bold tracking-tight">E-mail Marketing</h1>
            <p className="text-muted-foreground">Gerencie suas comunicações, campanhas e analytics</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
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
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Escrever E-mail</DialogTitle>
                  <DialogDescription>
                    Crie e envie uma nova mensagem usando nosso editor avançado com integração MailerSend.
                  </DialogDescription>
                </DialogHeader>
                <EmailComposer onClose={() => setIsComposeOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="emails" className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>E-mails</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Templates</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="emails" className="space-y-6">
            {/* Email Statistics - Quick View */}
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

            <div className="grid gap-4 lg:grid-cols-4">
              {/* Email Folders */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pastas</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {updatedFolders.map((folder) => {
                      const IconComponent = folder.icon
                      return (
                        <button
                          key={folder.name}
                          className={`w-full flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                            selectedFolder === folder.name ? "bg-muted" : ""
                          } text-left border-0 bg-transparent`}
                          onClick={() => {
                            setSelectedFolder(folder.name)
                            const folderEmails = getEmailsByFolder(folder.name)
                            setSelectedEmail(folderEmails[0] || null)
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <IconComponent className="h-4 w-4" />
                            <span className="text-sm font-medium">{folder.label}</span>
                          </div>
                          {folder.count > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {folder.count}
                            </Badge>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Email List */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {folders.find(f => f.name === selectedFolder)?.label}
                    </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{filteredEmails.length}</Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Filter className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setFilterBy("all")}>
                              Todos
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterBy("unread")}>
                              Não lidos
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterBy("starred")}>
                              Favoritos
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <SortAsc className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setSortBy("date")}>
                              Data
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortBy("sender")}>
                              Remetente
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortBy("subject")}>
                              Assunto
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
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
                    {filteredEmails.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        <Mail className="mx-auto h-8 w-8 mb-2" />
                        <p>Nenhum e-mail encontrado</p>
                      </div>
                    ) : (
                      filteredEmails.map((email) => (
                        <button
                          key={email.id}
                          className={`w-full flex items-start space-x-3 p-4 hover:bg-muted/50 border-b transition-colors ${
                            selectedEmail?.id === email.id ? "bg-muted" : ""
                          } ${!email.read ? "bg-blue-50/50 border-l-2 border-l-blue-500" : ""} text-left border-0 bg-transparent`}
                          onClick={() => handleEmailClick(email)}
                        >
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src={email.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {(email.from || email.toName || "U")
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={`text-sm truncate ${!email.read ? "font-semibold" : "font-medium"}`}>
                                {email.from || email.toName || "Desconhecido"}
                              </p>
                              <div className="flex items-center space-x-1">
                                <span className="text-xs">{getPriorityIcon(email.priority)}</span>
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
                            <div className="flex items-center space-x-1 mt-2">
                              {email.attachments && email.attachments.length > 0 && (
                                <Paperclip className="h-3 w-3 text-muted-foreground" />
                              )}
                              {email.labels?.map((label) => (
                                <Badge key={label} variant="outline" className="text-xs">
                                  {label}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Email Content */}
              <Card className="lg:col-span-2">
                {selectedEmail ? (
                  <>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={selectedEmail.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {(selectedEmail.from || selectedEmail.toName || "U")
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{selectedEmail.subject}</CardTitle>
                            {selectedEmail.from ? (
                              <p className="text-sm text-muted-foreground">
                                De: {selectedEmail.from} &lt;{selectedEmail.fromEmail}&gt;
                              </p>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                Para: {selectedEmail.toName} &lt;{selectedEmail.to}&gt;
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">{selectedEmail.timestamp}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={priorityColors[selectedEmail.priority]}>
                                {selectedEmail.priority}
                              </Badge>
                              {selectedEmail.labels?.map((label) => (
                                <Badge key={label} variant="outline" className="text-xs">
                                  {label}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleStarToggle(selectedEmail.id)}
                          >
                            {selectedEmail.starred ? (
                              <StarOff className="h-4 w-4" />
                            ) : (
                              <Star className="h-4 w-4" />
                            )}
                          </Button>
                          
                          {selectedEmail.folder !== "sent" && selectedEmail.folder !== "drafts" && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleReply(selectedEmail)}
                            >
                              <Reply className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleForward(selectedEmail)}
                          >
                            <Forward className="h-4 w-4" />
                          </Button>
                          
                          {selectedEmail.folder !== "archived" && selectedEmail.folder !== "trash" && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleArchiveEmail(selectedEmail.id)}
                            >
                              <Archive className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {selectedEmail.folder === "trash" && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleRestoreEmail(selectedEmail.id)}
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => confirmDelete(selectedEmail.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Flag className="mr-2 h-4 w-4" />
                                Marcar como spam
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Tag className="mr-2 h-4 w-4" />
                                Adicionar etiqueta
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Marcar como lido
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Attachments */}
                      {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                          <h4 className="text-sm font-medium mb-2 flex items-center">
                            <Paperclip className="mr-2 h-4 w-4" />
                            Anexos ({selectedEmail.attachments.length})
                          </h4>
                          <div className="space-y-2">
                            {selectedEmail.attachments.map((attachment, index) => (
                              <div key={`${selectedEmail.id}-attachment-${index}`} className="flex items-center justify-between p-2 bg-background rounded border">
                                <div className="flex items-center space-x-2">
                                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                    📄
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">{attachment.name}</p>
                                    <p className="text-xs text-muted-foreground">{attachment.size}</p>
                                  </div>
                                </div>
                                <Button variant="outline" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="prose max-w-none">
                        <div 
                          className="text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-6 pt-4 border-t">
                        {selectedEmail.folder !== "sent" && selectedEmail.folder !== "drafts" && (
                          <Button onClick={() => handleReply(selectedEmail)}>
                            <Reply className="mr-2 h-4 w-4" />
                            Responder
                          </Button>
                        )}
                        <Button variant="outline" onClick={() => handleForward(selectedEmail)}>
                          <Forward className="mr-2 h-4 w-4" />
                          Encaminhar
                        </Button>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <CardContent className="flex items-center justify-center h-[600px]">
                    <div className="text-center">
                      <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold">Selecione um e-mail</h3>
                      <p className="text-muted-foreground">
                        Escolha um e-mail da lista para visualizar seu conteúdo.
                      </p>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <EmailStats />
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <EmailSettings />
          </TabsContent>
        </Tabs>

        {/* Reply Dialog */}
        <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Responder E-mail</DialogTitle>
              <DialogDescription>
                Responder para: {selectedEmail?.from} &lt;{selectedEmail?.fromEmail}&gt;
              </DialogDescription>
            </DialogHeader>
            <EmailComposer 
              onClose={() => setIsReplyOpen(false)} 
            />
          </DialogContent>
        </Dialog>

        {/* Forward Dialog */}
        <Dialog open={isForwardOpen} onOpenChange={setIsForwardOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Encaminhar E-mail</DialogTitle>
              <DialogDescription>
                Encaminhar: {selectedEmail?.subject}
              </DialogDescription>
            </DialogHeader>
            <EmailComposer 
              onClose={() => setIsForwardOpen(false)} 
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                {emailToDelete && emails.find(e => e.id === emailToDelete)?.folder === "trash"
                  ? "Esta ação irá deletar permanentemente este e-mail. Esta ação não pode ser desfeita."
                  : "Este e-mail será movido para a Lixeira. Você pode restaurá-lo mais tarde se necessário."
                }
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={executeDelete} className="bg-red-600 hover:bg-red-700">
                {emailToDelete && emails.find(e => e.id === emailToDelete)?.folder === "trash"
                  ? "Deletar Permanentemente"
                  : "Mover para Lixeira"
                }
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </SidebarInset>
  )
}
