import { createServerClient } from "@supabase/ssr";
import { getSupabaseConfig as _getSupabaseConfig } from "./shared-utils.js";
import { createLogger } from "./logger.js";

const log = createLogger("auth");

// For testing purposes, allow overriding the dependency functions
let cookiesImpl = null;
let createServerClientImpl = null;

export function setMockDependencies(cookies, createServerClient) {
  cookiesImpl = cookies;
  createServerClientImpl = createServerClient;
}

export function getSupabaseConfig() {
  const config = _getSupabaseConfig();
  if (!config) return null;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey || String(serviceKey).trim().startsWith("Your ")) return null;
  config.supabaseServiceKey = String(serviceKey).trim();
  return config;
}

export async function getAuthenticatedUser() {  
  const config = getSupabaseConfig();
  if (!config) {
    log.error("Config error: Missing or invalid Supabase environment variables.");
    return { success: false, type: "CONFIG_ERROR" };
  }

  try {
    let cookieStore;
    if (cookiesImpl) {
      cookieStore = await cookiesImpl();
    } else {
      const nextHeaders = await import("next/headers");
      cookieStore = await nextHeaders.cookies();
    }

    const clientCreator = createServerClientImpl || createServerClient;
    const client = clientCreator(config.supabaseUrl, config.supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, {
                ...options,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
              });
            });
          } catch (e) {
            // Can happen during GET requests or rendering in Next.js, which is expected/normal.
          }
        },
      },
    });

    // Race getUser() against a 5-second timeout so that network issues
    // (ConnectTimeoutError to Supabase) fail fast instead of blocking
    // every API route for the full 10-second fetch timeout.
    let timeoutId;
    // Resolve with a sentinel instead of rejecting+silencing:
    // .catch(()=>{}) previously caused race() to return undefined,
    // making the destructure below throw TypeError → mis-classified as AUTH_PROVIDER_ERROR.
    const timeoutPromise = new Promise((resolve) => {
      timeoutId = setTimeout(
        () => resolve({ data: null, error: null, __timedOut: true }),
        5000
      );
    });

    let raceResult;
    try {
      raceResult = await Promise.race([
        client.auth.getUser(),
        timeoutPromise,
      ]);
    } finally {
      clearTimeout(timeoutId);
    }

    if (raceResult?.__timedOut) {
      log.warn("Auth check timed out — treating as unauthenticated.");
      return { success: false, type: "UNAUTHENTICATED" };
    }

    const { data, error } = raceResult;

    if (error) {
      log.error({ err: error }, "Auth provider error during getUser.");
      return { success: false, type: "AUTH_PROVIDER_ERROR" };
    }

    if (!data || !data.user) {
      log.warn("Unauthenticated request: No user session found.");
      return { success: false, type: "UNAUTHENTICATED" };
    }

    return { success: true, user: data.user };
  } catch (err) {
    // Network-level errors (e.g. UND_ERR_CONNECT_TIMEOUT) still reach here.
    // The explicit timeout case is now handled above via the __timedOut sentinel.
    if (err?.cause?.code === "UND_ERR_CONNECT_TIMEOUT") {
      log.warn("Network timeout — treating as unauthenticated.");
      return { success: false, type: "UNAUTHENTICATED" };
    }
    log.error({ err }, "Critical exception during authentication verification.");
    return { success: false, type: "AUTH_PROVIDER_ERROR" };
  }
}

/**
 * Verifies a Supabase JWT access token directly using the Supabase admin client.
 * Used by the WebSocket arena server and other non-HTTP contexts where
 * cookie-based session verification is not available.
 *
 * @param {string} token - The Supabase access_token JWT
 * @returns {Promise<object|null>} The verified user object, or null if invalid/expired
 */
export async function verifySupabaseToken(token) {
  if (!token) return null;

  const config = getSupabaseConfig();
  if (!config) {
    log.error("Config error: Missing Supabase environment variables.");
    return null;
  }

  try {
    // Use the service role client for admin-level token verification
    const { createClient } = await import("@supabase/supabase-js");
    const adminClient = createClient(config.supabaseUrl, config.supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data, error } = await adminClient.auth.getUser(token);
    if (error || !data?.user) {
      log.warn({ reason: error?.message ?? "No user returned" }, "Token verification failed.");
      return null;
    }

    return data.user;
  } catch (err) {
    log.error({ err }, "Error in verifySupabaseToken.");
    return null;
  }
}
