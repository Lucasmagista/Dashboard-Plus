"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Download,
  Share2,
  RefreshCw,
  Calendar,
  Filter,
  ExternalLink,
  PieChart,
  LineChart,
  BarChart,
  Globe,
  Database,
  Zap
} from 'lucide-react'
import { cn } from "@/lib/utils"

interface BIReport {
  id: string
  name: string
  description: string
  type: 'dashboard' | 'report' | 'analysis'
  platform: 'power-bi' | 'tableau' | 'looker' | 'ga4' | 'internal'
  status: 'active' | 'processing' | 'error'
  lastUpdated: string
  views: number
  scheduleFrequency: string
  kpis: {
    name: string
    value: string
    change: number
    trend: 'up' | 'down' | 'stable'
  }[]
  chartType: 'bar' | 'line' | 'pie' | 'mixed'
}

const mockReports: BIReport[] = [
  {
    id: '1',
    name: 'Sales Performance Dashboard',
    description: 'Comprehensive sales metrics and team performance',
    type: 'dashboard',
    platform: 'power-bi',
    status: 'active',
    lastUpdated: '5 min ago',
    views: 1247,
    scheduleFrequency: 'Real-time',
    kpis: [
      { name: 'Revenue', value: 'R$ 125.3K', change: 12.5, trend: 'up' },
      { name: 'Conversion', value: '3.8%', change: -2.1, trend: 'down' },
      { name: 'Leads', value: '892', change: 8.9, trend: 'up' }
    ],
    chartType: 'mixed'
  },
  {
    id: '2',
    name: 'Marketing Attribution Report',
    description: 'ROI and attribution across marketing channels',
    type: 'report',
    platform: 'ga4',
    status: 'active',
    lastUpdated: '1 hour ago',
    views: 543,
    scheduleFrequency: 'Daily',
    kpis: [
      { name: 'ROAS', value: '4.2x', change: 15.3, trend: 'up' },
      { name: 'CPA', value: 'R$ 45', change: -8.7, trend: 'up' },
      { name: 'CTR', value: '2.1%', change: 3.2, trend: 'up' }
    ],
    chartType: 'pie'
  },
  {
    id: '3',
    name: 'Customer Journey Analysis',
    description: 'Complete customer lifecycle and touchpoint analysis',
    type: 'analysis',
    platform: 'tableau',
    status: 'processing',
    lastUpdated: '2 hours ago',
    views: 234,
    scheduleFrequency: 'Weekly',
    kpis: [
      { name: 'Avg. Journey', value: '14 days', change: -5.2, trend: 'up' },
      { name: 'Touchpoints', value: '7.3', change: 12.1, trend: 'up' },
      { name: 'Drop-off', value: '23%', change: -3.4, trend: 'up' }
    ],
    chartType: 'line'
  },
  {
    id: '4',
    name: 'Financial Overview',
    description: 'Monthly financial performance and forecasting',
    type: 'dashboard',
    platform: 'looker',
    status: 'active',
    lastUpdated: '30 min ago',
    views: 789,
    scheduleFrequency: 'Hourly',
    kpis: [
      { name: 'MRR', value: 'R$ 89.2K', change: 18.7, trend: 'up' },
      { name: 'Churn', value: '2.1%', change: -0.8, trend: 'up' },
      { name: 'LTV', value: 'R$ 2.8K', change: 22.3, trend: 'up' }
    ],
    chartType: 'bar'
  },
  {
    id: '5',
    name: 'Operational Metrics',
    description: 'Team productivity and operational efficiency',
    type: 'dashboard',
    platform: 'internal',
    status: 'error',
    lastUpdated: '3 hours ago',
    views: 156,
    scheduleFrequency: 'Real-time',
    kpis: [
      { name: 'Tickets', value: '47', change: -12.3, trend: 'down' },
      { name: 'Response Time', value: '2.4h', change: 8.9, trend: 'down' },
      { name: 'Satisfaction', value: '4.6/5', change: 3.1, trend: 'up' }
    ],
    chartType: 'mixed'
  }
]

const getPlatformInfo = (platform: string) => {
  switch (platform) {
    case 'power-bi':
      return { name: 'Power BI', color: 'bg-yellow-500', icon: BarChart3 }
    case 'tableau':
      return { name: 'Tableau', color: 'bg-blue-500', icon: LineChart }
    case 'looker':
      return { name: 'Looker', color: 'bg-green-500', icon: PieChart }
    case 'ga4':
      return { name: 'Google Analytics', color: 'bg-orange-500', icon: Globe }
    case 'internal':
      return { name: 'Sistema Interno', color: 'bg-purple-500', icon: Database }
    default:
      return { name: 'Desconhecido', color: 'bg-gray-500', icon: BarChart }
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'text-green-600 bg-green-50'
    case 'processing': return 'text-yellow-600 bg-yellow-50'
    case 'error': return 'text-red-600 bg-red-50'
    default: return 'text-gray-600 bg-gray-50'
  }
}

const getChartIcon = (chartType: string) => {
  switch (chartType) {
    case 'bar': return BarChart
    case 'line': return LineChart
    case 'pie': return PieChart
    case 'mixed': return BarChart3
    default: return BarChart3
  }
}

export default function BusinessIntelligenceWidget() {
  const [reports, setReports] = useState<BIReport[]>(mockReports)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [stats, setStats] = useState({
    totalReports: 0,
    activeReports: 0,
    totalViews: 0,
    avgUpdateFreq: 0
  })

  useEffect(() => {
    const totalReports = reports.length
    const activeReports = reports.filter(r => r.status === 'active').length
    const totalViews = reports.reduce((sum, r) => sum + r.views, 0)
    
    setStats({
      totalReports,
      activeReports,
      totalViews,
      avgUpdateFreq: 24 // hours
    })
  }, [reports])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsRefreshing(false)
  }

  const filteredReports = selectedType === 'all' 
    ? reports 
    : reports.filter(r => r.type === selectedType)

  const reportTypes = [
    { value: 'all', label: 'Todos', count: reports.length },
    { value: 'dashboard', label: 'Dashboards', count: reports.filter(r => r.type === 'dashboard').length },
    { value: 'report', label: 'Relatórios', count: reports.filter(r => r.type === 'report').length },
    { value: 'analysis', label: 'Análises', count: reports.filter(r => r.type === 'analysis').length },
  ]

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Business Intelligence
            </CardTitle>
            <CardDescription>
              Dashboards, relatórios e análises integradas
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            </Button>
            <Button size="sm">
              <ExternalLink className="h-4 w-4 mr-1" />
              Abrir BI
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-xs text-blue-600 font-medium">Total Relatórios</div>
            <div className="text-lg font-bold text-blue-700">
              {stats.totalReports}
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-xs text-green-600 font-medium">Ativos</div>
            <div className="text-lg font-bold text-green-700">
              {stats.activeReports}
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-xs text-purple-600 font-medium">Visualizações</div>
            <div className="text-lg font-bold text-purple-700">
              {stats.totalViews.toLocaleString()}
            </div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="text-xs text-orange-600 font-medium">Uptime</div>
            <div className="text-lg font-bold text-orange-700">
              99.8%
            </div>
          </div>
        </div>

        {/* Type Filter */}
        <div className="flex gap-1 mt-4 overflow-x-auto">
          {reportTypes.map((type) => (
            <Button
              key={type.value}
              variant={selectedType === type.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(type.value)}
              className="whitespace-nowrap"
            >
              {type.label}
              <Badge variant="secondary" className="ml-1 text-xs">
                {type.count}
              </Badge>
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 max-h-80 overflow-y-auto">
        {filteredReports.map((report) => {
          const platformInfo = getPlatformInfo(report.platform)
          const ChartIcon = getChartIcon(report.chartType)
          
          return (
            <div 
              key={report.id}
              className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={cn(
                    "p-2 rounded-lg text-white",
                    platformInfo.color
                  )}>
                    <platformInfo.icon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm truncate">
                        {report.name}
                      </h4>
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", getStatusColor(report.status))}
                      >
                        {report.status}
                      </Badge>
                      <ChartIcon className="h-3 w-3 text-gray-400" />
                    </div>
                    
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {report.description}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {report.views} views
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {report.scheduleFrequency}
                      </div>
                      <div className="text-xs">
                        {report.lastUpdated}
                      </div>
                    </div>

                    {/* KPIs */}
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {report.kpis.map((kpi, index) => (
                        <div key={index} className="bg-gray-50 rounded p-2">
                          <div className="text-xs text-gray-600">{kpi.name}</div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-sm">{kpi.value}</span>
                            <div className="flex items-center gap-1">
                              {kpi.trend === 'up' ? (
                                <TrendingUp className={cn(
                                  "h-3 w-3",
                                  kpi.change > 0 ? "text-green-500" : "text-red-500"
                                )} />
                              ) : kpi.trend === 'down' ? (
                                <TrendingDown className={cn(
                                  "h-3 w-3",
                                  kpi.change > 0 ? "text-red-500" : "text-green-500"
                                )} />
                              ) : null}
                              <span className={cn(
                                "text-xs",
                                kpi.change > 0 ? "text-green-600" : "text-red-600"
                              )}>
                                {kpi.change > 0 ? '+' : ''}{kpi.change}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    title="Visualizar"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    title="Baixar"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    title="Compartilhar"
                  >
                    <Share2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Platform info */}
              <div className="mt-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">
                    Plataforma: <span className="font-medium">{platformInfo.name}</span>
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {report.type}
                  </Badge>
                </div>
              </div>
            </div>
          )
        })}

        {filteredReports.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <BarChart3 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">Nenhum relatório encontrado para este tipo</p>
            <Button variant="outline" size="sm" className="mt-2">
              <ExternalLink className="h-4 w-4 mr-1" />
              Configurar BI
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
