"use client"

import { useState } from "react"
import { Database, Search, Copy, Check, Code, BookOpen, ArrowLeft, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

const endpoints = [
  {
    method: "GET",
    path: "/api/v1/contacts",
    description: "Lista todos os contatos",
    category: "CRM",
    params: ["limit", "offset", "search"],
    example: `{
  "data": [
    {
      "id": "1",
      "name": "João Silva",
      "email": "joao@empresa.com",
      "phone": "+55 11 99999-9999",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "total": 2847,
    "page": 1,
    "limit": 50
  }
}`
  },
  {
    method: "POST",
    path: "/api/v1/contacts",
    description: "Cria um novo contato",
    category: "CRM",
    params: ["name", "email", "phone"],
    example: `{
  "name": "Maria Santos",
  "email": "maria@empresa.com",
  "phone": "+55 11 88888-8888"
}`
  },
  {
    method: "GET",
    path: "/api/v1/messages",
    description: "Lista mensagens de uma conversa",
    category: "Comunicações",
    params: ["contact_id", "limit", "offset"],
    example: `{
  "data": [
    {
      "id": "msg_123",
      "contact_id": "1",
      "message": "Olá! Como posso ajudar?",
      "type": "text",
      "direction": "outbound",
      "created_at": "2024-01-15T14:30:00Z"
    }
  ]
}`
  },
  {
    method: "POST",
    path: "/api/v1/messages/send",
    description: "Envia uma mensagem",
    category: "Comunicações",
    params: ["contact_id", "message", "type"],
    example: `{
  "contact_id": "1",
  "message": "Obrigado pelo contato!",
  "type": "text"
}`
  },
  {
    method: "GET",
    path: "/api/v1/bots",
    description: "Lista todos os bots configurados",
    category: "Automação",
    params: ["status", "limit"],
    example: `{
  "data": [
    {
      "id": "bot_001",
      "name": "Bot Atendimento",
      "status": "active",
      "flows": 12,
      "conversations": 847
    }
  ]
}`
  },
  {
    method: "GET",
    path: "/api/v1/analytics/dashboard",
    description: "Métricas do dashboard",
    category: "Analytics",
    params: ["period", "metrics"],
    example: `{
  "contacts": {
    "total": 2847,
    "growth": 12.5
  },
  "messages": {
    "total": 15420,
    "growth": 8.3
  },
  "conversions": {
    "rate": 23.4,
    "growth": 5.7
  }
}`
  }
]

const authentication = [
  {
    title: "API Key",
    description: "Inclua sua API key no header Authorization",
    example: `Authorization: Bearer your_api_key_here`
  },
  {
    title: "Rate Limiting",
    description: "Limite de 1000 requisições por hora",
    example: `X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200`
  }
]

export default function APIPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const categories = ["Todos", "CRM", "Comunicações", "Automação", "Analytics"]
  
  const filteredEndpoints = endpoints.filter(endpoint => {
    const matchesSearch = endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         endpoint.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "Todos" || endpoint.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      case "POST": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
      case "PUT": return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300"
      case "DELETE": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/docs">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Documentação
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Database className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">API Reference</h1>
            <p className="text-muted-foreground">
              Documentação completa da API REST do CRM Pro Dashboard
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <Badge variant="secondary">v1.0</Badge>
          <Badge variant="outline">REST API</Badge>
          <Badge variant="outline">JSON</Badge>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs defaultValue="endpoints" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="authentication">Autenticação</TabsTrigger>
          <TabsTrigger value="examples">Exemplos</TabsTrigger>
          <TabsTrigger value="sdks">SDKs</TabsTrigger>
        </TabsList>

        {/* Endpoints Tab */}
        <TabsContent value="endpoints" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar endpoints..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endpoints List */}
          <div className="space-y-4">
            {filteredEndpoints.map((endpoint, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={getMethodColor(endpoint.method)}>
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {endpoint.path}
                      </code>
                    </div>
                    <Badge variant="outline">{endpoint.category}</Badge>
                  </div>
                  <CardDescription>{endpoint.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Parameters */}
                    {endpoint.params.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Parâmetros</h4>
                        <div className="flex gap-2 flex-wrap">
                          {endpoint.params.map((param) => (
                            <Badge key={param} variant="secondary">
                              {param}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Example Response */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Exemplo de Resposta</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(endpoint.example, `endpoint-${index}`)}
                        >
                          {copiedCode === `endpoint-${index}` ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{endpoint.example}</code>
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEndpoints.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  Nenhum endpoint encontrado com os filtros aplicados.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Authentication Tab */}
        <TabsContent value="authentication" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Autenticação da API</CardTitle>
              <CardDescription>
                Como autenticar suas requisições para a API do CRM Pro
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {authentication.map((auth, index) => (
                <div key={index} className="space-y-3">
                  <h3 className="text-lg font-semibold">{auth.title}</h3>
                  <p className="text-muted-foreground">{auth.description}</p>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{auth.example}</code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(auth.example, `auth-${index}`)}
                    >
                      {copiedCode === `auth-${index}` ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}

              <Alert>
                <Database className="h-4 w-4" />
                <AlertDescription>
                  <strong>Importante:</strong> Mantenha sua API key segura e nunca a exponha em código client-side.
                  Use variáveis de ambiente para armazenar credenciais sensíveis.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Examples Tab */}
        <TabsContent value="examples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exemplos Práticos</CardTitle>
              <CardDescription>
                Exemplos de uso da API em diferentes linguagens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="javascript" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                </TabsList>

                <TabsContent value="javascript">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Listar Contatos</h4>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`// Usando fetch API
const response = await fetch('/api/v1/contacts', {
  headers: {
    'Authorization': 'Bearer your_api_key_here',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);`}</code>
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="python">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Listar Contatos</h4>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`import requests

headers = {
    'Authorization': 'Bearer your_api_key_here',
    'Content-Type': 'application/json'
}

response = requests.get('/api/v1/contacts', headers=headers)
data = response.json()
print(data)`}</code>
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="curl">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Listar Contatos</h4>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`curl -X GET \\
  -H "Authorization: Bearer your_api_key_here" \\
  -H "Content-Type: application/json" \\
  "https://api.crmpro.com/v1/contacts"`}</code>
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SDKs Tab */}
        <TabsContent value="sdks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SDKs Oficiais</CardTitle>
              <CardDescription>
                Bibliotecas oficiais para integração com a API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">JavaScript/Node.js</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-3 rounded text-sm mb-4">
                      <code>npm install @crmrpo/sdk</code>
                    </pre>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="#" className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Documentação
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Python</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-3 rounded text-sm mb-4">
                      <code>pip install crmrpo-sdk</code>
                    </pre>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="#" className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Documentação
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Links */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Links Úteis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/docs/quick-start">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Início Rápido
              </Button>
            </Link>
            <Link href="/docs/integrations">
              <Button variant="outline" className="w-full justify-start">
                <Code className="h-4 w-4 mr-2" />
                Integrações
              </Button>
            </Link>
            <Link href="/docs/guides">
              <Button variant="outline" className="w-full justify-start">
                <ExternalLink className="h-4 w-4 mr-2" />
                Guias Avançados
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
