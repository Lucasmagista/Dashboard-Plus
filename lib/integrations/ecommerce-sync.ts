"use client"

export interface ShopifyConfig {
  shop: string
  accessToken: string
  apiVersion: string
}

export interface ShopifyProduct {
  id: string
  title: string
  handle: string
  description: string
  vendor: string
  price: string
  compareAtPrice?: string
  sku: string
  inventory: number
  images: string[]
  variants: ShopifyVariant[]
  tags: string[]
  status: 'active' | 'archived' | 'draft'
  createdAt: Date
  updatedAt: Date
}

export interface ShopifyVariant {
  id: string
  productId: string
  title: string
  price: string
  sku: string
  inventory: number
  weight: number
  image?: string
}

export interface ShopifyOrder {
  id: string
  orderNumber: string
  email: string
  customerName: string
  totalPrice: string
  subtotalPrice: string
  totalTax: string
  shippingAddress: ShopifyAddress
  billingAddress: ShopifyAddress
  lineItems: ShopifyLineItem[]
  financialStatus: string
  fulfillmentStatus: string
  createdAt: Date
  updatedAt: Date
}

export interface ShopifyAddress {
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  province: string
  country: string
  zip: string
  phone?: string
}

export interface ShopifyLineItem {
  id: string
  productId: string
  variantId: string
  title: string
  quantity: number
  price: string
  totalDiscount: string
  sku: string
}

export interface ShopifyCustomer {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  totalSpent: string
  ordersCount: number
  tags: string[]
  createdAt: Date
  lastOrderDate?: Date
}

export class ShopifyIntegration {
  private config: ShopifyConfig
  private baseUrl: string

  constructor(config: ShopifyConfig) {
    this.config = config
    this.baseUrl = `https://${config.shop}.myshopify.com/admin/api/${config.apiVersion}`
  }

  private async makeApiRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'X-Shopify-Access-Token': this.config.accessToken,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Products
  async getProducts(limit: number = 50, sinceId?: string): Promise<ShopifyProduct[]> {
    const params = new URLSearchParams({ limit: limit.toString() })
    if (sinceId) params.append('since_id', sinceId)

    const response = await this.makeApiRequest(`/products.json?${params}`)
    return response.products.map(this.formatProduct)
  }

  async getProduct(productId: string): Promise<ShopifyProduct> {
    const response = await this.makeApiRequest(`/products/${productId}.json`)
    return this.formatProduct(response.product)
  }

  async createProduct(product: Partial<ShopifyProduct>): Promise<ShopifyProduct> {
    const response = await this.makeApiRequest('/products.json', {
      method: 'POST',
      body: JSON.stringify({ product }),
    })
    return this.formatProduct(response.product)
  }

  async updateProduct(productId: string, updates: Partial<ShopifyProduct>): Promise<ShopifyProduct> {
    const response = await this.makeApiRequest(`/products/${productId}.json`, {
      method: 'PUT',
      body: JSON.stringify({ product: updates }),
    })
    return this.formatProduct(response.product)
  }

  // Orders
  async getOrders(limit: number = 50, status: string = 'any'): Promise<ShopifyOrder[]> {
    const params = new URLSearchParams({ 
      limit: limit.toString(),
      status 
    })

    const response = await this.makeApiRequest(`/orders.json?${params}`)
    return response.orders.map(this.formatOrder)
  }

  async getOrder(orderId: string): Promise<ShopifyOrder> {
    const response = await this.makeApiRequest(`/orders/${orderId}.json`)
    return this.formatOrder(response.order)
  }

  async getNewOrders(since?: Date): Promise<ShopifyOrder[]> {
    const params = new URLSearchParams({ 
      status: 'any',
      limit: '250' 
    })
    
    if (since) {
      params.append('created_at_min', since.toISOString())
    }

    const response = await this.makeApiRequest(`/orders.json?${params}`)
    return response.orders.map(this.formatOrder)
  }

  async updateOrderStatus(orderId: string, status: string): Promise<ShopifyOrder> {
    const response = await this.makeApiRequest(`/orders/${orderId}.json`, {
      method: 'PUT',
      body: JSON.stringify({ 
        order: { 
          id: orderId,
          financial_status: status 
        } 
      }),
    })
    return this.formatOrder(response.order)
  }

  // Customers
  async getCustomers(limit: number = 50): Promise<ShopifyCustomer[]> {
    const params = new URLSearchParams({ limit: limit.toString() })
    const response = await this.makeApiRequest(`/customers.json?${params}`)
    return response.customers.map(this.formatCustomer)
  }

  async getCustomer(customerId: string): Promise<ShopifyCustomer> {
    const response = await this.makeApiRequest(`/customers/${customerId}.json`)
    return this.formatCustomer(response.customer)
  }

  async searchCustomers(query: string): Promise<ShopifyCustomer[]> {
    const params = new URLSearchParams({ query })
    const response = await this.makeApiRequest(`/customers/search.json?${params}`)
    return response.customers.map(this.formatCustomer)
  }

  async createCustomer(customer: Partial<ShopifyCustomer>): Promise<ShopifyCustomer> {
    const response = await this.makeApiRequest('/customers.json', {
      method: 'POST',
      body: JSON.stringify({ customer }),
    })
    return this.formatCustomer(response.customer)
  }

  // Inventory
  async updateInventory(variantId: string, quantity: number): Promise<void> {
    await this.makeApiRequest(`/variants/${variantId}.json`, {
      method: 'PUT',
      body: JSON.stringify({
        variant: {
          id: variantId,
          inventory_quantity: quantity
        }
      }),
    })
  }

  async getInventoryLevels(): Promise<Array<{variantId: string, available: number}>> {
    const response = await this.makeApiRequest('/inventory_levels.json')
    return response.inventory_levels.map((level: any) => ({
      variantId: level.inventory_item_id,
      available: level.available
    }))
  }

  // Webhooks for real-time sync
  async createWebhook(topic: string, address: string): Promise<void> {
    await this.makeApiRequest('/webhooks.json', {
      method: 'POST',
      body: JSON.stringify({
        webhook: {
          topic,
          address,
          format: 'json'
        }
      }),
    })
  }

  async getWebhooks(): Promise<Array<{id: string, topic: string, address: string}>> {
    const response = await this.makeApiRequest('/webhooks.json')
    return response.webhooks.map((webhook: any) => ({
      id: webhook.id,
      topic: webhook.topic,
      address: webhook.address
    }))
  }

  // Analytics
  async getAnalytics(startDate: Date, endDate: Date): Promise<{
    totalSales: number
    totalOrders: number
    averageOrderValue: number
    topProducts: Array<{productId: string, title: string, sales: number}>
  }> {
    // Note: This would require Shopify Analytics API or custom calculations
    const orders = await this.getOrders(250)
    const filteredOrders = orders.filter(order => 
      order.createdAt >= startDate && order.createdAt <= endDate
    )

    const totalSales = filteredOrders.reduce((sum, order) => 
      sum + parseFloat(order.totalPrice), 0
    )

    const totalOrders = filteredOrders.length
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0

    // Calculate top products
    const productSales = new Map<string, {title: string, sales: number}>()
    
    filteredOrders.forEach(order => {
      order.lineItems.forEach(item => {
        const current = productSales.get(item.productId) || {title: item.title, sales: 0}
        current.sales += item.quantity
        productSales.set(item.productId, current)
      })
    })

    const topProducts = Array.from(productSales.entries())
      .map(([productId, data]) => ({productId, ...data}))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10)

    return {
      totalSales,
      totalOrders,
      averageOrderValue,
      topProducts
    }
  }

  // Helper methods
  private formatProduct(shopifyProduct: any): ShopifyProduct {
    return {
      id: shopifyProduct.id.toString(),
      title: shopifyProduct.title,
      handle: shopifyProduct.handle,
      description: shopifyProduct.body_html || '',
      vendor: shopifyProduct.vendor,
      price: shopifyProduct.variants[0]?.price || '0',
      compareAtPrice: shopifyProduct.variants[0]?.compare_at_price,
      sku: shopifyProduct.variants[0]?.sku || '',
      inventory: shopifyProduct.variants[0]?.inventory_quantity || 0,
      images: shopifyProduct.images?.map((img: any) => img.src) || [],
      variants: shopifyProduct.variants?.map((variant: any) => ({
        id: variant.id.toString(),
        productId: shopifyProduct.id.toString(),
        title: variant.title,
        price: variant.price,
        sku: variant.sku,
        inventory: variant.inventory_quantity,
        weight: variant.weight,
        image: variant.image_id ? shopifyProduct.images?.find((img: any) => img.id === variant.image_id)?.src : undefined
      })) || [],
      tags: shopifyProduct.tags?.split(',').map((tag: string) => tag.trim()) || [],
      status: shopifyProduct.status,
      createdAt: new Date(shopifyProduct.created_at),
      updatedAt: new Date(shopifyProduct.updated_at)
    }
  }

  private formatOrder(shopifyOrder: any): ShopifyOrder {
    return {
      id: shopifyOrder.id.toString(),
      orderNumber: shopifyOrder.order_number?.toString() || shopifyOrder.name,
      email: shopifyOrder.email || '',
      customerName: `${shopifyOrder.billing_address?.first_name || ''} ${shopifyOrder.billing_address?.last_name || ''}`.trim(),
      totalPrice: shopifyOrder.total_price,
      subtotalPrice: shopifyOrder.subtotal_price,
      totalTax: shopifyOrder.total_tax,
      shippingAddress: this.formatAddress(shopifyOrder.shipping_address),
      billingAddress: this.formatAddress(shopifyOrder.billing_address),
      lineItems: shopifyOrder.line_items?.map((item: any) => ({
        id: item.id.toString(),
        productId: item.product_id?.toString() || '',
        variantId: item.variant_id?.toString() || '',
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        totalDiscount: item.total_discount,
        sku: item.sku
      })) || [],
      financialStatus: shopifyOrder.financial_status,
      fulfillmentStatus: shopifyOrder.fulfillment_status || 'unfulfilled',
      createdAt: new Date(shopifyOrder.created_at),
      updatedAt: new Date(shopifyOrder.updated_at)
    }
  }

  private formatAddress(address: any): ShopifyAddress {
    if (!address) {
      return {
        firstName: '',
        lastName: '',
        address1: '',
        city: '',
        province: '',
        country: '',
        zip: ''
      }
    }

    return {
      firstName: address.first_name || '',
      lastName: address.last_name || '',
      company: address.company,
      address1: address.address1 || '',
      address2: address.address2,
      city: address.city || '',
      province: address.province || '',
      country: address.country || '',
      zip: address.zip || '',
      phone: address.phone
    }
  }

  private formatCustomer(shopifyCustomer: any): ShopifyCustomer {
    return {
      id: shopifyCustomer.id.toString(),
      email: shopifyCustomer.email,
      firstName: shopifyCustomer.first_name || '',
      lastName: shopifyCustomer.last_name || '',
      phone: shopifyCustomer.phone,
      totalSpent: shopifyCustomer.total_spent,
      ordersCount: shopifyCustomer.orders_count,
      tags: shopifyCustomer.tags?.split(',').map((tag: string) => tag.trim()) || [],
      createdAt: new Date(shopifyCustomer.created_at),
      lastOrderDate: shopifyCustomer.last_order_date ? new Date(shopifyCustomer.last_order_date) : undefined
    }
  }
}

// WooCommerce Integration
export interface WooCommerceConfig {
  siteUrl: string
  consumerKey: string
  consumerSecret: string
  version: string
}

export class WooCommerceIntegration {
  private config: WooCommerceConfig
  private baseUrl: string

  constructor(config: WooCommerceConfig) {
    this.config = config
    this.baseUrl = `${config.siteUrl}/wp-json/wc/${config.version}`
  }

  private async makeApiRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`
    const auth = Buffer.from(`${this.config.consumerKey}:${this.config.consumerSecret}`).toString('base64')
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`WooCommerce API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getProducts(page: number = 1, perPage: number = 50): Promise<any[]> {
    const params = new URLSearchParams({ 
      page: page.toString(),
      per_page: perPage.toString() 
    })
    
    return this.makeApiRequest(`/products?${params}`)
  }

  async getOrders(page: number = 1, perPage: number = 50, status: string = 'any'): Promise<any[]> {
    const params = new URLSearchParams({ 
      page: page.toString(),
      per_page: perPage.toString(),
      status
    })
    
    return this.makeApiRequest(`/orders?${params}`)
  }

  async getCustomers(page: number = 1, perPage: number = 50): Promise<any[]> {
    const params = new URLSearchParams({ 
      page: page.toString(),
      per_page: perPage.toString() 
    })
    
    return this.makeApiRequest(`/customers?${params}`)
  }

  async createWebhook(topic: string, deliveryUrl: string): Promise<any> {
    return this.makeApiRequest('/webhooks', {
      method: 'POST',
      body: JSON.stringify({
        name: `CRM ${topic}`,
        topic,
        delivery_url: deliveryUrl,
        status: 'active'
      }),
    })
  }
}
