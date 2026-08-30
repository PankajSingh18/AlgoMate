// src/app/api/ai/generate-tests/route.js

import { TestGenerator } from '@/lib/ai/test-generator.js';
import { getAuthenticatedUser } from '@/lib/auth';
import { jsonResponse } from '@/lib/serverApi';
import { rateLimit } from '@/lib/rate-limit/api-middleware.js';

const testGenerator = new TestGenerator();

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
    const { code, language = 'javascript', options = {} } = body;

    if (!code) {
      return jsonResponse({ error: 'Code is required' }, 400);
    }

    // Generate tests
    const result = await testGenerator.generateTests(code, language, options);

    return jsonResponse({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Test generation error:', error);
    return jsonResponse({
      error: error.message || 'Failed to generate tests',
    }, 500);
  }
}