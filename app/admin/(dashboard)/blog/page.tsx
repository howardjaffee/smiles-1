import Link from "next/link";
import { Plus } from "lucide-react";
import { Container, EmptyState, Badge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { getAllBlogPostsForAdmin } from "@/lib/data/blog-admin";
import { formatDate } from "@/lib/utils/format";
import type { BlogStatus } from "@/types/database";

const statusTone: Record<BlogStatus, "amber" | "teal" | "ink"> = {
  DRAFT: "ink",
  REVIEW: "amber",
  SCHEDULED: "amber",
  PUBLISHED: "teal",
  ARCHIVED: "ink",
};

export default async function AdminBlogListPage() {
  const posts = await getAllBlogPostsForAdmin();

  return (
    <Container className="max-w-none px-6 py-8 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ink">Blog</h1>
          <p className="mt-1 text-sm text-ink-400">Write, schedule, and publish articles.</p>
        </div>
        <Button href="/admin/blog/new">
          <Plus className="h-4 w-4" aria-hidden /> New post
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No blog posts yet"
            description="Write your first post to start building an audience."
            action={<Button href="/admin/blog/new">Write a post</Button>}
          />
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-lg border border-ink-100 bg-white">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-ink-100 bg-ink-50/60 text-xs uppercase tracking-wide text-ink-400">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Author</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-ink-50/40">
                  <td className="px-4 py-3">
                    <Link href={`/admin/blog/${post.id}`} className="font-medium text-ink hover:text-teal-600">
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink-500">{post.blog_categories?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-500">{post.authors?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge tone={statusTone[post.status]}>{post.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-ink-400">{formatDate(post.updated_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  );
}
