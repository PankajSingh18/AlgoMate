// app/api/auth/sessions/route.js

import { SessionManager } from '@/lib/session/session-manager.js';
import { getAuthenticatedUser } from '@/lib/auth';
import { jsonResponse } from '@/lib/serverApi';

// GET /api/auth/sessions - Get all active sessions
export async function GET(request) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse({ error: 'Authentication required' }, 401);
    }

    const sessionManager = new SessionManager();
    const sessions = await sessionManager.getActiveSessions(authResult.user.id);

    return jsonResponse({
      sessions: sessions.map(s => ({
        id: s.id,
        device: s.device_info,
        location: s.location,
        createdAt: s.created_at,
        lastActive: s.last_active_at,
        isCurrent: s.id === request.headers.get('x-session-id'),
      })),
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    return jsonResponse({ error: error.message }, 500);
  }
}

// DELETE /api/auth/sessions - Revoke all sessions
export async function DELETE(request) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse({ error: 'Authentication required' }, 401);
    }

    const sessionManager = new SessionManager();
    const currentSessionId = request.headers.get('x-session-id');

    await sessionManager.revokeAllSessionsExcept(
      authResult.user.id,
      currentSessionId
    );

    return jsonResponse({
      message: 'All other sessions revoked successfully',
    });
  } catch (error) {
    console.error('Revoke sessions error:', error);
    return jsonResponse({ error: error.message }, 500);
  }
}