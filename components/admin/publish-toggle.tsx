"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils/cn";

export function PublishToggle({
  initialValue,
  onToggle,
}: {
  initialValue: boolean;
  onToggle: (next: boolean) => Promise<{ success: boolean }>;
}) {
  const [value, setValue] = useState(initialValue);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const next = !value;
    setValue(next);
    startTransition(async () => {
      const result = await onToggle(next);
      if (!result.success) setValue(!next);
    });
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
        value ? "bg-teal" : "bg-ink-200",
        isPending && "opacity-60"
      )}
    >
      <span
        className={cn(
          "inline-block h-[18px] w-[18px] transform rounded-full bg-white transition-transform",
          value ? "translate-x-[22px]" : "translate-x-1"
        )}
      />
      <span className="sr-only">{value ? "Published" : "Unpublished"}</span>
    </button>
  );
}
