"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Clock, 
  Calendar, 
  Plus, 
  Edit,
  Trash2,
  Play,
  Pause,
  Mail,
  FileText,
  Users,
  Settings,
  Bell,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, addDays, addWeeks, addMonths, isAfter } from "date-fns"
import { ptBR } from "date-fns/locale"

type FrequencyType = 'daily' | 'weekly' | 'monthly' | 'quarterly'

interface ScheduledReport {
  id: string
  name: string
  description: string
  frequency: FrequencyType
  time: string
  dayOfWeek?: number // 0-6 para semanal
  dayOfMonth?: number // 1-31 para mensal
  enabled: boolean
  recipients: string[]
  reportType: string
  filters: any[]
  format: string
  lastRun?: Date
  nextRun: Date
  successCount: number
  failureCount: number
  createdAt: Date
  createdBy: string
}

interface ReportExecution {
  id: string
  reportId: string
  executedAt: Date
  status: 'success' | 'failed' | 'pending'
  duration: number
  fileSize?: string
  recipients: string[]
  error?: string
}

const REPORT_TYPES = [
  { value: 'sales', label: 'Relatório de Vendas', icon: FileText },
  { value: 'leads', label: 'Relatório de Leads', icon: Users },
  { value: 'performance', label: 'Performance da Equipe', icon: CheckCircle },
  { value: 'pipeline', label: 'Pipeline de Vendas', icon: Clock },
  { value: 'custom', label: 'Relatório Personalizado', icon: Settings }
]

const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Diário', description: 'Executado todos os dias no horário especificado' },
  { value: 'weekly', label: 'Semanal', description: 'Executado uma vez por semana' },
  { value: 'monthly', label: 'Mensal', description: 'Executado uma vez por mês' },
  { value: 'quarterly', label: 'Trimestral', description: 'Executado a cada 3 meses' }
]

const FORMAT_OPTIONS = [
  { value: 'pdf', label: 'PDF', description: 'Relatório formatado' },
  { value: 'excel', label: 'Excel', description: 'Planilha de dados' },
  { value: 'csv', label: 'CSV', description: 'Dados estruturados' }
]

const DAYS_OF_WEEK = [
  'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'
]

export function ScheduledReportsWidget() {
  const [reports, setReports] = useState<ScheduledReport[]>([])
  const [executions, setExecutions] = useState<ReportExecution[]>([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingReport, setEditingReport] = useState<ScheduledReport | null>(null)
  
  // Formulário
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'weekly' as FrequencyType,
    time: '09:00',
    dayOfWeek: 1,
    dayOfMonth: 1,
    recipients: [] as string[],
    reportType: 'sales',
    format: 'pdf'
  })
  const [newRecipient, setNewRecipient] = useState('')

  // Carregar dados salvos
  useEffect(() => {
    const savedReports = localStorage.getItem('crm_scheduled_reports')
    const savedExecutions = localStorage.getItem('crm_report_executions')
    
    if (savedReports) {
      try {
        const parsed = JSON.parse(savedReports).map((r: any) => ({
          ...r,
          lastRun: r.lastRun ? new Date(r.lastRun) : undefined,
          nextRun: new Date(r.nextRun),
          createdAt: new Date(r.createdAt)
        }))
        setReports(parsed)
      } catch (error) {
        console.error('Erro ao carregar relatórios agendados:', error)
      }
    }

    if (savedExecutions) {
      try {
        const parsed = JSON.parse(savedExecutions).map((e: any) => ({
          ...e,
          executedAt: new Date(e.executedAt)
        }))
        setExecutions(parsed)
      } catch (error) {
        console.error('Erro ao carregar execuções:', error)
      }
    }
  }, [])

  // Salvar dados
  const saveReports = (newReports: ScheduledReport[]) => {
    localStorage.setItem('crm_scheduled_reports', JSON.stringify(newReports))
    setReports(newReports)
  }

  const saveExecutions = (newExecutions: ReportExecution[]) => {
    localStorage.setItem('crm_report_executions', JSON.stringify(newExecutions))
    setExecutions(newExecutions)
  }

  // Calcular próxima execução
  const calculateNextRun = (frequency: FrequencyType, time: string, dayOfWeek?: number, dayOfMonth?: number): Date => {
    const now = new Date()
    const [hours, minutes] = time.split(':').map(Number)
    
    let nextRun = new Date()
    nextRun.setHours(hours, minutes, 0, 0)

    switch (frequency) {
      case 'daily':
        if (isAfter(now, nextRun)) {
          nextRun = addDays(nextRun, 1)
        }
        break
      case 'weekly':
        nextRun = addWeeks(nextRun, 1)
        if (dayOfWeek !== undefined) {
          const dayDiff = dayOfWeek - nextRun.getDay()
          nextRun = addDays(nextRun, dayDiff >= 0 ? dayDiff : dayDiff + 7)
        }
        break
      case 'monthly':
        nextRun = addMonths(nextRun, 1)
        if (dayOfMonth !== undefined) {
          nextRun.setDate(dayOfMonth)
        }
        break
      case 'quarterly':
        nextRun = addMonths(nextRun, 3)
        break
    }

    return nextRun
  }

  const addRecipient = () => {
    if (newRecipient.trim() && !formData.recipients.includes(newRecipient.trim())) {
      setFormData({
        ...formData,
        recipients: [...formData.recipients, newRecipient.trim()]
      })
      setNewRecipient('')
    }
  }

  const removeRecipient = (email: string) => {
    setFormData({
      ...formData,
      recipients: formData.recipients.filter(r => r !== email)
    })
  }

  const createReport = () => {
    if (!formData.name.trim() || formData.recipients.length === 0) return

    const newReport: ScheduledReport = {
      id: editingReport?.id || `report_${Date.now()}`,
      name: formData.name.trim(),
      description: formData.description.trim(),
      frequency: formData.frequency,
      time: formData.time,
      dayOfWeek: formData.frequency === 'weekly' ? formData.dayOfWeek : undefined,
      dayOfMonth: formData.frequency === 'monthly' ? formData.dayOfMonth : undefined,
      enabled: true,
      recipients: [...formData.recipients],
      reportType: formData.reportType,
      filters: [],
      format: formData.format,
      nextRun: calculateNextRun(formData.frequency, formData.time, formData.dayOfWeek, formData.dayOfMonth),
      successCount: 0,
      failureCount: 0,
      createdAt: editingReport?.createdAt || new Date(),
      createdBy: 'Usuário Atual'
    }

    let updatedReports
    if (editingReport) {
      updatedReports = reports.map(r => r.id === editingReport.id ? newReport : r)
    } else {
      updatedReports = [...reports, newReport]
    }

    saveReports(updatedReports)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      frequency: 'weekly',
      time: '09:00',
      dayOfWeek: 1,
      dayOfMonth: 1,
      recipients: [],
      reportType: 'sales',
      format: 'pdf'
    })
    setNewRecipient('')
    setShowCreateDialog(false)
    setEditingReport(null)
  }

  const editReport = (report: ScheduledReport) => {
    setFormData({
      name: report.name,
      description: report.description,
      frequency: report.frequency,
      time: report.time,
      dayOfWeek: report.dayOfWeek || 1,
      dayOfMonth: report.dayOfMonth || 1,
      recipients: [...report.recipients],
      reportType: report.reportType,
      format: report.format
    })
    setEditingReport(report)
    setShowCreateDialog(true)
  }

  const deleteReport = (reportId: string) => {
    const updatedReports = reports.filter(r => r.id !== reportId)
    saveReports(updatedReports)
  }

  const toggleReport = (reportId: string) => {
    const updatedReports = reports.map(r => 
      r.id === reportId ? { ...r, enabled: !r.enabled } : r
    )
    saveReports(updatedReports)
  }

  const runReportNow = (report: ScheduledReport) => {
    const execution: ReportExecution = {
      id: `exec_${Date.now()}`,
      reportId: report.id,
      executedAt: new Date(),
      status: 'pending',
      duration: 0,
      recipients: [...report.recipients]
    }

    const newExecutions = [execution, ...executions]
    saveExecutions(newExecutions)

    // Simular execução
    setTimeout(() => {
      const updatedExecution = {
        ...execution,
        status: Math.random() > 0.1 ? 'success' : 'failed' as 'success' | 'failed',
        duration: Math.floor(Math.random() * 30000) + 5000,
        fileSize: `${Math.floor(Math.random() * 2000) + 500}KB`
      }

      if (updatedExecution.status === 'failed') {
        updatedExecution.error = 'Erro na conexão com o banco de dados'
      }

      const finalExecutions = newExecutions.map(e => 
        e.id === execution.id ? updatedExecution : e
      )
      saveExecutions(finalExecutions)

      // Atualizar contadores do relatório
      const updatedReports = reports.map(r => {
        if (r.id === report.id) {
          return {
            ...r,
            lastRun: new Date(),
            successCount: updatedExecution.status === 'success' ? r.successCount + 1 : r.successCount,
            failureCount: updatedExecution.status === 'failed' ? r.failureCount + 1 : r.failureCount
          }
        }
        return r
      })
      saveReports(updatedReports)
    }, 3000)
  }

  const getStatusColor = (enabled: boolean, lastRun?: Date) => {
    if (!enabled) return 'text-gray-500'
    if (!lastRun) return 'text-blue-500'
    
    const daysSinceLastRun = Math.floor((Date.now() - lastRun.getTime()) / (1000 * 60 * 60 * 24))
    if (daysSinceLastRun > 7) return 'text-red-500'
    if (daysSinceLastRun > 3) return 'text-yellow-500'
    return 'text-green-500'
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Relatórios Agendados
        </CardTitle>
        <CardDescription>
          Configure relatórios automáticos com agendamento personalizado
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
            <TabsTrigger value="executions">Execuções</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Relatórios Configurados</h3>
                <p className="text-sm text-muted-foreground">
                  {reports.filter(r => r.enabled).length} de {reports.length} relatórios ativos
                </p>
              </div>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Relatório
              </Button>
            </div>

            {reports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum relatório agendado ainda</p>
                <p className="text-sm">Crie seu primeiro relatório automático</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((report) => (
                  <div key={report.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{report.name}</h4>
                          <Badge variant={report.enabled ? "default" : "secondary"}>
                            {report.enabled ? 'Ativo' : 'Inativo'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {FREQUENCY_OPTIONS.find(f => f.value === report.frequency)?.label}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {FORMAT_OPTIONS.find(f => f.value === report.format)?.label}
                          </Badge>
                        </div>
                        
                        {report.description && (
                          <p className="text-sm text-muted-foreground mb-3">
                            {report.description}
                          </p>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Próxima execução:</span>
                            <div className="font-medium">
                              {format(report.nextRun, "dd/MM/yyyy", { locale: ptBR })}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              às {report.time}
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-muted-foreground">Destinatários:</span>
                            <div className="font-medium">{report.recipients.length}</div>
                          </div>
                          
                          <div>
                            <span className="text-muted-foreground">Sucessos:</span>
                            <div className="font-medium text-green-600">{report.successCount}</div>
                          </div>
                          
                          <div>
                            <span className="text-muted-foreground">Falhas:</span>
                            <div className="font-medium text-red-600">{report.failureCount}</div>
                          </div>
                        </div>

                        {report.lastRun && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            Última execução: {format(report.lastRun, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => runReportNow(report)}
                          disabled={!report.enabled}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editReport(report)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleReport(report.id)}
                        >
                          {report.enabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteReport(report.id)}
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

          <TabsContent value="executions" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Histórico de Execuções</h3>
              
              {executions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma execução registrada</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {executions.slice(0, 10).map((execution) => {
                    const report = reports.find(r => r.id === execution.reportId)
                    return (
                      <div key={execution.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{report?.name || 'Relatório Removido'}</span>
                            {execution.status === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                            {execution.status === 'failed' && <AlertCircle className="h-4 w-4 text-red-500" />}
                            {execution.status === 'pending' && (
                              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {format(execution.executedAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Duração:</span>
                            <div>{execution.duration ? `${Math.round(execution.duration / 1000)}s` : '-'}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Tamanho:</span>
                            <div>{execution.fileSize || '-'}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Destinatários:</span>
                            <div>{execution.recipients.length}</div>
                          </div>
                        </div>

                        {execution.error && (
                          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                            {execution.error}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Templates de relatórios em desenvolvimento</p>
              <p className="text-sm">Em breve você poderá criar templates reutilizáveis</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Dialog para criar/editar relatório */}
        {showCreateDialog && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-background p-6 rounded-lg border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-medium mb-4">
                {editingReport ? 'Editar Relatório' : 'Novo Relatório Agendado'}
              </h3>
              
              <div className="space-y-4">
                {/* Informações básicas */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="report-name">Nome do Relatório</Label>
                    <Input
                      id="report-name"
                      placeholder="Ex: Relatório Semanal de Vendas"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="report-type">Tipo de Relatório</Label>
                    <Select value={formData.reportType} onValueChange={(value) => setFormData({ ...formData, reportType: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {REPORT_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Input
                    id="description"
                    placeholder="Descreva o propósito deste relatório"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* Agendamento */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Frequência</Label>
                    <Select value={formData.frequency} onValueChange={(value) => setFormData({ ...formData, frequency: value as FrequencyType })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FREQUENCY_OPTIONS.map((freq) => (
                          <SelectItem key={freq.value} value={freq.value}>
                            {freq.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Horário</Label>
                    <Input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label>Formato</Label>
                    <Select value={formData.format} onValueChange={(value) => setFormData({ ...formData, format: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FORMAT_OPTIONS.map((format) => (
                          <SelectItem key={format.value} value={format.value}>
                            {format.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Configurações específicas da frequência */}
                {formData.frequency === 'weekly' && (
                  <div>
                    <Label>Dia da Semana</Label>
                    <Select value={formData.dayOfWeek.toString()} onValueChange={(value) => setFormData({ ...formData, dayOfWeek: parseInt(value) })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DAYS_OF_WEEK.map((day, index) => (
                          <SelectItem key={index} value={index.toString()}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.frequency === 'monthly' && (
                  <div>
                    <Label>Dia do Mês</Label>
                    <Select value={formData.dayOfMonth.toString()} onValueChange={(value) => setFormData({ ...formData, dayOfMonth: parseInt(value) })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                          <SelectItem key={day} value={day.toString()}>
                            Dia {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Destinatários */}
                <div>
                  <Label className="mb-2 block">Destinatários</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="email@exemplo.com"
                      value={newRecipient}
                      onChange={(e) => setNewRecipient(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addRecipient()}
                    />
                    <Button type="button" variant="outline" onClick={addRecipient}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.recipients.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.recipients.map((email) => (
                        <Badge key={email} variant="secondary" className="pr-1">
                          {email}
                          <Button
                            type="button"
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

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={createReport}
                    disabled={!formData.name.trim() || formData.recipients.length === 0}
                  >
                    {editingReport ? 'Atualizar' : 'Criar'} Relatório
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
