import { siteConfig } from "@/config/site";
import type { Tables } from "@/types/database";

/** Renders a JSON-LD payload as a script tag. Never pass unescaped user HTML. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

type ClinicSettings = Tables<"clinic_settings"> | null;

/**
 * Dentist / MedicalBusiness / LocalBusiness structured data. Only fields
 * with real, confirmed values are included — optional NAP fields that
 * are still null (address, hours, coordinates) are omitted rather than
 * emitted as empty strings, which would be invalid/misleading schema.
 */
export function buildDentistSchema(settings: ClinicSettings) {
  const s = settings;
  const siteUrl = siteConfig.seo.siteUrl;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["Dentist", "MedicalBusiness"],
    name: s?.clinic_name ?? siteConfig.brand.name,
    url: siteUrl,
    description: siteConfig.brand.shortDescription,
    telephone: s?.phone ?? undefined,
    priceRange: undefined, // omitted until real pricing tiers are confirmed
  };

  if (s?.address_line1 || s?.city) {
    schema.address = {
      "@type": "PostalAddress",
      streetAddress: [s?.address_line1, s?.address_line2].filter(Boolean).join(", ") || undefined,
      addressLocality: s?.city ?? undefined,
      addressRegion: s?.state ?? undefined,
      postalCode: s?.postal_code ?? undefined,
      addressCountry: s?.country ?? undefined,
    };
  }

  if (s?.latitude != null && s?.longitude != null) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: s.latitude,
      longitude: s.longitude,
    };
  }

  if (Array.isArray(s?.opening_hours) && (s?.opening_hours as unknown[]).length > 0) {
    schema.openingHoursSpecification = (
      s!.opening_hours as Array<{ dayOfWeek: string; opens: string; closes: string }>
    ).map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.dayOfWeek,
      opens: h.opens,
      closes: h.closes,
    }));
  }

  const sameAs = [s?.instagram_url, s?.facebook_url].filter(Boolean);
  if (sameAs.length) schema.sameAs = sameAs;

  schema.employee = {
    "@type": "Person",
    name: s?.doctor_name ?? siteConfig.doctor.name,
    jobTitle: s?.specialization ?? siteConfig.doctor.title,
    ...(s?.qualification || siteConfig.doctor.qualifications
      ? { hasCredential: s?.qualification ?? siteConfig.doctor.qualifications }
      : {}),
  };

  // Remove any top-level undefined keys for a clean payload.
  return Object.fromEntries(Object.entries(schema).filter(([, v]) => v !== undefined));
}

export function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.brand.name,
    url: siteConfig.seo.siteUrl,
  };
}

export function buildBreadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, siteConfig.seo.siteUrl).toString(),
    })),
  };
}

/** Only pass FAQs that are already filtered to is_published = true. */
export function buildFaqSchema(faqs: Array<{ question: string; answer: string }>) {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function buildServiceSchema(service: Tables<"services">) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.short_description,
    provider: {
      "@type": "Dentist",
      name: siteConfig.brand.name,
    },
    url: new URL(`/services/${service.slug}`, siteConfig.seo.siteUrl).toString(),
  };
}

export function buildArticleSchema(post: Tables<"blog_posts">, authorName?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.seo_title || post.title,
    description: post.meta_description || post.excerpt || undefined,
    image: post.og_image_url || post.featured_image_url || undefined,
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at,
    author: authorName ? { "@type": "Person", name: authorName } : undefined,
    mainEntityOfPage: new URL(`/blog/${post.slug}`, siteConfig.seo.siteUrl).toString(),
  };
}
