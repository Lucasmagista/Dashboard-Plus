"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Search,
  MessageSquare,
  Book,
  Video,
  FileText,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Star,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Download,
} from "lucide-react"

const faqData = [
  {
    id: 1,
    question: "Como redefinir minha senha?",
    answer:
      "Para redefinir sua senha, acesse a página de login e clique em 'Esqueci minha senha'. Informe seu e-mail e enviaremos um link para redefinição.",
    category: "Conta",
    helpful: 45,
    notHelpful: 3,
  },
  {
    id: 2,
    question: "Como faço upgrade da minha assinatura?",
    answer:
      "Você pode fazer upgrade acessando Configurações > Cobrança e selecionando um novo plano. As mudanças são imediatas.",
    category: "Cobrança",
    helpful: 38,
    notHelpful: 2,
  },
  {
    id: 3,
    question: "Como integrar com serviços de terceiros?",
    answer:
      "Vá até a página de Integrações no menu principal. Selecione o serviço desejado e siga as instruções de configuração.",
    category: "Integrações",
    helpful: 52,
    notHelpful: 1,
  },
  {
    id: 4,
    question: "Posso exportar meus dados?",
    answer:
      "Sim, você pode exportar seus dados em Configurações > Gestão de Dados. Escolha o formato e os tipos de dados para exportação.",
    category: "Dados",
    helpful: 29,
    notHelpful: 0,
  },
  {
    id: 5,
    question: "Como configurar fluxos de trabalho automáticos?",
    answer:
      "Acesse a seção Workflows e clique em 'Criar Workflow'. Escolha um modelo ou crie um fluxo personalizado com gatilhos e ações.",
    category: "Automação",
    helpful: 67,
    notHelpful: 4,
  },
]

const supportArticles = [
  {
    id: 1,
    title: "Guia de Introdução",
    description: "Guia completo para configurar sua conta e começar a usar",
    category: "Primeiros Passos",
    readTime: "5 min",
    views: 1247,
    rating: 4.8,
    lastUpdated: "2024-01-15",
  },
  {
    id: 2,
    title: "Recursos Avançados do CRM",
    description: "Conheça recursos avançados como funil de vendas e automação",
    category: "CRM",
    readTime: "12 min",
    views: 856,
    rating: 4.6,
    lastUpdated: "2024-01-12",
  },
  {
    id: 3,
    title: "Guia de Integração",
    description: "Passo a passo para configurar integrações populares",
    category: "Integrações",
    readTime: "8 min",
    views: 634,
    rating: 4.9,
    lastUpdated: "2024-01-10",
  },
  {
    id: 4,
    title: "Resolução de Problemas Comuns",
    description: "Soluções para problemas frequentes",
    category: "Resolução de Problemas",
    readTime: "6 min",
    views: 923,
    rating: 4.5,
    lastUpdated: "2024-01-08",
  },
]

const videoTutorials = [
  {
    id: 1,
    title: "Visão Geral da Plataforma",
    description: "Uma visão completa de todos os recursos da plataforma",
    duration: "15:30",
    views: 2341,
    category: "Primeiros Passos",
    thumbnail: "/placeholder.svg?height=120&width=200",
  },
  {
    id: 2,
    title: "Configurando Seu Primeiro Workflow",
    description: "Aprenda a criar e configurar fluxos de trabalho automáticos",
    duration: "8:45",
    views: 1567,
    category: "Automação",
    thumbnail: "/placeholder.svg?height=120&width=200",
  },
  {
    id: 3,
    title: "Gerenciando Contatos e Leads",
    description: "Boas práticas para organizar seus dados no CRM",
    duration: "12:20",
    views: 1234,
    category: "CRM",
    thumbnail: "/placeholder.svg?height=120&width=200",
  },
]

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todas")
  const [isContactOpen, setIsContactOpen] = useState(false)

  const categories = [
    "Todas",
    "Conta",
    "Cobrança",
    "CRM",
    "Integrações",
    "Automação",
    "Dados",
    "Resolução de Problemas"
  ]

  const filteredFAQs = faqData.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "Todas" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredArticles = supportArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "Todas" || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Painel</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Ajuda & Suporte</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Ajuda & Suporte</h1>
            <p className="text-muted-foreground">Encontre respostas, guias e obtenha ajuda quando precisar</p>
          </div>
          <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
            <DialogTrigger asChild>
              <Button>
                <MessageSquare className="mr-2 h-4 w-4" />
                Contatar Suporte
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Contatar Suporte</DialogTitle>
                <DialogDescription>
                  Descreva seu problema e retornaremos o mais breve possível.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="subject" className="text-right">
                    Assunto
                  </Label>
                  <Input id="subject" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Categoria
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="technical">Problema Técnico</SelectItem>
                    <SelectItem value="billing">Dúvida de Cobrança</SelectItem>
                    <SelectItem value="feature">Sugestão de Funcionalidade</SelectItem>
                    <SelectItem value="general">Pergunta Geral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="priority" className="text-right">
                    Prioridade
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="message" className="text-right">
                    Mensagem
                  </Label>
                  <Textarea id="message" className="col-span-3 min-h-[100px]" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsContactOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsContactOpen(false)}>Enviar Mensagem</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo de Resposta</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">&lt; 2h</div>
              <p className="text-xs text-muted-foreground">Tempo médio de resposta</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Resolução</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98%</div>
              <p className="text-xs text-muted-foreground">Problemas resolvidos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Base de Conhecimento</CardTitle>
              <Book className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{supportArticles.length}</div>
              <p className="text-xs text-muted-foreground">Artigos de ajuda</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfação</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.9</div>
              <p className="text-xs text-muted-foreground">Avaliação dos clientes</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar artigos de ajuda..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="faq" className="space-y-4">
          <TabsList>
            <TabsTrigger value="faq">Perguntas Frequentes</TabsTrigger>
            <TabsTrigger value="articles">Artigos</TabsTrigger>
            <TabsTrigger value="videos">Vídeo Aulas</TabsTrigger>
            <TabsTrigger value="contact">Opções de Contato</TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Perguntas Frequentes</CardTitle>
                <CardDescription>Encontre respostas rápidas para dúvidas comuns</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQs.map((faq) => (
                    <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center justify-between w-full mr-4">
                          <span>{faq.question}</span>
                          <Badge variant="outline">{faq.category}</Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>{faq.answer}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <span className="text-sm text-muted-foreground">Esta resposta foi útil?</span>
                              <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm">
                                  <ThumbsUp className="h-4 w-4 mr-1" />
                                  {faq.helpful}
                                </Button>
                                <Button variant="outline" size="sm">
                                  <ThumbsDown className="h-4 w-4 mr-1" />
                                  {faq.notHelpful}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="articles" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                      <Badge variant="outline">{article.category}</Badge>
                    </div>
                    <CardDescription>{article.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{article.readTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{article.views} visualizações</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-current text-yellow-500" />
                          <span>{article.rating}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-2">
                      <span className="text-xs text-muted-foreground">Atualizado em {article.lastUpdated}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos" className="space-y-4">
            {/* Fim das opções de contato */}
              {videoTutorials.map((video) => (
                <Card key={video.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-32 object-cover rounded-t-lg"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {video.duration}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button size="icon" className="rounded-full">
                        <Video className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{video.title}</CardTitle>
                      <Badge variant="outline">{video.category}</Badge>
                    </div>
                    <CardDescription>{video.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{video.views} visualizações</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          <TabsContent value="contact" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Chat ao Vivo</span>
                  </CardTitle>
                  <CardDescription>Obtenha ajuda instantânea com nossa equipe</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Disponível 24/7</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Tempo médio de resposta: 2 minutos</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4">Iniciar Chat</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="h-5 w-5" />
                    <span>Suporte por E-mail</span>
                  </CardTitle>
                  <CardDescription>Envie uma mensagem detalhada</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Resposta em até 2 horas</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">Respostas detalhadas</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" onClick={() => setIsContactOpen(true)}>
                    Enviar E-mail
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="h-5 w-5" />
                    <span>Suporte Telefônico</span>
                  </CardTitle>
                  <CardDescription>Fale diretamente com nossa equipe</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Seg-Sex 9h-18h</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Apenas para clientes enterprise</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-transparent" variant="outline">
                    +55 (11) 1234-5678
                  </Button>
                </CardContent>
              </Card>


            <Card>
              <CardHeader>
                <CardTitle>Recursos Adicionais</CardTitle>
                <CardDescription>Mais formas de obter ajuda e se manter informado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Book className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium">Documentação</h4>
                        <p className="text-sm text-muted-foreground">Documentação completa da API e recursos</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-green-600" />
                      <div>
                        <h4 className="font-medium">Fórum da Comunidade</h4>
                        <p className="text-sm text-muted-foreground">Conecte-se com outros usuários</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Download className="h-5 w-5 text-purple-600" />
                      <div>
                        <h4 className="font-medium">Status do Sistema</h4>
                        <p className="text-sm text-muted-foreground">Verifique o status da plataforma</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                      <div>
                        <h4 className="font-medium">Sugestão de Funcionalidades</h4>
                        <p className="text-sm text-muted-foreground">Sugira novas funcionalidades</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  )
}
