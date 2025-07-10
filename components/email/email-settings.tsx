"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Settings,
  Shield,
  Palette,
  Save,
  TestTube,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Edit,
  Trash2,
  Copy,
  MoreVertical,
  Search,
  Filter,
  FileText,
  Code,
  Zap,
  Heart,
  Mail
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useEmail } from "@/hooks/use-email"
import { TemplateEditor } from "./template-editor"

interface EmailSettings {
  senderName: string
  senderEmail: string
  replyTo: string
  signature: string
  autoReply: boolean
  autoReplyMessage: string
  trackOpens: boolean
  trackClicks: boolean
  unsubscribeLink: boolean
  emailFooter: string
}

export function EmailSettings() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<EmailSettings>({
    senderName: "Dashboard Plus",
    senderEmail: "noreply@dashboardplus.com",
    replyTo: "contato@dashboardplus.com",
    signature: "Atenciosamente,\nEquipe Dashboard Plus",
    autoReply: false,
    autoReplyMessage: "Obrigado pelo seu e-mail. Responderemos em breve.",
    trackOpens: true,
    trackClicks: true,
    unsubscribeLink: true,
    emailFooter: "© 2025 Dashboard Plus. Todos os direitos reservados."
  })

  const [testEmail, setTestEmail] = useState("")
  const [isTesting, setIsTesting] = useState(false)

  const handleSave = () => {
    // Salvar configurações (implementar persistência)
    toast({
      title: "Configurações salvas",
      description: "As configurações de e-mail foram atualizadas com sucesso.",
    })
  }

  const handleTestEmail = async () => {
    if (!testEmail) {
      toast({
        title: "E-mail necessário",
        description: "Digite um e-mail para teste.",
        variant: "destructive"
      })
      return
    }

    setIsTesting(true)
    try {
      // Simular envio de teste
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "E-mail de teste enviado",
        description: `E-mail de teste enviado para ${testEmail}`,
      })
    } catch (error) {
      console.error('Erro no teste de email:', error)
      toast({
        title: "Erro no teste",
        description: "Falha ao enviar e-mail de teste.",
        variant: "destructive"
      })
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Configurações de E-mail</h2>
          <p className="text-muted-foreground">Gerencie as configurações do sistema de e-mail</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">
            <Settings className="w-4 h-4 mr-2" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="tracking">
            <Eye className="w-4 h-4 mr-2" />
            Rastreamento
          </TabsTrigger>
          <TabsTrigger value="templates">
            <Palette className="w-4 h-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="w-4 h-4 mr-2" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="test">
            <TestTube className="w-4 h-4 mr-2" />
            Teste
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Remetente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="senderName">Nome do Remetente</Label>
                  <Input
                    id="senderName"
                    value={settings.senderName}
                    onChange={(e) => setSettings({ ...settings, senderName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="senderEmail">E-mail do Remetente</Label>
                  <Input
                    id="senderEmail"
                    type="email"
                    value={settings.senderEmail}
                    onChange={(e) => setSettings({ ...settings, senderEmail: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="replyTo">E-mail de Resposta</Label>
                  <Input
                    id="replyTo"
                    type="email"
                    value={settings.replyTo}
                    onChange={(e) => setSettings({ ...settings, replyTo: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assinatura Padrão</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="signature">Assinatura</Label>
                  <Textarea
                    id="signature"
                    rows={4}
                    value={settings.signature}
                    onChange={(e) => setSettings({ ...settings, signature: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resposta Automática</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="autoReply"
                  checked={settings.autoReply}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoReply: checked })}
                />
                <Label htmlFor="autoReply">Ativar resposta automática</Label>
              </div>
              {settings.autoReply && (
                <div>
                  <Label htmlFor="autoReplyMessage">Mensagem da Resposta Automática</Label>
                  <Textarea
                    id="autoReplyMessage"
                    rows={3}
                    value={settings.autoReplyMessage}
                    onChange={(e) => setSettings({ ...settings, autoReplyMessage: e.target.value })}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Rastreamento</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure como os e-mails são rastreados para analytics
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Rastrear Aberturas</Label>
                      <p className="text-sm text-muted-foreground">
                        Monitora quando os e-mails são abertos
                      </p>
                    </div>
                    <Switch
                      checked={settings.trackOpens}
                      onCheckedChange={(checked) => setSettings({ ...settings, trackOpens: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Rastrear Cliques</Label>
                      <p className="text-sm text-muted-foreground">
                        Monitora cliques em links dos e-mails
                      </p>
                    </div>
                    <Switch
                      checked={settings.trackClicks}
                      onCheckedChange={(checked) => setSettings({ ...settings, trackClicks: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Link de Descadastro</Label>
                      <p className="text-sm text-muted-foreground">
                        Inclui link de descadastro automático
                      </p>
                    </div>
                    <Switch
                      checked={settings.unsubscribeLink}
                      onCheckedChange={(checked) => setSettings({ ...settings, unsubscribeLink: checked })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Benefícios do Rastreamento</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Análise de performance em tempo real</li>
                      <li>• Otimização de campanhas</li>
                      <li>• Segmentação baseada em comportamento</li>
                      <li>• Conformidade com LGPD</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rodapé dos E-mails</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="emailFooter">Texto do Rodapé</Label>
                <Textarea
                  id="emailFooter"
                  rows={3}
                  value={settings.emailFooter}
                  onChange={(e) => setSettings({ ...settings, emailFooter: e.target.value })}
                  placeholder="Texto que aparece no final de todos os e-mails"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <TemplateManager />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Status da Configuração</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">API MailerSend</span>
                  <Badge variant="outline" className="text-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Conectado
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Domínio Verificado</span>
                  <Badge variant="outline" className="text-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verificado
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">SPF Record</span>
                  <Badge variant="outline" className="text-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Configurado
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">DKIM</span>
                  <Badge variant="outline" className="text-yellow-600">
                    <Clock className="w-3 h-3 mr-1" />
                    Pendente
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">DMARC</span>
                  <Badge variant="outline" className="text-red-600">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Não Configurado
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Limites e Quotas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">E-mails enviados hoje</span>
                  <Badge variant="secondary">247 / 1,000</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">E-mails este mês</span>
                  <Badge variant="secondary">8,432 / 10,000</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Taxa de rejeição</span>
                  <Badge variant="outline" className="text-green-600">1.2%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Reputação do domínio</span>
                  <Badge variant="outline" className="text-green-600">Excelente</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Configuração DNS</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure estes registros DNS para melhor entregabilidade
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">SPF Record</span>
                    <Badge variant="outline" className="text-green-600">Configurado</Badge>
                  </div>
                  <code className="text-xs bg-muted p-2 rounded block">
                    v=spf1 include:mailersend.net ~all
                  </code>
                </div>
                
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">DKIM Record</span>
                    <Badge variant="outline" className="text-yellow-600">Pendente</Badge>
                  </div>
                  <code className="text-xs bg-muted p-2 rounded block">
                    fm1._domainkey IN TXT "k=rsa; p=MIGfMA0G..."
                  </code>
                </div>

                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">DMARC Record</span>
                    <Badge variant="outline" className="text-red-600">Não Configurado</Badge>
                  </div>
                  <code className="text-xs bg-muted p-2 rounded block">
                    v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Teste de Configuração</CardTitle>
              <p className="text-sm text-muted-foreground">
                Envie um e-mail de teste para verificar a configuração
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="seu@email.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleTestEmail} disabled={isTesting}>
                  <TestTube className="w-4 h-4 mr-2" />
                  {isTesting ? "Enviando..." : "Enviar Teste"}
                </Button>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">O que será testado:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Conectividade com MailerSend</li>
                  <li>• Configuração de autenticação</li>
                  <li>• Entregabilidade do e-mail</li>
                  <li>• Templates e assinatura</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Logs de Teste</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                <div className="text-xs text-muted-foreground border-l-2 border-green-500 pl-3 py-2">
                  <span className="font-medium">[09:45:32]</span> E-mail de teste enviado para teste@exemplo.com - Sucesso
                </div>
                <div className="text-xs text-muted-foreground border-l-2 border-blue-500 pl-3 py-2">
                  <span className="font-medium">[09:45:30]</span> Iniciando teste de configuração...
                </div>
                <div className="text-xs text-muted-foreground border-l-2 border-green-500 pl-3 py-2">
                  <span className="font-medium">[09:45:28]</span> Conexão com MailerSend estabelecida
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Componente para gerenciar templates
function TemplateManager() {
  const { toast } = useToast()
  const { templates, loadTemplates, createTemplate, updateTemplate, deleteTemplate, isLoading } = useEmail()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<any>(null)
  const [previewTemplate, setPreviewTemplate] = useState<any>(null)
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    subject: "",
    html: "",
    text: "",
    category: "custom"
  })

  useEffect(() => {
    loadTemplates()
  }, [loadTemplates])

  const categories = [
    { value: "all", label: "Todos", icon: FileText },
    { value: "onboarding", label: "Onboarding", icon: Zap },
    { value: "marketing", label: "Marketing", icon: Heart },
    { value: "transactional", label: "Transacional", icon: Mail },
    { value: "custom", label: "Personalizado", icon: Code }
  ]

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCreateTemplate = async () => {
    if (!newTemplate.name || !newTemplate.subject) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e assunto são obrigatórios.",
        variant: "destructive"
      })
      return
    }

    const result = await createTemplate(newTemplate)
    
    if (result.success) {
      setIsCreateDialogOpen(false)
      setNewTemplate({
        name: "",
        subject: "",
        html: "",
        text: "",
        category: "custom"
      })
    }
  }

  const handleEditTemplate = async () => {
    if (!editingTemplate) return

    const result = await updateTemplate(editingTemplate.id, editingTemplate)
    
    if (result.success) {
      setEditingTemplate(null)
    }
  }

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Tem certeza que deseja excluir este template?')) return

    await deleteTemplate(templateId)
  }

  const handleDuplicateTemplate = (template: any) => {
    setNewTemplate({
      name: `${template.name} (Cópia)`,
      subject: template.subject,
      html: template.html || "",
      text: template.text || "",
      category: "custom"
    })
    setIsCreateDialogOpen(true)
  }

  const getTemplatePreview = (template: any) => {
    if (template.html) {
      return template.html.substring(0, 150) + "..."
    }
    return template.text?.substring(0, 150) + "..." || "Sem conteúdo"
  }

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.value === category)
    return cat ? cat.icon : FileText
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Carregando templates...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Gerenciar Templates</h3>
          <p className="text-muted-foreground">Crie e gerencie templates de e-mail personalizados</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Template
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => {
                    const Icon = category.icon
                    return (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center">
                          <Icon className="w-4 h-4 mr-2" />
                          {category.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Templates */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map(template => {
          const CategoryIcon = getCategoryIcon(template.category || 'custom')
          return (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <CategoryIcon className="w-4 h-4 text-muted-foreground" />
                    <Badge variant="outline" className="text-xs">
                      {categories.find(c => c.value === template.category)?.label || 'Custom'}
                    </Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setPreviewTemplate(template)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditingTemplate(template)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicateTemplate(template)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicar
                      </DropdownMenuItem>
                      {template.category === 'custom' && (
                        <DropdownMenuItem 
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div>
                  <h4 className="font-semibold">{template.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{template.subject}</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  {getTemplatePreview(template)}
                </div>
                {template.variables && template.variables.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {template.variables.slice(0, 3).map(variable => (
                      <Badge key={variable} variant="secondary" className="text-xs">
                        {variable}
                      </Badge>
                    ))}
                    {template.variables.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{template.variables.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Nenhum template encontrado</h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedCategory !== "all" 
                ? "Tente ajustar os filtros ou criar um novo template." 
                : "Crie seu primeiro template de e-mail."}
            </p>
            <Button 
              className="mt-4" 
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Template
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialog para criar/editar template */}
      <Dialog open={isCreateDialogOpen || !!editingTemplate} onOpenChange={(open) => {
        if (!open) {
          setIsCreateDialogOpen(false)
          setEditingTemplate(null)
        }
      }}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Editar Template' : 'Criar Template'}
            </DialogTitle>
          </DialogHeader>
          <TemplateEditor
            template={editingTemplate || newTemplate}
            onChange={(template) => {
              if (editingTemplate) {
                setEditingTemplate(template)
              } else {
                setNewTemplate(template)
              }
            }}
            onSave={editingTemplate ? handleEditTemplate : handleCreateTemplate}
            onCancel={() => {
              setIsCreateDialogOpen(false)
              setEditingTemplate(null)
            }}
            isEdit={!!editingTemplate}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog para preview */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Preview: {previewTemplate?.name}</DialogTitle>
          </DialogHeader>
          {previewTemplate && (
            <div className="space-y-4">
              <div>
                <Label>Assunto:</Label>
                <p className="font-medium">{previewTemplate.subject}</p>
              </div>
              
              <Tabs defaultValue="html" className="w-full">
                <TabsList>
                  <TabsTrigger value="html">HTML</TabsTrigger>
                  <TabsTrigger value="text">Texto</TabsTrigger>
                  <TabsTrigger value="rendered">Renderizado</TabsTrigger>
                </TabsList>
                
                <TabsContent value="html" className="mt-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">{previewTemplate.html}</pre>
                  </div>
                </TabsContent>
                
                <TabsContent value="text" className="mt-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm whitespace-pre-wrap">{previewTemplate.text || "Sem versão em texto"}</pre>
                  </div>
                </TabsContent>
                
                <TabsContent value="rendered" className="mt-4">
                  <div className="border rounded-lg p-4 bg-card">
                    <div dangerouslySetInnerHTML={{ __html: previewTemplate.html || previewTemplate.text }} />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
