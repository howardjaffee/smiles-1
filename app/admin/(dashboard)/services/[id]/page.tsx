import { notFound } from "next/navigation";
import { Container } from "@/components/ui/primitives";
import { ServiceEditorForm } from "@/components/admin/service-editor-form";
import { getServiceForEdit } from "@/lib/data/services-admin";
import type { ServiceFormValues } from "@/lib/validation/content";

export default async function EditServicePage({ params }: { params: { id: string } }) {
  const service = await getServiceForEdit(params.id);
  if (!service) notFound();

  const initialValues: ServiceFormValues = {
    title: service.title,
    slug: service.slug,
    shortDescription: service.short_description,
    detailedDescription: service.detailed_description ?? "",
    icon: service.icon ?? "",
    imageUrl: service.image_url ?? "",
    benefits: service.benefits ?? [],
    isPublished: service.is_published,
    displayOrder: service.display_order,
    seoTitle: service.seo_title ?? "",
    metaDescription: service.meta_description ?? "",
  };

  return (
    <Container className="max-w-none px-6 py-8 lg:px-10">
      <h1 className="font-display text-2xl text-ink">Edit service</h1>
      <div className="mt-8">
        <ServiceEditorForm mode="edit" serviceId={service.id} initialValues={initialValues} />
      </div>
    </Container>
  );
}
