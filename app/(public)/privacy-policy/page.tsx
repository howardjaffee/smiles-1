import type { Metadata } from "next";
import { PageHero } from "@/components/sections/hero";
import { Container } from "@/components/ui/primitives";
import { getClinicSettings } from "@/lib/data/clinic";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  path: "/privacy-policy",
  noIndex: false,
});

export const revalidate = 3600;

export default async function PrivacyPolicyPage() {
  const settings = await getClinicSettings();

  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <Container className="prose prose-neutral max-w-prose py-16 lg:py-24">
        <p className="text-sm text-ink-400">
          This is a starting template. Have it reviewed by a qualified professional before
          publishing, and update it to reflect your actual data practices, region-specific
          requirements (e.g. India&apos;s DPDP Act), and any third-party tools you use (analytics,
          hosting, forms).
        </p>

        <h2>Information we collect</h2>
        <p>
          When you use our appointment booking form, we collect the information you provide,
          which may include your name, phone number, email address, preferred appointment
          details, and any message you choose to include.
        </p>

        <h2>How we use your information</h2>
        <p>
          We use this information solely to contact you about your appointment request and to
          provide the dental and orthodontic services you request from {settings.clinic_name}.
        </p>

        <h2>How we protect your information</h2>
        <p>
          Appointment and patient information is stored in a secured database with access
          restricted to authorized clinic staff. It is never made publicly accessible.
        </p>

        <h2>Analytics</h2>
        <p>
          If enabled, we may use privacy-respecting analytics tools (such as Google Analytics) to
          understand how visitors use this website. These tools may use cookies; you can control
          cookie preferences through your browser settings.
        </p>

        <h2>Contact us</h2>
        <p>
          If you have questions about this policy or how your information is handled, please
          contact us using the details on our{" "}
          <a href="/contact">Contact page</a>.
        </p>
      </Container>
    </>
  );
}
