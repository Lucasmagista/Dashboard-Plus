"use client"

import { useState, useEffect } from "react"
import { 
  FileText, 
  ArrowLeft, 
  Search, 
  Clock, 
  User, 
  Star,
  BookOpen,
  Code,
  Zap,
  Shield,
  Database,
  Globe,
  Settings,
  Users,
  MessageSquare,
  TrendingUp,
  Filter,
  Heart,
  Share2,
  ExternalLink,
  Copy,
  CheckCircle
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

const guides = [
  {
    id: "getting-started",
    title: "Primeiros Passos",
    description: "Guia completo para configurar e usar o CRM Pro Dashboard pela primeira vez",
    category: "Básico",
    difficulty: "Iniciante",
    readTime: "10 min",
    author: "Equipe CRM Pro",
    rating: 4.9,
    tags: ["setup", "tutorial", "básico"],
    icon: Zap,
    featured: true,
    sections: [
      "Criando sua conta",
      "Configuração inicial",
      "Importando contatos",
      "Primeira campanha"
    ]
  },
  {
    id: "contact-management",
    title: "Gestão de Contatos",
    description: "Como organizar, segmentar e gerenciar sua base de contatos de forma eficiente",
    category: "CRM",
    difficulty: "Iniciante",
    readTime: "15 min",
    author: "Maria Santos",
    rating: 4.8,
    tags: ["contatos", "crm", "organização"],
    icon: Users,
    sections: [
      "Importação em massa",
      "Segmentação avançada",
      "Tags e categorias",
      "Limpeza de dados"
    ]
  },
  {
    id: "automation-workflows",
    title: "Criando Workflows de Automação",
    description: "Aprenda a criar fluxos automatizados para nurturing e conversão de leads",
    category: "Automação",
    difficulty: "Intermediário",
    readTime: "25 min",
    author: "João Silva",
    rating: 4.7,
    tags: ["automação", "workflows", "conversão"],
    icon: Settings,
    featured: true,
    sections: [
      "Triggers e condições",
      "Ações automatizadas",
      "Testes A/B",
      "Métricas de performance"
    ]
  },
  {
    id: "whatsapp-integration",
    title: "Integração com WhatsApp Business",
    description: "Configuração completa da integração com WhatsApp Business API",
    category: "Integrações",
    difficulty: "Intermediário",
    readTime: "30 min",
    author: "Tech Team",
    rating: 4.6,
    tags: ["whatsapp", "integração", "api"],
    icon: MessageSquare,
    sections: [
      "Configuração da API",
      "Webhooks e callbacks",
      "Templates de mensagem",
      "Gestão de conversas"
    ]
  },
  {
    id: "analytics-reporting",
    title: "Analytics e Relatórios",
    description: "Como interpretar métricas e criar relatórios personalizados",
    category: "Analytics",
    difficulty: "Intermediário",
    readTime: "20 min",
    author: "Ana Costa",
    rating: 4.8,
    tags: ["analytics", "relatórios", "métricas"],
    icon: TrendingUp,
    sections: [
      "Métricas principais",
      "Dashboards customizados",
      "Exportação de dados",
      "ROI e conversões"
    ]
  },
  {
    id: "api-development",
    title: "Desenvolvendo com a API",
    description: "Guia para desenvolvedores integrarem sistemas externos via API REST",
    category: "Desenvolvimento",
    difficulty: "Avançado",
    readTime: "45 min",
    author: "Dev Team",
    rating: 4.5,
    tags: ["api", "desenvolvimento", "integração"],
    icon: Code,
    featured: true,
    sections: [
      "Autenticação",
      "Endpoints principais",
      "Webhooks",
      "SDKs e libraries"
    ]
  },
  {
    id: "security-best-practices",
    title: "Melhores Práticas de Segurança",
    description: "Como manter seus dados seguros e em conformidade com LGPD",
    category: "Segurança",
    difficulty: "Intermediário",
    readTime: "20 min",
    author: "Security Team",
    rating: 4.9,
    tags: ["segurança", "lgpd", "privacidade"],
    icon: Shield,
    sections: [
      "Configurações de segurança",
      "Gestão de permissões",
      "Backup e recuperação",
      "Conformidade LGPD"
    ]
  },
  {
    id: "database-optimization",
    title: "Otimização de Performance",
    description: "Técnicas para otimizar a performance do sistema com grandes volumes de dados",
    category: "Técnico",
    difficulty: "Avançado",
    readTime: "35 min",
    author: "System Admin",
    rating: 4.4,
    tags: ["performance", "otimização", "database"],
    icon: Database,
    sections: [
      "Indexação de dados",
      "Cache strategies",
      "Query optimization",
      "Monitoring"
    ]
  },
  {
    id: "multi-channel",
    title: "Comunicação Multicanal",
    description: "Estratégias para orquestrar comunicação em múltiplos canais",
    category: "Comunicação",
    difficulty: "Intermediário",
    readTime: "25 min",
    author: "Marketing Team",
    rating: 4.7,
    tags: ["multicanal", "comunicação", "estratégia"],
    icon: Globe,
    sections: [
      "Estratégia omnichannel",
      "Sincronização de canais",
      "Experiência do cliente",
      "Métricas unificadas"
    ]
  },
  {
    id: "custom-fields",
    title: "Campos Personalizados",
    description: "Como criar e gerenciar campos personalizados para suas necessidades específicas",
    category: "Customização",
    difficulty: "Iniciante",
    readTime: "15 min",
    author: "Support Team",
    rating: 4.6,
    tags: ["customização", "campos", "personalização"],
    icon: Settings,
    sections: [
      "Tipos de campos",
      "Validações",
      "Importação de dados",
      "Relatórios customizados"
    ]
  }
]

const categories = ["Todos", "Básico", "CRM", "Automação", "Integrações", "Analytics", "Desenvolvimento", "Segurança", "Técnico", "Comunicação", "Customização"]
const difficulties = ["Todos", "Iniciante", "Intermediário", "Avançado"]

export default function GuidesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [selectedDifficulty, setSelectedDifficulty] = useState("Todos")
  const [favorites, setFavorites] = useState<string[]>([])
  const [copiedLink, setCopiedLink] = useState("")
  const { toast } = useToast()

  // Carregar favoritos do localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFavorites = localStorage.getItem('guide-favorites')
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites))
      }
    }
  }, [])

  // Salvar favoritos no localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('guide-favorites', JSON.stringify(favorites))
    }
  }, [favorites])

  const toggleFavorite = (guideId: string) => {
    const guide = guides.find(g => g.id === guideId)
    const isFavorite = favorites.includes(guideId)
    
    setFavorites(prev => 
      isFavorite 
        ? prev.filter(id => id !== guideId)
        : [...prev, guideId]
    )

    toast({
      title: isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
      description: isFavorite 
        ? `${guide?.title} foi removido dos seus favoritos`
        : `${guide?.title} foi adicionado aos seus favoritos`,
      duration: 3000,
    })
  }

  const copyGuideLink = (guideId: string) => {
    const guide = guides.find(g => g.id === guideId)
    const link = `${window.location.origin}/docs/guides/${guideId}`
    navigator.clipboard.writeText(link)
    setCopiedLink(guideId)
    setTimeout(() => setCopiedLink(""), 2000)

    toast({
      title: "Link copiado!",
      description: `Link do guia "${guide?.title}" foi copiado para a área de transferência`,
      duration: 3000,
    })
  }

  const shareGuide = (guide: typeof guides[0]) => {
    if (navigator.share) {
      navigator.share({
        title: guide.title,
        text: guide.description,
        url: `/docs/guides/${guide.id}`
      })
    } else {
      copyGuideLink(guide.id)
    }
  }

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "Todos" || guide.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "Todos" || guide.difficulty === selectedDifficulty
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const featuredGuides = guides.filter(guide => guide.featured)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Iniciante": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      case "Intermediário": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
      case "Avançado": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  const GuideCard = ({ guide, featured = false }: { guide: typeof guides[0], featured?: boolean }) => {
    const IconComponent = guide.icon
    const isFavorite = favorites.includes(guide.id)
    const isLinkCopied = copiedLink === guide.id
    
    return (
      <Card className={`hover:shadow-md transition-shadow ${featured ? 'border-blue-200 dark:border-blue-800' : ''}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <IconComponent className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-lg leading-tight">{guide.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{guide.category}</Badge>
                  <Badge className={getDifficultyColor(guide.difficulty)} variant="secondary">
                    {guide.difficulty}
                  </Badge>
                  {featured && <Badge variant="secondary">Featured</Badge>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                onClick={() => toggleFavorite(guide.id)}
                title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              >
                <Heart className={`h-4 w-4 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-red-500'}`} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors"
                onClick={() => shareGuide(guide)}
                title="Compartilhar guia"
              >
                <Share2 className="h-4 w-4 text-muted-foreground hover:text-blue-500 transition-colors" />
              </Button>
            </div>
          </div>
          <CardDescription className="text-sm leading-relaxed">
            {guide.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {guide.readTime}
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {guide.author}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {guide.rating}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Seções do Guia:</h4>
              <div className="grid grid-cols-1 gap-1">
                {guide.sections.slice(0, 3).map((section, index) => (
                  <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                    {section}
                  </div>
                ))}
                {guide.sections.length > 3 && (
                  <div className="text-sm text-muted-foreground">
                    +{guide.sections.length - 3} mais seções
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {guide.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <Link href={`/docs/guides/${guide.id}`} className="flex-1">
                <Button size="sm" className="w-full hover:bg-primary/90 transition-colors">
                  <BookOpen className="h-4 w-4 mr-1" />
                  Ler Guia
                </Button>
              </Link>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => copyGuideLink(guide.id)}
                className="min-w-[40px] hover:bg-muted/50 transition-colors"
                title={isLinkCopied ? "Link copiado!" : "Copiar link do guia"}
              >
                {isLinkCopied ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Link href={`/docs/guides/${guide.id}`}>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="min-w-[40px] hover:bg-muted/50 transition-colors"
                  title="Abrir guia em nova aba"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/docs">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Documentação
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">Guias e Tutoriais</h1>
            <p className="text-muted-foreground">
              Aprenda a usar todas as funcionalidades do CRM Pro Dashboard
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <Badge variant="secondary">{guides.length} guias</Badge>
          <Badge variant="outline">Tutoriais</Badge>
          <Badge variant="outline">Exemplos práticos</Badge>
          {favorites.length > 0 && (
            <Badge variant="outline" className="text-red-500 border-red-200">
              <Heart className="h-3 w-3 mr-1 fill-red-500" />
              {favorites.length} favoritos
            </Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="browse">Explorar</TabsTrigger>
          <TabsTrigger value="featured">Em Destaque</TabsTrigger>
          <TabsTrigger value="favorites">Favoritos ({favorites.length})</TabsTrigger>
          <TabsTrigger value="categories">Por Categoria</TabsTrigger>
        </TabsList>

        {/* Browse Tab */}
        <TabsContent value="browse" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar guias..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2">
                  {difficulties.map((difficulty) => (
                    <Button
                      key={difficulty}
                      variant={selectedDifficulty === difficulty ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDifficulty(difficulty)}
                    >
                      {difficulty}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guides Grid */}
          <div className="space-y-4">
            {filteredGuides.length > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Mostrando {filteredGuides.length} de {guides.length} guias
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const unfavorited = filteredGuides.filter(guide => !favorites.includes(guide.id))
                      if (unfavorited.length > 0) {
                        setFavorites(prev => [...prev, ...unfavorited.map(g => g.id)])
                        toast({
                          title: "Todos adicionados aos favoritos",
                          description: `${unfavorited.length} guias foram adicionados aos favoritos`,
                          duration: 3000,
                        })
                      }
                    }}
                    disabled={filteredGuides.every(guide => favorites.includes(guide.id))}
                  >
                    <Heart className="h-3 w-3 mr-1" />
                    Favoritar Todos
                  </Button>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGuides.map((guide) => (
                <GuideCard key={guide.id} guide={guide} />
              ))}
            </div>
          </div>

          {filteredGuides.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Nenhum guia encontrado com os filtros aplicados.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("Todos")
                    setSelectedDifficulty("Todos")
                  }}
                >
                  Limpar Filtros
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Featured Tab */}
        <TabsContent value="featured" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Guias em Destaque</h2>
            <p className="text-muted-foreground mb-6">
              Os guias mais populares e essenciais para começar com o CRM Pro
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredGuides.map((guide) => (
                <GuideCard key={guide.id} guide={guide} featured />
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Favorites Tab */}
        <TabsContent value="favorites" className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">Seus Guias Favoritos</h2>
                <p className="text-muted-foreground">
                  Guias que você marcou como favoritos para acesso rápido
                </p>
              </div>
              {favorites.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFavorites([])
                    toast({
                      title: "Favoritos limpos",
                      description: "Todos os guias foram removidos dos favoritos",
                      duration: 3000,
                    })
                  }}
                >
                  Limpar Favoritos
                </Button>
              )}
            </div>
            {favorites.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">
                    Você ainda não tem guias favoritos
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Clique no ícone de coração em qualquer guia para adicioná-lo aos favoritos
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guides.filter(guide => favorites.includes(guide.id)).map((guide) => (
                  <GuideCard key={guide.id} guide={guide} />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <div className="space-y-8">
            {categories.slice(1).map((category) => {
              const categoryGuides = guides.filter(guide => guide.category === category)
              if (categoryGuides.length === 0) return null
              
              return (
                <div key={category}>
                  <h2 className="text-xl font-semibold mb-4">{category}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryGuides.map((guide) => (
                      <GuideCard key={guide.id} guide={guide} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Estatísticas dos Guias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{guides.length}</div>
              <div className="text-sm text-muted-foreground">Total de Guias</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{featuredGuides.length}</div>
              <div className="text-sm text-muted-foreground">Em Destaque</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{categories.length - 1}</div>
              <div className="text-sm text-muted-foreground">Categorias</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(guides.reduce((acc, guide) => acc + guide.rating, 0) / guides.length * 10) / 10}
              </div>
              <div className="text-sm text-muted-foreground">Avaliação Média</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Links Úteis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/docs/api">
              <Button variant="outline" className="w-full justify-start">
                <Code className="h-4 w-4 mr-2" />
                API Reference
              </Button>
            </Link>
            <Link href="/docs/quick-start">
              <Button variant="outline" className="w-full justify-start">
                <Zap className="h-4 w-4 mr-2" />
                Início Rápido
              </Button>
            </Link>
            <Link href="/docs/integrations">
              <Button variant="outline" className="w-full justify-start">
                <Globe className="h-4 w-4 mr-2" />
                Integrações
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
