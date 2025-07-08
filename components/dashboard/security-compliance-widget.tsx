"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Shield, 
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Key,
  Fingerprint,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  FileText,
  Download,
  RefreshCw,
  Settings,
  Globe,
  Database,
  Activity,
  Zap
} from 'lucide-react'
import { cn } from "@/lib/utils"

interface SecurityEvent {
  id: string
  type: 'authentication' | 'access' | 'data' | 'compliance' | 'threat'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  timestamp: string
  user?: string
  location?: string
  resolved: boolean
  actions: string[]
}

interface SecurityMetrics {
  securityScore: number
  activeThreats: number
  lastAudit: string
  complianceLevel: number
  failedLogins: number
  mfaAdoption: number
  dataEncryption: number
  vulnerabilities: number
}

const mockEvents: SecurityEvent[] = [
  {
    id: '1',
    type: 'authentication',
    severity: 'medium',
    title: 'Múltiplas tentativas de login falharam',
    description: 'Usuário tentou fazer login 5 vezes sem sucesso',
    timestamp: '5 min ago',
    user: 'usuario@empresa.com',
    location: 'São Paulo, BR',
    resolved: false,
    actions: ['Bloquear conta', 'Notificar usuário', 'Exigir reset senha']
  },
  {
    id: '2',
    type: 'access',
    severity: 'high',
    title: 'Acesso fora do horário comercial',
    description: 'Usuário administrador acessou sistema às 23:45',
    timestamp: '2 hours ago',
    user: 'admin@empresa.com',
    location: 'Rio de Janeiro, BR',
    resolved: true,
    actions: ['Verificar logs', 'Confirmar legitimidade']
  },
  {
    id: '3',
    type: 'data',
    severity: 'critical',
    title: 'Tentativa de exportação em massa',
    description: 'Usuário tentou exportar mais de 10.000 registros',
    timestamp: '4 hours ago',
    user: 'vendedor@empresa.com',
    location: 'Brasília, BR',
    resolved: false,
    actions: ['Bloquear exportação', 'Investigar', 'Notificar DPO']
  },
  {
    id: '4',
    type: 'compliance',
    severity: 'medium',
    title: 'Dados não atualizados há 90 dias',
    description: 'Registros de clientes precisam ser validados',
    timestamp: '1 day ago',
    resolved: false,
    actions: ['Validar dados', 'Contatar clientes', 'Atualizar registros']
  },
  {
    id: '5',
    type: 'threat',
    severity: 'low',
    title: 'IP suspeito detectado',
    description: 'Tentativa de acesso de região não autorizada',
    timestamp: '3 hours ago',
    location: 'Exterior',
    resolved: true,
    actions: ['Bloquear IP', 'Adicionar à blacklist']
  }
]

const mockMetrics: SecurityMetrics = {
  securityScore: 87,
  activeThreats: 2,
  lastAudit: '15 days ago',
  complianceLevel: 94,
  failedLogins: 23,
  mfaAdoption: 78,
  dataEncryption: 100,
  vulnerabilities: 3
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'text-red-600 bg-red-50'
    case 'high': return 'text-orange-600 bg-orange-50'
    case 'medium': return 'text-yellow-600 bg-yellow-50'
    case 'low': return 'text-blue-600 bg-blue-50'
    default: return 'text-gray-600 bg-gray-50'
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'authentication': return Key
    case 'access': return Unlock
    case 'data': return Database
    case 'compliance': return FileText
    case 'threat': return ShieldAlert
    default: return Shield
  }
}

const getSecurityScoreColor = (score: number) => {
  if (score >= 90) return 'text-green-600'
  if (score >= 70) return 'text-yellow-600'
  return 'text-red-600'
}

export default function SecurityComplianceWidget() {
  const [events, setEvents] = useState<SecurityEvent[]>(mockEvents)
  const [metrics, setMetrics] = useState<SecurityMetrics>(mockMetrics)
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all')
  const [isScanning, setIsScanning] = useState(false)
  const [lastScan, setLastScan] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setLastScan(new Date())
    }, 30000) // Update every 30 seconds
    return () => clearInterval(timer)
  }, [])

  const handleResolve = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, resolved: true }
        : event
    ))
  }

  const handleScan = async () => {
    setIsScanning(true)
    // Simulate security scan
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsScanning(false)
    setLastScan(new Date())
  }

  const filteredEvents = selectedSeverity === 'all' 
    ? events 
    : events.filter(event => event.severity === selectedSeverity)

  const unresolvedEvents = events.filter(e => !e.resolved)
  const criticalEvents = events.filter(e => e.severity === 'critical' && !e.resolved)

  const severityFilters = [
    { value: 'all', label: 'Todos', count: events.length },
    { value: 'critical', label: 'Crítico', count: events.filter(e => e.severity === 'critical').length },
    { value: 'high', label: 'Alto', count: events.filter(e => e.severity === 'high').length },
    { value: 'medium', label: 'Médio', count: events.filter(e => e.severity === 'medium').length },
    { value: 'low', label: 'Baixo', count: events.filter(e => e.severity === 'low').length },
  ]

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Segurança & Conformidade
            </CardTitle>
            <CardDescription>
              Monitoramento de segurança e compliance LGPD/GDPR
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleScan}
              disabled={isScanning}
            >
              <RefreshCw className={cn("h-4 w-4", isScanning && "animate-spin")} />
            </Button>
            <Button size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Security Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-xs text-blue-600 font-medium">Score Segurança</div>
            <div className={cn(
              "text-lg font-bold",
              getSecurityScoreColor(metrics.securityScore)
            )}>
              {metrics.securityScore}%
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <div className="text-xs text-red-600 font-medium">Ameaças Ativas</div>
            <div className="text-lg font-bold text-red-700 flex items-center gap-1">
              {metrics.activeThreats}
              {metrics.activeThreats > 0 && (
                <AlertTriangle className="h-4 w-4" />
              )}
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-xs text-green-600 font-medium">Conformidade</div>
            <div className="text-lg font-bold text-green-700">
              {metrics.complianceLevel}%
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-xs text-purple-600 font-medium">MFA Adoção</div>
            <div className="text-lg font-bold text-purple-700">
              {metrics.mfaAdoption}%
            </div>
          </div>
        </div>

        {/* Additional Security Metrics */}
        <div className="grid grid-cols-4 gap-2 mt-2">
          <div className="bg-gray-50 rounded p-2 text-center">
            <div className="text-xs text-gray-600">Logins Falharam</div>
            <div className="font-medium text-red-600">{metrics.failedLogins}</div>
          </div>
          <div className="bg-gray-50 rounded p-2 text-center">
            <div className="text-xs text-gray-600">Vulnerabilidades</div>
            <div className="font-medium text-orange-600">{metrics.vulnerabilities}</div>
          </div>
          <div className="bg-gray-50 rounded p-2 text-center">
            <div className="text-xs text-gray-600">Criptografia</div>
            <div className="font-medium text-green-600">{metrics.dataEncryption}%</div>
          </div>
          <div className="bg-gray-50 rounded p-2 text-center">
            <div className="text-xs text-gray-600">Última Auditoria</div>
            <div className="font-medium">{metrics.lastAudit}</div>
          </div>
        </div>

        {/* Severity Filter */}
        <div className="flex gap-1 mt-4 overflow-x-auto">
          {severityFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={selectedSeverity === filter.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSeverity(filter.value)}
              className="whitespace-nowrap"
            >
              {filter.label}
              <Badge variant="secondary" className="ml-1 text-xs">
                {filter.count}
              </Badge>
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 max-h-80 overflow-y-auto">
        {filteredEvents.map((event) => {
          const TypeIcon = getTypeIcon(event.type)
          
          return (
            <div 
              key={event.id}
              className={cn(
                "border rounded-lg p-3 transition-colors",
                event.resolved ? "bg-gray-50" : "hover:bg-gray-50"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={cn(
                    "p-2 rounded-lg",
                    getSeverityColor(event.severity)
                  )}>
                    <TypeIcon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className={cn(
                        "font-medium text-sm truncate",
                        event.resolved && "line-through text-gray-500"
                      )}>
                        {event.title}
                      </h4>
                      
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", getSeverityColor(event.severity))}
                      >
                        {event.severity}
                      </Badge>
                      
                      {event.resolved ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      {event.user && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {event.user}
                        </div>
                      )}
                      
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {event.location}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {event.timestamp}
                      </div>
                    </div>

                    {/* Recommended Actions */}
                    {!event.resolved && event.actions.length > 0 && (
                      <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                        <div className="font-medium text-blue-700 mb-1">Ações Recomendadas:</div>
                        <div className="flex flex-wrap gap-1">
                          {event.actions.map((action, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {action}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-1 ml-2">
                  {!event.resolved && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleResolve(event.id)}
                      className="h-8 w-8 p-0 text-green-600"
                      title="Marcar como resolvido"
                    >
                      <CheckCircle className="h-3 w-3" />
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    title="Ver detalhes"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    title="Gerar relatório"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          )
        })}

        {filteredEvents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <ShieldCheck className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">Nenhum evento de segurança encontrado</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={handleScan}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Executar varredura
            </Button>
          </div>
        )}

        {/* Quick Actions Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="w-full">
              <FileText className="h-4 w-4 mr-1" />
              Relatório LGPD
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              <Download className="h-4 w-4 mr-1" />
              Audit Log
            </Button>
          </div>
          
          <div className="text-xs text-gray-500 text-center mt-2">
            Última varredura: {lastScan.toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
