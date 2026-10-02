"use server";

import { createClient } from "@/lib/supabase/server";
import { appointmentSchema, type AppointmentFormValues } from "@/lib/validation/appointment";
import { sendAppointmentNotificationToClinic, sendAppointmentConfirmationToPatient } from "@/lib/email/appointment-emails";

export type BookAppointmentResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Partial<Record<keyof AppointmentFormValues, string>> };

/**
 * Handles the public booking form. Validates on the server (never trust
 * client-side validation alone), rejects honeypot hits silently with a
 * fake success so bots don't learn the field is being checked, and
 * inserts via the anon Supabase client — RLS's "public can submit" INSERT
 * policy is what actually allows this row to be written; there is no
 * public SELECT/UPDATE/DELETE on this table at all.
 */
export async function bookAppointment(values: AppointmentFormValues): Promise<BookAppointmentResult> {
  const parsed = appointmentSchema.safeParse(values);

  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof AppointmentFormValues, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof AppointmentFormValues;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { success: false, error: "Please check the highlighted fields.", fieldErrors };
  }

  // Honeypot: real visitors never populate this hidden field.
  if (parsed.data.website) {
    return { success: true }; // fake success, don't tip off the bot
  }

  try {
    const supabase = createClient();

    // Look up the service name (if one was selected) purely for the
    // email content below — not stored redundantly in the database.
    let serviceName: string | null = null;
    if (parsed.data.serviceId) {
      const { data: service } = await supabase
        .from("services")
        .select("title")
        .eq("id", parsed.data.serviceId)
        .single();
      serviceName = service?.title ?? null;
    }

    const { error } = await supabase.from("appointments").insert({
      full_name: parsed.data.fullName,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      service_id: parsed.data.serviceId || null,
      preferred_date: parsed.data.preferredDate || null,
      preferred_time: parsed.data.preferredTime || null,
      message: parsed.data.message || null,
      status: "PENDING",
    });

    if (error) {
      console.error("Appointment insert failed:", error.message);
      return {
        success: false,
        error: "Something went wrong on our end. Please call us directly to book.",
      };
    }

    // The booking is already saved at this point — email is a
    // best-effort notification on top, never a condition for success.
    const emailData = {
      fullName: parsed.data.fullName,
      phone: parsed.data.phone,
      email: parsed.data.email,
      serviceName,
      preferredDate: parsed.data.preferredDate,
      preferredTime: parsed.data.preferredTime,
      message: parsed.data.message,
    };
    await Promise.all([
      sendAppointmentNotificationToClinic(emailData),
      sendAppointmentConfirmationToPatient(emailData),
    ]);

    return { success: true };
  } catch (err) {
    console.error("Appointment insert threw:", err);
    return {
      success: false,
      error: "Something went wrong on our end. Please call us directly to book.",
    };
  }
}
