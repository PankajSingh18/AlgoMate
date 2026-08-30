import { cookies } from "next/headers";
import { getAuthenticatedUser } from "@/lib/auth";
import { getSupabaseServerClient, jsonResponse, errorResponse } from "@/lib/serverApi";

// POST /api/mysheet/share — mark all of the user's sheet items as public
export async function POST() {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse(
        { error: "Authentication required" },
        authResult.type === "CONFIG_ERROR" ? 500 : 401
      );
    }

    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);

    const { data, error } = await supabase
      .from("my_sheet")
      .update({ is_public: true })
      .eq("user_id", authResult.user.id)
      .select("problem_id");

    if (error) return jsonResponse({ error: error.message }, 500);

    const publishedCount = data?.length ?? 0;
    if (publishedCount === 0) {
      return jsonResponse({ error: "No items in sheet to share" }, 400);
    }

    return jsonResponse({ success: true, publishedCount });
  } catch (error) {
    return errorResponse(error);
  }
}
