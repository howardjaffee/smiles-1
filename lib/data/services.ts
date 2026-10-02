import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export async function getPublishedServices(): Promise<Tables<"services">[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true });
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getServiceBySlug(slug: string): Promise<Tables<"services"> | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}
