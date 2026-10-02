"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { serviceSchema, type ServiceFormValues } from "@/lib/validation/content";

export type ServiceActionResult =
  | { success: true; id: string }
  | { success: false; error: string; fieldErrors?: Partial<Record<keyof ServiceFormValues, string>> };

function validate(values: ServiceFormValues): ServiceActionResult | null {
  const parsed = serviceSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof ServiceFormValues, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ServiceFormValues;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { success: false, error: "Please check the highlighted fields.", fieldErrors };
  }
  return null;
}

function toRow(values: ServiceFormValues) {
  return {
    title: values.title,
    slug: values.slug,
    short_description: values.shortDescription,
    detailed_description: values.detailedDescription || null,
    icon: values.icon || null,
    image_url: values.imageUrl || null,
    benefits: values.benefits?.length ? values.benefits : null,
    is_published: values.isPublished,
    display_order: values.displayOrder,
    seo_title: values.seoTitle || null,
    meta_description: values.metaDescription || null,
  };
}

export async function createService(values: ServiceFormValues): Promise<ServiceActionResult> {
  const validationError = validate(values);
  if (validationError) return validationError;

  const supabase = createClient();
  const { data, error } = await supabase.from("services").insert(toRow(values)).select("id").single();
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { success: true, id: data.id };
}

export async function updateService(id: string, values: ServiceFormValues): Promise<ServiceActionResult> {
  const validationError = validate(values);
  if (validationError) return validationError;

  const supabase = createClient();
  const { error } = await supabase.from("services").update(toRow(values)).eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath(`/services/${values.slug}`);
  return { success: true, id };
}

export async function deleteService(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) return { success: false as const, error: error.message };
  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { success: true as const };
}

export async function toggleServicePublished(id: string, isPublished: boolean) {
  const supabase = createClient();
  const { error } = await supabase.from("services").update({ is_published: isPublished }).eq("id", id);
  if (error) return { success: false as const, error: error.message };
  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { success: true as const };
}
