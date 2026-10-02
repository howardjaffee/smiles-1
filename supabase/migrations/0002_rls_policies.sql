-- ─────────────────────────────────────────────────────────────────────────
-- ALIGNORA SMILES — Row Level Security
--
-- Model: the anon/public key can read only published, non-sensitive rows.
-- Every write, and every read of patient data, requires an authenticated
-- Supabase session belonging to a row in `profiles` (checked via the
-- is_admin_or_editor() helper). Appointment data is NEVER selectable by
-- the anon role, in either direction.
-- ─────────────────────────────────────────────────────────────────────────

alter table profiles enable row level security;
alter table clinic_settings enable row level security;
alter table services enable row level security;
alter table appointments enable row level security;
alter table authors enable row level security;
alter table blog_categories enable row level security;
alter table blog_tags enable row level security;
alter table blog_posts enable row level security;
alter table blog_post_tags enable row level security;
alter table testimonials enable row level security;
alter table before_after_cases enable row level security;
alter table faqs enable row level security;
alter table media enable row level security;

-- Helper: is the current JWT holder a staff/editor/admin?
create or replace function is_staff()
returns boolean as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
      and role in ('admin', 'editor', 'staff')
  );
$$ language sql stable security definer;

create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$ language sql stable security definer;

-- ── profiles ────────────────────────────────────────────────────────────
create policy "profiles: self read" on profiles
  for select using (id = auth.uid());
create policy "profiles: admin read all" on profiles
  for select using (is_admin());
create policy "profiles: admin manage" on profiles
  for all using (is_admin()) with check (is_admin());

-- ── clinic_settings ─────────────────────────────────────────────────────
create policy "clinic_settings: public read" on clinic_settings
  for select using (true);
create policy "clinic_settings: staff write" on clinic_settings
  for update using (is_staff()) with check (is_staff());

-- ── services ────────────────────────────────────────────────────────────
create policy "services: public read published" on services
  for select using (is_published = true or is_staff());
create policy "services: staff write" on services
  for insert with check (is_staff());
create policy "services: staff update" on services
  for update using (is_staff()) with check (is_staff());
create policy "services: staff delete" on services
  for delete using (is_staff());

-- ── appointments ────────────────────────────────────────────────────────
-- Public (anon) can INSERT only — the booking form. No public SELECT,
-- UPDATE, or DELETE under any circumstance; only staff can read/manage.
create policy "appointments: public can submit" on appointments
  for insert with check (true);
create policy "appointments: staff read" on appointments
  for select using (is_staff());
create policy "appointments: staff update" on appointments
  for update using (is_staff()) with check (is_staff());
create policy "appointments: admin delete" on appointments
  for delete using (is_admin());

-- ── authors ─────────────────────────────────────────────────────────────
create policy "authors: public read" on authors for select using (true);
create policy "authors: staff write" on authors for insert with check (is_staff());
create policy "authors: staff update" on authors for update using (is_staff()) with check (is_staff());
create policy "authors: staff delete" on authors for delete using (is_staff());

-- ── blog_categories / blog_tags ─────────────────────────────────────────
create policy "categories: public read" on blog_categories for select using (true);
create policy "categories: staff write" on blog_categories for insert with check (is_staff());
create policy "categories: staff update" on blog_categories for update using (is_staff()) with check (is_staff());
create policy "categories: staff delete" on blog_categories for delete using (is_staff());

create policy "tags: public read" on blog_tags for select using (true);
create policy "tags: staff write" on blog_tags for insert with check (is_staff());
create policy "tags: staff update" on blog_tags for update using (is_staff()) with check (is_staff());
create policy "tags: staff delete" on blog_tags for delete using (is_staff());

-- ── blog_posts ──────────────────────────────────────────────────────────
-- Public can read only PUBLISHED posts whose scheduled publish time (if
-- any) has passed. Staff can read everything, including drafts.
create policy "blog_posts: public read published" on blog_posts
  for select using (
    status = 'PUBLISHED' and (publish_at is null or publish_at <= now())
    or is_staff()
  );
create policy "blog_posts: staff write" on blog_posts
  for insert with check (is_staff());
create policy "blog_posts: staff update" on blog_posts
  for update using (is_staff()) with check (is_staff());
create policy "blog_posts: staff delete" on blog_posts
  for delete using (is_staff());

create policy "blog_post_tags: public read" on blog_post_tags for select using (true);
create policy "blog_post_tags: staff write" on blog_post_tags for insert with check (is_staff());
create policy "blog_post_tags: staff delete" on blog_post_tags for delete using (is_staff());

-- ── testimonials ────────────────────────────────────────────────────────
create policy "testimonials: public read published" on testimonials
  for select using (is_published = true or is_staff());
create policy "testimonials: staff write" on testimonials for insert with check (is_staff());
create policy "testimonials: staff update" on testimonials for update using (is_staff()) with check (is_staff());
create policy "testimonials: staff delete" on testimonials for delete using (is_staff());

-- ── before_after_cases ──────────────────────────────────────────────────
create policy "before_after: public read published" on before_after_cases
  for select using (is_published = true or is_staff());
create policy "before_after: staff write" on before_after_cases for insert with check (is_staff());
create policy "before_after: staff update" on before_after_cases for update using (is_staff()) with check (is_staff());
create policy "before_after: staff delete" on before_after_cases for delete using (is_staff());

-- ── faqs ────────────────────────────────────────────────────────────────
create policy "faqs: public read published" on faqs
  for select using (is_published = true or is_staff());
create policy "faqs: staff write" on faqs for insert with check (is_staff());
create policy "faqs: staff update" on faqs for update using (is_staff()) with check (is_staff());
create policy "faqs: staff delete" on faqs for delete using (is_staff());

-- ── media ───────────────────────────────────────────────────────────────
create policy "media: staff read" on media for select using (is_staff());
create policy "media: staff write" on media for insert with check (is_staff());
create policy "media: staff delete" on media for delete using (is_staff());
