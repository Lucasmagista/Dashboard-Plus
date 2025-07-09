"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Paperclip,
  X,
  Eye,
  Send,
  Save
} from "lucide-react"
import { useEmail } from "@/hooks/use-email"

interface EmailComposerProps {
  onClose: () => void
  draftData?: any
}

const predefinedTemplates = [
  {
    id: "blank",
    name: "Em Branco",
    subject: "",
    html: "",
    category: "basic"
  },
  {
    id: "welcome",
    name: "Bem-vindo",
    subject: "Bem-vindo(a) ao Dashboard Plus!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Bem-vindo(a)!</h1>
        <p>Olá {{name}},</p>
        <p>É um prazer tê-lo(a) conosco! Sua conta foi criada com sucesso.</p>
        <p>Atenciosamente,<br>Equipe Dashboard Plus</p>
      </div>
    `,
    category: "onboarding"
  },
  {
    id: "followup",
    name: "Follow-up",
    subject: "Acompanhamento - {{subject}}",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Acompanhamento</h2>
        <p>Olá {{name}},</p>
        <p>Gostaria de fazer um acompanhamento sobre {{topic}}.</p>
        <p>Aguardo seu retorno.</p>
        <p>Atenciosamente,<br>{{sender_name}}</p>
      </div>
    `,
    category: "business"
  },
  {
    id: "meeting",
    name: "Solicitação de Reunião",
    subject: "Convite para Reunião - {{meeting_topic}}",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Convite para Reunião</h2>
        <p>Olá {{name}},</p>
        <p>Gostaria de agendar uma reunião para discutir {{meeting_topic}}.</p>
        <p><strong>Data:</strong> {{meeting_date}}<br>
           <strong>Horário:</strong> {{meeting_time}}<br>
           <strong>Local:</strong> {{meeting_location}}</p>
        <p>Por favor, confirme sua presença.</p>
        <p>Atenciosamente,<br>{{sender_name}}</p>
      </div>
    `,
    category: "business"
  }
]

export function EmailComposer({ onClose, draftData }: EmailComposerProps) {
  const [to, setTo] = useState(draftData?.to || "")
  const [cc, setCc] = useState(draftData?.cc || "")
  const [bcc, setBcc] = useState(draftData?.bcc || "")
  const [subject, setSubject] = useState(draftData?.subject || "")
  const [selectedTemplate, setSelectedTemplate] = useState(draftData?.templateId || "blank")
  const [htmlContent, setHtmlContent] = useState(draftData?.html || "")
  const [textContent, setTextContent] = useState(draftData?.text || "")
  const [attachments, setAttachments] = useState<File[]>([])
  const [variables, setVariables] = useState<Record<string, string>>(draftData?.variables || {})
  const [showCc, setShowCc] = useState(!!draftData?.cc)
  const [showBcc, setShowBcc] = useState(!!draftData?.bcc)
  const [useTemplate, setUseTemplate] = useState(!!draftData?.templateId)
  const [previewMode, setPreviewMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { sendEmail, saveDraft, isSending } = useEmail()

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = predefinedTemplates.find(t => t.id === templateId)
    if (template && templateId !== "blank") {
      setSubject(template.subject)
      setHtmlContent(template.html)
    } else {
      setSubject("")
      setHtmlContent("")
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setAttachments(prev => [...prev, ...files])
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleSend = async () => {
    if (!to.trim() || !subject.trim()) {
      return
    }

    const emailData = {
      to: to.split(',').map((email: string) => email.trim()),
      cc: cc ? cc.split(',').map((email: string) => email.trim()) : undefined,
      bcc: bcc ? bcc.split(',').map((email: string) => email.trim()) : undefined,
      subject,
      html: useTemplate ? undefined : htmlContent,
      text: useTemplate ? undefined : textContent,
      templateId: useTemplate ? selectedTemplate : undefined,
      variables: useTemplate ? variables : undefined,
      attachments
    }

    const result = await sendEmail(emailData)
    if (result.success) {
      onClose()
    }
  }

  const handleSaveDraft = async () => {
    const draftData = {
      to,
      cc,
      bcc,
      subject,
      html: htmlContent,
      text: textContent,
      templateId: useTemplate ? selectedTemplate : undefined,
      variables,
      attachments
    }

    await saveDraft(draftData)
  }

  const addVariable = (key: string, value: string) => {
    setVariables(prev => ({ ...prev, [key]: value }))
  }

  const removeVariable = (key: string) => {
    setVariables(prev => {
      const updated = { ...prev }
      delete updated[key]
      return updated
    })
  }

  const processTemplate = (template: string, vars: Record<string, string>) => {
    let processed = template
    Object.entries(vars).forEach(([key, value]) => {
      processed = processed.replace(new RegExp(`{{${key}}}`, 'g'), value)
    })
    return processed
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>Escrever E-mail</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setPreviewMode(!previewMode)}>
              <Eye className="w-4 h-4 mr-2" />
              {previewMode ? "Editar" : "Visualizar"}
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {!previewMode ? (
          <>
            {/* Cabeçalho do Email */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="to">Para *</Label>
                  <Input
                    id="to"
                    placeholder="destinatario@exemplo.com, outro@exemplo.com"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-cc"
                      checked={showCc}
                      onCheckedChange={setShowCc}
                    />
                    <Label htmlFor="show-cc">CC</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-bcc"
                      checked={showBcc}
                      onCheckedChange={setShowBcc}
                    />
                    <Label htmlFor="show-bcc">BCC</Label>
                  </div>
                </div>

                {showCc && (
                  <div>
                    <Label htmlFor="cc">Cópia (CC)</Label>
                    <Input
                      id="cc"
                      placeholder="copia@exemplo.com"
                      value={cc}
                      onChange={(e) => setCc(e.target.value)}
                    />
                  </div>
                )}

                {showBcc && (
                  <div>
                    <Label htmlFor="bcc">Cópia Oculta (BCC)</Label>
                    <Input
                      id="bcc"
                      placeholder="copia.oculta@exemplo.com"
                      value={bcc}
                      onChange={(e) => setBcc(e.target.value)}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="subject">Assunto *</Label>
                  <Input
                    id="subject"
                    placeholder="Assunto do e-mail"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Configuração de Template */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="use-template"
                  checked={useTemplate}
                  onCheckedChange={setUseTemplate}
                />
                <Label htmlFor="use-template">Usar Template</Label>
              </div>

              {useTemplate && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="template">Selecionar Template</Label>
                    <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha um template" />
                      </SelectTrigger>
                      <SelectContent>
                        {predefinedTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedTemplate !== "blank" && (
                    <div className="space-y-3">
                      <Label>Variáveis do Template</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(variables).map(([key, value]) => (
                          <div key={key} className="flex items-center space-x-2">
                            <Input
                              placeholder="Variável"
                              value={key}
                              onChange={(e) => {
                                const newKey = e.target.value
                                const newVars = { ...variables }
                                delete newVars[key]
                                newVars[newKey] = value
                                setVariables(newVars)
                              }}
                              className="flex-1"
                            />
                            <Input
                              placeholder="Valor"
                              value={value}
                              onChange={(e) => addVariable(key, e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeVariable(key)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addVariable("", "")}
                      >
                        Adicionar Variável
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Editor de Conteúdo */}
            {!useTemplate && (
              <Tabs defaultValue="html" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="html">HTML</TabsTrigger>
                  <TabsTrigger value="text">Texto</TabsTrigger>
                </TabsList>

                <TabsContent value="html" className="space-y-4">
                  <div>
                    <Label htmlFor="html-content">Conteúdo HTML</Label>
                    <Textarea
                      id="html-content"
                      placeholder="Escreva o conteúdo do e-mail em HTML..."
                      value={htmlContent}
                      onChange={(e) => setHtmlContent(e.target.value)}
                      rows={12}
                      className="font-mono"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="text" className="space-y-4">
                  <div>
                    <Label htmlFor="text-content">Conteúdo de Texto</Label>
                    <Textarea
                      id="text-content"
                      placeholder="Escreva o conteúdo do e-mail em texto simples..."
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      rows={12}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            )}

            {/* Anexos */}
            <div className="space-y-3">
              <Label>Anexos</Label>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="w-4 h-4 mr-2" />
                  Adicionar Anexo
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                  aria-label="Selecionar arquivos para anexar"
                />
              </div>
              
              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div key={`${file.name}-${index}`} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Modo Preview */
          <div className="space-y-6">
            <div className="space-y-2">
              <div><strong>Para:</strong> {to}</div>
              {cc && <div><strong>CC:</strong> {cc}</div>}
              {bcc && <div><strong>BCC:</strong> {bcc}</div>}
              <div><strong>Assunto:</strong> {subject}</div>
            </div>
            
            <div className="border rounded-lg p-4">
              {useTemplate && selectedTemplate !== "blank" ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: processTemplate(
                      predefinedTemplates.find(t => t.id === selectedTemplate)?.html || "",
                      variables
                    )
                  }}
                />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
              )}
            </div>

            {attachments.length > 0 && (
              <div>
                <strong>Anexos:</strong>
                <ul className="list-disc list-inside mt-2">
                  {attachments.map((file, index) => (
                    <li key={`preview-${file.name}-${index}`} className="text-sm">{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Ações */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={handleSaveDraft}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Rascunho
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSend} disabled={isSending || !to.trim() || !subject.trim()}>
              <Send className="w-4 h-4 mr-2" />
              {isSending ? "Enviando..." : "Enviar"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
