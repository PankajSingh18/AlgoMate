export const CSRF_COOKIE_NAME = "csrf-token";
export const CSRF_HEADER_NAME = "x-csrf-token";

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
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const source = origin || referer || "";
  const normalized = source.replace(/\/+$/, "");
  return TRUSTED_ORIGINS.has(normalized);
}

const STATE_CHANGING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function isStateChangingMethod(method) {
  return STATE_CHANGING_METHODS.has(method);
}

export function isApiRoute(pathname) {
  return pathname.startsWith("/api/");
}
