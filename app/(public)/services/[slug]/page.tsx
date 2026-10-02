import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug, getPublishedServices } from "@/lib/data/services";
import { buildMetadata } from "@/lib/seo/metadata";
import { ServiceDetailView } from "@/components/sections/service-detail-view";

export const revalidate = 300;

export async function generateStaticParams() {
  const services = await getPublishedServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);
  if (!service) return buildMetadata({ path: `/services/${params.slug}`, noIndex: true });

  return buildMetadata({
    title: service.seo_title || service.title,
    description: service.meta_description || service.short_description,
    path: `/services/${service.slug}`,
    imageUrl: service.image_url,
  });
}

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = await getServiceBySlug(params.slug);
  if (!service) notFound();
  return <ServiceDetailView service={service} breadcrumbPath={`/services/${service.slug}`} />;
}
