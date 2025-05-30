import { NextResponse } from 'next/server';

export function middleware() {
  const response = NextResponse.next();
  
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self'");
  
  return response;
}

export const config = {
  matcher: '/api/:path*',
};