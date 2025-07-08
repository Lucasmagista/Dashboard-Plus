"use client"

export interface StripeConfig {
  publishableKey: string
  secretKey: string
  webhookSecret: string
}

export interface PayPalConfig {
  clientId: string
  clientSecret: string
  mode: 'sandbox' | 'live'
}

export interface PIXConfig {
  pixKey: string
  merchantName: string
  merchantCity: string
  txId?: string
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: string
  clientSecret?: string
  customerId?: string
  description?: string
  metadata: Record<string, string>
  createdAt: Date
  updatedAt: Date
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'pix' | 'boleto' | 'paypal'
  customerId?: string
  card?: {
    brand: string
    last4: string
    expMonth: number
    expYear: number
  }
  createdAt: Date
}

export interface Customer {
  id: string
  email: string
  name?: string
  phone?: string
  document?: string
  address?: {
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  createdAt: Date
}

export interface Subscription {
  id: string
  customerId: string
  priceId: string
  status: string
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  createdAt: Date
}

export class StripeIntegration {
  private config: StripeConfig
  private baseUrl = 'https://api.stripe.com/v1'

  constructor(config: StripeConfig) {
    this.config = config
  }

  private async makeApiRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.config.secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Stripe API error: ${errorData.error?.message || response.statusText}`)
    }

    return response.json()
  }

  // Payment Intents
  async createPaymentIntent(
    amount: number, 
    currency: string = 'brl',
    customerId?: string,
    description?: string,
    metadata?: Record<string, string>
  ): Promise<PaymentIntent> {
    const body = new URLSearchParams({
      amount: amount.toString(),
      currency,
      automatic_payment_methods: JSON.stringify({ enabled: true }),
    })

    if (customerId) body.append('customer', customerId)
    if (description) body.append('description', description)
    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        body.append(`metadata[${key}]`, value)
      })
    }

    const response = await this.makeApiRequest('/payment_intents', {
      method: 'POST',
      body,
    })

    return this.formatPaymentIntent(response)
  }

  async getPaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
    const response = await this.makeApiRequest(`/payment_intents/${paymentIntentId}`)
    return this.formatPaymentIntent(response)
  }

  async confirmPaymentIntent(paymentIntentId: string, paymentMethodId: string): Promise<PaymentIntent> {
    const body = new URLSearchParams({
      payment_method: paymentMethodId,
    })

    const response = await this.makeApiRequest(`/payment_intents/${paymentIntentId}/confirm`, {
      method: 'POST',
      body,
    })

    return this.formatPaymentIntent(response)
  }

  async cancelPaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
    const response = await this.makeApiRequest(`/payment_intents/${paymentIntentId}/cancel`, {
      method: 'POST',
    })

    return this.formatPaymentIntent(response)
  }

  // Customers
  async createCustomer(
    email: string,
    name?: string,
    phone?: string,
    address?: Customer['address']
  ): Promise<Customer> {
    const body = new URLSearchParams({ email })
    
    if (name) body.append('name', name)
    if (phone) body.append('phone', phone)
    if (address) {
      body.append('address[line1]', address.line1)
      if (address.line2) body.append('address[line2]', address.line2)
      body.append('address[city]', address.city)
      body.append('address[state]', address.state)
      body.append('address[postal_code]', address.postalCode)
      body.append('address[country]', address.country)
    }

    const response = await this.makeApiRequest('/customers', {
      method: 'POST',
      body,
    })

    return this.formatCustomer(response)
  }

  async getCustomer(customerId: string): Promise<Customer> {
    const response = await this.makeApiRequest(`/customers/${customerId}`)
    return this.formatCustomer(response)
  }

  async updateCustomer(customerId: string, updates: Partial<Customer>): Promise<Customer> {
    const body = new URLSearchParams()
    
    if (updates.email) body.append('email', updates.email)
    if (updates.name) body.append('name', updates.name)
    if (updates.phone) body.append('phone', updates.phone)

    const response = await this.makeApiRequest(`/customers/${customerId}`, {
      method: 'POST',
      body,
    })

    return this.formatCustomer(response)
  }

  // Payment Methods
  async createPaymentMethod(type: string, card?: any): Promise<PaymentMethod> {
    const body = new URLSearchParams({ type })
    
    if (type === 'card' && card) {
      body.append('card[number]', card.number)
      body.append('card[exp_month]', card.expMonth.toString())
      body.append('card[exp_year]', card.expYear.toString())
      body.append('card[cvc]', card.cvc)
    }

    const response = await this.makeApiRequest('/payment_methods', {
      method: 'POST',
      body,
    })

    return this.formatPaymentMethod(response)
  }

  async attachPaymentMethodToCustomer(paymentMethodId: string, customerId: string): Promise<PaymentMethod> {
    const body = new URLSearchParams({ customer: customerId })

    const response = await this.makeApiRequest(`/payment_methods/${paymentMethodId}/attach`, {
      method: 'POST',
      body,
    })

    return this.formatPaymentMethod(response)
  }

  async getCustomerPaymentMethods(customerId: string): Promise<PaymentMethod[]> {
    const response = await this.makeApiRequest(`/customers/${customerId}/payment_methods`)
    return response.data.map(this.formatPaymentMethod)
  }

  // Subscriptions
  async createSubscription(customerId: string, priceId: string): Promise<Subscription> {
    const body = new URLSearchParams({
      customer: customerId,
      items: JSON.stringify([{ price: priceId }]),
    })

    const response = await this.makeApiRequest('/subscriptions', {
      method: 'POST',
      body,
    })

    return this.formatSubscription(response)
  }

  async getSubscription(subscriptionId: string): Promise<Subscription> {
    const response = await this.makeApiRequest(`/subscriptions/${subscriptionId}`)
    return this.formatSubscription(response)
  }

  async cancelSubscription(subscriptionId: string, atPeriodEnd: boolean = true): Promise<Subscription> {
    const body = new URLSearchParams({
      cancel_at_period_end: atPeriodEnd.toString(),
    })

    const response = await this.makeApiRequest(`/subscriptions/${subscriptionId}`, {
      method: 'POST',
      body,
    })

    return this.formatSubscription(response)
  }

  // Webhooks
  async constructWebhookEvent(payload: string, signature: string): Promise<any> {
    // This would use Stripe's webhook signature verification
    // For now, we'll just parse the payload
    return JSON.parse(payload)
  }

  // Analytics
  async getPaymentAnalytics(startDate: Date, endDate: Date): Promise<{
    totalAmount: number
    totalTransactions: number
    successfulTransactions: number
    failedTransactions: number
    averageTransactionValue: number
  }> {
    // Note: This would require fetching charges or payment intents with date filters
    const charges = await this.makeApiRequest('/charges?limit=100')
    
    const filteredCharges = charges.data.filter((charge: any) => {
      const chargeDate = new Date(charge.created * 1000)
      return chargeDate >= startDate && chargeDate <= endDate
    })

    const totalAmount = filteredCharges.reduce((sum: number, charge: any) => sum + charge.amount, 0) / 100
    const totalTransactions = filteredCharges.length
    const successfulTransactions = filteredCharges.filter((charge: any) => charge.status === 'succeeded').length
    const failedTransactions = totalTransactions - successfulTransactions
    const averageTransactionValue = totalTransactions > 0 ? totalAmount / totalTransactions : 0

    return {
      totalAmount,
      totalTransactions,
      successfulTransactions,
      failedTransactions,
      averageTransactionValue
    }
  }

  // Helper methods
  private formatPaymentIntent(stripePaymentIntent: any): PaymentIntent {
    return {
      id: stripePaymentIntent.id,
      amount: stripePaymentIntent.amount,
      currency: stripePaymentIntent.currency,
      status: stripePaymentIntent.status,
      clientSecret: stripePaymentIntent.client_secret,
      customerId: stripePaymentIntent.customer,
      description: stripePaymentIntent.description,
      metadata: stripePaymentIntent.metadata,
      createdAt: new Date(stripePaymentIntent.created * 1000),
      updatedAt: new Date(stripePaymentIntent.created * 1000) // Stripe doesn't have updated_at
    }
  }

  private formatCustomer(stripeCustomer: any): Customer {
    return {
      id: stripeCustomer.id,
      email: stripeCustomer.email,
      name: stripeCustomer.name,
      phone: stripeCustomer.phone,
      address: stripeCustomer.address ? {
        line1: stripeCustomer.address.line1,
        line2: stripeCustomer.address.line2,
        city: stripeCustomer.address.city,
        state: stripeCustomer.address.state,
        postalCode: stripeCustomer.address.postal_code,
        country: stripeCustomer.address.country
      } : undefined,
      createdAt: new Date(stripeCustomer.created * 1000)
    }
  }

  private formatPaymentMethod(stripePaymentMethod: any): PaymentMethod {
    return {
      id: stripePaymentMethod.id,
      type: stripePaymentMethod.type,
      customerId: stripePaymentMethod.customer,
      card: stripePaymentMethod.card ? {
        brand: stripePaymentMethod.card.brand,
        last4: stripePaymentMethod.card.last4,
        expMonth: stripePaymentMethod.card.exp_month,
        expYear: stripePaymentMethod.card.exp_year
      } : undefined,
      createdAt: new Date(stripePaymentMethod.created * 1000)
    }
  }

  private formatSubscription(stripeSubscription: any): Subscription {
    return {
      id: stripeSubscription.id,
      customerId: stripeSubscription.customer,
      priceId: stripeSubscription.items.data[0]?.price?.id,
      status: stripeSubscription.status,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      createdAt: new Date(stripeSubscription.created * 1000)
    }
  }
}

// PayPal Integration
export class PayPalIntegration {
  private config: PayPalConfig
  private baseUrl: string

  constructor(config: PayPalConfig) {
    this.config = config
    this.baseUrl = config.mode === 'sandbox' 
      ? 'https://api.sandbox.paypal.com' 
      : 'https://api.paypal.com'
  }

  private async getAccessToken(): Promise<string> {
    const auth = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64')
    
    const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    })

    const data = await response.json()
    return data.access_token
  }

  async createOrder(amount: number, currency: string = 'BRL'): Promise<{id: string, links: any[]}> {
    const accessToken = await this.getAccessToken()
    
    const response = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: currency,
            value: (amount / 100).toFixed(2) // Convert cents to currency
          }
        }]
      }),
    })

    return response.json()
  }

  async captureOrder(orderId: string): Promise<any> {
    const accessToken = await this.getAccessToken()
    
    const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    return response.json()
  }
}

// PIX Payment Integration
export class PIXIntegration {
  private config: PIXConfig

  constructor(config: PIXConfig) {
    this.config = config
  }

  generatePixQRCode(amount: number, description: string): string {
    // Generate PIX QR Code string
    const pixString = this.generatePixString(amount, description)
    return pixString
  }

  private generatePixString(amount: number, description: string): string {
    // PIX QR Code generation logic
    const merchantName = this.config.merchantName.padEnd(25).substring(0, 25)
    const merchantCity = this.config.merchantCity.padEnd(15).substring(0, 15)
    const pixKey = this.config.pixKey
    const amountStr = amount.toFixed(2)
    const txId = this.config.txId || Date.now().toString()

    // This is a simplified PIX QR code generation
    // In production, you would use a proper PIX library
    return `00020126${pixKey.length.toString().padStart(2, '0')}${pixKey}52040000530398654${amountStr.length.toString().padStart(2, '0')}${amountStr}5802BR59${merchantName.length.toString().padStart(2, '0')}${merchantName}60${merchantCity.length.toString().padStart(2, '0')}${merchantCity}62${(txId.length + 4).toString().padStart(2, '0')}05${txId.length.toString().padStart(2, '0')}${txId}6304`
  }

  async verifyPayment(txId: string): Promise<{status: 'pending' | 'paid' | 'expired', amount?: number}> {
    // This would integrate with your bank's API or a PIX provider
    // For now, we'll return a mock response
    return {
      status: 'pending'
    }
  }
}

// Unified Payment Gateway
export class UnifiedPaymentGateway {
  private stripe?: StripeIntegration
  private paypal?: PayPalIntegration
  private pix?: PIXIntegration

  constructor(configs: {
    stripe?: StripeConfig
    paypal?: PayPalConfig
    pix?: PIXConfig
  }) {
    if (configs.stripe) this.stripe = new StripeIntegration(configs.stripe)
    if (configs.paypal) this.paypal = new PayPalIntegration(configs.paypal)
    if (configs.pix) this.pix = new PIXIntegration(configs.pix)
  }

  async processPayment(
    method: 'stripe' | 'paypal' | 'pix',
    amount: number,
    currency: string = 'BRL',
    options?: any
  ): Promise<any> {
    switch (method) {
      case 'stripe':
        if (!this.stripe) throw new Error('Stripe not configured')
        return this.stripe.createPaymentIntent(amount, currency, options?.customerId, options?.description, options?.metadata)
      
      case 'paypal':
        if (!this.paypal) throw new Error('PayPal not configured')
        return this.paypal.createOrder(amount, currency)
      
      case 'pix':
        if (!this.pix) throw new Error('PIX not configured')
        return this.pix.generatePixQRCode(amount / 100, options?.description || 'Payment')
      
      default:
        throw new Error(`Unsupported payment method: ${method}`)
    }
  }

  async getPaymentStatus(method: 'stripe' | 'paypal' | 'pix', paymentId: string): Promise<any> {
    switch (method) {
      case 'stripe':
        if (!this.stripe) throw new Error('Stripe not configured')
        return this.stripe.getPaymentIntent(paymentId)
      
      case 'pix':
        if (!this.pix) throw new Error('PIX not configured')
        return this.pix.verifyPayment(paymentId)
      
      default:
        throw new Error(`Payment status check not implemented for: ${method}`)
    }
  }

  getAvailableMethods(): string[] {
    const methods: string[] = []
    if (this.stripe) methods.push('stripe')
    if (this.paypal) methods.push('paypal')
    if (this.pix) methods.push('pix')
    return methods
  }
}
