'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AIIntegration, AIMetrics, AIAlerts, useAI } from './index';

// Exemplo 1: Uso básico do componente AIIntegration
export function BasicAIExample() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Exemplo Básico - Chat IA</h2>
      <AIIntegration />
    </div>
  );
}

// Exemplo 2: Uso do hook useAI
export function AIHookExample() {
  const {
    messages,
    models,
    loading,
    error,
    sendMessage,
    clearChat,
    createSession
  } = useAI();

  const [input, setInput] = useState('');

  const handleSendMessage = async () => {
    if (input.trim()) {
      await sendMessage(input, 'gpt-4');
      setInput('');
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Chat Personalizado com Hook useAI</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <span>Modelos disponíveis:</span>
          {models.map(model => (
            <Badge key={model.id} variant={model.available ? 'default' : 'secondary'}>
              {model.name}
            </Badge>
          ))}
        </div>

        <div className="h-64 bg-muted rounded-lg p-4 overflow-y-auto">
          {messages.map(message => (
            <div key={message.id} className="mb-2">
              <strong>{message.role}:</strong> {message.content}
            </div>
          ))}
        </div>

        <div className="flex space-x-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 px-3 py-2 border rounded"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button onClick={handleSendMessage} disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar'}
          </Button>
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <div className="flex space-x-2">
          <Button variant="outline" onClick={clearChat}>
            Limpar Chat
          </Button>
          <Button variant="outline" onClick={() => createSession('Nova Sessão', 'gpt-4')}>
            Nova Sessão
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Exemplo 3: Métricas de IA
export function AIMetricsExample() {
  const mockAnalytics = {
    totalMessages: 1250,
    totalTokens: 45230,
    totalCost: 12.45,
    averageResponseTime: 2.1,
    mostUsedModel: 'gpt-4',
    dailyUsage: [
      { date: '2024-01-01', messages: 12, tokens: 3200, cost: 0.96 },
      { date: '2024-01-02', messages: 18, tokens: 4500, cost: 1.35 },
      { date: '2024-01-03', messages: 15, tokens: 3800, cost: 1.14 },
      { date: '2024-01-04', messages: 22, tokens: 5200, cost: 1.56 },
      { date: '2024-01-05', messages: 19, tokens: 4800, cost: 1.44 }
    ],
    topPrompts: [
      { prompt: 'Analise este código Python', count: 25, avgRating: 4.8 },
      { prompt: 'Explique este conceito de machine learning', count: 18, avgRating: 4.6 },
      { prompt: 'Crie um resumo deste texto', count: 15, avgRating: 4.9 },
      { prompt: 'Traduza para português', count: 12, avgRating: 4.7 }
    ]
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Exemplo - Métricas de IA</h2>
      <AIMetrics analytics={mockAnalytics} />
    </div>
  );
}

// Exemplo 4: Sistema de Alertas
export function AIAlertsExample() {
  const [alerts, setAlerts] = useState([
    {
      id: '1',
      type: 'warning' as const,
      title: 'Limite de tokens próximo',
      message: 'O modelo GPT-4 está próximo do limite mensal de tokens (85% utilizado)',
      timestamp: new Date(Date.now() - 1800000), // 30 min atrás
      resolved: false,
      category: 'usage' as const,
      severity: 'medium' as const,
      metadata: {
        model: 'gpt-4',
        tokens: 85000,
        cost: 25.50
      }
    },
    {
      id: '2',
      type: 'error' as const,
      title: 'Tempo de resposta elevado',
      message: 'O tempo médio de resposta do Claude 3 está 40% acima do normal',
      timestamp: new Date(Date.now() - 3600000), // 1h atrás
      resolved: false,
      category: 'performance' as const,
      severity: 'high' as const,
      metadata: {
        model: 'claude-3-sonnet',
        responseTime: 4.2
      }
    },
    {
      id: '3',
      type: 'info' as const,
      title: 'Novo modelo disponível',
      message: 'O modelo GPT-4 Turbo está agora disponível na sua conta',
      timestamp: new Date(Date.now() - 7200000), // 2h atrás
      resolved: false,
      category: 'model' as const,
      severity: 'low' as const
    },
    {
      id: '4',
      type: 'success' as const,
      title: 'Backup completado',
      message: 'Backup mensal das conversas foi realizado com sucesso',
      timestamp: new Date(Date.now() - 86400000), // 1 dia atrás
      resolved: true,
      category: 'system' as const,
      severity: 'low' as const
    }
  ]);

  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const handleRefreshAlerts = () => {
    // Simular atualização de alertas
    console.log('Atualizando alertas...');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Exemplo - Sistema de Alertas</h2>
      <AIAlerts 
        alerts={alerts} 
        onResolveAlert={handleResolveAlert}
        onRefreshAlerts={handleRefreshAlerts}
      />
    </div>
  );
}

// Exemplo 5: Dashboard completo
export function AICompleteDashboard() {
  const { analytics, models, loading } = useAI();

  const mockAlerts = [
    {
      id: '1',
      type: 'warning' as const,
      title: 'Custo mensal elevado',
      message: 'Os custos deste mês já ultrapassaram 80% do orçamento',
      timestamp: new Date(Date.now() - 900000),
      resolved: false,
      category: 'cost' as const,
      severity: 'medium' as const,
      metadata: { cost: 420.50 }
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard de IA Completo</h1>
        <Badge variant="outline">
          {models.filter(m => m.available).length} modelos ativos
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Métricas */}
        <div className="lg:col-span-2">
          {analytics && <AIMetrics analytics={analytics} />}
        </div>

        {/* Alertas */}
        <div className="lg:col-span-1">
          <AIAlerts 
            alerts={mockAlerts} 
            onResolveAlert={() => {}}
            onRefreshAlerts={() => {}}
          />
        </div>
      </div>

      {/* Chat Principal */}
      <Card>
        <CardHeader>
          <CardTitle>Chat Integrado</CardTitle>
        </CardHeader>
        <CardContent>
          <AIIntegration />
        </CardContent>
      </Card>
    </div>
  );
}

// Exemplo 6: Configuração avançada
export function AIAdvancedConfigExample() {
  const { 
    settings, 
    updateSettings, 
    models,
    exportData
  } = useAI();

  const handleUpdateSettings = (key: string, value: any) => {
    updateSettings({ [key]: value });
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Configurações Avançadas de IA</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Temperatura</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.temperature}
              onChange={(e) => handleUpdateSettings('temperature', parseFloat(e.target.value))}
              className="w-full"
              aria-label="Controle de temperatura da IA"
            />
            <span className="text-sm text-muted-foreground">{settings.temperature}</span>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Max Tokens</label>
            <input
              type="range"
              min="100"
              max="4000"
              step="100"
              value={settings.maxTokens}
              onChange={(e) => handleUpdateSettings('maxTokens', parseInt(e.target.value))}
              className="w-full"
              aria-label="Limite máximo de tokens"
            />
            <span className="text-sm text-muted-foreground">{settings.maxTokens}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Prompt do Sistema</label>
          <textarea
            value={settings.systemPrompt}
            onChange={(e) => handleUpdateSettings('systemPrompt', e.target.value)}
            className="w-full h-24 p-3 border rounded"
            placeholder="Defina o comportamento da IA..."
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={settings.autoSave}
            onChange={(e) => handleUpdateSettings('autoSave', e.target.checked)}
            aria-label="Ativar salvamento automático"
          />
          <label className="text-sm">Salvamento automático</label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={settings.enableVoice}
            onChange={(e) => handleUpdateSettings('enableVoice', e.target.checked)}
            aria-label="Ativar entrada de voz"
          />
          <label className="text-sm">Entrada de voz</label>
        </div>

        <div className="flex space-x-2">
          <Button onClick={exportData}>
            Exportar Dados
          </Button>
          <Button variant="outline">
            Importar Configuração
          </Button>
          <Button variant="destructive">
            Resetar Configurações
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Exemplo de uso em diferentes cenários
export function AIUseCaseExamples() {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Exemplos de Uso - IA Integration</h1>
      
      <div className="space-y-6">
        <BasicAIExample />
        <AIHookExample />
        <AIMetricsExample />
        <AIAlertsExample />
        <AIAdvancedConfigExample />
      </div>
    </div>
  );
}
