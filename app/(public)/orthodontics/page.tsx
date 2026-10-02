import type { Metadata } from "next";
import { getServiceBySlug } from "@/lib/data/services";
import { buildMetadata } from "@/lib/seo/metadata";
import { ServiceDetailView, ServiceComingSoon } from "@/components/sections/service-detail-view";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const service = await getServiceBySlug("orthodontics");
  return buildMetadata({
    title: service?.seo_title || "Orthodontics",
    description:
      service?.meta_description ||
      "Orthodontic treatment including braces, led by an orthodontist specializing in bite correction.",
    path: "/orthodontics",
  });
}

export default async function OrthodonticsPage() {
  const service = await getServiceBySlug("orthodontics");

  if (!service) {
    return (
      <ServiceComingSoon
        title="Orthodontics"
        description="Braces and orthodontic treatment to align teeth and correct bite issues, led by an orthodontist."
      />
    );
  }

  return <ServiceDetailView service={service} breadcrumbPath="/orthodontics" />;
}
