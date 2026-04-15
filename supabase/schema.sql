create extension if not exists "pgcrypto";

create table if not exists public.driver_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text not null,
  city text not null,
  has_own_car boolean not null,
  birth_date date not null,
  oib text not null,
  note text,
  consent_accepted_at timestamptz not null,
  deduplication_hash text not null unique,
  id_card_path text not null,
  driver_license_path text not null,
  taxi_diploma_path text not null,
  criminal_record_certificate_path text not null,
  selfie_photo_path text not null,
  created_at timestamptz not null default now()
);

create index if not exists driver_applications_created_at_idx
  on public.driver_applications (created_at desc);

create index if not exists driver_applications_email_idx
  on public.driver_applications (email);

create index if not exists driver_applications_oib_idx
  on public.driver_applications (oib);

alter table public.driver_applications enable row level security;

create policy "No direct public access to driver applications"
on public.driver_applications
as permissive
for all
to public
using (false)
with check (false);

insert into storage.buckets (id, name, public)
values ('driver-documents', 'driver-documents', false)
on conflict (id) do nothing;
