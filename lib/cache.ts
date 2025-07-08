import { useState, useEffect, useCallback } from 'react'

interface CacheConfig {
  ttl?: number // Time to live em milissegundos
  maxSize?: number // Máximo de itens no cache
}

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

class MemoryCache<T = any> {
  private cache = new Map<string, CacheItem<T>>()
  private maxSize: number

  constructor(config: CacheConfig = {}) {
    this.maxSize = config.maxSize || 100
  }

  set(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    // Remove itens expirados se cache estiver cheio
    if (this.cache.size >= this.maxSize) {
      this.cleanup()
      if (this.cache.size >= this.maxSize) {
        // Remove o item mais antigo
        const firstKey = this.cache.keys().next().value
        if (firstKey) {
          this.cache.delete(firstKey)
        }
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    // Verifica se expirou
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  private cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }

  size(): number {
    this.cleanup()
    return this.cache.size
  }
}

// Cache global para a aplicação
const globalCache = new MemoryCache()

// Hook para usar cache com fetch
export function useCachedFetch<T>(
  url: string | null,
  options: RequestInit = {},
  cacheConfig: CacheConfig = {}
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    if (!url) return

    const cacheKey = `${url}_${JSON.stringify(options)}`
    
    // Verifica cache primeiro
    const cachedData = globalCache.get(cacheKey)
    if (cachedData) {
      setData(cachedData)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(url, options)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      // Armazena no cache
      globalCache.set(
        cacheKey, 
        result, 
        cacheConfig.ttl || 5 * 60 * 1000
      )
      
      setData(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [url, options, cacheConfig.ttl])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = useCallback(() => {
    if (url) {
      const cacheKey = `${url}_${JSON.stringify(options)}`
      globalCache.delete(cacheKey)
      fetchData()
    }
  }, [url, options, fetchData])

  return { data, loading, error, refetch }
}

// Hook para cache local de estado
export function useCachedState<T>(
  key: string,
  initialValue: T,
  ttl: number = 10 * 60 * 1000
): [T, (value: T) => void, () => void] {
  const [state, setState] = useState<T>(() => {
    const cached = globalCache.get(key)
    return cached !== null ? cached : initialValue
  })

  const setCachedState = useCallback((value: T) => {
    setState(value)
    globalCache.set(key, value, ttl)
  }, [key, ttl])

  const clearCachedState = useCallback(() => {
    setState(initialValue)
    globalCache.delete(key)
  }, [key, initialValue])

  return [state, setCachedState, clearCachedState]
}

// Função para pré-carregar dados
export function preloadData(url: string, options: RequestInit = {}) {
  const cacheKey = `${url}_${JSON.stringify(options)}`
  
  if (!globalCache.has(cacheKey)) {
    fetch(url, options)
      .then(response => response.json())
      .then(data => {
        globalCache.set(cacheKey, data)
      })
      .catch(error => {
        console.warn('Preload failed:', error)
      })
  }
}

export { globalCache }
