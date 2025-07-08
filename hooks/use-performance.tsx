import { useState, useEffect, useCallback } from 'react'

interface PerformanceMetrics {
  // Core Web Vitals
  fcp: number // First Contentful Paint
  lcp: number // Largest Contentful Paint
  cls: number // Cumulative Layout Shift
  fid: number // First Input Delay
  
  // Métricas customizadas
  renderTime: number
  apiResponseTime: number
  memoryUsage: number
  connectionType: string
  
  // Timestamps
  timestamp: number
}

interface UsePerformanceOptions {
  enableRealTimeMonitoring?: boolean
  sampleRate?: number // Taxa de amostragem (0-1)
  reportInterval?: number // Intervalo de relatório em ms
}

export function usePerformance(options: UsePerformanceOptions = {}) {
  const {
    enableRealTimeMonitoring = true,
    sampleRate = 1,
    reportInterval = 5000
  } = options

  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [isSupported, setIsSupported] = useState(false)

  // Verificar suporte do navegador
  useEffect(() => {
    setIsSupported(
      typeof window !== 'undefined' &&
      'performance' in window &&
      'PerformanceObserver' in window
    )
  }, [])

  // Coletar Core Web Vitals
  const collectWebVitals = useCallback(() => {
    if (!isSupported || Math.random() > sampleRate) return

    try {
      // FCP - First Contentful Paint
      const fcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const fcp = entries[entries.length - 1]
        if (fcp) {
          setMetrics(prev => prev ? { ...prev, fcp: fcp.startTime } : null)
        }
      })
      fcpObserver.observe({ entryTypes: ['paint'] })

      // LCP - Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const lcp = entries[entries.length - 1]
        if (lcp) {
          setMetrics(prev => prev ? { ...prev, lcp: lcp.startTime } : null)
        }
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // CLS - Cumulative Layout Shift
      let clsValue = 0
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        }
        setMetrics(prev => prev ? { ...prev, cls: clsValue } : null)
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })

      // FID - First Input Delay
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const fid = entries[entries.length - 1]
        if (fid) {
          setMetrics(prev => prev ? { ...prev, fid: (fid as any).processingStart - fid.startTime } : null)
        }
      })
      fidObserver.observe({ entryTypes: ['first-input'] })

      return () => {
        fcpObserver.disconnect()
        lcpObserver.disconnect()
        clsObserver.disconnect()
        fidObserver.disconnect()
      }
    } catch (error) {
      console.warn('Erro ao coletar Web Vitals:', error)
    }
  }, [isSupported, sampleRate])

  // Coletar métricas customizadas
  const collectCustomMetrics = useCallback(() => {
    if (!isSupported) return

    try {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const renderTime = navigation.loadEventEnd - navigation.fetchStart
      
      // Estimar uso de memória (se disponível)
      const memory = (performance as any).memory
      const memoryUsage = memory ? memory.usedJSHeapSize / memory.totalJSHeapSize : 0
      
      // Tipo de conexão (se disponível)
      const connection = (navigator as any).connection
      const connectionType = connection ? connection.effectiveType : 'unknown'
      
      // Tempo de resposta da API (simulado - seria coletado nas chamadas reais)
      const apiResponseTime = Math.random() * 500 + 100

      setMetrics(prev => ({
        fcp: prev?.fcp || 0,
        lcp: prev?.lcp || 0,
        cls: prev?.cls || 0,
        fid: prev?.fid || 0,
        renderTime,
        apiResponseTime,
        memoryUsage,
        connectionType,
        timestamp: Date.now()
      }))
    } catch (error) {
      console.warn('Erro ao coletar métricas customizadas:', error)
    }
  }, [isSupported])

  // Inicializar coleta de métricas
  useEffect(() => {
    if (!enableRealTimeMonitoring || !isSupported) return

    // Coleta inicial
    const cleanup = collectWebVitals()
    collectCustomMetrics()

    // Coleta periódica
    const interval = setInterval(collectCustomMetrics, reportInterval)

    return () => {
      cleanup?.()
      clearInterval(interval)
    }
  }, [enableRealTimeMonitoring, isSupported, collectWebVitals, collectCustomMetrics, reportInterval])

  // Função para reportar métricas para analytics
  const reportMetrics = useCallback((customData?: Record<string, any>) => {
    if (!metrics) return

    const data = {
      ...metrics,
      ...customData,
      userAgent: navigator.userAgent,
      timestamp: Date.now()
    }

    // Enviar para Google Analytics (se configurado)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance_metrics', {
        custom_map: data
      })
    }

    // Enviar para outros serviços de analytics
    console.debug('Performance Metrics:', data)
    
    return data
  }, [metrics])

  // Função para obter score de performance
  const getPerformanceScore = useCallback(() => {
    if (!metrics) return null

    let score = 100

    // Penalizar baseado nos thresholds do Core Web Vitals
    if (metrics.fcp > 1800) score -= 20
    if (metrics.lcp > 2500) score -= 25
    if (metrics.cls > 0.1) score -= 15
    if (metrics.fid > 100) score -= 20
    if (metrics.renderTime > 3000) score -= 10
    if (metrics.apiResponseTime > 1000) score -= 10

    return Math.max(0, score)
  }, [metrics])

  // Função para obter recomendações de otimização
  const getOptimizationSuggestions = useCallback(() => {
    if (!metrics) return []

    const suggestions: string[] = []

    if (metrics.fcp > 1800) {
      suggestions.push('Otimize o carregamento de recursos críticos para melhorar o FCP')
    }
    
    if (metrics.lcp > 2500) {
      suggestions.push('Implemente lazy loading de imagens para melhorar o LCP')
    }
    
    if (metrics.cls > 0.1) {
      suggestions.push('Defina dimensões para imagens e elementos para reduzir o CLS')
    }
    
    if (metrics.fid > 100) {
      suggestions.push('Otimize JavaScript para reduzir o tempo de processamento')
    }
    
    if (metrics.memoryUsage > 0.8) {
      suggestions.push('Monitore vazamentos de memória e otimize o uso de recursos')
    }
    
    if (metrics.apiResponseTime > 1000) {
      suggestions.push('Implemente cache de API para melhorar tempos de resposta')
    }

    return suggestions
  }, [metrics])

  return {
    metrics,
    isSupported,
    reportMetrics,
    getPerformanceScore,
    getOptimizationSuggestions,
    collectCustomMetrics
  }
}

// Manter compatibilidade com o hook anterior
export function usePerformanceMonitor() {
  const { metrics, isSupported } = usePerformance()
  
  return {
    loadTime: metrics?.renderTime || 0,
    renderTime: metrics?.renderTime || 0,
    memoryUsage: metrics?.memoryUsage || 0,
    isSupported
  }
}

export function useDebounced<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function useVirtualization<T>(
  items: T[],
  containerHeight: number,
  itemHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0)
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null)

  const visibleItemsCount = Math.ceil(containerHeight / itemHeight)
  const startIndex = Math.floor(scrollTop / itemHeight)
  const endIndex = Math.min(startIndex + visibleItemsCount, items.length - 1)

  const visibleItems = items.slice(startIndex, endIndex + 1)
  const totalHeight = items.length * itemHeight
  const offsetY = startIndex * itemHeight

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  return {
    visibleItems,
    totalHeight,
    offsetY,
    containerRef,
    setContainerRef,
    handleScroll,
  }
}
