"use client"

import '../../styles/google-forms-builder.css'

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
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
  Phone,
  Upload,
  Grid3X3,
  BarChart3,
  Type,
  ListChecks,
  ChevronDown,
  Scale,
  Table,
  ImageIcon,
  PlayCircle,
  Paperclip,
  StarIcon,
  CheckSquare,
  Circle,
  Square,
  Menu,
  Send,
  Share,
  MoreVertical,
  Undo2,
  Redo2,
  Save,
  ExternalLink,
  Download,
  Code,
  Paintbrush,
  Monitor,
  Smartphone,
  Tablet,
  Maximize,
  Minimize,
  HelpCircle,
  Info
} from 'lucide-react'
import { CreateFormData, FormQuestion } from '@/hooks/use-google-forms'

interface GoogleFormsBuilderProps {
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
  allowResponseEdits: boolean
  limitResponses: boolean
  maxResponses: number
  acceptingResponses: boolean
  publishSummary: boolean
  theme: {
    primaryColor: string
    backgroundColor: string
    headerImage?: string
    font: string
    headerType: 'color' | 'image'
  }
}

interface ExtendedFormQuestion extends FormQuestion {
  section?: string
}

const questionTypes = [
  { 
    value: 'text', 
    label: 'Resposta curta', 
    icon: Type, 
    description: 'Uma linha de texto',
    category: 'text'
  },
  { 
    value: 'textarea', 
    label: 'Parágrafo', 
    icon: AlignLeft, 
    description: 'Texto longo',
    category: 'text'
  },
  { 
    value: 'radio', 
    label: 'Múltipla escolha', 
    icon: Circle, 
    description: 'Escolha uma opção',
    category: 'choice'
  },
  { 
    value: 'checkbox', 
    label: 'Caixas de seleção', 
    icon: CheckSquare, 
    description: 'Várias opções possíveis',
    category: 'choice'
  },
  { 
    value: 'dropdown', 
    label: 'Lista suspensa', 
    icon: ChevronDown, 
    description: 'Menu dropdown',
    category: 'choice'
  },
  { 
    value: 'linear-scale', 
    label: 'Escala linear', 
    icon: Scale, 
    description: 'Escala numérica (1-10)',
    category: 'scale'
  },
  { 
    value: 'multiple-choice-grid', 
    label: 'Grade múltipla escolha', 
    icon: Table, 
    description: 'Matriz de opções',
    category: 'grid'
  },
  { 
    value: 'checkbox-grid', 
    label: 'Grade de caixas', 
    icon: Grid3X3, 
    description: 'Matriz de checkboxes',
    category: 'grid'
  },
  { 
    value: 'date', 
    label: 'Data', 
    icon: Calendar, 
    description: 'Seletor de data',
    category: 'date'
  },
  { 
    value: 'time', 
    label: 'Hora', 
    icon: Clock, 
    description: 'Seletor de hora',
    category: 'date'
  },
  { 
    value: 'email', 
    label: 'Email', 
    icon: AtSign, 
    description: 'Endereço de email',
    category: 'input'
  },
  { 
    value: 'phone', 
    label: 'Telefone', 
    icon: Phone, 
    description: 'Número de telefone',
    category: 'input'
  },
  { 
    value: 'number', 
    label: 'Número', 
    icon: Hash, 
    description: 'Valor numérico',
    category: 'input'
  },
  { 
    value: 'file-upload', 
    label: 'Upload de arquivo', 
    icon: Upload, 
    description: 'Envio de arquivos',
    category: 'upload'
  },
  { 
    value: 'rating', 
    label: 'Avaliação', 
    icon: Star, 
    description: 'Classificação por estrelas',
    category: 'scale'
  },
  { 
    value: 'image-choice', 
    label: 'Escolha de imagem', 
    icon: ImageIcon, 
    description: 'Seleção visual com imagens',
    category: 'media'
  },
  { 
    value: 'video', 
    label: 'Vídeo', 
    icon: PlayCircle, 
    description: 'Incorporar vídeo do YouTube',
    category: 'media'
  },
  { 
    value: 'section', 
    label: 'Quebra de seção', 
    icon: Menu, 
    description: 'Dividir formulário em seções',
    category: 'layout'
  }
]

const themes = [
  { name: 'Padrão', primary: '#673ab7', background: '#f8f9fa', headerBg: '#673ab7' },
  { name: 'Azul', primary: '#1976d2', background: '#f5f5f5', headerBg: '#1976d2' },
  { name: 'Verde', primary: '#388e3c', background: '#f1f8e9', headerBg: '#388e3c' },
  { name: 'Vermelho', primary: '#d32f2f', background: '#ffebee', headerBg: '#d32f2f' },
  { name: 'Laranja', primary: '#f57c00', background: '#fff3e0', headerBg: '#f57c00' },
  { name: 'Rosa', primary: '#e91e63', background: '#fce4ec', headerBg: '#e91e63' },
  { name: 'Turquesa', primary: '#00acc1', background: '#e0f2f1', headerBg: '#00acc1' },
  { name: 'Escuro', primary: '#424242', background: '#fafafa', headerBg: '#424242' },
]

const fonts = [
  { name: 'Basic', value: 'Roboto, sans-serif' },
  { name: 'Decorative', value: 'Playfair Display, serif' },
  { name: 'Formal', value: 'Times New Roman, serif' },
  { name: 'Playful', value: 'Comic Sans MS, cursive' },
]

const headerImages = [
  { name: 'Nenhuma', url: null },
  { name: 'Abstrato', url: '/images/header-abstract.jpg' },
  { name: 'Natureza', url: '/images/header-nature.jpg' },
  { name: 'Geométrico', url: '/images/header-geometric.jpg' },
  { name: 'Minimalista', url: '/images/header-minimal.jpg' },
]

export function GoogleFormsBuilder({ 
  open, 
  onOpenChange, 
  onSubmit, 
  loading = false 
}: GoogleFormsBuilderProps) {
  // Estados principais
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [questions, setQuestions] = useState<ExtendedFormQuestion[]>([])
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  
  // Estados do sidebar
  const [sidebarView, setSidebarView] = useState<'questions' | 'themes' | 'settings'>('questions')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  
  // Estados de configurações
  const [settings, setSettings] = useState<FormSettings>({
    collectEmail: false,
    requireSignIn: false,
    oneResponsePerPerson: false,
    editAfterSubmit: false,
    showProgressBar: false,
    shuffleQuestions: false,
    confirmationMessage: 'Sua resposta foi enviada.',
    allowResponseEdits: false,
    limitResponses: false,
    maxResponses: 100,
    acceptingResponses: true,
    publishSummary: false,
    theme: {
      primaryColor: '#673ab7',
      backgroundColor: '#f8f9fa',
      headerImage: undefined,
      font: 'Roboto, sans-serif',
      headerType: 'color'
    }
  })
  
  // Estados de UI
  const [draggedQuestion, setDraggedQuestion] = useState<string | null>(null)
  const [showQuestionMenu, setShowQuestionMenu] = useState<string | null>(null)
  const [undoStack, setUndoStack] = useState<ExtendedFormQuestion[][]>([])
  const [redoStack, setRedoStack] = useState<ExtendedFormQuestion[][]>([])
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  // Funcionalidades de Undo/Redo
  const saveToUndoStack = () => {
    setUndoStack(stack => [...stack.slice(-19), [...questions]])
    setRedoStack([])
  }

  const undo = () => {
    if (undoStack.length > 0) {
      setRedoStack(stack => [questions, ...stack.slice(0, 19)])
      setQuestions(undoStack[undoStack.length - 1])
      setUndoStack(stack => stack.slice(0, -1))
    }
  }

  const redo = () => {
    if (redoStack.length > 0) {
      setUndoStack(stack => [...stack.slice(-19), questions])
      setQuestions(redoStack[0])
      setRedoStack(stack => stack.slice(1))
    }
  }

  // Gerenciamento de perguntas
  const addQuestion = (type: string = 'text', afterIndex?: number) => {
    saveToUndoStack()
    
    const newQuestion: ExtendedFormQuestion = {
      id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: type as FormQuestion['type'],
      title: '',
      description: '',
      required: false,
      options: type === 'radio' || type === 'checkbox' || type === 'dropdown' ? ['Opção 1'] : undefined,
      validation: {
        required: false
      },
      settings: {
        shuffleOptions: false,
        allowOther: false
      }
    }
    
    if (afterIndex !== undefined) {
      const newQuestions = [...questions]
      newQuestions.splice(afterIndex + 1, 0, newQuestion)
      setQuestions(newQuestions)
    } else {
      setQuestions([...questions, newQuestion])
    }
    
    setEditingQuestion(newQuestion.id)
  }

  const updateQuestion = (id: string, updates: Partial<ExtendedFormQuestion>) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, ...updates } : q
    ))
  }

  const deleteQuestion = (id: string) => {
    saveToUndoStack()
    setQuestions(questions.filter(q => q.id !== id))
    setEditingQuestion(null)
  }

  const duplicateQuestion = (id: string) => {
    saveToUndoStack()
    const question = questions.find(q => q.id === id)
    if (question) {
      const newQuestion = {
        ...question,
        id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: `${question.title} (cópia)`
      }
      const index = questions.findIndex(q => q.id === id)
      const newQuestions = [...questions]
      newQuestions.splice(index + 1, 0, newQuestion)
      setQuestions(newQuestions)
    }
  }

  const moveQuestion = (fromIndex: number, toIndex: number) => {
    saveToUndoStack()
    const newQuestions = [...questions]
    const [movedQuestion] = newQuestions.splice(fromIndex, 1)
    newQuestions.splice(toIndex, 0, movedQuestion)
    setQuestions(newQuestions)
  }

  // Gerenciamento de opções
  const addOption = (questionId: string) => {
    const question = questions.find(q => q.id === questionId)
    if (question && question.options) {
      updateQuestion(questionId, {
        options: [...question.options, `Opção ${question.options.length + 1}`]
      })
    }
  }

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const question = questions.find(q => q.id === questionId)
    if (question && question.options) {
      const newOptions = [...question.options]
      newOptions[optionIndex] = value
      updateQuestion(questionId, { options: newOptions })
    }
  }

  const deleteOption = (questionId: string, optionIndex: number) => {
    const question = questions.find(q => q.id === questionId)
    if (question && question.options && question.options.length > 1) {
      const newOptions = question.options.filter((_, index) => index !== optionIndex)
      updateQuestion(questionId, { options: newOptions })
    }
  }

  // Filtros de categoria
  const filteredQuestionTypes = selectedCategory === 'all' 
    ? questionTypes 
    : questionTypes.filter(type => type.category === selectedCategory)

  const categories = [
    { value: 'all', label: 'Todos' },
    { value: 'text', label: 'Texto' },
    { value: 'choice', label: 'Escolha' },
    { value: 'scale', label: 'Escala' },
    { value: 'grid', label: 'Grade' },
    { value: 'date', label: 'Data/Hora' },
    { value: 'input', label: 'Entrada' },
    { value: 'upload', label: 'Upload' },
    { value: 'media', label: 'Mídia' },
    { value: 'layout', label: 'Layout' }
  ]

  // Submissão do formulário
  const handleSubmit = async () => {
    if (!formTitle.trim()) return
    
    const formData: CreateFormData = {
      title: formTitle,
      description: formDescription,
      questions: questions.map(q => ({
        id: q.id,
        type: q.type,
        title: q.title,
        description: q.description,
        required: q.validation?.required || false,
        options: q.options,
        validation: q.validation,
        settings: q.settings
      })),
      settings: {
        collectEmail: settings.collectEmail,
        requireSignIn: settings.requireSignIn,
        oneResponsePerPerson: settings.oneResponsePerPerson,
        editAfterSubmit: settings.editAfterSubmit,
        showProgressBar: settings.showProgressBar,
        shuffleQuestions: settings.shuffleQuestions,
        confirmationMessage: settings.confirmationMessage,
        theme: settings.theme
      }
    }
    
    await onSubmit(formData)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault()
          undo()
        } else if (e.key === 'z' && e.shiftKey || e.key === 'y') {
          e.preventDefault()
          redo()
        } else if (e.key === 's') {
          e.preventDefault()
          handleSubmit()
        }
      }
    }

    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, undoStack, redoStack, questions])

  // Render da pergunta no editor
  const renderQuestionEditor = (question: ExtendedFormQuestion) => {
    const isEditing = editingQuestion === question.id
    const questionType = questionTypes.find(t => t.value === question.type)

    return (
      <Card 
        key={question.id} 
        className={`group transition-all duration-200 forms-builder-question-border forms-builder-font ${
          isEditing 
            ? 'ring-2 ring-blue-500 shadow-lg' 
            : 'hover:shadow-md'
        }`}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Drag Handle */}
            <div className="flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="cursor-grab active:cursor-grabbing"
                draggable
                onDragStart={() => setDraggedQuestion(question.id)}
              >
                <GripVertical className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground">
                {questions.findIndex(q => q.id === question.id) + 1}
              </span>
            </div>

            {/* Question Content */}
            <div className="flex-1 space-y-4">
              {/* Question Header */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  {questionType && <questionType.icon className="h-4 w-4" />}
                  <Badge variant="outline" className="text-xs">
                    {questionType?.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingQuestion(isEditing ? null : question.id)}
                    className="h-8 w-8 p-0"
                  >
                    {isEditing ? <X className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => duplicateQuestion(question.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteQuestion(question.id)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Question Title and Description */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Título da pergunta"
                    value={question.title}
                    onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
                    className="text-lg font-medium border-none bg-transparent p-0 focus:ring-0"
                  />
                  {question.validation?.required && (
                    <span className="text-red-500 text-lg">*</span>
                  )}
                </div>
                <Textarea
                  placeholder="Descrição (opcional)"
                  value={question.description}
                  onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
                  className="border-none bg-transparent p-0 resize-none focus:ring-0 text-sm"
                  rows={1}
                />
              </div>

              {/* Question Options */}
              {renderQuestionOptions(question)}

              {/* Question Settings */}
              {isEditing && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Configurações da pergunta</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingQuestion(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`required-${question.id}`}
                        checked={question.validation?.required || false}
                        onCheckedChange={(checked) => 
                          updateQuestion(question.id, {
                            validation: { 
                              ...question.validation, 
                              required: checked 
                            }
                          })
                        }
                      />
                      <Label htmlFor={`required-${question.id}`} className="text-sm">
                        Obrigatória
                      </Label>
                    </div>
                    
                    {(question.type === 'radio' || question.type === 'checkbox') && (
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`shuffle-${question.id}`}
                          checked={question.settings?.shuffleOptions || false}
                          onCheckedChange={(checked) => 
                            updateQuestion(question.id, {
                              settings: { ...question.settings, shuffleOptions: checked }
                            })
                          }
                        />
                        <Label htmlFor={`shuffle-${question.id}`} className="text-sm">
                          Embaralhar opções
                        </Label>
                      </div>
                    )}
                  </div>

                  {/* Validação avançada */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Validação</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {question.type === 'text' && (
                        <>
                          <div>
                            <Label htmlFor={`min-length-${question.id}`} className="text-xs">
                              Mín. caracteres
                            </Label>
                            <Input
                              id={`min-length-${question.id}`}
                              type="number"
                              placeholder="0"
                              value={question.validation?.minLength || ''}
                              onChange={(e) => 
                                updateQuestion(question.id, {
                                  validation: { 
                                    required: question.validation?.required || false,
                                    minLength: parseInt(e.target.value) || undefined 
                                  }
                                })
                              }
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`max-length-${question.id}`} className="text-xs">
                              Máx. caracteres
                            </Label>
                            <Input
                              id={`max-length-${question.id}`}
                              type="number"
                              placeholder="∞"
                              value={question.validation?.maxLength || ''}
                              onChange={(e) => 
                                updateQuestion(question.id, {
                                  validation: { 
                                    required: question.validation?.required || false,
                                    maxLength: parseInt(e.target.value) || undefined 
                                  }
                                })
                              }
                              className="h-8"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Render das opções da pergunta
  const renderQuestionOptions = (question: ExtendedFormQuestion) => {
    switch (question.type) {
      case 'text':
        return (
          <div className="mt-4">
            <Input
              placeholder="Resposta curta"
              disabled
              className="max-w-md"
            />
          </div>
        )

      case 'textarea':
        return (
          <div className="mt-4">
            <Textarea
              placeholder="Resposta longa"
              disabled
              className="max-w-md"
              rows={3}
            />
          </div>
        )

      case 'radio':
        return (
          <div className="mt-4 space-y-2">
            <RadioGroup disabled>
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                  <Input
                    value={option}
                    onChange={(e) => updateOption(question.id, index, e.target.value)}
                    className="flex-1 border-none bg-transparent p-0 focus:ring-0"
                    placeholder={`Opção ${index + 1}`}
                  />
                  {question.options && question.options.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteOption(question.id, index)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </RadioGroup>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => addOption(question.id)}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar opção
            </Button>
          </div>
        )

      case 'checkbox':
        return (
          <div className="mt-4 space-y-2">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox disabled />
                <Input
                  value={option}
                  onChange={(e) => updateOption(question.id, index, e.target.value)}
                  className="flex-1 border-none bg-transparent p-0 focus:ring-0"
                  placeholder={`Opção ${index + 1}`}
                />
                {question.options && question.options.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteOption(question.id, index)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => addOption(question.id)}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar opção
            </Button>
          </div>
        )

      case 'dropdown':
        return (
          <div className="mt-4">
            <Select disabled>
              <SelectTrigger className="max-w-md">
                <SelectValue placeholder="Escolha uma opção" />
              </SelectTrigger>
              <SelectContent>
                {question.options?.map((option, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-4 space-y-2">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={option}
                    onChange={(e) => updateOption(question.id, index, e.target.value)}
                    className="flex-1"
                    placeholder={`Opção ${index + 1}`}
                  />
                  {question.options && question.options.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteOption(question.id, index)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => addOption(question.id)}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar opção
              </Button>
            </div>
          </div>
        )

      case 'linear-scale':
        return (
          <div className="mt-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm">1</span>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map(num => (
                  <div key={num} className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-sm">
                    {num}
                  </div>
                ))}
              </div>
              <span className="text-sm">5</span>
            </div>
          </div>
        )

      case 'date':
        return (
          <div className="mt-4">
            <Input
              type="date"
              disabled
              className="max-w-md"
            />
          </div>
        )

      case 'time':
        return (
          <div className="mt-4">
            <Input
              type="time"
              disabled
              className="max-w-md"
            />
          </div>
        )

      case 'email':
        return (
          <div className="mt-4">
            <Input
              type="email"
              placeholder="exemplo@email.com"
              disabled
              className="max-w-md"
            />
          </div>
        )

      case 'phone':
        return (
          <div className="mt-4">
            <Input
              type="tel"
              placeholder="(00) 00000-0000"
              disabled
              className="max-w-md"
            />
          </div>
        )

      case 'number':
        return (
          <div className="mt-4">
            <Input
              type="number"
              placeholder="0"
              disabled
              className="max-w-md"
            />
          </div>
        )

      case 'file-upload':
        return (
          <div className="mt-4 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">
              Clique para fazer upload ou arraste arquivos aqui
            </p>
          </div>
        )

      case 'rating':
        return (
          <div className="mt-4">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map(num => (
                <Star key={num} className="h-6 w-6 text-gray-300" />
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl w-full h-[90vh] flex flex-col p-0 bg-gray-900 border-gray-700 text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900 text-white">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-white">
              {formTitle || 'Formulário sem título'}
            </h2>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={undo}
                disabled={undoStack.length === 0}
                title="Desfazer (Ctrl+Z)"
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <Undo2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={redo}
                disabled={redoStack.length === 0}
                title="Refazer (Ctrl+Y)"
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <Redo2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 bg-gray-800 border border-gray-700 rounded-lg p-1">
              <Button
                variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('desktop')}
                className="h-8 w-8 p-0 text-gray-300 hover:text-white data-[state=active]:bg-gray-700"
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('tablet')}
                className="h-8 w-8 p-0 text-gray-300 hover:text-white data-[state=active]:bg-gray-700"
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('mobile')}
                className="h-8 w-8 p-0 text-gray-300 hover:text-white data-[state=active]:bg-gray-700"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            >
              <Eye className="h-4 w-4 mr-2" />
              {previewMode ? 'Editar' : 'Visualizar'}
            </Button>
            
            <Button
              onClick={handleSubmit}
              disabled={!formTitle.trim() || loading}
              className="bg-purple-600 hover:bg-purple-700 text-white border-0"
            >
              {loading ? 'Criando...' : 'Criar Formulário'}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          {!previewMode && (
            <div className="w-80 bg-gray-900 border-r border-gray-700 overflow-y-auto text-white">
              <div className="p-4">
                <Tabs value={sidebarView} onValueChange={(value) => setSidebarView(value as typeof sidebarView)}>
                  <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
                    <TabsTrigger value="questions" className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white">Perguntas</TabsTrigger>
                    <TabsTrigger value="themes" className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white">Temas</TabsTrigger>
                    <TabsTrigger value="settings" className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white">Config</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="questions" className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block text-gray-300">
                        Filtrar por categoria
                      </Label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          {categories.map(category => (
                            <SelectItem key={category.value} value={category.value} className="hover:bg-gray-700">
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2">
                      {filteredQuestionTypes.map(questionType => (
                        <Button
                          key={questionType.value}
                          variant="outline"
                          className="justify-start h-auto p-4 text-left bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                          onClick={() => addQuestion(questionType.value)}
                        >
                          <div className="flex items-center space-x-3">
                            <questionType.icon className="h-5 w-5" />
                            <div>
                              <div className="font-medium">{questionType.label}</div>
                              <div className="text-xs text-gray-400">
                                {questionType.description}
                              </div>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="themes" className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block text-gray-300">
                        Temas predefinidos
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        {themes.map(theme => (
                          <Button
                            key={theme.name}
                            variant={settings.theme.primaryColor === theme.primary ? 'default' : 'outline'}
                            className="h-12 flex flex-col items-center justify-center bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                            onClick={() => setSettings(prev => ({
                              ...prev,
                              theme: {
                                ...prev.theme,
                                primaryColor: theme.primary,
                                backgroundColor: theme.background
                              }
                            }))}
                          >
                            <div 
                              className="w-4 h-4 rounded mb-1 border border-gray-600"
                              style={{ backgroundColor: theme.primary }}
                            />
                            <span className="text-xs">{theme.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium mb-2 block text-gray-300">
                        Cor personalizada
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="color"
                          value={settings.theme.primaryColor}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            theme: {
                              ...prev.theme,
                              primaryColor: e.target.value
                            }
                          }))}
                          className="w-12 h-8 p-0 border-gray-700 bg-gray-800 cursor-pointer"
                        />
                        <Input
                          value={settings.theme.primaryColor}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            theme: {
                              ...prev.theme,
                              primaryColor: e.target.value
                            }
                          }))}
                          className="flex-1 text-xs bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium mb-2 block text-gray-300">
                        Fonte
                      </Label>
                      <Select 
                        value={settings.theme.font} 
                        onValueChange={(value) => setSettings(prev => ({
                          ...prev,
                          theme: {
                            ...prev.theme,
                            font: value
                          }
                        }))}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          {fonts.map(font => (
                            <SelectItem key={font.value} value={font.value} className="hover:bg-gray-700">
                              {font.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="settings" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium mb-2 block text-gray-300">
                          Coleta de dados
                        </Label>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                            <Label htmlFor="collect-email" className="text-sm text-gray-300">
                              Coletar endereços de email
                            </Label>
                            <Switch
                              id="collect-email"
                              checked={settings.collectEmail}
                              onCheckedChange={(checked) => setSettings(prev => ({
                                ...prev,
                                collectEmail: checked
                              }))}
                            />
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                            <Label htmlFor="require-signin" className="text-sm text-gray-300">
                              Exigir login
                            </Label>
                            <Switch
                              id="require-signin"
                              checked={settings.requireSignIn}
                              onCheckedChange={(checked) => setSettings(prev => ({
                                ...prev,
                                requireSignIn: checked
                              }))}
                            />
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                            <Label htmlFor="one-response" className="text-sm text-gray-300">
                              Limitar a uma resposta por pessoa
                            </Label>
                            <Switch
                              id="one-response"
                              checked={settings.oneResponsePerPerson}
                              onCheckedChange={(checked) => setSettings(prev => ({
                                ...prev,
                                oneResponsePerPerson: checked
                              }))}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium mb-2 block text-gray-300">
                          Comportamento
                        </Label>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                            <Label htmlFor="edit-after-submit" className="text-sm text-gray-300">
                              Permitir edição após envio
                            </Label>
                            <Switch
                              id="edit-after-submit"
                              checked={settings.editAfterSubmit}
                              onCheckedChange={(checked) => setSettings(prev => ({
                                ...prev,
                                editAfterSubmit: checked
                              }))}
                            />
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                            <Label htmlFor="show-progress" className="text-sm text-gray-300">
                              Mostrar barra de progresso
                            </Label>
                            <Switch
                              id="show-progress"
                              checked={settings.showProgressBar}
                              onCheckedChange={(checked) => setSettings(prev => ({
                                ...prev,
                                showProgressBar: checked
                              }))}
                            />
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                            <Label htmlFor="shuffle-questions" className="text-sm text-gray-300">
                              Embaralhar perguntas
                            </Label>
                            <Switch
                              id="shuffle-questions"
                              checked={settings.shuffleQuestions}
                              onCheckedChange={(checked) => setSettings(prev => ({
                                ...prev,
                                shuffleQuestions: checked
                              }))}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium mb-2 block text-gray-300">
                          Limites
                        </Label>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                            <Label htmlFor="limit-responses" className="text-sm text-gray-300">
                              Limitar número de respostas
                            </Label>
                            <Switch
                              id="limit-responses"
                              checked={settings.limitResponses}
                              onCheckedChange={(checked) => setSettings(prev => ({
                                ...prev,
                                limitResponses: checked
                              }))}
                            />
                          </div>
                          {settings.limitResponses && (
                            <Input
                              type="number"
                              placeholder="100"
                              value={settings.maxResponses}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                maxResponses: parseInt(e.target.value) || 100
                              }))}
                              className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                            />
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium mb-2 block text-gray-300">
                          Mensagem de confirmação
                        </Label>
                        <Textarea
                          value={settings.confirmationMessage}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            confirmationMessage: e.target.value
                          }))}
                          placeholder="Sua resposta foi enviada."
                          className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                          rows={3}
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}

          {/* Form Editor */}
          <div 
            className="flex-1 overflow-y-auto forms-builder-scrollbar"
            style={{
              backgroundColor: settings.theme.backgroundColor,
              '--primary-color': settings.theme.primaryColor,
              '--background-color': settings.theme.backgroundColor,
              '--font-family': settings.theme.font,
            } as React.CSSProperties}
          >
            <div className="p-8">
              <div 
                className={`mx-auto bg-white rounded-lg shadow-sm forms-builder-container ${
                  viewMode === 'desktop' ? 'max-w-4xl' : 
                  viewMode === 'tablet' ? 'max-w-2xl' : 
                  'max-w-md'
                }`}
                style={{
                  fontFamily: settings.theme.font,
                  '--primary-color': settings.theme.primaryColor,
                  '--background-color': settings.theme.backgroundColor,
                } as React.CSSProperties}
              >
                {/* Form Header */}
                <div 
                  className="p-8 rounded-t-lg forms-builder-header"
                  style={{
                    background: `linear-gradient(135deg, ${settings.theme.primaryColor}, ${settings.theme.primaryColor}cc)`,
                  }}
                >
                  <Input
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Título do formulário"
                    className="text-2xl font-bold bg-transparent border-none text-white placeholder-white/80 p-0 focus:ring-0"
                  />
                  <Textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Descrição do formulário"
                    className="mt-2 bg-transparent border-none text-white placeholder-white/80 p-0 resize-none focus:ring-0"
                    rows={2}
                  />
                </div>

                {/* Required Fields Notice */}
                {questions.some(q => q.validation?.required) && (
                  <div className="p-4 border-b bg-red-50 text-sm text-red-700">
                    <span className="text-red-500">*</span> Indica uma pergunta obrigatória
                  </div>
                )}

                {/* Questions */}
                <div className="p-8 space-y-6">
                  {questions.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="mb-4">
                        <Plus className="h-12 w-12 mx-auto text-gray-400" />
                      </div>
                      <p className="text-gray-500 mb-4">Nenhuma pergunta adicionada ainda</p>
                      <Button
                        onClick={() => addQuestion('text')}
                        className="forms-builder-button-primary"
                        style={{ backgroundColor: settings.theme.primaryColor }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar primeira pergunta
                      </Button>
                    </div>
                  ) : (
                    questions.map((question) => (
                      <div key={question.id} className="forms-builder-question-new">
                        {renderQuestionEditor(question)}
                      </div>
                    ))
                  )}
                  
                  {/* Add Question Button */}
                  {questions.length > 0 && (
                    <div className="flex justify-center">
                      <Button
                        onClick={() => addQuestion('text')}
                        variant="outline"
                        className="border-dashed border-2 h-12 px-8 hover:border-purple-400 hover:text-purple-600"
                        style={{
                          borderColor: `${settings.theme.primaryColor}50`,
                          color: settings.theme.primaryColor,
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar pergunta
                      </Button>
                    </div>
                  )}
                </div>

                {/* Form Footer */}
                <div className="p-8 border-t bg-gray-50 rounded-b-lg">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      {questions.length} pergunta{questions.length !== 1 ? 's' : ''}
                    </div>
                    <Button
                      className="text-white forms-builder-button-primary"
                      style={{ backgroundColor: settings.theme.primaryColor }}
                      disabled={previewMode}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Enviar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
