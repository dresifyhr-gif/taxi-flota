"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type Locale = "hr" | "en";

const translations = {
  hr: {
    apply: "Prijavi se",
    nav: ["Početna", "Kako radi", "Naše usluge", "Najam vozila", "Blog"],

    ticker: [
      "✓ Primamo nove vozače",
      "✓ Odgovaramo u roku 2h",
      "✓ Širok izbor vozila za najam od 160 EUR",
      "✓ Besplatna konzultacija",
      "✓ Rad kroz Uber i Bolt",
      "✓ Podrška kroz cijeli onboarding",
    ],

    hero_eyebrow: "Besplatna konzultacija",
    hero_h1a: "Postani dio naše flote.",
    hero_h1b: "Voziš kada hoćeš,",
    hero_h1c: "zarađuješ odmah.",
    hero_desc: "FleetHub je flota koja direktno prima nove vozače za rad na Uber i Bolt platformama. Vodimo te kroz cijeli proces — od prijave do prvog radnog dana.",
    hero_desc_bold: "",
    hero_earnings_pre: "Besplatna konzultacija —",
    hero_earnings_post: "prijavi se danas",
    hero_cta1: "Prijavi se odmah",
    hero_cta2: "Zatraži poziv",
    hero_badges: ["✓ Primamo nove vozače", "✓ Odgovaramo u roku 2h", "✓ Najam od 160 EUR/tjedno"],
    hero_float1a: "Brz odgovor",
    hero_float1b: "U roku 2 sata",
    hero_float2a: "Dostupno u",
    hero_float2b: "više gradova",

    stats: [
      { suffix: "h", prefix: "<", label: "Prosječan odgovor" },
      { suffix: "★", label: "Zadovoljstvo klijenata" },
      { suffix: "+ vozila", label: "Dostupnih za najam" },
    ],

    test_eyebrow: "Iskustva vozača",
    test_title: "Što kažu vozači koji su prošli kroz nas",
    test_desc: "Pravi vozači, pravi rezultati. Svaki tjedan nam se obraćaju novi kandidati.",
    test_social1: "Nove prijave stižu svaki dan",
    test_social2: "Uz naš servis — ",
    test_social2b: "krećeš bez stresa",
    test_social3: "Ocjena klijenata: ",
    testimonials: [
      { name: "Marko K.", role: "Vozač · Zagreb", text: "Prijavio sam se, brzo su me kontaktirali i sve je krenulo glatko. Vozim već tri tjedna, isplata stiže uredno, nema petljanja.", stars: 5, initial: "M" },
      { name: "Ivan P.", role: "Vozač · Zagreb", text: "Nisam imao auto pa sam uzeo najam kroz njih. Radi se, isplata stiže tjedno, i nema iznenađenja. Fino organizirano.", stars: 5, initial: "I" },
      { name: "Tomislav R.", role: "Vozač · Zagreb", text: "Pitao sam par stvari, odgovorili su brzo i konkretno. Sve je bilo transparentno i točno onako kako su rekli.", stars: 5, initial: "T" },
    ],

    how_eyebrow: "Kako funkcionira",
    how_title: "Jednostavan proces od prvog koraka do početka vožnje",
    how_desc: "Stranicu smo složili tako da vozač može poslati sve potrebno odmah, a mi preuzimamo brigu o svim ostalim koracima.",
    how_info: "Usluga je namijenjena vozačima koji žele raditi na Uber i Bolt platformama kroz našu flotu — s vozilom ili bez.",
    how_step: "Korak",
    steps: [
      { title: "Ispuni prijavu", description: "Ostavi osnovne podatke i odmah pošalji dokumente kroz sigurnu online prijavu." },
      { title: "Pošalji dokumente", description: "Osobna iskaznica, vozačka dozvola i ostali dokumenti šalju se direktno kroz obrazac." },
      { title: "Pregledamo prijavu", description: "Provjeravamo prijavu i javljamo ti se brzo s potvrdom i sljedećim koracima." },
      { title: "Počinješ voziti", description: "Dogovaramo sve potrebno i uključujemo te u flotu — voziš na Uber i Bolt i zarađuješ odmah." },
    ],

    ben_eyebrow: "Naše usluge",
    ben_title: "Što dobivaš radom kroz FleetHub",
    ben_desc: "Vodimo te kroz cijeli proces — od prijave do prvog dana vožnje. Javi se i dogovorimo sve detalje.",
    benefits: [
      { title: "Podrška kroz onboarding", description: "Pratimo te od prijave do prvog dana vožnje — pomažemo s dokumentacijom i provjeravamo da sve prođe glatko." },
      { title: "Najam vozila od 160 EUR/tjedno", description: "Širok izbor kasko osiguranih vozila novije generacije. Tjedni najam od 160 do 250 EUR — bez pologa, odmah spreman za rad." },
      { title: "Fleksibilni sati", description: "Voziš kada ti odgovara — 4, 6, 8 sati dnevno ili kao dodatan posao. Bez fiksnih smjena, bez pritiska." },
      { title: "Rad kroz Uber i Bolt", description: "Radimo s vozačima na Uber i Bolt platformama. Prijavi se i saznaj sve detalje kroz razgovor s nama." },
    ],

    rental_eyebrow: "Najam vozila",
    rental_title: "Širok izbor vozila za najam — od 160 do 250 EUR tjedno.",
    rental_desc: "Imamo veći broj vozila dostupnih za tjedni najam u Zagrebu. Sva su novije generacije, kasko osigurana i odmah spremna za rad na Uber i Bolt platformama.",
    rental_list: [
      "Cijene tjednog najma kreću se od 160 do 250 EUR ovisno o modelu.",
      "Širok izbor vozila — ručni i automatski mjenjač, benzin i dizel.",
      "Sva vozila su kasko osigurana, godišta od 2020. do 2025.",
      "Tjedni i dnevni najam, ovisno o potrebi i raspoloživosti.",
      "Prijava za najam rješava se kroz isti obrazac kao i prijava za vozače.",
    ],
    rental_cta1: "Prijavi se i dogovori najam",
    rental_cta2: "Pogledaj vozila za najam",
    rental_card_label: "Dostupno odmah",
    rental_card_title: "Najam vozila od 160 EUR tjedno",
    rental_card_items: [
      "Od 160 do 250 EUR tjedno",
      "Širok izbor modela u Zagrebu",
      "Ručni i automatski mjenjač",
      "Kasko osigurana vozila 2020.–2025.",
      "Tjedni i dnevni najam",
    ],

    faq_eyebrow: "Česta pitanja",
    faq_title: "Najčešća pitanja o našim uslugama",
    faq_desc: "Odgovori su kratki i praktični kako bi svaki kandidat odmah znao što može očekivati.",
    faqItems: [
      { question: "Kako se prijaviti?", answer: "Ispuni online prijavu na stranici, pošalji dokumente i mi ćemo te kontaktirati brzo. Cijeli proces je jednostavan i vodi se online." },
      { question: "Trebam li imati vlastiti auto?", answer: "Ne moraš. U prijavi možeš označiti da nemaš vlastito vozilo i razmotrit ćemo opciju najma vozila." },
      { question: "Koje dokumente trebam poslati?", answer: "Za obradu prijave trebamo osobnu iskaznicu, vozačku dozvolu, taxi diplomu, uvjerenje o nekažnjavanju i selfie fotografiju." },
      { question: "Mogu li voziti samo nekoliko sati dnevno?", answer: "Da. Fleksibilni smo — možeš voziti 4, 6 ili 8 sati dnevno, ili kao dodatan posao. Sve dogovorimo kroz razgovor." },
      { question: "Što ako tek planiram početi?", answer: "Prijavi se i u napomeni napiši svoju situaciju — javit ćemo ti se i reći koji su sljedeći koraci." },
      { question: "U kojim gradovima radite?", answer: "Trenutno primamo vozače uglavnom za Zagreb, ali javi nam se bez obzira na grad — gledamo svaki upit." },
    ],

    app_eyebrow: "Prijava",
    app_title: "Pošalji kompletnu prijavu kroz obrazac",
    app_desc: "Sve podatke i dokumente možeš poslati odmah. Podaci se koriste isključivo za obradu tvoje prijave i usmjeravanje prema odgovarajućoj usluzi.",
    app_prepare: "Što trebaš pripremiti",
    app_checklist: [
      "Osnove kontakt podatke: ime, broj mobitela i email.",
      "IBAN za isplatu — broj transakcijskog računa.",
      "Osobnu iskaznicu, vozačku dozvolu i taxi diplomu u JPG, PNG ili PDF formatu.",
      "Uvjerenje o nekažnjavanju i selfie fotografiju za dovršetak prijave.",
      "Napomenu ako nemaš vozilo ili tek planiraš početi — sve ćemo dogovoriti.",
    ],
    app_privacy_title: "Napomena o zaštiti podataka",
    app_privacy_desc: "Poslani podaci koriste se samo za pregled prijave i komunikaciju vezanu uz prijem vozača u FleetHub flotu.",

    contact_eyebrow: "Kontakt",
    contact_title: "Nisi siguran kako početi? Zatraži poziv.",
    contact_desc: "Ako imaš pitanja oko prijave, dokumentacije, najma vozila ili uvjeta rada u floti — piši nam direktno. Odgovaramo brzo, bez čekanja.",
    contact_cta_wa: "Zatraži poziv",
    contact_response: "Odgovaramo u roku od 2 sata radnim danom",
    contact_or: "Ili nas kontaktiraj na",
    contact_label_phone: "WhatsApp / Mobitel",
    contact_label_email: "Email",
    contact_label_location: "Lokacija",
    contact_location: "Zagreb, Hrvatska",
    contact_cta_online: "Ili se prijavi online",

    footer_desc: "FleetHub je flota koja direktno prima vozače za rad na Uber i Bolt platformama u Hrvatskoj. Prijavi se i počni voziti.",
    footer_privacy: "Politika privatnosti",
    footer_legal: "Pravne informacije",

    mobile_cta: "Prijavi se odmah",

    blog_eyebrow: "Blog",
    blog_title: "Korisni tekstovi za vozače i kandidate",
    blog_desc: "Dodali smo blog kako bi stranica imala više korisnog sadržaja, bolji SEO i jasnije informacije za nove vozače.",
    blog_cta: "Pogledaj sve blogove",

    homenav_eyebrow: "Pregled stranica",
    homenav_title: "Svaki važan dio procesa dostupan je i kao zasebna stranica",
    homenav_desc: "Početna stranica daje pregled, a svaka tema ima svoj prostor za detaljnije informacije i bolju preglednost.",
    homenav_label: "Stranica",
    homenav_open: "Otvori stranicu →",
    homenav_pages: [
      { title: "Kako radi", description: "Detaljan pregled koraka od prijave do prvog dana vožnje u floti." },
      { title: "Naše usluge", description: "Direktan prijem u flotu, tjedna isplata, najam vozila i podrška." },
      { title: "Najam vozila", description: "Tjedni i dnevni najam vozila u Zagrebu, s jasnim cijenama." },
      { title: "Prijava", description: "Kompletna online prijava s uploadom dokumenata — brzo i jednostavno." },
    ],
  },

  en: {
    apply: "Apply now",
    nav: ["Home", "How it works", "Our services", "Vehicle rental", "Blog"],

    ticker: [
      "✓ Accepting new drivers",
      "✓ We respond in 2h",
      "✓ Wide vehicle selection from 160 EUR/week",
      "✓ Free consultation",
      "✓ Work via Uber & Bolt",
      "✓ Full onboarding support",
    ],

    hero_eyebrow: "Free consultation",
    hero_h1a: "Join our fleet.",
    hero_h1b: "Drive when you want,",
    hero_h1c: "earn from day one.",
    hero_desc: "FleetHub is a fleet that directly accepts new drivers to work on Uber and Bolt platforms. We guide you through the entire process — from application to your first day driving.",
    hero_desc_bold: "",
    hero_earnings_pre: "Free consultation —",
    hero_earnings_post: "apply today",
    hero_cta1: "Apply now",
    hero_cta2: "Request a callback",
    hero_badges: ["✓ Accepting new drivers", "✓ We respond in 2h", "✓ Rental from 160 EUR/week"],
    hero_float1a: "Fast response",
    hero_float1b: "Within 2 hours",
    hero_float2a: "Available in",
    hero_float2b: "multiple cities",

    stats: [
      { suffix: "h", prefix: "<", label: "Average response" },
      { suffix: "★", label: "Client satisfaction" },
      { suffix: "+ cars", label: "Available for rent" },
    ],

    test_eyebrow: "Driver experiences",
    test_title: "What drivers who went through us say",
    test_desc: "Real drivers, real results. New candidates contact us every week.",
    test_social1: "New applications arrive every day",
    test_social2: "With our service — ",
    test_social2b: "start without stress",
    test_social3: "Client rating: ",
    testimonials: [
      { name: "Marko K.", role: "Driver · Zagreb", text: "I applied, they contacted me quickly and everything went smoothly. I've been driving for three weeks now, payments arrive on time, no hassle.", stars: 5, initial: "M" },
      { name: "Ivan P.", role: "Driver · Zagreb", text: "I didn't have a car so I rented through them. It works, payment arrives weekly, and there are no surprises. Well organized.", stars: 5, initial: "I" },
      { name: "Tomislav R.", role: "Driver · Zagreb", text: "I asked a few things, they responded quickly and to the point. Everything was transparent and exactly as they said.", stars: 5, initial: "T" },
    ],

    how_eyebrow: "How it works",
    how_title: "A simple process from the first step to your first day of driving",
    how_desc: "We designed the page so candidates can submit everything immediately, and we take care of all the remaining steps.",
    how_info: "This service is for drivers who want to work on Uber and Bolt platforms through our fleet — with or without their own vehicle.",
    how_step: "Step",
    steps: [
      { title: "Fill out the application", description: "Leave your basic details and immediately submit documents through our secure online application." },
      { title: "Send documents", description: "Your ID, driver's license and other documents are submitted directly through the form." },
      { title: "We review your application", description: "We check the application and contact you quickly with confirmation and next steps." },
      { title: "You start driving", description: "We arrange everything needed and onboard you to the fleet — you drive on Uber and Bolt and start earning right away." },
    ],

    ben_eyebrow: "Our services",
    ben_title: "What you get through FleetHub",
    ben_desc: "We guide you through the entire process — from application to your first driving day. Apply and we'll discuss all the details.",
    benefits: [
      { title: "Onboarding support", description: "We follow you from application to your first driving day — we help with documents and make sure everything goes smoothly." },
      { title: "Vehicle rental from 160 EUR/week", description: "Wide selection of fully insured, newer generation vehicles. Weekly rental from 160 to 250 EUR — no deposit, ready to work immediately." },
      { title: "Flexible hours", description: "Drive when it suits you — 4, 6, 8 hours a day or as a side job. No fixed shifts, no pressure." },
      { title: "Work via Uber & Bolt", description: "We work with drivers on Uber and Bolt platforms. Apply and find out all the details through a conversation with us." },
    ],

    rental_eyebrow: "Vehicle rental",
    rental_title: "Don't have your own car? You can still apply to work via Uber and Bolt.",
    rental_desc: "We have cars for weekly and daily rental in Zagreb. All vehicles are newer generation from 2020 to 2025, fully insured and prepared for professional work.",
    rental_list: [
      "Manual models start from 180 EUR per week.",
      "Automatic models start from 200 EUR per week.",
      "We have 20+ vehicles available in Zagreb.",
      "Weekly and daily rentals available depending on need and availability.",
      "All vehicles are fully insured, from the 2020–2025 generation.",
      "If we don't have a free vehicle in our own offer, we try to secure one through verified partners.",
      "The rental application and the service application are handled through the same form.",
    ],
    rental_cta1: "Apply for services or rental",
    rental_cta2: "View vehicles for rent",
    rental_card_label: "Option for candidates",
    rental_card_title: "Weekly and daily vehicle rental",
    rental_card_items: [
      "Weekly and daily vehicle rental",
      "20+ vehicles available in Zagreb",
      "Manual from 180 EUR per week",
      "Automatic from 200 EUR per week",
      "Fully insured vehicles 2020–2025",
    ],

    faq_eyebrow: "FAQ",
    faq_title: "Most common questions about our services",
    faq_desc: "Answers are short and practical so every candidate knows what to expect right away.",
    faqItems: [
      { question: "How do I apply?", answer: "Fill out the online application, submit your documents and we'll contact you quickly. The entire process is simple and handled online." },
      { question: "Do I need my own car?", answer: "No. In the application you can indicate you don't have your own vehicle and we'll discuss vehicle rental options." },
      { question: "Which documents do I need to send?", answer: "For application processing we need your ID, driver's license, taxi diploma, criminal record certificate and a selfie photo." },
      { question: "Can I drive just a few hours a day?", answer: "Yes. We're flexible — you can drive 4, 6 or 8 hours a day, or as a side job. We work out all the details together." },
      { question: "What if I'm just planning to start?", answer: "Apply and write your situation in the notes — we'll contact you and tell you the next steps." },
      { question: "Which cities do you operate in?", answer: "We currently work mainly in Zagreb, but contact us regardless of your city — we review every inquiry." },
    ],

    app_eyebrow: "Application",
    app_title: "Submit your complete application through the form",
    app_desc: "You can submit all data and documents immediately. Data is used exclusively for processing your application and directing you to the appropriate service.",
    app_prepare: "What you need to prepare",
    app_checklist: [
      "Basic contact details: name, phone number and email.",
      "IBAN for payment — your bank account number.",
      "ID card, driver's license and taxi diploma in JPG, PNG or PDF format.",
      "Criminal record certificate and selfie photo to complete the application.",
      "A note if you don't have a vehicle or are just planning to start — we'll sort everything out together.",
    ],
    app_privacy_title: "Data protection notice",
    app_privacy_desc: "Submitted data is used only for reviewing the application and communication related to joining the FleetHub fleet.",

    contact_eyebrow: "Contact",
    contact_title: "Not sure how to start? Request a callback.",
    contact_desc: "If you have questions about the application, documents, vehicle rental or working conditions in the fleet — write to us directly. We respond quickly, no waiting.",
    contact_cta_wa: "Request a callback",
    contact_response: "We respond within 2 hours on business days",
    contact_or: "Or contact us at",
    contact_label_phone: "WhatsApp / Phone",
    contact_label_email: "Email",
    contact_label_location: "Location",
    contact_location: "Zagreb, Croatia",
    contact_cta_online: "Or apply online",

    footer_desc: "FleetHub is a fleet that directly accepts drivers to work on Uber and Bolt platforms in Croatia. Apply and start driving.",
    footer_privacy: "Privacy policy",
    footer_legal: "Legal information",

    mobile_cta: "Apply now",

    blog_eyebrow: "Blog",
    blog_title: "Useful articles for drivers and candidates",
    blog_desc: "We added a blog to provide more useful content, better SEO and clearer information for new drivers.",
    blog_cta: "View all posts",

    homenav_eyebrow: "Page overview",
    homenav_title: "Every important part of the process is also available as a separate page",
    homenav_desc: "The homepage gives an overview, and each topic has its own space for more detailed information.",
    homenav_label: "Page",
    homenav_open: "Open page →",
    homenav_pages: [
      { title: "How it works", description: "A detailed overview of the steps from application to your first driving day." },
      { title: "Our services", description: "Direct fleet acceptance, weekly payouts, vehicle rental and support." },
      { title: "Vehicle rental", description: "Weekly and daily vehicle rental in Zagreb, with clear pricing." },
      { title: "Application", description: "Complete online application with document upload — fast and simple." },
    ],
  },
} as const;

export type T = typeof translations.hr;

type LanguageContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: T;
};

const LanguageContext = createContext<LanguageContextType>({
  locale: "hr",
  setLocale: () => {},
  t: translations.hr,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("hr");
  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: translations[locale] as typeof translations.hr }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
