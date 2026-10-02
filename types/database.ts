/**
 * Hand-written mirror of the Supabase schema defined in
 * /supabase/migrations. Once the project is linked to a real Supabase
 * instance, regenerate this file with:
 *
 *   npx supabase gen types typescript --project-id <project-id> > types/database.ts
 *
 * and re-export the convenience aliases below on top of the generated
 * `Database` type so the rest of the app doesn't need to change.
 */

export type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
export type BlogStatus = "DRAFT" | "REVIEW" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
export type AdminRole = "admin" | "editor" | "staff";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string; // references auth.users.id
          full_name: string;
          role: AdminRole;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
          full_name: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      clinic_settings: {
        Row: {
          id: string;
          clinic_name: string;
          doctor_name: string;
          qualification: string | null;
          specialization: string | null;
          phone: string | null;
          whatsapp: string | null;
          email: string | null;
          address_line1: string | null;
          address_line2: string | null;
          city: string | null;
          state: string | null;
          postal_code: string | null;
          country: string | null;
          latitude: number | null;
          longitude: number | null;
          google_maps_url: string | null;
          /** jsonb array of { dayOfWeek, opens, closes } — see config/site.ts hours.schedule */
          opening_hours: unknown;
          instagram_url: string | null;
          facebook_url: string | null;
          website_url: string | null;
          tagline: string | null;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["clinic_settings"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["clinic_settings"]["Row"]>;
      };
      services: {
        Row: {
          id: string;
          slug: string;
          title: string;
          short_description: string;
          detailed_description: string | null;
          icon: string | null;
          image_url: string | null;
          benefits: string[] | null;
          is_published: boolean;
          display_order: number;
          seo_title: string | null;
          meta_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["services"]["Row"]> & {
          slug: string;
          title: string;
          short_description: string;
        };
        Update: Partial<Database["public"]["Tables"]["services"]["Row"]>;
      };
      appointments: {
        Row: {
          id: string;
          full_name: string;
          phone: string;
          email: string | null;
          service_id: string | null;
          preferred_date: string | null;
          preferred_time: string | null;
          message: string | null;
          status: AppointmentStatus;
          honeypot_flagged: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["appointments"]["Row"]> & {
          full_name: string;
          phone: string;
        };
        Update: Partial<Database["public"]["Tables"]["appointments"]["Row"]>;
      };
      authors: {
        Row: {
          id: string;
          name: string;
          bio: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["authors"]["Row"]> & { name: string };
        Update: Partial<Database["public"]["Tables"]["authors"]["Row"]>;
      };
      blog_categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["blog_categories"]["Row"]> & {
          slug: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["blog_categories"]["Row"]>;
      };
      blog_tags: {
        Row: {
          id: string;
          slug: string;
          name: string;
        };
        Insert: Partial<Database["public"]["Tables"]["blog_tags"]["Row"]> & {
          slug: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["blog_tags"]["Row"]>;
      };
      blog_post_tags: {
        Row: {
          post_id: string;
          tag_id: string;
        };
        Insert: Database["public"]["Tables"]["blog_post_tags"]["Row"];
        Update: Partial<Database["public"]["Tables"]["blog_post_tags"]["Row"]>;
      };
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          content: string;
          featured_image_url: string | null;
          featured_image_alt: string | null;
          author_id: string | null;
          category_id: string | null;
          status: BlogStatus;
          publish_at: string | null;
          published_at: string | null;
          seo_title: string | null;
          meta_description: string | null;
          focus_keyword: string | null;
          canonical_url: string | null;
          og_image_url: string | null;
          robots_noindex: boolean;
          source: "manual" | "automation";
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["blog_posts"]["Row"]> & {
          slug: string;
          title: string;
          content: string;
        };
        Update: Partial<Database["public"]["Tables"]["blog_posts"]["Row"]>;
      };
      testimonials: {
        Row: {
          id: string;
          patient_display_name: string;
          review: string;
          rating: number | null;
          source: string | null;
          review_date: string | null;
          is_published: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["testimonials"]["Row"]> & {
          patient_display_name: string;
          review: string;
        };
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Row"]>;
      };
      before_after_cases: {
        Row: {
          id: string;
          title: string;
          treatment_type: string | null;
          before_image_url: string;
          after_image_url: string;
          description: string | null;
          consent_confirmed: boolean;
          is_published: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["before_after_cases"]["Row"]> & {
          title: string;
          before_image_url: string;
          after_image_url: string;
        };
        Update: Partial<Database["public"]["Tables"]["before_after_cases"]["Row"]>;
      };
      faqs: {
        Row: {
          id: string;
          question: string;
          answer: string;
          display_order: number;
          is_published: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["faqs"]["Row"]> & {
          question: string;
          answer: string;
        };
        Update: Partial<Database["public"]["Tables"]["faqs"]["Row"]>;
      };
      media: {
        Row: {
          id: string;
          bucket: string;
          path: string;
          alt_text: string | null;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["media"]["Row"]> & {
          bucket: string;
          path: string;
        };
        Update: Partial<Database["public"]["Tables"]["media"]["Row"]>;
      };
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
