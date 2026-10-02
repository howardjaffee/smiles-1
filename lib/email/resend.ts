import "server-only";
import { Resend } from "resend";

/**
 * Returns null (not an error) when RESEND_API_KEY isn't set yet, so the
 * booking flow keeps working — just without emails — until you finish
 * the Resend setup in the README/setup guide.
 */
export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export const EMAIL_FROM = process.env.EMAIL_FROM || "Alignora Smiles <onboarding@resend.dev>";
