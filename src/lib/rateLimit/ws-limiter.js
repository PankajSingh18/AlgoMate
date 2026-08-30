// lib/rate-limit/ws-limiter.js

import { rateLimiter } from './redis-limiter.js';
import { RateLimitType } from './config.js';

export class WebSocketRateLimiter {
  constructor() {
    this.connections = new Map();
    this.userConnections = new Map();
    this.messageCounts = new Map();
  }

  // Check if connection is allowed
  async checkConnection(ip, userId = null) {
    try {
      // Check IP-based limit
      const ipResult = await rateLimiter.checkLimit(
        ip,
        RateLimitType.WS_CONNECT,
        { max: 5, window: 60 }
      );

      if (!ipResult.success) {
        return {
          allowed: false,
          reason: `Too many connection attempts from IP ${ip}`,
          retryAfter: Math.ceil((ipResult.reset - Date.now() / 1000)),
        };
      }

      // Check user-based limit (if authenticated)
      if (userId) {
        const userResult = await rateLimiter.checkLimit(
          `user:${userId}`,
          RateLimitType.WS_CONNECT,
          { max: 3, window: 60 }
        );

        if (!userResult.success) {
          return {
            allowed: false,
            reason: 'Too many connections for this user',
            retryAfter: Math.ceil((userResult.reset - Date.now() / 1000)),
          };
        }

        // Track user connections
        this.trackUserConnection(userId);
      }

      // Track IP connection
      this.trackConnection(ip);

      return { allowed: true };
    } catch (error) {
      console.error('WebSocket connection rate limit error:', error);
      // Allow on error
      return { allowed: true };
    }
  }

  // Check if message is allowed
  async checkMessage(connectionId, userId = null) {
    try {
      // Check connection-based limit
      const connResult = await rateLimiter.checkLimit(
        `ws:${connectionId}`,
        RateLimitType.WS_MESSAGE,
        { max: 100, window: 10 }
      );

      if (!connResult.success) {
        return {
          allowed: false,
          reason: 'Too many messages from this connection',
          retryAfter: Math.ceil((connResult.reset - Date.now() / 1000)),
        };
      }

      // Check user-based limit
      if (userId) {
        const userResult = await rateLimiter.checkLimit(
          `ws:user:${userId}`,
          RateLimitType.WS_MESSAGE,
          { max: 200, window: 10 }
        );

        if (!userResult.success) {
          return {
            allowed: false,
            reason: 'Too many messages from this user',
            retryAfter: Math.ceil((userResult.reset - Date.now() / 1000)),
          };
        }
      }

      return { allowed: true };
    } catch (error) {
      console.error('WebSocket message rate limit error:', error);
      return { allowed: true };
    }
  }

  // Check match creation limit
  async checkMatchCreation(userId) {
    try {
      const result = await rateLimiter.checkLimit(
        `match:${userId}`,
        RateLimitType.WS_MATCH,
        { max: 10, window: 60 }
      );

      if (!result.success) {
        return {
          allowed: false,
          reason: 'Too many match creations',
          retryAfter: Math.ceil((result.reset - Date.now() / 1000)),
        };
      }

      return { allowed: true };
    } catch (error) {
      console.error('Match creation rate limit error:', error);
      return { allowed: true };
    }
  }

  // Track connection
  trackConnection(ip) {
    const now = Date.now();
    if (!this.connections.has(ip)) {
      this.connections.set(ip, []);
    }
    this.connections.get(ip).push(now);
    
    // Clean old connections
    this.connections.set(
      ip,
      this.connections.get(ip).filter(t => now - t < 60000)
    );
  }

  // Track user connection
  trackUserConnection(userId) {
    const now = Date.now();
    if (!this.userConnections.has(userId)) {
      this.userConnections.set(userId, []);
    }
    this.userConnections.get(userId).push(now);
    
    // Clean old connections
    this.userConnections.set(
      userId,
      this.userConnections.get(userId).filter(t => now - t < 60000)
    );
  }

  // Remove connection
  removeConnection(ip, userId = null) {
    if (ip) {
      const conns = this.connections.get(ip) || [];
      this.connections.set(ip, conns.slice(0, -1));
    }
    if (userId) {
      const conns = this.userConnections.get(userId) || [];
      this.userConnections.set(userId, conns.slice(0, -1));
    }
  }

  // Get connection stats
  getStats() {
    return {
      totalConnections: this.connections.size,
      totalUsers: this.userConnections.size,
      connectionCounts: {
        ip: Array.from(this.connections.entries()).map(([ip, conns]) => ({
          ip,
          count: conns.length,
        })),
        user: Array.from(this.userConnections.entries()).map(([user, conns]) => ({
          userId: user,
          count: conns.length,
        })),
      },
    };
  }
}

export const wsRateLimiter = new WebSocketRateLimiter();