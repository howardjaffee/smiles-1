import { Container } from "@/components/ui/primitives";
import { FaqManager } from "@/components/admin/faq-manager";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

async function getAllFaqs(): Promise<Tables<"faqs">[]> {
  const supabase = createClient();
  const { data } = await supabase.from("faqs").select("*").order("display_order", { ascending: true });
  return data ?? [];
}

export default async function AdminFaqsPage() {
  const faqs = await getAllFaqs();

  return (
    <Container className="max-w-none px-6 py-8 lg:px-10">
      <h1 className="font-display text-2xl text-ink">FAQs</h1>
      <p className="mt-1 text-sm text-ink-400">Manage the questions shown on the FAQs page and homepage.</p>
      <div className="mt-8">
        <FaqManager initialItems={faqs} />
      </div>
    </Container>
  );
}
