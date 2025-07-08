"use client"

import { useState, useCallback } from 'react'

export interface ChatGPTConfig {
  apiKey: string
  model: 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-turbo'
  organization?: string
  maxTokens?: number
  temperature?: number
}

export interface NLPConfig {
  language: 'pt' | 'en' | 'es'
  models: {
    sentiment: string
    intent: string
    entity: string
  }
}

export interface ChatMessage {
  id: string
  role: 'system' | 'user' | 'assistant'
  content: string
  timestamp: Date
  tokens?: number
  metadata?: Record<string, any>
}

export interface ChatSession {
  id: string
  userId: string
  messages: ChatMessage[]
  context: Record<string, any>
  createdAt: Date
  updatedAt: Date
  status: 'active' | 'closed' | 'escalated'
}

export interface SentimentAnalysis {
  text: string
  sentiment: 'positive' | 'negative' | 'neutral'
  confidence: number
  emotions: Array<{
    emotion: string
    intensity: number
  }>
  keywords: string[]
  createdAt: Date
}

export interface IntentClassification {
  text: string
  intent: string
  confidence: number
  entities: Array<{
    entity: string
    value: string
    confidence: number
    start: number
    end: number
  }>
  metadata: Record<string, any>
  createdAt: Date
}

export interface EntityExtraction {
  text: string
  entities: Array<{
    type: 'person' | 'organization' | 'location' | 'product' | 'date' | 'phone' | 'email' | 'money'
    value: string
    confidence: number
    start: number
    end: number
    normalized?: string
  }>
  createdAt: Date
}

export interface AutoSummary {
  originalText: string
  summary: string
  keyPoints: string[]
  topics: string[]
  wordCount: {
    original: number
    summary: number
    reduction: number
  }
  createdAt: Date
}

export interface SmartResponse {
  originalMessage: string
  suggestedResponses: Array<{
    response: string
    tone: 'professional' | 'friendly' | 'formal' | 'casual'
    confidence: number
    intent: string
  }>
  context: Record<string, any>
  createdAt: Date
}

export class ChatGPTIntegration {
  private config: ChatGPTConfig
  private baseUrl = 'https://api.openai.com/v1'

  constructor(config: ChatGPTConfig) {
    this.config = config
  }

  async sendMessage(
    messages: Array<{role: string, content: string}>,
    systemPrompt?: string
  ): Promise<{
    response: string
    tokens: {
      prompt: number
      completion: number
      total: number
    }
    model: string
    finishReason: string
  }> {
    const requestMessages = [...messages]
    
    if (systemPrompt) {
      requestMessages.unshift({ role: 'system', content: systemPrompt })
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        ...(this.config.organization && { 'OpenAI-Organization': this.config.organization })
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: requestMessages,
        max_tokens: this.config.maxTokens || 1000,
        temperature: this.config.temperature || 0.7,
        stream: false
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`ChatGPT API error: ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()
    const choice = data.choices[0]

    return {
      response: choice.message.content,
      tokens: {
        prompt: data.usage.prompt_tokens,
        completion: data.usage.completion_tokens,
        total: data.usage.total_tokens
      },
      model: data.model,
      finishReason: choice.finish_reason
    }
  }

  async generateSmartResponse(
    customerMessage: string,
    context: Record<string, any> = {},
    tone: 'professional' | 'friendly' | 'formal' | 'casual' = 'professional'
  ): Promise<SmartResponse> {
    const systemPrompt = `
      Você é um assistente de atendimento ao cliente especializado em gerar respostas ${tone}s e úteis.
      
      Contexto do cliente:
      ${JSON.stringify(context, null, 2)}
      
      Gere 3 opções de resposta diferentes para a mensagem do cliente, cada uma com um tom ligeiramente diferente mas mantendo o tom geral ${tone}.
      
      Retorne apenas um JSON válido no formato:
      {
        "responses": [
          {
            "response": "texto da resposta",
            "tone": "tom específico",
            "confidence": 0.9,
            "intent": "intenção detectada"
          }
        ]
      }
    `

    try {
      const result = await this.sendMessage([
        { role: 'user', content: customerMessage }
      ], systemPrompt)

      const parsed = JSON.parse(result.response)
      
      return {
        originalMessage: customerMessage,
        suggestedResponses: parsed.responses || [],
        context,
        createdAt: new Date()
      }
    } catch (error) {
      // Fallback responses if AI fails
      return {
        originalMessage: customerMessage,
        suggestedResponses: [
          {
            response: "Obrigado por entrar em contato conosco. Vou analisar sua solicitação e retornar em breve.",
            tone: 'professional',
            confidence: 0.8,
            intent: 'general_inquiry'
          }
        ],
        context,
        createdAt: new Date()
      }
    }
  }

  async summarizeConversation(messages: ChatMessage[]): Promise<AutoSummary> {
    const conversationText = messages
      .filter(m => m.role !== 'system')
      .map(m => `${m.role}: ${m.content}`)
      .join('\n')

    const systemPrompt = `
      Analise a conversa a seguir e crie um resumo estruturado.
      
      Retorne apenas um JSON válido no formato:
      {
        "summary": "resumo da conversa",
        "keyPoints": ["ponto 1", "ponto 2", "ponto 3"],
        "topics": ["tópico 1", "tópico 2"],
        "sentiment": "positive|negative|neutral"
      }
    `

    try {
      const result = await this.sendMessage([
        { role: 'user', content: conversationText }
      ], systemPrompt)

      const parsed = JSON.parse(result.response)
      
      return {
        originalText: conversationText,
        summary: parsed.summary || 'Resumo não disponível',
        keyPoints: parsed.keyPoints || [],
        topics: parsed.topics || [],
        wordCount: {
          original: conversationText.split(' ').length,
          summary: (parsed.summary || '').split(' ').length,
          reduction: 0
        },
        createdAt: new Date()
      }
    } catch (error) {
      return {
        originalText: conversationText,
        summary: 'Erro ao gerar resumo automático',
        keyPoints: [],
        topics: [],
        wordCount: {
          original: conversationText.split(' ').length,
          summary: 0,
          reduction: 0
        },
        createdAt: new Date()
      }
    }
  }

  async extractInformation(text: string): Promise<{
    entities: EntityExtraction['entities']
    intent: string
    sentiment: 'positive' | 'negative' | 'neutral'
    urgency: 'low' | 'medium' | 'high'
    category: string
  }> {
    const systemPrompt = `
      Analise o texto e extraia as seguintes informações:
      
      Retorne apenas um JSON válido no formato:
      {
        "entities": [
          {
            "type": "person|organization|location|product|date|phone|email|money",
            "value": "valor extraído",
            "confidence": 0.9,
            "start": 0,
            "end": 10
          }
        ],
        "intent": "intenção principal",
        "sentiment": "positive|negative|neutral",
        "urgency": "low|medium|high",
        "category": "categoria do problema/solicitação"
      }
    `

    try {
      const result = await this.sendMessage([
        { role: 'user', content: text }
      ], systemPrompt)

      return JSON.parse(result.response)
    } catch (error) {
      return {
        entities: [],
        intent: 'unknown',
        sentiment: 'neutral',
        urgency: 'medium',
        category: 'general'
      }
    }
  }
}

export class AdvancedNLPProcessor {
  private config: NLPConfig
  private sentimentCache: Map<string, SentimentAnalysis> = new Map()
  private intentCache: Map<string, IntentClassification> = new Map()

  constructor(config: NLPConfig) {
    this.config = config
  }

  async analyzeSentiment(text: string): Promise<SentimentAnalysis> {
    // Check cache first
    const cached = this.sentimentCache.get(text)
    if (cached) return cached

    // Simulate advanced sentiment analysis
    const sentiment = this.classifySentiment(text)
    const emotions = this.extractEmotions(text)
    const keywords = this.extractKeywords(text)

    const analysis: SentimentAnalysis = {
      text,
      sentiment: sentiment.label,
      confidence: sentiment.confidence,
      emotions,
      keywords,
      createdAt: new Date()
    }

    // Cache result
    this.sentimentCache.set(text, analysis)
    
    return analysis
  }

  async classifyIntent(text: string): Promise<IntentClassification> {
    // Check cache first
    const cached = this.intentCache.get(text)
    if (cached) return cached

    const { intent, confidence } = this.detectIntent(text)
    const rawEntities = await this.extractEntities(text)

    // Map to expected structure (entity instead of type)
    const entities = rawEntities.map(e => ({
      entity: e.type,
      value: e.value,
      confidence: e.confidence,
      start: e.start,
      end: e.end
    }))

    const classification: IntentClassification = {
      text,
      intent,
      confidence,
      entities,
      metadata: {
        language: this.config.language,
        wordCount: text.split(' ').length
      },
      createdAt: new Date()
    }

    // Cache result
    this.intentCache.set(text, classification)
    
    return classification
  }

  async extractEntities(text: string): Promise<EntityExtraction['entities']> {
    const entities: EntityExtraction['entities'] = []

    // Email detection
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
    let match
    while ((match = emailRegex.exec(text)) !== null) {
      entities.push({
        type: 'email',
        value: match[0],
        confidence: 0.95,
        start: match.index,
        end: match.index + match[0].length
      })
    }

    // Phone detection (Brazilian format)
    const phoneRegex = /(?:\+55\s?)?(?:\(?\d{2}\)?\s?)(?:9?\d{4}[-\s]?\d{4})/g
    while ((match = phoneRegex.exec(text)) !== null) {
      entities.push({
        type: 'phone',
        value: match[0],
        confidence: 0.9,
        start: match.index,
        end: match.index + match[0].length,
        normalized: this.normalizePhone(match[0])
      })
    }

    // Money detection (Brazilian currency)
    const moneyRegex = /R\$\s?[\d.,]+/g
    while ((match = moneyRegex.exec(text)) !== null) {
      entities.push({
        type: 'money',
        value: match[0],
        confidence: 0.95,
        start: match.index,
        end: match.index + match[0].length,
        normalized: this.normalizeMoney(match[0])
      })
    }

    // Date detection
    const dateRegex = /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g
    while ((match = dateRegex.exec(text)) !== null) {
      entities.push({
        type: 'date',
        value: match[0],
        confidence: 0.85,
        start: match.index,
        end: match.index + match[0].length
      })
    }

    // Person names (simplified - would use a proper NER model in production)
    const nameRegex = /\b[A-ZÁÊÇÕÃ][a-záêçõã]+(?:\s[A-ZÁÊÇÕÃ][a-záêçõã]+)+\b/g
    while ((match = nameRegex.exec(text)) !== null) {
      entities.push({
        type: 'person',
        value: match[0],
        confidence: 0.7,
        start: match.index,
        end: match.index + match[0].length
      })
    }

    return entities
  }

  async generateAutoResponse(
    message: string,
    context: Record<string, any> = {}
  ): Promise<{
    response: string
    confidence: number
    responseType: 'greeting' | 'information' | 'support' | 'closing' | 'escalation'
  }> {
    const intent = await this.classifyIntent(message)
    const sentiment = await this.analyzeSentiment(message)

    let response = ''
    let responseType: any = 'information'
    let confidence = 0.8

    // Generate response based on intent and sentiment
    switch (intent.intent) {
      case 'greeting':
        response = this.generateGreeting(sentiment.sentiment)
        responseType = 'greeting'
        confidence = 0.9
        break
      case 'problem_report':
        response = this.generateProblemResponse(sentiment.sentiment)
        responseType = 'support'
        confidence = 0.85
        break
      case 'information_request':
        response = this.generateInformationResponse()
        responseType = 'information'
        confidence = 0.8
        break
      case 'complaint':
        response = this.generateComplaintResponse()
        responseType = 'escalation'
        confidence = 0.9
        break
      default:
        response = this.generateDefaultResponse()
        responseType = 'information'
        confidence = 0.7
    }

    return { response, confidence, responseType }
  }

  // Private helper methods
  private classifySentiment(text: string): { label: 'positive' | 'negative' | 'neutral', confidence: number } {
    // Simplified sentiment analysis - would use a proper model in production
    const positiveWords = ['bom', 'ótimo', 'excelente', 'perfeito', 'maravilhoso', 'obrigado', 'parabéns']
    const negativeWords = ['ruim', 'péssimo', 'horrível', 'problema', 'erro', 'falha', 'reclamação']

    const words = text.toLowerCase().split(/\s+/)
    let positiveScore = 0
    let negativeScore = 0

    words.forEach(word => {
      if (positiveWords.includes(word)) positiveScore++
      if (negativeWords.includes(word)) negativeScore++
    })

    if (positiveScore > negativeScore) {
      return { label: 'positive', confidence: Math.min(0.95, 0.6 + positiveScore * 0.1) }
    } else if (negativeScore > positiveScore) {
      return { label: 'negative', confidence: Math.min(0.95, 0.6 + negativeScore * 0.1) }
    } else {
      return { label: 'neutral', confidence: 0.8 }
    }
  }

  private extractEmotions(text: string): Array<{ emotion: string, intensity: number }> {
    const emotionPatterns = {
      'alegria': ['feliz', 'alegre', 'contente', 'satisfeito'],
      'raiva': ['irritado', 'bravo', 'furioso', 'nervoso'],
      'tristeza': ['triste', 'chateado', 'decepcionado'],
      'medo': ['preocupado', 'ansioso', 'receoso'],
      'surpresa': ['surpreso', 'impressionado', 'chocado']
    }

    const emotions: Array<{ emotion: string, intensity: number }> = []
    const words = text.toLowerCase().split(/\s+/)

    Object.entries(emotionPatterns).forEach(([emotion, patterns]) => {
      const matches = patterns.filter(pattern => words.includes(pattern)).length
      if (matches > 0) {
        emotions.push({
          emotion,
          intensity: Math.min(1, matches * 0.3)
        })
      }
    })

    return emotions
  }

  private extractKeywords(text: string): string[] {
    // Simplified keyword extraction
    const stopWords = ['o', 'a', 'os', 'as', 'um', 'uma', 'de', 'do', 'da', 'em', 'no', 'na', 'para', 'com', 'por', 'que', 'se', 'não', 'é', 'eu', 'você', 'ele', 'ela']
    const words = text.toLowerCase().split(/\s+/).filter(word => 
      word.length > 3 && !stopWords.includes(word)
    )

    // Count word frequency
    const wordCount = new Map<string, number>()
    words.forEach(word => {
      wordCount.set(word, (wordCount.get(word) || 0) + 1)
    })

    // Return top keywords
    return Array.from(wordCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word)
  }

  private detectIntent(text: string): { intent: string, confidence: number } {
    const intentPatterns = {
      greeting: ['olá', 'oi', 'bom dia', 'boa tarde', 'boa noite'],
      problem_report: ['problema', 'erro', 'não funciona', 'falha', 'bug'],
      information_request: ['como', 'quando', 'onde', 'quanto', 'qual', 'gostaria de saber'],
      complaint: ['reclamação', 'insatisfeito', 'péssimo', 'horrível'],
      farewell: ['tchau', 'até logo', 'obrigado', 'valeu']
    }

    const textLower = text.toLowerCase()
    let bestIntent = 'unknown'
    let bestScore = 0

    Object.entries(intentPatterns).forEach(([intent, patterns]) => {
      const score = patterns.filter(pattern => textLower.includes(pattern)).length
      if (score > bestScore) {
        bestScore = score
        bestIntent = intent
      }
    })

    return {
      intent: bestIntent,
      confidence: bestScore > 0 ? Math.min(0.95, 0.6 + bestScore * 0.15) : 0.3
    }
  }

  private generateGreeting(sentiment: string): string {
    const greetings = {
      positive: "Olá! Que bom ter você aqui! Como posso ajudá-lo hoje?",
      negative: "Olá! Percebo que pode estar enfrentando alguma dificuldade. Estou aqui para ajudar.",
      neutral: "Olá! Seja bem-vindo! Em que posso ajudá-lo?"
    }
    return greetings[sentiment as keyof typeof greetings] || greetings.neutral
  }

  private generateProblemResponse(sentiment: string): string {
    return "Entendo que você está enfrentando um problema. Vou fazer o possível para ajudá-lo a resolver essa situação. Pode me fornecer mais detalhes sobre o que está acontecendo?"
  }

  private generateInformationResponse(): string {
    return "Ficarei feliz em fornecer as informações que você precisa. Pode me dar mais detalhes sobre o que gostaria de saber?"
  }

  private generateComplaintResponse(): string {
    return "Lamento muito que tenha tido essa experiência. Sua opinião é muito importante para nós. Gostaria de transferir seu atendimento para um especialista que pode ajudá-lo melhor?"
  }

  private generateDefaultResponse(): string {
    return "Obrigado por entrar em contato. Estou aqui para ajudar. Pode me explicar um pouco mais sobre sua necessidade?"
  }

  private normalizePhone(phone: string): string {
    return phone.replace(/\D/g, '')
  }

  private normalizeMoney(money: string): string {
    return money.replace(/[^\d,]/g, '').replace(',', '.')
  }
}

// Unified AI Assistant
export class UnifiedAIAssistant {
  private chatgpt?: ChatGPTIntegration
  private nlp: AdvancedNLPProcessor
  private sessions: Map<string, ChatSession> = new Map()

  constructor(configs: {
    chatgpt?: ChatGPTConfig
    nlp: NLPConfig
  }) {
    if (configs.chatgpt) {
      this.chatgpt = new ChatGPTIntegration(configs.chatgpt)
    }
    this.nlp = new AdvancedNLPProcessor(configs.nlp)
  }

  async processMessage(
    userId: string,
    message: string,
    context: Record<string, any> = {}
  ): Promise<{
    response: string
    confidence: number
    shouldEscalate: boolean
    analysis: {
      sentiment: SentimentAnalysis
      intent: IntentClassification
      entities: EntityExtraction['entities']
    }
  }> {
    // Analyze the message
    const sentiment = await this.nlp.analyzeSentiment(message)
    const intent = await this.nlp.classifyIntent(message)
    const entities = await this.nlp.extractEntities(message)

    // Determine if escalation is needed
    const shouldEscalate = this.shouldEscalateToHuman(sentiment, intent, context)

    let response: string
    let confidence: number

    if (shouldEscalate) {
      response = "Vou transferir seu atendimento para um de nossos especialistas que poderá ajudá-lo melhor. Por favor, aguarde um momento."
      confidence = 1.0
    } else if (this.chatgpt && intent.confidence > 0.7) {
      // Use ChatGPT for high-confidence intents
      try {
        const smartResponse = await this.chatgpt.generateSmartResponse(message, context)
        response = smartResponse.suggestedResponses[0]?.response || "Posso ajudá-lo com mais informações?"
        confidence = smartResponse.suggestedResponses[0]?.confidence || 0.8
      } catch (error) {
        // Fallback to NLP response
        const autoResponse = await this.nlp.generateAutoResponse(message, context)
        response = autoResponse.response
        confidence = autoResponse.confidence
      }
    } else {
      // Use NLP for general responses
      const autoResponse = await this.nlp.generateAutoResponse(message, context)
      response = autoResponse.response
      confidence = autoResponse.confidence
    }

    // Update session
    this.updateSession(userId, message, response, context)

    return {
      response,
      confidence,
      shouldEscalate,
      analysis: {
        sentiment,
        intent,
        entities
      }
    }
  }

  private shouldEscalateToHuman(
    sentiment: SentimentAnalysis,
    intent: IntentClassification,
    context: Record<string, any>
  ): boolean {
    // Escalate if very negative sentiment
    if (sentiment.sentiment === 'negative' && sentiment.confidence > 0.8) {
      return true
    }

    // Escalate if complaint intent
    if (intent.intent === 'complaint') {
      return true
    }

    // Escalate if complex entities detected (multiple phone numbers, high-value money)
    const hasComplexEntities = intent.entities.some(entity => 
      (entity.entity === 'money' && parseFloat((entity as any).normalized || '0') > 10000) ||
      intent.entities.filter(e => e.entity === 'phone').length > 1
    )

    if (hasComplexEntities) {
      return true
    }

    // Escalate if this is a repeated contact within short time
    if (context.lastContact && (Date.now() - new Date(context.lastContact).getTime()) < 3600000) {
      return true
    }

    return false
  }

  private updateSession(userId: string, userMessage: string, botResponse: string, context: Record<string, any>): void {
    let session = this.sessions.get(userId)
    
    if (!session) {
      session = {
        id: `session_${userId}_${Date.now()}`,
        userId,
        messages: [],
        context,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active'
      }
    }

    // Add user message
    session.messages.push({
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    })

    // Add bot response
    session.messages.push({
      id: `msg_${Date.now()}_bot`,
      role: 'assistant',
      content: botResponse,
      timestamp: new Date()
    })

    session.updatedAt = new Date()
    this.sessions.set(userId, session)
  }

  async getSummary(userId: string): Promise<AutoSummary | null> {
    const session = this.sessions.get(userId)
    if (!session || !this.chatgpt) return null

    return this.chatgpt.summarizeConversation(session.messages)
  }

  getSession(userId: string): ChatSession | null {
    return this.sessions.get(userId) || null
  }

  closeSession(userId: string): void {
    const session = this.sessions.get(userId)
    if (session) {
      session.status = 'closed'
      session.updatedAt = new Date()
    }
  }
}

// React Hook for AI Integration
export function useAIAssistant(configs: { chatgpt?: ChatGPTConfig, nlp: NLPConfig }) {
  const [assistant] = useState(() => new UnifiedAIAssistant(configs))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const processMessage = useCallback(async (
    userId: string,
    message: string,
    context: Record<string, any> = {}
  ) => {
    setIsLoading(true)
    setError(null)
    try {
      return await assistant.processMessage(userId, message, context)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [assistant])

  const getSummary = useCallback(async (userId: string) => {
    return await assistant.getSummary(userId)
  }, [assistant])

  const getSession = useCallback((userId: string) => {
    return assistant.getSession(userId)
  }, [assistant])

  const closeSession = useCallback((userId: string) => {
    assistant.closeSession(userId)
  }, [assistant])

  return {
    processMessage,
    getSummary,
    getSession,
    closeSession,
    isLoading,
    error,
    assistant
  }
}
