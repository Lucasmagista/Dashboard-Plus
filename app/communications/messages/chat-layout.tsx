"use client"

import "./chat-layout.css"
import "@/app/globals.css"
import { useState, useRef } from "react"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Search,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  Info,
  Download,
  Check,
  CheckCheck,
  Clock,
  Play,
  Mic,
  File,
  Star,
  Reply,
  Forward,
  Bot,
  XCircle,
  Folder,
  MessageSquare,
  MoreVertical,
  Settings,
  Volume2,
  VolumeX,
  Pause
} from "lucide-react"

import { cn } from "@/lib/utils"
import { FilesModal } from "@/components/ui/files-modal"
import { ConversationMenu } from "@/components/ui/conversation-menu"
import { ContactProfileModal } from "@/components/ui/contact-profile-modal"
import { InfoModal } from "@/components/ui/info-modal"

// Interfaces
interface Conversation {
  id: number
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread: number
  platform: 'whatsapp' | 'telegram' | 'email' | 'sms' | 'instagram' | 'messenger'
  online: boolean
  typing: boolean
  pinned: boolean
  muted: boolean
  archived: boolean
  lastSeen: string
  assignedTo?: string
  priority: 'high' | 'medium' | 'low'
  category: 'lead' | 'customer' | 'support' | 'sales' | 'partner'
  sentiment: 'positive' | 'neutral' | 'negative'
}

interface Message {
  id: number
  sender: string
  content: string
  timestamp: string
  isOwn: boolean
  type: 'text' | 'file' | 'voice' | 'image' | 'video'
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed'
  reactions: Array<{ emoji: string; count: number }>
  replyTo: number | null
  forwarded: boolean
  edited: boolean
  starred: boolean
  fileName?: string
  fileSize?: string
  duration?: string
  waveform?: number[]
  aiInsights?: { sentiment: string; intent: string; confidence: number }
}

// Mock data
const conversations: Conversation[] = [
  {
    id: 1,
    name: "João Silva - TechCorp",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Perfeito! Podemos agendar a demonstração para amanhã?",
    timestamp: "2 min",
    unread: 3,
    platform: "whatsapp",
    online: true,
    typing: false,
    pinned: true,
    muted: false,
    archived: false,
    lastSeen: "agora",
    assignedTo: "Carlos Vendas",
    priority: "high",
    category: "lead",
    sentiment: "positive"
  },
  {
    id: 2,
    name: "Maria Santos",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Preciso de suporte urgente com a integração da API",
    timestamp: "15 min",
    unread: 1,
    platform: "telegram",
    online: false,
    typing: false,
    pinned: false,
    muted: false,
    archived: false,
    lastSeen: "15 min atrás",
    assignedTo: "Pedro Suporte",
    priority: "high",
    category: "support",
    sentiment: "neutral"
  },
  {
    id: 3,
    name: "Roberto Martins",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Obrigado pela proposta! Vou analisar com a equipe",
    timestamp: "1h",
    unread: 0,
    platform: "email",
    online: true,
    typing: false,
    pinned: false,
    muted: false,
    archived: false,
    lastSeen: "1h atrás",
    assignedTo: "Ana Vendas",
    priority: "medium",
    category: "lead",
    sentiment: "positive"
  }
]

const messages: Message[] = [
  {
    id: 1,
    sender: "João Silva - TechCorp",
    content: "Olá! Vi o vídeo de demonstração no YouTube e fiquei muito interessado na solução CRM de vocês.",
    timestamp: "09:15",
    isOwn: false,
    type: "text",
    status: "delivered",
    reactions: [],
    replyTo: null,
    forwarded: false,
    edited: false,
    starred: false,
    aiInsights: {
      sentiment: "positive",
      intent: "product_inquiry",
      confidence: 0.89
    }
  },
  {
    id: 2,
    sender: "Você",
    content: "Olá João! Muito obrigado pelo interesse! Para eu preparar a melhor proposta, poderia me contar sobre seus principais desafios?",
    timestamp: "09:18",
    isOwn: true,
    type: "text",
    status: "read",
    reactions: [{ emoji: "👍", count: 1 }],
    replyTo: null,
    forwarded: false,
    edited: false,
    starred: false
  },
  {
    id: 3,
    sender: "João Silva - TechCorp",
    content: "Perfeito! Podemos agendar a demonstração para amanhã?",
    timestamp: "09:47",
    isOwn: false,
    type: "text",
    status: "delivered",
    reactions: [{ emoji: "🎉", count: 1 }],
    replyTo: null,
    forwarded: false,
    edited: false,
    starred: true,
    aiInsights: {
      sentiment: "very_positive",
      intent: "schedule_demo",
      confidence: 0.96
    }
  }
]

// Player de áudio moderno para mensagens de voz
function VoiceMessagePlayer({ src, duration, waveform, fileName }: { src?: string, duration?: string, waveform?: number[], fileName?: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [hovered, setHovered] = useState(false)

  // Funções de controle
  const handlePlayPause = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
  }

  const handleTimeUpdate = () => {
    if (!audioRef.current) return
    setCurrentTime(audioRef.current.currentTime)
    setProgress((audioRef.current.currentTime / (audioRef.current.duration || 1)) * 100)
  }

  const handleAudioEnded = () => {
    setIsPlaying(false)
    setCurrentTime(0)
    setProgress(0)
  }

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!audioRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    audioRef.current.currentTime = percent * (audioRef.current.duration || 0)
  }

  // Formatar tempo mm:ss
  const formatTime = (s: number) => {
    if (isNaN(s)) return "0:00"
    const min = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${min}:${sec.toString().padStart(2, "0")}`
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 min-w-[200px] w-full max-w-[340px] relative group",
        hovered && "bg-muted/30"
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Botão Play/Pause */}
      <Button size="sm" variant="ghost" className="h-10 w-10 p-0 flex items-center justify-center" onClick={handlePlayPause} aria-label={isPlaying ? "Pausar áudio" : "Tocar áudio"}>
        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
      </Button>
      {/* Ícone de microfone */}
      <div className="flex items-center justify-center h-8 w-8 bg-primary/10 rounded-full mr-1">
        <Mic className="h-4 w-4 text-primary" />
      </div>
      {/* Waveform animado */}
      <div className="flex-1 flex items-end gap-[2px] h-10 cursor-pointer select-none relative" onClick={handleProgressBarClick}>
        {waveform && waveform.length > 0 ? waveform.map((height, i) => (
          <div
            key={`waveform-bar-${i}`}
            className={cn(
              "voice-player-bar",
              isPlaying ? "playing" : "",
              `h-[${Math.max(10, Math.round(height * 32))}px]`
            )}
          />
        )) : (
          <div className="h-6 w-full bg-muted-foreground/20 rounded" />
        )}
        {/* Barra de progresso sobreposta */}
        <div
          className="voice-player-progress"
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* Tempo decorrido / total */}
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="text-xs font-mono w-12 text-right cursor-default">
            {formatTime(currentTime)} / {duration || formatTime(audioRef.current?.duration || 0)}
          </span>
        </TooltipTrigger>
        <TooltipContent>Duração total: {duration || formatTime(audioRef.current?.duration || 0)}</TooltipContent>
      </Tooltip>
      {/* Download */}
      {src && (
        <a href={src} download={fileName || "audio.ogg"} className="ml-1" tabIndex={-1} aria-label="Baixar áudio">
          <Button size="icon" variant="ghost" className="h-8 w-8 p-0">
            <Download className="h-4 w-4" />
          </Button>
        </a>
      )}
      {/* Elemento de áudio real (invisível) */}
      <audio
        ref={audioRef}
        src={src}
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnded}
        className="hidden"
      />
      {/* Ações rápidas */}
      <div className="absolute right-0 -top-8 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Button size="icon" variant="ghost" className="h-7 w-7 p-0" aria-label="Responder">
          <Reply className="h-3 w-3" />
        </Button>
        <Button size="icon" variant="ghost" className="h-7 w-7 p-0" aria-label="Encaminhar">
          <Forward className="h-3 w-3" />
        </Button>
        <Button size="icon" variant="ghost" className="h-7 w-7 p-0" aria-label="Favoritar">
          <Star className="h-3 w-3" />
        </Button>
        <Button size="icon" variant="ghost" className="h-7 w-7 p-0" aria-label="Deletar">
          <XCircle className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

export default function ChatLayout() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation>(conversations[0])
  const [messageInput, setMessageInput] = useState("")
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPlatform, setFilterPlatform] = useState<string>("all")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Estados para modais/menus
  const [showFilesModal, setShowFilesModal] = useState(false)
  // Removido: const [showConversationMenu, setShowConversationMenu] = useState(false)
  const [showContactProfileModal, setShowContactProfileModal] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)

  // Referências
  const messageInputRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Filter conversations based on search and platform
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlatform = filterPlatform === "all" || conv.platform === filterPlatform
    return matchesSearch && matchesPlatform
  })

  const getPlatformColor = (platform: string) => {
    const colors = {
      whatsapp: "bg-green-100 text-green-800",
      telegram: "bg-blue-100 text-blue-800", 
      email: "bg-gray-100 text-gray-800",
      sms: "bg-yellow-100 text-yellow-800",
      instagram: "bg-purple-100 text-purple-800",
      messenger: "bg-blue-100 text-blue-800"
    }
    return colors[platform as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "text-red-600",
      medium: "text-yellow-600", 
      low: "text-green-600"
    }
    return colors[priority as keyof typeof colors] || "text-gray-600"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-gray-400" />
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400" />
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-400" />
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />
      case 'failed':
        return <XCircle className="h-3 w-3 text-red-500" />
      default:
        return null
    }
  }

  const handleSendMessage = () => {
    if (!messageInput.trim()) return
    
    // Add message logic here
    console.log("Sending message:", messageInput)
    setMessageInput("")
    setReplyingTo(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-[calc(100vh-3rem)] bg-background">
      <TooltipProvider>
        {/* Sidebar - Lista de Conversas */}
        <aside className={cn(
          "bg-muted/30 border-r transition-all duration-300 flex flex-col",
          sidebarCollapsed ? "w-16" : "w-80"
        )}>
          {/* Header da Sidebar */}
          <div className="p-4 border-b bg-background/50">
            <div className="flex items-center justify-between mb-3">
              <h2 className={cn("font-semibold", sidebarCollapsed && "sr-only")}>
                Conversas
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
                {!sidebarCollapsed && (
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            {/* Search e Filtros */}
            {!sidebarCollapsed && (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar conversas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                
                <div className="flex gap-1">
                  <Button
                    variant={filterPlatform === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterPlatform("all")}
                    className="text-xs"
                  >
                    Todos
                  </Button>
                  <Button
                    variant={filterPlatform === "whatsapp" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterPlatform("whatsapp")}
                    className="text-xs"
                  >
                    WhatsApp
                  </Button>
                  <Button
                    variant={filterPlatform === "telegram" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterPlatform("telegram")}
                    className="text-xs"
                  >
                    Telegram
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Lista de Conversas */}
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  className={cn(
                    "w-full p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 text-left",
                    selectedConversation?.id === conversation.id && "bg-primary/10 border border-primary/20",
                    sidebarCollapsed && "p-2"
                  )}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={conversation.avatar} />
                        <AvatarFallback className="text-xs">
                          {conversation.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                      )}
                    </div>
                    
                    {!sidebarCollapsed && (
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm truncate">{conversation.name}</h4>
                          <div className="flex items-center gap-1">
                            {conversation.pinned && <Star className="h-3 w-3 text-yellow-500" />}
                            {conversation.unread > 0 && (
                              <Badge className="bg-primary text-primary-foreground px-2 py-0 text-xs">
                                {conversation.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                          {conversation.lastMessage}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge className={cn("text-xs px-2 py-0", getPlatformColor(conversation.platform))}>
                              {conversation.platform}
                            </Badge>
                            <span className={cn("text-xs font-medium", getPriorityColor(conversation.priority))}>
                              {conversation.priority}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {conversation.timestamp}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* Área Principal do Chat */}
        <main className="flex-1 flex flex-col min-h-0">
          {/* Header do Chat */}
          <header className="h-16 border-b bg-background/50 px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src={selectedConversation?.avatar} />
                <AvatarFallback>
                  {selectedConversation?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h1 className="font-semibold">{selectedConversation?.name}</h1>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className={cn("flex items-center gap-1", selectedConversation?.online && "text-green-600")}>
                    <div className={cn("w-2 h-2 rounded-full", selectedConversation?.online ? "bg-green-500" : "bg-gray-400")} />
                    {selectedConversation?.online ? "Online" : `Visto ${selectedConversation?.lastSeen}`}
                  </span>
                  <Separator orientation="vertical" className="h-4" />
                  <Badge className={cn("text-xs", getPlatformColor(selectedConversation?.platform || ""))}>
                    {selectedConversation?.platform}
                  </Badge>
                  {selectedConversation?.assignedTo && (
                    <>
                      <Separator orientation="vertical" className="h-4" />
                      <span>Atribuído: {selectedConversation.assignedTo}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Actions do Header */}
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Ligar</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Videochamada</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => setShowFilesModal(true)}>
                    <Folder className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Arquivos</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => setShowContactProfileModal(true)}>
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={selectedConversation?.avatar} />
                      <AvatarFallback>
                        {selectedConversation?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Perfil do contato</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => setShowInfoModal(true)}>
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Informações da conversa</TooltipContent>
              </Tooltip>

              <ConversationMenu
                onStar={() => toast({ title: 'Favoritar', description: 'A conversa foi favoritada com sucesso.' })}
                onArchive={() => toast({ title: 'Arquivar', description: 'A conversa foi arquivada.' })}
                onMute={() => toast({ title: 'Silenciar', description: 'A conversa foi silenciada.' })}
                onUnmute={() => toast({ title: 'Desmutar', description: 'A conversa foi desmutada.' })}
                onDelete={() => toast({ title: 'Excluir conversa', description: 'A conversa foi excluída.', variant: 'destructive' })}
                isMuted={selectedConversation?.muted}
              />
            </div>
          </header>

          {/* Área de Mensagens */}
          <ScrollArea className="flex-1 min-h-0 px-6 pt-6 pb-0">
            <div className="space-y-4 max-w-4xl flex-1 flex flex-col justify-end">
              {messages.map((msg) => (
                <div key={msg.id} className={cn("flex", msg.isOwn ? "justify-end" : "justify-start")}>
                  <div className={cn("max-w-[70%] group", msg.isOwn ? "order-2" : "order-1")}>
                    {/* Reply context */}
                    {msg.replyTo && (
                      <div className="mb-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-t-lg border-l-2 border-primary">
                        <div className="flex items-center gap-1 mb-1">
                          <Reply className="w-3 h-3" />
                          <span>Respondendo:</span>
                        </div>
                        <p className="truncate">{messages.find(m => m.id === msg.replyTo)?.content}</p>
                      </div>
                    )}
                    
                    {/* Message bubble */}
                    <div className={cn(
                      "rounded-2xl px-4 py-3 relative",
                      msg.isOwn 
                        ? "bg-primary text-primary-foreground rounded-br-md" 
                        : "bg-muted text-foreground rounded-bl-md"
                    )}>
                      {/* Message content based on type */}
                      {msg.type === "text" && (
                        <p className="text-sm whitespace-pre-line break-words">{msg.content}</p>
                      )}
                      
                      {msg.type === "file" && (
                        <div className="flex items-center gap-3 min-w-[200px]">
                          <div className="p-2 bg-background/20 rounded">
                            <File className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{msg.fileName}</p>
                            <p className="text-xs opacity-70">{msg.fileSize}</p>
                          </div>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      
                      {msg.type === "voice" && (
                        <VoiceMessagePlayer
                          src={msg.content} // O campo content deve conter a URL do áudio
                          duration={msg.duration}
                          waveform={msg.waveform}
                          fileName={msg.fileName}
                        />
                      )}
                      
                      {/* Message reactions */}
                      {msg.reactions.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {msg.reactions.map((reaction, i) => (
                            <Badge key={`reaction-${msg.id}-${i}`} variant="secondary" className="text-xs px-2 py-1">
                              {reaction.emoji} {reaction.count}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      {/* Message actions (shown on hover) */}
                      <div className={cn(
                        "absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity",
                        "flex items-center gap-1 bg-background border rounded-lg shadow-lg p-1 z-10",
                        msg.isOwn ? "-left-20" : "-right-20"
                      )}>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setReplyingTo(msg)}>
                          <Reply className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Forward className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Star className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Message metadata */}
                    <div className={cn(
                      "flex items-center gap-2 mt-1 text-xs text-muted-foreground px-1",
                      msg.isOwn ? "justify-end" : "justify-start"
                    )}>
                      <span>{msg.timestamp}</span>
                      {msg.isOwn && (
                        <div className="flex items-center gap-1">
                          {getStatusIcon(msg.status)}
                          {msg.edited && <span className="opacity-60">(editado)</span>}
                        </div>
                      )}
                      {msg.aiInsights && (
                        <Tooltip>
                          <TooltipTrigger>
                            <Bot className="w-3 h-3 text-primary" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-xs">
                              <p>Sentimento: {msg.aiInsights.sentiment}</p>
                              <p>Intenção: {msg.aiInsights.intent}</p>
                              <p>Confiança: {Math.round(msg.aiInsights.confidence * 100)}%</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Reply Context */}
          {replyingTo && (
            <div className="border-t bg-muted/50 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Reply className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Respondendo para {replyingTo.sender}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground p-3 bg-background/50 rounded border-l-2 border-primary">
                {replyingTo.content}
              </p>
            </div>
          )}

          {/* Message Input */}
          <footer className="border-t p-4 bg-background/50 w-full flex-shrink-0">
            <div className="flex items-end gap-3 w-full">
              <div className="flex gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                      <Smile className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Emojis</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}>
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Anexar</TooltipContent>
                </Tooltip>
              </div>
              
              <div className="flex-1 relative">
                <Textarea
                  ref={messageInputRef}
                  placeholder="Digite uma mensagem..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-h-[48px] max-h-[120px] resize-none pr-12 rounded-full"
                  rows={1}
                />
              </div>
              
              <div className="flex gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={!messageInput.trim()}
                      size="sm"
                      className="h-12 w-12 rounded-full"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Enviar</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onMouseDown={() => setIsRecording(true)}
                      onMouseUp={() => setIsRecording(false)}
                      className={cn("h-12 w-12 rounded-full", isRecording && "bg-red-100 text-red-600")}
                    >
                      <Mic className={cn("h-4 w-4", isRecording && "animate-pulse")} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Áudio</TooltipContent>
                </Tooltip>
              </div>
            </div>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
              accept="*/*"
              aria-label="Anexar arquivos"
              onChange={(e) => {
                if (e.target.files) {
                  console.log("Files selected:", Array.from(e.target.files))
                }
              }}
            />
          </footer>
        </main>
      {/* Modais e Menus */}
      <FilesModal
        open={showFilesModal}
        onOpenChange={setShowFilesModal}
        files={[
          { id: '1', name: 'proposta.pdf', type: 'file', url: '/mock/proposta.pdf' },
          { id: '2', name: 'screenshot.png', type: 'image', url: '/mock/screenshot.png' },
          { id: '3', name: 'audio.ogg', type: 'file', url: '/mock/audio.ogg' },
          { id: '4', name: 'video.mp4', type: 'video', url: '/mock/video.mp4' },
        ]}
      />
      {/* O menu de mais opções agora é dropdown ancorado ao botão, não overlay solto */}
      <ContactProfileModal
        open={showContactProfileModal}
        onOpenChange={setShowContactProfileModal}
        contact={selectedConversation}
      />
      <InfoModal
        open={showInfoModal}
        onOpenChange={setShowInfoModal}
        title="Informações da Conversa"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={selectedConversation?.avatar} />
              <AvatarFallback>{selectedConversation?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-lg">{selectedConversation?.name}</div>
              <div className="text-xs text-muted-foreground">{selectedConversation?.platform}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><b>Categoria:</b> {selectedConversation?.category}</div>
            <div><b>Prioridade:</b> {selectedConversation?.priority}</div>
            <div><b>Sentimento:</b> {selectedConversation?.sentiment}</div>
            <div><b>Status:</b> {selectedConversation?.online ? 'Online' : `Visto ${selectedConversation?.lastSeen}`}</div>
            <div><b>Atribuído:</b> {selectedConversation?.assignedTo || '-'}</div>
            <div><b>Não lidas:</b> {selectedConversation?.unread}</div>
          </div>
          <div>
            <b>Última mensagem:</b>
            <div className="bg-muted/50 rounded p-2 mt-1 text-xs">{selectedConversation?.lastMessage}</div>
          </div>
        </div>
      </InfoModal>
      </TooltipProvider>
    </div>
  )
}
