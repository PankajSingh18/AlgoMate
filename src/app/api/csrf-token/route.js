import { cookies } from "next/headers";
import { generateCsrfToken, getSessionBindingFromCookies } from "@/lib/csrfToken";
import { CSRF_COOKIE_NAME } from "@/lib/csrfConstants";
import { jsonResponse } from "@/lib/serverApi";

export async function GET() {
  const cookieStore = await cookies();
  // Bind the token to the caller's session so a token minted under one
  // session can never be replayed against another.
  const binding = await getSessionBindingFromCookies(cookieStore.getAll());
  const token = await generateCsrfToken(binding);
  cookieStore.set(CSRF_COOKIE_NAME, token, {
    // HttpOnly: the value is only exposed to the page through the same-origin
    // response body below, so cross-origin JS can't read the cookie directly.
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 86400,
  });
  return jsonResponse({ csrfToken: token });
}
