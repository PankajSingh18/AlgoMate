export const CSRF_COOKIE_NAME = "csrf-token";
export const CSRF_HEADER_NAME = "x-csrf-token";

// Production CSRF origins are pinned to exact origins only. The old
// `*.algobuddy.vercel.app` wildcard is deliberately NOT trusted here:
// vercel.app is a public suffix, so every PR-preview subdomain shares the
// same registrable domain with the production app and can receive same-site
// cookies — an attacker-controlled preview page could then forge
// state-changing requests against a logged-in victim's session.
const TRUSTED_ORIGINS = (() => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  const origins = new Set([
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://algobuddy.me",
    "https://www.algobuddy.me",
    "https://algobuddy.vercel.app",
  ]);

  if (appUrl) origins.add(appUrl.replace(/\/+$/, ""));

  return origins;
})();

export function validateCsrfOrigin(request) {
  // Require an explicit Origin header. The referer fallback is intentionally
  // removed because referers are absent or stripped in privacy modes and can
  // be influenced cross-origin; Origin is the only header browsers guarantee
  // on cross-origin state-changing requests.
  const origin = request.headers.get("origin");
  if (!origin) return false;

  const normalized = origin.replace(/\/+$/, "");
  return TRUSTED_ORIGINS.has(normalized);
}

const STATE_CHANGING_METHODS = new Set([
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
]);

export function isStateChangingMethod(method) {
  return STATE_CHANGING_METHODS.has(method);
}

export function isApiRoute(pathname) {
  return pathname.startsWith("/api/");
}