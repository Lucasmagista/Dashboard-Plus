"use client"

export interface HubSpotConfig {
  accessToken: string
  portalId: string
  apiVersion: string
}

export interface RDStationConfig {
  clientId: string
  clientSecret: string
  accessToken: string
  refreshToken: string
}

export interface MailchimpConfig {
  apiKey: string
  serverPrefix: string
  listId: string
}

export interface HubSpotContact {
  id: string
  email: string
  firstName?: string
  lastName?: string
  company?: string
  phone?: string
  website?: string
  lifecycleStage?: string
  leadStatus?: string
  source?: string
  createdAt: Date
  updatedAt: Date
  properties: Record<string, any>
}

export interface HubSpotDeal {
  id: string
  dealName: string
  amount: number
  stage: string
  probability: number
  closeDate?: Date
  contactId?: string
  companyId?: string
  createdAt: Date
  updatedAt: Date
  properties: Record<string, any>
}

export interface HubSpotCompany {
  id: string
  name: string
  domain?: string
  industry?: string
  numberOfEmployees?: number
  annualRevenue?: number
  city?: string
  state?: string
  country?: string
  createdAt: Date
  updatedAt: Date
  properties: Record<string, any>
}

export class HubSpotIntegration {
  private config: HubSpotConfig
  private baseUrl = 'https://api.hubapi.com'

  constructor(config: HubSpotConfig) {
    this.config = config
  }

  private async makeApiRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.config.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`HubSpot API error: ${response.status} ${response.statusText} - ${errorData}`)
    }

    return response.json()
  }

  // Contacts
  async getContacts(limit: number = 100, after?: string): Promise<{contacts: HubSpotContact[], paging?: any}> {
    const params = new URLSearchParams({ 
      limit: limit.toString(),
      properties: 'email,firstname,lastname,company,phone,website,lifecyclestage,hs_lead_status,hs_analytics_source'
    })
    
    if (after) params.append('after', after)

    const response = await this.makeApiRequest(`/crm/v3/objects/contacts?${params}`)
    
    return {
      contacts: response.results.map(this.formatContact),
      paging: response.paging
    }
  }

  async getContact(contactId: string): Promise<HubSpotContact> {
    const response = await this.makeApiRequest(`/crm/v3/objects/contacts/${contactId}`)
    return this.formatContact(response)
  }

  async createContact(contact: Partial<HubSpotContact>): Promise<HubSpotContact> {
    const properties: Record<string, any> = {}
    
    if (contact.email) properties.email = contact.email
    if (contact.firstName) properties.firstname = contact.firstName
    if (contact.lastName) properties.lastname = contact.lastName
    if (contact.company) properties.company = contact.company
    if (contact.phone) properties.phone = contact.phone
    if (contact.website) properties.website = contact.website
    if (contact.lifecycleStage) properties.lifecyclestage = contact.lifecycleStage
    if (contact.leadStatus) properties.hs_lead_status = contact.leadStatus
    if (contact.source) properties.hs_analytics_source = contact.source

    // Add custom properties
    if (contact.properties) {
      Object.assign(properties, contact.properties)
    }

    const response = await this.makeApiRequest('/crm/v3/objects/contacts', {
      method: 'POST',
      body: JSON.stringify({ properties }),
    })

    return this.formatContact(response)
  }

  async updateContact(contactId: string, updates: Partial<HubSpotContact>): Promise<HubSpotContact> {
    const properties: Record<string, any> = {}
    
    if (updates.email) properties.email = updates.email
    if (updates.firstName) properties.firstname = updates.firstName
    if (updates.lastName) properties.lastname = updates.lastName
    if (updates.company) properties.company = updates.company
    if (updates.phone) properties.phone = updates.phone
    if (updates.website) properties.website = updates.website
    if (updates.lifecycleStage) properties.lifecyclestage = updates.lifecycleStage
    if (updates.leadStatus) properties.hs_lead_status = updates.leadStatus

    // Add custom properties
    if (updates.properties) {
      Object.assign(properties, updates.properties)
    }

    const response = await this.makeApiRequest(`/crm/v3/objects/contacts/${contactId}`, {
      method: 'PATCH',
      body: JSON.stringify({ properties }),
    })

    return this.formatContact(response)
  }

  async searchContacts(email: string): Promise<HubSpotContact[]> {
    const response = await this.makeApiRequest('/crm/v3/objects/contacts/search', {
      method: 'POST',
      body: JSON.stringify({
        filterGroups: [{
          filters: [{
            propertyName: 'email',
            operator: 'EQ',
            value: email
          }]
        }],
        properties: ['email', 'firstname', 'lastname', 'company', 'phone', 'website', 'lifecyclestage', 'hs_lead_status']
      }),
    })

    return response.results.map(this.formatContact)
  }

  // Deals
  async getDeals(limit: number = 100, after?: string): Promise<{deals: HubSpotDeal[], paging?: any}> {
    const params = new URLSearchParams({ 
      limit: limit.toString(),
      properties: 'dealname,amount,dealstage,hs_probability_to_close,closedate'
    })
    
    if (after) params.append('after', after)

    const response = await this.makeApiRequest(`/crm/v3/objects/deals?${params}`)
    
    return {
      deals: response.results.map(this.formatDeal),
      paging: response.paging
    }
  }

  async createDeal(deal: Partial<HubSpotDeal>): Promise<HubSpotDeal> {
    const properties: Record<string, any> = {}
    
    if (deal.dealName) properties.dealname = deal.dealName
    if (deal.amount) properties.amount = deal.amount.toString()
    if (deal.stage) properties.dealstage = deal.stage
    if (deal.probability) properties.hs_probability_to_close = deal.probability.toString()
    if (deal.closeDate) properties.closedate = deal.closeDate.toISOString()

    const response = await this.makeApiRequest('/crm/v3/objects/deals', {
      method: 'POST',
      body: JSON.stringify({ properties }),
    })

    return this.formatDeal(response)
  }

  async associateDealWithContact(dealId: string, contactId: string): Promise<void> {
    await this.makeApiRequest(`/crm/v3/objects/deals/${dealId}/associations/contacts/${contactId}/3`, {
      method: 'PUT',
    })
  }

  // Companies
  async getCompanies(limit: number = 100, after?: string): Promise<{companies: HubSpotCompany[], paging?: any}> {
    const params = new URLSearchParams({ 
      limit: limit.toString(),
      properties: 'name,domain,industry,numberofemployees,annualrevenue,city,state,country'
    })
    
    if (after) params.append('after', after)

    const response = await this.makeApiRequest(`/crm/v3/objects/companies?${params}`)
    
    return {
      companies: response.results.map(this.formatCompany),
      paging: response.paging
    }
  }

  async createCompany(company: Partial<HubSpotCompany>): Promise<HubSpotCompany> {
    const properties: Record<string, any> = {}
    
    if (company.name) properties.name = company.name
    if (company.domain) properties.domain = company.domain
    if (company.industry) properties.industry = company.industry
    if (company.numberOfEmployees) properties.numberofemployees = company.numberOfEmployees.toString()
    if (company.annualRevenue) properties.annualrevenue = company.annualRevenue.toString()
    if (company.city) properties.city = company.city
    if (company.state) properties.state = company.state
    if (company.country) properties.country = company.country

    const response = await this.makeApiRequest('/crm/v3/objects/companies', {
      method: 'POST',
      body: JSON.stringify({ properties }),
    })

    return this.formatCompany(response)
  }

  // Activities/Engagements
  async createNote(contactId: string, note: string): Promise<void> {
    await this.makeApiRequest('/crm/v3/objects/notes', {
      method: 'POST',
      body: JSON.stringify({
        properties: {
          hs_note_body: note,
        },
        associations: [{
          to: { id: contactId },
          types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 202 }]
        }]
      }),
    })
  }

  async createTask(contactId: string, subject: string, dueDate?: Date): Promise<void> {
    const properties: Record<string, any> = {
      hs_task_subject: subject,
      hs_task_status: 'NOT_STARTED',
      hs_task_type: 'TODO'
    }

    if (dueDate) {
      properties.hs_timestamp = dueDate.getTime().toString()
    }

    await this.makeApiRequest('/crm/v3/objects/tasks', {
      method: 'POST',
      body: JSON.stringify({
        properties,
        associations: [{
          to: { id: contactId },
          types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 204 }]
        }]
      }),
    })
  }

  // Analytics
  async getContactAnalytics(timeframe: 'last_30_days' | 'last_90_days' | 'last_year'): Promise<{
    totalContacts: number
    newContacts: number
    contactsBySource: Array<{source: string, count: number}>
    contactsByLifecycleStage: Array<{stage: string, count: number}>
  }> {
    // This would require multiple API calls and data processing
    const contacts = await this.getContacts(1000)
    
    const now = new Date()
    let timeframeStart: Date
    
    switch (timeframe) {
      case 'last_30_days':
        timeframeStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case 'last_90_days':
        timeframeStart = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case 'last_year':
        timeframeStart = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
    }

    const newContacts = contacts.contacts.filter(contact => contact.createdAt >= timeframeStart)
    
    const contactsBySource = new Map<string, number>()
    const contactsByLifecycleStage = new Map<string, number>()

    contacts.contacts.forEach(contact => {
      const source = contact.source || 'Unknown'
      const stage = contact.lifecycleStage || 'Unknown'
      
      contactsBySource.set(source, (contactsBySource.get(source) || 0) + 1)
      contactsByLifecycleStage.set(stage, (contactsByLifecycleStage.get(stage) || 0) + 1)
    })

    return {
      totalContacts: contacts.contacts.length,
      newContacts: newContacts.length,
      contactsBySource: Array.from(contactsBySource.entries()).map(([source, count]) => ({source, count})),
      contactsByLifecycleStage: Array.from(contactsByLifecycleStage.entries()).map(([stage, count]) => ({stage, count}))
    }
  }

  // Sync methods for CRM integration
  async syncNewContacts(since?: Date): Promise<HubSpotContact[]> {
    let allContacts: HubSpotContact[] = []
    let after: string | undefined
    
    do {
      const response = await this.getContacts(100, after)
      const filteredContacts = since 
        ? response.contacts.filter(contact => contact.createdAt >= since)
        : response.contacts
      
      allContacts = allContacts.concat(filteredContacts)
      after = response.paging?.next?.after
    } while (after)

    return allContacts
  }

  async syncDeals(since?: Date): Promise<HubSpotDeal[]> {
    let allDeals: HubSpotDeal[] = []
    let after: string | undefined
    
    do {
      const response = await this.getDeals(100, after)
      const filteredDeals = since 
        ? response.deals.filter(deal => deal.createdAt >= since)
        : response.deals
      
      allDeals = allDeals.concat(filteredDeals)
      after = response.paging?.next?.after
    } while (after)

    return allDeals
  }

  // Helper methods
  private formatContact(hubspotContact: any): HubSpotContact {
    const props = hubspotContact.properties
    
    return {
      id: hubspotContact.id,
      email: props.email || '',
      firstName: props.firstname,
      lastName: props.lastname,
      company: props.company,
      phone: props.phone,
      website: props.website,
      lifecycleStage: props.lifecyclestage,
      leadStatus: props.hs_lead_status,
      source: props.hs_analytics_source,
      createdAt: new Date(hubspotContact.createdAt),
      updatedAt: new Date(hubspotContact.updatedAt),
      properties: props
    }
  }

  private formatDeal(hubspotDeal: any): HubSpotDeal {
    const props = hubspotDeal.properties
    
    return {
      id: hubspotDeal.id,
      dealName: props.dealname || '',
      amount: parseFloat(props.amount) || 0,
      stage: props.dealstage || '',
      probability: parseFloat(props.hs_probability_to_close) || 0,
      closeDate: props.closedate ? new Date(props.closedate) : undefined,
      createdAt: new Date(hubspotDeal.createdAt),
      updatedAt: new Date(hubspotDeal.updatedAt),
      properties: props
    }
  }

  private formatCompany(hubspotCompany: any): HubSpotCompany {
    const props = hubspotCompany.properties
    
    return {
      id: hubspotCompany.id,
      name: props.name || '',
      domain: props.domain,
      industry: props.industry,
      numberOfEmployees: props.numberofemployees ? parseInt(props.numberofemployees) : undefined,
      annualRevenue: props.annualrevenue ? parseFloat(props.annualrevenue) : undefined,
      city: props.city,
      state: props.state,
      country: props.country,
      createdAt: new Date(hubspotCompany.createdAt),
      updatedAt: new Date(hubspotCompany.updatedAt),
      properties: props
    }
  }
}

// RD Station Integration
export class RDStationIntegration {
  private config: RDStationConfig
  private baseUrl = 'https://api.rd.services'

  constructor(config: RDStationConfig) {
    this.config = config
  }

  private async makeApiRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.config.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`RD Station API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getContacts(page: number = 1, pageSize: number = 50): Promise<any> {
    const params = new URLSearchParams({ 
      page: page.toString(),
      page_size: pageSize.toString()
    })
    
    return this.makeApiRequest(`/platform/contacts?${params}`)
  }

  async createOrUpdateContact(email: string, data: Record<string, any>): Promise<any> {
    return this.makeApiRequest('/platform/contacts', {
      method: 'POST',
      body: JSON.stringify({
        email,
        ...data
      }),
    })
  }

  async createConversion(email: string, conversionIdentifier: string, data?: Record<string, any>): Promise<any> {
    return this.makeApiRequest('/platform/conversions', {
      method: 'POST',
      body: JSON.stringify({
        email,
        conversion_identifier: conversionIdentifier,
        ...data
      }),
    })
  }
}

// Mailchimp Integration
export class MailchimpIntegration {
  private config: MailchimpConfig
  private baseUrl: string

  constructor(config: MailchimpConfig) {
    this.config = config
    this.baseUrl = `https://${config.serverPrefix}.api.mailchimp.com/3.0`
  }

  private async makeApiRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`
    const auth = Buffer.from(`anystring:${this.config.apiKey}`).toString('base64')
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Mailchimp API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async addSubscriber(email: string, firstName?: string, lastName?: string, tags?: string[]): Promise<any> {
    const mergeFields: Record<string, string> = {}
    if (firstName) mergeFields.FNAME = firstName
    if (lastName) mergeFields.LNAME = lastName

    const data: any = {
      email_address: email,
      status: 'subscribed',
      merge_fields: mergeFields
    }

    if (tags && tags.length > 0) {
      data.tags = tags
    }

    return this.makeApiRequest(`/lists/${this.config.listId}/members`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateSubscriber(email: string, updates: Record<string, any>): Promise<any> {
    const subscriberHash = this.md5(email.toLowerCase())
    
    return this.makeApiRequest(`/lists/${this.config.listId}/members/${subscriberHash}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }

  async getSubscriber(email: string): Promise<any> {
    const subscriberHash = this.md5(email.toLowerCase())
    
    return this.makeApiRequest(`/lists/${this.config.listId}/members/${subscriberHash}`)
  }

  async createCampaign(subject: string, fromName: string, fromEmail: string, htmlContent: string): Promise<any> {
    return this.makeApiRequest('/campaigns', {
      method: 'POST',
      body: JSON.stringify({
        type: 'regular',
        recipients: {
          list_id: this.config.listId
        },
        settings: {
          subject_line: subject,
          from_name: fromName,
          reply_to: fromEmail
        }
      }),
    })
  }

  async setCampaignContent(campaignId: string, htmlContent: string): Promise<any> {
    return this.makeApiRequest(`/campaigns/${campaignId}/content`, {
      method: 'PUT',
      body: JSON.stringify({
        html: htmlContent
      }),
    })
  }

  async sendCampaign(campaignId: string): Promise<any> {
    return this.makeApiRequest(`/campaigns/${campaignId}/actions/send`, {
      method: 'POST',
    })
  }

  private md5(input: string): string {
    // Simple MD5 implementation for email hashing
    // In production, use a proper crypto library
    return btoa(input).replace(/=/g, '').toLowerCase()
  }
}

// Unified Marketing Integration
export class UnifiedMarketingIntegration {
  private hubspot?: HubSpotIntegration
  private rdstation?: RDStationIntegration
  private mailchimp?: MailchimpIntegration

  constructor(configs: {
    hubspot?: HubSpotConfig
    rdstation?: RDStationConfig
    mailchimp?: MailchimpConfig
  }) {
    if (configs.hubspot) this.hubspot = new HubSpotIntegration(configs.hubspot)
    if (configs.rdstation) this.rdstation = new RDStationIntegration(configs.rdstation)
    if (configs.mailchimp) this.mailchimp = new MailchimpIntegration(configs.mailchimp)
  }

  async syncContact(email: string, data: {
    firstName?: string
    lastName?: string
    company?: string
    phone?: string
    source?: string
    tags?: string[]
  }): Promise<void> {
    const promises: Promise<any>[] = []

    if (this.hubspot) {
      promises.push(
        this.hubspot.createContact({
          email,
          firstName: data.firstName,
          lastName: data.lastName,
          company: data.company,
          phone: data.phone,
          source: data.source
        }).catch(console.error)
      )
    }

    if (this.rdstation) {
      promises.push(
        this.rdstation.createOrUpdateContact(email, {
          name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
          company: data.company,
          mobile_phone: data.phone
        }).catch(console.error)
      )
    }

    if (this.mailchimp) {
      promises.push(
        this.mailchimp.addSubscriber(email, data.firstName, data.lastName, data.tags).catch(console.error)
      )
    }

    await Promise.allSettled(promises)
  }

  getAvailablePlatforms(): string[] {
    const platforms: string[] = []
    if (this.hubspot) platforms.push('hubspot')
    if (this.rdstation) platforms.push('rdstation')
    if (this.mailchimp) platforms.push('mailchimp')
    return platforms
  }
}
