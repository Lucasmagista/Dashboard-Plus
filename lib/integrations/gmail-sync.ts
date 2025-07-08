'use client';

import { useState } from 'react'

export interface GmailConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  scopes: string[]
}

export interface EmailMessage {
  id: string
  threadId: string
  from: string
  to: string[]
  subject: string
  snippet: string
  body: string
  date: Date
  labels: string[]
  read: boolean
  attachments: EmailAttachment[]
}

export interface EmailAttachment {
  id: string
  filename: string
  mimeType: string
  size: number
  data?: string
}

export interface EmailThread {
  id: string
  messages: EmailMessage[]
  labels: string[]
  snippet: string
  historyId: string
}

export class GmailIntegration {
  private config: GmailConfig
  private accessToken: string | null = null
  private refreshToken: string | null = null

  constructor(config: GmailConfig) {
    this.config = config
  }

  // OAuth2 Authentication
  generateAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scopes.join(' '),
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent'
    })
    
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }

  async exchangeCodeForTokens(authCode: string): Promise<{
    access_token: string
    refresh_token: string
    expires_in: number
  }> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        code: authCode,
        grant_type: 'authorization_code',
        redirect_uri: this.config.redirectUri,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to exchange code: ${response.statusText}`)
    }

    const tokens = await response.json()
    this.accessToken = tokens.access_token
    this.refreshToken = tokens.refresh_token
    
    return tokens
  }

  async refreshAccessToken(): Promise<string> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        refresh_token: this.refreshToken,
        grant_type: 'refresh_token',
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.statusText}`)
    }

    const tokens = await response.json()
    this.accessToken = tokens.access_token
    
    return tokens.access_token
  }

  private async makeApiRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    if (!this.accessToken) {
      throw new Error('No access token available')
    }

    const response = await fetch(`https://gmail.googleapis.com/gmail/v1${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (response.status === 401) {
      // Token expired, try to refresh
      await this.refreshAccessToken()
      return this.makeApiRequest(endpoint, options)
    }

    if (!response.ok) {
      throw new Error(`Gmail API error: ${response.statusText}`)
    }

    return response.json()
  }

  // Email Operations
  async getMessages(query: string = '', maxResults: number = 50): Promise<EmailMessage[]> {
    const params = new URLSearchParams({
      q: query,
      maxResults: maxResults.toString(),
    })

    const response = await this.makeApiRequest(`/users/me/messages?${params}`)
    
    if (!response.messages) {
      return []
    }

    // Fetch full message details for each message
    const messages = await Promise.all(
      response.messages.map(async (msg: { id: string }) => {
        return this.getMessage(msg.id)
      })
    )

    return messages
  }

  async getMessage(messageId: string): Promise<EmailMessage> {
    const response = await this.makeApiRequest(`/users/me/messages/${messageId}`)
    
    return this.formatMessage(response)
  }

  async getThread(threadId: string): Promise<EmailThread> {
    const response = await this.makeApiRequest(`/users/me/threads/${threadId}`)
    
    return {
      id: response.id,
      messages: response.messages.map((msg: any) => this.formatMessage(msg)),
      labels: response.messages[0]?.labelIds || [],
      snippet: response.snippet || '',
      historyId: response.historyId
    }
  }

  async sendMessage(to: string[], subject: string, body: string, threadId?: string): Promise<EmailMessage> {
    const email = this.createEmailContent(to, subject, body, threadId)
    
    const response = await this.makeApiRequest('/users/me/messages/send', {
      method: 'POST',
      body: JSON.stringify({
        raw: Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
      }),
    })

    return this.formatMessage(response)
  }

  async replyToMessage(messageId: string, body: string): Promise<EmailMessage> {
    const originalMessage = await this.getMessage(messageId)
    const subject = originalMessage.subject.startsWith('Re:') 
      ? originalMessage.subject 
      : `Re: ${originalMessage.subject}`

    return this.sendMessage([originalMessage.from], subject, body, originalMessage.threadId)
  }

  async markAsRead(messageId: string): Promise<void> {
    await this.makeApiRequest(`/users/me/messages/${messageId}/modify`, {
      method: 'POST',
      body: JSON.stringify({
        removeLabelIds: ['UNREAD']
      }),
    })
  }

  async markAsUnread(messageId: string): Promise<void> {
    await this.makeApiRequest(`/users/me/messages/${messageId}/modify`, {
      method: 'POST',
      body: JSON.stringify({
        addLabelIds: ['UNREAD']
      }),
    })
  }

  async deleteMessage(messageId: string): Promise<void> {
    await this.makeApiRequest(`/users/me/messages/${messageId}`, {
      method: 'DELETE',
    })
  }

  async getLabels(): Promise<Array<{ id: string; name: string; type: string }>> {
    const response = await this.makeApiRequest('/users/me/labels')
    
    return response.labels.map((label: any) => ({
      id: label.id,
      name: label.name,
      type: label.type
    }))
  }

  // Sync functions for CRM integration
  async syncNewMessages(since?: Date): Promise<EmailMessage[]> {
    let query = 'is:unread'
    
    if (since) {
      const afterDate = Math.floor(since.getTime() / 1000)
      query += ` after:${afterDate}`
    }

    return this.getMessages(query)
  }

  async syncSentMessages(since?: Date): Promise<EmailMessage[]> {
    let query = 'in:sent'
    
    if (since) {
      const afterDate = Math.floor(since.getTime() / 1000)
      query += ` after:${afterDate}`
    }

    return this.getMessages(query)
  }

  // Helper methods
  private formatMessage(gmailMessage: any): EmailMessage {
    const headers = gmailMessage.payload.headers
    const getHeader = (name: string) => headers.find((h: any) => h.name === name)?.value || ''

    return {
      id: gmailMessage.id,
      threadId: gmailMessage.threadId,
      from: getHeader('From'),
      to: getHeader('To').split(',').map((email: string) => email.trim()),
      subject: getHeader('Subject'),
      snippet: gmailMessage.snippet,
      body: this.extractBody(gmailMessage.payload),
      date: new Date(parseInt(gmailMessage.internalDate)),
      labels: gmailMessage.labelIds || [],
      read: !gmailMessage.labelIds?.includes('UNREAD'),
      attachments: this.extractAttachments(gmailMessage.payload)
    }
  }

  private extractBody(payload: any): string {
    if (payload.body.data) {
      return Buffer.from(payload.body.data, 'base64').toString()
    }

    if (payload.parts) {
      for (const part of payload.parts) {
        if (part.mimeType === 'text/plain' && part.body.data) {
          return Buffer.from(part.body.data, 'base64').toString()
        }
        if (part.mimeType === 'text/html' && part.body.data) {
          return Buffer.from(part.body.data, 'base64').toString()
        }
      }
    }

    return ''
  }

  private extractAttachments(payload: any): EmailAttachment[] {
    const attachments: EmailAttachment[] = []

    if (payload.parts) {
      for (const part of payload.parts) {
        if (part.filename && part.body.attachmentId) {
          attachments.push({
            id: part.body.attachmentId,
            filename: part.filename,
            mimeType: part.mimeType,
            size: part.body.size || 0
          })
        }
      }
    }

    return attachments
  }

  private createEmailContent(to: string[], subject: string, body: string, threadId?: string): string {
    const boundary = `boundary_${Date.now()}`
    
    let email = [
      `To: ${to.join(', ')}`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      '',
      `--${boundary}`,
      'Content-Type: text/plain; charset=UTF-8',
      '',
      body,
      '',
      `--${boundary}`,
      'Content-Type: text/html; charset=UTF-8',
      '',
      `<div>${body.replace(/\n/g, '<br>')}</div>`,
      '',
      `--${boundary}--`
    ].join('\r\n')

    if (threadId) {
      email = `References: <${threadId}>\r\nIn-Reply-To: <${threadId}>\r\n${email}`
    }

    return email
  }

  // Webhook for real-time sync
  async setupPushNotifications(webhookUrl: string): Promise<void> {
    await this.makeApiRequest('/users/me/watch', {
      method: 'POST',
      body: JSON.stringify({
        topicName: 'projects/your-project-id/topics/gmail-notifications',
        labelIds: ['INBOX'],
        labelFilterAction: 'include'
      }),
    })
  }
}

// React Hook for Gmail Integration
export function useGmailIntegration() {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [gmail, setGmail] = useState<GmailIntegration | null>(null)

  const connect = async (config: GmailConfig) => {
    setIsLoading(true)
    setError(null)

    try {
      const gmailInstance = new GmailIntegration(config)
      const authUrl = gmailInstance.generateAuthUrl()
      
      // Open auth window
      window.open(authUrl, 'gmail-auth', 'width=500,height=600')
      
      // Listen for auth callback
      const handleMessage = async (event: MessageEvent) => {
        if (event.data.type === 'GMAIL_AUTH_SUCCESS') {
          await gmailInstance.exchangeCodeForTokens(event.data.code)
          setGmail(gmailInstance)
          setIsConnected(true)
          window.removeEventListener('message', handleMessage)
        }
      }
      
      window.addEventListener('message', handleMessage)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to Gmail')
    } finally {
      setIsLoading(false)
    }
  }

  const disconnect = () => {
    setGmail(null)
    setIsConnected(false)
  }

  return {
    gmail,
    isConnected,
    isLoading,
    error,
    connect,
    disconnect
  }
}
