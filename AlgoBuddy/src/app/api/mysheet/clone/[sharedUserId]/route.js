import { getAuthenticatedUser } from "@/lib/auth";
import { getSupabaseAnonClient, getSupabaseRequestClient, jsonResponse, errorResponse } from "@/lib/serverApi";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request, { params }) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse(
        { error: "Authentication required" },
        authResult.type === "CONFIG_ERROR" ? 500 : 401
      );
    }

    const { sharedUserId } = await params;
    if (!sharedUserId || !UUID_RE.test(sharedUserId)) {
      return jsonResponse({ error: "Valid sharedUserId is required" }, 400);
    }

    const anon = getSupabaseAnonClient();

    // Fetch shared user's public sheet items (no auth needed — RLS allows public reads)
    const { data: sharedData, error: fetchError } = await anon
      .from("my_sheet")
      .select("problem_id, note")
      .eq("user_id", sharedUserId)
      .eq("is_public", true);

    if (fetchError) return jsonResponse({ error: fetchError.message }, 500);
    if (!sharedData || sharedData.length === 0) {
      return jsonResponse({ error: "No public items to clone" }, 404);
    }

    const supabase = getSupabaseRequestClient(request);

    // Fetch authenticated user's existing sheet items to avoid duplicates
    const { data: userData, error: userFetchError } = await supabase
      .from("my_sheet")
      .select("problem_id")
      .eq("user_id", authResult.user.id);

    if (userFetchError) return jsonResponse({ error: userFetchError.message }, 500);
    
    const existingProblems = new Set((userData || []).map(row => row.problem_id));
    
    // 3. Insert new items
    const toInsert = sharedData
      .filter(item => !existingProblems.has(item.problem_id))
      .map(item => ({
        user_id: authResult.user.id,
        problem_id: item.problem_id,
        note: item.note || "",
        added_at: new Date().toISOString()
      }));

    if (toInsert.length > 0) {
      const { error: insertError } = await supabase
        .from("my_sheet")
        .insert(toInsert);

      if (insertError) return jsonResponse({ error: insertError.message }, 500);
    }

    return jsonResponse({ success: true, clonedCount: toInsert.length });
  } catch (error) {
    return errorResponse(error);
  }
}
