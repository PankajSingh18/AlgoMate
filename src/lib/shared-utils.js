function isValidHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) return null;
  if (!isValidHttpUrl(supabaseUrl)) return null;

  let finalUrl = String(supabaseUrl).trim();
  if (finalUrl.startsWith("http://localhost:")) {
    finalUrl = finalUrl.replace("http://localhost:", "http://127.0.0.1:");
  }

  const config = {
    supabaseUrl: finalUrl,
    supabaseAnonKey: String(supabaseAnonKey).trim(),
  };

  const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (serviceKey) {
    config.supabaseServiceKey = String(serviceKey).trim();
  }

  return config;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/**
 * Neutralizes CR/LF (and other line breaks) in values that are interpolated
 * into email headers (replyTo, subject) to prevent header injection.
 */
function sanitizeHeaderValue(value) {
  return String(value ?? "").replace(/[\r\n]+/g, " ").trim();
}

export { isValidHttpUrl, getSupabaseConfig, escapeHtml, sanitizeHeaderValue };
