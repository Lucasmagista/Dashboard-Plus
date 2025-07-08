"use client";

import React, { useState } from "react";
import { 
  CheckCircle, 
  AlertTriangle, 
  Shield, 
  Zap, 
  Users, 
  Database, 
  Globe,
  Code,
  Settings,
  TrendingUp,
  Search,
  Filter,
  BookOpen,
  ChevronRight,
  Star,
  Clock,
  Target
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

const bestPractices = [
  {
    id: "security",
    category: "Segurança",
    icon: Shield,
    color: "bg-red-500",
    practices: [
      {
        title: "Autenticação Multifator",
        description: "Implementar 2FA para todos os usuários administrativos",
        priority: "Alta",
        difficulty: "Fácil",
        steps: [
          "Configurar provedores de 2FA (Google Authenticator, SMS)",
          "Definir políticas de backup codes",
          "Treinar usuários no processo",
          "Configurar alertas de tentativas de acesso"
        ]
      },
      {
        title: "Criptografia de Dados",
        description: "Criptografar dados sensíveis em repouso e em trânsito",
        priority: "Alta",
        difficulty: "Média",
        steps: [
          "Configurar SSL/TLS para todas as comunicações",
          "Implementar criptografia AES-256 para dados sensíveis",
          "Configurar key rotation policies",
          "Auditar logs de acesso a dados"
        ]
      },
      {
        title: "Controle de Acesso",
        description: "Implementar RBAC (Role-Based Access Control)",
        priority: "Alta",
        difficulty: "Média",
        steps: [
          "Definir roles e permissões granulares",
          "Implementar princípio do menor privilégio",
          "Configurar sessões e timeouts",
          "Monitorar acessos suspeitos"
        ]
      }
    ]
  },
  {
    id: "performance",
    category: "Performance",
    icon: Zap,
    color: "bg-yellow-500",
    practices: [
      {
        title: "Otimização de Consultas",
        description: "Otimizar queries de banco de dados para melhor performance",
        priority: "Alta",
        difficulty: "Média",
        steps: [
          "Criar índices apropriados nas tabelas",
          "Usar prepared statements",
          "Implementar query caching",
          "Monitorar slow queries"
        ]
      },
      {
        title: "Cache Estratégico",
        description: "Implementar estratégias de cache em múltiplas camadas",
        priority: "Média",
        difficulty: "Média",
        steps: [
          "Configurar Redis para cache de sessão",
          "Implementar cache de resultados de API",
          "Usar CDN para assets estáticos",
          "Configurar cache headers apropriados"
        ]
      },
      {
        title: "Lazy Loading",
        description: "Carregar componentes e dados sob demanda",
        priority: "Média",
        difficulty: "Fácil",
        steps: [
          "Implementar lazy loading em rotas",
          "Usar React.lazy para componentes pesados",
          "Configurar intersection observer para imagens",
          "Implementar infinite scroll quando apropriado"
        ]
      }
    ]
  },
  {
    id: "development",
    category: "Desenvolvimento",
    icon: Code,
    color: "bg-blue-500",
    practices: [
      {
        title: "Code Review",
        description: "Processo estruturado de revisão de código",
        priority: "Alta",
        difficulty: "Fácil",
        steps: [
          "Definir checklist de code review",
          "Usar pull requests para todas as mudanças",
          "Configurar branch protection rules",
          "Documentar padrões de código"
        ]
      },
      {
        title: "Testes Automatizados",
        description: "Cobertura abrangente de testes automatizados",
        priority: "Alta",
        difficulty: "Média",
        steps: [
          "Implementar testes unitários (>80% cobertura)",
          "Criar testes de integração para APIs",
          "Configurar testes E2E críticos",
          "Automatizar execução em CI/CD"
        ]
      },
      {
        title: "Documentação Técnica",
        description: "Manter documentação atualizada e acessível",
        priority: "Média",
        difficulty: "Fácil",
        steps: [
          "Documentar APIs com OpenAPI/Swagger",
          "Manter README atualizado",
          "Criar guias de setup e deploy",
          "Documentar decisões arquiteturais"
        ]
      }
    ]
  },
  {
    id: "ux",
    category: "Experiência do Usuário",
    icon: Users,
    color: "bg-green-500",
    practices: [
      {
        title: "Design Responsivo",
        description: "Interface adaptável para todos os dispositivos",
        priority: "Alta",
        difficulty: "Média",
        steps: [
          "Implementar breakpoints consistentes",
          "Testar em dispositivos móveis",
          "Usar CSS Grid e Flexbox",
          "Otimizar touch interactions"
        ]
      },
      {
        title: "Acessibilidade",
        description: "Garantir acesso para usuários com deficiências",
        priority: "Alta",
        difficulty: "Média",
        steps: [
          "Implementar navegação por teclado",
          "Usar semantic HTML",
          "Configurar ARIA labels apropriados",
          "Testar com screen readers"
        ]
      },
      {
        title: "Feedback Visual",
        description: "Fornecer feedback claro para ações do usuário",
        priority: "Média",
        difficulty: "Fácil",
        steps: [
          "Implementar loading states",
          "Mostrar confirmações de ações",
          "Usar toast notifications",
          "Destacar elementos interativos"
        ]
      }
    ]
  },
  {
    id: "data",
    category: "Gestão de Dados",
    icon: Database,
    color: "bg-purple-500",
    practices: [
      {
        title: "Backup e Recovery",
        description: "Estratégia robusta de backup e recuperação",
        priority: "Alta",
        difficulty: "Média",
        steps: [
          "Configurar backups automáticos diários",
          "Testar procedures de recovery",
          "Manter backups em múltiplas localizações",
          "Documentar RTO e RPO"
        ]
      },
      {
        title: "Validação de Dados",
        description: "Validar dados em todas as camadas da aplicação",
        priority: "Alta",
        difficulty: "Fácil",
        steps: [
          "Implementar validação client-side",
          "Configurar validação server-side",
          "Usar schemas de validação",
          "Sanitizar inputs do usuário"
        ]
      },
      {
        title: "Auditoria de Dados",
        description: "Rastrear mudanças importantes nos dados",
        priority: "Média",
        difficulty: "Média",
        steps: [
          "Implementar audit trails",
          "Log de operações CRUD sensíveis",
          "Manter histórico de mudanças",
          "Configurar alertas para operações críticas"
        ]
      }
    ]
  }
];

const quickWins = [
  {
    title: "Configurar Monitoramento",
    description: "Implementar logs estruturados e alertas básicos",
    impact: "Alto",
    effort: "Baixo",
    icon: TrendingUp
  },
  {
    title: "Otimizar Imagens",
    description: "Comprimir e lazy load todas as imagens",
    impact: "Médio",
    effort: "Baixo",
    icon: Zap
  },
  {
    title: "Implementar Cache",
    description: "Configurar cache básico para APIs frequentes",
    impact: "Alto",
    effort: "Médio",
    icon: Database
  },
  {
    title: "Review de Segurança",
    description: "Auditoria básica de segurança e vulnerabilidades",
    impact: "Alto",
    effort: "Médio",
    icon: Shield
  }
];

export default function BestPracticesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");

  const categories = ["all", ...new Set(bestPractices.map(bp => bp.category))];
  const priorities = ["all", "Alta", "Média", "Baixa"];

  const filteredPractices = bestPractices.filter(category => {
    const categoryMatch = selectedCategory === "all" || category.category === selectedCategory;
    const searchMatch = searchTerm === "" || 
      category.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.practices.some(practice => 
        practice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        practice.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    if (selectedPriority === "all") {
      return categoryMatch && searchMatch;
    }
    
    const priorityMatch = category.practices.some(practice => practice.priority === selectedPriority);
    return categoryMatch && searchMatch && priorityMatch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta": return "bg-red-100 text-red-800";
      case "Média": return "bg-yellow-100 text-yellow-800";
      case "Baixa": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil": return "bg-green-100 text-green-800";
      case "Média": return "bg-yellow-100 text-yellow-800";
      case "Difícil": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Melhores Práticas</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Guia completo de melhores práticas para desenvolvimento, segurança, performance e experiência do usuário.
        </p>
      </div>

      {/* Quick Wins Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Quick Wins
          </CardTitle>
          <CardDescription>
            Implementações de alto impacto que podem ser feitas rapidamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickWins.map((win, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <win.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm mb-1">{win.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{win.description}</p>
                    <div className="flex gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {win.impact} Impacto
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {win.effort} Esforço
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar práticas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
                aria-label="Filtrar por categoria"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "Todas as Categorias" : category}
                  </option>
                ))}
              </select>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
                aria-label="Filtrar por prioridade"
              >
                {priorities.map(priority => (
                  <option key={priority} value={priority}>
                    {priority === "all" ? "Todas as Prioridades" : `Prioridade ${priority}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices Grid */}
      <div className="space-y-8">
        {filteredPractices.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${category.color}`}>
                  <category.icon className="h-5 w-5 text-white" />
                </div>
                {category.category}
                <Badge variant="secondary">
                  {category.practices.length} práticas
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {category.practices
                  .filter(practice => 
                    selectedPriority === "all" || practice.priority === selectedPriority
                  )
                  .map((practice, index) => (
                  <Card key={index} className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-lg font-semibold">{practice.title}</h4>
                          <div className="flex gap-2">
                            <Badge className={getPriorityColor(practice.priority)}>
                              {practice.priority}
                            </Badge>
                            <Badge className={getDifficultyColor(practice.difficulty)}>
                              {practice.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-4">{practice.description}</p>
                        
                        <div>
                          <h5 className="font-medium mb-2 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Passos para Implementação:
                          </h5>
                          <div className="space-y-2">
                            {practice.steps.map((step, stepIndex) => (
                              <div key={stepIndex} className="flex items-start gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary mt-0.5">
                                  {stepIndex + 1}
                                </div>
                                <span className="text-sm">{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Implementation Tips */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Dicas de Implementação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Priorização:</strong> Comece sempre pelas práticas de alta prioridade e baixa dificuldade. 
              Elas oferecem o melhor retorno sobre investimento.
            </AlertDescription>
          </Alert>
          
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              <strong>Implementação Gradual:</strong> Não tente implementar todas as práticas de uma vez. 
              Crie um roadmap e implemente gradualmente, medindo os resultados.
            </AlertDescription>
          </Alert>
          
          <Alert>
            <TrendingUp className="h-4 w-4" />
            <AlertDescription>
              <strong>Monitoramento:</strong> Para cada prática implementada, defina métricas de sucesso 
              e monitore regularmente para garantir que os objetivos estão sendo atingidos.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Footer Navigation */}
      <div className="flex justify-between items-center mt-12 pt-8 border-t">
        <Button variant="outline" asChild>
          <a href="/docs/troubleshooting">
            <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
            Solução de Problemas
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
