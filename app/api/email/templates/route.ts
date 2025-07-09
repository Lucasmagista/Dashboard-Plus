import { NextResponse } from 'next/server'
import { MailerSend } from 'mailersend'
import { promises as fs } from 'fs'
import path from 'path'

const mailersend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY || '',
})

// Caminho para armazenar templates (em produção, usar banco de dados)
const TEMPLATES_FILE = path.join(process.cwd(), 'data', 'email-templates.json')

async function ensureDataDir() {
  const dataDir = path.dirname(TEMPLATES_FILE)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

async function loadTemplates() {
  try {
    await ensureDataDir()
    const data = await fs.readFile(TEMPLATES_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function GET() {
  try {
    // Templates predefinidos
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
        variables: ['name', 'company_name', 'login_url', 'footer_text'],
        created_at: '2025-01-01T00:00:00.000Z',
        updated_at: '2025-01-01T00:00:00.000Z'
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
              <div style="margin: 30px 0;">
                <a href="{{cta_url}}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">{{cta_text}}</a>
              </div>
              <p style="font-size: 16px; line-height: 1.6; color: #374151;">Atenciosamente,<br>{{sender_name}}</p>
            </div>
          </div>
        `,
        category: 'transactional',
        variables: ['name', 'subject_topic', 'topic', 'message_content', 'cta_url', 'cta_text', 'sender_name'],
        created_at: '2025-01-01T00:00:00.000Z',
        updated_at: '2025-01-01T00:00:00.000Z'
      },
      {
        id: 'newsletter',
        name: 'Newsletter',
        subject: '📰 {{newsletter_title}} - {{date}}',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
            <div style="background: #f8f9fa; padding: 20px; text-align: center; border-bottom: 3px solid #2563eb;">
              <h1 style="margin: 0; color: #2563eb;">{{newsletter_title}}</h1>
              <p style="margin: 10px 0 0 0; color: #6b7280;">{{date}}</p>
            </div>
            <div style="padding: 30px;">
              <h2 style="color: #374151; margin-top: 0;">Olá {{name}}!</h2>
              <p style="font-size: 16px; line-height: 1.6; color: #374151;">{{intro_message}}</p>
              
              <div style="margin: 30px 0;">
                <h3 style="color: #2563eb;">{{article_title}}</h3>
                <p style="font-size: 16px; line-height: 1.6; color: #374151;">{{article_content}}</p>
                <a href="{{article_url}}" style="color: #2563eb; text-decoration: none; font-weight: 500;">Leia mais →</a>
              </div>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <h4 style="margin-top: 0; color: #374151;">{{highlight_title}}</h4>
                <p style="font-size: 14px; line-height: 1.6; color: #6b7280; margin-bottom: 0;">{{highlight_content}}</p>
              </div>
            </div>
            <div style="background: #f8f9fa; padding: 20px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #6b7280;">{{footer_text}}</p>
              <a href="{{unsubscribe_url}}" style="color: #6b7280; font-size: 12px;">Descadastrar</a>
            </div>
          </div>
        `,
        category: 'marketing',
        variables: ['newsletter_title', 'date', 'name', 'intro_message', 'article_title', 'article_content', 'article_url', 'highlight_title', 'highlight_content', 'footer_text', 'unsubscribe_url'],
        created_at: '2025-01-01T00:00:00.000Z',
        updated_at: '2025-01-01T00:00:00.000Z'
      }
    ]

    // Carregar templates personalizados
    const customTemplates = await loadTemplates()
    
    // Combinar templates predefinidos e personalizados
    const allTemplates = [...predefinedTemplates, ...customTemplates]
    
    return NextResponse.json({
      success: true,
      templates: allTemplates,
      message: 'Templates carregados com sucesso'
    })

  } catch (error) {
    console.error('Erro ao carregar templates:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao carregar templates',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}