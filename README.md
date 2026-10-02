# Alignora Smiles — Website & Admin CMS

A Next.js 14 (App Router) + TypeScript + Tailwind CSS + Supabase website and
admin content-management system for Alignora Smiles, a dental and
orthodontic clinic led by Dr. Jyoti.

**Non-technical, step-by-step version of everything below (Supabase,
email notifications, GitHub, Vercel, going live) → see `SETUP_GUIDE.md`.**
This README is the fuller technical reference.

---

## 0. Read this first — honest status

This project was generated in an environment with **no internet access**,
so `npm install` was never run and the build was never compiled or tested
end-to-end. The code is complete and internally consistent, but you should
budget time to:

1. Run `npm install` and fix any dependency-version friction that comes up.
2. Run `npm run typecheck` and `npm run build` and fix anything that surfaces.
3. Connect a real Supabase project (see below) — nothing works against live
   data until you do.
4. Replace every placeholder marked below with real clinic information.

**Confirmed real data** (from the clinic signboard) already wired in:
Alignora Smiles · Dr. Jyoti · Orthodontist (Braces Specialist) · BDS, MDS
(HPU) · +91 98720 36879 · "Creating Beautiful Smiles with Precision & Care".

**Not real — placeholders you must fill in** before launch, via
`/admin/settings` once Supabase is connected (or by editing
`config/site.ts` for local preview before that):
- Clinic address, city, state, postal code, coordinates
- Email address, WhatsApp number
- Opening hours
- Google Maps URL, Instagram, Facebook
- Doctor experience, awards, memberships, certifications
- Treatment pricing
- All testimonials and before/after cases (none are seeded — see §7)
- The 10 seeded services are unpublished drafts with generic descriptions
  — review and rewrite before publishing any of them (see §6)
- Real photography (no stock "doctor" photo was used anywhere — the hero
  section uses an original abstract illustration instead; see §8)

---

## 1. Tech stack

- **Next.js 14** (App Router, Server Components + Server Actions)
- **TypeScript**, strict mode
- **Tailwind CSS** with a custom design token set (see `tailwind.config.ts`)
- **Supabase**: Postgres + Row Level Security, Auth, Storage
- **Zod** for validation, **react-markdown** for blog/service content
- **Lucide** icons

## 2. Project structure

```
app/(public)/        Public marketing site (Server Components)
app/admin/login       Admin sign-in (standalone, no dashboard chrome)
app/admin/(dashboard) Authenticated admin CMS (sidebar layout + auth guard)
app/api/cron          Scheduled blog publishing (Vercel Cron)
app/api/automation     Blog-draft endpoint for n8n/Make/Zapier
components/ui          Low-level primitives (Button, Input, Card, ...)
components/layout       Header, Footer, mobile sticky CTA
components/sections     Homepage/page sections (Hero, FAQ accordion, ...)
components/admin        Admin-only UI (editors, managers, sidebar)
components/brand        Logo component
lib/supabase            Browser / server / service-role Supabase clients
lib/data                 Server-side data-fetching functions (read side)
lib/actions               Server Actions (write side) — one file per domain
lib/validation             Zod schemas shared by forms and API routes
lib/seo                     Metadata + JSON-LD builders
config/site.ts                Confirmed brand facts + placeholders
supabase/migrations             SQL schema, RLS policies, storage buckets
supabase/seed                    Seed data (all unpublished by default)
```

**Why a route group for admin?** `app/admin/(dashboard)/layout.tsx` renders
the sidebar and redirects to `/admin/login` if there's no session.
`/admin/login` deliberately lives *outside* that route group (as a sibling
folder) so it never gets wrapped by the very layout that would redirect
away from it — that would be an infinite loop.

## 3. Local setup

```bash
npm install
cp .env.example .env.local   # then fill in the values (see §4)
npm run dev
```

## 4. Setting up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In **Project Settings → API**, copy the Project URL, `anon` public key,
   and `service_role` secret key into `.env.local`.
3. Run the migrations, in order, via the Supabase SQL Editor (or the
   Supabase CLI: `supabase db push` after `supabase link`):
   - `supabase/migrations/0001_core_schema.sql`
   - `supabase/migrations/0002_rls_policies.sql`
   - `supabase/migrations/0003_storage.sql`
   - `supabase/seed/seed.sql` (optional but recommended — seeds draft
     services, FAQs, blog taxonomy; nothing is published automatically)
4. **Create your first admin user**: Supabase Dashboard → Authentication →
   Add user (email + password). A `profiles` row is created automatically
   with `role = 'staff'`. Promote yourself to admin via SQL Editor:
   ```sql
   update profiles set role = 'admin' where id =
     (select id from auth.users where email = 'you@example.com');
   ```
   New signups default to `staff`, not `admin`, so nobody can grant
   themselves admin access just by creating an account.
5. Sign in at `/admin/login`.

## 5. Environment variables

See `.env.example` for the full list. Never commit `.env.local`. Never
expose `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`, or
`AUTOMATION_API_SECRET` to client-side code (no `NEXT_PUBLIC_` prefix).

## 6. Managing content

Everything editorial happens at `/admin` — no code changes or
redeployment needed for day-to-day updates:

- **Blog**: `/admin/blog` → New post. Markdown editor with a formatting
  toolbar and live preview, SEO fields with a Google search preview,
  category/tag/author pickers, and Draft / Review / Scheduled / Published
  / Archived status. Scheduled posts go live automatically (see §9) —
  no manual deploy required.
- **Services**: `/admin/services`. The 10 seeded services (Orthodontics,
  Braces, Clear Aligners, General Dentistry, Cosmetic Dentistry, Pediatric
  Dentistry, Dental Implants, Teeth Whitening, Root Canal Treatment, Smile
  Makeover) are unpublished by default — review/rewrite each one and
  toggle it published only once the clinic has confirmed it's offered.
- **Testimonials / FAQs / Before & After**: each has its own admin page
  with an add form and a publish toggle. None are seeded with fake data —
  add real ones as they come in. Before/after cases cannot be published
  without checking the "patient consent confirmed" box (also enforced at
  the database level via a CHECK constraint).
- **Settings** (`/admin/settings`): the single source of truth for NAP
  data, contact info, and social links — everything else on the site
  reads from here.

## 7. Images

No image files were downloaded or generated as part of this build (the
generation environment had no network/image-generation access). You'll
need to:
- Upload a real clinic/doctor photo and service/blog images to the
  Supabase Storage buckets created by `0003_storage.sql`
  (`blog-images`, `service-images`, `before-after`), then reference their
  public URLs in the relevant admin forms.
- Add an `/public/images/og-default.jpg` (1200×630) for link previews —
  referenced as a fallback in `lib/seo/metadata.ts`.

## 8. Logo

An original SVG mark was designed for this project — an open "arch wire"
ring around a tooth crown with a bracket-and-wire detail (see
`components/brand/logo.tsx` and the static files in `public/icons/`):
`logo-primary-{light,dark}-bg.svg`, `logo-icon-{light,dark}-bg.svg`, and
`public/favicon.svg`. It is not based on or copied from any existing
company's branding.

## 9. Scheduled blog publishing

`app/api/cron/publish-scheduled/route.ts` flips `SCHEDULED` posts to
`PUBLISHED` once `publish_at` has passed, then revalidates the blog index,
the post page, and the sitemap. `vercel.json` runs it every 15 minutes via
Vercel Cron. Vercel automatically sends `Authorization: Bearer
$CRON_SECRET` to cron requests once `CRON_SECRET` is set as an environment
variable — set the same value in your Vercel project settings.

## 9.5. Email notifications (booking alerts)

When someone submits the booking form, `lib/actions/appointments.ts` now
also calls `lib/email/appointment-emails.ts`, which (via
[Resend](https://resend.com)) sends:
- A notification to `NOTIFICATION_EMAIL` (the clinic's own inbox) with
  the patient's details and a link straight to `/admin/appointments`.
- A confirmation to the patient's own email, if they provided one.

Both are **best-effort** — the booking is saved to the database first,
and email sending is wrapped in its own try/catch, so a Resend outage or
missing configuration never blocks a booking from succeeding. Until
`RESEND_API_KEY` and `NOTIFICATION_EMAIL` are set, this silently no-ops
and you just rely on checking `/admin/appointments`.

**See `SETUP_GUIDE.md` for the full, non-technical, step-by-step version
of everything from here through deployment** — Supabase, Resend, GitHub,
and Vercel, written for handing off to whoever will actually run this
clinic's website day-to-day.

## 10. Automation API (n8n / Make / Zapier)

`POST /api/automation/blog-draft` (see the file for the full request
shape) lets an external workflow create a blog **draft** — it can never
publish directly; the schema only accepts `DRAFT` or `REVIEW`. A human
must open the post in `/admin/blog` and explicitly publish or schedule it.
Authenticate with `Authorization: Bearer $AUTOMATION_API_SECRET`.

This is intentionally just the ingestion endpoint — actual keyword
research, draft generation, etc. are external steps you'd wire up in your
automation tool of choice; this project only provides the secure landing
point for the result.

## 11. SEO

- `app/sitemap.ts` / `app/robots.ts` — dynamic, only ever include
  published content; drafts/scheduled/archived posts and `/admin`, `/api`
  are excluded.
- `lib/seo/metadata.ts` / `lib/seo/json-ld.tsx` — per-page metadata and
  JSON-LD (Dentist/LocalBusiness, WebSite, BreadcrumbList, FAQPage,
  Service, BlogPosting). Structured data only ever includes fields with
  real, confirmed values — unconfirmed fields (address, hours,
  coordinates) are omitted rather than faked.
- **Google Search Console**: add `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
  (the HTML-tag verification value) to your environment, redeploy, verify
  ownership in Search Console, then submit `https://yourdomain/sitemap.xml`.
  From there, monitor Indexing, Search queries (Performance report), and
  Core Web Vitals from the Search Console sidebar.
- **Analytics**: set `NEXT_PUBLIC_GA_ID` and/or `NEXT_PUBLIC_GTM_ID` once
  you have real IDs — `components/analytics/analytics-scripts.tsx` renders
  nothing until they're set. `lib/analytics/events.ts` exposes
  `trackEvent()` for the conversion events already wired into the
  appointment form (`appointment_started`, `appointment_submitted`) —
  call it from other components for `phone_clicked`, `whatsapp_clicked`,
  `blog_view`, `service_view` as needed.
- **Reality check**: technical SEO infrastructure (this project) doesn't
  by itself guarantee rankings — that also depends on content quality,
  backlinks, Google Business Profile, reviews, and competition. The admin
  SEO preview widget says as much rather than overpromising.

## 12. Security

- RLS is the real access-control boundary (see
  `supabase/migrations/0002_rls_policies.sql`), not just the app's UI.
  Appointment data has no public SELECT policy at all — only an INSERT
  policy for the booking form and staff-only SELECT/UPDATE.
- `middleware.ts` refreshes the Supabase session and redirects
  unauthenticated visitors away from `/admin/*` (except `/admin/login`);
  the dashboard layout does a second, defense-in-depth check.
- The service-role key (`lib/supabase/admin.ts`) is guarded by the
  `server-only` package and used only in the two API routes that
  legitimately need to bypass RLS.
- Security headers are set in `next.config.js`
  (`X-Frame-Options`, `X-Content-Type-Options`, etc.).
- The appointment form has a honeypot field plus server-side Zod
  validation — consider adding a proper CAPTCHA (e.g. Cloudflare Turnstile)
  if spam becomes a problem.

## 13. Deploying to Vercel

1. Push this repository to GitHub.
2. Import it into Vercel.
3. Add every variable from `.env.example` in Vercel → Project → Settings →
   Environment Variables (Production and Preview).
4. Deploy. `vercel.json` registers the cron job automatically.
5. Point your domain at the Vercel project and confirm HTTPS is active
   (Vercel provisions this automatically for custom domains).
6. Re-run the Supabase migrations against your **production** Supabase
   project if it's different from the one used in development.

## 14. What's still manual / not implemented

Being direct about the gaps, per the brief's own "don't fabricate
functionality" instruction:

- No automated test suite (`npm run build`/`typecheck`/`lint` should be
  run and fixed before launch — see §0).
- No image upload UI in the admin — images are added by pasting a
  Supabase Storage public URL. Wiring up a direct upload button (Supabase
  Storage JS client, straightforward to add) was left out of this pass.
- No real CAPTCHA on the booking form (honeypot only).
- No WhatsApp/SMS notification when a new appointment arrives — email
  notifications (via Resend, see §9.5 and `SETUP_GUIDE.md`) cover this for
  now. WhatsApp Business API is paid and considerably more involved to
  set up; worth adding later if email isn't enough.
- No notification when an automation workflow creates a blog draft (see
  §10) — only appointment bookings trigger emails right now. Add a call
  to `lib/email/appointment-emails.ts`-style helper in the automation
  route if you want that too.
- No multi-language support.
- Editor role vs. staff role are modeled in the database (`profiles.role`)
  but the admin UI doesn't yet restrict features by role — all
  authenticated staff/editor/admin accounts currently have equal access
  to the CMS. Fine for a single-clinic team; worth revisiting if you add
  more accounts later.
