"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { AppointmentStatus } from "@/types/database";

/**
 * RLS's "appointments: staff update" policy is the real gate here — this
 * will fail silently (0 rows affected) if the caller's session isn't
 * staff/admin, regardless of what the UI allows.
 */
export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  const supabase = createClient();
  const { error } = await supabase.from("appointments").update({ status }).eq("id", id);

  if (error) {
    return { success: false as const, error: error.message };
  }

  revalidatePath("/admin/appointments");
  return { success: true as const };
}
