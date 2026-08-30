import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return null;
  try {
    const parsed = new URL(supabaseUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
  } catch {
    return null;
  }
  return { supabaseUrl, supabaseAnonKey };
}

export async function GET(request) {
  try {
    const config = getSupabaseConfig();
    if (!config) {
      return Response.json(
        { error: "Supabase not configured" },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit")) || 12, 1), 100);
    const offset = Math.max(parseInt(searchParams.get("offset")) || 0, 0);

    const cookieStore = await cookies();
    const client = createServerClient(config.supabaseUrl, config.supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    });

    const { data: contributors, error } = await client
      .from("community_contributors")
      .select("*")
      .order("order", { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      return Response.json(
        { error: "Failed to fetch contributors" },
        { status: 500 }
      );
    }

    const { count: total } = await client
      .from("community_contributors")
      .select("*", { count: "exact", head: true });

    return Response.json({ contributors, total: total ?? contributors.length });
  } catch (error) {
    return Response.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
