"use client"

import React, { Suspense, lazy, ComponentType } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"

interface LazyWidgetProps {
  id: string
  title: string
  description?: string
  importFunction: () => Promise<{ default: ComponentType<any> }>
  fallback?: React.ReactNode
  props?: Record<string, any>
  threshold?: number
  rootMargin?: string
  priority?: 'high' | 'medium' | 'low'
}

const WidgetSkeleton = () => (
  <Card>
    <CardHeader className="pb-2">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-5 w-32" />
      </div>
      <Skeleton className="h-4 w-48" />
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </CardContent>
  </Card>
)

const ErrorFallback = ({ error, title }: { error: Error; title: string }) => (
  <Card className="border-destructive/50">
    <CardHeader className="pb-2">
      <CardTitle className="text-destructive flex items-center gap-2">
        <span className="text-destructive">⚠</span>
        Erro ao carregar {title}
      </CardTitle>
      <CardDescription className="text-destructive/70">
        {error.message || 'Componente indisponível no momento'}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <button 
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => window.location.reload()}
      >
        Tentar novamente
      </button>
    </CardContent>
  </Card>
)

export const LazyWidget: React.FC<LazyWidgetProps> = ({
  id,
  title,
  description,
  importFunction,
  fallback,
  props = {},
  threshold = 0.1,
  rootMargin = "50px",
  priority = 'medium'
}) => {
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin,
    freezeOnceVisible: true
  })

  // Para widgets de alta prioridade, carregue imediatamente
  const shouldLoad = priority === 'high' || isIntersecting

  // Lazy load o componente apenas quando necessário
  const LazyComponent = React.useMemo(() => {
    if (!shouldLoad) return null
    return lazy(importFunction)
  }, [shouldLoad, importFunction])

  return (
    <div ref={elementRef} data-widget-id={id}>
      {shouldLoad && LazyComponent ? (
        <ErrorBoundary 
          fallback={(error) => <ErrorFallback error={error} title={title} />}
        >
          <Suspense fallback={fallback || <WidgetSkeleton />}>
            <LazyComponent {...props} />
          </Suspense>
        </ErrorBoundary>
      ) : (
        fallback || <WidgetSkeleton />
      )}
    </div>
  )
}

// Hook para performance metrics
export const useWidgetPerformance = (widgetId: string) => {
  React.useEffect(() => {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const loadTime = endTime - startTime
      
      // Log performance metrics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'widget_load_time', {
          custom_map: {
            'widget_id': widgetId,
            'load_time': loadTime
          }
        })
      }
      
      console.debug(`Widget ${widgetId} loaded in ${loadTime.toFixed(2)}ms`)
    }
  }, [widgetId])
}

// Pre-load de widgets críticos
export const preloadWidget = (importFunction: () => Promise<{ default: ComponentType<any> }>) => {
  // Pre-load em idle time
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      importFunction().catch(console.warn)
    })
  } else {
    // Fallback para browsers sem requestIdleCallback
    setTimeout(() => {
      importFunction().catch(console.warn)
    }, 100)
  }
}
