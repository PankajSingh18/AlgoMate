# Security Policy

## 📋 Supported Versions

The following versions of **AlgoBuddy** are currently supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| main    | ✅ Yes             |
| stable  | ✅ Yes             |
| beta    | ⚠️ Limited support |

## 🛡️ Content Security Policy (CSP)

AlgoBuddy implements a **strict Content Security Policy** to protect against XSS, data injection, and other code execution attacks.

### CSP Directives

| Directive | Policy | Description |
|-----------|--------|-------------|
| `default-src` | `'self'` | Only allow resources from same origin |
| `script-src` | `'self' 'nonce-{NONCE}' 'strict-dynamic'` | Nonce-based script loading |
| `style-src` | `'self' 'nonce-{NONCE}'` | Nonce-based style loading |
| `img-src` | `'self' data: blob: https:` | Secure image sources |
| `connect-src` | `'self' https://*.supabase.co wss://*.supabase.co` | API connections |
| `frame-src` | `'self' https://*.google.com` | OAuth and iframe sources |
| `frame-ancestors` | `'none'` | Prevents clickjacking |
| `form-action` | `'self'` | Restrict form submissions |
| `base-uri` | `'self'` | Restrict base URL |
| `upgrade-insecure-requests` | - | Force HTTPS |
| `block-all-mixed-content` | - | Block mixed content |
| `report-uri` | `/api/csp-report` | CSP violation reporting |

### Nonce-Based Script Loading

AlgoBuddy uses **dynamic nonce** generation for scripts to prevent unauthorized code execution:

```javascript
// middleware.js
const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
const cspWithNonce = cspPolicy.replace(/\{NONCE\}/g, nonce);