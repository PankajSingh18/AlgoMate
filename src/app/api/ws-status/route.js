// src/app/api/ws-status/route.js

import { getAuthenticatedUser } from '@/lib/auth';
import { jsonResponse } from '@/lib/serverApi';

// In production, this would connect to the WebSocket server
let wsServer = null;

export function setWSServer(server) {
  wsServer = server;
}

export async function GET(request) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse({ error: 'Authentication required' }, 401);
    }

    const status = {
      connected: !!wsServer,
      activeExecutions: wsServer ? wsServer.getActiveExecutions().length : 0,
      timestamp: new Date().toISOString(),
    };

    return jsonResponse({ success: true, data: status });
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
}