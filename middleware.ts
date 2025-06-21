import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, host } = request.nextUrl
  
  // Skip middleware for API routes and static files
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next()
  }

  // Check if this is a subdomain request
  const hostParts = host.split('.')
  const subdomain = hostParts[0]
  
  // Define main domains that should not be treated as subdomains
  const mainDomains = [
    'gooddayrecords', // custom domain
    'goodday-records', // vercel app domain
    'localhost',
    'www',
    'vercel'
  ]
  
  const isSubdomain = !mainDomains.includes(subdomain) && hostParts.length > 1
  
  if (isSubdomain && pathname === '/') {
    // Redirect subdomain root to the subdomain page
    const url = request.nextUrl.clone()
    url.pathname = `/${subdomain}`
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