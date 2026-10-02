"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { blogPostSchema, type BlogPostFormValues } from "@/lib/validation/blog";

export type BlogActionResult =
  | { success: true; id: string }
  | { success: false; error: string; fieldErrors?: Partial<Record<keyof BlogPostFormValues, string>> };

function validate(values: BlogPostFormValues): BlogActionResult | null {
  const parsed = blogPostSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof BlogPostFormValues, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof BlogPostFormValues;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { success: false, error: "Please check the highlighted fields.", fieldErrors };
  }
  return null;
}

/**
 * Maps the admin form's status + publishAt into the fields the database
 * actually needs. A post only gets published_at set the moment it
 * actually becomes PUBLISHED — either chosen directly here, or later by
 * the scheduled-publish cron (see app/api/cron/publish-scheduled).
 */
function toRow(values: BlogPostFormValues) {
  const now = new Date().toISOString();
  return {
    title: values.title,
    slug: values.slug,
    excerpt: values.excerpt || null,
    content: values.content,
    featured_image_url: values.featuredImageUrl || null,
    featured_image_alt: values.featuredImageAlt || null,
    author_id: values.authorId || null,
    category_id: values.categoryId || null,
    status: values.status,
    publish_at: values.status === "SCHEDULED" ? values.publishAt || null : null,
    published_at: values.status === "PUBLISHED" ? now : null,
    seo_title: values.seoTitle || null,
    meta_description: values.metaDescription || null,
    focus_keyword: values.focusKeyword || null,
    canonical_url: values.canonicalUrl || null,
    og_image_url: values.ogImageUrl || null,
  };
}

export async function createBlogPost(values: BlogPostFormValues): Promise<BlogActionResult> {
  const validationError = validate(values);
  if (validationError) return validationError;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .insert({ ...toRow(values), source: "manual" })
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };

  if (values.tagIds?.length) {
    await supabase
      .from("blog_post_tags")
      .insert(values.tagIds.map((tagId) => ({ post_id: data.id, tag_id: tagId })));
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { success: true, id: data.id };
}

export async function updateBlogPost(id: string, values: BlogPostFormValues): Promise<BlogActionResult> {
  const validationError = validate(values);
  if (validationError) return validationError;

  const supabase = createClient();
  const { error } = await supabase.from("blog_posts").update(toRow(values)).eq("id", id);
  if (error) return { success: false, error: error.message };

  if (values.tagIds) {
    await supabase.from("blog_post_tags").delete().eq("post_id", id);
    if (values.tagIds.length) {
      await supabase
        .from("blog_post_tags")
        .insert(values.tagIds.map((tagId) => ({ post_id: id, tag_id: tagId })));
    }
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${values.slug}`);
  return { success: true, id };
}

export async function deleteBlogPost(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) return { success: false as const, error: error.message };
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { success: true as const };
}

export async function duplicateBlogPost(id: string) {
  const supabase = createClient();
  const { data: original, error: fetchError } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !original) return { success: false as const, error: "Post not found." };

  const { data: copy, error: insertError } = await supabase
    .from("blog_posts")
    .insert({
      ...original,
      id: undefined,
      slug: `${original.slug}-copy`,
      title: `${original.title} (Copy)`,
      status: "DRAFT",
      publish_at: null,
      published_at: null,
      created_at: undefined,
      updated_at: undefined,
    })
    .select("id")
    .single();

  if (insertError) return { success: false as const, error: insertError.message };
  revalidatePath("/admin/blog");
  redirect(`/admin/blog/${copy.id}`);
}
