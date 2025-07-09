import { useState, useCallback } from 'react'
import { useToast } from './use-toast'

interface EmailData {
  to: string | string[]
  cc?: string | string[]
  bcc?: string | string[]
  subject: string
  html?: string
  text?: string
  templateId?: string
  variables?: Record<string, any>
  attachments?: File[]
}

interface EmailTemplate {
  id: string
  name: string
  subject: string
  html?: string
  text?: string
  category?: string
  created_at?: string
  updated_at?: string
  variables?: string[]
}

interface CreateTemplateData {
  name: string
  subject: string
  html?: string
  text?: string
  category?: string
}

interface EmailStats {
  sent: number
  delivered: number
  opened: number
  clicked: number
  bounced: number
  unsubscribed: number
  openRate: number
  clickRate: number
  bounceRate: number
  dailyStats: Array<{
    date: string
    sent: number
    delivered: number
    opened: number
    clicked: number
  }>
}

export function useEmail() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [stats, setStats] = useState<EmailStats | null>(null)
  const { toast } = useToast()

  const sendEmail = useCallback(async (emailData: EmailData) => {
    setIsSending(true)
    try {
      // Preparar dados do email
      const emailPayload = {
        to: emailData.to,
        cc: emailData.cc,
        bcc: emailData.bcc,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
        templateId: emailData.templateId,
        variables: emailData.variables
      }

      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailPayload)
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Email enviado!',
          description: result.message,
        })
        return { success: true, messageId: result.messageId }
      } else {
        throw new Error(result.error || 'Erro ao enviar email')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      toast({
        title: 'Erro ao enviar email',
        description: errorMessage,
        variant: 'destructive',
      })
      return { success: false, error: errorMessage }
    } finally {
      setIsSending(false)
    }
  }, [toast])

  const loadTemplates = useCallback(async () => {
    setIsLoading(true)
    try {
      // Carregar templates predefinidos e personalizados
      const predefinedTemplates = [
        {
          id: 'welcome',
          name: 'Bem-vindo',
          subject: 'Bem-vindo(a) ao {{company_name}}!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
              <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 30px; text-align: center;">
                <h1 style="margin: 0; font-size: 28px;">Bem-vindo(a)!</h1>
              </div>
              <div style="padding: 30px;">
                <p style="font-size: 16px; line-height: 1.6; color: #374151;">Olá {{name}},</p>
                <p style="font-size: 16px; line-height: 1.6; color: #374151;">É um prazer tê-lo(a) conosco! Sua conta foi criada com sucesso e agora você pode aproveitar todos os recursos da nossa plataforma.</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="{{login_url}}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Acessar Plataforma</a>
                </div>
                <p style="font-size: 16px; line-height: 1.6; color: #374151;">Se você tiver alguma dúvida, não hesite em entrar em contato conosco.</p>
                <p style="font-size: 16px; line-height: 1.6; color: #374151;">Atenciosamente,<br>Equipe {{company_name}}</p>
              </div>
              <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
                {{footer_text}}
              </div>
            </div>
          `,
          category: 'onboarding',
          variables: ['name', 'company_name', 'login_url', 'footer_text']
        },
        {
          id: 'followup',
          name: 'Follow-up',
          subject: 'Acompanhamento - {{subject_topic}}',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
              <div style="padding: 30px;">
                <h2 style="color: #2563eb; margin-top: 0;">Acompanhamento</h2>
                <p style="font-size: 16px; line-height: 1.6; color: #374151;">Olá {{name}},</p>
                <p style="font-size: 16px; line-height: 1.6; color: #374151;">Gostaria de fazer um acompanhamento sobre {{topic}}.</p>
                <p style="font-size: 16px; line-height: 1.6; color: #374151;">{{message_content}}</p>
                <p style="font-size: 16px; line-height: 1.6; color: #374151;">Aguardo seu retorno.</p>
                <p style="font-size: 16px; line-height: 1.6; color: #374151;">Atenciosamente,<br>{{sender_name}}</p>
              </div>
            </div>
          `,
          category: 'business',
          variables: ['name', 'subject_topic', 'topic', 'message_content', 'sender_name']
        },
        {
          id: 'meeting',
          name: 'Solicitação de Reunião',
          subject: 'Convite para Reunião - {{meeting_topic}}',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
              <div style="padding: 30px;">
                <h2 style="color: #2563eb; margin-top: 0;">Convite para Reunião</h2>
                <p style="font-size: 16px; line-height: 1.6; color: #374151;">Olá {{name}},</p>
                <p style="font-size: 16px; line-height: 1.6; color: #374151;">Gostaria de agendar uma reunião para discutir {{meeting_topic}}.</p>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 5px 0; font-size: 16px;"><strong>📅 Data:</strong> {{meeting_date}}</p>
                  <p style="margin: 5px 0; font-size: 16px;"><strong>🕐 Horário:</strong> {{meeting_time}}</p>
                  <p style="margin: 5px 0; font-size: 16px;"><strong>📍 Local:</strong> {{meeting_location}}</p>
                </div>
                <p style="font-size: 16px; line-height: 1.6; color: #374151;">Por favor, confirme sua presença respondendo a este e-mail.</p>
                <p style="font-size: 16px; line-height: 1.6; color: #374151;">Atenciosamente,<br>{{sender_name}}</p>
              </div>
            </div>
          `,
          category: 'business',
          variables: ['name', 'meeting_topic', 'meeting_date', 'meeting_time', 'meeting_location', 'sender_name']
        },
        {
          id: 'promotional',
          name: 'E-mail Promocional',
          subject: '🎉 Oferta Especial: {{offer_title}}',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
              <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center;">
                <h1 style="margin: 0; font-size: 28px;">🎉 Oferta Especial!</h1>
              </div>
              <div style="padding: 30px;">
                <p style="font-size: 16px; line-height: 1.6; color: #374151;">Olá {{name}},</p>
                <h2 style="color: #10b981; text-align: center;">{{offer_title}}</h2>
                <p style="font-size: 18px; line-height: 1.6; color: #374151; text-align: center;">{{offer_description}}</p>
                <div style="text-align: center; margin: 30px 0;">
                  <div style="background: #fef3c7; color: #92400e; padding: 15px; border-radius: 8px; font-size: 24px; font-weight: bold; margin-bottom: 20px;">
                    {{discount_percentage}}% de desconto
                  </div>
                  <a href="{{cta_url}}" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 18px;">{{cta_text}}</a>
                </div>
                <p style="font-size: 14px; line-height: 1.6; color: #6b7280; text-align: center;">Oferta válida até {{expiry_date}}</p>
              </div>
            </div>
          `,
          category: 'marketing',
          variables: ['name', 'offer_title', 'offer_description', 'discount_percentage', 'cta_url', 'cta_text', 'expiry_date']
        }
      ]

      // Carregar templates personalizados
      const customTemplates = JSON.parse(localStorage.getItem('email-templates') || '[]')
      
      const allTemplates = [...predefinedTemplates, ...customTemplates]
      setTemplates(allTemplates)
      return allTemplates

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      toast({
        title: 'Erro ao carregar templates',
        description: errorMessage,
        variant: 'destructive',
      })
      return []
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const createTemplate = useCallback(async (templateData: CreateTemplateData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/email/templates/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData)
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Template criado!',
          description: result.message,
        })
        
        // Recarregar templates
        await loadTemplates()
        
        return { success: true, template: result.template }
      } else {
        throw new Error(result.error || 'Erro ao criar template')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      toast({
        title: 'Erro ao criar template',
        description: errorMessage,
        variant: 'destructive',
      })
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [toast, loadTemplates])

  const updateTemplate = useCallback(async (templateId: string, templateData: CreateTemplateData) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/email/templates/${templateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData)
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Template atualizado!',
          description: result.message,
        })
        
        // Recarregar templates
        await loadTemplates()
        
        return { success: true, template: result.template }
      } else {
        throw new Error(result.error || 'Erro ao atualizar template')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      toast({
        title: 'Erro ao atualizar template',
        description: errorMessage,
        variant: 'destructive',
      })
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [toast, loadTemplates])

  const deleteTemplate = useCallback(async (templateId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/email/templates/${templateId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Template removido!',
          description: result.message,
        })
        
        // Recarregar templates
        await loadTemplates()
        
        return { success: true }
      } else {
        throw new Error(result.error || 'Erro ao remover template')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      toast({
        title: 'Erro ao remover template',
        description: errorMessage,
        variant: 'destructive',
      })
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [toast, loadTemplates])

  const loadStats = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/email/stats')
      const result = await response.json()

      if (result.success) {
        setStats(result.stats)
        return result.stats
      } else {
        throw new Error(result.error || 'Erro ao carregar estatísticas')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      toast({
        title: 'Erro ao carregar estatísticas',
        description: errorMessage,
        variant: 'destructive',
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const saveDraft = useCallback(async (emailData: Partial<EmailData>) => {
    try {
      // Salvar rascunho no localStorage por enquanto
      const drafts = JSON.parse(localStorage.getItem('email-drafts') || '[]')
      const newDraft = {
        id: Date.now().toString(),
        ...emailData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      drafts.push(newDraft)
      localStorage.setItem('email-drafts', JSON.stringify(drafts))
      
      toast({
        title: 'Rascunho salvo',
        description: 'Seu email foi salvo nos rascunhos',
      })
      
      return { success: true, draftId: newDraft.id }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      toast({
        title: 'Erro ao salvar rascunho',
        description: errorMessage,
        variant: 'destructive',
      })
      return { success: false, error: errorMessage }
    }
  }, [toast])

  const getDrafts = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem('email-drafts') || '[]')
    } catch {
      return []
    }
  }, [])

  return {
    sendEmail,
    loadTemplates,
    loadStats,
    saveDraft,
    getDrafts,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    isLoading,
    isSending,
    templates,
    stats
  }
}
