import { cookies } from "next/headers";
import { getAuthenticatedUser } from "@/lib/auth";
import { getSupabaseServerClient, jsonResponse, errorResponse } from "@/lib/serverApi";

// GET /api/progress
// Returns all problem progress for the authenticated user as a flat array,
// along with currentStreak and longestStreak from user_practice_stats so that
// the client always has an authoritative server-side streak value and does not
// have to fall back to the per-device localStorage counter.
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

    // Fetch progress rows and streak stats in parallel.
    const [progressResult, statsResult] = await Promise.all([
      supabase
        .from("user_progress")
        .select("problem_id, status, updated_at")
        .eq("user_id", authResult.user.id),
      supabase
        .from("user_practice_stats")
        .select("current_streak, longest_streak")
        .eq("user_id", authResult.user.id)
        .maybeSingle(),
    ]);

    if (progressResult.error) return jsonResponse({ error: progressResult.error.message }, 500);

    // Return as map: { [problemId]: { status, updatedAt } }
    const progressMap = {};
    (progressResult.data || []).forEach((row) => {
      if (row.problem_id) {
        progressMap[row.problem_id] = {
          status: row.status,
          updatedAt: row.updated_at,
        };
      }
    });

    const stats = statsResult.data;
    return jsonResponse({
      progress: progressMap,
      currentStreak: stats?.current_streak ?? 0,
      longestStreak: stats?.longest_streak ?? 0,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

// POST /api/progress
// Upserts a single problem's progress status
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
    const { problemId, status } = body;

    if (!problemId || !status) {
      return jsonResponse({ error: "problemId and status are required" }, 400);
    }

    const validStatuses = ["Not Started", "In Progress", "Completed"];
    if (!validStatuses.includes(status)) {
      return jsonResponse({ error: `status must be one of: ${validStatuses.join(", ")}` }, 400);
    }

    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);
    const { error } = await supabase.from("user_progress").upsert(
      {
        user_id: authResult.user.id,
        problem_id: problemId,
        status: status,
        updated_at: new Date().toISOString(),
      },
      { onConflict: ["user_id", "problem_id"] }
    );

    if (error) return jsonResponse({ error: error.message }, 500);
    return jsonResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
