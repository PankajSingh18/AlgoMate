// lib/rate-limit/redis-limiter.js

import Redis from 'ioredis';
import { redisConfig, rateLimitConfig } from './config.js';

class RedisRateLimiter {
  constructor() {
    this.redis = null;
    this.isConnected = false;
    this.fallbackMode = false;
    this.memoryCache = new Map();
    this.initializeRedis();
  }

  initializeRedis() {
    try {
      this.redis = new Redis(redisConfig);
      
      this.redis.on('connect', () => {
        this.isConnected = true;
        this.fallbackMode = false;
        console.log('✅ Redis connected successfully');
      });

      this.redis.on('error', (error) => {
        console.error('❌ Redis connection error:', error);
        this.handleRedisFailure();
      });

      this.redis.on('close', () => {
        this.isConnected = false;
        console.warn('⚠️ Redis connection closed');
        this.handleRedisFailure();
      });

    } catch (error) {
      console.error('❌ Redis initialization error:', error);
      this.handleRedisFailure();
    }
  }

  handleRedisFailure() {
    if (!rateLimitConfig.fallback.enabled) {
      throw new Error('Redis unavailable and fallback disabled');
    }
    
    console.warn('⚠️ Switching to fallback memory mode');
    this.fallbackMode = true;
    this.isConnected = false;
  }

  // Check if rate limit is exceeded
  async checkLimit(identifier, type, options = {}) {
    const key = this.getKey(identifier, type);
    const config = this.getConfig(type);
    const window = options.window || config.window;
    const max = options.max || config.max;

    if (this.fallbackMode) {
      return this.checkMemoryLimit(key, window, max);
    }

    try {
      const current = await this.incrementRedis(key, window);
      const remaining = Math.max(0, max - current);
      const reset = Math.ceil(Date.now() / 1000) + window;

      return {
        success: current <= max,
        limit: max,
        remaining,
        reset,
        current,
      };
    } catch (error) {
      console.error('Redis rate limit error:', error);
      return this.checkMemoryLimit(key, window, max);
    }
  }

  // Get rate limit status without incrementing
  async getStatus(identifier, type) {
    const key = this.getKey(identifier, type);
    const config = this.getConfig(type);
    const max = config.max;

    if (this.fallbackMode) {
      const current = this.memoryCache.get(key) || 0;
      return {
        current,
        limit: max,
        remaining: Math.max(0, max - current),
      };
    }

    try {
      const current = await this.redis.get(key);
      const count = parseInt(current || '0');
      return {
        current: count,
        limit: max,
        remaining: Math.max(0, max - count),
      };
    } catch (error) {
      return { current: 0, limit: max, remaining: max };
    }
  }

  // Reset rate limit for a key
  async resetLimit(identifier, type) {
    const key = this.getKey(identifier, type);
    
    if (this.fallbackMode) {
      this.memoryCache.delete(key);
      return true;
    }

    try {
      await this.redis.del(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Increment count in Redis
  async incrementRedis(key, window) {
    const multi = this.redis.multi();
    multi.incr(key);
    multi.expire(key, window);
    const results = await multi.exec();
    return results[0][1];
  }

  // Memory-based fallback limiting
  checkMemoryLimit(key, window, max) {
    const now = Date.now();
    const record = this.memoryCache.get(key) || { count: 0, reset: now + window * 1000 };
    
    if (now > record.reset) {
      // Reset window
      const newRecord = { count: 1, reset: now + window * 1000 };
      this.memoryCache.set(key, newRecord);
      return {
        success: true,
        limit: max,
        remaining: max - 1,
        reset: newRecord.reset,
        current: 1,
      };
    }

    record.count++;
    this.memoryCache.set(key, record);
    
    return {
      success: record.count <= max,
      limit: max,
      remaining: Math.max(0, max - record.count),
      reset: record.reset,
      current: record.count,
    };
  }

  // Get configuration for rate limit type
  getConfig(type) {
    const configs = {
      [RateLimitType.API]: rateLimitConfig.api.default,
      [RateLimitType.AUTH]: rateLimitConfig.api.auth,
      [RateLimitType.READ]: rateLimitConfig.api.read,
      [RateLimitType.WRITE]: rateLimitConfig.api.write,
      [RateLimitType.SENSITIVE]: rateLimitConfig.api.sensitive,
      [RateLimitType.WS_CONNECT]: rateLimitConfig.websocket.connection,
      [RateLimitType.WS_MESSAGE]: rateLimitConfig.websocket.messages,
      [RateLimitType.WS_MATCH]: rateLimitConfig.websocket.matchCreation,
    };
    return configs[type] || rateLimitConfig.api.default;
  }

  // Generate Redis key
  getKey(identifier, type) {
    return `ratelimit:${type}:${identifier}`;
  }

  // Get connection status
  getStatus() {
    return {
      connected: this.isConnected,
      fallbackMode: this.fallbackMode,
      cacheSize: this.memoryCache.size,
    };
  }

  // Cleanup
  disconnect() {
    if (this.redis) {
      this.redis.disconnect();
    }
    this.memoryCache.clear();
  }
}

// Export singleton instance
export const rateLimiter = new RedisRateLimiter();
export { RedisRateLimiter };