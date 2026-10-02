"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarClock,
  Newspaper,
  Stethoscope,
  MessageSquareQuote,
  Images,
  HelpCircle,
  Settings,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { signOut } from "@/lib/actions/auth";
import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/appointments", label: "Appointments", icon: CalendarClock },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/services", label: "Services", icon: Stethoscope },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/before-after", label: "Before & After", icon: Images },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({ profileName }: { profileName: string }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-ink-100 bg-white lg:flex">
      <div className="px-6 py-6">
        <Link href="/admin/dashboard">
          <Logo />
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink",
                active && "bg-teal-50 text-teal-700"
              )}
            >
              <Icon className="h-[18px] w-[18px]" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-ink-100 p-4">
        <p className="truncate px-2 text-xs text-ink-400">Signed in as</p>
        <p className="truncate px-2 text-sm font-medium text-ink-700">{profileName}</p>
        <form action={signOut}>
          <button
            type="submit"
            className="mt-2 flex w-full items-center gap-2.5 rounded px-2 py-2 text-sm text-ink-500 hover:bg-ink-50 hover:text-ink"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}

export function AdminMobileNav() {
  const pathname = usePathname();
  const primary = links.slice(0, 4);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 divide-x divide-ink-100 border-t border-ink-100 bg-white lg:hidden">
      {primary.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={cn("flex flex-col items-center gap-1 py-2.5 text-ink-500", active && "text-teal-600")}
          >
            <Icon className="h-5 w-5" aria-hidden />
            <span className="text-[11px] font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
