import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Container, Badge } from "@/components/ui/primitives";
import { CTABanner } from "@/components/sections/cta-and-blog-preview";
import { getBlogPostBySlug, getAllPublishedSlugs } from "@/lib/data/blog";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd, buildArticleSchema, buildBreadcrumbSchema } from "@/lib/seo/json-ld";
import { formatDate, estimateReadingTime } from "@/lib/utils/format";

export const revalidate = 120;

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return buildMetadata({ path: `/blog/${params.slug}`, noIndex: true });

  return buildMetadata({
    title: post.seo_title || post.title,
    description: post.meta_description || post.excerpt || undefined,
    path: `/blog/${post.slug}`,
    imageUrl: post.og_image_url || post.featured_image_url,
    noIndex: post.robots_noindex,
    type: "article",
  });
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <>
      <JsonLd data={buildArticleSchema(post, post.authors?.name)} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />

      <article className="py-14 lg:py-20">
        <Container className="max-w-3xl">
          {post.blog_categories && <Badge tone="teal">{post.blog_categories.name}</Badge>}
          <h1 className="mt-3 font-display text-3xl leading-tight text-ink sm:text-4xl">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-ink-400">
            {post.authors?.name && <span>{post.authors.name}</span>}
            <span>·</span>
            <span>{formatDate(post.published_at)}</span>
            <span>·</span>
            <span>{estimateReadingTime(post.content)} min read</span>
          </div>

          {post.featured_image_url && (
            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-lg bg-ink-50">
              <Image
                src={post.featured_image_url}
                alt={post.featured_image_alt || post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="prose prose-neutral mt-10 max-w-none prose-headings:font-display prose-a:text-teal-600">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>
        </Container>
      </article>

      <CTABanner />
    </>
  );
}
