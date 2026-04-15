export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  content: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "zasto-je-prednost-voziti-taxi",
    title: "Zašto je prednost voziti taxi kroz flotu",
    excerpt:
      "Taxi posao mnogim vozačima odgovara zbog fleksibilnosti, mogućnosti vlastite organizacije rada i jasnog operativnog modela.",
    date: "15.04.2026.",
    readTime: "4 min čitanja",
    category: "Prednosti posla",
    content: [
      "Jedna od najvećih prednosti taxi posla je fleksibilnost. Vozači često vole to što sami biraju koliko žele raditi i kako će organizirati svoj dan, umjesto da ovise o klasičnom fiksnom rasporedu.",
      "Kroz TAXI FLOTA flotu vozač dobiva podršku, onboarding i pomoć oko dokumentacije, ali i dalje zadržava osjećaj da upravlja svojim tempom rada. Mnogima upravo ta kombinacija samostalnosti i operativne podrške najviše odgovara.",
      "Dodatna prednost je što vozač ne mora nužno imati vlastiti auto. Ako nema vozilo, može se prijaviti i raspitati o taxi najmu ili dnevnom najmu, što ulazak u posao čini jednostavnijim.",
    ],
  },
  {
    slug: "kako-se-prijaviti-za-rad-preko-uber-i-bolt-platformi",
    title: "Kako se prijaviti za rad preko Uber i Bolt platformi kroz flotu",
    excerpt:
      "Kratki vodič za vozače koji žele započeti rad preko naše flote, s objašnjenjem procesa prijave i dokumentacije.",
    date: "15.04.2026.",
    readTime: "4 min čitanja",
    category: "Prijava",
    content: [
      "Ako želiš voziti preko Uber i Bolt platformi kroz TAXI FLOTA flotu, prvi korak je potpuna online prijava. Na prijavnoj stranici ostavljaš osnovne podatke i odmah učitavaš tražene dokumente kako bi obrada mogla krenuti bez zastoja.",
      "Za pregled prijave trebamo osobnu iskaznicu, vozačku dozvolu, taxi diplomu, uvjerenje o nekažnjavanju i selfie fotografiju. Kada je prijava potpuna, naš tim pregledava podatke i javlja se s povratnom informacijom i sljedećim koracima.",
      "Ako kandidat još nije riješio sve formalnosti, upućujemo ga oko taxi ispita, taxi kartica i ostalih koraka koji su potrebni da može raditi i voziti preko naše flote.",
      "Cilj nam je da vozač ne mora slati dokumente kroz više kanala, nego da sve riješi na jednom mjestu. Tako je proces uredniji, brži i lakši za praćenje.",
    ],
  },
  {
    slug: "sto-trebate-znati-o-najmu-taxi-vozila-u-zagrebu",
    title: "Što trebate znati o najmu taxi vozila u Zagrebu",
    excerpt:
      "Pregled najvažnijih informacija o taxi najmu i dnevnom najmu vozila za vozače koji žele krenuti raditi bez vlastitog auta.",
    date: "15.04.2026.",
    readTime: "3 min čitanja",
    category: "Najam vozila",
    content: [
      "Vozači koji nemaju vlastiti auto i dalje se mogu prijaviti za rad kroz TAXI FLOTA flotu. Nudimo tjedni i dnevni najam vozila u Zagrebu, a sva vozila su novije generacije od 2020. do 2025. godine.",
      "Saltung modeli kreću od 180 EUR tjedno, a automatik modeli od 200 EUR tjedno. Sva vozila su kasko osigurana i pripremljena za profesionalan rad.",
      "Ako u određenom trenutku nemamo slobodno vozilo u vlastitoj floti, pokušavamo osigurati auto kroz provjerene partnere kako bi kandidat što prije mogao krenuti s radom.",
    ],
  },
  {
    slug: "zasto-vozaci-biraju-rad-kroz-flotu",
    title: "Zašto vozači biraju rad kroz flotu",
    excerpt:
      "Rad kroz flotu vozačima donosi organiziran proces, tjednu isplatu, pomoć pri administraciji i lakši onboarding.",
    date: "15.04.2026.",
    readTime: "4 min čitanja",
    category: "Rad kroz flotu",
    content: [
      "Vozači često biraju rad kroz flotu zato što žele jasniji operativni model, pomoć pri prijavi i bolju organizaciju početka rada. Umjesto da sami istražuju svaki korak, kroz flotu dobivaju strukturiran proces.",
      "TAXI FLOTA vozačima pomaže oko onboardinga, pregleda dokumentacije i komunikacije tijekom prijave. Osim toga, upućujemo ih oko taxi ispita, taxi kartica i svega ostalog što im je potrebno za rad preko naše flote.",
      "Za mnoge kandidate dodatna vrijednost je i mogućnost da uz prijavu odmah riješe pitanje vozila, bilo kroz vlastitu flotu ili kroz partnersku mrežu.",
    ],
  },
  {
    slug: "kako-organizirati-rad-kao-taxi-vozac",
    title: "Kako organizirati rad kao taxi vozač",
    excerpt:
      "Dobar taxi vozač ne razmišlja samo o vožnji, nego i o tome kako rasporediti vrijeme, odabrati smjene i dugoročno raditi održivo.",
    date: "15.04.2026.",
    readTime: "3 min čitanja",
    category: "Savjeti za vozače",
    content: [
      "Jedna od važnih prednosti rada kroz taxi platforme je to što vozač može bolje prilagoditi posao vlastitom rasporedu. Nekome više odgovaraju jutarnje vožnje, nekome popodne, a nekome vikendi i večernji termini.",
      "Kada vozač zna da sam bira koliko će raditi, lakše planira privatne obaveze i dugoročnije održava stabilan ritam. Zato mnogi vozači kažu da se u ovom poslu osjećaju kao da sami vode svoj radni dan.",
      "Uz podršku flote, administracija i onboarding su lakši, a vozač se može više fokusirati na rad, organizaciju vremena i kvalitetnu uslugu.",
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
