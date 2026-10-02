import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { AnalyticsScripts } from "@/components/analytics/analytics-scripts";
import { JsonLd, buildDentistSchema, buildWebsiteSchema } from "@/lib/seo/json-ld";
import { getClinicSettings } from "@/lib/data/clinic";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  ...buildMetadata({}),
  metadataBase: new URL(siteConfig.seo.siteUrl),
  icons: {
    icon: "/favicon.svg",
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getClinicSettings();

  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="font-sans">
        <JsonLd data={buildWebsiteSchema()} />
        <JsonLd data={buildDentistSchema(settings)} />
        <AnalyticsScripts />

        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>

        {children}
      </body>
    </html>
  );
}
