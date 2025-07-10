"use client"

import { useState, useRef, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  X, 
  Copy, 
  Eye, 
  Settings, 
  Palette,
  Image,
  Video,
  FileText,
  Link2,
  Star,
  AlignLeft,
  AlignCenter,
  Bold,
  Italic,
  Underline,
  List,
  Calendar,
  Clock,
  Hash,
  AtSign,
  Phone
} from 'lucide-react'
import { CreateFormData, FormQuestion } from '@/hooks/use-google-forms'

interface FormBuilderProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateFormData) => Promise<void>
  loading?: boolean
}

interface FormSettings {
  collectEmail: boolean
  requireSignIn: boolean
  oneResponsePerPerson: boolean
  editAfterSubmit: boolean
  showProgressBar: boolean
  shuffleQuestions: boolean
  confirmationMessage: string
  theme: {
    primaryColor: string
    backgroundColor: string
    headerImage?: string
    font: string
  }
}

const questionTypes = [
  { value: 'text', label: 'Resposta curta', icon: AlignLeft },
  { value: 'textarea', label: 'Parágrafo', icon: AlignLeft },
  { value: 'radio', label: 'Múltipla escolha', icon: List },
  { value: 'checkbox', label: 'Caixas de seleção', icon: List },
  { value: 'dropdown', label: 'Lista suspensa', icon: List },
  { value: 'linear-scale', label: 'Escala linear', icon: Hash },
  { value: 'multiple-choice-grid', label: 'Grade de múltipla escolha', icon: Hash },
  { value: 'checkbox-grid', label: 'Grade de caixas de seleção', icon: Hash },
  { value: 'date', label: 'Data', icon: Calendar },
  { value: 'time', label: 'Hora', icon: Clock },
  { value: 'email', label: 'Email', icon: AtSign },
  { value: 'phone', label: 'Telefone', icon: Phone },
  { value: 'number', label: 'Número', icon: Hash },
  { value: 'file-upload', label: 'Upload de arquivo', icon: FileText },
  { value: 'rating', label: 'Avaliação por estrelas', icon: Star },
  { value: 'image', label: 'Escolha de imagem', icon: Image },
  { value: 'video', label: 'Vídeo', icon: Video }
]

const themes = [
  { name: 'Azul', primary: '#1976d2', background: '#f5f5f5' },
  { name: 'Verde', primary: '#388e3c', background: '#f1f8e9' },
  { name: 'Roxo', primary: '#7b1fa2', background: '#f3e5f5' },
  { name: 'Vermelho', primary: '#d32f2f', background: '#ffebee' },
  { name: 'Laranja', primary: '#f57c00', background: '#fff3e0' },
  { name: 'Escuro', primary: '#424242', background: '#fafafa' },
]

const fonts = [
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Roboto', value: 'Roboto, sans-serif' },
  { name: 'Open Sans', value: 'Open Sans, sans-serif' },
  { name: 'Lato', value: 'Lato, sans-serif' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif' }
]

export function FormBuilder({ open, onOpenChange, onSubmit, loading = false }: FormBuilderProps) {
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [questions, setQuestions] = useState<FormQuestion[]>([])
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState('questions')
  const [previewMode, setPreviewMode] = useState(false)
  const [settings, setSettings] = useState<FormSettings>({
    collectEmail: false,
    requireSignIn: false,
    oneResponsePerPerson: false,
    editAfterSubmit: false,
    showProgressBar: true,
    shuffleQuestions: false,
    confirmationMessage: 'Obrigado! Sua resposta foi registrada.',
    theme: {
      primaryColor: '#1976d2',
      backgroundColor: '#f5f5f5',
      font: 'Inter, sans-serif'
    }
  })

  const dragItem = useRef<number | null>(null)
  const dragOverItem = useRef<number | null>(null)

  const addQuestion = (type?: FormQuestion['type']) => {
    const newQuestion: FormQuestion = {
      id: Date.now().toString(),
      title: '',
      type: type || 'text',
      required: false,
      options: needsOptions(type || 'text') ? ['Opção 1'] : undefined,
      description: '',
      validation: {
        required: false
      },
      settings: {
        shuffleOptions: false,
        allowOther: false
      }
    }
    setQuestions([...questions, newQuestion])
    setEditingQuestion(questions.length)
  }

  const duplicateQuestion = (index: number) => {
    const questionToDuplicate = questions[index]
    const duplicatedQuestion = {
      ...questionToDuplicate,
      id: Date.now().toString(),
      title: questionToDuplicate.title + ' (cópia)'
    }
    const newQuestions = [...questions]
    newQuestions.splice(index + 1, 0, duplicatedQuestion)
    setQuestions(newQuestions)
  }

  const updateQuestion = (index: number, updates: Partial<FormQuestion>) => {
    setQuestions(questions.map((q, i) => i === index ? { ...q, ...updates } : q))
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
    setEditingQuestion(null)
  }

  const moveQuestion = (fromIndex: number, toIndex: number) => {
    const newQuestions = [...questions]
    const [movedQuestion] = newQuestions.splice(fromIndex, 1)
    newQuestions.splice(toIndex, 0, movedQuestion)
    setQuestions(newQuestions)
  }

  const handleDragStart = (index: number) => {
    dragItem.current = index
  }

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index
  }

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      moveQuestion(dragItem.current, dragOverItem.current)
    }
    dragItem.current = null
    dragOverItem.current = null
  }

  const addOption = (questionIndex: number) => {
    const question = questions[questionIndex]
    if (question.options) {
      updateQuestion(questionIndex, {
        options: [...question.options, `Opção ${question.options.length + 1}`]
      })
    } else {
      updateQuestion(questionIndex, { options: ['Opção 1'] })
    }
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const question = questions[questionIndex]
    if (question.options) {
      const newOptions = [...question.options]
      newOptions[optionIndex] = value
      updateQuestion(questionIndex, { options: newOptions })
    }
  }

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const question = questions[questionIndex]
    if (question.options && question.options.length > 1) {
      updateQuestion(questionIndex, {
        options: question.options.filter((_, i) => i !== optionIndex)
      })
    }
  }

  const addGridRow = (questionIndex: number) => {
    const question = questions[questionIndex]
    const currentRows = question.gridRows || ['Linha 1']
    updateQuestion(questionIndex, {
      gridRows: [...currentRows, `Linha ${currentRows.length + 1}`]
    })
  }

  const addGridColumn = (questionIndex: number) => {
    const question = questions[questionIndex]
    const currentCols = question.gridColumns || ['Coluna 1']
    updateQuestion(questionIndex, {
      gridColumns: [...currentCols, `Coluna ${currentCols.length + 1}`]
    })
  }

  const handleSubmit = async () => {
    if (!formTitle.trim()) return

    const formData: CreateFormData = {
      title: formTitle,
      description: formDescription || undefined,
      questions: questions.filter(q => q.title.trim()),
      settings
    }

    try {
      await onSubmit(formData)
      // Reset form
      setFormTitle('')
      setFormDescription('')
      setQuestions([])
      setEditingQuestion(null)
      setSettings({
        collectEmail: false,
        requireSignIn: false,
        oneResponsePerPerson: false,
        editAfterSubmit: false,
        showProgressBar: true,
        shuffleQuestions: false,
        confirmationMessage: 'Obrigado! Sua resposta foi registrada.',
        theme: {
          primaryColor: '#1976d2',
          backgroundColor: '#f5f5f5',
          font: 'Inter, sans-serif'
        }
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao criar formulário:', error)
    }
  }

  const needsOptions = (type: string) => ['radio', 'checkbox', 'dropdown', 'image'].includes(type)
  const needsGrid = (type: string) => ['multiple-choice-grid', 'checkbox-grid'].includes(type)
  const needsScale = (type: string) => ['linear-scale'].includes(type)
  const needsValidation = (type: string) => ['text', 'textarea', 'email', 'number', 'phone'].includes(type)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900">
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-zinc-100">
            Criar Novo Formulário
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações básicas */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título do Formulário *</Label>
              <Input
                id="title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Ex: Avaliação de Desempenho 2025"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Descreva o objetivo do formulário..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          {/* Perguntas */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Perguntas
              </h3>
              <Button onClick={() => addQuestion()} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Pergunta
              </Button>
            </div>

            {questions.map((question, index) => (
              <Card key={question.id} className="border border-zinc-200 dark:border-zinc-700">
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-zinc-400" />
                      <span className="text-sm text-zinc-500">Pergunta {index + 1}</span>
                      <div className="ml-auto flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingQuestion(editingQuestion === index ? null : index)}
                        >
                          {editingQuestion === index ? 'Concluir' : 'Editar'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuestion(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {editingQuestion === index ? (
                      <div className="space-y-4 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                        <div>
                          <Label>Título da Pergunta</Label>
                          <Input
                            value={question.title}
                            onChange={(e) => updateQuestion(index, { title: e.target.value })}
                            placeholder="Digite sua pergunta..."
                          />
                        </div>

                        <div>
                          <Label>Tipo de Resposta</Label>
                          <Select
                            value={question.type}
                            onValueChange={(value: FormQuestion['type']) => 
                              updateQuestion(index, { type: value, options: needsOptions(value) ? ['Opção 1'] : undefined })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {questionTypes.map(type => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`required-${index}`}
                            checked={question.required}
                            onCheckedChange={(checked) => updateQuestion(index, { required: checked })}
                          />
                          <Label htmlFor={`required-${index}`}>Pergunta obrigatória</Label>
                        </div>

                        {needsOptions(question.type) && (
                          <div>
                            <Label>Opções</Label>
                            <div className="space-y-2 mt-2">
                              {question.options?.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center gap-2">
                                  <Input
                                    value={option}
                                    onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                                    placeholder={`Opção ${optionIndex + 1}`}
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeOption(index, optionIndex)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addOption(index)}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Adicionar Opção
                              </Button>
                            </div>
                          </div>
                        )}

                        {needsGrid(question.type) && (
                          <div>
                            <Label>Grade</Label>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                              <div>
                                <Label>Linhas</Label>
                                <div className="space-y-2">
                                  {question.gridRows?.map((row, rowIndex) => (
                                    <div key={rowIndex} className="flex items-center gap-2">
                                      <Input
                                        value={row}
                                        onChange={(e) => updateQuestion(index, { gridRows: question.gridRows?.map((r, i) => i === rowIndex ? e.target.value : r) })}
                                        placeholder={`Linha ${rowIndex + 1}`}
                                      />
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeOption(index, rowIndex)}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addGridRow(index)}
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Adicionar Linha
                                  </Button>
                                </div>
                              </div>
                              <div>
                                <Label>Colunas</Label>
                                <div className="space-y-2">
                                  {question.gridColumns?.map((col, colIndex) => (
                                    <div key={colIndex} className="flex items-center gap-2">
                                      <Input
                                        value={col}
                                        onChange={(e) => updateQuestion(index, { gridColumns: question.gridColumns?.map((c, i) => i === colIndex ? e.target.value : c) })}
                                        placeholder={`Coluna ${colIndex + 1}`}
                                      />
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeOption(index, colIndex)}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addGridColumn(index)}
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Adicionar Coluna
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {needsScale(question.type) && (
                          <div>
                            <Label>Escala</Label>
                            <div className="flex items-center gap-2 mt-2">
                              <Input
                                type="number"
                                value={question.scaleMin || 1}
                                onChange={(e) => updateQuestion(index, { scaleMin: Number(e.target.value) })}
                                placeholder="Mínimo"
                                className="w-20"
                              />
                              <Input
                                type="number"
                                value={question.scaleMax || 10}
                                onChange={(e) => updateQuestion(index, { scaleMax: Number(e.target.value) })}
                                placeholder="Máximo"
                                className="w-20"
                              />
                            </div>
                          </div>
                        )}

                        {needsValidation(question.type) && (
                          <div>
                            <Label>Validação</Label>
                            <div className="flex items-center gap-2 mt-2">
                              <Input
                                type="text"
                                value={question.validation?.pattern || ''}
                                onChange={(e) => updateQuestion(index, { validation: { required: question.validation?.required || false, ...question.validation, pattern: e.target.value } })}
                                placeholder="Padrão (regex)"
                                className="flex-1"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">
                            {question.title || 'Pergunta sem título'}
                          </span>
                          {question.required && (
                            <Badge variant="secondary" className="text-xs">
                              Obrigatória
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-zinc-500">
                          Tipo: {questionTypes.find(t => t.value === question.type)?.label}
                        </p>
                        {question.options && question.options.length > 0 && (
                          <div className="text-sm text-zinc-600 dark:text-zinc-400">
                            Opções: {question.options.join(', ')}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Ações */}
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!formTitle.trim() || loading}
            >
              {loading ? 'Criando...' : 'Criar Formulário'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
