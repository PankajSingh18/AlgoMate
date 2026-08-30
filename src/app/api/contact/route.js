import { getTransporter } from "@/lib/emailTransporter";
import { checkRateLimit, checkGlobalSmtpQuota } from "@/lib/rateLimit";
import { getClientIp, resolveClientId } from "@/lib/getClientIp";
import { verifyTurnstile } from "@/lib/verifyTurnstile";
import {
  CSRF_COOKIE_NAME,
  CSRF_HEADER_NAME,
} from "@/lib/csrfConstants";
import { validateCsrfTokenEdge } from "@/lib/csrfToken";
import { jsonResponse, errorResponse, getSupabaseAdmin } from "@/lib/serverApi";
import { RATE_LIMITS } from "@/config/rateLimits";
import { escapeHtml } from "@/lib/shared-utils";

function isValidEmail(value) {
  const email = String(value).trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req) {
  const cookieToken = req.cookies?.get(CSRF_COOKIE_NAME)?.value;
  const headerToken = req.headers?.get(CSRF_HEADER_NAME);
  if (!cookieToken || !headerToken || headerToken !== cookieToken) {
    return Response.json({ error: "Invalid CSRF token" }, { status: 403 });
  }
  if (!(await validateCsrfTokenEdge(cookieToken))) {
    return Response.json({ error: "Invalid CSRF token" }, { status: 403 });
  }

  try {
    const ip = getClientIp(req.headers);
    const clientId = resolveClientId(req.headers);

    const { allowed, remaining, resetAt } =
      await checkRateLimit(`contact:${clientId}`);
    if (!allowed) {
      const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);
      return jsonResponse({ message: "Too many requests. Please try again later." }, 429, {
        "Retry-After": retryAfter.toString(),
        "X-RateLimit-Limit": RATE_LIMITS.CONTACT_API.LIMIT.toString(),
        "X-RateLimit-Remaining": "0",
      });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ message: "Invalid JSON body" }, 400);
    }

    const { name, email, subject, message, captchaToken } = body || {};

    if (!captchaToken) {
      return jsonResponse({ message: "Captcha token missing" }, 400);
    }

    const captcha = await verifyTurnstile(String(captchaToken), { ip });
    if (!captcha.ok) {
      return jsonResponse({ message: captcha.error }, 400);
    }

    const trimmedName = String(name || "").trim().slice(0, 80);
    const trimmedEmail = String(email || "").trim().slice(0, 254);
    const trimmedSubject = String(subject || "").trim().slice(0, 140);
    const trimmedMessage = String(message || "").trim().slice(0, 4000);

    if (!trimmedName) {
      return jsonResponse({ message: "Name is required" }, 400);
    }
    if (!isValidEmail(trimmedEmail)) {
      return jsonResponse({ message: "Valid email is required" }, 400);
    }
    if (!trimmedSubject) {
      return jsonResponse({ message: "Subject is required" }, 400);
    }
    if (!trimmedMessage) {
      return jsonResponse({ message: "Message is required" }, 400);
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return jsonResponse({ message: "Server misconfigured: email credentials missing" }, 500);
    }

    const { allowed: smtpAllowed } = await checkGlobalSmtpQuota(
      RATE_LIMITS.SMTP.DAILY_QUOTA
    );
    if (!smtpAllowed) {
      console.warn("[contact] SMTP daily quota exceeded. Persisting message to pending_messages.");
      try {
        const supabase = getSupabaseAdmin();
        await supabase.from("pending_messages").insert({
          type: "contact",
          payload: { name: trimmedName, email: trimmedEmail, subject: trimmedSubject, message: trimmedMessage },
        });
      } catch (dbErr) {
        console.error("[contact] Failed to persist pending message:", dbErr);
      }
      return jsonResponse({
        message: "Our messaging service is temporarily over capacity. Please try again tomorrow or contact us through other channels.",
      }, 503);
    }

    const transporter = getTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      replyTo: trimmedEmail,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission: ${trimmedSubject}`,
      text: `
        Name: ${trimmedName}
        Email: ${trimmedEmail}
        Subject: ${trimmedSubject}
        Message: ${trimmedMessage}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(trimmedName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(trimmedEmail)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(trimmedSubject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(trimmedMessage).replaceAll("\n", "<br>")}</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (mailErr) {
      console.error("[contact] Email send failed. Persisting message to pending_messages:", mailErr);
      try {
        const supabase = getSupabaseAdmin();
        await supabase.from("pending_messages").insert({
          type: "contact",
          payload: { name: trimmedName, email: trimmedEmail, subject: trimmedSubject, message: trimmedMessage },
        });
      } catch (dbErr) {
        console.error("[contact] Failed to persist pending message after email send failure:", dbErr);
      }
      return jsonResponse({
        message: "Our messaging service is temporarily over capacity. Please try again tomorrow or contact us through other channels.",
      }, 503);
    }

    return jsonResponse({ message: "Email sent successfully" }, 200, {
      "X-RateLimit-Limit": RATE_LIMITS.CONTACT_API.LIMIT.toString(),
      "X-RateLimit-Remaining": remaining.toString(),
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return errorResponse(error);
  }
}
