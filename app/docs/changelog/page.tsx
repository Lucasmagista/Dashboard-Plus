"use client";

import React, { useState } from "react";
import { 
  Calendar,
  GitCommit,
  Plus,
  Bug,
  Zap,
  Shield,
  ChevronRight,
  Filter,
  Download,
  Tag,
  ExternalLink,
  Star,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

type ChangeType = "feature" | "improvement" | "bugfix" | "security" | "breaking";

interface Change {
  type: ChangeType;
  description: string;
  issueNumber?: string;
  breaking?: boolean;
}

interface Release {
  version: string;
  date: string;
  title: string;
  description: string;
  changes: Change[];
  downloadUrl?: string;
  migrationGuide?: string;
  featured?: boolean;
}

const releases: Release[] = [
  {
    version: "2.1.0",
    date: "2024-01-15",
    title: "Automação Avançada e Performance",
    description: "Nova engine de automação com workflows visuais, melhorias significativas de performance e novas integrações.",
    featured: true,
    changes: [
      {
        type: "feature",
        description: "Nova interface visual para criação de workflows de automação",
        issueNumber: "#234"
      },
      {
        type: "feature", 
        description: "Integração nativa com WhatsApp Business API",
        issueNumber: "#189"
      },
      {
        type: "feature",
        description: "Dashboard de analytics em tempo real com métricas avançadas",
        issueNumber: "#201"
      },
      {
        type: "improvement",
        description: "Performance 40% mais rápida no carregamento de listas grandes",
        issueNumber: "#156"
      },
      {
        type: "improvement",
        description: "Interface renovada para o módulo de CRM com melhor UX",
        issueNumber: "#178"
      },
      {
        type: "bugfix",
        description: "Corrigido problema de sincronização com Gmail",
        issueNumber: "#167"
      },
      {
        type: "security",
        description: "Implementada autenticação multifator (2FA)",
        issueNumber: "#145"
      }
    ],
    downloadUrl: "/downloads/crm-pro-2.1.0.zip",
    migrationGuide: "/docs/migration/v2.1.0"
  },
  {
    version: "2.0.0",
    date: "2023-12-01",
    title: "Nova Arquitetura e Design System",
    description: "Refatoração completa da arquitetura, novo design system e quebras de compatibilidade.",
    changes: [
      {
        type: "breaking",
        description: "Nova API REST v2 com mudanças nos endpoints",
        issueNumber: "#123",
        breaking: true
      },
      {
        type: "feature",
        description: "Novo design system com componentes modernos",
        issueNumber: "#134"
      },
      {
        type: "feature",
        description: "Suporte a temas escuro/claro personalizáveis",
        issueNumber: "#112"
      },
      {
        type: "feature",
        description: "PWA (Progressive Web App) para uso offline",
        issueNumber: "#98"
      },
      {
        type: "improvement",
        description: "Migração completa para TypeScript",
        issueNumber: "#87"
      },
      {
        type: "improvement",
        description: "Nova arquitetura de componentes com React 18",
        issueNumber: "#76"
      },
      {
        type: "security",
        description: "Implementação de CSP (Content Security Policy)",
        issueNumber: "#65"
      }
    ],
    downloadUrl: "/downloads/crm-pro-2.0.0.zip",
    migrationGuide: "/docs/migration/v2.0.0"
  },
  {
    version: "1.8.2",
    date: "2023-11-15",
    title: "Correções e Melhorias",
    description: "Versão focada em correção de bugs e pequenas melhorias de usabilidade.",
    changes: [
      {
        type: "bugfix",
        description: "Corrigido erro na exportação de relatórios em PDF",
        issueNumber: "#198"
      },
      {
        type: "bugfix",
        description: "Resolvido problema de timezone em eventos da agenda",
        issueNumber: "#195"
      },
      {
        type: "improvement",
        description: "Melhorada validação de formulários de contato",
        issueNumber: "#187"
      },
      {
        type: "improvement",
        description: "Otimização de queries para listagem de leads",
        issueNumber: "#183"
      }
    ]
  },
  {
    version: "1.8.1",
    date: "2023-10-28",
    title: "Hotfix - Segurança",
    description: "Correção urgente de vulnerabilidade de segurança.",
    changes: [
      {
        type: "security",
        description: "Corrigida vulnerabilidade XSS em comentários",
        issueNumber: "#176"
      },
      {
        type: "security",
        description: "Atualizada sanitização de inputs de usuário",
        issueNumber: "#177"
      },
      {
        type: "bugfix",
        description: "Corrigido problema de logout automático",
        issueNumber: "#174"
      }
    ]
  },
  {
    version: "1.8.0",
    date: "2023-10-15",
    title: "Integrações e Analytics",
    description: "Novas integrações com plataformas populares e dashboard de analytics aprimorado.",
    changes: [
      {
        type: "feature",
        description: "Integração com Slack para notificações em tempo real",
        issueNumber: "#159"
      },
      {
        type: "feature",
        description: "Conectores para Zapier e Make (Integromat)",
        issueNumber: "#152"
      },
      {
        type: "feature",
        description: "Relatórios personalizáveis com filtros avançados",
        issueNumber: "#148"
      },
      {
        type: "improvement",
        description: "Interface melhorada para gestão de pipelines",
        issueNumber: "#143"
      },
      {
        type: "improvement",
        description: "Performance otimizada para grandes volumes de dados",
        issueNumber: "#141"
      }
    ]
  }
];

const changeTypeConfig = {
  feature: {
    label: "Nova Funcionalidade",
    icon: Plus,
    color: "bg-green-500 text-white",
    variant: "default" as const
  },
  improvement: {
    label: "Melhoria",
    icon: Zap,
    color: "bg-blue-500 text-white", 
    variant: "secondary" as const
  },
  bugfix: {
    label: "Correção",
    icon: Bug,
    color: "bg-yellow-500 text-white",
    variant: "outline" as const
  },
  security: {
    label: "Segurança",
    icon: Shield,
    color: "bg-red-500 text-white",
    variant: "destructive" as const
  },
  breaking: {
    label: "Breaking Change",
    icon: AlertCircle,
    color: "bg-orange-500 text-white",
    variant: "destructive" as const
  }
};

export default function ChangelogPage() {
  const [selectedType, setSelectedType] = useState<ChangeType | "all">("all");
  const [showOnlyBreaking, setShowOnlyBreaking] = useState(false);

  const filteredReleases = releases.map(release => ({
    ...release,
    changes: release.changes.filter(change => {
      if (showOnlyBreaking && !change.breaking) return false;
      if (selectedType === "all") return true;
      return change.type === selectedType;
    })
  })).filter(release => release.changes.length > 0);

  const getLatestVersion = () => releases[0];
  const getTotalChanges = () => releases.reduce((total, release) => total + release.changes.length, 0);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <GitCommit className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Changelog</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Histórico completo de mudanças, melhorias e correções do CRM Pro Dashboard.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <Tag className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{getLatestVersion().version}</p>
                <p className="text-sm text-muted-foreground">Versão Atual</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{releases.length}</p>
                <p className="text-sm text-muted-foreground">Releases</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-500/10">
                <CheckCircle className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{getTotalChanges()}</p>
                <p className="text-sm text-muted-foreground">Total de Mudanças</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Latest Release Highlight */}
      {getLatestVersion().featured && (
        <Alert className="mb-8 border-green-200 bg-green-50">
          <Star className="h-4 w-4" />
          <AlertDescription>
            <strong>Nova versão disponível!</strong> A versão {getLatestVersion().version} "{getLatestVersion().title}" foi lançada em{" "}
            {new Date(getLatestVersion().date).toLocaleDateString('pt-BR')}. 
            <Button variant="link" className="p-0 h-auto ml-2" asChild>
              <a href={getLatestVersion().downloadUrl}>
                Download
                <Download className="ml-1 h-3 w-3" />
              </a>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <Tabs value={selectedType} onValueChange={(value) => setSelectedType(value as ChangeType | "all")}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="feature">Recursos</TabsTrigger>
              <TabsTrigger value="improvement">Melhorias</TabsTrigger>
              <TabsTrigger value="bugfix">Correções</TabsTrigger>
              <TabsTrigger value="security">Segurança</TabsTrigger>
              <TabsTrigger value="breaking">Breaking</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="mt-4 flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showOnlyBreaking}
                onChange={(e) => setShowOnlyBreaking(e.target.checked)}
                className="rounded"
              />
              Mostrar apenas Breaking Changes
            </label>
            <Badge variant="outline" className="ml-auto">
              {filteredReleases.reduce((total, release) => total + release.changes.length, 0)} mudanças encontradas
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Releases Timeline */}
      <div className="space-y-8">
        {filteredReleases.map((release, index) => (
          <Card key={release.version} className={release.featured ? "border-primary shadow-lg" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3">
                    <Badge variant={release.featured ? "default" : "secondary"} className="font-mono">
                      v{release.version}
                    </Badge>
                    {release.title}
                    {release.featured && <Star className="h-4 w-4 text-yellow-500" />}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {release.description}
                  </CardDescription>
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(release.date).toLocaleDateString('pt-BR')}
                    </div>
                    <Badge variant="outline">
                      {release.changes.length} mudanças
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  {release.downloadUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={release.downloadUrl}>
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </a>
                    </Button>
                  )}
                  {release.migrationGuide && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={release.migrationGuide}>
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Guia de Migração
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {release.changes.map((change, changeIndex) => {
                  const config = changeTypeConfig[change.type];
                  return (
                    <div key={changeIndex} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      <div className={`p-1 rounded ${config.color}`}>
                        <config.icon className="h-3 w-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-sm">{change.description}</p>
                            {change.breaking && (
                              <Badge variant="destructive" className="mt-1 text-xs">
                                Breaking Change
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge variant={config.variant} className="text-xs">
                              {config.label}
                            </Badge>
                            {change.issueNumber && (
                              <Badge variant="outline" className="text-xs font-mono">
                                {change.issueNumber}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Migration Notice */}
      <Alert className="mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Nota sobre Breaking Changes:</strong> Sempre consulte os guias de migração antes de atualizar 
          para versões que contenham breaking changes. Recomendamos fazer backup completo antes de qualquer atualização.
        </AlertDescription>
      </Alert>

      {/* Footer Navigation */}
      <div className="flex justify-between items-center mt-12 pt-8 border-t">
        <Button variant="outline" asChild>
          <a href="/docs/installation">
            <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
            Guia de Instalação
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
