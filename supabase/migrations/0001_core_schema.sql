-- ─────────────────────────────────────────────────────────────────────────
-- ALIGNORA SMILES — core schema
-- Run in order against a Supabase project (Dashboard → SQL Editor, or
-- `supabase db push` with the Supabase CLI).
-- ─────────────────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

-- Keeps updated_at accurate on every UPDATE without relying on app code.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ── profiles ────────────────────────────────────────────────────────────
-- One row per admin user, linked 1:1 to auth.users. Created automatically
-- by the trigger below whenever a new Supabase Auth user is created.
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default 'admin' check (role in ('admin', 'editor', 'staff')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- Auto-create a profile row when a new auth user signs up. New accounts
-- default to 'staff' — promote to 'admin' manually via SQL editor the
-- first time, so nobody can grant themselves admin by signing up.
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email), 'staff');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ── clinic_settings ─────────────────────────────────────────────────────
-- Single-row table (enforced by the check constraint) holding every piece
-- of NAP / brand data the rest of the site renders. The app must never
-- hard-code these values in more than one place — always read from here
-- (falling back to config/site.ts only during local development before
-- Supabase is connected).
create table if not exists clinic_settings (
  id uuid primary key default gen_random_uuid(),
  singleton boolean not null default true unique,
  clinic_name text not null default 'Alignora Smiles',
  doctor_name text not null default 'Dr. Jyoti',
  qualification text default 'BDS, MDS (HPU)',
  specialization text default 'Orthodontist (Braces Specialist)',
  phone text default '+91 98720 36879',
  whatsapp text,
  email text,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  postal_code text,
  country text default 'India',
  latitude double precision,
  longitude double precision,
  google_maps_url text,
  opening_hours jsonb default '[]'::jsonb,
  instagram_url text,
  facebook_url text,
  website_url text,
  tagline text default 'Creating Beautiful Smiles with Precision & Care',
  updated_at timestamptz not null default now(),
  constraint clinic_settings_singleton check (singleton)
);

create trigger clinic_settings_set_updated_at
  before update on clinic_settings
  for each row execute function set_updated_at();

-- ── services ────────────────────────────────────────────────────────────
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_description text not null,
  detailed_description text,
  icon text,
  image_url text,
  benefits text[],
  is_published boolean not null default false,
  display_order integer not null default 0,
  seo_title text,
  meta_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists services_published_order_idx
  on services (is_published, display_order);

create trigger services_set_updated_at
  before update on services
  for each row execute function set_updated_at();

-- ── appointments ────────────────────────────────────────────────────────
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  service_id uuid references services(id) on delete set null,
  preferred_date date,
  preferred_time text,
  message text,
  status text not null default 'PENDING'
    check (status in ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED')),
  honeypot_flagged boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists appointments_status_idx on appointments (status, created_at desc);

create trigger appointments_set_updated_at
  before update on appointments
  for each row execute function set_updated_at();

-- ── authors ─────────────────────────────────────────────────────────────
create table if not exists authors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  bio text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- ── blog_categories ─────────────────────────────────────────────────────
create table if not exists blog_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text
);

-- ── blog_tags ───────────────────────────────────────────────────────────
create table if not exists blog_tags (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null
);

-- ── blog_posts ──────────────────────────────────────────────────────────
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text not null,
  featured_image_url text,
  featured_image_alt text,
  author_id uuid references authors(id) on delete set null,
  category_id uuid references blog_categories(id) on delete set null,
  status text not null default 'DRAFT'
    check (status in ('DRAFT', 'REVIEW', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED')),
  publish_at timestamptz,
  published_at timestamptz,
  seo_title text,
  meta_description text,
  focus_keyword text,
  canonical_url text,
  og_image_url text,
  robots_noindex boolean not null default false,
  source text not null default 'manual' check (source in ('manual', 'automation')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_status_idx on blog_posts (status, publish_at);
create index if not exists blog_posts_slug_idx on blog_posts (slug);

create trigger blog_posts_set_updated_at
  before update on blog_posts
  for each row execute function set_updated_at();

-- ── blog_post_tags (many-to-many) ───────────────────────────────────────
create table if not exists blog_post_tags (
  post_id uuid not null references blog_posts(id) on delete cascade,
  tag_id uuid not null references blog_tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

-- ── testimonials ────────────────────────────────────────────────────────
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  patient_display_name text not null,
  review text not null,
  rating smallint check (rating between 1 and 5),
  source text,
  review_date date,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

-- ── before_after_cases ──────────────────────────────────────────────────
create table if not exists before_after_cases (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  treatment_type text,
  before_image_url text not null,
  after_image_url text not null,
  description text,
  consent_confirmed boolean not null default false,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

-- Publishing requires explicit consent — enforced at the database level,
-- not just in the admin UI, per "never publish real patient photographs
-- without appropriate permission/consent".
alter table before_after_cases
  add constraint before_after_requires_consent
  check (is_published = false or consent_confirmed = true);

-- ── faqs ────────────────────────────────────────────────────────────────
create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  display_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists faqs_published_order_idx on faqs (is_published, display_order);

-- ── media ───────────────────────────────────────────────────────────────
-- Metadata for files stored in Supabase Storage buckets (see
-- 0003_storage.sql for bucket setup).
create table if not exists media (
  id uuid primary key default gen_random_uuid(),
  bucket text not null,
  path text not null,
  alt_text text,
  uploaded_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (bucket, path)
);

-- Seed the single clinic_settings row with confirmed signboard data.
-- Everything not visible on the signboard is left NULL intentionally.
insert into clinic_settings (clinic_name, doctor_name, qualification, specialization, phone, tagline)
values ('Alignora Smiles', 'Dr. Jyoti', 'BDS, MDS (HPU)', 'Orthodontist (Braces Specialist)', '+91 98720 36879', 'Creating Beautiful Smiles with Precision & Care')
on conflict (singleton) do nothing;
