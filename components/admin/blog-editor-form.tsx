"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import { Loader2, Trash2, Copy } from "lucide-react";
import { Input, Textarea, Label, Select, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/primitives";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import { SeoPreview } from "@/components/admin/seo-preview";
import { blogPostSchema, type BlogPostFormValues } from "@/lib/validation/blog";
import { createBlogPost, updateBlogPost, deleteBlogPost, duplicateBlogPost } from "@/lib/actions/blog-admin";
import type { Tables } from "@/types/database";

interface Props {
  mode: "create" | "edit";
  postId?: string;
  initialValues: BlogPostFormValues;
  authors: Tables<"authors">[];
  categories: Tables<"blog_categories">[];
  tags: Tables<"blog_tags">[];
}

export function BlogEditorForm({ mode, postId, initialValues, authors, categories, tags }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<BlogPostFormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof BlogPostFormValues, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [isPending, startTransition] = useTransition();

  function update<K extends keyof BlogPostFormValues>(key: K, value: BlogPostFormValues[K]) {
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !slugTouched) {
        next.slug = slugify(String(value), { lower: true, strict: true });
      }
      return next;
    });
  }

  function toggleTag(tagId: string) {
    setValues((prev) => {
      const current = prev.tagIds ?? [];
      const tagIds = current.includes(tagId) ? current.filter((t) => t !== tagId) : [...current, tagId];
      return { ...prev, tagIds };
    });
  }

  function handleSubmit(status?: BlogPostFormValues["status"]) {
    const submission = status ? { ...values, status } : values;
    const parsed = blogPostSchema.safeParse(submission);

    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof BlogPostFormValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof BlogPostFormValues;
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      setServerError("Please check the highlighted fields.");
      return;
    }

    setErrors({});
    setServerError(null);

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createBlogPost(parsed.data)
          : await updateBlogPost(postId!, parsed.data);

      if (result.success) {
        router.push(`/admin/blog/${result.id}`);
        router.refresh();
      } else {
        setServerError(result.error);
        if (result.fieldErrors) setErrors(result.fieldErrors);
      }
    });
  }

  function handleDelete() {
    if (!postId) return;
    if (!confirm("Delete this post permanently? This can't be undone.")) return;
    startTransition(async () => {
      await deleteBlogPost(postId);
      router.push("/admin/blog");
    });
  }

  function handleDuplicate() {
    if (!postId) return;
    startTransition(() => duplicateBlogPost(postId));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
      <div className="space-y-6">
        <Card>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={values.title} onChange={(e) => update("title", e.target.value)} aria-invalid={!!errors.title} />
          <FieldError>{errors.title}</FieldError>

          <div className="mt-4">
            <Label htmlFor="slug">URL slug</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-ink-400">/blog/</span>
              <Input
                id="slug"
                value={values.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  update("slug", e.target.value);
                }}
                aria-invalid={!!errors.slug}
              />
            </div>
            <FieldError>{errors.slug}</FieldError>
          </div>

          <div className="mt-4">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={values.excerpt}
              onChange={(e) => update("excerpt", e.target.value)}
              placeholder="A short summary shown on the blog listing page."
            />
          </div>
        </Card>

        <Card>
          <Label>Content</Label>
          <MarkdownEditor value={values.content} onChange={(v) => update("content", v)} />
          <FieldError>{errors.content}</FieldError>
        </Card>

        <Card>
          <h3 className="font-display text-lg text-ink">Featured image</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="featuredImageUrl">Image URL</Label>
              <Input
                id="featuredImageUrl"
                value={values.featuredImageUrl}
                onChange={(e) => update("featuredImageUrl", e.target.value)}
                placeholder="Uploaded via Supabase Storage"
              />
              <FieldError>{errors.featuredImageUrl}</FieldError>
            </div>
            <div>
              <Label htmlFor="featuredImageAlt">Alt text</Label>
              <Input
                id="featuredImageAlt"
                value={values.featuredImageAlt}
                onChange={(e) => update("featuredImageAlt", e.target.value)}
              />
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-display text-lg text-ink">SEO</h3>
          <div className="mt-4 space-y-4">
            <div>
              <Label htmlFor="seoTitle">SEO title</Label>
              <Input id="seoTitle" value={values.seoTitle} onChange={(e) => update("seoTitle", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="metaDescription">Meta description</Label>
              <Textarea
                id="metaDescription"
                value={values.metaDescription}
                onChange={(e) => update("metaDescription", e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="focusKeyword">Focus keyword</Label>
                <Input id="focusKeyword" value={values.focusKeyword} onChange={(e) => update("focusKeyword", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="canonicalUrl">Canonical URL</Label>
                <Input id="canonicalUrl" value={values.canonicalUrl} onChange={(e) => update("canonicalUrl", e.target.value)} />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <SeoPreview
              path={`/blog/${values.slug || "your-post-slug"}`}
              seoTitle={values.seoTitle || ""}
              metaDescription={values.metaDescription || ""}
              fallbackTitle={values.title || "Untitled post"}
            />
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <h3 className="font-display text-lg text-ink">Publish</h3>
          <div className="mt-4">
            <Label htmlFor="status">Status</Label>
            <Select id="status" value={values.status} onChange={(e) => update("status", e.target.value as BlogPostFormValues["status"])}>
              <option value="DRAFT">Draft</option>
              <option value="REVIEW">Review</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </Select>
          </div>

          {values.status === "SCHEDULED" && (
            <div className="mt-4">
              <Label htmlFor="publishAt">Publish date & time</Label>
              <Input
                id="publishAt"
                type="datetime-local"
                value={values.publishAt}
                onChange={(e) => update("publishAt", e.target.value)}
              />
              <p className="mt-1.5 text-xs text-ink-400">
                Automatically goes live at this time via the scheduled-publish job — no manual
                deploy needed.
              </p>
            </div>
          )}

          {serverError && (
            <p className="mt-4 text-sm text-red-600" role="alert">
              {serverError}
            </p>
          )}

          <div className="mt-5 flex flex-col gap-2">
            <Button type="button" onClick={() => handleSubmit()} disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              {mode === "create" ? "Save post" : "Save changes"}
            </Button>
            {values.status !== "PUBLISHED" && (
              <Button type="button" variant="outline" onClick={() => handleSubmit("PUBLISHED")} disabled={isPending}>
                Publish now
              </Button>
            )}
          </div>

          {mode === "edit" && (
            <div className="mt-4 flex gap-2 border-t border-ink-100 pt-4">
              <Button type="button" variant="ghost" size="sm" onClick={handleDuplicate} disabled={isPending}>
                <Copy className="h-4 w-4" aria-hidden /> Duplicate
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={handleDelete} disabled={isPending} className="text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4" aria-hidden /> Delete
              </Button>
            </div>
          )}
        </Card>

        <Card>
          <h3 className="font-display text-lg text-ink">Organize</h3>
          <div className="mt-4">
            <Label htmlFor="authorId">Author</Label>
            <Select id="authorId" value={values.authorId} onChange={(e) => update("authorId", e.target.value)}>
              <option value="">Select author</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="mt-4">
            <Label htmlFor="categoryId">Category</Label>
            <Select id="categoryId" value={values.categoryId} onChange={(e) => update("categoryId", e.target.value)}>
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="mt-4">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const active = values.tagIds?.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`rounded-sm border px-2.5 py-1 text-xs font-medium ${
                      active ? "border-teal bg-teal-50 text-teal-700" : "border-ink-200 text-ink-500"
                    }`}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
