"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Phone, 
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Clock,
  Users,
  Mic,
  MicOff,
  Play,
  Pause,
  Volume2,
  Download,
  MessageSquare,
  Settings,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Headphones,
  Timer,
  UserCheck,
  AlertCircle
} from 'lucide-react'
import { cn } from "@/lib/utils"

interface CallData {
  id: string
  type: 'incoming' | 'outgoing' | 'missed'
  contact: string
  duration: number
  timestamp: string
  quality: number
  status: 'completed' | 'ongoing' | 'missed' | 'voicemail'
  agent?: string
  recording?: boolean
  transcription?: string
  tags: string[]
}

interface PhoneStats {
  totalCalls: number
  answeredCalls: number
  missedCalls: number
  avgCallDuration: number
  avgWaitTime: number
  satisfactionScore: number
  activeCalls: number
  availableAgents: number
}

const mockCalls: CallData[] = [
  {
    id: '1',
    type: 'incoming',
    contact: 'Maria Silva',
    duration: 180,
    timestamp: '2 min ago',
    quality: 95,
    status: 'completed',
    agent: 'João Santos',
    recording: true,
    transcription: 'Cliente interessado em nossos produtos premium...',
    tags: ['vendas', 'hot-lead']
  },
  {
    id: '2',
    type: 'outgoing',
    contact: 'Carlos Oliveira',
    duration: 0,
    timestamp: '5 min ago',
    quality: 0,
    status: 'missed',
    agent: 'Ana Costa',
    recording: false,
    tags: ['follow-up']
  },
  {
    id: '3',
    type: 'incoming',
    contact: 'Fernanda Lima',
    duration: 320,
    timestamp: '8 min ago',
    quality: 88,
    status: 'completed',
    agent: 'Pedro Alves',
    recording: true,
    transcription: 'Solicitação de suporte técnico - problema resolvido',
    tags: ['suporte', 'resolvido']
  },
  {
    id: '4',
    type: 'incoming',
    contact: 'Roberto Costa',
    duration: 0,
    timestamp: 'Ongoing',
    quality: 92,
    status: 'ongoing',
    agent: 'Lucia Ferreira',
    recording: true,
    tags: ['suporte']
  },
  {
    id: '5',
    type: 'incoming',
    contact: 'Número Desconhecido',
    duration: 0,
    timestamp: '15 min ago',
    quality: 0,
    status: 'voicemail',
    recording: true,
    tags: ['voicemail']
  }
]

const mockStats: PhoneStats = {
  totalCalls: 247,
  answeredCalls: 201,
  missedCalls: 46,
  avgCallDuration: 245,
  avgWaitTime: 18,
  satisfactionScore: 4.3,
  activeCalls: 3,
  availableAgents: 12
}

const getCallIcon = (type: string, status: string) => {
  if (status === 'ongoing') return PhoneCall
  if (status === 'missed') return PhoneMissed
  if (type === 'incoming') return PhoneIncoming
  if (type === 'outgoing') return PhoneOutgoing
  return Phone
}

const getCallColor = (type: string, status: string) => {
  if (status === 'ongoing') return 'text-blue-500 bg-blue-50'
  if (status === 'missed') return 'text-red-500 bg-red-50'
  if (status === 'voicemail') return 'text-orange-500 bg-orange-50'
  if (type === 'incoming') return 'text-green-500 bg-green-50'
  return 'text-purple-500 bg-purple-50'
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function TelecommunicationsWidget() {
  const [calls, setCalls] = useState<CallData[]>(mockCalls)
  const [stats, setStats] = useState<PhoneStats>(mockStats)
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [isRecording, setIsRecording] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const filteredCalls = selectedFilter === 'all' 
    ? calls 
    : calls.filter(call => call.status === selectedFilter)

  const callFilters = [
    { value: 'all', label: 'Todas', count: calls.length },
    { value: 'ongoing', label: 'Em Andamento', count: calls.filter(c => c.status === 'ongoing').length },
    { value: 'completed', label: 'Concluídas', count: calls.filter(c => c.status === 'completed').length },
    { value: 'missed', label: 'Perdidas', count: calls.filter(c => c.status === 'missed').length },
    { value: 'voicemail', label: 'Voicemail', count: calls.filter(c => c.status === 'voicemail').length },
  ]

  const answerRate = ((stats.answeredCalls / stats.totalCalls) * 100)

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-green-500" />
              Central Telefônica
            </CardTitle>
            <CardDescription>
              Monitoramento de chamadas e comunicações
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={isRecording ? "destructive" : "outline"} 
              size="sm"
              onClick={() => setIsRecording(!isRecording)}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Real-time Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-4">
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-xs text-green-600 font-medium">Chamadas Ativas</div>
            <div className="text-lg font-bold text-green-700 flex items-center gap-1">
              {stats.activeCalls}
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-xs text-blue-600 font-medium">Agentes</div>
            <div className="text-lg font-bold text-blue-700">
              {stats.availableAgents}/15
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-xs text-purple-600 font-medium">Taxa Resposta</div>
            <div className="text-lg font-bold text-purple-700">
              {answerRate.toFixed(1)}%
            </div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="text-xs text-orange-600 font-medium">Tempo Médio</div>
            <div className="text-lg font-bold text-orange-700">
              {formatDuration(stats.avgCallDuration)}
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-3 gap-2 mt-2">
          <div className="bg-gray-50 rounded p-2 text-center">
            <div className="text-xs text-gray-600">Espera Média</div>
            <div className="font-medium">{stats.avgWaitTime}s</div>
          </div>
          <div className="bg-gray-50 rounded p-2 text-center">
            <div className="text-xs text-gray-600">Satisfação</div>
            <div className="font-medium">{stats.satisfactionScore}/5</div>
          </div>
          <div className="bg-gray-50 rounded p-2 text-center">
            <div className="text-xs text-gray-600">Perdidas</div>
            <div className="font-medium text-red-600">{stats.missedCalls}</div>
          </div>
        </div>

        {/* Call Filter */}
        <div className="flex gap-1 mt-4 overflow-x-auto">
          {callFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={selectedFilter === filter.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(filter.value)}
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
        {filteredCalls.map((call) => {
          const CallIcon = getCallIcon(call.type, call.status)
          
          return (
            <div 
              key={call.id}
              className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={cn(
                    "p-2 rounded-lg",
                    getCallColor(call.type, call.status)
                  )}>
                    <CallIcon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm truncate">
                        {call.contact}
                      </h4>
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", getCallColor(call.type, call.status))}
                      >
                        {call.status}
                      </Badge>
                      {call.recording && (
                        <div className="flex items-center gap-1 text-xs text-red-500">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          REC
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
                      {call.agent && (
                        <div className="flex items-center gap-1">
                          <UserCheck className="h-3 w-3" />
                          {call.agent}
                        </div>
                      )}
                      
                      {call.duration > 0 && (
                        <div className="flex items-center gap-1">
                          <Timer className="h-3 w-3" />
                          {formatDuration(call.duration)}
                        </div>
                      )}
                      
                      {call.quality > 0 && (
                        <div className="flex items-center gap-1">
                          <Volume2 className="h-3 w-3" />
                          {call.quality}%
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {call.timestamp}
                      </div>
                    </div>

                    {/* Transcription preview */}
                    {call.transcription && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-700">
                        <div className="flex items-center gap-1 mb-1">
                          <MessageSquare className="h-3 w-3" />
                          <span className="font-medium">Transcrição:</span>
                        </div>
                        <p className="line-clamp-2">{call.transcription}</p>
                      </div>
                    )}

                    {/* Call quality bar */}
                    {call.quality > 0 && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-600">Qualidade da chamada</span>
                          <span className={cn(
                            "font-medium",
                            call.quality >= 90 ? "text-green-600" :
                            call.quality >= 70 ? "text-yellow-600" : "text-red-600"
                          )}>
                            {call.quality}%
                          </span>
                        </div>
                        <Progress 
                          value={call.quality} 
                          className="h-1"
                        />
                      </div>
                    )}

                    {/* Tags */}
                    {call.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {call.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-1 ml-2">
                  {call.status === 'ongoing' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500"
                      title="Encerrar chamada"
                    >
                      <Phone className="h-3 w-3" />
                    </Button>
                  )}
                  
                  {call.recording && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      title="Reproduzir gravação"
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    title="Baixar gravação"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          )
        })}

        {filteredCalls.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Phone className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">Nenhuma chamada encontrada</p>
            <Button variant="outline" size="sm" className="mt-2">
              <PhoneCall className="h-4 w-4 mr-1" />
              Iniciar chamada
            </Button>
          </div>
        )}

        {/* Quick Stats Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Pico do dia:</span>
              <span className="font-medium">14:30 - 15:00</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Próxima reunião:</span>
              <span className="font-medium">16:30</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
