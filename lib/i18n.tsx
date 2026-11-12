"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type Locale = "hr" | "en";

const translations = {
  hr: {
    apply: "Zatraži poziv",
    nav: ["Početna", "Kako radi", "Naše usluge", "Najam vozila"],

    ticker: [
      "✓ Primamo nove vozače",
      "✓ Zovemo te isti dan",
      "✓ Širok izbor vozila za najam od 150 EUR",
      "✓ Besplatna konzultacija",
      "✓ Rad kroz Uber i Bolt",
      "✓ Podrška kroz cijeli onboarding",
    ],

    hero_eyebrow: "Besplatna konzultacija",
    hero_h1a: "Postani dio naše flote.",
    hero_h1b: "Voziš kada hoćeš,",
    hero_h1c: "zarađuješ odmah.",
    hero_desc: "FleetHub je flota koja direktno prima nove vozače za rad na Uber i Bolt platformama. Vodimo te kroz cijeli proces — od prvog poziva do prvog radnog dana.",
    hero_desc_bold: "",
    hero_earnings_pre: "Besplatna konzultacija —",
    hero_earnings_post: "zatraži poziv danas",
    hero_cta1: "Zatraži poziv",
    hero_cta2: "Pogledaj vozila",
    hero_form_note: "Nazovemo te isti dan, bez obveze.",
    hero_badges: ["✓ Primamo nove vozače", "✓ Zovemo te isti dan", "✓ Najam od 150 EUR/tjedno, bez pologa"],
    hero_float1a: "Brz odgovor",
    hero_float1b: "Isti dan",
    hero_float2a: "Dostupno u",
    hero_float2b: "više gradova",

    stats: [
      { suffix: "h", prefix: "<", label: "Zovemo te isti dan" },
      { suffix: "★", label: "Zadovoljstvo klijenata" },
      { suffix: "+ vozila", label: "Dostupnih za najam" },
    ],

    test_eyebrow: "Iskustva vozača",
    test_title: "Što kažu vozači koji su prošli kroz nas",
    test_desc: "Pravi vozači, pravi rezultati. Svaki tjedan nam se obraćaju novi kandidati.",
    test_social1: "Novi upiti stižu svaki dan",
    test_social2: "Uz naš servis — ",
    test_social2b: "krećeš bez stresa",
    test_social3: "Ocjena klijenata: ",
    testimonials: [
      { name: "Marko K.", role: "Vozač · Zagreb", text: "Ostavio sam broj, brzo su me nazvali i sve je krenulo glatko. Vozim već tri tjedna, isplata stiže uredno, nema petljanja.", stars: 5, initial: "M" },
      { name: "Ivan P.", role: "Vozač · Zagreb", text: "Nisam imao auto pa sam uzeo najam kroz njih. Radi se, isplata stiže tjedno, i nema iznenađenja. Fino organizirano.", stars: 5, initial: "I" },
      { name: "Tomislav R.", role: "Vozač · Zagreb", text: "Pitao sam par stvari, odgovorili su brzo i konkretno. Sve je bilo transparentno i točno onako kako su rekli.", stars: 5, initial: "T" },
    ],

    how_eyebrow: "Kako funkcionira",
    how_title: "Jednostavan proces od prvog koraka do početka vožnje",
    how_desc: "Ne ispunjavaš duge obrasce — ostaviš ime i broj, a mi te nazovemo i vodimo kroz sve ostale korake.",
    how_info: "Usluga je namijenjena vozačima koji žele raditi na Uber i Bolt platformama kroz našu flotu — s vozilom ili bez.",
    how_step: "Korak",
    steps: [
      { title: "Zatraži poziv", description: "Ostavi ime i broj mobitela — traje manje od minute i ne obvezuje te ni na što." },
      { title: "Nazovemo te", description: "Javljamo se isti dan, odgovaramo na sva pitanja i objasnimo uvjete rada." },
      { title: "Dogovorimo detalje", description: "Zajedno riješimo dokumente i vozilo — vlastito ili najam — i dogovorimo početak rada." },
      { title: "Počinješ voziti", description: "Dogovaramo sve potrebno i uključujemo te u flotu — voziš na Uber i Bolt i zarađuješ odmah." },
    ],

    ben_eyebrow: "Naše usluge",
    ben_title: "Što dobivaš radom kroz FleetHub",
    ben_desc: "Vodimo te kroz cijeli proces — od prvog poziva do prvog dana vožnje. Javi se i dogovorimo sve detalje.",
    benefits: [
      { title: "Podrška kroz onboarding", description: "Pratimo te od prvog poziva do prvog dana vožnje — pomažemo s dokumentacijom i provjeravamo da sve prođe glatko." },
      { title: "Najam vozila od 150 EUR/tjedno", description: "Širok izbor kasko osiguranih vozila novije generacije. Tjedni najam od 150 do 250 EUR — bez pologa, odmah spreman za rad." },
      { title: "Fleksibilni sati", description: "Voziš kada ti odgovara — 4, 6, 8 sati dnevno ili kao dodatan posao. Bez fiksnih smjena, bez pritiska." },
      { title: "Rad kroz Uber i Bolt", description: "Radimo s vozačima na Uber i Bolt platformama. Zatraži poziv i saznaj sve detalje kroz razgovor s nama." },
    ],

    rental_eyebrow: "Najam vozila",
    rental_title: "Širok izbor vozila za najam — od 150 do 250 EUR tjedno.",
    rental_desc: "Imamo veći broj vozila dostupnih za tjedni najam u Zagrebu. Sva su novije generacije, kasko osigurana i odmah spremna za rad na Uber i Bolt platformama.",
    rental_list: [
      "Cijene tjednog najma kreću se od 150 do 250 EUR ovisno o modelu.",
      "Širok izbor vozila — ručni i automatski mjenjač, benzin i dizel.",
      "Za naše vozače najam je bez pologa.",
      "Sva vozila su kasko osigurana, godišta od 2020. do 2025.",
      "Tjedni i dnevni najam, ovisno o potrebi i raspoloživosti.",
      "Najam dogovaramo telefonski — zatraži poziv i predložimo vozilo za tebe.",
    ],
    rental_cta1: "Zatraži poziv za najam",
    rental_cta2: "Pogledaj vozila za najam",
    rental_card_label: "Dostupno odmah",
    rental_card_title: "Najam vozila od 150 EUR tjedno",
    rental_card_items: [
      "Od 150 do 250 EUR tjedno",
      "Bez pologa za naše vozače",
      "Ručni i automatski mjenjač",
      "Kasko osigurana vozila 2020.–2025.",
      "Tjedni i dnevni najam",
    ],

    faq_eyebrow: "Česta pitanja",
    faq_title: "Najčešća pitanja o našim uslugama",
    faq_desc: "Odgovori su kratki i praktični kako bi svaki kandidat odmah znao što može očekivati.",
    faqItems: [
      { question: "Kako početi?", answer: "Zatraži poziv — ostavi ime i broj mobitela i nazvat ćemo te isti dan. Sve ostalo dogovaramo u razgovoru." },
      { question: "Trebam li imati vlastiti auto?", answer: "Ne moraš. Reci nam u razgovoru da nemaš vlastito vozilo i predložit ćemo ti najam iz naše ponude." },
      { question: "Koje dokumente trebam?", answer: "Osobnu iskaznicu, vozačku dozvolu, taxi diplomu i uvjerenje o nekažnjavanju. Ne moraš ništa slati unaprijed — u pozivu ti kažemo točno što treba i kako." },
      { question: "Mogu li voziti samo nekoliko sati dnevno?", answer: "Da. Fleksibilni smo — možeš voziti 4, 6 ili 8 sati dnevno, ili kao dodatan posao. Sve dogovorimo kroz razgovor." },
      { question: "Što ako tek planiram početi?", answer: "Zatraži poziv i reci nam svoju situaciju — objasnit ćemo ti koji su sljedeći koraci." },
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
    contact_desc: "Ako imaš pitanja oko početka rada, dokumentacije, najma vozila ili uvjeta u floti — ostavi broj i nazvat ćemo te. Odgovaramo brzo, bez čekanja.",
    contact_cta_wa: "Zatraži poziv",
    contact_response: "Zovemo te isti dan",
    contact_or: "Kako izgleda poziv",
    contact_points: [
      { title: "Traje par minuta", text: "Kratak razgovor u kojem odgovorimo na sva pitanja." },
      { title: "Bez obveze", text: "Poziv te ne obvezuje ni na što — sam odlučuješ." },
      { title: "Ne trebaš ništa pripremati", text: "Dokumente i vozilo dogovaramo naknadno." },
    ],
    contact_label_phone: "WhatsApp / Mobitel",
    contact_label_email: "Email",
    contact_label_location: "Lokacija",
    contact_location: "Zagreb, Hrvatska",
    contact_cta_online: "Ili se prijavi online",

    footer_desc: "FleetHub je flota koja direktno prima vozače za rad na Uber i Bolt platformama u Hrvatskoj. Zatraži poziv i počni voziti.",
    footer_privacy: "Politika privatnosti",
    footer_legal: "Pravne informacije",

    mobile_cta: "Zatraži poziv",

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
      { title: "Kako radi", description: "Detaljan pregled koraka od prvog poziva do prvog dana vožnje u floti." },
      { title: "Naše usluge", description: "Direktan prijem u flotu, tjedna isplata, najam vozila i podrška." },
      { title: "Najam vozila", description: "Tjedni i dnevni najam vozila u Zagrebu, s jasnim cijenama." },
      { title: "Zatraži poziv", description: "Ostavi ime i broj — nazovemo te i dogovorimo sve detalje." },
    ],
  },

  en: {
    apply: "Request a call",
    nav: ["Home", "How it works", "Our services", "Vehicle rental"],

    ticker: [
      "✓ Accepting new drivers",
      "✓ We call you the same day",
      "✓ Wide vehicle selection from 150 EUR/week",
      "✓ Free consultation",
      "✓ Work via Uber & Bolt",
      "✓ Full onboarding support",
    ],

    hero_eyebrow: "Free consultation",
    hero_h1a: "Join our fleet.",
    hero_h1b: "Drive when you want,",
    hero_h1c: "earn from day one.",
    hero_desc: "FleetHub is a fleet that directly accepts new drivers to work on Uber and Bolt platforms. We guide you through the entire process — from the first call to your first day driving.",
    hero_desc_bold: "",
    hero_earnings_pre: "Free consultation —",
    hero_earnings_post: "request a call today",
    hero_cta1: "Request a call",
    hero_cta2: "View vehicles",
    hero_form_note: "We call you the same day, no obligation.",
    hero_badges: ["✓ Accepting new drivers", "✓ We call you the same day", "✓ Rental from 150 EUR/week, no deposit"],
    hero_float1a: "Fast response",
    hero_float1b: "Same day",
    hero_float2a: "Available in",
    hero_float2b: "multiple cities",

    stats: [
      { suffix: "h", prefix: "<", label: "We call you the same day" },
      { suffix: "★", label: "Client satisfaction" },
      { suffix: "+ cars", label: "Available for rent" },
    ],

    test_eyebrow: "Driver experiences",
    test_title: "What drivers who went through us say",
    test_desc: "Real drivers, real results. New candidates contact us every week.",
    test_social1: "New inquiries arrive every day",
    test_social2: "With our service — ",
    test_social2b: "start without stress",
    test_social3: "Client rating: ",
    testimonials: [
      { name: "Marko K.", role: "Driver · Zagreb", text: "I left my number, they called me quickly and everything went smoothly. I've been driving for three weeks now, payments arrive on time, no hassle.", stars: 5, initial: "M" },
      { name: "Ivan P.", role: "Driver · Zagreb", text: "I didn't have a car so I rented through them. It works, payment arrives weekly, and there are no surprises. Well organized.", stars: 5, initial: "I" },
      { name: "Tomislav R.", role: "Driver · Zagreb", text: "I asked a few things, they responded quickly and to the point. Everything was transparent and exactly as they said.", stars: 5, initial: "T" },
    ],

    how_eyebrow: "How it works",
    how_title: "A simple process from the first step to your first day of driving",
    how_desc: "No long forms — leave your name and number, and we call you and guide you through every remaining step.",
    how_info: "This service is for drivers who want to work on Uber and Bolt platforms through our fleet — with or without their own vehicle.",
    how_step: "Step",
    steps: [
      { title: "Request a call", description: "Leave your name and phone number — it takes less than a minute, with no obligation." },
      { title: "We call you", description: "We get back to you the same day, answer all your questions and explain the terms." },
      { title: "We agree the details", description: "Together we sort out documents and a vehicle — your own or a rental — and agree your start date." },
      { title: "You start driving", description: "We arrange everything needed and onboard you to the fleet — you drive on Uber and Bolt and start earning right away." },
    ],

    ben_eyebrow: "Our services",
    ben_title: "What you get through FleetHub",
    ben_desc: "We guide you through the entire process — from the first call to your first driving day. Request a call and we'll discuss all the details.",
    benefits: [
      { title: "Onboarding support", description: "We follow you from the first call to your first driving day — we help with documents and make sure everything goes smoothly." },
      { title: "Vehicle rental from 150 EUR/week", description: "Wide selection of fully insured, newer generation vehicles. Weekly rental from 150 to 250 EUR — no deposit, ready to work immediately." },
      { title: "Flexible hours", description: "Drive when it suits you — 4, 6, 8 hours a day or as a side job. No fixed shifts, no pressure." },
      { title: "Work via Uber & Bolt", description: "We work with drivers on Uber and Bolt platforms. Request a call and find out all the details through a conversation with us." },
    ],

    rental_eyebrow: "Vehicle rental",
    rental_title: "Don't have your own car? You can still work via Uber and Bolt.",
    rental_desc: "We have cars for weekly and daily rental in Zagreb. All vehicles are newer generation from 2020 to 2025, fully insured and prepared for professional work.",
    rental_list: [
      "Manual models start from 180 EUR per week.",
      "Automatic models start from 200 EUR per week.",
      "We have 20+ vehicles available in Zagreb.",
      "Weekly and daily rentals available depending on need and availability.",
      "All vehicles are fully insured, from the 2020–2025 generation.",
      "If we don't have a free vehicle in our own offer, we try to secure one through verified partners.",
      "Rental is arranged by phone — request a call and we'll suggest a vehicle for you.",
    ],
    rental_cta1: "Request a call about rental",
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
      { question: "How do I start?", answer: "Request a call — leave your name and phone number and we'll call you the same day. Everything else is agreed in the conversation." },
      { question: "Do I need my own car?", answer: "No. Tell us on the call that you don't have your own vehicle and we'll suggest a rental from our offer." },
      { question: "Which documents do I need?", answer: "Your ID, driver's license, taxi diploma and criminal record certificate. You don't need to send anything in advance — on the call we tell you exactly what is needed and how." },
      { question: "Can I drive just a few hours a day?", answer: "Yes. We're flexible — you can drive 4, 6 or 8 hours a day, or as a side job. We work out all the details together." },
      { question: "What if I'm just planning to start?", answer: "Request a call and tell us your situation — we'll explain the next steps." },
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
    contact_desc: "If you have questions about getting started, documents, vehicle rental or working conditions in the fleet — leave your number and we'll call you. We respond quickly, no waiting.",
    contact_cta_wa: "Request a callback",
    contact_response: "We call you the same day",
    contact_or: "What the call looks like",
    contact_points: [
      { title: "Takes a few minutes", text: "A short conversation where we answer all your questions." },
      { title: "No obligation", text: "The call doesn't commit you to anything — you decide." },
      { title: "Nothing to prepare", text: "Documents and vehicle are agreed afterwards." },
    ],
    contact_label_phone: "WhatsApp / Phone",
    contact_label_email: "Email",
    contact_label_location: "Location",
    contact_location: "Zagreb, Croatia",
    contact_cta_online: "Or apply online",

    footer_desc: "FleetHub is a fleet that directly accepts drivers to work on Uber and Bolt platforms in Croatia. Request a call and start driving.",
    footer_privacy: "Privacy policy",
    footer_legal: "Legal information",

    mobile_cta: "Request a call",

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
      { title: "How it works", description: "A detailed overview of the steps from the first call to your first driving day." },
      { title: "Our services", description: "Direct fleet acceptance, weekly payouts, vehicle rental and support." },
      { title: "Vehicle rental", description: "Weekly and daily vehicle rental in Zagreb, with clear pricing." },
      { title: "Request a call", description: "Leave your name and number — we call you and agree all the details." },
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
