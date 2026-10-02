"use client";

import { useState, useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Input, Textarea, Label } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Card, EmptyState } from "@/components/ui/primitives";
import { PublishToggle } from "@/components/admin/publish-toggle";
import { createFaq, deleteFaq, toggleFaqPublished, updateFaqOrder } from "@/lib/actions/faqs-admin";
import type { Tables } from "@/types/database";

export function FaqManager({ initialItems }: { initialItems: Tables<"faqs">[] }) {
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState({ question: "", answer: "" });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleAdd() {
    if (!form.question.trim() || !form.answer.trim()) {
      setError("Both question and answer are required.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await createFaq({
        question: form.question,
        answer: form.answer,
        displayOrder: items.length,
        isPublished: false,
      });
      if (result.success) {
        setForm({ question: "", answer: "" });
        window.location.reload();
      } else {
        setError(result.error);
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this FAQ?")) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    startTransition(() => deleteFaq(id));
  }

  function handleOrderChange(id: string, order: number) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, display_order: order } : i)));
    startTransition(() => updateFaqOrder(id, order));
  }

  return (
    <div className="space-y-8">
      <Card>
        <h2 className="font-display text-lg text-ink">Add a FAQ</h2>
        <div className="mt-4">
          <Label htmlFor="question">Question</Label>
          <Input id="question" value={form.question} onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))} />
        </div>
        <div className="mt-4">
          <Label htmlFor="answer">Answer</Label>
          <Textarea id="answer" value={form.answer} onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))} />
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <Button type="button" className="mt-4" onClick={handleAdd} disabled={isPending}>
          {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          Add FAQ
        </Button>
      </Card>

      {items.length === 0 ? (
        <EmptyState title="No FAQs yet" description="Add your first question above." />
      ) : (
        <div className="space-y-3">
          {items
            .sort((a, b) => a.display_order - b.display_order)
            .map((faq) => (
              <Card key={faq.id} className="flex items-start gap-4">
                <Input
                  type="number"
                  value={faq.display_order}
                  onChange={(e) => handleOrderChange(faq.id, Number(e.target.value))}
                  className="w-16 shrink-0"
                  aria-label="Display order"
                />
                <div className="flex-1">
                  <p className="font-medium text-ink">{faq.question}</p>
                  <p className="mt-1 text-sm text-ink-500">{faq.answer}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <PublishToggle initialValue={faq.is_published} onToggle={(next) => toggleFaqPublished(faq.id, next)} />
                  <button onClick={() => handleDelete(faq.id)} aria-label="Delete FAQ">
                    <Trash2 className="h-4 w-4 text-ink-400 hover:text-red-500" />
                  </button>
                </div>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}
