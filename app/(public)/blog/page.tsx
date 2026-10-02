import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/hero";
import { Container, EmptyState, Badge } from "@/components/ui/primitives";
import { getPublishedBlogPosts } from "@/lib/data/blog";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatDate, estimateReadingTime, truncate } from "@/lib/utils/format";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description: "Dental and orthodontic care articles from Alignora Smiles.",
  path: "/blog",
});

export const revalidate = 120;

export default async function BlogIndexPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <>
      <PageHero eyebrow="Blog" title="Dental & orthodontic care, explained" />

      <Container className="py-16 lg:py-24">
        {posts.length === 0 ? (
          <EmptyState
            title="The blog is just getting started"
            description="New articles will appear here as soon as the clinic publishes them."
          />
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-lg border border-ink-100 bg-white p-6 transition-shadow hover:shadow-card"
              >
                {post.blog_categories && <Badge tone="teal">{post.blog_categories.name}</Badge>}
                <h2 className="mt-3 font-display text-lg text-ink group-hover:text-teal-700">
                  {post.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">
                  {truncate(post.excerpt || post.content.replace(/[#*_>-]/g, ""), 140)}
                </p>
                <p className="mt-4 text-xs text-ink-400">
                  {formatDate(post.published_at)} · {estimateReadingTime(post.content)} min read
                </p>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
