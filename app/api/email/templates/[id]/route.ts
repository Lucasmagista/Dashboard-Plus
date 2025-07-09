import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const templateId = params.id
    
    // Verificar se é um template predefinido (não pode ser excluído)
    const predefinedIds = ['welcome', 'followup', 'newsletter', 'promo']
    if (predefinedIds.includes(templateId)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Templates predefinidos não podem ser excluídos'
        },
        { status: 400 }
      )
    }
    
    // Carregar templates e remover o especificado
    const existingTemplates = await loadTemplates()
    const templateIndex = existingTemplates.findIndex((t: any) => t.id === templateId)
    
    if (templateIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Template não encontrado'
        },
        { status: 404 }
      )
    }
    
    const updatedTemplates = existingTemplates.filter(
      (template: any) => template.id !== templateId
    )
    await saveTemplates(updatedTemplates)
    
    console.log('Template removido:', { id: templateId })
    
    return NextResponse.json({
      success: true,
      message: 'Template removido com sucesso'
    })

  } catch (error) {
    console.error('Erro ao remover template:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao remover template',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const templateId = params.id
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
    
    // Verificar se é um template predefinido (não pode ser editado)
    const predefinedIds = ['welcome', 'followup', 'newsletter', 'promo']
    if (predefinedIds.includes(templateId)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Templates predefinidos não podem ser editados'
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
    
    // Carregar templates e atualizar o especificado
    const existingTemplates = await loadTemplates()
    const templateIndex = existingTemplates.findIndex((t: any) => t.id === templateId)
    
    if (templateIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Template não encontrado'
        },
        { status: 404 }
      )
    }
    
    // Atualizar template
    existingTemplates[templateIndex] = {
      ...existingTemplates[templateIndex],
      name,
      subject,
      html: html || "",
      text: text || "",
      category: category || 'custom',
      variables: allVariables,
      updated_at: new Date().toISOString()
    }
    
    await saveTemplates(existingTemplates)
    
    console.log('Template atualizado:', { id: templateId, name })
    
    return NextResponse.json({
      success: true,
      template: existingTemplates[templateIndex],
      message: 'Template atualizado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao atualizar template:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao atualizar template',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}
