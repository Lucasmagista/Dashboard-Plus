'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Bot, 
  Send, 
  User, 
  Settings, 
  Brain, 
  MessageSquare, 
  Zap, 
  AlertCircle,
  Download,
  Upload,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  Plus,
  History,
  Activity,
  BarChart3,
  FileText,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Code,
  Image,
  Film,
  Music,
  Database,
  Globe,
  Clock,
  TrendingUp,
  Star,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Share,
  Bookmark,
  Filter,
  Search,
  MoreHorizontal
} from 'lucide-react';
import { ChatGPTIntegration } from '@/lib/ai/chatgpt-integration';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  model?: string;
  tokens?: number;
  rating?: number;
  bookmarked?: boolean;
  type?: 'text' | 'code' | 'image' | 'file';
  metadata?: {
    processingTime?: number;
    confidence?: number;
    sources?: string[];
    attachments?: string[];
  };
}

interface AIModel {
  id: string;
  name: string;
  description: string;
  provider: string;
  available: boolean;
  tokensUsed: number;
  tokensLimit: number;
  costPerToken?: number;
  capabilities: string[];
  maxTokens: number;
  responseTime: number;
  accuracy: number;
  status: 'active' | 'inactive' | 'maintenance' | 'error';
}

interface ChatSettings {
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  systemPrompt: string;
  autoSave: boolean;
  enableVoice: boolean;
  voiceLanguage: string;
  theme: 'light' | 'dark' | 'auto';
}

interface ChatSession {
  id: string;
  name: string;
  model: string;
  createdAt: Date;
  lastMessage: Date;
  messageCount: number;
  tokensUsed: number;
  starred: boolean;
}

interface AIAnalytics {
  totalMessages: number;
  totalTokens: number;
  totalCost: number;
  averageResponseTime: number;
  mostUsedModel: string;
  dailyUsage: Array<{
    date: string;
    messages: number;
    tokens: number;
    cost: number;
  }>;
  topPrompts: Array<{
    prompt: string;
    count: number;
    avgRating: number;
  }>;
}

export function AIIntegration() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [aiModels, setAIModels] = useState<AIModel[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<string>('');
  const [analytics, setAnalytics] = useState<AIAnalytics | null>(null);
  const [chatSettings, setChatSettings] = useState<ChatSettings>({
    temperature: 0.7,
    maxTokens: 2048,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    systemPrompt: 'Você é um assistente útil e profissional.',
    autoSave: true,
    enableVoice: false,
    voiceLanguage: 'pt-BR',
    theme: 'auto'
  });
  const [activeTab, setActiveTab] = useState('chat');
  const [copied, setCopied] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadInitialData = async () => {
    try {
      await Promise.all([
        loadAIModels(),
        loadChatSessions(),
        loadAnalytics()
      ]);
      
      // Adicionar mensagem de boas-vindas
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: 'Olá! Sou seu assistente de IA avançado. Posso ajudar com análises, código, criação de conteúdo e muito mais. Como posso ajudá-lo hoje?',
          timestamp: new Date(),
          type: 'text'
        }
      ]);
    } catch (err) {
      setError('Erro ao carregar dados iniciais');
    }
  };

  const loadAIModels = async () => {
    try {
      const mockModels: AIModel[] = [
        {
          id: 'gpt-4',
          name: 'GPT-4',
          description: 'Modelo mais avançado para tarefas complexas e raciocínio',
          provider: 'OpenAI',
          available: true,
          tokensUsed: 15230,
          tokensLimit: 100000,
          costPerToken: 0.03,
          capabilities: ['texto', 'código', 'análise', 'criação'],
          maxTokens: 8192,
          responseTime: 2.5,
          accuracy: 95,
          status: 'active'
        },
        {
          id: 'gpt-3.5-turbo',
          name: 'GPT-3.5 Turbo',
          description: 'Modelo rápido e eficiente para tarefas gerais',
          provider: 'OpenAI',
          available: true,
          tokensUsed: 45670,
          tokensLimit: 200000,
          costPerToken: 0.002,
          capabilities: ['texto', 'código', 'conversação'],
          maxTokens: 4096,
          responseTime: 1.2,
          accuracy: 88,
          status: 'active'
        },
        {
          id: 'claude-3-sonnet',
          name: 'Claude 3 Sonnet',
          description: 'Modelo da Anthropic para conversas naturais e análise',
          provider: 'Anthropic',
          available: true,
          tokensUsed: 12450,
          tokensLimit: 50000,
          costPerToken: 0.015,
          capabilities: ['texto', 'análise', 'conversação', 'escrita'],
          maxTokens: 200000,
          responseTime: 1.8,
          accuracy: 92,
          status: 'active'
        },
        {
          id: 'gemini-pro',
          name: 'Gemini Pro',
          description: 'Modelo do Google para multimodalidade',
          provider: 'Google',
          available: true,
          tokensUsed: 8920,
          tokensLimit: 75000,
          costPerToken: 0.0025,
          capabilities: ['texto', 'imagem', 'código', 'análise'],
          maxTokens: 32768,
          responseTime: 1.5,
          accuracy: 90,
          status: 'active'
        },
        {
          id: 'llama-2-70b',
          name: 'Llama 2 70B',
          description: 'Modelo open-source da Meta',
          provider: 'Meta',
          available: false,
          tokensUsed: 0,
          tokensLimit: 100000,
          costPerToken: 0.001,
          capabilities: ['texto', 'código'],
          maxTokens: 4096,
          responseTime: 3.0,
          accuracy: 85,
          status: 'maintenance'
        }
      ];
      setAIModels(mockModels);
    } catch (err) {
      setError('Erro ao carregar modelos de IA');
    }
  };

  const loadChatSessions = async () => {
    const mockSessions: ChatSession[] = [
      {
        id: '1',
        name: 'Análise de Dados',
        model: 'gpt-4',
        createdAt: new Date(Date.now() - 86400000),
        lastMessage: new Date(Date.now() - 3600000),
        messageCount: 15,
        tokensUsed: 2450,
        starred: true
      },
      {
        id: '2',
        name: 'Desenvolvimento Web',
        model: 'gpt-3.5-turbo',
        createdAt: new Date(Date.now() - 172800000),
        lastMessage: new Date(Date.now() - 7200000),
        messageCount: 8,
        tokensUsed: 1200,
        starred: false
      }
    ];
    setChatSessions(mockSessions);
    if (mockSessions.length > 0) {
      setCurrentSession(mockSessions[0].id);
    }
  };

  const loadAnalytics = async () => {
    const mockAnalytics: AIAnalytics = {
      totalMessages: 156,
      totalTokens: 45230,
      totalCost: 12.45,
      averageResponseTime: 2.1,
      mostUsedModel: 'gpt-4',
      dailyUsage: [
        { date: '2024-01-01', messages: 12, tokens: 3200, cost: 0.96 },
        { date: '2024-01-02', messages: 18, tokens: 4500, cost: 1.35 },
        { date: '2024-01-03', messages: 15, tokens: 3800, cost: 1.14 }
      ],
      topPrompts: [
        { prompt: 'Analise este código', count: 15, avgRating: 4.8 },
        { prompt: 'Explique este conceito', count: 12, avgRating: 4.6 },
        { prompt: 'Crie um resumo', count: 8, avgRating: 4.9 }
      ]
    };
    setAnalytics(mockAnalytics);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      // Simular tempo de processamento baseado no modelo
      const selectedModelData = aiModels.find(m => m.id === selectedModel);
      const processingTime = selectedModelData?.responseTime || 2;
      
      await new Promise(resolve => setTimeout(resolve, processingTime * 1000));
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(userMessage.content),
        timestamp: new Date(),
        model: selectedModel,
        type: 'text',
        tokens: Math.floor(Math.random() * 500) + 100,
        metadata: {
          processingTime,
          confidence: Math.random() * 0.3 + 0.7,
          sources: ['Knowledge Base', 'Training Data']
        }
      };

      setMessages(prev => [...prev, aiResponse]);
      
      // Atualizar analytics
      if (analytics) {
        setAnalytics(prev => ({
          ...prev!,
          totalMessages: prev!.totalMessages + 1,
          totalTokens: prev!.totalTokens + (aiResponse.tokens || 0)
        }));
      }
      
    } catch (err) {
      setError('Erro ao processar mensagem');
    } finally {
      setLoading(false);
    }
  };

  const generateAIResponse = (userInput: string): string => {
    const responses = [
      `Entendi sua pergunta sobre "${userInput}". Baseado na minha análise, posso fornecer as seguintes informações...`,
      `Interessante questão! Vou explicar o conceito de "${userInput}" de forma detalhada...`,
      `Sobre "${userInput}", posso ajudar com uma análise completa. Aqui estão os pontos principais...`,
      `Essa é uma pergunta muito relevante sobre "${userInput}". Vou dividir minha resposta em partes...`,
      `Com base no contexto de "${userInput}", posso sugerir as seguintes abordagens...`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Conversa limpa! Como posso ajudá-lo agora?',
        timestamp: new Date(),
        type: 'text'
      }
    ]);
  };

  const rateMessage = (messageId: string, rating: number) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, rating } : msg
    ));
  };

  const bookmarkMessage = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, bookmarked: !msg.bookmarked } : msg
    ));
  };

  const copyToClipboard = useCallback(async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
      setSuccess('Texto copiado para área de transferência!');
    } catch (err) {
      setError('Erro ao copiar texto');
    }
  }, []);

  const exportChat = () => {
    const chatData = {
      session: currentSession,
      model: selectedModel,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
        rating: m.rating
      })),
      exportDate: new Date()
    };
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      name: `Nova Conversa ${chatSessions.length + 1}`,
      model: selectedModel,
      createdAt: new Date(),
      lastMessage: new Date(),
      messageCount: 0,
      tokensUsed: 0,
      starred: false
    };
    
    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSession(newSession.id);
    clearChat();
  };

  const deleteSession = (sessionId: string) => {
    setChatSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSession === sessionId && chatSessions.length > 1) {
      setCurrentSession(chatSessions[0].id);
    }
  };

  const toggleStarSession = (sessionId: string) => {
    setChatSessions(prev => prev.map(s => 
      s.id === sessionId ? { ...s, starred: !s.starred } : s
    ));
  };

  const getModelUsagePercentage = (model: AIModel) => {
    return Math.min((model.tokensUsed / model.tokensLimit) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'maintenance': return 'Manutenção';
      case 'error': return 'Erro';
      default: return 'Desconhecido';
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'bookmarked') return msg.bookmarked;
    if (selectedFilter === 'rated') return msg.rating && msg.rating > 0;
    return true;
  }).filter(msg => 
    searchQuery === '' || 
    msg.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'agora';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Centro de IA Avançado</h2>
          <p className="text-muted-foreground">
            Chat inteligente com múltiplos modelos de IA e análises avançadas
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={createNewSession}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Conversa
          </Button>
          <Brain className="h-8 w-8 text-primary" />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <Check className="h-4 w-4" />
          <AlertTitle>Sucesso</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="chat">
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="models">
            <Bot className="h-4 w-4 mr-2" />
            Modelos
          </TabsTrigger>
          <TabsTrigger value="sessions">
            <History className="h-4 w-4 mr-2" />
            Sessões
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Sidebar com sessões */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-base">Conversas</CardTitle>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger className="w-20">
                      <Filter className="h-4 w-4" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="bookmarked">Favoritas</SelectItem>
                      <SelectItem value="rated">Avaliadas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {chatSessions.map((session) => (
                      <div
                        key={session.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          currentSession === session.id 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                        onClick={() => setCurrentSession(session.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{session.name}</p>
                            <p className="text-xs opacity-70">
                              {session.messageCount} msgs • {formatRelativeTime(session.lastMessage)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleStarSession(session.id);
                              }}
                            >
                              <Star 
                                className={`h-3 w-3 ${session.starred ? 'fill-current' : ''}`} 
                              />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSession(session.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Chat principal */}
            <Card className="lg:col-span-3 h-[600px] flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-lg">Chat IA</CardTitle>
                  <Badge variant="outline">{selectedModel}</Badge>
                  <Badge variant="secondary">
                    {filteredMessages.length} mensagens
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={exportChat}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearChat}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpar
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col space-y-4">
                <ScrollArea ref={scrollRef} className="flex-1 pr-4">
                  <div className="space-y-4">
                    {filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`flex max-w-[85%] space-x-3 ${
                            message.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                          }`}
                        >
                          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                            message.role === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-gradient-to-br from-purple-500 to-blue-600 text-white'
                          }`}>
                            {message.role === 'user' ? (
                              <User className="h-5 w-5" />
                            ) : (
                              <Sparkles className="h-5 w-5" />
                            )}
                          </div>
                          
                          <div className={`rounded-xl p-4 ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted border'
                          }`}>
                            <div className="space-y-2">
                              <p className="text-sm leading-relaxed">{message.content}</p>
                              
                              {message.metadata && (
                                <div className="text-xs opacity-70 space-y-1">
                                  {message.metadata.confidence && (
                                    <p>Confiança: {(message.metadata.confidence * 100).toFixed(1)}%</p>
                                  )}
                                  {message.metadata.processingTime && (
                                    <p>Tempo: {message.metadata.processingTime}s</p>
                                  )}
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between text-xs opacity-70">
                                <span>
                                  {message.timestamp.toLocaleTimeString()}
                                  {message.model && ` • ${message.model}`}
                                  {message.tokens && ` • ${message.tokens} tokens`}
                                </span>
                                
                                {message.role === 'assistant' && (
                                  <div className="flex items-center space-x-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyToClipboard(message.content, message.id)}
                                      className="h-6 w-6 p-0"
                                    >
                                      {copied === message.id ? 
                                        <Check className="h-3 w-3" /> : 
                                        <Copy className="h-3 w-3" />
                                      }
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => bookmarkMessage(message.id)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Bookmark 
                                        className={`h-3 w-3 ${message.bookmarked ? 'fill-current' : ''}`} 
                                      />
                                    </Button>
                                    <div className="flex space-x-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => rateMessage(message.id, 1)}
                                        className="h-6 w-6 p-0"
                                      >
                                        <ThumbsUp 
                                          className={`h-3 w-3 ${message.rating === 1 ? 'fill-current text-green-600' : ''}`} 
                                        />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => rateMessage(message.id, -1)}
                                        className="h-6 w-6 p-0"
                                      >
                                        <ThumbsDown 
                                          className={`h-3 w-3 ${message.rating === -1 ? 'fill-current text-red-600' : ''}`} 
                                        />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {loading && (
                      <div className="flex justify-start">
                        <div className="flex space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                            <Sparkles className="h-5 w-5 text-white" />
                          </div>
                          <div className="bg-muted border rounded-xl p-4">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {aiModels.filter(m => m.available).map(model => (
                          <SelectItem key={model.id} value={model.id}>
                            <div className="flex items-center space-x-2">
                              <span>{model.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {model.provider}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsRecording(!isRecording)}
                      className={isRecording ? 'bg-red-100 text-red-800' : ''}
                    >
                      {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Digite sua mensagem... (Shift+Enter para nova linha)"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      disabled={loading}
                      className="flex-1 min-h-[60px] max-h-[200px] resize-none"
                      rows={2}
                    />
                    <div className="flex flex-col space-y-2">
                      <Button 
                        onClick={sendMessage} 
                        disabled={loading || !input.trim()}
                        className="h-full min-h-[60px]"
                      >
                        {loading ? (
                          <RefreshCw className="h-5 w-5 animate-spin" />
                        ) : (
                          <Send className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <div className="grid gap-4">
            {aiModels.map((model) => (
              <Card key={model.id} className={selectedModel === model.id ? 'ring-2 ring-primary' : ''}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-base">{model.name}</CardTitle>
                    <Badge variant={model.available ? 'default' : 'secondary'}>
                      {model.provider}
                    </Badge>
                    <Badge className={`text-xs ${getStatusColor(model.status)}`}>
                      {getStatusText(model.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    {model.available && (
                      <Button
                        variant={selectedModel === model.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedModel(model.id)}
                      >
                        {selectedModel === model.id ? 'Selecionado' : 'Selecionar'}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {model.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Velocidade</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {model.responseTime}s resposta
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Precisão</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {model.accuracy}%
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Capacidades</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {model.capabilities.map((cap, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {cap}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {model.available && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uso de tokens</span>
                        <span>{model.tokensUsed.toLocaleString()} / {model.tokensLimit.toLocaleString()}</span>
                      </div>
                      <Progress value={getModelUsagePercentage(model)} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{getModelUsagePercentage(model).toFixed(1)}% utilizado</span>
                        <span>Custo: ${model.costPerToken}/token</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Histórico de Sessões</h3>
            <Button onClick={createNewSession}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Sessão
            </Button>
          </div>
          
          <div className="grid gap-4">
            {chatSessions.map((session) => (
              <Card key={session.id} className={currentSession === session.id ? 'ring-2 ring-primary' : ''}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-base">{session.name}</CardTitle>
                    <Badge variant="outline">{session.model}</Badge>
                    {session.starred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentSession(session.id)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Abrir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleStarSession(session.id)}
                    >
                      <Star className={`h-4 w-4 ${session.starred ? 'fill-current text-yellow-500' : ''}`} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteSession(session.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Criada</p>
                      <p>{session.createdAt.toLocaleDateString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Última msg</p>
                      <p>{formatRelativeTime(session.lastMessage)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Mensagens</p>
                      <p>{session.messageCount}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Tokens</p>
                      <p>{session.tokensUsed.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {analytics && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Mensagens</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.totalMessages.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      +12% desde ontem
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tokens Utilizados</CardTitle>
                    <Database className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.totalTokens.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      +8% desde ontem
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Custo Total</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${analytics.totalCost.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                      +5% desde ontem
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.averageResponseTime.toFixed(1)}s</div>
                    <p className="text-xs text-muted-foreground">
                      -3% desde ontem
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Uso Diário</CardTitle>
                    <CardDescription>Mensagens e tokens dos últimos dias</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.dailyUsage.map((day, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-primary rounded-full"></div>
                            <span className="text-sm">{new Date(day.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm">
                            <span>{day.messages} msgs</span>
                            <span>{day.tokens.toLocaleString()} tokens</span>
                            <span className="font-medium">${day.cost.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Top Prompts</CardTitle>
                    <CardDescription>Prompts mais utilizados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.topPrompts.map((prompt, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{prompt.prompt}</span>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{prompt.count}x</Badge>
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span className="text-xs">{prompt.avgRating.toFixed(1)}</span>
                              </div>
                            </div>
                          </div>
                          <Progress value={(prompt.count / 20) * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Modelo Mais Usado</CardTitle>
                  <CardDescription>Estatísticas do modelo principal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">{analytics.mostUsedModel}</p>
                        <p className="text-sm text-muted-foreground">Modelo preferido</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">65%</p>
                      <p className="text-sm text-muted-foreground">do uso total</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Configurações do Chat</CardTitle>
                <CardDescription>Personalize o comportamento da IA</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperatura: {chatSettings.temperature}</Label>
                  <input
                    id="temperature"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={chatSettings.temperature}
                    onChange={(e) => setChatSettings({
                      ...chatSettings,
                      temperature: parseFloat(e.target.value)
                    })}
                    className="w-full"
                    aria-label="Controla a criatividade das respostas"
                  />
                  <p className="text-xs text-muted-foreground">
                    Controla a criatividade das respostas
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxTokens">Tokens máximos: {chatSettings.maxTokens}</Label>
                  <input
                    id="maxTokens"
                    type="range"
                    min="100"
                    max="4000"
                    step="100"
                    value={chatSettings.maxTokens}
                    onChange={(e) => setChatSettings({
                      ...chatSettings,
                      maxTokens: parseInt(e.target.value)
                    })}
                    className="w-full"
                    aria-label="Limite de tokens por resposta"
                  />
                  <p className="text-xs text-muted-foreground">
                    Limite de tokens por resposta
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topP">Top P: {chatSettings.topP}</Label>
                  <input
                    id="topP"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={chatSettings.topP}
                    onChange={(e) => setChatSettings({
                      ...chatSettings,
                      topP: parseFloat(e.target.value)
                    })}
                    className="w-full"
                    aria-label="Controla a diversidade das respostas"
                  />
                  <p className="text-xs text-muted-foreground">
                    Controla a diversidade das respostas
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="systemPrompt">Prompt do Sistema</Label>
                  <Textarea
                    id="systemPrompt"
                    value={chatSettings.systemPrompt}
                    onChange={(e) => setChatSettings({
                      ...chatSettings,
                      systemPrompt: e.target.value
                    })}
                    placeholder="Defina o comportamento da IA..."
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Preferências</CardTitle>
                <CardDescription>Configurações de interface e experiência</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Salvamento automático</Label>
                    <p className="text-sm text-muted-foreground">
                      Salva conversas automaticamente
                    </p>
                  </div>
                  <Switch
                    checked={chatSettings.autoSave}
                    onCheckedChange={(checked) => setChatSettings({
                      ...chatSettings,
                      autoSave: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Entrada de voz</Label>
                    <p className="text-sm text-muted-foreground">
                      Habilita comandos de voz
                    </p>
                  </div>
                  <Switch
                    checked={chatSettings.enableVoice}
                    onCheckedChange={(checked) => setChatSettings({
                      ...chatSettings,
                      enableVoice: checked
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Idioma de voz</Label>
                  <Select 
                    value={chatSettings.voiceLanguage} 
                    onValueChange={(value) => setChatSettings({
                      ...chatSettings,
                      voiceLanguage: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                      <SelectItem value="fr-FR">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tema</Label>
                  <Select 
                    value={chatSettings.theme} 
                    onValueChange={(value: 'light' | 'dark' | 'auto') => setChatSettings({
                      ...chatSettings,
                      theme: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Escuro</SelectItem>
                      <SelectItem value="auto">Automático</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ações Avançadas</CardTitle>
              <CardDescription>Opções de backup e manutenção</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={exportChat}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Conversas
                </Button>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Importar Conversas
                </Button>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Limpar Cache
                </Button>
                <Button variant="outline">
                  <Database className="h-4 w-4 mr-2" />
                  Backup Completo
                </Button>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpar Tudo
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
