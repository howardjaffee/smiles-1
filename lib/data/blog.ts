import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export type BlogPostWithRelations = Tables<"blog_posts"> & {
  authors: Pick<Tables<"authors">, "id" | "name" | "avatar_url"> | null;
  blog_categories: Pick<Tables<"blog_categories">, "id" | "name" | "slug"> | null;
};

/**
 * Public blog listing. RLS already restricts the anon role to
 * status = PUBLISHED with publish_at in the past, but we defensively
 * filter again client-side in case a future policy change widens access.
 */
export async function getPublishedBlogPosts(): Promise<BlogPostWithRelations[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*, authors(id, name, avatar_url), blog_categories(id, name, slug)")
      .eq("status", "PUBLISHED")
      .order("published_at", { ascending: false });
    if (error) return [];
    return (data ?? []) as BlogPostWithRelations[];
  } catch {
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostWithRelations | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*, authors(id, name, avatar_url), blog_categories(id, name, slug)")
      .eq("slug", slug)
      .eq("status", "PUBLISHED")
      .single();
    if (error) return null;
    return data as BlogPostWithRelations;
  } catch {
    return null;
  }
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("slug")
      .eq("status", "PUBLISHED");
    if (error) return [];
    return (data ?? []).map((row) => row.slug);
  } catch {
    return [];
  }
}
