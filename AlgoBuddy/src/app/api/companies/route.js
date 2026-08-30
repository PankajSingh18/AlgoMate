import { cookies } from "next/headers";
import { getSupabaseServerClient, jsonResponse, errorResponse } from "@/lib/serverApi";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);

    const { data: companies, error } = await supabase
      .from("companies")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("[/api/companies GET] Supabase error:", error.message);
      return jsonResponse({ companies: [] });
    }

    return jsonResponse({ companies: companies || [] });
  } catch (error) {
    return errorResponse(error);
  }
}
