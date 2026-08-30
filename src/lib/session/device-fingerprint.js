// lib/session/device-fingerprint.js

import { headers } from 'next/headers';

export class DeviceFingerprint {
  /**
   * Generate device fingerprint from request
   */
  static async generate(request) {
    const headersList = request.headers || headers();
    
    const fingerprint = {
      // IP Address (for location tracking)
      ip: headersList.get('x-forwarded-for') || 
           headersList.get('cf-connecting-ip') ||
           headersList.get('x-real-ip') ||
           'unknown',
      
      // User Agent
      userAgent: headersList.get('user-agent') || 'unknown',
      
      // Accept Language (for location detection)
      acceptLanguage: headersList.get('accept-language') || 'unknown',
      
      // Accept Encoding
      acceptEncoding: headersList.get('accept-encoding') || 'unknown',
      
      // Screen/Viewport (for mobile detection)
      viewport: headersList.get('viewport') || headersList.get('sec-ch-viewport') || 'unknown',
      
      // Platform (from Sec-CH-UA headers)
      platform: headersList.get('sec-ch-ua-platform') || 'unknown',
      
      // Mobile detection
      isMobile: headersList.get('sec-ch-ua-mobile') === '?1',
      
      // User Agent Client Hints
      uaFull: headersList.get('sec-ch-ua') || 'unknown',
      uaFullVersion: headersList.get('sec-ch-ua-full-version') || 'unknown',
    };

    // Generate a unique fingerprint hash
    fingerprint.hash = this.generateHash(fingerprint);

    return fingerprint;
  }

  /**
   * Generate hash from fingerprint data
   */
  static generateHash(fingerprint) {
    const data = [
      fingerprint.ip,
      fingerprint.userAgent,
      fingerprint.acceptLanguage,
      fingerprint.platform,
      fingerprint.isMobile,
      fingerprint.acceptEncoding,
    ].join('|');

    // Simple hash function (in production, use crypto)
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Get device type from user agent
   */
  static getDeviceType(userAgent) {
    const ua = userAgent.toLowerCase();
    
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return 'mobile';
    }
    if (ua.includes('tablet') || ua.includes('ipad')) {
      return 'tablet';
    }
    if (ua.includes('bot') || ua.includes('crawler') || ua.includes('spider')) {
      return 'bot';
    }
    if (ua.includes('windows') || ua.includes('mac') || ua.includes('linux')) {
      return 'desktop';
    }
    return 'unknown';
  }

  /**
   * Get browser name from user agent
   */
  static getBrowser(userAgent) {
    const ua = userAgent.toLowerCase();
    if (ua.includes('chrome')) return 'Chrome';
    if (ua.includes('firefox')) return 'Firefox';
    if (ua.includes('safari')) return 'Safari';
    if (ua.includes('edge')) return 'Edge';
    if (ua.includes('opera')) return 'Opera';
    return 'Unknown';
  }

  /**
   * Get OS from user agent
   */
  static getOS(userAgent) {
    const ua = userAgent.toLowerCase();
    if (ua.includes('windows')) return 'Windows';
    if (ua.includes('mac')) return 'macOS';
    if (ua.includes('linux')) return 'Linux';
    if (ua.includes('android')) return 'Android';
    if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) return 'iOS';
    return 'Unknown';
  }

  /**
   * Get location from IP (mock - use IP geolocation API in production)
   */
  static async getLocation(ip) {
    // In production, use a service like ip-api.com or maxmind
    try {
      const response = await fetch(`http://ip-api.com/json/${ip}`);
      const data = await response.json();
      return {
        country: data.country || 'Unknown',
        city: data.city || 'Unknown',
        region: data.regionName || 'Unknown',
        timezone: data.timezone || 'UTC',
      };
    } catch {
      return {
        country: 'Unknown',
        city: 'Unknown',
        region: 'Unknown',
        timezone: 'UTC',
      };
    }
  }
}