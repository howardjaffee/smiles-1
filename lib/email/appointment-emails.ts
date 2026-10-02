import "server-only";
import { getResendClient, EMAIL_FROM } from "./resend";
import { siteConfig } from "@/config/site";

export interface AppointmentEmailData {
  fullName: string;
  phone: string;
  email?: string | null;
  serviceName?: string | null;
  preferredDate?: string | null;
  preferredTime?: string | null;
  message?: string | null;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return text.replace(/[&<>"']/g, (c) => map[c]);
}

function row(label: string, value?: string | null) {
  if (!value) return "";
  return `<p style="margin:0 0 8px"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`;
}

/**
 * Sent to the clinic's own inbox (NOTIFICATION_EMAIL) every time someone
 * submits the booking form. This is the "how will the doctor/clinic know
 * someone booked" piece — until RESEND_API_KEY + NOTIFICATION_EMAIL are
 * both set, this silently no-ops (booking still succeeds and still shows
 * in /admin/appointments — email is an add-on, not the source of truth).
 */
export async function sendAppointmentNotificationToClinic(data: AppointmentEmailData) {
  const resend = getResendClient();
  const notifyEmail = process.env.NOTIFICATION_EMAIL;

  if (!resend || !notifyEmail) {
    console.warn(
      "[email] Skipping clinic notification — set RESEND_API_KEY and NOTIFICATION_EMAIL to enable it."
    );
    return;
  }

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: notifyEmail,
      subject: `New appointment request — ${data.fullName}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px">
          <h2 style="margin:0 0 16px">New appointment request</h2>
          ${row("Name", data.fullName)}
          ${row("Phone", data.phone)}
          ${row("Email", data.email)}
          ${row("Service", data.serviceName)}
          ${row("Preferred date", data.preferredDate)}
          ${row("Preferred time", data.preferredTime)}
          ${row("Message", data.message)}
          <p style="margin-top:20px">
            <a href="${siteConfig.seo.siteUrl}/admin/appointments" style="color:#0E5F58">
              Open in admin dashboard →
            </a>
          </p>
        </div>
      `,
    });
  } catch (err) {
    // Never let an email failure break the booking flow — the row is
    // already saved in the database regardless of what happens here.
    console.error("[email] Failed to send clinic notification:", err);
  }
}

/** Sent to the patient's own email, only if they provided one. */
export async function sendAppointmentConfirmationToPatient(data: AppointmentEmailData) {
  const resend = getResendClient();
  if (!resend || !data.email) return;

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: data.email,
      subject: `We've received your appointment request — ${siteConfig.brand.name}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px">
          <p>Hi ${escapeHtml(data.fullName)},</p>
          <p>
            Thank you for requesting an appointment with ${escapeHtml(siteConfig.brand.name)}.
            We've received your request and will contact you at ${escapeHtml(data.phone)} shortly
            to confirm a time.
          </p>
          ${row("Requested service", data.serviceName)}
          ${row("Preferred date", data.preferredDate)}
          ${row("Preferred time", data.preferredTime)}
          <p>
            If you need to reach us directly, call
            <a href="tel:${siteConfig.contact.phone.replace(/\s/g, "")}">${escapeHtml(siteConfig.contact.phone)}</a>.
          </p>
          <p>— ${escapeHtml(siteConfig.brand.name)}</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("[email] Failed to send patient confirmation:", err);
  }
}
