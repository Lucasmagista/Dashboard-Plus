/**
 * Multi-Factor Authentication (MFA) Implementation
 * Provides 2FA/MFA capabilities including TOTP, SMS, and backup codes
 */

import crypto from 'crypto'
import { EventEmitter } from 'events'
import base32 from 'hi-base32'

export interface MFAConfig {
  issuer: string
  algorithm: 'sha1' | 'sha256' | 'sha512'
  digits: number
  period: number
  window: number
}

export interface MFASecret {
  secret: string
  qrCode: string
  backupCodes: string[]
  userId: string
  createdAt: Date
  isVerified: boolean
}

export interface MFAVerification {
  userId: string
  token: string
  type: 'totp' | 'sms' | 'backup' | 'email'
  timestamp: Date
  isValid: boolean
}

export interface UserMFASettings {
  userId: string
  enabled: boolean
  methods: Array<'totp' | 'sms' | 'email' | 'backup'>
  totpSecret?: string
  phoneNumber?: string
  email?: string
  backupCodes: string[]
  lastUsed: Date
  createdAt: Date
}

export class TOTPGenerator {
  private config: MFAConfig

  constructor(config: Partial<MFAConfig> = {}) {
    this.config = {
      issuer: config.issuer || 'CRM Dashboard',
      algorithm: config.algorithm || 'sha1',
      digits: config.digits || 6,
      period: config.period || 30,
      window: config.window || 1
    }
  }

  generateSecret(): string {
    // Use hex encoding and convert to base32 if needed
    // You can use a library like 'hi-base32' for base32 encoding
    // Example with 'hi-base32':
    // import base32 from 'hi-base32'
    // return base32.encode(crypto.randomBytes(32)).replace(/=+$/, '')
    return crypto.randomBytes(32).toString('hex')
  }

  generateQRCode(secret: string, userEmail: string): string {
    const label = encodeURIComponent(`${this.config.issuer}:${userEmail}`)
    const issuer = encodeURIComponent(this.config.issuer)
    
    return `otpauth://totp/${label}?secret=${secret}&issuer=${issuer}&algorithm=${this.config.algorithm}&digits=${this.config.digits}&period=${this.config.period}`
  }

  generateToken(secret: string, timestamp?: number): string {
    const time = Math.floor((timestamp || Date.now()) / 1000 / this.config.period)
    const buffer = Buffer.allocUnsafe(8)
    buffer.writeUInt32BE(0, 0)
    buffer.writeUInt32BE(time, 4)
    const secretBuffer = Buffer.from(base32.decode.asBytes(secret))
    const hmac = crypto.createHmac(this.config.algorithm, secretBuffer)
    hmac.update(buffer)
    const hash = hmac.digest()

    const offset = hash[hash.length - 1] & 0x0f
    const code = (hash.readUInt32BE(offset) & 0x7fffffff) % Math.pow(10, this.config.digits)
    
    return code.toString().padStart(this.config.digits, '0')
  }

  verifyToken(token: string, secret: string): boolean {
    const currentTime = Math.floor(Date.now() / 1000)
    
    for (let i = -this.config.window; i <= this.config.window; i++) {
      const time = currentTime + i * this.config.period
      const expectedToken = this.generateToken(secret, time * 1000)
      
      if (token === expectedToken) {
        return true
      }
    }
    
    return false
  }
}

export class BackupCodeGenerator {
  generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = []
    
    for (let i = 0; i < count; i++) {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase()
      codes.push(`${code.substring(0, 4)}-${code.substring(4, 8)}`)
    }
    
    return codes
  }

  hashBackupCode(code: string): string {
    return crypto.createHash('sha256').update(code).digest('hex')
  }

  verifyBackupCode(code: string, hashedCode: string): boolean {
    return this.hashBackupCode(code) === hashedCode
  }
}

export class SMSProvider extends EventEmitter {
  // Mock SMS provider - in production, integrate with Twilio, AWS SNS, etc.
  
  async sendSMS(phoneNumber: string, message: string): Promise<boolean> {
    try {
      // Simulate SMS sending
      console.log(`📱 SMS sent to ${phoneNumber}: ${message}`)
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      this.emit('smsSent', { phoneNumber, message, timestamp: new Date() })
      return true
    } catch (error) {
      console.error('SMS sending failed:', error)
      this.emit('smsError', { phoneNumber, error, timestamp: new Date() })
      return false
    }
  }

  async sendMFACode(phoneNumber: string, code: string): Promise<boolean> {
    const message = `Your verification code is: ${code}. This code will expire in 5 minutes.`
    return this.sendSMS(phoneNumber, message)
  }

  generateSMSCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }
}

export class EmailProvider extends EventEmitter {
  // Mock email provider - in production, integrate with SendGrid, SES, etc.
  
  async sendEmail(email: string, subject: string, body: string): Promise<boolean> {
    try {
      // Simulate email sending
      console.log(`📧 Email sent to ${email}: ${subject}`)
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      this.emit('emailSent', { email, subject, body, timestamp: new Date() })
      return true
    } catch (error) {
      console.error('Email sending failed:', error)
      this.emit('emailError', { email, error, timestamp: new Date() })
      return false
    }
  }

  async sendMFACode(email: string, code: string): Promise<boolean> {
    const subject = 'Your verification code'
    const body = `
      <h2>Verification Code</h2>
      <p>Your verification code is: <strong>${code}</strong></p>
      <p>This code will expire in 5 minutes.</p>
      <p>If you didn't request this code, please ignore this email.</p>
    `
    return this.sendEmail(email, subject, body)
  }

  generateEmailCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }
}

export class MFAManager extends EventEmitter {
  private totpGenerator: TOTPGenerator
  private backupCodeGenerator: BackupCodeGenerator
  private smsProvider: SMSProvider
  private emailProvider: EmailProvider
  private userSettings = new Map<string, UserMFASettings>()
  private pendingVerifications = new Map<string, { code: string; type: string; expiresAt: Date }>()

  constructor(config?: Partial<MFAConfig>) {
    super()
    this.totpGenerator = new TOTPGenerator(config)
    this.backupCodeGenerator = new BackupCodeGenerator()
    this.smsProvider = new SMSProvider()
    this.emailProvider = new EmailProvider()
    
    this.setupEventListeners()
  }

  private setupEventListeners(): void {
    this.smsProvider.on('smsSent', (data) => {
      this.emit('mfaCodeSent', { ...data, method: 'sms' })
    })

    this.emailProvider.on('emailSent', (data) => {
      this.emit('mfaCodeSent', { ...data, method: 'email' })
    })
  }

  async setupMFA(userId: string, userEmail: string): Promise<MFASecret> {
    const secret = this.totpGenerator.generateSecret()
    const qrCode = this.totpGenerator.generateQRCode(secret, userEmail)
    const backupCodes = this.backupCodeGenerator.generateBackupCodes()

    const mfaSecret: MFASecret = {
      secret,
      qrCode,
      backupCodes,
      userId,
      createdAt: new Date(),
      isVerified: false
    }

    // Store user settings
    const userSettings: UserMFASettings = {
      userId,
      enabled: false,
      methods: ['totp', 'backup'],
      totpSecret: secret,
      backupCodes: backupCodes.map(code => this.backupCodeGenerator.hashBackupCode(code)),
      lastUsed: new Date(),
      createdAt: new Date()
    }

    this.userSettings.set(userId, userSettings)
    this.emit('mfaSetupInitiated', { userId, userEmail })

    return mfaSecret
  }

  async verifyMFASetup(userId: string, token: string): Promise<boolean> {
    const userSettings = this.userSettings.get(userId)
    if (!userSettings || !userSettings.totpSecret) {
      return false
    }

    const isValid = this.totpGenerator.verifyToken(token, userSettings.totpSecret)
    
    if (isValid) {
      userSettings.enabled = true
      userSettings.lastUsed = new Date()
      this.emit('mfaSetupCompleted', { userId })
    }

    return isValid
  }

  async enableMFA(userId: string, methods: Array<'totp' | 'sms' | 'email' | 'backup'>): Promise<void> {
    const userSettings = this.userSettings.get(userId)
    if (!userSettings) {
      throw new Error('MFA not set up for user')
    }

    userSettings.enabled = true
    userSettings.methods = methods
    this.emit('mfaEnabled', { userId, methods })
  }

  async disableMFA(userId: string): Promise<void> {
    const userSettings = this.userSettings.get(userId)
    if (!userSettings) {
      throw new Error('MFA not set up for user')
    }

    userSettings.enabled = false
    this.emit('mfaDisabled', { userId })
  }

  async sendMFACode(userId: string, method: 'sms' | 'email'): Promise<boolean> {
    const userSettings = this.userSettings.get(userId)
    if (!userSettings || !userSettings.enabled) {
      throw new Error('MFA not enabled for user')
    }

    let code: string
    let sent = false

    switch (method) {
      case 'sms':
        if (!userSettings.phoneNumber) {
          throw new Error('Phone number not configured for user')
        }
        code = this.smsProvider.generateSMSCode()
        sent = await this.smsProvider.sendMFACode(userSettings.phoneNumber, code)
        break

      case 'email':
        if (!userSettings.email) {
          throw new Error('Email not configured for user')
        }
        code = this.emailProvider.generateEmailCode()
        sent = await this.emailProvider.sendMFACode(userSettings.email, code)
        break

      default:
        throw new Error('Invalid MFA method')
    }

    if (sent) {
      // Store pending verification
      this.pendingVerifications.set(userId, {
        code,
        type: method,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
      })
    }

    return sent
  }

  async verifyMFA(userId: string, token: string, method: 'totp' | 'sms' | 'email' | 'backup'): Promise<MFAVerification> {
    const userSettings = this.userSettings.get(userId)
    if (!userSettings || !userSettings.enabled) {
      throw new Error('MFA not enabled for user')
    }

    const verification: MFAVerification = {
      userId,
      token,
      type: method,
      timestamp: new Date(),
      isValid: false
    }

    switch (method) {
      case 'totp':
        if (userSettings.totpSecret) {
          verification.isValid = this.totpGenerator.verifyToken(token, userSettings.totpSecret)
        }
        break

      case 'sms':
      case 'email':
        const pending = this.pendingVerifications.get(userId)
        if (pending && pending.type === method && pending.expiresAt > new Date()) {
          verification.isValid = pending.code === token
          if (verification.isValid) {
            this.pendingVerifications.delete(userId)
          }
        }
        break

      case 'backup':
        const codeIndex = userSettings.backupCodes.findIndex(hashedCode => 
          this.backupCodeGenerator.verifyBackupCode(token, hashedCode)
        )
        if (codeIndex !== -1) {
          verification.isValid = true
          // Remove used backup code
          userSettings.backupCodes.splice(codeIndex, 1)
        }
        break
    }

    if (verification.isValid) {
      userSettings.lastUsed = new Date()
      this.emit('mfaVerified', verification)
    } else {
      this.emit('mfaFailed', verification)
    }

    return verification
  }

  async addPhoneNumber(userId: string, phoneNumber: string): Promise<void> {
    const userSettings = this.userSettings.get(userId)
    if (!userSettings) {
      throw new Error('MFA not set up for user')
    }

    userSettings.phoneNumber = phoneNumber
    if (!userSettings.methods.includes('sms')) {
      userSettings.methods.push('sms')
    }
  }

  async addEmail(userId: string, email: string): Promise<void> {
    const userSettings = this.userSettings.get(userId)
    if (!userSettings) {
      throw new Error('MFA not set up for user')
    }

    userSettings.email = email
    if (!userSettings.methods.includes('email')) {
      userSettings.methods.push('email')
    }
  }

  async generateNewBackupCodes(userId: string): Promise<string[]> {
    const userSettings = this.userSettings.get(userId)
    if (!userSettings) {
      throw new Error('MFA not set up for user')
    }

    const newCodes = this.backupCodeGenerator.generateBackupCodes()
    userSettings.backupCodes = newCodes.map(code => this.backupCodeGenerator.hashBackupCode(code))
    
    this.emit('backupCodesGenerated', { userId, count: newCodes.length })
    return newCodes
  }

  getUserMFASettings(userId: string): UserMFASettings | undefined {
    return this.userSettings.get(userId)
  }

  isMFAEnabled(userId: string): boolean {
    const userSettings = this.userSettings.get(userId)
    return userSettings ? userSettings.enabled : false
  }

  getAvailableMethods(userId: string): Array<'totp' | 'sms' | 'email' | 'backup'> {
    const userSettings = this.userSettings.get(userId)
    return userSettings ? userSettings.methods : []
  }

  getMFAStats(): {
    totalUsers: number
    enabledUsers: number
    methodStats: Record<string, number>
  } {
    const stats = {
      totalUsers: this.userSettings.size,
      enabledUsers: 0,
      methodStats: {
        totp: 0,
        sms: 0,
        email: 0,
        backup: 0
      }
    }

    for (const settings of this.userSettings.values()) {
      if (settings.enabled) {
        stats.enabledUsers++
        for (const method of settings.methods) {
          stats.methodStats[method]++
        }
      }
    }

    return stats
  }

  // Clean up expired pending verifications
  cleanupExpiredVerifications(): void {
    const now = new Date()
    for (const [userId, pending] of this.pendingVerifications) {
      if (pending.expiresAt <= now) {
        this.pendingVerifications.delete(userId)
      }
    }
  }
}

// Factory function to create MFA manager
export function createMFAManager(config?: Partial<MFAConfig>): MFAManager {
  return new MFAManager(config)
}

export default MFAManager
