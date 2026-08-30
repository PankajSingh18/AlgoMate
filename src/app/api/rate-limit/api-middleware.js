// lib/rate-limit/api-middleware.js

import { rateLimiter } from './redis-limiter.js';
import { RateLimitType } from './config.js';

/**
 * Higher-order function to wrap API routes with rate limiting
 */
export function withRateLimit(type, options = {}) {
  return async function rateLimitWrapper(req, context) {
    try {
      // Get identifier (user ID or IP)
      const identifier = req.headers.get('x-user-id') || 
                        req.headers.get('x-forwarded-for') || 
                        req.headers.get('cf-connecting-ip') ||
                        'anonymous';
      
      // Check if user is whitelisted
      if (isWhitelisted(identifier)) {
        return { passed: true };
      }

      // Check rate limit
      const result = await rateLimiter.checkLimit(identifier, type, options);
      
      // Return rate limit info
      return {
        passed: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
        current: result.current,
      };
    } catch (error) {
      console.error('Rate limit error:', error);
      // On error, allow request to proceed
      return { passed: true };
    }
  };
}

// Helper to check whitelist
function isWhitelisted(identifier) {
  const whitelist = process.env.WHITELIST_IPS?.split(',') || [];
  return whitelist.includes(identifier);
}

// Pre-configured rate limiters
export const rateLimit = {
  default: withRateLimit(RateLimitType.API),
  auth: withRateLimit(RateLimitType.AUTH),
  read: withRateLimit(RateLimitType.READ),
  write: withRateLimit(RateLimitType.WRITE),
  sensitive: withRateLimit(RateLimitType.SENSITIVE),
  ws: withRateLimit(RateLimitType.WS_CONNECT),
};