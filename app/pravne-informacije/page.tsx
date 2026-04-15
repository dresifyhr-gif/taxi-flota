import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Pravne informacije | TAXI FLOTA",
  description: "Osnovne pravne informacije i uvjeti korištenja stranice TAXI FLOTA.",
};

export default function LegalInfoPage() {
  return (
    <section className="bg-black py-20 text-white">
      <Container className="max-w-4xl">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-soft sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Pravne informacije</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">Osnovne informacije i uvjeti korištenja</h1>
          <div className="mt-8 space-y-6 text-sm leading-7 text-white/72">
            <p>
              Ova stranica služi isključivo za informiranje kandidata i zaprimanje prijava vozača zainteresiranih za rad kroz
              flotu TAXI FLOTA u Hrvatskoj, uključujući rad preko Uber i Bolt platformi te upite za najam vozila.
            </p>
            <p>
              Spominjanje platformi Uber i Bolt koristi se samo u informativnom kontekstu radi objašnjenja vrste posla i
              procesa uključivanja vozača. Na stranici se ne koriste njihovi logotipi, službeni vizuali niti se tvrdi formalna
              povezanost izvan poslovnog konteksta rada kroz flotu.
            </p>
            <p>
              Slanje prijave ne predstavlja automatsko prihvaćanje kandidata u flotu. Svaka prijava prolazi pregled podataka i
              dokumentacije prije donošenja odluke o nastavku procesa.
            </p>
            <p>
              Kandidat je odgovoran za točnost podataka koje dostavlja. TAXI FLOTA zadržava pravo zatražiti dodatne
              informacije ili dokumente ako su potrebni za dovršetak obrade prijave.
            </p>
            <p>
              Sadržaj stranice može se ažurirati radi usklađivanja s poslovnim procesima, zakonskim zahtjevima i operativnim
              potrebama.
            </p>
          </div>
          <div className="mt-8">
            <Link href="/" className="text-sm font-semibold text-accent transition hover:text-white">
              Povratak na početnu
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
