import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";

export default function NotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center font-sans">
        <Logo className="mb-8" />
        <p className="font-display text-sm italic text-teal-600">Page not found</p>
        <h1 className="mt-2 font-display text-4xl text-ink">This page has moved or doesn&apos;t exist</h1>
        <p className="mx-auto mt-4 max-w-md text-ink-500">
          Let&apos;s get you back to somewhere useful.
        </p>
        <div className="mt-8 flex gap-3">
          <Button href="/">Go home</Button>
          <Button href="/book-appointment" variant="outline">
            Book an Appointment
          </Button>
        </div>
        <Link href="/" className="sr-only">
          Home
        </Link>
      </body>
    </html>
  );
}
