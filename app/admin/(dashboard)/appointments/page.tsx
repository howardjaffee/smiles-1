import { createClient } from "@/lib/supabase/server";
import { Container, EmptyState } from "@/components/ui/primitives";
import { AppointmentStatusSelect } from "@/components/admin/appointment-status-select";
import { formatDate } from "@/lib/utils/format";
import type { Tables } from "@/types/database";

async function getAppointments() {
  const supabase = createClient();
  const { data } = await supabase
    .from("appointments")
    .select("*, services(title)")
    .order("created_at", { ascending: false });
  return (data ?? []) as (Tables<"appointments"> & { services: { title: string } | null })[];
}

export default async function AdminAppointmentsPage() {
  const appointments = await getAppointments();

  return (
    <Container className="max-w-none px-6 py-8 lg:px-10">
      <h1 className="font-display text-2xl text-ink">Appointments</h1>
      <p className="mt-1 text-sm text-ink-400">Patient booking requests, most recent first.</p>

      {appointments.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No appointment requests yet"
            description="Requests submitted through the Book an Appointment page will appear here."
          />
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-lg border border-ink-100 bg-white">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-ink-100 bg-ink-50/60 text-xs uppercase tracking-wide text-ink-400">
              <tr>
                <th className="px-4 py-3 font-medium">Patient</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Preferred</th>
                <th className="px-4 py-3 font-medium">Requested</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{a.full_name}</p>
                    {a.message && <p className="mt-0.5 max-w-xs truncate text-xs text-ink-400">{a.message}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-ink-600">{a.phone}</p>
                    {a.email && <p className="text-xs text-ink-400">{a.email}</p>}
                  </td>
                  <td className="px-4 py-3 text-ink-600">{a.services?.title ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-600">
                    {a.preferred_date ? formatDate(a.preferred_date) : "—"}
                    {a.preferred_time ? ` · ${a.preferred_time}` : ""}
                  </td>
                  <td className="px-4 py-3 text-ink-400">{formatDate(a.created_at)}</td>
                  <td className="px-4 py-3">
                    <AppointmentStatusSelect id={a.id} status={a.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  );
}
