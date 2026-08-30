import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { ApiError, AuthError, ConfigError } from "@/lib/apiErrors";

let supabaseAdminInstance;

export function getSupabaseAdmin() {
  if (supabaseAdminInstance) return supabaseAdminInstance;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) throw new ConfigError('Supabase not configured');
  supabaseAdminInstance = createClient(url, key);
  return supabaseAdminInstance;
}

/**
 * Creates a Supabase server client using the anon key, which respects
 * Row-Level Security policies defined in the database. Use this for all
 * user-data API routes instead of getSupabaseAdmin().
 * Requires a cookie store (from next/headers cookies()) for SSR auth.
 */
export function getSupabaseServerClient(cookieStore) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new ConfigError('Supabase not configured');
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          try {
            cookieStore.set(name, value, {
              ...options,
              sameSite: 'strict',
              secure: process.env.NODE_ENV === 'production',
            });
          } catch {
            // Can happen during GET requests or rendering in Next.js
          }
        });
      },
    },
  });
}

/**
 * Creates a Supabase server client using the anon key from request cookies.
 * Alternative for route handlers that don't have access to next/headers cookies().
 */
export function getSupabaseRequestClient(request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new ConfigError('Supabase not configured');
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
        });
      },
    },
  });
}

/** Anonymous Supabase client for public reads (no session cookies). */
export function getSupabaseAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new ConfigError('Supabase not configured');
  return createClient(url, anonKey);
}

export function jsonResponse(data, status = 200, extraHeaders = {}) {
  return Response.json(data, {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}

export function errorResponse(error) {
  const code = error.code || 'INTERNAL_ERROR';
  const status = error.status || 500;
  const message = error.message || 'Internal server error';
  return Response.json(
    { error: message, code },
    { status, headers: { 'Content-Type': 'application/json' } },
  );
}
