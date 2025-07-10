import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Controle de cache para /_next/static/chunks/ removido. Deixe o controle de cache apenas no next.config.mjs.

  // ...existing code...

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/_next/static/chunks/:path*',
    '/app/:path*'
  ]
}
