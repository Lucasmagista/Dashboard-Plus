"use client"

import { useState, useEffect, useCallback } from 'react'

interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
  isStale: boolean
}

interface CacheOptions {
  ttl?: number // Time to live em ms
  staleWhileRevalidate?: number // Tempo em ms para servir dados stale enquanto revalida
  maxEntries?: number // Máximo de entradas no cache
  enablePersistence?: boolean // Persistir no localStorage
}

class ApiCache {
  private cache = new Map<string, CacheEntry<any>>()
  private options: Required<CacheOptions>
  private pendingRequests = new Map<string, Promise<any>>()

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: 5 * 60 * 1000, // 5 minutos padrão
      staleWhileRevalidate: 60 * 1000, // 1 minuto para stale
      maxEntries: 100,
      enablePersistence: true,
      ...options
    }

    if (this.options.enablePersistence && typeof window !== 'undefined') {
      this.loadFromStorage()
    }
  }

  private generateKey(url: string, params?: Record<string, any>): string {
    const paramString = params ? JSON.stringify(params) : ''
    return `${url}:${paramString}`
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('api-cache')
      if (stored) {
        const parsed = JSON.parse(stored)
        this.cache = new Map(parsed)
      }
    } catch (error) {
      console.warn('Erro ao carregar cache do localStorage:', error)
    }
  }

  private saveToStorage(): void {
    if (!this.options.enablePersistence || typeof window === 'undefined') return

    try {
      const serialized = Array.from(this.cache.entries())
      localStorage.setItem('api-cache', JSON.stringify(serialized))
    } catch (error) {
      console.warn('Erro ao salvar cache no localStorage:', error)
    }
  }

  private cleanup(): void {
    const now = Date.now()
    const entries = Array.from(this.cache.entries())
    
    // Remover entradas expiradas
    entries.forEach(([key, entry]) => {
      if (entry.expiresAt < now) {
        this.cache.delete(key)
      }
    })

    // Limitar número de entradas (LRU)
    if (this.cache.size > this.options.maxEntries) {
      const sortedEntries = entries
        .sort((a, b) => b[1].timestamp - a[1].timestamp)
        .slice(this.options.maxEntries)
      
      sortedEntries.forEach(([key]) => this.cache.delete(key))
    }

    this.saveToStorage()
  }

  get<T>(url: string, params?: Record<string, any>): CacheEntry<T> | null {
    const key = this.generateKey(url, params)
    const entry = this.cache.get(key)

    if (!entry) return null

    const now = Date.now()
    
    // Marcar como stale se passou do TTL mas ainda dentro do SWR
    if (entry.expiresAt < now && entry.expiresAt + this.options.staleWhileRevalidate > now) {
      entry.isStale = true
    }

    // Remover se completamente expirado
    if (entry.expiresAt + this.options.staleWhileRevalidate < now) {
      this.cache.delete(key)
      return null
    }

    return entry
  }

  set<T>(url: string, data: T, params?: Record<string, any>): void {
    const key = this.generateKey(url, params)
    const now = Date.now()

    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt: now + this.options.ttl,
      isStale: false
    }

    this.cache.set(key, entry)
    this.cleanup()
  }

  invalidate(url: string, params?: Record<string, any>): void {
    const key = this.generateKey(url, params)
    this.cache.delete(key)
    this.saveToStorage()
  }

  invalidateAll(): void {
    this.cache.clear()
    if (this.options.enablePersistence && typeof window !== 'undefined') {
      localStorage.removeItem('api-cache')
    }
  }

  async fetch<T>(
    url: string, 
    fetchFn: () => Promise<T>, 
    params?: Record<string, any>
  ): Promise<T> {
    const key = this.generateKey(url, params)
    
    // Verificar se já há uma requisição pendente
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!
    }

    // Verificar cache
    const cached = this.get<T>(url, params)
    
    if (cached && !cached.isStale) {
      return cached.data
    }

    // Se tem dados stale, retornar enquanto revalida em background
    if (cached?.isStale) {
      // Revalidar em background
      const revalidatePromise = fetchFn()
        .then(data => {
          this.set(url, data, params)
          return data
        })
        .catch(error => {
          console.warn('Erro na revalidação:', error)
          return cached.data
        })
        .finally(() => {
          this.pendingRequests.delete(key)
        })

      this.pendingRequests.set(key, revalidatePromise)
      
      // Retornar dados stale imediatamente
      return cached.data
    }

    // Fazer requisição fresh
    const fetchPromise = fetchFn()
      .then(data => {
        this.set(url, data, params)
        return data
      })
      .finally(() => {
        this.pendingRequests.delete(key)
      })

    this.pendingRequests.set(key, fetchPromise)
    return fetchPromise
  }

  getStats() {
    const entries = Array.from(this.cache.entries())
    const now = Date.now()
    
    return {
      totalEntries: entries.length,
      freshEntries: entries.filter(([, entry]) => entry.expiresAt > now && !entry.isStale).length,
      staleEntries: entries.filter(([, entry]) => entry.isStale).length,
      expiredEntries: entries.filter(([, entry]) => entry.expiresAt < now).length,
      cacheSize: new Blob([JSON.stringify(entries)]).size
    }
  }
}

// Instância global do cache
const globalCache = new ApiCache({
  ttl: 5 * 60 * 1000, // 5 minutos
  staleWhileRevalidate: 2 * 60 * 1000, // 2 minutos para stale
  maxEntries: 200,
  enablePersistence: true
})

// Hook para usar o cache de API
export function useApiCache() {
  const [stats, setStats] = useState(globalCache.getStats())

  const updateStats = useCallback(() => {
    setStats(globalCache.getStats())
  }, [])

  useEffect(() => {
    // Atualizar estatísticas periodicamente
    const interval = setInterval(updateStats, 10000) // a cada 10 segundos
    return () => clearInterval(interval)
  }, [updateStats])

  const cachedFetch = useCallback(async (
    url: string,
    fetchFn: () => Promise<any>,
    params?: Record<string, any>
  ): Promise<any> => {
    const result = await globalCache.fetch(url, fetchFn, params)
    updateStats()
    return result
  }, [updateStats])

  const invalidate = useCallback((url: string, params?: Record<string, any>) => {
    globalCache.invalidate(url, params)
    updateStats()
  }, [updateStats])

  const invalidateAll = useCallback(() => {
    globalCache.invalidateAll()
    updateStats()
  }, [updateStats])

  const get = useCallback((url: string, params?: Record<string, any>) => {
    return globalCache.get(url, params)
  }, [])

  return {
    fetch: cachedFetch,
    invalidate,
    invalidateAll,
    get,
    stats,
    updateStats
  }
}

// Hook específico para requisições HTTP com cache
export function useCachedFetch(
  url: string | null,
  options?: RequestInit,
  cacheOptions?: { params?: Record<string, any>; enabled?: boolean }
) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { fetch: cachedFetch } = useApiCache()

  const fetchData = useCallback(async () => {
    if (!url || cacheOptions?.enabled === false) return

    setLoading(true)
    setError(null)

    try {
      const result = await cachedFetch(
        url,
        async () => {
          const response = await fetch(url, options)
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }
          return response.json()
        },
        cacheOptions?.params
      )

      setData(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [url, options, cachedFetch, cacheOptions])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch
  }
}

// Component para monitorar o cache
export function CacheMonitor() {
  const { stats, invalidateAll } = useApiCache()

  return (
    <div className="p-4 border rounded-lg bg-muted/50">
      <h3 className="font-semibold mb-3">Cache Monitor</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
        <div>
          <div className="font-medium">Total</div>
          <div className="text-muted-foreground">{stats.totalEntries}</div>
        </div>
        <div>
          <div className="font-medium">Fresh</div>
          <div className="text-green-600">{stats.freshEntries}</div>
        </div>
        <div>
          <div className="font-medium">Stale</div>
          <div className="text-yellow-600">{stats.staleEntries}</div>
        </div>
        <div>
          <div className="font-medium">Expired</div>
          <div className="text-red-600">{stats.expiredEntries}</div>
        </div>
        <div>
          <div className="font-medium">Size</div>
          <div className="text-muted-foreground">{(stats.cacheSize / 1024).toFixed(1)}KB</div>
        </div>
      </div>
      <button
        onClick={invalidateAll}
        className="mt-3 px-3 py-1 text-xs bg-destructive text-destructive-foreground rounded"
      >
        Limpar Cache
      </button>
    </div>
  )
}
