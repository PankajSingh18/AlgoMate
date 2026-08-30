// lib/rate-limit/config.js

import Redis from 'ioredis';
import { Ratelimit } from '@upstash/ratelimit';

// Redis connection configuration
export const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: true,
};

// Rate limit configurations
export const rateLimitConfig = {
  // HTTP API limits
  api: {
    // General API limits
    default: {
      window: 60, // 1 minute
      max: 100, // 100 requests per minute
    },
    // Authentication endpoints (stricter)
    auth: {
      window: 60,
      max: 10, // 10 login attempts per minute
    },
    // Read operations (lenient)
    read: {
      window: 60,
      max: 200, // 200 reads per minute
    },
    // Write operations (moderate)
    write: {
      window: 60,
      max: 50, // 50 writes per minute
    },
    // Sensitive operations (strict)
    sensitive: {
      window: 60,
      max: 5, // 5 sensitive operations per minute
    },
  },
  
  // WebSocket limits
  websocket: {
    // Connection limits
    connection: {
      window: 60,
      maxPerIP: 5, // 5 connections per minute per IP
      maxPerUser: 3, // 3 connections per user
    },
    // Message limits
    messages: {
      window: 10, // 10 seconds
      maxPerConnection: 100, // 100 messages per 10 seconds
      maxPerUser: 200, // 200 messages per 10 seconds
    },
    // Match creation limits
    matchCreation: {
      window: 60,
      maxPerUser: 10, // 10 matches per minute per user
    },
  },
  
  // Graceful degradation
  fallback: {
    enabled: true,
    mode: 'memory', // Use in-memory when Redis fails
    maxRequests: 1000, // Max requests in memory
  },
};

// Rate limit identifiers
export const RateLimitType = {
  API: 'api',
  AUTH: 'auth',
  READ: 'read',
  WRITE: 'write',
  SENSITIVE: 'sensitive',
  WS_CONNECT: 'ws_connect',
  WS_MESSAGE: 'ws_message',
  WS_MATCH: 'ws_match',
};