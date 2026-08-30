import { cookies } from "next/headers";
import { getAuthenticatedUser } from "@/lib/auth";
import { getSupabaseServerClient, jsonResponse, errorResponse } from "@/lib/serverApi";

export async function POST(request) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse({ error: "Authentication required" }, 401);
    }

    const body = await request.json().catch(() => ({}));
    const { jobId } = body;

    if (!jobId) {
      return jsonResponse({ error: "jobId is required" }, 400);
    }

    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);

    const { data: existing } = await supabase
      .from("bookmarks")
      .select("id")
      .eq("student_id", authResult.user.id)
      .eq("job_id", jobId)
      .maybeSingle();

    if (existing) {
      const { error: deleteError } = await supabase
        .from("bookmarks")
        .delete()
        .eq("id", existing.id);

      if (deleteError) {
        console.error("[/api/bookmarks POST] Supabase delete error:", deleteError.message);
        return jsonResponse({ error: deleteError.message }, 500);
      }

      return jsonResponse({ bookmarked: false });
    }

    const { error: insertError } = await supabase
      .from("bookmarks")
      .insert({ student_id: authResult.user.id, job_id: jobId });

    if (insertError) {
      console.error("[/api/bookmarks POST] Supabase insert error:", insertError.message);
      return jsonResponse({ error: insertError.message }, 500);
    }

    return jsonResponse({ bookmarked: true });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function GET(request) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse({ error: "Authentication required" }, 401);
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;

    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);

    const { data: jobs, error, count } = await supabase
      .from("bookmarks")
      .select("id, created_at, job:job_id(*)", { count: "exact" })
      .eq("student_id", authResult.user.id)
      .order("created_at", { ascending: false })
      .range(skip, skip + limit - 1);

    if (error) {
      console.error("[/api/bookmarks GET] Supabase error:", error.message);
      return jsonResponse({ jobs: [], bookmarkedIds: [], totalPages: 0, currentPage: page });
    }

    const bookmarkedIds = (jobs || []).map((b) => b.job?.id).filter(Boolean);

    return jsonResponse({
      jobs: (jobs || []).map((b) => b.job).filter(Boolean),
      bookmarkedIds,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
