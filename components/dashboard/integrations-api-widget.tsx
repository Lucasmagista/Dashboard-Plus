"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Zap, 
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Settings,
  ExternalLink,
  Code,
  Database,
  Cloud,
  Smartphone,
  Globe,
  Mail,
  ShoppingCart,
  CreditCard,
  MessageSquare,
  Calendar,
  FileText,
  Users,
  BarChart3,
  Clock,
  AlertCircle,
  Plug,
  Link
} from 'lucide-react'
import { cn } from "@/lib/utils"

interface Integration {
  id: string
  name: string
  description: string
  category: 'email' | 'ecommerce' | 'payment' | 'crm' | 'analytics' | 'communication' | 'productivity'
  status: 'connected' | 'disconnected' | 'error' | 'syncing'
  lastSync: string
  apiCalls: number
  apiLimit: number
  uptime: number
  version: string
  webhooksActive: number
  dataTransferred: string
  responseTime: number
}

const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: 'Gmail API',
    description: 'Sincronização bidirecional de e-mails',
    category: 'email',
    status: 'connected',
    lastSync: '2 min ago',
    apiCalls: 2847,
    apiLimit: 10000,
    uptime: 99.8,
    version: 'v1.0',
    webhooksActive: 3,
    dataTransferred: '156 MB',
    responseTime: 245
  },
  {
    id: '2',
    name: 'Stripe Payment',
    description: 'Processamento de pagamentos internacional',
    category: 'payment',
    status: 'connected',
    lastSync: '1 min ago',
    apiCalls: 1234,
    apiLimit: 5000,
    uptime: 99.9,
    version: 'v2023.11',
    webhooksActive: 5,
    dataTransferred: '89 MB',
    responseTime: 123
  },
  {
    id: '3',
    name: 'Shopify Store',
    description: 'Importação automática de pedidos',
    category: 'ecommerce',
    status: 'syncing',
    lastSync: 'Syncing...',
    apiCalls: 892,
    apiLimit: 2000,
    uptime: 98.5,
    version: 'v2024.01',
    webhooksActive: 4,
    dataTransferred: '234 MB',
    responseTime: 567
  },
  {
    id: '4',
    name: 'WhatsApp Business',
    description: 'Mensagens e automação',
    category: 'communication',
    status: 'connected',
    lastSync: '5 min ago',
    apiCalls: 3456,
    apiLimit: 8000,
    uptime: 97.2,
    version: 'v17.0',
    webhooksActive: 2,
    dataTransferred: '78 MB',
    responseTime: 189
  },
  {
    id: '5',
    name: 'Google Analytics',
    description: 'Métricas de website e conversões',
    category: 'analytics',
    status: 'connected',
    lastSync: '10 min ago',
    apiCalls: 567,
    apiLimit: 3000,
    uptime: 99.5,
    version: 'GA4',
    webhooksActive: 1,
    dataTransferred: '45 MB',
    responseTime: 334
  },
  {
    id: '6',
    name: 'HubSpot CRM',
    description: 'Sincronização de contatos e leads',
    category: 'crm',
    status: 'error',
    lastSync: '2 hours ago',
    apiCalls: 123,
    apiLimit: 1000,
    uptime: 95.1,
    version: 'v3',
    webhooksActive: 0,
    dataTransferred: '12 MB',
    responseTime: 1200
  },
  {
    id: '7',
    name: 'Microsoft 365',
    description: 'Calendar, Teams e SharePoint',
    category: 'productivity',
    status: 'connected',
    lastSync: '15 min ago',
    apiCalls: 789,
    apiLimit: 4000,
    uptime: 98.9,
    version: 'Graph v1.0',
    webhooksActive: 3,
    dataTransferred: '134 MB',
    responseTime: 456
  }
]

const getCategoryInfo = (category: string) => {
  switch (category) {
    case 'email':
      return { name: 'E-mail', color: 'bg-blue-500', icon: Mail }
    case 'ecommerce':
      return { name: 'E-commerce', color: 'bg-green-500', icon: ShoppingCart }
    case 'payment':
      return { name: 'Pagamentos', color: 'bg-purple-500', icon: CreditCard }
    case 'crm':
      return { name: 'CRM', color: 'bg-orange-500', icon: Users }
    case 'analytics':
      return { name: 'Analytics', color: 'bg-red-500', icon: BarChart3 }
    case 'communication':
      return { name: 'Comunicação', color: 'bg-yellow-500', icon: MessageSquare }
    case 'productivity':
      return { name: 'Produtividade', color: 'bg-indigo-500', icon: Calendar }
    default:
      return { name: 'Outros', color: 'bg-gray-500', icon: Plug }
  }
}

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'connected':
      return { color: 'text-green-600 bg-green-50', icon: CheckCircle, label: 'Conectado' }
    case 'disconnected':
      return { color: 'text-gray-600 bg-gray-50', icon: XCircle, label: 'Desconectado' }
    case 'error':
      return { color: 'text-red-600 bg-red-50', icon: AlertTriangle, label: 'Erro' }
    case 'syncing':
      return { color: 'text-blue-600 bg-blue-50', icon: RefreshCw, label: 'Sincronizando' }
    default:
      return { color: 'text-gray-600 bg-gray-50', icon: XCircle, label: 'Desconhecido' }
  }
}

const getUptimeColor = (uptime: number) => {
  if (uptime >= 99) return 'text-green-600'
  if (uptime >= 95) return 'text-yellow-600'
  return 'text-red-600'
}

const getResponseTimeColor = (responseTime: number) => {
  if (responseTime <= 200) return 'text-green-600'
  if (responseTime <= 500) return 'text-yellow-600'
  return 'text-red-600'
}

export default function IntegrationsAPIWidget() {
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [stats, setStats] = useState({
    totalIntegrations: 0,
    activeIntegrations: 0,
    totalApiCalls: 0,
    avgUptime: 0,
    totalWebhooks: 0
  })

  useEffect(() => {
    const totalIntegrations = integrations.length
    const activeIntegrations = integrations.filter(i => i.status === 'connected').length
    const totalApiCalls = integrations.reduce((sum, i) => sum + i.apiCalls, 0)
    const avgUptime = integrations.reduce((sum, i) => sum + i.uptime, 0) / integrations.length
    const totalWebhooks = integrations.reduce((sum, i) => sum + i.webhooksActive, 0)

    setStats({
      totalIntegrations,
      activeIntegrations,
      totalApiCalls,
      avgUptime,
      totalWebhooks
    })
  }, [integrations])

  const handleRefresh = async (integrationId?: string) => {
    setIsRefreshing(true)
    // Simulate API refresh
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    if (integrationId) {
      setIntegrations(prev => prev.map(integration => 
        integration.id === integrationId 
          ? { ...integration, lastSync: 'Just now', status: 'connected' as any }
          : integration
      ))
    }
    setIsRefreshing(false)
  }

  const filteredIntegrations = selectedCategory === 'all' 
    ? integrations 
    : integrations.filter(integration => integration.category === selectedCategory)

  const categories = [
    { value: 'all', label: 'Todas', count: integrations.length },
    { value: 'email', label: 'E-mail', count: integrations.filter(i => i.category === 'email').length },
    { value: 'payment', label: 'Pagamentos', count: integrations.filter(i => i.category === 'payment').length },
    { value: 'ecommerce', label: 'E-commerce', count: integrations.filter(i => i.category === 'ecommerce').length },
    { value: 'analytics', label: 'Analytics', count: integrations.filter(i => i.category === 'analytics').length },
    { value: 'communication', label: 'Comunicação', count: integrations.filter(i => i.category === 'communication').length },
  ]

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5 text-indigo-500" />
              Integrações & APIs
            </CardTitle>
            <CardDescription>
              Monitoramento de APIs e integrações externas
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleRefresh()}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            </Button>
            <Button size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 mt-4">
          <div className="bg-indigo-50 rounded-lg p-3">
            <div className="text-xs text-indigo-600 font-medium">Total</div>
            <div className="text-lg font-bold text-indigo-700">
              {stats.totalIntegrations}
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-xs text-green-600 font-medium">Ativas</div>
            <div className="text-lg font-bold text-green-700">
              {stats.activeIntegrations}
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-xs text-purple-600 font-medium">API Calls</div>
            <div className="text-lg font-bold text-purple-700">
              {stats.totalApiCalls.toLocaleString()}
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-xs text-blue-600 font-medium">Uptime Médio</div>
            <div className="text-lg font-bold text-blue-700">
              {stats.avgUptime.toFixed(1)}%
            </div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="text-xs text-orange-600 font-medium">Webhooks</div>
            <div className="text-lg font-bold text-orange-700">
              {stats.totalWebhooks}
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-1 mt-4 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
              className="whitespace-nowrap"
            >
              {category.label}
              <Badge variant="secondary" className="ml-1 text-xs">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 max-h-80 overflow-y-auto">
        {filteredIntegrations.map((integration) => {
          const categoryInfo = getCategoryInfo(integration.category)
          const statusInfo = getStatusInfo(integration.status)
          
          return (
            <div 
              key={integration.id}
              className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={cn(
                    "p-2 rounded-lg text-white",
                    categoryInfo.color
                  )}>
                    <categoryInfo.icon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm truncate">
                        {integration.name}
                      </h4>
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", statusInfo.color)}
                      >
                        {statusInfo.label}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {integration.version}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {integration.description}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {integration.lastSync}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        {integration.apiCalls}/{integration.apiLimit} calls
                      </div>
                      
                      <div className={cn(
                        "flex items-center gap-1 font-medium",
                        getUptimeColor(integration.uptime)
                      )}>
                        {integration.uptime}% uptime
                      </div>
                    </div>

                    {/* API Usage Progress */}
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-600">Uso da API</span>
                        <span className="font-medium">
                          {((integration.apiCalls / integration.apiLimit) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress 
                        value={(integration.apiCalls / integration.apiLimit) * 100} 
                        className="h-1"
                      />
                    </div>

                    {/* Metrics Row */}
                    <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                      <div className="bg-gray-50 rounded p-2 text-center">
                        <div className="text-gray-600">Webhooks</div>
                        <div className="font-medium">{integration.webhooksActive}</div>
                      </div>
                      <div className="bg-gray-50 rounded p-2 text-center">
                        <div className="text-gray-600">Dados</div>
                        <div className="font-medium">{integration.dataTransferred}</div>
                      </div>
                      <div className="bg-gray-50 rounded p-2 text-center">
                        <div className="text-gray-600">Latência</div>
                        <div className={cn(
                          "font-medium",
                          getResponseTimeColor(integration.responseTime)
                        )}>
                          {integration.responseTime}ms
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRefresh(integration.id)}
                    disabled={isRefreshing}
                    className="h-8 w-8 p-0"
                    title="Sincronizar"
                  >
                    <RefreshCw className={cn("h-3 w-3", isRefreshing && "animate-spin")} />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    title="Configurações"
                  >
                    <Settings className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    title="Documentação"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          )
        })}

        {filteredIntegrations.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Link className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">Nenhuma integração encontrada para esta categoria</p>
            <Button variant="outline" size="sm" className="mt-2">
              <ExternalLink className="h-4 w-4 mr-1" />
              Marketplace
            </Button>
          </div>
        )}

        {/* System Health Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status Geral:</span>
              <Badge variant="outline" className="text-green-600">
                Operacional
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Próxima manutenção:</span>
              <span className="font-medium">Domingo 02:00</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
