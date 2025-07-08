export interface CacheConfig {
  ttl?: number // Time to live em milissegundos
  maxSize?: number // Máximo de itens no cache
}

export interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

export interface RedisCacheStats {
  connected: boolean
  memoryUsage: string
  connectedClients: number
  totalKeys: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
}

export interface RedisConfig {
  host?: string
  port?: number
  password?: string
  db?: number
  keyPrefix?: string
  maxRetriesPerRequest?: number
}

export interface CacheSetItem<T> {
  key: string
  data: T
  ttl?: number
}
