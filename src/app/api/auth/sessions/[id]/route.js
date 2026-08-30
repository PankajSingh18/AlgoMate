// app/api/auth/sessions/[id]/route.js

import { SessionManager } from '@/lib/session/session-manager.js';
import { getAuthenticatedUser } from '@/lib/auth';
import { jsonResponse } from '@/lib/serverApi';

export async function DELETE(request, { params }) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse({ error: 'Authentication required' }, 401);
    }

    const { id } = params;
    if (!id) {
      return jsonResponse({ error: 'Session ID required' }, 400);
    }

    const sessionManager = new SessionManager();
    await sessionManager.revokeSession(id);

    return jsonResponse({
      message: 'Session revoked successfully',
    });
  } catch (error) {
    console.error('Revoke session error:', error);
    return jsonResponse({ error: error.message }, 500);
  }
}