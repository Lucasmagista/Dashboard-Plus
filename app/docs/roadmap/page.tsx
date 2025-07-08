"use client";

import React, { useState } from "react";
import { 
  Calendar,
  Clock,
  CheckCircle,
  Circle,
  Target,
  Zap,
  Users,
  TrendingUp,
  Star,
  ChevronRight,
  Filter,
  BarChart3,
  MessageSquare,
  Shield,
  Smartphone,
  Globe,
  Bot,
  Database
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Priority = "Alta" | "Média" | "Baixa";
type Status = "Concluído" | "Em Desenvolvimento" | "Planejado" | "Em Análise";
type Quarter = "Q1 2024" | "Q2 2024" | "Q3 2024" | "Q4 2024" | "Q1 2025";

interface Feature {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  quarter: Quarter;
  progress: number;
  category: string;
  icon: React.ElementType;
  votes: number;
  estimatedUsers: string;
}

const roadmapFeatures: Feature[] = [
  {
    id: "mobile-app",
    title: "Aplicativo Mobile",
    description: "App nativo para iOS e Android com funcionalidades essenciais do CRM",
    status: "Em Desenvolvimento",
    priority: "Alta",
    quarter: "Q2 2024",
    progress: 65,
    category: "Mobile",
    icon: Smartphone,
    votes: 247,
    estimatedUsers: "80% dos usuários"
  },
  {
    id: "advanced-analytics",
    title: "Analytics Avançado",
    description: "Dashboard com IA, previsões de vendas e insights automatizados",
    status: "Em Desenvolvimento",
    priority: "Alta",
    quarter: "Q2 2024",
    progress: 40,
    category: "Analytics",
    icon: BarChart3,
    votes: 189,
    estimatedUsers: "65% dos usuários"
  },
  {
    id: "whatsapp-advanced",
    title: "WhatsApp Business Avançado",
    description: "Chatbots inteligentes, templates aprovados e automação completa",
    status: "Concluído",
    priority: "Alta",
    quarter: "Q1 2024",
    progress: 100,
    category: "Comunicação",
    icon: MessageSquare,
    votes: 312,
    estimatedUsers: "90% dos usuários"
  },
  {
    id: "security-improvements",
    title: "Melhorias de Segurança",
    description: "2FA obrigatório, audit logs e compliance LGPD/GDPR",
    status: "Concluído",
    priority: "Alta",
    quarter: "Q1 2024",
    progress: 100,
    category: "Segurança",
    icon: Shield,
    votes: 156,
    estimatedUsers: "100% dos usuários"
  },
  {
    id: "api-v3",
    title: "API REST v3",
    description: "Nova versão da API com GraphQL, webhooks e rate limiting melhorado",
    status: "Planejado",
    priority: "Alta",
    quarter: "Q3 2024",
    progress: 0,
    category: "Desenvolvimento",
    icon: Database,
    votes: 89,
    estimatedUsers: "Desenvolvedores"
  },
  {
    id: "ai-assistant",
    title: "Assistente IA",
    description: "Assistente virtual para automatizar tarefas e fornecer insights",
    status: "Em Análise",
    priority: "Média",
    quarter: "Q4 2024",
    progress: 0,
    category: "IA",
    icon: Bot,
    votes: 203,
    estimatedUsers: "70% dos usuários"
  },
  {
    id: "multi-company",
    title: "Multi-empresa",
    description: "Gestão de múltiplas empresas em uma única conta",
    status: "Planejado",
    priority: "Média",
    quarter: "Q3 2024",
    progress: 0,
    category: "Gestão",
    icon: Globe,
    votes: 134,
    estimatedUsers: "Agências e consultores"
  },
  {
    id: "advanced-automation",
    title: "Automação Avançada",
    description: "Workflows complexos com condições, loops e integrações",
    status: "Planejado",
    priority: "Alta",
    quarter: "Q3 2024",
    progress: 0,
    category: "Automação",
    icon: Zap,
    votes: 198,
    estimatedUsers: "75% dos usuários"
  },
  {
    id: "team-collaboration",
    title: "Colaboração em Equipe",
    description: "Chat interno, comentários em leads e gestão de tarefas",
    status: "Em Desenvolvimento",
    priority: "Média",
    quarter: "Q2 2024",
    progress: 30,
    category: "Colaboração",
    icon: Users,
    votes: 167,
    estimatedUsers: "Equipes com 3+ usuários"
  },
  {
    id: "performance-boost",
    title: "Otimização de Performance",
    description: "Melhorias significativas na velocidade e responsividade",
    status: "Em Desenvolvimento",
    priority: "Alta",
    quarter: "Q2 2024",
    progress: 75,
    category: "Performance",
    icon: TrendingUp,
    votes: 95,
    estimatedUsers: "100% dos usuários"
  }
];

const statusConfig = {
  "Concluído": { color: "bg-green-500 text-white", icon: CheckCircle },
  "Em Desenvolvimento": { color: "bg-blue-500 text-white", icon: Clock },
  "Planejado": { color: "bg-gray-500 text-white", icon: Circle },
  "Em Análise": { color: "bg-yellow-500 text-white", icon: Target }
};

const priorityConfig = {
  "Alta": { color: "bg-red-100 text-red-800", variant: "destructive" as const },
  "Média": { color: "bg-yellow-100 text-yellow-800", variant: "secondary" as const },
  "Baixa": { color: "bg-green-100 text-green-800", variant: "outline" as const }
};

const quarters = ["Todos", "Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024", "Q1 2025"];
const categories = ["Todos", ...new Set(roadmapFeatures.map(f => f.category))];
const statuses = ["Todos", ...Object.keys(statusConfig)];

export default function RoadmapPage() {
  const [selectedQuarter, setSelectedQuarter] = useState("Todos");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedStatus, setSelectedStatus] = useState("Todos");

  const filteredFeatures = roadmapFeatures.filter(feature => {
    const quarterMatch = selectedQuarter === "Todos" || feature.quarter === selectedQuarter;
    const categoryMatch = selectedCategory === "Todos" || feature.category === selectedCategory;
    const statusMatch = selectedStatus === "Todos" || feature.status === selectedStatus;
    return quarterMatch && categoryMatch && statusMatch;
  });

  const getOverallProgress = () => {
    const total = roadmapFeatures.length;
    const completed = roadmapFeatures.filter(f => f.status === "Concluído").length;
    const inProgress = roadmapFeatures.filter(f => f.status === "Em Desenvolvimento").length;
    return {
      completed: Math.round((completed / total) * 100),
      inProgress: Math.round((inProgress / total) * 100),
      total: completed + inProgress
    };
  };

  const progress = getOverallProgress();

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Roadmap do Produto</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Acompanhe o desenvolvimento das próximas funcionalidades e melhorias do CRM Pro Dashboard.
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold">{progress.completed}%</p>
                <p className="text-sm text-muted-foreground">Concluído</p>
                <Progress value={progress.completed} className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold">{progress.inProgress}%</p>
                <p className="text-sm text-muted-foreground">Em Desenvolvimento</p>
                <Progress value={progress.inProgress} className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-500/10">
                <Star className="h-6 w-6 text-purple-500" />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold">{roadmapFeatures.length}</p>
                <p className="text-sm text-muted-foreground">Total de Features</p>
                <div className="mt-2 text-xs text-muted-foreground">
                  {progress.total} em progresso
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex gap-2 flex-wrap">
              <select
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
                aria-label="Filtrar por trimestre"
              >
                {quarters.map(quarter => (
                  <option key={quarter} value={quarter}>
                    {quarter === "Todos" ? "Todos os Trimestres" : quarter}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
                aria-label="Filtrar por categoria"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === "Todos" ? "Todas as Categorias" : category}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
                aria-label="Filtrar por status"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === "Todos" ? "Todos os Status" : status}
                  </option>
                ))}
              </select>
            </div>
            
            <Badge variant="outline" className="ml-auto self-center">
              {filteredFeatures.length} features encontradas
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Roadmap Timeline */}
      <div className="space-y-8">
        {quarters.slice(1).map(quarter => {
          const quarterFeatures = filteredFeatures.filter(f => f.quarter === quarter);
          if (quarterFeatures.length === 0) return null;
          
          return (
            <div key={quarter}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">{quarter}</h2>
                <Badge variant="secondary">
                  {quarterFeatures.length} features
                </Badge>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {quarterFeatures.map((feature) => {
                  const StatusIcon = statusConfig[feature.status].icon;
                  
                  return (
                    <Card key={feature.id} className="h-full">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <feature.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{feature.title}</CardTitle>
                              <Badge className={statusConfig[feature.status].color}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {feature.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs">
                          <Badge variant={priorityConfig[feature.priority].variant}>
                            {feature.priority} Prioridade
                          </Badge>
                          <Badge variant="outline">
                            {feature.category}
                          </Badge>
                        </div>
                        
                        {feature.status === "Em Desenvolvimento" && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progresso</span>
                              <span>{feature.progress}%</span>
                            </div>
                            <Progress value={feature.progress} />
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Star className="h-3 w-3" />
                            <span>{feature.votes} votos</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {feature.estimatedUsers}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Feedback Section */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Contribua com o Roadmap</CardTitle>
          <CardDescription>
            Sua opinião é importante! Sugira novas funcionalidades e vote nas existentes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Button variant="outline" className="h-auto p-4 justify-start" asChild>
              <a href="https://github.com/your-repo/discussions/categories/feature-requests" target="_blank" rel="noopener noreferrer">
                <Target className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Sugerir Feature</div>
                  <div className="text-xs text-muted-foreground">Compartilhe suas ideias conosco</div>
                </div>
              </a>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 justify-start" asChild>
              <a href="https://github.com/your-repo/discussions/categories/polls" target="_blank" rel="noopener noreferrer">
                <Star className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Votar em Features</div>
                  <div className="text-xs text-muted-foreground">Ajude a priorizar o desenvolvimento</div>
                </div>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer Navigation */}
      <div className="flex justify-between items-center mt-12 pt-8 border-t">
        <Button variant="outline" asChild>
          <a href="/docs/changelog">
            <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
            Changelog
          </a>
        </Button>
        <Button asChild>
          <a href="/docs">
            Voltar à Documentação
            <ChevronRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}
