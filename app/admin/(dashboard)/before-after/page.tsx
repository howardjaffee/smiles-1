import { Container } from "@/components/ui/primitives";
import { BeforeAfterManager } from "@/components/admin/before-after-manager";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

async function getAllCases(): Promise<Tables<"before_after_cases">[]> {
  const supabase = createClient();
  const { data } = await supabase.from("before_after_cases").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export default async function AdminBeforeAfterPage() {
  const cases = await getAllCases();

  return (
    <Container className="max-w-none px-6 py-8 lg:px-10">
      <h1 className="font-display text-2xl text-ink">Before & After</h1>
      <p className="mt-1 text-sm text-ink-400">Real patient results only, published with confirmed consent.</p>
      <div className="mt-8">
        <BeforeAfterManager initialItems={cases} />
      </div>
    </Container>
  );
}
