import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getPublishedServices } from "@/lib/data/services";
import { getPublishedBlogPosts } from "@/lib/data/blog";

const STATIC_PAGES = [
  "",
  "/about",
  "/services",
  "/orthodontics",
  "/before-after",
  "/reviews",
  "/faqs",
  "/blog",
  "/contact",
  "/book-appointment",
  "/privacy-policy",
  "/terms",
  "/medical-disclaimer",
];

/**
 * Dynamic sitemap. Only ever includes: static public pages, PUBLISHED
 * services, and PUBLISHED blog posts — drafts, scheduled, and archived
 * content never appear here, because the data layer (RLS + explicit
 * status filters) never returns them to begin with.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = siteConfig.seo.siteUrl;
  const [services, posts] = await Promise.all([getPublishedServices(), getPublishedBlogPosts()]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((path) => ({
    url: new URL(path, siteUrl).toString(),
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const serviceEntries: MetadataRoute.Sitemap = services.map((service) => ({
    url: new URL(`/services/${service.slug}`, siteUrl).toString(),
    lastModified: new Date(service.updated_at),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: new URL(`/blog/${post.slug}`, siteUrl).toString(),
    lastModified: new Date(post.updated_at),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...serviceEntries, ...postEntries];
}
