import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export async function getAllBlogPostsForAdmin() {
  const supabase = createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*, authors(name), blog_categories(name)")
    .order("updated_at", { ascending: false });
  return (data ?? []) as (Tables<"blog_posts"> & {
    authors: { name: string } | null;
    blog_categories: { name: string } | null;
  })[];
}

export async function getBlogPostForEdit(id: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*, blog_post_tags(tag_id)")
    .eq("id", id)
    .single();
  return data as (Tables<"blog_posts"> & { blog_post_tags: { tag_id: string }[] }) | null;
}

export async function getBlogTaxonomy() {
  const supabase = createClient();
  const [authors, categories, tags] = await Promise.all([
    supabase.from("authors").select("*").order("name"),
    supabase.from("blog_categories").select("*").order("name"),
    supabase.from("blog_tags").select("*").order("name"),
  ]);
  return {
    authors: (authors.data ?? []) as Tables<"authors">[],
    categories: (categories.data ?? []) as Tables<"blog_categories">[],
    tags: (tags.data ?? []) as Tables<"blog_tags">[],
  };
}
