import Link from "next/link";
import { Plus } from "lucide-react";
import { Container, EmptyState } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { PublishToggle } from "@/components/admin/publish-toggle";
import { getAllServicesForAdmin } from "@/lib/data/services-admin";
import { toggleServicePublished } from "@/lib/actions/services-admin";

export default async function AdminServicesListPage() {
  const services = await getAllServicesForAdmin();

  return (
    <Container className="max-w-none px-6 py-8 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ink">Services</h1>
          <p className="mt-1 text-sm text-ink-400">
            Only published services appear on the public website.
          </p>
        </div>
        <Button href="/admin/services/new">
          <Plus className="h-4 w-4" aria-hidden /> New service
        </Button>
      </div>

      {services.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No services yet" description="Add your first service to get started." />
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-lg border border-ink-100 bg-white">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="border-b border-ink-100 bg-ink-50/60 text-xs uppercase tracking-wide text-ink-400">
              <tr>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Published</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {services.map((service) => (
                <tr key={service.id}>
                  <td className="px-4 py-3">
                    <Link href={`/admin/services/${service.id}`} className="font-medium text-ink hover:text-teal-600">
                      {service.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink-400">/{service.slug}</td>
                  <td className="px-4 py-3 text-ink-500">{service.display_order}</td>
                  <td className="px-4 py-3">
                    <PublishToggle
                      initialValue={service.is_published}
                      onToggle={async (next) => {
                        "use server";
                        return toggleServicePublished(service.id, next);
                      }}
                    />
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
