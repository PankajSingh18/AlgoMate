import { cookies } from "next/headers";
import { getAuthenticatedUser } from "@/lib/auth";
import { getSupabaseServerClient, jsonResponse, errorResponse } from "@/lib/serverApi";

export async function GET(request) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse({ error: "Authentication required" }, 401);
    }

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;

    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);

    let query = supabase
      .from("notifications")
      .select("*, job:job_id(title, company)", { count: "exact" })
      .eq("student_id", authResult.user.id)
      .order("created_at", { ascending: false })
      .range(skip, skip + limit - 1);

    if (unreadOnly) {
      query = query.eq("read", false);
    }

    const { data: notifications, error, count } = await query;

    if (error) {
      // Supabase error is harmless here (table doesn't exist yet)
      // console.error("[/api/notifications GET] Supabase error:", error.message);
      return jsonResponse({ notifications: [], totalPages: 0, currentPage: page, totalUnread: 0 });
    }

    let totalUnread = 0;
    if (!unreadOnly) {
      const { count: unreadCount } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("student_id", authResult.user.id)
        .eq("read", false);
      totalUnread = unreadCount || 0;
    }

    return jsonResponse({
      notifications: notifications || [],
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page,
      totalUnread,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse({ error: "Authentication required" }, 401);
    }

    const body = await request.json().catch(() => ({}));
    const { notificationIds, markAll } = body;

    // Require an explicit action — either a non-empty array of IDs to mark
    // as read, or markAll: true to mark every notification for the user.
    // Reject empty / missing payloads so a malformed request or missing body
    // never silently triggers a bulk update.
    const hasIds = Array.isArray(notificationIds) && notificationIds.length > 0;
    const hasMarkAll = markAll === true;

    if (!hasIds && !hasMarkAll) {
      return jsonResponse(
        {
          error:
            "Provide a non-empty 'notificationIds' array, or set 'markAll: true' to mark all notifications read.",
        },
        400
      );
    }

    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);

    let query = supabase
      .from("notifications")
      .update({ read: true })
      .eq("student_id", authResult.user.id);

    if (hasIds) {
      // Strip any non-string or blank entries before passing to the query.
      const validIds = notificationIds.filter(
        (id) => typeof id === "string" && id.trim().length > 0
      );
      if (validIds.length === 0) {
        return jsonResponse(
          { error: "notificationIds contains no valid entries." },
          400
        );
      }
      query = query.in("id", validIds);
    }
    // else: hasMarkAll === true — no additional filter, updates all rows for
    // the authenticated user. The .eq("student_id", ...) above ensures the
    // operation is always scoped to the requesting user.

    const { error, count } = await query;

    if (error) {
      console.error("[/api/notifications PATCH] Supabase error:", error.message);
      return jsonResponse({ error: error.message }, 500);
    }

    return jsonResponse({ success: true, updated: count ?? 0 });
  } catch (error) {
    return errorResponse(error);
  }
}
