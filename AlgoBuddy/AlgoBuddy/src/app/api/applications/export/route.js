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

    const { data: applications, error } = await supabase
      .from("applications")
      .select("*, job:job_id(title, company, location, salary_range, job_type)")
      .eq("student_id", authResult.user.id)
      .order("applied_at", { ascending: false });

    if (error) {
      console.error("[/api/applications/export GET] Supabase error:", error.message);
      return new Response("Export failed", { status: 500 });
    }

    const columns = [
      { key: "job_title", label: "Job Title" },
      { key: "company", label: "Company" },
      { key: "location", label: "Location" },
      { key: "job_type", label: "Job Type" },
      { key: "salary_range", label: "Salary Range" },
      { key: "status", label: "Application Status" },
      { key: "applied_at", label: "Applied Date" },
      { key: "student_name", label: "Your Name" },
      { key: "student_email", label: "Your Email" },
      { key: "student_branch", label: "Branch" },
      { key: "student_cgpa", label: "CGPA" },
      { key: "student_skills", label: "Skills" },
    ];

    const rows = (applications || []).map((a) => ({
      job_title: a.job?.title || "",
      company: a.job?.company || "",
      location: a.job?.location || "",
      job_type: a.job?.job_type || "",
      salary_range: a.job?.salary_range || "",
      status: a.status || "",
      applied_at: a.applied_at ? new Date(a.applied_at).toLocaleDateString() : "",
      student_name: a.student_name || "",
      student_email: a.student_email || "",
      student_branch: a.student_branch || "",
      student_cgpa: a.student_cgpa || "",
      student_skills: a.student_skills || "",
    }));

    const csv = toCSV(rows, columns);

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="applications-export-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
