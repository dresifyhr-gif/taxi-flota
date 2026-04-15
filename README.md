# TAXI FLOTA

Production-ready Next.js landing stranica za prijavu vozača u flotu za ride-hailing platforme u Hrvatskoj. Projekt je optimiziran za mobilne korisnike, ima hrvatski conversion-focused copy, online upload dokumenata, spremanje prijava u Supabase i slanje admin email obavijesti.

## Stack

- Next.js 15 (`app` router)
- Tailwind CSS
- Supabase Database + Storage
- Resend za email notifikacije
- React Hook Form + Zod validacija

## Funkcionalnosti

- Moderna landing stranica na hrvatskom jeziku
- Sticky mobile CTA i smooth scrolling navigacija
- Hero, how-it-works, benefits, najam vozila, FAQ, kontakt i prijavna forma
- Validacija forme s porukama na hrvatskom jeziku
- Upload osobne iskaznice, vozačke dozvole, taxi diplome, uvjerenja o nekažnjavanju i selfie fotografije u privatni Supabase Storage bucket
- Spremanje prijava u Supabase tablicu
- Admin email obavijest za svaku uspješnu prijavu
- Zaštita od duplicate prijava unutar 24 sata
- Zasebna stranica `najam-vozila` s oglasničkim prikazom vozila
- Privacy Policy i Pravne informacije stranice
- SEO metadata i Open Graph

## Pokretanje lokalno

1. Instaliraj ovisnosti:

```bash
npm install
```

2. Kopiraj `.env.example` u `.env.local` i upiši stvarne vrijednosti:

```bash
cp .env.example .env.local
```

3. U Supabase SQL editoru pokreni [supabase/schema.sql](/Users/igor/projects/uber%20bolt/supabase/schema.sql).

4. Pokreni development server:

```bash
npm run dev
```

5. Otvori [http://localhost:3000](http://localhost:3000).

## Environment varijable

| Naziv | Opis |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Javna domena stranice |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key za server-side upload i insert |
| `SUPABASE_STORAGE_BUCKET` | Naziv private storage bucketa, zadano `driver-documents` |
| `SUPABASE_APPLICATIONS_TABLE` | Naziv tablice za prijave, zadano `driver_applications` |
| `RESEND_API_KEY` | API key za slanje emaila |
| `ADMIN_NOTIFICATION_EMAIL` | Email na koji dolaze prijave |
| `EMAIL_FROM` | Verified sender, npr. `TAXI FLOTA <noreply@domena.hr>` |

## Tok prijave

1. Korisnik ispunjava formu i učitava dokumente.
2. API ruta `/api/applications` validira podatke i datoteke.
3. Dokumenti se spremaju u private Supabase Storage.
4. Podaci se upisuju u `driver_applications`.
5. Admin dobiva email s pregledom prijave i signed linkovima na dokumente.
6. Ako bilo koji korak ne uspije, projekt pokušava počistiti spremljene podatke kako ne bi ostala polovična prijava.

## Resend setup

- Dodaj i verificiraj domenu ili sender u Resendu.
- U `EMAIL_FROM` koristi verified adresu.
- `ADMIN_NOTIFICATION_EMAIL` može biti ista ili druga adresa na koju želiš primati prijave.

## Deploy

Projekt se može deployati na Vercel, Netlify ili bilo koji Node hosting koji podržava Next.js. Obavezno:

- postavi sve environment varijable
- kreiraj Supabase tablicu i private storage bucket
- provjeri da Resend sender domena radi u produkciji
- po potrebi zamijeni kontakt podatke u `lib/site.ts`

## Prilagodba sadržaja

- Kontakt podaci, navigacija i osnovni site metadata nalaze se u `lib/site.ts`
- Vizualni stil i sekcije nalaze se u `components/sections.tsx`
- Prijavna forma nalazi se u `components/application-form.tsx`
- Oglasnik vozila nalazi se u `app/najam-vozila/page.tsx`
- Backend logika nalazi se u `app/api/applications/route.ts`

## Provjere

```bash
npm run lint
npm run typecheck
npm run build
```
