import { AlertTriangle } from "lucide-react";
import { siteConfig } from "@/config/site";

/**
 * A simple, honest SEO preview: shows how the page will likely appear in
 * Google, plus character-count guidance and missing-field warnings. Does
 * NOT claim these values affect rankings — see the note at the bottom.
 */
export function SeoPreview({
  path,
  seoTitle,
  metaDescription,
  fallbackTitle,
}: {
  path: string;
  seoTitle: string;
  metaDescription: string;
  fallbackTitle: string;
}) {
  const title = seoTitle || fallbackTitle;
  const url = `${siteConfig.seo.siteUrl.replace(/^https?:\/\//, "")}${path}`;
  const warnings: string[] = [];

  if (!seoTitle) warnings.push("No SEO title set — falling back to the post title.");
  else if (seoTitle.length > 60) warnings.push("SEO title is longer than the ~60 characters Google usually shows.");
  if (!metaDescription) warnings.push("No meta description set — Google will auto-generate one from your content.");
  else if (metaDescription.length > 160) warnings.push("Meta description is longer than the ~160 characters Google usually shows.");

  return (
    <div className="rounded-lg border border-ink-100 bg-white p-4">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-400">Google search preview</p>
      <div className="max-w-lg">
        <p className="truncate text-sm text-ink-400">{url}</p>
        <p className="mt-0.5 truncate text-lg text-[#1a0dab]">{title}</p>
        <p className="mt-0.5 line-clamp-2 text-sm text-ink-500">
          {metaDescription || "A description will be generated automatically if you don't set one."}
        </p>
      </div>

      {warnings.length > 0 && (
        <ul className="mt-4 space-y-1.5 border-t border-ink-100 pt-3">
          {warnings.map((w) => (
            <li key={w} className="flex items-start gap-2 text-xs text-amber-700">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              {w}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-3 text-xs text-ink-300">
        Good SEO fields help search engines understand this page — they don&apos;t guarantee a
        ranking.
      </p>
    </div>
  );
}
