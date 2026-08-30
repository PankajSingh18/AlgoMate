// lib/session/session-manager.js

import { cookies } from 'next/headers';
import { TokenManager } from './token-manager.js';
import { DeviceFingerprint } from './device-fingerprint.js';
import { LoginAlertType, SessionStatus } from './types.js';

export class SessionManager {
  constructor() {
    this.tokenManager = new TokenManager();
  }

  /**
   * Create new session
   */
  async createSession(userId, request, deviceInfo = {}) {
    try {
      // Generate device fingerprint
      const fingerprint = await DeviceFingerprint.generate(request);
      
      // Create refresh token
      const token = await this.tokenManager.createRefreshToken(userId);
      
      // Get location
      const location = await DeviceFingerprint.getLocation(fingerprint.ip);
      
      // Log session creation
      await this.logSession({
        userId,
        tokenId: token.id,
        device: fingerprint,
        location,
        createdAt: new Date().toISOString(),
      });

      // Check if this is a new device
      const isNewDevice = await this.isNewDevice(userId, fingerprint);
      
      if (isNewDevice) {
        await this.sendNewDeviceAlert(userId, fingerprint, location);
      }

      return {
        token: token.token,
        familyId: token.family_id,
        device: fingerprint,
        location,
        isNewDevice,
      };
    } catch (error) {
      console.error('Session creation error:', error);
      throw error;
    }
  }

  /**
   * Refresh session
   */
  async refreshSession(refreshToken, request) {
    try {
      // Generate device fingerprint
      const fingerprint = await DeviceFingerprint.generate(request);
      
      // Rotate token
      const result = await this.tokenManager.rotateRefreshToken(
        refreshToken,
        fingerprint
      );

      // Check for suspicious activity
      const isSuspicious = await this.detectSuspiciousActivity(
        result.familyId,
        fingerprint
      );

      if (isSuspicious) {
        await this.tokenManager.handleTokenTheft(result.familyId);
        throw new Error('Suspicious activity detected');
      }

      return {
        token: result.token.token,
        familyId: result.familyId,
        device: fingerprint,
        isSuspicious,
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  /**
   * Check if device is new
   */
  async isNewDevice(userId, fingerprint) {
    const sessions = await this.tokenManager.getUserSessions(userId);
    
    for (const session of sessions) {
      // Check if device hash matches
      if (session.device_hash === fingerprint.hash) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Detect suspicious activity
   */
  async detectSuspiciousActivity(familyId, fingerprint) {
    // Check for rapid location changes
    // Check for unusual device patterns
    // Check for impossible travel
    
    // For now, return false (no suspicious activity)
    return false;
  }

  /**
   * Send new device alert
   */
  async sendNewDeviceAlert(userId, fingerprint, location) {
    // In production, send email/SMS notification
    console.log(`🔐 New device login detected for user ${userId}`, {
      device: fingerprint,
      location,
      timestamp: new Date().toISOString(),
    });

    // Log alert
    await this.tokenManager.logSecurityEvent({
      type: LoginAlertType.NEW_DEVICE,
      userId,
      device: fingerprint,
      location,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Log session
   */
  async logSession(sessionData) {
    const { error } = await this.tokenManager.supabase
      .from('sessions')
      .insert({
        user_id: sessionData.userId,
        token_id: sessionData.tokenId,
        device_hash: sessionData.device.hash,
        device_info: sessionData.device,
        location: sessionData.location,
        created_at: sessionData.createdAt,
        last_active_at: sessionData.createdAt,
        status: SessionStatus.ACTIVE,
      });

    if (error) {
      console.error('Error logging session:', error);
    }
  }

  /**
   * Get all active sessions for user
   */
  async getActiveSessions(userId) {
    const { data, error } = await this.tokenManager.supabase
      .from('sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', SessionStatus.ACTIVE)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get sessions: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Revoke session
   */
  async revokeSession(sessionId) {
    const { error } = await this.tokenManager.supabase
      .from('sessions')
      .update({
        status: SessionStatus.REVOKED,
        revoked_at: new Date().toISOString(),
        revoked_reason: 'user_initiated',
      })
      .eq('id', sessionId);

    if (error) {
      throw new Error(`Failed to revoke session: ${error.message}`);
    }

    // Also revoke the associated refresh token
    await this.tokenManager.revokeToken(sessionId);

    return true;
  }

  /**
   * Revoke all sessions except current
   */
  async revokeAllSessionsExcept(userId, currentSessionId) {
    const { error } = await this.tokenManager.supabase
      .from('sessions')
      .update({
        status: SessionStatus.REVOKED,
        revoked_at: new Date().toISOString(),
        revoked_reason: 'user_initiated',
      })
      .eq('user_id', userId)
      .neq('id', currentSessionId)
      .eq('status', SessionStatus.ACTIVE);

    if (error) {
      throw new Error(`Failed to revoke sessions: ${error.message}`);
    }

    return true;
  }
}