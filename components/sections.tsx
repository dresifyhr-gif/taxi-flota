import {
  BadgeCheck,
  CarFront,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  FileCheck2,
  Handshake,
  Headphones,
  MapPinned,
  MessageSquareText,
  ShieldCheck,
  TimerReset,
  UserRoundPlus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ApplicationForm } from "@/components/application-form";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";
import { siteConfig } from "@/lib/site";
import { blogPosts } from "@/lib/blog";

const steps = [
  {
    title: "Ispuni prijavu",
    description: "Ostavi osnovne podatke i odmah pošalji dokumente kroz sigurnu online prijavu.",
    icon: ClipboardCheck,
  },
  {
    title: "Pošalji dokumente",
    description: "Osobna iskaznica i vozačka dozvola šalju se direktno kroz obrazac, bez dodatnog dopisivanja.",
    icon: FileCheck2,
  },
  {
    title: "Pregledamo podatke",
    description: "Provjeravamo prijavu, javljamo se brzo i vodimo te kroz sljedeće korake.",
    icon: ShieldCheck,
  },
  {
    title: "Uključujemo te u flotu",
    description: "Nakon potvrde pomažemo pri onboardingu i uključivanju u rad preko flote.",
    icon: UserRoundPlus,
  },
];

const benefits = [
  {
    title: "Administrativna pomoć",
    description: "Pomažemo ti razumjeti korake, dokumentaciju i proces prijave bez nepotrebnog gubljenja vremena.",
    icon: BadgeCheck,
  },
  {
    title: "Sam biraš koliko radiš",
    description: "Vozači sami određuju svoj ritam rada, biraju koliko žele voziti i organiziraju dan na način koji im najviše odgovara.",
    icon: TimerReset,
  },
  {
    title: "Pomoć oko taxi ispita",
    description: "Ako tek ulaziš u posao, upućujemo te oko taxi ispita, taxi kartica i koraka koje trebaš riješiti da možeš voziti preko naše flote.",
    icon: ClipboardCheck,
  },
  {
    title: "Isplata svaki tjedan",
    description: "Nakon uključenja u rad kroz flotu, isplate se organiziraju tjedno uz jasan i transparentan operativni ritam.",
    icon: Handshake,
  },
  {
    title: "Brža komunikacija",
    description: "Prijava ide na jedno mjesto, a odgovor dobivaš brzo i jasno, bez raspršenih poruka i dokumenata.",
    icon: MessageSquareText,
  },
  {
    title: "Obavezna prijava",
    description: "Za početak rada potrebna je potpuna i obavezna prijava sa svim traženim dokumentima kako bi obrada išla bez zastoja.",
    icon: ShieldCheck,
  },
];

const faqItems = [
  {
    question: "Kako se prijaviti?",
    answer:
      "Ispuni online prijavu na ovoj stranici, učitaj tražene dokumente i pričekaj da ti se javimo s povratnom informacijom.",
  },
  {
    question: "Trebam li imati vlastiti auto?",
    answer:
      "Ne moraš. U prijavi možeš označiti da nemaš vlastito vozilo i razmotrit ćemo opciju najma vozila kroz flotu.",
  },
  {
    question: "Koje dokumente trebam poslati?",
    answer:
      "Za obradu prijave trebamo osobnu iskaznicu, vozačku dozvolu, taxi diplomu, uvjerenje o nekažnjavanju i selfie fotografiju.",
  },
  {
    question: "Koliko traje obrada prijave?",
    answer:
      "Većinu prijava pregledavamo brzo, najčešće unutar jednog radnog dana, ovisno o potpunosti dokumentacije.",
  },
  {
    question: "Kako funkcionira isplata?",
    answer:
      "Nakon uključivanja u rad kroz flotu, isplata se organizira svaki tjedan. Točne operativne detalje objašnjavamo nakon pregleda prijave.",
  },
  {
    question: "Mogu li sam birati koliko ću raditi?",
    answer:
      "Da. Vozači sami organiziraju svoj ritam rada i biraju koliko žele voziti, ovisno o svojim planovima i rasporedu.",
  },
  {
    question: "Mogu li se prijaviti ako tek planiram početi?",
    answer:
      "Da. Ako tek planiraš krenuti, prijavi se i objasni svoju situaciju u napomeni pa ćemo ti reći koji su sljedeći koraci.",
  },
  {
    question: "Pomažete li oko taxi ispita i taxi kartica?",
    answer:
      "Da. Kandidate upućujemo oko taxi ispita, taxi kartica i ostalih koraka potrebnih da mogu raditi i voziti preko naše flote.",
  },
];

export function HeroSection() {
  return (
    <section id="pocetna" className="relative overflow-hidden bg-[#f3f5f3] pb-24 pt-16 text-black sm:pb-28 sm:pt-20">
      <div className="absolute inset-0 bg-hero-grid bg-[size:44px_44px] opacity-[0.07]" />
      <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top_right,_rgba(34,197,94,0.16),_transparent_35%),radial-gradient(circle_at_left,_rgba(0,0,0,0.04),_transparent_30%)]" />
      <Container className="relative grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-accentDark shadow-sm">
            Otvorene prijave
          </span>
          <h1 className="mt-6 text-[1.75rem] font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Započni rad preko Uber i Bolt platformi kroz našu flotu, uz jasan i profesionalan proces prijave.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-black/68 sm:text-lg sm:leading-8">
            TAXI FLOTA vodi vozače kroz prijavu, obradu dokumentacije i onboarding za rad preko Uber i Bolt platformi u Hrvatskoj, uz fleksibilnost da sami biraju koliko žele raditi.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/prijava">Prijavi se odmah</ButtonLink>
            <ButtonLink href="/kako-radi" variant="secondary" className="bg-white/80">
              Saznaj više
            </ButtonLink>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Brz odgovor", value: "u kratkom roku", icon: TimerReset },
              { label: "Tjedna isplata", value: "nakon uključenja", icon: ChevronRight },
              { label: "Sam biraš ritam", value: "radiš koliko želiš", icon: Headphones },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-black/10 bg-white p-5 shadow-soft">
                <item.icon className="h-5 w-5 text-accent" />
                <p className="mt-4 text-sm text-black/55">{item.label}</p>
                <p className="mt-1 text-base font-semibold text-black">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative flex items-center justify-center">
          <div className="absolute -right-10 top-10 h-52 w-52 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -left-4 bottom-8 h-40 w-40 rounded-full bg-black/5 blur-3xl" />
          <Image
            src="/hero.png"
            alt="Taxi Flota — Uber i Bolt vozači"
            width={620}
            height={440}
            className="relative w-full max-w-lg drop-shadow-2xl lg:max-w-full"
            priority
          />
        </div>
      </Container>
    </section>
  );
}

export function HowItWorksSection() {
  return (
    <section id="kako-radi" className="bg-white py-20 text-black sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Kako funkcionira"
          title="Jednostavan proces prijave od prvog koraka do uključivanja u flotu"
          description="Stranicu smo složili tako da vozač može poslati sve potrebno odmah, bez dodatnog slanja dokumenata kroz više kanala."
        />
        <div className="mx-auto mt-8 max-w-3xl rounded-[1.75rem] border border-accent/20 bg-accent/10 p-5 text-center text-sm leading-7 text-black/72">
          Prijava je namijenjena kandidatima koji žele raditi preko Uber i Bolt platformi kroz TAXI FLOTA flotu.
        </div>
        <div className="mt-14 grid gap-5 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-[1.75rem] border border-black/10 bg-[#f6f7f6] p-6 shadow-soft">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                <step.icon className="h-7 w-7" />
              </div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.24em] text-black/42">Korak {index + 1}</p>
              <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-black/65">{step.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function BenefitsSection() {
  return (
    <section className="bg-white py-20 text-black sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Rad kroz našu flotu"
          title="Zašto se vozači odlučuju prijaviti upravo kroz TAXI FLOTA"
          description="Naglasak je na organiziranom procesu, jasnoj komunikaciji, pomoći oko taxi ispita, fleksibilnom radu i podršci kroz prijavu i onboarding."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="rounded-[1.8rem] border border-black/10 bg-[#f7f7f7] p-6 shadow-soft">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-accent">
                <benefit.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-semibold">{benefit.title}</h3>
              <p className="mt-3 text-sm leading-7 text-black/65">{benefit.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function RentalSection() {
  return (
    <section id="najam" className="overflow-hidden bg-[#eef2ee] py-20 text-black sm:py-24">
      <Container className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="max-w-xl">
          <span className="inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-accentDark">
            Najam vozila
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            Nemaš vlastiti auto? I dalje se možeš prijaviti za rad preko Uber i Bolt platformi.
          </h2>
          <p className="mt-5 text-lg leading-8 text-black/68">
            Imamo aute za tjedni i dnevni najam vozila u Zagrebu. Sva vozila su novije generacije od 2020. do 2025. godine, kasko osigurana i pripremljena za profesionalan rad kroz flotu.
          </p>
          <ul className="mt-8 space-y-4 text-sm leading-7 text-black/78">
            {[
              "Saltung modeli počinju od 180 EUR tjednog najma.",
              "Automatik modeli počinju od 200 EUR tjednog najma.",
              "Na raspolaganju je ponuda od 20+ vozila u Zagrebu.",
              "Dostupni su tjedni i dnevni najam vozila, ovisno o potrebi i raspoloživosti.",
              "Sva vozila su kasko osigurana i pripadaju generacijama od 2020. do 2025. godine.",
              "Ako trenutno nemamo slobodno vozilo u vlastitoj floti, pokušavamo ga osigurati kroz provjerene partnere.",
              "Prijava za najam i prijava za rad rješavaju se kroz isti obrazac.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 rounded-full bg-accent/15 p-1.5 text-accent">
                  <BadgeCheck className="h-4 w-4" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/prijava">Prijavi se za rad ili najam</ButtonLink>
            <Link
              href="/najam-vozila"
              className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-black transition hover:border-accent hover:text-accent"
            >
              Pogledaj vozila za najam
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-x-10 top-6 h-56 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative rounded-[2rem] border border-black/10 bg-gradient-to-br from-white to-[#f2f5f2] p-6 shadow-soft">
            <div className="rounded-[1.7rem] border border-black/10 bg-white p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-accent/15 text-accent">
                  <CarFront className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-black/45">Opcija za kandidate</p>
                  <p className="mt-2 text-2xl font-semibold">Tjedni i dnevni najam vozila</p>
                </div>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  "Tjedni i dnevni najam vozila",
                  "20+ vozila dostupnih u Zagrebu",
                  "Saltung od 180 EUR tjedno",
                  "Automatik od 200 EUR tjedno",
                  "Kasko osigurana vozila 2020. - 2025. godište",
                ].map((item) => (
                  <div key={item} className="rounded-3xl border border-black/10 bg-[#f6f7f6] p-5 text-sm leading-6 text-black/72">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function FaqSection() {
  return (
    <section id="faq" className="bg-white py-20 text-black sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Česta pitanja"
          title="Najčešća pitanja prije slanja prijave"
          description="Odgovori su kratki i praktični kako bi vozač odmah znao što očekivati."
        />
        <div className="mx-auto mt-14 max-w-4xl space-y-4">
          {faqItems.map((item) => (
            <details
              key={item.question}
              className="group rounded-[1.75rem] border border-black/10 bg-[#f7f7f7] p-6 shadow-soft"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-lg font-semibold">
                {item.question}
                <CircleHelp className="h-5 w-5 shrink-0 text-accent transition group-open:rotate-45" />
              </summary>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-black/65">{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function ApplicationSection() {
  return (
    <section id="prijava" className="bg-[#f4f5f4] py-20 text-black sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Prijava vozača"
          title="Pošalji kompletnu prijavu kroz obrazac"
          description="Sve podatke i dokumente možeš poslati odmah. Podaci se koriste isključivo za obradu prijave za vozača."
        />
        <div className="mt-14 grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="rounded-[2rem] bg-black p-8 text-white shadow-soft">
            <h3 className="text-2xl font-semibold">Što trebaš pripremiti</h3>
            <div className="mt-8 space-y-4">
              {[
                "Osnovne kontakt podatke i grad u kojem želiš voziti.",
                "OIB i datum rođenja radi obrade prijave.",
                "Osobnu iskaznicu, vozačku dozvolu i taxi diplomu u JPG, PNG ili PDF formatu.",
                "Uvjerenje o nekažnjavanju i selfie fotografiju za dovršetak prijave.",
                "Ako još nisi sve riješio, upućujemo te oko taxi ispita, taxi kartica i ostalih potrebnih koraka.",
                "Napomenu ako nemaš vozilo ili tek planiraš početi raditi preko Uber ili Bolt platforme.",
              ].map((item) => (
                <div key={item} className="flex gap-3 rounded-3xl border border-white/10 bg-white/5 p-4">
                  <BadgeCheck className="mt-1 h-5 w-5 shrink-0 text-accent" />
                  <p className="text-sm leading-7 text-white/72">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-accent">Napomena o zaštiti podataka</p>
              <p className="mt-3 text-sm leading-7 text-white/70">
                Poslani podaci koriste se samo za pregled prijave i komunikaciju vezanu uz uključivanje u flotu za rad preko Uber i Bolt platformi.
              </p>
            </div>
          </div>
          <ApplicationForm />
        </div>
      </Container>
    </section>
  );
}

export function HomeNavigationSection() {
  const pages = [
    {
      title: "Kako radi",
      description: "Detaljan pregled koraka od prijave do uključivanja u flotu.",
      href: "/kako-radi",
    },
    {
      title: "Rad kroz flotu",
      description: "Prednosti rada kroz TAXI FLOTA, tjedna isplata i podrška.",
      href: "/rad-kroz-flotu",
    },
    {
      title: "Najam vozila",
      description: "Tjedni i dnevni najam vozila u Zagrebu, s jasnim cijenama.",
      href: "/najam-vozila",
    },
    {
      title: "Prijava",
      description: "Zasebna stranica za kompletnu online prijavu s uploadom dokumenata.",
      href: "/prijava",
    },
  ];

  return (
    <section className="bg-white py-20 text-black sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Pregled stranica"
          title="Svaki važan dio procesa dostupan je i kao zasebna stranica"
          description="Početna stranica daje pregled, a svaka tema ima svoj prostor za detaljnije informacije i bolju preglednost."
        />
        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {pages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="rounded-[1.8rem] border border-black/10 bg-[#f7f7f7] p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-accent"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accentDark">Stranica</p>
              <h3 className="mt-4 text-2xl font-semibold">{page.title}</h3>
              <p className="mt-3 text-sm leading-7 text-black/65">{page.description}</p>
              <p className="mt-6 text-sm font-semibold text-black">Otvori stranicu</p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function BlogPreviewSection() {
  return (
    <section className="bg-[#eef2ee] py-20 text-black sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Blog"
          title="Korisni tekstovi za vozače i kandidate"
          description="Dodali smo blog kako bi stranica imala više korisnog sadržaja, bolji SEO i jasnije informacije za nove vozače."
        />
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="rounded-[1.8rem] border border-black/10 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-accent"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accentDark">{post.category}</p>
              <h3 className="mt-4 text-2xl font-semibold">{post.title}</h3>
              <p className="mt-3 text-sm leading-7 text-black/65">{post.excerpt}</p>
              <p className="mt-5 text-xs font-medium uppercase tracking-[0.18em] text-black/45">
                {post.date} · {post.readTime}
              </p>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <ButtonLink href="/blog">Pogledaj sve blogove</ButtonLink>
        </div>
      </Container>
    </section>
  );
}

export function ContactSection() {
  return (
    <section id="kontakt" className="bg-[#111111] py-20 text-white sm:py-24">
      <Container className="grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-end">
        <div>
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            Kontakt
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            Trebaš dodatnu informaciju prije prijave?
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">
            Ako želiš provjeriti osnovne uvjete, raspoloživost najma vozila ili način prijave, javi nam se i odgovorit ćemo u najkraćem mogućem roku.
          </p>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-soft">
          <p className="text-sm uppercase tracking-[0.24em] text-white/45">TAXI FLOTA</p>
          <div className="mt-6 space-y-4 text-sm leading-7 text-white/75">
            <p>
              <span className="font-semibold text-white">Email:</span> {siteConfig.email}
            </p>
            <p>
              <span className="font-semibold text-white">Mobitel:</span> {siteConfig.phone}
            </p>
            <p>
              <span className="font-semibold text-white">Grad:</span> {siteConfig.city}
            </p>
            <p className="flex items-center gap-2">
              <MapPinned className="h-4 w-4 text-accent" />
              Prijave i onboarding za rad preko Uber i Bolt platformi
            </p>
          </div>
          <div className="mt-6 rounded-3xl border border-accent/20 bg-accent/10 p-4 text-sm leading-7 text-white/80">
            Odgovaramo na upite vezane uz prijavu, onboarding, taxi ispit, taxi kartice i mogućnosti rada kroz našu flotu.
          </div>
        </div>
      </Container>
    </section>
  );
}
