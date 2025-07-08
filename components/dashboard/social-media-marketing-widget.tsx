"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Share2,
  Calendar,
  TrendingUp,
  TrendingDown,
  Heart,
  MessageCircle,
  Repeat2,
  Eye,
  Users,
  BarChart3,
  Clock,
  Play,
  Pause,
  Edit,
  Plus,
  ExternalLink,
  Target,
  DollarSign,
  Zap,
  Image as ImageIcon,
  Video,
  FileText,
  Instagram,
  Facebook,
  Linkedin,
  Twitter
} from 'lucide-react'
import { cn } from "@/lib/utils"

interface SocialPost {
  id: string
  platform: 'facebook' | 'instagram' | 'linkedin' | 'twitter'
  content: string
  mediaType: 'text' | 'image' | 'video' | 'carousel'
  status: 'scheduled' | 'published' | 'draft' | 'failed'
  scheduledTime?: string
  publishedTime?: string
  metrics: {
    likes: number
    comments: number
    shares: number
    views: number
    reach: number
    engagement: number
  }
  campaign?: string
  hashtagCount: number
}

interface CampaignMetrics {
  totalPosts: number
  totalReach: number
  totalEngagement: number
  totalClicks: number
  avgEngagementRate: number
  topPerformingPlatform: string
  scheduledPosts: number
  activeCampaigns: number
}

const mockPosts: SocialPost[] = [
  {
    id: '1',
    platform: 'instagram',
    content: 'Conheça nossa nova linha de produtos premium! #premium #qualidade #inovacao',
    mediaType: 'carousel',
    status: 'published',
    publishedTime: '2 hours ago',
    metrics: {
      likes: 324,
      comments: 45,
      shares: 23,
      views: 1250,
      reach: 2340,
      engagement: 15.6
    },
    campaign: 'Lançamento Q4',
    hashtagCount: 3
  },
  {
    id: '2',
    platform: 'linkedin',
    content: 'Insights sobre as tendências do mercado em 2024. Confira nosso artigo completo.',
    mediaType: 'image',
    status: 'published',
    publishedTime: '4 hours ago',
    metrics: {
      likes: 156,
      comments: 28,
      shares: 67,
      views: 890,
      reach: 1560,
      engagement: 16.1
    },
    campaign: 'Thought Leadership',
    hashtagCount: 5
  },
  {
    id: '3',
    platform: 'facebook',
    content: 'Live hoje às 18h! Vamos falar sobre inovação e tecnologia.',
    mediaType: 'video',
    status: 'scheduled',
    scheduledTime: 'Today 6:00 PM',
    metrics: {
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0,
      reach: 0,
      engagement: 0
    },
    campaign: 'Webinar Series',
    hashtagCount: 4
  },
  {
    id: '4',
    platform: 'twitter',
    content: 'Thread sobre as melhores práticas de CRM para 2024 👇',
    mediaType: 'text',
    status: 'published',
    publishedTime: '1 day ago',
    metrics: {
      likes: 89,
      comments: 12,
      shares: 34,
      views: 2340,
      reach: 3450,
      engagement: 3.9
    },
    campaign: 'Educational Content',
    hashtagCount: 0
  },
  {
    id: '5',
    platform: 'instagram',
    content: 'Behind the scenes do nosso time trabalhando em novas funcionalidades.',
    mediaType: 'image',
    status: 'draft',
    metrics: {
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0,
      reach: 0,
      engagement: 0
    },
    hashtagCount: 2
  }
]

const mockMetrics: CampaignMetrics = {
  totalPosts: 127,
  totalReach: 45670,
  totalEngagement: 2890,
  totalClicks: 1245,
  avgEngagementRate: 6.3,
  topPerformingPlatform: 'Instagram',
  scheduledPosts: 15,
  activeCampaigns: 8
}

const getPlatformInfo = (platform: string) => {
  switch (platform) {
    case 'facebook':
      return { name: 'Facebook', color: 'bg-blue-600', icon: Facebook }
    case 'instagram':
      return { name: 'Instagram', color: 'bg-gradient-to-br from-purple-600 to-pink-600', icon: Instagram }
    case 'linkedin':
      return { name: 'LinkedIn', color: 'bg-blue-700', icon: Linkedin }
    case 'twitter':
      return { name: 'Twitter', color: 'bg-sky-500', icon: Twitter }
    default:
      return { name: 'Unknown', color: 'bg-gray-500', icon: Share2 }
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'published': return 'text-green-600 bg-green-50'
    case 'scheduled': return 'text-blue-600 bg-blue-50'
    case 'draft': return 'text-gray-600 bg-gray-50'
    case 'failed': return 'text-red-600 bg-red-50'
    default: return 'text-gray-600 bg-gray-50'
  }
}

const getMediaIcon = (mediaType: string) => {
  switch (mediaType) {
    case 'image': return ImageIcon
    case 'video': return Video
    case 'carousel': return BarChart3
    default: return FileText
  }
}

export default function SocialMediaMarketingWidget() {
  const [posts, setPosts] = useState<SocialPost[]>(mockPosts)
  const [metrics, setMetrics] = useState<CampaignMetrics>(mockMetrics)
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  const filteredPosts = posts.filter(post => {
    const platformMatch = selectedPlatform === 'all' || post.platform === selectedPlatform
    const statusMatch = selectedStatus === 'all' || post.status === selectedStatus
    return platformMatch && statusMatch
  })

  const platforms = [
    { value: 'all', label: 'Todas', count: posts.length },
    { value: 'instagram', label: 'Instagram', count: posts.filter(p => p.platform === 'instagram').length },
    { value: 'linkedin', label: 'LinkedIn', count: posts.filter(p => p.platform === 'linkedin').length },
    { value: 'facebook', label: 'Facebook', count: posts.filter(p => p.platform === 'facebook').length },
    { value: 'twitter', label: 'Twitter', count: posts.filter(p => p.platform === 'twitter').length },
  ]

  const statusFilters = [
    { value: 'all', label: 'Todos', count: posts.length },
    { value: 'published', label: 'Publicados', count: posts.filter(p => p.status === 'published').length },
    { value: 'scheduled', label: 'Agendados', count: posts.filter(p => p.status === 'scheduled').length },
    { value: 'draft', label: 'Rascunhos', count: posts.filter(p => p.status === 'draft').length },
  ]

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-purple-500" />
              Redes Sociais & Marketing
            </CardTitle>
            <CardDescription>
              Gestão de conteúdo e performance em redes sociais
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4" />
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Post
            </Button>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-4">
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-xs text-purple-600 font-medium">Total Alcance</div>
            <div className="text-lg font-bold text-purple-700">
              {formatNumber(metrics.totalReach)}
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-xs text-green-600 font-medium">Engajamento</div>
            <div className="text-lg font-bold text-green-700">
              {formatNumber(metrics.totalEngagement)}
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-xs text-blue-600 font-medium">Taxa Eng.</div>
            <div className="text-lg font-bold text-blue-700">
              {metrics.avgEngagementRate}%
            </div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="text-xs text-orange-600 font-medium">Agendados</div>
            <div className="text-lg font-bold text-orange-700">
              {metrics.scheduledPosts}
            </div>
          </div>
        </div>

        {/* Platform Performance */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="bg-gray-50 rounded p-2 text-center">
            <div className="text-xs text-gray-600">Top Platform</div>
            <div className="font-medium">{metrics.topPerformingPlatform}</div>
          </div>
          <div className="bg-gray-50 rounded p-2 text-center">
            <div className="text-xs text-gray-600">Campanhas Ativas</div>
            <div className="font-medium">{metrics.activeCampaigns}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-2 mt-4">
          <div className="flex gap-1 overflow-x-auto">
            {platforms.map((platform) => (
              <Button
                key={platform.value}
                variant={selectedPlatform === platform.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPlatform(platform.value)}
                className="whitespace-nowrap"
              >
                {platform.label}
                <Badge variant="secondary" className="ml-1 text-xs">
                  {platform.count}
                </Badge>
              </Button>
            ))}
          </div>
          
          <div className="flex gap-1 overflow-x-auto">
            {statusFilters.map((status) => (
              <Button
                key={status.value}
                variant={selectedStatus === status.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(status.value)}
                className="whitespace-nowrap"
              >
                {status.label}
                <Badge variant="secondary" className="ml-1 text-xs">
                  {status.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 max-h-80 overflow-y-auto">
        {filteredPosts.map((post) => {
          const platformInfo = getPlatformInfo(post.platform)
          const MediaIcon = getMediaIcon(post.mediaType)
          
          return (
            <div 
              key={post.id}
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
                      <MediaIcon className="h-3 w-3 text-gray-400" />
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", getStatusColor(post.status))}
                      >
                        {post.status}
                      </Badge>
                      {post.campaign && (
                        <Badge variant="secondary" className="text-xs">
                          {post.campaign}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm mt-1 line-clamp-2">
                      {post.content}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      {post.publishedTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.publishedTime}
                        </div>
                      )}
                      
                      {post.scheduledTime && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {post.scheduledTime}
                        </div>
                      )}
                      
                      {post.hashtagCount > 0 && (
                        <div className="text-blue-600">
                          #{post.hashtagCount}
                        </div>
                      )}
                    </div>

                    {/* Metrics for published posts */}
                    {post.status === 'published' && (
                      <div className="grid grid-cols-4 gap-2 mt-3">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Heart className="h-3 w-3 text-red-500" />
                            <span className="text-xs font-medium">
                              {formatNumber(post.metrics.likes)}
                            </span>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <MessageCircle className="h-3 w-3 text-blue-500" />
                            <span className="text-xs font-medium">
                              {formatNumber(post.metrics.comments)}
                            </span>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Repeat2 className="h-3 w-3 text-green-500" />
                            <span className="text-xs font-medium">
                              {formatNumber(post.metrics.shares)}
                            </span>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Eye className="h-3 w-3 text-purple-500" />
                            <span className="text-xs font-medium">
                              {formatNumber(post.metrics.views)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Engagement rate */}
                    {post.status === 'published' && post.metrics.engagement > 0 && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-600">Taxa de Engajamento</span>
                          <span className={cn(
                            "font-medium",
                            post.metrics.engagement >= 10 ? "text-green-600" :
                            post.metrics.engagement >= 5 ? "text-yellow-600" : "text-red-600"
                          )}>
                            {post.metrics.engagement}%
                          </span>
                        </div>
                        <Progress 
                          value={Math.min(post.metrics.engagement, 20)} 
                          className="h-1"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-1 ml-2">
                  {post.status === 'draft' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      title="Editar"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  )}
                  
                  {post.status === 'scheduled' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      title="Pausar agendamento"
                    >
                      <Pause className="h-3 w-3" />
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    title="Ver na plataforma"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          )
        })}

        {filteredPosts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Share2 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">Nenhum post encontrado para os filtros selecionados</p>
            <Button variant="outline" size="sm" className="mt-2">
              <Plus className="h-4 w-4 mr-1" />
              Criar primeiro post
            </Button>
          </div>
        )}

        {/* Quick Actions Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="w-full">
              <BarChart3 className="h-4 w-4 mr-1" />
              Analytics
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              <Calendar className="h-4 w-4 mr-1" />
              Calendário
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
