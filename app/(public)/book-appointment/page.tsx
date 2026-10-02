import type { Metadata } from "next";
import { PageHero } from "@/components/sections/hero";
import { Container } from "@/components/ui/primitives";
import { AppointmentForm } from "@/components/forms/appointment-form";
import { getPublishedServices } from "@/lib/data/services";
import { getClinicSettings } from "@/lib/data/clinic";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Book an Appointment",
  description: "Request an appointment at Alignora Smiles.",
  path: "/book-appointment",
});

export const revalidate = 300;

export default async function BookAppointmentPage() {
  const [services, settings] = await Promise.all([getPublishedServices(), getClinicSettings()]);

  return (
    <>
      <PageHero
        eyebrow="Book an appointment"
        title="Let's find you a time"
        description={`Fill out the form below and our team will contact you to confirm your appointment${settings.phone ? `, or call us directly at ${settings.phone}` : ""}.`}
      />

      <Container className="max-w-2xl py-16 lg:py-24">
        <AppointmentForm services={services} />
      </Container>
    </>
  );
}
