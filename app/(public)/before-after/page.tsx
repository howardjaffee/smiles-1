import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/sections/hero";
import { Container, EmptyState } from "@/components/ui/primitives";
import { getPublishedBeforeAfterCases } from "@/lib/data/content";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Before & After",
  description: "Real patient results, shared only with confirmed consent.",
  path: "/before-after",
});

export const revalidate = 300;

export default async function BeforeAfterPage() {
  const cases = await getPublishedBeforeAfterCases();

  return (
    <>
      <PageHero
        eyebrow="Results"
        title="Before & after"
        description="Every case shown here is a real patient result, published only with their confirmed consent."
      />

      <Container className="py-16 lg:py-24">
        {cases.length === 0 ? (
          <EmptyState
            title="Case studies are coming soon"
            description="We only publish real patient results with confirmed consent, so this gallery is still being built. Ask us about typical outcomes during your consultation."
          />
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {cases.map((c) => (
              <article key={c.id} className="overflow-hidden rounded-lg border border-ink-100 bg-white shadow-card">
                <div className="grid grid-cols-2">
                  <div className="relative aspect-square bg-ink-50">
                    <Image src={c.before_image_url} alt={`${c.title} — before`} fill className="object-cover" />
                    <span className="absolute left-2 top-2 rounded-sm bg-ink-800/80 px-2 py-0.5 text-[11px] font-medium text-white">
                      Before
                    </span>
                  </div>
                  <div className="relative aspect-square bg-ink-50">
                    <Image src={c.after_image_url} alt={`${c.title} — after`} fill className="object-cover" />
                    <span className="absolute left-2 top-2 rounded-sm bg-teal/90 px-2 py-0.5 text-[11px] font-medium text-white">
                      After
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg text-ink">{c.title}</h3>
                  {c.treatment_type && <p className="text-sm text-teal-600">{c.treatment_type}</p>}
                  {c.description && <p className="mt-2 text-sm text-ink-500">{c.description}</p>}
                </div>
              </article>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
