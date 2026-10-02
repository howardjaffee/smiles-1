import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Called on a schedule (see vercel.json) to flip SCHEDULED posts whose
 * publish_at has arrived over to PUBLISHED, then revalidate the pages
 * that need to reflect it — no manual deploy required.
 *
 * Protected by CRON_SECRET: Vercel Cron sends this automatically as a
 * Bearer token when the route is defined in vercel.json; anyone else
 * calling this URL directly needs the same secret.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const nowIso = new Date().toISOString();

  const { data: duePosts, error: fetchError } = await supabase
    .from("blog_posts")
    .select("id, slug")
    .eq("status", "SCHEDULED")
    .lte("publish_at", nowIso);

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (!duePosts || duePosts.length === 0) {
    return NextResponse.json({ published: 0 });
  }

  const ids = duePosts.map((p) => p.id);
  const { error: updateError } = await supabase
    .from("blog_posts")
    .update({ status: "PUBLISHED", published_at: nowIso })
    .in("id", ids);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Refresh the sitemap, blog index, and each newly-published post page.
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  for (const post of duePosts) {
    revalidatePath(`/blog/${post.slug}`);
  }

  return NextResponse.json({ published: duePosts.length, slugs: duePosts.map((p) => p.slug) });
}
