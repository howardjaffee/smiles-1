import { Container } from "@/components/ui/primitives";
import { TestimonialManager } from "@/components/admin/testimonial-manager";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

async function getAllTestimonials(): Promise<Tables<"testimonials">[]> {
  const supabase = createClient();
  const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export default async function AdminTestimonialsPage() {
  const testimonials = await getAllTestimonials();

  return (
    <Container className="max-w-none px-6 py-8 lg:px-10">
      <h1 className="font-display text-2xl text-ink">Testimonials</h1>
      <p className="mt-1 text-sm text-ink-400">
        Only published, genuine reviews appear on the Reviews page and homepage.
      </p>
      <div className="mt-8">
        <TestimonialManager initialItems={testimonials} />
      </div>
    </Container>
  );
}
