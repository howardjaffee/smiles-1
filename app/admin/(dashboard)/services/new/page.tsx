import { Container } from "@/components/ui/primitives";
import { ServiceEditorForm } from "@/components/admin/service-editor-form";
import type { ServiceFormValues } from "@/lib/validation/content";

const emptyValues: ServiceFormValues = {
  title: "",
  slug: "",
  shortDescription: "",
  detailedDescription: "",
  icon: "",
  imageUrl: "",
  benefits: [],
  isPublished: false,
  displayOrder: 0,
  seoTitle: "",
  metaDescription: "",
};

export default function NewServicePage() {
  return (
    <Container className="max-w-none px-6 py-8 lg:px-10">
      <h1 className="font-display text-2xl text-ink">New service</h1>
      <p className="mt-1 text-sm text-ink-400">Won&apos;t appear on the site until you publish it.</p>
      <div className="mt-8">
        <ServiceEditorForm mode="create" initialValues={emptyValues} />
      </div>
    </Container>
  );
}
