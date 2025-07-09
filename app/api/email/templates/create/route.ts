import { NextRequest, NextResponse } from 'next/server'
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

async function saveTemplates(templates: any[]) {
  await ensureDataDir()
  await fs.writeFile(TEMPLATES_FILE, JSON.stringify(templates, null, 2))
}

export async function POST(request: NextRequest) {
  try {
    const { name, subject, html, text, category } = await request.json()
    
    if (!name || !subject) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Nome e assunto são obrigatórios' 
        },
        { status: 400 }
      )
    }

    // Detectar variáveis no template
    const detectVariables = (content: string) => {
      const variableRegex = /\{\{([^}]+)\}\}/g
      const matches = content.match(variableRegex)
      return matches ? Array.from(new Set(matches.map(match => match.replace(/[{}]/g, '')))) : []
    }

    const htmlVariables = detectVariables(html || "")
    const subjectVariables = detectVariables(subject || "")
    const allVariables = Array.from(new Set([...htmlVariables, ...subjectVariables]))
    
    // Criar template
    const template = {
      id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      subject,
      html: html || "",
      text: text || "",
      category: category || 'custom',
      variables: allVariables,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Carregar templates existentes e adicionar o novo
    const existingTemplates = await loadTemplates()
    existingTemplates.push(template)
    await saveTemplates(existingTemplates)

    console.log('Template criado:', { id: template.id, name: template.name })
    
    return NextResponse.json({
      success: true,
      template,
      message: 'Template criado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao criar template:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao criar template',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}
