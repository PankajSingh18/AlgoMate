import { cookies } from "next/headers";
import { getSupabaseServerClient, jsonResponse, errorResponse } from "@/lib/serverApi";

export async function GET(_, { params }) {
  try {
    const { id } = await params;

    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);

    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("*")
      .eq("id", id)
      .single();

    if (companyError || !company) {
      return jsonResponse({ error: "Company not found" }, 404);
    }

    const { data: jobs, error: jobsError } = await supabase
      .from("jobs")
      .select("*")
      .eq("company_id", id)
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (jobsError) {
      console.error("[/api/companies/[id] GET] Jobs error:", jobsError.message);
    }

    return jsonResponse({ company, jobs: jobs || [] });
  } catch (error) {
    return errorResponse(error);
  }
}
