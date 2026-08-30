# 📊 Rate Limiting Documentation

## Overview

AlgoBuddy implements a comprehensive distributed rate limiting system using Redis with graceful degradation.

## Architecture
┌─────────────┐ ┌──────────────┐ ┌─────────────┐
│ Client │────▶│ Middleware │────▶│ Redis │
│ │ │ (Rate Lim) │ │ (Counter) │
└─────────────┘ └──────────────┘ └─────────────┘
│
▼
┌──────────────┐
│ Fallback │
│ (Memory) │
└──────────────┘

text

## Rate Limit Types

### HTTP API Limits

| Type | Requests/Window | Window |
|------|-----------------|--------|
| Default | 100 | 60s |
| Auth | 10 | 60s |
| Read | 200 | 60s |
| Write | 50 | 60s |
| Sensitive | 5 | 60s |

### WebSocket Limits

| Type | Limit | Window |
|------|-------|--------|
| Connections per IP | 5 | 60s |
| Connections per User | 3 | 60s |
| Messages per Connection | 100 | 10s |
| Messages per User | 200 | 10s |
| Match Creations | 10 | 60s |

## Usage

### HTTP API

```javascript
// Apply to all routes
router.use(rateLimit.default);

// Stricter for auth routes
router.use('/api/auth/*', rateLimit.auth);

// Custom limit
router.use('/api/custom', rateLimitMiddleware(20, 60));

WebSocket
javascript
import { wsRateLimiter } from './lib/rate-limit/ws-limiter.js';

// Check connection
const result = await wsRateLimiter.checkConnection(ip, userId);

// Check message
const msgResult = await wsRateLimiter.checkMessage(connectionId, userId);
Monitoring
Check Rate Limit Status
bash
GET /api/rate-limit/status?type=api&identifier=user-123
Reset Rate Limit
bash
POST /api/rate-limit/reset
Authorization: Bearer admin-key
{ "identifier": "user-123", "type": "api" }
Graceful Degradation
If Redis fails:

Automatically switches to in-memory mode

Maximum 1000 requests in memory

Logs warning and continues operation

Reconnects automatically when Redis recovers

Error Responses
json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Please try again later.",
  "retryAfter": 45
}
Security Headers
X-RateLimit-Limit: Request limit

X-RateLimit-Remaining: Remaining requests

X-RateLimit-Reset: Reset timestamp