
"use client"
import React, { useEffect, useState } from 'react'

interface ChunkErrorBoundaryProps {
  children: React.ReactNode
}

export function ChunkErrorBoundary({ children }: Readonly<ChunkErrorBoundaryProps>) {
  useEffect(() => {
    // Intercepta erros de carregamento de chunks
    const handleChunkError = (event: ErrorEvent) => {
      const error = event.error
      
      if (error && error.name === 'ChunkLoadError') {
        console.warn('Chunk load error detected, reloading page...', error)
        setShowReloadMessage(true)
        setTimeout(() => window.location.reload(), 2000)
        return
      }
      
      // Intercepta erros de rede/carregamento
      if (event.message?.includes('Loading chunk')) {
        console.warn('Chunk loading failed, attempting reload...')
        setShowReloadMessage(true)
        setTimeout(() => window.location.reload(), 2000)
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
        setShowReloadMessage(true)
        event.preventDefault()
        setTimeout(() => window.location.reload(), 2000)
      }
    }

    // Intercepta erros de carregamento de recursos
    const handleResourceError = (event: Event) => {
      const target = event.target as HTMLElement
      
      if (target && target.tagName === 'SCRIPT') {
        const src = (target as HTMLScriptElement).src
        
        if (src?.includes('/_next/static/chunks/')) {
          console.warn('Script chunk failed to load, reloading...', src)
          setShowReloadMessage(true)
          setTimeout(() => window.location.reload(), 2000)
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

  const [showReloadMessage, setShowReloadMessage] = useState(false)
  return <>
    {showReloadMessage && (
      <div className="chunk-error-reload-message">
        Ocorreu um erro de carregamento. Recarregando a página...
      </div>
    )}
    {children}
  </>
}
