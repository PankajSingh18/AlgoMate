// lib/rate-limit/middleware.js

import { rateLimiter } from './redis-limiter.js';
import { RateLimitType } from './config.js';

// Create rate limit middleware for API routes
export function createRateLimiter(type, options = {}) {
  return async (req, res, next) => {
    try {
      // Get identifier (IP or user ID)
      const identifier = req.user?.id || req.ip || req.connection.remoteAddress;
      
      // Check if user is whitelisted (optional)
      if (isWhitelisted(req)) {
        return next();
      }

      // Check rate limit
      const result = await rateLimiter.checkLimit(identifier, type, options);

      // Set headers
      res.setHeader('X-RateLimit-Limit', result.limit);
      res.setHeader('X-RateLimit-Remaining', result.remaining);
      res.setHeader('X-RateLimit-Reset', result.reset);

      if (!result.success) {
        return res.status(429).json({
          error: 'Too Many Requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((result.reset - Date.now() / 1000)),
        });
      }

      next();
    } catch (error) {
      console.error('Rate limit middleware error:', error);
      // On error, allow request to proceed
      next();
    }
  };
}

// Helper to check if user is whitelisted
function isWhitelisted(req) {
  const whitelistedIPs = process.env.WHITELIST_IPS?.split(',') || [];
  const whitelistedUsers = process.env.WHITELIST_USERS?.split(',') || [];
  
  const ip = req.ip || req.connection.remoteAddress;
  const userId = req.user?.id;
  
  return whitelistedIPs.includes(ip) || whitelistedUsers.includes(userId);
}

// API Route rate limiters
export const rateLimit = {
  default: createRateLimiter(RateLimitType.API),
  auth: createRateLimiter(RateLimitType.AUTH),
  read: createRateLimiter(RateLimitType.READ),
  write: createRateLimiter(RateLimitType.WRITE),
  sensitive: createRateLimiter(RateLimitType.SENSITIVE),
};

// Express middleware wrapper
export function rateLimitMiddleware(limit, window) {
  return async (req, res, next) => {
    const identifier = req.user?.id || req.ip;
    const result = await rateLimiter.checkLimit(identifier, RateLimitType.API, { max: limit, window });
    
    res.setHeader('X-RateLimit-Limit', result.limit);
    res.setHeader('X-RateLimit-Remaining', result.remaining);
    res.setHeader('X-RateLimit-Reset', result.reset);
    
    if (!result.success) {
      return res.status(429).json({ 
        error: 'Too Many Requests',
        retryAfter: Math.ceil((result.reset - Date.now() / 1000))
      });
    }
    next();
  };
}