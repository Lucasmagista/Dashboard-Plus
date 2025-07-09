"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Eye, Code, Zap, Variable } from "lucide-react"

interface TemplateEditorProps {
  template: {
    name: string
    subject: string
    html: string
    text: string
    category: string
    variables?: string[]
  }
  onChange: (template: any) => void
  onSave?: () => void
  onCancel?: () => void
  isEdit?: boolean
}

export function TemplateEditor({ template, onChange, onSave, onCancel, isEdit = false }: TemplateEditorProps) {
  const [activeTab, setActiveTab] = useState("edit")

  // Detectar variáveis no template
  const detectVariables = (content: string) => {
    const variableRegex = /\{\{([^}]+)\}\}/g
    const matches = content.match(variableRegex)
    return matches ? Array.from(new Set(matches.map(match => match.replace(/[{}]/g, '')))) : []
  }

  const htmlVariables = detectVariables(template.html || "")
  const subjectVariables = detectVariables(template.subject || "")
  const allVariables = Array.from(new Set([...htmlVariables, ...subjectVariables]))

  // Inserir variável comum
  const insertVariable = (variable: string, field: 'html' | 'text' | 'subject') => {
    const variableTag = `{{${variable}}}`
    const currentValue = template[field] || ""
    onChange({
      ...template,
      [field]: currentValue + variableTag
    })
  }

  const commonVariables = [
    'name', 'email', 'company_name', 'first_name', 'last_name',
    'date', 'time', 'login_url', 'unsubscribe_url', 'footer_text'
  ]

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="edit" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Editar
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="variables" className="flex items-center gap-2">
            <Variable className="w-4 h-4" />
            Variáveis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="templateName">Nome do Template</Label>
              <Input
                id="templateName"
                value={template.name}
                onChange={(e) => onChange({ ...template, name: e.target.value })}
                placeholder="Ex: Newsletter Semanal"
              />
            </div>
            <div>
              <Label htmlFor="templateCategory">Categoria</Label>
              <Input
                id="templateCategory"
                value={template.category}
                onChange={(e) => onChange({ ...template, category: e.target.value })}
                placeholder="Ex: marketing"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="templateSubject">Assunto</Label>
            <div className="flex gap-2">
              <Input
                id="templateSubject"
                value={template.subject}
                onChange={(e) => onChange({ ...template, subject: e.target.value })}
                placeholder="Ex: {{name}}, confira nossa newsletter!"
                className="flex-1"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => insertVariable('name', 'subject')}
              >
                + {'{{name}}'}
              </Button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="templateHtml">Conteúdo HTML</Label>
              <div className="flex gap-1">
                {commonVariables.slice(0, 3).map(variable => (
                  <Button
                    key={variable}
                    variant="outline"
                    size="sm"
                    onClick={() => insertVariable(variable, 'html')}
                    className="text-xs"
                  >
                    + {variable}
                  </Button>
                ))}
              </div>
            </div>
            <Textarea
              id="templateHtml"
              rows={15}
              value={template.html}
              onChange={(e) => onChange({ ...template, html: e.target.value })}
              placeholder="<div>Seu conteúdo HTML aqui...</div>"
              className="font-mono text-sm"
            />
          </div>

          <div>
            <Label htmlFor="templateText">Versão Texto (opcional)</Label>
            <Textarea
              id="templateText"
              rows={8}
              value={template.text}
              onChange={(e) => onChange({ ...template, text: e.target.value })}
              placeholder="Versão em texto simples do seu e-mail..."
            />
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Preview do Template</CardTitle>
                <Badge variant="outline">{template.category}</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                <strong>Assunto:</strong> {template.subject}
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="html" className="w-full">
                <TabsList>
                  <TabsTrigger value="html">HTML Renderizado</TabsTrigger>
                  <TabsTrigger value="text">Texto Simples</TabsTrigger>
                  <TabsTrigger value="code">Código HTML</TabsTrigger>
                </TabsList>
                
                <TabsContent value="html" className="mt-4">
                  <div className="border rounded-lg p-4 bg-white min-h-[400px]">
                    <div dangerouslySetInnerHTML={{ __html: template.html || "Sem conteúdo HTML" }} />
                  </div>
                </TabsContent>
                
                <TabsContent value="text" className="mt-4">
                  <div className="bg-muted p-4 rounded-lg min-h-[400px]">
                    <pre className="text-sm whitespace-pre-wrap">{template.text || "Sem versão em texto"}</pre>
                  </div>
                </TabsContent>
                
                <TabsContent value="code" className="mt-4">
                  <div className="bg-muted p-4 rounded-lg min-h-[400px]">
                    <pre className="text-sm overflow-x-auto">{template.html || "Sem código HTML"}</pre>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variables" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Variáveis Detectadas</CardTitle>
              <p className="text-sm text-muted-foreground">
                Variáveis encontradas no seu template
              </p>
            </CardHeader>
            <CardContent>
              {allVariables.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {allVariables.map(variable => (
                      <Badge key={variable} variant="secondary">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p><strong>No assunto:</strong> {subjectVariables.join(', ') || 'Nenhuma'}</p>
                    <p><strong>No HTML:</strong> {htmlVariables.join(', ') || 'Nenhuma'}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Nenhuma variável detectada no template.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Variáveis Comuns</CardTitle>
              <p className="text-sm text-muted-foreground">
                Clique para inserir variáveis comuns no template
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {commonVariables.map(variable => (
                  <div key={variable} className="flex flex-col gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => insertVariable(variable, 'html')}
                      className="justify-start"
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      {variable}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Guia de Variáveis</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="grid gap-2">
                <div><code>{'{{name}}'}</code> - Nome completo do destinatário</div>
                <div><code>{'{{first_name}}'}</code> - Primeiro nome</div>
                <div><code>{'{{email}}'}</code> - E-mail do destinatário</div>
                <div><code>{'{{company_name}}'}</code> - Nome da empresa</div>
                <div><code>{'{{date}}'}</code> - Data atual</div>
                <div><code>{'{{unsubscribe_url}}'}</code> - Link de descadastro</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {(onSave || onCancel) && (
        <div className="flex justify-end gap-2 pt-4 border-t">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          {onSave && (
            <Button onClick={onSave}>
              {isEdit ? 'Atualizar' : 'Criar'} Template
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
