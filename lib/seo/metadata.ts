import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface BuildMetadataInput {
  title?: string;
  description?: string;
  path?: string; // e.g. "/services/braces"
  imageUrl?: string | null;
  noIndex?: boolean;
  type?: "website" | "article";
}

/**
 * Central metadata builder so every page produces consistent title
 * formatting, canonical URLs, and Open Graph / Twitter tags from one
 * place. Pages should call this inside `generateMetadata` rather than
 * building the Metadata object by hand.
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  imageUrl,
  noIndex = false,
  type = "website",
}: BuildMetadataInput): Metadata {
  const siteUrl = siteConfig.seo.siteUrl;
  const fullTitle = title ? `${title} | ${siteConfig.brand.name}` : siteConfig.seo.defaultTitle;
  const desc = description || siteConfig.seo.defaultDescription;
  const url = new URL(path, siteUrl).toString();
  const ogImage = imageUrl ?? `${siteUrl}/images/og-default.jpg`;

  return {
    title: fullTitle,
    description: desc,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: siteConfig.brand.name,
      type,
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [ogImage],
    },
  };
}
