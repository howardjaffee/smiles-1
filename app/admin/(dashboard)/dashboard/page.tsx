import Link from "next/link";
import { CalendarClock, CheckCircle2, FileText, FileEdit, Clock3 } from "lucide-react";
import { Container, Card } from "@/components/ui/primitives";
import { getDashboardSummary } from "@/lib/data/admin";

export default async function AdminDashboardPage() {
  const summary = await getDashboardSummary();

  const cards = [
    {
      label: "Pending appointments",
      value: summary.pendingAppointments,
      icon: CalendarClock,
      href: "/admin/appointments",
      tone: "text-amber-600 bg-amber-50",
    },
    {
      label: "Confirmed appointments",
      value: summary.confirmedAppointments,
      icon: CheckCircle2,
      href: "/admin/appointments",
      tone: "text-teal-600 bg-teal-50",
    },
    {
      label: "Published blog posts",
      value: summary.publishedPosts,
      icon: FileText,
      href: "/admin/blog",
      tone: "text-teal-600 bg-teal-50",
    },
    {
      label: "Draft blog posts",
      value: summary.draftPosts,
      icon: FileEdit,
      href: "/admin/blog",
      tone: "text-ink-500 bg-ink-100",
    },
    {
      label: "Scheduled blog posts",
      value: summary.scheduledPosts,
      icon: Clock3,
      href: "/admin/blog",
      tone: "text-amber-600 bg-amber-50",
    },
  ];

  return (
    <Container className="max-w-none px-6 py-8 lg:px-10">
      <h1 className="font-display text-2xl text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-400">A quick look at what needs your attention.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, href, tone }) => (
          <Link key={label} href={href}>
            <Card className="transition-shadow hover:shadow-card">
              <span className={`inline-flex h-10 w-10 items-center justify-center rounded ${tone}`}>
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <p className="mt-4 text-3xl font-semibold text-ink">{value}</p>
              <p className="mt-1 text-sm text-ink-500">{label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <Card>
          <h2 className="font-display text-lg text-ink">Quick actions</h2>
          <div className="mt-4 flex flex-col gap-2">
            <Link href="/admin/blog/new" className="text-sm font-medium text-teal-600 hover:underline">
              Write a new blog post →
            </Link>
            <Link href="/admin/appointments" className="text-sm font-medium text-teal-600 hover:underline">
              Review pending appointments →
            </Link>
            <Link href="/admin/settings" className="text-sm font-medium text-teal-600 hover:underline">
              Update clinic contact details →
            </Link>
          </div>
        </Card>
        <Card>
          <h2 className="font-display text-lg text-ink">Need help?</h2>
          <p className="mt-2 text-sm text-ink-500">
            See the project README for guidance on managing content, connecting analytics, and
            publishing blog posts.
          </p>
        </Card>
      </div>
    </Container>
  );
}
