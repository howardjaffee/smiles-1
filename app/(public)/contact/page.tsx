import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { PageHero } from "@/components/sections/hero";
import { Container } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { getClinicSettings } from "@/lib/data/clinic";
import { buildMetadata } from "@/lib/seo/metadata";
import { toTelHref, toWhatsAppHref } from "@/lib/utils/format";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Get in touch with Alignora Smiles.",
  path: "/contact",
});

export const revalidate = 300;

export default async function ContactPage() {
  const settings = await getClinicSettings();
  const telHref = toTelHref(settings.phone);
  const waHref = toWhatsAppHref(settings.whatsapp, "Hi, I have a question for Alignora Smiles.");
  const address = [settings.address_line1, settings.address_line2, settings.city, settings.state, settings.postal_code]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <PageHero eyebrow="Contact" title="Get in touch" description="We're happy to answer questions before you book." />

      <Container className="grid gap-10 py-16 sm:grid-cols-2 lg:py-24">
        <div className="space-y-6">
          {telHref && (
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-teal-50 text-teal-600">
                <Phone className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-sm text-ink-400">Phone</p>
                <a href={telHref} className="font-medium text-ink hover:text-teal-600">
                  {settings.phone}
                </a>
              </div>
            </div>
          )}

          {settings.email && (
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-teal-50 text-teal-600">
                <Mail className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-sm text-ink-400">Email</p>
                <a href={`mailto:${settings.email}`} className="font-medium text-ink hover:text-teal-600">
                  {settings.email}
                </a>
              </div>
            </div>
          )}

          <div className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-teal-50 text-teal-600">
              <MapPin className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-sm text-ink-400">Address</p>
              <p className="font-medium text-ink">{address || "Address coming soon"}</p>
              {settings.google_maps_url && (
                <a
                  href={settings.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-teal-600 hover:underline"
                >
                  Get directions
                </a>
              )}
            </div>
          </div>

          <div className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-teal-50 text-teal-600">
              <Clock className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-sm text-ink-400">Opening hours</p>
              <p className="font-medium text-ink">
                {settings.opening_hours && Array.isArray(settings.opening_hours) && settings.opening_hours.length > 0
                  ? "See below"
                  : "Coming soon — please call to confirm timings"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            {telHref && (
              <Button href={telHref} variant="outline">
                <Phone className="h-4 w-4" aria-hidden /> Call now
              </Button>
            )}
            {waHref && (
              <Button href={waHref} variant="secondary">
                WhatsApp us
              </Button>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-ink-100 bg-ink-50/40 p-8">
          <h2 className="font-display text-xl text-ink">Prefer to book directly?</h2>
          <p className="mt-2 text-sm text-ink-500">
            Use our appointment form and we&apos;ll confirm a time that works for you.
          </p>
          <Button href="/book-appointment" className="mt-5 w-full">
            Book an Appointment
          </Button>
        </div>
      </Container>
    </>
  );
}
