import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { automationBlogDraftSchema } from "@/lib/validation/blog";

/**
 * POST /api/automation/blog-draft
 *
 * Lets an external workflow (n8n, Make, Zapier, or a custom keyword-
 * research/content pipeline) create a blog DRAFT for editorial review.
 * This endpoint can NEVER publish directly — the schema only accepts
 * status "DRAFT" or "REVIEW" (defaulting to "REVIEW"), and there is no
 * code path here that sets PUBLISHED. A human must open the post in
 * /admin/blog and explicitly publish or schedule it.
 *
 * Auth: a static bearer secret (AUTOMATION_API_SECRET), separate from
 * CRON_SECRET so the two can be rotated independently. For anything
 * beyond a single trusted workflow, consider upgrading this to
 * per-integration keys stored in a database table instead of one shared
 * env var.
 *
 * Example request:
 *   POST /api/automation/blog-draft
 *   Authorization: Bearer <AUTOMATION_API_SECRET>
 *   Content-Type: application/json
 *   {
 *     "title": "...", "slug": "...", "content": "...",
 *     "category": "Orthodontics", "tags": ["braces"],
 *     "seoTitle": "...", "metaDescription": "...", "focusKeyword": "...",
 *     "publishAt": "2026-10-01T09:00:00Z"
 *   }
 */
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expected = process.env.AUTOMATION_API_SECRET;

  if (!expected) {
    return NextResponse.json(
      { error: "Automation API is not configured (AUTOMATION_API_SECRET is unset)." },
      { status: 503 }
    );
  }
  if (authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = automationBlogDraftSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const input = parsed.data;
  const supabase = createAdminClient();

  // Resolve category by name if provided, creating it if it doesn't exist yet.
  let categoryId: string | null = null;
  if (input.category) {
    const slug = input.category.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const { data: existing } = await supabase.from("blog_categories").select("id").eq("slug", slug).single();
    if (existing) {
      categoryId = existing.id;
    } else {
      const { data: created } = await supabase
        .from("blog_categories")
        .insert({ slug, name: input.category })
        .select("id")
        .single();
      categoryId = created?.id ?? null;
    }
  }

  const { data: post, error } = await supabase
    .from("blog_posts")
    .insert({
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt ?? null,
      content: input.content,
      featured_image_url: input.featuredImage ?? null,
      category_id: categoryId,
      status: input.status, // DRAFT or REVIEW only — never PUBLISHED
      publish_at: null, // set only later, by a human, when they schedule it
      seo_title: input.seoTitle ?? null,
      meta_description: input.metaDescription ?? null,
      focus_keyword: input.focusKeyword ?? null,
      source: "automation",
    })
    .select("id, slug")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Resolve/attach tags by name, creating any that don't exist yet.
  if (input.tags?.length) {
    const tagIds: string[] = [];
    for (const tagName of input.tags) {
      const slug = tagName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const { data: existingTag } = await supabase.from("blog_tags").select("id").eq("slug", slug).single();
      if (existingTag) {
        tagIds.push(existingTag.id);
      } else {
        const { data: createdTag } = await supabase
          .from("blog_tags")
          .insert({ slug, name: tagName })
          .select("id")
          .single();
        if (createdTag) tagIds.push(createdTag.id);
      }
    }
    if (tagIds.length) {
      await supabase.from("blog_post_tags").insert(tagIds.map((tagId) => ({ post_id: post.id, tag_id: tagId })));
    }
  }

  // NOTE: no notification is sent here. To notify the clinic when a new
  // draft arrives (per the "notify admin" step in the automation
  // workflow), wire up an email/Slack call here, or have your n8n/Make
  // workflow send its own notification after this call succeeds.

  return NextResponse.json(
    { id: post.id, slug: post.slug, status: input.status, editUrl: `/admin/blog/${post.id}` },
    { status: 201 }
  );
}
