// app/api/rate-limit/status/route.js

import { rateLimiter } from '../../../lib/rate-limit/redis-limiter.js';
import { wsRateLimiter } from '../../../lib/rate-limit/ws-limiter.js';
import { rateLimitConfig } from '../../../lib/rate-limit/config.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const identifier = searchParams.get('identifier') || '';

    let data = {};

    // Get Redis status
    const redisStatus = rateLimiter.getStatus();

    // Get WebSocket stats
    const wsStats = wsRateLimiter.getStats();

    // Get specific rate limit status
    if (identifier && type) {
      const status = await rateLimiter.getStatus(identifier, type);
      data.limit = status;
    }

    // Get all rate limit configurations
    const config = rateLimitConfig;

    return Response.json({
      success: true,
      data: {
        redis: redisStatus,
        websocket: wsStats,
        config: config,
        limit: data.limit,
      },
    });
  } catch (error) {
    return Response.json(
      { 
        success: false, 
        error: error.message 
      },
      { status: 500 }
    );
  }
}