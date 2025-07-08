/**
 * Auto-scaling Implementation
 * Provides automatic scaling capabilities based on metrics and demand
 */

import { EventEmitter } from 'events'

export interface ScalingMetrics {
  cpuUsage: number
  memoryUsage: number
  requestsPerSecond: number
  responseTime: number
  queueLength: number
  activeConnections: number
  timestamp: Date
}

export interface ScalingRule {
  id: string
  name: string
  metric: keyof ScalingMetrics
  threshold: number
  comparison: 'greater_than' | 'less_than' | 'equals'
  action: 'scale_up' | 'scale_down'
  cooldown: number // milliseconds
  enabled: boolean
}

export interface ScalingConfig {
  minInstances: number
  maxInstances: number
  targetCpuUtilization: number
  targetMemoryUtilization: number
  scaleUpCooldown: number
  scaleDownCooldown: number
  metricsCollectionInterval: number
}

export interface InstanceInfo {
  id: string
  status: 'starting' | 'running' | 'stopping' | 'stopped'
  createdAt: Date
  lastHealthCheck: Date
  metrics: ScalingMetrics
  endpoint: string
}

export class MetricsCollector extends EventEmitter {
  private metrics: ScalingMetrics[] = []
  private maxHistorySize = 1000

  addMetrics(metrics: ScalingMetrics): void {
    this.metrics.push(metrics)
    
    // Keep only recent metrics
    if (this.metrics.length > this.maxHistorySize) {
      this.metrics = this.metrics.slice(-this.maxHistorySize)
    }

    this.emit('metricsUpdated', metrics)
  }

  getLatestMetrics(): ScalingMetrics | null {
    return this.metrics.length > 0 ? this.metrics[this.metrics.length - 1] : null
  }

  getAverageMetrics(windowMinutes: number = 5): Partial<ScalingMetrics> | null {
    const windowMs = windowMinutes * 60 * 1000
    const cutoff = new Date(Date.now() - windowMs)
    
    const recentMetrics = this.metrics.filter(m => m.timestamp >= cutoff)
    if (recentMetrics.length === 0) return null

    const avg = {
      cpuUsage: 0,
      memoryUsage: 0,
      requestsPerSecond: 0,
      responseTime: 0,
      queueLength: 0,
      activeConnections: 0
    }

    for (const metric of recentMetrics) {
      avg.cpuUsage += metric.cpuUsage
      avg.memoryUsage += metric.memoryUsage
      avg.requestsPerSecond += metric.requestsPerSecond
      avg.responseTime += metric.responseTime
      avg.queueLength += metric.queueLength
      avg.activeConnections += metric.activeConnections
    }

    const count = recentMetrics.length
    return {
      cpuUsage: avg.cpuUsage / count,
      memoryUsage: avg.memoryUsage / count,
      requestsPerSecond: avg.requestsPerSecond / count,
      responseTime: avg.responseTime / count,
      queueLength: avg.queueLength / count,
      activeConnections: avg.activeConnections / count,
      timestamp: new Date()
    }
  }

  getMetricsHistory(hours: number = 1): ScalingMetrics[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000)
    return this.metrics.filter(m => m.timestamp >= cutoff)
  }

  // Simulate metrics collection from system
  startSystemMonitoring(intervalMs: number = 30000): void {
    setInterval(() => {
      const metrics: ScalingMetrics = {
        cpuUsage: Math.random() * 100,
        memoryUsage: Math.random() * 100,
        requestsPerSecond: Math.random() * 1000,
        responseTime: Math.random() * 2000,
        queueLength: Math.floor(Math.random() * 100),
        activeConnections: Math.floor(Math.random() * 500),
        timestamp: new Date()
      }
      this.addMetrics(metrics)
    }, intervalMs)
  }
}

export class ScalingDecisionEngine {
  private rules: ScalingRule[] = []
  private lastScalingActions = new Map<string, Date>()

  addRule(rule: ScalingRule): void {
    this.rules.push(rule)
  }

  removeRule(ruleId: string): void {
    this.rules = this.rules.filter(rule => rule.id !== ruleId)
  }

  getRule(ruleId: string): ScalingRule | undefined {
    return this.rules.find(rule => rule.id === ruleId)
  }

  getAllRules(): ScalingRule[] {
    return [...this.rules]
  }

  evaluateScaling(metrics: ScalingMetrics, currentInstances: number): {
    shouldScale: boolean
    action?: 'scale_up' | 'scale_down'
    reason: string
    triggeredRules: string[]
  } {
    const triggeredRules: string[] = []
    let scaleUpNeeded = false
    let scaleDownNeeded = false

    for (const rule of this.rules) {
      if (!rule.enabled) continue

      // Check cooldown
      const lastAction = this.lastScalingActions.get(rule.id)
      if (lastAction && Date.now() - lastAction.getTime() < rule.cooldown) {
        continue
      }

      const metricValue = metrics[rule.metric] as number
      let triggered = false

      switch (rule.comparison) {
        case 'greater_than':
          triggered = metricValue > rule.threshold
          break
        case 'less_than':
          triggered = metricValue < rule.threshold
          break
        case 'equals':
          triggered = Math.abs(metricValue - rule.threshold) < 0.01
          break
      }

      if (triggered) {
        triggeredRules.push(rule.name)
        if (rule.action === 'scale_up') {
          scaleUpNeeded = true
        } else {
          scaleDownNeeded = true
        }
      }
    }

    // Priority: scale up over scale down
    if (scaleUpNeeded) {
      return {
        shouldScale: true,
        action: 'scale_up',
        reason: `Scaling up due to: ${triggeredRules.join(', ')}`,
        triggeredRules
      }
    }

    if (scaleDownNeeded) {
      return {
        shouldScale: true,
        action: 'scale_down',
        reason: `Scaling down due to: ${triggeredRules.join(', ')}`,
        triggeredRules
      }
    }

    return {
      shouldScale: false,
      reason: 'No scaling rules triggered',
      triggeredRules: []
    }
  }

  recordScalingAction(ruleIds: string[]): void {
    const now = new Date()
    for (const ruleId of ruleIds) {
      this.lastScalingActions.set(ruleId, now)
    }
  }

  // Create default scaling rules
  createDefaultRules(): void {
    this.rules = [
      {
        id: 'cpu-scale-up',
        name: 'CPU Scale Up',
        metric: 'cpuUsage',
        threshold: 80,
        comparison: 'greater_than',
        action: 'scale_up',
        cooldown: 300000, // 5 minutes
        enabled: true
      },
      {
        id: 'cpu-scale-down',
        name: 'CPU Scale Down',
        metric: 'cpuUsage',
        threshold: 20,
        comparison: 'less_than',
        action: 'scale_down',
        cooldown: 600000, // 10 minutes
        enabled: true
      },
      {
        id: 'memory-scale-up',
        name: 'Memory Scale Up',
        metric: 'memoryUsage',
        threshold: 85,
        comparison: 'greater_than',
        action: 'scale_up',
        cooldown: 300000,
        enabled: true
      },
      {
        id: 'queue-scale-up',
        name: 'Queue Scale Up',
        metric: 'queueLength',
        threshold: 50,
        comparison: 'greater_than',
        action: 'scale_up',
        cooldown: 180000, // 3 minutes
        enabled: true
      },
      {
        id: 'response-time-scale-up',
        name: 'Response Time Scale Up',
        metric: 'responseTime',
        threshold: 1000,
        comparison: 'greater_than',
        action: 'scale_up',
        cooldown: 240000, // 4 minutes
        enabled: true
      }
    ]
  }
}

export class InstanceManager extends EventEmitter {
  private instances = new Map<string, InstanceInfo>()
  private config: ScalingConfig

  constructor(config: ScalingConfig) {
    super()
    this.config = config
  }

  async createInstance(): Promise<string> {
    const instanceId = `instance-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
    
    const instance: InstanceInfo = {
      id: instanceId,
      status: 'starting',
      createdAt: new Date(),
      lastHealthCheck: new Date(),
      metrics: {
        cpuUsage: 0,
        memoryUsage: 0,
        requestsPerSecond: 0,
        responseTime: 0,
        queueLength: 0,
        activeConnections: 0,
        timestamp: new Date()
      },
      endpoint: `http://instance-${instanceId}:3000`
    }

    this.instances.set(instanceId, instance)
    this.emit('instanceCreated', instance)

    // Simulate startup time
    setTimeout(() => {
      instance.status = 'running'
      this.emit('instanceReady', instance)
    }, 5000)

    console.log(`🚀 Creating new instance: ${instanceId}`)
    return instanceId
  }

  async terminateInstance(instanceId: string): Promise<void> {
    const instance = this.instances.get(instanceId)
    if (!instance) {
      throw new Error(`Instance not found: ${instanceId}`)
    }

    instance.status = 'stopping'
    this.emit('instanceStopping', instance)

    // Simulate graceful shutdown
    setTimeout(() => {
      instance.status = 'stopped'
      this.instances.delete(instanceId)
      this.emit('instanceTerminated', instance)
    }, 3000)

    console.log(`🛑 Terminating instance: ${instanceId}`)
  }

  getRunningInstances(): InstanceInfo[] {
    return Array.from(this.instances.values()).filter(i => i.status === 'running')
  }

  getAllInstances(): InstanceInfo[] {
    return Array.from(this.instances.values())
  }

  getInstance(instanceId: string): InstanceInfo | undefined {
    return this.instances.get(instanceId)
  }

  updateInstanceMetrics(instanceId: string, metrics: ScalingMetrics): void {
    const instance = this.instances.get(instanceId)
    if (instance) {
      instance.metrics = metrics
      instance.lastHealthCheck = new Date()
    }
  }

  canScaleUp(): boolean {
    const runningInstances = this.getRunningInstances().length
    return runningInstances < this.config.maxInstances
  }

  canScaleDown(): boolean {
    const runningInstances = this.getRunningInstances().length
    return runningInstances > this.config.minInstances
  }

  getScalingCapacity(): {
    current: number
    min: number
    max: number
    canScaleUp: boolean
    canScaleDown: boolean
  } {
    const current = this.getRunningInstances().length
    return {
      current,
      min: this.config.minInstances,
      max: this.config.maxInstances,
      canScaleUp: this.canScaleUp(),
      canScaleDown: this.canScaleDown()
    }
  }
}

export class AutoScaler extends EventEmitter {
  private metricsCollector: MetricsCollector
  private decisionEngine: ScalingDecisionEngine
  private instanceManager: InstanceManager
  private config: ScalingConfig
  private isRunning = false
  private evaluationInterval?: NodeJS.Timeout

  constructor(config: ScalingConfig) {
    super()
    this.config = config
    this.metricsCollector = new MetricsCollector()
    this.decisionEngine = new ScalingDecisionEngine()
    this.instanceManager = new InstanceManager(config)

    // Create default scaling rules
    this.decisionEngine.createDefaultRules()

    // Set up event listeners
    this.setupEventListeners()
  }

  private setupEventListeners(): void {
    this.metricsCollector.on('metricsUpdated', (metrics) => {
      this.evaluateScalingDecision(metrics)
    })

    this.instanceManager.on('instanceCreated', (instance) => {
      this.emit('scalingEvent', {
        type: 'instance_created',
        instance,
        timestamp: new Date()
      })
    })

    this.instanceManager.on('instanceTerminated', (instance) => {
      this.emit('scalingEvent', {
        type: 'instance_terminated',
        instance,
        timestamp: new Date()
      })
    })
  }

  start(): void {
    if (this.isRunning) return

    this.isRunning = true
    
    // Start metrics collection
    this.metricsCollector.startSystemMonitoring(this.config.metricsCollectionInterval)

    // Start periodic evaluation
    this.evaluationInterval = setInterval(() => {
      const latest = this.metricsCollector.getLatestMetrics()
      if (latest) {
        this.evaluateScalingDecision(latest)
      }
    }, 60000) // Evaluate every minute

    console.log('🎯 Auto-scaler started')
    this.emit('scalerStarted')
  }

  stop(): void {
    if (!this.isRunning) return

    this.isRunning = false
    
    if (this.evaluationInterval) {
      clearInterval(this.evaluationInterval)
      this.evaluationInterval = undefined
    }

    console.log('⏹️ Auto-scaler stopped')
    this.emit('scalerStopped')
  }

  private async evaluateScalingDecision(metrics: ScalingMetrics): Promise<void> {
    const runningInstances = this.instanceManager.getRunningInstances().length
    const decision = this.decisionEngine.evaluateScaling(metrics, runningInstances)

    if (!decision.shouldScale) return

    try {
      if (decision.action === 'scale_up' && this.instanceManager.canScaleUp()) {
        await this.scaleUp(decision.triggeredRules)
        this.decisionEngine.recordScalingAction(decision.triggeredRules)
      } else if (decision.action === 'scale_down' && this.instanceManager.canScaleDown()) {
        await this.scaleDown(decision.triggeredRules)
        this.decisionEngine.recordScalingAction(decision.triggeredRules)
      }
    } catch (error) {
      console.error('Scaling action failed:', error)
      this.emit('scalingError', error)
    }
  }

  private async scaleUp(triggeredRules: string[]): Promise<void> {
    const instanceId = await this.instanceManager.createInstance()
    
    this.emit('scalingAction', {
      action: 'scale_up',
      instanceId,
      triggeredRules,
      timestamp: new Date()
    })

    console.log(`📈 Scaled up: Created instance ${instanceId}`)
  }

  private async scaleDown(triggeredRules: string[]): Promise<void> {
    const instances = this.instanceManager.getRunningInstances()
    if (instances.length <= this.config.minInstances) return

    // Terminate the oldest instance
    const oldestInstance = instances.reduce((oldest, current) => 
      current.createdAt < oldest.createdAt ? current : oldest
    )

    await this.instanceManager.terminateInstance(oldestInstance.id)
    
    this.emit('scalingAction', {
      action: 'scale_down',
      instanceId: oldestInstance.id,
      triggeredRules,
      timestamp: new Date()
    })

    console.log(`📉 Scaled down: Terminated instance ${oldestInstance.id}`)
  }

  // Manual scaling
  async manualScaleUp(): Promise<string> {
    if (!this.instanceManager.canScaleUp()) {
      throw new Error('Cannot scale up: Maximum instances reached')
    }
    
    const instanceId = await this.instanceManager.createInstance()
    this.emit('scalingAction', {
      action: 'manual_scale_up',
      instanceId,
      triggeredRules: [],
      timestamp: new Date()
    })
    
    return instanceId
  }

  async manualScaleDown(): Promise<void> {
    if (!this.instanceManager.canScaleDown()) {
      throw new Error('Cannot scale down: Minimum instances reached')
    }

    const instances = this.instanceManager.getRunningInstances()
    const instanceToTerminate = instances[instances.length - 1]
    
    await this.instanceManager.terminateInstance(instanceToTerminate.id)
    this.emit('scalingAction', {
      action: 'manual_scale_down',
      instanceId: instanceToTerminate.id,
      triggeredRules: [],
      timestamp: new Date()
    })
  }

  // Configuration methods
  updateConfig(newConfig: Partial<ScalingConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  addScalingRule(rule: ScalingRule): void {
    this.decisionEngine.addRule(rule)
  }

  removeScalingRule(ruleId: string): void {
    this.decisionEngine.removeRule(ruleId)
  }

  // Status and monitoring
  getStatus(): {
    isRunning: boolean
    instances: InstanceInfo[]
    capacity: ReturnType<InstanceManager['getScalingCapacity']>
    latestMetrics: ScalingMetrics | null
    rules: ScalingRule[]
  } {
    return {
      isRunning: this.isRunning,
      instances: this.instanceManager.getAllInstances(),
      capacity: this.instanceManager.getScalingCapacity(),
      latestMetrics: this.metricsCollector.getLatestMetrics(),
      rules: this.decisionEngine.getAllRules()
    }
  }

  getMetricsHistory(hours: number = 1): ScalingMetrics[] {
    return this.metricsCollector.getMetricsHistory(hours)
  }

  getAverageMetrics(windowMinutes: number = 5): Partial<ScalingMetrics> | null {
    return this.metricsCollector.getAverageMetrics(windowMinutes)
  }
}

// Factory function to create configured auto-scaler
export function createAutoScaler(config?: Partial<ScalingConfig>): AutoScaler {
  const defaultConfig: ScalingConfig = {
    minInstances: 2,
    maxInstances: 10,
    targetCpuUtilization: 70,
    targetMemoryUtilization: 80,
    scaleUpCooldown: 300000, // 5 minutes
    scaleDownCooldown: 600000, // 10 minutes
    metricsCollectionInterval: 30000 // 30 seconds
  }

  return new AutoScaler({ ...defaultConfig, ...config })
}

export default AutoScaler
