"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Zap, Brain, Send, Copy, Star, Clock, TrendingUp } from 'lucide-react'

interface SmartTemplate {
  id: string
  name: string
  category: string
  content: string
  usage: number
  performance: number
  lastUsed: string
  variables: string[]
}

export function SmartTemplatesWidget() {
  const [selectedTemplate, setSelectedTemplate] = useState<SmartTemplate | null>(null)
  const [message, setMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const templates: SmartTemplate[] = [
    {
      id: '1',
      name: 'Follow-up Pós-Demo',
      category: 'Vendas',
      content: 'Olá {{nome}}, obrigado pela demonstração hoje! Com base no seu interesse em {{produto}}, preparei uma proposta personalizada. Quando podemos conversar sobre os próximos passos?',
      usage: 156,
      performance: 85,
      lastUsed: '2024-01-15T10:30:00Z',
      variables: ['nome', 'produto']
    },
    {
      id: '2',
      name: 'Reativação de Cliente',
      category: 'Retenção',
      content: 'Sentimos sua falta, {{nome}}! Temos novidades incríveis em {{area_interesse}}. Que tal uma conversa rápida para mostrar as novidades?',
      usage: 89,
      performance: 72,
      lastUsed: '2024-01-14T15:45:00Z',
      variables: ['nome', 'area_interesse']
    },
    {
      id: '3',
      name: 'Agradecimento Pós-Compra',
      category: 'Suporte',
      content: 'Parabéns pela escolha, {{nome}}! Seu {{produto}} será entregue em {{prazo}}. Nossa equipe está disponível para qualquer dúvida. Avalie nossa experiência: {{link_avaliacao}}',
      usage: 234,
      performance: 92,
      lastUsed: '2024-01-15T09:15:00Z',
      variables: ['nome', 'produto', 'prazo', 'link_avaliacao']
    },
    {
      id: '4',
      name: 'Recuperação de Carrinho',
      category: 'E-commerce',
      content: 'Olá {{nome}}, notamos que você esqueceu alguns itens no seu carrinho. Finalize sua compra e ganhe {{desconto}}% de desconto! Válido até {{data_limite}}.',
      usage: 445,
      performance: 68,
      lastUsed: '2024-01-15T11:20:00Z',
      variables: ['nome', 'desconto', 'data_limite']
    }
  ]

  const categories = ['Todos', 'Vendas', 'Retenção', 'Suporte', 'E-commerce']
  const [activeCategory, setActiveCategory] = useState('Todos')

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = activeCategory === 'Todos' || template.category === activeCategory
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const selectTemplate = (template: SmartTemplate) => {
    let content = template.content
    template.variables.forEach(variable => {
      content = content.replace(`{{${variable}}}`, `[${variable.toUpperCase()}]`)
    })
    setMessage(content)
    setSelectedTemplate(template)
  }

  const copyTemplate = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const getPerformanceColor = (performance: number) => {
    if (performance >= 80) return 'text-green-600'
    if (performance >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'Vendas': 'bg-blue-100 text-blue-800',
      'Retenção': 'bg-purple-100 text-purple-800',
      'Suporte': 'bg-green-100 text-green-800',
      'E-commerce': 'bg-orange-100 text-orange-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Templates Inteligentes
          <Badge variant="secondary" className="ml-auto">
            IA
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Busca e Filtros */}
        <div className="space-y-3">
          <Input
            placeholder="Buscar templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Lista de Templates */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {filteredTemplates.map((template) => (
            <button
              key={template.id}
              className="w-full border rounded-lg p-3 text-left hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => selectTemplate(template)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-sm">{template.name}</h4>
                  <Badge className={getCategoryColor(template.category)}>
                    {template.category}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    copyTemplate(template.content)
                  }}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                {template.content}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {template.usage} usos
                  </span>
                  <span className={`flex items-center gap-1 ${getPerformanceColor(template.performance)}`}>
                    <Star className="h-3 w-3" />
                    {template.performance}%
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(template.lastUsed).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Editor de Mensagem */}
        <div className="space-y-3 border-t pt-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Mensagem Personalizada</h4>
            {selectedTemplate && (
              <Badge variant="outline" className="text-xs">
                {selectedTemplate.name}
              </Badge>
            )}
          </div>
          
          <Textarea
            placeholder="Digite ou selecione um template acima..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />
          
          <div className="flex gap-2">
            <Button className="flex-1" disabled={!message.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Enviar
            </Button>
            <Button variant="outline" onClick={() => setMessage('')}>
              Limpar
            </Button>
          </div>
        </div>

        {/* Sugestões IA */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Sugestão IA</span>
          </div>
          <p className="text-xs text-blue-700">
            Baseado no contexto do cliente, recomendamos o template "Follow-up Pós-Demo" 
            com 85% de taxa de conversão.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
