// app/api/ai/performance/route.js

import { PerformanceTester } from '@/lib/ai/performance-tester.js';
import { getAuthenticatedUser } from '@/lib/auth';
import { jsonResponse } from '@/lib/serverApi';

const tester = new PerformanceTester();

export async function POST(request) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse({ error: 'Authentication required' }, 401);
    }

    const body = await request.json();
    const { code, functionName, language = 'javascript', maxInputSize = 10000 } = body;

    if (!code || !functionName) {
      return jsonResponse({ error: 'Code and function name are required' }, 400);
    }

    const results = await tester.testPerformance(
      code,
      functionName,
      language,
      maxInputSize
    );

    // Generate chart data
    const chartData = tester.generateChartData(
      results.allResults,
      results.estimatedComplexity
    );

    return jsonResponse({
      success: true,
      data: {
        results,
        chartData,
      },
    });
  } catch (error) {
    console.error('Performance test error:', error);
    return jsonResponse({ error: error.message }, 500);
  }
}