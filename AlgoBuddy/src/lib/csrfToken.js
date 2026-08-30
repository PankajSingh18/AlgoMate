const CSRF_TOKEN_LENGTH = 32;
const CSRF_SECRET_ENV = "CSRF_SECRET";

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
    const cryptoModule = require("crypto");
    devSecret = cryptoModule.randomBytes(32).toString("hex");
    console.warn(
      "CSRF_SECRET not set. Using a fallback development secret. " +
      "Set CSRF_SECRET in .env.local for persistence and security in production.",
    );
  }
  return devSecret;
}

export function generateCsrfToken() {
  const cryptoModule = require("crypto");
  const secret = getSecret();
  const randomValue = cryptoModule.randomBytes(CSRF_TOKEN_LENGTH).toString("hex");
  const hmac = cryptoModule.createHmac("sha256", secret);
  hmac.update(randomValue);
  const signature = hmac.digest("hex");
  return `${randomValue}.${signature}`;
}

export function validateCsrfToken(token) {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [randomValue, signature] = parts;
  const secret = getSecret();
  const cryptoModule = require("crypto");
  const hmac = cryptoModule.createHmac("sha256", secret);
  hmac.update(randomValue);
  const expected = hmac.digest("hex");
  if (signature.length !== expected.length) return false;
  try {
    return cryptoModule.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function validateCsrfTokenEdge(token) {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [randomValue, signature] = parts;
  const secret = getSecret();
  const encoder = new TextEncoder();
  const key = await globalThis.crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sigBytes = await globalThis.crypto.subtle.sign("HMAC", key, encoder.encode(randomValue));
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

