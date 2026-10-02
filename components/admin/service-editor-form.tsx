"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import { Loader2, Trash2, X } from "lucide-react";
import { Input, Textarea, Label, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/primitives";
import { SeoPreview } from "@/components/admin/seo-preview";
import { serviceSchema, type ServiceFormValues } from "@/lib/validation/content";
import { createService, updateService, deleteService } from "@/lib/actions/services-admin";

export function ServiceEditorForm({
  mode,
  serviceId,
  initialValues,
}: {
  mode: "create" | "edit";
  serviceId?: string;
  initialValues: ServiceFormValues;
}) {
  const router = useRouter();
  const [values, setValues] = useState<ServiceFormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof ServiceFormValues, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [benefitDraft, setBenefitDraft] = useState("");
  const [isPending, startTransition] = useTransition();

  function update<K extends keyof ServiceFormValues>(key: K, value: ServiceFormValues[K]) {
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !slugTouched) next.slug = slugify(String(value), { lower: true, strict: true });
      return next;
    });
  }

  function addBenefit() {
    if (!benefitDraft.trim()) return;
    update("benefits", [...(values.benefits ?? []), benefitDraft.trim()]);
    setBenefitDraft("");
  }

  function removeBenefit(index: number) {
    update("benefits", (values.benefits ?? []).filter((_, i) => i !== index));
  }

  function handleSubmit() {
    const parsed = serviceSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof ServiceFormValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ServiceFormValues;
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      setServerError("Please check the highlighted fields.");
      return;
    }

    setErrors({});
    setServerError(null);

    startTransition(async () => {
      const result = mode === "create" ? await createService(parsed.data) : await updateService(serviceId!, parsed.data);
      if (result.success) {
        router.push(`/admin/services/${result.id}`);
        router.refresh();
      } else {
        setServerError(result.error);
        if (result.fieldErrors) setErrors(result.fieldErrors);
      }
    });
  }

  function handleDelete() {
    if (!serviceId) return;
    if (!confirm("Delete this service permanently?")) return;
    startTransition(async () => {
      await deleteService(serviceId);
      router.push("/admin/services");
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
      <div className="space-y-6">
        <Card>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={values.title} onChange={(e) => update("title", e.target.value)} aria-invalid={!!errors.title} />
          <FieldError>{errors.title}</FieldError>

          <div className="mt-4">
            <Label htmlFor="slug">URL slug</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-ink-400">/services/</span>
              <Input
                id="slug"
                value={values.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  update("slug", e.target.value);
                }}
                aria-invalid={!!errors.slug}
              />
            </div>
            <FieldError>{errors.slug}</FieldError>
          </div>

          <div className="mt-4">
            <Label htmlFor="shortDescription">Short description</Label>
            <Textarea
              id="shortDescription"
              value={values.shortDescription}
              onChange={(e) => update("shortDescription", e.target.value)}
              aria-invalid={!!errors.shortDescription}
            />
            <FieldError>{errors.shortDescription}</FieldError>
          </div>

          <div className="mt-4">
            <Label htmlFor="detailedDescription">Detailed description (Markdown supported)</Label>
            <Textarea
              id="detailedDescription"
              className="min-h-[220px]"
              value={values.detailedDescription}
              onChange={(e) => update("detailedDescription", e.target.value)}
            />
          </div>
        </Card>

        <Card>
          <h3 className="font-display text-lg text-ink">Benefits</h3>
          <div className="mt-3 flex gap-2">
            <Input
              value={benefitDraft}
              onChange={(e) => setBenefitDraft(e.target.value)}
              placeholder="e.g. Straightens misaligned teeth"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addBenefit())}
            />
            <Button type="button" variant="outline" onClick={addBenefit}>
              Add
            </Button>
          </div>
          {values.benefits && values.benefits.length > 0 && (
            <ul className="mt-3 space-y-2">
              {values.benefits.map((benefit, i) => (
                <li key={i} className="flex items-center justify-between rounded bg-ink-50 px-3 py-2 text-sm text-ink-700">
                  {benefit}
                  <button type="button" onClick={() => removeBenefit(i)} aria-label="Remove benefit">
                    <X className="h-4 w-4 text-ink-400 hover:text-red-500" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h3 className="font-display text-lg text-ink">SEO</h3>
          <div className="mt-4 space-y-4">
            <div>
              <Label htmlFor="seoTitle">SEO title</Label>
              <Input id="seoTitle" value={values.seoTitle} onChange={(e) => update("seoTitle", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="metaDescription">Meta description</Label>
              <Textarea id="metaDescription" value={values.metaDescription} onChange={(e) => update("metaDescription", e.target.value)} />
            </div>
          </div>
          <div className="mt-4">
            <SeoPreview
              path={`/services/${values.slug || "your-service-slug"}`}
              seoTitle={values.seoTitle || ""}
              metaDescription={values.metaDescription || ""}
              fallbackTitle={values.title || "Untitled service"}
            />
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <h3 className="font-display text-lg text-ink">Settings</h3>
          <div className="mt-4 flex items-center justify-between">
            <Label htmlFor="isPublished" className="mb-0">
              Published
            </Label>
            <input
              id="isPublished"
              type="checkbox"
              checked={values.isPublished}
              onChange={(e) => update("isPublished", e.target.checked)}
              className="h-5 w-5 rounded border-ink-300 text-teal focus:ring-teal-200"
            />
          </div>
          <div className="mt-4">
            <Label htmlFor="displayOrder">Display order</Label>
            <Input
              id="displayOrder"
              type="number"
              value={values.displayOrder}
              onChange={(e) => update("displayOrder", Number(e.target.value))}
            />
          </div>
          <div className="mt-4">
            <Label htmlFor="icon">Icon name (Lucide)</Label>
            <Input id="icon" value={values.icon} onChange={(e) => update("icon", e.target.value)} placeholder="smile" />
          </div>
          <div className="mt-4">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" value={values.imageUrl} onChange={(e) => update("imageUrl", e.target.value)} />
          </div>

          {serverError && (
            <p className="mt-4 text-sm text-red-600" role="alert">
              {serverError}
            </p>
          )}

          <Button type="button" className="mt-5 w-full" onClick={handleSubmit} disabled={isPending}>
            {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            {mode === "create" ? "Save service" : "Save changes"}
          </Button>

          {mode === "edit" && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isPending}
              className="mt-2 w-full text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" aria-hidden /> Delete service
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}
