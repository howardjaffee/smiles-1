import type { Metadata } from "next";
import { PageHero } from "@/components/sections/hero";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { CTABanner } from "@/components/sections/cta-and-blog-preview";
import { getPublishedTestimonials } from "@/lib/data/content";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Reviews",
  description: "Read genuine reviews from Alignora Smiles patients.",
  path: "/reviews",
});

export const revalidate = 300;

export default async function ReviewsPage() {
  const testimonials = await getPublishedTestimonials();

  return (
    <>
      <PageHero
        eyebrow="Reviews"
        title="Patient reviews"
        description="We only publish genuine reviews from real patients — never fabricated ones."
      />
      <TestimonialsSection testimonials={testimonials} />
      <CTABanner />
    </>
  );
}
