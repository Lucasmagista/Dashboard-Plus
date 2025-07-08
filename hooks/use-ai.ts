'use client';

import { useState, useCallback, useEffect } from 'react';

export interface ChatMessage {
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

export interface AIModel {
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

export interface ChatSettings {
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

export interface ChatSession {
  id: string;
  name: string;
  model: string;
  createdAt: Date;
  lastMessage: Date;
  messageCount: number;
  tokensUsed: number;
  starred: boolean;
}

export interface AIAnalytics {
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

export interface AIHookState {
  messages: ChatMessage[];
  models: AIModel[];
  sessions: ChatSession[];
  analytics: AIAnalytics | null;
  settings: ChatSettings;
  loading: boolean;
  error: string | null;
  success: string | null;
}

export function useAI() {
  const [state, setState] = useState<AIHookState>({
    messages: [],
    models: [],
    sessions: [],
    analytics: null,
    settings: {
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
    },
    loading: false,
    error: null,
    success: null
  });

  // Carregar dados iniciais
  const loadInitialData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Simulação de dados mock
      const mockModels: AIModel[] = [
        {
          id: 'gpt-4',
          name: 'GPT-4',
          description: 'Modelo mais avançado para tarefas complexas',
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
          description: 'Modelo rápido e eficiente',
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
        }
      ];

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
        }
      ];

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
          { prompt: 'Explique este conceito', count: 12, avgRating: 4.6 }
        ]
      };

      setState(prev => ({
        ...prev,
        models: mockModels,
        sessions: mockSessions,
        analytics: mockAnalytics,
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Erro ao carregar dados da IA'
      }));
    }
  }, []);

  // Enviar mensagem
  const sendMessage = useCallback(async (content: string, model: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
      type: 'text'
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      loading: true,
      error: null
    }));

    try {
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Resposta simulada para: "${content}"`,
        timestamp: new Date(),
        model,
        type: 'text',
        tokens: Math.floor(Math.random() * 500) + 100,
        metadata: {
          processingTime: 2.0,
          confidence: 0.95,
          sources: ['Knowledge Base']
        }
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, aiResponse],
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Erro ao processar mensagem'
      }));
    }
  }, []);

  // Avaliar mensagem
  const rateMessage = useCallback((messageId: string, rating: number) => {
    setState(prev => ({
      ...prev,
      messages: prev.messages.map(msg => 
        msg.id === messageId ? { ...msg, rating } : msg
      )
    }));
  }, []);

  // Marcar mensagem como favorita
  const bookmarkMessage = useCallback((messageId: string) => {
    setState(prev => ({
      ...prev,
      messages: prev.messages.map(msg => 
        msg.id === messageId ? { ...msg, bookmarked: !msg.bookmarked } : msg
      )
    }));
  }, []);

  // Limpar chat
  const clearChat = useCallback(() => {
    setState(prev => ({
      ...prev,
      messages: []
    }));
  }, []);

  // Criar nova sessão
  const createSession = useCallback((name: string, model: string) => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      name,
      model,
      createdAt: new Date(),
      lastMessage: new Date(),
      messageCount: 0,
      tokensUsed: 0,
      starred: false
    };

    setState(prev => ({
      ...prev,
      sessions: [newSession, ...prev.sessions]
    }));

    return newSession.id;
  }, []);

  // Deletar sessão
  const deleteSession = useCallback((sessionId: string) => {
    setState(prev => ({
      ...prev,
      sessions: prev.sessions.filter(s => s.id !== sessionId)
    }));
  }, []);

  // Atualizar configurações
  const updateSettings = useCallback((newSettings: Partial<ChatSettings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
  }, []);

  // Exportar dados
  const exportData = useCallback(() => {
    const data = {
      messages: state.messages,
      sessions: state.sessions,
      settings: state.settings,
      exportDate: new Date()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-chat-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [state]);

  // Limpar erros/sucessos
  const clearNotifications = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
      success: null
    }));
  }, []);

  // Inicializar dados ao montar
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  return {
    ...state,
    sendMessage,
    rateMessage,
    bookmarkMessage,
    clearChat,
    createSession,
    deleteSession,
    updateSettings,
    exportData,
    clearNotifications,
    loadInitialData
  };
}
