"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { faqSchema, type FaqFormValues } from "@/lib/validation/content";

export async function createFaq(values: FaqFormValues) {
  const parsed = faqSchema.safeParse(values);
  if (!parsed.success) return { success: false as const, error: "Please check the form fields." };

  const supabase = createClient();
  const { error } = await supabase.from("faqs").insert({
    question: parsed.data.question,
    answer: parsed.data.answer,
    display_order: parsed.data.displayOrder,
    is_published: parsed.data.isPublished,
  });
  if (error) return { success: false as const, error: error.message };

  revalidatePath("/admin/faqs");
  revalidatePath("/faqs");
  revalidatePath("/");
  return { success: true as const };
}

export async function deleteFaq(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) return { success: false as const, error: error.message };
  revalidatePath("/admin/faqs");
  revalidatePath("/faqs");
  return { success: true as const };
}

export async function toggleFaqPublished(id: string, isPublished: boolean) {
  const supabase = createClient();
  const { error } = await supabase.from("faqs").update({ is_published: isPublished }).eq("id", id);
  if (error) return { success: false as const, error: error.message };
  revalidatePath("/admin/faqs");
  revalidatePath("/faqs");
  revalidatePath("/");
  return { success: true as const };
}

export async function updateFaqOrder(id: string, displayOrder: number) {
  const supabase = createClient();
  const { error } = await supabase.from("faqs").update({ display_order: displayOrder }).eq("id", id);
  if (error) return { success: false as const, error: error.message };
  revalidatePath("/admin/faqs");
  revalidatePath("/faqs");
  return { success: true as const };
}
