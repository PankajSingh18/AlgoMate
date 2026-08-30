import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import {
  validateCsrfOrigin,
  isStateChangingMethod,
  isApiRoute,
  CSRF_COOKIE_NAME,
  CSRF_HEADER_NAME,
} from "@/lib/csrf";
import { validateCsrfTokenEdge } from "@/lib/csrfToken";

const SUPABASE_ENV_ERROR =
  "Missing NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy .env.example to .env.local and add your Supabase project URL and anon key.";

const CSRF_EXEMPT_ROUTES = new Set(["/api/csrf-token"]);

function isValidHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function getSupabaseConfig() {
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || !isValidHttpUrl(supabaseUrl)) {
    return null;
  }

  if (supabaseUrl.startsWith("http://localhost:")) {
    supabaseUrl = supabaseUrl.replace("http://localhost:", "http://127.0.0.1:");
  }

  return { supabaseUrl, supabaseAnonKey };
}

const protectedRoutes = ["/arena", "/practice", "/profile"];

export async function proxy(request) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseConfig = getSupabaseConfig();
  if (!supabaseConfig) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(SUPABASE_ENV_ERROR);
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseConfig.supabaseUrl,
    supabaseConfig.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, {
              ...options,
              sameSite: "strict",
              secure: process.env.NODE_ENV === "production",
            }),
          );
        },
      },
    },
  );

  const { data: { user }, error } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (error || !user) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (
    isApiRoute(pathname) &&
    isStateChangingMethod(request.method) &&
    !CSRF_EXEMPT_ROUTES.has(pathname)
  ) {
    if (!validateCsrfOrigin(request)) {
      return NextResponse.json(
        { error: "CSRF validation failed: untrusted origin" },
        { status: 403 },
      );
    }

    const headerToken = request.headers.get(CSRF_HEADER_NAME);
    const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;

    if (!headerToken || !cookieToken) {
      return NextResponse.json(
        { error: "CSRF validation failed: token missing" },
        { status: 403 },
      );
    }

    if (!(await validateCsrfTokenEdge(cookieToken))) {
      return NextResponse.json(
        { error: "CSRF validation failed: invalid token signature" },
        { status: 403 },
      );
    }

    if (headerToken !== cookieToken) {
      return NextResponse.json(
        { error: "CSRF validation failed: token mismatch" },
        { status: 403 },
      );
    }
  }

  return supabaseResponse;
}


