// src/app/api/ai/complete/route.js

import { AICompletionEngine } from '@/lib/ai/completion-engine.js';
import { getAuthenticatedUser } from '@/lib/auth';
import { jsonResponse } from '@/lib/serverApi';
import { rateLimit } from '@/lib/rate-limit/api-middleware.js';

const completionEngine = new AICompletionEngine();

export async function POST(request) {
  try {
    // Authentication
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse({ error: 'Authentication required' }, 401);
    }

    // Rate limiting
    const rateLimitResult = await rateLimit.default(request);
    if (!rateLimitResult.passed) {
      return jsonResponse({
        error: 'Rate limit exceeded',
        retryAfter: rateLimitResult.reset,
      }, 429);
    }

    // Parse request
    const body = await request.json();
    const { code, language = 'javascript', position } = body;

    if (!code) {
      return jsonResponse({ error: 'Code is required' }, 400);
    }

    if (!position) {
      return jsonResponse({ error: 'Position is required' }, 400);
    }

    // Get completions
    const suggestions = await completionEngine.getCompletions(
      code,
      language,
      position
    );

    return jsonResponse({
      success: true,
      data: {
        suggestions,
        language,
        position,
      },
    });
  } catch (error) {
    console.error('AI Completion error:', error);
    return jsonResponse({
      error: error.message || 'Failed to get completions',
    }, 500);
  }
}