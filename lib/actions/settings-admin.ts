"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { clinicSettingsSchema, type ClinicSettingsFormValues } from "@/lib/validation/content";

export async function updateClinicSettings(values: ClinicSettingsFormValues) {
  const parsed = clinicSettingsSchema.safeParse(values);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Please check the form fields.";
    return { success: false as const, error: message };
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("clinic_settings")
    .update({
      clinic_name: parsed.data.clinicName,
      doctor_name: parsed.data.doctorName,
      qualification: parsed.data.qualification || null,
      specialization: parsed.data.specialization || null,
      phone: parsed.data.phone || null,
      whatsapp: parsed.data.whatsapp || null,
      email: parsed.data.email || null,
      address_line1: parsed.data.addressLine1 || null,
      address_line2: parsed.data.addressLine2 || null,
      city: parsed.data.city || null,
      state: parsed.data.state || null,
      postal_code: parsed.data.postalCode || null,
      country: parsed.data.country || null,
      latitude: parsed.data.latitude ?? null,
      longitude: parsed.data.longitude ?? null,
      google_maps_url: parsed.data.googleMapsUrl || null,
      instagram_url: parsed.data.instagramUrl || null,
      facebook_url: parsed.data.facebookUrl || null,
      website_url: parsed.data.websiteUrl || null,
      tagline: parsed.data.tagline || null,
    })
    .eq("singleton", true);

  if (error) return { success: false as const, error: error.message };

  // Settings feed nearly every page (NAP data, structured data, footer, etc.)
  revalidatePath("/", "layout");
  return { success: true as const };
}
