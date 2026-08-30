import { cookies } from "next/headers";
import { generateCsrfToken } from "@/lib/csrfToken";
import { CSRF_COOKIE_NAME } from "@/lib/csrf";
import { jsonResponse } from "@/lib/serverApi";

export async function GET() {
  const token = await generateCsrfToken();
  const cookieStore = await cookies();
  cookieStore.set(CSRF_COOKIE_NAME, token, {
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 86400,
  });
  return jsonResponse({ csrfToken: token });
}
