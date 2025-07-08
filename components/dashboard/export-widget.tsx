"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  FileImage, 
  FileBarChart,
  Share2,
  Settings,
  Clock,
  CheckCircle,
  X,
  Filter,
  Calendar,
  Users,
  DollarSign,
  Plus,
  Save,
  Trash2
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface ExportOption {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  formats: string[]
  fileExtension: string
  features: string[]
}

interface ExportJob {
  id: string
  name: string
  format: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  createdAt: Date
  completedAt?: Date
  fileSize?: string
  downloadUrl?: string
  error?: string
}

interface ExportTemplate {
  id: string
  name: string
  description: string
  fields: string[]
  filters: any[]
  format: string
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly'
    time: string
    recipients: string[]
  }
}

const EXPORT_OPTIONS: ExportOption[] = [
  {
    id: 'pdf',
    name: 'PDF',
    icon: FileText,
    description: 'Relatório formatado para impressão',
    formats: ['Relatório completo', 'Resumo executivo', 'Gráficos apenas'],
    fileExtension: 'pdf',
    features: ['Formatação profissional', 'Gráficos integrados', 'Cabeçalhos personalizados']
  },
  {
    id: 'excel',
    name: 'Excel',
    icon: FileSpreadsheet,
    description: 'Planilha para análise de dados',
    formats: ['Dados brutos', 'Tabela dinâmica', 'Dashboard'],
    fileExtension: 'xlsx',
    features: ['Múltiplas abas', 'Fórmulas incluídas', 'Formatação condicional']
  },
  {
    id: 'csv',
    name: 'CSV',
    icon: FileSpreadsheet,
    description: 'Dados estruturados simples',
    formats: ['Padrão', 'Delimitado por vírgula', 'Delimitado por ponto-e-vírgula'],
    fileExtension: 'csv',
    features: ['Compatível com sistemas', 'Tamanho reduzido', 'Fácil importação']
  },
  {
    id: 'powerbi',
    name: 'Power BI',
    icon: FileBarChart,
    description: 'Arquivo para Power BI',
    formats: ['Dataset', 'Relatório', 'Dashboard'],
    fileExtension: 'pbix',
    features: ['Visualizações interativas', 'Atualizações automáticas', 'Compartilhamento']
  },
  {
    id: 'image',
    name: 'Imagem',
    icon: FileImage,
    description: 'Gráficos como imagem',
    formats: ['PNG', 'JPEG', 'SVG'],
    fileExtension: 'png',
    features: ['Alta qualidade', 'Transparência', 'Vetorial (SVG)']
  }
]

const AVAILABLE_FIELDS = [
  { id: 'customer_name', label: 'Nome do Cliente', icon: Users },
  { id: 'deal_value', label: 'Valor do Negócio', icon: DollarSign },
  { id: 'status', label: 'Status', icon: CheckCircle },
  { id: 'created_date', label: 'Data de Criação', icon: Calendar },
  { id: 'source', label: 'Origem', icon: Share2 },
  { id: 'priority', label: 'Prioridade', icon: Settings },
  { id: 'owner', label: 'Responsável', icon: Users },
  { id: 'last_contact', label: 'Último Contato', icon: Clock },
  { id: 'tags', label: 'Tags', icon: Filter },
  { id: 'notes', label: 'Observações', icon: FileText }
]

export function ExportWidget() {
  const [selectedFormat, setSelectedFormat] = useState<string>('pdf')
  const [selectedFields, setSelectedFields] = useState<string[]>(['customer_name', 'deal_value', 'status'])
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([])
  const [templates, setTemplates] = useState<ExportTemplate[]>([])
  const [templateName, setTemplateName] = useState('')
  const [showTemplateDialog, setShowTemplateDialog] = useState(false)
  const [recipients, setRecipients] = useState<string[]>([])
  const [newRecipient, setNewRecipient] = useState('')
  const [scheduleFrequency, setScheduleFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly')
  const [scheduleTime, setScheduleTime] = useState('09:00')

  // Carregar templates salvos
  useEffect(() => {
    const saved = localStorage.getItem('crm_export_templates')
    if (saved) {
      try {
        const parsedTemplates = JSON.parse(saved)
        setTemplates(parsedTemplates)
      } catch (error) {
        console.error('Erro ao carregar templates:', error)
      }
    }
  }, [])

  // Salvar templates
  const saveTemplates = (newTemplates: ExportTemplate[]) => {
    localStorage.setItem('crm_export_templates', JSON.stringify(newTemplates))
    setTemplates(newTemplates)
  }

  // Simular processo de exportação
  const startExport = (format: string, templateName?: string) => {
    const jobId = `export_${Date.now()}`
    const newJob: ExportJob = {
      id: jobId,
      name: templateName || `Exportação ${format.toUpperCase()}`,
      format,
      status: 'pending',
      progress: 0,
      createdAt: new Date()
    }

    setExportJobs(prev => [newJob, ...prev])

    // Simular progresso
    const progressInterval = setInterval(() => {
      setExportJobs(prev => prev.map(job => {
        if (job.id === jobId) {
          const newProgress = Math.min(job.progress + Math.random() * 20, 100)
          if (newProgress >= 100) {
            clearInterval(progressInterval)
            return {
              ...job,
              status: 'completed',
              progress: 100,
              completedAt: new Date(),
              fileSize: `${Math.floor(Math.random() * 5000) + 500}KB`,
              downloadUrl: `/exports/${jobId}.${EXPORT_OPTIONS.find(o => o.id === format)?.fileExtension}`
            }
          }
          return { ...job, status: 'processing', progress: newProgress }
        }
        return job
      }))
    }, 1000)
  }

  const addRecipient = () => {
    if (newRecipient.trim() && !recipients.includes(newRecipient.trim())) {
      setRecipients([...recipients, newRecipient.trim()])
      setNewRecipient('')
    }
  }

  const removeRecipient = (email: string) => {
    setRecipients(recipients.filter(r => r !== email))
  }

  const saveTemplate = () => {
    if (!templateName.trim()) return

    const newTemplate: ExportTemplate = {
      id: `template_${Date.now()}`,
      name: templateName.trim(),
      description: `Template de exportação em ${selectedFormat.toUpperCase()}`,
      fields: selectedFields,
      filters: [], // Seria integrado com os filtros ativos
      format: selectedFormat,
      schedule: recipients.length > 0 ? {
        frequency: scheduleFrequency,
        time: scheduleTime,
        recipients: [...recipients]
      } : undefined
    }

    const updatedTemplates = [...templates, newTemplate]
    saveTemplates(updatedTemplates)
    setTemplateName('')
    setShowTemplateDialog(false)
  }

  const loadTemplate = (template: ExportTemplate) => {
    setSelectedFormat(template.format)
    setSelectedFields(template.fields)
    if (template.schedule) {
      setRecipients(template.schedule.recipients)
      setScheduleFrequency(template.schedule.frequency)
      setScheduleTime(template.schedule.time)
    }
  }

  const deleteTemplate = (templateId: string) => {
    const updatedTemplates = templates.filter(t => t.id !== templateId)
    saveTemplates(updatedTemplates)
  }

  const selectedOption = EXPORT_OPTIONS.find(o => o.id === selectedFormat)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Exportação de Dados
        </CardTitle>
        <CardDescription>
          Exporte seus dados em múltiplos formatos com agendamento automático
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="export">Exportar</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-6">
            {/* Seleção de Formato */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Formato de Exportação</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {EXPORT_OPTIONS.map((option) => {
                  const Icon = option.icon
                  return (
                    <div
                      key={option.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedFormat === option.id
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedFormat(option.id)}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="h-5 w-5 text-primary" />
                        <span className="font-medium">{option.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {option.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {option.features.slice(0, 2).map((feature, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Configurações do Formato */}
            {selectedOption && (
              <div className="p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium mb-3">Configurações do {selectedOption.name}</h4>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm">Formato Específico</Label>
                    <Select defaultValue={selectedOption.formats[0]}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedOption.formats.map((format) => (
                          <SelectItem key={format} value={format}>
                            {format}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm">Orientação</Label>
                      <Select defaultValue="portrait">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="portrait">Retrato</SelectItem>
                          <SelectItem value="landscape">Paisagem</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm">Qualidade</Label>
                      <Select defaultValue="high">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">Alta</SelectItem>
                          <SelectItem value="medium">Média</SelectItem>
                          <SelectItem value="low">Baixa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Seleção de Campos */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Campos para Exportar</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {AVAILABLE_FIELDS.map((field) => {
                  const Icon = field.icon
                  const isSelected = selectedFields.includes(field.id)
                  return (
                    <div
                      key={field.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/30'
                      }`}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedFields(selectedFields.filter(f => f !== field.id))
                        } else {
                          setSelectedFields([...selectedFields, field.id])
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox checked={isSelected} />
                        <Icon className="h-4 w-4" />
                        <span className="text-sm">{field.label}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Agendamento e Envio */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-3">Agendamento e Envio</h4>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm mb-2 block">Destinatários (opcional)</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="email@exemplo.com"
                      value={newRecipient}
                      onChange={(e) => setNewRecipient(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addRecipient()}
                    />
                    <Button variant="outline" onClick={addRecipient}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {recipients.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {recipients.map((email) => (
                        <Badge key={email} variant="secondary" className="pr-1">
                          {email}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-1 h-4 w-4 p-0"
                            onClick={() => removeRecipient(email)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {recipients.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm">Frequência</Label>
                      <Select 
                        value={scheduleFrequency} 
                        onValueChange={(value) => setScheduleFrequency(value as 'daily' | 'weekly' | 'monthly')}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Diário</SelectItem>
                          <SelectItem value="weekly">Semanal</SelectItem>
                          <SelectItem value="monthly">Mensal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm">Horário</Label>
                      <Input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Ações */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => startExport(selectedFormat)}
                  disabled={selectedFields.length === 0}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Exportar Agora
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowTemplateDialog(true)}
                  disabled={selectedFields.length === 0}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Template
                </Button>
              </div>
              <Badge variant="secondary">
                {selectedFields.length} campos selecionados
              </Badge>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Templates Salvos</h3>
                <p className="text-sm text-muted-foreground">
                  Reutilize configurações de exportação frequentes
                </p>
              </div>
              <Button onClick={() => setShowTemplateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Template
              </Button>
            </div>

            {templates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum template salvo ainda</p>
                <p className="text-sm">Crie templates para reutilizar configurações</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {templates.map((template) => (
                  <div key={template.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{template.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {template.format.toUpperCase()}
                          </Badge>
                          {template.schedule && (
                            <Badge variant="secondary" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />                            {(() => {
                              switch (template.schedule.frequency) {
                                case 'daily': return 'Diário'
                                case 'weekly': return 'Semanal'
                                case 'monthly': return 'Mensal'
                                default: return 'Personalizado'
                              }
                            })()}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {template.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{template.fields.length} campos</span>
                          {template.schedule && (
                            <span>{template.schedule.recipients.length} destinatários</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => loadTemplate(template)}
                        >
                          Usar
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteTemplate(template.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Histórico de Exportações</h3>
              
              {exportJobs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Download className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma exportação realizada ainda</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {exportJobs.map((job) => (
                    <div key={job.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{job.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {job.format.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {job.status === 'completed' && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                          {job.status === 'processing' && (
                            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                          )}
                          {job.status === 'failed' && (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                        <span>
                          {format(job.createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </span>
                        {job.fileSize && (
                          <span>{job.fileSize}</span>
                        )}
                      </div>

                      {job.status === 'processing' && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Processando...</span>
                            <span>{Math.round(job.progress)}%</span>
                          </div>
                          <Progress value={job.progress} className="h-2" />
                        </div>
                      )}

                      {job.status === 'completed' && job.downloadUrl && (
                        <Button variant="outline" size="sm" className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Baixar Arquivo
                        </Button>
                      )}

                      {job.status === 'failed' && job.error && (
                        <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                          {job.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Dialog para salvar template */}
        {showTemplateDialog && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-background p-6 rounded-lg border max-w-md w-full">
              <h3 className="text-lg font-medium mb-4">Salvar Template</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="template-name">Nome do Template</Label>
                  <Input
                    id="template-name"
                    placeholder="Ex: Relatório Mensal de Vendas"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Configurações incluídas:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Formato: {selectedOption?.name}</li>
                    <li>Campos: {selectedFields.length} selecionados</li>
                    {recipients.length > 0 && (
                      <li>Agendamento: {scheduleFrequency} às {scheduleTime}</li>
                    )}
                  </ul>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={saveTemplate} disabled={!templateName.trim()}>
                    Salvar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
