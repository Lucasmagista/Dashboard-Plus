"use client"

import { useState, useCallback } from 'react'

export interface MLModel {
  id: string
  name: string
  type: 'classification' | 'regression' | 'clustering' | 'nlp'
  status: 'training' | 'ready' | 'error'
  accuracy?: number
  lastTrained: Date
  features: string[]
  metadata: Record<string, any>
}

export interface Prediction {
  id: string
  modelId: string
  input: Record<string, any>
  output: any
  confidence: number
  timestamp: Date
  metadata?: Record<string, any>
}

export interface SalesPrediction {
  customerId: string
  predictedValue: number
  probability: number
  timeframe: 'week' | 'month' | 'quarter'
  factors: Array<{
    factor: string
    impact: number
    description: string
  }>
  confidence: number
  createdAt: Date
}

export interface ChurnPrediction {
  customerId: string
  churnProbability: number
  riskLevel: 'low' | 'medium' | 'high'
  factors: Array<{
    factor: string
    importance: number
    description: string
  }>
  recommendedActions: string[]
  createdAt: Date
}

export interface LeadScoringResult {
  leadId: string
  score: number
  grade: 'A' | 'B' | 'C' | 'D'
  probability: number
  factors: Array<{
    factor: string
    score: number
    weight: number
    description: string
  }>
  nextBestAction: string
  createdAt: Date
}

export interface OpportunityDetection {
  customerId: string
  opportunityType: 'upsell' | 'cross-sell' | 'renewal' | 'expansion'
  confidence: number
  estimatedValue: number
  products: Array<{
    id: string
    name: string
    probability: number
    estimatedRevenue: number
  }>
  reasoning: string[]
  bestContactTime?: Date
  createdAt: Date
}

export class MachineLearningEngine {
  private models: Map<string, MLModel> = new Map()
  private predictions: Map<string, Prediction[]> = new Map()

  constructor() {
    this.initializeDefaultModels()
  }

  private initializeDefaultModels(): void {
    // Sales Prediction Model
    this.models.set('sales-prediction', {
      id: 'sales-prediction',
      name: 'Sales Forecasting',
      type: 'regression',
      status: 'ready',
      accuracy: 0.85,
      lastTrained: new Date(),
      features: [
        'historical_sales',
        'customer_age',
        'interaction_frequency',
        'product_category',
        'seasonality',
        'marketing_campaigns',
        'economic_indicators'
      ],
      metadata: {
        algorithm: 'Random Forest',
        trainingData: 50000,
        validationScore: 0.83
      }
    })

    // Churn Prediction Model
    this.models.set('churn-prediction', {
      id: 'churn-prediction',
      name: 'Customer Churn Prediction',
      type: 'classification',
      status: 'ready',
      accuracy: 0.92,
      lastTrained: new Date(),
      features: [
        'days_since_last_purchase',
        'total_spent',
        'support_tickets',
        'login_frequency',
        'feature_usage',
        'satisfaction_score',
        'contract_length'
      ],
      metadata: {
        algorithm: 'Gradient Boosting',
        trainingData: 75000,
        validationScore: 0.89
      }
    })

    // Lead Scoring Model
    this.models.set('lead-scoring', {
      id: 'lead-scoring',
      name: 'Lead Scoring',
      type: 'classification',
      status: 'ready',
      accuracy: 0.88,
      lastTrained: new Date(),
      features: [
        'company_size',
        'industry',
        'job_title',
        'email_engagement',
        'website_activity',
        'social_media_activity',
        'content_consumption'
      ],
      metadata: {
        algorithm: 'XGBoost',
        trainingData: 100000,
        validationScore: 0.86
      }
    })

    // Opportunity Detection Model
    this.models.set('opportunity-detection', {
      id: 'opportunity-detection',
      name: 'Opportunity Detection',
      type: 'classification',
      status: 'ready',
      accuracy: 0.79,
      lastTrained: new Date(),
      features: [
        'purchase_history',
        'product_affinity',
        'usage_patterns',
        'support_interactions',
        'contract_expiration',
        'competitor_analysis'
      ],
      metadata: {
        algorithm: 'Neural Network',
        trainingData: 30000,
        validationScore: 0.76
      }
    })
  }

  // Model Management
  async getModels(): Promise<MLModel[]> {
    return Array.from(this.models.values())
  }

  async getModel(modelId: string): Promise<MLModel | null> {
    return this.models.get(modelId) || null
  }

  async trainModel(modelId: string, trainingData: any[]): Promise<MLModel> {
    const model = this.models.get(modelId)
    if (!model) {
      throw new Error(`Model ${modelId} not found`)
    }

    // Simulate training process
    model.status = 'training'
    
    // Simulate training time
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Update model with new training results
    model.status = 'ready'
    model.lastTrained = new Date()
    model.accuracy = Math.random() * 0.1 + 0.8 // Random accuracy between 0.8-0.9
    model.metadata.trainingData = trainingData.length

    this.models.set(modelId, model)
    return model
  }

  // Sales Predictions
  async predictSales(customerId: string, timeframe: 'week' | 'month' | 'quarter'): Promise<SalesPrediction> {
    const model = this.models.get('sales-prediction')
    if (!model || model.status !== 'ready') {
      throw new Error('Sales prediction model not ready')
    }

    // Simulate feature extraction and prediction
    const features = await this.extractSalesFeatures(customerId)
    const prediction = await this.runPrediction('sales-prediction', features)

    // Calculate timeframe multiplier
    const multipliers = { week: 0.25, month: 1, quarter: 3 }
    const baseValue = prediction.output * multipliers[timeframe]

    const factors = [
      {
        factor: 'Historical Purchase Pattern',
        impact: 0.35,
        description: 'Customer shows consistent purchasing behavior'
      },
      {
        factor: 'Seasonal Trends',
        impact: 0.25,
        description: 'Based on historical seasonal variations'
      },
      {
        factor: 'Market Conditions',
        impact: 0.20,
        description: 'Current market trends and economic indicators'
      },
      {
        factor: 'Customer Engagement',
        impact: 0.20,
        description: 'Recent interaction frequency and quality'
      }
    ]

    return {
      customerId,
      predictedValue: baseValue,
      probability: prediction.confidence,
      timeframe,
      factors,
      confidence: prediction.confidence,
      createdAt: new Date()
    }
  }

  async predictChurn(customerId: string): Promise<ChurnPrediction> {
    const model = this.models.get('churn-prediction')
    if (!model || model.status !== 'ready') {
      throw new Error('Churn prediction model not ready')
    }

    const features = await this.extractChurnFeatures(customerId)
    const prediction = await this.runPrediction('churn-prediction', features)

    const churnProbability = prediction.output
    const riskLevel = churnProbability > 0.7 ? 'high' : churnProbability > 0.4 ? 'medium' : 'low'

    const factors = [
      {
        factor: 'Days Since Last Purchase',
        importance: 0.3,
        description: 'Extended period without activity indicates higher churn risk'
      },
      {
        factor: 'Support Ticket Frequency',
        importance: 0.25,
        description: 'Increased support requests may indicate dissatisfaction'
      },
      {
        factor: 'Usage Decline',
        importance: 0.2,
        description: 'Decreasing product usage is a strong churn indicator'
      },
      {
        factor: 'Payment Issues',
        importance: 0.15,
        description: 'Payment delays or failures increase churn probability'
      },
      {
        factor: 'Competitor Activity',
        importance: 0.1,
        description: 'Market competition may influence customer retention'
      }
    ]

    const recommendedActions = this.generateChurnActions(riskLevel, factors)

    return {
      customerId,
      churnProbability,
      riskLevel,
      factors,
      recommendedActions,
      createdAt: new Date()
    }
  }

  async scoreLeads(leads: Array<{id: string, features: Record<string, any>}>): Promise<LeadScoringResult[]> {
    const model = this.models.get('lead-scoring')
    if (!model || model.status !== 'ready') {
      throw new Error('Lead scoring model not ready')
    }

    const results: LeadScoringResult[] = []

    for (const lead of leads) {
      const prediction = await this.runPrediction('lead-scoring', lead.features)
      
      const score = Math.round(prediction.output * 100)
      const grade = score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D'

      const factors = [
        {
          factor: 'Company Size',
          score: Math.random() * 30 + 10,
          weight: 0.25,
          description: 'Larger companies typically have higher conversion rates'
        },
        {
          factor: 'Email Engagement',
          score: Math.random() * 25 + 5,
          weight: 0.2,
          description: 'High email engagement indicates strong interest'
        },
        {
          factor: 'Website Activity',
          score: Math.random() * 20 + 5,
          weight: 0.2,
          description: 'Frequent website visits show active research'
        },
        {
          factor: 'Industry Match',
          score: Math.random() * 15 + 5,
          weight: 0.15,
          description: 'Industry alignment with our target market'
        },
        {
          factor: 'Job Title Relevance',
          score: Math.random() * 10 + 5,
          weight: 0.1,
          description: 'Decision-maker role in the organization'
        },
        {
          factor: 'Content Downloads',
          score: Math.random() * 10 + 0,
          weight: 0.1,
          description: 'Downloaded content indicates deeper interest'
        }
      ]

      const nextBestAction = this.determineNextBestAction(grade, factors)

      results.push({
        leadId: lead.id,
        score,
        grade,
        probability: prediction.confidence,
        factors,
        nextBestAction,
        createdAt: new Date()
      })
    }

    return results
  }

  async detectOpportunities(customerId: string): Promise<OpportunityDetection[]> {
    const model = this.models.get('opportunity-detection')
    if (!model || model.status !== 'ready') {
      throw new Error('Opportunity detection model not ready')
    }

    const features = await this.extractOpportunityFeatures(customerId)
    const predictions = await this.runMultiClassPrediction('opportunity-detection', features)

    const opportunities: OpportunityDetection[] = []

    for (const [opportunityType, prediction] of Object.entries(predictions)) {
      if (prediction.confidence > 0.3) { // Only return opportunities with >30% confidence
        const products = await this.getRecommendedProducts(customerId, opportunityType as any)
        
        opportunities.push({
          customerId,
          opportunityType: opportunityType as any,
          confidence: prediction.confidence,
          estimatedValue: prediction.estimatedValue || 0,
          products,
          reasoning: this.generateOpportunityReasoning(opportunityType, prediction),
          bestContactTime: this.calculateBestContactTime(customerId),
          createdAt: new Date()
        })
      }
    }

    return opportunities.sort((a, b) => b.confidence - a.confidence)
  }

  // Core Prediction Engine
  private async runPrediction(modelId: string, features: Record<string, any>): Promise<Prediction> {
    const model = this.models.get(modelId)
    if (!model) {
      throw new Error(`Model ${modelId} not found`)
    }

    // Simulate ML prediction
    await new Promise(resolve => setTimeout(resolve, 100))

    let output: any
    let confidence: number

    switch (model.type) {
      case 'regression':
        output = Math.random() * 10000 + 1000 // Random sales value
        confidence = Math.random() * 0.3 + 0.7 // 70-100% confidence
        break
      case 'classification':
        output = Math.random() // Probability 0-1
        confidence = Math.random() * 0.4 + 0.6 // 60-100% confidence
        break
      default:
        output = Math.random()
        confidence = Math.random() * 0.5 + 0.5
    }

    const prediction: Prediction = {
      id: `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      modelId,
      input: features,
      output,
      confidence,
      timestamp: new Date()
    }

    // Store prediction for analytics
    if (!this.predictions.has(modelId)) {
      this.predictions.set(modelId, [])
    }
    this.predictions.get(modelId)!.push(prediction)

    return prediction
  }

  private async runMultiClassPrediction(modelId: string, features: Record<string, any>): Promise<Record<string, any>> {
    // Simulate multi-class prediction for opportunity detection
    return {
      upsell: { confidence: Math.random() * 0.8, estimatedValue: Math.random() * 5000 + 1000 },
      'cross-sell': { confidence: Math.random() * 0.7, estimatedValue: Math.random() * 3000 + 500 },
      renewal: { confidence: Math.random() * 0.9, estimatedValue: Math.random() * 10000 + 2000 },
      expansion: { confidence: Math.random() * 0.6, estimatedValue: Math.random() * 15000 + 5000 }
    }
  }

  // Feature Extraction Methods
  private async extractSalesFeatures(customerId: string): Promise<Record<string, any>> {
    // In a real implementation, this would fetch data from various sources
    return {
      historical_sales: Math.random() * 50000,
      customer_age: Math.random() * 365 * 5, // Days as customer
      interaction_frequency: Math.random() * 10,
      product_category: Math.floor(Math.random() * 5),
      seasonality: Math.sin(Date.now() / (1000 * 60 * 60 * 24 * 365) * 2 * Math.PI),
      marketing_campaigns: Math.random() * 3,
      economic_indicators: Math.random() * 2 - 1
    }
  }

  private async extractChurnFeatures(customerId: string): Promise<Record<string, any>> {
    return {
      days_since_last_purchase: Math.random() * 180,
      total_spent: Math.random() * 100000,
      support_tickets: Math.random() * 20,
      login_frequency: Math.random() * 30,
      feature_usage: Math.random(),
      satisfaction_score: Math.random() * 5 + 1,
      contract_length: Math.random() * 36
    }
  }

  private async extractOpportunityFeatures(customerId: string): Promise<Record<string, any>> {
    return {
      purchase_history: Math.random() * 10,
      product_affinity: Math.random(),
      usage_patterns: Math.random(),
      support_interactions: Math.random() * 5,
      contract_expiration: Math.random() * 365,
      competitor_analysis: Math.random()
    }
  }

  // Helper Methods
  private generateChurnActions(riskLevel: string, factors: any[]): string[] {
    const actions = {
      high: [
        'Schedule immediate retention call',
        'Offer exclusive discount or upgrade',
        'Assign dedicated account manager',
        'Conduct satisfaction survey',
        'Provide premium support'
      ],
      medium: [
        'Send personalized email campaign',
        'Offer product training session',
        'Share success stories and case studies',
        'Schedule check-in call',
        'Provide usage analytics report'
      ],
      low: [
        'Include in newsletter campaign',
        'Send product tips and best practices',
        'Invite to webinar or event',
        'Share relevant content',
        'Monitor engagement levels'
      ]
    }

    return actions[riskLevel as keyof typeof actions] || actions.low
  }

  private determineNextBestAction(grade: string, factors: any[]): string {
    const actions = {
      A: 'Schedule demo call within 24 hours',
      B: 'Send personalized product information',
      C: 'Add to nurture email campaign',
      D: 'Continue monitoring engagement'
    }

    return actions[grade as keyof typeof actions] || actions.D
  }

  private generateOpportunityReasoning(opportunityType: string, prediction: any): string[] {
    const reasoning = {
      upsell: [
        'Customer has been using base features extensively',
        'Usage patterns indicate need for advanced features',
        'Similar customers have upgraded successfully'
      ],
      'cross-sell': [
        'Purchase history shows interest in complementary products',
        'Customer profile matches target market for additional products',
        'Recent inquiries about related solutions'
      ],
      renewal: [
        'Contract expiration approaching',
        'High product usage indicates satisfaction',
        'Strong engagement metrics'
      ],
      expansion: [
        'Team size has grown significantly',
        'Increased usage beyond current plan limits',
        'Multiple departments showing interest'
      ]
    }

    return reasoning[opportunityType as keyof typeof reasoning] || ['General market analysis']
  }

  private async getRecommendedProducts(customerId: string, opportunityType: string): Promise<Array<{
    id: string
    name: string
    probability: number
    estimatedRevenue: number
  }>> {
    // Simulate product recommendations
    const products = [
      { id: 'prod_1', name: 'Professional Plan', probability: 0.8, estimatedRevenue: 2000 },
      { id: 'prod_2', name: 'Analytics Add-on', probability: 0.6, estimatedRevenue: 500 },
      { id: 'prod_3', name: 'Premium Support', probability: 0.7, estimatedRevenue: 1000 }
    ]

    return products.slice(0, Math.floor(Math.random() * 3) + 1)
  }

  private calculateBestContactTime(customerId: string): Date {
    // Simulate optimal contact time calculation
    const now = new Date()
    const bestTime = new Date(now)
    bestTime.setHours(Math.floor(Math.random() * 8) + 9) // Between 9 AM and 5 PM
    bestTime.setMinutes(0)
    bestTime.setSeconds(0)
    
    return bestTime
  }

  // Analytics and Monitoring
  async getModelPerformance(modelId: string): Promise<{
    accuracy: number
    predictions: number
    avgConfidence: number
    lastPrediction: Date | null
  }> {
    const model = this.models.get(modelId)
    const predictions = this.predictions.get(modelId) || []

    const avgConfidence = predictions.length > 0 
      ? predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length
      : 0

    const lastPrediction = predictions.length > 0 
      ? predictions[predictions.length - 1].timestamp
      : null

    return {
      accuracy: model?.accuracy || 0,
      predictions: predictions.length,
      avgConfidence,
      lastPrediction
    }
  }

  async getPredictionHistory(modelId: string, limit: number = 100): Promise<Prediction[]> {
    const predictions = this.predictions.get(modelId) || []
    return predictions.slice(-limit)
  }
}

// React Hook for ML Integration
export function useMachineLearning() {
  const [engine] = useState(() => new MachineLearningEngine())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const predictSales = useCallback(async (customerId: string, timeframe: 'week' | 'month' | 'quarter') => {
    setIsLoading(true)
    setError(null)
    try {
      return await engine.predictSales(customerId, timeframe)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Prediction failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [engine])

  const predictChurn = useCallback(async (customerId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      return await engine.predictChurn(customerId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Prediction failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [engine])

  const scoreLeads = useCallback(async (leads: Array<{id: string, features: Record<string, any>}>) => {
    setIsLoading(true)
    setError(null)
    try {
      return await engine.scoreLeads(leads)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scoring failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [engine])

  const detectOpportunities = useCallback(async (customerId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      return await engine.detectOpportunities(customerId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Detection failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [engine])

  const getModels = useCallback(async () => {
    return await engine.getModels()
  }, [engine])

  const getModelPerformance = useCallback(async (modelId: string) => {
    return await engine.getModelPerformance(modelId)
  }, [engine])

  return {
    predictSales,
    predictChurn,
    scoreLeads,
    detectOpportunities,
    getModels,
    getModelPerformance,
    isLoading,
    error,
    engine
  }
}

// Export singleton instance
export const mlEngine = new MachineLearningEngine()
