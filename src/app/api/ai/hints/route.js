// app/api/ai/hints/route.js

import { AIAnalyzer } from '@/lib/ai/analyzer.js';
import { getAuthenticatedUser } from '@/lib/auth';
import { jsonResponse } from '@/lib/serverApi';

const analyzer = new AIAnalyzer();

export async function POST(request) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse({ error: 'Authentication required' }, 401);
    }

    const body = await request.json();
    const { code, testCase, expectedOutput, actualOutput } = body;

    if (!code || !testCase) {
      return jsonResponse({ error: 'Code and test case are required' }, 400);
    }

    const hints = await analyzer.generateHints(
      code,
      testCase,
      expectedOutput,
      actualOutput
    );

    return jsonResponse({
      success: true,
      data: hints,
    });
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
}