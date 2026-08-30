// src/app/api/debug/step/route.js

import { DebuggerEngine } from '@/lib/debugger/engine.js';
import { getAuthenticatedUser } from '@/lib/auth';
import { jsonResponse } from '@/lib/serverApi';

const debuggerEngine = new DebuggerEngine();

export async function POST(request) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse({ error: 'Authentication required' }, 401);
    }

    const body = await request.json();
    const { sessionId, direction = 'forward' } = body;

    if (!sessionId) {
      return jsonResponse({ error: 'Session ID is required' }, 400);
    }

    let result;
    if (direction === 'forward') {
      result = await debuggerEngine.stepForward(sessionId);
    } else {
      result = debuggerEngine.stepBackward(sessionId);
    }

    if (!result) {
      return jsonResponse({ error: 'Debug session not found' }, 404);
    }

    return jsonResponse({
      success: true,
      data: result,
    });
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
}