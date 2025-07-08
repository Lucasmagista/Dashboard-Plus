/**
 * Single Sign-On (SSO) Implementation
 * Provides SAML, OAuth2, and OIDC authentication capabilities
 */

import crypto from 'crypto'
import { EventEmitter } from 'events'

export interface SSOConfig {
  issuer: string
  audience: string
  callbackUrl: string
  logoutUrl: string
  certificatePath?: string
  privateKeyPath?: string
}

export interface SSOProvider {
  id: string
  name: string
  type: 'saml' | 'oauth2' | 'oidc'
  enabled: boolean
  config: Record<string, any>
  metadata?: Record<string, any>
}

export interface SSOUser {
  id: string
  email: string
  name: string
  firstName?: string
  lastName?: string
  groups?: string[]
  roles?: string[]
  attributes?: Record<string, any>
  provider: string
  createdAt: Date
  lastLogin: Date
}

export interface SSOSession {
  sessionId: string
  userId: string
  provider: string
  createdAt: Date
  expiresAt: Date
  attributes: Record<string, any>
  isActive: boolean
}

export interface AuthRequest {
  id: string
  provider: string
  returnUrl: string
  state: string
  createdAt: Date
  expiresAt: Date
}

export class SAMLProvider extends EventEmitter {
  private config: SSOConfig

  constructor(config: SSOConfig) {
    super()
    this.config = config
  }

  generateAuthRequest(returnUrl: string): AuthRequest {
    const requestId = crypto.randomUUID()
    const state = crypto.randomBytes(32).toString('hex')

    const authRequest: AuthRequest = {
      id: requestId,
      provider: 'saml',
      returnUrl,
      state,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    }

    return authRequest
  }

  generateSAMLRequest(authRequest: AuthRequest): string {
    const samlRequest = `
      <samlp:AuthnRequest 
        xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
        xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
        ID="${authRequest.id}"
        Version="2.0"
        IssueInstant="${authRequest.createdAt.toISOString()}"
        Destination="https://idp.example.com/sso"
        AssertionConsumerServiceURL="${this.config.callbackUrl}"
        ProtocolBinding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST">
        <saml:Issuer>${this.config.issuer}</saml:Issuer>
        <samlp:NameIDPolicy Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress" AllowCreate="true"/>
      </samlp:AuthnRequest>
    `

    // In production, this should be properly signed and base64 encoded
    return Buffer.from(samlRequest.trim()).toString('base64')
  }

  async validateSAMLResponse(response: string): Promise<SSOUser | null> {
    try {
      // In production, properly validate SAML signature and decode
      const decoded = Buffer.from(response, 'base64').toString('utf-8')
      
      // Mock validation - in production, use proper SAML library
      if (decoded.includes('saml:Assertion')) {
        const mockUser: SSOUser = {
          id: crypto.randomUUID(),
          email: 'user@example.com',
          name: 'John Doe',
          firstName: 'John',
          lastName: 'Doe',
          groups: ['Users', 'Admins'],
          roles: ['admin'],
          attributes: {
            department: 'IT',
            location: 'São Paulo'
          },
          provider: 'saml',
          createdAt: new Date(),
          lastLogin: new Date()
        }

        this.emit('userAuthenticated', mockUser)
        return mockUser
      }

      return null
    } catch (error) {
      console.error('SAML validation error:', error)
      this.emit('authenticationError', error)
      return null
    }
  }

  generateLogoutRequest(sessionId: string): string {
    const logoutRequest = `
      <samlp:LogoutRequest 
        xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
        xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
        ID="${crypto.randomUUID()}"
        Version="2.0"
        IssueInstant="${new Date().toISOString()}"
        Destination="https://idp.example.com/slo">
        <saml:Issuer>${this.config.issuer}</saml:Issuer>
        <saml:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress">user@example.com</saml:NameID>
        <samlp:SessionIndex>${sessionId}</samlp:SessionIndex>
      </samlp:LogoutRequest>
    `

    return Buffer.from(logoutRequest.trim()).toString('base64')
  }
}

export class OAuth2Provider extends EventEmitter {
  private config: SSOConfig & {
    clientId: string
    clientSecret: string
    authorizationUrl: string
    tokenUrl: string
    userInfoUrl: string
    scope: string[]
  }

  constructor(config: SSOConfig & {
    clientId: string
    clientSecret: string
    authorizationUrl: string
    tokenUrl: string
    userInfoUrl: string
    scope: string[]
  }) {
    super()
    this.config = config
  }

  generateAuthUrl(state: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.callbackUrl,
      scope: this.config.scope.join(' '),
      state
    })

    return `${this.config.authorizationUrl}?${params.toString()}`
  }

  async exchangeCodeForToken(code: string): Promise<{
    accessToken: string
    refreshToken?: string
    expiresIn: number
    tokenType: string
  } | null> {
    try {
      // Mock token exchange - in production, make actual HTTP request
      await new Promise(resolve => setTimeout(resolve, 500))

      return {
        accessToken: crypto.randomBytes(32).toString('hex'),
        refreshToken: crypto.randomBytes(32).toString('hex'),
        expiresIn: 3600,
        tokenType: 'Bearer'
      }
    } catch (error) {
      console.error('Token exchange error:', error)
      this.emit('tokenError', error)
      return null
    }
  }

  async getUserInfo(accessToken: string): Promise<SSOUser | null> {
    try {
      // Mock user info retrieval - in production, make actual HTTP request
      await new Promise(resolve => setTimeout(resolve, 300))

      const mockUser: SSOUser = {
        id: crypto.randomUUID(),
        email: 'oauth.user@example.com',
        name: 'OAuth User',
        firstName: 'OAuth',
        lastName: 'User',
        groups: ['Users'],
        roles: ['user'],
        attributes: {
          provider_id: '12345',
          verified: true
        },
        provider: 'oauth2',
        createdAt: new Date(),
        lastLogin: new Date()
      }

      this.emit('userAuthenticated', mockUser)
      return mockUser
    } catch (error) {
      console.error('User info error:', error)
      this.emit('userInfoError', error)
      return null
    }
  }

  async refreshToken(refreshToken: string): Promise<{
    accessToken: string
    expiresIn: number
  } | null> {
    try {
      // Mock token refresh - in production, make actual HTTP request
      await new Promise(resolve => setTimeout(resolve, 300))

      return {
        accessToken: crypto.randomBytes(32).toString('hex'),
        expiresIn: 3600
      }
    } catch (error) {
      console.error('Token refresh error:', error)
      this.emit('refreshError', error)
      return null
    }
  }
}

export class OIDCProvider extends OAuth2Provider {
  private jwksUri: string
  private issuerUrl: string

  constructor(config: SSOConfig & {
    clientId: string
    clientSecret: string
    authorizationUrl: string
    tokenUrl: string
    userInfoUrl: string
    jwksUri: string
    issuerUrl: string
    scope: string[]
  }) {
    super(config)
    this.jwksUri = config.jwksUri
    this.issuerUrl = config.issuerUrl
  }

  async validateIdToken(idToken: string): Promise<SSOUser | null> {
    try {
      // Mock ID token validation - in production, verify JWT signature
      const payload = this.decodeJWT(idToken)
      
      if (payload && payload.iss === this.issuerUrl) {
        const mockUser: SSOUser = {
          id: payload.sub || crypto.randomUUID(),
          email: payload.email || 'oidc.user@example.com',
          name: payload.name || 'OIDC User',
          firstName: payload.given_name,
          lastName: payload.family_name,
          groups: payload.groups || ['Users'],
          roles: payload.roles || ['user'],
          attributes: {
            aud: payload.aud,
            iss: payload.iss,
            exp: payload.exp
          },
          provider: 'oidc',
          createdAt: new Date(),
          lastLogin: new Date()
        }

        this.emit('userAuthenticated', mockUser)
        return mockUser
      }

      return null
    } catch (error) {
      console.error('ID token validation error:', error)
      this.emit('tokenValidationError', error)
      return null
    }
  }

  private decodeJWT(token: string): any {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return null

      const payload = Buffer.from(parts[1], 'base64url').toString('utf-8')
      return JSON.parse(payload)
    } catch {
      return null
    }
  }

  async getJWKS(): Promise<any> {
    try {
      // Mock JWKS retrieval - in production, fetch from JWKS URI
      return {
        keys: [
          {
            kty: 'RSA',
            kid: 'test-key-1',
            use: 'sig',
            alg: 'RS256',
            n: 'mock-modulus',
            e: 'AQAB'
          }
        ]
      }
    } catch (error) {
      console.error('JWKS retrieval error:', error)
      return null
    }
  }
}

export class SSOManager extends EventEmitter {
  private providers = new Map<string, SSOProvider>()
  private sessions = new Map<string, SSOSession>()
  private authRequests = new Map<string, AuthRequest>()
  private config: SSOConfig

  constructor(config: SSOConfig) {
    super()
    this.config = config
    this.startSessionCleanup()
  }

  addProvider(provider: SSOProvider): void {
    this.providers.set(provider.id, provider)
    this.emit('providerAdded', provider)
    console.log(`✅ SSO Provider added: ${provider.name} (${provider.type})`)
  }

  removeProvider(providerId: string): void {
    const provider = this.providers.get(providerId)
    if (provider) {
      this.providers.delete(providerId)
      this.emit('providerRemoved', provider)
      console.log(`❌ SSO Provider removed: ${provider.name}`)
    }
  }

  getProvider(providerId: string): SSOProvider | undefined {
    return this.providers.get(providerId)
  }

  getEnabledProviders(): SSOProvider[] {
    return Array.from(this.providers.values()).filter(p => p.enabled)
  }

  async initiateSSO(providerId: string, returnUrl: string): Promise<{
    authUrl: string
    state: string
  }> {
    const provider = this.providers.get(providerId)
    if (!provider || !provider.enabled) {
      throw new Error(`Provider not found or disabled: ${providerId}`)
    }

    const state = crypto.randomBytes(32).toString('hex')
    const authRequest: AuthRequest = {
      id: crypto.randomUUID(),
      provider: providerId,
      returnUrl,
      state,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    }

    this.authRequests.set(state, authRequest)

    let authUrl: string

    switch (provider.type) {
      case 'saml':
        const samlProvider = new SAMLProvider(this.config)
        const samlRequest = samlProvider.generateSAMLRequest(authRequest)
        authUrl = `https://idp.example.com/sso?SAMLRequest=${encodeURIComponent(samlRequest)}&RelayState=${state}`
        break

      case 'oauth2':
        const oauth2Provider = new OAuth2Provider({
          ...this.config,
          ...provider.config as any
        })
        authUrl = oauth2Provider.generateAuthUrl(state)
        break

      case 'oidc':
        const oidcProvider = new OIDCProvider({
          ...this.config,
          ...provider.config as any
        })
        authUrl = oidcProvider.generateAuthUrl(state)
        break

      default:
        throw new Error(`Unsupported provider type: ${provider.type}`)
    }

    this.emit('ssoInitiated', { provider: providerId, authRequest })
    return { authUrl, state }
  }

  async handleSSOCallback(providerId: string, data: any): Promise<{
    user: SSOUser
    session: SSOSession
    returnUrl: string
  }> {
    const provider = this.providers.get(providerId)
    if (!provider) {
      throw new Error(`Provider not found: ${providerId}`)
    }

    const authRequest = this.authRequests.get(data.state)
    if (!authRequest || authRequest.expiresAt < new Date()) {
      throw new Error('Invalid or expired authentication request')
    }

    let user: SSOUser | null = null

    switch (provider.type) {
      case 'saml':
        const samlProvider = new SAMLProvider(this.config)
        user = await samlProvider.validateSAMLResponse(data.samlResponse)
        break

      case 'oauth2':
        const oauth2Provider = new OAuth2Provider({
          ...this.config,
          ...provider.config as any
        })
        const tokenResponse = await oauth2Provider.exchangeCodeForToken(data.code)
        if (tokenResponse) {
          user = await oauth2Provider.getUserInfo(tokenResponse.accessToken)
        }
        break

      case 'oidc':
        const oidcProvider = new OIDCProvider({
          ...this.config,
          ...provider.config as any
        })
        const oidcTokenResponse = await oidcProvider.exchangeCodeForToken(data.code)
        if (oidcTokenResponse) {
          if (data.id_token) {
            user = await oidcProvider.validateIdToken(data.id_token)
          } else {
            user = await oidcProvider.getUserInfo(oidcTokenResponse.accessToken)
          }
        }
        break
    }

    if (!user) {
      throw new Error('Failed to authenticate user')
    }

    // Create session
    const session = this.createSession(user, providerId)
    
    // Clean up auth request
    this.authRequests.delete(data.state)

    this.emit('ssoCompleted', { user, session, provider: providerId })
    
    return {
      user,
      session,
      returnUrl: authRequest.returnUrl
    }
  }

  private createSession(user: SSOUser, providerId: string): SSOSession {
    const sessionId = crypto.randomUUID()
    const session: SSOSession = {
      sessionId,
      userId: user.id,
      provider: providerId,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
      attributes: {
        email: user.email,
        name: user.name,
        groups: user.groups,
        roles: user.roles
      },
      isActive: true
    }

    this.sessions.set(sessionId, session)
    return session
  }

  async logout(sessionId: string): Promise<{ logoutUrl?: string }> {
    const session = this.sessions.get(sessionId)
    if (!session) {
      throw new Error('Session not found')
    }

    const provider = this.providers.get(session.provider)
    session.isActive = false

    let logoutUrl: string | undefined

    if (provider?.type === 'saml') {
      const samlProvider = new SAMLProvider(this.config)
      const logoutRequest = samlProvider.generateLogoutRequest(sessionId)
      logoutUrl = `https://idp.example.com/slo?SAMLRequest=${encodeURIComponent(logoutRequest)}`
    }

    this.sessions.delete(sessionId)
    this.emit('userLoggedOut', { sessionId, userId: session.userId })

    return { logoutUrl }
  }

  validateSession(sessionId: string): SSOSession | null {
    const session = this.sessions.get(sessionId)
    if (!session || !session.isActive || session.expiresAt < new Date()) {
      if (session) {
        this.sessions.delete(sessionId)
      }
      return null
    }

    return session
  }

  refreshSession(sessionId: string): SSOSession | null {
    const session = this.sessions.get(sessionId)
    if (!session || !session.isActive) {
      return null
    }

    // Extend session by 8 hours
    session.expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000)
    return session
  }

  getUserSessions(userId: string): SSOSession[] {
    return Array.from(this.sessions.values())
      .filter(session => session.userId === userId && session.isActive)
  }

  getAllSessions(): SSOSession[] {
    return Array.from(this.sessions.values())
  }

  getActiveSessionsCount(): number {
    return Array.from(this.sessions.values())
      .filter(session => session.isActive && session.expiresAt > new Date()).length
  }

  getSSOStats(): {
    totalProviders: number
    enabledProviders: number
    activeSessions: number
    totalUsers: number
    providerUsage: Record<string, number>
  } {
    const activeSessions = this.getActiveSessionsCount()
    const users = new Set(Array.from(this.sessions.values()).map(s => s.userId))
    const providerUsage: Record<string, number> = {}

    for (const session of this.sessions.values()) {
      if (session.isActive) {
        providerUsage[session.provider] = (providerUsage[session.provider] || 0) + 1
      }
    }

    return {
      totalProviders: this.providers.size,
      enabledProviders: this.getEnabledProviders().length,
      activeSessions,
      totalUsers: users.size,
      providerUsage
    }
  }

  private startSessionCleanup(): void {
    // Clean up expired sessions every 30 minutes
    setInterval(() => {
      const now = new Date()
      let cleanedCount = 0

      for (const [sessionId, session] of this.sessions) {
        if (session.expiresAt <= now) {
          this.sessions.delete(sessionId)
          cleanedCount++
        }
      }

      if (cleanedCount > 0) {
        console.log(`🧹 Cleaned up ${cleanedCount} expired SSO sessions`)
        this.emit('sessionsCleanedUp', { count: cleanedCount })
      }
    }, 30 * 60 * 1000)

    // Clean up expired auth requests every 10 minutes
    setInterval(() => {
      const now = new Date()
      let cleanedCount = 0

      for (const [state, request] of this.authRequests) {
        if (request.expiresAt <= now) {
          this.authRequests.delete(state)
          cleanedCount++
        }
      }

      if (cleanedCount > 0) {
        console.log(`🧹 Cleaned up ${cleanedCount} expired auth requests`)
      }
    }, 10 * 60 * 1000)
  }
}

// Factory function to create SSO manager
export function createSSOManager(config: SSOConfig): SSOManager {
  return new SSOManager(config)
}

export default SSOManager
