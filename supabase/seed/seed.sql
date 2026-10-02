-- ─────────────────────────────────────────────────────────────────────────
-- ALIGNORA SMILES — seed data
--
-- Everything here is seeded as DRAFT / is_published = false. Nothing
-- appears on the live site until a human at the clinic reviews the copy
-- for accuracy and explicitly publishes it from /admin. This intentionally
-- does NOT seed testimonials or before/after cases — those must be real
-- and are added by the clinic through the admin dashboard.
-- ─────────────────────────────────────────────────────────────────────────

-- Only Orthodontics is seeded from a confirmed fact (the signboard names
-- Dr. Jyoti as "Orthodontist (Braces Specialist)"). The rest are common
-- dental-clinic service categories seeded as unpublished drafts so the
-- clinic can confirm, edit, or delete each one before it goes live —
-- per "if a service has not been confirmed by the client, make it
-- configurable instead of presenting it as fact."
insert into services (slug, title, short_description, icon, is_published, display_order)
values
  ('orthodontics', 'Orthodontics', 'Braces and orthodontic treatment to align teeth and correct bite issues, led by an orthodontist.', 'align-center', false, 1),
  ('braces', 'Braces', 'Traditional and modern braces options for straightening teeth over a treatment plan tailored to each patient.', 'smile', false, 2),
  ('clear-aligners', 'Clear Aligners', 'Removable, near-invisible aligners as an alternative to traditional braces for suitable cases.', 'sparkles', false, 3),
  ('general-dentistry', 'General Dentistry', 'Routine dental checkups, cleanings, and preventive care.', 'stethoscope', false, 4),
  ('cosmetic-dentistry', 'Cosmetic Dentistry', 'Treatments focused on the appearance of your smile.', 'sparkle', false, 5),
  ('pediatric-dentistry', 'Pediatric Dentistry', 'Dental care for children in a comfortable setting.', 'baby', false, 6),
  ('dental-implants', 'Dental Implants', 'Tooth replacement options for missing teeth.', 'anchor', false, 7),
  ('teeth-whitening', 'Teeth Whitening', 'Professional whitening treatments to brighten your smile.', 'sun', false, 8),
  ('root-canal-treatment', 'Root Canal Treatment', 'Treatment to save infected or badly decayed teeth.', 'activity', false, 9),
  ('smile-makeover', 'Smile Makeover', 'A combination of treatments planned around your smile goals.', 'heart', false, 10)
on conflict (slug) do nothing;

insert into blog_categories (slug, name, description) values
  ('dental-care', 'Dental Care', 'General dental health and hygiene topics.'),
  ('orthodontics', 'Orthodontics', 'Braces, aligners, and bite correction.'),
  ('braces', 'Braces', 'Living with and caring for braces.'),
  ('clear-aligners', 'Clear Aligners', 'Aligner treatment and care.'),
  ('oral-hygiene', 'Oral Hygiene', 'Brushing, flossing, and daily care.'),
  ('smile-care', 'Smile Care', 'Cosmetic and general smile health.'),
  ('patient-education', 'Patient Education', 'Understanding procedures and what to expect.')
on conflict (slug) do nothing;

insert into authors (name, bio) values
  ('Alignora Smiles Team', 'Educational content reviewed by the Alignora Smiles clinical team.')
on conflict do nothing;

-- Generic, non-diagnostic educational FAQs. Seeded unpublished so the
-- clinic reviews wording before it appears publicly or in FAQPage schema.
insert into faqs (question, answer, display_order, is_published) values
  ('How do I know if I need braces?', 'An orthodontist can assess your bite and tooth alignment during a consultation and let you know whether braces or another treatment may help. Book an appointment to have Dr. Jyoti take a look.', 1, false),
  ('How long does orthodontic treatment usually take?', 'Treatment length varies by case — mild alignment issues can take less time than more complex bite corrections. Your orthodontist can give you a personalized estimate after an examination.', 2, false),
  ('Are clear aligners suitable for everyone?', 'Clear aligners work well for many common alignment issues, but suitability depends on your specific case. An orthodontist can determine whether aligners or traditional braces are a better fit for you.', 3, false),
  ('Does getting braces hurt?', 'Some patients feel mild discomfort or pressure for a few days after braces are placed or adjusted, which is common and usually manageable. Speak with your orthodontist if discomfort feels unusual.', 4, false),
  ('How often should I visit the dentist?', 'A routine checkup every six months is a common general guideline, though your dentist may recommend a different schedule based on your oral health.', 5, false)
on conflict do nothing;
