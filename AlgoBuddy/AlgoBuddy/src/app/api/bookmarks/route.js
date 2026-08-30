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
    const { problemId, topicSlug } = body;

    if (!problemId || !topicSlug) {
      return jsonResponse({ error: "problemId and topicSlug are required" }, 400);
    }

    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);

    // problem_bookmarks table schema:
    // user_id, problem_id, topic_slug, created_at
    const { error: insertError } = await supabase
      .from("problem_bookmarks")
      .insert({
        user_id: authResult.user.id,
        problem_id: problemId,
        topic_slug: topicSlug,
      });

    if (insertError) {
      // Ignore unique constraint violations (23505) if the user already bookmarked it
      if (insertError.code !== '23505') {
        console.error("[/api/bookmarks POST] Supabase insert error:", insertError.message);
        return jsonResponse({ error: insertError.message }, 500);
      }
    }

    return jsonResponse({ bookmarked: true });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse({ error: "Authentication required" }, 401);
    }

    const { searchParams } = new URL(request.url);
    const problemId = searchParams.get("problemId");

    if (!problemId) {
      return jsonResponse({ error: "problemId query parameter is required" }, 400);
    }

    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);

    const { error: deleteError } = await supabase
      .from("problem_bookmarks")
      .delete()
      .eq("user_id", authResult.user.id)
      .eq("problem_id", problemId);

    if (deleteError) {
      console.error("[/api/bookmarks DELETE] Supabase delete error:", deleteError.message);
      return jsonResponse({ error: deleteError.message }, 500);
    }

    return jsonResponse({ bookmarked: false });
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

    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);

    const { data: bookmarks, error } = await supabase
      .from("problem_bookmarks")
      .select("problem_id, topic_slug, created_at")
      .eq("user_id", authResult.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[/api/bookmarks GET] Supabase error:", error.message);
      return jsonResponse([]);
    }

    // Return the array directly, which matches what useProblemBookmarks expects
    return jsonResponse(bookmarks || []);
  } catch (error) {
    return errorResponse(error);
  }
}
