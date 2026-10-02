"use client";

/**
 * Conversion events named per the spec: appointment_started,
 * appointment_submitted, phone_clicked, whatsapp_clicked,
 * contact_form_submitted, blog_view, service_view.
 *
 * No-ops safely when GA/GTM isn't configured (window.gtag or
 * window.dataLayer simply won't exist yet), so this is safe to call
 * unconditionally from any Client Component.
 */
type EventName =
  | "appointment_started"
  | "appointment_submitted"
  | "phone_clicked"
  | "whatsapp_clicked"
  | "contact_form_submitted"
  | "blog_view"
  | "service_view";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: EventName, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: name, ...params });
  }
}
