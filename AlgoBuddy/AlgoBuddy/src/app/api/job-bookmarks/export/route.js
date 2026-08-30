import { cookies } from "next/headers";
import { getAuthenticatedUser } from "@/lib/auth";
import { getSupabaseServerClient, errorResponse } from "@/lib/serverApi";

function escapeCSV(value) {
  if (value == null) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCSV(rows, columns) {
  const header = columns.map((c) => escapeCSV(c.label)).join(",");
  const body = rows
    .map((row) => columns.map((c) => escapeCSV(row[c.key])).join(","))
    .join("\n");
  return header + "\n" + body + "\n";
}

export async function GET(request) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return new Response("Authentication required", { status: 401 });
    }

    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);

    const { data: bookmarks, error } = await supabase
      .from("bookmarks")
      .select("created_at, job:job_id(*)")
      .eq("student_id", authResult.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[/api/job-bookmarks/export GET] Supabase error:", error.message);
      return new Response("Export failed", { status: 500 });
    }

    const columns = [
      { key: "job_title", label: "Job Title" },
      { key: "company", label: "Company" },
      { key: "location", label: "Location" },
      { key: "job_type", label: "Job Type" },
      { key: "salary_range", label: "Salary Range" },
      { key: "experience_level", label: "Experience Level" },
      { key: "bookmarked_at", label: "Bookmarked Date" },
    ];

    const rows = (bookmarks || []).map((b) => ({
      job_title: b.job?.title || "",
      company: b.job?.company || "",
      location: b.job?.location || "",
      job_type: b.job?.job_type || "",
      salary_range: b.job?.salary_range || "",
      experience_level: b.job?.experience_level || "",
      bookmarked_at: b.created_at ? new Date(b.created_at).toLocaleDateString() : "",
    }));

    const csv = toCSV(rows, columns);

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="saved-jobs-export-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
