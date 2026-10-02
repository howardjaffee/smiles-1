import { z } from "zod";

/**
 * Shared client + server validation for the appointment/booking form.
 * `website` is a honeypot field: real users never see or fill it (hidden
 * via CSS), so any submission with it populated is treated as spam.
 */
export const appointmentSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(120, "Name is too long."),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number.")
    .max(20, "Phone number is too long.")
    .regex(/^[0-9+\-\s()]+$/, "Please enter a valid phone number."),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .optional()
    .or(z.literal("")),
  serviceId: z.string().uuid().optional().or(z.literal("")),
  preferredDate: z.string().optional().or(z.literal("")),
  preferredTime: z.string().max(40).optional().or(z.literal("")),
  message: z.string().trim().max(1000, "Message is too long.").optional().or(z.literal("")),
  website: z.string().max(0, "Spam detected.").optional().or(z.literal("")),
});

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;
