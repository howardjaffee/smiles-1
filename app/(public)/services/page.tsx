import type { Metadata } from "next";
import { PageHero } from "@/components/sections/hero";
import { ServicesGrid } from "@/components/sections/services-grid";
import { Container } from "@/components/ui/primitives";
import { EmptyState } from "@/components/ui/primitives";
import { getPublishedServices } from "@/lib/data/services";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd, buildBreadcrumbSchema } from "@/lib/seo/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Dental & Orthodontic Services",
  description: "Explore dental and orthodontic services, including braces and orthodontic treatment.",
  path: "/services",
});

export const revalidate = 300;

export default async function ServicesIndexPage() {
  const services = await getPublishedServices();

  return (
    <>
      <JsonLd data={buildBreadcrumbSchema([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }])} />
      <PageHero
        eyebrow="Services"
        title="Dental & orthodontic care, in one place"
        description="Every service below is reviewed and published by the clinic. If you don't see what you're looking for, get in touch — we're happy to advise."
      />
      {services.length === 0 ? (
        <Container className="py-16">
          <EmptyState
            title="Services are being finalized"
            description="Our services list is being confirmed and will appear here shortly. In the meantime, please call or book a consultation to discuss your needs."
          />
        </Container>
      ) : (
        <ServicesGrid services={services} heading="All services" showAll={false} />
      )}
    </>
  );
}
