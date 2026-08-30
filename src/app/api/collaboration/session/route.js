// app/api/collaboration/session/route.js

import { v4 as uuidv4 } from 'uuid';
import { getAuthenticatedUser } from '@/lib/auth';
import { jsonResponse } from '@/lib/serverApi';

// Create a new session
export async function POST(request) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse({ error: 'Authentication required' }, 401);
    }

    const body = await request.json();
    const { title, type = 'interview' } = body;

    const sessionId = uuidv4();

    // Store session in database (simplified)
    // In production, use Supabase or Redis

    return jsonResponse({
      success: true,
      sessionId,
      title: title || 'Untitled Session',
      type,
      createdBy: authResult.user.id,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error creating session:', error);
    return jsonResponse({ error: error.message }, 500);
  }
}

// Get session info
export async function GET(request) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse({ error: 'Authentication required' }, 401);
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('id');

    if (!sessionId) {
      return jsonResponse({ error: 'Session ID required' }, 400);
    }

    // Get session from database (simplified)
    // In production, fetch from database

    return jsonResponse({
      success: true,
      sessionId,
      status: 'active',
      participants: [],
    });
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
}