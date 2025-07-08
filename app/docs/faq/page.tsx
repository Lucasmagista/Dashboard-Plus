"use client";

import React, { useState } from "react";
import { 
  Search,
  ChevronDown,
  ChevronRight,
  MessageCircle,
  HelpCircle,
  Book,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Star,
  Clock,
  Tag
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";

const faqData = [
  {
    id: "general",
    category: "Geral",
    icon: HelpCircle,
    questions: [
      {
        question: "O que é o CRM Pro Dashboard?",
        answer: "O CRM Pro Dashboard é uma plataforma completa de gestão de relacionamento com clientes, oferecendo automação, analytics avançados, integrações e uma interface moderna para gerenciar todo o ciclo de vendas.",
        helpful: 142,
        tags: ["produto", "overview"]
      },
      {
        question: "Quais são os requisitos do sistema?",
        answer: "Para executar o CRM Pro Dashboard você precisa de: Node.js 18+, PostgreSQL 13+, Redis (opcional para cache), e pelo menos 2GB de RAM. Para desenvolvimento, recomendamos Docker.",
        helpful: 89,
        tags: ["requisitos", "sistema"]
      },
      {
        question: "O CRM Pro é gratuito?",
        answer: "Oferecemos um plano gratuito para até 3 usuários e 1000 contatos. Para recursos avançados e mais usuários, consulte nossos planos pagos na seção de cobrança.",
        helpful: 156,
        tags: ["preço", "planos"]
      },
      {
        question: "Como posso migrar dados de outro CRM?",
        answer: "Fornecemos ferramentas de importação para os principais CRMs (Salesforce, HubSpot, Pipedrive). Acesse Configurações > Importar Dados ou entre em contato com nosso suporte para migrações customizadas.",
        helpful: 67,
        tags: ["migração", "importação"]
      }
    ]
  },
  {
    id: "installation",
    category: "Instalação",
    icon: Book,
    questions: [
      {
        question: "Como instalar o CRM Pro localmente?",
        answer: "Clone o repositório, execute 'npm install', configure as variáveis de ambiente (.env), execute as migrações do banco e inicie com 'npm run dev'. Veja o guia completo em /docs/installation.",
        helpful: 203,
        tags: ["instalação", "desenvolvimento"]
      },
      {
        question: "Erro 'connection refused' ao conectar ao banco?",
        answer: "Verifique se o PostgreSQL está rodando, as credenciais estão corretas no .env, e se o banco especificado existe. Execute 'npm run db:setup' para criar o banco automaticamente.",
        helpful: 178,
        tags: ["erro", "database", "troubleshooting"]
      },
      {
        question: "Como usar Docker para desenvolvimento?",
        answer: "Execute 'docker-compose up -d' na raiz do projeto. Isso iniciará todos os serviços necessários (app, database, redis). Acesse localhost:3000 após a inicialização.",
        helpful: 134,
        tags: ["docker", "desenvolvimento"]
      },
      {
        question: "Como atualizar para uma nova versão?",
        answer: "Execute 'git pull', 'npm install' para novas dependências, 'npm run db:migrate' para atualizações do banco, e reinicie a aplicação. Sempre faça backup antes de atualizar.",
        helpful: 92,
        tags: ["atualização", "versão"]
      }
    ]
  },
  {
    id: "features",
    category: "Funcionalidades",
    icon: Star,
    questions: [
      {
        question: "Como configurar automação de e-mail?",
        answer: "Vá em Automação > Workflows, crie um novo workflow, escolha o trigger (ex: novo lead), adicione a ação 'Enviar E-mail', configure o template e ative o workflow.",
        helpful: 167,
        tags: ["automação", "email", "workflow"]
      },
      {
        question: "Posso personalizar os campos do CRM?",
        answer: "Sim! Acesse Configurações > Campos Personalizados. Você pode adicionar campos texto, número, data, seleção, etc. para contatos, leads e oportunidades.",
        helpful: 145,
        tags: ["customização", "campos"]
      },
      {
        question: "Como configurar integrações com WhatsApp?",
        answer: "Vá em Integrações > WhatsApp, conecte sua conta WhatsApp Business, configure os webhooks e ative a sincronização. Veja o guia completo em /docs/integrations.",
        helpful: 234,
        tags: ["whatsapp", "integração"]
      },
      {
        question: "Como criar relatórios personalizados?",
        answer: "Acesse Analytics > Relatórios Personalizados, escolha as métricas desejadas, configure filtros e períodos. Você pode salvar, agendar e compartilhar os relatórios.",
        helpful: 89,
        tags: ["relatórios", "analytics"]
      }
    ]
  },
  {
    id: "api",
    category: "API & Desenvolvimento",
    icon: MessageCircle,
    questions: [
      {
        question: "Como obter uma chave de API?",
        answer: "Vá em Configurações > API Keys, clique em 'Gerar Nova Chave', defina as permissões necessárias. Use essa chave no header 'Authorization: Bearer YOUR_KEY'.",
        helpful: 156,
        tags: ["api", "autenticação"]
      },
      {
        question: "Qual é o limite de rate limiting da API?",
        answer: "API REST: 1000 req/min por chave. GraphQL: 100 queries/min. Para limites maiores, entre em contato com o suporte ou considere o plano Enterprise.",
        helpful: 78,
        tags: ["api", "rate-limit"]
      },
      {
        question: "Como usar webhooks?",
        answer: "Configure webhooks em Configurações > Webhooks. Defina a URL endpoint, selecione os eventos (contato criado, deal fechado, etc.) e configure a autenticação se necessário.",
        helpful: 123,
        tags: ["webhooks", "api"]
      },
      {
        question: "Existe SDK para outras linguagens?",
        answer: "Oferecemos SDKs oficiais para JavaScript/Node.js, Python e PHP. SDKs para outras linguagens estão em desenvolvimento. Veja /docs/api para exemplos.",
        helpful: 67,
        tags: ["sdk", "linguagens"]
      }
    ]
  },
  {
    id: "troubleshooting",
    category: "Solução de Problemas",
    icon: Clock,
    questions: [
      {
        question: "O dashboard está lento, como resolver?",
        answer: "Verifique a conexão de internet, limpe o cache do navegador, desative extensões desnecessárias. Se persistir, verifique se há muitos dados sendo carregados simultaneamente.",
        helpful: 189,
        tags: ["performance", "lentidão"]
      },
      {
        question: "Erro de timeout na API?",
        answer: "Timeouts podem ocorrer com queries complexas. Otimize consultas, use paginação, implemente cache quando possível. Para operações longas, considere processamento assíncrono.",
        helpful: 145,
        tags: ["timeout", "api", "performance"]
      },
      {
        question: "Como recuperar dados deletados?",
        answer: "Dados são mantidos em soft delete por 30 dias. Acesse Configurações > Lixeira para recuperar. Para dados críticos, restaure do backup mais recente.",
        helpful: 112,
        tags: ["recuperação", "backup", "dados"]
      },
      {
        question: "Problemas com sincronização de e-mail?",
        answer: "Verifique as credenciais IMAP/SMTP, configure app passwords se usar 2FA, verifique se o provedor permite acesso de aplicações. Consulte /docs/integrations para detalhes.",
        helpful: 98,
        tags: ["email", "sincronização", "imap"]
      }
    ]
  }
];

const popularQuestions = [
  "Como instalar o CRM Pro localmente?",
  "Como configurar automação de e-mail?", 
  "Posso personalizar os campos do CRM?",
  "Como obter uma chave de API?",
  "O dashboard está lento, como resolver?"
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openSections, setOpenSections] = useState<string[]>(["general"]);

  const categories = ["all", ...faqData.map(cat => cat.category)];

  const filteredFAQ = faqData.filter(category => {
    const categoryMatch = selectedCategory === "all" || category.category === selectedCategory;
    const searchMatch = searchTerm === "" || 
      category.questions.some(q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    return categoryMatch && searchMatch;
  });

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const markHelpful = (categoryId: string, questionIndex: number, helpful: boolean) => {
    // Implementar lógica de feedback
    console.log(`Question marked as ${helpful ? 'helpful' : 'not helpful'}:`, categoryId, questionIndex);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Perguntas Frequentes</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Respostas para as dúvidas mais comuns sobre o CRM Pro Dashboard.
        </p>
      </div>

      {/* Popular Questions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Perguntas Populares
          </CardTitle>
          <CardDescription>
            As perguntas mais frequentes da nossa comunidade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {popularQuestions.map((question, index) => (
              <Button key={index} variant="ghost" className="justify-start text-left h-auto p-3" asChild>
                <div className="cursor-pointer hover:bg-muted/50">
                  <MessageCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{question}</span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar perguntas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background min-w-[200px]"
              aria-label="Filtrar por categoria"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === "all" ? "Todas as Categorias" : category}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Sections */}
      <div className="space-y-6">
        {filteredFAQ.map((category) => (
          <Card key={category.id}>
            <CardHeader 
              className="cursor-pointer"
              onClick={() => toggleSection(category.id)}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <category.icon className="h-5 w-5" />
                  {category.category}
                  <Badge variant="secondary">
                    {category.questions.filter(q => 
                      searchTerm === "" || 
                      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      q.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      q.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
                    ).length} perguntas
                  </Badge>
                </div>
                {openSections.includes(category.id) ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </CardTitle>
            </CardHeader>
            
            {openSections.includes(category.id) && (
              <CardContent>
                <div className="space-y-6">
                  {category.questions
                    .filter(q => 
                      searchTerm === "" || 
                      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      q.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      q.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
                    )
                    .map((faq, index) => (
                    <div key={index} className="border-l-2 border-primary/20 pl-4">
                      <h4 className="font-semibold text-lg mb-2">{faq.question}</h4>
                      <p className="text-muted-foreground mb-3 leading-relaxed">{faq.answer}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {faq.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{faq.helpful} acharam útil</span>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => markHelpful(category.id, index, true)}
                            className="h-8 w-8 p-0"
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => markHelpful(category.id, index, false)}
                            className="h-8 w-8 p-0"
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Help Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Não encontrou sua resposta?</CardTitle>
          <CardDescription>
            Estamos aqui para ajudar! Entre em contato conosco.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex-col items-start" asChild>
              <a href="/support" className="w-full">
                <MessageCircle className="h-5 w-5 mb-2" />
                <div className="text-left">
                  <div className="font-semibold">Suporte Técnico</div>
                  <div className="text-xs text-muted-foreground">Resposta em até 24h</div>
                </div>
              </a>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex-col items-start" asChild>
              <a href="/docs" className="w-full">
                <Book className="h-5 w-5 mb-2" />
                <div className="text-left">
                  <div className="font-semibold">Documentação</div>
                  <div className="text-xs text-muted-foreground">Guias completos</div>
                </div>
              </a>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex-col items-start" asChild>
              <a href="https://github.com/your-repo/discussions" className="w-full" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-5 w-5 mb-2" />
                <div className="text-left">
                  <div className="font-semibold">Comunidade</div>
                  <div className="text-xs text-muted-foreground">Discussões no GitHub</div>
                </div>
              </a>
            </Button>
          </div>
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
