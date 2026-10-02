-- ─────────────────────────────────────────────────────────────────────────
-- ALIGNORA SMILES — Supabase Storage buckets
-- ─────────────────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values
  ('blog-images', 'blog-images', true),
  ('service-images', 'service-images', true),
  ('before-after', 'before-after', true)
on conflict (id) do nothing;

-- Public read on all three buckets (they hold marketing/content imagery,
-- not patient records — before/after images are only ever inserted here
-- once consent_confirmed = true has been set on the related row).
create policy "public read blog-images" on storage.objects
  for select using (bucket_id = 'blog-images');
create policy "public read service-images" on storage.objects
  for select using (bucket_id = 'service-images');
create policy "public read before-after" on storage.objects
  for select using (bucket_id = 'before-after');

-- Uploads/deletes require an authenticated staff session.
create policy "staff upload blog-images" on storage.objects
  for insert with check (bucket_id = 'blog-images' and is_staff());
create policy "staff upload service-images" on storage.objects
  for insert with check (bucket_id = 'service-images' and is_staff());
create policy "staff upload before-after" on storage.objects
  for insert with check (bucket_id = 'before-after' and is_staff());

create policy "staff delete blog-images" on storage.objects
  for delete using (bucket_id = 'blog-images' and is_staff());
create policy "staff delete service-images" on storage.objects
  for delete using (bucket_id = 'service-images' and is_staff());
create policy "staff delete before-after" on storage.objects
  for delete using (bucket_id = 'before-after' and is_staff());
