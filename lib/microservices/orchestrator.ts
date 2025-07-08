/**
 * Microservices Architecture Implementation
 * This module provides a framework for building microservices-based applications
 */

import { EventEmitter } from 'events'

export interface ServiceConfig {
  name: string
  version: string
  port?: number
  dependencies?: string[]
  healthCheck?: () => Promise<boolean>
  routes?: ServiceRoute[]
}

export interface ServiceRoute {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  handler: (req: any, res: any) => Promise<any>
  middleware?: Array<(req: any, res: any, next: () => void) => void>
}

export interface ServiceInfo {
  id: string
  name: string
  version: string
  status: 'healthy' | 'unhealthy' | 'starting' | 'stopping'
  lastHeartbeat: Date
  endpoint: string
  metadata: Record<string, any>
}

export interface CircuitBreakerConfig {
  failureThreshold: number
  resetTimeout: number
  monitoringPeriod: number
}

export class CircuitBreaker {
  private failureCount = 0
  private lastFailureTime?: Date
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED'

  constructor(private config: CircuitBreakerConfig) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (this.shouldAttemptReset()) {
        this.state = 'HALF_OPEN'
      } else {
        throw new Error('Circuit breaker is OPEN')
      }
    }

    try {
      const result = await operation()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private shouldAttemptReset(): boolean {
    return !!this.lastFailureTime && 
           (Date.now() - (this.lastFailureTime ? this.lastFailureTime.getTime() : 0) > this.config.resetTimeout)
  }

  private onSuccess(): void {
    this.failureCount = 0
    this.state = 'CLOSED'
  }

  private onFailure(): void {
    this.failureCount++
    this.lastFailureTime = new Date()
    
    if (this.failureCount >= this.config.failureThreshold) {
      this.state = 'OPEN'
    }
  }

  getState(): string {
    return this.state
  }
}

export class ServiceRegistry extends EventEmitter {
  private services = new Map<string, ServiceInfo>()
  private heartbeatInterval = 30000 // 30 seconds

  register(service: ServiceInfo): void {
    this.services.set(service.id, {
      ...service,
      lastHeartbeat: new Date()
    })
    
    this.emit('serviceRegistered', service)
    console.log(`✅ Service registered: ${service.name} (${service.id})`)
  }

  unregister(serviceId: string): void {
    const service = this.services.get(serviceId)
    if (service) {
      this.services.delete(serviceId)
      this.emit('serviceUnregistered', service)
      console.log(`❌ Service unregistered: ${service.name} (${serviceId})`)
    }
  }

  discover(serviceName: string): ServiceInfo[] {
    return Array.from(this.services.values())
      .filter(service => service.name === serviceName && service.status === 'healthy')
  }

  getService(serviceId: string): ServiceInfo | undefined {
    return this.services.get(serviceId)
  }

  getAllServices(): ServiceInfo[] {
    return Array.from(this.services.values())
  }

  updateHeartbeat(serviceId: string): void {
    const service = this.services.get(serviceId)
    if (service) {
      service.lastHeartbeat = new Date()
      service.status = 'healthy'
    }
  }

  startHealthMonitoring(): void {
    setInterval(() => {
      this.checkServicesHealth()
    }, this.heartbeatInterval)
  }

  private checkServicesHealth(): void {
    const now = new Date()
    const threshold = this.heartbeatInterval * 2

    for (const [serviceId, service] of this.services) {
      const timeSinceLastHeartbeat = now.getTime() - service.lastHeartbeat.getTime()
      
      if (timeSinceLastHeartbeat > threshold && service.status === 'healthy') {
        service.status = 'unhealthy'
        this.emit('serviceUnhealthy', service)
        console.warn(`⚠️ Service unhealthy: ${service.name} (${serviceId})`)
      }
    }
  }
}

export class LoadBalancer {
  private currentIndex = 0

  roundRobin<T>(items: T[]): T | null {
    if (items.length === 0) return null
    
    const item = items[this.currentIndex % items.length]
    this.currentIndex++
    return item
  }

  random<T>(items: T[]): T | null {
    if (items.length === 0) return null
    return items[Math.floor(Math.random() * items.length)]
  }

  leastConnections(services: Array<ServiceInfo & { connections?: number }>): ServiceInfo | null {
    if (services.length === 0) return null
    
    return services.reduce((least, current) => {
      const leastConnections = least.connections || 0
      const currentConnections = current.connections || 0
      return currentConnections < leastConnections ? current : least
    })
  }
}

export class MessageBroker extends EventEmitter {
  private queues = new Map<string, any[]>()
  private subscribers = new Map<string, Array<(message: any) => void>>()

  async publish(topic: string, message: any): Promise<void> {
    // Add to queue
    if (!this.queues.has(topic)) {
      this.queues.set(topic, [])
    }
    this.queues.get(topic)!.push({
      ...message,
      timestamp: new Date(),
      id: Math.random().toString(36).substring(2, 15)
    })

    // Notify subscribers
    const topicSubscribers = this.subscribers.get(topic) || []
    for (const subscriber of topicSubscribers) {
      try {
        await subscriber(message)
      } catch (error) {
        console.error(`Error in subscriber for topic ${topic}:`, error)
      }
    }

    this.emit('messagePublished', { topic, message })
  }

  subscribe(topic: string, callback: (message: any) => void): () => void {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, [])
    }
    
    this.subscribers.get(topic)!.push(callback)
    
    // Return unsubscribe function
    return () => {
      const subscribers = this.subscribers.get(topic) || []
      const index = subscribers.indexOf(callback)
      if (index > -1) {
        subscribers.splice(index, 1)
      }
    }
  }

  async consume(topic: string): Promise<any | null> {
    const queue = this.queues.get(topic)
    if (!queue || queue.length === 0) return null
    
    return queue.shift()
  }

  getQueueSize(topic: string): number {
    return this.queues.get(topic)?.length || 0
  }

  clearQueue(topic: string): void {
    this.queues.set(topic, [])
  }
}

export class MicroserviceOrchestrator {
  private registry: ServiceRegistry
  private loadBalancer: LoadBalancer
  private messageBroker: MessageBroker
  private circuitBreakers = new Map<string, CircuitBreaker>()

  constructor() {
    this.registry = new ServiceRegistry()
    this.loadBalancer = new LoadBalancer()
    this.messageBroker = new MessageBroker()
    
    this.registry.startHealthMonitoring()
  }

  registerService(config: ServiceConfig): string {
    const serviceId = `${config.name}-${Math.random().toString(36).substring(2, 15)}`
    
    const serviceInfo: ServiceInfo = {
      id: serviceId,
      name: config.name,
      version: config.version,
      status: 'healthy',
      lastHeartbeat: new Date(),
      endpoint: `http://localhost:${config.port || 3000}`,
      metadata: {
        dependencies: config.dependencies || [],
        routes: config.routes || []
      }
    }

    this.registry.register(serviceInfo)
    return serviceId
  }

  async callService<T>(
    serviceName: string, 
    method: string, 
    data?: any,
    options: { timeout?: number; retries?: number } = {}
  ): Promise<T> {
    const services = this.registry.discover(serviceName)
    if (services.length === 0) {
      throw new Error(`No healthy instances found for service: ${serviceName}`)
    }

    const service = this.loadBalancer.roundRobin(services)
    if (!service) {
      throw new Error(`Load balancer returned no service for: ${serviceName}`)
    }

    const circuitBreakerKey = `${service.id}-${method}`
    let circuitBreaker = this.circuitBreakers.get(circuitBreakerKey)
    
    if (!circuitBreaker) {
      circuitBreaker = new CircuitBreaker({
        failureThreshold: 5,
        resetTimeout: 60000,
        monitoringPeriod: 10000
      })
      this.circuitBreakers.set(circuitBreakerKey, circuitBreaker)
    }

    return circuitBreaker.execute(async () => {
      // Simulate API call
      const timeout = options.timeout || 5000
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      try {
        // In a real implementation, this would be an HTTP call
        const response = await this.simulateServiceCall(service, method, data)
        clearTimeout(timeoutId)
        return response
      } catch (error) {
        clearTimeout(timeoutId)
        throw error
      }
    })
  }

  private async simulateServiceCall(service: ServiceInfo, method: string, data?: any): Promise<any> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100))
    
    // Simulate occasional failures
    if (Math.random() < 0.1) {
      throw new Error(`Service call failed: ${service.name}/${method}`)
    }

    return {
      service: service.name,
      method,
      data,
      timestamp: new Date(),
      success: true
    }
  }

  getServiceRegistry(): ServiceRegistry {
    return this.registry
  }

  getMessageBroker(): MessageBroker {
    return this.messageBroker
  }

  async publishEvent(event: string, data: any): Promise<void> {
    await this.messageBroker.publish(event, data)
  }

  subscribeToEvent(event: string, callback: (data: any) => void): () => void {
    return this.messageBroker.subscribe(event, callback)
  }

  getSystemHealth(): {
    totalServices: number
    healthyServices: number
    unhealthyServices: number
    services: ServiceInfo[]
  } {
    const services = this.registry.getAllServices()
    const healthyServices = services.filter(s => s.status === 'healthy').length
    const unhealthyServices = services.filter(s => s.status === 'unhealthy').length

    return {
      totalServices: services.length,
      healthyServices,
      unhealthyServices,
      services
    }
  }

  getCircuitBreakerStatus(): Array<{ key: string; state: string }> {
    return Array.from(this.circuitBreakers.entries()).map(([key, breaker]) => ({
      key,
      state: breaker.getState()
    }))
  }
}

// Singleton instance
let orchestrator: MicroserviceOrchestrator | null = null

export function getMicroserviceOrchestrator(): MicroserviceOrchestrator {
  if (!orchestrator) {
    orchestrator = new MicroserviceOrchestrator()
  }
  return orchestrator
}

export default MicroserviceOrchestrator
