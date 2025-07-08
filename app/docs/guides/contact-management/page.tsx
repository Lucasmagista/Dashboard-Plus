"use client";

import React, { useState } from "react";
import { 
  ArrowLeft,
  Users,
  Upload,
  Tag,
  Filter,
  Database,
  CheckCircle,
  Clock,
  Star,
  Search,
  FileText,
  Download,
  AlertCircle,
  TrendingUp,
  Settings
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

const sections = [
  {
    id: "import",
    title: "Importação em Massa",
    icon: Upload,
    description: "Como importar grandes volumes de contatos de forma eficiente",
    timeEstimate: "10 min",
    difficulty: "Médio",
    topics: [
      "Preparação do arquivo CSV/Excel",
      "Mapeamento de campos",
      "Validação de dados",
      "Tratamento de duplicatas",
      "Importação incremental"
    ]
  },
  {
    id: "segmentation",
    title: "Segmentação Avançada",
    icon: Filter,
    description: "Crie segmentos inteligentes para campanhas direcionadas",
    timeEstimate: "15 min",
    difficulty: "Intermediário",
    topics: [
      "Critérios de segmentação",
      "Segmentos dinâmicos vs estáticos",
      "Combinação de filtros",
      "Segmentação comportamental",
      "Automação de segmentos"
    ]
  },
  {
    id: "tags",
    title: "Tags e Categorias",
    icon: Tag,
    description: "Organize seus contatos com sistema de tags inteligente",
    timeEstimate: "8 min",
    difficulty: "Fácil",
    topics: [
      "Criação de tags hierárquicas",
      "Tags automáticas",
      "Cores e ícones",
      "Filtros por tags",
      "Relatórios por categoria"
    ]
  },
  {
    id: "cleanup",
    title: "Limpeza de Dados",
    icon: Database,
    description: "Mantenha sua base limpa e atualizada",
    timeEstimate: "12 min",
    difficulty: "Intermediário",
    topics: [
      "Detecção de duplicatas",
      "Validação de e-mails",
      "Limpeza de dados inválidos",
      "Merge de contatos",
      "Backup antes da limpeza"
    ]
  }
];

const bestPractices = [
  {
    title: "Padronização de Dados",
    description: "Defina padrões para nomes, telefones e endereços",
    icon: Settings,
    importance: "Alta"
  },
  {
    title: "Política de Privacidade",
    description: "Respeite LGPD e obtenha consentimento adequado",
    icon: AlertCircle,
    importance: "Crítica"
  },
  {
    title: "Backup Regular",
    description: "Faça backup da base antes de alterações em massa",
    icon: Database,
    importance: "Alta"
  },
  {
    title: "Monitoramento de Qualidade",
    description: "Acompanhe métricas de qualidade dos dados",
    icon: TrendingUp,
    importance: "Média"
  }
];

const importSteps = [
  {
    step: 1,
    title: "Preparar arquivo",
    description: "Organize dados em formato CSV/Excel",
    details: [
      "Use UTF-8 para caracteres especiais",
      "Uma linha por contato",
      "Cabeçalhos em português",
      "Remova células mescladas"
    ]
  },
  {
    step: 2,
    title: "Mapear campos",
    description: "Associe colunas aos campos do CRM",
    details: [
      "Nome completo → Nome",
      "Email → E-mail",
      "Telefone → Telefone",
      "Empresa → Empresa"
    ]
  },
  {
    step: 3,
    title: "Validar dados",
    description: "Verifique qualidade antes da importação",
    details: [
      "E-mails válidos",
      "Telefones formatados",
      "Nomes completos",
      "Sem duplicatas"
    ]
  },
  {
    step: 4,
    title: "Importar e revisar",
    description: "Execute importação e valide resultados",
    details: [
      "Importação em lotes",
      "Verificar erros",
      "Validar total importado",
      "Testar com amostra"
    ]
  }
];

export default function ContactManagementGuide() {
  const [activeSection, setActiveSection] = useState("import");
  
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/docs/guides">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos Guias
          </Button>
        </Link>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
            <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Gestão de Contatos</h1>
            <p className="text-muted-foreground">
              Como organizar, segmentar e gerenciar sua base de contatos de forma eficiente
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <Badge variant="outline">CRM</Badge>
          <Badge className="bg-green-100 text-green-800">Iniciante</Badge>
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            15 min
          </Badge>
          <Badge variant="secondary">
            <Star className="h-3 w-3 mr-1" />
            4.8
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="import">Importação</TabsTrigger>
          <TabsTrigger value="organization">Organização</TabsTrigger>
          <TabsTrigger value="maintenance">Manutenção</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {sections.map((section) => {
              const SectionIcon = section.icon;
              return (
                <Card key={section.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <SectionIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {section.timeEstimate}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {section.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">O que você aprenderá:</h4>
                      <ul className="text-sm space-y-1">
                        {section.topics.slice(0, 3).map((topic, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {topic}
                          </li>
                        ))}
                        {section.topics.length > 3 && (
                          <li className="text-muted-foreground text-xs">
                            +{section.topics.length - 3} tópicos adicionais
                          </li>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Melhores Práticas</CardTitle>
              <CardDescription>
                Diretrizes essenciais para uma gestão eficaz de contatos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {bestPractices.map((practice, index) => {
                  const PracticeIcon = practice.icon;
                  return (
                    <div key={index} className="flex gap-3 p-3 rounded-lg bg-muted/30">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <PracticeIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm">{practice.title}</h4>
                          <Badge 
                            variant={practice.importance === "Crítica" ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {practice.importance}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{practice.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Importação em Massa
              </CardTitle>
              <CardDescription>
                Passo a passo para importar contatos de forma eficiente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {importSteps.map((step, index) => (
                  <div key={step.step} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                        {step.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">{step.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                      <div className="grid gap-2">
                        {step.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            {detail}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Importante:</strong> Sempre faça backup da sua base antes de importações grandes. 
              Teste com uma amostra pequena primeiro.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="organization" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Segmentação Avançada
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Tipos de Segmentação:</h4>
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-muted/30">
                      <div className="font-medium text-sm">Demográfica</div>
                      <div className="text-xs text-muted-foreground">Idade, localização, gênero</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <div className="font-medium text-sm">Comportamental</div>
                      <div className="text-xs text-muted-foreground">Interações, compras, engajamento</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <div className="font-medium text-sm">Psicográfica</div>
                      <div className="text-xs text-muted-foreground">Interesses, valores, estilo de vida</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Sistema de Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Categorias Sugeridas:</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Cliente</Badge>
                    <Badge variant="outline">Prospect</Badge>
                    <Badge variant="outline">Lead Quente</Badge>
                    <Badge variant="outline">Perdido</Badge>
                    <Badge variant="outline">Reengajamento</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">São Paulo</Badge>
                    <Badge variant="secondary">Rio de Janeiro</Badge>
                    <Badge variant="secondary">Empresa</Badge>
                    <Badge variant="secondary">Pessoa Física</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Limpeza e Manutenção
              </CardTitle>
              <CardDescription>
                Mantenha sua base de contatos sempre atualizada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-semibold">Rotina de Limpeza:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Verificação semanal de bounces</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Limpeza mensal de duplicatas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Validação trimestral de dados</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Backup mensal completo</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Ferramentas Úteis:</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Search className="h-4 w-4 mr-2" />
                      Detector de Duplicatas
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Database className="h-4 w-4 mr-2" />
                      Validador de E-mails
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Relatório de Qualidade
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Resources */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Recursos e Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="justify-start">
              <Download className="h-4 w-4 mr-2" />
              Template CSV
            </Button>
            <Button variant="outline" className="justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Checklist de Limpeza
            </Button>
            <Button variant="outline" className="justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Guia de Segmentação
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
