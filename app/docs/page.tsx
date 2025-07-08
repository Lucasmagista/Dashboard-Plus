"use client"

import { useState } from "react"
import { BookOpen, Search, ExternalLink, Download, Star, Clock, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type Difficulty = "Fácil" | "Médio" | "Avançado";

type DocumentationItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  difficulty: Difficulty;
  url: string;
  featured: boolean;
  tags: string[];
};

const documentation: DocumentationItem[] = [
  {
    id: "quick-start",
    title: "Início Rápido",
    description: "Configure e execute o CRM Pro Dashboard em menos de 5 minutos",
    category: "Começando",
    readTime: "5 min",
    difficulty: "Fácil",
    url: "/docs/quick-start",
    featured: true,
    tags: ["instalação", "setup", "docker"],
  },
  {
    id: "installation",
    title: "Guia de Instalação",
    description: "Configuração completa do ambiente de desenvolvimento e produção",
    category: "Começando",
    readTime: "15 min",
    difficulty: "Médio",
    url: "/docs/installation",
    featured: true,
    tags: ["instalação", "ambiente", "desenvolvimento"],
  },
  {
    id: "api",
    title: "API Reference",
    description: "Documentação completa da API REST e GraphQL",
    category: "Desenvolvimento",
    readTime: "30 min",
    difficulty: "Avançado",
    url: "/docs/api",
    featured: true,
    tags: ["api", "rest", "graphql", "endpoints"],
  },
  {
    id: "integrations",
    title: "Integrações",
    description: "Guia completo de integrações com serviços externos",
    category: "Integrações",
    readTime: "20 min",
    difficulty: "Médio",
    url: "/docs/integrations",
    featured: false,
    tags: ["integrações", "api", "webhooks"],
  },
  {
    id: "design-system",
    title: "Design System",
    description: "Padrões visuais, componentes e diretrizes de UX/UI",
    category: "Design",
    readTime: "25 min",
    difficulty: "Médio",
    url: "/docs/design-system",
    featured: false,
    tags: ["design", "ui", "componentes"],
  },
  {
    id: "deployment",
    title: "Deploy em Produção",
    description: "Guia completo para deploy em diferentes ambientes",
    category: "DevOps",
    readTime: "35 min",
    difficulty: "Avançado",
    url: "/docs/deployment",
    featured: false,
    tags: ["deploy", "produção", "docker", "vercel"],
  },
  {
    id: "security",
    title: "Segurança",
    description: "Melhores práticas de segurança e compliance LGPD/GDPR",
    category: "Segurança",
    readTime: "40 min",
    difficulty: "Avançado",
    url: "/docs/security",
    featured: false,
    tags: ["segurança", "lgpd", "gdpr", "auth"],
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "Dashboards, métricas e relatórios avançados",
    category: "Analytics",
    readTime: "20 min",
    difficulty: "Médio",
    url: "/docs/analytics",
    featured: false,
    tags: ["analytics", "métricas", "dashboards"],
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    description: "Guia de resolução de problemas comuns",
    category: "Suporte",
    readTime: "15 min",
    difficulty: "Fácil",
    url: "/docs/troubleshooting",
    featured: false,
    tags: ["troubleshooting", "debug", "problemas"],
  },
  {
    id: "best-practices",
    title: "Melhores Práticas",
    description: "Padrões de desenvolvimento e arquitetura recomendados",
    category: "Desenvolvimento",
    readTime: "45 min",
    difficulty: "Avançado",
    url: "/docs/best-practices",
    featured: false,
    tags: ["best-practices", "código", "arquitetura"],
  },
  {
    id: "faq",
    title: "FAQ",
    description: "Perguntas frequentes e respostas sobre o CRM Pro",
    category: "Suporte",
    readTime: "10 min",
    difficulty: "Fácil",
    url: "/docs/faq",
    featured: false,
    tags: ["faq", "ajuda", "perguntas"],
  },
  {
    id: "changelog",
    title: "Changelog",
    description: "Histórico de mudanças, correções e novas funcionalidades",
    category: "Suporte",
    readTime: "5 min",
    difficulty: "Fácil",
    url: "/docs/changelog",
    featured: false,
    tags: ["changelog", "versões", "atualizações"],
  },
  {
    id: "contributing",
    title: "Guia de Contribuição",
    description: "Como contribuir para o desenvolvimento do projeto",
    category: "Desenvolvimento",
    readTime: "20 min",
    difficulty: "Médio",
    url: "/docs/contributing",
    featured: false,
    tags: ["contribuição", "open-source", "desenvolvimento"],
  },
  {
    id: "roadmap",
    title: "Roadmap do Produto",
    description: "Próximas funcionalidades e melhorias planejadas",
    category: "Suporte",
    readTime: "10 min",
    difficulty: "Fácil",
    url: "/docs/roadmap",
    featured: true,
    tags: ["roadmap", "futuro", "features"],
  },
]

const categories = [
  "Todos",
  "Começando",
  "Desenvolvimento", 
  "Integrações",
  "Design",
  "DevOps",
  "Segurança",
  "Analytics",
  "Suporte",
]

const difficultyColors = {
  "Fácil": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "Médio": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  "Avançado": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

export default function DocsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")

  const filteredDocs = documentation.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === "Todos" || doc.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const featuredDocs = documentation.filter(doc => doc.featured)

  return (
    <div className="flex-1 space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            Documentação
          </h1>
          <p className="text-muted-foreground mt-2">
            Guias completos, referências de API e tutoriais para o CRM Pro Dashboard
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <a 
              href="https://github.com/projeto/crm-dashboard" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              GitHub
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a 
              href="/docs/download" 
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </a>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar na documentação..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "secondary"}
              className="cursor-pointer transition-colors hover:bg-primary/80"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Featured Documentation */}
      {selectedCategory === "Todos" && !searchTerm && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Documentação em Destaque
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredDocs.map((doc) => (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <Link href={doc.url}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="group-hover:text-primary transition-colors">
                          {doc.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {doc.readTime}
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${difficultyColors[doc.difficulty]}`}
                          >
                            {doc.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {doc.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {doc.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {doc.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{doc.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Documentation */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            {selectedCategory === "Todos" ? "Toda a Documentação" : selectedCategory}
          </h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {filteredDocs.length} documento{filteredDocs.length !== 1 ? "s" : ""}
          </div>
        </div>

        {filteredDocs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum documento encontrado</h3>
              <p className="text-muted-foreground text-center">
                Tente ajustar seus filtros ou termo de busca
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredDocs.map((doc) => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                <Link href={doc.url}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {doc.title}
                        </CardTitle>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {doc.readTime}
                          </span>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${difficultyColors[doc.difficulty]}`}
                          >
                            {doc.difficulty}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {doc.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2 mt-2">
                      {doc.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1">
                      {doc.tags.slice(0, 4).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {doc.tags.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{doc.tags.length - 4}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Links Úteis</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Repositório GitHub
              </CardTitle>
              <CardDescription>
                Código fonte e issues do projeto
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Comunidade
              </CardTitle>
              <CardDescription>
                Discord e fóruns de discussão
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Download className="h-4 w-4" />
                Downloads
              </CardTitle>
              <CardDescription>
                SDKs, templates e recursos
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}
