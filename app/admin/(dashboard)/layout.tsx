import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/data/admin";
import { AdminSidebar, AdminMobileNav } from "@/components/admin/sidebar";

/**
 * This layout only wraps routes inside app/admin/(dashboard)/ — the
 * route group means /admin/login (a sibling folder) is NOT nested under
 * it, so the redirect below can never loop back into itself.
 * middleware.ts already redirects unauthenticated requests before this
 * runs; this is a defense-in-depth second check.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-ink-50/40 font-sans">
      <AdminSidebar profileName={profile.full_name} />
      <div className="flex-1 pb-16 lg:pb-0">{children}</div>
      <AdminMobileNav />
    </div>
  );
}
