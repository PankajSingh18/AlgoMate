// middleware.js

import { NextResponse } from 'next/server';
import { CSP_CONFIG } from './lib/csp.js';

export function middleware(request) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Get CSP policy based on environment
  const cspPolicy = isDevelopment 
    ? CSP_CONFIG.development 
    : CSP_CONFIG.production;

  // Add nonce to script-src
  const cspWithNonce = cspPolicy.replace(
    /script-src[^;]*/,
    `script-src 'self' 'nonce-${nonce}' https://*.googletagmanager.com https://*.google-analytics.com`
  );

  // Create response
  const response = NextResponse.next();

  // Add CSP headers
  response.headers.set('Content-Security-Policy', cspWithNonce);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Store nonce for use in components
  response.headers.set('x-nonce', nonce);

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};