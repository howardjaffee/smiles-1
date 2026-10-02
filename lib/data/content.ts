import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export async function getPublishedTestimonials(): Promise<Tables<"testimonials">[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getPublishedFaqs(): Promise<Tables<"faqs">[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true });
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getPublishedBeforeAfterCases(): Promise<Tables<"before_after_cases">[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("before_after_cases")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}
