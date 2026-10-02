"use client";

import { useState, useTransition } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Input, Label } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/primitives";
import { updateClinicSettings } from "@/lib/actions/settings-admin";
import type { ClinicSettingsFormValues } from "@/lib/validation/content";

export function SettingsForm({ initialValues }: { initialValues: ClinicSettingsFormValues }) {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function update<K extends keyof ClinicSettingsFormValues>(key: K, value: ClinicSettingsFormValues[K]) {
    setSaved(false);
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const result = await updateClinicSettings(values);
      if (result.success) {
        setSaved(true);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="font-display text-lg text-ink">Clinic & doctor</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Clinic name" value={values.clinicName} onChange={(v) => update("clinicName", v)} />
          <Field label="Doctor name" value={values.doctorName} onChange={(v) => update("doctorName", v)} />
          <Field label="Qualification" value={values.qualification} onChange={(v) => update("qualification", v)} />
          <Field label="Specialization" value={values.specialization} onChange={(v) => update("specialization", v)} />
          <Field label="Tagline" value={values.tagline} onChange={(v) => update("tagline", v)} className="sm:col-span-2" />
        </div>
      </Card>

      <Card>
        <h2 className="font-display text-lg text-ink">Contact</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Phone" value={values.phone} onChange={(v) => update("phone", v)} />
          <Field label="WhatsApp" value={values.whatsapp} onChange={(v) => update("whatsapp", v)} placeholder="Include country code" />
          <Field label="Email" value={values.email} onChange={(v) => update("email", v)} type="email" />
          <Field label="Website URL" value={values.websiteUrl} onChange={(v) => update("websiteUrl", v)} />
        </div>
      </Card>

      <Card>
        <h2 className="font-display text-lg text-ink">Location</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Address line 1" value={values.addressLine1} onChange={(v) => update("addressLine1", v)} className="sm:col-span-2" />
          <Field label="Address line 2" value={values.addressLine2} onChange={(v) => update("addressLine2", v)} className="sm:col-span-2" />
          <Field label="City" value={values.city} onChange={(v) => update("city", v)} />
          <Field label="State" value={values.state} onChange={(v) => update("state", v)} />
          <Field label="Postal code" value={values.postalCode} onChange={(v) => update("postalCode", v)} />
          <Field label="Country" value={values.country} onChange={(v) => update("country", v)} />
          <Field label="Google Maps URL" value={values.googleMapsUrl} onChange={(v) => update("googleMapsUrl", v)} className="sm:col-span-2" />
          <Field
            label="Latitude"
            value={values.latitude?.toString() ?? ""}
            onChange={(v) => update("latitude", v ? Number(v) : undefined)}
            type="number"
          />
          <Field
            label="Longitude"
            value={values.longitude?.toString() ?? ""}
            onChange={(v) => update("longitude", v ? Number(v) : undefined)}
            type="number"
          />
        </div>
        <p className="mt-3 text-xs text-ink-400">
          Used for local SEO structured data (LocalBusiness/Dentist schema) and map links. Leave
          blank until confirmed — nothing here is guessed.
        </p>
      </Card>

      <Card>
        <h2 className="font-display text-lg text-ink">Social</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Instagram URL" value={values.instagramUrl} onChange={(v) => update("instagramUrl", v)} />
          <Field label="Facebook URL" value={values.facebookUrl} onChange={(v) => update("facebookUrl", v)} />
        </div>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="button" onClick={handleSave} disabled={isPending}>
          {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          Save settings
        </Button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-teal-600">
            <CheckCircle2 className="h-4 w-4" aria-hidden /> Saved
          </span>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  className,
  placeholder,
}: {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  type?: string;
  className?: string;
  placeholder?: string;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
