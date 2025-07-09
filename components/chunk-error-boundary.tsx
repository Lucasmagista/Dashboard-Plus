"use client"

import { useEffect } from 'react'

interface ChunkErrorBoundaryProps {
  children: React.ReactNode
}

export function ChunkErrorBoundary({ children }: ChunkErrorBoundaryProps) {
  useEffect(() => {
    // Intercepta erros de carregamento de chunks
    const handleChunkError = (event: ErrorEvent) => {
      const error = event.error
      
      if (error && error.name === 'ChunkLoadError') {
        console.warn('Chunk load error detected, reloading page...', error)
        
        // Força reload da página para resolver o problema
        window.location.reload()
        return
      }
      
      // Intercepta erros de rede/carregamento
      if (event.message && event.message.includes('Loading chunk')) {
        console.warn('Chunk loading failed, attempting reload...')
        window.location.reload()
      }
    }

    // Intercepta erros não tratados de Promise (incluindo imports dinâmicos)
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason
      
      if (error && (
        error.message?.includes('Loading chunk') ||
        error.message?.includes('ChunkLoadError') ||
        error.name === 'ChunkLoadError'
      )) {
        console.warn('Chunk load error in promise, reloading...', error)
        event.preventDefault()
        window.location.reload()
      }
    }

    // Intercepta erros de carregamento de recursos
    const handleResourceError = (event: Event) => {
      const target = event.target as HTMLElement
      
      if (target && target.tagName === 'SCRIPT') {
        const src = (target as HTMLScriptElement).src
        
        if (src && src.includes('/_next/static/chunks/')) {
          console.warn('Script chunk failed to load, reloading...', src)
          window.location.reload()
        }
      }
    }

    // Registra os listeners
    window.addEventListener('error', handleChunkError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleResourceError, true)

    return () => {
      window.removeEventListener('error', handleChunkError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleResourceError, true)
    }
  }, [])

  return <>{children}</>
}
