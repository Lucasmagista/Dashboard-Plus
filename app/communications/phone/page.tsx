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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import {
  Phone,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Search,
  Clock,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Calendar,
  Play,
} from "lucide-react"

const callHistory = [
  {
    id: 1,
    contact: "Alice Cooper",
    phone: "+1 (555) 234-5678",
    type: "outgoing",
    status: "completed",
    duration: "15:32",
    timestamp: "2024-01-15 10:30 AM",
    notes: "Discussed enterprise solution requirements",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    contact: "Bob Martinez",
    phone: "+1 (555) 345-6789",
    type: "incoming",
    status: "completed",
    duration: "8:45",
    timestamp: "2024-01-15 2:15 PM",
    notes: "Follow-up on demo feedback",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    contact: "Carol Johnson",
    phone: "+1 (555) 456-7890",
    type: "missed",
    status: "missed",
    duration: "0:00",
    timestamp: "2024-01-14 4:20 PM",
    notes: "Missed call - need to follow up",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 4,
    contact: "David Kim",
    phone: "+1 (555) 567-8901",
    type: "outgoing",
    status: "completed",
    duration: "22:18",
    timestamp: "2024-01-14 11:00 AM",
    notes: "Technical discussion about integration",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

const contacts = [
  { name: "Alice Cooper", phone: "+1 (555) 234-5678", company: "TechStart Inc" },
  { name: "Bob Martinez", phone: "+1 (555) 345-6789", company: "Innovate Co" },
  { name: "Carol Johnson", phone: "+1 (555) 456-7890", company: "FutureTech" },
  { name: "David Kim", phone: "+1 (555) 567-8901", company: "NextSol" },
]

export default function PhonePage() {
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false)
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState<"history" | "contacts" | "scheduled">("history")
  const [isInCall, setIsInCall] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(false)

  const getCallIcon = (type: string, status: string) => {
    if (status === "missed") return <PhoneMissed className="h-4 w-4 text-red-600" />
    if (type === "incoming") return <PhoneIncoming className="h-4 w-4 text-green-600" />
    if (type === "outgoing") return <PhoneOutgoing className="h-4 w-4 text-blue-600" />
    return <Phone className="h-4 w-4" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "missed":
        return "bg-red-100 text-red-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredHistory = callHistory.filter(
    (call) =>
      call.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.phone.includes(searchTerm) ||
      call.notes.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCall = (phone: string) => {
    setIsInCall(true)
    // Simulate call logic here
    console.log("Calling:", phone)
  }

  const handleEndCall = () => {
    setIsInCall(false)
    setIsMuted(false)
    setIsSpeakerOn(false)
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
                <BreadcrumbPage>Telefone</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Telefone</h1>
            <p className="text-muted-foreground">Faça ligações, acompanhe o histórico e gerencie comunicações telefônicas</p>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Agendar Ligação
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Agendar Ligação</DialogTitle>
                  <DialogDescription>Agende uma ligação com um contato.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="contact" className="text-right">
                      Contato
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione o contato" />
                      </SelectTrigger>
                      <SelectContent>
                        {contacts.map((contact) => (
                          <SelectItem key={contact.phone} value={contact.phone}>
                            {contact.name} - {contact.phone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">
                      Data
                    </Label>
                    <Input id="date" type="date" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="time" className="text-right">
                      Horário
                    </Label>
                    <Input id="time" type="time" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="purpose" className="text-right">
                      Motivo
                    </Label>
                    <Textarea id="purpose" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={() => setIsScheduleDialogOpen(false)}>
                    Agendar Ligação
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog open={isCallDialogOpen} onOpenChange={setIsCallDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Phone className="mr-2 h-4 w-4" />
                  Fazer Ligação
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Fazer Ligação</DialogTitle>
                  <DialogDescription>Digite um número ou selecione um contato para ligar.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone-number" className="text-right">
                      Telefone
                    </Label>
                    <Input id="phone-number" placeholder="+55 (11) 91234-5678" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="contact-select" className="text-right">
                      Ou Selecione
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione o contato" />
                      </SelectTrigger>
                      <SelectContent>
                        {contacts.map((contact) => (
                          <SelectItem key={contact.phone} value={contact.phone}>
                            {contact.name} - {contact.phone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="call-notes" className="text-right">
                      Observações
                    </Label>
                    <Textarea id="call-notes" placeholder="Motivo da ligação ou observações..." className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={() => {
                      setIsCallDialogOpen(false)
                      handleCall("+1 (555) 123-4567")
                    }}
                  >
                    <PhoneCall className="mr-2 h-4 w-4" />
                    Ligar Agora
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Call Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Ligações</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{callHistory.length}</div>
              <p className="text-xs text-muted-foreground">Esta semana</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ligações Perdidas</CardTitle>
              <PhoneMissed className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{callHistory.filter((c) => c.status === "missed").length}</div>
              <p className="text-xs text-muted-foreground">Necessita retorno</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Duração Média</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12:45</div>
              <p className="text-xs text-muted-foreground">Por ligação</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
              <PhoneCall className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground">Ligações conectadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Call Interface */}
        {isInCall && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-center text-green-800">Ligação em Andamento</CardTitle>
              <CardDescription className="text-center">Conectado a +1 (555) 123-4567</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center space-x-4">
                <Button variant={isMuted ? "default" : "outline"} size="icon" onClick={() => setIsMuted(!isMuted)}>
                  {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button
                  variant={isSpeakerOn ? "default" : "outline"}
                  size="icon"
                  onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                >
                  {isSpeakerOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
                <Button variant="destructive" onClick={handleEndCall}>
                  Encerrar Ligação
                </Button>
              </div>
              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">Duração: 00:45</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Phone Interface */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Navigation Tabs */}
          <Card className="md:col-span-3">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Button
                  variant={selectedTab === "history" ? "default" : "outline"}
                  onClick={() => setSelectedTab("history")}
                >
                  Histórico
                </Button>
                <Button
                  variant={selectedTab === "contacts" ? "default" : "outline"}
                  onClick={() => setSelectedTab("contacts")}
                >
                  Contatos
                </Button>
                <Button
                  variant={selectedTab === "scheduled" ? "default" : "outline"}
                  onClick={() => setSelectedTab("scheduled")}
                >
                  Agendadas
                </Button>
                <div className="flex-1" />
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedTab === "history" && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contato</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Duração</TableHead>
                      <TableHead>Horário</TableHead>
                      <TableHead>Observações</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHistory.map((call) => (
                      <TableRow key={call.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={call.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {call.contact
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{call.contact}</div>
                              <div className="text-sm text-muted-foreground">{call.phone}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getCallIcon(call.type, call.status)}
                            <span className="capitalize">
                              {(() => {
                                if (call.type === "incoming") return "Recebida"
                                if (call.type === "outgoing") return "Realizada"
                                if (call.type === "missed") return "Perdida"
                                return call.type
                              })()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(call.status)}>
                            {(() => {
                              if (call.status === "completed") return "Concluída"
                              if (call.status === "missed") return "Perdida"
                              if (call.status === "scheduled") return "Agendada"
                              return call.status
                            })()}
                          </Badge>
                        </TableCell>
                        <TableCell>{call.duration}</TableCell>
                        <TableCell>{call.timestamp}</TableCell>
                        <TableCell className="max-w-xs truncate">{call.notes}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => handleCall(call.phone)}>
                              <Phone className="h-4 w-4" />
                            </Button>
                            {call.status === "completed" && (
                              <Button variant="ghost" size="icon">
                                <Play className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {selectedTab === "contacts" && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContacts.map((contact) => (
                      <TableRow key={contact.phone}>
                        <TableCell className="font-medium">{contact.name}</TableCell>
                        <TableCell>{contact.phone}</TableCell>
                        <TableCell>{contact.company}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => handleCall(contact.phone)}>
                            <Phone className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {selectedTab === "scheduled" && (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhuma ligação agendada</p>
                  <Button className="mt-4" onClick={() => setIsScheduleDialogOpen(true)}>
                    Agendar Ligação
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  )
}
