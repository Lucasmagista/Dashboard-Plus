'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
    
    // Check if it's a chunk loading error
    if (error.message.includes('Loading chunk') || error.message.includes('ChunkLoadError')) {
      console.warn('Chunk loading error detected, will attempt reload')
    }
  }, [error])

  const handleReload = () => {
    // For chunk errors, force a full page reload
    if (error.message.includes('Loading chunk') || error.message.includes('ChunkLoadError')) {
      window.location.reload()
    } else {
      reset()
    }
  }

  const isChunkError = error.message.includes('Loading chunk') || error.message.includes('ChunkLoadError')

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-red-100 dark:bg-red-900/20 w-fit">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-xl">
            {isChunkError ? 'Erro de Carregamento' : 'Algo deu errado'}
          </CardTitle>
          <CardDescription>
            {isChunkError 
              ? 'Houve um problema ao carregar alguns recursos. Isso pode acontecer após atualizações.'
              : 'Ocorreu um erro inesperado. Tente novamente ou recarregue a página.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === 'development' && (
            <details className="text-sm text-muted-foreground">
              <summary className="cursor-pointer mb-2">Detalhes do erro</summary>
              <pre className="whitespace-pre-wrap break-all text-xs bg-muted p-2 rounded">
                {error.message}
              </pre>
            </details>
          )}
          <div className="flex gap-2">
            <Button onClick={handleReload} className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              {isChunkError ? 'Recarregar Página' : 'Tentar Novamente'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'} 
              className="flex-1"
            >
              Ir para Início
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
