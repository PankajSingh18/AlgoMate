import { cookies } from "next/headers";
import { getAuthenticatedUser } from "@/lib/auth";
import { getSupabaseServerClient, jsonResponse, errorResponse } from "@/lib/serverApi";

// GET /api/mysheet — returns the user's curated sheet as a map
export async function GET(request) {
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
      .select("problem_id, added_at, note")
      .eq("user_id", authResult.user.id);

    if (error) return jsonResponse({ error: error.message }, 500);

    const sheet = {};
    (data || []).forEach((row) => {
      sheet[row.problem_id] = {
        addedAt: row.added_at,
        note: row.note || "",
      };
    });

    return jsonResponse({ sheet });
  } catch (error) {
    return errorResponse(error);
  }
}

// POST /api/mysheet — add a problem to the user's sheet
export async function POST(request) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse(
        { error: "Authentication required" },
        authResult.type === "CONFIG_ERROR" ? 500 : 401
      );
    }

    const body = await request.json().catch(() => ({}));
    const { problemId, note = "", isPublic } = body;
    if (!problemId) return jsonResponse({ error: "problemId is required" }, 400);

    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);

    const row = {
      user_id: authResult.user.id,
      problem_id: problemId,
      note,
      added_at: new Date().toISOString(),
    };
    if (typeof isPublic === "boolean") {
      row.is_public = isPublic;
    }

    const { error } = await supabase.from("my_sheet").upsert(row, {
      onConflict: ["user_id", "problem_id"],
    });

    if (error) return jsonResponse({ error: error.message }, 500);
    return jsonResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}

// DELETE /api/mysheet?problemId=xxx — remove a problem from the user's sheet
export async function DELETE(request) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse(
        { error: "Authentication required" },
        authResult.type === "CONFIG_ERROR" ? 500 : 401
      );
    }

    const { searchParams } = new URL(request.url);
    const problemId = searchParams.get("problemId");
    if (!problemId) return jsonResponse({ error: "problemId is required" }, 400);

    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);
    const { error } = await supabase
      .from("my_sheet")
      .delete()
      .eq("user_id", authResult.user.id)
      .eq("problem_id", problemId);

    if (error) return jsonResponse({ error: error.message }, 500);
    return jsonResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
