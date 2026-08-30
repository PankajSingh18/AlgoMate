export function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    function isValidSupabaseUrl(value) {
      if (!value) return false;
      const trimmed = String(value).trim();
      if (trimmed.startsWith("Your ")) return false;
      try {
        const parsed = new URL(trimmed);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
      } catch {
        return false;
      }
    }

    function isValidKey(value) {
      if (!value) return false;
      const trimmed = String(value).trim();
      return trimmed && !trimmed.startsWith("Your ");
    }

    const missing = [];
    if (!isValidSupabaseUrl(supabaseUrl)) missing.push("NEXT_PUBLIC_SUPABASE_URL");
    if (!isValidKey(supabaseAnonKey)) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
    if (!isValidKey(supabaseServiceKey)) missing.push("SUPABASE_SERVICE_ROLE_KEY");

    if (missing.length > 0) {
      const errorMsg = `[Startup Error] Missing or invalid required authentication environment variables: ${missing.join(", ")}`;
      console.error(`\n==================================================\n${errorMsg}\n==================================================\n`);
      // throw new Error(errorMsg); // Commented out to allow local UI development without Supabase
    }
  }
}
