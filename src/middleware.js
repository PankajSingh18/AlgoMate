// src/middleware.js
import { NextResponse } from 'next/server';
import { proxy as authProxy } from "./authProxy";
import crypto from 'crypto';

// ============================================
// 1. CSP & SECURITY UTILITIES
// ============================================

/**
 * Generate cryptographically secure nonce for CSP
 */
function generateNonce() {
  return crypto.randomBytes(32).toString('base64');
}

/**
 * Generate Content Security Policy header with nonce
 */
function generateCSPHeader(nonce) {
  const policies = [
    // Default Policy
    "default-src 'self'",
    
    // Script Sources
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ` +
      "https://apis.google.com " +
      "https://*.supabase.co " +
      "https://www.googletagmanager.com " +
      "https://www.google-analytics.com " +
      "https://cdnjs.cloudflare.com " +
      "https://cdn.jsdelivr.net " +
      "https://unpkg.com " +
      "https://*.gemini.com " +
      "https://*.googleapis.com " +
      "https://accounts.google.com",
    
    // Style Sources
    `style-src 'self' 'nonce-${nonce}' ` +
      "https://fonts.googleapis.com " +
      "https://cdnjs.cloudflare.com " +
      "https://*.supabase.co " +
      "'unsafe-inline'", // Temporary for backward compatibility
    
    // Image Sources
    "img-src 'self' data: blob: " +
      "https://*.supabase.co " +
      "https://lh3.googleusercontent.com " +
      "https://*.googleusercontent.com " +
      "https://*.githubusercontent.com " +
      "https://img.icons8.com " +
      "https://*.googleapis.com " +
      "https://www.google-analytics.com " +
      "https://*.gravatar.com",
    
    // Font Sources
    "font-src 'self' " +
      "https://fonts.gstatic.com " +
      "https://cdnjs.cloudflare.com " +
      "data:",
    
    // Connection Sources
    "connect-src 'self' " +
      "https://*.supabase.co " +
      "wss://*.supabase.co " +
      "https://api.gemini.com " +
      "https://*.googleapis.com " +
      "https://www.google-analytics.com " +
      "https://*.analytics.google.com " +
      "https://*.algobuddy.me " +
      "wss://*.algobuddy.me",
    
    // Frame Sources
    "frame-src 'self' " +
      "https://*.supabase.co " +
      "https://accounts.google.com " +
      "https://www.youtube.com " +
      "https://player.vimeo.com",
    
    // Object & Media Sources
    "object-src 'none'",
    
    // Security Directives
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "block-all-mixed-content",
    "upgrade-insecure-requests",
    
    // Reporting
    "report-uri /api/csp-report",
    "report-to csp-endpoint",
  ];
  
  return policies.join('; ');
}

/**
 * Get additional security headers
 */
function getSecurityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  };
}

// ============================================
// 2. MAIN MIDDLEWARE HANDLER
// ============================================

export async function middleware(request) {
  // Generate unique nonce for this request
  const nonce = generateNonce();
  
  // Store nonce in request headers for downstream components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  
  // ============================================
  // AUTH PROXY HANDLING (Existing authProxy)
  // ============================================
  
  // First, handle authentication through authProxy
  // This preserves all existing auth functionality
  const authResponse = await authProxy(request);
  
  // If authProxy returns a response (e.g., redirect), use it
  if (authResponse) {
    // Add CSP headers to auth response
    const cspHeader = generateCSPHeader(nonce);
    authResponse.headers.set('Content-Security-Policy', cspHeader);
    authResponse.headers.set('X-Nonce', nonce);
    
    // Add other security headers
    const securityHeaders = getSecurityHeaders();
    Object.keys(securityHeaders).forEach((key) => {
      authResponse.headers.set(key, securityHeaders[key]);
    });
    
    return authResponse;
  }
  
  // ============================================
  // DEFAULT RESPONSE WITH CSP
  // ============================================
  
  // Create response with CSP headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  
  // Add CSP header with nonce
  const cspHeader = generateCSPHeader(nonce);
  response.headers.set('Content-Security-Policy', cspHeader);
  
  // Add nonce to response for client-side access
  response.headers.set('X-Nonce', nonce);
  
  // Add other security headers
  const securityHeaders = getSecurityHeaders();
  Object.keys(securityHeaders).forEach((key) => {
    response.headers.set(key, securityHeaders[key]);
  });
  
  // ============================================
  // OPTIONAL: Report-Only Mode for Testing
  // ============================================
  
  // Uncomment for report-only mode during testing
  // response.headers.set('Content-Security-Policy-Report-Only', cspHeader);
  
  return response;
}

// ============================================
// 3. MIDDLEWARE CONFIGURATION
// ============================================

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|eot)$).*)",
  ],
};