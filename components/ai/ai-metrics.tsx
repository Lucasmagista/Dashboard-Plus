'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  MessageSquare, 
  Database, 
  Clock, 
  Bot, 
  Zap,
  BarChart3,
  Star
} from 'lucide-react';

interface AIMetricsProps {
  analytics: {
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
  };
}

export function AIMetrics({ analytics }: AIMetricsProps) {
  const totalUsageToday = analytics.dailyUsage[analytics.dailyUsage.length - 1] || {
    messages: 0,
    tokens: 0,
    cost: 0
  };

  const previousDayUsage = analytics.dailyUsage[analytics.dailyUsage.length - 2] || {
    messages: 0,
    tokens: 0,
    cost: 0
  };

  const messageGrowth = previousDayUsage.messages > 0 
    ? ((totalUsageToday.messages - previousDayUsage.messages) / previousDayUsage.messages) * 100
    : 0;

  const tokenGrowth = previousDayUsage.tokens > 0 
    ? ((totalUsageToday.tokens - previousDayUsage.tokens) / previousDayUsage.tokens) * 100
    : 0;

  const costGrowth = previousDayUsage.cost > 0 
    ? ((totalUsageToday.cost - previousDayUsage.cost) / previousDayUsage.cost) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Mensagens</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalMessages.toLocaleString()}</div>
            <div className="flex items-center space-x-1">
              <TrendingUp className={`h-3 w-3 ${messageGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
              <p className={`text-xs ${messageGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {messageGrowth >= 0 ? '+' : ''}{messageGrowth.toFixed(1)}% hoje
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tokens Utilizados</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalTokens.toLocaleString()}</div>
            <div className="flex items-center space-x-1">
              <TrendingUp className={`h-3 w-3 ${tokenGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
              <p className={`text-xs ${tokenGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {tokenGrowth >= 0 ? '+' : ''}{tokenGrowth.toFixed(1)}% hoje
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custo Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.totalCost.toFixed(2)}</div>
            <div className="flex items-center space-x-1">
              <TrendingUp className={`h-3 w-3 ${costGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
              <p className={`text-xs ${costGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {costGrowth >= 0 ? '+' : ''}{costGrowth.toFixed(1)}% hoje
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageResponseTime.toFixed(1)}s</div>
            <p className="text-xs text-green-600">
              -15% melhor que ontem
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Uso Diário */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Uso Diário</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.dailyUsage.map((day, index) => {
              const maxMessages = Math.max(...analytics.dailyUsage.map(d => d.messages));
              const maxTokens = Math.max(...analytics.dailyUsage.map(d => d.tokens));
              const maxCost = Math.max(...analytics.dailyUsage.map(d => d.cost));
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {new Date(day.date).toLocaleDateString('pt-BR', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>{day.messages} msgs</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>{day.tokens.toLocaleString()} tokens</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="font-medium">${day.cost.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Progress value={(day.messages / maxMessages) * 100} className="h-1" />
                    <Progress value={(day.tokens / maxTokens) * 100} className="h-1" />
                    <Progress value={(day.cost / maxCost) * 100} className="h-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Top Prompts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span>Prompts Mais Utilizados</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.topPrompts.map((prompt, index) => {
              const maxCount = Math.max(...analytics.topPrompts.map(p => p.count));
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate flex-1">
                      {prompt.prompt}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{prompt.count}x</Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-medium">{prompt.avgRating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <Progress value={(prompt.count / maxCount) * 100} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Modelo Mais Usado */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <span>Modelo Preferido</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold">{analytics.mostUsedModel}</p>
                <p className="text-sm text-muted-foreground">Modelo mais utilizado</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">65%</p>
              <p className="text-sm text-muted-foreground">do uso total</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas de Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Performance dos Modelos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'GPT-4', responseTime: 2.5, accuracy: 95, usage: 65 },
              { name: 'GPT-3.5 Turbo', responseTime: 1.2, accuracy: 88, usage: 25 },
              { name: 'Claude 3', responseTime: 1.8, accuracy: 92, usage: 8 },
              { name: 'Gemini Pro', responseTime: 1.5, accuracy: 90, usage: 2 }
            ].map((model, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{model.name}</p>
                    <p className="text-xs text-muted-foreground">{model.usage}% do uso</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="text-center">
                    <p className="font-medium">{model.responseTime}s</p>
                    <p className="text-xs text-muted-foreground">Resposta</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{model.accuracy}%</p>
                    <p className="text-xs text-muted-foreground">Precisão</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
