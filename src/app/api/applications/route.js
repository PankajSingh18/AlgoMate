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
    const { jobId } = body;

    if (!jobId) {
      return jsonResponse({ error: "jobId is required" }, 400);
    }

    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);

    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("id, title, company, status")
      .eq("id", jobId)
      .single();

    if (jobError || !job) {
      return jsonResponse({ error: "Job not found" }, 404);
    }

    if (job.status !== "approved") {
      return jsonResponse({ error: "This job is not open for applications" }, 400);
    }

    const meta = authResult.user.user_metadata || {};
    const studentName = meta.name || authResult.user.email?.split("@")[0] || "Student";
    const studentBranch = meta.branch || null;
    const studentCgpa = meta.cgpa || null;
    const studentSkills = meta.skills || null;
    const studentResumeLink = meta.resume_link || null;

    const { data: application, error: insertError } = await supabase
      .from("applications")
      .insert({
        student_id: authResult.user.id,
        job_id: jobId,
        status: "pending",
        student_name: studentName,
        student_email: authResult.user.email,
        student_branch: studentBranch,
        student_cgpa: studentCgpa,
        student_skills: studentSkills,
        student_resume_link: studentResumeLink,
      })
      .select()
      .single();

    if (insertError) {
      if (insertError.code === '23505') {
        return jsonResponse({ error: "You have already applied to this job" }, 409);
      }
      console.error("[/api/applications POST] Supabase error:", insertError.message);
      return jsonResponse({ error: insertError.message }, 500);
    }

    return jsonResponse({ application, message: "Application submitted successfully!" }, 201);
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

    const MAX_LIMIT = 100;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page", 10)) || 1;
    const rawLimit = parseInt(searchParams.get("limit", 10)) || 50;
    const limit = Math.min(Math.max(rawLimit, 1), MAX_LIMIT);
    const skip = (page - 1) * limit;

    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);

    const { data: applications, error, count } = await supabase
      .from("applications")
      .select("*, job:job_id(title, company, location, salary_range, job_type)", { count: "exact" })
      .eq("student_id", authResult.user.id)
      .order("applied_at", { ascending: false })
      .range(skip, skip + limit - 1);

    if (error) {
      console.error("[/api/applications GET] Supabase error:", error.message);
      return jsonResponse({ applications: [], totalPages: 0, currentPage: page });
    }

    return jsonResponse({
      applications: applications || [],
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
