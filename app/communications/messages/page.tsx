"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarInset, SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  Pin,
  Reply,
  Forward,
  Edit,
  Bot,
  UserPlus,
  Filter,
  Calendar,
  Image as ImageIcon,
  FileText,
  Link,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Zap,
  MessageCircle,
  Hash,
  AtSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Maximize2,
  Minimize2,
  Moon,
  Sun,
  Bell,
  BellOff,
  PlusCircle,
  Folder,
  Tag,
  Clock3,
  TrendingUp,
  MessageSquare,
  Lightbulb,
  BookOpen,
  Headphones,
  Globe,
} from "lucide-react"
import { cn } from "@/lib/utils"


// Types and Interfaces
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
  phoneNumber: string
  email: string
  tags: string[]
  notes: string
  priority: 'high' | 'medium' | 'low'
  assignedTo?: string
  thread?: boolean
  category: 'lead' | 'customer' | 'support' | 'sales' | 'partner'
  sentiment: 'positive' | 'neutral' | 'negative'
  source: string
  customFields: Record<string, any>
}

interface Message {
  id: number
  sender: string
  content: string
  timestamp: string
  isOwn: boolean
  type: 'text' | 'file' | 'voice' | 'image' | 'video' | 'link' | 'contact' | 'location' | 'poll'
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed'
  reactions: Array<{ emoji: string; count: number; users: string[] }>
  replyTo: number | null
  forwarded: boolean
  edited: boolean
  editedAt?: string
  starred: boolean
  threadId?: string
  fileName?: string
  fileSize?: string
  duration?: string
  waveform?: number[]
  mentions?: string[]
  metadata?: Record<string, any>
  translation?: { language: string; text: string }
  aiInsights?: { sentiment: string; intent: string; confidence: number }
}

interface MessageTemplate {
  id: number
  name: string
  content: string
  category: string
  tags: string[]
  variables: string[]
  usage: number
  language: string
  aiGenerated?: boolean
}

interface QuickAction {
  id: string
  label: string
  icon: any
  action: () => void
  shortcut?: string
}

// Enhanced mock data with realistic conversation scenarios
const conversations: Conversation[] = [
  {
    id: 1,
    name: "João Silva - TechCorp",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Perfeito! Podemos agendar a demonstração para amanhã? �",
    timestamp: "2 min",
    unread: 3,
    platform: "whatsapp",
    online: true,
    typing: false,
    pinned: true,
    muted: false,
    archived: false,
    lastSeen: "agora",
    phoneNumber: "+55 11 98765-4321",
    email: "joao.silva@techcorp.com.br",
    tags: ["VIP", "Cliente Premium", "Tomador de Decisão"],
    notes: "CEO da TechCorp - interessado em soluções enterprise. Orçamento aprovado: R$ 150k",
    priority: "high",
    assignedTo: "Carlos Vendas",
    thread: true,
    category: "lead",
    sentiment: "positive",
    source: "Website - Formulário Premium",
    customFields: {
      company: "TechCorp Solutions",
      position: "CEO",
      budget: "R$ 150.000",
      timeline: "30 dias",
      employees: "250+"
    }
  },
  {
    id: 2,
    name: "Maria Santos",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Preciso de suporte urgente com a integração da API 🔧",
    timestamp: "15 min",
    unread: 1,
    platform: "telegram",
    online: false,
    typing: false,
    pinned: false,
    muted: false,
    archived: false,
    lastSeen: "15 min atrás",
    phoneNumber: "+55 21 99876-5432",
    email: "maria.santos@inovacorp.com.br",
    tags: ["Cliente Ativo", "Técnico", "Integração"],
    notes: "Desenvolvedora senior - cliente desde 2022. Sempre muito técnica nas perguntas.",
    priority: "high",
    assignedTo: "Pedro Suporte",
    category: "support",
    sentiment: "neutral",
    source: "Indicação - Evento Tech",
    customFields: {
      company: "InovaCorp",
      position: "Senior Developer",
      techStack: "React, Node.js, PostgreSQL"
    }
  },
  {
    id: 3,
    name: "Roberto Martins",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Obrigado pela proposta! Vou analisar com a equipe e retorno até sexta ✅",
    timestamp: "1h",
    unread: 0,
    platform: "email",
    online: true,
    typing: false,
    pinned: false,
    muted: false,
    archived: false,
    lastSeen: "1h atrás",
    phoneNumber: "+55 11 94567-8901",
    email: "roberto.martins@startup.co",
    tags: ["Startup", "Potencial", "Follow-up"],
    notes: "CTO de startup em crescimento. Orçamento limitado mas com potencial de escalabilidade.",
    priority: "medium",
    assignedTo: "Ana Vendas",
    category: "lead",
    sentiment: "positive",
    source: "LinkedIn - Outbound",
    customFields: {
      company: "StartupCo",
      position: "CTO",
      stage: "Série A",
      funding: "R$ 2M"
    }
  },
  {
    id: 4,
    name: "Fernanda Costa",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Não consigo acessar o dashboard desde ontem. Já tentei limpar cache.",
    timestamp: "3h",
    unread: 0,
    platform: "whatsapp",
    online: false,
    typing: false,
    pinned: false,
    muted: true,
    archived: false,
    lastSeen: "3h atrás",
    phoneNumber: "+55 85 93456-7890",
    email: "fernanda.costa@empresa.com",
    tags: ["Cliente Regular", "Suporte"],
    notes: "Usuária frequente do sistema. Sempre resolve problemas rapidamente quando explicado.",
    priority: "medium",
    assignedTo: "Bruno Suporte",
    category: "support",
    sentiment: "negative",
    source: "Cliente Antigo",
    customFields: {
      since: "2021",
      plan: "Profissional",
      lastPayment: "Em dia"
    }
  },
  {
    id: 5,
    name: "Lucas Digital Agency",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Excelente! O projeto foi entregue perfeitamente. Parabéns! 🎉",
    timestamp: "ontem",
    unread: 0,
    platform: "telegram",
    online: false,
    typing: false,
    pinned: false,
    muted: false,
    archived: false,
    lastSeen: "ontem",
    phoneNumber: "+55 11 92345-6789",
    email: "contato@lucasdigital.com.br",
    tags: ["Parceiro", "Agência", "Recorrente"],
    notes: "Agência parceira - projetos mensais. Sempre pontual nos pagamentos.",
    priority: "low",
    assignedTo: "Sofia Projetos",
    category: "partner",
    sentiment: "positive",
    source: "Parceria Comercial",
    customFields: {
      partnership: "Premium Partner",
      monthlyProjects: "3-5",
      revenue: "R$ 25k/mês"
    }
  },
  {
    id: 6,
    name: "Dr. Carlos Medicina",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Gostaria de uma demonstração do sistema de gestão de clínicas 🏥",
    timestamp: "2 dias",
    unread: 0,
    platform: "instagram",
    online: false,
    typing: false,
    pinned: false,
    muted: false,
    archived: false,
    lastSeen: "2 dias atrás",
    phoneNumber: "+55 11 91234-5678",
    email: "dr.carlos@clinicamed.com.br",
    tags: ["Medicina", "Lead Qualificado", "Nicho"],
    notes: "Médico interessado em digitalizar clínica. Prospect muito qualificado para nosso produto vertical.",
    priority: "high",
    assignedTo: "Especialista Healthcare",
    category: "lead",
    sentiment: "neutral",
    source: "Instagram Ads - Healthcare",
    customFields: {
      specialty: "Cardiologia",
      clinicSize: "Médio porte",
      patients: "500+ pacientes/mês"
    }
  }
]

// Enhanced messages with realistic conversation flow
const messages: Message[] = [
  {
    id: 1,
    sender: "João Silva - TechCorp",
    content: "Olá! Vi o vídeo de demonstração no YouTube e fiquei muito interessado na solução CRM de vocês. Nossa empresa está crescendo rapidamente e precisamos de algo robusto.",
    timestamp: "09:15",
    isOwn: false,
    type: "text",
    status: "delivered",
    reactions: [],
    replyTo: null,
    forwarded: false,
    edited: false,
    starred: false,
    mentions: [],
    aiInsights: {
      sentiment: "positive",
      intent: "product_inquiry",
      confidence: 0.89
    }
  },
  {
    id: 2,
    sender: "Você",
    content: "Olá João! Muito obrigado pelo interesse! Que ótimo saber que vocês estão crescendo. Para eu preparar a melhor proposta para a TechCorp, poderia me contar um pouco mais sobre:",
    timestamp: "09:18",
    isOwn: true,
    type: "text",
    status: "read",
    reactions: [],
    replyTo: null,
    forwarded: false,
    edited: false,
    starred: false,
    metadata: {
      template: "discovery_questions",
      autoSuggested: true
    }
  },
  {
    id: 3,
    sender: "Você",
    content: "• Quantos usuários vocês têm atualmente?\n• Quais são os principais desafios no processo de vendas hoje?\n• Vocês já usam algum CRM ou fazem tudo manual?\n• Qual seria o timeline ideal para implementação?",
    timestamp: "09:18",
    isOwn: true,
    type: "text",
    status: "read",
    reactions: [{ emoji: "👍", count: 1, users: ["João Silva"] }],
    replyTo: null,
    forwarded: false,
    edited: false,
    starred: true
  },
  {
    id: 4,
    sender: "João Silva - TechCorp",
    content: "Perfeitas perguntas! Deixe eu detalhar:\n\n📊 Somos 250+ funcionários, com time de vendas de 45 pessoas\n💼 Usamos planilhas hoje (um caos!) e perdemos muitos leads\n⏰ Queremos implementar em até 30 dias\n💰 Orçamento aprovado de até R$ 150mil/ano",
    timestamp: "09:25",
    isOwn: false,
    type: "text",
    status: "delivered",
    reactions: [{ emoji: "🎯", count: 1, users: ["Você"] }],
    replyTo: 3,
    forwarded: false,
    edited: false,
    starred: true,
    aiInsights: {
      sentiment: "very_positive",
      intent: "qualified_lead",
      confidence: 0.94
    }
  },
  {
    id: 5,
    sender: "Você",
    content: "Excelente João! Com essas informações posso montar uma proposta bem direcionada. Nosso plano Enterprise é perfeito para empresas do porte da TechCorp.",
    timestamp: "09:28",
    isOwn: true,
    type: "text",
    status: "read",
    reactions: [],
    replyTo: null,
    forwarded: false,
    edited: false,
    starred: false
  },
  {
    id: 6,
    sender: "Você",
    content: "",
    timestamp: "09:30",
    isOwn: true,
    type: "file",
    status: "read",
    reactions: [],
    replyTo: null,
    forwarded: false,
    edited: false,
    starred: false,
    fileName: "Proposta_TechCorp_CRM_Enterprise_2024.pdf",
    fileSize: "3.2 MB",
    metadata: {
      generatedBy: "AI Proposal Generator",
      customized: true
    }
  },
  {
    id: 7,
    sender: "João Silva - TechCorp",
    content: "",
    timestamp: "09:45",
    isOwn: false,
    type: "voice",
    status: "delivered",
    reactions: [{ emoji: "👂", count: 1, users: ["Você"] }],
    replyTo: null,
    forwarded: false,
    edited: false,
    starred: false,
    duration: "1:23",
    waveform: [0.1, 0.3, 0.8, 0.4, 0.9, 0.2, 0.7, 0.5, 0.6, 0.8, 0.3, 0.1, 0.4, 0.7, 0.2],
    aiInsights: {
      sentiment: "excited",
      intent: "schedule_demo",
      confidence: 0.91
    }
  },
  {
    id: 8,
    sender: "João Silva - TechCorp",
    content: "Perfeito! Podemos agendar a demonstração para amanhã? Adorei a proposta! 🚀",
    timestamp: "09:47",
    isOwn: false,
    type: "text",
    status: "delivered",
    reactions: [{ emoji: "🎉", count: 1, users: ["Você"] }],
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

// Smart Templates with AI-powered suggestions
const messageTemplates: MessageTemplate[] = [
  {
    id: 1,
    name: "Boas-vindas VIP",
    content: "Olá {nome}! 🌟 Seja muito bem-vindo(a) ao nosso programa VIP. Sou {agente} e estarei cuidando pessoalmente do seu atendimento. Como posso ajudá-lo(a) hoje?",
    category: "Onboarding",
    tags: ["VIP", "Boas-vindas", "Personalizado"],
    variables: ["nome", "agente"],
    usage: 127,
    language: "pt-BR",
    aiGenerated: false
  },
  {
    id: 2,
    name: "Qualificação de Lead",
    content: "Olá {nome}! Vi que você demonstrou interesse em {produto}. Para preparar a melhor proposta para {empresa}, poderia me contar:\n\n• Quantos usuários precisariam da solução?\n• Qual é o principal desafio hoje?\n• Qual seria o timeline ideal?\n• Há orçamento já aprovado?",
    category: "Vendas",
    tags: ["Qualificação", "Discovery", "Lead"],
    variables: ["nome", "produto", "empresa"],
    usage: 89,
    language: "pt-BR",
    aiGenerated: true
  },
  {
    id: 3,
    name: "Follow-up Pós-Demo",
    content: "Oi {nome}! Espero que tenha gostado da demonstração de hoje! 🚀\n\nFicou com alguma dúvida? Gostaria de discutir os próximos passos?\n\nPosso preparar uma proposta personalizada para {empresa} ainda hoje.",
    category: "Vendas",
    tags: ["Follow-up", "Demo", "Proposta"],
    variables: ["nome", "empresa"],
    usage: 156,
    language: "pt-BR",
    aiGenerated: false
  },
  {
    id: 4,
    name: "Suporte Técnico - Primeiro Contato",
    content: "Olá {nome}! Recebi sua solicitação sobre {problema}. Já estou analisando e em breve terei uma solução.\n\nEnquanto isso, você poderia me informar:\n• Quando o problema começou?\n• Você fez alguma alteração recente?\n• Tem algum print ou erro específico?",
    category: "Suporte",
    tags: ["Suporte", "Técnico", "Troubleshooting"],
    variables: ["nome", "problema"],
    usage: 234,
    language: "pt-BR",
    aiGenerated: true
  },
  {
    id: 5,
    name: "Agendamento de Reunião",
    content: "Perfeito {nome}! Vamos agendar nossa reunião.\n\n📅 Qual período funciona melhor?\n• Segunda a Sexta: 9h às 18h\n• Duração: {duracao}\n• Formato: {formato}\n\nEnvio o convite assim que confirmar! 😊",
    category: "Agendamento",
    tags: ["Reunião", "Agendamento", "Calendário"],
    variables: ["nome", "duracao", "formato"],
    usage: 78,
    language: "pt-BR",
    aiGenerated: false
  },
  {
    id: 6,
    name: "Urgência - Resposta Rápida",
    content: "� Entendi a urgência, {nome}!\n\nJá escalei para nossa equipe especializada e você terá retorno em até {tempo}.\n\nEnquanto isso, vou monitorar pessoalmente o caso #{ticket}.",
    category: "Urgência",
    tags: ["Urgente", "Escalação", "SLA"],
    variables: ["nome", "tempo", "ticket"],
    usage: 45,
    language: "pt-BR",
    aiGenerated: true
  }
]

// Quick replies with context awareness
const quickReplies = [
  "Perfeito! �",
  "Vou verificar e retorno",
  "Pode me dar mais detalhes?",
  "Entendi! Deixe-me ajudar",
  "Vamos agendar uma call?",
  "Obrigado pelo feedback!",
  "Já estou preparando",
  "Sem problemas! �",
  "Ótima pergunta!",
  "Vou escalar para o especialista"
]

// Smart actions based on context
const smartSuggestions = [
  {
    trigger: "orçamento",
    suggestions: ["Enviar calculadora de ROI", "Agendar call comercial", "Enviar proposta personalizada"]
  },
  {
    trigger: "problema",
    suggestions: ["Criar ticket de suporte", "Agendar call técnica", "Enviar documentação"]
  },
  {
    trigger: "demo",
    suggestions: ["Agendar demonstração", "Enviar vídeo demo", "Preparar ambiente teste"]
  }
]

// AI-powered insights and analytics
const conversationInsights = {
  sentiment: "positive",
  intent: "purchase_intent",
  urgency: "medium",
  nextBestAction: "schedule_demo",
  confidence: 0.87,
  suggestedResponse: "Baseado na conversa, sugiro agendar uma demonstração personalizada",
  keyTopics: ["CRM", "Enterprise", "150k budget", "30 days timeline"],
  riskScore: 0.15,
  opportunityScore: 0.89
}

// Enhanced emoji categories
const emojiCategories = {
  frequent: ["�", "�", "�", "�", "✅", "🎯", "�", "�"],
  business: ["�", "�", "🤝", "�", "�", "🎯", "⚡", "🏆"],
  support: ["�️", "�", "✅", "�", "�", "🎧", "💻", "�"],
  celebration: ["🎉", "🥳", "�", "🌟", "🏆", "✨", "🎊", "�"],
  thanks: ["�", "❤️", "�", "�", "🌹", "💖", "🤗", "�"]
}

const reactionEmojis = [
  { emoji: "👍", label: "Curtir" },
  { emoji: "❤️", label: "Amar" },
  { emoji: "😂", label: "Rir" },
  { emoji: "�", label: "Uau" },
  { emoji: "�", label: "Triste" },
  { emoji: "�", label: "Bravo" },
  { emoji: "🎯", label: "Certeiro" },
  { emoji: "�", label: "Incrível" }
]

export default function MessagesPageWrapper() {
  return (
    <SidebarProvider>
      <MessagesPage />
    </SidebarProvider>
  )
}

function MessagesPage() {
  // Enhanced state management
  const [selectedConversation, setSelectedConversation] = useState<Conversation>(conversations[0])
  const [messageInput, setMessageInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showAIInsights, setShowAIInsights] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [editingMessage, setEditingMessage] = useState<Message | null>(null)
  const [selectedMessages, setSelectedMessages] = useState<Set<number>>(new Set())
  const [showConversationInfo, setShowConversationInfo] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [expandedView, setExpandedView] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [translationEnabled, setTranslationEnabled] = useState(false)
  const [autoResponse, setAutoResponse] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  
  // New state for unused icon features
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showFileManager, setShowFileManager] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [hashtagMode, setHashtagMode] = useState(false)
  const [mentionMode, setMentionMode] = useState(false)
  const [quickActionsMode, setQuickActionsMode] = useState(false)
  const [linkPreview, setLinkPreview] = useState(true)
  const [imagePreview, setImagePreview] = useState(true)
  const [messageVisibility, setMessageVisibility] = useState(true)
  const [conversationTags, setConversationTags] = useState<string[]>([])
  const [activeAlerts, setActiveAlerts] = useState<Array<{id: string, type: 'warning' | 'success' | 'info', message: string}>>([])
  const [timeTracking, setTimeTracking] = useState(false)
  const [smartSuggestionMode, setSmartSuggestionMode] = useState(false)
  const [audioSupport, setAudioSupport] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messageInputRef = useRef<HTMLTextAreaElement>(null)
  
  // Enhanced scroll management
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Real-time typing simulation
  useEffect(() => {
    if (messageInput.length > 0) {
      setIsTyping(true)
      const timer = setTimeout(() => setIsTyping(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [messageInput])

  // AI-powered suggestions based on context
  useEffect(() => {
    if (messageInput.length > 10) {
      // Simulate AI suggestions based on message content
      const suggestions = smartSuggestions
        .filter(s => messageInput.toLowerCase().includes(s.trigger))
        .flatMap(s => s.suggestions)
      setAiSuggestions(suggestions)
    } else {
      setAiSuggestions([])
    }
  }, [messageInput])

  // Enhanced platform color coding
  const getPlatformColor = useCallback((platform: string) => {
    const colors = {
      whatsapp: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      telegram: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      email: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      sms: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      instagram: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      messenger: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
    }
    return colors[platform as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }, [])

  // Enhanced priority styling
  const getPriorityColor = useCallback((priority: string) => {
    const colors = {
      high: "border-l-4 border-red-500 bg-red-50 dark:bg-red-950",
      medium: "border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950",
      low: "border-l-4 border-green-500 bg-green-50 dark:bg-green-950"
    }
    return colors[priority as keyof typeof colors] || ""
  }, [])

  // Message status icons with enhanced states
  const getStatusIcon = useCallback((status: string) => {
    const icons = {
      sending: <Clock className="h-3 w-3 animate-spin" />,
      sent: <Check className="h-3 w-3" />,
      delivered: <CheckCheck className="h-3 w-3" />,
      read: <CheckCheck className="h-3 w-3 text-blue-500" />,
      failed: <XCircle className="h-3 w-3 text-red-500" />
    }
    return icons[status as keyof typeof icons] || <Clock className="h-3 w-3" />
  }, [])

  // Enhanced message sending with AI features
  const handleSendMessage = useCallback(async () => {
    if (!messageInput.trim()) return
    
    try {
      // Simulate API call with AI processing
      const newMessage: Message = {
        id: Date.now(),
        sender: "Você",
        content: messageInput,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
        type: "text",
        status: "sending",
        reactions: [],
        replyTo: replyingTo?.id || null,
        forwarded: false,
        edited: false,
        starred: false,
        mentions: messageInput.match(/@[\w]+/g) || [],
        metadata: {
          aiAnalyzed: true,
          suggestedActions: aiSuggestions
        }
      }

      // Add message and clear input
      setMessageInput("")
      setReplyingTo(null)
      setEditingMessage(null)
      setAiSuggestions([])
      
      // Simulate message delivery status updates
      setTimeout(() => {
        newMessage.status = "sent"
      }, 500)
      setTimeout(() => {
        newMessage.status = "delivered"
      }, 1000)
      setTimeout(() => {
        newMessage.status = "read"
      }, 2000)

    } catch (error) {
      console.error("Erro ao enviar mensagem:", error)
    }
  }, [messageInput, replyingTo, aiSuggestions])

  // Template insertion with variable replacement
  const handleTemplateInsert = useCallback((template: MessageTemplate) => {
    let content = template.content
    
    // Replace variables with actual data
    if (selectedConversation) {
      content = content.replace(/{nome}/g, selectedConversation.name.split(' ')[0])
      content = content.replace(/{empresa}/g, selectedConversation.customFields?.company || "sua empresa")
      content = content.replace(/{agente}/g, selectedConversation.assignedTo || "nosso agente")
    }
    
    setMessageInput(content)
    setShowTemplates(false)
    messageInputRef.current?.focus()
  }, [selectedConversation])

  // Enhanced filtering and search
  const filteredConversations = useMemo(() => {
    return conversations.filter(conv => {
      const matchesSearch = 
        conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesFilter = 
        filterType === "all" ||
        filterType === conv.platform ||
        filterType === conv.priority ||
        filterType === conv.category ||
        (filterType === "unread" && conv.unread > 0) ||
        (filterType === "pinned" && conv.pinned) ||
        (filterType === "archived" && conv.archived)
      
      return matchesSearch && matchesFilter
    })
  }, [searchQuery, filterType])

  // AI-powered quick actions
  const quickActions: QuickAction[] = useMemo(() => [
    {
      id: "schedule",
      label: "Agendar Reunião",
      icon: Calendar,
      action: () => console.log("Agendando reunião"),
      shortcut: "Ctrl+M"
    },
    {
      id: "proposal",
      label: "Gerar Proposta",
      icon: FileText,
      action: () => console.log("Gerando proposta com IA"),
      shortcut: "Ctrl+P"
    },
    {
      id: "followup",
      label: "Follow-up Automático",
      icon: RefreshCw,
      action: () => console.log("Configurando follow-up"),
      shortcut: "Ctrl+F"
    },
    {
      id: "escalate",
      label: "Escalar para Especialista",
      icon: UserPlus,
      action: () => console.log("Escalando conversa"),
      shortcut: "Ctrl+E"
    }
  ], [])

  // Voice message recording
  const handleVoiceRecording = useCallback(() => {
    setIsRecording(!isRecording)
    // Here you would implement actual voice recording
  }, [isRecording])

  // File upload handler
  const handleFileUpload = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  // Message reactions
  const handleReaction = useCallback((messageId: number, emoji: string) => {
    // Update message reactions
    console.log(`Reação ${emoji} adicionada à mensagem ${messageId}`)
  }, [])

  // Conversation actions
  const handleConversationAction = useCallback((action: string) => {
    switch (action) {
      case "pin":
        console.log("Conversation pinned")
        break
      case "mute":
        console.log("Conversation muted")
        break
      case "archive":
        console.log("Conversation archived")
        break
      case "assign":
        console.log("Assigning conversation")
        break
      default:
        break
    }
  }, [])

  // New handlers for unused icon features
  const handleShowAnalytics = useCallback(() => {
    setShowAnalytics(!showAnalytics)
  }, [showAnalytics])

  const handleToggleNotifications = useCallback(() => {
    setNotificationsEnabled(!notificationsEnabled)
    const alertType = notificationsEnabled ? 'warning' : 'success'
    const message = notificationsEnabled ? 'Notificações desabilitadas' : 'Notificações habilitadas'
    setActiveAlerts(prev => [...prev, { id: Date.now().toString(), type: alertType, message }])
  }, [notificationsEnabled])

  const handleSmartSuggestions = useCallback(() => {
    setSmartSuggestionMode(!smartSuggestionMode)
    if (!smartSuggestionMode) {
      setActiveAlerts(prev => [...prev, { 
        id: Date.now().toString(), 
        type: 'info', 
        message: 'Modo de sugestões inteligentes ativado' 
      }])
    }
  }, [smartSuggestionMode])

  const handleHashtagMode = useCallback(() => {
    setHashtagMode(!hashtagMode)
    if (!hashtagMode) {
      setMessageInput(prev => prev + " #")
    }
  }, [hashtagMode])

  const handleMentionMode = useCallback(() => {
    setMentionMode(!mentionMode)
    if (!mentionMode) {
      setMessageInput(prev => prev + " @")
    }
  }, [mentionMode])

  const handleQuickActions = useCallback(() => {
    setQuickActionsMode(!quickActionsMode)
  }, [quickActionsMode])

  const handleTimeTracking = useCallback(() => {
    setTimeTracking(!timeTracking)
    const message = timeTracking ? 'Time tracking desativado' : 'Time tracking ativado'
    setActiveAlerts(prev => [...prev, { 
      id: Date.now().toString(), 
      type: 'success', 
      message 
    }])
  }, [timeTracking])

  const handleToggleTranslation = useCallback(() => {
    setTranslationEnabled(!translationEnabled)
  }, [translationEnabled])

  const handleImagePreview = useCallback(() => {
    setImagePreview(!imagePreview)
  }, [imagePreview])

  const handleLinkPreview = useCallback(() => {
    setLinkPreview(!linkPreview)
  }, [linkPreview])

  const handleMessageVisibility = useCallback(() => {
    setMessageVisibility(!messageVisibility)
  }, [messageVisibility])

  const handleAudioToggle = useCallback(() => {
    setAudioEnabled(!audioEnabled)
  }, [audioEnabled])

  const handleFileManager = useCallback(() => {
    setShowFileManager(!showFileManager)
  }, [showFileManager])

  const handleHelpToggle = useCallback(() => {
    setShowHelp(!showHelp)
  }, [showHelp])

  const handleTagManagement = useCallback((tag: string) => {
    if (conversationTags.includes(tag)) {
      setConversationTags(prev => prev.filter(t => t !== tag))
    } else {
      setConversationTags(prev => [...prev, tag])
    }
  }, [conversationTags])

  // Analytics data for TrendingUp icon
  const analyticsData = useMemo(() => ({
    totalMessages: messages.length,
    responseTime: "2.5 min",
    satisfaction: "94%",
    resolutionRate: "87%",
    activeConversations: conversations.filter(c => !c.archived).length,
    urgentConversations: conversations.filter(c => c.priority === 'high').length
  }), [messages, conversations])

  // Alert management
  const dismissAlert = useCallback((alertId: string) => {
    setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId))
  }, [])

  // Auto-dismiss alerts after 5 seconds
  useEffect(() => {
    activeAlerts.forEach(alert => {
      setTimeout(() => {
        dismissAlert(alert.id)
      }, 5000)
    })
  }, [activeAlerts, dismissAlert])

  return (
    <SidebarInset className={cn("flex flex-col h-screen", isDarkMode && "dark")}>
      <TooltipProvider>
        {/* Enhanced Header with Actions */}
        <header className="flex h-16 items-center justify-between px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="mr-2" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink href="/">Dashboard</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink href="/communications">Communications</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>Messages</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          <div className="flex items-center gap-2">
            {/* AI Insights */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => setShowAIInsights(!showAIInsights)}>
                  <Bot className="h-4 w-4 mr-2" />
                  IA Insights
                </Button>
              </TooltipTrigger>
              <TooltipContent>Análises inteligentes da conversa</TooltipContent>
            </Tooltip>

            {/* Analytics */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleShowAnalytics}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </TooltipTrigger>
              <TooltipContent>Estatísticas e métricas</TooltipContent>
            </Tooltip>

            {/* Smart Suggestions */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={smartSuggestionMode ? "default" : "outline"} 
                  size="sm" 
                  onClick={handleSmartSuggestions}
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Sugestões
                </Button>
              </TooltipTrigger>
              <TooltipContent>Sugestões inteligentes ativadas</TooltipContent>
            </Tooltip>

            {/* Time Tracking */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={timeTracking ? "default" : "outline"} 
                  size="sm" 
                  onClick={handleTimeTracking}
                >
                  <Clock3 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Rastreamento de tempo</TooltipContent>
            </Tooltip>

            {/* Translation */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={translationEnabled ? "default" : "outline"} 
                  size="sm" 
                  onClick={handleToggleTranslation}
                >
                  <Globe className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Tradução automática</TooltipContent>
            </Tooltip>

            {/* Notifications */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleToggleNotifications}>
                  {notificationsEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{notificationsEnabled ? "Desativar notificações" : "Ativar notificações"}</TooltipContent>
            </Tooltip>

            {/* Help */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleHelpToggle}>
                  <BookOpen className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Ajuda e documentação</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => setExpandedView(!expandedView)}>
                  {expandedView ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{expandedView ? "Visualização normal" : "Visualização expandida"}</TooltipContent>
            </Tooltip>
            
            <Switch
              checked={isDarkMode}
              onCheckedChange={setIsDarkMode}
              aria-label="Tema escuro"
            />
          </div>
        </header>

        <div className="flex flex-1 h-[calc(100vh-4rem)]">
          {/* Alert System */}
          {activeAlerts.length > 0 && (
            <div className="fixed top-20 right-4 z-50 space-y-2">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg shadow-lg max-w-sm",
                    "animate-in slide-in-from-right duration-300",
                    alert.type === 'warning' && "bg-yellow-50 border border-yellow-200 text-yellow-800",
                    alert.type === 'success' && "bg-green-50 border border-green-200 text-green-800",
                    alert.type === 'info' && "bg-blue-50 border border-blue-200 text-blue-800"
                  )}
                >
                  {alert.type === 'warning' && <AlertCircle className="h-4 w-4" />}
                  {alert.type === 'success' && <CheckCircle className="h-4 w-4" />}
                  {alert.type === 'info' && <MessageSquare className="h-4 w-4" />}
                  <span className="text-sm flex-1">{alert.message}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0"
                    onClick={() => dismissAlert(alert.id)}
                  >
                    <XCircle className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Analytics Panel */}
          {showAnalytics && (
            <div className="fixed top-20 left-4 z-40 w-80 bg-background border rounded-lg shadow-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Analytics do Dashboard
                </h3>
                <Button variant="ghost" size="sm" onClick={handleShowAnalytics}>
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted/50 rounded">
                    <p className="text-xs text-muted-foreground">Total Mensagens</p>
                    <p className="text-lg font-semibold">{analyticsData.totalMessages}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded">
                    <p className="text-xs text-muted-foreground">Tempo Resposta</p>
                    <p className="text-lg font-semibold">{analyticsData.responseTime}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded">
                    <p className="text-xs text-muted-foreground">Satisfação</p>
                    <p className="text-lg font-semibold text-green-600">{analyticsData.satisfaction}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded">
                    <p className="text-xs text-muted-foreground">Resolução</p>
                    <p className="text-lg font-semibold text-blue-600">{analyticsData.resolutionRate}</p>
                  </div>
                </div>
                <div className="p-3 bg-primary/5 rounded">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Conversas Ativas</span>
                    <span className="font-semibold">{analyticsData.activeConversations}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-orange-600">Urgentes</span>
                    <span className="font-semibold text-orange-600">{analyticsData.urgentConversations}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Help Panel */}
          {showHelp && (
            <div className="fixed top-20 right-4 z-40 w-80 bg-background border rounded-lg shadow-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Ajuda & Suporte
                </h3>
                <Button variant="ghost" size="sm" onClick={handleHelpToggle}>
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-muted/50 rounded">
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4" />
                    Dicas Rápidas
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Use @ para mencionar contatos</li>
                    <li>• Use # para adicionar hashtags</li>
                    <li>• Ctrl+Enter para enviar rapidamente</li>
                    <li>• Arraste arquivos para anexar</li>
                  </ul>
                </div>
                <div className="p-3 bg-muted/50 rounded">
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <Headphones className="h-4 w-4" />
                    Suporte de Áudio
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Pressione e segure o botão do microfone para gravar mensagens de voz.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setAudioSupport(!audioSupport)}
                  >
                    {audioSupport ? "Desativar" : "Ativar"} Suporte de Áudio
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* File Manager Panel */}
          {showFileManager && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 w-96 bg-background border rounded-lg shadow-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Folder className="h-4 w-4" />
                  Gerenciador de Arquivos
                </h3>
                <Button variant="ghost" size="sm" onClick={handleFileManager}>
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm" className="flex flex-col gap-1 h-16">
                    <ImageIcon className="h-4 w-4" />
                    <span className="text-xs">Imagens</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex flex-col gap-1 h-16">
                    <File className="h-4 w-4" />
                    <span className="text-xs">Documentos</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex flex-col gap-1 h-16">
                    <Volume2 className="h-4 w-4" />
                    <span className="text-xs">Áudios</span>
                  </Button>
                </div>
                <div className="p-3 bg-muted/50 rounded">
                  <h4 className="font-medium mb-2">Arquivos Recentes</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Proposta_TechCorp.pdf</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Screenshot_demo.png</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Sidebar */}
          <aside className={cn(
            "border-r bg-muted/30 overflow-hidden flex flex-col",
            expandedView ? "w-72" : "w-80"
          )}>
            {/* Search and Filter Section */}
            <div className="p-4 border-b space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Conversas</h2>
                <Badge variant="secondary" className="text-xs">
                  {filteredConversations.length}
                </Badge>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar conversas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="flex-1">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtros" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="unread">Não lidas</SelectItem>
                    <SelectItem value="pinned">Fixadas</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="telegram">Telegram</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="high">Alta prioridade</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="sm" onClick={() => setConversationTags([])}>
                  <Tag className="h-4 w-4 mr-1" />
                  Tags
                </Button>
              </div>

              {/* Tag Management */}
              {conversationTags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {conversationTags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="text-xs cursor-pointer"
                      onClick={() => handleTagManagement(tag)}
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                      <XCircle className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Conversations List */}
            <ScrollArea className="flex-1">
              <div className="space-y-1 p-2">
                {filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer transition-colors relative",
                      "hover:bg-muted/80 focus:bg-muted/80 focus:outline-none",
                      selectedConversation?.id === conv.id && "bg-primary/10 border border-primary/20",
                      getPriorityColor(conv.priority)
                    )}
                    onClick={() => setSelectedConversation(conv)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        setSelectedConversation(conv)
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={conv.avatar} />
                          <AvatarFallback className="text-sm font-medium">
                            {conv.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        {conv.online && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
                        )}
                        <Badge 
                          className={cn("absolute -top-1 -right-1 text-xs px-1.5", getPlatformColor(conv.platform))}
                          variant="secondary"
                        >
                          {conv.platform.slice(0, 2).toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-sm truncate">{conv.name}</h3>
                          <div className="flex items-center gap-1">
                            {conv.pinned && <Pin className="w-3 h-3 text-primary" />}
                            {conv.muted && <VolumeX className="w-3 h-3 text-muted-foreground" />}
                            <span className="text-xs text-muted-foreground">{conv.timestamp}</span>
                          </div>
                        </div>
                        
                        <p className="text-xs text-muted-foreground truncate mb-2">
                          {conv.typing ? (
                            <span className="flex items-center gap-1">
                              <span className="flex gap-1">
                                <span className="w-1 h-1 bg-current rounded-full animate-bounce" />
                                <span className="w-1 h-1 bg-current rounded-full animate-bounce delay-100" />
                                <span className="w-1 h-1 bg-current rounded-full animate-bounce delay-200" />
                              </span>
                              digitando...
                            </span>
                          ) : (
                            conv.lastMessage
                          )}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {conv.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {conv.unread > 0 && (
                              <Badge className="text-xs min-w-[20px] h-5 flex items-center justify-center">
                                {conv.unread > 99 ? "99+" : conv.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </aside>

          {/* Main Chat Area */}
          <section className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b bg-muted/50">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedConversation?.avatar} />
                  <AvatarFallback>
                    {selectedConversation?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-sm">{selectedConversation?.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className={cn("flex items-center gap-1", selectedConversation?.online && "text-green-600")}>
                      <div className={cn("w-2 h-2 rounded-full", selectedConversation?.online ? "bg-green-500" : "bg-gray-400")} />
                      {selectedConversation?.online ? "Online" : `Visto ${selectedConversation?.lastSeen}`}
                    </span>
                    <Separator orientation="vertical" className="h-3" />
                    <Badge className={cn("text-xs", getPlatformColor(selectedConversation?.platform || ""))}>
                      {selectedConversation?.platform}
                    </Badge>
                    {selectedConversation?.assignedTo && (
                      <>
                        <Separator orientation="vertical" className="h-3" />
                        <span>Atribuído: {selectedConversation.assignedTo}</span>
                      </>
                    )}
                    {timeTracking && (
                      <>
                        <Separator orientation="vertical" className="h-3" />
                        <span className="flex items-center gap-1">
                          <Clock3 className="h-3 w-3" />
                          2:35 min
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Quick Actions for unused icons */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={quickActionsMode ? "default" : "ghost"} 
                      size="sm"
                      onClick={handleQuickActions}
                    >
                      <Zap className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Ações rápidas</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={audioEnabled ? "default" : "ghost"} 
                      size="sm"
                      onClick={handleAudioToggle}
                    >
                      {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Controle de áudio</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={handleFileManager}>
                      <Folder className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Gerenciar arquivos</TooltipContent>
                </Tooltip>
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
                    <Button variant="ghost" size="sm" onClick={() => setShowConversationInfo(!showConversationInfo)}>
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Informações do contato</TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={cn("flex", msg.isOwn ? "justify-end" : "justify-start")}>
                    <div className={cn("max-w-[70%] group", msg.isOwn ? "order-2" : "order-1")}>
                      {/* Reply context */}
                      {msg.replyTo && (
                        <div className="mb-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded-t-lg border-l-2 border-primary">
                          <div className="flex items-center gap-1 mb-1">
                            <Reply className="w-3 h-3" />
                            <span>Respondendo:</span>
                          </div>
                          <p className="truncate">{messages.find(m => m.id === msg.replyTo)?.content}</p>
                        </div>
                      )}
                      
                      {/* Message bubble */}
                      <div className={cn(
                        "rounded-lg px-4 py-3 relative",
                        msg.isOwn 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted text-foreground"
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
                          <div className="flex items-center gap-3 min-w-[200px]">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Play className="h-4 w-4" />
                            </Button>
                            <div className="flex-1 flex items-center gap-1">
                              {msg.waveform?.map((height, i) => (
                                <div 
                                  key={i} 
                                  className="w-1 bg-current rounded" 
                                  style={{ height: `${Math.max(2, height * 20)}px` }} 
                                />
                              ))}
                            </div>
                            <span className="text-xs opacity-70">{msg.duration}</span>
                          </div>
                        )}
                        
                        {/* Message reactions */}
                        {msg.reactions.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {msg.reactions.map((reaction, i) => (
                              <Badge key={i} variant="secondary" className="text-xs px-2 py-1">
                                {reaction.emoji} {reaction.count}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        {/* Message actions (shown on hover) */}
                        <div className={cn(
                          "absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity",
                          "flex items-center gap-1 bg-background border rounded-lg shadow-lg p-1",
                          msg.isOwn ? "-left-20" : "-right-20"
                        )}>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setReplyingTo(msg)}>
                            <Reply className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <Forward className="h-3 w-3" />
                          </Button>
                          {msg.isOwn && (
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setEditingMessage(msg)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <Star className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Message metadata */}
                      <div className={cn(
                        "flex items-center gap-2 mt-1 text-xs text-muted-foreground",
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

            {/* AI Insights Panel */}
            {showAIInsights && (
              <div className="border-t bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="w-4 h-4 text-primary" />
                  <h4 className="font-medium text-sm">Insights da IA</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Sentimento</p>
                    <Badge className={cn("mt-1", conversationInsights.sentiment === "positive" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800")}>
                      {conversationInsights.sentiment}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium">Intenção</p>
                    <p className="text-muted-foreground">{conversationInsights.intent}</p>
                  </div>
                  <div>
                    <p className="font-medium">Próxima ação sugerida</p>
                    <p className="text-muted-foreground">{conversationInsights.nextBestAction}</p>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm font-medium mb-1">Sugestão da IA:</p>
                  <p className="text-sm text-muted-foreground">{conversationInsights.suggestedResponse}</p>
                </div>
              </div>
            )}

            {/* Reply Context */}
            {replyingTo && (
              <div className="border-t bg-muted/50 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Reply className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Respondendo para {replyingTo.sender}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
                    <XCircle className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1 p-2 bg-background/50 rounded border-l-2 border-primary">
                  {replyingTo.content}
                </p>
              </div>
            )}

            {/* Quick Replies */}
            <div className="border-t p-2">
              <ScrollArea className="w-full">
                <div className="flex gap-2 pb-2">
                  {quickReplies.map((reply, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0 text-xs"
                      onClick={() => setMessageInput(reply)}
                    >
                      {reply}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Message Input */}
            <div className="border-t p-4 bg-background">
              <div className="flex items-end gap-2">
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
                  <TooltipContent>Anexar arquivo</TooltipContent>
                </Tooltip>

                {/* Image attachment */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={imagePreview ? "default" : "ghost"} 
                      size="sm" 
                      onClick={handleImagePreview}
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Pré-visualização de imagens</TooltipContent>
                </Tooltip>

                {/* Link preview */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={linkPreview ? "default" : "ghost"} 
                      size="sm" 
                      onClick={handleLinkPreview}
                    >
                      <Link className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Pré-visualização de links</TooltipContent>
                </Tooltip>

                {/* Hashtag mode */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={hashtagMode ? "default" : "ghost"} 
                      size="sm" 
                      onClick={handleHashtagMode}
                    >
                      <Hash className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Modo hashtag</TooltipContent>
                </Tooltip>

                {/* Mention mode */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={mentionMode ? "default" : "ghost"} 
                      size="sm" 
                      onClick={handleMentionMode}
                    >
                      <AtSign className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Mencionar contato</TooltipContent>
                </Tooltip>

                {/* Message visibility */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleMessageVisibility}
                    >
                      {messageVisibility ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{messageVisibility ? "Ocultar mensagens" : "Mostrar mensagens"}</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => setShowTemplates(true)}>
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Templates</TooltipContent>
                </Tooltip>
                
                <div className="flex-1 relative">
                  <Textarea
                    ref={messageInputRef}
                    placeholder="Digite uma mensagem..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    className="min-h-[40px] max-h-[120px] resize-none pr-12"
                    rows={1}
                  />
                  {isTyping && (
                    <div className="absolute right-3 top-3">
                      <div className="flex gap-1">
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce delay-100" />
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  )}
                </div>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={!messageInput.trim()}
                      size="sm"
                      className="h-10"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Enviar (Enter)</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onMouseDown={() => setIsRecording(true)}
                      onMouseUp={() => setIsRecording(false)}
                      className={cn("h-10", isRecording && "bg-red-100 text-red-600")}
                    >
                      <Mic className={cn("h-4 w-4", isRecording && "animate-pulse")} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Áudio (Pressione e segure)</TooltipContent>
                </Tooltip>
              </div>
              
              {/* AI Suggestions */}
              {aiSuggestions.length > 0 && (
                <div className="mt-3 p-3 bg-primary/5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Sugestões da IA:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {aiSuggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          // Implement AI suggestion logic
                          console.log("AI suggestion:", suggestion)
                        }}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
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
                  // Handle file upload
                  console.log("Files selected:", Array.from(e.target.files))
                }
              }}
            />
            {/* Templates Modal */}
            <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
              <DialogContent className="max-w-4xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>Templates de Mensagem</DialogTitle>
                  <DialogDescription>
                    Escolha um template para acelerar sua resposta ou crie um novo
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs defaultValue="all" className="mt-4">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">Todos</TabsTrigger>
                    <TabsTrigger value="sales">Vendas</TabsTrigger>
                    <TabsTrigger value="support">Suporte</TabsTrigger>
                    <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="mt-4">
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-3">
                        {messageTemplates.map((template) => (
                          <Card key={template.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h5 className="font-medium text-sm">{template.name}</h5>
                                    <Badge variant="outline" className="text-xs">
                                      {template.category}
                                    </Badge>
                                    {template.aiGenerated && (
                                      <Badge className="text-xs bg-purple-100 text-purple-800">
                                        <Bot className="w-3 h-3 mr-1" />
                                        IA
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                    {template.content}
                                  </p>
                                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span>Usado {template.usage} vezes</span>
                                    <span>{template.language}</span>
                                    {template.variables.length > 0 && (
                                      <span>Variáveis: {template.variables.join(', ')}</span>
                                    )}
                                  </div>
                                </div>
                                <Button 
                                  size="sm" 
                                  onClick={() => {
                                    setMessageInput(template.content)
                                    setShowTemplates(false)
                                  }}
                                >
                                  Usar
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowTemplates(false)}>
                    Cancelar
                  </Button>
                  <Button>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Criar Template
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </section>

          {/* Conversation Info Panel */}
          {showConversationInfo && (
            <aside className="w-80 border-l bg-muted/30 overflow-y-auto">
              <div className="p-4 space-y-6">
                <div className="text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-3">
                    <AvatarImage src={selectedConversation?.avatar} />
                    <AvatarFallback className="text-lg">
                      {selectedConversation?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold">{selectedConversation?.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedConversation?.email}</p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Informações de Contato</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Telefone:</span>
                      <span>{selectedConversation?.phoneNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plataforma:</span>
                      <Badge className={getPlatformColor(selectedConversation?.platform || "")}>
                        {selectedConversation?.platform}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Categoria:</span>
                      <span className="capitalize">{selectedConversation?.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Prioridade:</span>
                      <Badge className={cn(
                        selectedConversation?.priority === "high" ? "bg-red-100 text-red-800" :
                        selectedConversation?.priority === "medium" ? "bg-yellow-100 text-yellow-800" :
                        "bg-green-100 text-green-800"
                      )}>
                        {selectedConversation?.priority}
                      </Badge>
                    </div>
                    {selectedConversation?.assignedTo && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Atribuído:</span>
                        <span>{selectedConversation.assignedTo}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedConversation?.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Notas</h4>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    {selectedConversation?.notes}
                  </p>
                </div>

                {selectedConversation?.customFields && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-3">Informações Customizadas</h4>
                      <div className="space-y-2 text-sm">
                        {Object.entries(selectedConversation.customFields).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-muted-foreground capitalize">{key}:</span>
                            <span>{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </aside>
          )}
        </div>
      </TooltipProvider>
    </SidebarInset>
  )
}
