"use client"

import { useState, useRef, useEffect } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
} from "lucide-react"
import { cn } from "@/lib/utils"


// Enhanced conversation data
const conversations = [
  {
    id: 1,
    name: "John Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thanks for the quick response! 👍",
    timestamp: "2 min ago",
    unread: 2,
    platform: "whatsapp",
    online: true,
    typing: false,
    pinned: true,
    muted: false,
    archived: false,
    lastSeen: "2 minutes ago",
    phoneNumber: "+1 (555) 123-4567",
    email: "john.smith@company.com",
    tags: ["VIP", "Customer"],
    notes: "Important client - handle with priority",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Can we schedule a call tomorrow?",
    timestamp: "15 min ago",
    unread: 0,
    platform: "telegram",
    online: false,
    typing: false,
    pinned: false,
    muted: false,
    archived: false,
    lastSeen: "15 minutes ago",
    phoneNumber: "+1 (555) 234-5678",
    email: "sarah.johnson@company.com",
    tags: ["Lead", "Prospect"],
    notes: "Interested in enterprise plan",
  },
  {
    id: 3,
    name: "Mike Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "The proposal looks great! 🎉",
    timestamp: "1 hour ago",
    unread: 1,
    platform: "email",
    online: true,
    typing: false,
    pinned: false,
    muted: false,
    archived: false,
    lastSeen: "1 hour ago",
    phoneNumber: "+1 (555) 345-6789",
    email: "mike.wilson@company.com",
    tags: ["Customer", "Enterprise"],
    notes: "Signed contract last month",
  },
  {
    id: 4,
    name: "Emily Davis",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Let me check with my team",
    timestamp: "3 hours ago",
    unread: 0,
    platform: "whatsapp",
    online: false,
    typing: false,
    pinned: false,
    muted: true,
    archived: false,
    lastSeen: "3 hours ago",
    phoneNumber: "+1 (555) 456-7890",
    email: "emily.davis@company.com",
    tags: ["Lead"],
    notes: "Decision maker for tech purchases",
  },
  {
    id: 5,
    name: "Alex Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Perfect! See you then 👋",
    timestamp: "Yesterday",
    unread: 0,
    platform: "telegram",
    online: false,
    typing: false,
    pinned: false,
    muted: false,
    archived: false,
    lastSeen: "Yesterday",
    phoneNumber: "+1 (555) 567-8901",
    email: "alex.rodriguez@company.com",
    tags: ["Customer"],
    notes: "Regular monthly check-ins",
  },
]

// Enhanced message data
const messages = [
  {
    id: 1,
    sender: "John Smith",
    content: "Hi there! I wanted to follow up on our conversation about the new CRM system.",
    timestamp: "10:30 AM",
    isOwn: false,
    type: "text",
    status: "delivered",
    reactions: [],
    replyTo: null,
    forwarded: false,
    edited: false,
    starred: false,
  },
  {
    id: 2,
    sender: "You",
    content: "Hello John! Yes, I have the proposal ready. Would you like me to send it over?",
    timestamp: "10:32 AM",
    isOwn: true,
    type: "text",
    status: "read",
    reactions: [],
    replyTo: null,
    forwarded: false,
    edited: false,
    starred: false,
  },
  {
    id: 3,
    sender: "John Smith",
    content: "That would be perfect. Also, could we schedule a demo for next week?",
    timestamp: "10:35 AM",
    isOwn: false,
    type: "text",
    status: "delivered",
    reactions: [{ emoji: "👍", count: 1, users: ["You"] }],
    replyTo: null,
    forwarded: false,
    edited: false,
    starred: true,
  },
  {
    id: 4,
    sender: "You",
    content: "I'll send the proposal now and we can coordinate on the demo timing.",
    timestamp: "10:37 AM",
    isOwn: true,
    type: "text",
    status: "read",
    reactions: [],
    replyTo: null,
    forwarded: false,
    edited: false,
    starred: false,
  },
  {
    id: 5,
    sender: "You",
    content: "/placeholder.svg?height=200&width=300",
    timestamp: "10:38 AM",
    isOwn: true,
    type: "file",
    status: "read",
    reactions: [],
    replyTo: null,
    forwarded: false,
    edited: false,
    starred: false,
    fileName: "CRM_Proposal_2024.pdf",
    fileSize: "2.4 MB",
  },
  {
    id: 6,
    sender: "John Smith",
    content: "Thanks for the quick response!",
    timestamp: "10:40 AM",
    isOwn: false,
    type: "text",
    status: "delivered",
    reactions: [{ emoji: "❤️", count: 1, users: ["You"] }],
    replyTo: 4,
    forwarded: false,
    edited: false,
    starred: false,
  },
  {
    id: 7,
    sender: "John Smith",
    content: "",
    timestamp: "10:42 AM",
    isOwn: false,
    type: "voice",
    status: "delivered",
    reactions: [],
    replyTo: null,
    forwarded: false,
    edited: false,
    starred: false,
    duration: "0:45",
    waveform: [0.2, 0.5, 0.8, 0.3, 0.7, 0.4, 0.9, 0.1, 0.6, 0.8, 0.2, 0.5],
  },
]

const quickReplies = [
  "Thanks!",
  "Sure, no problem",
  "Let me check and get back to you",
  "Sounds good",
  "I'll send it over shortly",
  "Can we schedule a call?",
  "Perfect!",
  "Got it",
]

const messageTemplates = [
  {
    id: 1,
    name: "Welcome Message",
    content:
      "Welcome to our platform! We're excited to have you on board. If you have any questions, feel free to reach out.",
    category: "Onboarding",
  },
  {
    id: 2,
    name: "Follow Up",
    content:
      "Hi {name}, I wanted to follow up on our previous conversation. Do you have any questions about our proposal?",
    category: "Sales",
  },
  {
    id: 3,
    name: "Meeting Reminder",
    content:
      "This is a friendly reminder about our meeting scheduled for {date} at {time}. Looking forward to speaking with you!",
    category: "Scheduling",
  },
]

const emojis = [
  "😀","😃","😄","😁","😆","😅","😂","🤣","😊","😇","🙂","🙃","😉","😌","😍","🥰","😘","😗","😙","😚","😋","😛","😝","😜","🤪","🤨","🧐","🤓","😎","🤩","🥳","😏","😒","😞","😔","😟","😕","🙁","☹️","😣","👍","👎","👌","✌️","🤞","🤟","🤘","🤙","👈","👉","👆","🖕","👇","☝️","👋","🤚","🖐","✋","🖖","👏","🙌","🤲","🤝","🙏","✍️","💪","🦾","🦿","🦵","🦶","❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❣️","💕","💞","💓","💗","💖","💘","💝","💟","☮️","✝️","☪️","🕉","☸️","✡️","🔯","🕎","☯️","☦️","🛐",
]

const reactionEmojis = [
  { emoji: "👍", label: "Like" },
  { emoji: "❤️", label: "Love" },
  { emoji: "😂", label: "Laugh" },
  { emoji: "😮", label: "Wow" },
  { emoji: "😢", label: "Sad" },
  { emoji: "😡", label: "Angry" },
]

export default function MessagesPageWrapper() {
  return (
    <SidebarProvider>
      <MessagesPage />
    </SidebarProvider>
  )
}

function MessagesPage() {

  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [messageInput, setMessageInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [replyingTo, setReplyingTo] = useState<any>(null)
  const [editingMessage, setEditingMessage] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "whatsapp":
        return "bg-green-100 text-green-800"
      case "telegram":
        return "bg-blue-100 text-blue-800"
      case "email":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <Check className="h-3 w-3" />
      case "delivered":
        return <CheckCheck className="h-3 w-3" />
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-500" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const handleSendMessage = () => {
    if (!messageInput.trim()) return
    // Aqui você enviaria a mensagem para o backend
    setMessageInput("")
    setReplyingTo(null)
    setEditingMessage(null)
  }

  const handleQuickReply = (reply: string) => {
    setMessageInput(reply)
  }

  const handleEmojiSelect = (emoji: string) => {
    setMessageInput((prev) => prev + emoji)
    setShowEmojiPicker(false)
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleReaction = (messageId: number, emoji: string) => {
    // Aqui você atualizaria as reações da mensagem
  }

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <SidebarInset>
      <header className="flex h-16 items-center px-4 border-b">
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
      </header>

      <div className="flex flex-1 h-[calc(100vh-4rem)]">
        <aside className="w-80 border-r bg-zinc-100 dark:bg-zinc-900 overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold mb-2">Conversas</h2>
            <Input placeholder="Buscar..." className="mb-2" />
          </div>
          <ScrollArea className="h-full">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                type="button"
                role="option"
                aria-selected={selectedConversation?.id === conv.id}
                tabIndex={0}
                className={cn(
                  "flex gap-3 px-4 py-3 items-center w-full text-left cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500",
                  selectedConversation?.id === conv.id && "bg-zinc-200 dark:bg-zinc-800"
                )}
                onClick={() => setSelectedConversation(conv)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedConversation(conv);
                  }
                }}
              >
                <Avatar><AvatarImage src={conv.avatar} /><AvatarFallback>{conv.name?.[0]}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <span className="font-medium truncate">{conv.name}</span>
                    <span className="text-xs text-muted-foreground">{conv.timestamp}</span>
                  </div>
                  <span className="block text-xs text-muted-foreground truncate">
                    {conv.typing ? "Digitando..." : conv.lastMessage}
                  </span>
                </div>
                {conv.unread > 0 && <Badge className="text-xs">{conv.unread}</Badge>}
              </button>
            ))}
          </ScrollArea>
        </aside>

        <section className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b bg-zinc-50 dark:bg-zinc-900">
            <div className="flex items-center gap-3">
              <Avatar><AvatarImage src={selectedConversation?.avatar} /><AvatarFallback>{selectedConversation?.name?.[0]}</AvatarFallback></Avatar>
              <div>
                <p className="font-semibold">{selectedConversation?.name}</p>
                <p className="text-sm text-muted-foreground">{selectedConversation?.online ? "Online" : `Last seen ${selectedConversation?.lastSeen}`}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 cursor-pointer" />
              <Video className="w-5 h-5 cursor-pointer" />
              <Info className="w-5 h-5 cursor-pointer" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex", msg.isOwn ? "justify-end" : "justify-start")}> 
                <div className="max-w-[70%]">
                  {msg.replyTo && <p className="text-xs mb-1 text-muted-foreground">Respondendo: {messages.find(m => m.id === msg.replyTo)?.content}</p>}
                  <div className={cn("rounded-lg px-4 py-2", msg.isOwn ? "bg-blue-500 text-white" : "bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white")}> 
                    {msg.type === "text" && <p className="text-sm whitespace-pre-line">{msg.content}</p>}
                    {msg.type === "file" && (
                      <div className="flex items-center gap-3">
                        <File className="w-5 h-5" />
                        <div>
                          <p>{msg.fileName}</p>
                          <p className="text-xs text-muted-foreground">{msg.fileSize}</p>
                        </div>
                        <Button size="icon" variant="ghost"><Download className="h-4 w-4" /></Button>
                      </div>
                    )}
                    {msg.type === "voice" && (
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon"><Play className="h-4 w-4" /></Button>
                        <div className="flex gap-1 items-end">
                          {msg.waveform?.map((h, i) => <div key={i} className="w-1 bg-current rounded" style={{ height: `${h * 20}px` }} />)}
                        </div>
                        <span className="text-xs">{msg.duration}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end text-xs text-muted-foreground mt-1">
                    {msg.timestamp} {msg.isOwn && getStatusIcon(msg.status)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t bg-background">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon"><Smile className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon"><Paperclip className="h-5 w-5" /></Button>
              <Textarea
                placeholder="Digite uma mensagem..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                className="min-h-[40px] resize-none flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!messageInput.trim()}><Send className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><Mic className="h-5 w-5" /></Button>
            </div>
          </div>
        </section>
      </div>
    </SidebarInset>
  )
}
