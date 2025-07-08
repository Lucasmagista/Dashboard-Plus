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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  HelpCircle,
  MessageSquare,
  BookOpen,
  Video,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  Users,
  TrendingUp,
  Zap,
} from "lucide-react"

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

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2">
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
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Ajuda & Suporte</h1>
            <p className="text-muted-foreground">
              Encontre respostas para suas dúvidas ou entre em contato conosco
            </p>
          </div>

          {/* Busca e Filtros */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar ajuda..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Categoria" />
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

          {/* Ações Rápidas */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-base">Chat ao Vivo</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Converse com nossa equipe de suporte
                </p>
                <Badge variant="secondary" className="mt-2">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Online
                </Badge>
              </CardContent>
            </Card>

            <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-5 w-5 text-green-500" />
                      <CardTitle className="text-base">Enviar Ticket</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Descreva seu problema detalhadamente
                    </p>
                    <Badge variant="outline" className="mt-2">
                      <Clock className="mr-1 h-3 w-3" />
                      24h resposta
                    </Badge>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Criar Ticket de Suporte</DialogTitle>
                  <DialogDescription>
                    Descreva seu problema e nossa equipe entrará em contato
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Assunto</label>
                    <Input placeholder="Título do problema" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Categoria</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Problema Técnico</SelectItem>
                        <SelectItem value="billing">Cobrança</SelectItem>
                        <SelectItem value="feature">Solicitação de Recurso</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Descrição</label>
                    <Textarea 
                      placeholder="Descreva seu problema em detalhes..."
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full">
                    Enviar Ticket
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-orange-500" />
                  <CardTitle className="text-base">Ligar</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  (11) 4000-0000
                </p>
                <Badge variant="outline" className="mt-2">
                  <Clock className="mr-1 h-3 w-3" />
                  9h às 18h
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Conteúdo Principal */}
          <Tabs defaultValue="faq" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="faq">
                <HelpCircle className="mr-2 h-4 w-4" />
                FAQ
              </TabsTrigger>
              <TabsTrigger value="guides">
                <BookOpen className="mr-2 h-4 w-4" />
                Guias
              </TabsTrigger>
              <TabsTrigger value="videos">
                <Video className="mr-2 h-4 w-4" />
                Vídeos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="faq" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Perguntas Frequentes</CardTitle>
                  <CardDescription>
                    Respostas para as dúvidas mais comuns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Como faço para adicionar novos contatos?</AccordionTrigger>
                      <AccordionContent>
                        Para adicionar novos contatos, acesse a seção CRM &gt; Contatos e clique no botão &quot;Adicionar Contato&quot;. 
                        Preencha as informações necessárias e salve.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Como configurar automações?</AccordionTrigger>
                      <AccordionContent>
                        As automações podem ser configuradas em Automação &gt; Workflows. 
                        Escolha um gatilho e defina as ações que devem ser executadas automaticamente.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Como visualizar relatórios de vendas?</AccordionTrigger>
                      <AccordionContent>
                        Os relatórios estão disponíveis na seção Análises. 
                        Você pode filtrar por período, equipe ou produto para obter insights específicos.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="guides" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Primeiros Passos</CardTitle>
                    <CardDescription>
                      Configuração inicial da plataforma
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">Iniciante</Badge>
                      <Button variant="outline" size="sm">
                        Ler Guia
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Configurando Integrações</CardTitle>
                    <CardDescription>
                      Conecte suas ferramentas favoritas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">Intermediário</Badge>
                      <Button variant="outline" size="sm">
                        Ler Guia
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="videos" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Introdução ao CRM Pro</CardTitle>
                    <CardDescription>
                      Visão geral das principais funcionalidades
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">8:45</span>
                      <Button variant="outline" size="sm">
                        <Video className="mr-2 h-4 w-4" />
                        Assistir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SidebarInset>
  )
}
