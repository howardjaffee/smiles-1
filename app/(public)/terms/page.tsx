import type { Metadata } from "next";
import { PageHero } from "@/components/sections/hero";
import { Container } from "@/components/ui/primitives";
import { getClinicSettings } from "@/lib/data/clinic";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({ title: "Terms & Conditions", path: "/terms" });
export const revalidate = 3600;

export default async function TermsPage() {
  const settings = await getClinicSettings();

  return (
    <>
      <PageHero eyebrow="Legal" title="Terms & Conditions" />
      <Container className="prose prose-neutral max-w-prose py-16 lg:py-24">
        <p className="text-sm text-ink-400">
          This is a starting template — have it reviewed by a qualified professional and adapted
          to your clinic&apos;s actual policies before publishing.
        </p>

        <h2>Use of this website</h2>
        <p>
          This website is provided by {settings.clinic_name} for informational purposes and to
          allow visitors to request appointments. By using this site, you agree to provide
          accurate information when submitting forms.
        </p>

        <h2>Appointment requests</h2>
        <p>
          Submitting the appointment form is a request, not a confirmed booking. Our team will
          contact you to confirm your appointment time.
        </p>

        <h2>No medical advice</h2>
        <p>
          Content on this website is educational and does not constitute medical or dental advice,
          diagnosis, or treatment. Always consult a qualified dentist or orthodontist for advice
          specific to your situation. See our{" "}
          <a href="/medical-disclaimer">Medical Disclaimer</a>.
        </p>

        <h2>Intellectual property</h2>
        <p>
          The content, design, and branding on this website belong to {settings.clinic_name} and
          may not be reproduced without permission.
        </p>

        <h2>Changes to these terms</h2>
        <p>We may update these terms from time to time. Continued use of the site constitutes acceptance of the updated terms.</p>
      </Container>
    </>
  );
}
