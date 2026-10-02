import type { Metadata } from "next";
import { PageHero } from "@/components/sections/hero";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { getPublishedFaqs } from "@/lib/data/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd, buildFaqSchema } from "@/lib/seo/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "FAQs",
  description: "Answers to common questions about dental and orthodontic treatment at Alignora Smiles.",
  path: "/faqs",
});

export const revalidate = 300;

export default async function FaqsPage() {
  const faqs = await getPublishedFaqs();
  const faqSchema = buildFaqSchema(faqs.map((f) => ({ question: f.question, answer: f.answer })));

  return (
    <>
      {faqSchema && <JsonLd data={faqSchema} />}
      <PageHero eyebrow="FAQs" title="Frequently asked questions" />
      <FaqAccordion faqs={faqs} />
    </>
  );
}
