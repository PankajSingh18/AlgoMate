// src/app/api/debug/visualize/route.js

import { DebuggerEngine } from '@/lib/debugger/engine.js';
import { getAuthenticatedUser } from '@/lib/auth';
import { jsonResponse } from '@/lib/serverApi';

const debuggerEngine = new DebuggerEngine();

export async function GET(request) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse({ error: 'Authentication required' }, 401);
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return jsonResponse({ error: 'Session ID is required' }, 400);
    }

    const data = debuggerEngine.getVisualizationData(sessionId);
    if (!data) {
      return jsonResponse({ error: 'Debug session not found' }, 404);
    }

    return jsonResponse({
      success: true,
      data,
    });
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
}