"use client"

import { useState, useRef } from 'react'
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
  BarChart3
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
  { value: 'text', label: 'Resposta curta', icon: AlignLeft, description: 'Uma linha de texto' },
  { value: 'textarea', label: 'Parágrafo', icon: AlignLeft, description: 'Texto longo' },
  { value: 'radio', label: 'Múltipla escolha', icon: List, description: 'Escolha uma opção' },
  { value: 'checkbox', label: 'Caixas de seleção', icon: List, description: 'Várias opções' },
  { value: 'dropdown', label: 'Lista suspensa', icon: List, description: 'Menu dropdown' },
  { value: 'linear-scale', label: 'Escala linear', icon: BarChart3, description: 'Escala numérica' },
  { value: 'multiple-choice-grid', label: 'Grade múltipla escolha', icon: Grid3X3, description: 'Matriz de opções' },
  { value: 'checkbox-grid', label: 'Grade de caixas', icon: Grid3X3, description: 'Matriz de checkboxes' },
  { value: 'date', label: 'Data', icon: Calendar, description: 'Seletor de data' },
  { value: 'time', label: 'Hora', icon: Clock, description: 'Seletor de hora' },
  { value: 'email', label: 'Email', icon: AtSign, description: 'Endereço de email' },
  { value: 'phone', label: 'Telefone', icon: Phone, description: 'Número de telefone' },
  { value: 'number', label: 'Número', icon: Hash, description: 'Valor numérico' },
  { value: 'file-upload', label: 'Upload de arquivo', icon: Upload, description: 'Envio de arquivos' },
  { value: 'rating', label: 'Avaliação', icon: Star, description: 'Classificação por estrelas' },
  { value: 'image', label: 'Escolha de imagem', icon: Image, description: 'Seleção visual' },
  { value: 'video', label: 'Vídeo', icon: Video, description: 'Incorporar vídeo' }
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

// Componente para preview do formulário
function FormPreview({ title, description, questions, settings }: any) {
  return (
    <div className="h-full overflow-y-auto p-6" style={{ backgroundColor: settings.theme.backgroundColor }}>
      <div className="max-w-2xl mx-auto">
        <div 
          className="bg-white rounded-lg shadow-lg p-8 mb-6"
          style={{ fontFamily: settings.theme.font }}
        >
          <div 
            className="h-2 rounded-t-lg mb-6"
            style={{ backgroundColor: settings.theme.primaryColor }}
          />
          <h1 className="text-3xl font-bold mb-4" style={{ color: settings.theme.primaryColor }}>
            {title || 'Formulário sem título'}
          </h1>
          {description && (
            <p className="text-gray-600 mb-6">{description}</p>
          )}
          
          {questions.map((question: any, index: number) => (
            <div key={question.id} className="mb-8">
              <div className="flex items-start gap-2 mb-3">
                <span className="text-sm font-medium text-gray-500">{index + 1}.</span>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {question.title || 'Pergunta sem título'}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </h3>
                  {question.description && (
                    <p className="text-sm text-gray-600 mt-1">{question.description}</p>
                  )}
                </div>
              </div>
              
              {/* Renderizar preview baseado no tipo */}
              <div className="ml-6">
                {question.type === 'text' && (
                  <Input placeholder="Sua resposta" className="max-w-md" />
                )}
                {question.type === 'textarea' && (
                  <Textarea placeholder="Sua resposta" className="max-w-md" rows={3} />
                )}
                {question.type === 'radio' && question.options && (
                  <div className="space-y-2">
                    {question.options.map((option: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input type="radio" name={question.id} id={`${question.id}-${idx}`} />
                        <label htmlFor={`${question.id}-${idx}`}>{option}</label>
                      </div>
                    ))}
                  </div>
                )}
                {question.type === 'checkbox' && question.options && (
                  <div className="space-y-2">
                    {question.options.map((option: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input type="checkbox" id={`${question.id}-${idx}`} />
                        <label htmlFor={`${question.id}-${idx}`}>{option}</label>
                      </div>
                    ))}
                  </div>
                )}
                {question.type === 'linear-scale' && (
                  <div className="flex items-center gap-4">
                    <span className="text-sm">1</span>
                    <div className="flex gap-2">
                      {Array.from({ length: question.scaleMax || 5 }, (_, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <input 
                            type="radio" 
                            name={question.id} 
                            id={`${question.id}-scale-${i + 1}`}
                            aria-label={`Escala ${i + 1} de ${question.scaleMax || 5}`}
                          />
                          <span className="text-xs mt-1">{i + 1}</span>
                        </div>
                      ))}
                    </div>
                    <span className="text-sm">{question.scaleMax || 5}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          <div className="mt-8 pt-6 border-t">
            <Button style={{ backgroundColor: settings.theme.primaryColor }} className="text-white">
              Enviar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente para personalização de tema
function ThemeCustomizer({ settings, onSettingsChange }: any) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Temas pré-definidos</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {themes.map(theme => (
            <Button
              key={theme.name}
              variant="outline"
              size="sm"
              onClick={() => onSettingsChange({
                ...settings,
                theme: { ...settings.theme, primaryColor: theme.primary, backgroundColor: theme.background }
              })}
              className="justify-start"
            >
              <div 
                className="w-4 h-4 rounded mr-2" 
                style={{ backgroundColor: theme.primary }}
              />
              {theme.name}
            </Button>
          ))}
        </div>
      </div>
      
      <div>
        <Label className="text-sm font-medium">Cor principal</Label>
        <Input
          type="color"
          value={settings.theme.primaryColor}
          onChange={(e) => onSettingsChange({
            ...settings,
            theme: { ...settings.theme, primaryColor: e.target.value }
          })}
          className="w-full h-10 mt-2"
        />
      </div>
      
      <div>
        <Label className="text-sm font-medium">Cor de fundo</Label>
        <Input
          type="color"
          value={settings.theme.backgroundColor}
          onChange={(e) => onSettingsChange({
            ...settings,
            theme: { ...settings.theme, backgroundColor: e.target.value }
          })}
          className="w-full h-10 mt-2"
        />
      </div>
      
      <div>
        <Label className="text-sm font-medium">Fonte</Label>
        <Select
          value={settings.theme.font}
          onValueChange={(value) => onSettingsChange({
            ...settings,
            theme: { ...settings.theme, font: value }
          })}
        >
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fonts.map(font => (
              <SelectItem key={font.value} value={font.value}>
                <span style={{ fontFamily: font.value }}>{font.name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

// Componente para configurações do formulário
function FormSettingsPanel({ settings, onSettingsChange }: any) {
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium mb-3 block">Configurações de resposta</Label>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Coletar endereços de email</Label>
            <Switch
              checked={settings.collectEmail}
              onCheckedChange={(checked) => onSettingsChange({
                ...settings,
                collectEmail: checked
              })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label className="text-sm">Exigir login</Label>
            <Switch
              checked={settings.requireSignIn}
              onCheckedChange={(checked) => onSettingsChange({
                ...settings,
                requireSignIn: checked
              })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label className="text-sm">Limitar a 1 resposta</Label>
            <Switch
              checked={settings.oneResponsePerPerson}
              onCheckedChange={(checked) => onSettingsChange({
                ...settings,
                oneResponsePerPerson: checked
              })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label className="text-sm">Permitir edição após envio</Label>
            <Switch
              checked={settings.editAfterSubmit}
              onCheckedChange={(checked) => onSettingsChange({
                ...settings,
                editAfterSubmit: checked
              })}
            />
          </div>
        </div>
      </div>
      
      <div>
        <Label className="text-sm font-medium mb-3 block">Apresentação</Label>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Mostrar barra de progresso</Label>
            <Switch
              checked={settings.showProgressBar}
              onCheckedChange={(checked) => onSettingsChange({
                ...settings,
                showProgressBar: checked
              })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label className="text-sm">Embaralhar perguntas</Label>
            <Switch
              checked={settings.shuffleQuestions}
              onCheckedChange={(checked) => onSettingsChange({
                ...settings,
                shuffleQuestions: checked
              })}
            />
          </div>
        </div>
      </div>
      
      <div>
        <Label className="text-sm font-medium">Mensagem de confirmação</Label>
        <Textarea
          value={settings.confirmationMessage}
          onChange={(e) => onSettingsChange({
            ...settings,
            confirmationMessage: e.target.value
          })}
          placeholder="Mensagem mostrada após envio"
          className="mt-2"
          rows={3}
        />
      </div>
    </div>
  )
}

// Componente principal do construtor
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
      setActiveTab('questions')
      setPreviewMode(false)
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden bg-white dark:bg-zinc-900">
        <DialogHeader className="border-b border-zinc-200 dark:border-zinc-700 pb-4">
          <DialogTitle className="text-zinc-900 dark:text-zinc-100 flex items-center gap-4">
            <div className="flex-1">
              {formTitle || 'Formulário sem título'}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {previewMode ? 'Editar' : 'Visualizar'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        {previewMode ? (
          <FormPreview 
            title={formTitle}
            description={formDescription}
            questions={questions}
            settings={settings}
          />
        ) : (
          <div className="flex h-[calc(95vh-120px)]">
            {/* Sidebar com abas */}
            <div className="w-80 border-r border-zinc-200 dark:border-zinc-700 overflow-y-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                <TabsList className="grid w-full grid-cols-3 m-2">
                  <TabsTrigger value="questions">Perguntas</TabsTrigger>
                  <TabsTrigger value="theme">Tema</TabsTrigger>
                  <TabsTrigger value="settings">Config</TabsTrigger>
                </TabsList>

                <TabsContent value="questions" className="p-4 space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Adicionar pergunta</Label>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      {questionTypes.slice(0, 8).map(type => {
                        const IconComponent = type.icon
                        return (
                          <Button
                            key={type.value}
                            variant="outline"
                            size="sm"
                            onClick={() => addQuestion(type.value as FormQuestion['type'])}
                            className="justify-start text-left h-auto p-3"
                          >
                            <div className="flex items-start gap-2">
                              <IconComponent className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <div>
                                <div className="font-medium">{type.label}</div>
                                <div className="text-xs text-zinc-500">{type.description}</div>
                              </div>
                            </div>
                          </Button>
                        )
                      })}
                    </div>
                    
                    <details className="mt-4">
                      <summary className="text-sm font-medium cursor-pointer text-zinc-600 dark:text-zinc-400">
                        Mais tipos de pergunta
                      </summary>
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        {questionTypes.slice(8).map(type => {
                          const IconComponent = type.icon
                          return (
                            <Button
                              key={type.value}
                              variant="outline"
                              size="sm"
                              onClick={() => addQuestion(type.value as FormQuestion['type'])}
                              className="justify-start text-left h-auto p-3"
                            >
                              <div className="flex items-start gap-2">
                                <IconComponent className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="font-medium">{type.label}</div>
                                  <div className="text-xs text-zinc-500">{type.description}</div>
                                </div>
                              </div>
                            </Button>
                          )
                        })}
                      </div>
                    </details>
                  </div>
                </TabsContent>

                <TabsContent value="theme" className="p-4 space-y-4">
                  <ThemeCustomizer settings={settings} onSettingsChange={setSettings} />
                </TabsContent>

                <TabsContent value="settings" className="p-4 space-y-4">
                  <FormSettingsPanel settings={settings} onSettingsChange={setSettings} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Área principal de edição */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Cabeçalho do formulário */}
                <Card className="border-l-4" style={{ borderLeftColor: settings.theme.primaryColor }}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <Input
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="Título do formulário"
                        className="text-2xl font-bold border-none p-0 focus-visible:ring-0"
                      />
                      <Textarea
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        placeholder="Descrição do formulário (opcional)"
                        className="border-none p-0 focus-visible:ring-0 resize-none"
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Lista de perguntas */}
                {questions.map((question, index) => (
                  <Card 
                    key={question.id} 
                    className={`transition-all ${editingQuestion === index ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-zinc-400 cursor-move" />
                          <span className="text-sm text-zinc-500">Pergunta {index + 1}</span>
                          <div className="ml-auto flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => duplicateQuestion(index)}
                              title="Duplicar pergunta"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
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
                                className="mt-1"
                              />
                            </div>

                            <div>
                              <Label>Descrição (opcional)</Label>
                              <Textarea
                                value={question.description || ''}
                                onChange={(e) => updateQuestion(index, { description: e.target.value })}
                                placeholder="Adicione uma descrição para ajudar a responder"
                                className="mt-1"
                                rows={2}
                              />
                            </div>

                            <div>
                              <Label>Tipo de Resposta</Label>
                              <Select
                                value={question.type}
                                onValueChange={(value: FormQuestion['type']) => 
                                  updateQuestion(index, { 
                                    type: value, 
                                    options: needsOptions(value) ? question.options || ['Opção 1'] : undefined 
                                  })
                                }
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {questionTypes.map(type => (
                                    <SelectItem key={type.value} value={type.value}>
                                      <div className="flex items-center gap-2">
                                        <type.icon className="h-4 w-4" />
                                        {type.label}
                                      </div>
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
                                      {question.options && question.options.length > 1 && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeOption(index, optionIndex)}
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      )}
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

                            {needsScale(question.type) && (
                              <div>
                                <Label>Configuração da Escala</Label>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                  <div>
                                    <Label className="text-sm">Valor mínimo</Label>
                                    <Input
                                      type="number"
                                      value={question.scaleMin || 1}
                                      onChange={(e) => updateQuestion(index, { scaleMin: parseInt(e.target.value) })}
                                      min="0"
                                      max="10"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-sm">Valor máximo</Label>
                                    <Input
                                      type="number"
                                      value={question.scaleMax || 5}
                                      onChange={(e) => updateQuestion(index, { scaleMax: parseInt(e.target.value) })}
                                      min="2"
                                      max="10"
                                    />
                                  </div>
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
                            {question.description && (
                              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                {question.description}
                              </p>
                            )}
                            <p className="text-sm text-zinc-500">
                              Tipo: {questionTypes.find(t => t.value === question.type)?.label}
                            </p>
                            {question.options && question.options.length > 0 && (
                              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                Opções: {question.options.slice(0, 3).join(', ')}
                                {question.options.length > 3 && '...'}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Botão para adicionar primeira pergunta */}
                {questions.length === 0 && (
                  <Card className="border-dashed border-2 border-zinc-300 dark:border-zinc-600">
                    <CardContent className="p-12 text-center">
                      <Plus className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                        Adicione sua primeira pergunta
                      </h3>
                      <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                        Use a barra lateral para escolher um tipo de pergunta
                      </p>
                      <Button onClick={() => addQuestion()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Pergunta
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer com ações */}
        {!previewMode && (
          <div className="border-t border-zinc-200 dark:border-zinc-700 p-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                {questions.length} pergunta{questions.length !== 1 ? 's' : ''}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={!formTitle.trim() || loading}
                  style={{ backgroundColor: settings.theme.primaryColor }}
                  className="text-white"
                >
                  {loading ? 'Criando...' : 'Criar Formulário'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
