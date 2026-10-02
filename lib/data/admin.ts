import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export async function getCurrentProfile(): Promise<Tables<"profiles"> | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return data;
}

export interface DashboardSummary {
  pendingAppointments: number;
  confirmedAppointments: number;
  publishedPosts: number;
  draftPosts: number;
  scheduledPosts: number;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const supabase = createClient();

  const [pending, confirmed, published, draft, scheduled] = await Promise.all([
    supabase.from("appointments").select("id", { count: "exact", head: true }).eq("status", "PENDING"),
    supabase.from("appointments").select("id", { count: "exact", head: true }).eq("status", "CONFIRMED"),
    supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("status", "PUBLISHED"),
    supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("status", "DRAFT"),
    supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("status", "SCHEDULED"),
  ]);

  return {
    pendingAppointments: pending.count ?? 0,
    confirmedAppointments: confirmed.count ?? 0,
    publishedPosts: published.count ?? 0,
    draftPosts: draft.count ?? 0,
    scheduledPosts: scheduled.count ?? 0,
  };
}
