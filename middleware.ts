import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Add cache headers for static chunks
  if (request.nextUrl.pathname.startsWith('/_next/static/chunks/')) {
    const response = NextResponse.next()
    
    // Set cache headers for chunks
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    
    // Add retry headers
    response.headers.set('Retry-After', '5')
    
    return response
  }

  // Handle specific chunk load errors
  if (request.nextUrl.pathname.includes('app/page.js')) {
    const response = NextResponse.next()
    
    // Add timeout headers
    response.headers.set('X-Chunk-Timeout', '10000')
    
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/_next/static/chunks/:path*',
    '/app/:path*'
  ]
}
