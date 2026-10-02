"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center font-sans">
        <p className="font-display text-sm italic text-teal-600">Something went wrong</p>
        <h1 className="mt-2 font-display text-3xl text-ink">We hit a snag loading this page</h1>
        <p className="mx-auto mt-3 max-w-md text-ink-500">
          Please try again, or call us directly if the problem continues.
        </p>
        <Button onClick={reset} className="mt-6">
          Try again
        </Button>
      </body>
    </html>
  );
}
