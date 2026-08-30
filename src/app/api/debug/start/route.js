// src/app/api/debug/start/route.js

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
    const { code, language = 'javascript', breakpoints = [] } = body;

    if (!code) {
      return jsonResponse({ error: 'Code is required' }, 400);
    }

    const result = await debuggerEngine.startDebugging(code, language, { breakpoints });

    return jsonResponse({
      success: true,
      data: result,
    });
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
}