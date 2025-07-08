"use client"

import { useState } from "react"
import { 
  ArrowLeft,
  Settings,
  Plus,
  Edit,
  Trash2,
  Clock,
  User,
  Star,
  Type,
  Hash,
  Calendar,
  ToggleLeft,
  List,
  FileText,
  CheckSquare,
  Copy,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Database,
  BarChart3,
  Filter,
  Tags
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"

export default function CustomFieldsGuide() {
  const [copiedCode, setCopiedCode] = useState("")
  const [newFieldName, setNewFieldName] = useState("")
  const [newFieldType, setNewFieldType] = useState("text")

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(""), 2000)
  }

  const fieldTypes = [
    { 
      value: "text", 
      label: "Texto", 
      icon: Type, 
      description: "Campo de texto livre",
      examples: ["Nome da empresa", "Observações", "Cargo"]
    },
    { 
      value: "number", 
      label: "Número", 
      icon: Hash, 
      description: "Valores numéricos",
      examples: ["Receita anual", "Número de funcionários", "Score"]
    },
    { 
      value: "date", 
      label: "Data", 
      icon: Calendar, 
      description: "Campos de data",
      examples: ["Data de nascimento", "Próximo contato", "Vencimento"]
    },
    { 
      value: "boolean", 
      label: "Sim/Não", 
      icon: ToggleLeft, 
      description: "Campos verdadeiro/falso",
      examples: ["Cliente ativo", "Aceita marketing", "Premium"]
    },
    { 
      value: "select", 
      label: "Lista", 
      icon: List, 
      description: "Seleção de opções",
      examples: ["Segmento", "Fonte", "Status"]
    },
    { 
      value: "textarea", 
      label: "Texto longo", 
      icon: FileText, 
      description: "Textos extensos",
      examples: ["Descrição detalhada", "Notas", "Histórico"]
    }
  ]

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/docs/guides" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Guias
        </Link>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
            <Settings className="h-6 w-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Campos Personalizados</h1>
            <p className="text-muted-foreground">Como criar e gerenciar campos personalizados para suas necessidades específicas</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            15 min de leitura
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            Support Team
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            4.6 (98 avaliações)
          </div>
          <Badge variant="secondary">Iniciante</Badge>
          <Badge variant="outline">Customização</Badge>
        </div>
      </div>

      {/* Alert de Flexibilidade */}
      <Alert className="mb-8 border-orange-200 dark:border-orange-800">
        <Lightbulb className="h-4 w-4" />
        <AlertTitle>Personalize Seu CRM!</AlertTitle>
        <AlertDescription>
          Campos personalizados permitem adaptar o sistema às suas necessidades específicas de negócio, capturando informações únicas importantes para sua empresa.
        </AlertDescription>
      </Alert>

      {/* Tabs de Conteúdo */}
      <Tabs defaultValue="types" className="mb-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="types">Tipos de Campos</TabsTrigger>
          <TabsTrigger value="creation">Criação</TabsTrigger>
          <TabsTrigger value="management">Gestão</TabsTrigger>
          <TabsTrigger value="reporting">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="types" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tags className="h-5 w-5" />
                Tipos de Campos Disponíveis
              </CardTitle>
              <CardDescription>
                Conheça todos os tipos de campos que você pode criar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fieldTypes.map((type) => {
                  const IconComponent = type.icon
                  return (
                    <Card key={type.value} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                          <IconComponent className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{type.label}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{type.description}</p>
                          <div className="space-y-1">
                            <div className="text-xs font-medium text-muted-foreground">Exemplos:</div>
                            {type.examples.map((example, index) => (
                              <div key={index} className="text-xs text-muted-foreground">• {example}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold">Campos Especiais</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h5 className="font-medium text-purple-600 dark:text-purple-400 mb-2 flex items-center gap-2">
                      <CheckSquare className="h-4 w-4" />
                      Campo Calculado
                    </h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      Campos que calculam valores automaticamente baseados em outros campos
                    </p>
                    <div className="text-xs space-y-1 text-muted-foreground">
                      <div>• Idade (baseada na data de nascimento)</div>
                      <div>• Tempo como cliente</div>
                      <div>• Valor total de compras</div>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <h5 className="font-medium text-green-600 dark:text-green-400 mb-2 flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      Campo de Lookup
                    </h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      Campos que referenciam dados de outras tabelas
                    </p>
                    <div className="text-xs space-y-1 text-muted-foreground">
                      <div>• Dados da empresa do contato</div>
                      <div>• Histórico de compras</div>
                      <div>• Informações do responsável</div>
                    </div>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="creation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Criando Campos Personalizados
              </CardTitle>
              <CardDescription>
                Passo a passo para criar seus próprios campos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Interface de Criação</h4>
                <div className="bg-muted p-4 rounded-lg space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Simule a criação de um campo personalizado:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="field-name">Nome do Campo</Label>
                      <Input
                        id="field-name"
                        placeholder="Ex: Receita Anual"
                        value={newFieldName}
                        onChange={(e) => setNewFieldName(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="field-type">Tipo do Campo</Label>
                      <select 
                        id="field-type"
                        className="w-full p-2 border rounded-md bg-background"
                        value={newFieldType}
                        onChange={(e) => setNewFieldType(e.target.value)}
                        aria-label="Selecione o tipo do campo"
                      >
                        {fieldTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="required" />
                    <Label htmlFor="required">Campo obrigatório</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="unique" />
                    <Label htmlFor="unique">Valor único (não pode repetir)</Label>
                  </div>
                  
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Campo Personalizado
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Configurações Avançadas</h4>
                <div className="grid grid-cols-1 gap-4">
                  <Card className="p-4">
                    <h5 className="font-medium mb-3">Validações</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Valor mínimo/máximo</span>
                        <Badge variant="outline">Número/Data</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Padrão de texto (Regex)</span>
                        <Badge variant="outline">Texto</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Lista de valores permitidos</span>
                        <Badge variant="outline">Seleção</Badge>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h5 className="font-medium mb-3">Permissões</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Visível para todos</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Editável por usuários</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Obrigatório no cadastro</span>
                        <Switch />
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Exemplo de API</h4>
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Como criar campos via API:
                  </p>
                  <div className="bg-background p-3 rounded border font-mono text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span>POST /api/custom-fields</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(`POST /api/custom-fields
Content-Type: application/json

{
  "name": "receita_anual",
  "label": "Receita Anual",
  "type": "number",
  "entity": "contact",
  "required": false,
  "validation": {
    "min": 0,
    "max": 999999999
  },
  "options": {
    "format": "currency",
    "currency": "BRL"
  },
  "permissions": {
    "visible": ["admin", "manager", "user"],
    "editable": ["admin", "manager"]
  }
}`, "api-create-field")}
                      >
                        {copiedCode === "api-create-field" ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                    <pre className="text-muted-foreground whitespace-pre-wrap">{`POST /api/custom-fields
Content-Type: application/json

{
  "name": "receita_anual",
  "label": "Receita Anual",
  "type": "number",
  "entity": "contact",
  "required": false,
  "validation": {
    "min": 0,
    "max": 999999999
  },
  "options": {
    "format": "currency",
    "currency": "BRL"
  },
  "permissions": {
    "visible": ["admin", "manager", "user"],
    "editable": ["admin", "manager"]
  }
}`}</pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Gerenciamento de Campos
              </CardTitle>
              <CardDescription>
                Como organizar, editar e manter seus campos personalizados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Lista de Campos Existentes</h4>
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium">Campos Personalizados (12)</h5>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Campo
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {[
                      { name: "Receita Anual", type: "Número", usage: "89%", status: "Ativo" },
                      { name: "Segmento", type: "Lista", usage: "95%", status: "Ativo" },
                      { name: "Data de Renovação", type: "Data", usage: "67%", status: "Ativo" },
                      { name: "Cliente Premium", type: "Sim/Não", usage: "43%", status: "Ativo" },
                      { name: "Observações Internas", type: "Texto longo", usage: "78%", status: "Ativo" }
                    ].map((field, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-background rounded border">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-medium text-sm">{field.name}</div>
                            <div className="text-xs text-muted-foreground">{field.type} • {field.usage} de uso</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={field.status === "Ativo" ? "default" : "secondary"}>
                            {field.status}
                          </Badge>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Boas Práticas de Organização</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h5 className="font-medium text-green-600 dark:text-green-400 mb-2">✅ Faça</h5>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Use nomes descritivos e claros</li>
                      <li>• Agrupe campos relacionados</li>
                      <li>• Documente o propósito de cada campo</li>
                      <li>• Revise campos não utilizados regularmente</li>
                      <li>• Mantenha consistência nos nomes</li>
                    </ul>
                  </Card>
                  
                  <Card className="p-4">
                    <h5 className="font-medium text-red-600 dark:text-red-400 mb-2">❌ Evite</h5>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Criar muitos campos desnecessários</li>
                      <li>• Usar abreviações confusas</li>
                      <li>• Duplicar informações existentes</li>
                      <li>• Campos muito específicos</li>
                      <li>• Alterar tipos após criar dados</li>
                    </ul>
                  </Card>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Importação de Dados</h4>
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Como importar dados para campos personalizados:
                  </p>
                  <div className="bg-background p-3 rounded border font-mono text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span>CSV de Exemplo</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(`nome,email,receita_anual,segmento,cliente_premium
João Silva,joao@email.com,500000,Empresarial,true
Maria Santos,maria@email.com,150000,PME,false
Pedro Costa,pedro@email.com,2000000,Enterprise,true`, "csv-import")}
                      >
                        {copiedCode === "csv-import" ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                    <pre className="text-muted-foreground">{`nome,email,receita_anual,segmento,cliente_premium
João Silva,joao@email.com,500000,Empresarial,true
Maria Santos,maria@email.com,150000,PME,false
Pedro Costa,pedro@email.com,2000000,Enterprise,true`}</pre>
                  </div>
                  
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Dica de Importação</AlertTitle>
                    <AlertDescription>
                      Use os nomes internos dos campos (sem espaços) como cabeçalho das colunas no CSV.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reporting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Relatórios Customizados
              </CardTitle>
              <CardDescription>
                Como usar campos personalizados em relatórios e análises
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Relatórios Disponíveis</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h5 className="font-medium mb-3 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-blue-600" />
                      Distribuição por Segmento
                    </h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Enterprise</span>
                        <span className="font-medium">23 (15%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full w-[15%]"></div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Empresarial</span>
                        <span className="font-medium">67 (45%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full w-[45%]"></div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>PME</span>
                        <span className="font-medium">58 (40%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full w-[40%]"></div>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <h5 className="font-medium mb-3 flex items-center gap-2">
                      <Database className="h-4 w-4 text-green-600" />
                      Receita por Segmento
                    </h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Enterprise</span>
                        <span className="font-bold text-green-600">R$ 2.3M</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Empresarial</span>
                        <span className="font-bold text-blue-600">R$ 1.8M</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">PME</span>
                        <span className="font-bold text-orange-600">R$ 890K</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total</span>
                        <span className="font-bold">R$ 4.99M</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Filtros Avançados</h4>
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Use campos personalizados para criar filtros específicos:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-background p-3 rounded border">
                      <Label className="text-xs font-medium">Receita Anual</Label>
                      <div className="flex gap-2 mt-1">
                        <Input placeholder="Min" className="text-xs" />
                        <Input placeholder="Max" className="text-xs" />
                      </div>
                    </div>
                    
                    <div className="bg-background p-3 rounded border">
                      <Label className="text-xs font-medium">Segmento</Label>
                      <select className="w-full mt-1 p-1 border rounded text-xs bg-background" aria-label="Selecione o segmento">
                        <option>Todos</option>
                        <option>Enterprise</option>
                        <option>Empresarial</option>
                        <option>PME</option>
                      </select>
                    </div>
                    
                    <div className="bg-background p-3 rounded border">
                      <Label className="text-xs font-medium">Cliente Premium</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <input type="checkbox" id="premium" className="text-xs" aria-label="Filtrar apenas clientes premium" />
                        <Label htmlFor="premium" className="text-xs">Apenas premium</Label>
                      </div>
                    </div>
                  </div>
                  
                  <Button size="sm" className="w-full">
                    <Filter className="h-3 w-3 mr-2" />
                    Aplicar Filtros
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Exportação de Dados</h4>
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Exporte relatórios incluindo seus campos personalizados:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Exportar CSV
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Exportar Excel
                    </Button>
                  </div>
                  
                  <div className="bg-background p-3 rounded border">
                    <div className="text-xs font-medium mb-2">Campos incluídos na exportação:</div>
                    <div className="flex flex-wrap gap-2">
                      {["Nome", "Email", "Telefone", "Receita Anual", "Segmento", "Cliente Premium", "Data Renovação"].map((field) => (
                        <Badge key={field} variant="secondary" className="text-xs">
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Alert className="border-blue-200 dark:border-blue-800">
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>Dica de Análise</AlertTitle>
                <AlertDescription>
                  Campos personalizados com bom preenchimento (&gt;70%) geram insights mais confiáveis. Monitore a taxa de preenchimento regularmente.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Próximos Passos e Links */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Passos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/docs/guides/contact-management" className="block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Database className="h-6 w-6 text-blue-500" />
                    <div>
                      <h4 className="font-medium">Gestão de Contatos</h4>
                      <p className="text-sm text-muted-foreground">Organize contatos com campos personalizados</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/docs/guides/analytics-reporting" className="block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-6 w-6 text-green-500" />
                    <div>
                      <h4 className="font-medium">Analytics e Relatórios</h4>
                      <p className="text-sm text-muted-foreground">Crie relatórios com dados personalizados</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
