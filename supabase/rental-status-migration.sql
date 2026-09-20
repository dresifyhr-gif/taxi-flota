-- FleetHub: dodaje status "iznajmljeno" na vozila.
-- Pokreni jednom u Supabase SQL editoru (Database → SQL). Sigurno je pokrenuti više puta.

alter table public.vehicles
  add column if not exists is_rented boolean not null default false;
