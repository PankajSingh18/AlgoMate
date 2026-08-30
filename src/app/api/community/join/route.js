import { cookies } from "next/headers";
import { getAuthenticatedUser } from "@/lib/auth";
import { getSupabaseServerClient, jsonResponse, errorResponse } from "@/lib/serverApi";
import { validateCsrfOrigin } from "@/lib/csrfConstants";

export async function POST(request) {
  if (!validateCsrfOrigin(request)) {
    return jsonResponse({ error: "CSRF validation failed: untrusted origin" }, 403);
  }
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse({ error: "Authentication required" }, authResult.type === "CONFIG_ERROR" ? 500 : 401);
    }
    const body = await request.json().catch(() => ({}));
    const { joined } = body;
    if (typeof joined !== "boolean") {
      return jsonResponse({ error: "joined must be a boolean" }, 400);
    }

    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);
    const { error } = await supabase
      .from("user_profiles")
      .upsert({ id: authResult.user.id, joined_community: joined }, { onConflict: "id" });
    if (error) return jsonResponse({ error: error.message }, 500);
    return jsonResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function GET(request) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse({ error: "Authentication required" }, authResult.type === "CONFIG_ERROR" ? 500 : 401);
    }
    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);
    const { data, error } = await supabase
      .from("user_profiles")
      .select("joined_community")
      .eq("id", authResult.user.id)
      .single();
    if (error && error.code !== "PGRST116") return jsonResponse({ error: error.message }, 500);
    return jsonResponse({ joined_community: data?.joined_community ?? false });
  } catch (error) {
    return errorResponse(error);
  }
}
