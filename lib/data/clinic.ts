import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/config/site";
import type { Tables } from "@/types/database";

/**
 * Returns the single clinic_settings row. If Supabase isn't configured
 * yet (e.g. running locally before .env.local is set up) or the table
 * is empty, falls back to config/site.ts so the site still renders with
 * the confirmed signboard data instead of crashing. In production, once
 * Supabase is connected, this should always resolve the real row.
 */
export async function getClinicSettings(): Promise<Tables<"clinic_settings">> {
  const fallback: Tables<"clinic_settings"> = {
    id: "fallback",
    singleton: true,
    clinic_name: siteConfig.brand.name,
    doctor_name: siteConfig.doctor.name,
    qualification: siteConfig.doctor.qualifications,
    specialization: siteConfig.doctor.title,
    phone: siteConfig.contact.phone,
    whatsapp: siteConfig.contact.whatsapp,
    email: siteConfig.contact.email,
    address_line1: siteConfig.location.addressLine1,
    address_line2: siteConfig.location.addressLine2,
    city: siteConfig.location.city,
    state: siteConfig.location.state,
    postal_code: siteConfig.location.postalCode,
    country: siteConfig.location.country,
    latitude: siteConfig.location.latitude,
    longitude: siteConfig.location.longitude,
    google_maps_url: siteConfig.location.googleMapsUrl,
    opening_hours: siteConfig.hours.schedule,
    instagram_url: siteConfig.social.instagram,
    facebook_url: siteConfig.social.facebook,
    website_url: siteConfig.social.website,
    tagline: siteConfig.brand.tagline,
    updated_at: new Date().toISOString(),
  } as unknown as Tables<"clinic_settings">;

  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("clinic_settings").select("*").single();
    if (error || !data) return fallback;
    return data;
  } catch {
    return fallback;
  }
}
