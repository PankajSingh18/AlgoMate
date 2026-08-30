// lib/csp.js

export const CSP_CONFIG = {
  development: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' http://localhost:*",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' http://localhost:* https://*.supabase.co wss://*.supabase.co",
    "frame-src 'self' https://*.google.com",
    "report-uri /api/csp-report"
  ].join('; '),

  production: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' https://*.googletagmanager.com https://*.google-analytics.com https://*.googleapis.com https://*.supabase.co",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data: https:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.googleapis.com https://*.google-analytics.com",
    "frame-src 'self' https://*.google.com https://*.supabase.co",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "upgrade-insecure-requests",
    "block-all-mixed-content",
    "report-uri /api/csp-report"
  ].join('; ')
};