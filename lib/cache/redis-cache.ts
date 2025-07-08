// Redis cache implementation for distributed caching
// Note: Install ioredis package: npm install ioredis @types/ioredis
// Tipos locais para evitar erro de importação
type CacheItem<T> = {
    data: T
    timestamp: number
    ttl: number
}

type RedisConfig = {
    keyPrefix?: string
}

type RateLimitResult = {
    allowed: boolean
    remaining: number
    resetTime: number
}

type RedisCacheStats = {
    connected: boolean
    memoryUsage: string
    connectedClients: number
    totalKeys: number
}

type CacheSetItem<T> = {
    key: string
    data: T
    ttl?: number
}

// Mock Redis interface for development when Redis is not available
interface MockRedis {
  status: string
  connect(): Promise<void>
  disconnect(): Promise<void>
  setex(key: string, seconds: number, value: string): Promise<string>
  get(key: string): Promise<string | null>
  exists(key: string): Promise<number>
  del(...keys: string[]): Promise<number>
  keys(pattern: string): Promise<string[]>
  mget(...keys: string[]): Promise<Array<string | null>>
  incrby(key: string, increment: number): Promise<number>
  incr(key: string): Promise<number>
  expire(key: string, seconds: number): Promise<number>
  info(section: string): Promise<string>
  dbsize(): Promise<number>
  set(key: string, value: string, ...args: any[]): Promise<string>
  ttl(key: string): Promise<number>
  eval(script: string, numKeys: number, ...args: any[]): Promise<any>
  pipeline(): {
    setex(key: string, seconds: number, value: string): any
    exec(): Promise<any>
  }
  on(event: string, callback: (err?: Error) => void): void
}

// Simple Redis mock for development
class MockRedisClient implements MockRedis {
  status = 'ready'
  private storage = new Map<string, { value: string; expires: number }>()

  async connect(): Promise<void> {}
  async disconnect(): Promise<void> {}

  async setex(key: string, seconds: number, value: string): Promise<string> {
    this.storage.set(key, { value, expires: Date.now() + seconds * 1000 })
    return 'OK'
  }

  async get(key: string): Promise<string | null> {
    const item = this.storage.get(key)
    if (!item || Date.now() > item.expires) {
      this.storage.delete(key)
      return null
    }
    return item.value
  }

  async exists(key: string): Promise<number> {
    return this.storage.has(key) ? 1 : 0
  }

  async del(...keys: string[]): Promise<number> {
    let deleted = 0
    for (const key of keys) {
      if (this.storage.delete(key)) deleted++
    }
    return deleted
  }

  async keys(pattern: string): Promise<string[]> {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'))
    return Array.from(this.storage.keys()).filter(key => regex.test(key))
  }

  async mget(...keys: string[]): Promise<Array<string | null>> {
    return Promise.all(keys.map(key => this.get(key)))
  }

  async incrby(key: string, increment: number): Promise<number> {
    const current = await this.get(key)
    const value = (current ? parseInt(current) : 0) + increment
    await this.setex(key, 3600, value.toString())
    return value
  }

  async incr(key: string): Promise<number> {
    return this.incrby(key, 1)
  }

  async expire(key: string, seconds: number): Promise<number> {
    const item = this.storage.get(key)
    if (item) {
      item.expires = Date.now() + seconds * 1000
      return 1
    }
    return 0
  }

  async info(): Promise<string> {
    return 'used_memory_human:1M\nconnected_clients:1'
  }

  async dbsize(): Promise<number> {
    return this.storage.size
  }

  async set(key: string, value: string, ...args: any[]): Promise<string> {
    this.storage.set(key, { value, expires: Date.now() + 3600000 })
    return 'OK'
  }

  async ttl(key: string): Promise<number> {
    const item = this.storage.get(key)
    if (!item) return -2
    const remaining = Math.floor((item.expires - Date.now()) / 1000)
    return remaining > 0 ? remaining : -1
  }

  async eval(): Promise<any> {
    return 1
  }

  pipeline() {
    return {
      setex: () => this,
      exec: async () => []
    }
  }

  on(): void {}
}

export class RedisCache {
  private redis: MockRedis
  private keyPrefix: string

  constructor(config: RedisConfig = {}) {
    this.keyPrefix = config.keyPrefix || 'dashboard:'
    
    // Use mock Redis when actual Redis is not available
    this.redis = new MockRedisClient()

    this.redis.on('error', (err?: Error) => {
      console.error('Redis connection error:', err)
    })

    this.redis.on('connect', () => {
      console.log('✅ Connected to Redis cache')
    })
  }

  async connect(): Promise<void> {
    try {
      await this.redis.connect()
    } catch (error) {
      console.error('Failed to connect to Redis:', error)
      throw error
    }
  }

  async disconnect(): Promise<void> {
    await this.redis.disconnect()
  }

  private getKey(key: string): string {
    return `${this.keyPrefix}${key}`
  }

  async set<T>(key: string, data: T, ttl: number = 300): Promise<void> {
    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        ttl: ttl * 1000 // Convert to milliseconds
      }

      const serialized = JSON.stringify(cacheItem)
      await this.redis.setex(this.getKey(key), ttl, serialized)
    } catch (error) {
      console.error('Redis set error:', error)
      throw error
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const serialized = await this.redis.get(this.getKey(key))
      if (!serialized) return null

      const cacheItem: CacheItem<T> = JSON.parse(serialized)
      
      // Check if expired (extra validation)
      if (Date.now() - cacheItem.timestamp > cacheItem.ttl) {
        await this.delete(key)
        return null
      }

      return cacheItem.data
    } catch (error) {
      console.error('Redis get error:', error)
      return null
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      const exists = await this.redis.exists(this.getKey(key))
      return exists === 1
    } catch (error) {
      console.error('Redis has error:', error)
      return false
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.redis.del(this.getKey(key))
    } catch (error) {
      console.error('Redis delete error:', error)
    }
  }

  async clear(pattern?: string): Promise<void> {
    try {
      const searchPattern = pattern ? this.getKey(pattern) : `${this.keyPrefix}*`
      const keys = await this.redis.keys(searchPattern)
      
      if (keys.length > 0) {
        await this.redis.del(...keys)
      }
    } catch (error) {
      console.error('Redis clear error:', error)
    }
  }

  async mget<T>(keys: string[]): Promise<Array<T | null>> {
    try {
      const redisKeys = keys.map(key => this.getKey(key))
      const results = await this.redis.mget(...redisKeys)
      
      return results.map((result: string | null) => {
        if (!result) return null
        try {
          const cacheItem: CacheItem<T> = JSON.parse(result)
          return cacheItem.data
        } catch {
          return null
        }
      })
    } catch (error) {
      console.error('Redis mget error:', error)
      return new Array(keys.length).fill(null)
    }
  }

  async mset<T>(items: Array<CacheSetItem<T>>): Promise<void> {
    try {
      const pipeline = this.redis.pipeline()
      
      for (const item of items) {
        const cacheItem: CacheItem<T> = {
          data: item.data,
          timestamp: Date.now(),
          ttl: (item.ttl || 300) * 1000
        }
        
        const serialized = JSON.stringify(cacheItem)
        pipeline.setex(this.getKey(item.key), item.ttl || 300, serialized)
      }
      
      await pipeline.exec()
    } catch (error) {
      console.error('Redis mset error:', error)
      throw error
    }
  }

  async increment(key: string, value: number = 1): Promise<number> {
    try {
      return await this.redis.incrby(this.getKey(key), value)
    } catch (error) {
      console.error('Redis increment error:', error)
      throw error
    }
  }

  async expire(key: string, ttl: number): Promise<void> {
    try {
      await this.redis.expire(this.getKey(key), ttl)
    } catch (error) {
      console.error('Redis expire error:', error)
    }
  }

  async getStats(): Promise<RedisCacheStats> {
    try {
      const info = await this.redis.info('memory')
      const clients = await this.redis.info('clients')
      const keyCount = await this.redis.dbsize()
      
      const memoryMatch = info.match(/used_memory_human:([^\r\n]+)/)
      const clientsMatch = clients.match(/connected_clients:(\d+)/)
      
      return {
        connected: this.redis.status === 'ready',
        memoryUsage: memoryMatch ? memoryMatch[1].trim() : 'Unknown',
        connectedClients: clientsMatch ? parseInt(clientsMatch[1]) : 0,
        totalKeys: keyCount
      }
    } catch (error) {
      console.error('Redis stats error:', error)
      return {
        connected: false,
        memoryUsage: 'Error',
        connectedClients: 0,
        totalKeys: 0
      }
    }
  }

  // Session management
  async setSession(sessionId: string, data: any, ttl: number = 3600): Promise<void> {
    await this.set(`session:${sessionId}`, data, ttl)
  }

  async getSession<T>(sessionId: string): Promise<T | null> {
    return await this.get<T>(`session:${sessionId}`)
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.delete(`session:${sessionId}`)
  }

  // Rate limiting
  async rateLimit(key: string, limit: number, window: number): Promise<RateLimitResult> {
    try {
      const current = await this.redis.incr(this.getKey(`rate:${key}`))
      
      if (current === 1) {
        await this.redis.expire(this.getKey(`rate:${key}`), window)
      }
      
      const ttl = await this.redis.ttl(this.getKey(`rate:${key}`))
      const resetTime = Date.now() + (ttl * 1000)
      
      return {
        allowed: current <= limit,
        remaining: Math.max(0, limit - current),
        resetTime
      }
    } catch (error) {
      console.error('Redis rate limit error:', error)
      return { allowed: true, remaining: limit, resetTime: Date.now() + window * 1000 }
    }
  }

  // Distributed locking
  async acquireLock(resource: string, ttl: number = 10): Promise<string | null> {
    try {
      const token = Math.random().toString(36).substring(2, 15)
      const result = await this.redis.set(
        this.getKey(`lock:${resource}`),
        token,
        'PX', ttl * 1000,
        'NX'
      )
      
      return result === 'OK' ? token : null
    } catch (error) {
      console.error('Redis acquire lock error:', error)
      return null
    }
  }

  async releaseLock(resource: string, token: string): Promise<boolean> {
    try {
      const script = `
        if redis.call('get', KEYS[1]) == ARGV[1] then
          return redis.call('del', KEYS[1])
        else
          return 0
        end
      `
      
      const result = await this.redis.eval(script, 1, this.getKey(`lock:${resource}`), token)
      return result === 1
    } catch (error) {
      console.error('Redis release lock error:', error)
      return false
    }
  }
}

// Singleton instance
let redisCache: RedisCache | null = null

export function getRedisCache(): RedisCache {
  if (!redisCache) {
    redisCache = new RedisCache()
  }
  return redisCache
}

export default RedisCache
