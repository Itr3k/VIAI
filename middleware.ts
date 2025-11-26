import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  
  // 1. Check for Session
  // If no session exists and user is trying to access dashboard, redirect to login
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Mock JWT Decoding (In real app, verify signature)
  // We assume the cookie contains a payload with claims
  // const claims = decode(session.value); 
  
  // For demonstration: Assume we extracted agencyId
  const agencyId = 'agency-1'; // mocked extraction
  
  // 3. Multi-Tenant Route Protection
  // Ensure the user isn't trying to access another agency's URL manually
  // Example URL: /dashboard/agency-2/settings
  const pathParts = request.nextUrl.pathname.split('/');
  // pathParts = ['', 'dashboard', 'agency-2', 'settings']
  
  if (pathParts.length > 2 && pathParts[1] === 'dashboard') {
    const requestedAgencyId = pathParts[2];
    
    // If the URL has an agencyId, match it against the user's token claim
    if (requestedAgencyId && requestedAgencyId !== agencyId) {
       // Redirect to their OWN dashboard if they try to snoop
       return NextResponse.redirect(new URL(`/dashboard/${agencyId}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*',
};