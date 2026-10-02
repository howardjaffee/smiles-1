import { Container } from "@/components/ui/primitives";
import { BlogEditorForm } from "@/components/admin/blog-editor-form";
import { getBlogTaxonomy } from "@/lib/data/blog-admin";
import type { BlogPostFormValues } from "@/lib/validation/blog";

const emptyValues: BlogPostFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featuredImageUrl: "",
  featuredImageAlt: "",
  authorId: "",
  categoryId: "",
  tagIds: [],
  status: "DRAFT",
  publishAt: "",
  seoTitle: "",
  metaDescription: "",
  focusKeyword: "",
  canonicalUrl: "",
  ogImageUrl: "",
};

export default async function NewBlogPostPage() {
  const { authors, categories, tags } = await getBlogTaxonomy();

  return (
    <Container className="max-w-none px-6 py-8 lg:px-10">
      <h1 className="font-display text-2xl text-ink">New blog post</h1>
      <p className="mt-1 text-sm text-ink-400">Write, add SEO details, and publish or schedule.</p>

      <div className="mt-8">
        <BlogEditorForm mode="create" initialValues={emptyValues} authors={authors} categories={categories} tags={tags} />
      </div>
    </Container>
  );
}
