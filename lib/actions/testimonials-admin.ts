"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { testimonialSchema, type TestimonialFormValues } from "@/lib/validation/content";

function toRow(values: TestimonialFormValues) {
  return {
    patient_display_name: values.patientDisplayName,
    review: values.review,
    rating: values.rating ?? null,
    source: values.source || null,
    review_date: values.reviewDate || null,
    is_published: values.isPublished,
  };
}

export async function createTestimonial(values: TestimonialFormValues) {
  const parsed = testimonialSchema.safeParse(values);
  if (!parsed.success) return { success: false as const, error: "Please check the form fields." };

  const supabase = createClient();
  const { error } = await supabase.from("testimonials").insert(toRow(parsed.data));
  if (error) return { success: false as const, error: error.message };

  revalidatePath("/admin/testimonials");
  revalidatePath("/reviews");
  revalidatePath("/");
  return { success: true as const };
}

export async function updateTestimonial(id: string, values: TestimonialFormValues) {
  const parsed = testimonialSchema.safeParse(values);
  if (!parsed.success) return { success: false as const, error: "Please check the form fields." };

  const supabase = createClient();
  const { error } = await supabase.from("testimonials").update(toRow(parsed.data)).eq("id", id);
  if (error) return { success: false as const, error: error.message };

  revalidatePath("/admin/testimonials");
  revalidatePath("/reviews");
  revalidatePath("/");
  return { success: true as const };
}

export async function deleteTestimonial(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) return { success: false as const, error: error.message };
  revalidatePath("/admin/testimonials");
  revalidatePath("/reviews");
  return { success: true as const };
}

export async function toggleTestimonialPublished(id: string, isPublished: boolean) {
  const supabase = createClient();
  const { error } = await supabase.from("testimonials").update({ is_published: isPublished }).eq("id", id);
  if (error) return { success: false as const, error: error.message };
  revalidatePath("/admin/testimonials");
  revalidatePath("/reviews");
  revalidatePath("/");
  return { success: true as const };
}
