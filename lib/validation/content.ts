import { z } from "zod";

export const serviceSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, hyphen-separated."),
  shortDescription: z.string().trim().min(10).max(240),
  detailedDescription: z.string().trim().max(5000).optional().or(z.literal("")),
  icon: z.string().trim().max(50).optional().or(z.literal("")),
  imageUrl: z.string().url().optional().or(z.literal("")),
  benefits: z.array(z.string().trim().max(200)).max(20).optional(),
  isPublished: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
  seoTitle: z.string().trim().max(70).optional().or(z.literal("")),
  metaDescription: z.string().trim().max(160).optional().or(z.literal("")),
});
export type ServiceFormValues = z.infer<typeof serviceSchema>;

export const testimonialSchema = z.object({
  patientDisplayName: z.string().trim().min(2).max(120),
  review: z.string().trim().min(10).max(2000),
  rating: z.number().int().min(1).max(5).optional(),
  source: z.string().trim().max(80).optional().or(z.literal("")),
  reviewDate: z.string().optional().or(z.literal("")),
  isPublished: z.boolean().default(false),
});
export type TestimonialFormValues = z.infer<typeof testimonialSchema>;

export const beforeAfterSchema = z.object({
  title: z.string().trim().min(2).max(150),
  treatmentType: z.string().trim().max(100).optional().or(z.literal("")),
  beforeImageUrl: z.string().url(),
  afterImageUrl: z.string().url(),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  consentConfirmed: z.boolean(),
  isPublished: z.boolean().default(false),
}).refine((data) => !data.isPublished || data.consentConfirmed, {
  message: "Patient consent must be confirmed before publishing a before/after case.",
  path: ["consentConfirmed"],
});
export type BeforeAfterFormValues = z.infer<typeof beforeAfterSchema>;

export const faqSchema = z.object({
  question: z.string().trim().min(5).max(300),
  answer: z.string().trim().min(5).max(2000),
  displayOrder: z.number().int().min(0).default(0),
  isPublished: z.boolean().default(false),
});
export type FaqFormValues = z.infer<typeof faqSchema>;

export const clinicSettingsSchema = z.object({
  clinicName: z.string().trim().min(2).max(150),
  doctorName: z.string().trim().min(2).max(150),
  qualification: z.string().trim().max(150).optional().or(z.literal("")),
  specialization: z.string().trim().max(150).optional().or(z.literal("")),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  whatsapp: z.string().trim().max(20).optional().or(z.literal("")),
  email: z.string().trim().email().optional().or(z.literal("")),
  addressLine1: z.string().trim().max(200).optional().or(z.literal("")),
  addressLine2: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  state: z.string().trim().max(100).optional().or(z.literal("")),
  postalCode: z.string().trim().max(20).optional().or(z.literal("")),
  country: z.string().trim().max(100).optional().or(z.literal("")),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  googleMapsUrl: z.string().url().optional().or(z.literal("")),
  instagramUrl: z.string().url().optional().or(z.literal("")),
  facebookUrl: z.string().url().optional().or(z.literal("")),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  tagline: z.string().trim().max(200).optional().or(z.literal("")),
});
export type ClinicSettingsFormValues = z.infer<typeof clinicSettingsSchema>;
