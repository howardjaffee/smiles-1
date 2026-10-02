import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { ServicesGrid } from "@/components/sections/services-grid";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { CTABanner, BlogPreviewSection } from "@/components/sections/cta-and-blog-preview";
import { getClinicSettings } from "@/lib/data/clinic";
import { getPublishedServices } from "@/lib/data/services";
import { getPublishedTestimonials, getPublishedFaqs } from "@/lib/data/content";
import { getPublishedBlogPosts } from "@/lib/data/blog";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({ path: "/" });

export const revalidate = 300;

export default async function HomePage() {
  const [settings, services, testimonials, faqs, posts] = await Promise.all([
    getClinicSettings(),
    getPublishedServices(),
    getPublishedTestimonials(),
    getPublishedFaqs(),
    getPublishedBlogPosts(),
  ]);

  return (
    <>
      <Hero settings={settings} />
      <ServicesGrid services={services} />
      <TestimonialsSection testimonials={testimonials} />
      <BlogPreviewSection posts={posts} />
      <FaqAccordion faqs={faqs.slice(0, 5)} heading="Common questions" />
      <CTABanner />
    </>
  );
}
