/**
 * LGPD/GDPR Compliance Tools
 * Provides comprehensive data protection compliance features
 */

import crypto from 'crypto'
import { EventEmitter } from 'events'

export interface DataSubject {
  id: string
  email: string
  name?: string
  phone?: string
  documentId?: string
  consentRecords: ConsentRecord[]
  dataProcessingActivities: DataProcessingActivity[]
  createdAt: Date
  updatedAt: Date
}

export interface ConsentRecord {
  id: string
  subjectId: string
  purpose: string
  lawfulBasis: LawfulBasis
  granted: boolean
  grantedAt?: Date
  revokedAt?: Date
  source: string
  version: string
  metadata: Record<string, any>
}

export interface DataProcessingActivity {
  id: string
  subjectId: string
  purpose: string
  dataCategories: DataCategory[]
  lawfulBasis: LawfulBasis
  retention: RetentionPolicy
  processor?: string
  thirdPartyTransfers: ThirdPartyTransfer[]
  createdAt: Date
}

export interface DataSubjectRequest {
  id: string
  subjectId: string
  type: RequestType
  status: RequestStatus
  description?: string
  requestedAt: Date
  processedAt?: Date
  processedBy?: string
  response?: string
  attachments?: string[]
}

export interface PrivacyImpactAssessment {
  id: string
  title: string
  description: string
  riskLevel: 'low' | 'medium' | 'high'
  dataTypes: DataCategory[]
  purposes: string[]
  measures: SecurityMeasure[]
  approvedBy?: string
  approvedAt?: Date
  reviewDate: Date
  createdAt: Date
}

export interface DataBreach {
  id: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  dataTypes: DataCategory[]
  affectedSubjects: number
  discoveredAt: Date
  reportedAt?: Date
  containedAt?: Date
  resolvedAt?: Date
  notificationRequired: boolean
  authorityNotified: boolean
  subjectsNotified: boolean
  measures: string[]
  status: 'open' | 'investigating' | 'contained' | 'resolved'
}

export enum LawfulBasis {
  CONSENT = 'consent',
  CONTRACT = 'contract',
  LEGAL_OBLIGATION = 'legal_obligation',
  VITAL_INTERESTS = 'vital_interests',
  PUBLIC_TASK = 'public_task',
  LEGITIMATE_INTERESTS = 'legitimate_interests'
}

export enum DataCategory {
  PERSONAL_DETAILS = 'personal_details',
  CONTACT_INFO = 'contact_info',
  FINANCIAL = 'financial',
  HEALTH = 'health',
  BIOMETRIC = 'biometric',
  SPECIAL_CATEGORY = 'special_category',
  BEHAVIORAL = 'behavioral',
  LOCATION = 'location',
  TECHNICAL = 'technical'
}

export enum RequestType {
  ACCESS = 'access',
  RECTIFICATION = 'rectification',
  ERASURE = 'erasure',
  PORTABILITY = 'portability',
  RESTRICTION = 'restriction',
  OBJECTION = 'objection'
}

export enum RequestStatus {
  RECEIVED = 'received',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
  ESCALATED = 'escalated'
}

export interface RetentionPolicy {
  period: number // in days
  reason: string
  autoDelete: boolean
  reviewRequired: boolean
}

export interface SecurityMeasure {
  id: string
  name: string
  description: string
  implemented: boolean
  implementedAt?: Date
  lastReview?: Date
}

export interface ThirdPartyTransfer {
  recipient: string
  country: string
  purpose: string
  safeguards: string[]
  approvedAt: Date
}

export class ConsentManager extends EventEmitter {
  private consents = new Map<string, ConsentRecord[]>()
  private purposes = new Map<string, { name: string; description: string; required: boolean }>()

  addPurpose(id: string, name: string, description: string, required: boolean = false): void {
    this.purposes.set(id, { name, description, required })
    this.emit('purposeAdded', { id, name, description, required })
  }

  async recordConsent(
    subjectId: string,
    purpose: string,
    granted: boolean,
    source: string,
    metadata: Record<string, any> = {}
  ): Promise<ConsentRecord> {
    const consent: ConsentRecord = {
      id: crypto.randomUUID(),
      subjectId,
      purpose,
      lawfulBasis: LawfulBasis.CONSENT,
      granted,
      grantedAt: granted ? new Date() : undefined,
      revokedAt: !granted ? new Date() : undefined,
      source,
      version: '1.0',
      metadata
    }

    if (!this.consents.has(subjectId)) {
      this.consents.set(subjectId, [])
    }

    this.consents.get(subjectId)!.push(consent)
    this.emit('consentRecorded', consent)

    console.log(`📝 Consent ${granted ? 'granted' : 'revoked'} for ${purpose} by ${subjectId}`)
    return consent
  }

  async revokeConsent(subjectId: string, purpose: string): Promise<boolean> {
    const subjectConsents = this.consents.get(subjectId)
    if (!subjectConsents) return false

    const activeConsent = subjectConsents
      .filter(c => c.purpose === purpose && c.granted && !c.revokedAt)
      .sort((a, b) => (b.grantedAt?.getTime() || 0) - (a.grantedAt?.getTime() || 0))[0]

    if (activeConsent) {
      activeConsent.granted = false
      activeConsent.revokedAt = new Date()
      this.emit('consentRevoked', activeConsent)
      return true
    }

    return false
  }

  getConsent(subjectId: string, purpose: string): ConsentRecord | null {
    const subjectConsents = this.consents.get(subjectId)
    if (!subjectConsents) return null

    return subjectConsents
      .filter(c => c.purpose === purpose)
      .sort((a, b) => (b.grantedAt?.getTime() || 0) - (a.grantedAt?.getTime() || 0))[0] || null
  }

  hasValidConsent(subjectId: string, purpose: string): boolean {
    const consent = this.getConsent(subjectId, purpose)
    return consent ? consent.granted && !consent.revokedAt : false
  }

  getAllConsents(subjectId: string): ConsentRecord[] {
    return this.consents.get(subjectId) || []
  }

  getConsentReport(): {
    totalSubjects: number
    totalConsents: number
    grantedConsents: number
    revokedConsents: number
    consentsByPurpose: Record<string, number>
  } {
    let totalConsents = 0
    let grantedConsents = 0
    let revokedConsents = 0
    const consentsByPurpose: Record<string, number> = {}

    for (const consents of this.consents.values()) {
      for (const consent of consents) {
        totalConsents++
        if (consent.granted && !consent.revokedAt) {
          grantedConsents++
        } else {
          revokedConsents++
        }

        consentsByPurpose[consent.purpose] = (consentsByPurpose[consent.purpose] || 0) + 1
      }
    }

    return {
      totalSubjects: this.consents.size,
      totalConsents,
      grantedConsents,
      revokedConsents,
      consentsByPurpose
    }
  }
}

export class DataSubjectRightsManager extends EventEmitter {
  private requests = new Map<string, DataSubjectRequest>()
  private subjects = new Map<string, DataSubject>()

  async submitRequest(
    subjectId: string,
    type: RequestType,
    description?: string
  ): Promise<DataSubjectRequest> {
    const request: DataSubjectRequest = {
      id: crypto.randomUUID(),
      subjectId,
      type,
      status: RequestStatus.RECEIVED,
      description,
      requestedAt: new Date()
    }

    this.requests.set(request.id, request)
    this.emit('requestSubmitted', request)

    console.log(`📋 Data subject request submitted: ${type} for ${subjectId}`)
    return request
  }

  async processRequest(requestId: string, processedBy: string): Promise<void> {
    const request = this.requests.get(requestId)
    if (!request) {
      throw new Error('Request not found')
    }

    request.status = RequestStatus.IN_PROGRESS
    request.processedBy = processedBy
    this.emit('requestProcessing', request)
  }

  async completeRequest(
    requestId: string,
    response: string,
    attachments?: string[]
  ): Promise<void> {
    const request = this.requests.get(requestId)
    if (!request) {
      throw new Error('Request not found')
    }

    request.status = RequestStatus.COMPLETED
    request.processedAt = new Date()
    request.response = response
    request.attachments = attachments

    this.emit('requestCompleted', request)

    // Auto-execute certain requests
    if (request.type === RequestType.ERASURE) {
      await this.executeErasureRequest(request.subjectId)
    }
  }

  async rejectRequest(requestId: string, reason: string): Promise<void> {
    const request = this.requests.get(requestId)
    if (!request) {
      throw new Error('Request not found')
    }

    request.status = RequestStatus.REJECTED
    request.processedAt = new Date()
    request.response = reason

    this.emit('requestRejected', request)
  }

  private async executeErasureRequest(subjectId: string): Promise<void> {
    // In a real implementation, this would trigger data deletion across all systems
    const subject = this.subjects.get(subjectId)
    if (subject) {
      this.subjects.delete(subjectId)
      this.emit('dataErased', { subjectId })
      console.log(`🗑️ Data erased for subject: ${subjectId}`)
    }
  }

  async generateDataExport(subjectId: string): Promise<{
    personalData: any
    consentRecords: ConsentRecord[]
    processingActivities: DataProcessingActivity[]
  }> {
    const subject = this.subjects.get(subjectId)
    if (!subject) {
      throw new Error('Data subject not found')
    }

    return {
      personalData: {
        id: subject.id,
        email: subject.email,
        name: subject.name,
        phone: subject.phone,
        documentId: subject.documentId,
        createdAt: subject.createdAt,
        updatedAt: subject.updatedAt
      },
      consentRecords: subject.consentRecords,
      processingActivities: subject.dataProcessingActivities
    }
  }

  getRequest(requestId: string): DataSubjectRequest | undefined {
    return this.requests.get(requestId)
  }

  getSubjectRequests(subjectId: string): DataSubjectRequest[] {
    return Array.from(this.requests.values()).filter(r => r.subjectId === subjectId)
  }

  getPendingRequests(): DataSubjectRequest[] {
    return Array.from(this.requests.values())
      .filter(r => r.status === RequestStatus.RECEIVED || r.status === RequestStatus.IN_PROGRESS)
  }

  getRequestsReport(): {
    totalRequests: number
    pendingRequests: number
    completedRequests: number
    requestsByType: Record<string, number>
    averageProcessingTime: number
  } {
    const requests = Array.from(this.requests.values())
    const completed = requests.filter(r => r.status === RequestStatus.COMPLETED)
    
    const requestsByType: Record<string, number> = {}
    let totalProcessingTime = 0

    for (const request of requests) {
      requestsByType[request.type] = (requestsByType[request.type] || 0) + 1
      
      if (request.processedAt && request.requestedAt) {
        totalProcessingTime += request.processedAt.getTime() - request.requestedAt.getTime()
      }
    }

    return {
      totalRequests: requests.length,
      pendingRequests: requests.filter(r => 
        r.status === RequestStatus.RECEIVED || r.status === RequestStatus.IN_PROGRESS
      ).length,
      completedRequests: completed.length,
      requestsByType,
      averageProcessingTime: completed.length > 0 ? totalProcessingTime / completed.length : 0
    }
  }
}

export class DataBreachManager extends EventEmitter {
  private breaches = new Map<string, DataBreach>()

  async reportBreach(
    title: string,
    description: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    dataTypes: DataCategory[],
    affectedSubjects: number
  ): Promise<DataBreach> {
    const breach: DataBreach = {
      id: crypto.randomUUID(),
      title,
      description,
      severity,
      dataTypes,
      affectedSubjects,
      discoveredAt: new Date(),
      notificationRequired: severity === 'high' || severity === 'critical',
      authorityNotified: false,
      subjectsNotified: false,
      measures: [],
      status: 'open'
    }

    this.breaches.set(breach.id, breach)
    this.emit('breachReported', breach)

    // Auto-trigger notifications for severe breaches
    if (breach.notificationRequired) {
      setTimeout(() => this.checkNotificationDeadlines(breach.id), 1000)
    }

    console.log(`🚨 Data breach reported: ${title} (${severity})`)
    return breach
  }

  async updateBreachStatus(
    breachId: string,
    status: 'open' | 'investigating' | 'contained' | 'resolved',
    measures?: string[]
  ): Promise<void> {
    const breach = this.breaches.get(breachId)
    if (!breach) {
      throw new Error('Breach not found')
    }

    breach.status = status
    
    if (measures) {
      breach.measures.push(...measures)
    }

    if (status === 'contained') {
      breach.containedAt = new Date()
    } else if (status === 'resolved') {
      breach.resolvedAt = new Date()
    }

    this.emit('breachUpdated', breach)
  }

  async notifyAuthority(breachId: string): Promise<void> {
    const breach = this.breaches.get(breachId)
    if (!breach) {
      throw new Error('Breach not found')
    }

    breach.authorityNotified = true
    breach.reportedAt = new Date()
    this.emit('authorityNotified', breach)

    console.log(`📢 Authority notified for breach: ${breach.title}`)
  }

  async notifySubjects(breachId: string): Promise<void> {
    const breach = this.breaches.get(breachId)
    if (!breach) {
      throw new Error('Breach not found')
    }

    breach.subjectsNotified = true
    this.emit('subjectsNotified', breach)

    console.log(`📧 Subjects notified for breach: ${breach.title}`)
  }

  private checkNotificationDeadlines(breachId: string): void {
    const breach = this.breaches.get(breachId)
    if (!breach) return

    const hoursSinceDiscovery = (Date.now() - breach.discoveredAt.getTime()) / (1000 * 60 * 60)

    // GDPR requires notification within 72 hours
    if (hoursSinceDiscovery >= 72 && !breach.authorityNotified) {
      this.emit('notificationDeadlineExceeded', {
        breachId,
        type: 'authority',
        hoursSinceDiscovery
      })
    }

    // Check again in 1 hour if not notified
    if (!breach.authorityNotified) {
      setTimeout(() => this.checkNotificationDeadlines(breachId), 60 * 60 * 1000)
    }
  }

  getBreach(breachId: string): DataBreach | undefined {
    return this.breaches.get(breachId)
  }

  getActiveBreaches(): DataBreach[] {
    return Array.from(this.breaches.values())
      .filter(b => b.status !== 'resolved')
  }

  getBreachesReport(): {
    totalBreaches: number
    activeBreaches: number
    resolvedBreaches: number
    breachesBySeverity: Record<string, number>
    averageResolutionTime: number
    notificationCompliance: number
  } {
    const breaches = Array.from(this.breaches.values())
    const resolved = breaches.filter(b => b.status === 'resolved')
    
    const breachesBySeverity: Record<string, number> = {}
    let totalResolutionTime = 0
    let compliantNotifications = 0

    for (const breach of breaches) {
      breachesBySeverity[breach.severity] = (breachesBySeverity[breach.severity] || 0) + 1
      
      if (breach.resolvedAt) {
        totalResolutionTime += breach.resolvedAt.getTime() - breach.discoveredAt.getTime()
      }

      if (breach.notificationRequired) {
        const notificationTime = breach.reportedAt?.getTime() || Date.now()
        const timeDiff = (notificationTime - breach.discoveredAt.getTime()) / (1000 * 60 * 60)
        if (timeDiff <= 72) {
          compliantNotifications++
        }
      }
    }

    const requiredNotifications = breaches.filter(b => b.notificationRequired).length

    return {
      totalBreaches: breaches.length,
      activeBreaches: breaches.filter(b => b.status !== 'resolved').length,
      resolvedBreaches: resolved.length,
      breachesBySeverity,
      averageResolutionTime: resolved.length > 0 ? totalResolutionTime / resolved.length : 0,
      notificationCompliance: requiredNotifications > 0 ? compliantNotifications / requiredNotifications : 1
    }
  }
}

export class ComplianceManager extends EventEmitter {
  private consentManager: ConsentManager
  private rightsManager: DataSubjectRightsManager
  private breachManager: DataBreachManager
  private assessments = new Map<string, PrivacyImpactAssessment>()

  constructor() {
    super()
    this.consentManager = new ConsentManager()
    this.rightsManager = new DataSubjectRightsManager()
    this.breachManager = new DataBreachManager()
    
    this.setupEventListeners()
  }

  private setupEventListeners(): void {
    this.consentManager.on('consentRevoked', (consent) => {
      this.emit('complianceEvent', {
        type: 'consent_revoked',
        data: consent,
        timestamp: new Date()
      })
    })

    this.rightsManager.on('requestSubmitted', (request) => {
      this.emit('complianceEvent', {
        type: 'subject_request',
        data: request,
        timestamp: new Date()
      })
    })

    this.breachManager.on('breachReported', (breach) => {
      this.emit('complianceEvent', {
        type: 'data_breach',
        data: breach,
        timestamp: new Date()
      })
    })

    this.breachManager.on('notificationDeadlineExceeded', (data) => {
      this.emit('complianceViolation', {
        type: 'notification_deadline_exceeded',
        data,
        timestamp: new Date()
      })
    })
  }

  getConsentManager(): ConsentManager {
    return this.consentManager
  }

  getRightsManager(): DataSubjectRightsManager {
    return this.rightsManager
  }

  getBreachManager(): DataBreachManager {
    return this.breachManager
  }

  async createPrivacyImpactAssessment(
    title: string,
    description: string,
    riskLevel: 'low' | 'medium' | 'high',
    dataTypes: DataCategory[],
    purposes: string[]
  ): Promise<PrivacyImpactAssessment> {
    const pia: PrivacyImpactAssessment = {
      id: crypto.randomUUID(),
      title,
      description,
      riskLevel,
      dataTypes,
      purposes,
      measures: [],
      reviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      createdAt: new Date()
    }

    this.assessments.set(pia.id, pia)
    this.emit('piaCreated', pia)

    return pia
  }

  async approveAssessment(assessmentId: string, approvedBy: string): Promise<void> {
    const assessment = this.assessments.get(assessmentId)
    if (!assessment) {
      throw new Error('Assessment not found')
    }

    assessment.approvedBy = approvedBy
    assessment.approvedAt = new Date()
    this.emit('piaApproved', assessment)
  }

  getComplianceReport(): {
    consentCompliance: ReturnType<ConsentManager['getConsentReport']>
    rightsCompliance: ReturnType<DataSubjectRightsManager['getRequestsReport']>
    breachCompliance: ReturnType<DataBreachManager['getBreachesReport']>
    assessments: {
      total: number
      approved: number
      pending: number
      highRisk: number
    }
  } {
    const assessments = Array.from(this.assessments.values())

    return {
      consentCompliance: this.consentManager.getConsentReport(),
      rightsCompliance: this.rightsManager.getRequestsReport(),
      breachCompliance: this.breachManager.getBreachesReport(),
      assessments: {
        total: assessments.length,
        approved: assessments.filter(a => a.approvedAt).length,
        pending: assessments.filter(a => !a.approvedAt).length,
        highRisk: assessments.filter(a => a.riskLevel === 'high').length
      }
    }
  }

  // Compliance score calculation
  calculateComplianceScore(): {
    overall: number
    consent: number
    rights: number
    breaches: number
    assessments: number
  } {
    const consentReport = this.consentManager.getConsentReport()
    const rightsReport = this.rightsManager.getRequestsReport()
    const breachReport = this.breachManager.getBreachesReport()
    const assessments = Array.from(this.assessments.values())

    // Consent score (0-100)
    const consentScore = consentReport.totalConsents > 0 
      ? (consentReport.grantedConsents / consentReport.totalConsents) * 100 
      : 100

    // Rights score (0-100) - based on response time
    const rightsScore = rightsReport.totalRequests > 0
      ? Math.max(0, 100 - (rightsReport.averageProcessingTime / (24 * 60 * 60 * 1000)) * 10) // Penalty for each day
      : 100

    // Breach score (0-100) - based on notification compliance
    const breachScore = breachReport.notificationCompliance * 100

    // Assessment score (0-100) - based on approval rate
    const assessmentScore = assessments.length > 0
      ? (assessments.filter(a => a.approvedAt).length / assessments.length) * 100
      : 100

    const overall = (consentScore + rightsScore + breachScore + assessmentScore) / 4

    return {
      overall: Math.round(overall),
      consent: Math.round(consentScore),
      rights: Math.round(rightsScore),
      breaches: Math.round(breachScore),
      assessments: Math.round(assessmentScore)
    }
  }
}

// Factory function to create compliance manager
export function createComplianceManager(): ComplianceManager {
  return new ComplianceManager()
}

export default ComplianceManager
