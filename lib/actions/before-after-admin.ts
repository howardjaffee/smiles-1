"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { beforeAfterSchema, type BeforeAfterFormValues } from "@/lib/validation/content";

export async function createBeforeAfterCase(values: BeforeAfterFormValues) {
  const parsed = beforeAfterSchema.safeParse(values);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Please check the form fields.";
    return { success: false as const, error: message };
  }

  const supabase = createClient();
  const { error } = await supabase.from("before_after_cases").insert({
    title: parsed.data.title,
    treatment_type: parsed.data.treatmentType || null,
    before_image_url: parsed.data.beforeImageUrl,
    after_image_url: parsed.data.afterImageUrl,
    description: parsed.data.description || null,
    consent_confirmed: parsed.data.consentConfirmed,
    is_published: parsed.data.isPublished,
  });

  if (error) return { success: false as const, error: error.message };
  revalidatePath("/admin/before-after");
  revalidatePath("/before-after");
  return { success: true as const };
}

export async function deleteBeforeAfterCase(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("before_after_cases").delete().eq("id", id);
  if (error) return { success: false as const, error: error.message };
  revalidatePath("/admin/before-after");
  revalidatePath("/before-after");
  return { success: true as const };
}

/**
 * The database also enforces "no publish without consent" via a CHECK
 * constraint (before_after_requires_consent) — this action's own check
 * is a friendlier error message, not the real gate.
 */
export async function toggleBeforeAfterPublished(id: string, isPublished: boolean, consentConfirmed: boolean) {
  if (isPublished && !consentConfirmed) {
    return { success: false as const, error: "Confirm patient consent before publishing this case." };
  }
  const supabase = createClient();
  const { error } = await supabase.from("before_after_cases").update({ is_published: isPublished }).eq("id", id);
  if (error) return { success: false as const, error: error.message };
  revalidatePath("/admin/before-after");
  revalidatePath("/before-after");
  return { success: true as const };
}
