import { createLogger } from "./logger.js";

const log = createLogger("csrf");

const CSRF_TOKEN_LENGTH = 32;
const CSRF_SECRET_ENV = "CSRF_SECRET";
const CSRF_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const ANONYMOUS_BINDING = "anonymous";
const SESSION_COOKIE_PATTERN = /^sb-.+-auth-token$/;

let devSecret = null;

function getSecret() {
  const secret = process.env[CSRF_SECRET_ENV];
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "CSRF_SECRET must be set in production for CSRF token signing.",
    );
  }
  if (!devSecret) {
    const array = new Uint8Array(32);
    globalThis.crypto.getRandomValues(array);
    devSecret = Array.from(array)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    log.warn("CSRF_SECRET not set. Using a fallback development secret. Set CSRF_SECRET in .env.local for persistence and security in production.");
  }
  return devSecret;
}

/**
 * Derives a stable per-session binding from the Supabase session cookie
 * (sb-<project-ref>-auth-token). The raw cookie value is hashed so tokens
 * are cryptographically bound to the session that minted them; a token
 * obtained under one session can never validate against another.
 * Accepts either a Next.js cookie store (getAll()) or an array of
 * { name, value } cookies.
 */
export async function getSessionBindingFromCookies(cookiesList) {
  const cookies =
    typeof cookiesList?.getAll === "function"
      ? cookiesList.getAll()
      : Array.isArray(cookiesList)
        ? cookiesList
        : [];

  const sessionCookie = cookies.find(
    (c) =>
      c &&
      typeof c.name === "string" &&
      SESSION_COOKIE_PATTERN.test(c.name) &&
      typeof c.value === "string" &&
      c.value.length > 0
  );

  if (!sessionCookie) return ANONYMOUS_BINDING;

  const encoder = new TextEncoder();
  const digest = await globalThis.crypto.subtle.digest(
    "SHA-256",
    encoder.encode(sessionCookie.value)
  );
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function generateCsrfToken(binding = ANONYMOUS_BINDING) {
  const secret = getSecret();
  const array = new Uint8Array(CSRF_TOKEN_LENGTH);
  globalThis.crypto.getRandomValues(array);
  const randomValue = Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const timestamp = Date.now().toString(36);
  const encoder = new TextEncoder();
  const key = await globalThis.crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sigBytes = await globalThis.crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`${binding}:${randomValue}:${timestamp}`),
  );
  const signature = Array.from(new Uint8Array(sigBytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${randomValue}.${timestamp}.${signature}`;
}

export async function validateCsrfTokenEdge(token, binding = ANONYMOUS_BINDING) {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [randomValue, timestamp, signature] = parts;

  const tokenAge = Date.now() - parseInt(timestamp, 36);
  if (tokenAge > CSRF_TOKEN_TTL_MS || tokenAge < 0) return false;

  const secret = getSecret();
  const encoder = new TextEncoder();
  const key = await globalThis.crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sigBytes = await globalThis.crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`${binding}:${randomValue}:${timestamp}`),
  );
  const expected = Array.from(new Uint8Array(sigBytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  if (signature.length !== expected.length) return false;
  try {
    const sigBuf = new Uint8Array(
      signature.match(/.{1,2}/g).map((b) => parseInt(b, 16)),
    );
    const expBuf = new Uint8Array(
      expected.match(/.{1,2}/g).map((b) => parseInt(b, 16)),
    );
    if (sigBuf.length !== expBuf.length) return false;
    const result = sigBuf.reduce((acc, byte, i) => acc | (byte ^ expBuf[i]), 0);
    return result === 0;
  } catch {
    return false;
  }
}

