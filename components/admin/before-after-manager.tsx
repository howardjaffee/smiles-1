"use client";

import { useState, useTransition } from "react";
import { Loader2, Trash2, ShieldCheck, ShieldAlert } from "lucide-react";
import { Input, Textarea, Label } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Card, EmptyState } from "@/components/ui/primitives";
import { PublishToggle } from "@/components/admin/publish-toggle";
import {
  createBeforeAfterCase,
  deleteBeforeAfterCase,
  toggleBeforeAfterPublished,
} from "@/lib/actions/before-after-admin";
import type { Tables } from "@/types/database";

const emptyForm = {
  title: "",
  treatmentType: "",
  beforeImageUrl: "",
  afterImageUrl: "",
  description: "",
  consentConfirmed: false,
  isPublished: false,
};

export function BeforeAfterManager({ initialItems }: { initialItems: Tables<"before_after_cases">[] }) {
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleAdd() {
    if (!form.title.trim() || !form.beforeImageUrl.trim() || !form.afterImageUrl.trim()) {
      setError("Title, before image, and after image are required.");
      return;
    }
    if (!form.consentConfirmed) {
      setError("You must confirm patient consent before adding this case.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await createBeforeAfterCase(form);
      if (result.success) {
        setForm(emptyForm);
        window.location.reload();
      } else {
        setError(result.error);
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this case permanently?")) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    startTransition(() => deleteBeforeAfterCase(id));
  }

  return (
    <div className="space-y-8">
      <Card>
        <div className="flex items-start gap-2 rounded bg-amber-50 p-3 text-sm text-amber-800">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          Never add real patient photos without their explicit, confirmed consent. This can&apos;t
          be published without checking the consent box below.
        </div>

        <h2 className="mt-4 font-display text-lg text-ink">Add a case</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="treatmentType">Treatment type</Label>
            <Input
              id="treatmentType"
              value={form.treatmentType}
              onChange={(e) => setForm((f) => ({ ...f, treatmentType: e.target.value }))}
              placeholder="e.g. Braces, 18 months"
            />
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="beforeImageUrl">Before image URL</Label>
            <Input
              id="beforeImageUrl"
              value={form.beforeImageUrl}
              onChange={(e) => setForm((f) => ({ ...f, beforeImageUrl: e.target.value }))}
              placeholder="Uploaded via Supabase Storage"
            />
          </div>
          <div>
            <Label htmlFor="afterImageUrl">After image URL</Label>
            <Input
              id="afterImageUrl"
              value={form.afterImageUrl}
              onChange={(e) => setForm((f) => ({ ...f, afterImageUrl: e.target.value }))}
            />
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea id="description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
        </div>

        <label className="mt-4 flex items-start gap-2.5 text-sm text-ink-700">
          <input
            type="checkbox"
            checked={form.consentConfirmed}
            onChange={(e) => setForm((f) => ({ ...f, consentConfirmed: e.target.checked }))}
            className="mt-0.5 h-4 w-4 rounded border-ink-300 text-teal focus:ring-teal-200"
          />
          I confirm this patient has given explicit consent for these photos to be published.
        </label>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <Button type="button" className="mt-4" onClick={handleAdd} disabled={isPending}>
          {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          Add case
        </Button>
      </Card>

      {items.length === 0 ? (
        <EmptyState title="No cases yet" description="Add your first before/after case above." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((c) => (
            <Card key={c.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-ink">{c.title}</p>
                  {c.treatment_type && <p className="text-sm text-teal-600">{c.treatment_type}</p>}
                </div>
                <PublishToggle
                  initialValue={c.is_published}
                  onToggle={(next) => toggleBeforeAfterPublished(c.id, next, c.consent_confirmed)}
                />
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-400">
                <ShieldCheck className={`h-3.5 w-3.5 ${c.consent_confirmed ? "text-teal-500" : "text-ink-300"}`} aria-hidden />
                {c.consent_confirmed ? "Consent confirmed" : "Consent not confirmed"}
              </p>
              {c.description && <p className="mt-2 text-sm text-ink-500">{c.description}</p>}
              <button onClick={() => handleDelete(c.id)} className="mt-3 flex items-center gap-1.5 text-xs text-ink-400 hover:text-red-500">
                <Trash2 className="h-3.5 w-3.5" aria-hidden /> Delete
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
