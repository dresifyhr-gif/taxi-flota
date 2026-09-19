-- ─────────────────────────────────────────────────────────────────────────────
-- FleetHub — kompletna shema baze (Supabase / Postgres)
-- Pokreni CIJELI ovaj file jednom u Supabase → SQL Editor na NOVOM projektu.
-- Idempotentno je (može se pokrenuti više puta). Nakon toga upiši env varijable
-- (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY).
-- ─────────────────────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

-- ── Prijave vozača (pojednostavljeno: osobna + osnovni podaci) ────────────────
create table if not exists public.driver_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text not null,
  hours_per_day text not null,
  status text not null default 'novo',
  note text,
  consent_accepted_at timestamptz not null,
  deduplication_hash text not null,
  id_card_front_path text not null,
  id_card_back_path text not null,
  created_at timestamptz not null default now()
);

create index if not exists driver_applications_created_at_idx
  on public.driver_applications (created_at desc);
create index if not exists driver_applications_status_idx
  on public.driver_applications (status);

alter table public.driver_applications enable row level security;
drop policy if exists "No direct public access to driver applications" on public.driver_applications;
create policy "No direct public access to driver applications"
  on public.driver_applications
  as permissive for all to public
  using (false) with check (false);

-- ── Zahtjevi za povratni poziv (ime + broj) ──────────────────────────────────
create table if not exists public.callback_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  status text not null default 'novo',
  note text,
  created_at timestamptz not null default now()
);

create index if not exists callback_requests_created_at_idx
  on public.callback_requests (created_at desc);

alter table public.callback_requests enable row level security;
drop policy if exists "No direct public access to callback requests" on public.callback_requests;
create policy "No direct public access to callback requests"
  on public.callback_requests
  as permissive for all to public
  using (false) with check (false);

-- ── Vozila za najam ───────────────────────────────────────────────────────────
create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  price text not null,
  location text not null default 'Zagreb',
  transmission text not null,
  fuel text not null,
  description text not null default '',
  highlights jsonb not null default '[]'::jsonb,
  images jsonb not null default '[]'::jsonb,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists vehicles_published_idx
  on public.vehicles (is_published, sort_order, created_at);

alter table public.vehicles enable row level security;
drop policy if exists "No direct public access to vehicles" on public.vehicles;
create policy "No direct public access to vehicles"
  on public.vehicles
  as permissive for all to public
  using (false) with check (false);

insert into public.vehicles (slug, title, price, location, transmission, fuel, description, highlights, images, sort_order)
values
  ('vw-tcross-2023', 'VW T-Cross 2023', 'od 160 EUR / tjedno', 'Zagreb', 'Ručni mjenjač', 'Benzin',
   'Kompaktan i moderan crossover novije generacije, odličan za gradsku vožnju i svakodnevni rad. Bez pologa.',
   '["Benzin, ručni mjenjač", "160 EUR tjedno, bez pologa", "Kasko osiguranje uključeno"]'::jsonb,
   '["/vehicles/vw-tcross-2023.jpg"]'::jsonb, 1),
  ('vw-taigo-2023', 'VW Taigo 2023', 'od 170 EUR / tjedno', 'Zagreb', 'Ručni mjenjač', 'Benzin',
   'Moderan i kompaktan SUV novije generacije, spreman za svakodnevni rad kroz našu flotu. Bez pologa.',
   '["Benzin, ručni mjenjač", "170 EUR tjedno, bez pologa", "Kasko osiguranje uključeno"]'::jsonb,
   '["/vehicles/vw-taigo-2023.jpg"]'::jsonb, 2),
  ('vw-passat-2018', 'VW Passat 2018', 'od 190 EUR / tjedno', 'Zagreb', 'Automatik', 'Dizel',
   'Prostrani i pouzdani sedan s automatskim mjenjačem, pogodan za dulje smjene i komfornu vožnju. Bez pologa.',
   '["Dizel 2.0, automatik", "190 EUR tjedno, bez pologa", "Kasko osiguranje uključeno"]'::jsonb,
   '["/vehicles/vw-passat-2018.jpg"]'::jsonb, 3),
  ('vw-passat-2021', 'VW Passat 2021', 'od 220 EUR / tjedno', 'Zagreb', 'Automatik', 'Dizel',
   'Noviji Passat, automatski mjenjač i dizel motor — pouzdan izbor za profesionalne vozače. Bez pologa.',
   '["Dizel, automatik", "220 EUR tjedno, bez pologa", "Kasko osiguranje uključeno"]'::jsonb,
   '["/vehicles/vw-passat-2021.jpg"]'::jsonb, 4),
  ('mercedes-b-2020', 'Mercedes B 180d 2020', 'od 250 EUR / tjedno', 'Zagreb', 'Automatik', 'Dizel',
   'Premijum vozilo novije generacije s automatskim mjenjačem, idealno za ugodan i reprezentativan rad. Bez pologa.',
   '["Dizel, automatik", "250 EUR tjedno, bez pologa", "Kasko osiguranje uključeno"]'::jsonb,
   '["/vehicles/mercedes-b-2020.jpg"]'::jsonb, 5)
on conflict (slug) do nothing;

-- ── Postavke admina (ime + lozinka + zaključavanje) ───────────────────────────
create table if not exists public.admin_settings (
  id boolean primary key default true,
  admin_name text not null default 'admin',
  password_hash text,
  is_locked boolean not null default false,
  updated_at timestamptz not null default now(),
  constraint admin_settings_singleton check (id)
);

insert into public.admin_settings (id) values (true) on conflict (id) do nothing;

alter table public.admin_settings enable row level security;
drop policy if exists "No direct public access to admin settings" on public.admin_settings;
create policy "No direct public access to admin settings"
  on public.admin_settings
  as permissive for all to public
  using (false) with check (false);

-- ── Push pretplate (obavijesti u PWA aplikaciji) ──────────────────────────────
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

alter table public.push_subscriptions enable row level security;
drop policy if exists "No direct public access to push subscriptions" on public.push_subscriptions;
create policy "No direct public access to push subscriptions"
  on public.push_subscriptions
  as permissive for all to public
  using (false) with check (false);

-- ── Storage buckets ───────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('driver-documents', 'driver-documents', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('vehicle-images', 'vehicle-images', true)
on conflict (id) do nothing;
