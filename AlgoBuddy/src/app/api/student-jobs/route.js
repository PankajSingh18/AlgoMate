import { cookies } from "next/headers";
import { getAuthenticatedUser } from "@/lib/auth";
import { getSupabaseServerClient, jsonResponse, errorResponse } from "@/lib/serverApi";
import { checkRateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/getClientIp";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function parsePagination(searchParams) {
  const page = Number(searchParams.get("page") ?? DEFAULT_PAGE);
  const limit = Number(searchParams.get("limit") ?? DEFAULT_LIMIT);

  if (!Number.isInteger(page) || page < 1) {
    return { error: "page must be a positive integer" };
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
    return { error: `limit must be an integer between 1 and ${MAX_LIMIT}` };
  }

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}

export async function GET(request) {
  try {
    const ip = getClientIp(request.headers);

    const { allowed } = await checkRateLimit(`student-jobs:${ip}`);
    if (!allowed) {
      return jsonResponse({ error: "Too many search requests. Please slow down." }, 429);
    }

    const { searchParams } = new URL(request.url);
    const pagination = parsePagination(searchParams);
    const search = (searchParams.get("search") || "").trim();

    if (pagination.error) {
      return jsonResponse({
        error: pagination.error,
        jobs: [],
        totalPages: 0,
        currentPage: DEFAULT_PAGE,
        totalJobs: 0,
      }, 400);
    }

    const { page, limit, skip } = pagination;

    if (search && search.length < 2) {
      return jsonResponse({
        error: "Search term must be at least 2 characters.",
        jobs: [], totalPages: 0, currentPage: page, totalJobs: 0,
      }, 400);
    }

    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);

    let query = supabase
      .from("jobs")
      .select("*", { count: "exact" })
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .range(skip, skip + limit - 1);

    if (search) {
      const term = `${search}%`;
      query = query.or(
        `title.ilike.${term},company.ilike.${term},location.ilike.${term}`
      );
    }

    const { data: jobs, error, count } = await query;

    if (error) {
      console.error("[/api/student-jobs GET] Supabase error:", error.message);
      return jsonResponse({ jobs: [], totalPages: 0, currentPage: page, totalJobs: 0 });
    }

    return jsonResponse({
      jobs: jobs || [],
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page,
      totalJobs: count || 0,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
