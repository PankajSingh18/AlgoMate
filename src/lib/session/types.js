// lib/session/types.js

export const SessionStatus = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  REVOKED: 'revoked',
  SUSPICIOUS: 'suspicious',
};

export const DeviceType = {
  DESKTOP: 'desktop',
  MOBILE: 'mobile',
  TABLET: 'tablet',
  BOT: 'bot',
  UNKNOWN: 'unknown',
};

export const TokenType = {
  ACCESS: 'access',
  REFRESH: 'refresh',
  FAMILY: 'family',
};

export const LoginAlertType = {
  NEW_DEVICE: 'new_device',
  NEW_LOCATION: 'new_location',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  FAILED_ATTEMPT: 'failed_attempt',
};