// app/api/auth/refresh/route.js

import { cookies } from 'next/headers';
import { SessionManager } from '@/lib/session/session-manager.js';
import { jsonResponse } from '@/lib/serverApi';

export async function POST(request) {
  try {
    // Get refresh token from cookies
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!refreshToken) {
      return jsonResponse({ error: 'No refresh token provided' }, 401);
    }

    // Initialize session manager
    const sessionManager = new SessionManager();

    // Refresh session
    const result = await sessionManager.refreshSession(refreshToken, request);

    // Set new cookies
    const response = jsonResponse({
      success: true,
      familyId: result.familyId,
      device: result.device,
    });

    // Set refresh token cookie
    response.cookies.set('refresh_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    // Set session cookie
    response.cookies.set('session_id', result.familyId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Token refresh error:', error);
    return jsonResponse({ 
      error: error.message || 'Failed to refresh token' 
    }, 401);
  }
}