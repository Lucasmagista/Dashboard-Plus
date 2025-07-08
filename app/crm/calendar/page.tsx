"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Plus, Clock, Users, Video, Phone, MapPin, ChevronLeft, ChevronRight } from "lucide-react"

// Troque para useState para permitir edição dinâmica dos eventos
// Importa contatos do localStorage (ou mock)
let contacts: { id: number, name: string }[] = []
if (typeof window !== "undefined") {
  try {
    contacts = JSON.parse(localStorage.getItem("contacts") || "[]")
  } catch { contacts = [] }
}

const initialEvents = [
  {
    id: 1,
    title: "Reunião de Demonstração com TechStart Ltda",
    type: "reuniao",
    date: "2024-01-15",
    time: "10:00",
    duration: "1 hora",
    attendees: ["Alice Souza", "João Silva"],
    location: "Zoom",
    status: "confirmado",
    description: "Demonstração do produto para solução corporativa",
  },
  {
    id: 2,
    title: "Ligação de Acompanhamento",
    type: "ligacao",
    date: "2024-01-15",
    time: "14:00",
    duration: "30 min",
    attendees: ["Bruno Martins"],
    location: "Telefone",
    status: "confirmado",
    description: "Discutir preços e próximos passos",
  },
  {
    id: 3,
    title: "Reunião de Equipe",
    type: "reuniao",
    date: "2024-01-16",
    time: "09:00",
    duration: "30 min",
    attendees: ["Equipe de Vendas"],
    location: "Sala de Reunião A",
    status: "confirmado",
    description: "Sincronização diária da equipe e atualizações",
  },
  {
    id: 4,
    title: "Apresentação ao Cliente",
    type: "apresentacao",
    date: "2024-01-16",
    time: "15:00",
    duration: "2 horas",
    attendees: ["Carla Junqueira", "Daniela Kim"],
    location: "Escritório do Cliente",
    status: "pendente",
    description: "Apresentação final da proposta",
  },
]

const currentDate = new Date()
const currentMonth = currentDate.getMonth()
const currentYear = currentDate.getFullYear()

export default function CalendarPage() {
  const [events, setEvents] = useState(initialEvents)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month")

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getEventsForDate = (date: string) => {
    return events.filter((event) => event.date === date)
  }

  // Cores por tipo/status para eventos no calendário
  interface Event {
    id: number;
    title: string;
    type: string;
    date: string;
    time: string;
    duration: string;
    attendees: string[];
    location: string;
    status: string;
    description: string;
  }

  const getEventColor = (event: Event): string => {
    switch (event.type) {
      case "reuniao":
      case "meeting":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "ligacao":
      case "call":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "apresentacao":
      case "presentation":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      case "demo":
        return "bg-pink-100 text-pink-800 hover:bg-pink-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  // Modal de detalhes do evento
  // Estado tipado para detalhes do evento/modal
  const [eventDetail, setEventDetail] = useState<any | null>(null)

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-800"
      case "call":
        return "bg-green-100 text-green-800"
      case "presentation":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(selectedDate)
    const firstDay = getFirstDayOfMonth(selectedDate)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      const dayEvents = getEventsForDate(dateString)
      const isToday =
        day === currentDate.getDate() &&
        selectedDate.getMonth() === currentMonth &&
        selectedDate.getFullYear() === currentYear

      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-200 p-1 w-full text-left focus:outline-none relative ${isToday ? "bg-blue-50" : ""} ${selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear ? "ring-2 ring-blue-400" : ""}`}
        >
          <div className={`text-sm font-medium ${isToday ? "text-blue-600" : ""}`}>{day}</div>
          <div className="space-y-1 mt-1">
            {dayEvents.slice(0, 2).map((event) => (
              <button
                key={event.id}
                type="button"
                className={`w-full text-left text-xs p-1 rounded truncate cursor-pointer transition-colors ${getEventColor(event)}`}
                title={event.title}
                onClick={e => { e.stopPropagation(); setEventDetail(event); }}
                tabIndex={0}
              >
                {event.time} - {event.title}
              </button>
            ))}
            {dayEvents.length > 2 && (
              <button
                type="button"
                className="w-full text-left text-xs text-gray-500 underline cursor-pointer"
                onClick={e => { e.stopPropagation(); setEventDetail({ date: dateString, events: dayEvents }); }}
                tabIndex={0}
              >
                +{dayEvents.length - 2} mais
              </button>
            )}
          </div>
          <button
            type="button"
            className="absolute bottom-1 right-1 flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-zinc-900/80 dark:bg-zinc-900/80 hover:bg-blue-100 text-blue-700 border border-blue-200 shadow-sm transition-all font-medium backdrop-blur-sm"
            onClick={() => setEventDetail({ date: dateString, events: dayEvents })}
            tabIndex={0}
          >
            <Calendar className="h-3 w-3 mr-1" />eventos
          </button>
        </div>
      )
    }

    return days
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate)
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setSelectedDate(newDate)
  }

  // Modal para visualizar e editar eventos do dia selecionado
  const [editEvent, setEditEvent] = useState<any | null>(null)
  // Função para atualizar evento
  const handleUpdateEvent = (updatedEvent: any) => {
    setEvents(prev => prev.map(ev => ev.id === updatedEvent.id ? updatedEvent : ev))
    setEventDetail(null)
    setEditEvent(null)
  }
  // Função para adicionar novo evento
  const handleAddEvent = (newEvent: any) => {
    if (!newEvent) { setIsAddEventOpen(false); return; }
    setEvents(prev => [...prev, { ...newEvent, id: Date.now() }])
    setIsAddEventOpen(false)
  }
  // Função para deletar evento
  const handleDeleteEvent = (id: number) => {
    setEvents(prev => prev.filter(ev => ev.id !== id))
    setEventDetail(null)
    setEditEvent(null)
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
                <BreadcrumbPage>Agenda</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Agenda</h1>
            <p className="text-muted-foreground">Gerencie suas reuniões, ligações e compromissos</p>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={viewMode} onValueChange={(value: "month" | "week" | "day") => setViewMode(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="day">Day</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Evento
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl w-full">
                <DialogHeader>
                  <DialogTitle>Novo Evento</DialogTitle>
                  <DialogDescription>Agende uma nova reunião, ligação ou compromisso.</DialogDescription>
                </DialogHeader>
                <AddEventForm onAdd={handleAddEvent} defaultDate={selectedDate} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Calendar Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {getEventsForDate(currentDate.toISOString().split("T")[0]).length}
              </div>
              <p className="text-xs text-muted-foreground">Scheduled for today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.length}</div>
              <p className="text-xs text-muted-foreground">Total events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meetings</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.filter((e) => e.type === "meeting").length}</div>
              <p className="text-xs text-muted-foreground">Scheduled meetings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calls</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.filter((e) => e.type === "call").length}</div>
              <p className="text-xs text-muted-foreground">Scheduled calls</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Calendar View */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-0 mb-2">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                  <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0">{renderCalendarGrid()}</div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Your next scheduled events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {events.slice(0, 5).map((event) => (
                <button key={event.id} className="flex items-start space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-100 w-full text-left" onClick={() => setEventDetail(event)} tabIndex={0}>
                  <div className="flex-shrink-0">
                    {(event.type === "meeting" || event.type === "reuniao") && <Users className="h-5 w-5 text-blue-600" />}
                    {(event.type === "call" || event.type === "ligacao") && <Phone className="h-5 w-5 text-green-600" />}
                    {(event.type === "presentation" || event.type === "apresentacao") && <Video className="h-5 w-5 text-purple-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{event.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getEventColor(event)}>{event.type}</Badge>
                      <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Modal de eventos do dia selecionado ou detalhes de evento */}
        <Dialog open={!!eventDetail} onOpenChange={v => { if (!v) setEventDetail(null) }}>
          <DialogContent className="max-w-xl w-full p-0 overflow-hidden">
            {/* Se for lista de eventos do dia */}
            {Array.isArray(eventDetail?.events) ? (
              <div className="p-6">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold mb-2 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" /> Eventos em {eventDetail?.date ?? selectedDate.toLocaleDateString()}
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 mt-2">
                  {eventDetail.events.length === 0 && (
                    <div className="text-muted-foreground text-sm">Nenhum evento para este dia.</div>
                  )}
                  {eventDetail.events.map((ev: any) => (
                    <div key={ev.id} className="border rounded-lg p-4 bg-zinc-900/80 dark:bg-zinc-900/80 shadow-sm hover:bg-blue-50 dark:hover:bg-zinc-800 transition flex flex-col md:flex-row md:items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getEventColor(ev)}>{ev.type}</Badge>
                          <Badge className={getStatusColor(ev.status)}>{ev.status}</Badge>
                        </div>
                        <div className="font-semibold text-lg mb-1">{ev.title}</div>
                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-1">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {ev.time}</span>
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {ev.location}</span>
                        </div>
                        {ev.attendees && ev.attendees.length > 0 && (
                          <div className="text-xs text-muted-foreground mb-1"><b>Participantes:</b> {Array.isArray(ev.attendees) ? ev.attendees.join(", ") : ev.attendees}</div>
                        )}
                        {ev.contactId && ev.contactId !== 'none' && (
                          <div className="flex items-center gap-2 mt-1">
                            <img src="/placeholder-user.jpg" alt="Avatar" className="w-6 h-6 rounded-full border" />
                            <span className="text-xs font-medium">Contato Relacionado: {/* Nome do contato */} {(() => {
                              const c = contacts.find(c => String(c.id) === String(ev.contactId));
                              return c ? c.name : 'Contato';
                            })()}</span>
                          </div>
                        )}
                        {ev.description && (
                          <div className="text-xs mt-2 text-gray-700">{ev.description}</div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 md:items-end">
                        <Button size="sm" variant="outline" onClick={() => setEventDetail(ev)}>Ver Detalhes</Button>
                        <Button size="sm" onClick={() => setEditEvent(ev)}>Editar</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteEvent(ev.id)}>Excluir</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : eventDetail ? (
              // Detalhe de um evento único
              <div className="p-8 bg-gradient-to-br from-blue-50 via-white to-white min-w-[320px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold flex items-center gap-2 mb-2">
                    {eventDetail.type === 'reuniao' || eventDetail.type === 'meeting' ? <Users className="h-6 w-6 text-blue-600" /> : null}
                    {eventDetail.type === 'ligacao' || eventDetail.type === 'call' ? <Phone className="h-6 w-6 text-green-600" /> : null}
                    {eventDetail.type === 'apresentacao' || eventDetail.type === 'presentation' ? <Video className="h-6 w-6 text-purple-600" /> : null}
                    {eventDetail.type === 'demo' ? <Calendar className="h-6 w-6 text-pink-600" /> : null}
                    <span>{eventDetail.title}</span>
                  </DialogTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getEventColor(eventDetail)}>{eventDetail.type}</Badge>
                    <Badge className={getStatusColor(eventDetail.status)}>{eventDetail.status}</Badge>
                  </div>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span><b>Data:</b> {eventDetail.date}</span>
                      <span><b>Hora:</b> {eventDetail.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span><b>Local:</b> {eventDetail.location}</span>
                    </div>
                    {eventDetail.duration && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span><b>Duração:</b> {eventDetail.duration}</span>
                      </div>
                    )}
                    {eventDetail.attendees && eventDetail.attendees.length > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-blue-400" />
                        <span><b>Participantes:</b> {Array.isArray(eventDetail.attendees) ? eventDetail.attendees.join(", ") : eventDetail.attendees}</span>
                      </div>
                    )}
                    {eventDetail.contactId && eventDetail.contactId !== 'none' && (
                      <div className="flex items-center gap-2 text-sm mt-2">
                        <img src="/placeholder-user.jpg" alt="Avatar" className="w-7 h-7 rounded-full border" />
                        <span><b>Contato Relacionado:</b> {(() => {
                          const c = contacts.find(c => String(c.id) === String(eventDetail.contactId));
                          return c ? c.name : 'Contato';
                        })()}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    {eventDetail.description && (
                      <div className="bg-zinc-900 dark:bg-zinc-900 rounded-lg p-3 text-gray-100 text-sm shadow-inner">
                        <b>Descrição:</b>
                        <div className="mt-1 whitespace-pre-line">{eventDetail.description}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-6 justify-end">
                  <Button size="sm" onClick={() => setEditEvent(eventDetail)}>Editar</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteEvent(eventDetail.id)}>Excluir</Button>
                  <Button size="sm" variant="outline" onClick={() => setEventDetail(null)}>Fechar</Button>
                </div>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>

        {/* Modal de edição de evento */}
        <Dialog open={!!editEvent} onOpenChange={v => { if (!v) setEditEvent(null) }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Evento</DialogTitle>
            </DialogHeader>
            {editEvent && (
              <form onSubmit={e => { e.preventDefault(); handleUpdateEvent(editEvent); }} className="space-y-3">
                <div>
                  <Label>Título</Label>
                  <Input value={editEvent.title} onChange={e => setEditEvent({ ...editEvent, title: e.target.value })} />
                </div>
                <div>
                  <Label>Tipo</Label>
                  <Select value={editEvent.type} onValueChange={v => setEditEvent({ ...editEvent, type: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reuniao">Reunião</SelectItem>
                      <SelectItem value="ligacao">Ligação</SelectItem>
                      <SelectItem value="apresentacao">Apresentação</SelectItem>
                      <SelectItem value="demo">Demo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Data</Label>
                  <Input type="date" value={editEvent.date} onChange={e => setEditEvent({ ...editEvent, date: e.target.value })} />
                </div>
                <div>
                  <Label>Hora</Label>
                  <Input type="time" value={editEvent.time} onChange={e => setEditEvent({ ...editEvent, time: e.target.value })} />
                </div>
                <div>
                  <Label>Local</Label>
                  <Input value={editEvent.location} onChange={e => setEditEvent({ ...editEvent, location: e.target.value })} />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={editEvent.status} onValueChange={v => setEditEvent({ ...editEvent, status: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirmado">Confirmado</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Descrição</Label>
                  <Textarea value={editEvent.description} onChange={e => setEditEvent({ ...editEvent, description: e.target.value })} />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditEvent(null)} type="button">Cancelar</Button>
                  <Button type="submit">Salvar Alterações</Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </SidebarInset>
  )
}

// Formulário de adicionar evento
function AddEventForm({ onAdd, defaultDate }: { onAdd: (ev: any) => void, defaultDate: Date }) {
  const [form, setForm] = useState({
    title: '',
    type: 'reuniao',
    date: `${defaultDate.getFullYear()}-${String(defaultDate.getMonth() + 1).padStart(2, "0")}-${String(defaultDate.getDate()).padStart(2, "0")}`,
    time: '',
    duration: '',
    attendees: '',
    location: '',
    status: 'confirmado',
    description: '',
    contactId: 'none', // valor padrão para "Nenhum"
  })
  // Carregar contatos do localStorage se possível
  const [contactList, setContactList] = useState<{ id: number, name: string }[]>([])
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        setContactList(JSON.parse(localStorage.getItem("contacts") ?? "[]"))
      } catch { setContactList([]) }
    }
  }, [])
  return (
    <form className="flex flex-col gap-6 py-4 text-base" onSubmit={e => { e.preventDefault(); onAdd({ ...form, attendees: form.attendees.split(',').map(s => s.trim()) }); }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Título</Label>
          <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required maxLength={80} placeholder="Título do evento" />
        </div>
        <div>
          <Label>Tipo</Label>
          <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="reuniao">Reunião</SelectItem>
              <SelectItem value="ligacao">Ligação</SelectItem>
              <SelectItem value="apresentacao">Apresentação</SelectItem>
              <SelectItem value="demo">Demo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Data</Label>
          <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
        </div>
        <div>
          <Label>Hora</Label>
          <Input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} required />
        </div>
        <div>
          <Label>Duração</Label>
          <Input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="Ex: 1h, 30min" />
        </div>
        <div>
          <Label>Local</Label>
          <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Local, link ou telefone" />
        </div>
        <div>
          <Label>Contato Relacionado</Label>
          <Select value={form.contactId} onValueChange={v => setForm(f => ({ ...f, contactId: v }))}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um contato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhum</SelectItem>
              {contactList.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Participantes</Label>
          <Input value={form.attendees} onChange={e => setForm(f => ({ ...f, attendees: e.target.value }))} placeholder="Separe por vírgula" />
        </div>
        <div>
          <Label>Status</Label>
          <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="confirmado">Confirmado</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Label>Descrição</Label>
          <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Detalhes, link, pauta, etc." />
        </div>
      </div>
      <DialogFooter className="mt-2">
        <Button variant="outline" type="button" onClick={() => onAdd(null)}>Cancelar</Button>
        <Button type="submit">Salvar Evento</Button>
      </DialogFooter>
    </form>
  )
}
