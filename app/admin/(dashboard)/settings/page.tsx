import { Container } from "@/components/ui/primitives";
import { SettingsForm } from "@/components/admin/settings-form";
import { getClinicSettings } from "@/lib/data/clinic";
import type { ClinicSettingsFormValues } from "@/lib/validation/content";

export default async function AdminSettingsPage() {
  const settings = await getClinicSettings();

  const initialValues: ClinicSettingsFormValues = {
    clinicName: settings.clinic_name,
    doctorName: settings.doctor_name,
    qualification: settings.qualification ?? "",
    specialization: settings.specialization ?? "",
    phone: settings.phone ?? "",
    whatsapp: settings.whatsapp ?? "",
    email: settings.email ?? "",
    addressLine1: settings.address_line1 ?? "",
    addressLine2: settings.address_line2 ?? "",
    city: settings.city ?? "",
    state: settings.state ?? "",
    postalCode: settings.postal_code ?? "",
    country: settings.country ?? "",
    latitude: settings.latitude ?? undefined,
    longitude: settings.longitude ?? undefined,
    googleMapsUrl: settings.google_maps_url ?? "",
    instagramUrl: settings.instagram_url ?? "",
    facebookUrl: settings.facebook_url ?? "",
    websiteUrl: settings.website_url ?? "",
    tagline: settings.tagline ?? "",
  };

  return (
    <Container className="max-w-3xl px-6 py-8 lg:px-10">
      <h1 className="font-display text-2xl text-ink">Settings</h1>
      <p className="mt-1 text-sm text-ink-400">
        This information powers the whole website — contact links, structured data, and local SEO.
      </p>
      <div className="mt-8">
        <SettingsForm initialValues={initialValues} />
      </div>
    </Container>
  );
}
