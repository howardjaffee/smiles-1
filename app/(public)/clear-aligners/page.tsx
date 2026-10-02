import type { Metadata } from "next";
import { getServiceBySlug } from "@/lib/data/services";
import { buildMetadata } from "@/lib/seo/metadata";
import { ServiceDetailView, ServiceComingSoon } from "@/components/sections/service-detail-view";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const service = await getServiceBySlug("clear-aligners");
  return buildMetadata({
    title: service?.seo_title || "Clear Aligners",
    description:
      service?.meta_description ||
      "Removable, near-invisible aligners as an alternative to traditional braces for suitable cases.",
    path: "/clear-aligners",
  });
}

export default async function ClearAlignersPage() {
  const service = await getServiceBySlug("clear-aligners");

  if (!service) {
    return (
      <ServiceComingSoon
        title="Clear Aligners"
        description="Removable, near-invisible aligners as an alternative to traditional braces for suitable cases."
      />
    );
  }

  return <ServiceDetailView service={service} breadcrumbPath="/clear-aligners" />;
}
