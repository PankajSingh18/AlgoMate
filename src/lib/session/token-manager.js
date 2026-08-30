// lib/session/token-manager.js

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { SessionStatus, TokenType } from './types.js';

export class TokenManager {
  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }

  /**
   * Create refresh token with family
   */
  async createRefreshToken(userId, familyId = null) {
    // Generate family ID if not provided
    if (!familyId) {
      familyId = this.generateFamilyId(userId);
    }

    // Create token entry in database
    const { data, error } = await this.supabase
      .from('refresh_tokens')
      .insert({
        user_id: userId,
        family_id: familyId,
        token: this.generateToken(),
        status: SessionStatus.ACTIVE,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create refresh token: ${error.message}`);
    }

    return data;
  }

  /**
   * Rotate refresh token (use it once, issue new one)
   */
  async rotateRefreshToken(oldToken, deviceFingerprint) {
    // Get existing token
    const { data: token, error: tokenError } = await this.supabase
      .from('refresh_tokens')
      .select('*')
      .eq('token', oldToken)
      .single();

    if (tokenError || !token) {
      throw new Error('Invalid refresh token');
    }

    // Check if token is expired or revoked
    if (token.status === SessionStatus.EXPIRED) {
      throw new Error('Refresh token expired');
    }
    if (token.status === SessionStatus.REVOKED) {
      throw new Error('Refresh token revoked');
    }

    // Check if token is already used (detect token theft)
    if (token.used_at) {
      // Token was already used - potential theft!
      await this.handleTokenTheft(token.family_id);
      throw new Error('Suspicious activity detected');
    }

    // Mark old token as used
    const { error: updateError } = await this.supabase
      .from('refresh_tokens')
      .update({
        used_at: new Date().toISOString(),
        used_ip: deviceFingerprint.ip,
        used_device: deviceFingerprint.userAgent,
        status: SessionStatus.ACTIVE,
      })
      .eq('id', token.id);

    if (updateError) {
      throw new Error(`Failed to update token: ${updateError.message}`);
    }

    // Create new token in same family
    const newToken = await this.createRefreshToken(
      token.user_id,
      token.family_id
    );

    // Log token rotation
    await this.logTokenRotation(token.user_id, token.family_id, deviceFingerprint);

    return {
      token: newToken,
      familyId: token.family_id,
    };
  }

  /**
   * Handle token theft detection
   */
  async handleTokenTheft(familyId) {
    // Revoke all tokens in the family
    const { error } = await this.supabase
      .from('refresh_tokens')
      .update({
        status: SessionStatus.REVOKED,
        revoked_reason: 'token_theft_detected',
        revoked_at: new Date().toISOString(),
      })
      .eq('family_id', familyId)
      .eq('status', SessionStatus.ACTIVE);

    if (error) {
      console.error('Error revoking tokens:', error);
    }

    // Log security event
    await this.logSecurityEvent({
      type: 'TOKEN_THEFT_DETECTED',
      familyId,
      severity: 'high',
      timestamp: new Date().toISOString(),
    });

    return true;
  }

  /**
   * Revoke all tokens for a user
   */
  async revokeAllUserTokens(userId) {
    const { error } = await this.supabase
      .from('refresh_tokens')
      .update({
        status: SessionStatus.REVOKED,
        revoked_reason: 'user_initiated',
        revoked_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('status', SessionStatus.ACTIVE);

    if (error) {
      throw new Error(`Failed to revoke tokens: ${error.message}`);
    }

    return true;
  }

  /**
   * Revoke specific token
   */
  async revokeToken(tokenId, reason = 'user_initiated') {
    const { error } = await this.supabase
      .from('refresh_tokens')
      .update({
        status: SessionStatus.REVOKED,
        revoked_reason: reason,
        revoked_at: new Date().toISOString(),
      })
      .eq('id', tokenId);

    if (error) {
      throw new Error(`Failed to revoke token: ${error.message}`);
    }

    return true;
  }

  /**
   * Get active sessions for a user
   */
  async getUserSessions(userId) {
    const { data, error } = await this.supabase
      .from('refresh_tokens')
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
   * Log token rotation
   */
  async logTokenRotation(userId, familyId, deviceFingerprint) {
    const { error } = await this.supabase
      .from('token_rotation_logs')
      .insert({
        user_id: userId,
        family_id: familyId,
        ip: deviceFingerprint.ip,
        user_agent: deviceFingerprint.userAgent,
        device_hash: deviceFingerprint.hash,
        rotated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error logging token rotation:', error);
    }
  }

  /**
   * Log security event
   */
  async logSecurityEvent(event) {
    const { error } = await this.supabase
      .from('security_events')
      .insert({
        event_type: event.type,
        severity: event.severity || 'medium',
        data: event,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error logging security event:', error);
    }
  }

  /**
   * Generate random token
   */
  generateToken() {
    return require('crypto').randomBytes(64).toString('hex');
  }

  /**
   * Generate family ID
   */
  generateFamilyId(userId) {
    return `family_${userId}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}