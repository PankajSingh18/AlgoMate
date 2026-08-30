// lib/rate-limit/route-wrapper.js

import { rateLimiter } from './redis-limiter.js';

/**
 * Wrapper for API routes to add rate limiting
 * Usage: export const GET = withRateLimit(handler, 'api')
 */
export function withRateLimit(handler, type, options = {}) {
  return async function wrappedHandler(request, context) {
    try {
      // Get identifier
      const identifier = request.headers.get('x-user-id') || 
                        request.headers.get('x-forwarded-for') || 
                        request.headers.get('cf-connecting-ip') ||
                        'anonymous';

      // Check rate limit
      const result = await rateLimiter.checkLimit(identifier, type, options);
      
      // Create response
      const response = await handler(request, context);
      
      // Add rate limit headers
      if (response && typeof response.headers?.set === 'function') {
        response.headers.set('X-RateLimit-Limit', result.limit);
        response.headers.set('X-RateLimit-Remaining', result.remaining);
        response.headers.set('X-RateLimit-Reset', result.reset);
      }
      
      return response;
    } catch (error) {
      console.error('Rate limit wrapper error:', error);
      // If rate limiting fails, still execute handler
      return handler(request, context);
    }
  };
}

/**
 * Create a rate-limited response
 */
export function rateLimitResponse(result) {
  if (result.passed) {
    return null;
  }
  
  return new Response(
    JSON.stringify({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: Math.ceil((result.reset - Date.now() / 1000)),
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': result.limit,
        'X-RateLimit-Remaining': result.remaining,
        'X-RateLimit-Reset': result.reset,
        'Retry-After': Math.ceil((result.reset - Date.now() / 1000)),
      },
    }
  );
}