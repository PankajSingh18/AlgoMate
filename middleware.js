// app/api/applications/route.js

import { cookies } from "next/headers";
import { getAuthenticatedUser } from "@/lib/auth";
import { getSupabaseServerClient, jsonResponse, errorResponse } from "@/lib/serverApi";
import { validateCsrfOrigin } from "@/lib/csrfConstants";
import { withRateLimit } from "@/lib/rate-limit/route-wrapper.js";
import { rateLimit } from "@/lib/rate-limit/api-middleware.js";

// Constants for validation
const MAX_LIMIT = 100;
const MIN_LIMIT = 1;
const DEFAULT_LIMIT = 50;
const MAX_JOB_ID_LENGTH = 50;
const ALLOWED_JOB_STATUS = ['approved', 'open', 'active'];

// ============================================
// GET Handler with Rate Limiting
// ============================================
export const GET = withRateLimit(async (request) => {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse({ error: "Authentication required" }, 401);
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const rawLimit = parseInt(searchParams.get("limit")) || DEFAULT_LIMIT;
    
    // Validate limit - prevent unbounded requests
    const limit = Math.min(Math.max(rawLimit, MIN_LIMIT), MAX_LIMIT);
    
    // Validate page number
    if (page < 1) {
      return jsonResponse({ error: "Page must be at least 1" }, 400);
    }

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
      return jsonResponse({ 
        applications: [], 
        totalPages: 0, 
        currentPage: page,
        error: "Failed to fetch applications"
      }, 500);
    }

    return jsonResponse({
      applications: applications || [],
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page,
      limit: limit,
      totalCount: count || 0,
    });
  } catch (error) {
    console.error("[/api/applications GET] Error:", error);
    return errorResponse(error);
  }
}, 'read'); // Apply read rate limit (200 req/min)

// ============================================
// POST Handler with Rate Limiting
// ============================================
export const POST = withRateLimit(async (request) => {
  // CSRF Validation
  if (!validateCsrfOrigin(request)) {
    return jsonResponse({ error: "CSRF validation failed: untrusted origin" }, 403);
  }

  try {
    // Authentication
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse({ error: "Authentication required" }, 401);
    }

    // Parse and validate request body
    const body = await request.json().catch(() => ({}));
    const { jobId } = body;

    // Validate jobId
    if (!jobId) {
      return jsonResponse({ error: "jobId is required" }, 400);
    }

    // Validate jobId format (alphanumeric, hyphens, underscores only)
    if (!/^[a-zA-Z0-9_-]+$/.test(jobId)) {
      return jsonResponse({ error: "Invalid jobId format" }, 400);
    }

    // Validate jobId length
    if (jobId.length > MAX_JOB_ID_LENGTH) {
      return jsonResponse({ error: "jobId too long" }, 400);
    }

    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);

    // Check if user has already applied to this job (prevent duplicate submissions)
    const { data: existingApplication, error: existingError } = await supabase
      .from("applications")
      .select("id, status")
      .eq("student_id", authResult.user.id)
      .eq("job_id", jobId)
      .maybeSingle();

    if (existingApplication) {
      // If already applied, return appropriate response
      if (existingApplication.status === 'pending') {
        return jsonResponse({ 
          error: "You have already applied to this job", 
          status: 'pending',
          applicationId: existingApplication.id
        }, 409);
      }
      if (existingApplication.status === 'rejected') {
        return jsonResponse({ 
          error: "Your previous application was rejected", 
          status: 'rejected'
        }, 403);
      }
      if (existingApplication.status === 'accepted') {
        return jsonResponse({ 
          error: "You have already been accepted for this job", 
          status: 'accepted'
        }, 403);
      }
    }

    // Fetch job details with security checks
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("id, title, company, status, application_deadline")
      .eq("id", jobId)
      .single();

    if (jobError || !job) {
      return jsonResponse({ error: "Job not found" }, 404);
    }

    // Check if job is open for applications
    const validStatuses = ['approved', 'open', 'active'];
    if (!validStatuses.includes(job.status)) {
      return jsonResponse({ 
        error: "This job is not open for applications",
        status: job.status
      }, 400);
    }

    // Check if application deadline has passed
    if (job.application_deadline) {
      const deadline = new Date(job.application_deadline);
      if (deadline < new Date()) {
        return jsonResponse({ 
          error: "Application deadline has passed",
          deadline: job.application_deadline
        }, 400);
      }
    }

    // Get user metadata with validation
    const meta = authResult.user.user_metadata || {};
    const studentName = meta.name || authResult.user.email?.split("@")[0] || "Student";
    const studentBranch = meta.branch || null;
    const studentCgpa = meta.cgpa || null;
    const studentSkills = meta.skills || null;
    const studentResumeLink = meta.resume_link || null;

    // Validate CGPA if present
    if (studentCgpa !== null) {
      const cgpa = parseFloat(studentCgpa);
      if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
        return jsonResponse({ error: "Invalid CGPA value" }, 400);
      }
    }

    // Insert application with all required fields
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
        applied_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      // Handle duplicate key violation
      if (insertError.code === '23505') {
        return jsonResponse({ 
          error: "You have already applied to this job",
          code: 'DUPLICATE_APPLICATION'
        }, 409);
      }
      
      console.error("[/api/applications POST] Supabase error:", insertError.message);
      return jsonResponse({ 
        error: "Failed to submit application",
        details: insertError.message
      }, 500);
    }

    // Log successful application (for monitoring)
    console.log(`[Application] User ${authResult.user.id} applied to job ${jobId}`);

    return jsonResponse({ 
      application, 
      message: "Application submitted successfully!",
      status: 'pending'
    }, 201);

  } catch (error) {
    console.error("[/api/applications POST] Error:", error);
    return errorResponse(error);
  }
}, 'write'); // Apply write rate limit (50 req/min)

// ============================================
// DELETE Handler (with rate limiting)
// ============================================
export const DELETE = withRateLimit(async (request) => {
  // CSRF Validation
  if (!validateCsrfOrigin(request)) {
    return jsonResponse({ error: "CSRF validation failed: untrusted origin" }, 403);
  }

  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse({ error: "Authentication required" }, 401);
    }

    const body = await request.json().catch(() => ({}));
    const { applicationId } = body;

    if (!applicationId) {
      return jsonResponse({ error: "applicationId is required" }, 400);
    }

    // Validate applicationId format
    if (!/^[a-zA-Z0-9_-]+$/.test(applicationId)) {
      return jsonResponse({ error: "Invalid applicationId format" }, 400);
    }

    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);

    // Check if application belongs to user
    const { data: application, error: checkError } = await supabase
      .from("applications")
      .select("id, student_id, status")
      .eq("id", applicationId)
      .single();

    if (checkError || !application) {
      return jsonResponse({ error: "Application not found" }, 404);
    }

    if (application.student_id !== authResult.user.id) {
      return jsonResponse({ error: "Unauthorized to delete this application" }, 403);
    }

    // Only allow deletion of pending applications
    if (application.status !== 'pending') {
      return jsonResponse({ 
        error: "Cannot delete application that is no longer pending",
        status: application.status
      }, 400);
    }

    const { error: deleteError } = await supabase
      .from("applications")
      .delete()
      .eq("id", applicationId);

    if (deleteError) {
      console.error("[/api/applications DELETE] Supabase error:", deleteError.message);
      return jsonResponse({ error: "Failed to delete application" }, 500);
    }

    return jsonResponse({ 
      message: "Application withdrawn successfully",
      applicationId
    }, 200);

  } catch (error) {
    console.error("[/api/applications DELETE] Error:", error);
    return errorResponse(error);
  }
}, 'sensitive'); // Apply sensitive rate limit (5 req/min)

// ============================================
// Error handling helper
// ============================================
function isValidJobStatus(status) {
  return ALLOWED_JOB_STATUS.includes(status);
}