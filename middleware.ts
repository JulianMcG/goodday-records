import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, host } = request.nextUrl
  
  // Skip middleware for API routes and static files
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next()
  }

  // Check if this is a subdomain request (not the main domain)
  const hostname = host.split('.')[0]
  const isSubdomain = hostname !== 'gooddayrecords' && hostname !== 'localhost' && hostname !== 'www'
  
  if (isSubdomain && pathname === '/') {
    // Redirect subdomain root to the subdomain page
    const url = request.nextUrl.clone()
    url.pathname = `/${hostname}`
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 