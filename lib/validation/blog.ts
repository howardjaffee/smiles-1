import { z } from "zod";

export const blogStatusEnum = z.enum(["DRAFT", "REVIEW", "SCHEDULED", "PUBLISHED", "ARCHIVED"]);

/** Used by the admin blog editor form. */
export const blogPostSchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, hyphen-separated."),
  excerpt: z.string().trim().max(300).optional().or(z.literal("")),
  content: z.string().trim().min(20, "Content is too short."),
  featuredImageUrl: z.string().url().optional().or(z.literal("")),
  featuredImageAlt: z.string().trim().max(200).optional().or(z.literal("")),
  authorId: z.string().uuid().optional().or(z.literal("")),
  categoryId: z.string().uuid().optional().or(z.literal("")),
  tagIds: z.array(z.string().uuid()).optional(),
  status: blogStatusEnum,
  publishAt: z.string().optional().or(z.literal("")),
  seoTitle: z.string().trim().max(70).optional().or(z.literal("")),
  metaDescription: z.string().trim().max(160).optional().or(z.literal("")),
  focusKeyword: z.string().trim().max(100).optional().or(z.literal("")),
  canonicalUrl: z.string().url().optional().or(z.literal("")),
  ogImageUrl: z.string().url().optional().or(z.literal("")),
});

export type BlogPostFormValues = z.infer<typeof blogPostSchema>;

/**
 * Stricter, automation-facing schema for POST /api/automation/blog-draft.
 * Deliberately excludes `status: PUBLISHED` — automated submissions can
 * only ever land as DRAFT or REVIEW, never live, per the "never
 * auto-publish AI-generated medical content without approval" rule.
 */
export const automationBlogDraftSchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().trim().max(300).optional(),
  content: z.string().trim().min(20),
  category: z.string().trim().max(100).optional(),
  tags: z.array(z.string().trim().max(50)).max(10).optional(),
  featuredImage: z.string().url().optional(),
  seoTitle: z.string().trim().max(70).optional(),
  metaDescription: z.string().trim().max(160).optional(),
  focusKeyword: z.string().trim().max(100).optional(),
  publishAt: z.string().datetime().optional(),
  status: z.enum(["DRAFT", "REVIEW"]).default("REVIEW"),
});

export type AutomationBlogDraftInput = z.infer<typeof automationBlogDraftSchema>;
