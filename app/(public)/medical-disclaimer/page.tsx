import type { Metadata } from "next";
import { PageHero } from "@/components/sections/hero";
import { Container } from "@/components/ui/primitives";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({ title: "Medical Disclaimer", path: "/medical-disclaimer" });
export const revalidate = 3600;

export default function MedicalDisclaimerPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Medical Disclaimer" />
      <Container className="prose prose-neutral max-w-prose py-16 lg:py-24">
        <p>
          The content on this website, including blog articles, service descriptions, and FAQs, is
          provided for general educational purposes only. It is not intended to be, and should not
          be relied upon as, medical or dental advice, diagnosis, or treatment.
        </p>
        <p>
          Every patient&apos;s situation is different. Only a qualified dentist or orthodontist who
          has examined you in person can determine the right diagnosis and treatment plan for your
          specific needs. Always seek the advice of a qualified healthcare provider with any
          questions you may have regarding a dental or medical condition.
        </p>
        <p>
          Never disregard professional dental or medical advice, or delay seeking it, because of
          something you have read on this website.
        </p>
        <p>
          Results described or shown on this website (including in our Before &amp; After gallery)
          reflect individual patient outcomes and are not a guarantee that similar results will be
          achieved in every case.
        </p>
      </Container>
    </>
  );
}
