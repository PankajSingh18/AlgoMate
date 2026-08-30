import { getSupabaseAnonClient, jsonResponse, errorResponse } from "@/lib/serverApi";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// GET /api/mysheet/shared/[userId] — public read, no auth required
export async function GET(request, { params }) {
  try {
    const { userId } = await params;
    if (!userId || !UUID_RE.test(userId)) {
      return jsonResponse({ error: "Valid userId is required" }, 400);
    }

    const supabase = getSupabaseAnonClient();
    const { data, error } = await supabase
      .from("my_sheet")
      .select("problem_id, added_at, note")
      .eq("user_id", userId)
      .eq("is_public", true);

    if (error) return jsonResponse({ error: error.message }, 500);

    const items = (data || []).map((row) => ({
      problemId: row.problem_id,
      addedAt: row.added_at,
      note: row.note || "",
    }));

    return jsonResponse({ items });
  } catch (error) {
    return errorResponse(error);
  }
}
