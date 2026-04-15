import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Politika privatnosti | TAXI FLOTA",
  description: "Politika privatnosti za obradu prijava vozača i osobnih podataka na stranici TAXI FLOTA.",
};

export default function PrivacyPolicyPage() {
  return (
    <section className="bg-white py-20 text-black">
      <Container className="max-w-4xl">
        <div className="rounded-[2rem] border border-black/10 bg-[#f7f7f7] p-8 shadow-soft sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accentDark">Politika privatnosti</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">Zaštita osobnih podataka</h1>
          <div className="mt-8 space-y-6 text-sm leading-7 text-black/72">
            <p>
              TAXI FLOTA prikuplja osobne podatke isključivo radi obrade prijava za vozače, komunikacije s kandidatima i
              organizacije uključivanja u flotu.
            </p>
            <p>
              Podaci koje kandidat dostavi kroz obrazac mogu uključivati ime i prezime, kontakt podatke, datum rođenja, OIB,
              informacije o posjedovanju vozila i učitane dokumente poput osobne iskaznice, vozačke dozvole, taxi diplome,
              uvjerenja o nekažnjavanju i selfie fotografije. Ti podaci koriste se samo za procjenu prijave i daljnju
              komunikaciju vezanu uz prijavu za rad preko Uber i Bolt platformi kroz flotu.
            </p>
            <p>
              Dokumenti i prijave pohranjuju se u zaštićenim sustavima i dostupni su samo ovlaštenim osobama koje sudjeluju u
              obradi prijava. Podaci se ne koriste za marketinške svrhe bez dodatne privole.
            </p>
            <p>
              Kandidat ima pravo zatražiti pristup podacima, ispravak netočnih podataka ili brisanje podataka ako više ne
              postoji pravna osnova za njihovu obradu. Za sva pitanja vezana uz privatnost i obradu podataka moguće je
              kontaktirati voditelja obrade putem kontakt podataka navedenih na stranici.
            </p>
            <p>
              Slanjem prijave kandidat potvrđuje da su podaci točni i da pristaje na obradu osobnih podataka u svrhu obrade
              prijave za rad kroz flotu.
            </p>
          </div>
          <div className="mt-8">
            <Link href="/" className="text-sm font-semibold text-accentDark transition hover:text-accent">
              Povratak na početnu
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
