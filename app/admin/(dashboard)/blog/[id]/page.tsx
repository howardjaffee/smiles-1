import { notFound } from "next/navigation";
import { Container } from "@/components/ui/primitives";
import { BlogEditorForm } from "@/components/admin/blog-editor-form";
import { getBlogPostForEdit, getBlogTaxonomy } from "@/lib/data/blog-admin";
import type { BlogPostFormValues } from "@/lib/validation/blog";

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const [post, { authors, categories, tags }] = await Promise.all([
    getBlogPostForEdit(params.id),
    getBlogTaxonomy(),
  ]);

  if (!post) notFound();

  const initialValues: BlogPostFormValues = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? "",
    content: post.content,
    featuredImageUrl: post.featured_image_url ?? "",
    featuredImageAlt: post.featured_image_alt ?? "",
    authorId: post.author_id ?? "",
    categoryId: post.category_id ?? "",
    tagIds: post.blog_post_tags?.map((t) => t.tag_id) ?? [],
    status: post.status,
    publishAt: post.publish_at ? post.publish_at.slice(0, 16) : "",
    seoTitle: post.seo_title ?? "",
    metaDescription: post.meta_description ?? "",
    focusKeyword: post.focus_keyword ?? "",
    canonicalUrl: post.canonical_url ?? "",
    ogImageUrl: post.og_image_url ?? "",
  };

  return (
    <Container className="max-w-none px-6 py-8 lg:px-10">
      <h1 className="font-display text-2xl text-ink">Edit post</h1>
      <p className="mt-1 text-sm text-ink-400">
        {post.source === "automation" ? "Originally created by an automation workflow." : "Manually created."}
      </p>

      <div className="mt-8">
        <BlogEditorForm
          mode="edit"
          postId={post.id}
          initialValues={initialValues}
          authors={authors}
          categories={categories}
          tags={tags}
        />
      </div>
    </Container>
  );
}
