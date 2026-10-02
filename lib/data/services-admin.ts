import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export async function getAllServicesForAdmin(): Promise<Tables<"services">[]> {
  const supabase = createClient();
  const { data } = await supabase.from("services").select("*").order("display_order", { ascending: true });
  return data ?? [];
}

export async function getServiceForEdit(id: string): Promise<Tables<"services"> | null> {
  const supabase = createClient();
  const { data } = await supabase.from("services").select("*").eq("id", id).single();
  return data;
}
