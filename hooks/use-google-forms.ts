"use client"

import { useState, useEffect } from 'react'

export interface GoogleForm {
  id: string
  title: string
  description?: string
  createdAt: string
  updatedAt: string
  responseCount: number
  status: 'active' | 'inactive' | 'draft'
  url: string
  embedUrl: string
}

export interface FormResponse {
  id: string
  formId: string
  submittedAt: string
  responses: { [questionId: string]: any }
}

export interface FormQuestion {
  id: string
  title: string
  type: 'text' | 'email' | 'number' | 'radio' | 'checkbox' | 'dropdown' | 'textarea' | 'date' | 'time' | 
        'linear-scale' | 'multiple-choice-grid' | 'checkbox-grid' | 'file-upload' | 'rating' | 'image' | 'video' | 'phone' | 'image-choice' | 'section'
  required: boolean
  options?: string[]
  description?: string
  validation?: {
    required: boolean
    minLength?: number
    maxLength?: number
    pattern?: string
    customErrorMessage?: string
  }
  settings?: {
    shuffleOptions?: boolean
    allowOther?: boolean
    goToSection?: string
    goToPage?: string
  }
  conditional?: {
    enabled: boolean
    triggerQuestion: string
    triggerValue: string
    action: 'show' | 'hide'
  }
  gridRows?: string[]
  gridColumns?: string[]
  scaleMin?: number
  scaleMax?: number
  scaleMinLabel?: string
  scaleMaxLabel?: string
}

export interface CreateFormData {
  title: string
  description?: string
  questions: FormQuestion[]
  settings?: {
    collectEmail?: boolean
    requireSignIn?: boolean
    oneResponsePerPerson?: boolean
    editAfterSubmit?: boolean
    showProgressBar?: boolean
    shuffleQuestions?: boolean
    confirmationMessage?: string
    theme?: {
      primaryColor?: string
      backgroundColor?: string
      headerImage?: string
      font?: string
    }
  }
}

// Mock data para demonstração - em produção, seria substituído pela API real do Google Forms
const mockForms: GoogleForm[] = [
  {
    id: '1',
    title: 'Avaliação de Desempenho 2025',
    description: 'Formulário anual de avaliação de desempenho dos colaboradores',
    createdAt: '2025-06-15',
    updatedAt: '2025-07-01',
    responseCount: 45,
    status: 'active',
    url: 'https://forms.gle/example1',
    embedUrl: 'https://docs.google.com/forms/d/e/example1/viewform?embedded=true'
  },
  {
    id: '2',
    title: 'Pesquisa de Satisfação - Benefícios',
    description: 'Avaliação dos benefícios oferecidos pela empresa',
    createdAt: '2025-06-20',
    updatedAt: '2025-06-25',
    responseCount: 32,
    status: 'active',
    url: 'https://forms.gle/example2',
    embedUrl: 'https://docs.google.com/forms/d/e/example2/viewform?embedded=true'
  },
  {
    id: '3',
    title: 'Feedback de Onboarding',
    description: 'Coleta de feedback sobre o processo de integração',
    createdAt: '2025-07-01',
    updatedAt: '2025-07-05',
    responseCount: 8,
    status: 'draft',
    url: 'https://forms.gle/example3',
    embedUrl: 'https://docs.google.com/forms/d/e/example3/viewform?embedded=true'
  }
]

export function useGoogleForms() {
  const [forms, setForms] = useState<GoogleForm[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Simula carregamento dos formulários
  useEffect(() => {
    const loadForms = async () => {
      try {
        setLoading(true)
        // Simula delay da API
        await new Promise(resolve => setTimeout(resolve, 1000))
        setForms(mockForms)
      } catch (err) {
        setError('Erro ao carregar formulários')
      } finally {
        setLoading(false)
      }
    }

    loadForms()
  }, [])

  // Criar novo formulário
  const createForm = async (formData: CreateFormData): Promise<GoogleForm> => {
    try {
      setLoading(true)
      
      // Simula criação via API do Google Forms
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newForm: GoogleForm = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        responseCount: 0,
        status: 'draft',
        url: `https://forms.gle/mock-${Date.now()}`,
        embedUrl: `https://docs.google.com/forms/d/e/mock-${Date.now()}/viewform?embedded=true`
      }

      setForms(prev => [newForm, ...prev])
      return newForm
    } catch (err) {
      setError('Erro ao criar formulário')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Atualizar status do formulário
  const updateFormStatus = async (formId: string, status: GoogleForm['status']) => {
    try {
      setForms(prev => prev.map(form => 
        form.id === formId 
          ? { ...form, status, updatedAt: new Date().toISOString().split('T')[0] }
          : form
      ))
    } catch (err) {
      setError('Erro ao atualizar formulário')
    }
  }

  // Deletar formulário
  const deleteForm = async (formId: string) => {
    try {
      setForms(prev => prev.filter(form => form.id !== formId))
    } catch (err) {
      setError('Erro ao deletar formulário')
    }
  }

  // Obter respostas de um formulário (mock)
  const getFormResponses = async (formId: string): Promise<FormResponse[]> => {
    try {
      // Simula busca de respostas
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return [
        {
          id: '1',
          formId,
          submittedAt: '2025-07-08',
          responses: {
            'q1': 'Muito satisfeito',
            'q2': 'Excelente ambiente de trabalho',
            'q3': 5
          }
        },
        {
          id: '2',
          formId,
          submittedAt: '2025-07-09',
          responses: {
            'q1': 'Satisfeito',
            'q2': 'Bom relacionamento com a equipe',
            'q3': 4
          }
        }
      ]
    } catch (err) {
      setError('Erro ao carregar respostas')
      return []
    }
  }

  return {
    forms,
    loading,
    error,
    createForm,
    updateFormStatus,
    deleteForm,
    getFormResponses,
    clearError: () => setError(null)
  }
}
