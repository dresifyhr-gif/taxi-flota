export const siteConfig = {
  name: "TAXI FLOTA",
  description:
    "Profesionalna prijava za vozače koji žele raditi preko naše flote na Uber i Bolt platformama u Hrvatskoj, s podrškom, jasnim procesom i opcijom najma vozila.",
  url: "https://www.taxiagregat.hr",
  email: "info@taxiagregat.hr",
  phone: "+385 91 234 5678",
  city: "Zagreb",
  ogImage: "/og-image.png",
  navigation: [
    { label: "Početna", href: "/" },
    { label: "Kako radi", href: "/kako-radi" },
    { label: "Rad kroz flotu", href: "/rad-kroz-flotu" },
    { label: "Najam vozila", href: "/najam-vozila" },
    { label: "Blog", href: "/blog" },
    { label: "Kontakt", href: "/#kontakt" },
  ],
};

export const cities = [
  "Zagreb",
  "Split",
  "Rijeka",
  "Osijek",
  "Zadar",
  "Pula",
  "Karlovac",
  "Varaždin",
  "Slavonski Brod",
  "Dubrovnik",
  "Drugi grad",
];

export const rentalVehicles = [
  {
    slug: "toyota-corolla-hybrid-2021",
    title: "Toyota Corolla Hybrid 2021",
    price: "od 200 EUR / tjedno",
    location: "Zagreb",
    mileage: "128.400 km",
    transmission: "Automatik",
    fuel: "Hibrid",
    description:
      "Pouzdano i štedljivo vozilo novije generacije, kasko osigurano i pripremljeno za tjedni ili dnevni najam kroz TAXI FLOTA flotu.",
    highlights: [
      "Klima i automatski mjenjač",
      "Kasko osiguranje uključeno",
      "Prikladno za gradske vožnje i dulje smjene",
    ],
    image: "/vehicles/toyota-corolla-hybrid.svg",
  },
  {
    slug: "skoda-octavia-2019",
    title: "Škoda Octavia 2020",
    price: "od 180 EUR / tjedno",
    location: "Zagreb",
    mileage: "156.900 km",
    transmission: "Ručni mjenjač",
    fuel: "Dizel",
    description:
      "Prostrano vozilo novije generacije za vozače kojima je važan komfor i stabilan tjedni trošak. Dostupno za tjedni i dnevni najam vozila.",
    highlights: [
      "Velik prtljažni prostor",
      "Saltung model od 180 EUR tjedno",
      "Kasko osigurano vozilo",
    ],
    image: "/vehicles/skoda-octavia.svg",
  },
  {
    slug: "hyundai-ioniq-2020",
    title: "Hyundai Ioniq 2025",
    price: "od 200 EUR / tjedno",
    location: "Zagreb",
    mileage: "109.700 km",
    transmission: "Automatik",
    fuel: "Hibrid",
    description:
      "Moderan i ekonomičan model novije generacije za vozače koji žele uredan i reprezentativan auto za rad kroz flotu, uz kasko osiguranje i jasne uvjete.",
    highlights: [
      "Mirna i udobna vožnja",
      "Automatik od 200 EUR tjedno",
      "Kasko osiguranje i novija generacija",
    ],
    image: "/vehicles/hyundai-ioniq.svg",
  },
];
