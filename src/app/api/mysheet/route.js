import { cookies } from "next/headers";
import { getAuthenticatedUser } from "@/lib/auth";
import { getSupabaseServerClient, jsonResponse, errorResponse } from "@/lib/serverApi";
import { validateCsrfOrigin } from "@/lib/csrfConstants";

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}

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
        note: row.note ? escapeHtml(row.note) : "",
      };
    });

    return jsonResponse({ sheet });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request) {
  if (!validateCsrfOrigin(request)) {
    return jsonResponse({ error: "CSRF validation failed: untrusted origin" }, 403);
  }
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse(
        { error: "Authentication required" },
        authResult.type === "CONFIG_ERROR" ? 500 : 401
      );
    }

    const body = await request.json().catch(() => ({}));
    const { problemId, note = "", isPublic, sharedNotes } = body;
    if (!problemId) return jsonResponse({ error: "problemId is required" }, 400);

    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);

    const { data: existing, error: existingError } = await supabase
      .from("my_sheet")
      .select("added_at")
      .eq("user_id", authResult.user.id)
      .eq("problem_id", problemId)
      .maybeSingle();

    if (existingError) return jsonResponse({ error: existingError.message }, 500);

    const row = {
      user_id: authResult.user.id,
      problem_id: problemId,
      note: escapeHtml(note),
      added_at: existing?.added_at ?? new Date().toISOString(),
    };
    if (typeof isPublic === "boolean") {
      row.is_public = isPublic;
    }
    if (typeof sharedNotes === "boolean") {
      row.shared_notes = sharedNotes;
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

export async function PATCH(request) {
  if (!validateCsrfOrigin(request)) {
    return jsonResponse({ error: "CSRF validation failed: untrusted origin" }, 403);
  }
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse(
        { error: "Authentication required" },
        authResult.type === "CONFIG_ERROR" ? 500 : 401
      );
    }

    const body = await request.json().catch(() => ({}));
    const { problemId, isPublic, sharedNotes } = body;
    if (!problemId) return jsonResponse({ error: "problemId is required" }, 400);

    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);

    const update = {};
    if (typeof isPublic === "boolean") update.is_public = isPublic;
    if (typeof sharedNotes === "boolean") update.shared_notes = sharedNotes;

    if (Object.keys(update).length === 0) {
      return jsonResponse({ error: "No updatable fields provided" }, 400);
    }

    const { error } = await supabase
      .from("my_sheet")
      .update(update)
      .eq("user_id", authResult.user.id)
      .eq("problem_id", problemId);

    if (error) return jsonResponse({ error: error.message }, 500);
    return jsonResponse({ success: true });
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
