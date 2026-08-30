// components/sessions/SessionManager.jsx

'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

export function SessionManager() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/auth/sessions');
      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const revokeSession = async (sessionId) => {
    setRevoking(sessionId);
    try {
      await fetch(`/api/auth/sessions/${sessionId}`, {
        method: 'DELETE',
      });
      await fetchSessions();
    } catch (error) {
      console.error('Failed to revoke session:', error);
    } finally {
      setRevoking(null);
    }
  };

  const revokeAllSessions = async () => {
    if (!confirm('This will log out all other devices. Continue?')) return;
    
    try {
      await fetch('/api/auth/sessions', {
        method: 'DELETE',
      });
      await fetchSessions();
    } catch (error) {
      console.error('Failed to revoke all sessions:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading sessions...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Active Sessions</h2>
        <button
          onClick={revokeAllSessions}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
        >
          Revoke All Other Sessions
        </button>
      </div>

      {sessions.length === 0 ? (
        <p className="text-gray-500">No active sessions</p>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div>
                <div className="font-medium">
                  {session.isCurrent && (
                    <span className="text-green-500 mr-2">●</span>
                  )}
                  {session.device?.browser || 'Unknown Browser'} on{' '}
                  {session.device?.os || 'Unknown OS'}
                </div>
                <div className="text-sm text-gray-500">
                  {session.device?.type || 'Unknown device'} •{' '}
                  {session.location?.city || 'Unknown location'},{' '}
                  {session.location?.country || 'Unknown country'}
                </div>
                <div className="text-xs text-gray-400">
                  Active {formatDistanceToNow(new Date(session.lastActive), { addSuffix: true })} •
                  Created {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                </div>
              </div>

              {!session.isCurrent && (
                <button
                  onClick={() => revokeSession(session.id)}
                  disabled={revoking === session.id}
                  className="px-2 py-1 text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
                >
                  {revoking === session.id ? 'Revoking...' : 'Revoke'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}