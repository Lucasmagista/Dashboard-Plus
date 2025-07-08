"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Activity, 
  Zap, 
  Clock, 
  Gauge, 
  Wifi, 
  Cpu, 
  HardDrive, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

interface PerformanceMetric {
  name: string
  value: number
  unit: string
  threshold: number
  status: 'good' | 'warning' | 'critical'
  trend: 'up' | 'down' | 'stable'
  history: Array<{ time: string; value: number }>
}

interface SystemMetric {
  cpu: number
  memory: number
  network: number
  storage: number
}

export const PerformanceMonitorWidget: React.FC = () => {
  const [isMonitoring, setIsMonitoring] = useState(true)
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric>({
    cpu: 25,
    memory: 45,
    network: 12,
    storage: 67
  })

  const [webVitals, setWebVitals] = useState<PerformanceMetric[]>([
    {
      name: 'First Contentful Paint',
      value: 1.2,
      unit: 's',
      threshold: 1.8,
      status: 'good',
      trend: 'down',
      history: Array.from({ length: 20 }, (_, i) => ({
        time: `${20 - i}min`,
        value: 1.2 + (Math.random() - 0.5) * 0.4
      }))
    },
    {
      name: 'Largest Contentful Paint',
      value: 2.1,
      unit: 's',
      threshold: 2.5,
      status: 'good',
      trend: 'stable',
      history: Array.from({ length: 20 }, (_, i) => ({
        time: `${20 - i}min`,
        value: 2.1 + (Math.random() - 0.5) * 0.6
      }))
    },
    {
      name: 'Cumulative Layout Shift',
      value: 0.08,
      unit: '',
      threshold: 0.1,
      status: 'good',
      trend: 'down',
      history: Array.from({ length: 20 }, (_, i) => ({
        time: `${20 - i}min`,
        value: 0.08 + (Math.random() - 0.5) * 0.04
      }))
    },
    {
      name: 'First Input Delay',
      value: 85,
      unit: 'ms',
      threshold: 100,
      status: 'good',
      trend: 'up',
      history: Array.from({ length: 20 }, (_, i) => ({
        time: `${20 - i}min`,
        value: 85 + (Math.random() - 0.5) * 30
      }))
    }
  ])

  const [apiMetrics, setApiMetrics] = useState([
    { endpoint: '/api/contacts', responseTime: 245, requests: 1250, errors: 3 },
    { endpoint: '/api/deals', responseTime: 180, requests: 890, errors: 1 },
    { endpoint: '/api/activities', responseTime: 320, requests: 2100, errors: 8 },
    { endpoint: '/api/analytics', responseTime: 450, requests: 340, errors: 0 }
  ])

  // Simular atualizações em tempo real
  useEffect(() => {
    if (!isMonitoring) return

    const interval = setInterval(() => {
      // Atualizar métricas do sistema
      setSystemMetrics(prev => ({
        cpu: Math.max(0, Math.min(100, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(0, Math.min(100, prev.memory + (Math.random() - 0.5) * 5)),
        network: Math.max(0, Math.min(100, prev.network + (Math.random() - 0.5) * 15)),
        storage: Math.max(0, Math.min(100, prev.storage + (Math.random() - 0.5) * 2))
      }))

      // Atualizar Web Vitals
      setWebVitals(prev => prev.map(metric => {
        const newValue = Math.max(0, metric.value + (Math.random() - 0.5) * metric.value * 0.1)
        const newHistory = [
          ...metric.history.slice(1),
          { time: 'now', value: newValue }
        ]
        
        let status: 'good' | 'warning' | 'critical' = 'good'
        if (newValue > metric.threshold * 1.2) status = 'critical'
        else if (newValue > metric.threshold) status = 'warning'

        return {
          ...metric,
          value: newValue,
          history: newHistory,
          status
        }
      }))

      // Atualizar métricas de API
      setApiMetrics(prev => prev.map(api => ({
        ...api,
        responseTime: Math.max(50, api.responseTime + (Math.random() - 0.5) * 50),
        requests: api.requests + Math.floor(Math.random() * 10),
        errors: Math.max(0, api.errors + (Math.random() > 0.9 ? 1 : 0))
      })))
    }, 3000)

    return () => clearInterval(interval)
  }, [isMonitoring])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />
      default: return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-red-500" />
      case 'down': return <TrendingDown className="w-3 h-3 text-green-500" />
      default: return <div className="w-3 h-3 bg-gray-400 rounded-full" />
    }
  }

  const getSystemColor = (value: number) => {
    if (value < 50) return 'text-green-600'
    if (value < 75) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="w-5 h-5" />
              Monitor de Performance
            </CardTitle>
            <CardDescription>
              Monitoramento em tempo real de métricas de performance e sistema
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isMonitoring ? "default" : "secondary"}>
              {isMonitoring ? "Ativo" : "Pausado"}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMonitoring(!isMonitoring)}
            >
              {isMonitoring ? "Pausar" : "Iniciar"}
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="web-vitals" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="web-vitals">Web Vitals</TabsTrigger>
            <TabsTrigger value="system">Sistema</TabsTrigger>
            <TabsTrigger value="api">APIs</TabsTrigger>
            <TabsTrigger value="trends">Tendências</TabsTrigger>
          </TabsList>

          {/* Web Vitals */}
          <TabsContent value="web-vitals" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {webVitals.map(metric => (
                <Card key={metric.name}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">
                        {metric.name}
                      </CardTitle>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(metric.status)}
                        {getTrendIcon(metric.trend)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className={`text-2xl font-bold ${
                        metric.status === 'good' ? 'text-green-600' :
                        metric.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {metric.value.toFixed(metric.unit === 's' ? 1 : 2)}
                      </span>
                      <span className="text-sm text-muted-foreground">{metric.unit}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mb-3">
                      Limite: {metric.threshold}{metric.unit}
                    </div>
                    <div className="h-16">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={metric.history.slice(-10)}>
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke={
                              metric.status === 'good' ? '#22c55e' :
                              metric.status === 'warning' ? '#eab308' : '#ef4444'
                            }
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Métricas do Sistema */}
          <TabsContent value="system" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    CPU
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl font-bold ${getSystemColor(systemMetrics.cpu)}`}>
                      {systemMetrics.cpu.toFixed(1)}%
                    </span>
                    <div className="flex-1">
                      <Progress value={systemMetrics.cpu} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <HardDrive className="w-4 h-4" />
                    Memória
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl font-bold ${getSystemColor(systemMetrics.memory)}`}>
                      {systemMetrics.memory.toFixed(1)}%
                    </span>
                    <div className="flex-1">
                      <Progress value={systemMetrics.memory} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Wifi className="w-4 h-4" />
                    Rede
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl font-bold ${getSystemColor(systemMetrics.network)}`}>
                      {systemMetrics.network.toFixed(1)}%
                    </span>
                    <div className="flex-1">
                      <Progress value={systemMetrics.network} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <HardDrive className="w-4 h-4" />
                    Armazenamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl font-bold ${getSystemColor(systemMetrics.storage)}`}>
                      {systemMetrics.storage.toFixed(1)}%
                    </span>
                    <div className="flex-1">
                      <Progress value={systemMetrics.storage} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Métricas de API */}
          <TabsContent value="api" className="space-y-4">
            <div className="space-y-3">
              {apiMetrics.map(api => (
                <Card key={api.endpoint}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{api.endpoint}</h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {api.responseTime}ms
                          </div>
                          <div className="flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            {api.requests.toLocaleString()} req/h
                          </div>
                          <div className="flex items-center gap-1">
                            <AlertTriangle className={`w-3 h-3 ${api.errors > 0 ? 'text-red-500' : 'text-green-500'}`} />
                            {api.errors} erros
                          </div>
                        </div>
                      </div>
                      <Badge variant={api.errors > 5 ? "destructive" : api.responseTime > 400 ? "secondary" : "default"}>
                        {api.errors > 5 ? 'Crítico' : api.responseTime > 400 ? 'Lento' : 'Saudável'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tendências */}
          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Tendência de Performance (últimas 24h)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={webVitals[0].history}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#8884d8" 
                        fill="#8884d8" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
