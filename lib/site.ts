export const siteConfig = {
  name: "FleetHub",
  description:
    "Profesionalna prijava za vozače koji žele raditi preko naše flote na Uber i Bolt platformama u Hrvatskoj, s podrškom, jasnim procesom i opcijom najma vozila.",
  url: "https://flota-hr.com",
  email: "fleethub.hr@gmail.com",
  phone: "+385 99 872 2516",
  whatsapp: "385998722516",
  whatsappMessage: "Zdravo%2C%20zanima%20me%20va%C5%A1a%20usluga%20na%20FleetHub-u.",
  city: "Zagreb",
  ogImage: "/og-image.png",
  navigation: [
    { label: "Početna", href: "/" },
    { label: "Kako radi", href: "/kako-radi" },
    { label: "Naše usluge", href: "/rad-kroz-flotu" },
    { label: "Najam vozila", href: "/najam-vozila" },
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
    slug: "vw-taigo-2023",
    title: "VW Taigo 2023",
    price: "od 170 EUR / tjedno",
    location: "Zagreb",
    transmission: "Ručni mjenjač",
    fuel: "Benzin",
    description:
      "Moderan i kompaktan SUV novije generacije, spreman za svakodnevni rad kroz našu flotu. Bez pologa.",
    highlights: [
      "Benzin, ručni mjenjač",
      "170 EUR tjedno, bez pologa",
      "Kasko osiguranje uključeno",
    ],
    image: "/vehicles/vw-taigo-2023.jpg",
  },
  {
    slug: "mercedes-b-2020",
    title: "Mercedes B 180d 2020",
    price: "od 250 EUR / tjedno",
    location: "Zagreb",
    transmission: "Automatik",
    fuel: "Dizel",
    description:
      "Premijum vozilo novije generacije s automatskim mjenjačem, idealno za ugodan i reprezentativan rad na Uber i Bolt platformama. Bez pologa.",
    highlights: [
      "Dizel, automatik",
      "250 EUR tjedno, bez pologa",
      "Kasko osiguranje uključeno",
    ],
    image: "/vehicles/mercedes-b-2020.jpg",
  },
  {
    slug: "vw-passat-2018",
    title: "VW Passat 2018",
    price: "od 190 EUR / tjedno",
    location: "Zagreb",
    transmission: "Automatik",
    fuel: "Dizel",
    description:
      "Prostrani i pouzdani sedan s automatskim mjenjačem, pogodan za dulje smjene i komfornu vožnju putnika. Bez pologa.",
    highlights: [
      "Dizel 2.0, automatik",
      "190 EUR tjedno, bez pologa",
      "Kasko osiguranje uključeno",
    ],
    image: "/vehicles/vw-passat-2018.jpg",
  },
  {
    slug: "vw-tcross-2023",
    title: "VW T-Cross 2023",
    price: "od 160 EUR / tjedno",
    location: "Zagreb",
    transmission: "Ručni mjenjač",
    fuel: "Benzin",
    description:
      "Kompaktan i moderan crossover novije generacije, odličan za gradsku vožnju i svakodnevni rad kroz flotu. Bez pologa.",
    highlights: [
      "Benzin, ručni mjenjač",
      "160 EUR tjedno, bez pologa",
      "Kasko osiguranje uključeno",
    ],
    image: "/vehicles/vw-tcross-2023.jpg",
  },
  {
    slug: "vw-passat-2021",
    title: "VW Passat 2021",
    price: "od 220 EUR / tjedno",
    location: "Zagreb",
    transmission: "Automatik",
    fuel: "Dizel",
    description:
      "Noviji Passat u bijeloj boji, automatski mjenjač i dizel motor — pouzdan izbor za profesionalne vozače koji traže komfor i ekonomičnost. Bez pologa.",
    highlights: [
      "Dizel, automatik",
      "220 EUR tjedno, bez pologa",
      "Kasko osiguranje uključeno",
    ],
    image: "/vehicles/vw-passat-2021.jpg",
  },
];
