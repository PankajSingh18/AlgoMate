import { getSupabaseAdmin, jsonResponse, errorResponse } from "@/lib/serverApi";
import { validateCsrfOrigin } from "@/lib/csrfConstants";

export async function POST(req) {
  if (!validateCsrfOrigin(req)) {
    return jsonResponse({ error: "CSRF validation failed: untrusted origin" }, 403);
  }
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON request body" }, 400);
    }

    const { email } = body || {};

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ error: "Invalid email address" }, 400);
    }

    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from('newsletter_subscriptions')
      .insert([{ email }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Postgres unique violation error code
        return jsonResponse({ message: "You are already subscribed!" }, 200);
      }
      console.error("Newsletter subscription error:", error);
      return errorResponse({ status: 500, message: "Failed to subscribe. Please try again later." });
    }

    return jsonResponse({ message: "Successfully subscribed!" }, 201);
  } catch (error) {
    console.error("Newsletter API error:", error);
    return errorResponse({ status: 500, message: "Internal server error" });
  }
}
