import nodemailer from "nodemailer";
import { checkRateLimit, checkGlobalSmtpQuota } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/getClientIp";
import { verifyTurnstile } from "@/lib/verifyTurnstile";
import { jsonResponse, errorResponse, getSupabaseAdmin } from "@/lib/serverApi";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isValidEmail(value) {
  const email = String(value).trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clampInt(value, min, max) {
  const num = Number(value);
  if (!Number.isFinite(num)) return null;
  const int = Math.trunc(num);
  if (int < min || int > max) return null;
  return int;
}

export async function POST(request) {
  try {
    const ip = getClientIp(request.headers);

    const { allowed, remaining, resetAt } =
      await checkRateLimit(`review:${ip}`);
    if (!allowed) {
      const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);
      return jsonResponse({ message: "Too many requests. Please try again later." }, 429, {
        "Retry-After": retryAfter.toString(),
        "X-RateLimit-Limit": "5",
        "X-RateLimit-Remaining": "0",
      });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ success: false, error: "Invalid JSON body" }, 400);
    }

    const { name, email, review, rating, captchaToken } = body || {};

    if (!captchaToken) {
      return jsonResponse({ success: false, error: "Captcha token missing" }, 400);
    }

    const captcha = await verifyTurnstile(String(captchaToken), { ip });
    if (!captcha.ok) {
      return jsonResponse({ success: false, error: captcha.error }, 400);
    }

    const trimmedName = String(name || "").trim().slice(0, 80);
    const trimmedEmail = String(email || "").trim().slice(0, 254);
    const trimmedReview = String(review || "").trim().slice(0, 2000);
    const safeRating = clampInt(rating, 1, 5);

    if (!trimmedName) {
      return jsonResponse({ success: false, error: "Name is required" }, 400);
    }
    if (!isValidEmail(trimmedEmail)) {
      return jsonResponse({ success: false, error: "Valid email is required" }, 400);
    }
    if (!trimmedReview) {
      return jsonResponse({ success: false, error: "Review is required" }, 400);
    }
    if (!safeRating) {
      return jsonResponse({ success: false, error: "Rating must be an integer between 1 and 5" }, 400);
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return jsonResponse({ success: false, error: "Server misconfigured: email credentials missing" }, 500);
    }

    const { allowed: smtpAllowed } = await checkGlobalSmtpQuota(
      parseInt(process.env.SMTP_DAILY_QUOTA || "400", 10)
    );
    if (!smtpAllowed) {
      console.warn("[review] SMTP daily quota exceeded. Persisting message to pending_messages.");
      try {
        const supabase = getSupabaseAdmin();
        await supabase.from("pending_messages").insert({
          type: "review",
          payload: { name: trimmedName, email: trimmedEmail, review: trimmedReview, rating: safeRating },
        });
      } catch (dbErr) {
        console.error("[review] Failed to persist pending message:", dbErr);
      }
      return jsonResponse({
        message: "Our messaging service is temporarily over capacity. Please try again tomorrow or contact us through other channels.",
      }, 503);
    }

    const inboxEmail = process.env.REVIEW_INBOX_EMAIL || process.env.EMAIL_USER;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      replyTo: trimmedEmail,
      to: inboxEmail,
      subject: `New Review Submission from ${trimmedName}`,
      html: `
        <h2>New Review Received</h2>
        <p><strong>Name:</strong> ${escapeHtml(trimmedName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(trimmedEmail)}</p>
        <p><strong>Rating:</strong> ${"★".repeat(safeRating)}${"☆".repeat(
          5 - safeRating
        )}</p>
        <p><strong>Review:</strong></p>
        <p>${escapeHtml(trimmedReview).replaceAll("\n", "<br>")}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return jsonResponse({ message: "Email sent successfully" }, 200, {
      "X-RateLimit-Limit": "5",
      "X-RateLimit-Remaining": remaining.toString(),
    });
  } catch (error) {
    console.error("Review API error:", error);
    return errorResponse(error);
  }
}
