import { createServerClient } from "@supabase/ssr";

// For testing purposes, allow overriding the dependency functions
let cookiesImpl = null;
let createServerClientImpl = null;

export function setMockDependencies(cookies, createServerClient) {
  cookiesImpl = cookies;
  createServerClientImpl = createServerClient;
}

function isValidSupabaseUrl(value) {
  if (!value) return false;
  const trimmed = String(value).trim();
  if (trimmed.startsWith("Your ")) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidKey(value) {
  if (!value) return false;
  const trimmed = String(value).trim();
  return trimmed && !trimmed.startsWith("Your ");
}

export function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!isValidSupabaseUrl(supabaseUrl) || !isValidKey(supabaseAnonKey) || !isValidKey(supabaseServiceKey)) {
    return null;
  }

  let finalUrl = String(supabaseUrl).trim();
  if (finalUrl.startsWith("http://localhost:")) {
    finalUrl = finalUrl.replace("http://localhost:", "http://127.0.0.1:");
  }

  return {
    supabaseUrl: finalUrl,
    supabaseAnonKey: String(supabaseAnonKey).trim(),
    supabaseServiceKey: String(supabaseServiceKey).trim(),
  };
}

export async function getAuthenticatedUser() {
  const config = getSupabaseConfig();
  if (!config) {
    console.error("[Authentication Helper] Config error: Missing or invalid Supabase environment variables.");
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
              cookieStore.set(name, value, options);
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
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Auth check timed out")), 5000)
    );
    const { data, error } = await Promise.race([
      client.auth.getUser(),
      timeoutPromise,
    ]);

    if (error) {
      console.error("[Authentication Helper] Auth provider error during getUser:", error.message || error);
      return { success: false, type: "AUTH_PROVIDER_ERROR" };
    }

    if (!data || !data.user) {
      console.warn("[Authentication Helper] Unauthenticated request: No user session found.");
      return { success: false, type: "UNAUTHENTICATED" };
    }

    return { success: true, user: data.user };
  } catch (err) {
    // Swallow timeout and network errors — return UNAUTHENTICATED so the
    // caller gets a 401 quickly rather than a 500 after a long hang.
    if (err.message === "Auth check timed out" || err?.cause?.code === "UND_ERR_CONNECT_TIMEOUT") {
      console.warn("[Authentication Helper] Auth check timed out — treating as unauthenticated.");
      return { success: false, type: "UNAUTHENTICATED" };
    }
    console.error("[Authentication Helper] Critical exception during authentication verification:", err.message || err);
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
    console.error("[verifySupabaseToken] Config error: Missing Supabase environment variables.");
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
      console.warn("[verifySupabaseToken] Token verification failed:", error?.message || "No user returned");
      return null;
    }

    return data.user;
  } catch (err) {
    console.error("[verifySupabaseToken] Error:", err.message || err);
    return null;
  }
}
