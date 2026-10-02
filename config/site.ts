/**
 * ALIGNORA SMILES — site configuration
 * ─────────────────────────────────────────────────────────────────────────
 * This is the single hard-coded source of truth for values confirmed from
 * the clinic signboard. Everything marked PLACEHOLDER is NOT real data —
 * it exists so the UI has something to render and so the shape of the
 * data is obvious. Replace placeholders with real values before launch,
 * either here or (once migrated) via /admin/settings, which writes to the
 * `clinic_settings` table and should be treated as the eventual source of
 * truth in production. Nothing here should be duplicated by hand elsewhere
 * in the codebase — always import from this file or from the settings
 * table via `getClinicSettings()`.
 *
 * CONFIRMED from the uploaded signboard:
 *   - Brand name, business type, doctor name, specialization,
 *     qualifications, phone number, tagline.
 *
 * NOT confirmed (left as configurable placeholders per instructions —
 * do not treat as real until the client supplies them):
 *   - address, city, state, postal code, coordinates
 *   - email, WhatsApp number
 *   - opening hours
 *   - Google Maps URL, Instagram, Facebook
 *   - doctor experience, awards, memberships, certifications
 *   - treatment pricing, patient statistics, testimonials
 */

export const siteConfig = {
  brand: {
    name: "Alignora Smiles",
    legalName: "Alignora Smiles Dental & Orthodontic Clinic",
    businessType: "Dental & Orthodontic Clinic",
    tagline: "Creating Beautiful Smiles with Precision & Care",
    shortDescription:
      "A dental and orthodontic clinic specializing in braces and orthodontic care.",
  },

  doctor: {
    name: "Dr. Jyoti",
    title: "Orthodontist (Braces Specialist)",
    qualifications: "BDS, MDS (HPU)",
    // PLACEHOLDER — not present on the signboard. Configure once confirmed.
    experienceYears: null as number | null,
    // PLACEHOLDER — no photo supplied. The site must never imply a stock
    // photo is a real photo of the doctor; components should show a
    // neutral clinical illustration/pattern instead until a real photo
    // is provided.
    photoUrl: null as string | null,
    bio: null as string | null,
  },

  contact: {
    phone: "+91 98720 36879",
    phoneHref: "tel:+919872036879",
    // PLACEHOLDER — WhatsApp number was not confirmed on the signboard.
    // Do not assume it is the same as the phone number. Leave null until
    // the client confirms, so the UI can hide WhatsApp CTAs safely.
    whatsapp: null as string | null,
    whatsappHref: null as string | null,
    // PLACEHOLDER
    email: null as string | null,
  },

  location: {
    // PLACEHOLDER — none of the following were on the signboard.
    addressLine1: null as string | null,
    addressLine2: null as string | null,
    city: null as string | null,
    state: null as string | null,
    postalCode: null as string | null,
    country: "India",
    latitude: null as number | null,
    longitude: null as number | null,
    googleMapsUrl: null as string | null,
  },

  hours: {
    // PLACEHOLDER — structure ready for local SEO / LocalBusiness schema.
    // Each entry: dayOfWeek (schema.org format), opens, closes. Leave
    // empty until confirmed rather than guessing typical clinic hours.
    schedule: [] as Array<{ dayOfWeek: string; opens: string; closes: string }>,
    note: null as string | null,
  },

  social: {
    // PLACEHOLDER
    instagram: null as string | null,
    facebook: null as string | null,
    website: null as string | null,
  },

  seo: {
    defaultTitle: "Alignora Smiles — Dental & Orthodontic Clinic",
    defaultDescription:
      "Alignora Smiles is a dental and orthodontic clinic led by Dr. Jyoti (BDS, MDS), an orthodontist specializing in braces. Book an appointment for orthodontic and dental care.",
    // Falls back to an env var so previews/staging don't emit production URLs.
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    twitterHandle: null as string | null,
  },

  nav: {
    primary: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Orthodontics", href: "/orthodontics" },
      { label: "Before & After", href: "/before-after" },
      { label: "Reviews", href: "/reviews" },
      { label: "FAQs", href: "/faqs" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
    footerLegal: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Medical Disclaimer", href: "/medical-disclaimer" },
    ],
  },

  analytics: {
    gaId: process.env.NEXT_PUBLIC_GA_ID || null,
    gtmId: process.env.NEXT_PUBLIC_GTM_ID || null,
  },
} as const;

export type SiteConfig = typeof siteConfig;
