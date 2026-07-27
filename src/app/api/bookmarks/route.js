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
      return jsonResponse({ error: "Authentication required" }, 401);
    }

    const body = await request.json().catch(() => ({}));
    const { problemId, topicSlug } = body;

    if (!problemId || !topicSlug) {
      return jsonResponse({ error: "problemId and topicSlug are required" }, 400);
    }

    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);

    const { error: insertError } = await supabase
      .from("problem_bookmarks")
      .insert({
        user_id: authResult.user.id,
        problem_id: problemId,
        topic_slug: topicSlug,
      });

    if (insertError) {
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
  if (!validateCsrfOrigin(request)) {
    return jsonResponse({ error: "CSRF validation failed: untrusted origin" }, 403);
  }
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse({ error: "Authentication required" }, 401);
    }

    const { searchParams } = new URL(request.url);
    const problemId = searchParams.get("problemId");
    const topicSlug = searchParams.get("topicSlug");

    if (!problemId || !topicSlug) {
      return jsonResponse({ error: "problemId and topicSlug query params are required" }, 400);
    }

    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);

    const { error: deleteError } = await supabase
      .from("problem_bookmarks")
      .delete()
      .eq("user_id", authResult.user.id)
      .eq("problem_id", problemId)
      .eq("topic_slug", topicSlug);

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
      return jsonResponse({ error: error.message }, 500);
    }

    return jsonResponse(bookmarks || []);
  } catch (error) {
    return errorResponse(error);
  }
}
