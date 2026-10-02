import type { Metadata } from "next";
import { PageHero } from "@/components/sections/hero";
import { Container } from "@/components/ui/primitives";
import { getClinicSettings } from "@/lib/data/clinic";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: "Learn about Alignora Smiles and Dr. Jyoti, an orthodontist specializing in braces.",
  path: "/about",
});

export const revalidate = 300;

export default async function AboutPage() {
  const settings = await getClinicSettings();

  return (
    <>
      <PageHero
        eyebrow="About us"
        title={`Get to know ${settings.clinic_name}`}
        description="A dental and orthodontic clinic built around careful diagnosis, clear explanations, and treatment plans suited to each patient."
      />

      <section className="py-16 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr,1fr]">
          <div className="prose prose-neutral max-w-prose">
            <h2 className="font-display text-2xl text-ink">{settings.doctor_name}</h2>
            <p className="text-ink-500">
              {settings.specialization}
              {settings.qualification ? ` · ${settings.qualification}` : ""}
            </p>
            <p className="mt-4 text-ink-600">
              {settings.doctor_name} leads care at {settings.clinic_name}, focusing on orthodontic
              treatment — including braces — alongside general dental care. Every treatment plan
              starts with a thorough examination so you understand your options before deciding
              how to move forward.
            </p>
            <p className="mt-4 text-sm italic text-ink-400">
              Additional details about experience, certifications, and memberships will appear
              here once confirmed by the clinic.
            </p>
          </div>

          <div className="rounded-lg border border-ink-100 bg-ink-50/40 p-8">
            <h3 className="font-display text-lg text-ink">Our approach</h3>
            <ul className="mt-4 space-y-4 text-[15px] text-ink-600">
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                A thorough consultation before any treatment plan is proposed.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                Clear explanations of what a treatment can and can&apos;t achieve.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                Orthodontic expertise alongside routine dental care, under one roof.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                Ongoing check-ins throughout your treatment, not just at the start.
              </li>
            </ul>
          </div>
        </Container>
      </section>
    </>
  );
}
