// app/api/rate-limit/reset/route.js

import { rateLimiter } from '../../../lib/rate-limit/redis-limiter.js';

export async function POST(request) {
  try {
    // Only allow in development or with admin key
    const authHeader = request.headers.get('authorization');
    const adminKey = process.env.RATE_LIMIT_ADMIN_KEY || 'admin';
    
    if (!authHeader || authHeader !== `Bearer ${adminKey}`) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { identifier, type } = body;

    if (!identifier || !type) {
      return Response.json(
        { success: false, error: 'Missing identifier or type' },
        { status: 400 }
      );
    }

    const result = await rateLimiter.resetLimit(identifier, type);

    return Response.json({
      success: true,
      message: 'Rate limit reset successfully',
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}