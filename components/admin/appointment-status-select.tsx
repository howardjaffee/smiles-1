"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { updateAppointmentStatus } from "@/lib/actions/appointments-admin";
import type { AppointmentStatus } from "@/types/database";

const statusStyles: Record<AppointmentStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-teal-50 text-teal-700 border-teal-200",
  COMPLETED: "bg-ink-100 text-ink-600 border-ink-200",
  CANCELLED: "bg-red-50 text-red-600 border-red-200",
};

const statuses: AppointmentStatus[] = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

export function AppointmentStatusSelect({ id, status }: { id: string; status: AppointmentStatus }) {
  const [current, setCurrent] = useState(status);
  const [isPending, startTransition] = useTransition();

  function handleChange(next: AppointmentStatus) {
    setCurrent(next);
    startTransition(async () => {
      const result = await updateAppointmentStatus(id, next);
      if (!result.success) setCurrent(status); // revert on failure
    });
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={current}
        onChange={(e) => handleChange(e.target.value as AppointmentStatus)}
        className={`rounded-sm border px-2 py-1 text-xs font-medium ${statusStyles[current]}`}
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s.charAt(0) + s.slice(1).toLowerCase()}
          </option>
        ))}
      </select>
      {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin text-ink-400" aria-hidden />}
    </div>
  );
}
