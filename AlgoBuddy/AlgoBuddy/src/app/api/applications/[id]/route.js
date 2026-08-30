import { getAuthenticatedUser } from "@/lib/auth";
import { getSupabaseAdmin, jsonResponse, errorResponse } from "@/lib/serverApi";
import { sendEmail } from "@/lib/email";

export async function PATCH(request, { params }) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse({ error: "Authentication required" }, 401);
    }

    const adminClient = getSupabaseAdmin();

    const { data: profile } = await adminClient
      .from("user_profiles")
      .select("role")
      .eq("id", authResult.user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return jsonResponse({ error: "Admin access required" }, 403);
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { status } = body;

    if (!status || !["accepted", "rejected", "reviewing"].includes(status)) {
      return jsonResponse({ error: "Invalid status value" }, 400);
    }

    const { data: application, error: fetchError } = await adminClient
      .from("applications")
      .select("*, job:job_id(title, company)")
      .eq("id", id)
      .single();

    if (fetchError || !application) {
      return jsonResponse({ error: "Application not found" }, 404);
    }

    if (application.status === status) {
      return jsonResponse({ error: `Application is already ${status}` }, 400);
    }

    const oldStatus = application.status;

    const { error: updateError } = await adminClient
      .from("applications")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (updateError) {
      console.error("[/api/applications/[id] PATCH] Supabase error:", updateError.message);
      return jsonResponse({ error: updateError.message }, 500);
    }

    const statusLabel = status === "accepted" ? "accepted" : "rejected";
    const jobTitle = application.job?.title || "a job";
    const companyName = application.job?.company || "";

    const { error: notifError } = await adminClient
      .from("notifications")
      .insert({
        student_id: application.student_id,
        job_id: application.job_id,
        message: `Your application for ${jobTitle}${companyName ? ` at ${companyName}` : ""} has been ${statusLabel}.`,
        type: "application_status_update",
        metadata: { old_status: oldStatus, new_status: status },
      });

    if (notifError) {
      console.error("[/api/applications/[id] PATCH] Notification insert error:", notifError.message);
    }

    const { data: studentUser } = await adminClient.auth.admin.getUserById(
      application.student_id
    );
    const studentMeta = studentUser?.user?.user_metadata || {};
    const emailNotificationsEnabled = studentMeta.email_notifications !== false;

    if (emailNotificationsEnabled) {
      const appUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
      await sendEmail({
        to: application.student_email,
        subject: `Application Update - ${companyName} - ${jobTitle}`,
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #1e293b;">Application Status Update</h2>
            <p style="color: #475569; line-height: 1.6;">
              Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong>
              has been <strong>${statusLabel}</strong>.
            </p>
            <a href="${appUrl}/my-applications"
               style="display: inline-block; padding: 10px 20px; background: #6366f1; color: white;
                      text-decoration: none; border-radius: 8px; font-size: 14px; margin-top: 12px;">
              View your applications
            </a>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">
              You can change email notification preferences in your profile settings.
            </p>
          </div>
        `,
      });
    }

    return jsonResponse({ success: true, status });
  } catch (error) {
    return errorResponse(error);
  }
}
