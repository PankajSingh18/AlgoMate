import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/serverApi";
import nodemailer from "nodemailer";
import { escapeHtml, sanitizeHeaderValue } from "@/lib/shared-utils";

// Fail closed: when CRON_SECRET is unset the comparison would silently
// become `authHeader !== "Bearer undefined"`, letting anyone trigger this
// job. Surface the misconfiguration at boot as well.
const CRON_SECRET = process.env.CRON_SECRET;
if (!CRON_SECRET && process.env.NODE_ENV === "production") {
  console.warn(
    "[cron/process-pending] CRON_SECRET is not set — the delayed-email job will reject all requests. Set CRON_SECRET in the scheduler environment.",
  );
}

export async function GET(req) {
  if (!CRON_SECRET || req.headers.get("authorization") !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();

  try {
    // Atomically claim rows: claim_pending_messages marks claimed_at on the
    // rows it selects in the same UPDATE ... RETURNING statement (FOR UPDATE
    // SKIP LOCKED), so overlapping runs never send the same message twice.
    const { data: pendingMessages, error } = await supabase.rpc(
      "claim_pending_messages",
      { p_limit: 50 },
    );

    if (error) throw error;
    if (!pendingMessages || pendingMessages.length === 0) {
      return NextResponse.json({ message: "No pending messages to process." });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let processedCount = 0;
    let failedCount = 0;

    for (const msg of pendingMessages) {
      try {
        if (msg.type === "contact") {
          const { name, email, subject, message } = msg.payload;

          const safeName = escapeHtml(sanitizeHeaderValue(name));
          const safeEmail = escapeHtml(sanitizeHeaderValue(email));
          const safeSubject = escapeHtml(sanitizeHeaderValue(subject));
          const safeMessage = escapeHtml(message);

          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            replyTo: sanitizeHeaderValue(email),
            to: process.env.EMAIL_USER,
            subject: `[DELAYED] New Contact Form Submission: ${safeSubject}`,
            text: `Name: ${safeName}\nEmail: ${safeEmail}\nSubject: ${safeSubject}\nMessage: ${safeMessage}`,
          });
        } else if (msg.type === "review") {
          const { name, email, review, rating } = msg.payload;
          const inboxEmail = process.env.REVIEW_INBOX_EMAIL || process.env.EMAIL_USER;

          const safeName = escapeHtml(sanitizeHeaderValue(name));
          const safeEmail = escapeHtml(sanitizeHeaderValue(email));
          const safeReview = escapeHtml(review);

          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            replyTo: sanitizeHeaderValue(email),
            to: inboxEmail,
            subject: `[DELAYED] New Review Submission from ${safeName}`,
            html: `
        <h2>New Review Received (Delayed)</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Rating:</strong> ${"★".repeat(rating)}${"☆".repeat(
          5 - rating
        )}</p>
        <p><strong>Review:</strong></p>
        <p>${safeReview.replaceAll("\n", "<br>")}</p>
      `,
          });
        }

        // Mark fully sent and release the claim.
        await supabase
          .from("pending_messages")
          .update({ sent_at: new Date().toISOString(), claimed_at: null })
          .eq("id", msg.id);

        processedCount++;
      } catch (msgError) {
        failedCount++;
        // Release the claim so the message is retried on the next run.
        await supabase
          .from("pending_messages")
          .update({ claimed_at: null })
          .eq("id", msg.id);
        console.error(`[CRON] Failed to process pending message ${msg.id}:`, msgError);
      }
    }

    return NextResponse.json({
      message: `Processed ${processedCount} pending messages. ${failedCount} failed and will retry next run.`,
    });

  } catch (error) {
    console.error("[CRON] Error processing pending messages:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
