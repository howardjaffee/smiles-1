import type { Metadata } from "next";
import { getServiceBySlug } from "@/lib/data/services";
import { buildMetadata } from "@/lib/seo/metadata";
import { ServiceDetailView, ServiceComingSoon } from "@/components/sections/service-detail-view";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const service = await getServiceBySlug("braces");
  return buildMetadata({
    title: service?.seo_title || "Braces",
    description:
      service?.meta_description ||
      "Traditional and modern braces options for straightening teeth over a tailored treatment plan.",
    path: "/braces",
  });
}

export default async function BracesPage() {
  const service = await getServiceBySlug("braces");

  if (!service) {
    return (
      <ServiceComingSoon
        title="Braces"
        description="Traditional and modern braces options for straightening teeth over a treatment plan tailored to each patient."
      />
    );
  }

  return <ServiceDetailView service={service} breadcrumbPath="/braces" />;
}
