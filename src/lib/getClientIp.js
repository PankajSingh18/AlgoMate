/**
 * Client identity resolution for rate limiting.
 *
 * getClientIp() keeps the original contract: only x-real-ip (set by edge
 * infrastructure such as Vercel) is trusted unconditionally, and the
 * fallback is the "unknown" string. x-forwarded-for is client-controlled
 * and is only parsed when the operator has declared a trusted proxy
 * (TRUSTED_PROXY_IPS) or the deployment is on Vercel.
 *
 * The anti-collapse guarantee lives in resolveClientId(): it never lets an
 * unidentifiable request share a bucket. When getClientIp() yields
 * "unknown", it builds a per-request fingerprint instead — so anonymous
 * traffic never collapses into a single ip:unknown key (the global-DoS
 * issue this fixes).
 */

const TRUSTED_PROXY_IPS = new Set(
  (process.env.TRUSTED_PROXY_IPS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
);

const IS_VERCEL = process.env.VERCEL === "1";

let warnedUnconfigured = false;

function warnIfNoTrustedIpSource() {
  if (
    process.env.NODE_ENV === "production" &&
    !IS_VERCEL &&
    TRUSTED_PROXY_IPS.size === 0 &&
    !warnedUnconfigured
  ) {
    warnedUnconfigured = true;
    console.warn(
      "[getClientIp] Production deployment is not on Vercel and TRUSTED_PROXY_IPS is unset. " +
        "No trustworthy client-IP source is configured, so anonymous rate-limit keys will use a " +
        "per-request fingerprint instead of the real client IP. Set TRUSTED_PROXY_IPS to the IPs " +
        "of the proxies in front of this deployment (e.g. Render, Cloudflare) to enable IP-based limiting.",
    );
  }
}

// Warn at startup so an unconfigured deployment is loud, not silent.
warnIfNoTrustedIpSource();

function leftmostForwardedIp(headers) {
  const xff = headers.get("x-forwarded-for");
  if (!xff) return null;
  const first = xff.split(",")[0].trim();
  if (!first || first.toLowerCase() === "unknown") return null;
  return first;
}

function realIp(headers) {
  const value = headers.get("x-real-ip");
  return value && value.trim() ? value.trim() : null;
}

/**
 * Returns the verified client IP from an incoming request's headers.
 *
 * Only x-real-ip is trusted unconditionally — it is set by the edge
 * infrastructure (e.g. Vercel) and cannot be spoofed by the client.
 * x-forwarded-for is client-controlled and is only parsed when the
 * operator has declared a trusted proxy (TRUSTED_PROXY_IPS) or the
 * deployment is on Vercel.
 *
 * This function alone is NOT safe for rate-limit keys: its "unknown"
 * fallback is a shared constant. Use resolveClientId() for limiting, which
 * converts "unknown" into a per-request fingerprint instead of collapsing
 * every anonymous visitor into one bucket.
 *
 * @param {Headers} headers  The request headers object.
 * @returns {string}  Verified IP address, or "unknown" if none can be determined.
 */
export function getClientIp(headers) {
  const real = realIp(headers);
  if (real) return real;

  if (IS_VERCEL || TRUSTED_PROXY_IPS.size > 0) {
    const forwarded = leftmostForwardedIp(headers);
    if (forwarded) return forwarded;
  }

  warnIfNoTrustedIpSource();
  return "unknown";
}

// FNV-1a 32-bit — synchronous and environment-agnostic (works in Node and
// Edge runtimes without importing node:crypto).
function fnv1a(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

/**
 * Returns a stable per-client identifier for rate limiting: the trusted
 * client IP when one can be determined, otherwise a fingerprint of the
 * request headers (x-forwarded-for, user-agent, accept-language,
 * cf-connecting-ip). The result is never the shared "unknown" constant,
 * so anonymous traffic never collapses into a single bucket.
 *
 * @param {Headers} headers  The request headers object.
 * @returns {string}  "1.2.3.4" or "fp:<8-hex-char-fingerprint>".
 */
export function resolveClientId(headers) {
  const ip = getClientIp(headers);
  if (ip && ip !== "unknown") return ip;

  const parts = [
    headers.get("x-forwarded-for") || "",
    headers.get("user-agent") || "",
    headers.get("accept-language") || "",
    headers.get("cf-connecting-ip") || "",
  ];
  return `fp:${fnv1a(parts.join("|"))}`;
}
