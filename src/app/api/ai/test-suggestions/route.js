// src/app/api/ai/test-suggestions/route.js

import { TestGenerator } from '@/lib/ai/test-generator.js';
import { getAuthenticatedUser } from '@/lib/auth';
import { jsonResponse } from '@/lib/serverApi';

const testGenerator = new TestGenerator();

export async function POST(request) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse({ error: 'Authentication required' }, 401);
    }

    const body = await request.json();
    const { code } = body;

    if (!code) {
      return jsonResponse({ error: 'Code is required' }, 400);
    }

    const suggestions = testGenerator.generateTestSuggestions(code);

    return jsonResponse({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
}